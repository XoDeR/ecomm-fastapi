import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DownloadLink, Order, OrderItem, OrderStatus

logger = logging.getLogger(__name__)

PENDING_TTL_HOURS = 1
UNDELIVERED_GRACE_MINUTES = 15
# The Stripe Checkout Session lives exactly PENDING_TTL_HOURS (see
# stripe_provider.create_checkout, expires_at), but the payment webhook can be
# delayed - we add a 15 minute margin so that an already paid order whose
# webhook has not arrived yet is not marked as failed.
PENDING_EXPIRY_GRACE_MINUTES = 15


async def expire_stale_pending(session: AsyncSession, now: datetime | None = None) -> int:
    """Mark old pending orders as failed.

    cutoff = 1h (Stripe session lifetime) + 15 min margin for webhook delay.
    """
    cutoff = (now or datetime.now(UTC)) - timedelta(
        hours=PENDING_TTL_HOURS, minutes=PENDING_EXPIRY_GRACE_MINUTES
    )
    result = await session.execute(
        update(Order)
        .where(Order.status == OrderStatus.pending, Order.created_at < cutoff)
        .values(status=OrderStatus.failed)
    )
    await session.commit()
    count = result.rowcount or 0
    if count:
        logger.info("expire_stale_pending: %d orders expired", count)
    return count


async def cleanup_expired_links(session: AsyncSession, now: datetime | None = None) -> int:
    """Delete expired DownloadLinks (the download endpoint rejects them anyway,
    this only removes garbage)."""
    cutoff = now or datetime.now(UTC)
    result = await session.execute(delete(DownloadLink).where(DownloadLink.expires_at < cutoff))
    await session.commit()
    count = result.rowcount or 0
    if count:
        logger.info("cleanup_expired_links: %d links deleted", count)
    return count


async def find_undelivered_paid(
    session: AsyncSession,
    older_than_minutes: int = UNDELIVERED_GRACE_MINUTES,
    now: datetime | None = None,
) -> list[int]:
    """Find paid orders older than N minutes where no OrderItem has a DownloadLink
    ("paid but not delivered" - monitors broker outages). Only logs a WARNING for now.

    The age is counted from paid_at (payment moment), not created_at - otherwise an
    order created long ago but paid minutes ago would be a false positive.
    Rows without paid_at fall back to created_at.
    """
    cutoff = (now or datetime.now(UTC)) - timedelta(minutes=older_than_minutes)

    delivered_order_ids = select(OrderItem.order_id).join(
        DownloadLink, DownloadLink.order_item_id == OrderItem.id
    )

    result = await session.execute(
        select(Order.id).where(
            Order.status == OrderStatus.paid,
            func.coalesce(Order.paid_at, Order.created_at) < cutoff,
            Order.id.not_in(delivered_order_ids),
        )
    )
    ids = [row[0] for row in result.all()]
    if ids:
        logger.warning("find_undelivered_paid: undelivered paid orders %s", ids)
    return ids
