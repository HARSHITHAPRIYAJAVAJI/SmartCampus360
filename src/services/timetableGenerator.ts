import { FACULTY_LOAD } from "@/data/aimlTimetable";
import { MOCK_FACULTY } from "@/data/mockFaculty";
import { MOCK_STUDENTS } from "@/data/mockStudents";
import { facultyAllocator, AllocationResult } from "@/services/facultyAllocator";

/**
 * --- TYPES & INTERFACES ---
 */
export interface CourseData {
    id: number | string;
    code: string;
    name: string;
    credits: number;
    department: string;
    semester: number;
    type?: 'Theory' | 'Lab'; // Optional, can be derived
    instructor?: {
        id: number;
        full_name: string;
    };
}

export interface RoomData {
    id: number | string;
    name: string;
    room_type: string; // "Lab" or "Lecture"
    building?: string;
    dept?: string;
    subjects?: string[];
}

export interface TimetableEntry {
    id: string;
    courseCode: string;
    courseName: string;
    faculty: string;
    facultyId?: string;
    facultyIds?: string[];
    room: string;
    type: 'Theory' | 'Lab' | 'Project';
}

export type TimetableGrid = Record<string, TimetableEntry | null>;

export interface TimetableMetadata {
    room: string;
    classTeacher: string;
    classTeacherId: string;
    yearInCharge: string;
    classRepresentative: string;
    section: string;
    department: string;
    year: number;
    semester: number;
}

export interface TimetableResult {
    grid: TimetableGrid;
    metadata: TimetableMetadata;
}

/**
 * --- TIMETABLE ENGINE ---
 * Production-ready Constraint Satisfaction Problem (CSP) Engine.
 * Fully decoupled from static data.
 */
export class TimetableEngine {
    private days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    private slots = ["09:40", "10:40", "11:40", "01:20", "02:20", "03:20"];
    
    // Resource registries
    private facultySchedule: Record<string, Set<string>> = {}; 
    private roomSchedule: Record<string, Set<string>> = {};
    private teacherAssignments: Set<string> = new Set();
    private roomAssignments: Set<string> = new Set();

    /**
     * Per-section pre-allocation cache.
     * Populated ONCE at the start of each section via preallocateSectionFaculty().
     * Key: courseCode  →  AllocationResult { name, id }
     * Ensures every slot for course X in section Y uses the SAME faculty,
     * and that allocate() is called exactly once per section (accurate workload).
     */
    private sectionFacultyCache: Record<string, AllocationResult> = {};

    constructor() {
        this.resetResources();
    }

    public resetResources() {
        this.days.forEach(day => {
            this.slots.forEach(slot => {
                const key = `${day}-${slot}`;
                this.facultySchedule[key] = new Set();
                this.roomSchedule[key] = new Set();
            });
        });
        this.teacherAssignments.clear();
        this.roomAssignments.clear();
        // Reset the allocator — clears workload AND cross-section assignment history
        facultyAllocator.resetWorkload();
        this.sectionFacultyCache = {};
    }

    /**
     * Pre-allocate faculty for all courses in a section.
     * Called ONCE per section before assignLabs/assignTheories.
     * Records workload accurately (one entry per course, not per slot).
     * Cross-section diversity is enforced via allocator's courseSectionAssignments.
     */
    private preallocateSectionFaculty(
        courses: CourseData[],
        section: string,
        year: number,
        semester: number,
        dept: string
    ) {
        // Start fresh for this section — new set of course→faculty mappings
        this.sectionFacultyCache = {};

        courses.forEach(course => {
            if (this.sectionFacultyCache[course.code]) return; // already allocated
            const sectionKey = `${dept}-${year}-${semester}-${section}`;
            const isLab = course.type === 'Lab' || 
                          course.name.toLowerCase().includes('lab') || 
                          course.name.includes("CAEG") || 
                          course.name.includes("Engineering Graphics");

            const result = facultyAllocator.allocate(
                course.code,
                course.name,
                dept,
                section,
                isLab,
                sectionKey,
                [],
                course.instructor?.full_name,
                course.instructor?.id?.toString()
            );

            this.sectionFacultyCache[course.code] = result;
        });
    }

    /**
     * CORE GENERATOR
     */
    public generate(
        year: number, 
        semester: number, 
        department: string, 
        section: string, 
        rawCourses: CourseData[], 
        rooms: RoomData[],
        shouldReset: boolean = true,
        manualClassTeacherId?: string,
        manualYearInCharge?: string
    ): TimetableResult {
        // Reset resource registries only if requested (usually for single gen)
        if (shouldReset) this.resetResources();

        const grid: TimetableGrid = {};
        
        // 1. Initial State Maintenance
        this.days.forEach(day => this.slots.forEach(slot => grid[`${day}-${slot}`] = null));

        // 2. Data Preparation
        const calcSemester = (year - 1) * 2 + semester;
        const currentCourses = rawCourses.filter(c => 
            c.department.toLowerCase() === department.toLowerCase() && 
            c.semester === calcSemester &&
            c.credits > 0
        );

        // --- NEW: Meta-Resource Allocation ---
        const dedicatedRoom = this.allocateRoom(department, year, section, rooms);
        
        const yearInCharge = manualYearInCharge || this.allocateYearInCharge(department, year);
        
        // Handle Manual Class Teacher or Auto
        let classTeacher: { name: string, id: string };
        if (manualClassTeacherId) {
            const faculty = MOCK_FACULTY.find(f => f.id === manualClassTeacherId);
            classTeacher = faculty 
                ? { name: faculty.name, id: faculty.id } 
                : this.allocateClassTeacher(department, year, section);
        } else {
            classTeacher = this.allocateClassTeacher(department, year, section);
        }
        
        const cr = "TBD (To be assigned by Class Teacher)";

        if (currentCourses.length === 0) {
            return {
                grid,
                metadata: {
                    room: dedicatedRoom.name,
                    classTeacher: classTeacher.name,
                    classTeacherId: classTeacher.id,
                    yearInCharge,
                    classRepresentative: cr,
                    section,
                    department,
                    year,
                    semester
                }
            };
        }

        const labs = currentCourses.filter(c => 
            c.type === 'Lab' || 
            c.name.toLowerCase().includes('lab') || 
            c.name.includes("Computer Aided") || c.name.includes("CAEG")
        );
        let theories = currentCourses.filter(c => !labs.includes(c));

        if (year === 4) {
            theories = theories.filter(c => !c.name.toLowerCase().includes('project'));
        }

        const labRooms = rooms.filter(r => r.room_type.toLowerCase().includes('lab'));

        // 3. HARD CONSTRAINTS: Project Phase Enforcement
        this.applyProjectBlocks(year, semester, section, grid);

        // 4. PRE-ALLOCATE FACULTY (once per section, accurate workload tracking)
        const calcSem2 = (year - 1) * 2 + semester;
        const inferredSem = calcSem2 % 2 === 0 ? 2 : 1;
        this.preallocateSectionFaculty([...labs, ...theories], section, year, inferredSem, department);

        // 5. NEW: Institutional CRT Sessions (3rd & 4th Years)
        this.applyCRTSessions(year, semester, department, section, grid);

        // 6. PRIORITY 1: LABS (3 Continuous Slots)
        this.assignLabs(labs, labRooms, section, year, department, grid);

        // 6. POLICY: Non-Final Years (Sports, Library)
        if (year !== 4) {
            this.assignPolicyFields(grid, section);
        }

        // 7. PRIORITY 2: THEORIES
        // Uses the dedicated room instead of generating a string
        this.assignTheories(theories, dedicatedRoom.name, section, year, department, grid);

        // 8. VALIDATION & RECOVERY
        this.recoveryMissingLabs(labs, labRooms, section, year, department, grid);

        return {
            grid,
            metadata: {
                room: dedicatedRoom.name,
                classTeacher: classTeacher.name,
                classTeacherId: classTeacher.id,
                yearInCharge,
                classRepresentative: cr,
                section,
                department,
                year,
                semester
            }
        };
    }

    /**
     * Finds a unique classroom for the section.
     */
    private allocateRoom(dept: string, year: number, section: string, rooms: RoomData[]): RoomData {
        const d = dept.toUpperCase();
        
        // Filter by type and if already assigned to a DIFFERENT section in this batch
        let candidates = rooms.filter(r => 
            (r.room_type === "Classroom" || r.room_type === "Lecture") && 
            !this.roomAssignments.has(r.name)
        );

        if (year === 1) {
            // POLICY: 1st Year -> T Block only, strictly floor-wise
            // CSM -> Floor 4, CSE -> Floor 5, ECE -> Floor 3, IT -> Floor 2
            let floorPrefix = "T-2"; // Default
            if (d === 'CSM' || d === 'AIML') floorPrefix = "T-4";
            else if (d === 'CSE') floorPrefix = "T-5";
            else if (d === 'ECE') floorPrefix = "T-3";
            else if (d === 'IT') floorPrefix = "T-2";

            candidates = candidates.filter(r => r.name.startsWith(floorPrefix));
        } else {
            // POLICY: 2nd-4th Year -> Branch-specific blocks
            // CSE -> Central Block (C-3), CSM -> North Block (N-4), ECE -> Central Block (C-4), IT -> South Block (S-4)
            let blockPrefix = "S-4";
            if (d === 'CSE') blockPrefix = "C-3";
            else if (d === 'CSM' || d === 'AIML') blockPrefix = "N-4";
            else if (d === 'ECE') blockPrefix = "C-4";
            else if (d === 'IT') blockPrefix = "S-4";

            candidates = candidates.filter(r => r.name.startsWith(blockPrefix));
        }

        // Select the first available candidate
        let selected = candidates.find(r => r.dept?.toUpperCase() === d) || candidates[0];

        // Emergency Fallback: If no rooms left in target block, pick any unassigned classroom
        if (!selected) {
            selected = rooms.find(r => 
                (r.room_type === "Classroom" || r.room_type === "Lecture") && 
                !this.roomAssignments.has(r.name)
            );
        }

        // Hard Fallback: If system is truly exhausted, reuse but this shouldn't happen with 12 rooms/dept
        if (!selected) {
            selected = rooms.find(r => r.room_type === "Classroom" || r.room_type === "Lecture") || rooms[0];
        }

        this.roomAssignments.add(selected.name);
        return selected;
    }

    /**
     * Assigns a unique class teacher from the same department.
     */
    private allocateClassTeacher(dept: string, year: number, section: string): { name: string, id: string } {
        // Get all Year In-Charges for this branch to exclude them from ALL Class Teacher pools in the branch
        const mapping = this.getYearInChargeMapping();
        const branchInCharges = Object.values(mapping[dept.toUpperCase()] || {});

        // STRICT REQUIREMENT: Class Teacher must belong to the same branch as the section
        // NEW CONSTRAINT: HODs and ALL Year In-Charges must NOT be assigned as Class Teachers
        const branchFaculty = MOCK_FACULTY.filter(f => 
            f.department.toUpperCase() === dept.toUpperCase() &&
            !f.designation.includes("HOD") &&
            !branchInCharges.includes(f.name)
        );

        // Find a faculty member from the same branch who isn't already assigned to another section
        const candidate = branchFaculty.find(f => !this.teacherAssignments.has(f.name));
        
        const teacher = candidate 
            ? { name: candidate.name, id: candidate.id }
            : { name: `${dept} Faculty (Unassigned)`, id: "default" };

        this.teacherAssignments.add(teacher.name);
        return teacher;
    }

    private getYearInChargeMapping(): Record<string, Record<number, string>> {
        return {
            "CSM": { 4: "Mrs. P. Vijaya Kumari", 3: "Mrs. C. Jaya Lakshmi", 2: "Mrs. C. Saritha Reddy", 1: "Dr. D. Anitha Kumari" },
            "IT": { 4: "D. Kavitha", 3: "Dr. Nallamothu Satyanarayana", 2: "Nagaraju Rajupeta", 1: "Mrs. B. Madhavi" },
            "CSE": { 4: "Dr. A. Suresh Rao", 3: "Mrs. C. Jaya Lakshmi", 2: "CH. Divya", 1: "Dr. A. Premalatha" },
            "ECE": { 4: "Dr. M. Mahesh", 3: "Sreedevi", 2: "Raju", 1: "G. Shankar" }
        };
    }

    private allocateYearInCharge(dept: string, year: number): string {
        const mapping = this.getYearInChargeMapping();
        return mapping[dept.toUpperCase()]?.[year] || `${dept} Faculty In-Charge`;
    }


    private recoveryMissingLabs(labs: CourseData[], rooms: RoomData[], section: string, year: number, department: string, grid: TimetableGrid) {
        const placedLabCodes = new Set(
            Object.values(grid)
                .filter(slot => slot && slot.type === 'Lab')
                .map(slot => slot!.courseCode)
        );

        const missingLabs = labs.filter(l => !placedLabCodes.has(l.code));
        if (missingLabs.length === 0) return;

        console.warn(`[RECOVERY] Section ${section} missing ${missingLabs.length} labs. Attempting recovery...`);

        const inferSem = labs.length > 0 ? (labs[0].semester % 2 === 0 ? 2 : 1) : 1;
        const labDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        missingLabs.forEach(course => {
            let recovered = false;
            
            // Get all eligible faculty for this course from the allocator
            const eligibleFaculty = facultyAllocator.getEligibleFaculty(
                course.code, course.name, department,
                course.instructor?.full_name,
                course.instructor?.id?.toString()
            );
            const eligibleObjs = eligibleFaculty.length > 0
                ? eligibleFaculty.map(f => ({ name: f.name, id: f.id }))
                : [{ name: course.instructor?.full_name || "Staff", id: course.instructor?.id?.toString() || "" }];

            for (const day of labDays) {
                if (recovered) break;
                
                for (const isMorning of [true, false]) {
                    if (recovered) break;

                    const blockSlots = isMorning ? this.slots.slice(0, 3) : this.slots.slice(3, 6);
                    
                    for (const facultyObj of eligibleObjs) {
                        // Check if faculty is free
                        const facultyFree = blockSlots.every(slot => !this.facultySchedule[`${day}-${slot}`].has(facultyObj.name));
                        if (!facultyFree) continue;

                        // NEW: Find a room that is actually FREE at this specific time
                        const assignedRoom = this.findAvailableLabRoom(department, course.name, day, blockSlots, rooms);
                        if (!assignedRoom) continue;

                        const canBeCleared = blockSlots.every(slot => {
                            const current = grid[`${day}-${slot}`];
                            return current === null || current.type !== 'Lab';
                        });

                        if (canBeCleared) {
                            blockSlots.forEach(slot => {
                                this.reserve(day, slot, [facultyObj.name], assignedRoom, course.code, true, [facultyObj.id]);
                                const isActuallyALab = course.type === 'Lab' || course.name.toLowerCase().includes('lab');
                                const baseName = this.abbreviate(course.name.replace(" Lab", ""));
                                grid[`${day}-${slot}`] = {
                                    id: `recovered-lab-${day}-${slot}-${course.id}`,
                                    courseCode: course.code,
                                    courseName: baseName + (isActuallyALab ? " Lab" : ""),
                                    faculty: facultyObj.name,
                                    facultyId: facultyObj.id,
                                    room: assignedRoom,
                                    type: 'Lab'
                                };
                            });
                            recovered = true;
                            console.log(`[RECOVERY] Successfully placed ${course.name} on ${day} ${isMorning ? 'Morning' : 'Afternoon'} in ${assignedRoom}`);
                            break;
                        }
                    }
                }
            }
        });
    }

    /**
     * Looks up the pre-allocated faculty cache for a course.
     * The cache is populated by preallocateSectionFaculty() ONCE per section.
     * Workload is already recorded at pre-allocation time — this is a pure lookup.
     */
    private getFacultyForCourse(course: CourseData, section: string, year: number, semester: number, dept: string): AllocationResult {
        const cached = this.sectionFacultyCache[course.code];
        if (cached) return cached;

        const sectionKey = `${dept}-${year}-${semester}-${section}`;
        const isLab = course.type === 'Lab' || 
                      course.name.toLowerCase().includes('lab') || 
                      course.name.includes("CAEG") || 
                      course.name.includes("Engineering Graphics");
        return facultyAllocator.resolveOnly(
            course.code,
            course.name,
            dept,
            sectionKey,
            isLab,
            course.instructor?.full_name,
            course.instructor?.id?.toString()
        );
    }

    private assignLabs(labs: CourseData[], rooms: RoomData[], section: string, year: number, department: string, grid: TimetableGrid) {
        const inferSem = labs.length > 0 ? (labs[0].semester % 2 === 0 ? 2 : 1) : 1;
        let labDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        const sessionQueue: CourseData[] = [...labs];

        // Shuffle combinations for better distribution
        let combinations: {day: string, isMorning: boolean}[] = [];
        labDays.forEach(d => {
            combinations.push({day: d, isMorning: true});
            combinations.push({day: d, isMorning: false});
        });
        
        // Priority for Section C: Try Saturday or Friday first to avoid clashing with A/B early week
        if (section === 'C') {
            combinations.sort((a, b) => b.day.localeCompare(a.day));
        } else {
            combinations.sort(() => Math.random() - 0.5);
        }

        sessionQueue.forEach(course => {
            let placedThisLab = false;
            
            // Get faculty via the specialization-aware allocator
            const res = this.getFacultyForCourse(course, section, year, inferSem, department);
            const facultiesToCheck = res.names || [res.name];
            
            // Try every possible time block
            for (const {day, isMorning} of combinations) {
                if (placedThisLab) break;

                const blockSlots = isMorning ? this.slots.slice(0, 3) : this.slots.slice(3, 6);
                
                // NEW: Dyna-Pick a room that is actually FREE at this specific time
                const assignedRoom = this.findAvailableLabRoom(department, course.name, day, blockSlots, rooms);
                if (!assignedRoom) continue; 

                // Refined block check (room is already checked by findAvailableLabRoom)
                if (this.isBlockFree(day, blockSlots, facultiesToCheck, null, grid)) { 
                    blockSlots.forEach(slot => {
                        this.reserve(day, slot, facultiesToCheck, assignedRoom, course.code, true, res.ids || [res.id]);
                        const isActuallyALab = course.type === 'Lab' || course.name.toLowerCase().includes('lab');
                        const baseName = this.abbreviate(course.name.replace(" Lab", ""));
                        grid[`${day}-${slot}`] = {
                            id: `lab-${day}-${slot}-${course.id}`,
                            courseCode: course.code,
                            courseName: baseName + (isActuallyALab ? " Lab" : ""),
                            faculty: res.name,
                            facultyId: res.id,
                            facultyIds: res.ids,
                            room: assignedRoom,
                            type: 'Lab'
                        };
                    });
                    placedThisLab = true;
                    break;
                }
            }
        });
    }

    private assignTheories(theories: CourseData[], defaultRoomStr: string, section: string, year: number, department: string, grid: TimetableGrid) {
        if (theories.length === 0) return;

        const emptySlots = Object.values(grid).filter(v => v === null).length;
        const slotsEach = Math.ceil(emptySlots / theories.length);

        let pool: CourseData[] = [];
        theories.forEach(t => {
            for (let i = 0; i < slotsEach; i++) pool.push(t);
        });

        if (pool.length > emptySlots) {
            pool = pool.slice(0, emptySlots);
        }

        pool.sort(() => Math.random() - 0.5);

        this.slots.forEach(slot => {
            this.days.forEach(day => {
                const key = `${day}-${slot}`;
                if (grid[key] !== null) return;
                
                const usedToday = this.slots.map(s => grid[`${day}-${s}`]?.courseCode).filter(Boolean);

                // Use getFacultyForCourse which reads from cache (no workload side effects)
                let bestIdx = pool.findIndex(c => {
                    const res = this.getFacultyForCourse(c, section, year, 1, department);
                    const faculties = res.names || [res.name];
                    return !usedToday.includes(c.code) && 
                           faculties.every(f => !this.facultySchedule[key].has(f)) && 
                           !this.roomSchedule[key].has(defaultRoomStr);
                });

                if (bestIdx === -1) {
                    bestIdx = pool.findIndex(c => {
                        const res = this.getFacultyForCourse(c, section, year, 1, department);
                        const faculties = res.names || [res.name];
                        return faculties.every(f => !this.facultySchedule[key].has(f)) && 
                               !this.roomSchedule[key].has(defaultRoomStr);
                    });
                }

                if (bestIdx === -1 && pool.length > 0) {
                    bestIdx = 0;
                }

                if (bestIdx !== -1) {
                    const course = pool[bestIdx];
                    const inferSem = course.semester % 2 === 0 ? 2 : 1;
                    const res = this.getFacultyForCourse(course, section, year, inferSem, department);
                    
                    this.reserve(day, slot, res.names || [res.name], defaultRoomStr, course.code, false, res.ids || [res.id]);
                    grid[key] = {
                        id: `th-${key}-${course.id}-${Math.random().toString(36).substr(2, 5)}`,
                        courseCode: course.code,
                        courseName: this.abbreviate(course.name),
                        faculty: res.name,
                        facultyId: res.id,
                        facultyIds: res.ids,
                        room: defaultRoomStr,
                        type: 'Theory'
                    };
                    pool.splice(bestIdx, 1);
                }
            });
        });
    }

    private isBlockFree(day: string, slots: string[], faculties: string[], room: string | null, grid: TimetableGrid): boolean {
        return slots.every(s => 
            grid[`${day}-${s}`] === null && 
            faculties.every(f => !this.facultySchedule[`${day}-${s}`].has(f)) && 
            (room === null || !this.roomSchedule[`${day}-${s}`].has(room))
        );
    }

    private reserve(day: string, slot: string, faculties: string[], room: string, courseCode?: string, isLab: boolean = false, facultyIds?: string[]) {
        faculties.forEach(f => {
            if (f && f !== "Staff") this.facultySchedule[`${day}-${slot}`].add(f);
        });
        if (room) this.roomSchedule[`${day}-${slot}`].add(room);
        
        // Accurate workload tracking: record every individual period assigned
        if (facultyIds && courseCode) {
            facultyIds.forEach(id => {
                facultyAllocator.recordAssignment(id, courseCode, "CurrentSession", isLab);
            });
        }
    }

    /**
     * POLICY: CRT (Campus Recruitment Training) Sessions
     * Requirements:
     * - 3rd Year (Sem 6): 1 session/week (3 continuous hours)
     * - 4th Year (Sem 7): 2 sessions/week (3 continuous hours each)
     * - Venue: Auditorium
     * - Grouping: 2 entire branches together (all sections)
     * - Faculty: Technical Trainer
     */
    private applyCRTSessions(year: number, semester: number, dept: string, section: string, grid: TimetableGrid) {
        // Sem 1 is usually Odd (1,3,5,7), Sem 2 is usually Even (2,4,6,8)
        // 3rd Year - 6th Sem: year=3, semester=2 (Even)
        // 4th Year - 7th Sem: year=4, semester=1 (Odd)
        if (!((year === 3 && semester === 2) || (year === 4 && semester === 1))) return;

        const d = dept.toUpperCase();
        
        // Grouping: Pairing branches to fill Auditorium capacity (approx 6-8 sections together)
        const groups: Record<string, string[]> = {
            'GROUP_A': ['CSE', 'CSM', 'AIML'],
            'GROUP_B': ['IT', 'ECE']
        };
        const activeGroup = Object.keys(groups).find(gn => groups[gn].includes(d)) || 'GROUP_A';

        const venue = "Main Auditorium";
        const faculty = "Technical Trainer";
        const trainerId = "trainer-tech";

        // Deterministic Schedule to prevent resource clashes across branches/years
        const crtBlocks: any = {
            3: { // 3rd Year
                2: { // Sem 6
                    'GROUP_A': [{ day: 'Saturday', isMorning: true }],
                    'GROUP_B': [{ day: 'Saturday', isMorning: false }]
                }
            },
            4: { // 4th Year
                1: { // Sem 7
                    'GROUP_A': [
                        { day: 'Friday', isMorning: true },
                        { day: 'Friday', isMorning: false }
                    ],
                    'GROUP_B': [
                        { day: 'Thursday', isMorning: true },
                        { day: 'Thursday', isMorning: false }
                    ]
                }
            }
        };

        const sessions = crtBlocks[year]?.[semester]?.[activeGroup] || [];

        sessions.forEach((session: any) => {
            const blockSlots = session.isMorning ? this.slots.slice(0, 3) : this.slots.slice(3, 6);
            
            // Check if block is actually free in the Auditorium (shared resource check)
            const isAuditoriumFree = blockSlots.every(slot => 
                !this.roomSchedule[`${session.day}-${slot}`].has(venue)
            );

            // We apply it if free OR if it's already assigned to OUR branches (joint session)
            // But since this method is called sequentially for each section, 
            // the first section will find it free, the next will find it "occupied" but it's the SAME CRT session.
            
            blockSlots.forEach(slot => {
                const key = `${session.day}-${slot}`;
                
                // Add to resource schedules (only once per slot/room combo is needed but reserve() is safe)
                this.reserve(session.day, slot, [faculty], venue);
                
                // Assign to section grid
                grid[key] = {
                    id: `crt-${key}-${dept}-${section}`,
                    courseCode: "CRT",
                    courseName: "Campus Recruitment Training",
                    faculty: faculty,
                    facultyId: trainerId,
                    room: venue,
                    type: 'Theory'
                };
            });
        });
    }

    private applyProjectBlocks(year: number, semester: number, section: string, grid: TimetableGrid) {
        if (year === 4) {
            this.days.forEach(day => {
                if (day === "Saturday") {
                    this.slots.forEach(slot => {
                        this.forceAssign(grid, `${day}-${slot}`, semester === 1 ? "4M1" : "4M2", semester === 1 ? "Project Ph-1" : "Project Ph-2", "Guide", "Project Lab", section);
                    });
                }
            });
            if (semester === 2) {
                ["Wednesday", "Thursday", "Friday"].forEach(day => {
                    ["01:20", "02:20", "03:20"].forEach(slot => {
                        this.forceAssign(grid, `${day}-${slot}`, "4M2", "Project Ph-2", "Guide", "Project Lab", section);
                    });
                });
            }
        }
    }

    private assignPolicyFields(grid: TimetableGrid, section: string) {
        // Collect all days where 03:20 slot is currently empty (not taken by 3-hour Labs)
        const emptyAfternoons = this.days.filter(day => grid[`${day}-03:20`] === null);
        
        let availableDays = [...emptyAfternoons];
        
        // Shift array based on section so A, B, C don't all go to sports on the exact same day
        const sectionOffset = section.charCodeAt(0) - 'A'.charCodeAt(0);
        for (let i = 0; i < sectionOffset; i++) {
            const first = availableDays.shift();
            if (first) availableDays.push(first);
        }

        if (availableDays.length >= 1) {
            this.forceAssign(grid, `${availableDays[0]}-03:20`, "SPORTS", "Sports", "PET", "Ground", section);
        }
        if (availableDays.length >= 2) {
            this.forceAssign(grid, `${availableDays[1]}-03:20`, "LIBRARY", "Library", "Librarian", "Central Lib", section);
        }
    }

    private forceAssign(grid: TimetableGrid, key: string, code: string, name: string, faculty: string, room: string, section: string) {
        const [day, slot] = key.split('-');
        this.reserve(day, slot, [faculty], room);
        grid[key] = { id: `force-${key}-${section}`, courseCode: code, courseName: name, faculty, room, type: 'Project' };
    }

    /**
     * Intelligently selects a free Lab Room from the provided rooms list for a specific time block.
     * Implements priority-based search: Specialized Match > Department Match > Availability.
     */
    private findAvailableLabRoom(
        dept: string, 
        courseName: string, 
        day: string, 
        slots: string[], 
        rooms: RoomData[]
    ): string | null {
        const d = dept.toUpperCase();
        const nameLower = courseName.toLowerCase();

        // Filter all compatible labs
        const labPool = rooms.filter(r => r.room_type.toLowerCase().includes("lab"));

        // 1. Specialized Match List (Free & Mapped)
        const specializedMatch = labPool.filter(r => 
            r.subjects?.some(s => nameLower.includes(s.toLowerCase().replace(" lab", "").trim())) &&
            slots.every(s => !this.roomSchedule[`${day}-${s}`].has(r.name))
        );
        if (specializedMatch.length > 0) return specializedMatch[0].name;

        // 2. Departmental Match List (Free & In-Building)
        const deptMatch = labPool.filter(r => 
            (r.dept?.toUpperCase() === d || (r.building && r.building.toLowerCase().includes(d.toLowerCase()))) &&
            slots.every(s => !this.roomSchedule[`${day}-${s}`].has(r.name))
        );
        if (deptMatch.length > 0) return deptMatch[0].name;

        // 3. Fallback: Any Free Lab
        const anyFreeLab = labPool.find(r => 
            slots.every(s => !this.roomSchedule[`${day}-${s}`].has(r.name))
        );
        
        return anyFreeLab ? anyFreeLab.name : null;
    }

    private abbreviate(name: string): string {
        const overrides: Record<string, string> = {
            "Mathematical Foundations of Computer Science": "MFCS",
            "Computer Architecture and Organization": "CAO",
            "Probability and statistics": "P&S",
            "Probability and Statistics": "P&S",
            "Semiconductor Devices and Circuits": "SDC",
            "Semiconductor Devices and Circuits Lab": "SDC Lab",
            "Python Programming": "Python",
            "Advanced English Communication Skills": "AECS",
            "Database Management Systems": "DBMS",
            "Design and Analysis of Algorithms": "DAA",
            "IT Workshop and Elements of Computer Engineering": "ITWS",
            "Information Technology Essentials": "ITE",
            "Disaster Management": "DM",
            "English for Skill Enhancement": "English",
            "Skill Development": "Skill Development"
        };
        const normalizedName = Object.keys(overrides).find(k => k.toLowerCase() === name.toLowerCase());
        if (normalizedName) return overrides[normalizedName];
        const exclude = ["and", "of", "for", "the", "in", "&"];
        const parts = name.split(" ");
        if (parts.length === 1) return name;
        return parts.filter(p => !exclude.includes(p.toLowerCase())).map(p => p[0]).join("").toUpperCase();
    }
}

export const timetableEngine = new TimetableEngine();

export const timetableGeneratorService = {
    generate: (
        year: number, 
        semester: number, 
        department: string, 
        section: string, 
        courses: CourseData[], 
        rooms: RoomData[],
        shouldReset: boolean = true,
        manualClassTeacherId?: string,
        manualYearInCharge?: string
    ): TimetableResult => {
        return timetableEngine.generate(year, semester, department, section, courses, rooms, shouldReset, manualClassTeacherId, manualYearInCharge);
    },
    reset: () => timetableEngine.resetResources()
};
