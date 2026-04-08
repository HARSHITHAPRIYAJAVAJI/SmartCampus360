export interface Room {
    id: string;
    name: string;
    capacity: number;
    type: 'Classroom' | 'Lab' | 'Auditorium';
    building: string;
    dept?: 'IT' | 'ECE' | 'AIML' | 'GEN' | 'ALL' | 'CSE' | 'CSM';
}

export const MOCK_ROOMS: Room[] = [
    // T-Block (1st Year)
    ...[1, 2, 3, 4, 5].flatMap(floor => 
        Array.from({ length: 4 }, (_, i) => ({
            id: `t${floor}0${i+1}`, 
            name: `T-${floor}0${i+1}`, 
            capacity: 60, 
            type: "Classroom" as const, 
            building: `T Block (Floor ${floor})`, 
            dept: "GEN" as const
        }))
    ),

    // South Block (IT Dept)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `s4${(i+1).toString().padStart(2, '0')}`, 
        name: `S-4${(i+1).toString().padStart(2, '0')}`, 
        capacity: 60, 
        type: i % 3 === 0 ? "Lab" as const : "Classroom" as const, 
        building: "South Block", dept: "IT" as const
    })),
    // Additional IT (S301-312)
    ...Array.from({ length: 6 }, (_, i) => ({
        id: `s3${(i+1).toString().padStart(2, '0')}`, 
        name: `S-3${(i+1).toString().padStart(2, '0')}`, 
        capacity: 70, type: "Classroom" as const, building: "South Block (Overflow)", dept: "IT" as const
    })),

    // Central Block (ECE Dept)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `c4${(i+1).toString().padStart(2, '0')}`, 
        name: `C-4${(i+1).toString().padStart(2, '0')}`, 
        capacity: 65, type: "Classroom" as const, building: "Central Block", dept: "ECE" as const
    })),

    // North Block (AIML Dept)
    ...Array.from({ length: 12 }, (_, i) => ({
        id: `n4${(i+1).toString().padStart(2, '0')}`, 
        name: `N-4${(i+1).toString().padStart(2, '0')}`, 
        capacity: 60, type: "Classroom" as const, building: "North Block", dept: "AIML" as const
    })),
    
    // Additional rooms for CSM and CSE
    ...Array.from({ length: 8 }, (_, i) => ({
        id: `c2${(i+1).toString().padStart(2, '0')}`, 
        name: `C-2${(i+1).toString().padStart(2, '0')}`, 
        capacity: 60, type: "Classroom" as const, building: "Central Block (2nd Floor)", dept: "CSE" as const
    })),
];
