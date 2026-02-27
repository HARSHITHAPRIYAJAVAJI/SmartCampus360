from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# Shared properties
class NotificationBase(BaseModel):
    title: str = Field(..., max_length=255, description="Notification title")
    message: str = Field(..., description="Notification message")
    notification_type: str = Field(..., max_length=50, description="Type of notification")
    related_model: Optional[str] = Field(None, max_length=50, description="Related model name")
    related_id: Optional[int] = Field(None, description="ID of the related model")
    is_read: bool = Field(False, description="Whether the notification has been read")

# Properties to receive on notification creation
class NotificationCreate(NotificationBase):
    user_id: int = Field(..., description="ID of the user to notify")

# Properties to receive on notification update
class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = Field(None, description="Mark as read/unread")

# Properties shared by models stored in DB
class NotificationInDBBase(NotificationBase):
    id: int
    user_id: int
    created_at: datetime
    read_at: Optional[datetime] = None
    created_by: Optional[int] = None
    
    class Config:
        orm_mode = True

# Properties to return to client
class Notification(NotificationInDBBase):
    pass

# Properties stored in DB
class NotificationInDB(NotificationInDBBase):
    pass

# Response models for API endpoints
class NotificationResponse(BaseModel):
    success: bool
    data: Optional[Notification] = None
    message: Optional[str] = None

class NotificationListResponse(BaseModel):
    success: bool
    data: List[Notification]
    total: int
    unread_count: int

# WebSocket notification message
class NotificationMessage(BaseModel):
    event: str = "notification"
    data: Dict[str, Any]
