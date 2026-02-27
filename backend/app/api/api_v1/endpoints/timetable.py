from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models
from app.api import deps
from app.services.timetable_opt import TimetableSolver
from app.services.faculty_predictor import faculty_predictor
import app.schemas.ai_optimization as ai_schemas
from pydantic import BaseModel

router = APIRouter()

class TimetableGenerateRequest(BaseModel):
    semester: int
    department: str

@router.post("/generate", response_model=List[Dict[str, Any]])
def generate_timetable(
    request: TimetableGenerateRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate optimal timetable using AI (Constraint Satisfaction Problem).
    """
    # 1. Fetch Resources
    courses = crud.course.get_multi(db) 
    rooms = crud.room.get_multi(db)
    
    # --- MOCK DATA FALLBACK (For Demo/Testing without DB population) ---
    if not courses:
        class MockCourse:
            def __init__(self, code, name, credits=3): 
                self.code = code
                self.name = name
                self.credits = credits # 3 sessions per week
        # Full set of courses matching AIML Year 1 Semester 1
        courses = [
            MockCourse("ED&CAD", "Engineering Drawing", 5),
            MockCourse("AEP", "Advanced English Practice", 3),
            MockCourse("AEP Lab", "Advanced English Lab", 2),
            MockCourse("M&C", "Maths & Calculus", 5),
            MockCourse("PPS", "Programming for Problem Solving", 4),
            MockCourse("PPS Lab", "PPS Lab", 3),
            MockCourse("EDC", "Electron Devices & Circuits", 4),
            MockCourse("EWS", "Engineering Workshop", 2),
            MockCourse("ITWS", "IT Workshop", 2),
            MockCourse("RL", "Reinforcement Learning", 4),
            MockCourse("QC", "Quantum Computing", 3),
            MockCourse("FDS", "Fundamentals of Data Science", 3),
            MockCourse("ITE", "IT Essentials", 3),
        ]
        
    if not rooms:
        class MockRoom:
            def __init__(self, name, capacity=60):
                self.name = name
                self.capacity = capacity
        rooms = [MockRoom("Room 101"), MockRoom("Room 102"), MockRoom("Lab A")]

    # Mocking TimeSlots to match frontend (React) structure
    class MockSlot:
        def __init__(self, id): self.id = id
    
    # Generate (Day * Time) slots
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    times = ["09:40", "10:40", "11:40", "01:20", "02:20", "03:20"] 
    
    slots = []
    for d in days:
        for t in times:
            slots.append(MockSlot(f"{d}-{t}"))
            
    if not courses or not rooms:
         raise HTTPException(status_code=400, detail="Not enough data (courses/rooms) to generate timetable")

    # 2. Run Solver
    solver = TimetableSolver(courses, rooms, slots)
    schedule = solver.solve()
    
    if not schedule:
        raise HTTPException(status_code=400, detail="Could not find a feasible solution. Try adding more rooms or reducing courses.")
        
    return schedule

@router.post("/reallocate")
def reallocate_resource(
    affected_classes: List[str],
    candidate_moves: Dict[str, List[Any]],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Dynamic reallocation using AI optimization.
    Expects affected_classes (list of IDs) and candidate_moves (map of class ID to list of possible moves).
    Each move should be [new_timeslot, new_room, new_faculty, penalty_cost].
    """
    from app.ai_models.model_reallocation_ortools import build_reallocation_model
    import ortools.sat.python.cp_model as cp_model

    model, choose = build_reallocation_model(affected_classes, candidate_moves)
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    results = {}
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        for cls in affected_classes:
            for k, move in enumerate(candidate_moves[cls]):
                if solver.Value(choose[(cls, k)]) == 1:
                    results[cls] = {
                        "timeslot": move[0],
                        "room": move[1],
                        "faculty": move[2],
                        "penalty": move[3]
                    }
        return {"status": "success", "reallocations": results}
    else:
        raise HTTPException(status_code=400, detail="Could not find a feasible reallocation.")

@router.post("/compliance-report")
def generate_compliance_report(
    section_data: Dict[str, Any],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Generate NBA/NAAC/UGC Compliance Summary.
    """
    from app.ai_models.model_compliance_report_generator import build_compliance_report
    report = build_compliance_report(section_data)
    return {"report": report}

@router.get("/available-faculty")
def get_available_faculty(
    timeslot_id: int,
    department: str,
    semester: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get faculty members from the same department/branch who are free during a specific timeslot
    and teach in the same "year" (derived from semester).
    """
    from app.models.academic import TimetableSlot, Course


    from app.models.user import Faculty
    
    # Calculate Year from Semester (1-2: Year 1, 3-4: Year 2, etc.)
    target_year = (semester + 1) // 2
    
    # 1. Find all faculty in department
    faculty_in_dept = db.query(Faculty).filter(Faculty.department == department).all()
    
    # 2. Filter by faculty who teach courses in the same year
    # Get all course IDs for the target year (semesters in that year)
    year_semesters = [target_year * 2 - 1, target_year * 2]
    courses_in_year = db.query(Course.id).filter(Course.semester.in_(year_semesters)).subquery()
    
    # 3. Find faculty who are BUSY in the given timeslot
    busy_faculty_ids = db.query(Course.instructor_id).join(
        TimetableSlot, TimetableSlot.course_id == Course.id
    ).filter(
        TimetableSlot.time_slot_id == timeslot_id,
        TimetableSlot.is_active == True
    ).distinct().all()
    busy_faculty_ids = [f[0] for f in busy_faculty_ids if f[0] is not None]
    
    # 4. Filter dept faculty to those teaching in that year AND not busy
    available_faculty = []
    for f in faculty_in_dept:
        # Check if they teach in this year
        teaches_in_year = db.query(Course).filter(
            Course.instructor_id == f.id,
            Course.semester.in_(year_semesters)
        ).first() is not None
        
        if teaches_in_year and f.id not in busy_faculty_ids:
            available_faculty.append({
                "id": f.id,
                "name": f.user.full_name if f.user else "N/A",
                "designation": f.designation,
                "department": f.department
            })
            
    return available_faculty

@router.post("/faculty/predict-availability", response_model=ai_schemas.FacultyPredictionResponse)
def predict_faculty_availability(
    request: ai_schemas.FacultyPredictionRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Predict likelihood of a faculty member being available for a given slot.
    """
    probability = faculty_predictor.predict(
        day=request.day_of_week,
        hour=request.hour_slot,
        leave_rate=request.past_leave_rate,
        workload=request.workload_hours,
        back_to_back=request.back_to_back_classes,
        absence_flag=request.historical_absence_flag
    )
    
    return {
        "availability_score": probability,
        "is_available": probability > 0.5
    }
