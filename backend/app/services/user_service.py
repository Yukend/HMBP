from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository, UserProfileRepository
from app.schemas.user import UserSignUp, UserProfileCreate, UserProfileUpdate, UserResponse, UserDetailResponse, UserProfileResponse
from app.utils.jwt_utils import create_access_token
from uuid import UUID

# ==================== User Service ====================
class UserService:
    @staticmethod
    def sign_up(db: Session, user: UserSignUp) -> dict:
        # Check if user already exists
        existing_user = UserRepository.get_by_email(db, user.email)
        if existing_user:
            return None
        
        # Create new user
        db_user = UserRepository.create(db, user)
        access_token = create_access_token(data={"sub": db_user.email})
        
        return {
            "user": UserResponse.from_orm(db_user),
            "access_token": access_token,
            "token_type": "bearer"
        }

    @staticmethod
    def sign_in(db: Session, email: str, password: str) -> dict:
        user = UserRepository.authenticate(db, email, password)
        if not user:
            return None
        
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "user": UserResponse.from_orm(user),
            "access_token": access_token,
            "token_type": "bearer"
        }

    @staticmethod
    def get_user(db: Session, user_id: UUID) -> UserResponse:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            return None
        return UserResponse.from_orm(user)

    @staticmethod
    def get_user_detail(db: Session, user_id: UUID) -> UserDetailResponse:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            return None
        return UserDetailResponse.from_orm(user)

    @staticmethod
    def list_all_users(db: Session) -> list:
        users = UserRepository.list_all(db)
        return [UserResponse.from_orm(u) for u in users]

# ==================== User Profile Service ====================
class UserProfileService:
    @staticmethod
    def create_profile(db: Session, user_id: UUID, profile: UserProfileCreate) -> UserProfileResponse:
        db_profile = UserProfileRepository.create(db, user_id, profile)
        return UserProfileResponse.from_orm(db_profile)

    @staticmethod
    def get_profile(db: Session, user_id: UUID) -> UserProfileResponse:
        db_profile = UserProfileRepository.get(db, user_id)
        if not db_profile:
            return None
        return UserProfileResponse.from_orm(db_profile)

    @staticmethod
    def update_profile(db: Session, user_id: UUID, profile: UserProfileUpdate) -> UserProfileResponse:
        db_profile = UserProfileRepository.update(db, user_id, profile)
        if not db_profile:
            return None
        return UserProfileResponse.from_orm(db_profile)

    @staticmethod
    def delete_profile(db: Session, user_id: UUID) -> bool:
        return UserProfileRepository.delete(db, user_id)
