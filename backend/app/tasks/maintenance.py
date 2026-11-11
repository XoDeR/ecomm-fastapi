import asyncio

from app.tasks.celery_app import celery_app

# No bind/retry: these are periodic (beat) tasks - if a run fails,
# the next beat tick simply repeats the work.


@celery_app.task
def expire_pending_orders() -> None:
    from app.core.db import fresh_session
    from app.services.maintenance import expire_stale_pending

    async def _run() -> None:
        async with fresh_session() as session:
            await expire_stale_pending(session)

    asyncio.run(_run())


@celery_app.task
def cleanup_expired_links_task() -> None:
    from app.core.db import fresh_session
    from app.services.maintenance import cleanup_expired_links

    async def _run() -> None:
        async with fresh_session() as session:
            await cleanup_expired_links(session)

    asyncio.run(_run())


@celery_app.task
def check_undelivered_paid() -> None:
    from app.core.db import fresh_session
    from app.services.maintenance import find_undelivered_paid

    async def _run() -> None:
        async with fresh_session() as session:
            await find_undelivered_paid(session)

    asyncio.run(_run())
