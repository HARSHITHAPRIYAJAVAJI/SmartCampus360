from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class AdmissionApplication(Base):
    __tablename__ = "admission_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, index=True)
    phone = Column(String)
    program_interest = Column(String)
    previous_education = Column(Text)
    statement_of_purpose = Column(Text)
    status = Column(String, default="submitted") # submitted, under_review, accepted, rejected
    submission_date = Column(DateTime, default=datetime.utcnow)
    documents_url = Column(String)
    
    # Optional: Link to a user account if they registered
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User")
