import sqlite3
import os

db_path = "sql_app.db"
if not os.path.exists(db_path):
    print("Database file NOT found")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(attendance);")
    columns = [c[1] for c in cursor.fetchall()]
    print("Attendance Columns:", columns)
    conn.close()
