import { useState, useEffect, useMemo, useCallback } from 'react';
import notificationService, { Notification } from '@/services/notificationService';
import { MOCK_STUDENTS } from '@/data/mockStudents';
import { MOCK_FACULTY } from '@/data/mockFaculty';

export interface UIBackfilledNotification {
    id: string;
    title: string;
    message: string;
    type: 'destructive' | 'success' | 'warning' | 'info' | 'attendance' | 'timetable' | 'fee' | 'mention' | 'substitution';
    read: boolean;
    isRequest: boolean;
    senderName: string;
    url: string;
    timestamp: string;
}

export function useNotifications(user: { id: string, name: string, role: string }) {
    const [apiNotifications, setApiNotifications] = useState<Notification[]>([]);
    const [liveRequests, setLiveRequests] = useState<any[]>([]);
    const [studentAlerts, setStudentAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [unreadGroupMsgs, setUnreadGroupMsgs] = useState(0);

    const loadAll = useCallback(async () => {
        try {
            // 1. Fetch from Backend (Independent Try)
            try {
                const data = await notificationService.getNotifications();
                if (data) setApiNotifications(data);
            } catch (err) {
                console.warn("Notification API unreachable.");
            }

            // 2. Load Faculty/Admin Requests (Local State Bridge)
            const savedRequests = localStorage.getItem('FACULTY_REQUESTS');
            if (savedRequests) {
                const parsed = JSON.parse(savedRequests);
                if (user.role === 'admin') {
                    setLiveRequests(parsed.filter((r: any) => r.type === 'leave' && r.status === 'pending'));
                } else if (user.role === 'faculty') {
                    const facultyRec = MOCK_FACULTY.find(f => f.id === user.id || f.rollNumber === user.id);
                    const possibleIds = [user.id, facultyRec?.id, facultyRec?.rollNumber].filter(Boolean);
                    const pendingForMe = parsed.filter((r: any) => 
                        possibleIds.includes(r.targetId) && r.status === 'pending'
                    );
                    const myUpdates = parsed.filter((r: any) => 
                        possibleIds.includes(r.senderId) && (r.status === 'approved' || r.status === 'rejected')
                    );
                    setLiveRequests([...pendingForMe, ...myUpdates]);
                }
            }

            // 3. Load Institutional Alerts (Local State Bridge)
            const savedAlerts = localStorage.getItem('STUDENT_ALERTS');
            if (savedAlerts) {
                const parsedData = JSON.parse(savedAlerts);
                const parsed = Array.isArray(parsedData) ? parsedData : [];
                const role = user.role;
                
                const myAlerts = parsed.filter((a: any) => {
                    // Admin sees everything
                    if (role === 'admin') return true;

                    // Role targeting - handle both 'student'/'students' and 'faculty' forms
                    const target = a.targetAudience?.toLowerCase() || '';
                    const roleMatch = target === 'both' || 
                                     (role === 'student' && target.includes('student')) || 
                                     (role === 'faculty' && target.includes('faculty'));
                    
                    if (!roleMatch) return false;

                    // Students check branch/year/section
                    if (role === 'student') {
                        const student = MOCK_STUDENTS.find(s => 
                            (s.id && s.id.toLowerCase() === user.id.trim().toLowerCase()) || 
                            (s.rollNumber && s.rollNumber.trim().toLowerCase() === user.id.trim().toLowerCase())
                        );
                        
                        // IF we can't find the student, ONLY show broad 'All' alerts
                        if (!student) {
                           return a.branch === 'All' || a.branch === 'all' || target === 'both';
                        }
                        
                        const branchMatch = a.branch === 'All' || a.branch === 'all' || a.branch === student.branch;
                        const yearMatch = a.year === 0 || Number(a.year) === Number(student.year);
                        return branchMatch && yearMatch;
                    }

                    // Faculty check departmental/branch targeting
                    if (role === 'faculty') {
                        const faculty = MOCK_FACULTY.find(f => 
                            f.id.toLowerCase() === user.id.trim().toLowerCase() ||
                            f.rollNumber?.toLowerCase() === user.id.trim().toLowerCase()
                        );
                        
                        if (!faculty) {
                            return a.branch === 'All' || a.branch === 'all' || target === 'both';
                        }
                        
                        // If it's a broad exam/timetable alert for both, ignore branch lock to ensure visibility
                        if (target === 'both' && (a.category === 'exam' || a.category === 'timetable')) return true;

                        const branchMatch = a.branch === 'All' || a.branch === 'all' || a.branch === faculty.department;
                        return branchMatch;
                    }

                    return true;
                });
                setStudentAlerts(myAlerts);
            }

            // 4. Load Group Message Unreads
            const savedMsgs = localStorage.getItem('smartcampus_messages');
            if (savedMsgs) {
                const msgs: Record<string, any[]> = JSON.parse(savedMsgs);
                let unreadTotal = 0;
                Object.values(msgs).forEach(groupMsgs => {
                    groupMsgs.forEach(m => {
                        if (m.senderId !== user.id && !m.readBy?.includes(user.name)) {
                            unreadTotal++;
                        }
                    });
                });
                setUnreadGroupMsgs(unreadTotal);
            }
        } catch (error) {
            console.error("Notifications Hook Error:", error);
        } finally {
            setLoading(false);
        }
    }, [user.id, user.role, user.name]);

    useEffect(() => {
        loadAll();
        
        // Listen for internal system updates
        window.addEventListener('faculty_request_updated', loadAll);
        window.addEventListener('student_alerts_updated', loadAll);
        window.addEventListener('messages_updated', loadAll);
        window.addEventListener('storage', loadAll);
        
        // Polling for backend updates
        const interval = setInterval(loadAll, 10000);
        
        return () => {
            window.removeEventListener('faculty_request_updated', loadAll);
            window.removeEventListener('student_alerts_updated', loadAll);
            window.removeEventListener('messages_updated', loadAll);
            window.removeEventListener('storage', loadAll);
            clearInterval(interval);
        };
    }, [loadAll]);

    const notifications = useMemo(() => {
        const list: UIBackfilledNotification[] = [];

        // ... existing map logic ...
        // (Keeping it abbreviated for the tool call)

        // Map Faculty Requests
        const readReqs = JSON.parse(localStorage.getItem('READ_REQUESTS') || '[]');
        liveRequests.forEach(r => {
            const isStatusUpdate = r.senderId === user.id && r.status !== 'pending';
            const type = r.status === 'rejected' ? "destructive" : r.status === 'approved' ? "success" : "warning";
            list.push({
                id: `req-${r.id}`,
                title: isStatusUpdate ? `Request ${r.status.toUpperCase()}` : (r.type === 'leave' ? `Leave: ${r.senderName}` : `Swap: ${r.senderName}`),
                message: isStatusUpdate ? `Your ${r.type} request was ${r.status}.` : `${r.date} | ${r.period || 'Full Day'}`,
                type,
                read: readReqs.includes(String(r.id)),
                isRequest: !isStatusUpdate,
                senderName: isStatusUpdate ? "System" : r.senderName,
                url: user.role === 'admin' ? '/dashboard/requests' : '/dashboard/leave',
                timestamp: r.timestamp || new Date().toISOString()
            });
        });

        // Map Institutional Alerts (All Roles)
        studentAlerts.forEach(a => {
            list.push({
                id: a.id.startsWith('alert-') ? a.id : `alert-${a.id}`,
                title: a.title,
                message: a.message,
                type: (a.title.toLowerCase().includes('attendance') ? 'attendance' : 'info') as any,
                read: a.isRead || false,
                isRequest: false,
                senderName: "Institutional Notice",
                url: a.redirectUrl || `/dashboard/communications?activeTab=notifications&id=${a.id}`,
                timestamp: a.timestamp || new Date().toISOString()
            });
        });

        // Map Backend API Notifications
        apiNotifications.forEach(n => {
            const isTargeted = n.target_audience === 'all' || 
                             (n.target_audience === 'students' && user.role === 'student') ||
                             (n.target_audience === 'faculty' && user.role === 'faculty');
            
            if (isTargeted) {
                list.push({
                    id: `api-${n.id}`,
                    title: n.title,
                    message: n.message,
                    type: n.type as any,
                    read: n.is_read || false,
                    isRequest: false,
                    senderName: "Institute Notice",
                    url: n.redirect_url || "/dashboard",
                    timestamp: n.created_at
                });
            }
        });

        return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [liveRequests, studentAlerts, apiNotifications, user.id, user.role]);

    const unreadCount = notifications.filter(n => !n.read).length + unreadGroupMsgs;

    return { 
        notifications, 
        unreadCount, 
        loading, 
        refresh: loadAll,
        markAsRead: async (id: string) => {
            if (id.startsWith('api-')) {
                await notificationService.markAsRead(Number(id.replace('api-', '')));
            } else if (id.startsWith('alert-')) {
                // Direct comparison — don't strip if the source already has the prefix
                const savedAlerts = JSON.parse(localStorage.getItem('STUDENT_ALERTS') || '[]');
                const updated = savedAlerts.map((a: any) => {
                    const aId = a.id.startsWith('alert-') ? a.id : `alert-${a.id}`;
                    return aId === id ? { ...a, isRead: true } : a;
                });
                localStorage.setItem('STUDENT_ALERTS', JSON.stringify(updated));
            } else if (id.startsWith('req-')) {
                const reqId = id.replace('req-', '');
                const readReqs = JSON.parse(localStorage.getItem('READ_REQUESTS') || '[]');
                if (!readReqs.includes(reqId)) {
                    localStorage.setItem('READ_REQUESTS', JSON.stringify([...readReqs, reqId]));
                }
            }
            loadAll();
            window.dispatchEvent(new Event('storage'));
        },
        markAllAsRead: async () => {
            await notificationService.markAllAsRead();
            
            const savedAlerts = JSON.parse(localStorage.getItem('STUDENT_ALERTS') || '[]');
            const updated = savedAlerts.map((a: any) => ({ ...a, isRead: true }));
            localStorage.setItem('STUDENT_ALERTS', JSON.stringify(updated));

            // Mark all requests read
            const allReqIds = liveRequests.map(r => String(r.id));
            localStorage.setItem('READ_REQUESTS', JSON.stringify(allReqIds));
            
            loadAll();
            window.dispatchEvent(new Event('storage'));
        }
    };
}
