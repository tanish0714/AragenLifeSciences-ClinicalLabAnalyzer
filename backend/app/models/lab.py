from pydantic import BaseModel, Field, field_validator


class LabResult(BaseModel):
    test_name: str = Field(..., min_length=1, max_length=100)
    value: float = Field(..., description="Numeric laboratory result")
    unit: str = Field(..., min_length=1, max_length=30)

    @field_validator("test_name", "unit")
    @classmethod
    def validate_text_fields(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Field cannot be empty.")

        return value


class LabAnalysisRequest(BaseModel):
    results: list[LabResult] = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Laboratory results to analyze",
    )