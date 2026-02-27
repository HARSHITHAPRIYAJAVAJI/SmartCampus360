from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float, Text, DateTime
from sqlalchemy.orm import relationship
from app.models.base import Base

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    website = Column(String)
    logo_url = Column(String)
    description = Column(Text)
    
    # Relationships
    jobs = relationship("JobPosting", back_populates="company")

class JobPosting(Base):
    __tablename__ = "job_postings"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    title = Column(String, index=True)
    description = Column(Text)
    requirements = Column(Text)
    salary_range = Column(String)
    location = Column(String)
    deadline = Column(Date)
    posted_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="jobs")
    applications = relationship("PlacementApplication", back_populates="job")

class PlacementApplication(Base):
    __tablename__ = "placement_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_postings.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    status = Column(String, default="applied") # applied, interview, offered, rejected
    applied_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("JobPosting", back_populates="applications")
    student = relationship("Student", back_populates="placement_applications")
