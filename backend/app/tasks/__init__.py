"""Celery task registration.

Task modules are imported explicitly instead of autodiscover:
autodiscover_tasks only looks for tasks.py and would silently skip
app.tasks.delivery / app.tasks.maintenance.
"""

from app.tasks import (
    delivery,  # noqa: F401
    maintenance,  # noqa: F401
)
