import { MOCK_FACULTY } from "../src/data/mockFaculty";

const providedFaculty = [
  "J. Rama Krishna", "P. Sanjeeva Reddy", "K. Snehalatha", "B. Mahesh",
  "Jada Shankar", "P. Venkatesh", "B. Rajinikanth", "B. Narasimha",
  "Prathibha", "Mamatha", "A. Premalatha",
  "Anitha", "Vijayashree", "Suryakumari", "M. Jhansi Rani",
  "N. Surya", "N. Pavani Kumari", "D. Himaja", "G. Tirupathi", "S. Triloknath Reddy",
  "D. Gopi Krishna",
  "R. P. Sreedevi", "Jahangeer",
  "S. Gnaneshwari", "D. Mounika", "Indira",
  "G. V. Subbarao", "M. Vaishnavi", "R. N. S. Kalpana",
  "T. Praneetha", "A. Srujana Reddy",
  "Ch. Shilpa",
  "R. Nagaraju", "Swathi",
  "C. Saritha", "N. Kiran Kumar",
  "C. Jaya Lakshmi", "P. Vijaya Kumari",
  "A. Srinivasa Reddy", "S. Manjula",
  "B. Vijitha", "P. Rajini",
  "P. Geethanjali",
  "K. Ishwarya Devi", "D. Uma Maheshwari",
  "E. Radhika",
  "B. Rajendranath", "CH. Vinay Kumar", "Syed Hussain"
];

const facultyInDb = MOCK_FACULTY.map(f => f.name);

console.log("Existing Faculty (Matches Found):");
const found = providedFaculty.filter(name => {
    return facultyInDb.some(db => db.includes(name) || name.includes(db));
});
console.log(found.join(", "));

console.log("\nFaculty to Create (Missing):");
const missing = providedFaculty.filter(name => {
    return !facultyInDb.some(db => db.includes(name) || name.includes(db));
});
console.log(missing.join(", "));
