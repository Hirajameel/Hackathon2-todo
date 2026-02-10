"""Script to reset database - drops and recreates all tables."""

import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlmodel import SQLModel
from app.database import engine

def reset_database():
    """Drop all tables and recreate them."""
    print("Dropping all tables...")
    SQLModel.metadata.drop_all(engine)
    print("All tables dropped")

    print("Creating fresh tables...")
    SQLModel.metadata.create_all(engine)
    print("Database reset complete!")
    print("\nFresh database ready with empty tables:")
    print("   - users")
    print("   - tasks")

if __name__ == "__main__":
    reset_database()
