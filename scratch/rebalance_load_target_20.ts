import fs from 'fs';
import { MOCK_FACULTY } from "../src/data/mockFaculty";
import { FACULTY_LOAD } from "../src/data/aimlTimetable";

const TARGET_LOAD = 21; // ~7 subjects

function balanceFacultyLoad() {
    const facultyWorkload: Record<string, number> = {};
    const facultyAssignments: Record<string, any[]> = {};

    Object.entries(FACULTY_LOAD).forEach(([section, mappings]) => {
        mappings.forEach((m: any) => {
            const name = m.faculty.trim();
            if (!name || name === "Guest/Faculty" || name === "Staff") return;
            const loadVal = 3;
            facultyWorkload[name] = (facultyWorkload[name] || 0) + loadVal;
            if (!facultyAssignments[name]) facultyAssignments[name] = [];
            facultyAssignments[name].push({ section, mapping: m });
        });
    });

    console.log("Processing Rebalancing...");

    const updatedLoad = JSON.parse(JSON.stringify(FACULTY_LOAD));

    // Sort by heaviest load first
    const roster = Object.entries(facultyWorkload)
        .filter(([name, load]) => load > TARGET_LOAD)
        .sort((a, b) => b[1] - a[1]);

    for (const [name, load] of roster) {
        let currentLoad = load;
        const assignments = facultyAssignments[name];

        for (const assignment of assignments) {
            if (currentLoad <= TARGET_LOAD) break;

            const code = assignment.mapping.code;
            const section = assignment.section;

            // Find ANY faculty who is underloaded and has SOME matching specialization
            // or if they are in the same department
            const replacement = MOCK_FACULTY.find(f => {
                const fName = f.name.trim();
                const fLoad = facultyWorkload[fName] || 0;
                if (fLoad >= TARGET_LOAD) return false;
                if (fName === name) return false;

                // Priority 1: Specialization match
                const hasSpec = f.specialization?.some(s => {
                    const normS = s.toLowerCase();
                    const normCode = code.toLowerCase();
                    return normS.includes(normCode) || normCode.includes(normS) || 
                           (normCode.startsWith('4B') && normS.includes('math')) ||
                           (normCode.startsWith('4H') && (normS.includes('english') || normS.includes('aecs') || normS.includes('elcs')));
                });
                
                return hasSpec;
            });

            if (replacement) {
                console.log(`[OK] Reassigning ${code} (${section}) from ${name} to ${replacement.name}`);
                const sectionMappings = updatedLoad[section];
                const index = sectionMappings.findIndex((m: any) => m.code === code && m.faculty === name);
                if (index !== -1) {
                    sectionMappings[index].faculty = replacement.name;
                    currentLoad -= 3;
                    facultyWorkload[replacement.name] = (facultyWorkload[replacement.name] || 0) + 3;
                }
            }
        }
    }

    const filePath = 'src/data/aimlTimetable.ts';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const loadStr = JSON.stringify(updatedLoad, null, 4);
    const newFileContent = fileContent.replace(/export const FACULTY_LOAD = \{[\s\S]*?\};/m, `export const FACULTY_LOAD = ${loadStr};`);
    fs.writeFileSync(filePath, newFileContent);
    console.log("Equitable load distribution complete.");
}

balanceFacultyLoad();
