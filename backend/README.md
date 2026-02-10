# Todo Backend API

Secure multi-user Todo application backend with JWT authentication.

## Features

- 🔐 JWT-based authentication with Better Auth integration
- 👥 Multi-user support with strict data isolation
- 📝 Full CRUD operations for tasks
- ✅ Task completion tracking
- 🚀 FastAPI with automatic OpenAPI documentation
- 🗄️ PostgreSQL database with SQLModel ORM
- 🔒 CORS-enabled for frontend integration

## Prerequisites

- Python 3.11 or higher
- Neon PostgreSQL database (or any PostgreSQL instance)
- Better Auth secret (shared with frontend)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
NEON_DB_URL=postgresql://user:password@host/database?sslmode=require

# Authentication Configuration
BETTER_AUTH_SECRET=your-secret-key-min-32-characters
BETTER_AUTH_URL=http://localhost:3000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Server Configuration
PORT=8000
LOG_LEVEL=INFO
```

### 3. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Tasks

- `GET /api/{user_id}/tasks` - Get all tasks for user
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{id}` - Get single task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion status

### Health Check

- `GET /` - API health check

## Authentication

The API verifies JWT tokens issued by Better Auth. The token must include:
- `sub` claim: User ID
- Valid signature using `BETTER_AUTH_SECRET`
- Not expired

## User Isolation

- Users can only access their own tasks
- `user_id` in URL must match JWT token `sub` claim
- All database queries filter by authenticated user

## Error Responses

All errors return JSON with consistent format:

```json
{
  "detail": "Human-readable error message"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (user_id mismatch)
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Development

### Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── database.py          # Database setup
│   ├── models.py            # SQLModel models
│   ├── schemas.py           # Pydantic schemas
│   ├── dependencies.py      # Dependency injection
│   ├── middleware/
│   │   └── auth.py          # JWT verification
│   └── routers/
│       └── tasks.py         # Task endpoints
├── tests/
│   └── __init__.py
├── .env                     # Environment variables (not in git)
├── .env.example             # Example environment file
├── .gitignore
├── requirements.txt
└── README.md
```

### Running Tests

```bash
pytest
pytest --cov=app --cov-report=html
```

### Code Quality

```bash
# Format code
black app/ tests/

# Lint
flake8 app/ tests/

# Type checking
mypy app/
```

## Deployment

### Environment Variables

Ensure all required environment variables are set:
- `NEON_DB_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - JWT signing secret (must match frontend)
- `BETTER_AUTH_URL` - Auth service URL
- `ALLOWED_ORIGINS` - Comma-separated CORS origins
- `PORT` - Server port (default: 8000)
- `LOG_LEVEL` - Logging level (default: INFO)

### Production Server

```bash
# Using Gunicorn
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Using Docker (if Dockerfile exists)
docker build -t todo-backend .
docker run -p 8000:8000 --env-file .env todo-backend
```

## Security

- ✅ JWT token verification on all endpoints
- ✅ User isolation enforced at database level
- ✅ Parameterized queries (SQL injection prevention)
- ✅ CORS configured for specific origins
- ✅ No secrets in code (environment variables only)
- ✅ Error messages don't expose internal details

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql "postgresql://user:pass@host/db?sslmode=require"
```

### JWT Token Issues

- Verify `BETTER_AUTH_SECRET` matches frontend
- Check token expiration
- Decode token to verify claims: https://jwt.io

### CORS Issues

- Verify `ALLOWED_ORIGINS` includes frontend URL
- Restart server after changing `.env`
- Check browser console for specific CORS errors

## License

[Your License Here]

## Support

For issues or questions, refer to the main project documentation.
