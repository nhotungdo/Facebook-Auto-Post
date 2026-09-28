from typing import Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import get_supabase_client

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Any:
    """Validate the Supabase JWT and return the Supabase User object."""
    token = credentials.credentials
    supabase = get_supabase_client()
    try:
        response = supabase.auth.get_user(token)
        if response and response.user:
            return response.user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_id(user: Any = Depends(get_current_user)) -> str:
    """Extract the auth.users UUID from the validated Supabase User object."""
    return str(user.id)


def get_current_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    return credentials.credentials
