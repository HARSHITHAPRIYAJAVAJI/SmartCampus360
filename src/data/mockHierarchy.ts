/**
 * Academic Hierarchy Mapping
 * Defines Year In-Charges, Class Teachers, and logic for Class Representatives.
 */

export interface YearInCharge {
    year: number;
    facultyId: string;
    branch: string;
}

export interface ClassTeacher {
    branch: string;
    year: number;
    section: string;
    facultyId: string;
}

export const YEAR_IN_CHARGES: YearInCharge[] = [
    // CSM
    { year: 4, branch: "CSM", facultyId: "p-vijaya-kumari" },
    { year: 3, branch: "CSM", facultyId: "c-jaya-lakshmi" },
    { year: 2, branch: "CSM", facultyId: "c-saritha-reddy" },
    { year: 1, branch: "CSM", facultyId: "m-indira" },

    // CSE
    { year: 4, branch: "CSE", facultyId: "m-narender" },
    { year: 3, branch: "CSE", facultyId: "vempati-krishna" },
    { year: 2, branch: "CSE", facultyId: "ch-b-naga-lakshmi" },
    { year: 1, branch: "CSE", facultyId: "rajesh-banala" },

    // IT
    { year: 4, branch: "IT", facultyId: "muruganantham-r" },
    { year: 3, branch: "IT", facultyId: "dhasaratham-m" },
    { year: 2, branch: "IT", facultyId: "kavitha-d" },
    { year: 1, branch: "IT", facultyId: "thakur-madhumathi" },

    // ECE
    { year: 4, branch: "ECE", facultyId: "j-sunitha-kumari" },
    { year: 3, branch: "ECE", facultyId: "p-venkata-lavanya" },
    { year: 2, branch: "ECE", facultyId: "b-swapna-rani" },
    { year: 1, branch: "ECE", facultyId: "a-premalatha" },
];

export const CLASS_TEACHERS: ClassTeacher[] = [
    // CSM
    { branch: "CSM", year: 4, section: "A", facultyId: "v-pravalika" },
    { branch: "CSM", year: 4, section: "B", facultyId: "t-praneetha" },
    { branch: "CSM", year: 4, section: "C", facultyId: "p-rajini" },
    { branch: "CSM", year: 3, section: "A", facultyId: "m-indira" },
    { branch: "CSM", year: 2, section: "A", facultyId: "ishwarya-devi-k" },

    // CSE
    { branch: "CSE", year: 4, section: "A", facultyId: "rajesh-banala" },
    { branch: "CSE", year: 4, section: "B", facultyId: "a-pramod-reddy" },
    { branch: "CSE", year: 3, section: "A", facultyId: "nelli-chandrakala" },
    { branch: "CSE", year: 2, section: "A", facultyId: "kuna-naresh" },

    // IT
    { branch: "IT", year: 4, section: "A", facultyId: "thakur-madhumathi" },
    { branch: "IT", year: 3, section: "A", facultyId: "mandalreddy-sushma" },
    { branch: "IT", year: 2, section: "A", facultyId: "n-paparayudu" },

    // ECE
    { branch: "ECE", year: 4, section: "A", facultyId: "m-kalpana" },
    { branch: "ECE", year: 3, section: "A", facultyId: "s-anitha" },
];

/**
 * Helper to identify Class Representative (CR)
 * Requirement: The first roll number student in each section
 */
import { MOCK_STUDENTS } from "./mockStudents";

export const getSectionCR = (branch: string, year: number, section: string) => {
    const sectionStudents = MOCK_STUDENTS.filter(s => 
        s.branch === branch && 
        s.year === year && 
        s.section === section
    ).sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

    return sectionStudents.length > 0 ? sectionStudents[0] : null;
};
