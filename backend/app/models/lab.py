
from pydantic import BaseModel, Field, field_validator


class LabResult(BaseModel):
    test_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Laboratory test name",
    )

    value: float = Field(
        ...,
        description="Measured laboratory value",
    )

    unit: str = Field(
        ...,
        min_length=1,
        max_length=30,
        description="Unit of measurement",
    )

    @field_validator("test_name", "unit")
    @classmethod
    def validate_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Value cannot be empty")

        return value


class LabAnalysisRequest(BaseModel):
    results: list[LabResult] = Field(
        ...,
        min_length=1,
        description="Laboratory results to analyze",
    )

