import httpx
import logging
from typing import Any, Optional
from tenacity import retry, stop_after_attempt, wait_exponential
from app.services.publishers.base import BasePublisher

logger = logging.getLogger(__name__)

class FacebookPublisher(BasePublisher):
    """
    Xử lý giao tiếp với Meta Graph API cho Facebook Page.
    Có tích hợp Tenacity để retry khi gặp lỗi tạm thời (Network, Rate Limit).
    """

    def __init__(self) -> None:
        self.base_url = "https://graph.facebook.com/v20.0"

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10), reraise=True)
    async def _execute_request_async(self, url: str, payload: dict[str, str]) -> httpx.Response:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=payload)
            if response.status_code in [429, 500, 502, 503, 504]:
                raise Exception(f"Transient error {response.status_code} from FB API")
            return response

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10), reraise=True)
    def _execute_request_sync(self, url: str, payload: dict[str, str]) -> httpx.Response:
        with httpx.Client() as client:
            response = client.post(url, data=payload)
            if response.status_code in [429, 500, 502, 503, 504]:
                raise Exception(f"Transient error {response.status_code} from FB API")
            return response

    async def post_to_page(
        self,
        page_id: str,
        access_token: str,
        message: str,
        media_url: Optional[str] = None,
    ) -> dict[str, Any]:
        try:
            if media_url:
                url = f"{self.base_url}/{page_id}/photos"
                payload: dict[str, str] = {
                    "url": media_url,
                    "message": message,
                    "access_token": access_token,
                }
            else:
                url = f"{self.base_url}/{page_id}/feed"
                payload = {
                    "message": message,
                    "access_token": access_token,
                }

            response = await self._execute_request_async(url, payload)
            response_data: dict[str, Any] = response.json()

            if response.status_code == 200:
                return {"success": True, "data": response_data}
            else:
                logger.error(f"FB API Error: {response_data}")
                return {"success": False, "error": response_data}
        except Exception as e:
            logger.exception("Failed to connect to Facebook Graph API")
            return {"success": False, "error": str(e)}

    def post_to_page_sync(
        self,
        page_id: str,
        access_token: str,
        message: str,
        media_url: Optional[str] = None,
    ) -> dict[str, Any]:
        try:
            if media_url:
                url = f"{self.base_url}/{page_id}/photos"
                payload: dict[str, str] = {
                    "url": media_url,
                    "message": message,
                    "access_token": access_token,
                }
            else:
                url = f"{self.base_url}/{page_id}/feed"
                payload = {
                    "message": message,
                    "access_token": access_token,
                }

            response = self._execute_request_sync(url, payload)
            response_data: dict[str, Any] = response.json()

            if response.status_code == 200:
                return {"success": True, "data": response_data}
            else:
                logger.error(f"FB API Sync Error: {response_data}")
                return {"success": False, "error": response_data}
        except Exception as e:
            logger.exception("Failed to connect to Facebook Graph API (Sync)")
            return {"success": False, "error": str(e)}

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10), reraise=True)
    async def get_page_info(
        self, page_id: str, access_token: str
    ) -> dict[str, Any]:
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/{page_id}"
                params: dict[str, str] = {
                    "fields": "id,name,picture,followers_count",
                    "access_token": access_token,
                }
                response = await client.get(url, params=params)
                
                if response.status_code in [429, 500, 502, 503, 504]:
                    raise Exception(f"Transient error {response.status_code} from FB API")
                    
                response_data: dict[str, Any] = response.json()
                if response.status_code == 200:
                    return {"success": True, "data": response_data}
                return {"success": False, "error": response_data}
        except Exception as e:
            # We don't want to swallow exceptions that tenacity is catching before max attempts
            if "Transient error" in str(e):
                raise
            return {"success": False, "error": str(e)}

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10), reraise=True)
    def get_post_analytics_sync(
        self, post_id: str, access_token: str
    ) -> dict[str, Any]:
        try:
            with httpx.Client() as client:
                url = f"{self.base_url}/{post_id}/insights"
                params: dict[str, str] = {
                    "metric": "post_impressions_unique,post_engaged_users",
                    "access_token": access_token,
                }
                response = client.get(url, params=params)
                
                if response.status_code in [429, 500, 502, 503, 504]:
                    raise Exception(f"Transient error {response.status_code} from FB API")
                    
                response_data: dict[str, Any] = response.json()
                if response.status_code == 200:
                    metrics = {}
                    for item in response_data.get("data", []):
                        if item["name"] == "post_impressions_unique":
                            metrics["reach"] = item["values"][0]["value"]
                        elif item["name"] == "post_engaged_users":
                            metrics["engagement"] = item["values"][0]["value"]
                    return {"success": True, "data": metrics}
                return {"success": False, "error": response_data}
        except Exception as e:
            if "Transient error" in str(e):
                raise
            return {"success": False, "error": str(e)}
