from fastapi import APIRouter, status, HTTPException

from app.models.user import User
from app.schemas.auth import UserOut, RegisterIn
from app.api.deps import SessionDep

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from starlette.concurrency import run_in_threadpool
from app.core.security import hash_password, verify_password


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
async def register(data: RegisterIn, session: SessionDep) -> User:
    email = data.email.lower()
    existing = await session.scalar(select(User).where(User.email == email))
    if existing is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    password_hash = await run_in_threadpool(hash_password, data.password)
    user = User(email=email, password_hash=password_hash)
    session.add(user)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered") from None
    await session.refresh(user)
    return user

@router.post("/login")
async def login() -> dict[str, str]:
    return {"route": "login"}

@router.get("/me")
async def me() -> dict[str, str]:
    return {"route": "me"}