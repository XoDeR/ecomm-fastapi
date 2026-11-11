"""Idempotent demo-data seeder.

Run with: uv run python -m scripts.seed
"""

import asyncio

from sqlalchemy import select

from app.core.db import session_factory
from app.core.redis import get_redis_client
from app.models import Category, Product
from app.services.cache import invalidate_catalog

CATEGORIES = [
    {"name": "Audio", "slug": "audio"},
    {"name": "Typography", "slug": "typography"},
    {"name": "Illustrations", "slug": "illustrations"},
]

# (category slug, name, slug, description, price in cents)
PRODUCTS = [
    ("audio", "Lo-Fi Beats Collection", "lofi-beats-collection", "40 chill lo-fi loops and beats", 1599),
    ("audio", "Cinematic Whooshes", "cinematic-whooshes", "Trailer-style transitions and risers", 1099),
    ("audio", "8-Bit Sound Effects", "8-bit-sound-effects", "Retro chiptune SFX for indie games", 699),
    ("typography", "Neon Display Font", "neon-display-font", "Glowing display typeface for posters", 1899),
    ("typography", "Handwritten Script Set", "handwritten-script-set", "Three natural handwriting fonts", 1299),
    ("typography", "Monospace Coding Font", "monospace-coding-font", "Ligature-rich font for code editors", 899),
    ("illustrations", "Isometric City Kit", "isometric-city-kit", "Isometric buildings, roads and props", 2499),
    ("illustrations", "Botanical Line Art", "botanical-line-art", "120 hand-drawn plant illustrations", 1199),
    ("illustrations", "Space Explorer Stickers", "space-explorer-stickers", "Vector astronaut and planet stickers", 599),
]

DEMO_FILE_SLUG = PRODUCTS[0][2]  # only this product has a real file on disk


async def main() -> None:
    async with session_factory() as session:
        slug_to_id: dict[str, int] = {}

        for cat in CATEGORIES:
            existing = await session.scalar(select(Category).where(Category.slug == cat["slug"]))
            if existing is not None:
                print(f"category skipped (exists): {cat['slug']}")
                slug_to_id[cat["slug"]] = existing.id
                continue
            category = Category(name=cat["name"], slug=cat["slug"])
            session.add(category)
            await session.flush()
            slug_to_id[cat["slug"]] = category.id
            print(f"category created: {cat['slug']}")

        for category_slug, name, slug, description, price in PRODUCTS:
            existing = await session.scalar(select(Product).where(Product.slug == slug))
            if existing is not None:
                print(f"product skipped (exists): {slug}")
                continue
            # Only demo.zip exists on disk; the other keys are placeholders
            file_key = "files/demo.zip" if slug == DEMO_FILE_SLUG else f"files/{slug}.zip"
            session.add(
                Product(
                    category_id=slug_to_id[category_slug],
                    name=name,
                    slug=slug,
                    description=description,
                    price=price,
                    image_url=None,
                    file_key=file_key,
                    is_active=True,
                )
            )
            print(f"product created: {slug}")

        await session.commit()

    # Cached catalog pages are stale after seeding
    redis = get_redis_client()
    dropped = await invalidate_catalog(redis)
    print(f"Cache invalidated: {dropped} key(s) dropped.")
    await redis.aclose()

    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(main())
