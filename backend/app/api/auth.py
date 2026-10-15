from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register() -> dict[str, str]:
    return {"route": "register"}

@router.post("/login")
async def login() -> dict[str, str]:
    return {"route": "login"}

@router.get("/me")
async def me() -> dict[str, str]:
    return {"route": "me"}