from typing import Any

from app.ai.gemini import generate_explanation
from app.mcp.client import (
    get_lab_context_from_mcp,
    get_reference_range_from_mcp,
)
from app.models.lab import LabAnalysisRequest
from app.services.classifier import (
    ReferenceRange,
    classify_value,
    format_reference_range,
    get_reference_range,
)
from app.services.router import build_summary, route_results


async def analyze_labs(request: LabAnalysisRequest) -> dict[str, Any]:
    """
    Main laboratory analysis agent.

    Pipeline:
        1. Retrieve reference range through MCP.
        2. Fall back to hardcoded reference data when necessary.
        3. Deterministically classify the laboratory result.
        4. Route results by severity.
        5. Build MCP context.
        6. Generate AI explanation using Gemini.
        7. Return structured results and summary.
    """

    classified_results: list[dict[str, Any]] = []

    # ---------------------------------------------------------
    # STEP 1: Reference lookup + deterministic classification
    # ---------------------------------------------------------
    for lab in request.results:
        try:
            mcp_reference = await get_reference_range_from_mcp(
                lab.test_name
            )
        except Exception as exc:
            raise RuntimeError(
                f"MCP reference lookup failed for {lab.test_name}"
            ) from exc

        # Prefer the Kaggle dataset reference range.
        if (
            mcp_reference.get("found")
            and mcp_reference.get("is_numeric")
            and mcp_reference.get("minimum") is not None
            and mcp_reference.get("maximum") is not None
        ):
            reference_range = ReferenceRange(
                minimum=float(mcp_reference["minimum"]),
                maximum=float(mcp_reference["maximum"]),
                unit=mcp_reference.get("unit") or lab.unit,
            )

            display_reference_range = (
                mcp_reference.get("reference_range")
                or format_reference_range(reference_range)
            )

        # Fallback to hardcoded reference ranges.
        else:
            reference_range = get_reference_range(lab.test_name)

            if reference_range is None:
                raise ValueError(
                    f"No reference range available for test: "
                    f"{lab.test_name}"
                )

            display_reference_range = format_reference_range(
                reference_range
            )

        # Deterministic classification.
        severity, classification = classify_value(
            value=lab.value,
            reference_range=reference_range,
            test_name=lab.test_name,
        )

        classified_results.append(
            {
                "test_name": lab.test_name,
                "value": lab.value,
                "unit": lab.unit,
                "reference_range": display_reference_range,
                "severity": severity,
                "classification": classification,
            }
        )

    # ---------------------------------------------------------
    # STEP 2: Route results
    # Critical → Warning → Normal
    # ---------------------------------------------------------
    routed_results = route_results(classified_results)

    # ---------------------------------------------------------
    # STEP 3: MCP context + Gemini explanation
    # ---------------------------------------------------------
    explained_results: list[dict[str, Any]] = []

    for result in routed_results:
        try:
            # Create structured context through MCP.
            context = await get_lab_context_from_mcp(
                test_name=result["test_name"],
                value=result["value"],
                unit=result["unit"],
                severity=result["severity"],
                classification=result["classification"],
                reference_range=result["reference_range"],
            )

            # Generate explanation using Gemini.
            explanation = await generate_explanation(
                test_name=result["test_name"],
                value=result["value"],
                unit=result["unit"],
                reference_range=result["reference_range"],
                severity=result["severity"],
                classification=result["classification"],
                context=context,
            )

        except Exception as exc:
            raise RuntimeError(
                f"AI analysis failed for {result['test_name']}"
            ) from exc

        explained_results.append(
            {
                **result,
                "explanation": explanation.explanation,
                "next_step": explanation.next_step,
            }
        )

    # ---------------------------------------------------------
    # STEP 4: Build final summary
    # ---------------------------------------------------------
    summary = build_summary(explained_results)

    return {
        "results": explained_results,
        "summary": summary,
    }