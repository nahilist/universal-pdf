from typing import List
from fastapi import APIRouter
from app.schemas.job import LanguageInfo
from app.translation.engine import translation_engine

router = APIRouter()


@router.get("", response_model=List[LanguageInfo])
async def list_languages() -> List[LanguageInfo]:
    return translation_engine.get_supported_languages()
