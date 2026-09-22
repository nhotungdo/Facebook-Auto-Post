from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import RedirectResponse
from typing import List
import httpx
import json

from app.api.deps import get_current_user_token
from app.schemas.page import ConnectPageRequest, ConnectPageOAuthRequest, PageResponse, AvailablePageInfo
from app.services.supabase_client import get_supabase_client
from app.core.security import encrypt_token
from app.core.config import settings

router = APIRouter(prefix="/facebook", tags=["facebook"])

@router.get("/login")
async def facebook_login(workspace_id: str = Query(...)):
    """
    Tạo URL đăng nhập Facebook và chuyển hướng người dùng.
    Dùng workspace_id làm state.
    """
    if not settings.FB_APP_ID:
        raise HTTPException(status_code=500, detail="FB_APP_ID is not configured")
        
    redirect_uri = "http://localhost:8000/api/v1/facebook/callback"
    scopes = "pages_show_list,pages_read_engagement,pages_manage_posts"
    
    url = (
        f"https://www.facebook.com/v20.0/dialog/oauth?"
        f"client_id={settings.FB_APP_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"state={workspace_id}&"
        f"scope={scopes}"
    )
    return RedirectResponse(url)

@router.get("/callback")
async def facebook_callback(code: str = Query(...), state: str = Query(...)):
    """
    Nhận code từ Facebook, đổi lấy User Access Token, và redirect về frontend.
    Truyền User Access Token dưới dạng hash url để bảo mật stateless.
    """
    if not settings.FB_APP_ID or not settings.FB_APP_SECRET:
        raise HTTPException(status_code=500, detail="Facebook App credentials not configured")
        
    redirect_uri = "http://localhost:8000/api/v1/facebook/callback"
    workspace_id = state
    
    # Đổi code lấy user access token
    token_url = "https://graph.facebook.com/v20.0/oauth/access_token"
    async with httpx.AsyncClient() as client:
        resp = await client.get(token_url, params={
            "client_id": settings.FB_APP_ID,
            "redirect_uri": redirect_uri,
            "client_secret": settings.FB_APP_SECRET,
            "code": code
        })
        
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to get access token: {resp.text}")
            
        data = resp.json()
        user_access_token = data.get("access_token")
        
        if not user_access_token:
            raise HTTPException(status_code=400, detail="No access token in response")
            
    # Redirect về frontend trang /pages/select, truyền token qua hash
    frontend_redirect_url = f"http://localhost:3000/pages/select?workspace_id={workspace_id}#token={user_access_token}"
    return RedirectResponse(frontend_redirect_url)

@router.get("/available-pages", response_model=List[AvailablePageInfo])
async def get_available_pages(
    token: str = Query(..., description="User Access Token từ Meta"),
    user_token: str = Depends(get_current_user_token)
):
    """
    Lấy danh sách Fanpage mà user này có quyền quản trị, sử dụng User Access Token.
    """
    url = "https://graph.facebook.com/v20.0/me/accounts"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params={
            "access_token": token,
            "fields": "id,name,access_token,followers_count,picture"
        })
        
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to fetch pages from Graph API: {resp.text}")
            
        data = resp.json()
        pages = data.get("data", [])
        
        result = []
        for p in pages:
            pic_url = p.get("picture", {}).get("data", {}).get("url")
            result.append(AvailablePageInfo(
                id=p["id"],
                name=p["name"],
                access_token=p["access_token"],
                followers_count=p.get("followers_count", 0),
                picture_url=pic_url
            ))
        return result

@router.post("/connect-oauth", response_model=PageResponse)
async def connect_facebook_page_oauth(
    request: ConnectPageOAuthRequest,
    user_token: str = Depends(get_current_user_token)
):
    """
    Kết nối Facebook Page sau khi user chọn từ danh sách.
    Backend tự gọi Meta API để lấy lại Page Access Token hoặc xài token được truyền vào.
    Ở đây ta gọi /me/accounts để lấy đúng token cho page_id.
    """
    url = "https://graph.facebook.com/v20.0/me/accounts"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params={
            "access_token": request.user_access_token,
            "fields": "id,name,access_token"
        })
        
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to validate token")
            
        data = resp.json()
        pages = data.get("data", [])
        
        selected_page = next((p for p in pages if p["id"] == request.page_id), None)
        if not selected_page:
            raise HTTPException(status_code=404, detail="Page not found in user accounts")
            
        # Mã hóa Page Access Token
        encrypted_token = encrypt_token(selected_page["access_token"])
        
        supabase = get_supabase_client(user_token)
        try:
            response = supabase.table("pages").upsert({
                "id": selected_page["id"],
                "name": selected_page["name"],
                "access_token": encrypted_token,
                "workspace_id": request.workspace_id
            }).execute()
            
            if not response.data:
                raise HTTPException(status_code=400, detail="Failed to connect page in DB")
                
            page_data = response.data[0]
            return PageResponse(id=page_data["id"], name=page_data["name"], connected=True)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

@router.post("/connect", response_model=PageResponse)
async def connect_facebook_page(
    request: ConnectPageRequest,
    user_token: str = Depends(get_current_user_token)
):
    """
    Kết nối thủ công (giữ lại để backwards compatibility)
    """
    supabase = get_supabase_client(user_token)
    encrypted_token = encrypt_token(request.access_token)
    try:
        response = supabase.table("pages").upsert({
            "id": request.page_id,
            "name": request.name,
            "access_token": encrypted_token,
            "workspace_id": request.workspace_id
        }).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to connect page")
            
        page_data = response.data[0]
        return PageResponse(id=page_data["id"], name=page_data["name"], connected=True)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/pages", response_model=List[PageResponse])
async def get_facebook_pages(
    workspace_id: str = Query(..., description="ID của workspace"),
    user_token: str = Depends(get_current_user_token)
):
    """
    Lấy danh sách Facebook Pages đã kết nối với hệ thống cho một workspace cụ thể.
    """
    supabase = get_supabase_client(user_token)
    try:
        response = supabase.table("pages").select("id, name").eq("workspace_id", workspace_id).execute()
        return [PageResponse(id=p["id"], name=p["name"], connected=True) for p in response.data]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

