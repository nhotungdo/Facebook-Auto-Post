from openai import OpenAI
from typing import Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def _get_openai_client() -> OpenAI:
    return OpenAI(
        api_key=settings.GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )

class AIVisualAgent:
    """
    Sinh ảnh minh họa (DALL-E 3) dựa trên nội dung bài viết.
    """
    def __init__(self):
        self.client: Optional[OpenAI] = None
        if settings.GROQ_API_KEY:
            self.client = _get_openai_client()

    def generate_image(self, post_content: str) -> Optional[str]:
        if not self.client:
            return "https://mock-image-url.com/visual-agent.png"
        
        try:
            prompt = f"Tạo một hình ảnh minh họa cho bài đăng mạng xã hội sau đây. Yêu cầu: Không chèn chữ (text) vào hình, phong cách hiện đại, phù hợp với nội dung: \n\n{post_content[:500]}"
            
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                n=1,
                size="1024x1024"
            )
            if response.data and len(response.data) > 0:
                return response.data[0].url
            return None
        except Exception as e:
            logger.error(f"Error generating image: {e}")
            return None
