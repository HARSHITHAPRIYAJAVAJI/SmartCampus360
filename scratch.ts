import { MOCK_COURSES } from "./src/data/mockCourses";
import { MOCK_STUDENTS } from "./src/data/mockStudents";

const exam = { 
    years: [2], 
    courseCodes: ["4B3AD"] 
};

const relevantCourses = MOCK_COURSES.filter(c => exam.courseCodes.includes(c.code));
console.log("relevantCourses:", relevantCourses.length);

const branchYearPairs = relevantCourses.map(c => ({
    branch: c.department,
    year: Math.ceil(c.semester / 2)
})).filter(p => exam.years.includes(p.year));

console.log("branchYearPairs:", branchYearPairs);

const uniquePairs = Array.from(new Set(branchYearPairs.map(p => `${p.branch}-${p.year}`)));
console.log("uniquePairs:", uniquePairs);

const eligibleStudents = MOCK_STUDENTS.filter(s => 
    uniquePairs.includes(`${s.branch}-${s.year}`)
);

console.log("eligibleStudents:", eligibleStudents.length);
