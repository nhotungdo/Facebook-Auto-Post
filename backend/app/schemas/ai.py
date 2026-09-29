from pydantic import BaseModel
from typing import List, Optional


class RewriteRequest(BaseModel):
    original_content: str
    tone: str
    num_variants: Optional[int] = 3


class RewriteResponse(BaseModel):
    status: str
    variants: List[str]


class StrategyRequest(BaseModel):
    niche: str
    target_audience: str
    posts_per_week: Optional[int] = 5


class StrategyResponse(BaseModel):
    status: str
    data: dict
