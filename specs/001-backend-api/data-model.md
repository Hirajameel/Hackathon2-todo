# Data Model: Backend API

**Feature**: Secure Multi-User Todo Backend API
**Date**: 2026-02-08
**Database**: Neon PostgreSQL (Serverless)
**ORM**: SQLModel 0.0.14+

## Overview

This document defines the database schema, entities, relationships, and constraints for the Todo Backend API. The data model enforces user isolation at the database level and supports all functional requirements defined in the specification.

---

## Entities

### Task

Represents a todo item owned by a specific user.

**Table Name**: `tasks`

**Attributes**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique task identifier |
| `user_id` | VARCHAR(255) | NOT NULL, INDEXED | Owner's user identifier from JWT |
| `title` | VARCHAR(200) | NOT NULL | Task title (required) |
| `description` | TEXT | NULLABLE | Optional task description (max 1000 chars) |
| `completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp (UTC) |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp (UTC) |

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

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
```

---

## Indexes

### Primary Index
- **Index Name**: `pk_tasks`
- **Columns**: `id`
- **Type**: PRIMARY KEY
- **Purpose**: Unique task identification and fast lookups by ID

### User Index
- **Index Name**: `idx_tasks_user_id`
- **Columns**: `user_id`
- **Type**: B-TREE
- **Purpose**: Fast filtering of tasks by user (all queries filter by user_id)
- **Cardinality**: High (one index entry per user)

### Composite Index (Optional - for future optimization)
- **Index Name**: `idx_tasks_user_completed`
- **Columns**: `(user_id, completed)`
- **Type**: B-TREE
- **Purpose**: Optimize queries filtering by user and completion status
- **Note**: Not required for MVP but recommended if filtering by completion status becomes common

---

## Constraints

### Primary Key Constraint
```sql
CONSTRAINT pk_tasks PRIMARY KEY (id)
```

### Not Null Constraints
```sql
CONSTRAINT nn_user_id CHECK (user_id IS NOT NULL)
CONSTRAINT nn_title CHECK (title IS NOT NULL)
CONSTRAINT nn_completed CHECK (completed IS NOT NULL)
CONSTRAINT nn_created_at CHECK (created_at IS NOT NULL)
CONSTRAINT nn_updated_at CHECK (updated_at IS NOT NULL)
```

### Length Constraints
```sql
CONSTRAINT chk_user_id_length CHECK (LENGTH(user_id) <= 255)
CONSTRAINT chk_title_length CHECK (LENGTH(title) <= 200 AND LENGTH(title) >= 1)
CONSTRAINT chk_description_length CHECK (description IS NULL OR LENGTH(description) <= 1000)
```

### Business Rules (Application-Level)
- `user_id` must match authenticated user from JWT token (enforced in application layer)
- `title` cannot be empty string (enforced by Pydantic validation)
- `updated_at` automatically updated on modification (handled by application logic)

---

## Relationships

### User (Implicit)

The `Task` entity has an implicit many-to-one relationship with `User`:
- **Relationship**: Many tasks belong to one user
- **Foreign Key**: `user_id` (logical, not enforced at database level)
- **Cascade**: Not applicable (users managed by Better Auth, not in this database)
- **Orphan Handling**: Tasks remain if user deleted in auth system (design decision for MVP)

**Rationale for No Foreign Key**:
- Users are managed by Better Auth in the frontend/separate system
- No `users` table exists in the backend database
- `user_id` is a logical reference, not a database foreign key
- Simplifies architecture and avoids cross-system dependencies

---

## Data Validation

### Database-Level Validation
- Column type constraints (VARCHAR, INTEGER, BOOLEAN, TIMESTAMP)
- NOT NULL constraints on required fields
- Length constraints via CHECK constraints (if supported by Neon)

### Application-Level Validation (Pydantic)
```python
from pydantic import BaseModel, Field, validator

class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

    @validator('title')
    def title_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip()

class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: bool

    @validator('title')
    def title_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip()
```

---

## Query Patterns

### Common Queries

**Get all tasks for a user**:
```python
from sqlmodel import select

tasks = session.exec(
    select(Task).where(Task.user_id == user_id)
).all()
```

**Get single task by ID (with user verification)**:
```python
task = session.exec(
    select(Task).where(Task.id == task_id, Task.user_id == user_id)
).first()
```

**Create new task**:
```python
task = Task(
    user_id=user_id,
    title=task_data.title,
    description=task_data.description
)
session.add(task)
session.commit()
session.refresh(task)
```

**Update task**:
```python
task = session.get(Task, task_id)
if task and task.user_id == user_id:
    task.title = update_data.title
    task.description = update_data.description
    task.completed = update_data.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
```

**Delete task**:
```python
task = session.get(Task, task_id)
if task and task.user_id == user_id:
    session.delete(task)
    session.commit()
```

**Toggle completion status**:
```python
task = session.get(Task, task_id)
if task and task.user_id == user_id:
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
```

---

## Performance Considerations

### Index Usage
- All queries filter by `user_id` → index on `user_id` ensures fast lookups
- Primary key lookups by `id` are always fast
- Composite index on `(user_id, completed)` can be added if filtering by status becomes common

### Query Optimization
- Always include `user_id` in WHERE clause (security + performance)
- Use `session.get()` for single-record lookups by primary key
- Avoid N+1 queries (not applicable for MVP with single entity)

### Connection Pooling
- Neon PostgreSQL benefits from connection pooling
- Configure pool size based on expected concurrent users
- Use `pool_pre_ping=True` to handle serverless connection behavior

---

## Migration Strategy

### Initial Schema Creation

**Using SQLModel** (Recommended for MVP):
```python
from sqlmodel import SQLModel, create_engine

engine = create_engine(settings.NEON_DB_URL)
SQLModel.metadata.create_all(engine)
```

**Using Alembic** (Optional for production):
```bash
# Initialize Alembic
alembic init alembic

# Generate initial migration
alembic revision --autogenerate -m "Create tasks table"

# Apply migration
alembic upgrade head
```

### Schema Evolution

For future schema changes:
1. Update SQLModel class definition
2. Generate Alembic migration: `alembic revision --autogenerate -m "description"`
3. Review generated migration for correctness
4. Apply migration: `alembic upgrade head`

### Rollback Strategy

If using Alembic:
```bash
# Rollback one version
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>
```

---

## Data Retention

### Current Policy (MVP)
- Tasks are permanently deleted when user deletes them (no soft deletes)
- No automatic cleanup or archival
- No audit trail of modifications

### Future Considerations
- Soft deletes with `deleted_at` timestamp
- Audit log table for tracking changes
- Automatic archival of old completed tasks
- Data retention policies for compliance

---

## Security Considerations

### User Isolation
- **Critical**: All queries MUST filter by `user_id`
- Never trust `user_id` from request body or path without JWT verification
- Always use authenticated `user_id` from JWT token in queries

### SQL Injection Prevention
- SQLModel uses parameterized queries automatically
- Never construct raw SQL with string concatenation
- Avoid `text()` queries unless absolutely necessary

### Data Exposure
- Never return tasks without user_id verification
- Log database errors server-side only (don't expose to clients)
- Sanitize error messages before returning to API clients

---

## Testing Data Model

### Unit Tests
```python
def test_task_creation():
    """Test creating a task with valid data."""
    task = Task(
        user_id="user123",
        title="Test task",
        description="Test description"
    )
    assert task.user_id == "user123"
    assert task.title == "Test task"
    assert task.completed is False
    assert task.created_at is not None

def test_task_validation():
    """Test that validation catches invalid data."""
    with pytest.raises(ValidationError):
        Task(user_id="user123", title="")  # Empty title should fail
```

### Integration Tests
```python
def test_user_isolation(session: Session):
    """Test that users can only access their own tasks."""
    # Create tasks for two users
    task1 = Task(user_id="user1", title="User 1 task")
    task2 = Task(user_id="user2", title="User 2 task")
    session.add_all([task1, task2])
    session.commit()

    # Query for user1's tasks
    user1_tasks = session.exec(
        select(Task).where(Task.user_id == "user1")
    ).all()

    assert len(user1_tasks) == 1
    assert user1_tasks[0].title == "User 1 task"
```

---

## Summary

The data model is intentionally simple with a single `Task` entity that enforces user isolation through the `user_id` field. All queries filter by `user_id` to ensure users can only access their own data. The model uses SQLModel for type safety and Pydantic validation, with indexes optimized for the expected query patterns.

**Key Design Decisions**:
- Single entity (Task) keeps complexity minimal
- No foreign key to users table (users managed externally)
- User isolation enforced at application layer with database index support
- Timestamps for audit trail (created_at, updated_at)
- No soft deletes for MVP (permanent deletion)
- SQLModel for type-safe ORM with Pydantic integration
