
export interface TimetableEntry {
    id: string;
    courseCode: string;
    room: string;
}

export const AIML_TIMETABLES: Record<string, Record<string, TimetableEntry | null>> = {
    // Year 1, Semester 1 (I-I)
    "1-1": {
        // Monday
        "Monday-09:40": { id: "m-1-1", courseCode: "ED&CAD", room: "Lab" },
        "Monday-10:40": { id: "m-1-2", courseCode: "ED&CAD", room: "Lab" },
        "Monday-11:40": { id: "m-1-3", courseCode: "ED&CAD", room: "Lab" },
        "Monday-01:20": { id: "m-1-4", courseCode: "AEP", room: "Jada Shankar" },
        "Monday-02:20": { id: "m-1-5", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Monday-03:20": { id: "m-1-6", courseCode: "M&C", room: "P Sanjeeva Reddy" },

        // Tuesday
        "Tuesday-09:40": { id: "t-1-1", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Tuesday-10:40": { id: "t-1-2", courseCode: "PPS", room: "Mrs. Jhansi Rani" },
        "Tuesday-11:40": { id: "t-1-3", courseCode: "AEP", room: "Jada Shankar" },
        "Tuesday-02:20": { id: "t-1-5", courseCode: "PPS Lab", room: "Computer Lab 1" },
        "Tuesday-03:20": { id: "t-1-6", courseCode: "PPS Lab", room: "Computer Lab 1" },

        // Wednesday
        "Wednesday-10:40": { id: "w-1-2", courseCode: "AEP Lab", room: "Lab" },
        "Wednesday-11:40": { id: "w-1-3", courseCode: "AEP Lab", room: "Lab" },
        "Wednesday-01:20": { id: "w-1-4", courseCode: "ED&CAD", room: "Lab" },
        "Wednesday-02:20": { id: "w-1-5", courseCode: "PPS", room: "Mrs. Jhansi Rani" },
        "Wednesday-03:20": { id: "w-1-6", courseCode: "PPS", room: "Mrs. Jhansi Rani" },

        // Thursday
        "Thursday-09:40": { id: "th-1-1", courseCode: "AEP", room: "Jada Shankar" },
        "Thursday-10:40": { id: "th-1-2", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-11:40": { id: "th-1-3", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-01:20": { id: "th-1-4", courseCode: "PPS", room: "Mrs. Jhansi Rani" },
        "Thursday-02:20": { id: "th-1-5", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Thursday-03:20": { id: "th-1-6", courseCode: "Library", room: "Library" },

        // Friday
        "Friday-10:40": { id: "f-1-2", courseCode: "EWS", room: "Workshop" },
        "Friday-01:20": { id: "f-1-4", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Friday-02:20": { id: "f-1-5", courseCode: "AEP", room: "Jada Shankar" },
        "Friday-03:20": { id: "f-1-6", courseCode: "PPS", room: "Mrs. Jhansi Rani" },

        // Saturday
        "Saturday-09:40": { id: "sa-1-1", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Saturday-10:40": { id: "sa-1-2", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Saturday-11:40": { id: "sa-1-3", courseCode: "AEP", room: "Jada Shankar" },
        "Saturday-02:20": { id: "sa-1-5", courseCode: "ITWS", room: "M Jhansi Rani" },
    },

    // Year 2, Semester 2 (II-II) (Mapped to 2-2)
    "2-2": {
        // Monday
        "Monday-09:40": { id: "m-2-1", courseCode: "OOP JAVA Lab", room: "Nagaraju Rajupeta" },
        "Monday-10:40": { id: "m-2-2", courseCode: "OOP JAVA Lab", room: "Nagaraju Rajupeta" },
        "Monday-11:40": { id: "m-2-3", courseCode: "OOP JAVA Lab", room: "Nagaraju Rajupeta" },
        "Monday-01:20": { id: "m-2-4", courseCode: "WT", room: "K Ishwarya Devi" },
        "Monday-02:20": { id: "m-2-5", courseCode: "DAA", room: "S Gnaneshwari" },
        "Monday-03:20": { id: "m-2-6", courseCode: "SE", room: "Ch Shilpa" },

        // Tuesday
        "Tuesday-09:40": { id: "t-2-1", courseCode: "DBMS", room: "Pagilla Geethanjali" },
        "Tuesday-10:40": { id: "t-2-2", courseCode: "OOP JAVA", room: "Nagaraju Rajupeta" },
        "Tuesday-11:40": { id: "t-2-3", courseCode: "DAA", room: "S Gnaneshwari" },
        "Tuesday-02:20": { id: "t-2-5", courseCode: "WT Lab", room: "K Ishwarya Devi" },
        "Tuesday-03:20": { id: "t-2-6", courseCode: "WT Lab", room: "K Ishwarya Devi" },

        // Wednesday
        "Wednesday-09:40": { id: "w-2-1", courseCode: "AECS Lab", room: "Lab" },
        "Wednesday-10:40": { id: "w-2-2", courseCode: "AECS Lab", room: "Lab" },
        "Wednesday-11:40": { id: "w-2-3", courseCode: "AECS Lab", room: "Lab" },
        "Wednesday-01:20": { id: "w-2-4", courseCode: "WT", room: "K Ishwarya Devi" },
        "Wednesday-02:20": { id: "w-2-5", courseCode: "DAA", room: "S Gnaneshwari" },
        "Wednesday-03:20": { id: "w-2-6", courseCode: "SE", room: "Ch Shilpa" },

        // Thursday
        "Thursday-09:40": { id: "th-2-1", courseCode: "SE", room: "Ch Shilpa" },
        "Thursday-10:40": { id: "th-2-2", courseCode: "DBMS", room: "Pagilla Geethanjali" },
        "Thursday-11:40": { id: "th-2-3", courseCode: "OOP JAVA", room: "Nagaraju Rajupeta" },
        "Thursday-02:20": { id: "th-2-5", courseCode: "DBMS Lab", room: "Pagilla Geethanjali" },
        "Thursday-03:20": { id: "th-2-6", courseCode: "DBMS Lab", room: "Pagilla Geethanjali" },

        // Friday
        "Friday-09:40": { id: "f-2-1", courseCode: "DAA", room: "S Gnaneshwari" },
        "Friday-10:40": { id: "f-2-2", courseCode: "OOP JAVA", room: "Nagaraju Rajupeta" },
        "Friday-11:40": { id: "f-2-3", courseCode: "SE", room: "Ch Shilpa" },
        "Friday-01:20": { id: "f-2-4", courseCode: "DBMS", room: "Pagilla Geethanjali" },
        "Friday-02:20": { id: "f-2-5", courseCode: "WT", room: "K Ishwarya Devi" },
        "Friday-03:20": { id: "f-2-6", courseCode: "ES", room: "Guest/Faculty" },

        // Saturday
        "Saturday-09:40": { id: "sa-2-1", courseCode: "DBMS", room: "Pagilla Geethanjali" },
        "Saturday-10:40": { id: "sa-2-2", courseCode: "DAA", room: "S Gnaneshwari" },
        "Saturday-11:40": { id: "sa-2-3", courseCode: "OOP JAVA", room: "Nagaraju Rajupeta" },
        "Saturday-01:20": { id: "sa-2-4", courseCode: "SE", room: "Ch Shilpa" },
        "Saturday-02:20": { id: "sa-2-5", courseCode: "WT", room: "K Ishwarya Devi" },
        "Saturday-03:20": { id: "sa-2-6", courseCode: "Mentoring", room: "All Staff" },
    }
};

export const FACULTY_LOAD = {
    // 1st Year Sem 2 (I-II)
    "1-2": [
        { code: "DS", faculty: "Mrs. M. Suryakumari", room: "Classroom 101" },
        { code: "DS Lab", faculty: "Mr. K. Venugopal Reddy", room: "Lab 2" },
        { code: "PP Lab", faculty: "Mrs. M. Indira", room: "Lab 3" },
        { code: "PP", faculty: "Mrs. D Mounika", room: "Classroom 101" }
    ],
    // 2nd Year Sem 1 (II-I)
    "2-1": [
        { code: "CAO", faculty: "Mrs. Ch. Shilpa", room: "Classroom 201" },
        { code: "MFCS", faculty: "Mrs. T. Praneetha", room: "Classroom 201" },
        { code: "CN", faculty: "Mrs. S. Swathi", room: "Classroom 201" },
        { code: "PP", faculty: "Mrs. D Mounika", room: "Classroom 201" },
        { code: "PP Lab", faculty: "Mrs. S. Gnaneshwari", room: "Lab 1" }
    ],
    // 3rd Year Sem 1 (III-I)
    "3-1": [
        { code: "ML", faculty: "Mrs. C. Jaya Lakshmi", room: "Classroom 301" },
        { code: "AI", faculty: "Mr. N. Kiran Kumar", room: "Classroom 301" },
        { code: "OS", faculty: "Mrs. K. Ishwarya devi", room: "Classroom 301" },
        { code: "OOAD", faculty: "Mrs. P. Geethanjali", room: "Classroom 301" },
        { code: "ATCD", faculty: "Mrs. D Uma Maheshwari", room: "Classroom 301" },
        { code: "DevOps", faculty: "Mr. Ande Srinivasa Reddy", room: "Lab 4" }
    ],
    // 3rd Year Sem 2 (III-II)
    "3-2": [
        { code: "DL", faculty: "Mrs. C. Jaya Lakshmi", room: "Classroom 301" },
        { code: "DL Lab", faculty: "Mrs. B. Vijitha", room: "Lab AI" },
        { code: "NLP", faculty: "Mrs. C. Saritha Reddy", room: "Classroom 301" },
        { code: "RPA", faculty: "Mr. Ande Srinivasa Reddy", room: "Lab 3" },
        { code: "Conv. AI", faculty: "Dr. Syed Hussain", room: "Classroom 301" },
        { code: "OE", faculty: "Mrs. V. Pravalika", room: "Hall B" }
    ],
    // 4th Year Sem 1 (IV-I)
    "4-1": [
        { code: "BDA", faculty: "Dr. KSR Radhika", room: "Classroom 401" },
        { code: "IS", faculty: "Mrs. E. Radhika", room: "Classroom 401" },
        { code: "KRR", faculty: "Mr. K. Venugopal Reddy", room: "Classroom 401" }
    ],
    // 4th Year Sem 2 (IV-II)
    "4-2": [
        { code: "RL", faculty: "Dr. KSR Radhika", room: "Classroom 401" },
        { code: "QC", faculty: "Mrs. D Uma Maheshwari", room: "Classroom 401" },
        { code: "FDS", faculty: "Dr. B. Sunil Srinivas", room: "Hall A" },
        { code: "ITE", faculty: "Mrs. E. Radhika", room: "Classroom 401" }
    ]
};
