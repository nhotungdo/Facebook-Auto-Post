# pyrefly: ignore [missing-import]
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "ai_social_media_agent",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Ho_Chi_Minh",
    enable_utc=True,
    # Example Celery Beat schedule for checking scheduled posts every minute
    beat_schedule={
        "check-scheduled-posts": {
            "task": "app.tasks.tasks.check_and_publish_scheduled_posts",
            "schedule": 60.0,  # Run every 60 seconds
        },
    },
)
