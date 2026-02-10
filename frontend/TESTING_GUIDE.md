# Frontend Testing Guide

## Prerequisites
- ✅ Backend API running on http://localhost:8000
- ✅ Frontend dev server running on http://localhost:3000
- Browser DevTools available

## Testing Checklist

### T055-T057: Responsive Design Testing

#### Mobile Viewport (320px) - ✅ Code Improvements Complete
**How to test:**
1. Open http://localhost:3000 in Chrome
2. Press F12 to open DevTools
3. Click the device toolbar icon (Ctrl+Shift+M)
4. Set viewport to 320px width
5. Test all pages:

**Login Page (`/login`):**
- [ ] Form fits within viewport without horizontal scroll
- [ ] Email and password inputs are readable
- [ ] Login button is fully visible and clickable
- [ ] "Sign up" link is visible

**Signup Page (`/signup`):**
- [ ] Form fits within viewport without horizontal scroll
- [ ] All input fields are readable
- [ ] Signup button is fully visible and clickable
- [ ] "Login" link is visible

**Dashboard Page (`/dashboard`):**
- [ ] Header displays properly (app name + logout button)
- [ ] User email is hidden on mobile (shows on larger screens)
- [ ] "My Tasks" heading and "Add Task" button stack vertically
- [ ] Task cards display properly
- [ ] Task action buttons wrap to multiple lines if needed
- [ ] No horizontal scrolling occurs

**Task Modal:**
- [ ] Modal fits within viewport with proper padding
- [ ] Title and description inputs are usable
- [ ] "Create Task" and "Cancel" buttons stack vertically on mobile
- [ ] Close button (X) is accessible

#### Tablet Viewport (768px)
**How to test:**
1. Set DevTools viewport to 768px width
2. Verify all pages from mobile test
3. Additional checks:
- [ ] User email appears in header
- [ ] Dashboard heading and button are side-by-side
- [ ] Task form buttons are side-by-side
- [ ] Layout uses available space efficiently

#### Desktop Viewport (1024px+)
**How to test:**
1. Set DevTools viewport to 1920px width
2. Verify all pages from mobile test
3. Additional checks:
- [ ] Content doesn't stretch too wide (max-w-4xl constraint)
- [ ] Proper spacing and visual hierarchy
- [ ] All interactive elements easily accessible

---

### T058: Cross-Browser Testing

#### Chrome
- [ ] Navigate to http://localhost:3000
- [ ] Complete full user flow (signup → login → create task → edit → delete → logout)
- [ ] Verify all styling renders correctly
- [ ] Check DevTools console for errors

#### Firefox
- [ ] Navigate to http://localhost:3000
- [ ] Complete full user flow
- [ ] Verify all styling renders correctly
- [ ] Check Browser Console for errors

#### Edge
- [ ] Navigate to http://localhost:3000
- [ ] Complete full user flow
- [ ] Verify all styling renders correctly
- [ ] Check DevTools console for errors

#### Safari (if on Mac)
- [ ] Navigate to http://localhost:3000
- [ ] Complete full user flow
- [ ] Verify all styling renders correctly
- [ ] Check Web Inspector console for errors

---

### T059: Console Error Verification

**How to test:**
1. Open http://localhost:3000 in Chrome
2. Open DevTools (F12) → Console tab
3. Clear console
4. Perform each flow below and check for errors:

**Registration Flow:**
- [ ] Navigate to `/signup`
- [ ] Fill form with valid data
- [ ] Submit form
- [ ] Verify redirect to `/dashboard`
- [ ] Check console: No errors

**Login Flow:**
- [ ] Logout if logged in
- [ ] Navigate to `/login`
- [ ] Fill form with valid credentials
- [ ] Submit form
- [ ] Verify redirect to `/dashboard`
- [ ] Check console: No errors

**Task Creation:**
- [ ] Click "Add Task" button
- [ ] Fill task form
- [ ] Submit form
- [ ] Verify task appears in list
- [ ] Check console: No errors

**Task Editing:**
- [ ] Click "Edit" on a task
- [ ] Modify task details
- [ ] Submit form
- [ ] Verify changes saved
- [ ] Check console: No errors

**Task Status Toggle:**
- [ ] Click "Mark Complete" on a pending task
- [ ] Verify status changes to "Completed"
- [ ] Click "Mark Incomplete"
- [ ] Verify status changes to "Pending"
- [ ] Check console: No errors

**Task Deletion:**
- [ ] Click "Delete" on a task
- [ ] Confirm deletion
- [ ] Verify task removed from list
- [ ] Check console: No errors

**Logout Flow:**
- [ ] Click "Logout" button
- [ ] Verify redirect to `/login`
- [ ] Check console: No errors

---

### T060: User Scenario Validation

#### Scenario 1: New User Registration and Task Creation
**Goal:** Complete within 2 minutes

1. [ ] Navigate to http://localhost:3000
2. [ ] Click "Sign up" link or navigate to `/signup`
3. [ ] Enter email: `test@example.com`
4. [ ] Enter password: `password123`
5. [ ] Enter confirm password: `password123`
6. [ ] Click "Sign Up" button
7. [ ] Verify redirect to `/dashboard`
8. [ ] Verify empty state message: "No tasks yet"
9. [ ] Verify "Create your first task" button visible
10. [ ] Click "Add Task" button
11. [ ] Enter title: "My First Task"
12. [ ] Enter description: "This is a test task"
13. [ ] Click "Create Task" button
14. [ ] Verify modal closes
15. [ ] Verify task appears in task list
16. [ ] Verify task shows title, description, and "Pending" status

**Success Criteria:** ✅ All steps complete within 2 minutes

#### Scenario 2: Task Management Operations
**Goal:** All operations complete with feedback within 5 seconds

1. [ ] Login to dashboard (if not already logged in)
2. [ ] Verify existing tasks display with status indicators
3. [ ] Click "Mark Complete" on a pending task
4. [ ] Verify status changes to "Completed" (green badge)
5. [ ] Verify operation completes within 5 seconds
6. [ ] Click "Mark Incomplete" on the completed task
7. [ ] Verify status changes to "Pending" (yellow badge)
8. [ ] Click "Edit" button on a task
9. [ ] Modify title to "Updated Task Title"
10. [ ] Click "Update Task" button
11. [ ] Verify modal closes and changes appear
12. [ ] Verify operation completes within 5 seconds
13. [ ] Click "Delete" button on a task
14. [ ] Confirm deletion in dialog
15. [ ] Verify task removed from list
16. [ ] Verify operation completes within 5 seconds

**Success Criteria:** ✅ All operations provide immediate visual feedback within 5 seconds

#### Scenario 3: Session Management
**Goal:** Complete within 3 seconds

1. [ ] Ensure you're logged in at `/dashboard`
2. [ ] Click "Logout" button in header
3. [ ] Verify redirect to `/login` page
4. [ ] Verify clear indication of logged out state
5. [ ] Try to navigate to `/dashboard` directly
6. [ ] Verify redirect back to `/login` (route protection working)

**Success Criteria:** ✅ Session ends and redirect completes within 3 seconds

#### Edge Cases

**Unauthenticated Access:**
1. [ ] Logout if logged in
2. [ ] Try to access http://localhost:3000/dashboard directly
3. [ ] Verify redirect to `/login`
4. [ ] Verify no error messages or console errors

**Network Failure Simulation:**
1. [ ] Open DevTools → Network tab
2. [ ] Set throttling to "Offline"
3. [ ] Try to create a task
4. [ ] Verify appropriate error message displays
5. [ ] Verify no console errors (network errors are expected)
6. [ ] Set throttling back to "No throttling"

**Large Number of Tasks:**
1. [ ] Create 20+ tasks
2. [ ] Verify list renders efficiently
3. [ ] Verify scrolling works smoothly
4. [ ] Verify no performance issues

**Form Validation:**
1. [ ] Try to submit login form with empty fields
2. [ ] Verify validation error messages appear
3. [ ] Try to submit task form with empty title
4. [ ] Verify validation error message appears
5. [ ] Try to submit signup with mismatched passwords
6. [ ] Verify validation error message appears

---

## Quick Test Commands

### Check for TypeScript errors:
```bash
cd frontend
npm run build
```

### Check for console warnings in dev server:
Check the terminal where `npm run dev` is running for any warnings or errors.

---

## Known Issues / Notes

1. **Middleware Deprecation Warning:** Next.js 16 shows a warning about middleware convention. This is a framework deprecation notice and doesn't affect functionality.

2. **Better Auth Configuration:** Ensure `.env.local` has correct values:
   - `NEXT_PUBLIC_API_URL=http://localhost:8000`
   - `BETTER_AUTH_SECRET` is set
   - `BETTER_AUTH_URL=http://localhost:3000`

3. **Backend Dependency:** All tests require the backend API to be running on port 8000.

---

## Reporting Issues

If you find any issues during testing:
1. Note the browser and viewport size
2. Capture console errors (if any)
3. Document steps to reproduce
4. Take screenshots if visual issues occur
