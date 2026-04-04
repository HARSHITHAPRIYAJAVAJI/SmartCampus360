import sys
import os
# Add backend root to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.db.session import engine
from app.models.base import Base
# Import all models
from app.models.user import User, Faculty, Student
from app.models.academic import Course, Room, TimeSlot, TimetableSlot, Enrollment, Attendance

print("DEBUG: Creating all tables in SQLite...")
Base.metadata.create_all(bind=engine)
print("SUCCESS: Tables created.")
