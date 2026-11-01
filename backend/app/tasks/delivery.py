import asyncio

from app.tasks.celery_app import celery_app

@celery_app.task(autoretry_for=(Exception,), max_retries=5, retry_backoff=True)
def deliver_order(order_id: int) -> None:
    from app.core.db import fresh_session
    from app.services.delivery import deliver

    async def _run() -> None:
        async with fresh_session() as session:
            await deliver(session, order_id)

    asyncio.run(_run())