import csv
import io

from app.models.lab import LabAnalysisRequest, LabResult


REQUIRED_COLUMNS = {"test_name", "value", "unit"}


def _normalize_header(header: str) -> str:
    return header.strip().lower().replace(" ", "_")


def parse_csv_content(content: bytes) -> LabAnalysisRequest:
    if not content:
        raise ValueError("CSV file is empty.")

    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise ValueError(
            "CSV file must use UTF-8 encoding."
        ) from exc

    if not text.strip():
        raise ValueError("CSV file is empty.")

    reader = csv.DictReader(io.StringIO(text))

    if not reader.fieldnames:
        raise ValueError("CSV file must contain a header row.")

    normalized_headers = {
        _normalize_header(header)
        for header in reader.fieldnames
        if header
    }

    missing_columns = REQUIRED_COLUMNS - normalized_headers

    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(
            f"CSV is missing required columns: {missing}"
        )

    results = []

    for row_number, row in enumerate(reader, start=2):
        normalized_row = {
            _normalize_header(key): value
            for key, value in row.items()
            if key
        }

        test_name = (normalized_row.get("test_name") or "").strip()
        raw_value = (normalized_row.get("value") or "").strip()
        unit = (normalized_row.get("unit") or "").strip()

        if not test_name:
            raise ValueError(
                f"Row {row_number}: test_name cannot be empty."
            )

        if not raw_value:
            raise ValueError(
                f"Row {row_number}: value cannot be empty."
            )

        if not unit:
            raise ValueError(
                f"Row {row_number}: unit cannot be empty."
            )

        try:
            value = float(raw_value)
        except ValueError as exc:
            raise ValueError(
                f"Row {row_number}: value must be numeric."
            ) from exc

        results.append(
            LabResult(
                test_name=test_name,
                value=value,
                unit=unit,
            )
        )

    if not results:
        raise ValueError("CSV contains no laboratory results.")

    return LabAnalysisRequest(results=results)