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
async def analyze_lab_results(request: LabAnalysisRequest):
    try:
        return await analyze_labs(request)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        print(f"ANALYSIS RUNTIME ERROR: {exc}")

        raise HTTPException(
            status_code=502,
            detail=(
                "The AI analysis service is temporarily unavailable. "
                "Please try again."
            ),
        ) from exc

    except Exception as exc:
        print(f"UNEXPECTED ANALYSIS ERROR: {type(exc).__name__}: {exc}")

        raise HTTPException(
            status_code=500,
            detail="An unexpected server error occurred.",
        ) from exc


@router.post(
    "/analyze_csv",
    response_model=LabAnalysisResponse,
)
async def analyze_csv(file: UploadFile = File(...)):
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

    except RuntimeError as exc:
        print(f"CSV ANALYSIS RUNTIME ERROR: {exc}")

        raise HTTPException(
            status_code=502,
            detail=(
                "The AI analysis service is temporarily unavailable. "
                "Please try again."
            ),
        ) from exc

    except Exception as exc:
        print(
            f"UNEXPECTED CSV ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="An unexpected server error occurred.",
        ) from exc