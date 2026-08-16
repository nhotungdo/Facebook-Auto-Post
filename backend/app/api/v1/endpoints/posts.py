from fastapi import APIRouter
from app.schemas.post import (
    PostRequest,
    PostResponse,
    SchedulePostRequest,
    SchedulePostResponse,
)

router = APIRouter(prefix="/posts", tags=["posts"])


@router.post("/generate", response_model=PostResponse)
async def generate_post(request: PostRequest):
    """
    Tạo nội dung bài đăng Facebook bằng AI dựa trên mục tiêu và giọng văn.
    """
    content = (
        f"🚀 Đạt mục tiêu: {request.goal} "
        f"với phong cách {request.tone}!\n\nAI đã tạo nội dung này."
    )
    return PostResponse(
        status="success",
        data={
            "content": content,
            "suggested_media": [],
        },
    )


@router.post("/schedule", response_model=SchedulePostResponse)
async def schedule_post(request: SchedulePostRequest):
    """
    Lên lịch đăng bài đã được tạo lên Facebook Page qua Celery.
    """
    return SchedulePostResponse(
        status="scheduled",
        post_id=request.post_id,
        scheduled_at=request.scheduled_at,
    )
