from typing import Any, Optional
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from app.schemas.post import (
    PostRequest,
    PostResponse,
    SchedulePostRequest,
    SchedulePostResponse,
    PublishNowRequest,
    PublishNowResponse,
)
from app.api.deps import get_current_user_id, get_current_user_token
from app.services.supabase_client import get_supabase_client
from app.services.publishers.facebook import FacebookPublisher
from app.core.security import decrypt_token

router = APIRouter(prefix="/posts", tags=["posts"])


@router.post("/generate", response_model=PostResponse)
def generate_post(
    request: PostRequest,
    user_token: str = Depends(get_current_user_token),
    user_id: str = Depends(get_current_user_id),
):
    """
    Tạo nội dung bài đăng Facebook bằng AI sử dụng MultiAgentOrchestrator.
    Đã bao gồm AI Copywriter và AI Reviewer.
    """
    from app.agents.orchestrator import MultiAgentOrchestrator

    orchestrator = MultiAgentOrchestrator()
    # Brand context can be generated from target_audience or keywords if passed
    brand_context = "Tuân thủ chính sách mạng xã hội, không dùng ngôn từ thù ghét."

    content, media_url, status_message = orchestrator.generate_and_review_post(
        goal=request.goal,
        tone=request.tone,
        brand_guidelines=brand_context
    )

    # Note: Orchestrator currently doesn't return usage directly, so we mock or skip it here.
    # In a full implementation, orchestrator should return token usage.

    return PostResponse(
        status="success" if "Success" in status_message else "warning",
        data={
            "content": content,
            "suggested_media": [media_url] if media_url else [],
            "status_message": status_message,
            "usage": None
        },
    )


@router.post("/publish", response_model=PublishNowResponse)
async def publish_post_now(
    request: PublishNowRequest,
    user_token: str = Depends(get_current_user_token),
    user_id: str = Depends(get_current_user_id),
):
    """
    Publish bài viết ngay lập tức lên Facebook Page.
    1. Lấy token của Page từ DB & giải mã.
    2. Gọi Meta Graph API để đẩy bài.
    3. Lưu lại bản ghi post vào DB với status = published.
    """
    supabase = get_supabase_client(user_token)

    try:
        # 1. Fetch page info (DB row id + Facebook page id + encrypted token)
        #    Lọc thêm theo workspace (nếu có) để tránh cross-workspace leak
        page_query = (
            supabase.table("facebook_pages")
            .select("id, page_id, access_token")
            .eq("id", request.page_id)
        )
        if request.workspace_id:
            page_query = page_query.eq("workspace_id", request.workspace_id)
        page_resp = page_query.execute()
        page_data_list = page_resp.data
        if not page_data_list:
            raise HTTPException(status_code=404,
                                detail="Page not found or not connected")

        page_row = page_data_list[0]
        if not isinstance(page_row, dict):
            raise HTTPException(
                status_code=404,
                detail="Invalid page data format")
        fb_page_id: str = str(page_row.get("page_id", ""))
        decrypted_token = decrypt_token(str(page_row.get("access_token", "")))

        # 2. Publish to FB
        publisher = FacebookPublisher()
        fb_result = await publisher.post_to_page(
            page_id=fb_page_id,
            access_token=decrypted_token,
            message=request.content,
            media_url=request.media_url if isinstance(request.media_url, str) else None
        )

        # 3. Save post to DB
        status = "published" if fb_result.get("success") else "failed"
        fb_post_id: Optional[str] = None
        if status == "published" and "data" in fb_result and "id" in fb_result["data"]:
            fb_post_id = fb_result["data"]["id"]

        insert_data: dict[str, Any] = {
            "user_id": user_id,
            # FK -> facebook_pages.id (UUID)
            "page_id": str(page_row.get("id", "")),
            "content": request.content,
            "media_urls": [request.media_url] if isinstance(request.media_url, str) else [],
            "status": status,
        }
        if request.workspace_id:
            insert_data["workspace_id"] = request.workspace_id
        if fb_post_id:
            insert_data["facebook_post_id"] = fb_post_id
        if status == "published":
            insert_data["published_at"] = datetime.now(
                timezone.utc).isoformat()
        if status == "failed":
            insert_data["error_message"] = str(fb_result.get("error"))

        db_post = supabase.table("posts").insert(insert_data).execute()
        db_post_data = db_post.data
        db_post_id = None
        if db_post_data and isinstance(db_post_data[0], dict):
            db_post_id = str(db_post_data[0].get(
                "id")) if db_post_data[0].get("id") else None

        if not fb_result.get("success"):
            return PublishNowResponse(
                status="failed",
                post_id=db_post_id,
                error=str(fb_result.get("error"))
            )

        return PublishNowResponse(
            status="published",
            post_id=db_post_id,
            fb_post_id=fb_post_id
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/schedule", response_model=SchedulePostResponse)
async def schedule_post(
    request: SchedulePostRequest,
    user_token: str = Depends(get_current_user_token),
    user_id: str = Depends(get_current_user_id),
):
    """
    Lưu bài viết vào DB với trạng thái 'ready' và giờ đăng 'scheduled_at'.
    Celery worker sẽ tự động quét và đẩy lên Facebook khi tới giờ.
    """
    supabase = get_supabase_client(user_token)

    try:
        # Verify page exists (page_id sent by frontend is the facebook_pages DB UUID)
        # Lọc thêm theo workspace (nếu có) để tránh cross-workspace leak
        page_query = (
            supabase.table("facebook_pages")
            .select("id")
            .eq("id", request.page_id)
        )
        if request.workspace_id:
            page_query = page_query.eq("workspace_id", request.workspace_id)
        page_resp = page_query.execute()
        page_data_list = page_resp.data
        if not page_data_list:
            raise HTTPException(status_code=404, detail="Page not found")

        page_row = page_data_list[0]
        if not isinstance(page_row, dict):
            raise HTTPException(
                status_code=404,
                detail="Invalid page data format")

        # Save post to DB
        insert_data: dict[str, Any] = {
            "user_id": user_id,
            # FK -> facebook_pages.id (UUID)
            "page_id": str(page_row.get("id", "")),
            "content": request.content,
            "media_urls": [request.media_url] if isinstance(request.media_url, str) else [],
            "status": "ready",
            "scheduled_at": request.scheduled_at,
        }
        if request.workspace_id:
            insert_data["workspace_id"] = request.workspace_id

        db_post = supabase.table("posts").insert(insert_data).execute()

        db_post_data = db_post.data
        db_post_id = "unknown"
        if db_post_data and isinstance(db_post_data[0], dict):
            db_post_id = str(db_post_data[0].get("id", "unknown"))

        return SchedulePostResponse(
            status="scheduled",
            post_id=db_post_id,
            scheduled_at=request.scheduled_at,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
