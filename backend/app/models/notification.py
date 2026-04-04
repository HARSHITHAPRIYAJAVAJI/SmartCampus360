from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

class NotificationType(str, enum.Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    DESTRUCTIVE = "destructive"

class TargetAudience(str, enum.Enum):
    ALL = "all"
    STUDENTS = "students"
    FACULTY = "faculty"
    STAFF = "staff"
    SPECIFIC = "specific"

class NotificationStatus(str, enum.Enum):
    SENT = "sent"
    DRAFT = "draft"
    SCHEDULED = "scheduled"

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(Enum(NotificationType), default=NotificationType.INFO)
    target_audience = Column(Enum(TargetAudience), default=TargetAudience.ALL)
    
    # Store list of User IDs if audience is 'specific'
    target_uids = Column(JSON, nullable=True)
    
    # Track sender (Admin usually)
    sender_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    status = Column(Enum(NotificationStatus), default=NotificationStatus.SENT)
    scheduled_for = Column(DateTime, nullable=True)
    
    # Relationships
    sender = relationship("User")

class UserDevice(Base):
    __tablename__ = "user_devices"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fcm_token = Column(String(255), nullable=False, unique=True)
    device_type = Column(String(50)) # e.g., "web", "android", "ios"
    last_active = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
