# model_reallocation_ortools.py
from ortools.sat.python import cp_model

def build_reallocation_model(affected_classes, candidate_moves):
    """
    affected_classes: list of class_ids that need reassignment
    candidate_moves: dict class_id -> list of possible moves
        move example: (new_timeslot, new_room, new_faculty, penalty_cost)
    """

    model = cp_model.CpModel()
    choose = {}

    # choose[class, k] = 1 if we pick kth candidate move for that class
    for cls in affected_classes:
        for k, move in enumerate(candidate_moves[cls]):
            choose[(cls, k)] = model.NewBoolVar(f"choose_{cls}_{k}")

        # Each affected class must pick exactly one reassignment option
        model.Add(sum(choose[(cls, k)] for k in range(len(candidate_moves[cls]))) == 1)

    # Objective: minimize disruption cost
    model.Minimize(
        sum(choose[(cls, k)] * candidate_moves[cls][k][3]  # penalty_cost
            for cls in affected_classes
            for k in range(len(candidate_moves[cls])))
    )

    return model, choose
