from fastapi import FastAPI

def create_app() -> FastAPI:
    app = FastAPI(title="Ecomm")
    return app

app = create_app()

@app.get("/")
def read_root():
    return {"message": "FastApi backend"}
