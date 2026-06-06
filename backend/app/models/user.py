from sqlalchemy import Column, String, Date, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="user")
    category_limits = relationship("CategoryLimit", back_populates="user")
    reminders = relationship("Reminder", back_populates="user")
    products = relationship("Product", back_populates="user")
    posts = relationship("Post", back_populates="user")
    sent_messages = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    received_messages = relationship("Message", back_populates="receiver", foreign_keys="Message.receiver_id")
    sales_as_buyer = relationship("Sale", back_populates="buyer", foreign_keys="Sale.buyer_id")
    sales_as_seller = relationship("Sale", back_populates="seller", foreign_keys="Sale.seller_id")
    friendships_initiated = relationship("Friendship", back_populates="user", foreign_keys="Friendship.user_id")
    friendships_received = relationship("Friendship", back_populates="friend", foreign_keys="Friendship.friend_id")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    username = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    address = Column(Text, nullable=False)
    date_of_birth = Column(Date, nullable=True)
    goal = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="profile")
