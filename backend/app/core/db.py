from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


engine = create_async_engine(get_settings().database_url)
session_factory = async_sessionmaker(engine, expire_on_commit=False)


async def get_session() -> AsyncIterator[AsyncSession]:
    async with session_factory() as session:
        yield session


@asynccontextmanager
async def fresh_session() -> AsyncIterator[AsyncSession]:
    """Session bound to a FRESH engine - meant for Celery tasks.

    Every asyncio.run() inside a task creates a new event loop, while the global
    engine gets bound to the loop of the first task in the process - the second
    task would fail with "Future attached to a different loop". Here the engine
    is created and disposed inside the current loop.
    """
    task_engine = create_async_engine(get_settings().database_url)
    factory = async_sessionmaker(task_engine, expire_on_commit=False)
    try:
        async with factory() as session:
            yield session
    finally:
        await task_engine.dispose()
