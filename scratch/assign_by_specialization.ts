import fs from 'fs';
import { MOCK_FACULTY } from "../src/data/mockFaculty";
import { FACULTY_LOAD } from "../src/data/aimlTimetable";
import { MOCK_COURSES } from "../src/data/mockCourses";

function assignProperSpecialists() {
    const codeToName: Record<string, string> = {};
    MOCK_COURSES.forEach(c => codeToName[c.code] = c.name);

    const facultyWorkload: Record<string, number> = {};
    const updatedLoad = JSON.parse(JSON.stringify(FACULTY_LOAD));

    // Initialize workload
    MOCK_FACULTY.forEach(f => facultyWorkload[f.name] = 0);

    // Categories for fuzzy matching
    const categoryKeywords: Record<string, string[]> = {
        'math': ['Mathematics', 'Matrices', 'Calculus', 'Probability', 'P&S', 'LA&ODE', 'MFCS', 'Transforms', 'SM&VC'],
        'physics': ['Physics', 'Applied Physics', 'AEP'],
        'chemistry': ['Chemistry', 'Engineering Chemistry', 'EC'],
        'english': ['English', 'ELCS', 'AECS', 'Business Economics', 'Skill'],
        'cs_core': ['Data Structures', 'C Programming', 'PPS', 'Java', 'Python', 'Programming', 'OOP'],
        'cs_adv': ['AI', 'ML', 'DL', 'Machine Learning', 'Deep Learning', 'NLP', 'Data Science', 'Data Mining', 'Big Data', 'BDA'],
        'ece_core': ['Semiconductor', 'Digital Logic', 'Electronic Devices', 'DLD', 'SDC', 'Circuits', 'ECE'],
        'it_core': ['Operating Systems', 'DBMS', 'Database', 'Computer Networks', 'CN', 'WT', 'Web Technologies', 'Software Engineering', 'SE'],
        'mgmt': ['Management', 'FOM', 'Disaster Management', 'IPR', 'Professional Ethics']
    };

    function isSpecialist(faculty: any, courseCode: string) {
        const courseName = codeToName[courseCode] || "";
        const specs = (faculty.specialization || []).map((s: string) => s.toLowerCase());
        
        // Direct match
        if (specs.some((s: string) => s.includes(courseCode.toLowerCase()) || courseName.toLowerCase().includes(s))) return true;

        // Category match
        for (const [cat, keywords] of Object.entries(categoryKeywords)) {
            const courseMatch = keywords.some(k => courseName.toLowerCase().includes(k.toLowerCase()) || courseCode.toLowerCase().includes(k.toLowerCase()));
            if (courseMatch) {
                const facultyMatch = keywords.some(k => specs.some(s => s.includes(k.toLowerCase())));
                if (facultyMatch) return true;
            }
        }
        return false;
    }

    console.log("Deep Specialization Alignment Started...");

    Object.keys(updatedLoad).forEach(section => {
        const mappings = updatedLoad[section];
        mappings.forEach((m: any) => {
            const currentFaculty = MOCK_FACULTY.find(f => f.name === m.faculty);
            
            // If current not a specialist OR redundant, reassign
            if (!currentFaculty || !isSpecialist(currentFaculty, m.code)) {
                // Find a specialist with lowest workload
                const candidates = MOCK_FACULTY.filter(f => {
                    const name = f.name.trim();
                    if (name === "Guest/Faculty" || name === "Staff") return false;
                    return isSpecialist(f, m.code);
                }).sort((a, b) => (facultyWorkload[a.name] || 0) - (facultyWorkload[b.name] || 0));

                if (candidates.length > 0) {
                    const best = candidates[0];
                    if (m.faculty !== best.name) {
                        console.log(`[ALIGNED] ${m.code} (${section}): ${m.faculty} -> ${best.name}`);
                        m.faculty = best.name;
                    }
                } else {
                    // console.warn(`[WARN] No specialist found for ${m.code} (${codeToName[m.code]})`);
                }
            }
            facultyWorkload[m.faculty] = (facultyWorkload[m.faculty] || 0) + 3;
        });
    });

    const filePath = 'src/data/aimlTimetable.ts';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const loadStr = JSON.stringify(updatedLoad, null, 4);
    const newFileContent = fileContent.replace(/export const FACULTY_LOAD = \{[\s\S]*?\};/m, `export const FACULTY_LOAD = ${loadStr};`);
    fs.writeFileSync(filePath, newFileContent);
    console.log("Institutional logic: Faculty assigned by deep specialization successfully.");
}

assignProperSpecialists();
