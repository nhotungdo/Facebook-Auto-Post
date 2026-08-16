# pyrefly: ignore [missing-import]
from openai import OpenAI
from typing import Optional
from app.core.config import settings


def get_openai_client() -> OpenAI:
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        # Mock client behavior if no key is provided yet
        pass
    return OpenAI(api_key=api_key)


class AIStrategist:
    """
    Phân tích mục tiêu kinh doanh và đề xuất chiến lược nội dung, lịch đăng.
    """

    def __init__(self):
        # Allow instantiation without throwing error if key is empty
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = get_openai_client()

    def generate_strategy(
        self, business_goal: str, target_audience: str
    ) -> Optional[str]:
        if not self.client:
            return f"Mock Strategy for Goal: {business_goal}"

        prompt = f"""
        Bạn là một chuyên gia Marketing (AI Strategist).
        Mục tiêu kinh doanh: {business_goal}
        Đối tượng mục tiêu: {target_audience}

        Hãy đề xuất một chiến lược nội dung gồm:
        1. 3 chủ đề (Content Pillars) nên khai thác.
        2. Tần suất và thời gian đăng bài tốt nhất.
        """
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful Marketing Strategist.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content


class AIContentCreator:
    """
    Sinh nội dung bài đăng Facebook dựa trên chiến lược và yêu cầu cụ thể.
    """

    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = get_openai_client()

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
