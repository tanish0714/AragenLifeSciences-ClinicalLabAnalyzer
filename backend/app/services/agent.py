
from app.models.lab import LabAnalysisRequest
from app.services.classifier import (
    classify_value,
    format_reference_range,
    get_reference_range,
)
from app.services.router import (
    build_summary,
    route_results,
)


def analyze_labs(
    request: LabAnalysisRequest,
) -> dict:
    """
    Main analysis orchestration.

    Current pipeline:

        Classify → Route

    The Explain stage will be connected to
    Gemini + LangChain through MCP next.
    """

    classified_results = []

    for lab in request.results:
        reference_range = get_reference_range(
            lab.test_name
        )

        if reference_range is None:
            classified_results.append(
                {
                    "test_name": lab.test_name,
                    "value": lab.value,
                    "unit": lab.unit,
                    "reference_range": "Not available",
                    "severity": "Warning",
                    "classification": (
                        "Reference range unavailable"
                    ),
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
                "reference_range": (
                    format_reference_range(
                        reference_range
                    )
                ),
                "severity": severity,
                "classification": classification,
                "explanation": "",
                "next_step": "",
            }
        )

    routed_results = route_results(
        classified_results
    )

    summary = build_summary(
        routed_results
    )

    return {
        "results": routed_results,
        "summary": summary,
    }

