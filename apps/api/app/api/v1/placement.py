from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, AuthenticatedUser
from app.core.database import db
from app.models.schemas import PlacementApplicationCreate, PlacementApplicationResponse

router = APIRouter(prefix="/career/applications", tags=["Placement Tracker"])


@router.get("", response_model=List[PlacementApplicationResponse])
async def list_applications(current_user: AuthenticatedUser = Depends(get_current_user)):
    return await db.get_placement_applications(current_user.id)


@router.post("", response_model=PlacementApplicationResponse)
async def create_application(
    app: PlacementApplicationCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    return await db.create_placement_application(current_user.id, app.model_dump())


@router.patch("/{app_id}", response_model=PlacementApplicationResponse)
async def update_application(
    app_id: str,
    updates: PlacementApplicationCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    clean = {k: v for k, v in updates.model_dump().items() if v is not None}
    updated = await db.update_placement_application(app_id, current_user.id, clean)
    if not updated:
        raise HTTPException(status_code=404, detail="Application not found or access denied")
    return updated


@router.delete("/{app_id}")
async def delete_application(
    app_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    success = await db.delete_placement_application(app_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found or access denied")
    return {"message": "Application deleted"}
