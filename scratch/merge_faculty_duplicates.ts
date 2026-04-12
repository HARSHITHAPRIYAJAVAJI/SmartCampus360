import fs from 'fs';
import { MOCK_FACULTY } from "../src/data/mockFaculty";

function mergeFacultyDuplicates() {
    const nameMap = new Map<string, any[]>();
    
    // Group by base name (removing Dr. Mr. Ms. etc for matching)
    MOCK_FACULTY.forEach(f => {
        const baseName = f.name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
        if (!nameMap.has(baseName)) nameMap.set(baseName, []);
        nameMap.get(baseName)!.push(f);
    });

    const merged = [];
    const processedNames = new Set();
    const specificToCSM = ["K. Venugopal Reddy", "D. Anitha Kumari", "Venugopal Reddy", "Anitha Kumari"];

    for (const [baseName, members] of nameMap.entries()) {
        if (members.length === 1) {
            merged.push(members[0]);
            continue;
        }

        console.log(`Merging duplicates for: ${baseName}`);
        
        // Merge strategy:
        // 1. Accumulate all specializations.
        // 2. Prioritize CSM department if specified by user.
        // 3. Keep one ID (preferably the original one).
        
        const allSpecs = new Set<string>();
        members.forEach(m => {
            if (m.specialization) m.specialization.forEach((s: string) => allSpecs.add(s));
        });

        // Find the best candidate to keep
        let bestCandidate = members.find(m => m.department === 'CSM') || members[0];
        
        // Force CSM branch if it's one of the ones mentioned by user
        if (specificToCSM.some(n => baseName.includes(n))) {
            bestCandidate.department = 'CSM';
        }

        const mergedMember = {
            ...bestCandidate,
            specialization: Array.from(allSpecs)
        };
        
        merged.push(mergedMember);
    }

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

export const MOCK_FACULTY: Faculty[] = ${JSON.stringify(merged, null, 2)};
`;

    fs.writeFileSync('src/data/mockFaculty.ts', fileContent);
    console.log("Successfully merged duplicates and updated mockFaculty.ts");
}

mergeFacultyDuplicates();
