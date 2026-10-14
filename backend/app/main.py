from fastapi import FastAPI
from app.api import health

def create_app() -> FastAPI:
    app = FastAPI(title="Ecomm")

    app.include_router(health.router)

    return app

app = create_app()

@app.get("/")
def read_root():
    return {"message": "FastApi backend"}
