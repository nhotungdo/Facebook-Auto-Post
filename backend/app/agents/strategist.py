# pyrefly: ignore [missing-import]
from openai import OpenAI
from typing import Optional
from app.core.config import settings


def _get_openai_client() -> OpenAI:
    return OpenAI(api_key=settings.OPENAI_API_KEY)


class AIStrategist:
    """
    Phân tích mục tiêu kinh doanh và đề xuất chiến lược nội dung, lịch đăng.
    """

    def __init__(self):
        # Allow instantiation without error if key is empty during development
        self.client: Optional[OpenAI] = None
        if settings.OPENAI_API_KEY:
            self.client = _get_openai_client()

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
