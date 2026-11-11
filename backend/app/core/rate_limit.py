import logging
from typing import Annotated

import redis.asyncio as aioredis
from fastapi import Depends, HTTPException, Request, status
from redis import exceptions as redis_exceptions

from app.core.redis import get_redis

logger = logging.getLogger(__name__)


def rate_limit(limit: int = 10, window_sec: int = 60):
    """Dependency factory: fixed-window limiter per client IP and path."""

    async def dependency(
        request: Request,
        redis: Annotated[aioredis.Redis, Depends(get_redis)],
    ) -> None:
        # Clients without an IP share one bucket (accepted for now);
        # behind a proxy X-Forwarded-For handling must be added.
        client_ip = request.client.host if request.client else "unknown"
        key = f"ratelimit:{request.url.path}:{client_ip}"
        # INCR followed by EXPIRE has a tiny race window (a crash in between leaves
        # a key without TTL). Accepted for an MVP; a Lua script would be overkill.
        try:
            count = await redis.incr(key)
            if count == 1:
                await redis.expire(key, window_sec)
            if count > limit:
                ttl = await redis.ttl(key)
                raise HTTPException(
                    status.HTTP_429_TOO_MANY_REQUESTS,
                    "Too many requests",
                    headers={"Retry-After": str(max(ttl, 1))},
                )
        except redis_exceptions.RedisError:
            # Fail open: brute-force protection degrades when Redis is down,
            # fail-closed would take the whole login down with it.
            logger.warning("redis unavailable, allowing request without rate limiting")

    return dependency
