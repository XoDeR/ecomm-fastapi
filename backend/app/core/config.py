from functools import lru_cache

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"

@lru_cache
def get_settings() -> Settings:
    return Settings()

