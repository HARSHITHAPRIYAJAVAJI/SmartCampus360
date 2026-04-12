import { MOCK_FACULTY } from '../src/data/mockFaculty';

const keywords = ["math", "calculus", "matrices", "la&ode", "p&s", "statistics"];

const mathFaculty = MOCK_FACULTY.filter(f => 
    f.department === 'GEN' || 
    f.department === 'Mathematics' ||
    f.specialization?.some(s => keywords.some(k => s.toLowerCase().includes(k)))
);

console.log(JSON.stringify(mathFaculty.map(f => ({ id: f.id, name: f.name, specialization: f.specialization })), null, 2));
