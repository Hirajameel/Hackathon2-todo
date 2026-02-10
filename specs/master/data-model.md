# Data Model - Frontend UI

**Feature**: Phase II Frontend UI
**Date**: 2026-02-07
**Status**: Design Phase

## Overview

This document defines the data structures and type definitions used in the frontend application. These models represent the shape of data exchanged between the frontend and backend API, as well as internal UI state management.

## Core Entities

### Task

The primary entity representing a todo item in the system.

**Properties**:
- `id`: string | number - Unique identifier for the task (assigned by backend)
- `title`: string - Task title (required, max 200 characters)
- `description`: string | null - Optional detailed description (max 1000 characters)
- `completed`: boolean - Task completion status (default: false)
- `userId`: string | number - ID of the user who owns this task
- `createdAt`: string - ISO 8601 timestamp of task creation
- `updatedAt`: string - ISO 8601 timestamp of last update

**Validation Rules**:
- Title must not be empty
- Title must not exceed 200 characters
- Description must not exceed 1000 characters if provided
- Completed must be a boolean value

**Example**:
```typescript
{
  id: "123",
  title: "Complete project documentation",
  description: "Write comprehensive docs for the API endpoints",
  completed: false,
  userId: "user-456",
  createdAt: "2026-02-07T10:30:00Z",
  updatedAt: "2026-02-07T10:30:00Z"
}
```

### User

Represents an authenticated user in the system.

**Properties**:
- `id`: string | number - Unique identifier for the user
- `email`: string - User's email address (used for login)

**Validation Rules**:
- Email must be valid email format
- Email must be unique in the system (enforced by backend)

**Example**:
```typescript
{
  id: "user-456",
  email: "user@example.com"
}
```

## API Payload Types

### TaskCreatePayload

Data structure for creating a new task.

**Properties**:
- `title`: string - Task title (required)
- `description`: string | undefined - Optional task description

**Example**:
```typescript
{
  title: "New task",
  description: "Task details here"
}
```

### TaskUpdatePayload

Data structure for updating an existing task.

**Properties**:
- `title`: string | undefined - Updated task title
- `description`: string | null | undefined - Updated task description
- `completed`: boolean | undefined - Updated completion status

**Notes**:
- All fields are optional
- Only provided fields will be updated
- Setting description to null will clear it

**Example**:
```typescript
{
  title: "Updated task title",
  completed: true
}
```

### AuthLoginPayload

Data structure for user login.

**Properties**:
- `email`: string - User's email address
- `password`: string - User's password

**Validation Rules**:
- Email must be valid format
- Password must be at least 8 characters

**Example**:
```typescript
{
  email: "user@example.com",
  password: "securepassword123"
}
```

### AuthSignupPayload

Data structure for user registration.

**Properties**:
- `email`: string - User's email address
- `password`: string - User's password

**Validation Rules**:
- Email must be valid format
- Email must not already exist (enforced by backend)
- Password must be at least 8 characters

**Example**:
```typescript
{
  email: "newuser@example.com",
  password: "securepassword123"
}
```

## API Response Types

### AuthResponse

Response structure for successful authentication.

**Properties**:
- `user`: User - Authenticated user information
- `token`: string - JWT token (may be in httpOnly cookie instead)

**Example**:
```typescript
{
  user: {
    id: "user-456",
    email: "user@example.com"
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### APIError

Error response structure from the backend.

**Properties**:
- `message`: string - Human-readable error message
- `statusCode`: number - HTTP status code
- `errors`: object | undefined - Optional field-specific validation errors

**Example**:
```typescript
{
  message: "Validation failed",
  statusCode: 400,
  errors: {
    title: "Title is required"
  }
}
```

## UI State Models

### FormState

Generic form state for managing form inputs and validation.

**Properties**:
- `values`: object - Current form field values
- `errors`: object - Field-specific error messages
- `touched`: object - Fields that have been interacted with
- `isSubmitting`: boolean - Whether form is currently submitting

### LoadingState

Generic loading state for async operations.

**Properties**:
- `isLoading`: boolean - Whether operation is in progress
- `error`: string | null - Error message if operation failed

### ModalState

State for modal visibility and content.

**Properties**:
- `isOpen`: boolean - Whether modal is visible
- `mode`: "create" | "edit" | "delete" - Modal operation mode
- `data`: any | null - Data associated with modal (e.g., task being edited)

## Type Definitions (TypeScript)

All types should be defined in `src/lib/types.ts`:

```typescript
// Core entities
export interface Task {
  id: string | number;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string | number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string | number;
  email: string;
}

// API payloads
export interface TaskCreatePayload {
  title: string;
  description?: string;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface AuthSignupPayload {
  email: string;
  password: string;
}

// API responses
export interface AuthResponse {
  user: User;
  token?: string;
}

export interface APIError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}
```

## Data Flow

### Task Creation Flow
1. User fills TaskForm with title and optional description
2. Frontend validates input (title required, length limits)
3. Frontend sends TaskCreatePayload to POST /api/tasks
4. Backend validates, creates task, returns Task entity
5. Frontend updates local task list with new task

### Task Update Flow
1. User clicks edit on TaskCard
2. TaskForm opens with existing task data
3. User modifies fields and submits
4. Frontend sends TaskUpdatePayload to PUT /api/tasks/{id}
5. Backend validates, updates task, returns updated Task entity
6. Frontend updates local task list

### Task Deletion Flow
1. User clicks delete on TaskCard
2. Confirmation modal appears
3. User confirms deletion
4. Frontend sends DELETE request to /api/tasks/{id}
5. Backend deletes task, returns success
6. Frontend removes task from local list

### Authentication Flow
1. User submits login/signup form
2. Frontend sends AuthLoginPayload or AuthSignupPayload
3. Backend validates credentials, returns AuthResponse with JWT
4. JWT stored in httpOnly cookie by Better Auth
5. Frontend stores user info in session state
6. All subsequent API calls include JWT automatically

## Validation Strategy

### Client-Side Validation
- Performed before API calls to provide immediate feedback
- Validates required fields, format, and length constraints
- Does not replace server-side validation

### Server-Side Validation
- Authoritative validation performed by backend
- Enforces business rules and data integrity
- Returns APIError with field-specific errors

## State Management Strategy

### Local Component State
- Form inputs and validation errors
- Modal visibility and mode
- Loading and error states for individual operations

### No Global State
- Task list fetched fresh on dashboard mount
- No complex state sharing between components
- Refetch after mutations to ensure consistency

## Notes

- All timestamps use ISO 8601 format
- All IDs can be either string or number (backend determines format)
- Null vs undefined: null means "explicitly empty", undefined means "not provided"
- Frontend never modifies userId (always set by backend from JWT)
