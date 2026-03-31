
export interface LeaveRequest {
    id: string;
    facultyId: string;
    facultyName: string;
    type: string;
    fromDate: string;
    toDate: string;
    days: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    appliedAt: string;
}

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
    {
        id: 'lv-1',
        facultyId: 'sunil-srinivas',
        facultyName: 'Dr. B. Sunil Srinivas',
        type: 'Casual Leave',
        fromDate: '2025-04-10',
        toDate: '2025-04-11',
        days: 2,
        reason: 'Personal family event',
        status: 'Pending',
        appliedAt: '2025-03-15T09:00:00'
    }
];
