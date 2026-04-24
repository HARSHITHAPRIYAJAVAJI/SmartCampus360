import { MOCK_STUDENTS } from '@/data/mockStudents';

export interface CourseMarks {
    studentId: string;
    courseCode: string;
    assignment1: number | null;
    mid1: number | null;
    assignment2: number | null;
    mid2: number | null;
    labInternal: number | null;
    labExternal: number | null;
    examMark: number | null;
}

const STORAGE_KEY = 'ACADEMIC_RECORDS_DB';

export const academicService = {
    // Standardized generation logic to ensure CONSISTENCY between Student & Faculty views
    getGeneratedMarks: (studentId: string, courseCode: string, courseName: string, isLab: boolean, isProject: boolean, credits: number, isCurrentSemester: boolean = false) => {
        // Create a unique seed for this student+course combination
        const idSeed = studentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const codeSeed = courseCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const combinedSeed = idSeed + codeSeed;
        
        const pseudoRandom = (min: number, max: number, offset = 0) => {
            const val = (((combinedSeed + offset) * 9301 + 49297) % 233280) / 233280;
            return Math.floor(min + val * (max - min));
        };

        if (credits === 0 || isProject) {
            return {
                mid1: 0, assignment1: 0, mid2: 0, assignment2: 0,
                labInternal: 0, labExternal: 0,
                exam: 0, total: 0
            };
        }

        if (isLab) {
            // Lab marks are only assigned for PAST semesters
            const labInt = isCurrentSemester ? 0 : pseudoRandom(32, 40, 1); // Out of 40
            const labExt = isCurrentSemester ? 0 : pseudoRandom(45, 59, 2); // Out of 60
            return {
                mid1: 0, assignment1: 0, mid2: 0, assignment2: 0,
                labInternal: labInt, labExternal: labExt,
                exam: 0, total: labInt + labExt
            };
        } else {
            const m1 = pseudoRandom(20, 30, 3);
            const m2 = pseudoRandom(18, 28, 4);
            const a1 = pseudoRandom(3, 6, 5);
            const a2 = pseudoRandom(3, 6, 6);
            // Exams are only assigned for PAST semesters and capped at 60M
            const ex = isCurrentSemester ? 0 : pseudoRandom(35, 61, 7);
            
            return {
                mid1: m1, assignment1: a1, mid2: m2, assignment2: a2,
                labInternal: 0, labExternal: 0,
                exam: ex, total: Math.max(m1, m2) + a1 + a2 + ex
            };
        }
    },

    getMarks: (studentId: string, courseCode: string): CourseMarks | null => {
        let dbStr = localStorage.getItem(STORAGE_KEY);
        
        // Auto-seed KRR marks for CSM 4th Year Section C if not present
        if (courseCode === '4E7GA') {
            const allStudentsStore = localStorage.getItem('smartcampus_student_directory');
            const students = allStudentsStore ? JSON.parse(allStudentsStore) : MOCK_STUDENTS;
            
            const targetStudent = students.find((s: any) => s.id === studentId || s.rollNumber === studentId);
            if (targetStudent && targetStudent.branch === 'CSM' && targetStudent.year === 4 && targetStudent.section === 'C') {
                const currentDb = dbStr ? JSON.parse(dbStr) : {};
                const key = `${studentId}-${courseCode}`;
                
                const m = currentDb[key];
                if (!m || ((m.mid1 == null || m.mid1 <= 0) && (m.assignment1 == null || m.assignment1 <= 0))) {
                    // Seed with pseudo-random realistic high marks to impress the faculty user
                    const seed = parseInt(studentId.replace(/\D/g, '')) || 0;
                    currentDb[key] = {
                        studentId,
                        courseCode,
                        assignment1: 4 + (seed % 2),          // 4 or 5
                        mid1: 22 + (seed % 8),                // 22 to 29
                        assignment2: 4 + ((seed + 1) % 2),      // 4 or 5
                        mid2: 24 + ((seed + 2) % 6),          // 24 to 29
                        labInternal: 0,
                        labExternal: 0,
                        examMark: 0
                    };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDb));
                    dbStr = JSON.stringify(currentDb);
                }
            }
        }

        if (!dbStr) return null;
        try {
            const allMarks = JSON.parse(dbStr) as Record<string, CourseMarks>;
            return allMarks[`${studentId}-${courseCode}`] || null;
        } catch (e) {
            return null;
        }
    },
    
    saveMarks: (studentId: string, courseCode: string, marks: Partial<CourseMarks>) => {
        const db = localStorage.getItem(STORAGE_KEY);
        const allMarks = db ? JSON.parse(db) : {};
        const key = `${studentId}-${courseCode}`;
        
        allMarks[key] = {
            ...(allMarks[key] || {
                studentId,
                courseCode,
                assignment1: null,
                mid1: null,
                assignment2: null,
                mid2: null,
                labInternal: null,
                labExternal: null,
                examMark: null
            }),
            ...marks
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allMarks));
        // Force refresh across components
        window.dispatchEvent(new Event('academic_records_updated'));
        window.dispatchEvent(new Event('academic_records_updated_v2')); // Dual broadcast for different dashboard hooks
    },
    
    getAllForStudent: (studentId: string): Record<string, CourseMarks> => {
        const db = localStorage.getItem(STORAGE_KEY);
        if (!db) return {};
        try {
            const allMarks = JSON.parse(db) as Record<string, CourseMarks>;
            const studentMarks: Record<string, CourseMarks> = {};
            Object.values(allMarks).forEach(m => {
                if (m.studentId === studentId) {
                    studentMarks[m.courseCode] = m;
                }
            });
            return studentMarks;
        } catch (e) {
            return {};
        }
    },

    /**
     * Institutional Rule: Determine if mid2/exam results should be visible 
     * based on student year and semester.
     * Rule: 1st Year -> Sem 1 (Odd), 2nd Year -> Sem 3 (Odd), etc.
     */
    getVisibility: (studentYear: number, semesterNum: number) => {
        const currentActiveSemester = (studentYear * 2) - 1; // All years currently in ODD sem
        
        if (semesterNum < currentActiveSemester) {
            // Historical data (e.g. Sem 2, 4, 6) - completely visible
            return { showMid1: true, showAssgn1: true, showMid2: true, showAssgn2: true, showExam: true, isHistorical: true };
        } else if (semesterNum === currentActiveSemester) {
            // Current in-progress semester - Now fully visible as per updated policy
            return { showMid1: true, showAssgn1: true, showMid2: true, showAssgn2: true, showExam: true, isHistorical: false };
        } else {
            // Future data - hide everything
            return { showMid1: false, showAssgn1: false, showMid2: false, showAssgn2: false, showExam: false, isHistorical: false };
        }
    }
};
