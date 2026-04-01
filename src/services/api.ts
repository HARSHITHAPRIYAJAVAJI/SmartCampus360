import axios from 'axios';

const API_URL = '/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token interceptor if implemented
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const timetableService = {
    getAll: () =>
        api.get('/timetable/all'),
    generate: (year: number, semester: number, department: string) =>
        api.post('/timetable/generate', { year, semester, department }),
    save: (year: number, semester: number, department: string, section: string, schedule: any) =>
        api.post('/timetable/save', { year, semester, department, section, schedule }),
    publish: (semester: number, department: string) =>
        api.post('/timetable/publish', { semester, department }),
    reallocate: () =>
        api.post('/timetable/reallocate'),
};

export const academicService = {
    getCourses: (department?: string, semester?: number) =>
        api.get('/academic/courses', { params: { department, semester } }),
    getRooms: () =>
        api.get('/academic/rooms'),
    getFaculty: () =>
        api.get('/academic/faculty'),
};

export const reportService = {
    getCompliance: () =>
        api.get('/reports/compliance'),
};

export const trainingService = {
    getRecommendations: () =>
        api.get('/training/recommendations'),
    getAllSkills: () =>
        api.get('/training/skills'),
    startModule: (moduleId: number) =>
        api.post(`/training/modules/${moduleId}/start`),
};

export const admissionService = {
    apply: (data: any) =>
        api.post('/admissions/apply', data),
    status: (email: string) =>
        api.get(`/admissions/status/${email}`),
};

export const placementService = {
    getJobs: () =>
        api.get('/placements/jobs'),
    getCompanies: () =>
        api.get('/placements/companies'),
    apply: (jobId: number) =>
        api.post('/placements/apply', { job_id: jobId }),
};

export default api;
