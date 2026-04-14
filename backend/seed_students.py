
import sqlite3
import json
import os

def seed():
    # Path to mock file
    mock_file = "src/data/mockStudents.ts"
    if not os.path.exists(mock_file):
        print("Mock file not found")
        return

    # Extract JSON part from TS file (primitive way)
    with open(mock_file, 'r') as f:
        content = f.read()
        start = content.find('[')
        end = content.rfind(']') + 1
        json_str = content[start:end]
        # Clean up slightly if it has JS comments
        students = json.loads(json_str)

    # Database connection
    db_path = "backend/sql_app.db"
    conn = sqlite3.connect(db_path)
    curr = conn.cursor()

    print(f"Seeding {len(students)} students into {db_path}...")

    for s in students:
        # 1. Ensure user exists
        # Extract ID from "stud-1"
        sid_raw = s['id']
        sid = int(''.join(filter(str.isdigit, sid_raw)))
        email = s.get('email', f"student{sid}@example.com")
        name = s.get('name', "Unknown")
        
        # Check if user exists
        curr.execute("SELECT id FROM users WHERE id=?", (sid,))
        if not curr.fetchone():
            # Create user (password is 'password' hashed - mock)
            curr.execute("INSERT INTO users (id, email, hashed_password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)",
                        (sid, email, "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L6s5WrTH3.8QOuM", name, "student", 1))

        # 2. Ensure student exists
        curr.execute("SELECT id FROM students WHERE id=?", (sid,))
        if not curr.fetchone():
            enrollment = s.get('rollNumber', f"ENROLL{sid}")
            program = s.get('branch', "CSE")
            semester = s.get('semester', 1)
            batch = s.get('batch', "2024")
            curr.execute("INSERT INTO students (id, user_id, enrollment_number, program, semester, batch) VALUES (?, ?, ?, ?, ?, ?)",
                        (sid, sid, enrollment, program, semester, batch))

    conn.commit()
    conn.close()
    print("Seeding complete.")

if __name__ == "__main__":
    seed()
