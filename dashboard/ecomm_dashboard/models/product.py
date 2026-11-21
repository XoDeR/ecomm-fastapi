from django.db import models
from .category import Category

class Product(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.DO_NOTHING, db_column="category_id", related_name="products"
    )
    name = models.CharField(max_length=200)
    slug = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    price = models.IntegerField()
    image_url = models.CharField(max_length=500, null=True, blank=True)
    file_key = models.CharField(max_length=500)
    is_active = models.BooleanField()

    class Meta:
        managed = False
        db_table = "products"

    def __str__(self) -> str:
        return self.name