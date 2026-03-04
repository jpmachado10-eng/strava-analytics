from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import Activity


def summary_for_range(db: Session, user_id: int, days: int = 28) -> dict[str, Any]:
    since = datetime.utcnow() - timedelta(days=days)
    stmt = (
        select(
            func.count(Activity.id),
            func.sum(Activity.distance_m),
            func.sum(Activity.moving_time_s),
            func.sum(Activity.elevation_gain_m),
        )
        .where(Activity.user_id == user_id)
        .where(Activity.start_date >= since)
    )

    count, distance_m, moving_time_s, elevation_gain_m = db.execute(stmt).one()

    return {
        "activity_count": int(count or 0),
        "distance_m": float(distance_m or 0.0),
        "moving_time_s": int(moving_time_s or 0),
        "elevation_gain_m": float(elevation_gain_m or 0.0),
        "since": since.isoformat(),
    }


def weekly_mileage(db: Session, user_id: int, weeks: int = 8) -> list[dict[str, Any]]:
    since = datetime.utcnow() - timedelta(weeks=weeks)
    stmt = (
        select(
            func.date_trunc("week", Activity.start_date).label("week_start"),
            func.sum(Activity.distance_m).label("distance_m"),
        )
        .where(Activity.user_id == user_id)
        .where(Activity.start_date >= since)
        .group_by("week_start")
        .order_by("week_start")
    )

    rows = db.execute(stmt).all()
    return [
        {
            "week_start": row.week_start.isoformat(),
            "distance_m": float(row.distance_m or 0.0),
        }
        for row in rows
    ]

