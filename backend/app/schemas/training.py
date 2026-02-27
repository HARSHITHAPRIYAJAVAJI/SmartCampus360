from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    difficulty_level: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    class Config:
        from_attributes = True

class ModuleBase(BaseModel):
    title: str
    content_url: Optional[str] = None
    content_type: str
    duration_minutes: int
    is_offline_compatible: bool = True

class ModuleCreate(ModuleBase):
    skill_id: int

class Module(ModuleBase):
    id: int
    skill_id: int
    class Config:
        from_attributes = True

class ProgressBase(BaseModel):
    progress_percentage: float
    status: str

class ProgressUpdate(ProgressBase):
    pass

class Progress(ProgressBase):
    id: int
    user_id: int
    skill_id: int
    last_accessed: datetime
    skill: Optional[Skill] = None
    class Config:
        from_attributes = True
