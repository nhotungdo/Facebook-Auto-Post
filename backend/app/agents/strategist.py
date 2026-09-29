# pyrefly: ignore [missing-import]
from openai import OpenAI
from typing import Optional
from app.core.config import settings


def _get_openai_client() -> OpenAI:
    return OpenAI(
        api_key=settings.GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )


class AIStrategist:
    """
    Phân tích mục tiêu kinh doanh và đề xuất chiến lược nội dung, lịch đăng.
    """

    def __init__(self):
        # Allow instantiation without error if key is empty during development
        self.client: Optional[OpenAI] = None
        if settings.GROQ_API_KEY:
            self.client = _get_openai_client()

    def generate_strategy(
        self, niche: str, target_audience: str, posts_per_week: int = 5
    ) -> Optional[dict]:
        if not self.client:
            return {"pillars": ["Khuyến mãi",
                                "Kiến thức",
                                "Minigame"],
                    "calendar": [{"day": "Thứ 2",
                                  "time": "19:00",
                                  "topic": "Giới thiệu sản phẩm mới",
                                  "goal": "Tăng nhận diện"}]}

        prompt = f"""
        Bạn là một chuyên gia Marketing (AI Strategist).
        Lĩnh vực/Ngành hàng (Niche): {niche}
        Đối tượng mục tiêu: {target_audience}
        Số bài đăng 1 tuần: {posts_per_week}

        Hãy đề xuất một chiến lược nội dung dưới định dạng JSON duy nhất. KHÔNG trả lời thêm văn bản.
        Yêu cầu JSON format:
        {{
            "pillars": ["Tên chủ đề 1", "Tên chủ đề 2", "Tên chủ đề 3"],
            "calendar": [
                {{
                    "day": "Thứ 2", // Ngày trong tuần
                    "time": "19:00", // Khung giờ đăng tốt nhất
                    "topic": "Mô tả ngắn gọn ý tưởng nội dung",
                    "goal": "Mục tiêu (vd: Tương tác, Sale, Viral)"
                }}
                // Lặp lại để đủ số lượng bài đăng: {posts_per_week}
            ]
        }}
        """
        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful Marketing Strategist. Respond ONLY in valid JSON format.",
                },
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"}
        )
        try:
            import json
            content_str = response.choices[0].message.content or "{}"
            result = json.loads(content_str)
            return result
        except Exception as e:
            return {"error": str(e)}
