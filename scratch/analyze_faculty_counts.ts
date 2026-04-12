import { MOCK_FACULTY } from "../src/data/mockFaculty";
import { MOCK_COURSES } from "../src/data/mockCourses";

const ABBR_TO_KEYWORDS: Record<string, string[]> = {
    // IT/CS
    "cp":       ["computer programming", "c-programming", "cpps", "python", "c programming", "programming for problem solving"],
    "cpps":     ["computer programming", "c-programming", "c programming", "programming for problem solving"],
    "java":     ["java programming", "object oriented programming through java"],
    "ds":       ["data structures"],
    "dbms":     ["database management systems"],
    "os":       ["operating systems"],
    "cn":       ["computer networks", "data communications and computer networks"],
    "ml":       ["machine learning"],
    "ai":       ["artificial intelligence"],
    "wt":       ["web technologies"],
    "cd":       ["compiler design"],
    "daa":      ["design and analysis of algorithms"],
    "se":       ["software engineering"],
    "itws":     ["it workshop"],
    "flat":     ["formal languages and automata theory"],
    "atcd":     ["automata theory and compiler design"],
    "dwdm":     ["data warehousing and data mining"],
    "fds":      ["fundamentals of data science"],
    "bda":      ["big data analytics"],

    // ECE
    "ap":       ["applied physics", "engineering physics", "physics"],
    "ep":       ["applied physics", "engineering physics", "physics"],
    "physics":  ["applied physics", "engineering physics", "physics"],
    "ec":       ["engineering chemistry", "chemistry"],
    "bee":      ["basic electrical engineering", "fundamentals of electrical engineering", "fee"],
    "fee":      ["basic electrical engineering", "fundamentals of electrical engineering", "fee"],
    "dld":      ["digital logic design", "switching theory"],
    "nt":       ["network theory"],
    "eca":      ["electronic circuit analysis"],
    "ss":       ["signals and systems"],
    "sm&vc":    ["statistical methods and vector calculus"],
    "la&ode":   ["linear algebra and ordinary differential equations"],
    "mt":       ["mathematical transforms"],
    "cao":      ["computer architecture and organization", "computer organization and architecture"],
    "mpmc":     ["microprocessors and microcontrollers"],
    "dip":      ["digital image processing"],
    "dsp":      ["digital signal processing"],
    "vlsi":     ["vlsi design"],
    "mwe":      ["microwave engineering"],
    "esd":      ["embedded system design", "embedded systems design"],
    "pdc":      ["pulse and digital circuits"],
    "ldica":    ["linear and digital ic applications"],
};

function getEligibleFaculty(courseName: string): string[] {
    const courseLower = courseName.toLowerCase();
    const eligibleFac = MOCK_FACULTY.filter(f => {
        if (f.isNonTeaching) return false;
        if (!f.specialization) return false;
        
        return f.specialization.some(spec => {
            const specLower = spec.trim().toLowerCase();
            // Direct Match
            if (courseLower === specLower) return true;
            if (specLower.length >= 4 && courseLower.includes(specLower)) return true;
            
            // Abbreviation Match
            const keywords = ABBR_TO_KEYWORDS[specLower];
            if (keywords) {
                return keywords.some(kw => courseLower.includes(kw.toLowerCase()));
            }
            return false;
        });
    });
    return eligibleFac.map(f => f.name);
}

const uniqueSubjects = Array.from(new Set(MOCK_COURSES.map(c => c.name)));
uniqueSubjects.sort();

console.log("# Institutional Capacity Audit #\n");
console.log("| Subject / Lab | Faculty Pool Size | Primary Dept | Examples |");
console.log("| :--- | :--- | :--- | :--- |");

uniqueSubjects.forEach(sub => {
    const eligible = getEligibleFaculty(sub);
    const primaryDept = MOCK_COURSES.find(c => c.name === sub)?.department || "GEN";
    const examples = eligible.slice(0, 3).join(", ");
    console.log(`| ${sub} | ${eligible.length} | ${primaryDept} | ${examples}${eligible.length > 3 ? "..." : ""} |`);
});
