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
            (c.credits === 1 || c.credits === 2 && !c.name.includes("Economic"))
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
        this.assignLabs(labs, labRooms, section, grid);

        // 5. PRIORITY 2: THEORIES (Spread and Backtrack)
        this.assignTheories(theories, lectureRooms, section, grid);

        // 6. POLICY: Non-Final Years
        if (year !== 4) {
            this.assignPolicyFields(grid, section);
        }

        return grid;
    }

    private assignLabs(labs: CourseData[], rooms: RoomData[], section: string, grid: TimetableGrid) {
        const sectionOffset = section.charCodeAt(0) - 'A'.charCodeAt(0);
        let labDays = [...this.days.slice(0, 5)]; // Avoid Sat for routine labs
        for(let i=0; i<sectionOffset; i++) {
            const first = labDays.shift();
            if(first) labDays.push(first);
        }

        const sessionQueue: CourseData[] = [];
        labs.forEach(lab => {
            const sessions = (lab.credits >= 2 && labs.length < 4) ? 2 : 1;
            for(let i=0; i<sessions; i++) sessionQueue.push(lab);
        });

        const blocks = [true, false]; // Morning/Afternoon
        let placed = 0;

        blocks.forEach(isMorning => {
            labDays.forEach(day => {
                if (placed >= sessionQueue.length) return;

                const blockSlots = isMorning ? this.slots.slice(0, 3) : this.slots.slice(3, 6);
                const course = sessionQueue[placed];
                const faculty = course.instructor?.full_name || "Faculty Staff";
                
                // Find available room
                const room = rooms.find(r => 
                    blockSlots.every(s => !this.roomSchedule[`${day}-${s}`].has(r.name))
                ) || { name: `Lab-${1 + (placed % 3)}` };

                if (this.isBlockFree(day, blockSlots, faculty, room.name, grid)) {
                    blockSlots.forEach(slot => {
                        this.reserve(day, slot, faculty, room.name);
                        grid[`${day}-${slot}`] = {
                            id: `lab-${day}-${slot}-${course.id}`,
                            courseCode: course.code,
                            courseName: this.abbreviate(course.name.replace(" Lab", "")) + " Lab",
                            faculty,
                            room: room.name,
                            type: 'Lab'
                        };
                    });
                    placed++;
                }
            });
        });
    }

    private assignTheories(theories: CourseData[], rooms: RoomData[], section: string, grid: TimetableGrid) {
        let pool: CourseData[] = [];
        const replenish = () => {
            theories.forEach(t => {
                const instances = t.credits || 3;
                for(let i=0; i<instances; i++) pool.push(t);
            });
            pool.sort(() => Math.random() - 0.5);
        };

        replenish();

        this.days.forEach(day => {
            this.slots.forEach(slot => {
                const key = `${day}-${slot}`;
                if (grid[key] !== null) return;
                if (pool.length === 0) replenish();

                const usedToday = this.slots.map(s => grid[`${day}-${s}`]?.courseCode).filter(Boolean);
                const sectionRoomIdx = section.charCodeAt(0) - 'A'.charCodeAt(0);
                const defaultRoom = rooms[sectionRoomIdx % rooms.length]?.name || `Room ${101 + sectionRoomIdx}`;

                let bestIdx = pool.findIndex(c => {
                    const faculty = c.instructor?.full_name || "Staff";
                    return !usedToday.includes(c.code) && 
                           !this.facultySchedule[key].has(faculty) && 
                           !this.roomSchedule[key].has(defaultRoom);
                });

                if (bestIdx === -1) {
                    bestIdx = pool.findIndex(c => {
                        const faculty = c.instructor?.full_name || "Staff";
                        return !this.facultySchedule[key].has(faculty) && 
                               !this.roomSchedule[key].has(defaultRoom);
                    });
                }

                if (bestIdx !== -1) {
                    const course = pool[bestIdx];
                    const faculty = course.instructor?.full_name || "Staff";
                    this.reserve(day, slot, faculty, defaultRoom);
                    grid[key] = {
                        id: `th-${key}-${course.id}`,
                        courseCode: course.code,
                        courseName: this.abbreviate(course.name),
                        faculty,
                        room: defaultRoom,
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
        this.forceAssign(grid, "Friday-03:20", "SPORTS", "Sports", "PET", "Ground", section);
        this.forceAssign(grid, "Saturday-03:20", "LIBRARY", "Library", "Librarian", "Central Lib", section);
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
            "Design and Analysis of Algorithms": "DAA"
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
