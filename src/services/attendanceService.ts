import axios from 'axios';

// baseURL is handled by vite.config.ts proxy
const API_BASE_URL = '/api/v1/attendance';

export interface AttendanceRecord {
    id?: number;
    student_id: number;
    course_code: string;
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
            const response = await axios.get(`${API_BASE_URL}/`, { params });
            // Always return array for safety
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error("Attendance API Fetch Error:", error);
            return [];
        }
    },

    saveBulkAttendance: async (data: AttendanceBulkCreate) => {
        try {
            console.log("Saving Bulk Attendance:", data);
            const response = await axios.post(`${API_BASE_URL}/bulk`, data);
            return response.data;
        } catch (error: any) {
            console.error("Attendance Bulk Save Error Details:", error.response?.data);
            throw error;
        }
    },

    saveSingleAttendance: async (data: AttendanceRecord) => {
        const response = await axios.post(`${API_BASE_URL}/`, data);
        return response.data;
    }
};
