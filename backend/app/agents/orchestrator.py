from app.agents.content_creator import CopywriterAgent
from app.agents.reviewer import AIReviewer
from app.agents.visual_agent import AIVisualAgent
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class MultiAgentOrchestrator:
    def __init__(self):
        self.creator = CopywriterAgent()
        self.reviewer = AIReviewer()
        self.visual_agent = AIVisualAgent()

    def generate_and_review_post(self,
                                 goal: str,
                                 tone: str,
                                 brand_guidelines: str = "") -> Tuple[Optional[str],
                                                                      Optional[str],
                                                                      str]:
        """
        Luồng: Content Creator -> Reviewer (loop tối đa 2 lần nếu bị reject) -> Visual Agent.
        Trả về (content, media_url, status_message)
        """
        content = None
        is_approved = False
        feedback = ""

        for attempt in range(2):
            logger.info(f"Generating content (Attempt {attempt + 1})")
            content, usage = self.creator.create_post(
                goal=goal, tone=tone, brand_context=brand_guidelines)
            if not content:
                return None, None, "Failed to generate content."

            is_approved, feedback = self.reviewer.review_post(
                content, brand_guidelines)
            if is_approved:
                logger.info("Content approved by Reviewer.")
                break
            else:
                logger.warning(
                    f"Content rejected by Reviewer. Feedback: {feedback}")
                brand_guidelines += f"\n\nLưu ý từ Reviewer ở lần thử trước (CẦN SỬA): {feedback}"

        if not is_approved:
            # Vẫn trả về content nhưng kèm status bị reject để lưu vào DB xem
            # xét sau (Draft/Pending)
            return content, None, f"Rejected: {feedback}"

        logger.info("Generating visual media...")
        media_url = self.visual_agent.generate_image(
            content) if content is not None else None

        return content, media_url, "Success"
