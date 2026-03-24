
export interface TimetableEntry {
    id: string;
    courseCode: string;
    room: string;
}

export const AIML_TIMETABLES: Record<string, Record<string, TimetableEntry | null>> = {
    // Year 1, Semester 1 (I-I)
    "1-1": {
        // Monday
        "Monday-09:40": { id: "m-1-1", courseCode: "C Lab", room: "Lab" },
        "Monday-10:40": { id: "m-1-2", courseCode: "C Lab", room: "Lab" },
        "Monday-11:40": { id: "m-1-3", courseCode: "C Lab", room: "Lab" },
        "Monday-01:20": { id: "m-1-4", courseCode: "C", room: "Nelluri Prathibha" },
        "Monday-02:20": { id: "m-1-5", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Monday-03:20": { id: "m-1-6", courseCode: "M&C", room: "P Sanjeeva Reddy" },

        // Tuesday
        "Tuesday-09:40": { id: "t-1-1", courseCode: "EDC", room: "Dr. K. Srinivas" },
        "Tuesday-10:40": { id: "t-1-2", courseCode: "C", room: "Dr. K. Srinivas" },
        "Tuesday-11:40": { id: "t-1-3", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Tuesday-01:20": { id: "t-1-4", courseCode: "ITWS Lab", room: "Workshop" },
        "Tuesday-02:20": { id: "t-1-5", courseCode: "ITWS Lab", room: "Workshop" },
        "Tuesday-03:20": { id: "t-1-6", courseCode: "ITWS Lab", room: "Workshop" },

        // Wednesday
        "Wednesday-09:40": { id: "w-1-1", courseCode: "C", room: "Dr. K. Srinivas" },
        "Wednesday-10:40": { id: "w-1-2", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Wednesday-11:40": { id: "w-1-3", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Wednesday-01:20": { id: "w-1-4", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Wednesday-02:20": { id: "w-1-5", courseCode: "C", room: "Dr. K. Srinivas" },
        "Wednesday-03:20": { id: "w-1-6", courseCode: "C", room: "Dr. K. Srinivas" },

        // Thursday
        "Thursday-09:40": { id: "th-1-1", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-10:40": { id: "th-1-2", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-11:40": { id: "th-1-3", courseCode: "C", room: "Dr. K. Srinivas" },
        "Thursday-01:20": { id: "th-1-4", courseCode: "C", room: "Dr. K. Srinivas" },
        "Thursday-02:20": { id: "th-1-5", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-03:20": { id: "th-1-6", courseCode: "EDC", room: "Nelluri Prathibha" },

        // Friday
        "Friday-09:40": { id: "f-1-1", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Friday-10:40": { id: "f-1-2", courseCode: "C", room: "Dr. K. Srinivas" },
        "Friday-11:40": { id: "f-1-3", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Friday-01:20": { id: "f-1-4", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Friday-02:20": { id: "f-1-5", courseCode: "Library", room: "Library" },
        "Friday-03:20": { id: "f-1-6", courseCode: "C", room: "Dr. K. Srinivas" },

        // Saturday
        "Saturday-09:40": { id: "sa-1-1", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Saturday-10:40": { id: "sa-1-2", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Saturday-11:40": { id: "sa-1-3", courseCode: "C", room: "Dr. K. Srinivas" },
        "Saturday-01:20": { id: "sa-1-4", courseCode: "C", room: "Dr. K. Srinivas" },
        "Saturday-02:20": { id: "sa-1-5", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Saturday-03:20": { id: "sa-1-6", courseCode: "EDC", room: "Nelluri Prathibha" },
    },

    // Year 2, Semester 2 (II-II) (Mapped to 2-2)
    "2-2": {
        // Monday
        "Monday-09:40": { id: "m-2-1", courseCode: "JAVA Lab", room: "Nagaraju Rajupeta" },
        "Monday-10:40": { id: "m-2-2", courseCode: "JAVA Lab", room: "Nagaraju Rajupeta" },
        "Monday-11:40": { id: "m-2-3", courseCode: "JAVA Lab", room: "Nagaraju Rajupeta" },
        "Monday-01:20": { id: "m-2-4", courseCode: "WT", room: "K Ishwarya Devi" },
        "Monday-02:20": { id: "m-2-5", courseCode: "DAA", room: "S Gnaneshwari" },
        "Monday-03:20": { id: "m-2-6", courseCode: "SE", room: "Ch Shilpa" },

        // Tuesday
        "Tuesday-09:40": { id: "t-2-1", courseCode: "DBMS", room: "Pagilla Geethanjali" },
        "Tuesday-10:40": { id: "t-2-2", courseCode: "JAVA", room: "Nagaraju Rajupeta" },
        "Tuesday-11:40": { id: "t-2-3", courseCode: "DAA", room: "S Gnaneshwari" },
        "Tuesday-01:20": { id: "t-2-4", courseCode: "WT Lab", room: "K Ishwarya Devi" },
        "Tuesday-02:20": { id: "t-2-5", courseCode: "WT Lab", room: "K Ishwarya Devi" },
        "Tuesday-03:20": { id: "t-2-6", courseCode: "WT Lab", room: "K Ishwarya Devi" },

        // Wednesday
        "Wednesday-09:40": { id: "w-2-1", courseCode: "DBMS Lab", room: "Pagilla Geethanjali" },
        "Wednesday-10:40": { id: "w-2-2", courseCode: "DBMS Lab", room: "Pagilla Geethanjali" },
        "Wednesday-11:40": { id: "w-2-3", courseCode: "DBMS Lab", room: "Pagilla Geethanjali" },
        "Wednesday-01:20": { id: "w-2-4", courseCode: "ML", room: "Dr. KSR Radhika" },
        "Wednesday-02:20": { id: "w-2-5", courseCode: "OOPS", room: "K Ishwarya Devi" },
        "Wednesday-03:20": { id: "w-2-6", courseCode: "SE", room: "Ch Shilpa" },

        // Thursday
        "Thursday-09:40": { id: "th-2-1", courseCode: "SE", room: "Ch Shilpa" },
        "Thursday-10:40": { id: "th-2-2", courseCode: "DBMS", room: "Pagilla Geethanjali" },
        "Thursday-11:40": { id: "th-2-3", courseCode: "JAVA", room: "Nagaraju Rajupeta" },
        "Thursday-01:20": { id: "th-2-4", courseCode: "DAA", room: "S Gnaneshwari" },
        "Thursday-02:20": { id: "th-2-5", courseCode: "DBMS", room: "Pagilla Geethanjali" },
        "Thursday-03:20": { id: "th-2-6", courseCode: "JAVA", room: "Nagaraju Rajupeta" },

        // Friday
        "Friday-09:40": { id: "f-2-1", courseCode: "DAA", room: "S Gnaneshwari" },
        "Friday-10:40": { id: "f-2-2", courseCode: "JAVA", room: "Nagaraju Rajupeta" },
        "Friday-11:40": { id: "f-2-3", courseCode: "SE", room: "Ch Shilpa" },
        "Friday-01:20": { id: "f-2-4", courseCode: "DBMS", room: "Pagilla Geethanjali" },
        "Friday-02:20": { id: "f-2-5", courseCode: "WT", room: "K Ishwarya Devi" },
        "Friday-03:20": { id: "f-2-6", courseCode: "ML", room: "Dr. KSR Radhika" },

        // Saturday
        "Saturday-09:40": { id: "sa-2-1", courseCode: "DBMS", room: "Pagilla Geethanjali" },
        "Saturday-10:40": { id: "sa-2-2", courseCode: "DAA", room: "S Gnaneshwari" },
        "Saturday-11:40": { id: "sa-2-3", courseCode: "JAVA", room: "Nagaraju Rajupeta" },
        "Saturday-01:20": { id: "sa-2-4", courseCode: "ML", room: "Dr. KSR Radhika" },
        "Saturday-02:20": { id: "sa-2-5", courseCode: "OOPS", room: "K Ishwarya Devi" },
        "Saturday-03:20": { id: "sa-2-6", courseCode: "SE", room: "Ch Shilpa" },
    },

    // Year 1, Semester 2 (I-II)
    "1-2": {
        "Monday-09:40": { id: "1_2-m-1", courseCode: "DS Lab", room: "Mr. K. Venugopal Reddy" },
        "Monday-10:40": { id: "1_2-m-2", courseCode: "DS Lab", room: "Mr. K. Venugopal Reddy" },
        "Monday-11:40": { id: "1_2-m-3", courseCode: "DS Lab", room: "Mr. K. Venugopal Reddy" },
        "Monday-01:20": { id: "1_2-m-4", courseCode: "PP", room: "Mrs. D Mounika" },
        "Monday-02:20": { id: "1_2-m-5", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Monday-03:20": { id: "1_2-m-6", courseCode: "PP", room: "Mrs. D Mounika" },

        "Tuesday-09:40": { id: "1_2-t-1", courseCode: "PP", room: "Mrs. D Mounika" },
        "Tuesday-10:40": { id: "1_2-t-2", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Tuesday-11:40": { id: "1_2-t-3", courseCode: "PP", room: "Mrs. D Mounika" },
        "Tuesday-01:20": { id: "1_2-t-4", courseCode: "PP Lab", room: "Mrs. M. Indira" },
        "Tuesday-02:20": { id: "1_2-t-5", courseCode: "PP Lab", room: "Mrs. M. Indira" },
        "Tuesday-03:20": { id: "1_2-t-6", courseCode: "PP Lab", room: "Mrs. M. Indira" },

        "Wednesday-09:40": { id: "1_2-w-1", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Wednesday-10:40": { id: "1_2-w-2", courseCode: "PP", room: "Mrs. D Mounika" },
        "Wednesday-11:40": { id: "1_2-w-3", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Wednesday-01:20": { id: "1_2-w-4", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Wednesday-02:20": { id: "1_2-w-5", courseCode: "PP", room: "Mrs. D Mounika" },
        "Wednesday-03:20": { id: "1_2-w-6", courseCode: "DS", room: "Mrs. M. Suryakumari" },

        "Thursday-09:40": { id: "1_2-th-1", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Thursday-10:40": { id: "1_2-th-2", courseCode: "PP", room: "Mrs. D Mounika" },
        "Thursday-11:40": { id: "1_2-th-3", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Thursday-01:20": { id: "1_2-th-4", courseCode: "PP", room: "Mrs. D Mounika" },
        "Thursday-02:20": { id: "1_2-th-5", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Thursday-03:20": { id: "1_2-th-6", courseCode: "PP", room: "Mrs. D Mounika" },

        "Friday-09:40": { id: "1_2-f-1", courseCode: "PP", room: "Mrs. D Mounika" },
        "Friday-10:40": { id: "1_2-f-2", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Friday-11:40": { id: "1_2-f-3", courseCode: "PP", room: "Mrs. D Mounika" },
        "Friday-01:20": { id: "1_2-f-4", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Friday-02:20": { id: "1_2-f-5", courseCode: "PP", room: "Mrs. D Mounika" },
        "Friday-03:20": { id: "1_2-f-6", courseCode: "DS", room: "Mrs. M. Suryakumari" },

        "Saturday-09:40": { id: "1_2-sa-1", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Saturday-10:40": { id: "1_2-sa-2", courseCode: "PP", room: "Mrs. D Mounika" },
        "Saturday-11:40": { id: "1_2-sa-3", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Saturday-01:20": { id: "1_2-sa-4", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Saturday-02:20": { id: "1_2-sa-5", courseCode: "PP", room: "Mrs. D Mounika" },
        "Saturday-03:20": { id: "1_2-sa-6", courseCode: "DS", room: "Mrs. M. Suryakumari" },
    },

    // Year 2, Semester 1 (II-I)
    "2-1": {
        "Monday-09:40": { id: "2_1-m-1", courseCode: "PP Lab", room: "Mrs. S. Gnaneshwari" },
        "Monday-10:40": { id: "2_1-m-2", courseCode: "PP Lab", room: "Mrs. S. Gnaneshwari" },
        "Monday-11:40": { id: "2_1-m-3", courseCode: "PP Lab", room: "Mrs. S. Gnaneshwari" },
        "Monday-01:20": { id: "2_1-m-4", courseCode: "CAO", room: "Mrs. Ch. Shilpa" },
        "Monday-02:20": { id: "2_1-m-5", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Monday-03:20": { id: "2_1-m-6", courseCode: "CN", room: "Mrs. S. Swathi" },

        "Tuesday-09:40": { id: "2_1-t-1", courseCode: "CAO", room: "Mrs. Ch. Shilpa" },
        "Tuesday-10:40": { id: "2_1-t-2", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Tuesday-11:40": { id: "2_1-t-3", courseCode: "PP", room: "Mrs. D Mounika" },
        "Tuesday-01:20": { id: "2_1-t-4", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Tuesday-02:20": { id: "2_1-t-5", courseCode: "CAO", room: "Mrs. Ch. Shilpa" },
        "Tuesday-03:20": { id: "2_1-t-6", courseCode: "MFCS", room: "Mrs. T. Praneetha" },

        "Wednesday-09:40": { id: "2_1-w-1", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Wednesday-10:40": { id: "2_1-w-2", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Wednesday-11:40": { id: "2_1-w-3", courseCode: "CAO", room: "Mrs. Ch. Shilpa" },
        "Wednesday-01:20": { id: "2_1-w-4", courseCode: "CAO", room: "Mrs. Ch. Shilpa" },
        "Wednesday-02:20": { id: "2_1-w-5", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Wednesday-03:20": { id: "2_1-w-6", courseCode: "CN", room: "Mrs. S. Swathi" },

        "Thursday-09:40": { id: "2_1-th-1", courseCode: "PP", room: "Mrs. D Mounika" },
        "Thursday-10:40": { id: "2_1-th-2", courseCode: "CAO", room: "Mrs. Ch. Shilpa" },
        "Thursday-11:40": { id: "2_1-th-3", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Thursday-01:20": { id: "2_1-th-4", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Thursday-02:20": { id: "2_1-th-5", courseCode: "PP", room: "Mrs. D Mounika" },
        "Thursday-03:20": { id: "2_1-th-6", courseCode: "CAO", room: "Mrs. Ch. Shilpa" },

        "Friday-09:40": { id: "2_1-f-1", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Friday-10:40": { id: "2_1-f-2", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Friday-11:40": { id: "2_1-f-3", courseCode: "PP", room: "Mrs. D Mounika" },
        "Friday-01:20": { id: "2_1-f-4", courseCode: "CAO", room: "Mrs. Ch. Shilpa" },
        "Friday-02:20": { id: "2_1-f-5", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Friday-03:20": { id: "2_1-f-6", courseCode: "MFCS", room: "Mrs. T. Praneetha" },

        "Saturday-09:40": { id: "2_1-sa-1", courseCode: "CAO", room: "Mrs. Ch. Shilpa" },
        "Saturday-10:40": { id: "2_1-sa-2", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Saturday-11:40": { id: "2_1-sa-3", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Saturday-01:20": { id: "2_1-sa-4", courseCode: "PP", room: "Mrs. D Mounika" },
        "Saturday-02:20": { id: "2_1-sa-5", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Saturday-03:20": { id: "2_1-sa-6", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
    },
};

// Year 3, Semester 1 (III-I) — added to AIML_TIMETABLES via module augmentation pattern
// We extend AIML_TIMETABLES in-place by re-declaring entries below via Object.assign at runtime.
// Actually -- let's just add to the main object above. Putting the data here as a separate const.

export const EXTRA_TIMETABLES: Record<string, Record<string, { id: string; courseCode: string; room: string } | null>> = {
    // Year 3, Semester 1 (III-I)
    "3-1": {
        "Monday-09:40": { id: "3_1-m-1", courseCode: "DevOps", room: "Mr. Ande Srinivasa Reddy" },
        "Monday-10:40": { id: "3_1-m-2", courseCode: "DevOps", room: "Mr. Ande Srinivasa Reddy" },
        "Monday-11:40": { id: "3_1-m-3", courseCode: "DevOps", room: "Mr. Ande Srinivasa Reddy" },
        "Monday-01:20": { id: "3_1-m-4", courseCode: "AI", room: "Mr. N. Kiran Kumar" },
        "Monday-02:20": { id: "3_1-m-5", courseCode: "ATCD", room: "Mrs. D Uma Maheshwari" },
        "Monday-03:20": { id: "3_1-m-6", courseCode: "ML", room: "Mrs. C. Jaya Lakshmi" },

        "Tuesday-09:40": { id: "3_1-t-1", courseCode: "OOAD", room: "Mrs. P. Geethanjali" },
        "Tuesday-10:40": { id: "3_1-t-2", courseCode: "OS", room: "Mrs. K. Ishwarya devi" },
        "Tuesday-11:40": { id: "3_1-t-3", courseCode: "AI", room: "Mr. N. Kiran Kumar" },
        "Tuesday-01:20": { id: "3_1-t-4", courseCode: "ATCD", room: "Mrs. D Uma Maheshwari" },
        "Tuesday-02:20": { id: "3_1-t-5", courseCode: "ML", room: "Mrs. C. Jaya Lakshmi" },
        "Tuesday-03:20": { id: "3_1-t-6", courseCode: "OOAD", room: "Mrs. P. Geethanjali" },

        "Wednesday-09:40": { id: "3_1-w-1", courseCode: "OS", room: "Mrs. K. Ishwarya devi" },
        "Wednesday-10:40": { id: "3_1-w-2", courseCode: "AI", room: "Mr. N. Kiran Kumar" },
        "Wednesday-11:40": { id: "3_1-w-3", courseCode: "ATCD", room: "Mrs. D Uma Maheshwari" },
        "Wednesday-01:20": { id: "3_1-w-4", courseCode: "AI", room: "Mr. N. Kiran Kumar" },
        "Wednesday-02:20": { id: "3_1-w-5", courseCode: "ATCD", room: "Mrs. D Uma Maheshwari" },
        "Wednesday-03:20": { id: "3_1-w-6", courseCode: "ML", room: "Mrs. C. Jaya Lakshmi" },

        "Thursday-09:40": { id: "3_1-th-1", courseCode: "ML", room: "Mrs. C. Jaya Lakshmi" },
        "Thursday-10:40": { id: "3_1-th-2", courseCode: "OOAD", room: "Mrs. P. Geethanjali" },
        "Thursday-11:40": { id: "3_1-th-3", courseCode: "OS", room: "Mrs. K. Ishwarya devi" },
        "Thursday-01:20": { id: "3_1-th-4", courseCode: "AI", room: "Mr. N. Kiran Kumar" },
        "Thursday-02:20": { id: "3_1-th-5", courseCode: "ATCD", room: "Mrs. D Uma Maheshwari" },
        "Thursday-03:20": { id: "3_1-th-6", courseCode: "OS", room: "Mrs. K. Ishwarya devi" },

        "Friday-09:40": { id: "3_1-f-1", courseCode: "AI", room: "Mr. N. Kiran Kumar" },
        "Friday-10:40": { id: "3_1-f-2", courseCode: "ML", room: "Mrs. C. Jaya Lakshmi" },
        "Friday-11:40": { id: "3_1-f-3", courseCode: "ATCD", room: "Mrs. D Uma Maheshwari" },
        "Friday-01:20": { id: "3_1-f-4", courseCode: "OOAD", room: "Mrs. P. Geethanjali" },
        "Friday-02:20": { id: "3_1-f-5", courseCode: "OS", room: "Mrs. K. Ishwarya devi" },
        "Friday-03:20": { id: "3_1-f-6", courseCode: "AI", room: "Mr. N. Kiran Kumar" },

        "Saturday-09:40": { id: "3_1-sa-1", courseCode: "ATCD", room: "Mrs. D Uma Maheshwari" },
        "Saturday-10:40": { id: "3_1-sa-2", courseCode: "ML", room: "Mrs. C. Jaya Lakshmi" },
        "Saturday-11:40": { id: "3_1-sa-3", courseCode: "OOAD", room: "Mrs. P. Geethanjali" },
        "Saturday-01:20": { id: "3_1-sa-4", courseCode: "OS", room: "Mrs. K. Ishwarya devi" },
        "Saturday-02:20": { id: "3_1-sa-5", courseCode: "AI", room: "Mr. N. Kiran Kumar" },
        "Saturday-03:20": { id: "3_1-sa-6", courseCode: "Mentoring", room: "All Staff" },
    },

    // Year 3, Semester 2 (III-II)
    "3-2": {
        "Monday-09:40": { id: "3_2-m-1", courseCode: "NLP Lab", room: "Mrs. B. Vijitha" },
        "Monday-10:40": { id: "3_2-m-2", courseCode: "NLP Lab", room: "Mrs. B. Vijitha" },
        "Monday-11:40": { id: "3_2-m-3", courseCode: "NLP Lab", room: "Mrs. B. Vijitha" },
        "Monday-01:20": { id: "3_2-m-4", courseCode: "Conv. AI", room: "Dr. Syed Hussain" },
        "Monday-02:20": { id: "3_2-m-5", courseCode: "NLP", room: "Mrs. C. Saritha Reddy" },
        "Monday-03:20": { id: "3_2-m-6", courseCode: "DL", room: "Mrs. C. Jaya Lakshmi" },

        "Tuesday-09:40": { id: "3_2-t-1", courseCode: "DL Lab", room: "Mrs. B. Vijitha" },
        "Tuesday-10:40": { id: "3_2-t-2", courseCode: "DL Lab", room: "Mrs. B. Vijitha" },
        "Tuesday-11:40": { id: "3_2-t-3", courseCode: "DL Lab", room: "Mrs. B. Vijitha" },
        "Tuesday-01:20": { id: "3_2-t-4", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Tuesday-02:20": { id: "3_2-t-5", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Tuesday-03:20": { id: "3_2-t-6", courseCode: "Conv. AI", room: "Dr. Syed Hussain" },

        "Wednesday-09:40": { id: "3_2-w-1", courseCode: "RPA", room: "Mr. Ande Srinivasa Reddy" },
        "Wednesday-10:40": { id: "3_2-w-2", courseCode: "RPA", room: "Mr. Ande Srinivasa Reddy" },
        "Wednesday-11:40": { id: "3_2-w-3", courseCode: "RPA", room: "Mr. Ande Srinivasa Reddy" },
        "Wednesday-01:20": { id: "3_2-w-4", courseCode: "NLP", room: "Mrs. C. Saritha Reddy" },
        "Wednesday-02:20": { id: "3_2-w-5", courseCode: "DL", room: "Mrs. C. Jaya Lakshmi" },
        "Wednesday-03:20": { id: "3_2-w-6", courseCode: "IS", room: "Mrs. E. Radhika" },

        "Thursday-09:40": { id: "3_2-th-1", courseCode: "Conv. AI", room: "Dr. Syed Hussain" },
        "Thursday-10:40": { id: "3_2-th-2", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Thursday-11:40": { id: "3_2-th-3", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Thursday-01:20": { id: "3_2-th-4", courseCode: "Conv. AI", room: "Dr. Syed Hussain" },
        "Thursday-02:20": { id: "3_2-th-5", courseCode: "NLP", room: "Mrs. C. Saritha Reddy" },
        "Thursday-03:20": { id: "3_2-th-6", courseCode: "DL", room: "Mrs. C. Jaya Lakshmi" },

        "Friday-09:40": { id: "3_2-f-1", courseCode: "NLP", room: "Mrs. C. Saritha Reddy" },
        "Friday-10:40": { id: "3_2-f-2", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Friday-11:40": { id: "3_2-f-3", courseCode: "DL", room: "Mrs. C. Jaya Lakshmi" },
        "Friday-01:20": { id: "3_2-f-4", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Friday-02:20": { id: "3_2-f-5", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Friday-03:20": { id: "3_2-f-6", courseCode: "Conv. AI", room: "Dr. Syed Hussain" },

        "Saturday-09:40": { id: "3_2-sa-1", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Saturday-10:40": { id: "3_2-sa-2", courseCode: "Conv. AI", room: "Dr. Syed Hussain" },
        "Saturday-11:40": { id: "3_2-sa-3", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Saturday-01:20": { id: "3_2-sa-4", courseCode: "NLP", room: "Mrs. C. Saritha Reddy" },
        "Saturday-02:20": { id: "3_2-sa-5", courseCode: "DL", room: "Mrs. C. Jaya Lakshmi" },
        "Saturday-03:20": { id: "3_2-sa-6", courseCode: "Mentoring", room: "All Staff" },
    },

    // Year 4, Semester 1 (IV-I)
    "4-1": {
        "Monday-09:40": { id: "4_1-m-1", courseCode: "BDA Lab", room: "Dr. KSR Radhika" },
        "Monday-10:40": { id: "4_1-m-2", courseCode: "BDA Lab", room: "Dr. KSR Radhika" },
        "Monday-11:40": { id: "4_1-m-3", courseCode: "BDA Lab", room: "Dr. KSR Radhika" },
        "Monday-01:20": { id: "4_1-m-4", courseCode: "BDA", room: "Dr. KSR Radhika" },
        "Monday-02:20": { id: "4_1-m-5", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Monday-03:20": { id: "4_1-m-6", courseCode: "IS", room: "Mrs. E. Radhika" },

        "Tuesday-09:40": { id: "4_1-t-1", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Tuesday-10:40": { id: "4_1-t-2", courseCode: "BDA", room: "Dr. KSR Radhika" },
        "Tuesday-11:40": { id: "4_1-t-3", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Tuesday-01:20": { id: "4_1-t-4", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Tuesday-02:20": { id: "4_1-t-5", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Tuesday-03:20": { id: "4_1-t-6", courseCode: "Mentoring", room: "All Staff" },

        "Wednesday-09:40": { id: "4_1-w-1", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Wednesday-10:40": { id: "4_1-w-2", courseCode: "BDA", room: "Dr. KSR Radhika" },
        "Wednesday-11:40": { id: "4_1-w-3", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Wednesday-01:20": { id: "4_1-w-4", courseCode: "BDA", room: "Dr. KSR Radhika" },
        "Wednesday-02:20": { id: "4_1-w-5", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Wednesday-03:20": { id: "4_1-w-6", courseCode: "IS", room: "Mrs. E. Radhika" },

        "Thursday-09:40": { id: "4_1-th-1", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Thursday-10:40": { id: "4_1-th-2", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Thursday-11:40": { id: "4_1-th-3", courseCode: "BDA", room: "Dr. KSR Radhika" },
        "Thursday-01:20": { id: "4_1-th-4", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Thursday-02:20": { id: "4_1-th-5", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Thursday-03:20": { id: "4_1-th-6", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },

        "Friday-09:40": { id: "4_1-f-1", courseCode: "BDA", room: "Dr. KSR Radhika" },
        "Friday-10:40": { id: "4_1-f-2", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Friday-11:40": { id: "4_1-f-3", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Friday-01:20": { id: "4_1-f-4", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Friday-02:20": { id: "4_1-f-5", courseCode: "BDA", room: "Dr. KSR Radhika" },
        "Friday-03:20": { id: "4_1-f-6", courseCode: "DM", room: "Mrs. V. Pravalika" },

        "Saturday-09:40": { id: "4_1-sa-1", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-10:40": { id: "4_1-sa-2", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-11:40": { id: "4_1-sa-3", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-01:20": { id: "4_1-sa-4", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-02:20": { id: "4_1-sa-5", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Saturday-03:20": { id: "4_1-sa-6", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
    },

    // Year 4, Semester 2 (IV-II)
    "4-2": {
        "Monday-09:40": { id: "4_2-m-1", courseCode: "RL", room: "Dr. KSR Radhika" },
        "Monday-10:40": { id: "4_2-m-2", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },
        "Monday-11:40": { id: "4_2-m-3", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Monday-01:20": { id: "4_2-m-4", courseCode: "DS OE", room: "Dr. B. Sunil Srinivas" },
        "Monday-02:20": { id: "4_2-m-5", courseCode: "RL", room: "Dr. KSR Radhika" },
        "Monday-03:20": { id: "4_2-m-6", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },

        "Tuesday-09:40": { id: "4_2-t-1", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Tuesday-10:40": { id: "4_2-t-2", courseCode: "RL", room: "Dr. KSR Radhika" },
        "Tuesday-11:40": { id: "4_2-t-3", courseCode: "DS OE", room: "Dr. B. Sunil Srinivas" },
        "Tuesday-01:20": { id: "4_2-t-4", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },
        "Tuesday-02:20": { id: "4_2-t-5", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Tuesday-03:20": { id: "4_2-t-6", courseCode: "Mentoring", room: "All Staff" },

        "Wednesday-09:40": { id: "4_2-w-1", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },
        "Wednesday-10:40": { id: "4_2-w-2", courseCode: "DS OE", room: "Dr. B. Sunil Srinivas" },
        "Wednesday-11:40": { id: "4_2-w-3", courseCode: "RL", room: "Dr. KSR Radhika" },
        "Wednesday-01:20": { id: "4_2-w-4", courseCode: "Major Project", room: "Project Lab" },
        "Wednesday-02:20": { id: "4_2-w-5", courseCode: "Major Project", room: "Project Lab" },
        "Wednesday-03:20": { id: "4_2-w-6", courseCode: "Major Project", room: "Project Lab" },

        "Thursday-09:40": { id: "4_2-th-1", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Thursday-10:40": { id: "4_2-th-2", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },
        "Thursday-11:40": { id: "4_2-th-3", courseCode: "DS OE", room: "Dr. B. Sunil Srinivas" },
        "Thursday-01:20": { id: "4_2-th-4", courseCode: "Major Project", room: "Project Lab" },
        "Thursday-02:20": { id: "4_2-th-5", courseCode: "Major Project", room: "Project Lab" },
        "Thursday-03:20": { id: "4_2-th-6", courseCode: "Major Project", room: "Project Lab" },

        "Friday-09:40": { id: "4_2-f-1", courseCode: "RL", room: "Dr. KSR Radhika" },
        "Friday-10:40": { id: "4_2-f-2", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Friday-11:40": { id: "4_2-f-3", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },
        "Friday-01:20": { id: "4_2-f-4", courseCode: "Major Project", room: "Project Lab" },
        "Friday-02:20": { id: "4_2-f-5", courseCode: "Major Project", room: "Project Lab" },
        "Friday-03:20": { id: "4_2-f-6", courseCode: "Major Project", room: "Project Lab" },

        "Saturday-09:40": { id: "4_2-sa-1", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-10:40": { id: "4_2-sa-2", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-11:40": { id: "4_2-sa-3", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-01:20": { id: "4_2-sa-4", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-02:20": { id: "4_2-sa-5", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-03:20": { id: "4_2-sa-6", courseCode: "Major Project", room: "Project Lab" },
    },
};

// Merge EXTRA_TIMETABLES into AIML_TIMETABLES so all lookups work from one source
Object.assign(AIML_TIMETABLES, EXTRA_TIMETABLES);

// ─── Section-specific variants ─────────────────────────────────────────────
// Lab rotation per section (labs = 3 consecutive periods):
//   Section A: Mon morning, Tue afternoon  (original schedule)
//   Section B: Tue morning, Wed afternoon  (shifted +1 day)
//   Section C: Wed morning, Thu afternoon  (shifted +2 days)
// Theory periods fill remaining slots with same subjects but in different order
// so that the same faculty/room is never occupied by 2 sections simultaneously.

const SECTION_VARIANTS: Record<string, Record<string, { id: string; courseCode: string; room: string } | null>> = {

    // ── Year 1 Sem 1 ── Section B (labs shifted to Tue morning + Thu afternoon)
    "1-1-B": {
        "Monday-09:40": { id: "1_1B-m-1", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Monday-10:40": { id: "1_1B-m-2", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Monday-11:40": { id: "1_1B-m-3", courseCode: "C", room: "Dr. K. Srinivas" },
        "Monday-01:20": { id: "1_1B-m-4", courseCode: "ITWS Lab", room: "Workshop" },
        "Monday-02:20": { id: "1_1B-m-5", courseCode: "ITWS Lab", room: "Workshop" },
        "Monday-03:20": { id: "1_1B-m-6", courseCode: "ITWS Lab", room: "Workshop" },
        "Tuesday-09:40": { id: "1_1B-t-1", courseCode: "C Lab", room: "Lab" },
        "Tuesday-10:40": { id: "1_1B-t-2", courseCode: "C Lab", room: "Lab" },
        "Tuesday-11:40": { id: "1_1B-t-3", courseCode: "C Lab", room: "Lab" },
        "Tuesday-01:20": { id: "1_1B-t-4", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Tuesday-02:20": { id: "1_1B-t-5", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Tuesday-03:20": { id: "1_1B-t-6", courseCode: "C", room: "Dr. K. Srinivas" },
        "Wednesday-09:40": { id: "1_1B-w-1", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Wednesday-10:40": { id: "1_1B-w-2", courseCode: "C", room: "Dr. K. Srinivas" },
        "Wednesday-11:40": { id: "1_1B-w-3", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Wednesday-01:20": { id: "1_1B-w-4", courseCode: "C", room: "Dr. K. Srinivas" },
        "Wednesday-02:20": { id: "1_1B-w-5", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Wednesday-03:20": { id: "1_1B-w-6", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Thursday-09:40": { id: "1_1B-th-1", courseCode: "C", room: "Dr. K. Srinivas" },
        "Thursday-10:40": { id: "1_1B-th-2", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-11:40": { id: "1_1B-th-3", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Thursday-01:20": { id: "1_1B-th-4", courseCode: "C", room: "Dr. K. Srinivas" },
        "Thursday-02:20": { id: "1_1B-th-5", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-03:20": { id: "1_1B-th-6", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Friday-09:40": { id: "1_1B-f-1", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Friday-10:40": { id: "1_1B-f-2", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Friday-11:40": { id: "1_1B-f-3", courseCode: "C", room: "Dr. K. Srinivas" },
        "Friday-01:20": { id: "1_1B-f-4", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Friday-02:20": { id: "1_1B-f-5", courseCode: "Library", room: "Library" },
        "Friday-03:20": { id: "1_1B-f-6", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Saturday-09:40": { id: "1_1B-sa-1", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Saturday-10:40": { id: "1_1B-sa-2", courseCode: "C", room: "Dr. K. Srinivas" },
        "Saturday-11:40": { id: "1_1B-sa-3", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Saturday-01:20": { id: "1_1B-sa-4", courseCode: "C", room: "Dr. K. Srinivas" },
        "Saturday-02:20": { id: "1_1B-sa-5", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Saturday-03:20": { id: "1_1B-sa-6", courseCode: "EDC", room: "Nelluri Prathibha" },
    },

    // ── Year 1 Sem 1 ── Section C (labs on Wed morning + Fri afternoon)
    "1-1-C": {
        "Monday-09:40": { id: "1_1C-m-1", courseCode: "C", room: "Dr. K. Srinivas" },
        "Monday-10:40": { id: "1_1C-m-2", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Monday-11:40": { id: "1_1C-m-3", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Monday-01:20": { id: "1_1C-m-4", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Monday-02:20": { id: "1_1C-m-5", courseCode: "C", room: "Dr. K. Srinivas" },
        "Monday-03:20": { id: "1_1C-m-6", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Tuesday-09:40": { id: "1_1C-t-1", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Tuesday-10:40": { id: "1_1C-t-2", courseCode: "C", room: "Dr. K. Srinivas" },
        "Tuesday-11:40": { id: "1_1C-t-3", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Tuesday-01:20": { id: "1_1C-t-4", courseCode: "ITWS Lab", room: "Workshop" },
        "Tuesday-02:20": { id: "1_1C-t-5", courseCode: "ITWS Lab", room: "Workshop" },
        "Tuesday-03:20": { id: "1_1C-t-6", courseCode: "ITWS Lab", room: "Workshop" },
        "Wednesday-09:40": { id: "1_1C-w-1", courseCode: "C Lab", room: "Lab" },
        "Wednesday-10:40": { id: "1_1C-w-2", courseCode: "C Lab", room: "Lab" },
        "Wednesday-11:40": { id: "1_1C-w-3", courseCode: "C Lab", room: "Lab" },
        "Wednesday-01:20": { id: "1_1C-w-4", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Wednesday-02:20": { id: "1_1C-w-5", courseCode: "C", room: "Dr. K. Srinivas" },
        "Wednesday-03:20": { id: "1_1C-w-6", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-09:40": { id: "1_1C-th-1", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-10:40": { id: "1_1C-th-2", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Thursday-11:40": { id: "1_1C-th-3", courseCode: "C", room: "Dr. K. Srinivas" },
        "Thursday-01:20": { id: "1_1C-th-4", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Thursday-02:20": { id: "1_1C-th-5", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Thursday-03:20": { id: "1_1C-th-6", courseCode: "C", room: "Dr. K. Srinivas" },
        "Friday-09:40": { id: "1_1C-f-1", courseCode: "C", room: "Dr. K. Srinivas" },
        "Friday-10:40": { id: "1_1C-f-2", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Friday-11:40": { id: "1_1C-f-3", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Friday-01:20": { id: "1_1C-f-4", courseCode: "C", room: "Dr. K. Srinivas" },
        "Friday-02:20": { id: "1_1C-f-5", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Friday-03:20": { id: "1_1C-f-6", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Saturday-09:40": { id: "1_1C-sa-1", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Saturday-10:40": { id: "1_1C-sa-2", courseCode: "EDC", room: "Nelluri Prathibha" },
        "Saturday-11:40": { id: "1_1C-sa-3", courseCode: "C", room: "Dr. K. Srinivas" },
        "Saturday-01:20": { id: "1_1C-sa-4", courseCode: "C", room: "Dr. K. Srinivas" },
        "Saturday-02:20": { id: "1_1C-sa-5", courseCode: "M&C", room: "P Sanjeeva Reddy" },
        "Saturday-03:20": { id: "1_1C-sa-6", courseCode: "EDC", room: "Nelluri Prathibha" },
    },
};

Object.assign(AIML_TIMETABLES, SECTION_VARIANTS);

/**
 * Section-aware timetable lookup.
 * Tries year-sem-section first (e.g. "2-2-B"), falls back to year-sem ("2-2"), then {}.
 * All callers should use this instead of AIML_TIMETABLES directly.
 */
export function getTimetable(year: string | number, sem: string | number, section = 'A') {
    const sectionKey = `${year}-${sem}-${section}`;
    const genericKey = `${year}-${sem}`;
    return AIML_TIMETABLES[sectionKey] ?? AIML_TIMETABLES[genericKey] ?? {};
}

export const FACULTY_LOAD = {
    // 1st Year Sem 1 (I-I)
    "1-1": [
        { code: "C", faculty: "Dr. K. Srinivas", room: "Classroom 101" },
        { code: "C Lab", faculty: "Dr. K. Srinivas", room: "Computer Lab 1" },
        { code: "ITWS Lab", faculty: "Mr. M. Jhansi Rani", room: "Workshop" },
        { code: "M&C", faculty: "P Sanjeeva Reddy", room: "Classroom 101" },
        { code: "EDC", faculty: "Nelluri Prathibha", room: "Classroom 101" }
    ],
    // 1st Year Sem 2 (I-II)
    "1-2": [
        { code: "DS", faculty: "Mrs. M. Suryakumari", room: "Classroom 102" },
        { code: "DS Lab", faculty: "Mr. K. Venugopal Reddy", room: "Lab 2" },
        { code: "PP", faculty: "Mrs. D Mounika", room: "Classroom 102" },
        { code: "PP Lab", faculty: "Mrs. M. Indira", room: "Lab 3" }
    ],
    // 2nd Year Sem 1 (II-I)
    "2-1": [
        { code: "CAO", faculty: "Mrs. Ch. Shilpa", room: "Classroom 201" },
        { code: "MFCS", faculty: "Mrs. T. Praneetha", room: "Classroom 201" },
        { code: "CN", faculty: "Mrs. S. Swathi", room: "Classroom 201" },
        { code: "PP", faculty: "Mrs. D Mounika", room: "Classroom 201" },
        { code: "PP Lab", faculty: "Mrs. S. Gnaneshwari", room: "Lab 1" }
    ],
    // 2nd Year Sem 2 (II-II)
    "2-2": [
        { code: "DAA", faculty: "S Gnaneshwari", room: "Classroom 202" },
        { code: "DBMS", faculty: "Pagilla Geethanjali", room: "Classroom 202" },
        { code: "DBMS Lab", faculty: "Pagilla Geethanjali", room: "Lab 2" },
        { code: "JAVA", faculty: "Nagaraju Rajupeta", room: "Classroom 202" },
        { code: "JAVA Lab", faculty: "Nagaraju Rajupeta", room: "Lab 3" },
        { code: "ML", faculty: "Dr. KSR Radhika", room: "Classroom 202" },
        { code: "OOPS", faculty: "K Ishwarya Devi", room: "Classroom 202" },
        { code: "SE", faculty: "Ch Shilpa", room: "Classroom 202" },
        { code: "WT", faculty: "K Ishwarya Devi", room: "Classroom 202" },
        { code: "WT Lab", faculty: "K Ishwarya Devi", room: "Lab 1" }
    ],
    // 3rd Year Sem 1 (III-I)
    "3-1": [
        { code: "AI", faculty: "Mr. N. Kiran Kumar", room: "Classroom 301" },
        { code: "ATCD", faculty: "Mrs. D Uma Maheshwari", room: "Classroom 301" },
        { code: "DevOps", faculty: "Mr. Ande Srinivasa Reddy", room: "Lab 4" },
        { code: "ML", faculty: "Mrs. C. Jaya Lakshmi", room: "Classroom 301" },
        { code: "OOAD", faculty: "Mrs. P. Geethanjali", room: "Classroom 301" },
        { code: "OS", faculty: "Mrs. K. Ishwarya devi", room: "Classroom 301" }
    ],
    // 3rd Year Sem 2 (III-II)
    "3-2": [
        { code: "Conv. AI", faculty: "Dr. Syed Hussain", room: "Classroom 302" },
        { code: "NLP", faculty: "Mrs. C. Saritha Reddy", room: "Classroom 302" },
        { code: "NLP Lab", faculty: "Mrs. B. Vijitha", room: "Lab AI" },
        { code: "DL", faculty: "Mrs. C. Jaya Lakshmi", room: "Classroom 302" },
        { code: "DL Lab", faculty: "Mrs. B. Vijitha", room: "Lab AI" },
        { code: "RPA", faculty: "Mr. Ande Srinivasa Reddy", room: "Lab 3" },
        { code: "IS", faculty: "Mrs. E. Radhika", room: "Classroom 302" },
        { code: "OE", faculty: "Mrs. V. Pravalika", room: "Hall B" }
    ],
    // 4th Year Sem 1 (IV-I)
    "4-1": [
        { code: "BDA", faculty: "Dr. KSR Radhika", room: "Classroom 401" },
        { code: "BDA Lab", faculty: "Dr. KSR Radhika", room: "AI Lab" },
        { code: "DM", faculty: "Mrs. V. Pravalika", room: "Classroom 401" },
        { code: "IS", faculty: "Mrs. E. Radhika", room: "Classroom 401" },
        { code: "KRR", faculty: "Mr. K. Venugopal Reddy", room: "Classroom 401" }
    ],
    // 4th Year Sem 2 (IV-II)
    "4-2": [
        { code: "RL", faculty: "Dr. KSR Radhika", room: "Classroom 402" },
        { code: "QC", faculty: "Mrs. D Uma Maheshwari", room: "Classroom 402" },
        { code: "OE", faculty: "Mrs. V. Pravalika", room: "Hall A" },
        { code: "DS OE", faculty: "Dr. B. Sunil Srinivas", room: "Classroom 402" }
    ]
};
