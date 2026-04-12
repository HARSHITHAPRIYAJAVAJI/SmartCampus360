import { MOCK_FACULTY, Faculty } from "../src/data/mockFaculty";
import { MOCK_COURSES, Course } from "../src/data/mockCourses";

const ABBR_MAP: Record<string, string[]> = {
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
    "wt":           ["web technologies"],
    "wt lab":       ["web technologies lab"],
    "java":         ["object oriented programming through java"],
    "java lab":     ["object oriented programming through java lab"],
    "pp":           ["python programming"],
    "pp lab":       ["python programming lab"],
    "cpps":         ["c programming for problem solving"],
    "caeg":         ["computer aided engineering graphics"],
    "sdc":          ["semiconductor devices and circuits"],
    "dld":          ["digital logic design"],
    "eca":          ["electronic circuit analysis"],
    "nt":           ["network theory"],
    "vlsi":         ["vlsi design"],
    "disaster management": ["disaster management"]
};

function analyzeCoverage() {
    const uniqueCourses = [...new Set(MOCK_COURSES.map((c: Course) => c.name))];
    const report: any[] = [];

    uniqueCourses.forEach((cName: string) => {
        const cNameLower = cName.toLowerCase();
        const matches = MOCK_FACULTY.filter((f: Faculty) => {
            if (!f.specialization) return false;
            return f.specialization.some((spec: string) => {
                const sLower = spec.trim().toLowerCase();
                if (cNameLower === sLower) return true;
                if (sLower.length >= 4 && cNameLower.includes(sLower)) return true;
                const kw = ABBR_MAP[sLower];
                if (kw) return kw.some(k => cNameLower.includes(k.toLowerCase()));
                return false;
            });
        });

        const dist = matches.reduce((acc: any, f: Faculty) => {
            acc[f.department] = (acc[f.department] || 0) + 1;
            return acc;
        }, {});

        report.push({ name: cName, total: matches.length, dist });
    });

    // Formatting for display
    report.sort((a, b) => a.total - b.total);
    console.log("--- FINAL FACULTY COVERAGE REPORT ---");
    report.forEach(r => {
        const distStr = Object.entries(r.dist).map(([dept, count]) => `${dept}: ${count}`).join(", ");
        console.log(`${r.name}\n-> Total: ${r.total} Faculty\n-> ${distStr || "NONE"}`);
    });
}

analyzeCoverage();
