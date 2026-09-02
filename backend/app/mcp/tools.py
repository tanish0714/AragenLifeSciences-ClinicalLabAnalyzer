from typing import Any

from app.services.classifier import (
    get_critical_threshold,
)
from app.services.dataset_reference import (
    dataset_reference_service,
)


def reference_range_lookup(test_name: str) -> dict[str, Any]:
    """
    MCP tool for laboratory reference-range lookup.

    The Kaggle laboratory dataset is the primary reference source.
    Critical thresholds remain application-controlled so the LLM
    cannot determine severity.
    """

    reference = dataset_reference_service.get_reference(
        test_name
    )

    if reference is None:
        return {
            "test_name": test_name,
            "found": False,
            "source": "dataset",
            "reference_range": None,
            "unit": None,
            "minimum": None,
            "maximum": None,
            "is_numeric": False,
            "critical_threshold": None,
            "message": (
                "Reference range not available for this test."
            ),
        }

    critical_threshold = get_critical_threshold(
        reference["test_name"]
    )

    critical_data = None

    if critical_threshold is not None:
        critical_data = {
            "minimum": critical_threshold.minimum,
            "maximum": critical_threshold.maximum,
        }

    return {
        "test_name": reference["test_name"],
        "found": True,
        "source": "kaggle_dataset",
        "reference_range": reference["reference_range"],
        "unit": reference["unit"],
        "minimum": reference["minimum"],
        "maximum": reference["maximum"],
        "is_numeric": reference["is_numeric"],
        "critical_threshold": critical_data,
    }


def build_lab_context(
    test_name: str,
    value: float,
    unit: str,
    severity: str,
    classification: str,
    reference_range: str,
) -> dict[str, Any]:
    """
    MCP tool that creates structured laboratory context for the
    Gemini explanation layer.
    """

    return {
        "test_name": test_name,
        "measured_value": value,
        "unit": unit,
        "reference_range": reference_range,
        "severity": severity,
        "classification": classification,
        "clinical_context": (
            "Explain the laboratory result in clear, "
            "patient-friendly language while preserving the "
            "deterministic severity classification supplied "
            "by the application."
        ),
    }