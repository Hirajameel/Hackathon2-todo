"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import create_db_and_tables
from app.routers import tasks, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup: Create database tables
    create_db_and_tables()
    yield
    # Shutdown: cleanup if needed


# Create FastAPI application
app = FastAPI(
    title="Todo Backend API",
    description="Secure multi-user Todo application backend with JWT authentication",
    version="1.0.0",
    lifespan=lifespan
)

# Parse comma-separated origins from environment
allowed_origins = [
    origin.strip()
    for origin in settings.ALLOWED_ORIGINS.split(",")
]

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=3600,
)

# Register routers
app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Todo Backend API is running"}
