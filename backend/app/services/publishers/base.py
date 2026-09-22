from abc import ABC, abstractmethod
from typing import Any, Optional

class BasePublisher(ABC):
    """
    Abstract Base Class cho các mạng xã hội.
    """

    @abstractmethod
    async def post_to_page(
        self,
        page_id: str,
        access_token: str,
        message: str,
        media_url: Optional[str] = None,
    ) -> dict[str, Any]:
        pass

    @abstractmethod
    def post_to_page_sync(
        self,
        page_id: str,
        access_token: str,
        message: str,
        media_url: Optional[str] = None,
    ) -> dict[str, Any]:
        """Phiên bản đồng bộ dùng cho Celery Tasks."""
        pass

    @abstractmethod
    async def get_page_info(
        self, page_id: str, access_token: str
    ) -> dict[str, Any]:
        pass

    @abstractmethod
    def get_post_analytics_sync(
        self, post_id: str, access_token: str
    ) -> dict[str, Any]:
        pass
