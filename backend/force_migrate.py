import sqlite3
import os

db_path = "sql_app.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        # Add course_code
        print("DEBUG: Adding 'course_code' column...")
        cursor.execute("ALTER TABLE attendance ADD COLUMN course_code VARCHAR;")
        conn.commit()
    except sqlite3.OperationalError as e:
         print(f"INFO: {str(e)}")
         
    try:
        # Check if created_at and updated_at are there
        cursor.execute("PRAGMA table_info(attendance);")
        cols = [c[1] for c in cursor.fetchall()]
        print("Current Cols:", cols)
    finally:
        conn.close()
else:
    print("DB file NOT found")
