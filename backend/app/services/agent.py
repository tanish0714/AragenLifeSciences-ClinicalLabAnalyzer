from typing import Any

from app.ai.gemini import generate_explanation
from app.mcp.client import get_lab_context_from_mcp, get_reference_range_from_mcp
from app.models.lab import LabAnalysisRequest
from app.services.classifier import (
    ReferenceRange,
    classify_value,
    format_reference_range,
    get_reference_range,
)
from app.services.router import build_summary, route_results


async def analyze_labs(request: LabAnalysisRequest) -> dict[str, Any]:
    classified_results = []

    for lab in request.results:
        # 1. Get reference range through MCP.
        mcp_reference = await get_reference_range_from_mcp(lab.test_name)

        # 2. Prefer the Kaggle dataset reference.
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

        # 3. Fallback to the application's hardcoded reference ranges
        #    if the dataset does not contain the test.
        else:
            reference_range = get_reference_range(lab.test_name)

            if reference_range is None:
                raise ValueError(
                    f"No reference range available for test: {lab.test_name}"
                )

            display_reference_range = format_reference_range(reference_range)

        # 4. Deterministic classification.
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

    # 5. Route: Critical → Warning → Normal.
    routed_results = route_results(classified_results)

    # 6. MCP context + Gemini explanation for every result.
    explained_results = []

    for result in routed_results:
        context = await get_lab_context_from_mcp(
            test_name=result["test_name"],
            value=result["value"],
            unit=result["unit"],
            severity=result["severity"],
            classification=result["classification"],
            reference_range=result["reference_range"],
        )

        explanation = await generate_explanation(
            test_name=result["test_name"],
            value=result["value"],
            unit=result["unit"],
            reference_range=result["reference_range"],
            severity=result["severity"],
            classification=result["classification"],
            context=context,
        )

        explained_results.append(
            {
                **result,
                "explanation": explanation.explanation,
                "next_step": explanation.next_step,
            }
        )

    summary = build_summary(explained_results)

    return {
        "results": explained_results,
        "summary": summary,
    }