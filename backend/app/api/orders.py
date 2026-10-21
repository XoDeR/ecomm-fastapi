from fastapi import APIRouter, status

from app.api.deps import CurrentUser, SessionDep

from app.schemas.orders import OrderCreateIn, OrderCreateOut, OrderOut
from app.services.orders import (
    create_order,
    get_order,
    list_orders,
)

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderCreateOut, status_code=status.HTTP_201_CREATED)
async def create_order_endpoint(
    data: OrderCreateIn,
    user: CurrentUser,
    session: SessionDep,
) -> OrderCreateOut:
    pass


@router.get("", response_model=list[OrderOut])
async def list_orders_endpoint(user: CurrentUser, session: SessionDep) -> list[OrderOut]:
    pass



@router.get("/{order_id}", response_model=OrderOut)
async def get_order_endpoint(order_id: int, user: CurrentUser, session: SessionDep) -> OrderOut:
    pass