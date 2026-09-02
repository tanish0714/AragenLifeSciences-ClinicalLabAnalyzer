from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.lab import LabAnalysisRequest
from app.models.response import LabAnalysisResponse
from app.services.agent import analyze_labs
from app.services.csv_parser import parse_csv_content


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


@router.post(
    "/analyze_csv",
    response_model=LabAnalysisResponse,
)
async def analyze_csv(
    file: UploadFile = File(...),
):
    """
    Analyze laboratory results uploaded as a CSV file.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="CSV file is required.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported.",
        )

    try:
        content = await file.read()

        request = parse_csv_content(content)

        return await analyze_labs(request)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        import traceback

        print(
            f"CSV ANALYSIS ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"{type(exc).__name__}: {exc}",
        ) from exc