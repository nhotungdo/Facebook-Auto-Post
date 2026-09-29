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
            return "https://image.pollinations.ai/prompt/social%20media%20marketing%20banner"

        try:
            import urllib.parse

            # Step 1: Use Groq to extract a short, descriptive English prompt
            # from the post content
            prompt_instruction = f"""
            Extract a short, 5-8 word highly descriptive English image prompt based on this content:
            "{post_content[:500]}"
            Only return the English keywords, no other text, no quotes.
            """

            response = self.client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": "You are an expert at writing Midjourney image prompts. Respond with ONLY the English keywords."},
                    {"role": "user", "content": prompt_instruction}
                ],
            )

            english_prompt = response.choices[0].message.content.strip()
            # Default fallback if empty
            if not english_prompt:
                english_prompt = "abstract social media background"

            # Encode for URL
            encoded_prompt = urllib.parse.quote(english_prompt)

            # Use pollinations.ai for free instant image generation
            image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true"
            return image_url

        except Exception as e:
            logger.error(f"Error generating image: {e}")
            return "https://image.pollinations.ai/prompt/beautiful%20social%20media%20marketing%20background"
