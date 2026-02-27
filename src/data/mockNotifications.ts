export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'destructive';
    targetAudience: 'all' | 'students' | 'faculty' | 'staff';
    date: string;
    status: 'sent' | 'draft' | 'scheduled';
    sender: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Campus Maintenance',
        message: 'The server room will be undergoing maintenance this Saturday from 10 AM to 2 PM. Expect internet outages.',
        type: 'warning',
        targetAudience: 'all',
        date: '2025-03-15T10:00:00',
        status: 'sent',
        sender: 'Admin'
    },
    {
        id: '2',
        title: 'New Course Registration',
        message: 'Registration for the Fall 2025 semester opens next Monday. Please review the course catalog.',
        type: 'info',
        targetAudience: 'students',
        date: '2025-03-16T09:00:00',
        status: 'sent',
        sender: 'Registrar'
    },
    {
        id: '3',
        title: 'Accreditation Visit',
        message: 'The NBA accreditation team will be visiting the campus next week. Please ensure all labs are prepped.',
        type: 'destructive',
        targetAudience: 'faculty',
        date: '2025-03-20T08:00:00',
        status: 'draft',
        sender: 'Admin'
    }
];

export const NOTIFICATION_TEMPLATES = [
    {
        id: 't1',
        title: 'Event Reminder',
        message: 'This is a reminder that [Event Name] will take place on [Date] at [Time] in [Location].',
        type: 'info'
    },
    {
        id: 't2',
        title: 'Deadline Alert',
        message: 'Urgent: The deadline for [Action Item] is [Date]. Please submit your documents immediately.',
        type: 'warning'
    },
    {
        id: 't3',
        title: 'Welcome Message',
        message: 'Welcome to the new academic year! We are excited to have you back on campus.',
        type: 'success'
    }
];
