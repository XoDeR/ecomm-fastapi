import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base

class DownloadLink(Base):
    __tablename__ = "download_links"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_item_id: Mapped[int] = mapped_column(ForeignKey("order_items.id"))
    token: Mapped[str] = mapped_column(
        String(36), unique=True, index=True, default=lambda: uuid.uuid4().hex
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    download_count: Mapped[int] = mapped_column(Integer, default=0)