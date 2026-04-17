/**
 * Faculty Allocator Service
 * ========================
 * Production-grade, specialization-aware faculty allocation engine.
 *
 * Handles TWO formats for specialization strings in mockFaculty.ts:
 *  1. Short abbreviations:  "ML", "DS", "AI", "DBMS", "PP Lab", "DL Lab", etc.
 *  2. Full course names:    "Machine Learning", "Quantum Computing", etc.
 *
 * The ABBR_TO_COURSE_KEYWORDS table maps EVERY abbreviation the faculty file
 * uses to the keywords that appear in Course.name from mockCourses.ts.
 * Matching is case-insensitive substring search on course names.
 *
 * KEY DESIGN:
 * - resolveOnly()  → picks the best faculty WITHOUT recording workload (for speculative probing)
 * - allocate()     → picks AND records workload (call ONCE per course per section)
 * The TimetableEngine pre-allocates faculty for all courses before slot-filling begins,
 * so each course gets exactly one faculty per section and workload is tracked accurately.
 */

import { MOCK_FACULTY, Faculty } from "@/data/mockFaculty";
import { MOCK_COURSES } from "@/data/mockCourses";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkloadRecord {
    facultyId: string;
    facultyName: string;
    department: string;
    designation: string;
    theoryHours: number;
    labHours: number;
    totalHours: number;
    subjects: string[];
    sectionsAssigned: string[];
    theories: string[];
    labs: string[];
}

export interface AllocationResult {
    name: string;
    id: string;
    names?: string[];
    ids?: string[];
}

// ─── Comprehensive Abbreviation → Course Name Keyword Map ─────────────────────
//
// Key   : exact string (case-insensitive) that appears in mockFaculty.specialization[]
// Value : array of keywords — course.name must CONTAIN at least one of them (case-insensitive)

const ABBR_TO_KEYWORDS: Record<string, string[]> = {
    // ── CSM abbreviations ─────────────────────────────────────────────────────
    "ds":           ["data structures"],
    "ds lab":       ["data structures lab"],
    "ml":           ["machine learning"],
    "ml lab":       ["machine learning lab"],
    "dl":           ["deep learning"],
    "dl lab":       ["deep learning lab"],
    "ai":           ["artificial intelligence"],
    "nlp":          ["natural language processing"],
    "nlp lab":      ["natural language processing lab"],
    "os":           ["operating systems"],
    "dbms":         ["database management systems"],
    "dbms lab":     ["database management systems lab"],
    "cn":           ["computer networks"],
    "iot":          ["internet of things", "fundamentals of iot"],
    "iot lab":      ["internet of things lab"],
    "se":           ["software engineering"],
    "se lab":       ["software engineering lab"],
    "daa":          ["design and analysis of algorithms"],
    "wt":           ["web technologies"],
    "wt lab":       ["web technologies lab"],
    "java":         ["object oriented programming through java"],
    "java lab":     ["object oriented programming through java lab"],
    "oops":         ["object oriented programming", "java"],
    "ooad":         ["object oriented analysis"],
    "devops":       ["devops"],
    "mfcs":         ["mathematical foundations of computer science"],
    "cao":          ["computer architecture and organization"],
    "pp":           ["python programming"],
    "pp lab":       ["python programming lab"],
    "cpps":         ["c programming for problem solving", "programming for problem solving"],
    "cpps lab":     ["c programming for problem solving lab"],
    "pps":          ["c programming for problem solving", "programming for problem solving"],
    "pps lab":      ["c programming for problem solving lab"],
    "is":           ["information security"],
    "cns":          ["cryptography and network security", "network security"],
    "ns":           ["network security"],
    "krr":          ["knowledge representation and reasoning"],
    "bda":          ["big data analytics"],
    "bda lab":      ["big data analytics lab"],
    "rl":           ["reinforcement learning"],
    "rpa":          ["robotic process automation"],
    "es":           ["expert systems"],
    "sdc":          ["semiconductor devices and circuits"],
    "sdc lab":      ["semiconductor devices and circuits lab"],
    "p&s":          ["probability and statistics"],
    "sm&vc":        ["statistical methods and vector calculus"],
    "la&ode":       ["linear algebra and ordinary differential equations"],
    "atcd":         ["automata theory and compiler design"],
    "flat":         ["formal languages and automata theory"],
    "dm":           ["data warehousing and data mining", "data mining"],
    "dwdm":         ["data warehousing and data mining"],
    "fds":          ["fundamentals of data science"],
    "qc":           ["quantum computing"],
    "elcs lab":     ["english language and communication skills lab"],
    "pes lab":      ["english for skill enhancement"],
    "itws lab":     ["it workshop"],
    "itws":         ["it workshop"],
    "aecs lab":     ["advanced english communication skills lab"],
    "cc":           ["cloud computing"],
    "db":           ["database management systems"],
    "bd":           ["blockchain"],
    "sp":           ["signals"],
    "oe":           ["open elective", "fundamentals of management"],
    "cs":           ["soft computing"],
    "ip":           ["image processing", "digital image processing"],
    "cv":           ["computer vision"],
    "net":          ["computer networks"],
    "c":            ["c programming for problem solving"],
    "ioe":          ["fundamentals of iot", "internet of things"],
    "python":       ["python programming"],
    "disaster management":  ["disaster management"],
    "skill development":     ["skill development"],
    "skill development lab": ["skill development lab", "skill development"],

    // ── IT full/partial names ─────────────────────────────────────────────────
    "computer architecture":        ["computer architecture", "computer organization"],
    "wireless sensor networks":     ["computer networks", "data communications"],
    "data mining":                  ["data warehousing and data mining", "data mining"],
    "internet of things":           ["internet of things", "fundamentals of iot"],
    "machine learning":             ["machine learning"],
    "cryptography":                 ["cryptography and network security"],
    "computer networks":            ["computer networks"],
    "data science":                 ["fundamentals of data science", "data warehousing"],
    "quantum computing":            ["quantum computing"],
    "blockchain technology":        ["blockchain"],
    "deep learning":                ["deep learning"],
    "natural language processing":  ["natural language processing"],
    "artificial intelligence":      ["artificial intelligence"],
    "soft computing":               ["soft computing"],
    "ads":                          ["advanced data structures"],
    "ads lab":                      ["advanced data structures lab"],

    // ── ECE abbreviations ─────────────────────────────────────────────────────
    "ep":       ["engineering physics", "applied physics", "physics", "advanced engineering physics", "aep"],
    "aep":      ["applied physics", "advanced engineering physics", "physics"],
    "ec":       ["engineering chemistry", "chemistry"],
    "ec lab":   ["engineering chemistry lab", "chemistry lab"],
    "fee":      ["fundamentals of electrical engineering", "basic electrical engineering", "bee"],
    "bee":      ["basic electrical engineering", "fundamentals of electrical engineering", "fee"],
    "bee lab":  ["basic electrical and simulation lab"],
    "mt":       ["mathematical transforms", "math", "matrices", "calculus"],
    "dld":      ["digital logic design"],
    "nt":       ["network theory"],
    "eca":      ["electronic circuit analysis"],
    "caeg":     ["computer aided engineering graphics", "engineering drawing", "edcad"],
    "edcad":    ["computer aided engineering graphics", "engineering drawing"],
    "fom":      ["fundamentals of management", "management", "open elective"],
    "mc":       ["intellectual property rights", "constitution of india"],
    "ite":      ["information technology essentials"],
    "ss":       ["signals and systems"],
    "adc":      ["analog and digital communications"],
    "ptsp":     ["probability theory and stochastic processes"],
    "pdc":      ["pulse and digital circuits"],
    "emtl":     ["electromagnetic theory and transmission lines"],
    "ldica":    ["linear and digital ic applications"],
    "mpmc":     ["microprocessors and microcontrollers"],
    "dip":      ["digital image processing"],
    "awp":      ["antennas and wave propagation"],
    "dsp":      ["digital signal processing"],
    "dsp&a":    ["dsp & architecture"],
    "vlsi":     ["vlsi design"],
    "mwe":      ["microwave engineering"],
    "pe":       ["professional ethics"],
    "esd":      ["embedded system design", "embedded systems design"],
    "sc":       ["control systems"],
    "ofc":      ["optical fiber communications"],
    "cavc":     ["analog and digital communications", "vlsi"],
    "sdclab":   ["semiconductor devices and circuits lab"],

    // ── Shared/Other ──────────────────────────────────────────────────────────
    "english":             ["english for skill enhancement", "english language and communication skills"],
    "apps dev":            ["full stack development", "web technologies"],
    "web application":     ["web technologies", "full stack development"],
    "networking":          ["computer networks"],
    "networks":            ["computer networks"],
    "it workshop":         ["it workshop"],
    "application development":  ["full stack development", "web technologies"],
    "computer aided engineering graphics": ["computer aided engineering graphics"],
    "operating systems (os)":  ["operating systems"],
    "cloud computing":          ["cloud computing"],
};

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_LOAD_HOURS = 22.5; // Strictly avoid exceeding 22-23 hours
const TARGET_MIN_LOAD = 19; // All faculty MUST reach at least 19 hours

// ─── Core Allocator ───────────────────────────────────────────────────────────

export class FacultyAllocator {
    private workload: Record<string, WorkloadRecord> = {};

    // Built once at construction: courseCode → Faculty[] (ordered: same-dept first)
    private subjectFacultyIndex: Record<string, Faculty[]> = {};

    // Persistent cross-section tracking: courseCode → { sectionKey → facultyName }
    // Used by allocate() to enforce diversity across sections
    private courseSectionAssignments: Record<string, Record<string, string>> = {};

    constructor() {
        this.resetWorkload();
        this.buildIndex();
    }

    // ── Index Builder ─────────────────────────────────────────────────────────

    private buildIndex() {
        this.subjectFacultyIndex = {};

        MOCK_COURSES.forEach(course => {
            const courseNameLower = course.name.toLowerCase();
            const codeKey = course.code;
            if (!this.subjectFacultyIndex[codeKey]) this.subjectFacultyIndex[codeKey] = [];

            MOCK_FACULTY.forEach(f => {
                // Exclude Non-teaching staff (HODs etc) from active scheduling
                if (f.isNonTeaching === true) return;
                if (!f.specialization || f.specialization.length === 0) return;
                if (this.subjectFacultyIndex[codeKey].find(x => x.id === f.id)) return;

                const matches = f.specialization.some(spec => {
                    const specLower = spec.trim().toLowerCase();
                    
                    // 1. Exact match with the full specialization tag
                    if (courseNameLower.includes(specLower)) return true;

                    // 2. Handle labels like "Machine Learning (ML)" by extracting tokens
                    const cleanSpec = specLower.replace(/\(.*\)/, "").trim();
                    const innerAbbr = specLower.match(/\((.*?)\)/)?.[1]?.trim();

                    if (cleanSpec && cleanSpec.length >= 3 && courseNameLower.includes(cleanSpec)) return true;
                    if (innerAbbr && courseNameLower.includes(innerAbbr)) {
                         // Check if the inner abbr actually maps to this course via our table
                         const keywordsIfAbbr = ABBR_TO_KEYWORDS[innerAbbr];
                         if (keywordsIfAbbr?.some(kw => courseNameLower.includes(kw.toLowerCase()))) return true;
                    }

                    // 3. Abbreviation table lookup (on the raw spec and clean spec)
                    const keywords = ABBR_TO_KEYWORDS[specLower] || ABBR_TO_KEYWORDS[cleanSpec] || (innerAbbr ? ABBR_TO_KEYWORDS[innerAbbr] : null);
                    if (keywords) {
                        return keywords.some(kw => courseNameLower.includes(kw.toLowerCase()));
                    }

                    return false;
                });

                if (matches) this.subjectFacultyIndex[codeKey].push(f);
            });
        });
    }

    // ── Workload Management ───────────────────────────────────────────────────

    /**
     * Full reset — call before each batch generation run.
     * Clears workload, cross-section assignments, and re-initializes all faculty.
     */
    public resetWorkload() {
        this.workload = {};
        this.courseSectionAssignments = {};

        MOCK_FACULTY.forEach(f => {
            this.workload[f.id] = {
                facultyId: f.id,
                facultyName: f.name,
                department: f.department,
                designation: f.designation,
                theoryHours: 0,
                labHours: 0,
                totalHours: 0,
                subjects: [],
                sectionsAssigned: [],
                theories: [],
                labs: []
            };
        });
    }

    public recordAssignment(facultyId: string, courseCode: string, sectionKey: string, isLab: boolean) {
        if (!this.workload[facultyId]) {
            const f = MOCK_FACULTY.find(x => x.id === facultyId);
            if (!f) return;
            this.workload[facultyId] = {
                facultyId: f.id,
                facultyName: f.name,
                department: f.department,
                designation: f.designation,
                theoryHours: 0,
                labHours: 0,
                totalHours: 0,
                subjects: [],
                sectionsAssigned: [],
                theories: [],
                labs: []
            };
        }
        const r = this.workload[facultyId];
        r.totalHours += 1;
        if (isLab) {
            r.labHours += 1;
            if (!r.labs.includes(courseCode)) r.labs.push(courseCode);
        } else {
            r.theoryHours += 1;
            if (!r.theories.includes(courseCode)) r.theories.push(courseCode);
        }
        if (!r.subjects.includes(courseCode)) r.subjects.push(courseCode);
        if (!r.sectionsAssigned.includes(sectionKey)) r.sectionsAssigned.push(sectionKey);
    }

    public getWorkloadSummary(): Record<string, WorkloadRecord> {
        return { ...this.workload };
    }

    // ── Eligible Faculty ──────────────────────────────────────────────────────

    public getEligibleFaculty(
        courseCode: string,
        courseName: string,
        dept: string,
        instructorName?: string,
        instructorId?: string
    ): Faculty[] {
        const deptUpper = dept.toUpperCase();
        const matched = this.subjectFacultyIndex[courseCode] || [];

        const sameDept = matched.filter(f => f.department.toUpperCase() === deptUpper);
        const crossDept = matched.filter(f => f.department.toUpperCase() !== deptUpper);

        const result: Faculty[] = [];
        const seen = new Set<string>();
        const addUniq = (list: Faculty[]) => list.forEach(f => {
            if (!seen.has(f.id)) { seen.add(f.id); result.push(f); }
        });

        // 1. Specialists from the same department
        addUniq(sameDept);
        // 2. Specialists from other departments
        addUniq(crossDept);

        // 3. Fallback: If no specialist found, try specified instructor by name
        if (result.length === 0 && instructorName) {
            const byName = MOCK_FACULTY.find(f =>
                f.name.toLowerCase().trim() === instructorName.toLowerCase().trim()
            );
            if (byName && !seen.has(byName.id)) result.push(byName);
        }

        // 4. Emergency Fallback: Any department faculty who are NOT already overloaded
        // This ensures the 23-24 hour balance by only considering available capacity
        if (result.length === 0) {
            const cappedDeptFaculty = MOCK_FACULTY
                .filter(f => {
                    const load = this.workload[f.id]?.totalHours || 0;
                    return f.department.toUpperCase() === deptUpper && load < MAX_LOAD_HOURS;
                })
                .sort((a, b) => (this.workload[a.id]?.totalHours || 0) - (this.workload[b.id]?.totalHours || 0));
            
            addUniq(cappedDeptFaculty);
        }

        // 5. GLOBAL EQUALIZATION: If still no candidates, pick ANY teaching faculty with load < 19
        // This ensures under-utilized faculty are "forced" into the pool for any available subject
        if (result.length === 0) {
            const underUtilized = MOCK_FACULTY
                .filter(f => {
                    const load = this.workload[f.id]?.totalHours || 0;
                    return f.isNonTeaching !== true && load < 19;
                })
                .sort((a, b) => (this.workload[a.id]?.totalHours || 0) - (this.workload[b.id]?.totalHours || 0));
            
            addUniq(underUtilized);
        }

        return result;
    }

    // ── Core Selection Algorithm ──────────────────────────────────────────────

    /**
     * Picks the best faculty for a course+section respecting:
     * 1. Specialization (via getEligibleFaculty)
     * 2. Section diversity — faculty already used for THIS course in OTHER sections are deprioritized
     * 3. Workload balance — sorted ascending by totalHours so least-loaded comes first
     *
     * @param record - if true, records the assignment (call once per course per section)
     *                 if false, only resolves (for speculative/probe calls)
     */
    private pick(
        courseCode: string,
        courseName: string,
        dept: string,
        sectionKey: string,
        isLab: boolean,
        record: boolean = false,
        instructorName?: string,
        instructorId?: string
    ): AllocationResult {
        const eligible = this.getEligibleFaculty(courseCode, courseName, dept, instructorName, instructorId);

        if (eligible.length === 0) {
            return { name: instructorName || "Staff", id: instructorId || "", names: [instructorName || "Staff"], ids: [instructorId || ""] };
        }

        // --- FAIRNESS SCORING ---
        const scored = eligible.map(f => {
            const currentLoad = this.workload[f.id]?.totalHours || 0;
            const otherSections = Object.values(this.courseSectionAssignments[courseCode] || {});
            const alreadyAssignedThisSubject = otherSections.includes(f.name);
            
            let score = 0;
            const remainsBuffer = MAX_LOAD_HOURS - currentLoad;
            
            // Priority 1: Reach the standard load of 19-22 hrs
            // Drastically boost those who are way behind
            if (currentLoad < 15) score += 10000; 
            if (currentLoad < TARGET_MIN_LOAD) score += 5000; 
            
            // Priority 2: Harshly penalize those nearing upper limit
            score += remainsBuffer * 100;
            if (currentLoad >= 20.5) score -= 2000; // Early warning zone
            if (currentLoad >= 21.5) score -= 6000; // Danger zone
            if (currentLoad >= MAX_LOAD_HOURS) score -= 20000; // Strict Hard cap
            
            const isSpecialist = (this.subjectFacultyIndex[courseCode] || []).some(x => x.id === f.id);
            if (isSpecialist) score += 300; 
            if (f.department.toUpperCase() === dept.toUpperCase()) score += 100;
            
            // Diversity constraint: Try to avoid assigning many sections of the same course to one person
            if (alreadyAssignedThisSubject) score -= 1000; 

            return { faculty: f, score };
        });

        const sorted = scored.sort((a, b) => b.score - a.score);
        const top = sorted[0].faculty;
        
        // --- Dual Faculty for Labs ---
        if (isLab && sorted.length >= 2) {
            const runnerUp = sorted[1].faculty;
            const combinedName = `${top.name} & ${runnerUp.name}`;
            
            if (record) {
                if (!this.courseSectionAssignments[courseCode]) this.courseSectionAssignments[courseCode] = {};
                this.courseSectionAssignments[courseCode][sectionKey] = combinedName;
            }
            
            return { 
                name: combinedName, 
                id: top.id, // Primary ID
                names: [top.name, runnerUp.name],
                ids: [top.id, runnerUp.id]
            };
        }

        if (record) {
            // Persist cross-section assignment for future diversity checks
            if (!this.courseSectionAssignments[courseCode]) {
                this.courseSectionAssignments[courseCode] = {};
            }
            this.courseSectionAssignments[courseCode][sectionKey] = top.name;
        }

        return { name: top.name, id: top.id };
    }

    /**
     * ALLOCATE — picks faculty AND records workload + cross-section assignment.
     * Call exactly ONCE per course per section (during pre-allocation phase).
     */
    public allocate(
        courseCode: string,
        courseName: string,
        dept: string,
        section: string,
        isLab: boolean,
        sectionKey: string,
        _otherSectionFaculty: string[] = [],   // kept for API compatibility, now unused
        instructorName?: string,
        instructorId?: string
    ): AllocationResult {
        return this.pick(courseCode, courseName, dept, sectionKey, isLab, true, instructorName, instructorId);
    }

    /**
     * RESOLVE ONLY — picks faculty WITHOUT recording workload.
     * Safe to call repeatedly during slot-filling checks (no side effects).
     */
    public resolveOnly(
        courseCode: string,
        courseName: string,
        dept: string,
        sectionKey: string,
        isLab: boolean,
        instructorName?: string,
        instructorId?: string
    ): AllocationResult {
        return this.pick(courseCode, courseName, dept, sectionKey, isLab, false, instructorName, instructorId);
    }

    public getCourseSectionAssignments() {
        return this.courseSectionAssignments;
    }
}

// Singleton instance — shared across the app
export const facultyAllocator = new FacultyAllocator();
