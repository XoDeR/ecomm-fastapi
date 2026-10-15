from fastapi import FastAPI
from app.api import health, auth

# to remove, test to see if env is parsed correctly
from app.core import db  # noqa: F401  (temporary: triggers the print)

def create_app() -> FastAPI:
    app = FastAPI(title="Ecomm")

    app.include_router(health.router)
    app.include_router(auth.router)

    return app

app = create_app()

@app.get("/")
def read_root():
    return {"message": "FastApi backend"}
