"""Authentication API routes."""

import logging
from datetime import datetime, timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from jose import jwt
from passlib.context import CryptContext

from app.models import User
from app.schemas import UserSignup, UserLogin, AuthResponse, UserResponse
from app.dependencies import SessionDep
from app.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create router for auth endpoints
router = APIRouter(
    prefix="/api/auth",
    tags=["authentication"]
)


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: int) -> str:
    """
    Create a JWT access token for a user.

    Args:
        user_id: User's database ID

    Returns:
        JWT token string
    """
    expire = datetime.utcnow() + timedelta(days=7)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm="HS256")
    return token


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserSignup,
    session: SessionDep
):
    """
    Register a new user account.

    Args:
        user_data: User signup data (email, password)
        session: Database session

    Returns:
        User info and JWT token

    Raises:
        HTTPException: 400 if email already exists, 500 on server error
    """
    try:
        # Check if user already exists
        statement = select(User).where(User.email == user_data.email)
        existing_user = session.exec(statement).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user with hashed password
        hashed_password = hash_password(user_data.password)
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password
        )

        # Save to database
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # Generate JWT token
        token = create_access_token(new_user.id)

        # Return user info and token
        return AuthResponse(
            user=UserResponse(id=new_user.id, email=new_user.email),
            token=token
        )

    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        logger.error(f"Error during signup: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during signup."
        )


@router.post("/login", response_model=AuthResponse)
async def login(
    user_data: UserLogin,
    session: SessionDep
):
    """
    Authenticate user and return JWT token.

    Args:
        user_data: User login data (email, password)
        session: Database session

    Returns:
        User info and JWT token

    Raises:
        HTTPException: 401 if credentials invalid, 500 on server error
    """
    try:
        # Find user by email
        statement = select(User).where(User.email == user_data.email)
        user = session.exec(statement).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Verify password
        if not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Generate JWT token
        token = create_access_token(user.id)

        # Return user info and token
        return AuthResponse(
            user=UserResponse(id=user.id, email=user.email),
            token=token
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during login."
        )
