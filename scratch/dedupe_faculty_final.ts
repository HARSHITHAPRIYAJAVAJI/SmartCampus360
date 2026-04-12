import fs from 'fs';
import { MOCK_FACULTY } from "../src/data/mockFaculty";

function getCleanedData() {
    return MOCK_FACULTY.map(f => {
        if (!f.specialization) return f;
        const seen = new Set<string>();
        const unique = f.specialization.filter(spec => {
            const normalized = spec.trim().toLowerCase();
            if (seen.has(normalized)) return false;
            seen.add(normalized);
            return true;
        });
        return { ...f, specialization: unique };
    });
}

const cleaned = getCleanedData();

const fileContent = `export interface Faculty {
  id: string;
  name: string;
  rollNumber: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  specialization?: string[];
  isNonTeaching?: boolean;
}

export const MOCK_FACULTY: Faculty[] = ${JSON.stringify(cleaned, null, 2)};
`;

fs.writeFileSync('src/data/mockFaculty.ts', fileContent);
console.log("Successfully deduped all faculty specializations.");
