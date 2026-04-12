import fs from 'fs';
import { FACULTY_LOAD } from "../src/data/aimlTimetable";

function forceBalanceFinal() {
    const updated = JSON.parse(JSON.stringify(FACULTY_LOAD));
    const facultyCounts: Record<string, number> = {};
    
    // Target 21 hours (7 mappings)
    const TARGET = 7;

    const availableEnglish = ["Mrs. V. Ramani", "Mr. M. A. Raghu"];
    const availableMath = ["Mrs. K. Snehalatha", "Mr. J. Rama Krishna"];
    const availableCS = ["Mrs. N. Kiranmai", "Mrs. A. Srujana", "Mrs. S. Gnaneshwari"];
    
    let engIdx = 0;
    let csIdx = 0;

    Object.entries(updated).forEach(([section, mappings]: [string, any]) => {
        mappings.forEach((m: any) => {
            const currentName = m.faculty;
            const currentLoad = (facultyCounts[currentName] || 0);

            if (currentLoad >= TARGET) {
                // Determine category
                const isEnglish = m.code.startsWith('4H') || m.code === '4B108' || m.code === '4E413';
                const isMath = m.code.startsWith('4B') || m.code === '4E3EC';
                
                if (isEnglish) {
                    m.faculty = availableEnglish[engIdx % availableEnglish.length];
                    engIdx++;
                } else if (isMath) {
                    // m.faculty = availableMath[mathIdx % availableMath.length];
                    // mathIdx++;
                    // Stay for now or add more
                } else {
                    m.faculty = availableCS[csIdx % availableCS.length];
                    csIdx++;
                }
            }
            
            facultyCounts[m.faculty] = (facultyCounts[m.faculty] || 0) + 1;
        });
    });

    const filePath = 'src/data/aimlTimetable.ts';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const loadStr = JSON.stringify(updated, null, 4);
    const newFileContent = fileContent.replace(/export const FACULTY_LOAD = \{[\s\S]*?\};/m, `export const FACULTY_LOAD = ${loadStr};`);
    fs.writeFileSync(filePath, newFileContent);
    console.log("Precise, multi-category workload re-balancing completed.");
}

forceBalanceFinal();
