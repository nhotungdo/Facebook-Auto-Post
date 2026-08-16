# pyrefly: ignore [missing-import]
from celery import shared_task
import logging
# pyrefly: ignore [missing-import]
import httpx
from datetime import datetime, timezone
from typing import Any, Optional, cast
from typing import TypedDict
from app.agents.content_creator import AIContentCreator
from app.services.facebook import FacebookService
from app.services.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)
fb_service = FacebookService()


class PageInfo(TypedDict, total=False):
    """Thông tin Facebook Page từ Supabase join."""

    page_id: str
    access_token: str


class PostRecord(TypedDict, total=False):
    """Bản ghi bài đăng từ Supabase."""

    id: str
    content: str
    status: str
    scheduled_at: str
    media_urls: list[str]
    facebook_pages: PageInfo
    published_at: str
    facebook_post_id: str
    error_message: str


@shared_task
def generate_ai_content_task(
    post_id: str, goal: str, tone: str
) -> dict[str, str]:
    """
    Task chạy ngầm để gen content bằng AI, tránh làm treo API.
    """
    logger.info(f"Generating content for post {post_id} with goal {goal}")
    try:
        creator = AIContentCreator()
        content: Optional[str] = creator.create_post(goal=goal, tone=tone)

        supabase = get_supabase_client()
        supabase.table("posts").update(
            {"content": content or "", "status": "ready"}
        ).eq("id", post_id).execute()

        return {"status": "success", "post_id": post_id}
    except Exception as e:
        logger.error(f"Error generating content for post {post_id}: {e}")
        return {"status": "error", "post_id": post_id, "error": str(e)}


@shared_task
def check_and_publish_scheduled_posts() -> str:
    """
    Quét DB mỗi phút để tìm các bài tới giờ đăng và đẩy lên FB.
    """
    try:
        supabase = get_supabase_client()
    except ValueError as e:
        logger.warning(f"Supabase not configured, skipping: {e}")
        return "Supabase not configured"

    # Sử dụng UTC-aware datetime để tránh deprecation warning
    now_iso = datetime.now(timezone.utc).isoformat()

    try:
        # Lấy các bài có status 'ready' và scheduled_at <= hiện tại
        response = (
            supabase.table("posts")
            .select("*, facebook_pages(page_id, access_token)")
            .eq("status", "ready")
            .lte("scheduled_at", now_iso)
            .execute()
        )

        posts_to_publish: list[PostRecord] = cast(
            list[PostRecord], response.data or []
        )
        if not posts_to_publish:
            return "No posts to publish"

        for post in posts_to_publish:
            # Chạy hàm publish đồng bộ (dùng httpx sync thay vì asyncio.run)
            _publish_post_sync(post, supabase)

    except Exception as e:
        logger.error(f"Error checking scheduled posts: {e}")

    return "Done"


def _publish_post_sync(post: PostRecord, supabase: Any) -> None:
    """
    Phiên bản đồng bộ của publish_post để tránh xung đột event loop với Celery.
    """
    try:
        raw_page_info: Optional[PageInfo] = post.get("facebook_pages")
        if not raw_page_info:
            raise ValueError("No Facebook page info found for this post")

        page_info: PageInfo = raw_page_info
        page_id: str = page_info.get("page_id") or ""
        access_token: str = page_info.get("access_token") or ""
        base_url = "https://graph.facebook.com/v20.0"

        raw_media_urls: Optional[list[str]] = post.get("media_urls")
        media_url: Optional[str] = (
            raw_media_urls[0] if raw_media_urls else None
        )
        post_content: str = post.get("content") or ""
        post_id: str = post.get("id") or ""

        payload: dict[str, str]
        if media_url:
            url = f"{base_url}/{page_id}/photos"
            payload = {
                "url": media_url,
                "message": post_content,
                "access_token": access_token,
            }
        else:
            url = f"{base_url}/{page_id}/feed"
            payload = {
                "message": post_content,
                "access_token": access_token,
            }

        with httpx.Client() as client:
            http_response = client.post(url, data=payload)

        response_data: dict[str, str] = http_response.json()

        if http_response.status_code == 200:
            supabase.table("posts").update(
                {
                    "status": "published",
                    "published_at": datetime.now(timezone.utc).isoformat(),
                    "facebook_post_id": response_data.get("id", ""),
                }
            ).eq("id", post_id).execute()

            supabase.table("post_logs").insert(
                {
                    "post_id": post_id,
                    "status": "success",
                    "message": "Published successfully to Facebook.",
                }
            ).execute()
        else:
            raise Exception(str(response_data))

    except Exception as e:
        failed_id: str = post.get("id") or "unknown"
        logger.error(f"Failed to publish post {failed_id}: {e}")
        supabase.table("posts").update(
            {"status": "failed", "error_message": str(e)}
        ).eq("id", failed_id).execute()

        supabase.table("post_logs").insert(
            {
                "post_id": failed_id,
                "status": "error",
                "message": str(e),
            }
        ).execute()
