
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { MOCK_COURSES } from "@/data/mockCourses";

const KEYS = {
    FACULTY: 'DYNAMIC_FACULTY',
    STUDENTS: 'DYNAMIC_STUDENTS',
    COURSES: 'DYNAMIC_COURSES'
};

// Generic type for records with soft delete
export interface ManagedRecord {
    id: string;
    is_active?: boolean;
    deleted_at?: string | null;
    [key: string]: any;
}

export const dataPersistence = {
    // Generic Load
    load: <T extends ManagedRecord>(key: string, initialData: T[]): T[] => {
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
        
        // Inject defaults to mock data if loading for the first time
        const initialized = initialData.map(item => ({
            ...item,
            is_active: item.is_active ?? true,
            deleted_at: item.deleted_at ?? null
        }));
        localStorage.setItem(key, JSON.stringify(initialized));
        return initialized;
    },

    // Generic Save
    save: <T extends ManagedRecord>(key: string, data: T[]) => {
        localStorage.setItem(key, JSON.stringify(data));
        window.dispatchEvent(new Event('dynamic_data_updated'));
    },

    // Get Active Only
    getActive: <T extends ManagedRecord>(key: string, initialData: T[]): T[] => {
        return dataPersistence.load(key, initialData).filter(item => item.is_active !== false);
    },

    // Get Deleted Only
    getDeleted: <T extends ManagedRecord>(key: string, initialData: T[]): T[] => {
        return dataPersistence.load(key, initialData).filter(item => item.is_active === false);
    },

    // Faculty Actions
    getFaculty: () => dataPersistence.getActive(KEYS.FACULTY, MOCK_FACULTY),
    getAllFaculty: () => dataPersistence.load(KEYS.FACULTY, MOCK_FACULTY),
    saveFaculty: (data: any[]) => dataPersistence.save(KEYS.FACULTY, data),
    
    // Student Actions
    getStudents: () => dataPersistence.getActive(KEYS.STUDENTS, MOCK_STUDENTS),
    getAllStudents: () => dataPersistence.load(KEYS.STUDENTS, MOCK_STUDENTS),
    saveStudents: (data: any[]) => dataPersistence.save(KEYS.STUDENTS, data),

    // Course Actions
    getCourses: () => dataPersistence.getActive(KEYS.COURSES, MOCK_COURSES),
    getAllCourses: () => dataPersistence.load(KEYS.COURSES, MOCK_COURSES),
    saveCourses: (data: any[]) => dataPersistence.save(KEYS.COURSES, data)
};
