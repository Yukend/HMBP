from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.schemas.user import UserProfileCreate, UserProfileResponse
from app.models.user import UserProfile

router = APIRouter(prefix="/profile", tags=["user_profile"])

@router.post("/{user_id}", response_model=UserProfileResponse)
def create_profile(user_id: str, profile: UserProfileCreate, db: Session = Depends(get_db)):
    existing = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")

    new_profile = UserProfile(user_id=user_id, **profile.dict())
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile
