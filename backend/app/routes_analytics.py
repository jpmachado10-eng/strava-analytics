from typing import Any

from fastapi import APIRouter, HTTPException, Query, status

from .ai_service import ai_service
from .analytics import summary_for_range, weekly_mileage
from .db import DbSessionDep


router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary")
def get_summary(
    db: DbSessionDep,
    user_id: int = Query(..., description="Temporary user identifier"),
    range: str = Query("last_4_weeks", pattern="^last_\\d+_weeks$"),
) -> dict[str, Any]:
    try:
        weeks = int(range.split("_")[1])
    except (IndexError, ValueError):
        weeks = 4
    days = weeks * 7
    return summary_for_range(db, user_id=user_id, days=days)


@router.get("/weekly-mileage")
def get_weekly_mileage(
    db: DbSessionDep,
    user_id: int = Query(..., description="Temporary user identifier"),
    weeks: int = Query(8, ge=1, le=52),
) -> list[dict[str, Any]]:
    return weekly_mileage(db, user_id=user_id, weeks=weeks)


@router.post("/ai-query")
async def ai_query(
    payload: dict[str, Any],
    db: DbSessionDep,
) -> dict[str, Any]:
    question = payload.get("question")
    user_id = payload.get("user_id")
    if not question or not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing question or user_id",
        )

    summary = summary_for_range(db, user_id=user_id)
    mileage = weekly_mileage(db, user_id=user_id)

    user_context = {
        "summary": summary,
        "weekly_mileage": mileage,
    }
    return await ai_service.ask_question(user_context=user_context, question=question)

