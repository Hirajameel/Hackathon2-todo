# Research: Backend API Technology Decisions

**Feature**: Secure Multi-User Todo Backend API
**Date**: 2026-02-08
**Status**: Complete

## Overview

This document captures research findings and technology decisions for implementing the FastAPI backend with JWT authentication, SQLModel ORM, and Neon PostgreSQL integration.

---

## 1. JWT Verification with Better Auth

### Decision
Use `python-jose[cryptography]` library to verify JWT tokens with HS256 algorithm using the shared BETTER_AUTH_SECRET.

### Rationale
- Better Auth uses standard JWT format with HS256 (HMAC-SHA256) signing by default
- `python-jose` is the most widely adopted JWT library in the FastAPI ecosystem
- Provides built-in support for token expiration validation and claim extraction
- Well-documented and actively maintained

### Alternatives Considered
- **PyJWT**: Popular but `python-jose` has better FastAPI integration examples
- **authlib**: More comprehensive but overkill for simple JWT verification
- **Custom implementation**: Rejected due to security risks and maintenance burden

### Better Auth JWT Structure
Better Auth tokens typically include these claims:
```json
{
  "sub": "user_id_here",           // Subject (user identifier)
  "email": "user@example.com",     // User email
  "iat": 1234567890,               // Issued at timestamp
  "exp": 1234571490,               // Expiration timestamp
  "iss": "better-auth"             // Issuer
}
```

### Implementation Guidance

**Dependencies**:
```
python-jose[cryptography]==3.3.0
```

**JWT Verification Pattern**:
```python
from jose import JWTError, jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    Verify JWT token and extract user_id.
    Returns user_id on success, raises HTTPException on failure.
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
            raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
```

**Key Points**:
- Extract user_id from `sub` claim (standard JWT subject claim)
- Always validate token expiration (handled automatically by `jwt.decode`)
- Use HTTPBearer security scheme for automatic header extraction
- Return 401 for any token validation failure

---

## 2. SQLModel with Neon PostgreSQL

### Decision
Use SQLModel with asyncpg driver and connection pooling optimized for Neon's serverless architecture.

### Rationale
- SQLModel combines SQLAlchemy ORM with Pydantic validation
- Neon requires SSL connections and benefits from connection pooling
- Serverless PostgreSQL has different connection characteristics than traditional databases
- SQLModel provides type safety and automatic validation

### Alternatives Considered
- **Raw SQLAlchemy**: More verbose, loses Pydantic integration benefits
- **Tortoise ORM**: Async-first but less mature ecosystem
- **Django ORM**: Too heavyweight for FastAPI microservice

### Neon-Specific Considerations
- Neon uses connection pooling at the infrastructure level
- SSL mode must be set to `require` in connection string
- Connection string format: `postgresql://user:pass@host/db?sslmode=require`
- Neon supports standard PostgreSQL wire protocol

### Implementation Guidance

**Dependencies**:
```
sqlmodel==0.0.14
psycopg2-binary==2.9.9
```

**Database Configuration**:
```python
from sqlmodel import create_engine, Session, SQLModel
from app.config import settings

# Create engine with Neon-optimized settings
engine = create_engine(
    settings.NEON_DB_URL,
    echo=settings.LOG_LEVEL == "DEBUG",  # Log SQL in debug mode
    pool_pre_ping=True,                   # Verify connections before use
    pool_size=5,                          # Conservative pool size
    max_overflow=10,                      # Allow burst connections
    pool_recycle=3600,                    # Recycle connections hourly
)

def create_db_and_tables():
    """Create all database tables on startup."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency for database sessions."""
    with Session(engine) as session:
        yield session
```

**Model Definition Pattern**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False, max_length=255)
    title: str = Field(nullable=False, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Key Points**:
- Use `pool_pre_ping=True` to handle Neon's serverless connection behavior
- Set `pool_recycle=3600` to avoid stale connections
- Always include `sslmode=require` in connection string
- Use indexes on `user_id` for query performance

---

## 3. FastAPI Authentication Patterns

### Decision
Implement authentication as a reusable dependency that extracts and validates user_id, with route-level authorization checks.

### Rationale
- FastAPI's dependency injection system is ideal for authentication
- Separates authentication (who are you?) from authorization (what can you do?)
- Reusable across all protected endpoints
- Clear error handling with appropriate HTTP status codes

### Alternatives Considered
- **Middleware-based auth**: Less flexible, harder to make optional per-route
- **Decorator pattern**: Not idiomatic in FastAPI, loses type safety
- **Manual checks in each route**: Violates DRY principle, error-prone

### Implementation Guidance

**Authentication Dependency** (`dependencies.py`):
```python
from fastapi import Depends, HTTPException, Path
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Extract and verify JWT token, return user_id."""
    return verify_token(credentials)  # From research item #1

async def verify_user_access(
    user_id_from_path: Annotated[str, Path()],
    current_user: Annotated[str, Depends(get_current_user)]
) -> str:
    """Verify that JWT user_id matches path user_id."""
    if current_user != user_id_from_path:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this resource."
        )
    return current_user
```

**Route Usage Pattern**:
```python
from fastapi import APIRouter, Depends
from typing import Annotated

router = APIRouter()

@router.get("/api/{user_id}/tasks")
async def get_tasks(
    user_id: Annotated[str, Depends(verify_user_access)],
    session: Annotated[Session, Depends(get_session)]
):
    """Get all tasks for authenticated user."""
    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()
    return tasks
```

**Key Points**:
- Use `HTTPBearer` for automatic Authorization header extraction
- Chain dependencies: `verify_user_access` depends on `get_current_user`
- Return 401 for authentication failures (invalid/missing token)
- Return 403 for authorization failures (user_id mismatch)
- Use `Annotated` for clean type hints with dependencies

---

## 4. CORS Configuration

### Decision
Use FastAPI's built-in `CORSMiddleware` with environment-configurable origins and explicit credential support.

### Rationale
- FastAPI's CORS middleware handles preflight OPTIONS requests automatically
- Environment-based configuration allows different origins per deployment
- Explicit origin list is more secure than wildcard (*)
- Credentials support required for Authorization header

### Alternatives Considered
- **Custom CORS middleware**: Unnecessary complexity, reinventing the wheel
- **Wildcard origins**: Security risk, not recommended for production
- **Nginx/proxy-level CORS**: Adds deployment complexity, less portable

### Implementation Guidance

**CORS Setup** (`main.py`):
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(title="Todo Backend API")

# Parse comma-separated origins from environment
allowed_origins = [
    origin.strip()
    for origin in settings.ALLOWED_ORIGINS.split(",")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,           # Required for Authorization header
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=3600,                     # Cache preflight for 1 hour
)
```

**Environment Configuration**:
```bash
# Development
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Production
ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com
```

**Key Points**:
- Never use `allow_origins=["*"]` with `allow_credentials=True` (not allowed by spec)
- Include both localhost and 127.0.0.1 for development
- Set `max_age` to reduce preflight request overhead
- Explicitly list allowed methods and headers for security
- Parse origins from environment variable for deployment flexibility

---

## 5. Testing Strategy

### Decision
Use pytest with FastAPI TestClient, in-memory SQLite for database tests, and mock JWT tokens for authentication tests.

### Rationale
- FastAPI TestClient provides synchronous testing interface
- SQLite in-memory database is fast and isolated per test
- Mock JWT tokens avoid dependency on actual auth service
- Pytest fixtures enable clean test setup/teardown

### Alternatives Considered
- **Real PostgreSQL for tests**: Slower, requires infrastructure, harder CI setup
- **Database mocking**: Too brittle, doesn't test actual SQL queries
- **Real JWT tokens**: Requires auth service, slower, more complex setup

### Implementation Guidance

**Test Dependencies**:
```
pytest==7.4.3
pytest-cov==4.1.0
httpx==0.25.2  # Required by TestClient
```

**Test Configuration** (`conftest.py`):
```python
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from jose import jwt
from datetime import datetime, timedelta

from app.main import app
from app.dependencies import get_session
from app.config import settings

# In-memory SQLite for tests
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture
def mock_jwt_token():
    """Generate a valid JWT token for testing."""
    def _create_token(user_id: str = "test_user_123"):
        payload = {
            "sub": user_id,
            "email": "test@example.com",
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
        }
        return jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm="HS256")
    return _create_token
```

**Test Pattern Example**:
```python
def test_get_tasks_authenticated(client: TestClient, mock_jwt_token):
    """Test that authenticated user can retrieve their tasks."""
    token = mock_jwt_token("user123")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/user123/tasks", headers=headers)

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_tasks_wrong_user(client: TestClient, mock_jwt_token):
    """Test that user cannot access another user's tasks."""
    token = mock_jwt_token("user123")
    headers = {"Authorization": f"Bearer {token}"}

    # Try to access user456's tasks with user123's token
    response = client.get("/api/user456/tasks", headers=headers)

    assert response.status_code == 403
    assert "permission" in response.json()["detail"].lower()
```

**Key Points**:
- Use SQLite in-memory for fast, isolated database tests
- Override `get_session` dependency to inject test database
- Generate mock JWT tokens with same structure as Better Auth
- Test both success and failure scenarios (401, 403, 404, 422)
- Use `TestClient` for synchronous testing (simpler than async)
- Clear dependency overrides after each test

---

## Summary of Key Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| JWT Verification | python-jose with HS256 | Standard, well-supported, FastAPI-friendly |
| Database | SQLModel + Neon PostgreSQL | Type-safe ORM with Pydantic integration |
| Authentication | Dependency injection pattern | Reusable, type-safe, idiomatic FastAPI |
| CORS | Built-in CORSMiddleware | Automatic preflight handling, secure defaults |
| Testing | pytest + TestClient + SQLite | Fast, isolated, no infrastructure dependencies |

---

## Implementation Readiness

All research questions have been resolved. The team can proceed with:
1. ✅ Data model design (Phase 1)
2. ✅ API contract definition (Phase 1)
3. ✅ Quickstart guide creation (Phase 1)
4. ✅ Task breakdown (Phase 2)

**Next Phase**: Generate data-model.md, contracts/, and quickstart.md
