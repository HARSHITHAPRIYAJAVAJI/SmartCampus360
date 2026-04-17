export interface Room {
    id: string;
    name: string;
    capacity: number;
    type: 'Classroom' | 'Lab' | 'Auditorium' | 'Seminar Hall';
    building: string;
    dept?: 'IT' | 'ECE' | 'AIML' | 'GEN' | 'ALL' | 'CSE' | 'CSM';
    subjects?: string[];
}

export const MOCK_ROOMS: Room[] = [
    // T-Block (1st Year)
    ...[1, 2, 3, 4, 5].flatMap(floor =>
        Array.from({ length: 4 }, (_, i) => ({
            id: `t${floor}0${i + 1}`,
            name: `T-${floor}0${i + 1}`,
            capacity: 60,
            type: "Classroom" as const,
            building: `T Block (Floor ${floor})`,
            dept: "GEN" as const
        }))
    ),
    { id: "t-cp-lab", name: "T-CP LAB", capacity: 60, type: "Lab", building: "T Block", dept: "GEN", subjects: ["Programming for Problem Solving Lab", "PPS Lab", "CPPS Lab", "IT Workshop", "ITWS"] },
    { id: "t-101-l", name: "T-101-L", capacity: 40, type: "Lab", building: "T Block", dept: "GEN", subjects: ["ELCS Lab", "English Lab", "CAEG Lab", "Graphics Lab", "CAEG"] },
    { id: "t406", name: "T-406", capacity: 40, type: "Lab", building: "T Block", dept: "GEN", subjects: ["ELCS Lab", "English Lab", "Language Lab"] },

    // South Block (IT Dept)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `s4${(i + 1).toString().padStart(2, '0')}`,
        name: `S-4${(i + 1).toString().padStart(2, '0')}`,
        capacity: 60,
        type: "Classroom" as const,
        building: "South Block", dept: "IT" as const
    })),
    { id: "s208-a", name: "S-208 A", capacity: 30, type: "Lab", building: "South Block", dept: "IT", subjects: ["IT Workshop", "ITWS", "ITWS Lab"] },
    { id: "s208-b", name: "S-208 B", capacity: 30, type: "Lab", building: "South Block", dept: "IT", subjects: ["IT Workshop", "ITWS", "ITWS Lab"] },
    { id: "s412", name: "S-412", capacity: 40, type: "Lab", building: "South Block", dept: "GEN", subjects: ["Engineering Chemistry Lab", "EC Lab", "Chemistry Lab"] },
    { id: "s205", name: "S-205", capacity: 40, type: "Lab", building: "South Block", dept: "GEN", subjects: ["Applied Physics Lab", "Physics Lab"] },
    { id: "s108", name: "S-108", capacity: 40, type: "Lab", building: "South Block", dept: "ECE", subjects: ["Semiconductor Devices and Circuits Lab", "SDC Lab", "Electronics Lab"] },

    // Central Block (ECE/CSE Dept)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `c4${(i + 1).toString().padStart(2, '0')}`,
        name: `C-4${(i + 1).toString().padStart(2, '0')}`,
        capacity: 65,
        type: "Classroom" as const,
        building: "Central Block", dept: "ECE" as const
    })),
    { id: "c201", name: "C-201", capacity: 40, type: "Lab", building: "Central Block", dept: "ECE", subjects: ["Basic Electrical and Simulation Lab", "BES Lab", "Simulation Lab"] },
    
    // CSE Classrooms (Floor 3)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `c3${(i + 1).toString().padStart(2, '0')}`,
        name: `C-3${(i + 1).toString().padStart(2, '0')}`,
        capacity: 65,
        type: "Classroom" as const,
        building: "Central Block (Floor 3)", dept: "CSE" as const
    })),
    { id: "c-cse-lab1", name: "CSE Lab 1", capacity: 50, type: "Lab", building: "Central Block", dept: "CSE", subjects: ["Software Engineering Lab", "SE Lab"] },
    { id: "c-cse-lab2", name: "CSE Lab 2", capacity: 50, type: "Lab", building: "Central Block", dept: "CSE", subjects: ["Operating Systems Lab", "OS Lab"] },

    // North Block (AIML/CSM Dept)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `n4${(i + 1).toString().padStart(2, '0')}`,
        name: `N-4${(i + 1).toString().padStart(2, '0')}`,
        capacity: 60,
        type: "Classroom" as const,
        building: "North Block", dept: "AIML" as const
    })),
    { id: "n106", name: "N-106", capacity: 40, type: "Lab", building: "North Block", dept: "AIML", subjects: ["Machine Learning Lab", "ML Lab", "Natural Language Processing Lab", "NLP Lab"] },
    { id: "n203", name: "N-203", capacity: 60, type: "Lab", building: "North Block", dept: "AIML", subjects: ["Big Data Analytics Lab", "BDA Lab", "Web Technologies Lab", "Deep Learning Lab", "Python Programming Lab", "Data Structures Lab", "Database Management Systems Lab", "Object Oriented Programming through Java Lab"] },
    { id: "n307", name: "N-307", capacity: 40, type: "Lab", building: "North Block", dept: "GEN", subjects: ["Engineering Drawing", "EDCAD", "CAEG"] },
    { id: "n312", name: "N-312", capacity: 40, type: "Lab", building: "North Block", dept: "GEN", subjects: ["Engineering Drawing", "EDCAD", "CAEG"] },

    // Ground/Technical Labs
    { id: "tg-01", name: "TG-01", capacity: 40, type: "Lab", building: "Technical Block", dept: "GEN", subjects: ["Advanced Engineering Physics Lab", "AEP Lab"] },
    { id: "tg-02", name: "TG-02", capacity: 40, type: "Lab", building: "Technical Block", dept: "GEN", subjects: ["Advanced Engineering Physics Lab", "AEP Lab"] },
    { id: "106", name: "106", capacity: 40, type: "Lab", building: "Admin Block", dept: "CSM", subjects: ["NLP Lab", "NLP"] },

    // Generic Rooms
    { id: "aud-1", name: "IT Seminar Hall", capacity: 300, type: "Seminar Hall", building: "South Block", dept: "IT" },
    { id: "n-aud", name: "North Block Auditorium", capacity: 300, type: "Auditorium", building: "North Block", dept: "ALL" },

];
