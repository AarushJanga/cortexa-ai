from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, AuthenticatedUser
from app.core.database import db
from app.models.schemas import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=ProfileResponse)
async def get_my_profile(current_user: AuthenticatedUser = Depends(get_current_user)):
    profile = await db.get_profile(current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.patch("", response_model=ProfileResponse)
async def update_my_profile(
    updates: ProfileUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    clean_updates = {k: v for k, v in updates.model_dump().items() if v is not None}
    updated = await db.update_profile(current_user.id, clean_updates)
    return updated
