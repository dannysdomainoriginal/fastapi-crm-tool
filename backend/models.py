from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class ContactBase(SQLModel):
    name: str = Field(index=True)
    email: Optional[str] = Field(default=None, index=True)
    phone: Optional[str] = Field(default=None)
    company: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None)

class Contact(ContactBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deals: List["Deal"] = Relationship(back_populates="contact")

class ContactCreate(ContactBase):
    pass

class ContactRead(ContactBase):
    id: int

class ContactUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None

class DealBase(SQLModel):
    title: str
    value: float
    stage: str = Field(default="Lead")
    contact_id: Optional[int] = Field(default=None, foreign_key="contact.id")

class Deal(DealBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    contact: Optional[Contact] = Relationship(back_populates="deals")

class DealCreate(DealBase):
    pass

class DealRead(DealBase):
    id: int

class DealUpdate(SQLModel):
    title: Optional[str] = None
    value: Optional[float] = None
    stage: Optional[str] = None
    contact_id: Optional[int] = None

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)
    status: str = Field(default="Pending")
    related_to: Optional[str] = Field(default=None)

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    related_to: Optional[str] = None
