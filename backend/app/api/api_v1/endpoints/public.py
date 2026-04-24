from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, time

from app import models, schemas
from app.api import deps
from app.models.academic import TimetableSlot, Room, TimeSlot, WeekDay, Course
from app.models.user import User, Faculty
from app.models.navigation import Location, FacultyLocation
from app.schemas.navigation import SearchResponse, SearchResult, Location as LocationSchema

router = APIRouter()

@router.get("/search", response_model=SearchResponse)
def search_people_and_places(
    q: str = Query(..., min_length=1),
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Public search for campus facilities and faculty/staff.
    """
    results = []
    query = f"%{q}%"

    # 1. Search Locations (Facilities, Labs, Offices)
    locations = db.query(Location).filter(
        or_(
            Location.name.ilike(query),
            Location.block.ilike(query),
            Location.type.ilike(query)
        )
    ).limit(10).all()

    for loc in locations:
        results.append(SearchResult(
            type="location",
            name=loc.name,
            location=f"{loc.block}, {loc.floor}",
            block=loc.block,
            floor=loc.floor,
            details=loc.type
        ))

    # 2. Search Faculty
    faculty_members = db.query(Faculty).join(User).filter(
        or_(
            User.full_name.ilike(query),
            Faculty.department.ilike(query)
        )
    ).limit(10).all()

    # Get current time and day for timetable lookup
    now = datetime.now()
    current_day = now.strftime('%A')
    current_time = now.time()

    for f in faculty_members:
        # Determine location
        loc_name = "Department Office"
        loc_source = "default"
        block = f.department or "Main Block"
        floor = "G"

        # Check manual override
        manual_loc = db.query(FacultyLocation).filter(FacultyLocation.faculty_id == str(f.id)).first()
        if manual_loc and manual_loc.source == "manual":
            loc_name = manual_loc.current_location
            loc_source = "manual"
        else:
            # Check Timetable
            # Find a slot where this faculty is teaching right now
            slot = db.query(TimetableSlot).join(Course).join(TimeSlot).filter(
                Course.instructor_id == f.id,
                TimeSlot.day == WeekDay(current_day),
                TimeSlot.start_time <= current_time,
                TimeSlot.end_time >= current_time,
                TimetableSlot.is_active == True
            ).first()

            if slot:
                loc_name = slot.room.name if slot.room else "Classroom"
                block = slot.room.building if slot.room else block
                floor = slot.room.floor if slot.room else floor
                loc_source = "timetable"

        results.append(SearchResult(
            type="faculty",
            name=f.user.full_name if f.user else "Unknown",
            location=loc_name,
            block=block,
            floor=floor,
            details=f"{f.department} - {f.designation} (Source: {loc_source})"
        ))

    return {"type": "mixed", "results": results}

@router.get("/locations", response_model=List[LocationSchema])
def get_public_locations(db: Session = Depends(deps.get_db)) -> Any:
    """Get all public campus facilities."""
    return db.query(Location).all()

@router.get("/faculty-location/{faculty_id}", response_model=SearchResult)
def get_faculty_location(
    faculty_id: str,
    db: Session = Depends(deps.get_db)
) -> Any:
    """Get specific faculty current location."""
    f = db.query(Faculty).filter(Faculty.id == int(faculty_id)).first()
    if not f:
        # Fallback to search if faculty_id is actually user email or something
        f = db.query(Faculty).join(User).filter(or_(User.email == faculty_id, User.full_name == faculty_id)).first()
    
    if not f:
        # If still not found, search in FacultyLocation table which might have external IDs
        manual_loc = db.query(FacultyLocation).filter(FacultyLocation.faculty_id == faculty_id).first()
        if manual_loc:
             return SearchResult(
                type="faculty",
                name=faculty_id,
                location=manual_loc.current_location,
                details=f"Source: {manual_loc.source}"
            )
        return {"detail": "Faculty not found"}

    # Logic similar to search loop above
    now = datetime.now()
    current_day = now.strftime('%A')
    current_time = now.time()

    loc_name = "Department Office"
    loc_source = "default"
    block = f.department
    floor = "G"

    manual_loc = db.query(FacultyLocation).filter(FacultyLocation.faculty_id == str(f.id)).first()
    if manual_loc and manual_loc.source == "manual":
        loc_name = manual_loc.current_location
        loc_source = "manual"
    else:
        slot = db.query(TimetableSlot).join(Course).join(TimeSlot).filter(
            Course.instructor_id == f.id,
            TimeSlot.day == WeekDay(current_day),
            TimeSlot.start_time <= current_time,
            TimeSlot.end_time >= current_time
        ).first()
        if slot:
            loc_name = slot.room.name
            block = slot.room.building
            floor = slot.room.floor
            loc_source = "timetable"

    return SearchResult(
        type="faculty",
        name=f.user.full_name,
        location=loc_name,
        block=block,
        floor=floor,
        details=f"{f.department} - {f.designation} (Source: {loc_source})"
    )
