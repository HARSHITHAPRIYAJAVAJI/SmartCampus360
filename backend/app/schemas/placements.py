from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel

# Company Schemas
class CompanyBase(BaseModel):
    name: str
    website: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    class Config:
        from_attributes = True

# Job Schemas
class JobBase(BaseModel):
    title: str
    description: Optional[str] = None
    requirements: Optional[str] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None
    deadline: Optional[date] = None

class JobCreate(JobBase):
    company_id: int

class Job(JobBase):
    id: int
    company_id: int
    posted_date: datetime
    company: Optional[Company] = None
    class Config:
        from_attributes = True

# Application Schemas
class ApplicationBase(BaseModel):
    pass

class ApplicationCreate(ApplicationBase):
    job_id: int

class Application(ApplicationBase):
    id: int
    job_id: int
    student_id: int
    status: str
    applied_date: datetime
    class Config:
        from_attributes = True
