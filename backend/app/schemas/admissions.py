from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

class AdmissionBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    program_interest: str
    previous_education: Optional[str] = None
    statement_of_purpose: Optional[str] = None
    documents_url: Optional[str] = None

class AdmissionCreate(AdmissionBase):
    pass

class Admission(AdmissionBase):
    id: int
    status: str
    submission_date: datetime
    user_id: Optional[int] = None
    class Config:
        from_attributes = True
