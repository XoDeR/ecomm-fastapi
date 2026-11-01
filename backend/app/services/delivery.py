import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem
from app.models.download_link import DownloadLink
from app.models.notification import Notification

logger = logging.getLogger(__name__)

LINK_TTL_DAYS = 7

async def deliver(session: AsyncSession, order_id: int) -> None:
    order = await session.get(Order, order_id)
    if order is None:
        logger.warning("deliver: order %s not found", order_id)
        return
    if order.status != OrderStatus.paid:
        logger.warning("deliver: order %s in status %s — skip", order_id, order.status)
        return

    items = (
        (await session.execute(select(OrderItem).where(OrderItem.order_id == order.id)))
        .scalars()
        .all()
    )
    expires_at = datetime.now(UTC) + timedelta(days=LINK_TTL_DAYS)
    links = []
    for item in items:
        link = DownloadLink(order_item_id=item.id, expires_at=expires_at)
        links.append(link)
        session.add(link)
    await session.flush()
    tokens = [link.token for link in links]

    session.add(
        Notification(
            user_id=order.user_id,
            order_id=order.id,
            type="order_delivered",
            payload={"tokens": tokens},
        )
    )
    order.status = OrderStatus.delivered
    await session.commit()
    logger.info("order %s delivered: %d links", order.id, len(tokens))

