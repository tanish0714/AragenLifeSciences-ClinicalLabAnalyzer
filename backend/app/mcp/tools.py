from app.services.classifier import (
    get_reference_range,
    get_critical_threshold,
    format_reference_range,
)


def reference_range_lookup(test_name: str) -> dict:
    """
    MCP tool that looks up the configured reference range
    and critical threshold for a laboratory test.

    This tool is used by the Agent when it needs additional
    laboratory context.
    """

    reference_range = get_reference_range(test_name)

    if reference_range is None:
        return {
            "test_name": test_name,
            "found": False,
            "reference_range": None,
            "unit": None,
            "critical_threshold": None,
            "message": "Reference range not available for this test.",
        }

    critical_threshold = get_critical_threshold(test_name)

    critical_data = None

    if critical_threshold:
        critical_data = {
            "minimum": critical_threshold.minimum,
            "maximum": critical_threshold.maximum,
        }

    return {
        "test_name": test_name,
        "found": True,
        "reference_range": format_reference_range(reference_range),
        "minimum": reference_range.minimum,
        "maximum": reference_range.maximum,
        "unit": reference_range.unit,
        "critical_threshold": critical_data,
    }


def build_lab_context(
    test_name: str,
    value: float,
    unit: str,
    severity: str,
    classification: str,
    reference_range: str,
) -> dict:
    """
    MCP tool that creates a structured context object for the
    explanation agent.

    The LLM receives this context rather than deciding the
    laboratory classification itself.
    """

    return {
        "test_name": test_name,
        "measured_value": value,
        "unit": unit,
        "reference_range": reference_range,
        "severity": severity,
        "classification": classification,
        "clinical_context": (
            "Explain the laboratory result in clear, patient-friendly "
            "language while preserving the deterministic severity "
            "classification supplied by the application."
        ),
    }