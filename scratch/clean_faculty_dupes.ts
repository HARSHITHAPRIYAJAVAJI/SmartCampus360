import fs from 'fs';
import { MOCK_FACULTY } from "../src/data/mockFaculty";

function cleanDuplicates() {
    const cleaned = MOCK_FACULTY.map(f => {
        if (!f.specialization) return f;
        // Use a Set to remove case-insensitive duplicates
        const seen = new Set<string>();
        const unique = f.specialization.filter(spec => {
            const normalized = spec.trim().toLowerCase();
            if (seen.has(normalized)) return false;
            seen.add(normalized);
            return true;
        });
        return { ...f, specialization: unique };
    });

    console.log("Cleaned up specializations for", cleaned.length, "faculty members.");
    
    // Output the first few to check
    // console.log(JSON.stringify(cleaned.slice(0, 5), null, 2));

    // I'll manually apply a fix to the file rather than over-writing it just in case.
    // Actually, I can use this to find WHO has duplicates.
    
    MOCK_FACULTY.forEach(f => {
        if (!f.specialization) return;
        const normalized = f.specialization.map(s => s.trim().toLowerCase());
        const hasDupes = normalized.some((s, i) => normalized.indexOf(s) !== i);
        if (hasDupes) {
            console.log(`Duplicate found for ${f.name} (${f.id}):`, f.specialization);
        }
    });
}

cleanDuplicates();
