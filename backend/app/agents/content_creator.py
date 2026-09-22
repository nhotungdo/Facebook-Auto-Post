# pyrefly: ignore [missing-import]
from openai import OpenAI
from typing import Optional
from app.core.config import settings


def _get_openai_client() -> OpenAI:
    return OpenAI(
        api_key=settings.GROQ_API_KEY, 
        base_url="https://api.groq.com/openai/v1"
    )


class CopywriterAgent:
    """
    Sinh nội dung bài đăng Facebook dựa trên chiến lược và yêu cầu cụ thể.
    """

    def __init__(self):
        self.client: Optional[OpenAI] = None
        if settings.GROQ_API_KEY:
            self.client = _get_openai_client()

    def create_post(
        self, goal: str, tone: str, brand_context: str = ""
    ) -> tuple[Optional[str], Optional[dict]]:
        if not self.client:
            return f"Mock Post Content for goal: {goal} with {tone} tone.", None

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
            model="llama3-70b-8192",
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
        content = response.choices[0].message.content
        usage = None
        if response.usage:
            usage = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            }
        return content, usage
