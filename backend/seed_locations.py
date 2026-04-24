import sys
import os

# Add the current directory to sys.path to allow imports from app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app.db.session import SessionLocal, engine
from app.models.base import Base
from app.models.navigation import Location

def seed():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Clear existing to ensure fresh seed with new rooms
        db.query(Location).delete()

        locations = [
            # Public Facilities
            Location(name="Central Library", block="Main Block", floor="1st & 2nd", type="facility"),
            Location(name="Training & Placement Cell (N-110)", block="North Block", floor="G", type="office"),
            Location(name="Administrative Office (C-101)", block="Central Block", floor="G", type="office"),
            Location(name="Principal Office (C-106)", block="Central Block", floor="G", type="office"),
            Location(name="Examination Branch (N-213)", block="North Block", floor="2nd", type="office"),
            Location(name="Scholarship Office (S-111)", block="South Block", floor="1st", type="office"),
            Location(name="AO Office", block="Main Block", floor="G", type="office"),
            Location(name="Dean Office", block="Admin Block", floor="1st", type="office"),
            
            # HOD Offices
            Location(name="CSM HOD Office (N-404)", block="North Block", floor="4th", type="office"),
            Location(name="ECE HOD Office (S-208)", block="South Block", floor="2nd", type="office"),
            Location(name="CSE HOD Office (C-207)", block="Central Block", floor="2nd", type="office"),

            # Academic Labs & Classrooms
            Location(name="Physics Lab", block="Science Block", floor="2nd", type="facility"),
            Location(name="Chemistry Lab", block="Science Block", floor="1st", type="facility"),
            Location(name="IT Seminar Hall", block="South Block", floor="3rd", type="facility"),
            Location(name="Computer Lab A", block="Main Block", floor="3rd", type="facility"),
        ]

        db.add_all(locations)
        db.commit()
        print(f"Successfully seeded {len(locations)} locations.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
