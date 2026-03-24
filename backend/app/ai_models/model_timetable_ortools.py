# model_timetable_ortools.py
from ortools.sat.python import cp_model

def build_timetable_csp(courses, timeslots, rooms, faculty_map, room_cap, batch_size, course_credits):
    """
    courses: list of course_ids
    timeslots: list of slot_ids (e.g., "Mon_1", "Mon_2"...)
    rooms: list of room_ids
    faculty_map: dict course_id -> faculty_id
    room_cap: dict room_id -> capacity
    batch_size: dict course_id -> required_capacity
    course_credits: dict course_id -> number of sessions per week
    """

    model = cp_model.CpModel()

    # Decision var: x[c,t,r] = 1 if course c scheduled at time t in room r
    x = {}
    for c in courses:
        for t in timeslots:
            for r in rooms:
                x[(c, t, r)] = model.NewBoolVar(f"x_{c}_{t}_{r}")

    # Constraint 1: each course scheduled exactly 'credits' times per week
    for c in courses:
        credits = course_credits.get(c, 3) # Default 3
        model.Add(sum(x[(c, t, r)] for t in timeslots for r in rooms) == credits)

    # Constraint 2: a course can only happen in ONE room at a time (students)
    for c in courses:
        for t in timeslots:
            model.Add(sum(x[(c, t, r)] for r in rooms) <= 1)

    # Constraint 3: room can host at most one course per timeslot
    for t in timeslots:
        for r in rooms:
            model.Add(sum(x[(c, t, r)] for c in courses) <= 1)

    # Constraint 4: faculty cannot teach two courses in same timeslot
    faculty = set(faculty_map.values())
    for f in faculty:
        f_courses = [c for c in courses if faculty_map[c] == f]
        for t in timeslots:
            model.Add(sum(x[(c, t, r)] for c in f_courses for r in rooms) <= 1)

    # Constraint 5: room capacity must be enough for the course/batch
    for c in courses:
        for t in timeslots:
            for r in rooms:
                if room_cap[r] < batch_size[c]:
                    model.Add(x[(c, t, r)] == 0)

    # Objective: Spread courses throughout the week (simple placeholder)
    # model.Minimize(0)
    
    return model, x
