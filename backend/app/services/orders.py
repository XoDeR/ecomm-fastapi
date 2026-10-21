from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Order, OrderItem

async def create_order(
    session: AsyncSession,
    user_id: int,
    product_ids: list[int],
) -> tuple[Order, str]:
    pass


async def list_orders(session: AsyncSession, user_id: int) -> list[tuple[Order, list[OrderItem]]]:
    pass


async def get_order(
    session: AsyncSession, user_id: int, order_id: int
) -> tuple[Order, list[OrderItem]] | None:
    pass