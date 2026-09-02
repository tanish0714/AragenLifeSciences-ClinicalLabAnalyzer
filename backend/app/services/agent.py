from app.ai.gemini import generate_explanation
from app.models.lab import LabAnalysisRequest
from app.mcp.client import call_mcp_tool
from app.services.classifier import (
    classify_value,
    format_reference_range,
    get_reference_range,
)
from app.services.router import build_summary, route_results


async def analyze_labs(request: LabAnalysisRequest) -> dict:
    """
    Main Clinical Lab Analysis Agent.

    Pipeline:

        Classify → Route → MCP Context → Explain

    Severity classification is deterministic.
    Gemini is responsible only for explanation and next-step generation.
    """

    classified_results = []

    # ---------------------------------------------------------
    # 1. CLASSIFY
    # ---------------------------------------------------------

    for lab in request.results:
        reference_range = get_reference_range(lab.test_name)

        if reference_range is None:
            classified_results.append(
                {
                    "test_name": lab.test_name,
                    "value": lab.value,
                    "unit": lab.unit,
                    "reference_range": "Not available",
                    "severity": "Warning",
                    "classification": "Reference range unavailable",
                    "explanation": "",
                    "next_step": "",
                }
            )

            continue

        severity, classification = classify_value(
            lab.value,
            reference_range,
            lab.test_name,
        )

        classified_results.append(
            {
                "test_name": lab.test_name,
                "value": lab.value,
                "unit": lab.unit,
                "reference_range": format_reference_range(
                    reference_range
                ),
                "severity": severity,
                "classification": classification,
                "explanation": "",
                "next_step": "",
            }
        )

    # ---------------------------------------------------------
    # 2. ROUTE
    # ---------------------------------------------------------

    routed_results = route_results(classified_results)

    # ---------------------------------------------------------
    # 3. MCP + AI EXPLANATION
    # ---------------------------------------------------------

    explained_results = []

    for result in routed_results:

        # -----------------------------------------------------
        # MCP TOOL: Build structured laboratory context
        # -----------------------------------------------------

        context = await call_mcp_tool(
            "create_lab_context",
            {
                "test_name": result["test_name"],
                "value": result["value"],
                "unit": result["unit"],
                "severity": result["severity"],
                "classification": result["classification"],
                "reference_range": result["reference_range"],
            },
        )

        # -----------------------------------------------------
        # Gemini receives the deterministic result + MCP context
        # -----------------------------------------------------

        ai_result = await generate_explanation(
            test_name=context["test_name"],
            value=context["measured_value"],
            unit=context["unit"],
            reference_range=context["reference_range"],
            severity=context["severity"],
            classification=context["classification"],
        )

        result["explanation"] = ai_result.explanation
        result["next_step"] = ai_result.next_step

        explained_results.append(result)

    # ---------------------------------------------------------
    # 4. SUMMARY
    # ---------------------------------------------------------

    summary = build_summary(explained_results)

    return {
        "results": explained_results,
        "summary": summary,
    }