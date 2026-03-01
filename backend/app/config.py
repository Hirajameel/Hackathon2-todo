"""Application configuration management using pydantic-settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database Configuration
    NEON_DB_URL: str = ""

    # Authentication Configuration
    BETTER_AUTH_SECRET: str = "your-secret-key-here"
    BETTER_AUTH_URL: str = "http://localhost:8000"

    # CORS Configuration
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Server Configuration
    PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Global settings instance
settings = Settings()

# Validate required settings
if not settings.NEON_DB_URL:
    raise ValueError("NEON_DB_URL environment variable is required")
