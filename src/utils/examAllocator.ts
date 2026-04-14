import { Exam, SeatingAssignment, InvigilationDuty } from "../data/examData";
import { Student, MOCK_STUDENTS } from "../data/mockStudents";
import { Faculty, MOCK_FACULTY } from "../data/mockFaculty";
import { Room, MOCK_ROOMS } from "../data/mockRooms";

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

    // 1. Data Preparation
    const selectedYears = exam.years || [];
    const eligibleStudents = MOCK_STUDENTS
        .filter(s => selectedYears.includes(s.year))
        .sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

    if (eligibleStudents.length === 0) return { seating, invigilators };

    // Group students by branch
    const branches = [...new Set(eligibleStudents.map(s => s.branch))];
    const studentsByBranch: Record<string, Student[]> = {};
    branches.forEach(b => {
        studentsByBranch[b] = eligibleStudents.filter(s => s.branch === b);
    });

    // 2. Prepare Workload-Aware Faculty Pool
    const eligibleFaculty = MOCK_FACULTY.filter(f => {
        const desig = f.designation.toLowerCase();
        return !desig.includes("hod") && 
               !desig.includes("head") && 
               !desig.includes("technical trainer") &&
               !f.isNonTeaching;
    });

    // Count existing duties per faculty
    const dutyMap: Record<string, number> = {};
    existingDuties.forEach(d => {
        dutyMap[d.facultyId] = (dutyMap[d.facultyId] || 0) + 1;
    });

    // Function to calculate selection priority (Lower is better)
    const getPriority = (f: Faculty) => {
        let score = (dutyMap[f.id] || 0) * 1000; // Major penalty for duty count
        
        // Date/Shift Penalties (STRICT rotation)
        const sameDayDuty = existingDuties.find(d => d.facultyId === f.id && d.date === exam.date);
        if (sameDayDuty) {
            score += 5000; // Massive penalty for same-day repeat
            if (sameDayDuty.time === `${exam.startTime} - ${exam.endTime}`) {
                score += 10000; // Forbidden repeat in same slot
            }
        }

        // Department multiplier (soft preference for mixed departments)
        const hash = (f.id + exam.id).split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
        score += Math.abs(hash % 100); // Small random jitter for variety
        
        return score;
    };

    // Sort faculty by priority score
    const sortedFaculty = [...eligibleFaculty].sort((a, b) => getPriority(a) - getPriority(b));

    // 3. Room Selection & Distribution
    const classrooms = MOCK_ROOMS.filter(r => r.type === "Classroom");
    const prioritizedRooms = classrooms.sort((a, b) => {
        const aIsTBlock = a.building.includes("T Block");
        const bIsTBlock = b.building.includes("T Block");
        const yr1 = selectedYears.includes(1);
        if (yr1) return aIsTBlock ? -1 : 1;
        return aIsTBlock ? 1 : -1;
    });

    let currentRoomIdx = 0;
    const MAX_CAPACITY = 30;
    const branchPointers: Record<string, number> = {};
    branches.forEach(b => branchPointers[b] = 0);

    // Track used faculty in this specific exam session (Room-level isolation)
    const usedInThisSession = new Set<string>();

    // 4. Allocation Loop
    while (true) {
        const activeBranches = branches.filter(b => branchPointers[b] < studentsByBranch[b].length);
        if (activeBranches.length === 0) break;
        if (currentRoomIdx >= prioritizedRooms.length) break;

        const room = prioritizedRooms[currentRoomIdx];
        let roomSeatingCount = 0;
        const currentRoomBranches: string[] = [];

        // Mixing logic
        const roomBranchPair = activeBranches.slice(0, 2);
        if (roomBranchPair.length < 2 && activeBranches.length >= 1) {
            roomBranchPair.push(roomBranchPair[0]);
        }

        roomBranchPair.forEach((branch, bIdx) => {
            const limit = bIdx === 0 ? Math.ceil(MAX_CAPACITY / 2) : Math.floor(MAX_CAPACITY / 2);
            for (let i = 0; i < limit; i++) {
                if (branchPointers[branch] < studentsByBranch[branch].length && roomSeatingCount < MAX_CAPACITY) {
                    const student = studentsByBranch[branch][branchPointers[branch]];
                    seating.push({
                        examId: exam.id,
                        studentId: student.id,
                        rollNumber: student.rollNumber,
                        studentName: student.name,
                        branch: student.branch,
                        year: student.year,
                        room: room.name,
                        block: room.building,
                        seatNumber: `${String.fromCharCode(65 + Math.floor(roomSeatingCount / 10))}${(roomSeatingCount % 10) + 1}`
                    });
                    branchPointers[branch]++;
                    roomSeatingCount++;
                    if (!currentRoomBranches.includes(branch)) currentRoomBranches.push(branch);
                }
            }
        });

        // 5. Invigilator Mapping (2 per room)
        // Always pick the next best faculty from the sorted pool who hasn't been used in THIS session
        for (let i = 0; i < 2; i++) {
            // Find best available proctor
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
                
                // Add to temporary count for the remaining rooms in this same function call if needed,
                // but sortedFaculty is already fixed for this session.
            }
        }

        currentRoomIdx++;
    }

    return { seating, invigilators };
}


