from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.faculty import Faculty
from app.schemas.faculty import FacultyCreate, FacultyUpdate

class CRUDFaculty(CRUDBase[Faculty, FacultyCreate, FacultyUpdate]):
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[Faculty]:
        return db.query(Faculty).filter(Faculty.user_id == user_id).first()
    
    def create_with_user(
        self, db: Session, *, user_id: int, obj_in: Optional[FacultyCreate] = None
    ) -> Faculty:
        if obj_in is None:
            obj_in = {}
        db_obj = Faculty(user_id=user_id, **obj_in.dict() if isinstance(obj_in, FacultyCreate) else {})
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self, db: Session, *, db_obj: Faculty, obj_in: Union[FacultyUpdate, Dict[str, Any]]
    ) -> Faculty:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        return super().update(db, db_obj=db_obj, obj_in=update_data)

faculty = CRUDFaculty(Faculty)
