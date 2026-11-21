from django.db import models

class ShopUser(models.Model):
    email = models.CharField(max_length=320, unique=True)
    password_hash = models.CharField(max_length=128, null=True, blank=True)
    google_id = models.CharField(max_length=64, unique=True, null=True, blank=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "users"

    def __str__(self) -> str:
        return self.email