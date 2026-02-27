# model_faculty_availability.py
from sklearn.ensemble import RandomForestClassifier

def build_faculty_availability_model():
    """
    Input features example:
    - day_of_week, hour_slot
    - past_leave_rate
    - workload_hours
    - back_to_back_classes
    - historical_absence_flag
    """
    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        n_jobs=-1,
        class_weight="balanced"
    )
    return model
