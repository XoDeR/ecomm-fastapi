from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    price: Mapped[int] = mapped_column(Integer) # in cents
    image_url: Mapped[str | None] = mapped_column(String(500))
    file_key: Mapped[str] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(default=True)

