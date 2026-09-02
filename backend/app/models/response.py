
from typing import Literal

from pydantic import BaseModel


Severity = Literal[
    "Critical",
    "Warning",
    "Normal",
]


class LabAnalysisResult(BaseModel):
    test_name: str
    value: float
    unit: str

    reference_range: str
    severity: Severity
    classification: str

    explanation: str
    next_step: str


class AnalysisSummary(BaseModel):
    total: int
    critical: int
    warning: int
    normal: int


class LabAnalysisResponse(BaseModel):
    results: list[LabAnalysisResult]
    summary: AnalysisSummary

