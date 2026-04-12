const fs = require('fs');
const path = require('path');

const studentFilePath = path.join(process.cwd(), 'src', 'data', 'mockStudents.ts');
const studentFileContent = fs.readFileSync(studentFilePath, 'utf8');

// Use a more robust regex to extract the array
const arrayMatch = studentFileContent.match(/export const MOCK_STUDENTS: Student\[\] = (\[[\s\S]*?\]);/);

if (!arrayMatch) {
    console.error("MOCK_STUDENTS array not found!");
    process.exit(1);
}

const students = JSON.parse(arrayMatch[1]);

const updatedStudents = students.map(student => {
    // 1. Year to Semester Alignment
    // 1st Year (1) -> 2nd Sem
    // 2nd Year (2) -> 4th Sem
    // 3rd Year (3) -> 6th Sem
    // 4th Year (4) -> 8th Sem
    student.semester = student.year * 2;

    // 2. Marks Data Alignment (Even Semester - Mid-1 only)
    // We add assignment1 and mid1 if they don't exist, or update them.
    // Out of 10 for assignment, 25 for mid.
    student.assignment1 = student.assignment1 || Math.floor(Math.random() * 3) + 7; // 7-10
    student.mid1 = student.mid1 || Math.floor(Math.random() * 8) + 17; // 17-25
    
    // Explicitly remove even semester future fields
    delete student.assignment2;
    delete student.mid2;
    delete student.labInternal;
    delete student.labExternal;

    return student;
});

const updatedFileContent = studentFileContent.replace(
    /export const MOCK_STUDENTS: Student\[\] = \[[\s\S]*?\];/,
    `export const MOCK_STUDENTS: Student[] = ${JSON.stringify(updatedStudents, null, 4)};`
);

fs.writeFileSync(studentFilePath, updatedFileContent);
console.log(`Updated ${updatedStudents.length} students to even semesters (Mid-1 data only).`);
