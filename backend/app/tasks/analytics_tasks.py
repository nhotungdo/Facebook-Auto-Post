from celery import shared_task
import logging
from app.services.supabase_client import get_supabase_client
from app.services.publishers.facebook import FacebookPublisher
from app.core.security import decrypt_token

logger = logging.getLogger(__name__)

@shared_task
def sync_post_analytics() -> str:
    """
    Chạy định kỳ để quét các post đã 'published' 
    và đồng bộ số liệu reach, engagement từ Facebook về DB.
    """
    try:
        supabase = get_supabase_client()
        fb_service = FacebookPublisher()
        
        # Lấy bài đã publish và có facebook_post_id
        response = supabase.table("posts")\
            .select("id, facebook_post_id, facebook_pages(access_token)")\
            .eq("status", "published")\
            .not_.is_("facebook_post_id", "null")\
            .execute()
            
        posts = response.data or []
        for post in posts:
            if not isinstance(post, dict):
                continue
                
            page_info = post.get("facebook_pages")
            if not isinstance(page_info, dict):
                page_info = {}
                
            encrypted_token = page_info.get("access_token") if page_info else None
            access_token = decrypt_token(str(encrypted_token)) if encrypted_token else None
            fb_post_id = str(post.get("facebook_post_id")) if post.get("facebook_post_id") else None
            post_id = str(post.get("id")) if post.get("id") else None
            
            if not access_token or not fb_post_id:
                continue
                
            res = fb_service.get_post_analytics_sync(post_id=fb_post_id, access_token=access_token)
            if res.get("success"):
                metrics = res.get("data", {})
                reach = metrics.get("reach", 0)
                engagement = metrics.get("engagement", 0)
                
                # Cập nhật số liệu vào DB
                supabase.table("posts").update({
                    "reach": reach,
                    "engagement": engagement
                }).eq("id", post_id).execute()
                logger.info(f"Synced analytics for post {post_id}")
            else:
                logger.error(f"Failed to sync analytics for post {post_id}: {res.get('error')}")
                
        return "Done syncing analytics"
    except Exception as e:
        logger.error(f"Error in sync_post_analytics: {e}")
        return str(e)
