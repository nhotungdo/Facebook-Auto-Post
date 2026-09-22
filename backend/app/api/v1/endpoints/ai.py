from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/strategy")
async def generate_strategy():
    pass

@router.post("/generate-post")
async def generate_post_content():
    pass
