
from fastapi import APIRouter, HTTPException

from app.models.lab import LabAnalysisRequest
from app.models.response import LabAnalysisResponse
from app.services.agent import analyze_labs


router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "clinical-lab-analyzer",
    }


@router.post(
    "/analyze_labs",
    response_model=LabAnalysisResponse,
)
async def analyze_lab_results(
    request: LabAnalysisRequest,
):
    try:
        return analyze_labs(request)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to analyze laboratory results.",
        ) from exc

