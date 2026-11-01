from celery import Celery

from app.core.config import get_settings

celery_app = Celery("ecomm-py", broker=get_settings().redis_url)
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_backend=None,
    task_ignore_result=True,
    timezone="UTC",
    broker_transport_options={"health_check_interval": 120},
    broker_connection_retry_on_startup=True,
)


celery_app.conf.beat_schedule = {
    "expire-pending-orders": {
        "task": "app.tasks.maintenance.expire_pending_orders",
        "schedule": 15 * 60,
    },
    "cleanup-expired-links": {
        "task": "app.tasks.maintenance.cleanup_expired_links_task",
        "schedule": 24 * 60 * 60,
    },
    "check-undelivered-paid": {
        "task": "app.tasks.maintenance.check_undelivered_paid",
        "schedule": 10 * 60,
    },
}


@celery_app.task
def ping() -> str:
    return "pong"


