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
    """
    Analyze submitted laboratory results.

    Pipeline:
        Classify → Route → MCP → Gemini Explanation
    """

    try:
        result = await analyze_labs(request)

        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        print(
            f"ANALYSIS RUNTIME ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Analysis runtime error: {exc}",
        ) from exc

    except Exception as exc:
        import traceback

        print(
            f"ANALYSIS ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"{type(exc).__name__}: {exc}",
        ) from exc