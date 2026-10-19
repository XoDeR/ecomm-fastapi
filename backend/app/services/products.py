from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product
from app.models.category import Category
from app.schemas.products import ProductOut

# helper
def _product_out(product: Product, category_slug: str) -> ProductOut:
    return ProductOut(
        id=product.id,
        name=product.name,
        slug=product.slug,
        description=product.description,
        price=product.price,
        image_url=product.image_url,
        category_slug=category_slug,
    )

async def list_products(
    session: AsyncSession,
    category_slug: str | None = None,
    search: str | None = None,
) -> list[ProductOut]:
    stmt = (
        select(Product, Category.slug)
        .join(Category, Product.category_id == Category.id)
        .where(Product.is_active.is_(True))
        .order_by(Product.id)
    )
    if category_slug is not None:
        stmt = stmt.where(Category.slug == category_slug)
    if search is not None:
        escaped = search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        stmt = stmt.where(Product.name.ilike(f"%{escaped}%", escape="\\"))

    rows = await session.execute(stmt)
    return [_product_out(product, slug) for product, slug in rows.all()]


async def get_product(session: AsyncSession, slug: str) -> ProductOut | None:
    stmt = (
        select(Product, Category.slug)
        .join(Category, Product.category_id == Category.id)
        .where(Product.is_active.is_(True), Product.slug == slug)
    )
    row = (await session.execute(stmt)).first()
    if row is None:
        return None
    product, category_slug = row
    return _product_out(product, category_slug)

