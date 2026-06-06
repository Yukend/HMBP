# app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.db.base import get_db
from app.models.user import User, UserProfile
from app.schemas.user import UserSignUp, UserResponse, Token
from app.core.security import create_access_token, verify_password, get_password_hash
from app.db.dependencies import get_current_user
from app.core.logging import logger

# Response schema for signup/login
class AuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = "bearer"

# Login request schema
class LoginRequest(BaseModel):
    username: EmailStr
    password: str

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/signup", response_model=AuthResponse)
def signup(user_in: UserSignUp, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = create_access_token({"sub": str(new_user.id)})
    return {
        "user": new_user,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/login", response_model=AuthResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": str(user.id)})
    return {
        "user": user,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user info"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "created_at": current_user.created_at
    }
