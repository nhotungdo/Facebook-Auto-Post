import httpx
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


class FacebookService:
    """
    Xử lý giao tiếp với Meta Graph API.
    """

    def __init__(self) -> None:
        self.base_url = "https://graph.facebook.com/v20.0"

    async def post_to_page(
        self,
        page_id: str,
        access_token: str,
        message: str,
        media_url: Optional[str] = None,
    ) -> dict[str, Any]:
        """
        Đăng bài (text hoặc kèm 1 hình ảnh) lên Facebook Page.
        """
        try:
            async with httpx.AsyncClient() as client:
                if media_url:
                    # Post with photo
                    url = f"{self.base_url}/{page_id}/photos"
                    payload: dict[str, str] = {
                        "url": media_url,
                        "message": message,
                        "access_token": access_token,
                    }
                else:
                    # Post text only
                    url = f"{self.base_url}/{page_id}/feed"
                    payload = {
                        "message": message,
                        "access_token": access_token,
                    }

                response = await client.post(url, data=payload)
                response_data: dict[str, Any] = response.json()

                if response.status_code == 200:
                    return {"success": True, "data": response_data}
                else:
                    logger.error(f"FB API Error: {response_data}")
                    return {"success": False, "error": response_data}
        except Exception as e:
            logger.exception("Failed to connect to Facebook Graph API")
            return {"success": False, "error": str(e)}

    async def get_page_info(
        self, page_id: str, access_token: str
    ) -> dict[str, Any]:
        """Lấy thông tin cơ bản của Page."""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/{page_id}"
                params: dict[str, str] = {
                    "fields": "id,name,picture,followers_count",
                    "access_token": access_token,
                }
                response = await client.get(url, params=params)
                response_data: dict[str, Any] = response.json()
                if response.status_code == 200:
                    return {"success": True, "data": response_data}
                return {"success": False, "error": response_data}
        except Exception as e:
            return {"success": False, "error": str(e)}
