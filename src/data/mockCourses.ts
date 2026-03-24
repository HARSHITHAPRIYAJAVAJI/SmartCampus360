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
    { id: "c1", code: "C", name: "Programming in C", credits: 3, type: "Theory", department: "CSM", semester: 1 },
    { id: "c2", code: "C Lab", name: "Programming in C Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 1 },
    { id: "c3", code: "ITWS Lab", name: "IT Workshop Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 1 },
    { id: "c4", code: "M&C", name: "Maths & Calculus", credits: 4, type: "Theory", department: "CSM", semester: 1 },
    { id: "c5", code: "EDC", name: "Electron Devices & Circuits", credits: 3, type: "Theory", department: "CSM", semester: 1 },

    // Year 1, Sem 2
    { id: "c11", code: "DS", name: "Data Structures", credits: 3, type: "Theory", department: "CSM", semester: 2 },
    { id: "c12", code: "DS Lab", name: "Data Structures Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 2 },
    { id: "c13", code: "PP", name: "Python Programming", credits: 3, type: "Theory", department: "CSM", semester: 2 },
    { id: "c14", code: "PP Lab", name: "Python Programming Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 2 },

    // Year 2, Sem 1
    { id: "c21", code: "CAO", name: "Computer Architecture & Organization", credits: 3, type: "Theory", department: "CSM", semester: 3 },
    { id: "c22", code: "MFCS", name: "Mathematical Foundations of CS", credits: 3, type: "Theory", department: "CSM", semester: 3 },
    { id: "c23", code: "CN", name: "Computer Networks", credits: 3, type: "Theory", department: "CSM", semester: 3 },
    { id: "c24", code: "PP", name: "Python Programming", credits: 3, type: "Theory", department: "CSM", semester: 3 },
    { id: "c25", code: "PP Lab", name: "Python Programming Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 3 },

    // Year 2, Sem 2
    { id: "c31", code: "DAA", name: "Design and Analysis of Algorithms", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "c32", code: "DBMS", name: "Database Management Systems", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "c33", code: "DBMS Lab", name: "Database Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 4 },
    { id: "c34", code: "JAVA", name: "Java Programming", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "c35", code: "JAVA Lab", name: "Java Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 4 },
    { id: "c36", code: "ML", name: "Machine Learning", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "c37", code: "OOPS", name: "Object Oriented Programming", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "c38", code: "SE", name: "Software Engineering", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "c39", code: "WT", name: "Web Technologies", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "c40", code: "WT Lab", name: "Web Technologies Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 4 },

    // Year 3, Sem 1
    { id: "c51", code: "AI", name: "Artificial Intelligence", credits: 3, type: "Theory", department: "CSM", semester: 5 },
    { id: "c52", code: "ATCD", name: "ATCD", credits: 3, type: "Theory", department: "CSM", semester: 5 },
    { id: "c53", code: "DevOps", name: "DevOps", credits: 3, type: "Lab", department: "CSM", semester: 5 },
    { id: "c54", code: "ML", name: "Machine Learning", credits: 4, type: "Theory", department: "CSM", semester: 5 },
    { id: "c55", code: "OOAD", name: "Object Oriented Analysis & Design", credits: 3, type: "Theory", department: "CSM", semester: 5 },
    { id: "c56", code: "OS", name: "Operating Systems", credits: 3, type: "Theory", department: "CSM", semester: 5 },

    // Year 3, Sem 2
    { id: "c61", code: "Conv. AI", name: "Conversational AI", credits: 3, type: "Theory", department: "CSM", semester: 6 },
    { id: "c62", code: "NLP", name: "Natural Language Processing", credits: 3, type: "Theory", department: "CSM", semester: 6 },
    { id: "c63", code: "NLP Lab", name: "Natural Language Processing Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 6 },
    { id: "c64", code: "DL", name: "Deep Learning", credits: 3, type: "Theory", department: "CSM", semester: 6 },
    { id: "c65", code: "DL Lab", name: "Deep Learning Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 6 },
    { id: "c66", code: "RPA", name: "Robotic Process Automation", credits: 3, type: "Lab", department: "CSM", semester: 6 },
    { id: "c67", code: "IS", name: "Information Security", credits: 3, type: "Theory", department: "CSM", semester: 6 },
    { id: "c68", code: "OE", name: "Open Elective", credits: 3, type: "Theory", department: "CSM", semester: 6 },

    // Year 4, Sem 1
    { id: "c71", code: "BDA", name: "Big Data Analytics", credits: 4, type: "Theory", department: "CSM", semester: 7 },
    { id: "c72", code: "BDA Lab", name: "Big Data Analytics Lab", credits: 1.5, type: "Lab", department: "CSM", semester: 7 },
    { id: "c73", code: "DM", name: "Disaster Management", credits: 3, type: "Theory", department: "CSM", semester: 7 },
    { id: "c74", code: "IS", name: "Information Security", credits: 3, type: "Theory", department: "CSM", semester: 7 },
    { id: "c75", code: "KRR", name: "Knowledge Representation & Reasoning", credits: 3, type: "Theory", department: "CSM", semester: 7 },

    // Year 4, Sem 2
    { id: "c81", code: "RL", name: "Reinforcement Learning", credits: 4, type: "Theory", department: "CSM", semester: 8 },
    { id: "c82", code: "QC", name: "Quantum Computing", credits: 3, type: "Theory", department: "CSM", semester: 8 },
    { id: "c83", code: "OE", name: "Open Elective", credits: 3, type: "Theory", department: "CSM", semester: 8 },
    { id: "c84", code: "DS OE", name: "Data Science Open Elective", credits: 3, type: "Theory", department: "CSM", semester: 8 },
];
