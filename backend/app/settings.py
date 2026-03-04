from functools import lru_cache

from pydantic import AnyUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: AnyUrl
    strava_client_id: str | None = None
    strava_client_secret: str | None = None
    ai_provider: str | None = None
    ai_api_key: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_prefix = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


settings = get_settings()

