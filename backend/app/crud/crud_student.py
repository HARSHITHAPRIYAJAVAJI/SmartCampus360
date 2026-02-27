from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate

class CRUDStudent(CRUDBase[Student, StudentCreate, StudentUpdate]):
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[Student]:
        return db.query(Student).filter(Student.user_id == user_id).first()
    
    def get_by_enrollment(
        self, db: Session, *, enrollment_number: str
    ) -> Optional[Student]:
        return db.query(Student).filter(Student.enrollment_number == enrollment_number).first()
    
    def create_with_user(
        self, db: Session, *, user_id: int, obj_in: Optional[StudentCreate] = None
    ) -> Student:
        if obj_in is None:
            obj_in = {}
        db_obj = Student(user_id=user_id, **obj_in.dict() if isinstance(obj_in, StudentCreate) else {})
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self, db: Session, *, db_obj: Student, obj_in: Union[StudentUpdate, Dict[str, Any]]
    ) -> Student:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        return super().update(db, db_obj=db_obj, obj_in=update_data)
    
    def get_multi_by_program(
        self, db: Session, *, program: str, skip: int = 0, limit: int = 100
    ) -> list[Student]:
        return (
            db.query(self.model)
            .filter(Student.program == program)
            .offset(skip)
            .limit(limit)
            .all()
        )

student = CRUDStudent(Student)
