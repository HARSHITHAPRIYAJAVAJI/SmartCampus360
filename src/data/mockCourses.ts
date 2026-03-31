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

    // --- IT BRANCH ---
    // Semester 1
    { id: "it-s1-1", code: "4B116", name: "Applied Physics Lab", credits: 1, type: "Lab", department: "IT", semester: 1 },
    { id: "it-s1-2", code: "4B117", name: "Basic Electrical and Simulation Lab", credits: 1, type: "Lab", department: "IT", semester: 1 },
    { id: "it-s1-3", code: "4B118", name: "Problem Solving using C Programming Lab", credits: 1, type: "Lab", department: "IT", semester: 1 },
    { id: "it-s1-4", code: "4B1AA", name: "Linear Algebra and Ordinary Differential Equations", credits: 4, type: "Theory", department: "IT", semester: 1 },
    { id: "it-s1-5", code: "4B1AK", name: "Applied Physics", credits: 4, type: "Theory", department: "IT", semester: 1 },
    { id: "it-s1-6", code: "4B1AL", name: "Basic Electrical Engineering", credits: 3, type: "Theory", department: "IT", semester: 1 },
    { id: "it-s1-7", code: "4B1AM", name: "Problem Solving using C Programming", credits: 3, type: "Theory", department: "IT", semester: 1 },
    { id: "it-s1-8", code: "4E1DC", name: "Computer Aided Engineering Graphics", credits: 3, type: "Theory", department: "IT", semester: 1 },

    // Semester 2
    { id: "it-s2-1", code: "4B206", name: "Engineering Chemistry Lab", credits: 1, type: "Lab", department: "IT", semester: 2 },
    { id: "it-s2-2", code: "4B2AI", name: "Engineering Chemistry", credits: 4, type: "Theory", department: "IT", semester: 2 },
    { id: "it-s2-3", code: "4B2AM", name: "Statistical Methods and Calculus", credits: 4, type: "Theory", department: "IT", semester: 2 },
    { id: "it-s2-4", code: "4E207", name: "Electronic Devices and Circuits Lab", credits: 1, type: "Lab", department: "IT", semester: 2 },
    { id: "it-s2-5", code: "4E213", name: "Python Programming Lab", credits: 1, type: "Lab", department: "IT", semester: 2 },
    { id: "it-s2-6", code: "4E214", name: "IT Workshop", credits: 1, type: "Lab", department: "IT", semester: 2 },
    { id: "it-s2-7", code: "4E2AJ", name: "Electronic Devices and Circuits", credits: 2, type: "Theory", department: "IT", semester: 2 },
    { id: "it-s2-8", code: "4E2AT", name: "Problem Solving using Python", credits: 3, type: "Theory", department: "IT", semester: 2 },
    { id: "it-s2-9", code: "4H203", name: "English Language and Communication Skills Lab", credits: 1, type: "Lab", department: "IT", semester: 2 },
    { id: "it-s2-10", code: "4H2AC", name: "English for Skill Enhancement", credits: 2, type: "Theory", department: "IT", semester: 2 },

    // Semester 3
    { id: "it-s3-1", code: "it-4B3AD", name: "Probability and Statistics", credits: 4, type: "Theory", department: "IT", semester: 3 },
    { id: "it-s3-2", code: "it-4E313", name: "Data Structures Lab", credits: 1.5, type: "Lab", department: "IT", semester: 3 },
    { id: "it-s3-3", code: "it-4E314", name: "Object Oriented Programming through Java Lab", credits: 1.5, type: "Lab", department: "IT", semester: 3 },
    { id: "it-s3-4", code: "it-4E315", name: "IT Essentials", credits: 1, type: "Lab", department: "IT", semester: 3 },
    { id: "it-s3-5", code: "it-4E3FB", name: "Computer Organization and Architecture", credits: 3, type: "Theory", department: "IT", semester: 3 },
    { id: "it-s3-6", code: "it-4E3FC", name: "Data Structures", credits: 3, type: "Theory", department: "IT", semester: 3 },
    { id: "it-s3-7", code: "it-4E3FD", name: "Object Oriented Programming through Java", credits: 3, type: "Theory", department: "IT", semester: 3 },
    { id: "it-s3-8", code: "it-4H3FA", name: "Business Economics & Financial Analysis", credits: 3, type: "Theory", department: "IT", semester: 3 },

    // Semester 4
    { id: "it-s4-1", code: "it-4E415", name: "Operating Systems Lab", credits: 1, type: "Lab", department: "IT", semester: 4 },
    { id: "it-s4-2", code: "it-4E416", name: "Database Management Systems Lab", credits: 1.5, type: "Lab", department: "IT", semester: 4 },
    { id: "it-s4-3", code: "it-4E417", name: "Web Technologies Lab", credits: 1.5, type: "Lab", department: "IT", semester: 4 },
    { id: "it-s4-4", code: "it-4E4FA", name: "Discrete Mathematics", credits: 3, type: "Theory", department: "IT", semester: 4 },
    { id: "it-s4-5", code: "it-4E4FB", name: "Web Technologies", credits: 3, type: "Theory", department: "IT", semester: 4 },
    { id: "it-s4-6", code: "it-4E4FC", name: "Operating Systems", credits: 3, type: "Theory", department: "IT", semester: 4 },
    { id: "it-s4-7", code: "it-4E4FD", name: "Database Management Systems", credits: 3, type: "Theory", department: "IT", semester: 4 },
    { id: "it-s4-8", code: "it-4E4FE", name: "Design and Analysis of Algorithms", credits: 4, type: "Theory", department: "IT", semester: 4 },

    // Semester 5
    { id: "it-s5-1", code: "it-4E511", name: "Computer Networks Lab", credits: 1, type: "Lab", department: "IT", semester: 5 },
    { id: "it-s5-2", code: "it-4E512", name: "Internet of Things Lab", credits: 1, type: "Lab", department: "IT", semester: 5 },
    { id: "it-s5-3", code: "it-4E5FA", name: "Computer Networks", credits: 3, type: "Theory", department: "IT", semester: 5 },
    { id: "it-s5-4", code: "it-4E5FB", name: "Fundamentals of IoT", credits: 3, type: "Theory", department: "IT", semester: 5 },
    { id: "it-s5-5", code: "it-4H5EA", name: "Fundamentals of Management", credits: 3, type: "Theory", department: "IT", semester: 5 },
    { id: "it-s5-6", code: "it-4O5FA", name: "Fundamentals of Data Science", credits: 3, type: "Theory", department: "IT", semester: 5 },
    { id: "it-s5-7", code: "it-4P5FA", name: "Quantum Computing", credits: 3, type: "Theory", department: "IT", semester: 5 },
    { id: "it-s5-8", code: "it-4P5FD", name: "Biometrics", credits: 3, type: "Theory", department: "IT", semester: 5 },

    // Semester 6
    { id: "it-s6-1", code: "it-4E611", name: "Machine Learning Lab", credits: 1.5, type: "Lab", department: "IT", semester: 6 },
    { id: "it-s6-2", code: "it-4E612", name: "Data Warehousing and Data Mining Lab", credits: 1.5, type: "Lab", department: "IT", semester: 6 },
    { id: "it-s6-3", code: "it-4E613", name: "Advanced English Communication Skills Lab", credits: 2, type: "Lab", department: "IT", semester: 6 },
    { id: "it-s6-4", code: "it-4E6FA", name: "Machine Learning", credits: 3, type: "Theory", department: "IT", semester: 6 },
    { id: "it-s6-5", code: "it-4E6FB", name: "Data Warehousing and Data Mining", credits: 3, type: "Theory", department: "IT", semester: 6 },
    { id: "it-s6-6", code: "it-4E6FC", name: "Automata Theory and Compiler Design", credits: 3, type: "Theory", department: "IT", semester: 6 },
    { id: "it-s6-7", code: "it-4O6FA", name: "Data Visualization", credits: 3, type: "Theory", department: "IT", semester: 6 },
    { id: "it-s6-8", code: "it-4P6FC", name: "Soft Computing", credits: 3, type: "Theory", department: "IT", semester: 6 },

    // Semester 7
    { id: "it-s7-1", code: "it-4E705", name: "Software Engineering Lab", credits: 1, type: "Lab", department: "IT", semester: 7 },
    { id: "it-s7-2", code: "it-4E7FA", name: "Software Engineering", credits: 3, type: "Theory", department: "IT", semester: 7 },
    { id: "it-s7-3", code: "it-4O7FA", name: "Disaster Management", credits: 3, type: "Theory", department: "IT", semester: 7 },
    { id: "it-s7-4", code: "it-4P7FB", name: "Artificial Intelligence", credits: 3, type: "Theory", department: "IT", semester: 7 },
    { id: "it-s7-5", code: "it-4P7FD", name: "Blockchain Technology", credits: 3, type: "Theory", department: "IT", semester: 7 },
    { id: "it-s7-6", code: "it-4P7PW", name: "Project Stage-I", credits: 7, type: "Theory", department: "IT", semester: 7 },

    // --- CSE BRANCH ---
    // Semester 1
    { id: "cse-s1-1", code: "4B108", name: "English Language and Communication Skills Lab", credits: 1, type: "Lab", department: "CSE", semester: 1 },
    { id: "cse-s1-2", code: "4B1AA", name: "Linear Algebra and Ordinary Differential Equations", credits: 4, type: "Theory", department: "CSE", semester: 1 },
    { id: "cse-s1-3", code: "4B1AG", name: "English for Skill Enhancement", credits: 2, type: "Theory", department: "CSE", semester: 1 },
    { id: "cse-s1-4", code: "4E112", name: "C Programming for Problem Solving Lab", credits: 1, type: "Lab", department: "CSE", semester: 1 },
    { id: "cse-s1-5", code: "4E114", name: "Engineering Chemistry Lab", credits: 1, type: "Lab", department: "CSE", semester: 1 },
    { id: "cse-s1-6", code: "4E115", name: "IT Workshop and Elements of Computer Engineering", credits: 1, type: "Lab", department: "CSE", semester: 1 },
    { id: "cse-s1-7", code: "4E1AJ", name: "C Programming for Problem Solving", credits: 3, type: "Theory", department: "CSE", semester: 1 },
    { id: "cse-s1-8", code: "4E1DB", name: "Computer Aided Engineering Graphics", credits: 3, type: "Theory", department: "CSE", semester: 1 },
    { id: "cse-s1-9", code: "4H1AH", name: "Engineering Chemistry", credits: 4, type: "Theory", department: "CSE", semester: 1 },

    // Semester 2
    { id: "cse-s2-1", code: "4B209", name: "Applied Physics Lab", credits: 1, type: "Lab", department: "CSE", semester: 2 },
    { id: "cse-s2-2", code: "4B2AM", name: "Statistical Methods and Vector Calculus", credits: 4, type: "Theory", department: "CSE", semester: 2 },
    { id: "cse-s2-3", code: "4B2AN", name: "Applied Physics", credits: 4, type: "Theory", department: "CSE", semester: 2 },
    { id: "cse-s2-4", code: "4E210", name: "Basic Electrical and Simulation Lab", credits: 1, type: "Lab", department: "CSE", semester: 2 },
    { id: "cse-s2-5", code: "4E211", name: "Data Structures Lab", credits: 1, type: "Lab", department: "CSE", semester: 2 },
    { id: "cse-s2-6", code: "4E2AP", name: "Basic Electrical Engineering", credits: 3, type: "Theory", department: "CSE", semester: 2 },
    { id: "cse-s2-7", code: "4E2AQ", name: "Data Structures", credits: 3, type: "Theory", department: "CSE", semester: 2 },
    { id: "cse-s2-8", code: "4H2AL", name: "Business Economics and Financial Analysis", credits: 3, type: "Theory", department: "CSE", semester: 2 },

    // Semester 3
    { id: "cse-s3-1", code: "4B3AD", name: "Probability and Statistics", credits: 4, type: "Theory", department: "CSE", semester: 3 },
    { id: "cse-s3-2", code: "4E303", name: "Python Programming Lab", credits: 1, type: "Lab", department: "CSE", semester: 3 },
    { id: "cse-s3-3", code: "4E312", name: "Semiconductor Devices and Circuits Lab", credits: 1, type: "Lab", department: "CSE", semester: 3 },
    { id: "cse-s3-4", code: "4E3EA", name: "Semiconductor Devices and Circuits", credits: 3, type: "Theory", department: "CSE", semester: 3 },
    { id: "cse-s3-5", code: "4E3EB", name: "Python Programming", credits: 2, type: "Theory", department: "CSE", semester: 3 },
    { id: "cse-s3-6", code: "4E3EC", name: "Mathematical Foundations of Computer Science", credits: 3, type: "Theory", department: "CSE", semester: 3 },
    { id: "cse-s3-7", code: "4E3ED", name: "Computer Architecture and Organization", credits: 3, type: "Theory", department: "CSE", semester: 3 },
    { id: "cse-s3-8", code: "4E3EE", name: "Computer Networks", credits: 3, type: "Theory", department: "CSE", semester: 3 },

    // Semester 4
    { id: "cse-s4-1", code: "4E411", name: "Database Management Systems Lab", credits: 1, type: "Lab", department: "CSE", semester: 4 },
    { id: "cse-s4-2", code: "4E412", name: "Object Oriented Programming through Java Lab", credits: 1, type: "Lab", department: "CSE", semester: 4 },
    { id: "cse-s4-3", code: "4E413", name: "Advanced English Communication Skills Lab", credits: 2, type: "Lab", department: "CSE", semester: 4 },
    { id: "cse-s4-4", code: "4E414", name: "Web Technologies Lab", credits: 1, type: "Lab", department: "CSE", semester: 4 },
    { id: "cse-s4-5", code: "4E4EA", name: "Object Oriented Programming through Java", credits: 3, type: "Theory", department: "CSE", semester: 4 },
    { id: "cse-s4-6", code: "4E4EB", name: "Design and Analysis of Algorithms", credits: 4, type: "Theory", department: "CSE", semester: 4 },
    { id: "cse-s4-7", code: "4E4EC", name: "Database Management Systems", credits: 3, type: "Theory", department: "CSE", semester: 4 },
    { id: "cse-s4-8", code: "4E4ED", name: "Software Engineering", credits: 3, type: "Theory", department: "CSE", semester: 4 },
    { id: "cse-s4-9", code: "4E4EE", name: "Web Technologies", credits: 2, type: "Theory", department: "CSE", semester: 4 },

    // Semester 5
    { id: "cse-s5-1", code: "4E509", name: "Operating Systems Lab", credits: 1, type: "Lab", department: "CSE", semester: 5 },
    { id: "cse-s5-2", code: "4E510", name: "Data Warehousing and Data Mining Lab", credits: 1, type: "Lab", department: "CSE", semester: 5 },
    { id: "cse-s5-3", code: "4E5EA", name: "Formal Languages and Automata Theory", credits: 4, type: "Theory", department: "CSE", semester: 5 },
    { id: "cse-s5-4", code: "4E5EB", name: "Operating Systems", credits: 3, type: "Theory", department: "CSE", semester: 5 },
    { id: "cse-s5-5", code: "4E5EC", name: "Data Warehousing and Data Mining", credits: 2, type: "Theory", department: "CSE", semester: 5 },
    { id: "cse-s5-6", code: "4H5EA", name: "Fundamentals of Management", credits: 3, type: "Theory", department: "CSE", semester: 5 },
    { id: "cse-s5-7", code: "4P5EC", name: "Fundamentals of Data Science", credits: 3, type: "Theory", department: "CSE", semester: 5 },
    { id: "cse-s5-8", code: "4P5EG", name: "Artificial Intelligence", credits: 3, type: "Theory", department: "CSE", semester: 5 },

    // Semester 6
    { id: "cse-s6-1", code: "4E609", name: "DevOps Lab", credits: 1, type: "Lab", department: "CSE", semester: 6 },
    { id: "cse-s6-2", code: "4E610", name: "Machine Learning Lab", credits: 1, type: "Lab", department: "CSE", semester: 6 },
    { id: "cse-s6-3", code: "4E6EA", name: "DevOps", credits: 3, type: "Theory", department: "CSE", semester: 6 },
    { id: "cse-s6-4", code: "4E6EB", name: "Compiler Design", credits: 3, type: "Theory", department: "CSE", semester: 6 },
    { id: "cse-s6-5", code: "4E6EC", name: "Machine Learning", credits: 3, type: "Theory", department: "CSE", semester: 6 },
    { id: "cse-s6-6", code: "4O6EA", name: "Environment Impact Assessment", credits: 3, type: "Theory", department: "CSE", semester: 6 },
    { id: "cse-s6-7", code: "4P6EA", name: "Full Stack Development", credits: 3, type: "Theory", department: "CSE", semester: 6 },
    { id: "cse-s6-8", code: "4P6EE", name: "Internet of Things", credits: 3, type: "Theory", department: "CSE", semester: 6 },

    // Semester 7
    { id: "cse-s7-1", code: "4E704", name: "Deep Learning Lab", credits: 1, type: "Lab", department: "CSE", semester: 7 },
    { id: "cse-s7-2", code: "4E7EA", name: "Deep Learning", credits: 3, type: "Theory", department: "CSE", semester: 7 },
    { id: "cse-s7-3", code: "4E7EB", name: "Network Security and Cryptography", credits: 3, type: "Theory", department: "CSE", semester: 7 },
    { id: "cse-s7-4", code: "4O7EA", name: "Disaster Management", credits: 3, type: "Theory", department: "CSE", semester: 7 },
    { id: "cse-s7-5", code: "4P7EA", name: "Robotic Process Automation", credits: 3, type: "Theory", department: "CSE", semester: 7 },
    { id: "cse-s7-6", code: "4P7P1", name: "Project Work Phase 1", credits: 7, type: "Theory", department: "CSE", semester: 7 },
];
