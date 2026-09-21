from fastapi import APIRouter

router = APIRouter()


@router.get("")
@router.get("/")
@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/ready")
async def ready() -> dict[str, str]:
    return {"status": "ready"}


__all__ = ["router"]
