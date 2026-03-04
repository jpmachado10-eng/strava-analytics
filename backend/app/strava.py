from typing import Any

import httpx
from loguru import logger

from .settings import settings


STRAVA_BASE_URL = "https://www.strava.com/api/v3"


class StravaClient:
    def __init__(self, access_token: str) -> None:
        self.access_token = access_token
        self._client = httpx.AsyncClient(
            base_url=STRAVA_BASE_URL,
            headers={"Authorization": f"Bearer {self.access_token}"},
            timeout=30.0,
        )

    async def get_athlete(self) -> dict[str, Any]:
        resp = await self._client.get("/athlete")
        resp.raise_for_status()
        return resp.json()

    async def get_activities(self, per_page: int = 30, page: int = 1) -> list[dict[str, Any]]:
        params = {"per_page": per_page, "page": page}
        resp = await self._client.get("/athlete/activities", params=params)
        resp.raise_for_status()
        return resp.json()

    async def aclose(self) -> None:
        await self._client.aclose()


async def exchange_code_for_token(code: str) -> dict[str, Any]:
    if not settings.strava_client_id or not settings.strava_client_secret:
        msg = "Strava client credentials are not configured"
        logger.error(msg)
        raise RuntimeError(msg)

    token_url = "https://www.strava.com/oauth/token"
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            token_url,
            data={
                "client_id": settings.strava_client_id,
                "client_secret": settings.strava_client_secret,
                "code": code,
                "grant_type": "authorization_code",
            },
        )
        resp.raise_for_status()
        return resp.json()

