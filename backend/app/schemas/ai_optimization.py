from typing import List, Dict, Any, Optional
from pydantic import BaseModel

# --- Faculty Availability Prediction ---

class FacultyPredictionRequest(BaseModel):
    day_of_week: int # 0=Monday, 6=Sunday
    hour_slot: int # 9, 10, 11 etc.
    past_leave_rate: float # 0.0 to 1.0
    workload_hours: int
    back_to_back_classes: int
    historical_absence_flag: int # 0 or 1

class FacultyPredictionResponse(BaseModel):
    availability_score: float # Probability of being available
    is_available: bool # Threshold based (e.g., > 0.5)

# --- Compliance Report ---

class ComplianceReportRequest(BaseModel):
    date: str
    program_outcomes: str
    timetable_summary: str
    faculty_workload: str
    lab_utilization: str
    student_attainment: str
    compliance_body: Optional[str] = "NBA/NAAC/UGC"

class ComplianceReportResponse(BaseModel):
    institution_name: str
    report_content: str
