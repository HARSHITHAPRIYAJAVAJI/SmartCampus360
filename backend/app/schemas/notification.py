from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
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

# Shared properties
class NotificationBase(BaseModel):
    title: str = Field(..., max_length=255, description="Notification title")
    message: str = Field(..., description="Notification message")
    type: NotificationType = Field(NotificationType.INFO, description="Priority type")
    target_audience: TargetAudience = Field(TargetAudience.ALL, description="Targeted audience group")
    target_uids: Optional[List[int]] = Field(None, description="List of User IDs if audience is specific")
    status: NotificationStatus = Field(NotificationStatus.SENT, description="Current message status")
    scheduled_for: Optional[datetime] = None

# Properties to receive on notification creation
class NotificationCreate(NotificationBase):
    pass

# Properties shared by models stored in DB
class NotificationInDBBase(NotificationBase):
    id: int
    sender_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Properties to return to client
class Notification(NotificationInDBBase):
    pass

# User Device Registration
class UserDeviceBase(BaseModel):
    fcm_token: str
    device_type: Optional[str] = "web"

class UserDeviceCreate(UserDeviceBase):
    user_id: int

class UserDevice(UserDeviceBase):
    id: int
    user_id: int
    last_active: datetime

    class Config:
        from_attributes = True
