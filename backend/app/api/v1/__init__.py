from fastapi import APIRouter
from app.api.v1.endpoints import posts, auth, users, workspaces, ai

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(workspaces.router)
api_router.include_router(posts.router)
api_router.include_router(ai.router)
