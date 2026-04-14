from typing import Any, List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.api import deps
from app.models.academic import Attendance as AttendanceModel
from app.models.user import Student as StudentModel
from app.schemas.academic import Attendance, AttendanceCreate

router = APIRouter()

@router.get("/", response_model=List[Attendance])
def read_attendance(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    course_code: Optional[str] = None,
    attendance_date: Optional[date] = None,
    student_id: Optional[int] = None,
) -> Any:
    """
    Retrieve attendance records. Always returns a list.
    """
    try:
        query = db.query(AttendanceModel)
        if course_code:
            query = query.filter(AttendanceModel.course_code == course_code)
        if attendance_date:
            query = query.filter(AttendanceModel.attendance_date == attendance_date)
        if student_id:
            query = query.filter(AttendanceModel.student_id == student_id)
        
        return query.offset(skip).limit(limit).all()
    except Exception as e:
        print(f"ERROR in GET attendance: {str(e)}")
        return []

@router.post("/bulk", response_model=List[Attendance])
def create_bulk_attendance(
    *,
    db: Session = Depends(deps.get_db),
    attendance_in: List[AttendanceCreate]
) -> Any:
    """
    Create bulk attendance records. Accepts a List[AttendanceCreate].
    Uses an upsert strategy for student_id + course_code + attendance_date + period.
    """
    print(f"INFO: Processing {len(attendance_in)} records")
    new_records = []
    try:
        for record in attendance_in:
            data = record.dict()
            
            # 1. Validate that the student exists in the database to avoid IntegrityErrors (ForeignKey)
            # This is critical because the frontend mock data might have more students than the DB
            student_exists = db.query(StudentModel).filter(StudentModel.id == data["student_id"]).first()
            if not student_exists:
                print(f"WARNING: Student ID {data['student_id']} does not exist in DB. Skipping.")
                continue

            # Check if record already exists for this unique combination
            existing = db.query(AttendanceModel).filter(
                AttendanceModel.student_id == data["student_id"],
                AttendanceModel.course_code == data["course_code"],
                AttendanceModel.attendance_date == data["attendance_date"],
                AttendanceModel.period == data["period"]
            ).first()
            
            if existing:
                existing.status = data["status"]
                db.add(existing)
                new_records.append(existing)
            else:
                db_obj = AttendanceModel(**data)
                db.add(db_obj)
                new_records.append(db_obj)
                
        db.commit()
        for rec in new_records:
            try:
                db.refresh(rec)
            except Exception:
                db.rollback()
                continue
        print(f"SUCCESS: Saved {len(new_records)} records")
        return new_records
    except IntegrityError as ie:
        db.rollback()
        print(f"INTEGRITY ERROR: {str(ie)}")
        raise HTTPException(
            status_code=400,
            detail="Database integrity error: Ensure all students and courses exist in the system."
        )
    except Exception as e:
        print(f"CRITICAL ERROR in bulk attendance: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Server Error: {str(e)}"
        )

@router.post("/", response_model=Attendance)
def create_attendance(
    *,
    db: Session = Depends(deps.get_db),
    record_in: AttendanceCreate
) -> Any:
    """
    Create a single attendance record.
    """
    data = record_in.dict()
    
    # Validate student existence
    student_exists = db.query(StudentModel).filter(StudentModel.id == data["student_id"]).first()
    if not student_exists:
        raise HTTPException(status_code=400, detail=f"Student ID {data['student_id']} not found in database.")

    existing = db.query(AttendanceModel).filter(
        AttendanceModel.student_id == data["student_id"],
        AttendanceModel.course_code == data["course_code"],
        AttendanceModel.attendance_date == data["attendance_date"],
        AttendanceModel.period == data["period"]
    ).first()
    
    if existing:
        existing.status = data["status"]
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing
        
    db_obj = AttendanceModel(**data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
