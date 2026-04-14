
const fs = require('fs');
const path = require('path');

const files = [
    'c:/Users/harsh/REACT PROJECT/SmartCampus360/src/data/mockStudents.ts',
    'c:/Users/harsh/REACT PROJECT/SmartCampus360/src/data/mockStudents.json'
];

files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        console.log(`Processing ${filePath}...`);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find all "attendance": XX where XX >= 92 and replace with a random value between 75 and 91
        const regex = /"attendance":\s*(9[2-9]|100)\b/g;
        let count = 0;
        const newContent = content.replace(regex, (match, p1) => {
            count++;
            const newVal = Math.floor(Math.random() * (91 - 75 + 1)) + 75;
            return `"attendance": ${newVal}`;
        });
        
        if (count > 0) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${count} instances in ${filePath}`);
        } else {
            console.log(`No high attendance values found in ${filePath}`);
        }
    } else {
        console.log(`File not found: ${filePath}`);
    }
});
