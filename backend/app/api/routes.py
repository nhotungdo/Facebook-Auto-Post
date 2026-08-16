# pyrefly: ignore [missing-import]
from fastapi import APIRouter
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

router = APIRouter()


class PostRequest(BaseModel):
    goal: str
    tone: str
    page_id: str


@router.post("/generate-post")
async def generate_post(request: PostRequest):
    # This will call the AI Strategist and Creator
    # For now, it returns a mock response
    content = (
        f"🚀 Đạt mục tiêu: {request.goal} "
        f"với phong cách {request.tone}!\n\nAI đã tạo nội dung này."
    )
    return {
        "status": "success",
        "data": {
            "content": content,
            "suggested_media": [],
        },
    }


class SchedulePostRequest(BaseModel):
    post_id: str
    scheduled_at: str


@router.post("/schedule-post")
async def schedule_post(request: SchedulePostRequest):
    # Update post status and schedule it via Celery
    return {
        "status": "scheduled",
        "post_id": request.post_id,
        "scheduled_at": request.scheduled_at,
    }


@router.get("/facebook/pages")
async def get_facebook_pages():
    # Mocking getting connected FB pages from DB
    return {
        "pages": [
            {"id": "104928392819203", "name": "ABC Store", "connected": True},
            {"id": "593827182938475", "name": "XYZ Brand", "connected": True},
        ]
    }
