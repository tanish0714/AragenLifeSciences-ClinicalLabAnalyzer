import csv
import io

from app.models.lab import LabAnalysisRequest, LabResult


REQUIRED_COLUMNS = {
    "test_name",
    "value",
    "unit",
}


def parse_csv_content(content: bytes) -> LabAnalysisRequest:
    """
    Parse CSV laboratory results into the same Pydantic request
    model used by the JSON /analyze_labs endpoint.

    Expected columns:

        test_name,value,unit

    The parser is intentionally strict so malformed laboratory
    data is rejected before entering the analysis pipeline.
    """

    if not content:
        raise ValueError("CSV file is empty.")

    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise ValueError(
            "CSV file must use UTF-8 encoding."
        ) from exc

    reader = csv.DictReader(io.StringIO(text))

    if not reader.fieldnames:
        raise ValueError(
            "CSV file must contain a header row."
        )

    # Normalize column names.
    columns = {
        column.strip().lower()
        for column in reader.fieldnames
        if column
    }

    missing_columns = REQUIRED_COLUMNS - columns

    if missing_columns:
        raise ValueError(
            "CSV is missing required columns: "
            + ", ".join(sorted(missing_columns))
        )

    results: list[LabResult] = []

    for row_number, row in enumerate(reader, start=2):
        normalized_row = {
            (key.strip().lower() if key else ""): (
                value.strip() if isinstance(value, str) else value
            )
            for key, value in row.items()
        }

        test_name = normalized_row.get("test_name")
        value = normalized_row.get("value")
        unit = normalized_row.get("unit")

        if not test_name:
            raise ValueError(
                f"Row {row_number}: test_name is required."
            )

        if value in (None, ""):
            raise ValueError(
                f"Row {row_number}: value is required."
            )

        if not unit:
            raise ValueError(
                f"Row {row_number}: unit is required."
            )

        try:
            numeric_value = float(value)
        except (TypeError, ValueError) as exc:
            raise ValueError(
                f"Row {row_number}: value must be numeric."
            ) from exc

        results.append(
            LabResult(
                test_name=test_name,
                value=numeric_value,
                unit=unit,
            )
        )

    if not results:
        raise ValueError(
            "CSV file does not contain any laboratory results."
        )

    return LabAnalysisRequest(results=results)