from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# ==================== Expense Schemas ====================
class ExpenseCreate(BaseModel):
    category: str
    amount: float = Field(..., gt=0)
    description: str
    date: datetime

class ExpenseUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    date: Optional[datetime] = None

class ExpenseResponse(BaseModel):
    id: UUID
    user_id: UUID
    category: str
    amount: float
    description: str
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== Category Limit Schemas ====================
class CategoryLimitCreate(BaseModel):
    category: str
    limit: float = Field(..., gt=0)

class CategoryLimitUpdate(BaseModel):
    limit: float = Field(..., gt=0)

class CategoryLimitResponse(BaseModel):
    id: UUID
    user_id: UUID
    category: str
    limit: float
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== Reminder Schemas ====================
class ReminderCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: str  # 'emi', 'bill', 'appointment', 'warranty', 'other'
    due_date: datetime
    frequency: str  # 'once', 'daily', 'weekly', 'monthly'

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    due_date: Optional[datetime] = None
    frequency: Optional[str] = None
    is_active: Optional[bool] = None

class ReminderResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    type: str
    due_date: datetime
    frequency: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== Product Schemas ====================
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    image_url: Optional[str] = None
    status: str = "available"

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    image_url: Optional[str] = None
    status: Optional[str] = None

class ProductResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    description: Optional[str]
    price: float
    image_url: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== Sale Schemas ====================
class SaleCreate(BaseModel):
    product_id: UUID
    buyer_id: UUID
    amount: float = Field(..., gt=0)
    delivery_address: str
    delivery_city: str
    delivery_zip: str
    delivery_phone: str

class SaleResponse(BaseModel):
    id: UUID
    product_id: UUID
    buyer_id: UUID
    seller_id: UUID
    amount: float
    delivery_address: str
    delivery_city: str
    delivery_zip: str
    delivery_phone: str
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== Post Schemas ====================
class PostCreate(BaseModel):
    content: str
    video_url: Optional[str] = None
    is_public: bool = False

class PostUpdate(BaseModel):
    content: Optional[str] = None
    video_url: Optional[str] = None
    is_public: Optional[bool] = None

class PostResponse(BaseModel):
    id: UUID
    user_id: UUID
    content: str
    video_url: Optional[str]
    is_public: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== Message Schemas ====================
class MessageCreate(BaseModel):
    receiver_id: UUID
    content: str
    post_id: Optional[UUID] = None

class MessageResponse(BaseModel):
    id: UUID
    sender_id: UUID
    receiver_id: UUID
    content: str
    post_id: Optional[UUID]
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== Friendship Schemas ====================
class FriendshipCreate(BaseModel):
    friend_id: UUID

class FriendshipResponse(BaseModel):
    id: UUID
    user_id: UUID
    friend_id: UUID
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
