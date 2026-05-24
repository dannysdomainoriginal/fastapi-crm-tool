from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from database import get_session
from models import Deal, DealCreate, DealRead, DealUpdate, User
from routers.auth import get_current_user

router = APIRouter(
    prefix="/deals",
    tags=["deals"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=DealRead)
async def create_deal(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), deal: DealCreate):
    db_deal = Deal.model_validate(deal, update={"user_id": current_user.id})
    session.add(db_deal)
    await session.commit()
    await session.refresh(db_deal)
    return db_deal

@router.get("/", response_model=List[DealRead])
async def read_deals(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), offset: int = 0, limit: int = Query(default=100, le=100)):
    statement = select(Deal).where(Deal.user_id == current_user.id).offset(offset).limit(limit)
    result = await session.execute(statement)
    deals = result.scalars().all()
    return deals

@router.get("/{deal_id}", response_model=DealRead)
async def read_deal(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), deal_id: int):
    statement = select(Deal).where(Deal.id == deal_id, Deal.user_id == current_user.id)
    result = await session.execute(statement)
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return deal

@router.patch("/{deal_id}", response_model=DealRead)
async def update_deal(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), deal_id: int, deal: DealUpdate):
    statement = select(Deal).where(Deal.id == deal_id, Deal.user_id == current_user.id)
    result = await session.execute(statement)
    db_deal = result.scalar_one_or_none()
    
    if not db_deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    deal_data = deal.model_dump(exclude_unset=True)
    for key, value in deal_data.items():
        setattr(db_deal, key, value)
    
    session.add(db_deal)
    await session.commit()
    await session.refresh(db_deal)
    return db_deal

@router.delete("/{deal_id}")
async def delete_deal(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), deal_id: int):
    statement = select(Deal).where(Deal.id == deal_id, Deal.user_id == current_user.id)
    result = await session.execute(statement)
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    await session.delete(deal)
    await session.commit()
    return {"ok": True}
