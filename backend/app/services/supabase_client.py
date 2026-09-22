from typing import Optional
from supabase import create_client, Client, ClientOptions
from app.core.config import settings


def get_supabase_client(auth_token: Optional[str] = None) -> Client:
    """
    Tạo kết nối tới Supabase.
    Nếu có auth_token (JWT của user), truyền vào header để Supabase áp dụng Row Level Security (RLS).
    Điều này đảm bảo Multi-tenant isolation: User nào chỉ thấy data của User đó.
    """
    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_KEY
    if not url or not key:
        raise ValueError(
            "Supabase URL and Key must be provided in settings."
        )
        
    options = ClientOptions()
    if auth_token:
        # Override header để truyền token của End User
        options.headers = {"Authorization": f"Bearer {auth_token}"}
        
    supabase: Client = create_client(url, key, options=options)
    return supabase
