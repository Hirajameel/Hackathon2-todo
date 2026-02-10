# Phase II – Backend Specification (FastAPI + SQLModel + JWT)

**Feature Branch**: `001-backend-api`
**Created**: 2026-02-08
**Status**: Draft
**Input**: FastAPI backend with JWT authentication, task CRUD operations, SQLModel ORM, and Neon PostgreSQL database for multi-user Todo application

## Feature Overview

### Title
Secure Multi-User Todo Backend API

### Description
A production-ready FastAPI backend service that provides secure, stateless REST API endpoints for the Todo application. The backend verifies JWT tokens issued by Better Auth (frontend), enforces user isolation, manages task CRUD operations, and persists data to Neon PostgreSQL using SQLModel ORM. The backend integrates seamlessly with the existing Next.js frontend and ensures that users can only access their own tasks.

### Scope
This specification covers the complete backend API implementation including:
- JWT token verification and user authentication
- RESTful API endpoints for task management
- Database models and persistence layer
- User data isolation and authorization
- Error handling and validation
- CORS configuration for frontend integration
- Environment-based configuration

**Out of Scope**:
- User registration and login (handled by Better Auth in frontend)
- JWT token generation (handled by Better Auth in frontend)
- Frontend UI components
- Email notifications
- File uploads
- Real-time features (WebSockets)

### Non-Functional Requirements
- **Security**: All endpoints require valid JWT authentication; user data strictly isolated
- **Performance**: API responses within 200ms for 95th percentile under normal load
- **Scalability**: Stateless design supports horizontal scaling
- **Reliability**: Graceful error handling with appropriate HTTP status codes
- **Maintainability**: Clean separation of concerns with modular architecture
- **Compatibility**: Works with existing Next.js frontend and Better Auth tokens

## User Scenarios & Testing

### User Story 1 - Secure Task Retrieval (Priority: P1) 🎯 MVP

An authenticated user retrieves their personal task list through the API.

**Why this priority**: Core functionality that enables users to view their tasks. Without this, the application cannot display any data. This is the foundation for all other operations.

**Independent Test**: Can be fully tested by sending a GET request with a valid JWT token and verifying that only the authenticated user's tasks are returned. Delivers immediate value by allowing users to see their task list.

**Acceptance Scenarios**:

1. **Given** a user is authenticated with a valid JWT token, **When** they request GET /api/{user_id}/tasks, **Then** the system returns a 200 OK response with an array of their tasks
2. **Given** a user is authenticated, **When** they request tasks for a different user_id, **Then** the system returns 403 Forbidden
3. **Given** a request has no JWT token, **When** they request GET /api/{user_id}/tasks, **Then** the system returns 401 Unauthorized
4. **Given** a user has no tasks, **When** they request their task list, **Then** the system returns 200 OK with an empty array

---

### User Story 2 - Task Creation (Priority: P2)

An authenticated user creates a new task through the API.

**Why this priority**: Essential for users to add new tasks to their list. Builds on P1 by allowing data modification. Required for a functional todo application.

**Independent Test**: Can be tested by sending a POST request with valid task data and JWT token, then verifying the task is created and associated with the correct user.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they POST /api/{user_id}/tasks with valid task data (title, optional description), **Then** the system creates the task and returns 201 Created with the task object
2. **Given** a user submits a task without a title, **When** they POST /api/{user_id}/tasks, **Then** the system returns 422 Unprocessable Entity with validation errors
3. **Given** a user is authenticated, **When** they try to create a task for a different user_id, **Then** the system returns 403 Forbidden
4. **Given** a task title exceeds 200 characters, **When** they POST /api/{user_id}/tasks, **Then** the system returns 422 Unprocessable Entity

---

### User Story 3 - Task Updates (Priority: P3)

An authenticated user updates an existing task's details through the API.

**Why this priority**: Allows users to modify task information. Important for usability but not critical for MVP. Users can work around by deleting and recreating tasks.

**Independent Test**: Can be tested by creating a task, then sending a PUT request with updated data and verifying the changes are persisted.

**Acceptance Scenarios**:

1. **Given** a user owns a task, **When** they PUT /api/{user_id}/tasks/{id} with updated data, **Then** the system updates the task and returns 200 OK with the updated task
2. **Given** a user tries to update another user's task, **When** they PUT /api/{user_id}/tasks/{id}, **Then** the system returns 403 Forbidden
3. **Given** a task does not exist, **When** they PUT /api/{user_id}/tasks/{id}, **Then** the system returns 404 Not Found
4. **Given** invalid data is provided, **When** they PUT /api/{user_id}/tasks/{id}, **Then** the system returns 422 Unprocessable Entity

---

### User Story 4 - Task Deletion (Priority: P3)

An authenticated user deletes a task through the API.

**Why this priority**: Allows users to remove completed or unwanted tasks. Important for task management but not critical for initial functionality.

**Independent Test**: Can be tested by creating a task, deleting it, and verifying it no longer appears in the task list.

**Acceptance Scenarios**:

1. **Given** a user owns a task, **When** they DELETE /api/{user_id}/tasks/{id}, **Then** the system deletes the task and returns 204 No Content
2. **Given** a user tries to delete another user's task, **When** they DELETE /api/{user_id}/tasks/{id}, **Then** the system returns 403 Forbidden
3. **Given** a task does not exist, **When** they DELETE /api/{user_id}/tasks/{id}, **Then** the system returns 404 Not Found

---

### User Story 5 - Task Completion Toggle (Priority: P3)

An authenticated user marks a task as complete or incomplete through the API.

**Why this priority**: Core todo functionality for tracking task status. Could be handled by full task updates (P3) but dedicated endpoint improves UX.

**Independent Test**: Can be tested by creating a task, toggling its completion status, and verifying the status changes.

**Acceptance Scenarios**:

1. **Given** a user owns an incomplete task, **When** they PATCH /api/{user_id}/tasks/{id}/complete, **Then** the system marks the task as complete and returns 200 OK
2. **Given** a user owns a complete task, **When** they PATCH /api/{user_id}/tasks/{id}/complete, **Then** the system marks the task as incomplete and returns 200 OK
3. **Given** a user tries to toggle another user's task, **When** they PATCH /api/{user_id}/tasks/{id}/complete, **Then** the system returns 403 Forbidden

---

### Edge Cases

- **Expired JWT Token**: System returns 401 Unauthorized with clear error message
- **Malformed JWT Token**: System returns 401 Unauthorized without exposing internal details
- **Database Connection Failure**: System returns 500 Internal Server Error with generic message (logs detailed error)
- **Concurrent Task Updates**: Last write wins (optimistic concurrency not required for MVP)
- **Very Long Task Descriptions**: System enforces maximum length (1000 characters) and returns 422 if exceeded
- **SQL Injection Attempts**: SQLModel ORM prevents SQL injection through parameterized queries
- **Missing Environment Variables**: Application fails to start with clear error message
- **Invalid user_id Format**: System validates format and returns 422 if invalid
- **Database Query Timeout**: System returns 500 with timeout error after reasonable wait period

## Requirements

### Functional Requirements

#### Authentication & Authorization

- **FR-001**: System MUST extract JWT token from Authorization: Bearer {token} header on all API requests
- **FR-002**: System MUST verify JWT token signature using BETTER_AUTH_SECRET environment variable
- **FR-003**: System MUST decode JWT token to extract user_id claim
- **FR-004**: System MUST return 401 Unauthorized for requests without valid JWT token
- **FR-005**: System MUST return 403 Forbidden when JWT user_id does not match route user_id parameter
- **FR-006**: System MUST NOT trust user_id from request body; MUST use JWT user_id for all operations

#### Task Management API

- **FR-007**: System MUST provide GET /api/{user_id}/tasks endpoint to retrieve all tasks for authenticated user
- **FR-008**: System MUST provide POST /api/{user_id}/tasks endpoint to create new task for authenticated user
- **FR-009**: System MUST provide GET /api/{user_id}/tasks/{id} endpoint to retrieve single task by ID
- **FR-010**: System MUST provide PUT /api/{user_id}/tasks/{id} endpoint to update existing task
- **FR-011**: System MUST provide DELETE /api/{user_id}/tasks/{id} endpoint to delete task
- **FR-012**: System MUST provide PATCH /api/{user_id}/tasks/{id}/complete endpoint to toggle task completion status

#### Data Validation

- **FR-013**: System MUST validate that task title is required and not empty
- **FR-014**: System MUST enforce maximum title length of 200 characters
- **FR-015**: System MUST enforce maximum description length of 1000 characters
- **FR-016**: System MUST allow description to be optional (null or empty)
- **FR-017**: System MUST return 422 Unprocessable Entity with detailed validation errors for invalid input

#### Data Persistence

- **FR-018**: System MUST persist all tasks to Neon PostgreSQL database using NEON_DB_URL environment variable
- **FR-019**: System MUST use SQLModel ORM for all database operations (no raw SQL)
- **FR-020**: System MUST associate every task with a user_id
- **FR-021**: System MUST filter all task queries by authenticated user's user_id
- **FR-022**: System MUST automatically set created_at timestamp when creating tasks
- **FR-023**: System MUST automatically update updated_at timestamp when modifying tasks
- **FR-024**: System MUST set completed field to false by default for new tasks

#### Error Handling

- **FR-025**: System MUST return appropriate HTTP status codes (200, 201, 204, 401, 403, 404, 422, 500)
- **FR-026**: System MUST return JSON error responses with consistent structure
- **FR-027**: System MUST NOT expose internal errors, stack traces, or secrets in API responses
- **FR-028**: System MUST log detailed errors server-side for debugging
- **FR-029**: System MUST provide user-friendly error messages in API responses

#### Frontend Integration

- **FR-030**: System MUST enable CORS for frontend origin (configured via ALLOWED_ORIGINS environment variable)
- **FR-031**: System MUST accept JWT tokens issued by Better Auth frontend
- **FR-032**: System MUST return JSON responses compatible with frontend API client expectations
- **FR-033**: System MUST handle OPTIONS preflight requests for CORS

### Key Entities

- **Task**: Represents a todo item with title, description, completion status, timestamps, and user association
  - Attributes: id (primary key), user_id (string, required), title (string, required, max 200 chars), description (text, optional, max 1000 chars), completed (boolean, default false), created_at (timestamp), updated_at (timestamp)
  - Relationships: Belongs to one user (identified by user_id)
  - Constraints: user_id must match authenticated user; title cannot be empty

- **User** (implicit): Represented by user_id from JWT token
  - Not stored in backend database (managed by Better Auth in frontend)
  - Used for task ownership and authorization
  - Extracted from JWT token claims

## Success Criteria

### Measurable Outcomes

- **SC-001**: API responds to task retrieval requests within 200ms for 95th percentile
- **SC-002**: API successfully authenticates and authorizes 100% of valid JWT tokens
- **SC-003**: API rejects 100% of requests with invalid or missing JWT tokens with appropriate error codes
- **SC-004**: API enforces user isolation with zero data leakage between users
- **SC-005**: API handles 100 concurrent requests without errors or timeouts
- **SC-006**: Frontend successfully integrates with all API endpoints without CORS errors
- **SC-007**: API returns appropriate HTTP status codes for all scenarios (100% compliance with REST conventions)
- **SC-008**: All validation errors provide clear, actionable error messages
- **SC-009**: Database queries complete within 100ms for 95th percentile
- **SC-010**: API maintains 99.9% uptime during normal operation

### Qualitative Measures

- Backend code is clean, maintainable, and follows Python best practices
- API endpoints are intuitive and follow RESTful conventions
- Error messages are helpful and guide users to correct issues
- Code structure supports easy addition of new features
- Database schema is normalized and efficient
- Security measures prevent common vulnerabilities (SQL injection, XSS, CSRF)

### Technical Outcomes

- All API endpoints documented and testable via OpenAPI/Swagger
- Environment variables properly configured and validated at startup
- Database migrations (if needed) are reversible and version-controlled
- Logging provides sufficient information for debugging production issues
- Code passes linting and type checking (mypy for Python)
- No hardcoded secrets or configuration in source code

## API Endpoint Specifications

### GET /api/{user_id}/tasks

**Purpose**: Retrieve all tasks for the authenticated user

**Authentication**: Required (JWT token in Authorization header)

**Authorization**: JWT user_id must match {user_id} path parameter

**Request**:
- Method: GET
- Path Parameters: user_id (string, required)
- Headers: Authorization: Bearer {jwt_token}
- Body: None

**Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "user_id": "user123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-02-08T10:00:00Z",
    "updated_at": "2026-02-08T10:00:00Z"
  }
]
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: JWT user_id does not match path user_id
- 500 Internal Server Error: Database or server error

---

### POST /api/{user_id}/tasks

**Purpose**: Create a new task for the authenticated user

**Authentication**: Required (JWT token in Authorization header)

**Authorization**: JWT user_id must match {user_id} path parameter

**Request**:
- Method: POST
- Path Parameters: user_id (string, required)
- Headers: Authorization: Bearer {jwt_token}, Content-Type: application/json
- Body:
```json
{
  "title": "Task title (required, max 200 chars)",
  "description": "Task description (optional, max 1000 chars)"
}
```

**Validation Rules**:
- title: Required, non-empty, max 200 characters
- description: Optional, max 1000 characters

**Success Response (201 Created)**:
```json
{
  "id": 2,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-02-08T10:05:00Z",
  "updated_at": "2026-02-08T10:05:00Z"
}
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: JWT user_id does not match path user_id
- 422 Unprocessable Entity: Validation errors (missing title, too long, etc.)
- 500 Internal Server Error: Database or server error

---

### GET /api/{user_id}/tasks/{id}

**Purpose**: Retrieve a single task by ID for the authenticated user

**Authentication**: Required (JWT token in Authorization header)

**Authorization**: JWT user_id must match {user_id} path parameter AND task must belong to user

**Request**:
- Method: GET
- Path Parameters: user_id (string, required), id (integer, required)
- Headers: Authorization: Bearer {jwt_token}
- Body: None

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-02-08T10:00:00Z",
  "updated_at": "2026-02-08T10:00:00Z"
}
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: JWT user_id does not match path user_id OR task belongs to different user
- 404 Not Found: Task with specified ID does not exist
- 500 Internal Server Error: Database or server error

---

### PUT /api/{user_id}/tasks/{id}

**Purpose**: Update an existing task for the authenticated user

**Authentication**: Required (JWT token in Authorization header)

**Authorization**: JWT user_id must match {user_id} path parameter AND task must belong to user

**Request**:
- Method: PUT
- Path Parameters: user_id (string, required), id (integer, required)
- Headers: Authorization: Bearer {jwt_token}, Content-Type: application/json
- Body:
```json
{
  "title": "Updated task title (required, max 200 chars)",
  "description": "Updated description (optional, max 1000 chars)",
  "completed": true
}
```

**Validation Rules**:
- title: Required, non-empty, max 200 characters
- description: Optional, max 1000 characters
- completed: Optional boolean

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, cheese",
  "completed": true,
  "created_at": "2026-02-08T10:00:00Z",
  "updated_at": "2026-02-08T10:15:00Z"
}
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: JWT user_id does not match path user_id OR task belongs to different user
- 404 Not Found: Task with specified ID does not exist
- 422 Unprocessable Entity: Validation errors
- 500 Internal Server Error: Database or server error

---

### DELETE /api/{user_id}/tasks/{id}

**Purpose**: Delete a task for the authenticated user

**Authentication**: Required (JWT token in Authorization header)

**Authorization**: JWT user_id must match {user_id} path parameter AND task must belong to user

**Request**:
- Method: DELETE
- Path Parameters: user_id (string, required), id (integer, required)
- Headers: Authorization: Bearer {jwt_token}
- Body: None

**Success Response (204 No Content)**:
- No response body

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: JWT user_id does not match path user_id OR task belongs to different user
- 404 Not Found: Task with specified ID does not exist
- 500 Internal Server Error: Database or server error

---

### PATCH /api/{user_id}/tasks/{id}/complete

**Purpose**: Toggle the completion status of a task for the authenticated user

**Authentication**: Required (JWT token in Authorization header)

**Authorization**: JWT user_id must match {user_id} path parameter AND task must belong to user

**Request**:
- Method: PATCH
- Path Parameters: user_id (string, required), id (integer, required)
- Headers: Authorization: Bearer {jwt_token}
- Body: None (completion status is toggled automatically)

**Success Response (200 OK)**:
```json
{
  "id": 1,
  "user_id": "user123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2026-02-08T10:00:00Z",
  "updated_at": "2026-02-08T10:20:00Z"
}
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: JWT user_id does not match path user_id OR task belongs to different user
- 404 Not Found: Task with specified ID does not exist
- 500 Internal Server Error: Database or server error

## Database Schema

### Task Table

**Table Name**: `tasks`

**Columns**:
- `id`: Integer, Primary Key, Auto-increment
- `user_id`: String (VARCHAR 255), Required, Indexed
- `title`: String (VARCHAR 200), Required, Not Null
- `description`: Text (TEXT), Optional, Nullable
- `completed`: Boolean, Required, Default: false
- `created_at`: Timestamp, Required, Default: CURRENT_TIMESTAMP
- `updated_at`: Timestamp, Required, Default: CURRENT_TIMESTAMP, Auto-update on modification

**Indexes**:
- Primary Key: `id`
- Index on `user_id` for efficient user-specific queries
- Composite index on `(user_id, completed)` for filtering by status

**Constraints**:
- `user_id` cannot be null or empty
- `title` cannot be null or empty
- `title` max length: 200 characters
- `description` max length: 1000 characters

## JWT Verification Flow

### Token Extraction
1. Extract Authorization header from HTTP request
2. Verify header format: "Bearer {token}"
3. Extract token string after "Bearer " prefix
4. If header missing or malformed, return 401 Unauthorized

### Token Validation
1. Decode JWT token using BETTER_AUTH_SECRET from environment
2. Verify token signature matches expected signature
3. Check token expiration (exp claim)
4. If validation fails, return 401 Unauthorized with appropriate error message

### User Identification
1. Extract user_id from JWT token payload (standard claim or custom claim)
2. Store authenticated user_id in request context for use in route handlers
3. Make user_id available to all downstream middleware and route handlers

### Authorization Enforcement
1. In each route handler, compare JWT user_id with {user_id} path parameter
2. If they don't match, return 403 Forbidden
3. For task-specific operations, verify task belongs to authenticated user
4. If task belongs to different user, return 403 Forbidden

## Environment Variables

### Required Variables

- **BETTER_AUTH_SECRET**: Secret key for verifying JWT tokens (must match frontend configuration)
  - Type: String
  - Minimum length: 32 characters
  - Example: "your-secret-key-here-change-in-production-min-32-characters"
  - Security: Never commit to version control; use environment-specific values

- **BETTER_AUTH_URL**: URL of the Better Auth service (for reference/validation)
  - Type: String (URL)
  - Example: "http://localhost:3000"
  - Purpose: Document the auth service location

- **NEON_DB_URL**: PostgreSQL connection string for Neon database
  - Type: String (PostgreSQL connection URL)
  - Format: "postgresql://user:password@host:port/database?sslmode=require"
  - Example: "postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
  - Security: Never commit to version control; use environment-specific values

### Optional Variables

- **ALLOWED_ORIGINS**: Comma-separated list of allowed CORS origins
  - Type: String (comma-separated URLs)
  - Default: "http://localhost:3000,http://127.0.0.1:3000"
  - Example: "http://localhost:3000,https://myapp.com"
  - Purpose: Configure CORS for frontend integration

- **LOG_LEVEL**: Logging verbosity level
  - Type: String (DEBUG, INFO, WARNING, ERROR)
  - Default: "INFO"
  - Purpose: Control application logging detail

- **PORT**: Port number for the API server
  - Type: Integer
  - Default: 8000
  - Purpose: Configure server port

### Environment Variable Validation

- Application MUST validate all required environment variables at startup
- Application MUST fail to start with clear error message if required variables are missing
- Application MUST NOT use default values for security-sensitive variables (secrets, database URLs)
- Application MUST log (at INFO level) which environment variables are loaded (without exposing values)

## Backend Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Environment variable configuration
│   ├── database.py             # Database engine and session management
│   ├── models.py               # SQLModel database models
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── dependencies.py         # Dependency injection (get_db, get_current_user)
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth.py             # JWT verification middleware
│   └── routers/
│       ├── __init__.py
│       └── tasks.py            # Task-related API routes
├── tests/
│   ├── __init__.py
│   ├── test_auth.py            # Authentication tests
│   ├── test_tasks.py           # Task API tests
│   └── conftest.py             # Pytest fixtures
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore file
├── requirements.txt            # Python dependencies
├── README.md                   # Setup and usage instructions
└── alembic/                    # Database migrations (if needed)
    ├── versions/
    └── env.py
```

### File Responsibilities

- **main.py**: FastAPI app initialization, CORS configuration, router registration, startup/shutdown events
- **config.py**: Load and validate environment variables using pydantic-settings
- **database.py**: SQLModel engine creation, session factory, database initialization
- **models.py**: SQLModel table definitions (Task model)
- **schemas.py**: Pydantic models for request validation and response serialization
- **dependencies.py**: Reusable dependencies (database session, authenticated user)
- **middleware/auth.py**: JWT token extraction, validation, and user identification
- **routers/tasks.py**: All task-related API endpoint implementations

## Error Response Format

All error responses MUST follow this consistent JSON structure:

```json
{
  "detail": "Human-readable error message",
  "error_code": "OPTIONAL_ERROR_CODE",
  "field_errors": {
    "field_name": ["Error message for this field"]
  }
}
```

### Error Response Examples

**401 Unauthorized (Missing Token)**:
```json
{
  "detail": "Authentication required. Please provide a valid JWT token."
}
```

**401 Unauthorized (Invalid Token)**:
```json
{
  "detail": "Invalid or expired authentication token."
}
```

**403 Forbidden (User Mismatch)**:
```json
{
  "detail": "You do not have permission to access this resource."
}
```

**404 Not Found**:
```json
{
  "detail": "Task not found."
}
```

**422 Unprocessable Entity (Validation Error)**:
```json
{
  "detail": "Validation error",
  "field_errors": {
    "title": ["Title is required and cannot be empty"],
    "description": ["Description cannot exceed 1000 characters"]
  }
}
```

**500 Internal Server Error**:
```json
{
  "detail": "An unexpected error occurred. Please try again later."
}
```

## Security Considerations

### Authentication Security
- JWT tokens verified using cryptographic signature
- Tokens must not be expired (check exp claim)
- Secret key must be strong (minimum 32 characters) and environment-specific
- Failed authentication attempts logged for security monitoring

### Authorization Security
- User isolation enforced at database query level (all queries filter by user_id)
- Path parameter user_id validated against JWT user_id
- Task ownership verified before any modification or deletion
- No trust of client-provided user_id in request body

### Data Security
- All database queries use parameterized queries (SQLModel ORM)
- No raw SQL queries to prevent SQL injection
- Input validation on all user-provided data
- Maximum length constraints enforced on text fields

### Error Handling Security
- Internal errors never exposed to clients
- Stack traces logged server-side only
- Generic error messages for security-sensitive failures
- No information leakage about system internals

### CORS Security
- CORS origins explicitly configured via environment variable
- No wildcard (*) CORS origins in production
- Credentials allowed only for configured origins

## Assumptions

1. **Better Auth Integration**: Frontend uses Better Auth to generate JWT tokens with standard claims including user_id
2. **User ID Format**: user_id in JWT token is a string (UUID, email, or custom identifier)
3. **Token Expiration**: JWT tokens include standard exp (expiration) claim
4. **Database Availability**: Neon PostgreSQL database is provisioned and accessible
5. **Single Region**: Application deployed in single region (no multi-region considerations)
6. **Synchronous Operations**: All operations are synchronous (no async/await complexity for MVP)
7. **No File Uploads**: Tasks contain only text data (no attachments or images)
8. **No Soft Deletes**: Deleted tasks are permanently removed from database
9. **No Audit Trail**: No requirement to track who modified tasks or when (beyond updated_at)
10. **No Rate Limiting**: Rate limiting handled by infrastructure/API gateway if needed
11. **No Caching**: No caching layer required for MVP (database queries sufficient)
12. **No Pagination**: Task lists returned in full (reasonable for MVP with expected task counts)

## Dependencies

### External Dependencies
- **Frontend**: Next.js application with Better Auth for JWT token generation
- **Database**: Neon PostgreSQL database (provisioned separately)
- **Environment**: Environment variables configured in deployment environment

### Internal Dependencies
- None (backend is self-contained)

### Technology Dependencies
- Python 3.11+
- FastAPI 0.109+
- SQLModel 0.0.14+
- python-jose[cryptography] for JWT verification
- psycopg2-binary for PostgreSQL connection
- pydantic-settings for environment configuration
