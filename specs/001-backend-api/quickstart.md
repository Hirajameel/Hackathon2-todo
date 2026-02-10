# Quickstart Guide: Backend API

**Feature**: Secure Multi-User Todo Backend API
**Date**: 2026-02-08
**Prerequisites**: Python 3.11+, Neon PostgreSQL database

## Overview

This guide walks you through setting up and running the FastAPI backend locally, testing the API endpoints, and troubleshooting common issues.

---

## Prerequisites

### Required Software
- **Python**: 3.11 or higher
- **pip**: Python package manager (included with Python)
- **Git**: For cloning the repository
- **Neon Account**: Free tier available at [neon.tech](https://neon.tech)

### Required Credentials
- **Neon Database URL**: PostgreSQL connection string from Neon dashboard
- **Better Auth Secret**: Shared secret from frontend configuration (must match frontend)

---

## Setup Instructions

### 1. Clone Repository and Navigate to Backend

```bash
cd C:\Users\DELL\Desktop\TODO-APP-PHASE2
cd backend
```

### 2. Create Virtual Environment

**Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac**:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**Expected dependencies** (requirements.txt):
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlmodel==0.0.14
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
python-dotenv==1.0.0
pydantic-settings==2.1.0
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy example file
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Database Configuration
NEON_DB_URL=postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# Authentication Configuration
BETTER_AUTH_SECRET=your-secret-key-here-change-in-production-min-32-characters
BETTER_AUTH_URL=http://localhost:3000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Server Configuration
PORT=8000
LOG_LEVEL=INFO
```

**Important**:
- `NEON_DB_URL`: Get from Neon dashboard → Connection Details
- `BETTER_AUTH_SECRET`: Must match the secret in your frontend `.env` file
- `ALLOWED_ORIGINS`: Include all frontend URLs (development and production)

### 5. Initialize Database

The database tables will be created automatically on first startup. To manually initialize:

```bash
python -c "from app.database import create_db_and_tables; create_db_and_tables()"
```

### 6. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 7. Verify API is Running

Open browser and navigate to:
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc (ReDoc)
- **Health Check**: http://localhost:8000/ (if implemented)

---

## Testing the API

### Option 1: Using Swagger UI (Recommended for Development)

1. Navigate to http://localhost:8000/docs
2. Click "Authorize" button at the top
3. Enter your JWT token: `Bearer <your_jwt_token>`
4. Click "Authorize" and "Close"
5. Expand any endpoint and click "Try it out"
6. Fill in parameters and click "Execute"

### Option 2: Using curl

**Get JWT Token from Frontend**:
First, log in to the frontend application and extract the JWT token from browser DevTools:
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Find the auth token (key may vary based on Better Auth config)
4. Copy the token value

**Test Endpoints**:

```bash
# Set your token as a variable
export TOKEN="your_jwt_token_here"
export USER_ID="your_user_id_here"

# Get all tasks
curl -X GET "http://localhost:8000/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN"

# Create a new task
curl -X POST "http://localhost:8000/api/$USER_ID/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task from curl",
    "description": "This is a test"
  }'

# Get single task (replace 1 with actual task ID)
curl -X GET "http://localhost:8000/api/$USER_ID/tasks/1" \
  -H "Authorization: Bearer $TOKEN"

# Update task (replace 1 with actual task ID)
curl -X PUT "http://localhost:8000/api/$USER_ID/tasks/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true
  }'

# Toggle completion (replace 1 with actual task ID)
curl -X PATCH "http://localhost:8000/api/$USER_ID/tasks/1/complete" \
  -H "Authorization: Bearer $TOKEN"

# Delete task (replace 1 with actual task ID)
curl -X DELETE "http://localhost:8000/api/$USER_ID/tasks/1" \
  -H "Authorization: Bearer $TOKEN"
```

### Option 3: Using Python Requests

```python
import requests

BASE_URL = "http://localhost:8000"
TOKEN = "your_jwt_token_here"
USER_ID = "your_user_id_here"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Get all tasks
response = requests.get(f"{BASE_URL}/api/{USER_ID}/tasks", headers=headers)
print(response.json())

# Create task
task_data = {
    "title": "Test task from Python",
    "description": "This is a test"
}
response = requests.post(f"{BASE_URL}/api/{USER_ID}/tasks", json=task_data, headers=headers)
print(response.json())
```

---

## Running Tests

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=app --cov-report=html
```

View coverage report: `htmlcov/index.html`

### Run Specific Test File

```bash
pytest tests/test_tasks.py
pytest tests/test_auth.py
```

### Run with Verbose Output

```bash
pytest -v
```

---

## Common Issues and Troubleshooting

### Issue 1: "Connection refused" or "Cannot connect to database"

**Symptoms**:
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solutions**:
1. Verify `NEON_DB_URL` is correct in `.env`
2. Check that `sslmode=require` is in the connection string
3. Verify Neon database is active (not paused)
4. Test connection manually:
   ```bash
   psql "postgresql://user:pass@host/db?sslmode=require"
   ```

### Issue 2: "Invalid or expired authentication token"

**Symptoms**:
```json
{"detail": "Invalid or expired authentication token."}
```

**Solutions**:
1. Verify `BETTER_AUTH_SECRET` matches frontend configuration
2. Check that JWT token is not expired (tokens typically expire after 1 hour)
3. Ensure token format is correct: `Bearer <token>` (note the space)
4. Generate a new token by logging in again on the frontend

### Issue 3: "403 Forbidden" when accessing tasks

**Symptoms**:
```json
{"detail": "You do not have permission to access this resource."}
```

**Solutions**:
1. Verify `user_id` in URL path matches the `sub` claim in your JWT token
2. Decode your JWT token to check the user_id:
   ```bash
   # Using jwt.io or python-jose
   python -c "from jose import jwt; print(jwt.get_unverified_claims('YOUR_TOKEN'))"
   ```
3. Ensure you're using the correct user_id from the JWT, not a guessed value

### Issue 4: "422 Validation Error" when creating/updating tasks

**Symptoms**:
```json
{
  "detail": "Validation error",
  "field_errors": {
    "title": ["Title is required and cannot be empty"]
  }
}
```

**Solutions**:
1. Verify request body includes all required fields
2. Check field length constraints:
   - Title: 1-200 characters (required)
   - Description: 0-1000 characters (optional)
3. Ensure `Content-Type: application/json` header is set
4. Validate JSON syntax (use a JSON validator)

### Issue 5: CORS errors in browser

**Symptoms**:
```
Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solutions**:
1. Verify `ALLOWED_ORIGINS` in `.env` includes your frontend URL
2. Restart the backend server after changing `.env`
3. Check that frontend URL exactly matches (including protocol and port)
4. Clear browser cache and try again

### Issue 6: Module not found errors

**Symptoms**:
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solutions**:
1. Ensure virtual environment is activated:
   ```bash
   # Windows
   venv\Scripts\activate

   # Linux/Mac
   source venv/bin/activate
   ```
2. Reinstall dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Verify Python version:
   ```bash
   python --version  # Should be 3.11+
   ```

---

## Development Workflow

### Making Changes

1. **Modify code** in `app/` directory
2. **Server auto-reloads** (if using `--reload` flag)
3. **Test changes** using Swagger UI or curl
4. **Run tests** to verify nothing broke:
   ```bash
   pytest
   ```

### Adding New Endpoints

1. Define route in `app/routers/tasks.py` (or new router file)
2. Add request/response schemas in `app/schemas.py`
3. Update OpenAPI docs (automatic with FastAPI)
4. Write tests in `tests/`
5. Update this quickstart guide if needed

### Database Schema Changes

1. Modify models in `app/models.py`
2. If using Alembic:
   ```bash
   alembic revision --autogenerate -m "Description of change"
   alembic upgrade head
   ```
3. If not using Alembic, drop and recreate tables (development only):
   ```bash
   # WARNING: This deletes all data
   python -c "from app.database import engine; from app.models import SQLModel; SQLModel.metadata.drop_all(engine); SQLModel.metadata.create_all(engine)"
   ```

---

## Production Deployment

### Environment Variables

Update `.env` for production:
```env
NEON_DB_URL=<production_database_url>
BETTER_AUTH_SECRET=<strong_production_secret>
ALLOWED_ORIGINS=https://yourdomain.com
LOG_LEVEL=WARNING
PORT=8000
```

### Running in Production

**Using Gunicorn** (recommended):
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Using Docker** (if Dockerfile exists):
```bash
docker build -t todo-backend .
docker run -p 8000:8000 --env-file .env todo-backend
```

### Security Checklist

- [ ] Use strong `BETTER_AUTH_SECRET` (32+ characters, random)
- [ ] Set `ALLOWED_ORIGINS` to specific domains (no wildcards)
- [ ] Use HTTPS in production (configure reverse proxy)
- [ ] Set `LOG_LEVEL=WARNING` or `ERROR` in production
- [ ] Never commit `.env` file to version control
- [ ] Enable database connection pooling
- [ ] Set up monitoring and alerting
- [ ] Configure rate limiting (at API gateway level)

---

## Useful Commands

```bash
# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install/update dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov=app

# Check code style (if using)
black app/ tests/
flake8 app/ tests/

# Type checking (if using)
mypy app/

# Generate requirements.txt
pip freeze > requirements.txt

# Database migrations (if using Alembic)
alembic revision --autogenerate -m "message"
alembic upgrade head
alembic downgrade -1
```

---

## Next Steps

1. **Integrate with Frontend**: Update frontend API client to point to `http://localhost:8000`
2. **Test End-to-End**: Log in on frontend, create tasks, verify they appear
3. **Add More Features**: Implement additional endpoints as needed
4. **Deploy**: Follow production deployment guide above

---

## Support and Resources

- **API Documentation**: http://localhost:8000/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **SQLModel Docs**: https://sqlmodel.tiangolo.com
- **Neon Docs**: https://neon.tech/docs
- **Better Auth Docs**: https://www.better-auth.com/docs

For issues or questions, refer to the main project README or contact the development team.
