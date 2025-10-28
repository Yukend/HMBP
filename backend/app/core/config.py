from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # --- App Metadata ---
    PROJECT_NAME: str = "Home Management System"
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:8082",  # your frontend port
    ]

    # --- Database ---
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "home_mgmt"

    @property
    def DATABASE_URL(self) -> str:
        """Return SQLAlchemy-compatible PostgreSQL connection string."""
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # --- JWT Settings ---
    JWT_SECRET_KEY: str = "your-secret-key-change-this"  # use os.urandom(24).hex() in prod
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # --- Misc ---
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Cache the settings instance for performance."""
    return Settings()
