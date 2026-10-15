from functools import lru_cache

from dotenv import find_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=find_dotenv(), extra="ignore")
    
    database_url: str
    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"

@lru_cache
def get_settings() -> Settings:
    return Settings()

