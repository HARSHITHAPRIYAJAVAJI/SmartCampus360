from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.placements import Company, JobPosting, PlacementApplication
from app.schemas.placements import CompanyCreate, JobCreate, ApplicationCreate

class CRUDCompany(CRUDBase[Company, CompanyCreate, CompanyCreate]):
    pass

class CRUDJob(CRUDBase[JobPosting, JobCreate, JobCreate]):
    def get_by_company(self, db: Session, *, company_id: int) -> List[JobPosting]:
        return db.query(self.model).filter(JobPosting.company_id == company_id).all()

class CRUDApplication(CRUDBase[PlacementApplication, ApplicationCreate, ApplicationCreate]):
    def get_by_student(self, db: Session, *, student_id: int) -> List[PlacementApplication]:
        return db.query(self.model).filter(PlacementApplication.student_id == student_id).all()

company = CRUDCompany(Company)
job = CRUDJob(JobPosting)
application = CRUDApplication(PlacementApplication)
