import { MOCK_FACULTY } from '../src/data/mockFaculty';

const searchNames = [
    "D. Mounika", "S. Gnaneshwari", "P. Geethanjali", "Ch. Shilpa", 
    "K. Ishwarya Devi", "V. Ramani", "R. Nagaraju", "N. Kiran Kumar",
    "N. Kiranmai", "E. Radhika", "A. Srujana", "M. A. Raghu",
    "T. Shanthi", "B. Rajendranath", "CH. Vinay Kumar", "B. Vijitha",
    "A. Srinivasa Reddy", "Syed Hussain", "M. Indira", "C. Saritha",
    "D. Uma Maheshwari", "S. Swathi", "C. Jaya Lakshmi", "P. Vijaya Kumari",
    "K. Venugopal Reddy", "P. Rajini", "B. Sunil Srinivas", "V. Pravalika"
];

const results = searchNames.map(searchName => {
    const matches = MOCK_FACULTY.filter(f => f.name.toLowerCase().includes(searchName.toLowerCase().replace("Dr. ", "").replace("Mrs. ", "").replace("Mr. ", "").replace("Ms. ", "")));
    return {
        searchName,
        found: matches.map(m => ({ id: m.id, name: m.name, specialization: m.specialization }))
    };
});

console.log(JSON.stringify(results, null, 2));
