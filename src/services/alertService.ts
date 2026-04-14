
import { InstitutionalNotification } from "@/data/mockCommunications";
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
    recipientId?: string; // For direct faculty/student alerts (e.g. substitution)
    redirectUrl?: string;
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
                timestamp: new Date().toISOString(),
                isRead: false
            };
            
            // Keep last 100 alerts
            const updated = [newAlert, ...allAlerts].slice(0, 100);
            localStorage.setItem('STUDENT_ALERTS', JSON.stringify(updated));
            
            // Broadcast for real-time header sync
            window.dispatchEvent(new CustomEvent('student_alerts_updated'));
            // Trigger storage event for cross-tab sync
            window.dispatchEvent(new Event('storage'));
            
            // Pop notification for immediate feedback
            toast({
                title: options.title,
                description: options.message,
                variant: options.type === 'urgent' ? 'destructive' : 'default',
            });
            
            console.log("Institutional Alert Published:", newAlert.title);
            return newAlert;
        } catch (error) {
            console.error("Alert Service Error:", error);
            return null;
        }
    }
};

export default alertService;
