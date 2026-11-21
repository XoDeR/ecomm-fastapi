from django.db import models
from .order import Order
from .product import Product

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.DO_NOTHING, db_column="order_id", related_name="items"
    )
    product = models.ForeignKey(
        Product, on_delete=models.DO_NOTHING, db_column="product_id", related_name="order_items"
    )
    price_at_purchase = models.IntegerField()

    class Meta:
        managed = False
        db_table = "order_items"

    def __str__(self) -> str:
        return f"OrderItem #{self.pk}"