import pytest

from app.mcp.client import get_reference_range_from_mcp


@pytest.mark.asyncio
async def test_mcp_dataset_reference_lookup():
    result = await get_reference_range_from_mcp("Ferritin")

    assert result["found"] is True
    assert result["source"] == "kaggle_dataset"
    assert result["reference_range"] == "15-150"
    assert result["minimum"] == 15.0
    assert result["maximum"] == 150.0
    assert result["unit"] == "ug/L"


@pytest.mark.asyncio
async def test_mcp_unknown_test():
    result = await get_reference_range_from_mcp(
        "Definitely Unknown Test"
    )

    assert result["found"] is False