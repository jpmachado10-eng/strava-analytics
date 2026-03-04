from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .db import DbSessionDep
from .models import User
from .settings import settings
from .strava import exchange_code_for_token


router = APIRouter(prefix="/auth/strava", tags=["auth"])


@router.get("/login")
async def strava_login() -> dict[str, str]:
    if not settings.strava_client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Strava client id not configured",
        )
    authorize_url = (
        "https://www.strava.com/oauth/authorize"
        f"?client_id={settings.strava_client_id}"
        "&response_type=code"
        "&redirect_uri=http://localhost:8000/auth/strava/callback"
        "&approval_prompt=auto"
        "&scope=read,activity:read_all"
    )
    return {"authorize_url": authorize_url}


@router.get("/callback")
async def strava_callback(code: str, db: DbSessionDep) -> dict[str, str]:
    token_data = await exchange_code_for_token(code)
    athlete = token_data.get("athlete") or {}
    athlete_id = athlete.get("id")
    if not athlete_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Strava response",
        )

    user = db.query(User).filter(User.strava_athlete_id == athlete_id).first()
    if not user:
        user = User(strava_athlete_id=athlete_id)
        db.add(user)
        db.commit()
        db.refresh(user)

    # For now, return a simple message; later we will handle tokens and sessions properly.
    return {"message": "Strava account linked", "athlete_id": str(athlete_id)}

