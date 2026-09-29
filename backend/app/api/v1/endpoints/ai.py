from fastapi import APIRouter, Depends, HTTPException
from app.schemas.ai import RewriteRequest, RewriteResponse, StrategyRequest, StrategyResponse
from app.agents.content_creator import CopywriterAgent
from app.agents.strategist import AIStrategist
from app.api.deps import get_current_user_token

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/strategy", response_model=StrategyResponse)
async def generate_strategy(
    request: StrategyRequest,
    user_token: str = Depends(get_current_user_token)
):
    try:
        agent = AIStrategist()
        result = agent.generate_strategy(
            niche=request.niche,
            target_audience=request.target_audience,
            posts_per_week=request.posts_per_week or 5
        )
        if result and "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])

        return StrategyResponse(status="success", data=result or {})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi lên chiến lược: {
                str(e)}")


@router.post("/generate-post")
async def generate_post_content():
    pass


@router.post("/rewrite", response_model=RewriteResponse)
async def rewrite_post_content(
    request: RewriteRequest,
    user_token: str = Depends(get_current_user_token)
):
    """
    Sử dụng AI để viết lại (rewrite) nội dung theo giọng văn yêu cầu.
    """
    try:
        agent = CopywriterAgent()
        variants = agent.rewrite_content(
            original_content=request.original_content,
            tone=request.tone,
            num_variants=request.num_variants or 3
        )
        return RewriteResponse(status="success", variants=variants)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi viết lại nội dung: {
                str(e)}")
