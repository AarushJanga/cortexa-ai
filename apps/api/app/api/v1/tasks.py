from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, AuthenticatedUser
from app.core.database import db
from app.models.schemas import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=List[TaskResponse])
async def list_tasks(current_user: AuthenticatedUser = Depends(get_current_user)):
    return await db.get_tasks(current_user.id)


@router.post("", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    return await db.create_task(current_user.id, task.model_dump())


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    updates: TaskUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    clean = {k: v for k, v in updates.model_dump().items() if v is not None}
    updated = await db.update_task(task_id, current_user.id, clean)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found or access denied")
    return updated


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    success = await db.delete_task(task_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found or access denied")
    return {"message": "Task deleted successfully"}
