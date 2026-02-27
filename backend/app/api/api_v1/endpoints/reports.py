from typing import Any, Dict
import app.schemas.ai_optimization as ai_schemas
from app.ai_models.model_compliance_report_generator import build_compliance_report
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, models
from app.api import deps

router = APIRouter()

@router.post("/compliance", response_model=ai_schemas.ComplianceReportResponse)
def generate_compliance_report_endpoint(
    request: ai_schemas.ComplianceReportRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generates automated Accreditation & Compliance Report (NBA/NAAC) using AI model.
    """
    section_data = request.dict()
    report_text = build_compliance_report(section_data)
    
    return {
        "institution_name": "Smart Campus University",
        "report_content": report_text
    }
