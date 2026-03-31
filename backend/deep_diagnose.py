import sys
import os
# Add backend root to path
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.models.academic import Attendance as AttendanceModel
from app.schemas.academic import AttendanceCreate
from datetime import date

db = SessionLocal()
print("DEBUG: Deep diagnostic...")
try:
    # 1. Create a dummy AttendanceCreate object
    record_in = AttendanceCreate(
        student_id=1,
        course_code="DIAGNOSTIC",
        attendance_date=date.today(),
        period=1,
        status="Present"
    )
    data = record_in.dict()
    print(f"DEBUG: Pydantic dict: {data}")
    
    # 2. Try to instantiate the model
    obj = AttendanceModel(**data)
    print(f"DEBUG: Model instance student_id: {obj.student_id}")
    
    # 3. Try to save
    db.add(obj)
    db.commit()
    print("SUCCESS: Record saved")
    
except Exception as e:
    import traceback
    print(f"DIAGNOSTIC FAILURE: {str(e)}")
    traceback.print_exc()
finally:
    db.close()
