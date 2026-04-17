/**
 * Communication Hub Types
 */
export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'Admin' | 'Year In-Charge' | 'Faculty' | 'Student' | 'CR' | 'Placement Officer';
    content: string;
    timestamp: string;
    type: 'text' | 'announcement' | 'priority' | 'official';
    category?: 'exam' | 'fee' | 'scholarship' | 'event' | 'holiday' | 'academic' | 'general';
    isEdited?: boolean;
    readBy?: string[]; // Names of people who read this
    attachments?: { name: string; url: string; type: 'pdf' | 'note' | 'assignment' | 'image'; size?: string }[];
    reactions?: Record<string, string[]>; // { "👍": ["User A", "User B"] }
}

export interface Conversation {
    id: string;
    name: string;
    type: 
        | 'admin_broadcast'     // One-way Admin -> All
        | 'admin_to_yi'        // Admin <-> YI
        | 'yi_to_faculty'      // YI <-> Faculty
        | 'faculty_to_cr'      // Faculty <-> CRs
        | 'section_group'      // Faculty + Students (daily communication)
        | 'year_group'         // YI + Students (general year updates)
        | 'cr_coordination'    // CRs <-> Admin/Faculty
        | 'faculty_only'       // Internal Faculty Meeting/Policies
        | 'subject_specific'   // Subject Faculty <-> Students
        | 'placement_cell';    // T&P Updates
    participants: string[];    // User IDs or Roles
    allowedSenders: string[];  // Strict Role Control
    branch?: string;
    year?: number;
    section?: string;
    subject?: string;
    lastMessage?: string;
    updatedAt: string;
    unreadCount?: number;
}

export interface InstitutionalNotification {
    id: string;
    recipientId: string;
    targetAudience?: 'student' | 'students' | 'faculty' | 'both' | 'all';
    branch?: string;
    year?: number;
    section?: string;
    title: string;
    message: string;
    type: 'urgent' | 'normal' | 'info' | 'priority' | 'success';
    category: 'exam' | 'attendance' | 'fee' | 'timetable' | 'mention' | 'substitution' | 'general';
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
    redirectUrl?: string; // Standardized with other alert systems
}

/**
 * MOCK DATA
 */

export const MOCK_CONVERSATIONS: Conversation[] = [

    // 2. Admin <-> YI (Strict Hierarchy)
    { 
        id: 'admin-yi-coord', 
        name: 'Admin ↔ Year In-Charges', 
        type: 'admin_to_yi', 
        participants: ['admin', 'faculty'], 
        allowedSenders: ['Admin', 'Year In-Charge'],
        updatedAt: '2024-03-24T12:00:00Z' 
    },
    
    // 3. Section Groups (Most Active)
    { 
        id: 'csm-y4-sec-a', 
        name: 'CSM 4th Year - Sec A', 
        type: 'section_group', 
        branch: 'CSM', year: 4, section: 'A',
        participants: ['faculty', 'student'], 
        allowedSenders: ['Faculty', 'Year In-Charge', 'Student', 'CR'],
        updatedAt: '2024-03-24T11:00:00Z' 
    },
    { 
        id: 'cse-y3-sec-b', 
        name: 'CSE 3rd Year - Sec B', 
        type: 'section_group', 
        branch: 'CSE', year: 3, section: 'B',
        participants: ['faculty', 'student'], 
        allowedSenders: ['Faculty', 'Year In-Charge', 'Student', 'CR'],
        updatedAt: '2024-03-24T11:05:00Z' 
    },

    // 4. Year-Wise (YI <-> Students)
    { 
        id: 'csm-y4-year-group', 
        name: 'CSM 4th Year - Official', 
        type: 'year_group', 
        branch: 'CSM', year: 4,
        participants: ['faculty', 'student'], 
        allowedSenders: ['Year In-Charge', 'Admin'],
        updatedAt: '2024-03-24T10:00:00Z' 
    },


    // 6. Placement Hub
    { 
        id: 'placements-hub', 
        name: 'Placements Cell', 
        type: 'placement_cell', 
        participants: ['admin', 'faculty', 'student'], 
        allowedSenders: ['Admin', 'Placement Officer'],
        updatedAt: '2024-03-24T13:00:00Z' 
    },

    // 7. CR Group (Global)
    { 
        id: 'all-crs-chain', 
        name: 'CR Coordination Chain', 
        type: 'cr_coordination', 
        participants: ['admin', 'faculty', 'cr'], 
        allowedSenders: ['Admin', 'Faculty', 'CR'],
        updatedAt: '2024-03-24T08:00:00Z',
        lastMessage: 'All CRs meeting scheduled for tomorrow.'
    },
    
    // 8. Branch-Specific Faculty Groups
    { 
        id: 'faculty-cse', 
        name: 'CSE Faculty Hub', 
        type: 'faculty_only', 
        branch: 'CSE',
        participants: ['admin', 'faculty'], 
        allowedSenders: ['Admin', 'Faculty', 'Year In-Charge'],
        updatedAt: '2024-03-24T07:10:00Z',
        lastMessage: 'Internal CSE departmental updates.'
    },
    { 
        id: 'faculty-csm', 
        name: 'CSM Faculty Hub', 
        type: 'faculty_only', 
        branch: 'CSM',
        participants: ['admin', 'faculty'], 
        allowedSenders: ['Admin', 'Faculty', 'Year In-Charge'],
        updatedAt: '2024-03-24T07:15:00Z',
        lastMessage: 'CSM project review discussion.'
    },
    { 
        id: 'faculty-ece', 
        name: 'ECE Faculty Hub', 
        type: 'faculty_only', 
        branch: 'ECE',
        participants: ['admin', 'faculty'], 
        allowedSenders: ['Admin', 'Faculty', 'Year In-Charge'],
        updatedAt: '2024-03-24T07:20:00Z',
        lastMessage: 'ECE lab equipment status update.'
    },
    { 
        id: 'faculty-it', 
        name: 'IT Faculty Hub', 
        type: 'faculty_only', 
        branch: 'IT',
        participants: ['admin', 'faculty'], 
        allowedSenders: ['Admin', 'Faculty', 'Year In-Charge'],
        updatedAt: '2024-03-24T07:25:00Z',
        lastMessage: 'IT departmental meeting scheduled.'
    }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
    'admin-broadcast': [
        { id: 'ab1', senderId: 'admin', senderName: 'Admin Cell', senderRole: 'Admin', content: 'Holiday Announcement: The campus will remain closed on Wednesday for Cultural Day.', timestamp: '2024-03-24T14:00:00Z', type: 'announcement', category: 'holiday' },
        { id: 'ab2', senderId: 'admin', senderName: 'Admin Cell', senderRole: 'Admin', content: 'Fee Payment Alert: Late fee applicable from March 30th.', timestamp: '2024-03-24T09:00:00Z', type: 'priority', category: 'fee' }
    ],
    'admin-yi-coord': [
        { id: 'amy1', senderId: 'admin', senderName: 'Dean Office', senderRole: 'Admin', content: 'YIs, please ensure semester-end attendance reports are uploaded by EOD today.', timestamp: '2024-03-24T12:00:00Z', type: 'priority', category: 'academic' }
    ],
    'csm-y4-sec-a': [
        { id: 'sa1', senderId: 'prof-ali', senderName: 'Dr. Ali', senderRole: 'Faculty', content: 'Students, find the lab manual for DBMS in the files section. Please complete experiment 7.', timestamp: '2024-03-24T11:00:00Z', type: 'text', category: 'academic' }
    ],
};

export const MOCK_NOTIFICATIONS: InstitutionalNotification[] = [
    { id: 'n1', recipientId: 'user-123', title: '🚨 Fee Deadline', message: 'Final fee payment deadline extended to April 5th.', type: 'urgent', category: 'fee', timestamp: '2024-03-24T15:00:00Z', isRead: false },
    { id: 'n2', recipientId: 'user-123', title: '📅 Timetable Updated', message: 'New timetable for SEM-II has been released.', type: 'normal', category: 'timetable', timestamp: '2024-03-24T12:30:00Z', isRead: false },
    { id: 'n3', recipientId: 'user-123', title: '⚠️ Attendance Alert', message: 'Your attendance in OS Lab is below 75%. Please meet YI.', type: 'urgent', category: 'attendance', timestamp: '2024-03-24T10:00:00Z', isRead: true },
    { id: 'n4', recipientId: 'user-123', title: '🏷️ You were mentioned', message: 'Dr. Ali mentioned you in CSM 4-A: "Nitin, share the notes."', type: 'normal', category: 'mention', timestamp: '2024-03-24T11:05:00Z', isRead: false }
];


