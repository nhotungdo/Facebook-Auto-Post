from fastapi import APIRouter, Depends, HTTPException
from app.schemas.post import (
    PostRequest,
    PostResponse,
    SchedulePostRequest,
    SchedulePostResponse,
    PublishNowRequest,
    PublishNowResponse,
)
from app.api.deps import get_current_user_token, get_current_user
from app.services.supabase_client import get_supabase_client
from app.agents.content_creator import CopywriterAgent
from app.services.publishers.facebook import FacebookPublisher
from app.core.security import decrypt_token

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/generate", response_model=PostResponse)
async def generate_post(
    request: PostRequest,
    user_token: str = Depends(get_current_user_token),
    user: dict = Depends(get_current_user)
):
    """
    Tạo nội dung bài đăng Facebook bằng AI dựa trên mục tiêu và giọng văn.
    Ghi nhận log token usage vào bảng ai_generations.
    """
    agent = CopywriterAgent()
    content, usage = agent.create_post(
        goal=request.goal,
        tone=request.tone,
        brand_context=""
    )

    # Save token tracking
    supabase = get_supabase_client(user_token)
    user_id = user.id if hasattr(user, 'id') else user.get('id') if isinstance(user, dict) else user.user.id if hasattr(user, 'user') else None
    
    if usage and user_id:
        try:
            supabase.table("ai_generations").insert({
                "user_id": user_id,
                "prompt_tokens": usage.get("prompt_tokens", 0),
                "completion_tokens": usage.get("completion_tokens", 0),
                "total_tokens": usage.get("total_tokens", 0)
            }).execute()
        except Exception as e:
            # We can log this but don't fail the request if logging fails
            pass

    return PostResponse(
        status="success",
        data={
            "content": content,
            "suggested_media": [],
            "usage": usage
        },
    )


@router.post("/publish", response_model=PublishNowResponse)
async def publish_post_now(
    request: PublishNowRequest,
    user_token: str = Depends(get_current_user_token)
):
    """
    Publish bài viết ngay lập tức lên Facebook Page.
    1. Lấy token của Page từ DB & giải mã.
    2. Gọi Meta Graph API để đẩy bài.
    3. Lưu lại bản ghi post vào DB với status = published.
    """
    supabase = get_supabase_client(user_token)
    
    try:
        # 1. Fetch Page token
        page_resp = supabase.table("pages").select("access_token").eq("id", request.page_id).execute()
        if not page_resp.data:
            raise HTTPException(status_code=404, detail="Page not found or not connected")
            
        encrypted_token = page_resp.data[0]["access_token"]
        decrypted_token = decrypt_token(encrypted_token)
        
        # 2. Publish to FB
        publisher = FacebookPublisher()
        fb_result = await publisher.post_to_page(
            page_id=request.page_id,
            access_token=decrypted_token,
            message=request.content,
            media_url=request.media_url if isinstance(request.media_url, str) else None
        )
        
        # 3. Save post to DB
        status = "published" if fb_result.get("success") else "failed"
        fb_post_id = None
        if status == "published" and "data" in fb_result and "id" in fb_result["data"]:
            fb_post_id = fb_result["data"]["id"]
            
        db_post = supabase.table("posts").insert({
            "page_id": request.page_id,
            "content": request.content,
            "media_url": request.media_url if isinstance(request.media_url, str) else None,
            "status": status,
        }).execute()
        
        db_post_id = db_post.data[0]["id"] if db_post.data else None
        
        if not fb_result.get("success"):
            return PublishNowResponse(
                status="failed",
                post_id=db_post_id,
                error=str(fb_result.get("error"))
            )
            
        return PublishNowResponse(
            status="published",
            post_id=db_post_id,
            fb_post_id=fb_post_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/schedule", response_model=SchedulePostResponse)
async def schedule_post(
    request: SchedulePostRequest,
    user_token: str = Depends(get_current_user_token)
):
    """
    Lưu bài viết vào DB với trạng thái 'ready' và giờ đăng 'scheduled_at'.
    Celery worker sẽ tự động quét và đẩy lên Facebook khi tới giờ.
    """
    supabase = get_supabase_client(user_token)
    
    try:
        # Verify page exists
        page_resp = supabase.table("pages").select("id").eq("id", request.page_id).execute()
        if not page_resp.data:
            raise HTTPException(status_code=404, detail="Page not found")

        # Save post to DB
        db_post = supabase.table("posts").insert({
            "page_id": request.page_id,
            "content": request.content,
            "media_url": request.media_url if isinstance(request.media_url, str) else None,
            "status": "ready",
            "scheduled_at": request.scheduled_at
        }).execute()
        
        db_post_id = db_post.data[0]["id"] if db_post.data else "unknown"
        
        return SchedulePostResponse(
            status="scheduled",
            post_id=db_post_id,
            scheduled_at=request.scheduled_at,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
