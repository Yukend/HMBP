from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional
from uuid import UUID

# ==================== Authentication Schemas ====================
class UserSignUp(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

# ==================== User Profile Schemas ====================
class UserProfileCreate(BaseModel):
    username: str
    mobile: str
    address: str
    date_of_birth: Optional[date] = None
    goal: Optional[str] = None

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    mobile: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    goal: Optional[str] = None

class UserProfileResponse(BaseModel):
    user_id: UUID
    username: str
    mobile: str
    address: str
    date_of_birth: Optional[date]
    goal: Optional[str]

    class Config:
        from_attributes = True

# ==================== User Schemas ====================
class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime
    profile: Optional[UserProfileResponse] = None

    class Config:
        from_attributes = True

class UserDetailResponse(BaseModel):
    id: UUID
    email: str
    username: Optional[str] = None
    mobile: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    goal: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

