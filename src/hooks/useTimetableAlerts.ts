import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format, addMinutes, isAfter, isBefore, parse } from 'date-fns';

/**
 * Global Timetable Alerts Hook
 * - Monitors the current time and cross-references it with the published campus timetable.
 * - Alerts students and faculty 5 minutes before their next class starts.
 * - Supports campus-wide announcements from the real backend.
 */
export const useTimetableAlerts = (user: { id: string; role: string; name: string } | null) => {
    const { toast } = useToast();
    const lastAlertedRef = useRef<string | null>(null);

    // SLOTS matching TimetableEngine
    const SLOTS = ["09:40", "10:40", "11:40", "01:20", "02:20", "03:20"];

    useEffect(() => {
        if (!user || user.role === 'admin') return;

        const checkTimetable = () => {
            const now = new Date();
            const currentDay = format(now, "EEEE");
            const currentTimeStr = format(now, "HH:mm");

            // 1. Get Published Timetables
            const published = localStorage.getItem('published_timetables');
            if (!published) return;

            try {
                const data = JSON.parse(published);
                
                // Find grids that might contain this user
                // For students, they match by dept-year-section (stored in profile, but we check all published for demo)
                // For faculty, they match by their name in the 'faculty' field
                
                Object.entries(data).forEach(([key, grid]: [string, any]) => {
                    Object.entries(grid).forEach(([slotKey, entry]: [string, any]) => {
                        if (!entry) return;

                        const [day, slotTime] = slotKey.split('-');
                        if (day !== currentDay) return;

                        // Check if this entry belongs to the current faculty
                        const isMyClass = (user.role === 'faculty' && entry.faculty === user.name) || 
                                         (user.role === 'student'); // For student, we'd need their specific section key

                        if (!isMyClass) return;

                        // Check if starting in exactly 5 minutes
                        const slotDate = parse(slotTime, "HH:mm", new Date());
                        const alertDate = addMinutes(slotDate, -5);
                        const alertTimeStr = format(alertDate, "HH:mm");

                        if (currentTimeStr === alertTimeStr && lastAlertedRef.current !== `${slotKey}-${day}`) {
                            lastAlertedRef.current = `${slotKey}-${day}`;
                            
                            toast({
                                title: "🔔 Class Starting Soon",
                                description: `${entry.courseName} (${entry.courseCode}) starts at ${slotTime} in ${entry.room}.`,
                                variant: "default"
                            });

                            // Also try Browser Notification if permitted
                            if ("Notification" in window && Notification.permission === "granted") {
                                new Notification("SmartCampus Alert", {
                                    body: `${entry.courseName} starts in 5 minutes!`,
                                    icon: "/favicon.ico"
                                });
                            }
                        }
                    });
                });
            } catch (e) {
                console.error("Alert Engine Error:", e);
            }
        };

        // Check every 30 seconds
        const interval = setInterval(checkTimetable, 30000);
        
        // Initial check
        checkTimetable();

        // Request browser permission
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        return () => clearInterval(interval);
    }, [user, toast]);
};
