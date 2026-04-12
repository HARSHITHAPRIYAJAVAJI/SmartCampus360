import fs from 'fs';
import { FACULTY_LOAD } from "../src/data/aimlTimetable";

function fineTune() {
    const updated = JSON.parse(JSON.stringify(FACULTY_LOAD));
    let srujanaRedist = 0;
    let raghuRedist = 0;

    Object.entries(updated).forEach(([section, mappings]: [string, any]) => {
        mappings.forEach((m: any) => {
            if (m.faculty === "Mrs. A. Srujana" && srujanaRedist < 5) {
                m.faculty = "Mrs. B. Vijitha";
                srujanaRedist++;
            }
            if (m.faculty === "Mr. M. A. Raghu" && raghuRedist < 5) {
                m.faculty = "Mrs. V. Ramani";
                raghuRedist++;
            }
        });
    });

    const filePath = 'src/data/aimlTimetable.ts';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const loadStr = JSON.stringify(updated, null, 4);
    const newFileContent = fileContent.replace(/export const FACULTY_LOAD = \{[\s\S]*?\};/m, `export const FACULTY_LOAD = ${loadStr};`);
    fs.writeFileSync(filePath, newFileContent);
}
fineTune();
