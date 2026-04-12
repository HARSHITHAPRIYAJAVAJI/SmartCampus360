
/**
 * Student Notification Utility
 * Handles broadcasting timetable changes (swaps/substitutions) to students.
 */

export interface StudentAlert {
    id: string;
    title: string;
    message: string;
    branch: string;
    year: number;
    section: string;
    type: 'substitution' | 'swap' | 'announcement';
    timestamp: number;
    isRead?: boolean;
}

const STORAGE_KEY = 'STUDENT_ALERTS';

export const pushStudentAlert = (alert: Omit<StudentAlert, 'id' | 'timestamp'>) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const alerts: StudentAlert[] = saved ? JSON.parse(saved) : [];
    
    const newAlert: StudentAlert = {
        ...alert,
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        isRead: false
    };
    
    // Keep only last 50 alerts
    const updated = [newAlert, ...alerts].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Trigger event for real-time UI updates
    window.dispatchEvent(new Event('student_alerts_updated'));
};

export const getStudentAlerts = (branch?: string, year?: number, section?: string): StudentAlert[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    
    const alerts: StudentAlert[] = JSON.parse(saved);
    
    if (!branch && !year && !section) return alerts;
    
    return alerts.filter(a => 
        (!branch || a.branch === branch) &&
        (!year || a.year === year) &&
        (!section || a.section === section)
    );
};
