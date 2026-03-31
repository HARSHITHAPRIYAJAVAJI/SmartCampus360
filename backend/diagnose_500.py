import sys
import os
# Add backend root to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.academic import Attendance as AttendanceModel
from datetime import date

db = SessionLocal()
print("DEBUG: Starting insertion test...")
try:
    # Test insertion
    obj = AttendanceModel(
        student_id=1,
        course_code="4B1AA",
        attendance_date=date.today(),
        period=1,
        status="Present"
    )
    db.add(obj)
    db.commit()
    print("SUCCESS: Record inserted successfully")
    # Clean up test record
    db.delete(obj)
    db.commit()
    print("CLEANUP: Test record removed")
except Exception as e:
    print(f"DIAGNOSTIC FAILURE: {str(e)}")
finally:
    db.close()
