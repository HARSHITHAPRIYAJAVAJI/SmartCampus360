import { MOCK_COURSES } from "./mockCourses";
import { MOCK_FACULTY } from "./mockFaculty";
import { MOCK_STUDENTS } from "./mockStudents";

export interface Exam {
    id: string;
    type: "Mid-1" | "Mid-2" | "Semester";
    years: number[]; // e.g. [1, 2]
    courseCodes: string[]; // Subject codes for these years
    date: string;
    startTime: string;
    endTime: string;
    status: "Pending" | "Allocated";
}

export interface SeatingAssignment {
    examId: string;
    studentId: string;
    rollNumber: string;
    studentName: string;
    branch: string;
    year: number;
    room: string;
    seatNumber: string;
    block: string;
}

export interface InvigilationDuty {
    examId: string;
    facultyId: string;
    facultyName: string;
    room: string;
    date: string;
    time: string;
}

export const INITIAL_EXAMS: Exam[] = [
    { 
        id: "ex1", 
        type: "Mid-1", 
        years: [1], 
        courseCodes: ["4B1AA", "4H1AH"], 
        date: "2025-10-15", 
        startTime: "10:00 AM", 
        endTime: "11:30 AM", 
        status: "Pending" 
    },
    { 
        id: "ex2", 
        type: "Mid-1", 
        years: [3, 4], 
        courseCodes: ["4B3AD", "4E7GA"], 
        date: "2025-10-16", 
        startTime: "10:00 AM", 
        endTime: "11:30 AM", 
        status: "Pending" 
    },
];

export const getSeatingPlan = (): SeatingAssignment[] => {
    const saved = localStorage.getItem('EXAM_SEATING_PLAN');
    return saved ? JSON.parse(saved) : [];
};

export const getInvigilationList = (): InvigilationDuty[] => {
    const saved = localStorage.getItem('INVIGILATION_LIST');
    return saved ? JSON.parse(saved) : [];
};

export const saveExams = (exams: Exam[]) => {
    localStorage.setItem('EXAM_SCHEDULE', JSON.stringify(exams));
};
