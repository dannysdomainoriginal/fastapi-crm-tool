from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from database import get_session
from models import Contact, ContactCreate, ContactRead, ContactUpdate, User
from routers.auth import get_current_user

router = APIRouter(
    prefix="/contacts",
    tags=["contacts"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=ContactRead)
async def create_contact(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), contact: ContactCreate):
    db_contact = Contact.model_validate(contact, update={"user_id": current_user.id})
    session.add(db_contact)
    await session.commit()
    await session.refresh(db_contact)
    return db_contact

@router.get("/", response_model=List[ContactRead])
async def read_contacts(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), offset: int = 0, limit: int = Query(default=100, le=100)):
    statement = select(Contact).where(Contact.user_id == current_user.id).offset(offset).limit(limit)
    result = await session.execute(statement)
    contacts = result.scalars().all()
    return contacts

@router.get("/{contact_id}", response_model=ContactRead)
async def read_contact(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), contact_id: int):
    statement = select(Contact).where(Contact.id == contact_id, Contact.user_id == current_user.id)
    result = await session.execute(statement)
    contact = result.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.patch("/{contact_id}", response_model=ContactRead)
async def update_contact(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), contact_id: int, contact: ContactUpdate):
    statement = select(Contact).where(Contact.id == contact_id, Contact.user_id == current_user.id)
    result = await session.execute(statement)
    db_contact = result.scalar_one_or_none()
    
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    contact_data = contact.model_dump(exclude_unset=True)
    for key, value in contact_data.items():
        setattr(db_contact, key, value)
    
    session.add(db_contact)
    await session.commit()
    await session.refresh(db_contact)
    return db_contact

@router.delete("/{contact_id}")
async def delete_contact(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), contact_id: int):
    statement = select(Contact).where(Contact.id == contact_id, Contact.user_id == current_user.id)
    result = await session.execute(statement)
    contact = result.scalar_one_or_none()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    await session.delete(contact)
    await session.commit()
    return {"ok": True}
