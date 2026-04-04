from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.api import deps
from app.models.notification import Notification, UserDevice, TargetAudience, NotificationStatus
from app.models.user import User, UserRole
from app.schemas.notification import Notification as NotificationSchema, NotificationCreate, UserDevice as UserDeviceSchema, UserDeviceCreate

router = APIRouter()

@router.get("/", response_model=List[NotificationSchema])
def read_notifications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve notifications for the current user based on audience rules.
    """
    if current_user.role == UserRole.ADMIN:
        return db.query(Notification).offset(skip).limit(limit).all()
        
    # Standard logic for students/faculty:
    # 1. Target audience is 'all'
    # 2. Target audience matches their role
    # 3. Target audience is 'specific' AND contains their ID
    
    role_map = {
        UserRole.STUDENT: TargetAudience.STUDENTS,
        UserRole.FACULTY: TargetAudience.FACULTY
    }
    
    query = db.query(Notification).filter(
        Notification.status == NotificationStatus.SENT
    ).filter(
        (Notification.target_audience == TargetAudience.ALL) |
        (Notification.target_audience == role_map.get(current_user.role)) |
        (Notification.target_uids.contains([current_user.id]))
    ).order_by(Notification.created_at.desc())
    
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=NotificationSchema)
def create_notification(
    *,
    db: Session = Depends(deps.get_db),
    notification_in: NotificationCreate,
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create a new notification (Admin only).
    """
    notification = Notification(
        **notification_in.dict(),
        sender_id=current_user.id,
        created_at=datetime.utcnow()
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    # SIMULATED FCM BROADCAST
    if notification.status == NotificationStatus.SENT:
        print(f"📡 [FCM MOCK] Broadcasting notification: {notification.title}")
        # In real life, we would fetch FCM tokens for all target users and push to Firebase
        
    return notification

@router.post("/register-device", response_model=UserDeviceSchema)
def register_device(
    *,
    db: Session = Depends(deps.get_db),
    device_in: UserDeviceCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Register a device for push notifications (FCM token).
    """
    # Force the current user ID for security
    device_in.user_id = current_user.id
    
    # Look for existing token
    db_device = db.query(UserDevice).filter(UserDevice.fcm_token == device_in.fcm_token).first()
    if db_device:
        db_device.last_active = datetime.utcnow()
        db_device.user_id = current_user.id # Update if user changed
        db.commit()
        db.refresh(db_device)
        return db_device
        
    db_device = UserDevice(**device_in.dict())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@router.delete("/{id}", response_model=NotificationSchema)
def delete_notification(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete a notification.
    """
    notification = db.query(Notification).filter(Notification.id == id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return notification
