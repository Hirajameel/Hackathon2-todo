# Tasks: Phase II Frontend UI

**Input**: Design documents from `/specs/master/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api-contracts.md

**Tests**: Tests are NOT requested in this specification. Tasks focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for all frontend code
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create frontend directory at repository root
- [x] T002 Initialize Next.js 16+ project with TypeScript, Tailwind CSS, and App Router in frontend/
- [x] T003 [P] Configure TypeScript with strict mode and path aliases in frontend/tsconfig.json
- [x] T004 [P] Configure Tailwind CSS with custom color palette in frontend/tailwind.config.js
- [x] T005 [P] Install Better Auth package (better-auth) in frontend/
- [x] T006 [P] Install axios for HTTP requests in frontend/
- [x] T007 Create .env.local file with NEXT_PUBLIC_API_URL and BETTER_AUTH_SECRET placeholders in frontend/
- [x] T008 Create folder structure: frontend/src/components/{ui,layout,auth,tasks}
- [x] T009 Create folder structure: frontend/src/lib and frontend/src/app directories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 [P] Create Button component with variant, size, disabled, and loading props in frontend/src/components/ui/Button.tsx
- [x] T011 [P] Create Input component with type, label, placeholder, error, value, and onChange props in frontend/src/components/ui/Input.tsx
- [x] T012 [P] Create Modal component with isOpen, onClose, title, and children props in frontend/src/components/ui/Modal.tsx
- [x] T013 Create TypeScript type definitions for Task, User, payloads, and responses in frontend/src/lib/types.ts
- [x] T014 Initialize axios instance with base URL and default headers in frontend/src/lib/api-client.ts
- [x] T015 Implement request interceptor to attach JWT token to all requests in frontend/src/lib/api-client.ts
- [x] T016 Implement response interceptor to handle 401, 403, 500, and network errors in frontend/src/lib/api-client.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Authentication & Dashboard Access (Priority: P1) 🎯 MVP

**Goal**: Users can register, login, logout, and access an authenticated dashboard with empty state

**Independent Test**:
1. Navigate to /signup, create account, verify redirect to /dashboard
2. Logout, verify redirect to /login
3. Login with credentials, verify redirect to /dashboard
4. Attempt to access /dashboard without auth, verify redirect to /login

### Implementation for User Story 1

- [x] T017 [P] [US1] Configure Better Auth with JWT strategy and httpOnly cookies in frontend/src/lib/auth.ts
- [x] T018 [P] [US1] Add authentication API methods (login, signup, logout, session) to API client in frontend/src/lib/api-client.ts
- [x] T019 [P] [US1] Create root layout with metadata and Better Auth provider in frontend/src/app/layout.tsx
- [x] T020 [P] [US1] Create authenticated layout with Header component in frontend/src/app/dashboard/layout.tsx
- [x] T021 [P] [US1] Create Header component with app name, user email, and logout button in frontend/src/components/layout/Header.tsx
- [x] T022 [P] [US1] Create Layout component for consistent page structure in frontend/src/components/layout/Layout.tsx
- [x] T023 [US1] Create landing page with authentication check and redirect logic in frontend/src/app/page.tsx
- [x] T024 [P] [US1] Create LoginForm component with email, password inputs, validation, and error handling in frontend/src/components/auth/LoginForm.tsx
- [x] T025 [P] [US1] Create SignupForm component with email, password, confirm password inputs and validation in frontend/src/components/auth/SignupForm.tsx
- [x] T026 [P] [US1] Create login page with LoginForm and link to signup in frontend/src/app/login/page.tsx
- [x] T027 [P] [US1] Create signup page with SignupForm and link to login in frontend/src/app/signup/page.tsx
- [x] T028 [US1] Implement logout functionality in Header component calling logout API method in frontend/src/components/layout/Header.tsx
- [x] T029 [US1] Create route protection middleware to check authentication on protected routes in frontend/src/middleware.ts
- [x] T030 [US1] Create dashboard page with empty state message and "Add Task" button in frontend/src/app/dashboard/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - users can register, login, logout, and see empty dashboard

---

## Phase 4: User Story 2 - Task Creation & Viewing (Priority: P2)

**Goal**: Users can create tasks and view them in a list on the dashboard

**Independent Test**:
1. Login to dashboard
2. Click "Add Task" button
3. Fill task form with title and description
4. Submit and verify task appears in list
5. Verify empty state disappears when tasks exist

### Implementation for User Story 2

- [x] T031 [P] [US2] Create TaskCard component displaying task title, description, status badge, and action buttons in frontend/src/components/tasks/TaskCard.tsx
- [x] T032 [P] [US2] Create TaskList component mapping over tasks array and rendering TaskCard components in frontend/src/components/tasks/TaskList.tsx
- [x] T033 [P] [US2] Create TaskForm component with title and description inputs, validation, and submit/cancel buttons in frontend/src/components/tasks/TaskForm.tsx
- [x] T034 [US2] Add task API methods (getTasks, createTask) to API client in frontend/src/lib/api-client.ts
- [x] T035 [US2] Add task fetching logic with useEffect on dashboard page mount in frontend/src/app/dashboard/page.tsx
- [x] T036 [US2] Add modal state management for task creation in dashboard page in frontend/src/app/dashboard/page.tsx
- [x] T037 [US2] Implement task creation flow: open modal, submit form, close modal, refetch tasks in frontend/src/app/dashboard/page.tsx
- [x] T038 [US2] Add loading state display during task fetch in frontend/src/app/dashboard/page.tsx
- [x] T039 [US2] Add error state display for failed task fetch in frontend/src/app/dashboard/page.tsx
- [x] T040 [US2] Update empty state logic to show only when tasks array is empty after successful fetch in frontend/src/app/dashboard/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can create and view tasks

---

## Phase 5: User Story 3 - Task Management Operations (Priority: P3)

**Goal**: Users can edit, delete, and toggle completion status of existing tasks

**Independent Test**:
1. Login and create a task
2. Click edit button, modify task, verify changes saved
3. Click toggle button, verify status changes
4. Click delete button, confirm, verify task removed

### Implementation for User Story 3

- [x] T041 [US3] Add task API methods (updateTask, deleteTask, toggleTaskStatus) to API client in frontend/src/lib/api-client.ts
- [x] T042 [US3] Add task editing flow: open modal with task data, submit form, refetch tasks in frontend/src/app/dashboard/page.tsx
- [x] T043 [US3] Implement task deletion with confirmation modal in frontend/src/app/dashboard/page.tsx
- [x] T044 [US3] Implement task status toggle with loading state in TaskCard component in frontend/src/components/tasks/TaskCard.tsx
- [x] T045 [US3] Add loading state management for all task operations in frontend/src/app/dashboard/page.tsx
- [x] T046 [US3] Add error state management for all task operations in frontend/src/app/dashboard/page.tsx
- [x] T047 [US3] Implement refetch logic after all mutations (create, update, delete, toggle) in frontend/src/app/dashboard/page.tsx

**Checkpoint**: All user stories should now be independently functional - full CRUD operations work

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and ensure production quality

- [x] T048 [P] Add spinner component for general loading states in frontend/src/components/ui/Spinner.tsx
- [x] T049 [P] Add skeleton UI for task list loading in frontend/src/components/tasks/TaskListSkeleton.tsx
- [x] T050 Add loading indicators to all form submit buttons across auth and task forms
- [x] T051 [P] Ensure all error messages are user-friendly and actionable across all components
- [x] T052 [P] Add proper ARIA labels to all interactive elements for accessibility
- [x] T053 [P] Ensure keyboard navigation works for all interactive elements
- [x] T054 [P] Verify color contrast meets WCAG AA standards across all components
- [x] T055 Test responsive behavior on mobile viewport (320px width minimum)
- [ ] T056 Test responsive behavior on tablet viewport (768px width)
- [ ] T057 Test responsive behavior on desktop viewport (1024px+ width)
- [ ] T058 [P] Test on Chrome, Firefox, Safari, and Edge browsers
- [x] T059 Verify no console errors during normal user interactions
- [ ] T060 Run through all user scenarios from spec.md and verify success criteria met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 dashboard but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Requires US2 tasks to exist but independently testable

### Within Each User Story

- US1: Auth configuration → Layouts → Auth pages → Route protection → Dashboard
- US2: Task components → API methods → Dashboard integration → State management
- US3: API methods → Edit/delete/toggle flows → Error handling

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003-T006)
- All Foundational tasks marked [P] can run in parallel (T010-T012)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within US1: Tasks T017-T022, T024-T027 can run in parallel
- Within US2: Tasks T031-T033 can run in parallel
- Within Polish: Tasks T048-T049, T051-T054, T058 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch auth configuration and layouts together:
Task: "Configure Better Auth with JWT strategy in frontend/src/lib/auth.ts"
Task: "Add authentication API methods to API client in frontend/src/lib/api-client.ts"
Task: "Create root layout in frontend/src/app/layout.tsx"
Task: "Create authenticated layout in frontend/src/app/dashboard/layout.tsx"
Task: "Create Header component in frontend/src/components/layout/Header.tsx"
Task: "Create Layout component in frontend/src/components/layout/Layout.tsx"

# Launch auth forms together:
Task: "Create LoginForm component in frontend/src/components/auth/LoginForm.tsx"
Task: "Create SignupForm component in frontend/src/components/auth/SignupForm.tsx"
Task: "Create login page in frontend/src/app/login/page.tsx"
Task: "Create signup page in frontend/src/app/signup/page.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Launch all task components together:
Task: "Create TaskCard component in frontend/src/components/tasks/TaskCard.tsx"
Task: "Create TaskList component in frontend/src/components/tasks/TaskList.tsx"
Task: "Create TaskForm component in frontend/src/components/tasks/TaskForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T009)
2. Complete Phase 2: Foundational (T010-T016) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T017-T030)
4. **STOP and VALIDATE**: Test authentication flow end-to-end
5. Deploy/demo if ready - users can register, login, logout, see empty dashboard

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - authentication works!)
3. Add User Story 2 → Test independently → Deploy/Demo (can create and view tasks!)
4. Add User Story 3 → Test independently → Deploy/Demo (full CRUD operations!)
5. Add Polish → Final validation → Production ready
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T016)
2. Once Foundational is done:
   - Developer A: User Story 1 (T017-T030)
   - Developer B: User Story 2 (T031-T040) - can start components in parallel
   - Developer C: User Story 3 (T041-T047) - can start API methods in parallel
3. Stories complete and integrate independently
4. Team completes Polish together (T048-T060)

---

## Task Summary

**Total Tasks**: 60
- Phase 1 (Setup): 9 tasks
- Phase 2 (Foundational): 7 tasks
- Phase 3 (User Story 1 - MVP): 14 tasks
- Phase 4 (User Story 2): 10 tasks
- Phase 5 (User Story 3): 7 tasks
- Phase 6 (Polish): 13 tasks

**Parallel Opportunities**: 28 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phases 1-3 (30 tasks) deliver authentication and empty dashboard

**Full Feature**: All 60 tasks deliver complete frontend with authentication, task CRUD, and polish

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are absolute from repository root
- Environment variables must be configured before running (see quickstart.md)
- Backend API must be running for full integration testing
