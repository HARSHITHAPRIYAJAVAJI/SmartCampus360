
export interface Course {
    id: string;
    code: string;
    name: string;
    credits: number;
    type: 'Theory' | 'Lab';
    department: string;
    semester: number;
}

export const MOCK_COURSES: Course[] = [
    // Year 1, Sem 1
    { id: "c1", code: "ED&CAD", name: "Engineering Drawing & CAD", credits: 3, type: "Theory", department: "AIML", semester: 1 },
    { id: "c2", code: "AEP", name: "Advanced English Practice", credits: 2, type: "Theory", department: "AIML", semester: 1 },
    { id: "c3", code: "M&C", name: "Maths & Calculus", credits: 4, type: "Theory", department: "AIML", semester: 1 },
    { id: "c4", code: "PPS", name: "Programming for Problem Solving", credits: 3, type: "Theory", department: "AIML", semester: 1 },
    { id: "c5", code: "EDC", name: "Electron Devices & Circuits", credits: 3, type: "Theory", department: "AIML", semester: 1 },
    { id: "c6", code: "PPS Lab", name: "PPS Lab", credits: 1.5, type: "Lab", department: "AIML", semester: 1 },

    // Year 2, Sem 2
    { id: "c21", code: "OOP JAVA", name: "Object Oriented Programming (Java)", credits: 3, type: "Theory", department: "AIML", semester: 4 },
    { id: "c22", code: "OOP JAVA Lab", name: "Java Lab", credits: 1.5, type: "Lab", department: "AIML", semester: 4 },
    { id: "c23", code: "WT", name: "Web Technologies", credits: 3, type: "Theory", department: "AIML", semester: 4 },
    { id: "c24", code: "DAA", name: "Design & Analysis of Algorithms", credits: 3, type: "Theory", department: "AIML", semester: 4 },
    { id: "c25", code: "SE", name: "Software Engineering", credits: 3, type: "Theory", department: "AIML", semester: 4 },
    { id: "c26", code: "DBMS", name: "Database Management Systems", credits: 3, type: "Theory", department: "AIML", semester: 4 },
    { id: "c27", code: "DBMS Lab", name: "Database Lab", credits: 1.5, type: "Lab", department: "AIML", semester: 4 },

    // Year 2, Sem 1
    { id: "c31", code: "CAO", name: "Computer Arch & Org", credits: 3, type: "Theory", department: "AIML", semester: 3 },
    { id: "c32", code: "MFCS", name: "Mathematical Foundations of CS", credits: 3, type: "Theory", department: "AIML", semester: 3 },
    { id: "c33", code: "CN", name: "Computer Networks", credits: 3, type: "Theory", department: "AIML", semester: 3 },

    // Year 3, Sem 1
    { id: "c41", code: "ML", name: "Machine Learning", credits: 4, type: "Theory", department: "AIML", semester: 5 },
    { id: "c42", code: "AI", name: "Artificial Intelligence", credits: 3, type: "Theory", department: "AIML", semester: 5 },
    { id: "c43", code: "OS", name: "Operating Systems", credits: 3, type: "Theory", department: "AIML", semester: 5 },

    // Year 4, Sem 2 (Sem 8)
    { id: "c81", code: "RL", name: "Reinforcement Learning", credits: 4, type: "Theory", department: "AIML", semester: 8 },
    { id: "c82", code: "QC", name: "Quantum Computing", credits: 3, type: "Theory", department: "AIML", semester: 8 },
    { id: "c83", code: "FDS", name: "Fundamentals of Data Science", credits: 3, type: "Theory", department: "AIML", semester: 8 },
    { id: "c84", code: "ITE", name: "IT Essentials", credits: 3, type: "Theory", department: "AIML", semester: 8 },
];
