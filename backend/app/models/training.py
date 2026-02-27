from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String) # Technical, Soft Skill, Vocational
    description = Column(Text)
    difficulty_level = Column(String) # Beginner, Intermediate, Advanced
    
    # Relationships
    modules = relationship("TrainingModule", back_populates="skill")
    user_progress = relationship("UserSkillProgress", back_populates="skill")

class TrainingModule(Base):
    __tablename__ = "training_modules"
    
    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    title = Column(String)
    content_url = Column(String) # Link to video/doc
    content_type = Column(String) # video, text, quiz
    duration_minutes = Column(Integer)
    is_offline_compatible = Column(Boolean, default=True)
    
    # Relationships
    skill = relationship("Skill", back_populates="modules")

class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    status = Column(String, default="started") # started, completed
    progress_percentage = Column(Float, default=0.0)
    last_accessed = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
    skill = relationship("Skill", back_populates="user_progress")
