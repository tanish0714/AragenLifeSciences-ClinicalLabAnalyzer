from typing import Any


SEVERITY_PRIORITY = {
    "Critical": 0,
    "Warning": 1,
    "Normal": 2,
}


def route_results(results: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Route and prioritize laboratory results by severity.

    Priority:
    1. Critical
    2. Warning
    3. Normal
    """

    return sorted(
        results,
        key=lambda result: SEVERITY_PRIORITY.get(
            result.get("severity", "Normal"),
            99,
        ),
    )


def build_summary(results: list[dict[str, Any]]) -> dict[str, int]:
    """
    Build aggregate severity counts for the analysis response.
    """

    summary = {
        "total": len(results),
        "critical": 0,
        "warning": 0,
        "normal": 0,
    }

    for result in results:
        severity = result.get("severity", "Normal")

        if severity == "Critical":
            summary["critical"] += 1

        elif severity == "Warning":
            summary["warning"] += 1

        elif severity == "Normal":
            summary["normal"] += 1

    return summary