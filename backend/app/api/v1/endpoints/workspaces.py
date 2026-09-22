from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.api.deps import get_current_user, get_current_user_token
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse
from app.services.supabase_client import get_supabase_client

router = APIRouter(prefix="/workspaces", tags=["workspaces"])

@router.get("/", response_model=List[WorkspaceResponse])
async def get_workspaces(
    user_token: str = Depends(get_current_user_token),
    user: dict = Depends(get_current_user)
):
    """Lấy danh sách workspace của user hiện tại"""
    supabase = get_supabase_client(user_token)
    
    # Query workspace_members with RLS to get user's workspaces
    try:
        response = supabase.table("workspaces").select("*").execute()
        # Because RLS is enabled, selecting from `workspaces` with the user's token 
        # should automatically filter to only workspaces the user can see.
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/", response_model=WorkspaceResponse)
async def create_workspace(
    workspace_in: WorkspaceCreate,
    user_token: str = Depends(get_current_user_token),
    user: dict = Depends(get_current_user) # or user object depending on goTrue
):
    """Tạo một workspace mới và thêm user hiện tại làm chủ (owner/admin)"""
    supabase = get_supabase_client(user_token)
    try:
        # Create workspace
        # Supabase RLS policies might allow insert, or we might need service role
        # Assuming RLS allows authenticated users to insert into workspaces
        ws_response = supabase.table("workspaces").insert({
            "name": workspace_in.name
        }).execute()
        
        if not ws_response.data:
            raise HTTPException(status_code=400, detail="Failed to create workspace")
            
        new_ws = ws_response.data[0]
        ws_id = new_ws["id"]
        
        # Add user to workspace_members
        # Note: In some designs, a database trigger automatically adds the creator 
        # to workspace_members. Assuming we do it manually here:
        user_id = user.id if hasattr(user, 'id') else user.get('id') if isinstance(user, dict) else user.user.id if hasattr(user, 'user') else None
        
        if user_id:
            supabase.table("workspace_members").insert({
                "workspace_id": ws_id,
                "user_id": user_id,
                "role": "owner" # or admin
            }).execute()
            
        return new_ws
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

