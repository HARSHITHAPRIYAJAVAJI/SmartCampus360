import sqlite3
import os

db_path = "sql_app.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        # Simple column rename for SQLite 3.25+
        cursor.execute("ALTER TABLE attendance RENAME COLUMN date TO attendance_date;")
        conn.commit()
        print("Successfully renamed column 'date' to 'attendance_date'")
    except sqlite3.OperationalError as e:
        print(f"Error renaming column: {str(e)}")
        # Check if column already exists
        cursor.execute("PRAGMA table_info(attendance);")
        columns = [c[1] for c in cursor.fetchall()]
        print("Current Columns:", columns)
    conn.close()
else:
    print("DB file not found")
