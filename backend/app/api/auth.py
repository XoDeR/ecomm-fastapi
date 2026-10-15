from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me")
async def me() -> dict[str, str]:
    return {"route": "me"}