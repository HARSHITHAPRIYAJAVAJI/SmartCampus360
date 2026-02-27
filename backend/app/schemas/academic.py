from typing import Optional, List
from pydantic import BaseModel

class CourseBase(BaseModel):
    code: str
    name: str
    credits: int = 3
    department: Optional[str] = None
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    class Config:
        from_attributes = True

class RoomBase(BaseModel):
    name: str
    capacity: int
    room_type: Optional[str] = None
    building: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    class Config:
        from_attributes = True
