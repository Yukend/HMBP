# app/api/v1/endpoints/profile.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.db.dependencies import get_current_user
from app.models.user import User, UserProfile
from app.schemas.user import UserProfileCreate, UserProfileResponse

router = APIRouter(prefix="/profile", tags=["profile"])

@router.post("/", response_model=UserProfileResponse)
def create_profile(
    profile_in: UserProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if profile already exists
    existing_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")

    new_profile = UserProfile(
        user_id=current_user.id,
        username=profile_in.username,
        mobile=profile_in.mobile,
        address=profile_in.address,
        date_of_birth=profile_in.date_of_birth,
        goal=profile_in.goal,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile


@router.get("/", response_model=UserProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
