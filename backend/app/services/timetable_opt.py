from ortools.sat.python import cp_model
from typing import List, Dict, Any
from app.ai_models.model_timetable_ortools import build_timetable_csp

class TimetableSolver:
    def __init__(self, courses: List[Any], rooms: List[Any], slots: List[Any]):
        self.courses = courses
        self.rooms = rooms
        self.slots = slots
        
    def solve(self) -> List[Dict]:
        course_ids = [c.code for c in self.courses]
        slot_ids = [s.id for s in self.slots]
        room_ids = [r.name for r in self.rooms]
        
        faculty_map = {c.code: getattr(c, 'instructor_id', 'Unknown') for c in self.courses}
        room_cap = {r.name: getattr(r, 'capacity', 60) for r in self.rooms}
        batch_size = {c.code: getattr(c, 'batch_size', 40) for c in self.courses} # Default batch size

        model, x = build_timetable_csp(
            course_ids, slot_ids, room_ids, faculty_map, room_cap, batch_size
        )
        
        solver = cp_model.CpSolver()
        status = solver.Solve(model)
        
        schedule = []
        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            for (c_id, t_id, r_id), var in x.items():
                if solver.Value(var) == 1:
                    schedule.append({
                        "course_code": c_id,
                        "room_name": r_id,
                        "slot_id": t_id
                    })
        return schedule
