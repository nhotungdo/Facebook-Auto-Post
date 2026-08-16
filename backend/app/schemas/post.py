from typing import Any
from pydantic import BaseModel


class PostRequest(BaseModel):
    """Schema cho request tạo bài viết bằng AI."""

    goal: str
    tone: str
    page_id: str


class PostResponse(BaseModel):
    """Schema cho response trả về nội dung bài viết."""

    status: str
    data: dict[str, Any]


class SchedulePostRequest(BaseModel):
    """Schema cho request lên lịch đăng bài."""

    post_id: str
    scheduled_at: str


class SchedulePostResponse(BaseModel):
    """Schema cho response xác nhận lịch đăng."""

    status: str
    post_id: str
    scheduled_at: str
