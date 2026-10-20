import enum
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base

class OrderStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    delivered = "delivered"
    failed = "failed"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    status: Mapped[OrderStatus] = mapped_column(default=OrderStatus.pending)
    total: Mapped[int] = mapped_column(Integer)  # in cents
    provider: Mapped[str] = mapped_column(String(20), default="stripe")
    payment_session_id: Mapped[str | None] = mapped_column(String(255), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))