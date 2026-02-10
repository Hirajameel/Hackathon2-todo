# API Contracts - Frontend UI

**Feature**: Phase II Frontend UI
**Date**: 2026-02-07
**Status**: Design Phase

## Overview

This document defines the API contracts between the Next.js frontend and the FastAPI backend. All endpoints follow RESTful conventions and are located under the `/api/` path. All requests and responses use JSON format.

## Base Configuration

**Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable
**Authentication**: JWT token in Authorization header (`Bearer {token}`)
**Content-Type**: `application/json`
**Timeout**: 10 seconds

## Authentication Endpoints

### POST /api/auth/signup

Register a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response** (201 Created):
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- 400 Bad Request: Invalid email format or password too short
- 409 Conflict: Email already exists
- 500 Internal Server Error: Server error

**Notes**:
- Password must be at least 8 characters
- Email must be unique
- JWT token may be set in httpOnly cookie instead of response body

---

### POST /api/auth/login

Authenticate an existing user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response** (200 OK):
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- 400 Bad Request: Missing email or password
- 401 Unauthorized: Invalid credentials
- 500 Internal Server Error: Server error

**Notes**:
- JWT token may be set in httpOnly cookie instead of response body
- Token expires after 7 days

---

### POST /api/auth/logout

Terminate the current user session.

**Request**: Empty body

**Headers**:
```
Authorization: Bearer {token}
```

**Success Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses**:
- 401 Unauthorized: Invalid or missing token
- 500 Internal Server Error: Server error

**Notes**:
- Clears httpOnly cookie if used
- Frontend should clear local session state

---

### GET /api/auth/session

Validate current session and retrieve user information.

**Headers**:
```
Authorization: Bearer {token}
```

**Success Response** (200 OK):
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  }
}
```

**Error Responses**:
- 401 Unauthorized: Invalid or expired token
- 500 Internal Server Error: Server error

**Notes**:
- Used by middleware to validate authentication
- Called on protected route access

---

## Task Management Endpoints

### GET /api/tasks

Retrieve all tasks for the authenticated user.

**Headers**:
```
Authorization: Bearer {token}
```

**Success Response** (200 OK):
```json
[
  {
    "id": "task-1",
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for the API endpoints",
    "completed": false,
    "userId": "user-123",
    "createdAt": "2026-02-07T10:30:00Z",
    "updatedAt": "2026-02-07T10:30:00Z"
  },
  {
    "id": "task-2",
    "title": "Review pull requests",
    "description": null,
    "completed": true,
    "userId": "user-123",
    "createdAt": "2026-02-06T14:20:00Z",
    "updatedAt": "2026-02-07T09:15:00Z"
  }
]
```

**Error Responses**:
- 401 Unauthorized: Invalid or missing token
- 500 Internal Server Error: Server error

**Notes**:
- Returns only tasks owned by the authenticated user
- Returns empty array if user has no tasks
- Tasks ordered by creation date (newest first)

---

### POST /api/tasks

Create a new task for the authenticated user.

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "title": "New task title",
  "description": "Optional task description"
}
```

**Success Response** (201 Created):
```json
{
  "id": "task-3",
  "title": "New task title",
  "description": "Optional task description",
  "completed": false,
  "userId": "user-123",
  "createdAt": "2026-02-07T11:00:00Z",
  "updatedAt": "2026-02-07T11:00:00Z"
}
```

**Error Responses**:
- 400 Bad Request: Missing title or validation error
- 401 Unauthorized: Invalid or missing token
- 500 Internal Server Error: Server error

**Validation Rules**:
- Title is required
- Title must not exceed 200 characters
- Description must not exceed 1000 characters if provided

**Notes**:
- userId is extracted from JWT, not from request body
- completed defaults to false
- description is optional

---

### GET /api/tasks/{id}

Retrieve a specific task by ID.

**Headers**:
```
Authorization: Bearer {token}
```

**Success Response** (200 OK):
```json
{
  "id": "task-1",
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API endpoints",
  "completed": false,
  "userId": "user-123",
  "createdAt": "2026-02-07T10:30:00Z",
  "updatedAt": "2026-02-07T10:30:00Z"
}
```

**Error Responses**:
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Task belongs to different user
- 404 Not Found: Task does not exist
- 500 Internal Server Error: Server error

**Notes**:
- User can only access their own tasks
- 403 returned if task exists but belongs to another user

---

### PUT /api/tasks/{id}

Update an existing task.

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

**Success Response** (200 OK):
```json
{
  "id": "task-1",
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "userId": "user-123",
  "createdAt": "2026-02-07T10:30:00Z",
  "updatedAt": "2026-02-07T11:30:00Z"
}
```

**Error Responses**:
- 400 Bad Request: Validation error
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Task belongs to different user
- 404 Not Found: Task does not exist
- 500 Internal Server Error: Server error

**Notes**:
- All fields are optional (partial update)
- Only provided fields are updated
- updatedAt timestamp is automatically updated
- User can only update their own tasks

---

### PATCH /api/tasks/{id}/toggle

Toggle the completion status of a task.

**Headers**:
```
Authorization: Bearer {token}
```

**Request**: Empty body

**Success Response** (200 OK):
```json
{
  "id": "task-1",
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for the API endpoints",
  "completed": true,
  "userId": "user-123",
  "createdAt": "2026-02-07T10:30:00Z",
  "updatedAt": "2026-02-07T11:45:00Z"
}
```

**Error Responses**:
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Task belongs to different user
- 404 Not Found: Task does not exist
- 500 Internal Server Error: Server error

**Notes**:
- Convenience endpoint for toggling completed status
- If completed is true, sets to false; if false, sets to true
- Alternative to PUT /api/tasks/{id} with completed field

---

### DELETE /api/tasks/{id}

Delete a task permanently.

**Headers**:
```
Authorization: Bearer {token}
```

**Success Response** (204 No Content):
Empty response body

**Error Responses**:
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Task belongs to different user
- 404 Not Found: Task does not exist
- 500 Internal Server Error: Server error

**Notes**:
- Deletion is permanent and cannot be undone
- User can only delete their own tasks
- Returns 204 with no body on success

---

## Error Response Format

All error responses follow this structure:

```json
{
  "message": "Human-readable error message",
  "statusCode": 400,
  "errors": {
    "field": "Field-specific error message"
  }
}
```

**Common Status Codes**:
- 400 Bad Request: Invalid input or validation error
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Valid token but insufficient permissions
- 404 Not Found: Resource does not exist
- 409 Conflict: Resource already exists (e.g., duplicate email)
- 500 Internal Server Error: Unexpected server error

## JWT Token Format

JWT tokens contain the following claims:

```json
{
  "user_id": "user-123",
  "email": "user@example.com",
  "exp": 1707393600,
  "iat": 1706788800
}
```

**Claims**:
- `user_id`: Unique identifier for the user
- `email`: User's email address
- `exp`: Expiration timestamp (Unix epoch)
- `iat`: Issued at timestamp (Unix epoch)

**Notes**:
- Token signed with BETTER_AUTH_SECRET
- Token expires after 7 days
- Backend extracts user_id from token for all operations

## CORS Configuration

The backend must be configured to allow requests from the frontend origin:

**Allowed Origins**: Frontend URL (e.g., http://localhost:3000)
**Allowed Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
**Allowed Headers**: Content-Type, Authorization
**Allow Credentials**: true (for httpOnly cookies)

## Rate Limiting

Not specified in current scope. May be added in future iterations.

## API Client Implementation Notes

The frontend API client (`src/lib/api-client.ts`) must:

1. Attach JWT token to all requests via Authorization header
2. Handle 401 responses by clearing session and redirecting to login
3. Handle 403 responses with "Access denied" message
4. Handle network errors with user-friendly messages
5. Set 10-second timeout for all requests
6. Log errors to console for debugging

## Testing Considerations

Frontend should handle:
- Successful responses with valid data
- 400 errors with field-specific validation messages
- 401 errors (expired or invalid token)
- 403 errors (accessing another user's tasks)
- 404 errors (task not found)
- 500 errors (server failures)
- Network timeouts and connection errors

## Backend Coordination

This contract assumes the backend will:
- Validate JWT tokens on all protected endpoints
- Extract user_id from JWT claims (never trust client-provided user_id)
- Enforce user isolation (users can only access their own tasks)
- Return proper HTTP status codes
- Follow RESTful conventions
- Use JSON for all requests and responses
