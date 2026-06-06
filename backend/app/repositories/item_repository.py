from sqlalchemy.orm import Session
from app.models.item import Expense, CategoryLimit, Reminder, Product, Sale, Post, Message, Friendship
from app.schemas.item import (
    ExpenseCreate, ExpenseUpdate,
    CategoryLimitCreate, CategoryLimitUpdate,
    ReminderCreate, ReminderUpdate,
    ProductCreate, ProductUpdate,
    SaleCreate,
    PostCreate, PostUpdate,
    MessageCreate,
    FriendshipCreate
)
from uuid import UUID
from datetime import datetime
from sqlalchemy import and_, or_

# ==================== Expense Repository ====================
class ExpenseRepository:
    @staticmethod
    def create(db: Session, user_id: UUID, expense: ExpenseCreate) -> Expense:
        db_expense = Expense(
            user_id=user_id,
            category=expense.category,
            amount=expense.amount,
            description=expense.description,
            date=expense.date
        )
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
        return db_expense

    @staticmethod
    def get(db: Session, expense_id: UUID, user_id: UUID) -> Expense:
        return db.query(Expense).filter(
            and_(Expense.id == expense_id, Expense.user_id == user_id)
        ).first()

    @staticmethod
    def list_by_user(db: Session, user_id: UUID) -> list:
        return db.query(Expense).filter(Expense.user_id == user_id).all()

    @staticmethod
    def list_by_category(db: Session, user_id: UUID, category: str) -> list:
        return db.query(Expense).filter(
            and_(Expense.user_id == user_id, Expense.category == category)
        ).all()

    @staticmethod
    def list_by_month(db: Session, user_id: UUID, month: int, year: int) -> list:
        return db.query(Expense).filter(Expense.user_id == user_id).all()

    @staticmethod
    def update(db: Session, expense_id: UUID, user_id: UUID, expense: ExpenseUpdate) -> Expense:
        db_expense = ExpenseRepository.get(db, expense_id, user_id)
        if not db_expense:
            return None
        
        update_data = expense.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_expense, field, value)
        
        db.commit()
        db.refresh(db_expense)
        return db_expense

    @staticmethod
    def delete(db: Session, expense_id: UUID, user_id: UUID) -> bool:
        db_expense = ExpenseRepository.get(db, expense_id, user_id)
        if not db_expense:
            return False
        
        db.delete(db_expense)
        db.commit()
        return True

    @staticmethod
    def get_total_by_category(db: Session, user_id: UUID, category: str, month: int = None, year: int = None) -> float:
        query = db.query(Expense).filter(
            and_(Expense.user_id == user_id, Expense.category == category)
        )
        
        if month is not None and year is not None:
            query = query.filter(
                and_(
                    Expense.date >= datetime(year, month, 1),
                    Expense.date < datetime(year, month + 1 if month < 12 else 12, 1) if month < 12 else datetime(year + 1, 1, 1)
                )
            )
        
        expenses = query.all()
        return sum(e.amount for e in expenses)

# ==================== Category Limit Repository ====================
class CategoryLimitRepository:
    @staticmethod
    def create(db: Session, user_id: UUID, category_limit: CategoryLimitCreate) -> CategoryLimit:
        db_limit = CategoryLimit(
            user_id=user_id,
            category=category_limit.category,
            limit=category_limit.limit
        )
        db.add(db_limit)
        db.commit()
        db.refresh(db_limit)
        return db_limit

    @staticmethod
    def get(db: Session, limit_id: UUID, user_id: UUID) -> CategoryLimit:
        return db.query(CategoryLimit).filter(
            and_(CategoryLimit.id == limit_id, CategoryLimit.user_id == user_id)
        ).first()

    @staticmethod
    def get_by_category(db: Session, user_id: UUID, category: str) -> CategoryLimit:
        return db.query(CategoryLimit).filter(
            and_(CategoryLimit.user_id == user_id, CategoryLimit.category == category)
        ).first()

    @staticmethod
    def list_by_user(db: Session, user_id: UUID) -> list:
        return db.query(CategoryLimit).filter(CategoryLimit.user_id == user_id).all()

    @staticmethod
    def update(db: Session, limit_id: UUID, user_id: UUID, category_limit: CategoryLimitUpdate) -> CategoryLimit:
        db_limit = CategoryLimitRepository.get(db, limit_id, user_id)
        if not db_limit:
            return None
        
        db_limit.limit = category_limit.limit
        db.commit()
        db.refresh(db_limit)
        return db_limit

    @staticmethod
    def delete(db: Session, limit_id: UUID, user_id: UUID) -> bool:
        db_limit = CategoryLimitRepository.get(db, limit_id, user_id)
        if not db_limit:
            return False
        
        db.delete(db_limit)
        db.commit()
        return True

# ==================== Reminder Repository ====================
class ReminderRepository:
    @staticmethod
    def create(db: Session, user_id: UUID, reminder: ReminderCreate) -> Reminder:
        db_reminder = Reminder(
            user_id=user_id,
            title=reminder.title,
            description=reminder.description,
            type=reminder.type,
            due_date=reminder.due_date,
            frequency=reminder.frequency
        )
        db.add(db_reminder)
        db.commit()
        db.refresh(db_reminder)
        return db_reminder

    @staticmethod
    def get(db: Session, reminder_id: UUID, user_id: UUID) -> Reminder:
        return db.query(Reminder).filter(
            and_(Reminder.id == reminder_id, Reminder.user_id == user_id)
        ).first()

    @staticmethod
    def list_by_user(db: Session, user_id: UUID) -> list:
        return db.query(Reminder).filter(Reminder.user_id == user_id).all()

    @staticmethod
    def list_active(db: Session, user_id: UUID) -> list:
        return db.query(Reminder).filter(
            and_(Reminder.user_id == user_id, Reminder.is_active == True)
        ).all()

    @staticmethod
    def update(db: Session, reminder_id: UUID, user_id: UUID, reminder: ReminderUpdate) -> Reminder:
        db_reminder = ReminderRepository.get(db, reminder_id, user_id)
        if not db_reminder:
            return None
        
        update_data = reminder.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_reminder, field, value)
        
        db.commit()
        db.refresh(db_reminder)
        return db_reminder

    @staticmethod
    def delete(db: Session, reminder_id: UUID, user_id: UUID) -> bool:
        db_reminder = ReminderRepository.get(db, reminder_id, user_id)
        if not db_reminder:
            return False
        
        db.delete(db_reminder)
        db.commit()
        return True

# ==================== Product Repository ====================
class ProductRepository:
    @staticmethod
    def create(db: Session, user_id: UUID, product: ProductCreate) -> Product:
        db_product = Product(
            user_id=user_id,
            name=product.name,
            description=product.description,
            price=product.price,
            image_url=product.image_url,
            status=product.status
        )
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def get(db: Session, product_id: UUID) -> Product:
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def list_by_user(db: Session, user_id: UUID) -> list:
        return db.query(Product).filter(Product.user_id == user_id).all()

    @staticmethod
    def list_all(db: Session) -> list:
        return db.query(Product).all()

    @staticmethod
    def update(db: Session, product_id: UUID, user_id: UUID, product: ProductUpdate) -> Product:
        db_product = db.query(Product).filter(
            and_(Product.id == product_id, Product.user_id == user_id)
        ).first()
        if not db_product:
            return None
        
        update_data = product.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def delete(db: Session, product_id: UUID, user_id: UUID) -> bool:
        db_product = db.query(Product).filter(
            and_(Product.id == product_id, Product.user_id == user_id)
        ).first()
        if not db_product:
            return False
        
        db.delete(db_product)
        db.commit()
        return True

# ==================== Sale Repository ====================
class SaleRepository:
    @staticmethod
    def create(db: Session, sale: SaleCreate) -> Sale:
        db_sale = Sale(
            product_id=sale.product_id,
            buyer_id=sale.buyer_id,
            seller_id=sale.seller_id,
            amount=sale.amount,
            delivery_address=sale.delivery_address,
            delivery_city=sale.delivery_city,
            delivery_zip=sale.delivery_zip,
            delivery_phone=sale.delivery_phone
        )
        db.add(db_sale)
        db.commit()
        db.refresh(db_sale)
        return db_sale

    @staticmethod
    def get(db: Session, sale_id: UUID) -> Sale:
        return db.query(Sale).filter(Sale.id == sale_id).first()

    @staticmethod
    def list_by_user(db: Session, user_id: UUID) -> list:
        return db.query(Sale).filter(Sale.seller_id == user_id).all()

    @staticmethod
    def list_purchases(db: Session, user_id: UUID) -> list:
        return db.query(Sale).filter(Sale.buyer_id == user_id).all()

# ==================== Post Repository ====================
class PostRepository:
    @staticmethod
    def create(db: Session, user_id: UUID, post: PostCreate) -> Post:
        db_post = Post(
            user_id=user_id,
            content=post.content,
            video_url=post.video_url,
            is_public=post.is_public
        )
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post

    @staticmethod
    def get(db: Session, post_id: UUID) -> Post:
        return db.query(Post).filter(Post.id == post_id).first()

    @staticmethod
    def list_by_user(db: Session, user_id: UUID) -> list:
        return db.query(Post).filter(Post.user_id == user_id).all()

    @staticmethod
    def list_public(db: Session) -> list:
        return db.query(Post).filter(Post.is_public == True).all()

    @staticmethod
    def update(db: Session, post_id: UUID, user_id: UUID, post: PostUpdate) -> Post:
        db_post = db.query(Post).filter(
            and_(Post.id == post_id, Post.user_id == user_id)
        ).first()
        if not db_post:
            return None
        
        update_data = post.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_post, field, value)
        
        db.commit()
        db.refresh(db_post)
        return db_post

    @staticmethod
    def delete(db: Session, post_id: UUID, user_id: UUID) -> bool:
        db_post = db.query(Post).filter(
            and_(Post.id == post_id, Post.user_id == user_id)
        ).first()
        if not db_post:
            return False
        
        db.delete(db_post)
        db.commit()
        return True

# ==================== Message Repository ====================
class MessageRepository:
    @staticmethod
    def create(db: Session, sender_id: UUID, message: MessageCreate) -> Message:
        db_message = Message(
            sender_id=sender_id,
            receiver_id=message.receiver_id,
            content=message.content,
            post_id=message.post_id
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return db_message

    @staticmethod
    def get(db: Session, message_id: UUID) -> Message:
        return db.query(Message).filter(Message.id == message_id).first()

    @staticmethod
    def list_inbox(db: Session, user_id: UUID) -> list:
        return db.query(Message).filter(Message.receiver_id == user_id).all()

    @staticmethod
    def list_conversation(db: Session, user_id: UUID, other_user_id: UUID) -> list:
        return db.query(Message).filter(
            or_(
                and_(Message.sender_id == user_id, Message.receiver_id == other_user_id),
                and_(Message.sender_id == other_user_id, Message.receiver_id == user_id)
            )
        ).all()

# ==================== Friendship Repository ====================
class FriendshipRepository:
    @staticmethod
    def create(db: Session, user_id: UUID, friendship: FriendshipCreate) -> Friendship:
        db_friendship = Friendship(
            user_id=user_id,
            friend_id=friendship.friend_id,
            status="pending"
        )
        db.add(db_friendship)
        db.commit()
        db.refresh(db_friendship)
        return db_friendship

    @staticmethod
    def get(db: Session, friendship_id: UUID) -> Friendship:
        return db.query(Friendship).filter(Friendship.id == friendship_id).first()

    @staticmethod
    def list_pending(db: Session, user_id: UUID) -> list:
        return db.query(Friendship).filter(
            and_(Friendship.user_id == user_id, Friendship.status == "pending")
        ).all()

    @staticmethod
    def list_friends(db: Session, user_id: UUID) -> list:
        return db.query(Friendship).filter(
            and_(Friendship.user_id == user_id, Friendship.status == "accepted")
        ).all()

    @staticmethod
    def update_status(db: Session, friendship_id: UUID, status: str) -> Friendship:
        db_friendship = FriendshipRepository.get(db, friendship_id)
        if not db_friendship:
            return None
        
        db_friendship.status = status
        db.commit()
        db.refresh(db_friendship)
        return db_friendship
