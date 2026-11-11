import logging
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Order, OrderStatus

logger = logging.getLogger(__name__)


async def apply_payment(session: AsyncSession, payment_session_id: str) -> Order | None:
    """Idempotent pending -> paid transition for a payment session.

    1. Order not found by payment_session_id: log a warning, return None.
    2. Status is not pending (repeated webhook): log, return None - idempotency.
    3. Otherwise mark the order paid, commit and return it.
    """
    result = await session.execute(
        select(Order).where(Order.payment_session_id == payment_session_id)
    )
    order = result.scalar_one_or_none()

    if order is None:
        logger.warning("Order with payment_session_id %s not found", payment_session_id)
        return None

    if order.status != OrderStatus.pending:
        logger.info("Order %s is not pending (current status: %s)", order.id, order.status)
        return None

    order.status = OrderStatus.paid
    order.paid_at = datetime.now(UTC)
    await session.commit()
    return order
