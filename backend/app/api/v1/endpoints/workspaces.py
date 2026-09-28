from typing import List

from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user_id, get_current_user_token
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse
from app.services.supabase_client import get_supabase_client

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.get("/", response_model=List[WorkspaceResponse])
async def get_workspaces(
    user_token: str = Depends(get_current_user_token),
    user_id: str = Depends(get_current_user_id),
):
    """Lấy danh sách workspace của user hiện tại"""
    supabase = get_supabase_client(user_token)

    # RLS đảm bảo user chỉ thấy workspace của mình
    try:
        response = supabase.table("workspaces").select("*").execute()
        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/", response_model=WorkspaceResponse)
async def create_workspace(
    workspace_in: WorkspaceCreate,
    user_token: str = Depends(get_current_user_token),
    user_id: str = Depends(get_current_user_id),
):
    """Tạo một workspace mới và thêm user hiện tại làm chủ (owner)"""
    supabase = get_supabase_client(user_token)
    try:
        # Create workspace
        ws_response = supabase.table("workspaces").insert({
            "name": workspace_in.name
        }).execute()

        if not ws_response.data or not isinstance(ws_response.data[0], dict):
            raise HTTPException(status_code=400, detail="Failed to create workspace")

        new_ws = ws_response.data[0]
        ws_id = str(new_ws.get("id"))

        # Add user to workspace_members (hoặc DB trigger có thể đã tự làm)
        supabase.table("workspace_members").insert({
            "workspace_id": ws_id,
            "user_id": user_id,
            "role": "owner"
        }).execute()

        return new_ws
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
