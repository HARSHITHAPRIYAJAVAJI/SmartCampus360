from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.models.base import Base

class Location(Base):
    __tablename__ = "locations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    block = Column(String(50))
    floor = Column(String(50))
    type = Column(String(50)) # facility/classroom/office

class FacultyLocation(Base):
    __tablename__ = "faculty_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(String(100), index=True)
    current_location = Column(String(255))
    source = Column(String(50)) # timetable/manual
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())
