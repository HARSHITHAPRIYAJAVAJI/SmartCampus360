import numpy as np
from app.ai_models.model_faculty_availability import build_faculty_availability_model

class FacultyAvailabilityPredictor:
    def __init__(self):
        self.model = build_faculty_availability_model()
        self._train_initial_model()

    def _train_initial_model(self):
        """
        Train the model with some dummy data so it's ready to use.
        In a real scenario, this would load data from the database.
        
        Features:
        - day_of_week (0-6)
        - hour_slot (0-23)
        - past_leave_rate (0.0-1.0)
        - workload_hours (int)
        - back_to_back_classes (int)
        - historical_absence_flag (0 or 1)
        """
        # Dummy training data (X)
        # [Day, Hour, LeaveRate, Workload, BackToBack, AbsenceFlag]
        X_train = np.array([
            [0, 9,  0.1, 10, 0, 0], # Likely available
            [0, 10, 0.1, 12, 1, 0], # Likely available
            [2, 14, 0.8, 20, 2, 1], # Likely unavailable (high leave, high workload)
            [4, 16, 0.9, 22, 3, 1], # Likely unavailable
            [1, 11, 0.2, 8,  0, 0], # Available
            [3, 13, 0.5, 15, 1, 0], # Maybe
        ])
        
        # Dummy labels (y)
        # 1 = Available, 0 = Unavailable
        y_train = np.array([1, 1, 0, 0, 1, 0])
        
        self.model.fit(X_train, y_train)

    def predict(self, day: int, hour: int, leave_rate: float, workload: int, 
                back_to_back: int, absence_flag: int) -> float:
        """
        Returns the probability of the faculty being AVAILABLE (class 1).
        """
        features = np.array([[day, hour, leave_rate, workload, back_to_back, absence_flag]])
        # predict_proba returns [[prob_0, prob_1]]
        probability = self.model.predict_proba(features)[0][1]
        return probability

# Singleton instance
faculty_predictor = FacultyAvailabilityPredictor()
