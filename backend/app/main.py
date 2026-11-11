from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.api import auth, categories, downloads, health, oauth, orders, products, webhooks
from app.core.config import get_settings
from app.core.db import engine
from app.core.errors import register_error_handlers
from app.core.redis import close_redis_client


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    yield
    await close_redis_client()
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(title="Ecomm", lifespan=lifespan)
    # The ONLY cookie of the project: a short-lived state cookie for the OAuth redirect
    app.add_middleware(SessionMiddleware, secret_key=get_settings().jwt_secret, max_age=300)

    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(oauth.router)
    app.include_router(categories.router)
    app.include_router(products.router)
    app.include_router(orders.router)
    app.include_router(downloads.router)
    app.include_router(webhooks.router)
    register_error_handlers(app)

    # CORS is added LAST so that it becomes the outermost middleware - otherwise
    # CORS headers are missing from error responses and the browser cannot read
    # even a 4xx/5xx answer from another origin.
    # allow_credentials stays off: the frontend authenticates with a Bearer token.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[get_settings().frontend_url],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = create_app()


@app.get("/")
def read_root():
    return {"message": "FastApi backend"}
