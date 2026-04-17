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

// Cross-tab real-time synchronization channel
const attendanceChannel = new BroadcastChannel('smartcampus_attendance_sync');

export const attendanceService = {
    getAttendance: async (params: { 
        course_code?: string; 
        student_id?: number; 
        attendance_date?: string 
    }) => {
        try {
            // Priority 1: Check Local Dynamic Cache
            const localCache = localStorage.getItem('smartcampus_attendance_cache');
            const cached: AttendanceRecord[] = localCache ? JSON.parse(localCache) : [];
            
            const response = await api.get(`${API_BASE_URL}/`, { params });
            const serverData = Array.isArray(response.data) ? response.data : [];
            
            const merged = [...serverData];
            cached.forEach(c => {
               const exists = merged.some(s => 
                  s.student_id === c.student_id && 
                  s.course_code === c.course_code && 
                  s.attendance_date === c.attendance_date && 
                  s.period === c.period
               );
               if (!exists) {
                   const matchCourse = !params.course_code || c.course_code === params.course_code;
                   const matchStudent = !params.student_id || c.student_id === params.student_id;
                   const matchDate = !params.attendance_date || c.attendance_date === params.attendance_date;
                   if (matchCourse && matchStudent && matchDate) {
                       merged.push(c);
                   }
               }
            });

            return merged;
        } catch (error: any) {
            console.error("Attendance API Fetch Error:", error.response?.data || error.message);
            const localCache = localStorage.getItem('smartcampus_attendance_cache');
            const cached: AttendanceRecord[] = localCache ? JSON.parse(localCache) : [];
            return cached.filter(c => {
               const matchCourse = !params.course_code || c.course_code === params.course_code;
               const matchStudent = !params.student_id || c.student_id === params.student_id;
               const matchDate = !params.attendance_date || c.attendance_date === params.attendance_date;
               return matchCourse && matchStudent && matchDate;
            });
        }
    },

    saveBulkAttendance: async (data: AttendanceBulkCreate) => {
        try {
            // 1. Immediate Local Save
            const localCache = localStorage.getItem('smartcampus_attendance_cache');
            let cached: AttendanceRecord[] = localCache ? JSON.parse(localCache) : [];
            
            data.forEach(nr => {
                cached = cached.filter(c => !(
                    c.student_id === nr.student_id && 
                    c.course_code === nr.course_code && 
                    c.attendance_date === nr.attendance_date && 
                    c.period === nr.period
                ));
            });
            const updatedCache = [...data, ...cached].slice(0, 1000);
            localStorage.setItem('smartcampus_attendance_cache', JSON.stringify(updatedCache));

            // BROADCAST: Alert all other tabs immediately
            attendanceChannel.postMessage({ type: 'ATTENDANCE_SAVED', timestamp: Date.now() });

            // 2. Transmit to Backend
            console.log("Saving Bulk Attendance [Payload]:", data);
            const response = await api.post(`${API_BASE_URL}/bulk`, data);
            return response.data;
        } catch (error: any) {
            console.error("Attendance Bulk Save Error:", error.response?.data || "Server Unreachable");
            return { status: 'saved_locally', message: 'Sync pending' };
        }
    },

    // Helper to listen for updates in components
    onUpdate: (callback: () => void) => {
        const handler = (event: MessageEvent) => {
            if (event.data.type === 'ATTENDANCE_SAVED') {
                callback();
            }
        };
        attendanceChannel.addEventListener('message', handler);
        return () => attendanceChannel.removeEventListener('message', handler);
    },

    saveSingleAttendance: async (data: AttendanceRecord) => {
        const response = await api.post(`${API_BASE_URL}/`, data);
        attendanceChannel.postMessage({ type: 'ATTENDANCE_SAVED', timestamp: Date.now() });
        return response.data;
    }
};
