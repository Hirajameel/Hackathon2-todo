# Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub
Your code is already on GitHub at: https://github.com/Hirajameel/Hackathon2-todo

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign up/login with GitHub
2. Click "Add New Project"
3. Import your repository: `Hirajameel/Hackathon2-todo`
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel dashboard, add these environment variables:

```
BETTER_AUTH_SECRET=SrxKa6zcYFB8KiIUp0Ik0OflN7SSB3R7
NEON_DB_URL=postgresql://neondb_owner:npg_sZ3EmFBvV4yo@ep-nameless-snow-a7y7qyzp-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Important**: After backend deployment, update `NEXT_PUBLIC_API_URL` to your backend URL.

### Step 4: Deploy

Click "Deploy" and wait for deployment to complete.

## Backend Deployment

Backend needs to be deployed separately on Railway, Render, or similar platform.

### Environment Variables for Backend:
- `DATABASE_URL`: Your Neon database URL
- `SECRET_KEY`: Your JWT secret key
- `ALGORITHM`: HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 30

## Post-Deployment

1. Update `NEXT_PUBLIC_API_URL` in Vercel with your backend URL
2. Update CORS settings in backend to allow your Vercel domain
3. Test authentication and task management features
