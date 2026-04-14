
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
    getMarks: (studentId: string, courseCode: string): CourseMarks | null => {
        const db = localStorage.getItem(STORAGE_KEY);
        if (!db) return null;
        try {
            const allMarks = JSON.parse(db) as Record<string, CourseMarks>;
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
            // Current in-progress semester - selective visibility
            return { showMid1: true, showAssgn1: true, showMid2: false, showAssgn2: false, showExam: false, isHistorical: false };
        } else {
            // Future data - hide everything
            return { showMid1: false, showAssgn1: false, showMid2: false, showAssgn2: false, showExam: false, isHistorical: false };
        }
    }
};
