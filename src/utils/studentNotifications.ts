
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
    recipientId?: string; // Specific user ID (e.g. for faculty)
    type: 'substitution' | 'swap' | 'announcement';
    timestamp: number;
    isRead?: boolean;
}

import { alertService } from '@/services/alertService';
const STORAGE_KEY = 'STUDENT_ALERTS';

export const pushStudentAlert = (alert: Omit<StudentAlert, 'id' | 'timestamp'>) => {
    alertService.sendAlert({
        title: alert.title,
        message: alert.message,
        category: 'general',
        type: 'normal',
        targetAudience: 'students',
        branch: alert.branch,
        year: alert.year,
        section: alert.section,
        recipientId: alert.recipientId
    });
};

export const getStudentAlerts = (branch?: string, year?: number, section?: string): StudentAlert[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    
    const alerts: StudentAlert[] = JSON.parse(saved);
    
    if (!branch && !year && !section) return alerts;
    
    return alerts.filter(a => {
        // If it's targeted to a specific person (like a faculty ID)
        if (a.recipientId && a.recipientId !== 'all') {
            return a.recipientId === (window as any).currentUser?.id;
        }

        // Section broadcasting
        return (!branch || a.branch === branch) &&
               (!year || a.year === year) &&
               (!section || a.section === section);
    });
};
