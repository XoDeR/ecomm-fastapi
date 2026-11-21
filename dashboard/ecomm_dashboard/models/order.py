from django.db import models
from .shop_user import ShopUser

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        DELIVERED = "delivered", "Delivered"
        FAILED = "failed", "Failed"

    user = models.ForeignKey(
        ShopUser, on_delete=models.DO_NOTHING, db_column="user_id", related_name="orders"
    )
    status = models.CharField(max_length=20, choices=Status.choices)
    total = models.IntegerField()
    provider = models.CharField(max_length=20)
    payment_session_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField()
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "orders"

    def __str__(self) -> str:
        return f"Order #{self.pk}"