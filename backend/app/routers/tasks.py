"""Task management API routes."""

import logging
from datetime import datetime
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from app.models import Task
from app.schemas import TaskResponse, TaskCreate, TaskUpdate
from app.dependencies import verify_user_access, SessionDep

# Configure logging
logger = logging.getLogger(__name__)

# Create router for task endpoints
router = APIRouter(
    prefix="/api",
    tags=["tasks"]
)


@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
async def get_tasks(
    user_id: Annotated[str, Depends(verify_user_access)],
    session: SessionDep
):
    """
    Retrieve all tasks for the authenticated user.

    Args:
        user_id: User ID from JWT token (verified by dependency)
        session: Database session

    Returns:
        List of tasks belonging to the authenticated user

    Raises:
        HTTPException: 401 if token invalid, 403 if user_id mismatch, 500 on server error
    """
    try:
        # Query tasks filtered by authenticated user_id
        statement = select(Task).where(Task.user_id == user_id)
        tasks = session.exec(statement).all()
        return tasks
    except Exception as e:
        # Log error server-side
        logger.error(f"Error retrieving tasks for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )


@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: Annotated[str, Depends(verify_user_access)],
    task_data: TaskCreate,
    session: SessionDep
):
    """
    Create a new task for the authenticated user.

    Args:
        user_id: User ID from JWT token (verified by dependency)
        task_data: Task creation data (title, description)
        session: Database session

    Returns:
        Created task with 201 status

    Raises:
        HTTPException: 401 if token invalid, 403 if user_id mismatch,
                      422 if validation fails, 500 on server error
    """
    try:
        # Create new task with user_id from JWT (not from request body)
        task = Task(
            user_id=user_id,
            title=task_data.title,
            description=task_data.description
        )

        # Save to database
        session.add(task)
        session.commit()
        session.refresh(task)

        return task
    except Exception as e:
        # Rollback on error
        session.rollback()
        # Log error server-side
        logger.error(f"Error creating task for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )


@router.get("/{user_id}/tasks/{id}", response_model=TaskResponse)
async def get_task(
    user_id: Annotated[str, Depends(verify_user_access)],
    id: int,
    session: SessionDep
):
    """
    Retrieve a single task by ID for the authenticated user.

    Args:
        user_id: User ID from JWT token (verified by dependency)
        id: Task ID
        session: Database session

    Returns:
        Task with the specified ID

    Raises:
        HTTPException: 401 if token invalid, 403 if user_id mismatch or task belongs to different user,
                      404 if task not found, 500 on server error
    """
    try:
        # Query task by ID and user_id
        task = session.get(Task, id)

        if not task:
            raise HTTPException(
                status_code=404,
                detail="Task not found."
            )

        # Verify task belongs to authenticated user
        if task.user_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource."
            )

        return task
    except HTTPException:
        raise
    except Exception as e:
        # Log error server-side
        logger.error(f"Error retrieving task {id} for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )


@router.put("/{user_id}/tasks/{id}", response_model=TaskResponse)
async def update_task(
    user_id: Annotated[str, Depends(verify_user_access)],
    id: int,
    task_data: TaskUpdate,
    session: SessionDep
):
    """
    Update an existing task for the authenticated user.

    Args:
        user_id: User ID from JWT token (verified by dependency)
        id: Task ID
        task_data: Task update data (title, description, completed)
        session: Database session

    Returns:
        Updated task

    Raises:
        HTTPException: 401 if token invalid, 403 if user_id mismatch or task belongs to different user,
                      404 if task not found, 422 if validation fails, 500 on server error
    """
    try:
        # Query task by ID
        task = session.get(Task, id)

        if not task:
            raise HTTPException(
                status_code=404,
                detail="Task not found."
            )

        # Verify task belongs to authenticated user
        if task.user_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource."
            )

        # Update task fields
        task.title = task_data.title
        task.description = task_data.description
        task.completed = task_data.completed
        task.updated_at = datetime.utcnow()

        # Save changes
        session.add(task)
        session.commit()
        session.refresh(task)

        return task
    except HTTPException:
        raise
    except Exception as e:
        # Rollback on error
        session.rollback()
        # Log error server-side
        logger.error(f"Error updating task {id} for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )


@router.delete("/{user_id}/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: Annotated[str, Depends(verify_user_access)],
    id: int,
    session: SessionDep
):
    """
    Delete a task for the authenticated user.

    Args:
        user_id: User ID from JWT token (verified by dependency)
        id: Task ID
        session: Database session

    Returns:
        204 No Content on success

    Raises:
        HTTPException: 401 if token invalid, 403 if user_id mismatch or task belongs to different user,
                      404 if task not found, 500 on server error
    """
    try:
        # Query task by ID
        task = session.get(Task, id)

        if not task:
            raise HTTPException(
                status_code=404,
                detail="Task not found."
            )

        # Verify task belongs to authenticated user
        if task.user_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource."
            )

        # Delete task permanently
        session.delete(task)
        session.commit()

        # Return 204 No Content (no response body)
        return None
    except HTTPException:
        raise
    except Exception as e:
        # Rollback on error
        session.rollback()
        # Log error server-side
        logger.error(f"Error deleting task {id} for user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )


@router.patch("/{user_id}/tasks/{id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    user_id: Annotated[str, Depends(verify_user_access)],
    id: int,
    session: SessionDep
):
    """
    Toggle the completion status of a task for the authenticated user.

    Args:
        user_id: User ID from JWT token (verified by dependency)
        id: Task ID
        session: Database session

    Returns:
        Updated task with toggled completion status

    Raises:
        HTTPException: 401 if token invalid, 403 if user_id mismatch or task belongs to different user,
                      404 if task not found, 500 on server error
    """
    try:
        # Query task by ID
        task = session.get(Task, id)

        if not task:
            raise HTTPException(
                status_code=404,
                detail="Task not found."
            )

        # Verify task belongs to authenticated user
        if task.user_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource."
            )

        # Toggle completion status
        task.completed = not task.completed
        task.updated_at = datetime.utcnow()

        # Save changes
        session.add(task)
        session.commit()
        session.refresh(task)

        return task
    except HTTPException:
        raise
    except Exception as e:
        # Rollback on error
        session.rollback()
        # Log error server-side
        logger.error(f"Error toggling completion for task {id}, user {user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again later."
        )
