# Tasks: Secure Multi-User Todo Backend API

**Input**: Design documents from `/specs/001-backend-api/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend structure**: `backend/app/` for application code, `backend/tests/` for tests
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure per plan.md (backend/app/, backend/tests/, backend/app/middleware/, backend/app/routers/)
- [x] T002 Create requirements.txt with dependencies: fastapi==0.109.0, uvicorn[standard]==0.27.0, sqlmodel==0.0.14, psycopg2-binary==2.9.9, python-jose[cryptography]==3.3.0, python-dotenv==1.0.0, pydantic-settings==2.1.0, pytest==7.4.3, httpx==0.25.2
- [x] T003 [P] Create .env.example file in backend/ with required environment variables (NEON_DB_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, ALLOWED_ORIGINS, PORT, LOG_LEVEL)
- [x] T004 [P] Create .gitignore file in backend/ to exclude .env, __pycache__, venv/, .pytest_cache/
- [x] T005 [P] Create backend/app/__init__.py (empty module initializer)
- [x] T006 [P] Create backend/app/middleware/__init__.py (empty module initializer)
- [x] T007 [P] Create backend/app/routers/__init__.py (empty module initializer)
- [x] T008 [P] Create backend/tests/__init__.py (empty module initializer)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Implement configuration management in backend/app/config.py using pydantic-settings to load and validate environment variables (NEON_DB_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, ALLOWED_ORIGINS, PORT, LOG_LEVEL)
- [x] T010 Implement database engine and session management in backend/app/database.py with SQLModel engine, create_db_and_tables() function, and get_session() dependency
- [x] T011 Create Task model in backend/app/models.py with SQLModel (id, user_id, title, description, completed, created_at, updated_at) per data-model.md
- [x] T012 Create Pydantic schemas in backend/app/schemas.py (TaskCreate, TaskUpdate, TaskResponse) for request/response validation
- [x] T013 Implement JWT verification in backend/app/middleware/auth.py with verify_token() function using python-jose and BETTER_AUTH_SECRET
- [x] T014 Implement authentication dependencies in backend/app/dependencies.py (get_current_user, verify_user_access) using HTTPBearer and JWT verification
- [x] T015 Create FastAPI application in backend/app/main.py with CORS middleware configuration, database initialization on startup, and router registration
- [x] T016 Create tasks router skeleton in backend/app/routers/tasks.py with APIRouter setup and dependency imports

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Task Retrieval (Priority: P1) 🎯 MVP

**Goal**: Authenticated user retrieves their personal task list through the API

**Independent Test**: Send GET request with valid JWT token to /api/{user_id}/tasks and verify only authenticated user's tasks are returned with 200 OK

**Why MVP**: Core functionality that enables users to view their tasks. Foundation for all other operations. Delivers immediate value.

### Implementation for User Story 1

- [x] T017 [US1] Implement GET /api/{user_id}/tasks endpoint in backend/app/routers/tasks.py to retrieve all tasks for authenticated user (filter by user_id from JWT)
- [x] T018 [US1] Add authentication and authorization to GET /api/{user_id}/tasks using verify_user_access dependency
- [x] T019 [US1] Add error handling for GET /api/{user_id}/tasks (401 Unauthorized, 403 Forbidden, 500 Internal Server Error)
- [x] T020 [US1] Add response serialization for GET /api/{user_id}/tasks to return list of TaskResponse objects
- [x] T021 [US1] Verify empty array is returned when user has no tasks

**Checkpoint**: User Story 1 complete - users can retrieve their task list. Test independently before proceeding.

---

## Phase 4: User Story 2 - Task Creation (Priority: P2)

**Goal**: Authenticated user creates a new task through the API

**Independent Test**: Send POST request with valid JWT token and task data to /api/{user_id}/tasks and verify task is created with 201 Created

**Why P2**: Essential for users to add new tasks. Builds on P1 by allowing data modification. Required for functional todo application.

### Implementation for User Story 2

- [x] T022 [US2] Implement POST /api/{user_id}/tasks endpoint in backend/app/routers/tasks.py to create new task for authenticated user
- [x] T023 [US2] Add authentication and authorization to POST /api/{user_id}/tasks using verify_user_access dependency
- [x] T024 [US2] Add request validation for POST /api/{user_id}/tasks using TaskCreate schema (title required, description optional)
- [x] T025 [US2] Add error handling for POST /api/{user_id}/tasks (401 Unauthorized, 403 Forbidden, 422 Unprocessable Entity, 500 Internal Server Error)
- [x] T026 [US2] Add response serialization for POST /api/{user_id}/tasks to return TaskResponse with 201 Created status
- [x] T027 [US2] Verify task is associated with authenticated user_id from JWT (not from request body)
- [x] T028 [US2] Verify created_at and updated_at timestamps are set automatically

**Checkpoint**: User Story 2 complete - users can create tasks. Test independently (create and retrieve).

---

## Phase 5: User Story 3 - Task Updates (Priority: P3)

**Goal**: Authenticated user updates an existing task's details through the API

**Independent Test**: Create a task, send PUT request with updated data to /api/{user_id}/tasks/{id}, and verify changes are persisted with 200 OK

**Why P3**: Allows users to modify task information. Important for usability but not critical for MVP.

### Implementation for User Story 3

- [x] T029 [P] [US3] Implement GET /api/{user_id}/tasks/{id} endpoint in backend/app/routers/tasks.py to retrieve single task by ID for authenticated user
- [x] T030 [P] [US3] Add authentication and authorization to GET /api/{user_id}/tasks/{id} using verify_user_access dependency
- [x] T031 [US3] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/app/routers/tasks.py to update existing task
- [x] T032 [US3] Add authentication and authorization to PUT /api/{user_id}/tasks/{id} using verify_user_access dependency
- [x] T033 [US3] Add request validation for PUT /api/{user_id}/tasks/{id} using TaskUpdate schema (title, description, completed)
- [x] T034 [US3] Add task ownership verification in PUT /api/{user_id}/tasks/{id} (verify task.user_id matches JWT user_id)
- [x] T035 [US3] Add error handling for GET and PUT /api/{user_id}/tasks/{id} (401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity, 500 Internal Server Error)
- [x] T036 [US3] Update updated_at timestamp automatically when task is modified
- [x] T037 [US3] Add response serialization for both endpoints to return TaskResponse

**Checkpoint**: User Story 3 complete - users can retrieve single tasks and update them. Test independently.

---

## Phase 6: User Story 4 - Task Deletion (Priority: P3)

**Goal**: Authenticated user deletes a task through the API

**Independent Test**: Create a task, delete it with DELETE request to /api/{user_id}/tasks/{id}, and verify it no longer appears in task list with 204 No Content

**Why P3**: Allows users to remove completed or unwanted tasks. Important for task management but not critical for initial functionality.

### Implementation for User Story 4

- [x] T038 [US4] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/app/routers/tasks.py to delete task for authenticated user
- [x] T039 [US4] Add authentication and authorization to DELETE /api/{user_id}/tasks/{id} using verify_user_access dependency
- [x] T040 [US4] Add task ownership verification in DELETE /api/{user_id}/tasks/{id} (verify task.user_id matches JWT user_id)
- [x] T041 [US4] Add error handling for DELETE /api/{user_id}/tasks/{id} (401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error)
- [x] T042 [US4] Return 204 No Content on successful deletion (no response body)
- [x] T043 [US4] Verify task is permanently removed from database (not soft delete)

**Checkpoint**: User Story 4 complete - users can delete tasks. Test independently (create, delete, verify gone).

---

## Phase 7: User Story 5 - Task Completion Toggle (Priority: P3)

**Goal**: Authenticated user marks a task as complete or incomplete through the API

**Independent Test**: Create a task, toggle its completion status with PATCH request to /api/{user_id}/tasks/{id}/complete, and verify status changes with 200 OK

**Why P3**: Core todo functionality for tracking task status. Could be handled by full task updates (US3) but dedicated endpoint improves UX.

### Implementation for User Story 5

- [x] T044 [US5] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/app/routers/tasks.py to toggle task completion status
- [x] T045 [US5] Add authentication and authorization to PATCH /api/{user_id}/tasks/{id}/complete using verify_user_access dependency
- [x] T046 [US5] Add task ownership verification in PATCH /api/{user_id}/tasks/{id}/complete (verify task.user_id matches JWT user_id)
- [x] T047 [US5] Implement toggle logic (completed = not completed) without requiring request body
- [x] T048 [US5] Add error handling for PATCH /api/{user_id}/tasks/{id}/complete (401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error)
- [x] T049 [US5] Update updated_at timestamp automatically when completion status changes
- [x] T050 [US5] Add response serialization to return updated TaskResponse with new completion status

**Checkpoint**: User Story 5 complete - users can toggle task completion. Test independently.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [x] T051 [P] Create backend/README.md with setup instructions, environment variables, and running instructions per quickstart.md
- [x] T052 [P] Add comprehensive error logging throughout all endpoints using Python logging module
- [x] T053 [P] Verify all endpoints return consistent error response format per spec.md (detail, error_code, field_errors)
- [x] T054 [P] Add API documentation strings (docstrings) to all endpoint functions for automatic OpenAPI generation
- [x] T055 Verify CORS configuration allows frontend origins from ALLOWED_ORIGINS environment variable
- [x] T056 Verify all database queries use parameterized queries (SQLModel ORM) to prevent SQL injection
- [x] T057 Verify JWT secret is loaded from environment and never hardcoded
- [x] T058 Test all endpoints with curl commands from quickstart.md to verify functionality
- [x] T059 Verify application fails to start with clear error message if required environment variables are missing
- [x] T060 [P] Add health check endpoint GET / or GET /health for monitoring (optional)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) after Phase 2
  - Or sequentially in priority order: US1 (P1) → US2 (P2) → US3 (P3) → US4 (P3) → US5 (P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable)
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable)
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable)

### Within Each User Story

- Authentication/authorization before business logic
- Request validation before processing
- Error handling after core implementation
- Response serialization last

### Parallel Opportunities

- **Phase 1**: Tasks T003-T008 (all marked [P]) can run in parallel
- **Phase 2**: No parallel tasks (sequential dependencies for core infrastructure)
- **Phase 3-7**: After Phase 2 completes, all user stories can start in parallel if team capacity allows
- **Phase 5 (US3)**: Tasks T029-T030 can run in parallel with T031-T037 (different endpoints)
- **Phase 8**: Tasks T051-T054, T056-T057, T060 (all marked [P]) can run in parallel

---

## Parallel Example: After Foundational Phase

```bash
# Once Phase 2 (Foundational) is complete, launch all user stories in parallel:

# Developer A or Agent 1:
Task: "Implement GET /api/{user_id}/tasks endpoint" (US1)

# Developer B or Agent 2:
Task: "Implement POST /api/{user_id}/tasks endpoint" (US2)

# Developer C or Agent 3:
Task: "Implement GET /api/{user_id}/tasks/{id} endpoint" (US3)
Task: "Implement PUT /api/{user_id}/tasks/{id} endpoint" (US3)

# Developer D or Agent 4:
Task: "Implement DELETE /api/{user_id}/tasks/{id} endpoint" (US4)

# Developer E or Agent 5:
Task: "Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint" (US5)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T016) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T017-T021)
4. **STOP and VALIDATE**: Test User Story 1 independently with curl/Swagger
5. Deploy/demo if ready - users can now view their tasks!

**MVP Deliverable**: Authenticated users can retrieve their task list

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (P1) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (P2) → Test independently → Deploy/Demo (users can create tasks)
4. Add User Story 3 (P3) → Test independently → Deploy/Demo (users can update tasks)
5. Add User Story 4 (P3) → Test independently → Deploy/Demo (users can delete tasks)
6. Add User Story 5 (P3) → Test independently → Deploy/Demo (users can toggle completion)
7. Add Polish (Phase 8) → Production ready

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers or agents:

1. Team completes Setup (Phase 1) together
2. Team completes Foundational (Phase 2) together - MUST finish before splitting
3. Once Foundational is done, split work:
   - Developer/Agent A: User Story 1 (T017-T021)
   - Developer/Agent B: User Story 2 (T022-T028)
   - Developer/Agent C: User Story 3 (T029-T037)
   - Developer/Agent D: User Story 4 (T038-T043)
   - Developer/Agent E: User Story 5 (T044-T050)
4. Stories complete and integrate independently
5. Team completes Polish (Phase 8) together

---

## Task Summary

**Total Tasks**: 60
- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 8 tasks (BLOCKS all user stories)
- **Phase 3 (US1 - P1 MVP)**: 5 tasks
- **Phase 4 (US2 - P2)**: 7 tasks
- **Phase 5 (US3 - P3)**: 9 tasks
- **Phase 6 (US4 - P3)**: 6 tasks
- **Phase 7 (US5 - P3)**: 7 tasks
- **Phase 8 (Polish)**: 10 tasks

**Parallelizable Tasks**: 15 tasks marked [P]

**Independent User Stories**: All 5 user stories can be implemented and tested independently after Foundational phase

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 21 tasks

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All endpoints require JWT authentication and user_id verification
- All database queries filter by user_id for user isolation
- Follow error response format from spec.md for consistency
- Use exact file paths from plan.md structure
- Refer to research.md for implementation patterns
- Refer to quickstart.md for testing and validation procedures
