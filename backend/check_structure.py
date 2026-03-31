import sqlite3
import os

db_path = "sql_app.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(attendance);")
    cols = cursor.fetchall()
    print("Attendance Details:")
    for c in cols:
        print(f"  {c[1]} ({c[2]})")
    conn.close()
else:
    print("DB FOUND NOT")
