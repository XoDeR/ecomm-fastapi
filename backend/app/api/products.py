from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import SessionDep
from app.schemas.products import ProductOut
from app.services import products as products_service

router = APIRouter(tags=["products"])

@router.get("/products", response_model=list[ProductOut])
async def list_products_endpoint(
    session: SessionDep,
    category: Annotated[str | None, Query(max_length=100)] = None,
    search: Annotated[str | None, Query(max_length=100)] = None,
) -> list[ProductOut]:
    return await products_service.list_products(session, category, search)

@router.get("/products/{slug}", response_model=ProductOut)
async def get_product_endpoint(slug: str, session: SessionDep) -> ProductOut:
    product = await products_service.get_product(session, slug)
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    return product