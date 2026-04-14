import api from './api';

const API_BASE_URL = '/attendance'; // Base URL is already /api/v1 in api instance

export interface AttendanceRecord {
    id?: number;
    student_id: number;
    course_code: string;
    subject_id?: string;
    faculty_id?: string;
    attendance_date: string;
    period?: number;
    status: 'Present' | 'Absent' | 'Late';
}

export type AttendanceBulkCreate = AttendanceRecord[];

export const attendanceService = {
    getAttendance: async (params: { 
        course_code?: string; 
        student_id?: number; 
        attendance_date?: string 
    }) => {
        try {
            const response = await api.get(`${API_BASE_URL}/`, { params });
            // Always return array for safety
            return Array.isArray(response.data) ? response.data : [];
        } catch (error: any) {
            console.error("Attendance API Fetch Error:", error.response?.data || error.message);
            return [];
        }
    },

    saveBulkAttendance: async (data: AttendanceBulkCreate) => {
        try {
            console.log("Saving Bulk Attendance [Payload]:", data);
            const response = await api.post(`${API_BASE_URL}/bulk`, data);
            return response.data;
        } catch (error: any) {
            console.error("Attendance Bulk Save Error [Critical]:", error.response?.data || "Server Unreachable");
            throw error;
        }
    },

    saveSingleAttendance: async (data: AttendanceRecord) => {
        const response = await api.post(`${API_BASE_URL}/`, data);
        return response.data;
    }
};
