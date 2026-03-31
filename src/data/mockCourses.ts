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
    // --- SEMESTER 1 ---
    { id: "s1-1", code: "4B108", name: "English Language and Communication Skills Lab – 1", credits: 1, type: "Lab", department: "CSM", semester: 1 },
    { id: "s1-2", code: "4B1AA", name: "Linear Algebra and Ordinary Differential Equations", credits: 4, type: "Theory", department: "CSM", semester: 1 },
    { id: "s1-3", code: "4B1AG", name: "English for Skill Enhancement", credits: 2, type: "Theory", department: "CSM", semester: 1 },
    { id: "s1-4", code: "4E112", name: "C Programming for Problem Solving Lab", credits: 1, type: "Lab", department: "CSM", semester: 1 },
    { id: "s1-5", code: "4E114", name: "Engineering Chemistry Lab", credits: 1, type: "Lab", department: "CSM", semester: 1 },
    { id: "s1-6", code: "4E115", name: "IT Workshop and Elements of Computer Engineering", credits: 1, type: "Lab", department: "CSM", semester: 1 },
    { id: "s1-7", code: "4E1AJ", name: "C Programming for Problem Solving", credits: 3, type: "Theory", department: "CSM", semester: 1 },
    { id: "s1-8", code: "4E1DD", name: "Computer Aided Engineering Graphics", credits: 3, type: "Theory", department: "CSM", semester: 1 },
    { id: "s1-9", code: "4H1AH", name: "Engineering Chemistry", credits: 4, type: "Theory", department: "CSM", semester: 1 },

    // --- SEMESTER 2 ---
    { id: "s2-1", code: "4B209", name: "Applied Physics Lab", credits: 1, type: "Lab", department: "CSM", semester: 2 },
    { id: "s2-2", code: "4B2AM", name: "Statistical Methods and Vector Calculus", credits: 4, type: "Theory", department: "CSM", semester: 2 },
    { id: "s2-3", code: "4B2AN", name: "Applied Physics", credits: 4, type: "Theory", department: "CSM", semester: 2 },
    { id: "s2-4", code: "4E210", name: "Basic Electrical and Simulation Lab", credits: 1, type: "Lab", department: "CSM", semester: 2 },
    { id: "s2-5", code: "4E211", name: "Data Structures Lab", credits: 1, type: "Lab", department: "CSM", semester: 2 },
    { id: "s2-6", code: "4E2AP", name: "Basic Electrical Engineering", credits: 3, type: "Theory", department: "CSM", semester: 2 },
    { id: "s2-7", code: "4E2AQ", name: "Data Structures", credits: 3, type: "Theory", department: "CSM", semester: 2 },
    { id: "s2-8", code: "4H2AL", name: "Business Economics and Financial Analysis", credits: 3, type: "Theory", department: "CSM", semester: 2 },

    // --- SEMESTER 3 ---
    { id: "s3-1", code: "4B30D", name: "Probability and Statistics", credits: 4, type: "Theory", department: "CSM", semester: 3 },
    { id: "s3-2", code: "4E303", name: "Python Programming Lab", credits: 1, type: "Lab", department: "CSM", semester: 3 },
    { id: "s3-3", code: "4E312", name: "Semiconductor Devices and Circuits Lab", credits: 1, type: "Lab", department: "CSM", semester: 3 },
    { id: "s3-4", code: "4E3EA", name: "Semiconductor Devices and Circuits", credits: 3, type: "Theory", department: "CSM", semester: 3 },
    { id: "s3-5", code: "4E3EB", name: "Python Programming", credits: 2, type: "Theory", department: "CSM", semester: 3 },
    { id: "s3-6", code: "4E3EC", name: "Mathematical Foundations of Computer Science", credits: 3, type: "Theory", department: "CSM", semester: 3 },
    { id: "s3-7", code: "4E3ED", name: "Computer Architecture and Organization", credits: 3, type: "Theory", department: "CSM", semester: 3 },
    { id: "s3-8", code: "4E3EE", name: "Computer Networks", credits: 3, type: "Theory", department: "CSM", semester: 3 },

    // --- SEMESTER 4 ---
    { id: "s4-1", code: "4E411", name: "Database Management Systems Lab", credits: 1, type: "Lab", department: "CSM", semester: 4 },
    { id: "s4-2", code: "4E412", name: "Object Oriented Programming through Java Lab", credits: 1, type: "Lab", department: "CSM", semester: 4 },
    { id: "s4-3", code: "4E413", name: "Advanced English Communication Skills Lab", credits: 2, type: "Lab", department: "CSM", semester: 4 },
    { id: "s4-4", code: "4E414", name: "Web Technologies Lab", credits: 1, type: "Lab", department: "CSM", semester: 4 },
    { id: "s4-5", code: "4E4EA", name: "Object Oriented Programming through Java", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "s4-6", code: "4E4EB", name: "Design and Analysis of Algorithms", credits: 4, type: "Theory", department: "CSM", semester: 4 },
    { id: "s4-7", code: "4E4EC", name: "Database Management Systems", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "s4-8", code: "4E4ED", name: "Software Engineering", credits: 3, type: "Theory", department: "CSM", semester: 4 },
    { id: "s4-9", code: "4E4EE", name: "Web Technologies", credits: 2, type: "Theory", department: "CSM", semester: 4 },

    // --- SEMESTER 5 ---
    { id: "s5-1", code: "4E513", name: "Machine Learning Lab", credits: 1, type: "Lab", department: "CSM", semester: 5 },
    { id: "s5-2", code: "4E514", name: "Skill Development Course", credits: 1, type: "Lab", department: "CSM", semester: 5 },
    { id: "s5-3", code: "4E5GA", name: "Automata Theory and Compiler Design", credits: 3, type: "Theory", department: "CSM", semester: 5 },
    { id: "s5-4", code: "4E5GB", name: "Operating Systems", credits: 3, type: "Theory", department: "CSM", semester: 5 },
    { id: "s5-5", code: "4E5GC", name: "Artificial Intelligence", credits: 3, type: "Theory", department: "CSM", semester: 5 },
    { id: "s5-6", code: "4E5GD", name: "Machine Learning", credits: 3, type: "Theory", department: "CSM", semester: 5 },
    { id: "s5-7", code: "4P5GC", name: "DevOps", credits: 3, type: "Theory", department: "CSM", semester: 5 },
    { id: "s5-8", code: "4P5GD", name: "Object Oriented Analysis & Design", credits: 3, type: "Theory", department: "CSM", semester: 5 },

    // --- SEMESTER 6 ---
    { id: "s6-1", code: "4E614", name: "Natural Language Processing Lab", credits: 1, type: "Lab", department: "CSM", semester: 6 },
    { id: "s6-2", code: "4E615", name: "Deep Learning Lab", credits: 1, type: "Lab", department: "CSM", semester: 6 },
    { id: "s6-3", code: "4E6GA", name: "Natural Language Processing", credits: 3, type: "Theory", department: "CSM", semester: 6 },
    { id: "s6-4", code: "4E6GB", name: "Deep Learning", credits: 3, type: "Theory", department: "CSM", semester: 6 },
    { id: "s6-5", code: "4H6GA", name: "Fundamentals of Management", credits: 3, type: "Theory", department: "CSM", semester: 6 },
    { id: "s6-6", code: "4O6GA", name: "Embedded Systems Design", credits: 3, type: "Theory", department: "CSM", semester: 6 },
    { id: "s6-7", code: "4P6GC", name: "Internet of Things", credits: 3, type: "Theory", department: "CSM", semester: 6 },
    { id: "s6-8", code: "4P6GE", name: "Expert Systems", credits: 3, type: "Theory", department: "CSM", semester: 6 },

    // --- SEMESTER 7 ---
    { id: "s7-1", code: "4E706", name: "Big Data Analytics Lab", credits: 1, type: "Lab", department: "CSM", semester: 7 },
    { id: "s7-2", code: "4E7GA", name: "Knowledge Representation and Reasoning", credits: 3, type: "Theory", department: "CSM", semester: 7 },
    { id: "s7-3", code: "4E7GB", name: "Big Data Analytics", credits: 3, type: "Theory", department: "CSM", semester: 7 },
    { id: "s7-4", code: "4O7GB", name: "Disaster Management", credits: 3, type: "Theory", department: "CSM", semester: 7 },
    { id: "s7-5", code: "4P7GB", name: "Information Security", credits: 3, type: "Theory", department: "CSM", semester: 7 },
    { id: "s7-6", code: "4P7PP1", name: "Project Work Phase 1", credits: 7, type: "Theory", department: "CSM", semester: 7 },

    // --- SEMESTER 8 ---
    { id: "s8-1", code: "RL", name: "Reinforcement Learning", credits: 3, type: "Theory", department: "CSM", semester: 8 },
    { id: "s8-2", code: "FDS", name: "Foundations of Data Science", credits: 3, type: "Theory", department: "CSM", semester: 8 },
    { id: "s8-3", code: "ITE", name: "Internet Technology and Engineering", credits: 3, type: "Theory", department: "CSM", semester: 8 },
    { id: "s8-4", code: "QC", name: "Quantum Computing", credits: 3, type: "Theory", department: "CSM", semester: 8 },
    { id: "s8-5", code: "PW2", name: "Project Work Phase 2", credits: 10, type: "Theory", department: "CSM", semester: 8 },
];
