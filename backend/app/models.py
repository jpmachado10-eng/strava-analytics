from datetime import datetime

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    strava_athlete_id: int = Field(index=True, unique=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Activity(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    strava_activity_id: int = Field(index=True, unique=True)
    name: str
    distance_m: float
    moving_time_s: int
    elapsed_time_s: int
    sport_type: str
    start_date: datetime
    elevation_gain_m: float | None = None
    average_heartrate: float | None = None
    max_heartrate: float | None = None

