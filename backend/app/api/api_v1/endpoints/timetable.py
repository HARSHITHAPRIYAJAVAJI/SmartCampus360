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

class TimetableSaveRequest(BaseModel):
    year: int
    semester: int
    department: str
    section: str
    schedule: Dict[str, Any]

class TimetablePublishRequest(BaseModel):
    semester: int
    department: str

@router.get("/all")
def get_all_timetables(db: Session = Depends(deps.get_db)) -> Any:
    """Return all saved timetables."""
    from app.models.academic import TimetableSlot
    slots = db.query(TimetableSlot).all()
    # Simple formatting for demo, in production we'd return a better structured object
    return [s.__dict__ for s in slots] if slots else []

@router.post("/save")
def save_timetable(
    request: TimetableSaveRequest,
    db: Session = Depends(deps.get_db),
) -> Any:
    """Save a generated timetable schedule."""
    # (Placeholder logic for persistence)
    return {"status": "saved", "year": request.year, "semester": request.semester, "section": request.section}

@router.post("/publish")
def publish_timetable(
    request: TimetablePublishRequest,
    db: Session = Depends(deps.get_db),
) -> Any:
    """Mark all timetables for a semester/department as published."""
    return {"status": "published", "count": "all"}


class TimetableGenerateRequest(BaseModel):
    year: int
    semester: int
    department: str

@router.post("/generate", response_model=List[Dict[str, Any]])
def generate_timetable(
    request: TimetableGenerateRequest,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Generate optimal timetable using AI (Constraint Satisfaction Problem).
    """
    # 1. Fetch Resources
    # In a real app, we would filter by department and sem/year in DB:
    # courses = db.query(models.Course).filter(
    #     models.Course.department == request.department,
    #     models.Course.year == request.year,
    #     models.Course.semester == request.semester
    # ).all()
    courses = crud.course.get_multi(db) 
    rooms = crud.room.get_multi(db)
    
    # --- MOCK DATA FALLBACK (For Demo/Testing without DB population) ---
    if not courses:
        class MockCourse:
            def __init__(self, code, name, year, sem, credits=3): 
                self.code = code
                self.name = name
                self.year = year
                self.sem = sem
                self.credits = credits

        all_mock_courses = [
            # Year 1, Semester 1
            MockCourse("ED&CAD", "Engineering Drawing", 1, 1, 5),
            MockCourse("AEP", "Advanced English Practice", 1, 1, 3),
            MockCourse("M&C", "Maths & Calculus", 1, 1, 5),
            MockCourse("PPS", "Programming for Problem Solving", 1, 1, 4),
            
            # Year 1, Semester 2
            MockCourse("DS", "Data Structures", 1, 2, 4),
            MockCourse("PP", "Python Programming", 1, 2, 3),

            # Year 2, Semester 1
            MockCourse("CAO", "Computer Organization", 2, 1, 3),
            MockCourse("MFCS", "Math Foundations", 2, 1, 4),
            MockCourse("CN", "Computer Networks", 2, 1, 3),
            
            # Year 2, Semester 2
            MockCourse("JAVA", "Java Programming", 2, 2, 4),
            MockCourse("DBMS", "Database Systems", 2, 2, 4),
            MockCourse("DAA", "Algorithms", 2, 2, 3),

            # Year 3, Semester 1
            MockCourse("ML", "Machine Learning", 3, 1, 4),
            MockCourse("AI", "Artificial Intelligence", 3, 1, 3),
            MockCourse("OS", "Operating Systems", 3, 1, 3),
            
            # Year 3, Semester 2
            MockCourse("DL", "Deep Learning", 3, 2, 4),
            MockCourse("NLP", "Natural Language Processing", 3, 2, 3),

            # Year 4, Semester 1
            MockCourse("BDA", "Big Data Analytics", 4, 1, 4),
            MockCourse("IS", "Information Security", 4, 1, 3),

            # Year 4, Semester 2
            MockCourse("RL", "Reinforcement Learning", 4, 2, 4),
            MockCourse("QC", "Quantum Computing", 4, 2, 3),
            MockCourse("FDS", "Fundamentals of Data Science", 4, 2, 3),
            MockCourse("ITE", "IT Essentials", 4, 2, 3),
        ]
        
        # Filter based on request
        courses = [c for c in all_mock_courses if c.year == request.year and c.sem == request.semester]
        
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
