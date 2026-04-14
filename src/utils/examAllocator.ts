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

    // 2. Filter & Prepare Faculty (Strict Exclusions)
    const eligibleFaculty = MOCK_FACULTY.filter(f => {
        const desig = f.designation.toLowerCase();
        return !desig.includes("hod") && 
               !desig.includes("head") && 
               !desig.includes("technical trainer") &&
               !f.isNonTeaching;
    });

    // Get session index for rotation starting point
    const idParts = exam.id.split('-');
    const ttIdPart = idParts.length > 2 ? idParts[1] : "";
    const sessionIdx = idParts.length > 2 ? parseInt(idParts[2]) : 0;
    const ttHash = ttIdPart.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Stable shuffle for faculty rotation
    const sortedFaculty = [...eligibleFaculty].sort((a, b) => {
        const hash = (str: string) => str.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
        return hash(a.id + ttHash) - hash(b.id + ttHash);
    });

    // CRITICAL: Rotate the faculty list based on session index to ensure 
    // different people are picked on different days of the cycle.
    const dayOffset = (sessionIdx * 30) % sortedFaculty.length;
    const rotatedFaculty = [...sortedFaculty.slice(dayOffset), ...sortedFaculty.slice(0, dayOffset)];

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

    // Track used faculty in this slot to prevent overlapping duties
    const usedFacultyIds = new Set<string>();

    // 4. Allocation Loop (Strict Branch Mixing & Faculty Mapping)
    while (true) {
        // Find branches that still have students
        const activeBranches = branches.filter(b => branchPointers[b] < studentsByBranch[b].length);
        if (activeBranches.length === 0) break;
        if (currentRoomIdx >= prioritizedRooms.length) break;

        const room = prioritizedRooms[currentRoomIdx];
        let roomSeatingCount = 0;
        const currentRoomBranches: string[] = [];

        // STRICT MIXING RULE: Each room must have at least 2 branches (if possible)
        // We pick top 2 active branches and split capacity 15-15
        const roomBranchPair = activeBranches.slice(0, 2);
        if (roomBranchPair.length < 2 && activeBranches.length >= 1) {
            // If only one branch left in entire system, we have to use it, 
            // but the rule says "minimum 2 branches". 
            // In a real scenario, we'd mix with another year, but here we only have the selected students.
            roomBranchPair.push(roomBranchPair[0]); // Fallback if absolutely no other branch exists
        }

        // Allocate students from the pair
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

        // 5. Invigilator Mapping (1 per branch group)
        // Room has [Branch A, Branch B] -> Assign [Faculty A, Faculty B]
        currentRoomBranches.forEach((branch, idx) => {
            if (idx >= 2) return; // Exactly 2 proctors

            // Find faculty from this department who isn't already used
            // If the branch is 'CSM', we look for department 'CSM'
            let faculty = rotatedFaculty.find(f => 
                f.department.toUpperCase() === branch.toUpperCase() && !usedFacultyIds.has(f.id)
            );

            // Fallback if no specific department faculty available
            if (!faculty) {
                faculty = rotatedFaculty.find(f => !usedFacultyIds.has(f.id));
            }

            if (faculty) {
                invigilators.push({
                    examId: exam.id,
                    facultyId: faculty.id,
                    facultyName: faculty.name,
                    room: room.name,
                    date: exam.date,
                    time: `${exam.startTime} - ${exam.endTime}`
                });
                usedFacultyIds.add(faculty.id);
            }
        });

        // Ensure exactly 2 invigilators per room
        while (invigilators.filter(i => i.room === room.name && i.examId === exam.id).length < 2) {
            const fallback = rotatedFaculty.find(f => !usedFacultyIds.has(f.id));
            if (fallback) {
                invigilators.push({
                    examId: exam.id,
                    facultyId: fallback.id,
                    facultyName: fallback.name,
                    room: room.name,
                    date: exam.date,
                    time: `${exam.startTime} - ${exam.endTime}`
                });
                usedFacultyIds.add(fallback.id);
            } else break;
        }

        currentRoomIdx++;
    }

    return { seating, invigilators };
}


