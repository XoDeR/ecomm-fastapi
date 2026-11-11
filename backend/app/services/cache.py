import json
import logging

from redis import exceptions as redis_exceptions

CATALOG_TTL = 300  # 5 minutes

logger = logging.getLogger(__name__)


async def get_or_set(redis, key: str, ttl: int, loader):
    """Cache-aside: return the cached value for key; on a miss call loader,
    store its result with ttl and return it.

    redis is an async client (get/set), the cache holds STRINGS.
    loader is an async no-arg function returning something JSON-serializable.

    The cache must never take the site down - fail open: if Redis is
    unavailable we go straight to the loader.
    """
    value = None
    try:
        value = await redis.get(key)
    except redis_exceptions.RedisError:
        logger.warning("redis get failed for key=%s, falling back to loader", key)

    if value is not None:
        return json.loads(value)

    value = await loader()
    try:
        await redis.set(key, json.dumps(value), ex=ttl)
    except redis_exceptions.RedisError:
        logger.warning("redis set failed for key=%s, serving uncached value", key)
    return value


async def invalidate_catalog(redis) -> int:
    """Delete all cache:products:* keys and return how many were removed."""
    keys_to_delete = []
    try:
        async for key in redis.scan_iter(match="cache:products:*"):
            keys_to_delete.append(key)

        if keys_to_delete:
            await redis.delete(*keys_to_delete)
    except redis_exceptions.RedisError:
        logger.warning("redis unavailable, could not invalidate catalog cache")
        return 0
    return len(keys_to_delete)
