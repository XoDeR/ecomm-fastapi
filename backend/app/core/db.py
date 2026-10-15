from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings

class Base(DeclarativeBase):
    pass

print(get_settings().database_url)
print(get_settings().frontend_url)

