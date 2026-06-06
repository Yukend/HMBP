from sqlalchemy.orm import Session
from app.repositories.item_repository import (
    ExpenseRepository, CategoryLimitRepository, ReminderRepository,
    ProductRepository, SaleRepository, PostRepository, MessageRepository, FriendshipRepository
)
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
from uuid import UUID

# ==================== Expense Service ====================
class ExpenseService:
    @staticmethod
    def create_expense(db: Session, user_id: UUID, expense: ExpenseCreate) -> ExpenseResponse:
        db_expense = ExpenseRepository.create(db, user_id, expense)
        return ExpenseResponse.from_orm(db_expense)

    @staticmethod
    def get_expense(db: Session, expense_id: UUID, user_id: UUID) -> ExpenseResponse:
        db_expense = ExpenseRepository.get(db, expense_id, user_id)
        if not db_expense:
            return None
        return ExpenseResponse.from_orm(db_expense)

    @staticmethod
    def list_expenses(db: Session, user_id: UUID) -> list:
        expenses = ExpenseRepository.list_by_user(db, user_id)
        return [ExpenseResponse.from_orm(e) for e in expenses]

    @staticmethod
    def list_expenses_by_category(db: Session, user_id: UUID, category: str) -> list:
        expenses = ExpenseRepository.list_by_category(db, user_id, category)
        return [ExpenseResponse.from_orm(e) for e in expenses]

    @staticmethod
    def update_expense(db: Session, expense_id: UUID, user_id: UUID, expense: ExpenseUpdate) -> ExpenseResponse:
        db_expense = ExpenseRepository.update(db, expense_id, user_id, expense)
        if not db_expense:
            return None
        return ExpenseResponse.from_orm(db_expense)

    @staticmethod
    def delete_expense(db: Session, expense_id: UUID, user_id: UUID) -> bool:
        return ExpenseRepository.delete(db, expense_id, user_id)

    @staticmethod
    def get_category_total(db: Session, user_id: UUID, category: str, month: int = None, year: int = None) -> float:
        return ExpenseRepository.get_total_by_category(db, user_id, category, month, year)

# ==================== Category Limit Service ====================
class CategoryLimitService:
    @staticmethod
    def create_limit(db: Session, user_id: UUID, category_limit: CategoryLimitCreate) -> CategoryLimitResponse:
        db_limit = CategoryLimitRepository.create(db, user_id, category_limit)
        return CategoryLimitResponse.from_orm(db_limit)

    @staticmethod
    def get_limit(db: Session, limit_id: UUID, user_id: UUID) -> CategoryLimitResponse:
        db_limit = CategoryLimitRepository.get(db, limit_id, user_id)
        if not db_limit:
            return None
        return CategoryLimitResponse.from_orm(db_limit)

    @staticmethod
    def get_limit_by_category(db: Session, user_id: UUID, category: str) -> CategoryLimitResponse:
        db_limit = CategoryLimitRepository.get_by_category(db, user_id, category)
        if not db_limit:
            return None
        return CategoryLimitResponse.from_orm(db_limit)

    @staticmethod
    def list_limits(db: Session, user_id: UUID) -> list:
        limits = CategoryLimitRepository.list_by_user(db, user_id)
        return [CategoryLimitResponse.from_orm(l) for l in limits]

    @staticmethod
    def update_limit(db: Session, limit_id: UUID, user_id: UUID, category_limit: CategoryLimitUpdate) -> CategoryLimitResponse:
        db_limit = CategoryLimitRepository.update(db, limit_id, user_id, category_limit)
        if not db_limit:
            return None
        return CategoryLimitResponse.from_orm(db_limit)

    @staticmethod
    def delete_limit(db: Session, limit_id: UUID, user_id: UUID) -> bool:
        return CategoryLimitRepository.delete(db, limit_id, user_id)

# ==================== Reminder Service ====================
class ReminderService:
    @staticmethod
    def create_reminder(db: Session, user_id: UUID, reminder: ReminderCreate) -> ReminderResponse:
        db_reminder = ReminderRepository.create(db, user_id, reminder)
        return ReminderResponse.from_orm(db_reminder)

    @staticmethod
    def get_reminder(db: Session, reminder_id: UUID, user_id: UUID) -> ReminderResponse:
        db_reminder = ReminderRepository.get(db, reminder_id, user_id)
        if not db_reminder:
            return None
        return ReminderResponse.from_orm(db_reminder)

    @staticmethod
    def list_reminders(db: Session, user_id: UUID) -> list:
        reminders = ReminderRepository.list_by_user(db, user_id)
        return [ReminderResponse.from_orm(r) for r in reminders]

    @staticmethod
    def list_active_reminders(db: Session, user_id: UUID) -> list:
        reminders = ReminderRepository.list_active(db, user_id)
        return [ReminderResponse.from_orm(r) for r in reminders]

    @staticmethod
    def update_reminder(db: Session, reminder_id: UUID, user_id: UUID, reminder: ReminderUpdate) -> ReminderResponse:
        db_reminder = ReminderRepository.update(db, reminder_id, user_id, reminder)
        if not db_reminder:
            return None
        return ReminderResponse.from_orm(db_reminder)

    @staticmethod
    def delete_reminder(db: Session, reminder_id: UUID, user_id: UUID) -> bool:
        return ReminderRepository.delete(db, reminder_id, user_id)

# ==================== Product Service ====================
class ProductService:
    @staticmethod
    def create_product(db: Session, user_id: UUID, product: ProductCreate) -> ProductResponse:
        db_product = ProductRepository.create(db, user_id, product)
        return ProductResponse.from_orm(db_product)

    @staticmethod
    def get_product(db: Session, product_id: UUID) -> ProductResponse:
        db_product = ProductRepository.get(db, product_id)
        if not db_product:
            return None
        return ProductResponse.from_orm(db_product)

    @staticmethod
    def list_products_by_user(db: Session, user_id: UUID) -> list:
        products = ProductRepository.list_by_user(db, user_id)
        return [ProductResponse.from_orm(p) for p in products]

    @staticmethod
    def list_all_products(db: Session) -> list:
        products = ProductRepository.list_all(db)
        return [ProductResponse.from_orm(p) for p in products]

    @staticmethod
    def update_product(db: Session, product_id: UUID, user_id: UUID, product: ProductUpdate) -> ProductResponse:
        db_product = ProductRepository.update(db, product_id, user_id, product)
        if not db_product:
            return None
        return ProductResponse.from_orm(db_product)

    @staticmethod
    def delete_product(db: Session, product_id: UUID, user_id: UUID) -> bool:
        return ProductRepository.delete(db, product_id, user_id)

# ==================== Sale Service ====================
class SaleService:
    @staticmethod
    def create_sale(db: Session, sale: SaleCreate) -> SaleResponse:
        db_sale = SaleRepository.create(db, sale)
        return SaleResponse.from_orm(db_sale)

    @staticmethod
    def get_sale(db: Session, sale_id: UUID) -> SaleResponse:
        db_sale = SaleRepository.get(db, sale_id)
        if not db_sale:
            return None
        return SaleResponse.from_orm(db_sale)

    @staticmethod
    def list_sales_by_user(db: Session, user_id: UUID) -> list:
        sales = SaleRepository.list_by_user(db, user_id)
        return [SaleResponse.from_orm(s) for s in sales]

    @staticmethod
    def list_purchases(db: Session, user_id: UUID) -> list:
        sales = SaleRepository.list_purchases(db, user_id)
        return [SaleResponse.from_orm(s) for s in sales]

# ==================== Post Service ====================
class PostService:
    @staticmethod
    def create_post(db: Session, user_id: UUID, post: PostCreate) -> PostResponse:
        db_post = PostRepository.create(db, user_id, post)
        return PostResponse.from_orm(db_post)

    @staticmethod
    def get_post(db: Session, post_id: UUID) -> PostResponse:
        db_post = PostRepository.get(db, post_id)
        if not db_post:
            return None
        return PostResponse.from_orm(db_post)

    @staticmethod
    def list_posts_by_user(db: Session, user_id: UUID) -> list:
        posts = PostRepository.list_by_user(db, user_id)
        return [PostResponse.from_orm(p) for p in posts]

    @staticmethod
    def list_public_posts(db: Session) -> list:
        posts = PostRepository.list_public(db)
        return [PostResponse.from_orm(p) for p in posts]

    @staticmethod
    def update_post(db: Session, post_id: UUID, user_id: UUID, post: PostUpdate) -> PostResponse:
        db_post = PostRepository.update(db, post_id, user_id, post)
        if not db_post:
            return None
        return PostResponse.from_orm(db_post)

    @staticmethod
    def delete_post(db: Session, post_id: UUID, user_id: UUID) -> bool:
        return PostRepository.delete(db, post_id, user_id)

# ==================== Message Service ====================
class MessageService:
    @staticmethod
    def create_message(db: Session, sender_id: UUID, message: MessageCreate) -> MessageResponse:
        db_message = MessageRepository.create(db, sender_id, message)
        return MessageResponse.from_orm(db_message)

    @staticmethod
    def get_message(db: Session, message_id: UUID) -> MessageResponse:
        db_message = MessageRepository.get(db, message_id)
        if not db_message:
            return None
        return MessageResponse.from_orm(db_message)

    @staticmethod
    def list_inbox(db: Session, user_id: UUID) -> list:
        messages = MessageRepository.list_inbox(db, user_id)
        return [MessageResponse.from_orm(m) for m in messages]

    @staticmethod
    def list_conversation(db: Session, user_id: UUID, other_user_id: UUID) -> list:
        messages = MessageRepository.list_conversation(db, user_id, other_user_id)
        return [MessageResponse.from_orm(m) for m in messages]

# ==================== Friendship Service ====================
class FriendshipService:
    @staticmethod
    def send_friend_request(db: Session, user_id: UUID, friendship: FriendshipCreate) -> FriendshipResponse:
        db_friendship = FriendshipRepository.create(db, user_id, friendship)
        return FriendshipResponse.from_orm(db_friendship)

    @staticmethod
    def get_friendship(db: Session, friendship_id: UUID) -> FriendshipResponse:
        db_friendship = FriendshipRepository.get(db, friendship_id)
        if not db_friendship:
            return None
        return FriendshipResponse.from_orm(db_friendship)

    @staticmethod
    def list_pending_requests(db: Session, user_id: UUID) -> list:
        friendships = FriendshipRepository.list_pending(db, user_id)
        return [FriendshipResponse.from_orm(f) for f in friendships]

    @staticmethod
    def list_friends(db: Session, user_id: UUID) -> list:
        friendships = FriendshipRepository.list_friends(db, user_id)
        return [FriendshipResponse.from_orm(f) for f in friendships]

    @staticmethod
    def accept_friend_request(db: Session, friendship_id: UUID) -> FriendshipResponse:
        db_friendship = FriendshipRepository.update_status(db, friendship_id, "accepted")
        if not db_friendship:
            return None
        return FriendshipResponse.from_orm(db_friendship)

    @staticmethod
    def reject_friend_request(db: Session, friendship_id: UUID) -> FriendshipResponse:
        db_friendship = FriendshipRepository.update_status(db, friendship_id, "rejected")
        if not db_friendship:
            return None
        return FriendshipResponse.from_orm(db_friendship)
