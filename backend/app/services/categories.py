from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.schemas.categories import CategoryOut

async def list_categories(session: AsyncSession) -> list[CategoryOut]:
    rows = await session.execute(select(Category).order_by(Category.id))
    return [CategoryOut.model_validate(c) for c in rows.scalars().all()]