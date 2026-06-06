from sqlalchemy.orm import Session
from app.models.user import User, UserProfile
from app.schemas.user import UserSignUp, UserProfileCreate, UserProfileUpdate
from app.utils.hashing import hash_password, verify_password
from uuid import UUID

# ==================== User Repository ====================
class UserRepository:
    @staticmethod
    def create(db: Session, user: UserSignUp) -> User:
        hashed_password = hash_password(user.password)
        db_user = User(
            email=user.email,
            password_hash=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_by_id(db: Session, user_id: UUID) -> User:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> User:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> User:
        user = UserRepository.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    @staticmethod
    def list_all(db: Session) -> list:
        return db.query(User).all()

# ==================== User Profile Repository ====================
class UserProfileRepository:
    @staticmethod
    def create(db: Session, user_id: UUID, profile: UserProfileCreate) -> UserProfile:
        db_profile = UserProfile(
            user_id=user_id,
            username=profile.username,
            mobile=profile.mobile,
            address=profile.address,
            date_of_birth=profile.date_of_birth,
            goal=profile.goal
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile

    @staticmethod
    def get(db: Session, user_id: UUID) -> UserProfile:
        return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    @staticmethod
    def update(db: Session, user_id: UUID, profile: UserProfileUpdate) -> UserProfile:
        db_profile = UserProfileRepository.get(db, user_id)
        if not db_profile:
            return None
        
        update_data = profile.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_profile, field, value)
        
        db.commit()
        db.refresh(db_profile)
        return db_profile

    @staticmethod
    def delete(db: Session, user_id: UUID) -> bool:
        db_profile = UserProfileRepository.get(db, user_id)
        if not db_profile:
            return False
        
        db.delete(db_profile)
        db.commit()
        return True
