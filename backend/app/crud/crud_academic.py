from app.crud.base import CRUDBase
from app.models.academic import Course, Room
from app.schemas.academic import CourseCreate, RoomCreate

class CRUDCourse(CRUDBase[Course, CourseCreate, CourseCreate]):
    pass

class CRUDRoom(CRUDBase[Room, RoomCreate, RoomCreate]):
    pass

course = CRUDCourse(Course)
room = CRUDRoom(Room)
