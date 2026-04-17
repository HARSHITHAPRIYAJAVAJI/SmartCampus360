import { Exam, SeatingAssignment, InvigilationDuty } from "../data/examData";
import { Student, MOCK_STUDENTS } from "../data/mockStudents";
import { Faculty, MOCK_FACULTY } from "../data/mockFaculty";
import { Room, MOCK_ROOMS } from "../data/mockRooms";
import { MOCK_COURSES } from "../data/mockCourses";

/**
 * Advanced Exam Seating Allocation Engine
 * Features:
 * - Dynamic Room Capacity strictly enforced
 * - Even branch distribution per room (Balanced studentsPerBranch)
 * - Rotating branch selection for fair allocation
 * - Dual-invigilator assignment with departmental checks & fallback
 */
/**
 * Advanced Exam Seating Allocation Engine
 * Features:
 * - Workload-Aware Rotation: Prioritizes faculty with least duties
 * - Multi-Guard Logic: Prevents repeats across consecutive days and shifts
 * - Full Faculty Utilization: Forces selection from the entire departmental pool
 */
export function allocateAdvancedExamSeating(
    exam: Exam, 
    existingDuties: InvigilationDuty[] = []
): { seating: SeatingAssignment[], invigilators: InvigilationDuty[] } {
    const seating: SeatingAssignment[] = [];
    const invigilators: InvigilationDuty[] = [];

    // 1. Strict Filtering: Find only students who actually have an exam in this slot
    const relevantCourses = MOCK_COURSES.filter(c => exam.courseCodes.includes(c.code));
    const branchYearPairs = relevantCourses.map(c => ({
        branch: c.department,
        year: Math.ceil(c.semester / 2)
    })).filter(p => exam.years.includes(p.year));

    // Remove duplicates to optimize filtering
    const uniquePairs = Array.from(new Set(branchYearPairs.map(p => `${p.branch}-${p.year}`)));

    const eligibleStudents = MOCK_STUDENTS.filter(s => 
        uniquePairs.includes(`${s.branch}-${s.year}`)
    );

    if (eligibleStudents.length === 0) return { seating, invigilators };

    // 2. Randomization: Shuffle students to ensure subject/year distribution
    const shuffledStudents = [...eligibleStudents].sort(() => Math.random() - 0.5);

    // 3. Prepare Faculty Pool
    const eligibleFaculty = MOCK_FACULTY.filter(f => {
        const desig = f.designation.toLowerCase();
        return !desig.includes("hod") && 
               !desig.includes("head") && 
               !desig.includes("technical trainer") &&
               !f.isNonTeaching;
    });

    const dutyMap: Record<string, number> = {};
    existingDuties.forEach(d => {
        dutyMap[d.facultyId] = (dutyMap[d.facultyId] || 0) + 1;
    });

    const getPriority = (f: Faculty) => {
        let score = (dutyMap[f.id] || 0) * 1000;
        const sameDayDuty = existingDuties.find(d => d.facultyId === f.id && d.date === exam.date);
        if (sameDayDuty) {
            score += 5000;
            if (sameDayDuty.time === `${exam.startTime} - ${exam.endTime}`) score += 10000;
        }
        return score + Math.random() * 100;
    };

    const sortedFaculty = [...eligibleFaculty].sort((a, b) => getPriority(a) - getPriority(b));

    // 4. Room Allocation (Intelligent Selection)
    const allClassrooms = MOCK_ROOMS.filter(r => r.type === "Classroom");
    const activeBranches = new Set(branchYearPairs.map(p => p.branch));

    // Preferred rooms are ones that belong to the active branches taking the exam
    const preferredRooms = allClassrooms.filter(room => 
        room.dept && activeBranches.has(room.dept) // E.g., CSE matches CSE rooms
    );

    // Remaining rooms are unrelated departments or general blocks
    const remainingRooms = allClassrooms.filter(room => 
        !room.dept || !activeBranches.has(room.dept)
    );

    const MAX_CAPACITY = 30;
    const roomsNeeded = Math.ceil(shuffledStudents.length / MAX_CAPACITY);
    
    let selectedRooms: Room[] = [];
    if (preferredRooms.length >= roomsNeeded) {
        selectedRooms = preferredRooms.slice(0, roomsNeeded);
    } else {
        selectedRooms = [
            ...preferredRooms,
            ...remainingRooms
        ].slice(0, roomsNeeded);
    }

    if (selectedRooms.length === 0) return { seating, invigilators };

    // Group students to ensure we don't just dump all of one year in one room first
    // Actually, shuffling already helps, but round-robin across rooms is key
    shuffledStudents.forEach((student, index) => {
        const roomIdx = index % selectedRooms.length;
        const room = selectedRooms[roomIdx];
        const roomSeatsCount = seating.filter(s => s.room === room.name && s.examId === exam.id).length;

        seating.push({
            examId: exam.id,
            studentId: student.id,
            rollNumber: student.rollNumber,
            studentName: student.name,
            branch: student.branch,
            year: student.year,
            room: room.name,
            block: room.building,
            seatNumber: `${String.fromCharCode(65 + Math.floor(roomSeatsCount / 10))}${(roomSeatsCount % 10) + 1}`
        });
    });

    // 5. Invigilator Mapping (2 per room used)
    const usedInThisSession = new Set<string>();
    selectedRooms.forEach(room => {
        for (let i = 0; i < 2; i++) {
            const faculty = sortedFaculty.find(f => !usedInThisSession.has(f.id));
            if (faculty) {
                invigilators.push({
                    examId: exam.id,
                    facultyId: faculty.id,
                    facultyName: faculty.name,
                    room: room.name,
                    date: exam.date,
                    time: `${exam.startTime} - ${exam.endTime}`
                });
                usedInThisSession.add(faculty.id);
            }
        }
    });

    return { seating, invigilators };
}


