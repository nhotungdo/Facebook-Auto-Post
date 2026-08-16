# pyrefly: ignore [missing-import]
from openai import OpenAI
from typing import Optional
from app.core.config import settings


def _get_openai_client() -> OpenAI:
    return OpenAI(api_key=settings.OPENAI_API_KEY)


class AIContentCreator:
    """
    Sinh nội dung bài đăng Facebook dựa trên chiến lược và yêu cầu cụ thể.
    """

    def __init__(self):
        self.client: Optional[OpenAI] = None
        if settings.OPENAI_API_KEY:
            self.client = _get_openai_client()

    def create_post(
        self, goal: str, tone: str, brand_context: str = ""
    ) -> Optional[str]:
        if not self.client:
            return f"Mock Post Content for goal: {goal} with {tone} tone."

        prompt = f"""
        Bạn là một người viết nội dung quảng cáo chuyên nghiệp trên Facebook.
        Mục tiêu bài viết: {goal}
        Giọng văn (Tone): {tone}
        Thông tin thương hiệu (Brand Context): {brand_context}

        Yêu cầu:
        - Hook bắt mắt.
        - Nội dung chính lôi cuốn.
        - Lời kêu gọi hành động (CTA) rõ ràng.
        - Tối đa 3-5 hashtag.
        - Sử dụng emoji phù hợp.
        """
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional social media content creator."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content
