import { useState, useEffect, useMemo, useCallback } from 'react';
import notificationService, { Notification } from '@/services/notificationService';
import { MOCK_STUDENTS } from '@/data/mockStudents';
import { MOCK_FACULTY } from '@/data/mockFaculty';
import { MOCK_CONVERSATIONS } from '@/data/mockCommunications';

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
        const role = user.role;
        try {
            // 1. Fetch from Backend (Independent Try)
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const data = await notificationService.getNotifications();
                    if (data) setApiNotifications(data);
                }
            } catch (err) {
                // Silent catch for dev/unauthorized environments
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
                
                const myAlerts = parsed.filter((a: any) => {
                    const target = a.targetAudience?.toLowerCase() || '';

                    // RULE 1: Never show any alert back to the person who sent it
                    if (a.senderId && a.senderId !== 'system' && a.senderId === user.id) return false;

                    // RULE 2: Admins only see broad 'both' alerts (not student/faculty-only ones)
                    if (role === 'admin') {
                        return target === 'both' || target === '' || target === 'all';
                    }

                    // RULE 3: Strict Recipient Filtering (Direct mentions / Personal assignments)
                    if (a.recipientId && a.recipientId !== 'all' && a.recipientId !== 'targeted') {
                        return a.recipientId === user.id;
                    }

                    // Role targeting - handle both 'student'/'students' and 'faculty' forms
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
                        
                        // Broad exam/timetable alerts for faculty always visible
                        if (target === 'both' && (a.category === 'exam' || a.category === 'timetable')) return true;

                        const branchMatch = a.branch === 'All' || a.branch === 'all' || a.branch === faculty.department;
                        return branchMatch;
                    }

                    return true;
                });
                setStudentAlerts(myAlerts);
            }

            // 4. Load Group Message Unreads (Filtered by Group Visibility)
            const savedMsgs = localStorage.getItem('smartcampus_messages');
            const savedConvs = localStorage.getItem('smartcampus_conversations');
            
            if (savedMsgs) {
                const msgs: Record<string, any[]> = JSON.parse(savedMsgs);
                const localConvs: any[] = savedConvs ? JSON.parse(savedConvs) : [];
                
                // Helper to check if user belongs to a group
                const isMember = (conv: any) => {
                    const type = conv.type;
                    const branch = conv.branch;
                    const year = conv.year;
                    const section = conv.section;

                    if (role === 'admin') {
                        return ['admin_broadcast', 'admin_to_yi', 'cr_coordination', 'faculty_only', 'placement_cell'].includes(type);
                    }
                    
                    const student = MOCK_STUDENTS.find(s => s.rollNumber === user.id || s.id === user.id);
                    const faculty = MOCK_FACULTY.find(f => f.id === user.id);

                    if (role === 'student' && student) {
                        if (type === 'admin_broadcast' || type === 'placement_cell') return true;
                        if (type === 'year_group') return branch === student.branch && year === student.year;
                        if (type === 'section_group') return branch === student.branch && year === student.year && section === student.section;
                        // Handle subject codes or codes in course groups
                        if (type === 'subject_specific') return branch === student.branch && year === student.year;
                        return false;
                    }
                    if (role === 'faculty' && faculty) {
                        if (type === 'admin_broadcast' || type === 'placement_cell' || type === 'admin_to_yi') return true;
                        if (type === 'faculty_only') return branch === faculty.department;
                        if (type === 'year_group') return branch === faculty.department; 
                        if (type === 'section_group') return branch === faculty.department;
                        return false;
                    }
                    return false;
                };

                let unreadTotal = 0;
                Object.entries(msgs).forEach(([groupId, groupMsgs]) => {
                    // Find conversation meta in local storage OR fallback to mock
                    const conv = localConvs.find(c => c.id === groupId) || MOCK_CONVERSATIONS.find(c => c.id === groupId);
                    
                    // Critical Fix: Only count if we successfully verify visibility/membership
                    if (conv && isMember(conv)) {
                        groupMsgs.forEach(m => {
                            if (m.senderId !== user.id && !m.readBy?.includes(user.name)) {
                                unreadTotal++;
                            }
                        });
                    }
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
        const seenParentIds = new Set<string>();

        liveRequests.forEach(r => {
            const isStatusUpdate = r.senderId === user.id && r.status !== 'pending';
            
            // Deduplication logic for Broadcast status updates
            if (isStatusUpdate && r.parentId) {
                if (seenParentIds.has(r.parentId)) return;
                seenParentIds.add(r.parentId);
            }

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
            const aId = String(a.id);
            list.push({
                id: aId.startsWith('alert-') ? aId : `alert-${aId}`,
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

    const systemUnreadCount = notifications.filter(n => !n.read).length;
    const totalUnreadCount = systemUnreadCount + unreadGroupMsgs;

    // Sync totalUnreadCount to localStorage for the Sidebar's Communication Hub badge
    useEffect(() => {
        localStorage.setItem('smartcampus_unread_count', String(totalUnreadCount));
        window.dispatchEvent(new Event('storage'));
    }, [totalUnreadCount]);

    return { 
        notifications, 
        unreadCount: systemUnreadCount, // The Bell now ONLY shows system alerts/requests
        totalUnreadCount,
        loading, 
        refresh: loadAll,
        markAsRead: async (id: string) => {
            if (id.startsWith('api-')) {
                await notificationService.markAsRead(Number(id.replace('api-', '')));
            } else if (id.startsWith('alert-')) {
                // Direct comparison — don't strip if the source already has the prefix
                const savedAlerts = JSON.parse(localStorage.getItem('STUDENT_ALERTS') || '[]');
                const updated = savedAlerts.map((a: any) => {
                    const aIdStr = String(a.id);
                    const aId = aIdStr.startsWith('alert-') ? aIdStr : `alert-${aIdStr}`;
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

            // Mark all group messages as read
            const savedMsgs = localStorage.getItem('smartcampus_messages');
            if (savedMsgs) {
                const msgs: Record<string, any[]> = JSON.parse(savedMsgs);
                Object.keys(msgs).forEach(key => {
                    msgs[key] = msgs[key].map(m => {
                        if (m.senderId !== user.id && !m.readBy?.includes(user.name)) {
                            return { ...m, readBy: [...(m.readBy || []), user.name] };
                        }
                        return m;
                    });
                });
                localStorage.setItem('smartcampus_messages', JSON.stringify(msgs));
                window.dispatchEvent(new CustomEvent('messages_updated'));
            }
            
            loadAll();
            window.dispatchEvent(new Event('storage'));
        }
    };
}
