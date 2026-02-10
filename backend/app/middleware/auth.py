"""JWT verification middleware."""

from jose import JWTError, jwt
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from app.config import settings


def verify_token(credentials: HTTPAuthorizationCredentials) -> str:
    """
    Verify JWT token and extract user_id.

    Args:
        credentials: HTTP Bearer credentials containing JWT token

    Returns:
        user_id extracted from JWT token

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token: missing user ID"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token."
        )
