from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.schemas import placements as schemas_placements
from app.api import deps

router = APIRouter()

@router.get("/companies", response_model=List[schemas_placements.Company])
def read_companies(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve companies.
    """
    companies = crud.company.get_multi(db, skip=skip, limit=limit)
    return companies

@router.post("/companies", response_model=schemas_placements.Company)
def create_company(
    *,
    db: Session = Depends(deps.get_db),
    company_in: schemas_placements.CompanyCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new company.
    """
    company = crud.company.create(db, obj_in=company_in)
    return company

@router.get("/jobs", response_model=List[schemas_placements.Job])
def read_jobs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve jobs.
    """
    jobs = crud.job.get_multi(db, skip=skip, limit=limit)
    return jobs

@router.post("/jobs", response_model=schemas_placements.Job)
def create_job(
    *,
    db: Session = Depends(deps.get_db),
    job_in: schemas_placements.JobCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new job.
    """
    job = crud.job.create(db, obj_in=job_in)
    return job

@router.post("/apply", response_model=schemas_placements.Application)
def apply_for_job(
    *,
    db: Session = Depends(deps.get_db),
    job_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Apply for a job.
    """
    if current_user.role != "student":
         raise HTTPException(status_code=400, detail="Only students can apply")
    
    student = current_user.student_info
    if not student:
        raise HTTPException(status_code=400, detail="Student profile not found")
        
    # Manually create application object to set student_id
    db_obj = models.PlacementApplication(
        job_id=job_id,
        student_id=student.id,
        status="applied"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
