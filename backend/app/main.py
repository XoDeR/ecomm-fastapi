from fastapi import FastAPI
from app.api import health, auth, categories, products, orders

from contextlib import asynccontextmanager

from app.core.db import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()

def create_app() -> FastAPI:
    app = FastAPI(title="Ecomm")

    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(categories.router)
    app.include_router(products.router)
    app.include_router(orders.router)

    return app

app = create_app()

@app.get("/")
def read_root():
    return {"message": "FastApi backend"}
