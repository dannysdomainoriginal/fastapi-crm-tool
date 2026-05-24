from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from database import get_session
from models import Task, TaskCreate, TaskRead, TaskUpdate, User
from routers.auth import get_current_user

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=TaskRead)
async def create_task(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), task: TaskCreate):
    db_task = Task.model_validate(task, update={"user_id": current_user.id})
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskRead])
async def read_tasks(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), offset: int = 0, limit: int = Query(default=100, le=100)):
    statement = select(Task).where(Task.user_id == current_user.id).offset(offset).limit(limit)
    result = await session.execute(statement)
    tasks = result.scalars().all()
    return tasks

@router.get("/{task_id}", response_model=TaskRead)
async def read_task(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), task_id: int):
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}", response_model=TaskRead)
async def update_task(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), task_id: int, task: TaskUpdate):
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_data = task.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
async def delete_task(*, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user), task_id: int):
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await session.delete(task)
    await session.commit()
    return {"ok": True}
