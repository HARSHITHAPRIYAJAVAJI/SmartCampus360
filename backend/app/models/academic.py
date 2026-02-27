from datetime import time
from typing import List, Optional
from sqlalchemy import Column, Integer, String, ForeignKey, Time, Enum, Table, Boolean, Date, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class WeekDay(enum.Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    credits = Column(Integer, default=3)
    department = Column(String)
    semester = Column(Integer)  # 1-8 for 4-year programs
    description = Column(String)
    
    # Relationships
    instructor_id = Column(Integer, ForeignKey("faculty.id"))
    instructor = relationship("Faculty", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
    timetable_slots = relationship("TimetableSlot", back_populates="course")

class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    capacity = Column(Integer)
    room_type = Column(String)  # e.g., "Lecture Hall", "Lab", "Seminar Room"
    building = Column(String)
    floor = Column(String)
    
    # Relationships
    timetable_slots = relationship("TimetableSlot", back_populates="room")

class TimeSlot(Base):
    __tablename__ = "time_slots"
    
    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    day = Column(Enum(WeekDay), nullable=False)
    is_break = Column(Boolean, default=False)
    
    # Relationships
    timetable_slots = relationship("TimetableSlot", back_populates="time_slot")

class TimetableSlot(Base):
    __tablename__ = "timetable_slots"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)
    
    # Additional metadata
    is_active = Column(Boolean, default=True)
    start_date = Column(Date)
    end_date = Column(Date)
    recurrence_rule = Column(String)  # For recurring events
    
    # Relationships
    course = relationship("Course", back_populates="timetable_slots")
    room = relationship("Room", back_populates="timetable_slots")
    time_slot = relationship("TimeSlot", back_populates="timetable_slots")

class Enrollment(Base):
    __tablename__ = "enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    enrollment_date = Column(Date, nullable=False)
    status = Column(String)  # e.g., "enrolled", "completed", "dropped"
    
    # Relationships
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
