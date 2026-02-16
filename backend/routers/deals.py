from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from database import get_session
from models import Deal, DealCreate, DealRead, DealUpdate

router = APIRouter(
    prefix="/deals",
    tags=["deals"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=DealRead)
def create_deal(*, session: Session = Depends(get_session), deal: DealCreate):
    db_deal = Deal.model_validate(deal)
    session.add(db_deal)
    session.commit()
    session.refresh(db_deal)
    return db_deal

@router.get("/", response_model=List[DealRead])
def read_deals(*, session: Session = Depends(get_session), offset: int = 0, limit: int = Query(default=100, le=100)):
    deals = session.exec(select(Deal).offset(offset).limit(limit)).all()
    return deals

@router.get("/{deal_id}", response_model=DealRead)
def read_deal(*, session: Session = Depends(get_session), deal_id: int):
    deal = session.get(Deal, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return deal

@router.patch("/{deal_id}", response_model=DealRead)
def update_deal(*, session: Session = Depends(get_session), deal_id: int, deal: DealUpdate):
    db_deal = session.get(Deal, deal_id)
    if not db_deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    deal_data = deal.model_dump(exclude_unset=True)
    for key, value in deal_data.items():
        setattr(db_deal, key, value)
    session.add(db_deal)
    session.commit()
    session.refresh(db_deal)
    return db_deal

@router.delete("/{deal_id}")
def delete_deal(*, session: Session = Depends(get_session), deal_id: int):
    deal = session.get(Deal, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    session.delete(deal)
    session.commit()
    return {"ok": True}
