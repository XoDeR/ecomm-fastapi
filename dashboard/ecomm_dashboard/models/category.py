from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=100, unique=True)

    class Meta:
        managed = False
        db_table = "categories"

    def __str__(self) -> str:
        return self.name