from django.db import models
from .order_item import OrderItem

class DownloadLink(models.Model):
    order_item = models.ForeignKey(
        OrderItem,
        on_delete=models.DO_NOTHING,
        db_column="order_item_id",
        related_name="download_links",
    )
    token = models.CharField(max_length=36, unique=True)
    expires_at = models.DateTimeField()
    download_count = models.IntegerField()

    class Meta:
        managed = False
        db_table = "download_links"

    def __str__(self) -> str:
        return self.token