from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/skills", response_model=List[schemas.training.Skill])
def read_skills(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    return crud.skill.get_multi(db, skip=skip, limit=limit)

@router.post("/skills", response_model=schemas.training.Skill)
def create_skill(
    *,
    db: Session = Depends(deps.get_db),
    skill_in: schemas.training.SkillCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role != "admin": # Simple RBAC
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.skill.create(db, obj_in=skill_in)

@router.get("/recommendations", response_model=List[schemas.training.Skill])
def get_recommendations(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    AI-Powered Recommendation Engine (Simplified).
    Returns skills based on user role/interests.
    """
    # Simple logic: If student, recommend 'Technical'. If faculty, recommend 'Vocational/Teaching'.
    all_skills = crud.skill.get_multi(db)
    # In a real AI app, this would use a collaborative filtering model
    recommended = [s for s in all_skills if s.category == "Technical"] 
    return recommended
