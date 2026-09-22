from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WorkspaceCreate(BaseModel):
    name: str

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    created_at: Optional[datetime] = None

class WorkspaceMemberResponse(BaseModel):
    workspace_id: str
    user_id: str
    role: str
    created_at: Optional[datetime] = None
