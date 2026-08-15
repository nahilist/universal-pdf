from fastapi import APIRouter

from app.api.v1 import files, health, jobs, languages

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(languages.router, prefix="/languages", tags=["languages"])
api_router.include_router(files.router, prefix="/files", tags=["files"])

__all__ = ["api_router"]
