from dataclasses import dataclass


@dataclass(frozen=True)
class ReferenceRange:
    minimum: float
    maximum: float
    unit: str


@dataclass(frozen=True)
class CriticalThreshold:
    minimum: float | None = None
    maximum: float | None = None


# Reference ranges used when the incoming request does not provide
# a reference range directly.
REFERENCE_RANGES: dict[str, ReferenceRange] = {
    "hemoglobin": ReferenceRange(12.0, 16.0, "g/dL"),
    "white blood cell count": ReferenceRange(4.0, 11.0, "x10⁹/L"),
    "platelet count": ReferenceRange(150.0, 450.0, "x10⁹/L"),
    "glucose": ReferenceRange(70.0, 140.0, "mg/dL"),
    "creatinine": ReferenceRange(0.6, 1.2, "mg/dL"),
    "total cholesterol": ReferenceRange(0.0, 200.0, "mg/dL"),
    "hdl cholesterol": ReferenceRange(40.0, 60.0, "mg/dL"),
    "ldl cholesterol": ReferenceRange(0.0, 100.0, "mg/dL"),
    "triglycerides": ReferenceRange(0.0, 150.0, "mg/dL"),
    "alt": ReferenceRange(7.0, 56.0, "U/L"),
    "ast": ReferenceRange(10.0, 40.0, "U/L"),
    "tsh": ReferenceRange(0.4, 4.0, "mIU/L"),
    "vitamin d": ReferenceRange(30.0, 100.0, "ng/mL"),
    "sodium": ReferenceRange(135.0, 145.0, "mEq/L"),
    "potassium": ReferenceRange(3.5, 5.0, "mEq/L"),
}


# Critical thresholds are intentionally explicit and deterministic.
# They are application safety thresholds for this educational/demo
# analyzer and should not be interpreted as clinical diagnosis rules.
CRITICAL_THRESHOLDS: dict[str, CriticalThreshold] = {
    "hemoglobin": CriticalThreshold(minimum=7.0, maximum=18.0),
    "white blood cell count": CriticalThreshold(minimum=2.0, maximum=30.0),
    "platelet count": CriticalThreshold(minimum=50.0, maximum=1000.0),
    "glucose": CriticalThreshold(minimum=50.0, maximum=300.0),
    "creatinine": CriticalThreshold(minimum=0.3, maximum=5.0),
    "total cholesterol": CriticalThreshold(maximum=400.0),
    "hdl cholesterol": CriticalThreshold(minimum=20.0),
    "ldl cholesterol": CriticalThreshold(maximum=190.0),
    "triglycerides": CriticalThreshold(maximum=500.0),
    "alt": CriticalThreshold(maximum=200.0),
    "ast": CriticalThreshold(maximum=200.0),
    "tsh": CriticalThreshold(minimum=0.1, maximum=10.0),
    "vitamin d": CriticalThreshold(minimum=10.0, maximum=150.0),
    "sodium": CriticalThreshold(minimum=125.0, maximum=155.0),
    "potassium": CriticalThreshold(minimum=3.0, maximum=6.0),
}


def normalize_test_name(test_name: str) -> str:
    """Normalize test names for reliable dictionary lookup."""
    return " ".join(test_name.strip().lower().split())


def get_reference_range(test_name: str) -> ReferenceRange | None:
    """Return the configured reference range for a laboratory test."""
    return REFERENCE_RANGES.get(normalize_test_name(test_name))


def get_critical_threshold(test_name: str) -> CriticalThreshold | None:
    """Return the configured critical threshold for a laboratory test."""
    return CRITICAL_THRESHOLDS.get(normalize_test_name(test_name))


def format_reference_range(reference_range: ReferenceRange) -> str:
    """Format a reference range for API/frontend consumption."""
    return (
        f"{reference_range.minimum:g} – "
        f"{reference_range.maximum:g} "
        f"{reference_range.unit}"
    )


def is_critical(value: float, threshold: CriticalThreshold) -> bool:
    """
    Determine whether a value crosses an explicitly configured
    critical threshold.
    """

    if threshold.minimum is not None and value < threshold.minimum:
        return True

    if threshold.maximum is not None and value > threshold.maximum:
        return True

    return False


def classify_value(
    value: float,
    reference_range: ReferenceRange,
    test_name: str,
) -> tuple[str, str]:
    """
    Deterministically classify a laboratory result.

    Classification hierarchy:

    1. Critical
       Value crosses an explicitly configured critical threshold.

    2. Normal
       Value is inside the configured reference range.

    3. Warning
       Value is outside the reference range but does not cross
       the configured critical threshold.
    """

    normalized_name = normalize_test_name(test_name)

    critical_threshold = get_critical_threshold(normalized_name)

    if critical_threshold and is_critical(value, critical_threshold):
        if value < reference_range.minimum:
            return "Critical", "Critically below reference range"

        return "Critical", "Critically above reference range"

    if reference_range.minimum <= value <= reference_range.maximum:
        return "Normal", "Within reference range"

    if value < reference_range.minimum:
        return "Warning", "Below reference range"

    return "Warning", "Above reference range"