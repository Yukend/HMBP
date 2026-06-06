from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.dependencies import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.item import (
    ExpenseCreate, ExpenseUpdate, ExpenseResponse,
    CategoryLimitCreate, CategoryLimitUpdate, CategoryLimitResponse,
    ReminderCreate, ReminderUpdate, ReminderResponse,
    ProductCreate, ProductUpdate, ProductResponse,
    SaleCreate, SaleResponse,
    PostCreate, PostUpdate, PostResponse,
    MessageCreate, MessageResponse,
    FriendshipCreate, FriendshipResponse
)
from app.services.item_service import (
    ExpenseService, CategoryLimitService, ReminderService,
    ProductService, SaleService, PostService, MessageService, FriendshipService
)
from app.models.user import User

router = APIRouter(prefix="/api/v1", tags=["items"])

# ==================== Expense Endpoints ====================
@router.post("/expenses", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new expense"""
    return ExpenseService.create_expense(db, current_user.id, expense)

@router.get("/expenses/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific expense"""
    expense = ExpenseService.get_expense(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.get("/expenses", response_model=list[ExpenseResponse])
def list_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all expenses for the current user"""
    return ExpenseService.list_expenses(db, current_user.id)

@router.get("/expenses/category/{category}", response_model=list[ExpenseResponse])
def list_expenses_by_category(
    category: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List expenses by category"""
    return ExpenseService.list_expenses_by_category(db, current_user.id, category)

@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: UUID,
    expense: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an expense"""
    updated_expense = ExpenseService.update_expense(db, expense_id, current_user.id, expense)
    if not updated_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated_expense

@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an expense"""
    if not ExpenseService.delete_expense(db, expense_id, current_user.id):
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"status": "success"}

@router.get("/expenses/category/{category}/total")
def get_category_total(
    category: str,
    month: int = None,
    year: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get total spending for a category in a specific month"""
    total = ExpenseService.get_category_total(db, current_user.id, category, month, year)
    return {"category": category, "total": total, "month": month, "year": year}

# ==================== Category Limit Endpoints ====================
@router.post("/category-limits", response_model=CategoryLimitResponse)
def create_category_limit(
    category_limit: CategoryLimitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new category limit"""
    return CategoryLimitService.create_limit(db, current_user.id, category_limit)

@router.get("/category-limits/{limit_id}", response_model=CategoryLimitResponse)
def get_category_limit(
    limit_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific category limit"""
    limit = CategoryLimitService.get_limit(db, limit_id, current_user.id)
    if not limit:
        raise HTTPException(status_code=404, detail="Category limit not found")
    return limit

@router.get("/category-limits", response_model=list[CategoryLimitResponse])
def list_category_limits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all category limits for the current user"""
    return CategoryLimitService.list_limits(db, current_user.id)

@router.get("/category-limits/category/{category}", response_model=CategoryLimitResponse)
def get_limit_by_category(
    category: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get limit for a specific category"""
    limit = CategoryLimitService.get_limit_by_category(db, current_user.id, category)
    if not limit:
        raise HTTPException(status_code=404, detail="Category limit not found")
    return limit

@router.put("/category-limits/{limit_id}", response_model=CategoryLimitResponse)
def update_category_limit(
    limit_id: UUID,
    category_limit: CategoryLimitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a category limit"""
    updated_limit = CategoryLimitService.update_limit(db, limit_id, current_user.id, category_limit)
    if not updated_limit:
        raise HTTPException(status_code=404, detail="Category limit not found")
    return updated_limit

@router.delete("/category-limits/{limit_id}")
def delete_category_limit(
    limit_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a category limit"""
    if not CategoryLimitService.delete_limit(db, limit_id, current_user.id):
        raise HTTPException(status_code=404, detail="Category limit not found")
    return {"status": "success"}

# ==================== Reminder Endpoints ====================
@router.post("/reminders", response_model=ReminderResponse)
def create_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new reminder"""
    return ReminderService.create_reminder(db, current_user.id, reminder)

@router.get("/reminders/{reminder_id}", response_model=ReminderResponse)
def get_reminder(
    reminder_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific reminder"""
    reminder = ReminderService.get_reminder(db, reminder_id, current_user.id)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder

@router.get("/reminders", response_model=list[ReminderResponse])
def list_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all reminders for the current user"""
    return ReminderService.list_reminders(db, current_user.id)

@router.get("/reminders/active/list", response_model=list[ReminderResponse])
def list_active_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List active reminders for the current user"""
    return ReminderService.list_active_reminders(db, current_user.id)

@router.put("/reminders/{reminder_id}", response_model=ReminderResponse)
def update_reminder(
    reminder_id: UUID,
    reminder: ReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a reminder"""
    updated_reminder = ReminderService.update_reminder(db, reminder_id, current_user.id, reminder)
    if not updated_reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return updated_reminder

@router.delete("/reminders/{reminder_id}")
def delete_reminder(
    reminder_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a reminder"""
    if not ReminderService.delete_reminder(db, reminder_id, current_user.id):
        raise HTTPException(status_code=404, detail="Reminder not found")
    return {"status": "success"}

# ==================== Product (Marketplace) Endpoints ====================
@router.post("/products", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new product for marketplace"""
    return ProductService.create_product(db, current_user.id, product)

@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific product"""
    product = ProductService.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/products", response_model=list[ProductResponse])
def list_all_products(
    db: Session = Depends(get_db)
):
    """List all available products"""
    return ProductService.list_all_products(db)

@router.get("/my-products", response_model=list[ProductResponse])
def list_my_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List products created by the current user"""
    return ProductService.list_products_by_user(db, current_user.id)

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: UUID,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a product"""
    updated_product = ProductService.update_product(db, product_id, current_user.id, product)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product

@router.delete("/products/{product_id}")
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a product"""
    if not ProductService.delete_product(db, product_id, current_user.id):
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success"}

# ==================== Sale Endpoints ====================
@router.post("/sales", response_model=SaleResponse)
def create_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new sale (buy a product)"""
    return SaleService.create_sale(db, sale)

@router.get("/sales/{sale_id}", response_model=SaleResponse)
def get_sale(
    sale_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific sale"""
    sale = SaleService.get_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.get("/my-sales", response_model=list[SaleResponse])
def list_my_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List sales made by the current user"""
    return SaleService.list_sales_by_user(db, current_user.id)

@router.get("/my-purchases", response_model=list[SaleResponse])
def list_my_purchases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List purchases made by the current user"""
    return SaleService.list_purchases(db, current_user.id)

# ==================== Post (Social) Endpoints ====================
@router.post("/posts", response_model=PostResponse)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new social post"""
    return PostService.create_post(db, current_user.id, post)

@router.get("/posts/{post_id}", response_model=PostResponse)
def get_post(
    post_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific post"""
    post = PostService.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.get("/posts", response_model=list[PostResponse])
def list_public_posts(
    db: Session = Depends(get_db)
):
    """List all public posts"""
    return PostService.list_public_posts(db)

@router.get("/my-posts", response_model=list[PostResponse])
def list_my_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List posts created by the current user"""
    return PostService.list_posts_by_user(db, current_user.id)

@router.put("/posts/{post_id}", response_model=PostResponse)
def update_post(
    post_id: UUID,
    post: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a post"""
    updated_post = PostService.update_post(db, post_id, current_user.id, post)
    if not updated_post:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated_post

@router.delete("/posts/{post_id}")
def delete_post(
    post_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a post"""
    if not PostService.delete_post(db, post_id, current_user.id):
        raise HTTPException(status_code=404, detail="Post not found")
    return {"status": "success"}

# ==================== Message Endpoints ====================
@router.post("/messages", response_model=MessageResponse)
def send_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a message"""
    return MessageService.create_message(db, current_user.id, message)

@router.get("/messages/{message_id}", response_model=MessageResponse)
def get_message(
    message_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific message"""
    message = MessageService.get_message(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

@router.get("/messages", response_model=list[MessageResponse])
def list_inbox(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all messages in inbox"""
    return MessageService.list_inbox(db, current_user.id)

@router.get("/messages/conversation/{user_id}", response_model=list[MessageResponse])
def list_conversation(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List conversation with a specific user"""
    return MessageService.list_conversation(db, current_user.id, user_id)

# ==================== Friendship Endpoints ====================
@router.post("/friendships", response_model=FriendshipResponse)
def send_friend_request(
    friendship: FriendshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a friend request"""
    return FriendshipService.send_friend_request(db, current_user.id, friendship)

@router.get("/friendships/{friendship_id}", response_model=FriendshipResponse)
def get_friendship(
    friendship_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific friendship"""
    friendship = FriendshipService.get_friendship(db, friendship_id)
    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")
    return friendship

@router.get("/friendships/pending/list", response_model=list[FriendshipResponse])
def list_pending_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List pending friend requests"""
    return FriendshipService.list_pending_requests(db, current_user.id)

@router.get("/friendships/accepted/list", response_model=list[FriendshipResponse])
def list_friends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List accepted friends"""
    return FriendshipService.list_friends(db, current_user.id)

@router.put("/friendships/{friendship_id}/accept", response_model=FriendshipResponse)
def accept_friend_request(
    friendship_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Accept a friend request"""
    friendship = FriendshipService.accept_friend_request(db, friendship_id)
    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")
    return friendship

@router.put("/friendships/{friendship_id}/reject", response_model=FriendshipResponse)
def reject_friend_request(
    friendship_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Reject a friend request"""
    friendship = FriendshipService.reject_friend_request(db, friendship_id)
    if not friendship:
        raise HTTPException(status_code=404, detail="Friendship not found")
    return friendship
