from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.training import Skill, TrainingModule, UserSkillProgress
from app.schemas.training import SkillCreate, ModuleCreate, ProgressUpdate

class CRUDSkill(CRUDBase[Skill, SkillCreate, SkillCreate]):
    pass

class CRUDModule(CRUDBase[TrainingModule, ModuleCreate, ModuleCreate]):
    def get_by_skill(self, db: Session, *, skill_id: int) -> List[TrainingModule]:
        return db.query(self.model).filter(TrainingModule.skill_id == skill_id).all()

class CRUDProgress(CRUDBase[UserSkillProgress, ProgressUpdate, ProgressUpdate]):
    def get_by_user(self, db: Session, *, user_id: int) -> List[UserSkillProgress]:
        return db.query(self.model).filter(UserSkillProgress.user_id == user_id).all()
        
    def get_by_user_and_skill(self, db: Session, *, user_id: int, skill_id: int) -> UserSkillProgress:
        return db.query(self.model).filter(
            UserSkillProgress.user_id == user_id,
            UserSkillProgress.skill_id == skill_id
        ).first()

skill = CRUDSkill(Skill)
module = CRUDModule(TrainingModule)
progress = CRUDProgress(UserSkillProgress)
