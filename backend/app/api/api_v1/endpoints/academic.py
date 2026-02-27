from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, models
from app.api import deps
from app.schemas import academic as schemas_academic

router = APIRouter()

@router.get("/courses", response_model=List[schemas_academic.Course])
def read_courses(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return crud.course.get_multi(db, skip=skip, limit=limit)

@router.post("/courses", response_model=schemas_academic.Course)
def create_course(
    *,
    db: Session = Depends(deps.get_db),
    course_in: schemas_academic.CourseCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return crud.course.create(db, obj_in=course_in)

@router.get("/rooms", response_model=List[schemas_academic.Room])
def read_rooms(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return crud.room.get_multi(db, skip=skip, limit=limit)
