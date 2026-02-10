"""Dependency injection for authentication and database."""

from typing import Annotated
from fastapi import Depends, HTTPException, Path
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from app.database import get_session
from app.middleware.auth import verify_token

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Extract and verify JWT token, return user_id.

    Args:
        credentials: HTTP Bearer credentials

    Returns:
        user_id from JWT token
    """
    return verify_token(credentials)


async def verify_user_access(
    user_id: Annotated[str, Path()],
    current_user: Annotated[str, Depends(get_current_user)]
) -> str:
    """
    Verify that JWT user_id matches path user_id.

    Args:
        user_id: user_id from URL path parameter
        current_user: user_id from JWT token

    Returns:
        current_user if access is granted

    Raises:
        HTTPException: 403 if user_id mismatch
    """
    if current_user != user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this resource."
        )
    return current_user


# Type alias for database session dependency
SessionDep = Annotated[Session, Depends(get_session)]
