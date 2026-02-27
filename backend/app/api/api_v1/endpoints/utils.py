from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.security import get_password_hash
from app.models.academic import Room, Course

router = APIRouter()

@router.post("/seed-db")
def seed_database(
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_superuser), # Open for demo
) -> Any:
    """
    Seed database with sample data for demo purposes.
    """
    # 1. Create Rooms
    rooms = [
        {"name": "Lecture Hall A", "capacity": 60, "room_type": "Lecture"},
        {"name": "Lecture Hall B", "capacity": 60, "room_type": "Lecture"},
        {"name": "Lab 101", "capacity": 30, "room_type": "Lab"},
        {"name": "Seminar Room", "capacity": 20, "room_type": "Seminar"},
    ]
    for r in rooms:
        existing = db.query(Room).filter(Room.name == r["name"]).first()
        if not existing:
            db_room = Room(**r)
            db.add(db_room)
    
    # 2. Create Courses
    courses = [
        {"code": "CS101", "name": "Intro to Programming", "credits": 3, "department": "Computer Science"},
        {"code": "CS102", "name": "Data Structures", "credits": 4, "department": "Computer Science"},
        {"code": "MATH101", "name": "Calculus I", "credits": 3, "department": "Mathematics"},
        {"code": "PHY101", "name": "Physics I", "credits": 3, "department": "Physics"},
        {"code": "CS201", "name": "Database Systems", "credits": 3, "department": "Computer Science"},
    ]
    for c in courses:
        existing = db.query(Course).filter(Course.code == c["code"]).first()
        if not existing:
            db_course = Course(**c)
            db.add(db_course)
            
    # 3. Create Sample Users (Faculty/Student) if not exist
    # (Skipping for brevity, focusing on academic resources)
    
    db.commit()
    return {"message": "Database seeded with sample rooms and courses."}
