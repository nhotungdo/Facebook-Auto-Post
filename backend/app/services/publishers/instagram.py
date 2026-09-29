
import logging
from typing import Any, Optional
from app.services.publishers.base import BasePublisher

logger = logging.getLogger(__name__)


class InstagramPublisher(BasePublisher):
    """
    Xử lý giao tiếp với Meta Graph API cho Instagram.
    Giả định tài khoản IG đã liên kết với FB Page.
    """

    def __init__(self) -> None:
        self.base_url = "https://graph.facebook.com/v20.0"

    async def post_to_page(
        self,
        page_id: str,  # Ở đây page_id thường là ig_user_id
        access_token: str,
        message: str,
        media_url: Optional[str] = None,
    ) -> dict[str, Any]:
        try:
            # Note: IG API flow requires creating a media container then publishing it
            # For simplicity, returning mock success for now as placeholder
            return {"success": True, "data": {"id": "mock_ig_post_id"}}
        except Exception as e:
            logger.exception("Failed to connect to Instagram Graph API")
            return {"success": False, "error": str(e)}

    def post_to_page_sync(
        self,
        page_id: str,
        access_token: str,
        message: str,
        media_url: Optional[str] = None,
    ) -> dict[str, Any]:
        return {"success": True, "data": {"id": "mock_ig_post_id_sync"}}

    async def get_page_info(
        self, page_id: str, access_token: str
    ) -> dict[str, Any]:
        return {
            "success": True,
            "data": {
                "id": page_id,
                "name": "Instagram Account"}}
