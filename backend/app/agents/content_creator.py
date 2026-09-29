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

    def rewrite_content(
            self,
            original_content: str,
            tone: str,
            num_variants: int = 3) -> list[str]:
        if not self.client:
            return [
                f"[Mock] {original_content} (Tone: {tone})" for _ in range(num_variants)]

        prompt = f"""
        Nhiệm vụ: Viết lại nội dung sau đây thành {num_variants} phiên bản khác nhau.
        Giọng văn yêu cầu (Tone): {tone}

        Nội dung gốc:
        "{original_content}"

        Yêu cầu kết quả:
        - Chỉ trả về kết quả định dạng JSON với mảng "variants" chứa các phiên bản văn bản.
        - Giữ nguyên ý chính, nhưng thay đổi cách diễn đạt theo giọng văn yêu cầu.
        """
        response = self.client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional social media content editor. Respond ONLY in valid JSON format like: {\"variants\": [\"version 1\", \"version 2\"]}",
                },
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"}
        )
        try:
            import json
            content_str = response.choices[0].message.content or "{}"
            result_json = json.loads(content_str)
            return result_json.get("variants", [])
        except Exception as e:
            return [f"Lỗi khi xử lý JSON từ AI: {str(e)}"]
