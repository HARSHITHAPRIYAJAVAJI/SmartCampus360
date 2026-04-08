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
export function allocateAdvancedExamSeating(exam: Exam): { seating: SeatingAssignment[], invigilators: InvigilationDuty[] } {
    const seating: SeatingAssignment[] = [];
    const invigilators: InvigilationDuty[] = [];

    // 1. Data Preparation & Validation
    const selectedYears = exam.years || [];
    const eligibleStudents = MOCK_STUDENTS.filter(s => selectedYears.includes(s.year));

    if (eligibleStudents.length === 0) return { seating, invigilators };

    // Group students by branch for balanced distribution
    const branchGroups: Record<string, Student[]> = {};
    eligibleStudents.forEach(s => {
        if (!branchGroups[s.branch]) branchGroups[s.branch] = [];
        branchGroups[s.branch].push(s);
    });

    const branchNames = Object.keys(branchGroups);
    const branchPointers: Record<string, number> = {};
    branchNames.forEach(b => branchPointers[b] = 0);

    // Filter usable rooms
    const availableRooms = MOCK_ROOMS.filter(r => r.type === "Classroom" || r.type === "Auditorium");
    
    let currentRoomIdx = 0;
    let totalAllocated = 0;
    const totalToAllocate = eligibleStudents.length;

    // 2. Allocation Loop
    while (totalAllocated < totalToAllocate && currentRoomIdx < availableRooms.length) {
        const room = availableRooms[currentRoomIdx];
        const roomCapacity = room.capacity;

        // Identify branches that still have students left
        let activeBranches = branchNames.filter(b => branchPointers[b] < branchGroups[b].length);
        if (activeBranches.length === 0) break;

        // 3. Improved Branch Selection (Rotation)
        // Offset starting branch per room to ensure variety
        const rotatedBranches = [...activeBranches];
        const offset = currentRoomIdx % activeBranches.length;
        for (let i = 0; i < offset; i++) {
            const b = rotatedBranches.shift();
            if (b) rotatedBranches.push(b);
        }

        // Target up to 4 branches per room for optimal distancing
        const selectedBranches = rotatedBranches.slice(0, 4);
        
        // 4. Balanced Student Distribution
        // Calculate max students per branch in this specific room
        const studentsPerBranch = Math.floor(roomCapacity / selectedBranches.length);
        let roomSeatingCount = 0;

        // Fill room capacity or branch limits
        // We use a round-robin filling approach until room/branch capacity is reached
        for (let i = 0; i < roomCapacity; i++) {
            const branchToPick = selectedBranches[i % selectedBranches.length];
            
            // Check if we can still pick from this branch and we haven't hit room capacity
            if (branchPointers[branchToPick] < branchGroups[branchToPick].length && roomSeatingCount < roomCapacity) {
                const student = branchGroups[branchToPick][branchPointers[branchToPick]];
                
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

                branchPointers[branchToPick]++;
                roomSeatingCount++;
                totalAllocated++;
            }
        }

        // 5. Robust Invigilator Assignment (2 per room)
        const examDepts = (exam.courseCodes || []).map(code => code.substring(2, 5).toUpperCase());
        let eligibleInvigilators = MOCK_FACULTY.filter(f => 
            !examDepts.includes(f.department.toUpperCase())
        );

        // Fallback to general list if specific department faculty are insufficient
        if (eligibleInvigilators.length < 2) {
            eligibleInvigilators = MOCK_FACULTY;
        }

        // Assign two unique invigilators using rotating index
        const inv1 = eligibleInvigilators[(currentRoomIdx * 2) % eligibleInvigilators.length];
        const inv2 = eligibleInvigilators[(currentRoomIdx * 2 + 1) % eligibleInvigilators.length];

        [inv1, inv2].forEach(inv => {
            invigilators.push({
                examId: exam.id,
                facultyId: inv.id,
                facultyName: inv.name,
                room: room.name,
                date: exam.date,
                time: `${exam.startTime} - ${exam.endTime}`
            });
        });

        currentRoomIdx++;
    }

    return { seating, invigilators };
}
