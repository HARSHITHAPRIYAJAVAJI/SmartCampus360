from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.schemas import admissions as schemas_admissions
from app.api import deps

router = APIRouter()

@router.post("/apply", response_model=schemas_admissions.Admission)
def submit_admission(
    *,
    db: Session = Depends(deps.get_db),
    admission_in: schemas_admissions.AdmissionCreate,
) -> Any:
    """
    Submit new admission application.
    """
    admission = crud.admission.create(db, obj_in=admission_in)
    return admission

@router.get("/status/{email}", response_model=List[schemas_admissions.Admission])
def check_admission_status(
    email: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Check admission status by email.
    """
    admissions = crud.admission.get_by_email(db, email=email)
    return admissions
