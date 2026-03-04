from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from loguru import logger
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

from .settings import settings


class Base(DeclarativeBase):
    pass


engine = create_engine(settings.database_url, echo=False, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    except Exception as exc:  # noqa: BLE001
        logger.exception("DB session error: {}", exc)
        raise
    finally:
        db.close()


DbSessionDep = Annotated[Session, Depends(get_db)]

