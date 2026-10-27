from functools import lru_cache

from dotenv import find_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=find_dotenv(), extra="ignore")
    
    database_url: str
    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"

    jwt_secret: str = Field(min_length=16)
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24

    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

@lru_cache
def get_settings() -> Settings:
    return Settings()

