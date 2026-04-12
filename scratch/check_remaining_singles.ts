import { MOCK_FACULTY, Faculty } from "../src/data/mockFaculty";

function checkSingleSpec() {
    console.log("--- FACULTY WITH SINGLE SPECIALIZATION ---\n");
    const singles = MOCK_FACULTY.filter((f: Faculty) => !f.specialization || f.specialization.length <= 1);
    
    console.table(singles.map((f: Faculty) => ({
        ID: f.id,
        Name: f.name,
        Dept: f.department,
        Spec: f.specialization ? f.specialization[0] : "NONE"
    })));

    console.log(`\nFound ${singles.length} faculty members with 1 or fewer specializations.`);
}

checkSingleSpec();
