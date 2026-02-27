from datetime import datetime
from typing import Optional, List
from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    FACULTY = "faculty"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    is_active = Column(Boolean(), default=True)
    
    # Relationships
    faculty_info = relationship("Faculty", back_populates="user", uselist=False)
    student_info = relationship("Student", back_populates="user", uselist=False)
    
    def __repr__(self):
        return f"<User {self.email} ({self.role})>"

class Faculty(Base):
    __tablename__ = "faculty"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    department = Column(String)
    designation = Column(String)
    qualification = Column(String)
    
    # Relationships
    user = relationship("User", back_populates="faculty_info")
    courses = relationship("Course", back_populates="instructor")
    
class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    enrollment_number = Column(String, unique=True)
    program = Column(String)
    semester = Column(Integer)
    batch = Column(String)
    
    # Relationships
    user = relationship("User", back_populates="student_info")
    enrollments = relationship("Enrollment", back_populates="student")
    placement_applications = relationship("PlacementApplication", back_populates="student")
