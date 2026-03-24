const fs = require('fs');
const path = require('path');

const srcPath = path.join(process.cwd(), 'src/data/aimlTimetable.ts');
let content = fs.readFileSync(srcPath, 'utf8');

const theoriesMap = {
    '1-1': [{code: 'C', room: 'Dr. K. Srinivas'}, {code: 'M&C', room: 'P Sanjeeva Reddy'}, {code: 'EDC', room: 'Nelluri Prathibha'}],
    '2-2': [{code: 'DAA', room: 'S Gnaneshwari'}, {code: 'DBMS', room: 'Pagilla Geethanjali'}, {code: 'JAVA', room: 'Nagaraju Rajupeta'}, {code: 'ML', room: 'Dr. KSR Radhika'}, {code: 'OOPS', room: 'K Ishwarya Devi'}, {code: 'SE', room: 'Ch Shilpa'}, {code: 'WT', room: 'K Ishwarya Devi'}],
    '1-2': [{code: 'DS', room: 'Mrs. M. Suryakumari'}, {code: 'PP', room: 'Mrs. D Mounika'}],
    '2-1': [{code: 'CAO', room: 'Mrs. Ch. Shilpa'}, {code: 'MFCS', room: 'Mrs. T. Praneetha'}, {code: 'CN', room: 'Mrs. S. Swathi'}, {code: 'PP', room: 'Mrs. D Mounika'}],
    '3-1': [{code: 'AI', room: 'Mr. N. Kiran Kumar'}, {code: 'ATCD', room: 'Mrs. D Uma Maheshwari'}, {code: 'ML', room: 'Mrs. C. Jaya Lakshmi'}, {code: 'OOAD', room: 'Mrs. P. Geethanjali'}, {code: 'OS', room: 'Mrs. K. Ishwarya devi'}],
    '3-2': [{code: 'Conv. AI', room: 'Dr. Syed Hussain'}, {code: 'NLP', room: 'Mrs. C. Saritha Reddy'}, {code: 'DL', room: 'Mrs. C. Jaya Lakshmi'}, {code: 'IS', room: 'Mrs. E. Radhika'}, {code: 'OE', room: 'Mrs. V. Pravalika'}],
    '4-1': [{code: 'BDA', room: 'Dr. KSR Radhika'}, {code: 'DM', room: 'Mrs. V. Pravalika'}, {code: 'IS', room: 'Mrs. E. Radhika'}, {code: 'KRR', room: 'Mr. K. Venugopal Reddy'}],
    '4-2': [{code: 'RL', room: 'Dr. KSR Radhika'}, {code: 'QC', room: 'Mrs. D Uma Maheshwari'}, {code: 'OE', room: 'Mrs. V. Pravalika'}, {code: 'DS OE', room: 'Dr. B. Sunil Srinivas'}]
};
theoriesMap['1-1-B'] = theoriesMap['1-1'];
theoriesMap['1-1-C'] = theoriesMap['1-1'];

const sections = Object.keys(theoriesMap);

for (const sec of sections) {
    const secRegex = new RegExp('(\"' + sec + '\": \\{)([\\s\\S]*?)(\\n\\s*\\},)', 'g');
    content = content.replace(secRegex, (match, prefix, block, suffix) => {
        let lines = block.split('\n');
        
        let labCounts = {};
        let theoryIdx = 0;
        let theories = theoriesMap[sec];

        let newLines = lines.map(line => {
            if (line.includes('courseCode:')) {
                const courseMatch = line.match(/courseCode:\s*"([^"]+)"/);
                if (courseMatch) {
                    const course = courseMatch[1];
                    const isLab = (course.toLowerCase().includes('lab') && !course.includes('Library')) || course === 'DevOps' || course === 'RPA';
                    
                    if (isLab) {
                        if (!labCounts[course]) labCounts[course] = 0;
                        labCounts[course]++;
                        
                        // If we have seen this lab more than 3 times, replace it!
                        if (labCounts[course] > 3) {
                            const theory = theories[theoryIdx % theories.length];
                            theoryIdx++;
                            // replace courseCode and room
                            let replacedLine = line.replace(/courseCode:\s*"([^"]+)"/, `courseCode: "${theory.code}"`);
                            replacedLine = replacedLine.replace(/room:\s*"([^"]+)"/, `room: "${theory.room}"`);
                            return replacedLine;
                        }
                    } else if (course === "Major Project") {
                        // Keep major project as is
                    }
                }
            }
            return line;
        });
        
        return prefix + newLines.join('\n') + suffix;
    });
}

fs.writeFileSync(srcPath, content, 'utf8');
console.log('Fixed aimlTimetable.ts successfully');
