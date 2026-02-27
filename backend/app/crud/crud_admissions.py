from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.admissions import AdmissionApplication
from app.schemas.admissions import AdmissionCreate

class CRUDAdmission(CRUDBase[AdmissionApplication, AdmissionCreate, AdmissionCreate]):
    def get_by_email(self, db: Session, *, email: str) -> List[AdmissionApplication]:
        return db.query(self.model).filter(AdmissionApplication.email == email).all()
        
    def get_by_user(self, db: Session, *, user_id: int) -> List[AdmissionApplication]:
        return db.query(self.model).filter(AdmissionApplication.user_id == user_id).all()

admission = CRUDAdmission(AdmissionApplication)
