"""Database engine and session management."""

from sqlmodel import SQLModel, Session, create_engine
from app.config import settings
import os

# Use SQLite for local development if NEON_DB_URL is not set properly
if os.getenv("USE_SQLITE", "false").lower() == "true" or "sqlite" in settings.NEON_DB_URL.lower():
    # Use SQLite for local development
    engine = create_engine(f"sqlite:///./todo_local.db", echo=settings.LOG_LEVEL == "DEBUG")
else:
    # Create database engine with Neon-optimized settings
    engine = create_engine(
        settings.NEON_DB_URL,
        echo=settings.LOG_LEVEL == "DEBUG",  # Log SQL in debug mode
        pool_pre_ping=True,  # Verify connections before use
        pool_size=5,  # Conservative pool size
        max_overflow=10,  # Allow burst connections
        pool_recycle=3600,  # Recycle connections hourly
    )


def create_db_and_tables():
    """Create all database tables on startup."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency for database sessions."""
    with Session(engine) as session:
        yield session
