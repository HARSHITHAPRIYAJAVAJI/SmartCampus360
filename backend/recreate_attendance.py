import sqlite3
import os

db_path = "sql_app.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        print("DEBUG: Dropping attendance table to recreate it correctly")
        cursor.execute("DROP TABLE attendance;")
        
        # Manually create it exactly as the model expects
        # Including metadata columns from Base
        query = """
        CREATE TABLE attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            course_id INTEGER,
            course_code VARCHAR,
            attendance_date DATE NOT NULL,
            period INTEGER NOT NULL,
            status VARCHAR NOT NULL,
            marked_by_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(student_id) REFERENCES students(id),
            FOREIGN KEY(course_id) REFERENCES courses(id),
            FOREIGN KEY(marked_by_id) REFERENCES faculty(id)
        );
        """
        cursor.execute(query)
        conn.commit()
        print("SUCCESS: Recreated attendance table manually")
    except sqlite3.OperationalError as e:
        print(f"ERROR: {str(e)}")
    finally:
        conn.close()
else:
    print("DB file NOT found")
