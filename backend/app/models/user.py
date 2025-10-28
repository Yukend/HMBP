from sqlalchemy import Column, String, Date, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(String, nullable=False)

class UserProfile(Base):
    __tablename__ = "user_profiles"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    username = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    address = Column(Text, nullable=False)
    date_of_birth = Column(Date, nullable=True)
    goal = Column(Text, nullable=True)
