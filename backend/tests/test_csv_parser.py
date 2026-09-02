import pytest

from app.services.csv_parser import parse_csv_content


def test_valid_csv():
    csv_content = b"""test_name,value,unit
Hemoglobin,14,g/dL
Ferritin,28.9,ug/L
"""

    request = parse_csv_content(csv_content)

    assert len(request.results) == 2
    assert request.results[0].test_name == "Hemoglobin"
    assert request.results[0].value == 14.0
    assert request.results[1].test_name == "Ferritin"


def test_empty_csv():
    with pytest.raises(ValueError, match="CSV file is empty"):
        parse_csv_content(b"")


def test_missing_required_column():
    csv_content = b"""test_name,value
Hemoglobin,14
"""

    with pytest.raises(ValueError, match="missing required columns"):
        parse_csv_content(csv_content)


def test_non_numeric_value():
    csv_content = b"""test_name,value,unit
Hemoglobin,invalid,g/dL
"""

    with pytest.raises(ValueError, match="value must be numeric"):
        parse_csv_content(csv_content)