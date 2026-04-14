from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.api import deps
from app.models.notification import Notification, UserDevice, TargetAudience, NotificationStatus, NotificationReadReceipt
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
    Includes 'is_read' status based on read receipts.
    """
    role_map = {
        UserRole.STUDENT: TargetAudience.STUDENTS,
        UserRole.FACULTY: TargetAudience.FACULTY,
        UserRole.ADMIN: TargetAudience.STAFF
    }
    
    # Base filter for global/role/specific target
    audience_filter = (
        (Notification.target_audience == TargetAudience.ALL) |
        (Notification.target_audience == role_map.get(current_user.role))
    )
    
    if current_user.role != UserRole.ADMIN:
        # Check if user is in specific target list
        audience_filter = audience_filter | (Notification.target_uids.contains([current_user.id]))

    notifications = db.query(Notification).filter(
        Notification.status == NotificationStatus.SENT
    ).filter(audience_filter).order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    
    # Get read receipt IDs for this user
    read_notification_ids = [
        r.notification_id for r in db.query(NotificationReadReceipt.notification_id).filter(
            NotificationReadReceipt.user_id == current_user.id
        ).all()
    ]
    
    # Map to schema and set is_read
    result = []
    for n in notifications:
        n_data = NotificationSchema.model_validate(n)
        n_data.is_read = n.id in read_notification_ids
        result.append(n_data)
        
    return result

@router.post("/{id}/read")
def mark_as_read(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Mark a notification as read for the current user.
    """
    existing = db.query(NotificationReadReceipt).filter(
        NotificationReadReceipt.notification_id == id,
        NotificationReadReceipt.user_id == current_user.id
    ).first()
    
    if not existing:
        receipt = NotificationReadReceipt(notification_id=id, user_id=current_user.id)
        db.add(receipt)
        db.commit()
    
    return {"status": "success"}

@router.post("/read-all")
def mark_all_as_read(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Mark all applicable notifications as read for current user.
    """
    # Fetch all visible notifications that haven't been read yet
    # Simplified: Get all currently unread ones and create receipts
    current_notifications = read_notifications(db=db, current_user=current_user)
    
    for n in current_notifications:
        if not n.is_read:
            receipt = NotificationReadReceipt(notification_id=n.id, user_id=current_user.id)
            db.add(receipt)
            
    db.commit()
    return {"status": "success"}

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
