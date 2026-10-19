from fastapi import APIRouter

from app.api.deps import SessionDep
from app.schemas.categories import CategoryOut
from app.services import categories as categories_service

router = APIRouter(tags=["categories"])

@router.get("/categories", response_model=list[CategoryOut])
async def list_categories_endpoint(session: SessionDep) -> list[CategoryOut]:
    return await categories_service.list_categories(session)