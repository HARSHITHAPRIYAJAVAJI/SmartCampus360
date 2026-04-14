import { addDays, format, isSunday, parseISO } from "date-fns";
import { MOCK_COURSES } from "../data/mockCourses";

export const EXAM_BRANCHES = ["CSE", "ECE", "IT", "CSM"];

export interface ExamSlot {
    date: string;
    day: string;
    session: "FN" | "AN";
    startTime: string;
    endTime: string;
    subjects: {
        branch: string;
        year: number;
        semester: number;
        courseCode: string;
        courseName: string;
    }[];
}

export interface ExamTimetable {
    id: string;
    title: string;
    type: "Mid-1" | "Mid-2" | "Semester";
    years: number[];
    semesterGroup: 1 | 2; // 1 for Odd, 2 for Even
    startDate: string;
    endDate: string;
    slots: ExamSlot[];
    isPublished: boolean;
}

export interface ExamConfig {
    years: number[];
    semesterGroup: 1 | 2;  // 1 for Odd, 2 for Even
    startDate: string;
    type: "Mid-1" | "Mid-2" | "Semester";
    slotSelection: "Morning Only" | "Afternoon Only" | "Both";
    fnStart: string;
    fnEnd: string;
    anStart: string;
    anEnd: string;
}

export const generateExamTimetable = (config: ExamConfig): ExamTimetable => {
    const { years, semesterGroup, startDate, type, slotSelection, fnStart, fnEnd, anStart, anEnd } = config;
    const slots: ExamSlot[] = [];
    
    // 1. Group subjects by branch and year (Theory only)
    const yearSubjects: Record<number, Record<string, any[]>> = {};
    let globalMaxSubjects = 0;
    
    years.forEach(year => {
        yearSubjects[year] = {};
        // Map 1st Year -> Sem 1/2, 2nd Year -> Sem 3/4
        const targetSemester = (year - 1) * 2 + semesterGroup;
        
        EXAM_BRANCHES.forEach(branch => {
            const subjects = MOCK_COURSES.filter(c => 
                c.semester === targetSemester && 
                c.department === branch &&
                c.type === "Theory" &&
                !c.name.toLowerCase().includes("project work") &&
                !c.name.toLowerCase().includes("phase 1") &&
                !c.name.toLowerCase().includes("phase 2") &&
                !c.name.toLowerCase().includes("stage 1") &&
                !c.name.toLowerCase().includes("stage 2")
            ).slice(0, 6);
            yearSubjects[year][branch] = subjects;
            globalMaxSubjects = Math.max(globalMaxSubjects, subjects.length);
        });
    });

    const isSemester = type === "Semester";
    let sessionsPerDay: ("FN" | "AN")[] = ["FN"];
    if (slotSelection === "Morning Only") sessionsPerDay = ["FN"];
    else if (slotSelection === "Afternoon Only") sessionsPerDay = ["AN"];
    else if (slotSelection === "Both") sessionsPerDay = ["FN", "AN"];
    
    let currentDate = parseISO(startDate);
    let subjectIndex = 0;

    while (subjectIndex < globalMaxSubjects) {
        if (isSunday(currentDate)) {
            currentDate = addDays(currentDate, 1);
            continue;
        }

        for (const session of sessionsPerDay) {
            if (subjectIndex >= globalMaxSubjects) break;

            const slot: ExamSlot = {
                date: format(currentDate, "yyyy-MM-dd"),
                day: format(currentDate, "EEEE"),
                session: session,
                startTime: session === "FN" ? fnStart : anStart,
                endTime: session === "FN" ? fnEnd : anEnd,
                subjects: []
            };

            years.forEach(year => {
                EXAM_BRANCHES.forEach(branch => {
                    const subject = yearSubjects[year][branch][subjectIndex];
                    if (subject) {
                        slot.subjects.push({
                            branch,
                            year,
                            semester: (year - 1) * 2 + semesterGroup,
                            courseCode: subject.code,
                            courseName: subject.name
                        });
                    }
                });
            });

            if (slot.subjects.length > 0) {
                slots.push(slot);
            }
            subjectIndex++;
        }

        currentDate = addDays(currentDate, isSemester ? 2 : 1);
    }

    return {
        id: `TT-${Date.now()}`,
        title: `${type} Examination Schedule`,
        type,
        years,
        semesterGroup,
        startDate,
        endDate: format(addDays(currentDate, -1), "yyyy-MM-dd"),
        slots,
        isPublished: false
    };
};
