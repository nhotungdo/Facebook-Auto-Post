from openai import OpenAI
from typing import Optional, Tuple
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

def _get_openai_client() -> OpenAI:
    return OpenAI(
        api_key=settings.GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )

class AIReviewer:
    """
    Kiểm duyệt nội dung bài đăng trước khi xuất bản.
    """
    def __init__(self):
        self.client: Optional[OpenAI] = None
        if settings.GROQ_API_KEY:
            self.client = _get_openai_client()

    def review_post(self, post_content: str, guidelines: str = "") -> Tuple[bool, str]:
        """
        Trả về (is_approved, feedback).
        """
        if not self.client:
            return True, "Mock Approved"
            
        prompt = f"""
        Bạn là một chuyên gia kiểm duyệt nội dung (QA) cho mạng xã hội.
        Hãy đánh giá bài đăng sau dựa trên các nguyên tắc thương hiệu (Brand Guidelines): {guidelines}
        
        Bài đăng: 
        {post_content}
        
        Nếu bài đăng có ngôn từ vi phạm chính sách, sai chính tả nghiêm trọng, hoặc không tuân thủ Guidelines, hãy từ chối.
        Phản hồi theo định dạng JSON với 2 key: 
        - "approved": boolean (true/false)
        - "feedback": lý do hoặc đề xuất sửa (chuỗi)
        """
        
        try:
            response = self.client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": "You are a QA Reviewer. Output strictly in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            result_str = response.choices[0].message.content
            if result_str:
                result = json.loads(result_str)
                return bool(result.get("approved", False)), str(result.get("feedback", "No feedback provided"))
            return False, "Empty response"
        except Exception as e:
            logger.error(f"Error reviewing post: {e}")
            return False, str(e)
