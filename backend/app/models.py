"""Database models using SQLModel."""

from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    """User entity for authentication."""

    __tablename__ = "users"

    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        description="Unique user identifier"
    )

    email: str = Field(
        unique=True,
        index=True,
        nullable=False,
        max_length=255,
        description="User email address (unique)"
    )

    hashed_password: str = Field(
        nullable=False,
        description="Bcrypt hashed password"
    )

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Account creation timestamp (UTC)"
    )


class Task(SQLModel, table=True):
    """Task entity representing a todo item."""

    __tablename__ = "tasks"

    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        description="Unique task identifier"
    )

    user_id: str = Field(
        index=True,
        nullable=False,
        max_length=255,
        description="Owner's user identifier from JWT token"
    )

    title: str = Field(
        nullable=False,
        max_length=200,
        min_length=1,
        description="Task title (required, 1-200 characters)"
    )

    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional task description (max 1000 characters)"
    )

    completed: bool = Field(
        default=False,
        nullable=False,
        description="Task completion status"
    )

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Creation timestamp (UTC)"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Last update timestamp (UTC)"
    )
