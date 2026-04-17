
import { toast } from "@/hooks/use-toast";

export interface AlertOptions {
    title: string;
    message: string;
    category: 'general' | 'fee' | 'exam' | 'attendance' | 'timetable' | 'event' | 'substitution';
    type: 'normal' | 'priority' | 'urgent';
    targetAudience: 'students' | 'faculty' | 'both';
    branch?: string;
    year?: number;
    section?: string;
    recipientId?: string;
    redirectUrl?: string;
    senderId?: string; 
    silent?: boolean;
}

export const alertService = {
    sendAlert: (options: AlertOptions) => {
        try {
            const saved = localStorage.getItem('STUDENT_ALERTS');
            const allAlerts: any[] = saved ? JSON.parse(saved) : [];
            
            const newAlert = {
                id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                title: options.title,
                message: options.message,
                category: options.category,
                type: options.type,
                targetAudience: options.targetAudience,
                branch: options.branch || 'All',
                year: options.year || 0,
                section: options.section || 'All',
                recipientId: options.recipientId || 'all',
                redirectUrl: options.redirectUrl || '/dashboard',
                senderId: options.senderId || 'system',
                timestamp: new Date().toISOString(),
                isRead: false
            };
            
            const updated = [newAlert, ...allAlerts].slice(0, 100);
            localStorage.setItem('STUDENT_ALERTS', JSON.stringify(updated));
            
            window.dispatchEvent(new CustomEvent('student_alerts_updated'));
            window.dispatchEvent(new Event('storage'));
            
            if (!options.silent) {
                toast({
                    title: options.title,
                    description: options.message,
                    variant: options.type === 'urgent' ? 'destructive' : 'default',
                });
            }
            
            return newAlert;
        } catch (error) {
            console.error("Alert Service Error:", error);
            return null;
        }
    },
    
    processDailyAttendanceSummary: (dateString: string) => {
        try {
            const savedStudents = localStorage.getItem('smartcampus_student_directory');
            if (!savedStudents) return;
            
            const students = JSON.parse(savedStudents);
            let summaryCount = 0;

            students.forEach((student: any) => {
                const history = student.periodAttendance || {};
                
                // Find all absences for this specific date
                const dailySlots = Object.keys(history).filter(key => key.startsWith(dateString));
                const totalPeriodsMarked = dailySlots.length;
                if (totalPeriodsMarked === 0) return;

                const absentPeriods = dailySlots.filter(key => history[key] === false).length;

                if (absentPeriods > 0) {
                    alertService.sendAlert({
                        title: "Daily Attendance Summary",
                        message: `Summary for ${dateString}: You were marked ABSENT for ${absentPeriods} out of ${totalPeriodsMarked} periods recorded today.`,
                        category: 'attendance',
                        type: absentPeriods >= 3 ? 'priority' : 'normal',
                        targetAudience: 'students',
                        branch: student.branch,
                        year: student.year,
                        section: student.section,
                        recipientId: student.id,
                        redirectUrl: '/dashboard/attendance',
                        silent: true // Prevents Admin from seeing 100s of toasts
                    });
                    summaryCount++;
                }
            });

            console.log(`[ALERT SERVICE] Dispatched daily summaries to ${summaryCount} students.`);
            return summaryCount;
        } catch (error) {
            console.error("Daily Summary Sync Error:", error);
            return 0;
        }
    }
};

export default alertService;
