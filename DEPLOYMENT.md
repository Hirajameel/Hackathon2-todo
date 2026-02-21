# Deployment Guide

## Frontend Deployment (Netlify)

### Step 1: Push to GitHub
Your code is already on GitHub at: https://github.com/Hirajameel/Hackathon2-todo

### Step 2: Deploy to Netlify

#### Option A: Via Netlify Dashboard

1. Go to https://netlify.com and sign up/login with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub account
4. Select repository: `Hirajameel/Hackathon2-todo`
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Click **"Deploy site"**

#### Option B: Via Netlify CLI

```bash
npm install -g netlify-cli
cd frontend
netlify login
netlify init
netlify deploy --prod
```

### Step 3: Add Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:

```
BETTER_AUTH_SECRET=SrxKa6zcYFB8KiIUp0Ik0OflN7SSB3R7
NEON_DB_URL=postgresql://neondb_owner:npg_sZ3EmFBvV4yo@ep-nameless-snow-a7y7qyzp-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Important**: After backend deployment, update `NEXT_PUBLIC_API_URL` to your backend URL.

### Step 4: Wait for Deployment

Netlify will automatically build and deploy your site. You'll get a URL like `https://your-site-name.netlify.app`.

## Backend Deployment

Backend needs to be deployed separately on Railway, Render, or similar platform.

### Environment Variables for Backend:
- `DATABASE_URL`: Your Neon database URL
- `SECRET_KEY`: Your JWT secret key
- `ALGORITHM`: HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 30

## Post-Deployment

1. Update `NEXT_PUBLIC_API_URL` in Netlify with your backend URL
2. Update CORS settings in backend to allow your Netlify domain
3. Test authentication and task management features
