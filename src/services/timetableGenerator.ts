import { FACULTY_LOAD } from "@/data/aimlTimetable";

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
    id: number;
    name: string;
    room_type: string; // "Lab" or "Lecture"
}

export interface TimetableEntry {
    id: string;
    courseCode: string;
    courseName: string;
    faculty: string;
    room: string;
    type: 'Theory' | 'Lab' | 'Project';
}

export type TimetableGrid = Record<string, TimetableEntry | null>;

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
        rooms: RoomData[]
    ): TimetableGrid {
        // Reset resource registries for each fresh generation
        this.resetResources();

        const grid: TimetableGrid = {};
        
        // 1. Initial State Maintenance
        this.days.forEach(day => this.slots.forEach(slot => grid[`${day}-${slot}`] = null));

        // 2. Data Preparation
        // Filter courses for current context
        const calcSemester = (year - 1) * 2 + semester;
        const currentCourses = rawCourses.filter(c => 
            c.department.toLowerCase() === department.toLowerCase() && 
            c.semester === calcSemester
        );

        if (currentCourses.length === 0) return grid;

        const labs = currentCourses.filter(c => 
            c.type === 'Lab' || 
            c.name.toLowerCase().includes('lab') || 
            c.name.includes("Computer Aided") || c.name.includes("CAEG")
        );
        let theories = currentCourses.filter(c => !labs.includes(c));

        // Ensure 4th year project courses are not placed into the theory pool
        // since they are automatically hard-scheduled in applyProjectBlocks.
        if (year === 4) {
            theories = theories.filter(c => !c.name.toLowerCase().includes('project'));
        }

        const labRooms = rooms.filter(r => r.room_type.toLowerCase().includes('lab'));
        const lectureRooms = rooms.filter(r => !r.room_type.toLowerCase().includes('lab'));

        // 3. HARD CONSTRAINTS: Project Phase Enforcement
        this.applyProjectBlocks(year, semester, section, grid);

        // 4. PRIORITY 1: LABS (3 Continuous Slots)
        this.assignLabs(labs, labRooms, section, year, grid);

        // 5. POLICY: Non-Final Years (Sports, Library) - Assigned before Theories so they grab the 3:20 slots
        if (year !== 4) {
            this.assignPolicyFields(grid, section);
        }

        // 6. PRIORITY 2: THEORIES (Spread and Backtrack)
        // Aggressively fills every remaining slot in the grid using the replenish pool
        this.assignTheories(theories, lectureRooms, section, year, grid);

        return grid;
    }

    private assignLabs(labs: CourseData[], rooms: RoomData[], section: string, year: number, grid: TimetableGrid) {
        const sectionOffset = section.charCodeAt(0) - 'A'.charCodeAt(0);
        let labDays = [...this.days.slice(0, 5)]; // Avoid Sat for routine labs
        for(let i=0; i<sectionOffset; i++) {
            const first = labDays.shift();
            if(first) labDays.push(first);
        }

        // Users requested CAEG and all actual Labs to strictly occur exactly once per week
        // for 3 continuous hours, so we allocate exactly 1 block of 3 slots for each item in the queue.
        const sessionQueue: CourseData[] = [...labs];

        let placed = 0;
        
        const blockPrefix = year === 1 ? 'T' : 'N';
        const floorLvl = year * 100;
        const matchingRooms = rooms.filter(r => r.name.startsWith(blockPrefix));

        let combinations: {day: string, isMorning: boolean}[] = [];
        labDays.forEach(d => {
            combinations.push({day: d, isMorning: true});
            combinations.push({day: d, isMorning: false});
        });
        
        // Randomize so labs aren't all forced into Monday-Tuesday mornings
        combinations.sort(() => Math.random() - 0.5);

        combinations.forEach(({day, isMorning}) => {
            if (placed >= sessionQueue.length) return;

                const blockSlots = isMorning ? this.slots.slice(0, 3) : this.slots.slice(3, 6);
                const course = sessionQueue[placed];
                const faculty = course.instructor?.full_name || "Faculty Staff";
                
                // Find available room
                const fallbackName = `${blockPrefix}-Lab-${1 + (placed % 3)}`;
                let room = matchingRooms.find(r => 
                    blockSlots.every(s => !this.roomSchedule[`${day}-${s}`].has(r.name))
                );
                const roomName = room ? room.name : fallbackName;

                if (this.isBlockFree(day, blockSlots, faculty, roomName, grid)) {
                    blockSlots.forEach(slot => {
                        this.reserve(day, slot, faculty, roomName);
                        const isActuallyALab = course.type === 'Lab' || course.name.toLowerCase().includes('lab');
                        const baseName = this.abbreviate(course.name.replace(" Lab", ""));
                        grid[`${day}-${slot}`] = {
                            id: `lab-${day}-${slot}-${course.id}`,
                            courseCode: course.code,
                            courseName: baseName + (isActuallyALab ? " Lab" : ""),
                            faculty,
                            room: roomName,
                            type: 'Lab'
                        };
                    });
                    placed++;
                }
        });
    }

    private assignTheories(theories: CourseData[], rooms: RoomData[], section: string, year: number, grid: TimetableGrid) {
        if (theories.length === 0) return;

        // 1. Equal distribution — every subject gets the same number of slots (round-robin)
        const emptySlots = Object.values(grid).filter(v => v === null).length;
        const slotsEach = Math.ceil(emptySlots / theories.length);

        let pool: CourseData[] = [];
        theories.forEach(t => {
            for (let i = 0; i < slotsEach; i++) pool.push(t);
        });

        // Trim any over-fill caused by ceiling rounding
        if (pool.length > emptySlots) {
            pool = pool.slice(0, emptySlots);
        }

        // Randomize the pool for natural distribution
        pool.sort(() => Math.random() - 0.5);

        const blockPrefix = year === 1 ? 'T' : 'N';
        const floorLvl = year * 100;
        const matchingRooms = rooms.filter(r => r.name.startsWith(blockPrefix));
        const sectionRoomIdx = section.charCodeAt(0) - 'A'.charCodeAt(0);
        let defaultRoomStr = `${blockPrefix}-${floorLvl + 1 + sectionRoomIdx}`;
        if (matchingRooms.length > 0) {
            defaultRoomStr = matchingRooms[sectionRoomIdx % matchingRooms.length].name;
        }

        // 2. Systematic Placement with Constraint Checking
        // We iterate through slots and days and try to pull from the pool
        this.slots.forEach(slot => {
            this.days.forEach(day => {
                const key = `${day}-${slot}`;
                if (grid[key] !== null) return;
                
                const usedToday = this.slots.map(s => grid[`${day}-${s}`]?.courseCode).filter(Boolean);

                // Try to find a subject that hasn't been used today and from a faculty that is free
                let bestIdx = pool.findIndex(c => {
                    const faculty = c.instructor?.full_name || "Staff";
                    return !usedToday.includes(c.code) && 
                           !this.facultySchedule[key].has(faculty) && 
                           !this.roomSchedule[key].has(defaultRoomStr);
                });

                // Fallback: If we must repeat a subject today to fill the slot
                if (bestIdx === -1) {
                    bestIdx = pool.findIndex(c => {
                        const faculty = c.instructor?.full_name || "Staff";
                        return !this.facultySchedule[key].has(faculty) && 
                               !this.roomSchedule[key].has(defaultRoomStr);
                    });
                }

                // Final Fallback: Grab the first available in pool even if there's a conflict (rare)
                if (bestIdx === -1 && pool.length > 0) {
                    bestIdx = 0;
                }

                if (bestIdx !== -1) {
                    const course = pool[bestIdx];
                    const faculty = course.instructor?.full_name || "Staff";
                    this.reserve(day, slot, faculty, defaultRoomStr);
                    grid[key] = {
                        id: `th-${key}-${course.id}-${Math.random().toString(36).substr(2, 5)}`,
                        courseCode: course.code,
                        courseName: this.abbreviate(course.name),
                        faculty,
                        room: defaultRoomStr,
                        type: 'Theory'
                    };
                    pool.splice(bestIdx, 1);
                }
            });
        });
    }

    private isBlockFree(day: string, slots: string[], faculty: string, room: string, grid: TimetableGrid): boolean {
        return slots.every(s => 
            grid[`${day}-${s}`] === null && 
            !this.facultySchedule[`${day}-${s}`].has(faculty) && 
            !this.roomSchedule[`${day}-${s}`].has(room)
        );
    }

    private reserve(day: string, slot: string, faculty: string, room: string) {
        if (faculty && faculty !== "Staff") this.facultySchedule[`${day}-${slot}`].add(faculty);
        if (room) this.roomSchedule[`${day}-${slot}`].add(room);
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
        this.reserve(day, slot, faculty, room);
        grid[key] = { id: `force-${key}-${section}`, courseCode: code, courseName: name, faculty, room, type: 'Project' };
    }

    private abbreviate(name: string): string {
        const overrides: Record<string, string> = {
            "Mathematical Foundations of Computer Science": "MFCS",
            "Computer Architecture and Organization": "CAO",
            "Probability and Statistics": "P&S",
            "Semiconductor Devices and Circuits": "SDC",
            "Python Programming": "Python",
            "Advanced English Communication Skills": "AECS",
            "Database Management Systems": "DBMS",
            "Design and Analysis of Algorithms": "DAA",
            "IT Workshop and Elements of Computer Engineering": "ITWS",
            "English for Skill Enhancement": "English"
        };
        if (overrides[name]) return overrides[name];
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
        rooms: RoomData[]
    ): TimetableGrid => {
        return timetableEngine.generate(year, semester, department, section, courses, rooms);
    },
    reset: () => timetableEngine.resetResources()
};
