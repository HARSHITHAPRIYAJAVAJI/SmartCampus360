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
        courseCode: string;
        courseName: string;
    }[];
}

export interface ExamTimetable {
    id: string;
    title: string;
    type: "Mid-1" | "Mid-2" | "Semester";
    years: number[];
    semester: number;
    startDate: string;
    endDate: string;
    slots: ExamSlot[];
    isPublished: boolean;
}

export const generateExamTimetable = (
    years: number[],
    semester: number,
    startDate: string,
    type: "Mid-1" | "Mid-2" | "Semester"
): ExamTimetable => {
    const slots: ExamSlot[] = [];
    
    // 1. Group subjects by branch and year (Theory only)
    const yearSubjects: Record<number, Record<string, any[]>> = {};
    years.forEach(year => {
        yearSubjects[year] = {};
        EXAM_BRANCHES.forEach(branch => {
            const subjects = MOCK_COURSES.filter(c => 
                c.semester === semester && 
                c.department === branch &&
                c.type === "Theory"
            ).slice(0, 6);
            yearSubjects[year][branch] = subjects;
        });
    });

    const isSemester = type === "Semester";
    const sessionsPerDay: ("FN" | "AN")[] = isSemester ? ["FN"] : ["FN", "AN"];
    
    let currentDate = parseISO(startDate);
    let subjectIndex = 0;
    const maxSubjects = 6;

    while (subjectIndex < maxSubjects) {
        if (isSunday(currentDate)) {
            currentDate = addDays(currentDate, 1);
            continue;
        }

        for (const session of sessionsPerDay) {
            if (subjectIndex >= maxSubjects) break;

            const slot: ExamSlot = {
                date: format(currentDate, "yyyy-MM-dd"),
                day: format(currentDate, "EEEE"),
                session: session,
                startTime: session === "FN" ? "10:00 AM" : "02:00 PM",
                endTime: session === "FN" ? (isSemester ? "01:00 PM" : "12:00 PM") : (isSemester ? "05:00 PM" : "04:00 PM"),
                subjects: []
            };

            years.forEach(year => {
                EXAM_BRANCHES.forEach(branch => {
                    const subject = yearSubjects[year][branch][subjectIndex];
                    if (subject) {
                        slot.subjects.push({
                            branch,
                            year,
                            courseCode: subject.code,
                            courseName: subject.name
                        });
                    }
                });
            });

            slots.push(slot);
            if (isSemester) {
                // For semester, each day is one subject index
                // but we loop sessions (only 1 session for semester)
            } else {
                // For Mid, if we are in FN, we don't increment subjectIndex yet until AN?
                // Actually, Mid layout usually is: Day 1 FN (Sub 1), Day 1 AN (Sub 2).
                // So subjectIndex should increment per session in Mid.
                subjectIndex++;
            }
        }

        if (isSemester) {
            subjectIndex++;
            currentDate = addDays(currentDate, 2); // 1-day gap (alternate days)
        } else {
            currentDate = addDays(currentDate, 1); // Continuous for Mid
        }
    }

    return {
        id: `TT-${Date.now()}`,
        title: `${type} Examination Schedule`,
        type,
        years,
        semester,
        startDate,
        endDate: format(addDays(currentDate, -1), "yyyy-MM-dd"),
        slots,
        isPublished: false
    };
};
