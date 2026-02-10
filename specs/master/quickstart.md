# Quickstart Guide - Frontend UI

**Feature**: Phase II Frontend UI
**Date**: 2026-02-07
**Status**: Design Phase

## Overview

This quickstart guide provides step-by-step instructions for setting up and running the Next.js frontend for the Todo application. Follow these instructions to get the development environment running.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended

## Project Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

If the frontend directory doesn't exist yet, it will be created during the implementation phase.

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 16+
- React 19+
- TypeScript 5+
- Tailwind CSS
- Better Auth
- Axios

### Step 3: Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
```

**Important Notes**:
- Replace `your-secret-key-here-min-32-chars` with a secure random string (minimum 32 characters)
- The `BETTER_AUTH_SECRET` must match the secret used by the backend
- `NEXT_PUBLIC_API_URL` should point to your backend API server
- Never commit `.env.local` to version control

### Step 4: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   └── dashboard/          # Dashboard (protected)
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Layout components
│   │   ├── auth/               # Auth forms
│   │   └── tasks/              # Task components
│   ├── lib/                    # Utilities and services
│   │   ├── api-client.ts       # API client
│   │   ├── auth.ts             # Auth configuration
│   │   └── types.ts            # TypeScript types
│   └── middleware.ts           # Route protection
├── public/                     # Static assets
├── .env.local                  # Environment variables (not in git)
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Available Scripts

### Development

```bash
npm run dev
```
Starts the development server with hot reload on `http://localhost:3000`

### Build

```bash
npm run build
```
Creates an optimized production build

### Start Production Server

```bash
npm run start
```
Starts the production server (requires `npm run build` first)

### Lint

```bash
npm run lint
```
Runs ESLint to check code quality

### Type Check

```bash
npm run type-check
```
Runs TypeScript compiler to check for type errors

## Key Features

### Authentication
- **Signup**: Create a new account at `/signup`
- **Login**: Authenticate at `/login`
- **Logout**: Click logout button in header
- **Protected Routes**: Dashboard requires authentication

### Task Management
- **View Tasks**: See all your tasks on the dashboard
- **Create Task**: Click "Add Task" button
- **Edit Task**: Click edit icon on task card
- **Delete Task**: Click delete icon (with confirmation)
- **Toggle Status**: Mark tasks as complete/incomplete

## Development Workflow

### 1. Start Backend First

Ensure the backend API is running before starting the frontend:

```bash
# In backend directory
uvicorn main:app --reload --port 8000
```

### 2. Start Frontend

```bash
# In frontend directory
npm run dev
```

### 3. Access Application

Open browser to `http://localhost:3000`

### 4. Test Authentication Flow

1. Navigate to `/signup`
2. Create a new account
3. Verify redirect to `/dashboard`
4. Test logout functionality
5. Login again at `/login`

### 5. Test Task Management

1. Create a new task
2. Edit the task
3. Toggle task status
4. Delete the task

## Common Issues and Solutions

### Issue: "Cannot connect to API"

**Solution**:
- Verify backend is running on the correct port
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is configured on backend

### Issue: "Authentication not working"

**Solution**:
- Verify `BETTER_AUTH_SECRET` matches between frontend and backend
- Clear browser cookies and try again
- Check browser console for error messages

### Issue: "Module not found" errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"

**Solution**:
```bash
# Use a different port
PORT=3001 npm run dev
```

### Issue: TypeScript errors

**Solution**:
```bash
# Regenerate TypeScript types
npm run type-check
```

## API Integration

The frontend communicates with the backend via REST API:

**Base URL**: `http://localhost:8000` (configurable via env)

**Endpoints**:
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End session
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/toggle` - Toggle task status

**Authentication**: JWT token automatically attached to all requests via axios interceptor

## Testing

### Manual Testing Checklist

- [ ] User can signup with valid email and password
- [ ] User cannot signup with existing email
- [ ] User can login with valid credentials
- [ ] User cannot login with invalid credentials
- [ ] Unauthenticated user redirected to login
- [ ] Authenticated user can access dashboard
- [ ] User can create a new task
- [ ] User can edit an existing task
- [ ] User can delete a task (with confirmation)
- [ ] User can toggle task completion status
- [ ] User can logout successfully
- [ ] UI is responsive on mobile devices
- [ ] Loading states display during API calls
- [ ] Error messages display for failed operations

### Browser Testing

Test on the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Responsive Testing

Test on the following viewport sizes:
- Mobile: 320px - 480px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## Code Quality

### TypeScript

All code uses TypeScript with strict mode enabled. Type definitions are in `src/lib/types.ts`.

### Linting

ESLint is configured with Next.js recommended rules. Run `npm run lint` before committing.

### Formatting

Prettier is recommended for code formatting. Configure your editor to format on save.

## Deployment Considerations

### Environment Variables

For production deployment, set the following environment variables:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
BETTER_AUTH_SECRET=production-secret-key-min-32-chars
BETTER_AUTH_URL=https://yourdomain.com
```

### Build for Production

```bash
npm run build
npm run start
```

### Deployment Platforms

The Next.js app can be deployed to:
- **Vercel**: Recommended (zero-config deployment)
- **Netlify**: Supports Next.js
- **AWS**: Using Amplify or EC2
- **Docker**: Containerized deployment

## Security Considerations

### JWT Token Storage

- Tokens stored in httpOnly cookies (managed by Better Auth)
- Never store tokens in localStorage or sessionStorage
- Tokens automatically included in API requests

### CORS Configuration

Backend must allow requests from frontend origin:
```python
# Backend CORS configuration
origins = ["http://localhost:3000", "https://yourdomain.com"]
```

### Environment Variables

- Never commit `.env.local` to version control
- Use different secrets for development and production
- Rotate secrets regularly

## Next Steps

After completing the quickstart setup:

1. Review the implementation plan in `specs/master/plan.md`
2. Review the data model in `specs/master/data-model.md`
3. Review API contracts in `specs/master/contracts/api-contracts.md`
4. Run `/sp.tasks` to generate actionable task breakdown
5. Begin implementation following the defined order

## Support and Documentation

### Project Documentation
- **Specification**: `specs/frontend-ui/spec.md`
- **Implementation Plan**: `specs/master/plan.md`
- **Data Model**: `specs/master/data-model.md`
- **API Contracts**: `specs/master/contracts/api-contracts.md`

### External Documentation
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Better Auth**: https://better-auth.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## Troubleshooting

If you encounter issues not covered here:

1. Check browser console for error messages
2. Check terminal output for server errors
3. Verify all environment variables are set correctly
4. Ensure backend API is running and accessible
5. Clear browser cache and cookies
6. Restart development server

For additional help, refer to the project documentation or consult the development team.
