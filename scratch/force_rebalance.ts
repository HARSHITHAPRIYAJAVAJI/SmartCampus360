import fs from 'fs';
import { FACULTY_LOAD } from "../src/data/aimlTimetable";

function forceBalance() {
    const updated = JSON.parse(JSON.stringify(FACULTY_LOAD));
    
    // Targeted reassignments for heavily overloaded faculty
    // B. Gnanesh Netha (English/Humanities) -> Mrs. V. Ramani, Mr. M. A. Raghu
    // Sudha Menon (FDS/English) -> Mrs. V. Ramani, Mr. M. A. Raghu
    // Mrs. S. Swathi (CN/Networks) -> Mrs. A. Srujana
    
    let nethaCount = 0;
    let sudhaCount = 0;
    let swathiCount = 0;

    Object.entries(updated).forEach(([section, mappings]: [string, any]) => {
        mappings.forEach((m: any) => {
            // Netha rebalance
            if (m.faculty === "B. Gnanesh Netha" && nethaCount > 6) { // Keep first 20 hrs approx
               m.faculty = (nethaCount % 2 === 0) ? "Mrs. V. Ramani" : "Mr. M. A. Raghu";
            }
            if (m.faculty === "B. Gnanesh Netha") nethaCount++;

            // Sudha rebalance
            if (m.faculty === "Sudha Menon" && sudhaCount > 6) {
               m.faculty = (sudhaCount % 2 === 0) ? "Mrs. V. Ramani" : "Mr. M. A. Raghu";
            }
            if (m.faculty === "Sudha Menon") sudhaCount++;

            // Swathi rebalance
            if (m.faculty === "Mrs. S. Swathi" && swathiCount > 6) {
               m.faculty = "Mrs. A. Srujana";
            }
            if (m.faculty === "Mrs. S. Swathi") swathiCount++;
            
            // D. Mounika rebalance
            if (m.faculty === "Mrs. D. Mounika" && section.includes('CSE')) {
               m.faculty = "Mrs. N. Kiranmai";
            }
        });
    });

    const filePath = 'src/data/aimlTimetable.ts';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const loadStr = JSON.stringify(updated, null, 4);
    const newFileContent = fileContent.replace(/export const FACULTY_LOAD = \{[\s\S]*?\};/m, `export const FACULTY_LOAD = ${loadStr};`);
    fs.writeFileSync(filePath, newFileContent);
    console.log("Force balancing of top 5 overloaded faculty completed.");
}

forceBalance();
