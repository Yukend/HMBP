from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
import uuid

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    created_at: str

class UserProfileBase(BaseModel):
    username: str
    mobile: str
    address: str
    date_of_birth: Optional[date] = None
    goal: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    user_id: uuid.UUID
