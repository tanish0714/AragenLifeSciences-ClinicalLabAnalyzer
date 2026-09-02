from app.services.classifier import (
    classify_value,
    get_reference_range,
)


def test_normal_result():
    reference_range = get_reference_range("Hemoglobin")

    assert reference_range is not None

    severity, classification = classify_value(
        value=14,
        reference_range=reference_range,
        test_name="Hemoglobin",
    )

    assert severity == "Normal"
    assert classification == "Within reference range"


def test_warning_result():
    reference_range = get_reference_range("Hemoglobin")

    assert reference_range is not None

    severity, classification = classify_value(
        value=10,
        reference_range=reference_range,
        test_name="Hemoglobin",
    )

    assert severity == "Warning"
    assert classification == "Below reference range"


def test_critical_result():
    reference_range = get_reference_range("Hemoglobin")

    assert reference_range is not None

    severity, classification = classify_value(
        value=5,
        reference_range=reference_range,
        test_name="Hemoglobin",
    )

    assert severity == "Critical"
    assert classification == "Critically below reference range"