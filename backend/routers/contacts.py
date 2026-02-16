from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from database import get_session
from models import Contact, ContactCreate, ContactRead, ContactUpdate

router = APIRouter(
    prefix="/contacts",
    tags=["contacts"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=ContactRead)
def create_contact(*, session: Session = Depends(get_session), contact: ContactCreate):
    db_contact = Contact.model_validate(contact)
    session.add(db_contact)
    session.commit()
    session.refresh(db_contact)
    return db_contact

@router.get("/", response_model=List[ContactRead])
def read_contacts(*, session: Session = Depends(get_session), offset: int = 0, limit: int = Query(default=100, le=100)):
    contacts = session.exec(select(Contact).offset(offset).limit(limit)).all()
    return contacts

@router.get("/{contact_id}", response_model=ContactRead)
def read_contact(*, session: Session = Depends(get_session), contact_id: int):
    contact = session.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.patch("/{contact_id}", response_model=ContactRead)
def update_contact(*, session: Session = Depends(get_session), contact_id: int, contact: ContactUpdate):
    db_contact = session.get(Contact, contact_id)
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    contact_data = contact.model_dump(exclude_unset=True)
    for key, value in contact_data.items():
        setattr(db_contact, key, value)
    session.add(db_contact)
    session.commit()
    session.refresh(db_contact)
    return db_contact

@router.delete("/{contact_id}")
def delete_contact(*, session: Session = Depends(get_session), contact_id: int):
    contact = session.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    session.delete(contact)
    session.commit()
    return {"ok": True}
