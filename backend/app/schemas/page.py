from pydantic import BaseModel
from typing import Optional, List

class ConnectPageRequest(BaseModel):
    page_id: str
    name: str
    access_token: str
    workspace_id: str

class ConnectPageOAuthRequest(BaseModel):
    page_id: str
    workspace_id: str
    user_access_token: str

class AvailablePageInfo(BaseModel):
    id: str
    name: str
    access_token: str
    followers_count: Optional[int] = 0
    picture_url: Optional[str] = None

class PageResponse(BaseModel):
    id: str
    name: str
    connected: bool = True
