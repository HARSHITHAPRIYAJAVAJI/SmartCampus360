export interface TimetableEntry {
    id: string;
    courseCode: string;
    courseName?: string;
    room: string;
}

export const AIML_TIMETABLES: Record<string, Record<string, TimetableEntry | null>> = {
    // Year 1, Semester 1 (I-I) - Standardized Syllabus
    "1-1": {
        "Monday-09:40": { id: "1_1-m-1", courseCode: "CPPS Lab", room: "Dr. D. Anitha Kumari" },
        "Monday-10:40": { id: "1_1-m-2", courseCode: "CPPS Lab", room: "Dr. D. Anitha Kumari" },
        "Monday-11:40": { id: "1_1-m-3", courseCode: "CPPS Lab", room: "Dr. D. Anitha Kumari" },
        "Monday-01:20": { id: "1_1-m-4", courseCode: "LA&ODE", room: "Sreedevi" },
        "Monday-02:20": { id: "1_1-m-5", courseCode: "English", room: "Sudha Menon" },
        "Monday-03:20": { id: "1_1-m-6", courseCode: "CPPS", room: "Dr. D. Anitha Kumari" },

        "Tuesday-09:40": { id: "1_1-t-1", courseCode: "LA&ODE", room: "Sreedevi" },
        "Tuesday-10:40": { id: "1_1-t-2", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Tuesday-11:40": { id: "1_1-t-3", courseCode: "CPPS", room: "Dr. D. Anitha Kumari" },
        "Tuesday-01:20": { id: "1_1-t-4", courseCode: "ITWS Lab", room: "Workshop" },
        "Tuesday-02:20": { id: "1_1-t-5", courseCode: "ITWS Lab", room: "Workshop" },
        "Tuesday-03:20": { id: "1_1-t-6", courseCode: "ITWS Lab", room: "Workshop" },

        "Wednesday-09:40": { id: "1_1-w-1", courseCode: "EC Lab", room: "Chemistry Lab" },
        "Wednesday-10:40": { id: "1_1-w-2", courseCode: "EC Lab", room: "Chemistry Lab" },
        "Wednesday-11:40": { id: "1_1-w-3", courseCode: "EC Lab", room: "Chemistry Lab" },
        "Wednesday-01:20": { id: "1_1-w-4", courseCode: "LA&ODE", room: "Sreedevi" },
        "Wednesday-02:20": { id: "1_1-w-5", courseCode: "English", room: "Sudha Menon" },
        "Wednesday-03:20": { id: "1_1-w-6", courseCode: "CPPS", room: "Dr. D. Anitha Kumari" },

        "Thursday-09:40": { id: "1_1-th-1", courseCode: "ELCS Lab", room: "Language Lab" },
        "Thursday-10:40": { id: "1_1-th-2", courseCode: "ELCS Lab", room: "Language Lab" },
        "Thursday-11:40": { id: "1_1-th-3", courseCode: "ELCS Lab", room: "Language Lab" },
        "Thursday-01:20": { id: "1_1-th-4", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Thursday-02:20": { id: "1_1-th-5", courseCode: "LA&ODE", room: "Sreedevi" },
        "Thursday-03:20": { id: "1_1-th-6", courseCode: "CPPS", room: "Dr. D. Anitha Kumari" },

        "Friday-09:40": { id: "1_1-f-1", courseCode: "CAEG", room: "Drawing Hall" },
        "Friday-10:40": { id: "1_1-f-2", courseCode: "CAEG", room: "Drawing Hall" },
        "Friday-11:40": { id: "1_1-f-3", courseCode: "CAEG", room: "Drawing Hall" },
        "Friday-01:20": { id: "1_1-f-4", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Friday-02:20": { id: "1_1-f-5", courseCode: "CPPS", room: "Dr. D. Anitha Kumari" },
        "Friday-03:20": { id: "1_1-f-6", courseCode: "Sports", room: "Ground" },

        "Saturday-09:40": { id: "1_1-sa-1", courseCode: "LA&ODE", room: "Sreedevi" },
        "Saturday-10:40": { id: "1_1-sa-2", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Saturday-11:40": { id: "1_1-sa-3", courseCode: "English", room: "Sudha Menon" },
        "Saturday-01:20": { id: "1_1-sa-4", courseCode: "LA&ODE", room: "Sreedevi" },
        "Saturday-02:20": { id: "1_1-sa-5", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Saturday-03:20": { id: "1_1-sa-6", courseCode: "Library", room: "Library" },
    },


    // Year 2, Semester 2 (II-II) (Mapped to 2-2)
    "2-2": {
        // Monday
        "Monday-09:40": { id: "m-2-1", courseCode: "JAVA Lab", room: "Dr. D. Anitha Kumari" },
        "Monday-10:40": { id: "m-2-2", courseCode: "JAVA Lab", room: "Dr. D. Anitha Kumari" },
        "Monday-11:40": { id: "m-2-3", courseCode: "JAVA Lab", room: "Dr. D. Anitha Kumari" },
        "Monday-01:20": { id: "m-2-4", courseCode: "WT", room: "Mrs. K. Ishwarya Devi" },
        "Monday-02:20": { id: "m-2-5", courseCode: "DAA", room: "Mallayya" },
        "Monday-03:20": { id: "m-2-6", courseCode: "SE", room: "Staff" },

        // Tuesday
        "Tuesday-09:40": { id: "t-2-1", courseCode: "DBMS", room: "Mrs. P. Geethanjali" },
        "Tuesday-10:40": { id: "t-2-2", courseCode: "JAVA", room: "Dr. D. Anitha Kumari" },
        "Tuesday-11:40": { id: "t-2-3", courseCode: "DAA", room: "Mallayya" },
        "Tuesday-01:20": { id: "t-2-4", courseCode: "WT Lab", room: "Mrs. K. Ishwarya Devi" },
        "Tuesday-02:20": { id: "t-2-5", courseCode: "WT Lab", room: "Mrs. K. Ishwarya Devi" },
        "Tuesday-03:20": { id: "t-2-6", courseCode: "WT Lab", room: "Mrs. K. Ishwarya Devi" },

        // Wednesday
        "Wednesday-09:40": { id: "w-2-1", courseCode: "DBMS Lab", room: "Mrs. P. Geethanjali" },
        "Wednesday-10:40": { id: "w-2-2", courseCode: "DBMS Lab", room: "Mrs. P. Geethanjali" },
        "Wednesday-11:40": { id: "w-2-3", courseCode: "DBMS Lab", room: "Mrs. P. Geethanjali" },
        "Wednesday-01:20": { id: "w-2-4", courseCode: "ML", room: "Mrs. C. Jaya Lakshmi" },
        "Wednesday-02:20": { id: "w-2-5", courseCode: "OOPS", room: "Mrs. K. Ishwarya Devi" },
        "Wednesday-03:20": { id: "w-2-6", courseCode: "SE", room: "Staff" },

        // Thursday
        "Thursday-09:40": { id: "th-2-1", courseCode: "SE", room: "Staff" },
        "Thursday-10:40": { id: "th-2-2", courseCode: "DBMS", room: "Mrs. P. Geethanjali" },
        "Thursday-11:40": { id: "th-2-3", courseCode: "JAVA", room: "Dr. D. Anitha Kumari" },
        "Thursday-01:20": { id: "th-2-4", courseCode: "DAA", room: "Mallayya" },
        "Thursday-02:20": { id: "th-2-5", courseCode: "DBMS", room: "Mrs. P. Geethanjali" },
        "Thursday-03:20": { id: "th-2-6", courseCode: "JAVA", room: "Dr. D. Anitha Kumari" },

        // Friday
        "Friday-09:40": { id: "f-2-1", courseCode: "DAA", room: "Mallayya" },
        "Friday-10:40": { id: "f-2-2", courseCode: "JAVA", room: "Dr. D. Anitha Kumari" },
        "Friday-11:40": { id: "f-2-3", courseCode: "SE", room: "Staff" },
        "Friday-01:20": { id: "f-2-4", courseCode: "DBMS", room: "Mrs. P. Geethanjali" },
        "Friday-02:20": { id: "f-2-5", courseCode: "WT", room: "Mrs. K. Ishwarya Devi" },
        "Friday-03:20": { id: "f-2-6", courseCode: "Sports", room: "Ground" },

        // Saturday
        "Saturday-09:40": { id: "sa-2-1", courseCode: "DBMS", room: "Mrs. P. Geethanjali" },
        "Saturday-10:40": { id: "sa-2-2", courseCode: "DAA", room: "Mallayya" },
        "Saturday-11:40": { id: "sa-2-3", courseCode: "JAVA", room: "Dr. D. Anitha Kumari" },
        "Saturday-01:20": { id: "sa-2-4", courseCode: "ML", room: "Mrs. C. Jaya Lakshmi" },
        "Saturday-02:20": { id: "sa-2-5", courseCode: "OOPS", room: "Mrs. K. Ishwarya Devi" },
        "Saturday-03:20": { id: "sa-2-6", courseCode: "Library", room: "Library" },
    },

    // Year 1, Semester 2 (I-II) - CSM Syllabus Standardized
    "1-2": {
        "Monday-09:40": { id: "1_2-m-1", courseCode: "DS Lab", room: "Mr. K. Venugopal Reddy" },
        "Monday-10:40": { id: "1_2-m-2", courseCode: "DS Lab", room: "Mr. K. Venugopal Reddy" },
        "Monday-11:40": { id: "1_2-m-3", courseCode: "DS Lab", room: "Mr. K. Venugopal Reddy" },
        "Monday-01:20": { id: "1_2-m-4", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Monday-02:20": { id: "1_2-m-5", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Monday-03:20": { id: "1_2-m-6", courseCode: "AP", room: "Dr. K. Rama Rao" },

        "Tuesday-09:40": { id: "1_2-t-1", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Tuesday-10:40": { id: "1_2-t-2", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Tuesday-11:40": { id: "1_2-t-3", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Tuesday-01:20": { id: "1_2-t-4", courseCode: "AP Lab", room: "Dr. K. Rama Rao" },
        "Tuesday-02:20": { id: "1_2-t-5", courseCode: "AP Lab", room: "Dr. K. Rama Rao" },
        "Tuesday-03:20": { id: "1_2-t-6", courseCode: "AP Lab", room: "Dr. K. Rama Rao" },

        "Wednesday-09:40": { id: "1_2-w-1", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Wednesday-10:40": { id: "1_2-w-2", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Wednesday-11:40": { id: "1_2-w-3", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Wednesday-01:20": { id: "1_2-w-4", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Wednesday-02:20": { id: "1_2-w-5", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Wednesday-03:20": { id: "1_2-w-6", courseCode: "SM&VC", room: "Dr. P. Madhavi" },

        "Thursday-09:40": { id: "1_2-th-1", courseCode: "BEE Lab", room: "Mr. Ch. Naveen" },
        "Thursday-10:40": { id: "1_2-th-2", courseCode: "BEE Lab", room: "Mr. Ch. Naveen" },
        "Thursday-11:40": { id: "1_2-th-3", courseCode: "BEE Lab", room: "Mr. Ch. Naveen" },
        "Thursday-01:20": { id: "1_2-th-4", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Thursday-02:20": { id: "1_2-th-5", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Thursday-03:20": { id: "1_2-th-6", courseCode: "BEFA", room: "Mrs. G. Sunitha" },

        "Friday-09:40": { id: "1_2-f-1", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Friday-10:40": { id: "1_2-f-2", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Friday-11:40": { id: "1_2-f-3", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Friday-01:20": { id: "1_2-f-4", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Friday-02:20": { id: "1_2-f-5", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Friday-03:20": { id: "1_2-f-6", courseCode: "Sports", room: "Ground" },

        "Saturday-09:40": { id: "1_2-sa-1", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Saturday-10:40": { id: "1_2-sa-2", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Saturday-11:40": { id: "1_2-sa-3", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Saturday-01:20": { id: "1_2-sa-4", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Saturday-02:20": { id: "1_2-sa-5", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Saturday-03:20": { id: "1_2-sa-6", courseCode: "Library", room: "Library" },
    },


    // Year 2, Semester 1 (II-I)
    "2-1": {
        "Monday-09:40": { id: "2_1-m-1", courseCode: "PP Lab", room: "Anitha Chowdary" },
        "Monday-10:40": { id: "2_1-m-2", courseCode: "PP Lab", room: "Anitha Chowdary" },
        "Monday-11:40": { id: "2_1-m-3", courseCode: "PP Lab", room: "Anitha Chowdary" },
        "Monday-01:20": { id: "2_1-m-4", courseCode: "CAO", room: "Staff" },
        "Monday-02:20": { id: "2_1-m-5", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Monday-03:20": { id: "2_1-m-6", courseCode: "CN", room: "Mrs. S. Swathi" },

        "Tuesday-09:40": { id: "2_1-t-1", courseCode: "CAO", room: "Staff" },
        "Tuesday-10:40": { id: "2_1-t-2", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Tuesday-11:40": { id: "2_1-t-3", courseCode: "PP", room: "Mrs. D Mounika" },
        "Tuesday-01:20": { id: "2_1-t-4", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Tuesday-02:20": { id: "2_1-t-5", courseCode: "CAO", room: "Staff" },
        "Tuesday-03:20": { id: "2_1-t-6", courseCode: "MFCS", room: "Mrs. T. Praneetha" },

        "Wednesday-09:40": { id: "2_1-w-1", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Wednesday-10:40": { id: "2_1-w-2", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Wednesday-11:40": { id: "2_1-w-3", courseCode: "CAO", room: "Staff" },
        "Wednesday-01:20": { id: "2_1-w-4", courseCode: "CAO", room: "Staff" },
        "Wednesday-02:20": { id: "2_1-w-5", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Wednesday-03:20": { id: "2_1-w-6", courseCode: "CN", room: "Mrs. S. Swathi" },

        "Thursday-09:40": { id: "2_1-th-1", courseCode: "PP", room: "Mrs. D Mounika" },
        "Thursday-10:40": { id: "2_1-th-2", courseCode: "CAO", room: "Staff" },
        "Thursday-11:40": { id: "2_1-th-3", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Thursday-01:20": { id: "2_1-th-4", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Thursday-02:20": { id: "2_1-th-5", courseCode: "PP", room: "Mrs. D Mounika" },
        "Thursday-03:20": { id: "2_1-th-6", courseCode: "CAO", room: "Staff" },

        "Friday-09:40": { id: "2_1-f-1", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Friday-10:40": { id: "2_1-f-2", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Friday-11:40": { id: "2_1-f-3", courseCode: "PP", room: "Mrs. D Mounika" },
        "Friday-01:20": { id: "2_1-f-4", courseCode: "CAO", room: "Staff" },
        "Friday-02:20": { id: "2_1-f-5", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Friday-03:20": { id: "2_1-f-6", courseCode: "Sports", room: "Ground" },

        "Saturday-09:40": { id: "2_1-sa-1", courseCode: "CAO", room: "Staff" },
        "Saturday-10:40": { id: "2_1-sa-2", courseCode: "MFCS", room: "Mrs. T. Praneetha" },
        "Saturday-11:40": { id: "2_1-sa-3", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Saturday-01:20": { id: "2_1-sa-4", courseCode: "PP", room: "Mrs. D Mounika" },
        "Saturday-02:20": { id: "2_1-sa-5", courseCode: "CN", room: "Mrs. S. Swathi" },
        "Saturday-03:20": { id: "2_1-sa-6", courseCode: "Library", room: "Library" },
    },
};

// Year 3, Semester 1 (III-I) — added to AIML_TIMETABLES via module augmentation pattern
// We extend AIML_TIMETABLES in-place by re-declaring entries below via Object.assign at runtime.
// Actually -- let's just add to the main object above. Putting the data here as a separate const.

export const EXTRA_TIMETABLES: Record<string, Record<string, { id: string; courseCode: string; room: string } | null>> = {
    // Year 2, Semester 1 (II-I) - Semester 3
    "2-1": {
        "Monday-09:40": { id: "2_1-m-1", courseCode: "4E303", room: "Mrs. D. Mounika" },
        "Monday-10:40": { id: "2_1-m-2", courseCode: "4E303", room: "Mrs. D. Mounika" },
        "Monday-11:40": { id: "2_1-m-3", courseCode: "4E303", room: "Mrs. D. Mounika" },
        "Monday-01:20": { id: "2_1-m-4", courseCode: "4E3EB", room: "Mrs. D. Mounika" },
        "Monday-02:20": { id: "2_1-m-5", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Monday-03:20": { id: "2_1-m-6", courseCode: "4E3EE", room: "Mrs. S. Swathi" },

        "Tuesday-09:40": { id: "2_1-t-1", courseCode: "4E3ED", room: "Staff" },
        "Tuesday-10:40": { id: "2_1-t-2", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Tuesday-11:40": { id: "2_1-t-3", courseCode: "4E3EB", room: "Mrs. D. Mounika" },
        "Tuesday-01:20": { id: "2_1-t-4", courseCode: "4B30D", room: "Dr. P. Madhavi" },
        "Tuesday-02:20": { id: "2_1-t-5", courseCode: "4E3EA", room: "Mrs. Jagruthi" },
        "Tuesday-03:20": { id: "2_1-t-6", courseCode: "4E3EE", room: "Mrs. S. Swathi" },

        "Wednesday-09:40": { id: "2_1-w-1", courseCode: "4E312", room: "Mrs. Srujana Reddy Aynala" },
        "Wednesday-10:40": { id: "2_1-w-2", courseCode: "4E312", room: "Mrs. Srujana Reddy Aynala" },
        "Wednesday-11:40": { id: "2_1-w-3", courseCode: "4E312", room: "Mrs. Srujana Reddy Aynala" },
        "Wednesday-01:20": { id: "2_1-w-4", courseCode: "4E3ED", room: "Staff" },
        "Wednesday-02:20": { id: "2_1-w-5", courseCode: "4E3EA", room: "Mrs. Jagruthi" },
        "Wednesday-03:20": { id: "2_1-w-6", courseCode: "4B30D", room: "Dr. P. Madhavi" },

        "Thursday-09:40": { id: "2_1-th-1", courseCode: "4B30D", room: "Dr. P. Madhavi" },
        "Thursday-10:40": { id: "2_1-th-2", courseCode: "4E3ED", room: "Staff" },
        "Thursday-11:40": { id: "2_1-th-3", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Thursday-01:20": { id: "2_1-th-4", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Thursday-02:20": { id: "2_1-th-5", courseCode: "4E3EA", room: "Mrs. Jagruthi" },
        "Thursday-03:20": { id: "2_1-th-6", courseCode: "4B30D", room: "Dr. P. Madhavi" },

        "Friday-09:40": { id: "2_1-f-1", courseCode: "4E3ED", room: "Staff" },
        "Friday-10:40": { id: "2_1-f-2", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Friday-11:40": { id: "2_1-f-3", courseCode: "4E3EB", room: "Mrs. D. Mounika" },
        "Friday-01:20": { id: "2_1-f-4", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Friday-02:20": { id: "2_1-f-5", courseCode: "4E3EA", room: "Mrs. Jagruthi" },
        "Friday-03:20": { id: "2_1-f-6", courseCode: "Sports", room: "Ground" },

        "Saturday-09:40": { id: "2_1-sa-1", courseCode: "4B30D", room: "Dr. P. Madhavi" },
        "Saturday-10:40": { id: "2_1-sa-2", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Saturday-11:40": { id: "2_1-sa-3", courseCode: "4E3ED", room: "Staff" },
        "Saturday-01:20": { id: "2_1-sa-4", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Saturday-02:20": { id: "2_1-sa-5", courseCode: "4E3EB", room: "Mrs. D. Mounika" },
        "Saturday-03:20": { id: "2_1-sa-6", courseCode: "Library", room: "Library" },
    },
    // Year 2, Semester 2 (II-II) - Semester 4
    "2-2": {
        "Monday-09:40": { id: "2_2-m-1", courseCode: "4E411", room: "Mrs. T. Praneetha" },
        "Monday-10:40": { id: "2_2-m-2", courseCode: "4E411", room: "Mrs. T. Praneetha" },
        "Monday-11:40": { id: "2_2-m-3", courseCode: "4E411", room: "Mrs. T. Praneetha" },
        "Monday-01:20": { id: "2_2-m-4", courseCode: "4E4EA", room: "Dr. D. Anitha Kumari" },
        "Monday-02:20": { id: "2_2-m-5", courseCode: "4E4EB", room: "Mallayya" },
        "Monday-03:20": { id: "2_2-m-6", courseCode: "4E4EC", room: "Mrs. T. Praneetha" },

        "Tuesday-09:40": { id: "2_2-t-1", courseCode: "4E412", room: "Dr. D. Anitha Kumari" },
        "Tuesday-10:40": { id: "2_2-t-2", courseCode: "4E412", room: "Dr. D. Anitha Kumari" },
        "Tuesday-11:40": { id: "2_2-t-3", courseCode: "4E412", room: "Dr. D. Anitha Kumari" },
        "Tuesday-01:20": { id: "2_2-t-4", courseCode: "4E4ED", room: "Mrs. E. Radhika" },
        "Tuesday-02:20": { id: "2_2-t-5", courseCode: "4E4EE", room: "Mrs. E. Radhika" },
        "Tuesday-03:20": { id: "2_2-t-6", courseCode: "4E4EB", room: "Mallayya" },

        "Wednesday-09:40": { id: "2_2-w-1", courseCode: "4E413", room: "Mrs. G. Sunitha" },
        "Wednesday-10:40": { id: "2_2-w-2", courseCode: "4E413", room: "Mrs. G. Sunitha" },
        "Wednesday-11:40": { id: "2_2-w-3", courseCode: "4E413", room: "Mrs. G. Sunitha" },
        "Wednesday-01:20": { id: "2_2-w-4", courseCode: "4E4EA", room: "Dr. D. Anitha Kumari" },
        "Wednesday-02:20": { id: "2_2-w-5", courseCode: "4E4EC", room: "Mrs. T. Praneetha" },
        "Wednesday-03:20": { id: "2_2-w-6", courseCode: "4E4ED", room: "Mrs. E. Radhika" },
        "Thursday-09:40": { id: "2_2-th-1", courseCode: "4E414", room: "Mrs. E. Radhika" },
        "Thursday-10:40": { id: "2_2-th-2", courseCode: "4E414", room: "Mrs. E. Radhika" },
        "Thursday-11:40": { id: "2_2-th-3", courseCode: "4E414", room: "Mrs. E. Radhika" },
        "Thursday-01:20": { id: "2_2-th-4", courseCode: "4E4EA", room: "Dr. D. Anitha Kumari" },
        "Thursday-02:20": { id: "2_2-th-5", courseCode: "4E4EB", room: "Mallayya" },
        "Thursday-03:20": { id: "2_2-th-6", courseCode: "4E4EC", room: "Mrs. T. Praneetha" },
        "Friday-09:40": { id: "2_2-f-1", courseCode: "4E4ED", room: "Mrs. E. Radhika" },
        "Friday-10:40": { id: "2_2-f-2", courseCode: "4E4EE", room: "Mrs. E. Radhika" },
        "Friday-11:40": { id: "2_2-f-3", courseCode: "4E4EB", room: "Mallayya" },
        "Friday-01:20": { id: "2_2-f-4", courseCode: "4E4EA", room: "Dr. D. Anitha Kumari" },
        "Friday-02:20": { id: "2_2-f-5", courseCode: "4E4EC", room: "Mrs. T. Praneetha" },
        "Friday-03:20": { id: "2_2-f-6", courseCode: "Sports", room: "Ground" },
        "Saturday-09:40": { id: "2_2-sa-1", courseCode: "4E4ED", room: "Mrs. E. Radhika" },
        "Saturday-10:40": { id: "2_2-sa-2", courseCode: "4E4EB", room: "Mallayya" },
        "Saturday-11:40": { id: "2_2-sa-3", courseCode: "4E4EA", room: "Dr. D. Anitha Kumari" },
        "Saturday-01:20": { id: "2_2-sa-4", courseCode: "4E4EC", room: "Mrs. T. Praneetha" },
        "Saturday-02:20": { id: "2_2-sa-5", courseCode: "4E4EE", room: "Mrs. E. Radhika" },
        "Saturday-03:20": { id: "2_2-sa-6", courseCode: "Library", room: "Library" },
    },

    // Year 4, Semester 1 (IV-I)
    "4-1": {
        "Monday-09:40": { id: "4_1-m-1", courseCode: "BDA Lab", room: "Dr. K. Srinivas" },
        "Monday-10:40": { id: "4_1-m-2", courseCode: "BDA Lab", room: "Dr. K. Srinivas" },
        "Monday-11:40": { id: "4_1-m-3", courseCode: "BDA Lab", room: "Dr. K. Srinivas" },
        "Monday-01:20": { id: "4_1-m-4", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Monday-02:20": { id: "4_1-m-5", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Monday-03:20": { id: "4_1-m-6", courseCode: "IS", room: "Dr. Syed Hussain" },

        "Tuesday-09:40": { id: "4_1-t-1", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Tuesday-10:40": { id: "4_1-t-2", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Tuesday-11:40": { id: "4_1-t-3", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Tuesday-01:20": { id: "4_1-t-4", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Tuesday-02:20": { id: "4_1-t-5", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Tuesday-03:20": { id: "4_1-t-6", courseCode: "Mentoring", room: "All Staff" },

        "Wednesday-09:40": { id: "4_1-w-1", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Wednesday-10:40": { id: "4_1-w-2", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Wednesday-11:40": { id: "4_1-w-3", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Wednesday-01:20": { id: "4_1-w-4", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Wednesday-02:20": { id: "4_1-w-5", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Wednesday-03:20": { id: "4_1-w-6", courseCode: "IS", room: "Mrs. E. Radhika" },

        "Thursday-09:40": { id: "4_1-th-1", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Thursday-10:40": { id: "4_1-th-2", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Thursday-11:40": { id: "4_1-th-3", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Thursday-01:20": { id: "4_1-th-4", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Thursday-02:20": { id: "4_1-th-5", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Thursday-03:20": { id: "4_1-th-6", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },

        "Friday-09:40": { id: "4_1-f-1", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Friday-10:40": { id: "4_1-f-2", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Friday-11:40": { id: "4_1-f-3", courseCode: "DM", room: "Mrs. V. Pravalika" },
        "Friday-01:20": { id: "4_1-f-4", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Friday-02:20": { id: "4_1-f-5", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Friday-03:20": { id: "4_1-f-6", courseCode: "Major Project", room: "Project Lab" },

        "Saturday-09:40": { id: "4_1-sa-1", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-10:40": { id: "4_1-sa-2", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-11:40": { id: "4_1-sa-3", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-01:20": { id: "4_1-sa-4", courseCode: "Major Project", room: "Project Lab" },
        "Saturday-02:20": { id: "4_1-sa-5", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Saturday-03:20": { id: "4_1-sa-6", courseCode: "Major Project", room: "Project Lab" },
    },

    // Year 4, Semester 2 (IV-II)
    "4-2": {
        "Monday-09:40": { id: "4_2-m-1", courseCode: "RL", room: "Dr. Syed Hussain" },
        "Monday-10:40": { id: "4_2-m-2", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },
        "Monday-11:40": { id: "4_2-m-3", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Monday-01:20": { id: "4_2-m-4", courseCode: "DS OE", room: "Dr. B. Sunil Srinivas" },
        "Monday-02:20": { id: "4_2-m-5", courseCode: "RL", room: "Dr. Syed Hussain" },
        "Monday-03:20": { id: "4_2-m-6", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },

        "Tuesday-09:40": { id: "4_2-t-1", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Tuesday-10:40": { id: "4_2-t-2", courseCode: "RL", room: "Dr. Syed Hussain" },
        "Tuesday-11:40": { id: "4_2-t-3", courseCode: "DS OE", room: "Dr. B. Sunil Srinivas" },
        "Tuesday-01:20": { id: "4_2-t-4", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },
        "Tuesday-02:20": { id: "4_2-t-5", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Tuesday-03:20": { id: "4_2-t-6", courseCode: "Mentoring", room: "All Staff" },

        "Wednesday-09:40": { id: "4_2-w-1", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },
        "Wednesday-10:40": { id: "4_2-w-2", courseCode: "DS OE", room: "Dr. B. Sunil Srinivas" },
        "Wednesday-11:40": { id: "4_2-w-3", courseCode: "RL", room: "Dr. Syed Hussain" },
        "Wednesday-01:20": { id: "4_2-w-4", courseCode: "Major Project", room: "Project Lab" },
        "Wednesday-02:20": { id: "4_2-w-5", courseCode: "Major Project", room: "Project Lab" },
        "Wednesday-03:20": { id: "4_2-w-6", courseCode: "Major Project", room: "Project Lab" },

        "Thursday-09:40": { id: "4_2-th-1", courseCode: "OE", room: "Mrs. V. Pravalika" },
        "Thursday-10:40": { id: "4_2-th-2", courseCode: "QC", room: "Mrs. D Uma Maheshwari" },
        "Thursday-11:40": { id: "4_2-th-3", courseCode: "DS OE", room: "Dr. B. Sunil Srinivas" },
        "Thursday-01:20": { id: "4_2-th-4", courseCode: "Major Project", room: "Project Lab" },
        "Thursday-02:20": { id: "4_2-th-5", courseCode: "Major Project", room: "Project Lab" },
        "Thursday-03:20": { id: "4_2-th-6", courseCode: "Major Project", room: "Project Lab" },

        "Friday-09:40": { id: "4_2-f-1", courseCode: "RL", room: "Dr. Syed Hussain" },
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

    // ── Year 1 Sem 1 ── Section B
    "1-1-B": {
        "Monday-09:40": { id: "1_1B-m-1", courseCode: "CAEG", room: "Drawing Hall" },
        "Monday-10:40": { id: "1_1B-m-2", courseCode: "CAEG", room: "Drawing Hall" },
        "Monday-11:40": { id: "1_1B-m-3", courseCode: "CAEG", room: "Drawing Hall" },
        "Monday-01:20": { id: "1_1B-m-4", courseCode: "ELCS Lab", room: "Language Lab" },
        "Monday-02:20": { id: "1_1B-m-5", courseCode: "ELCS Lab", room: "Language Lab" },
        "Monday-03:20": { id: "1_1B-m-6", courseCode: "ELCS Lab", room: "Language Lab" },
        "Tuesday-09:40": { id: "1_1B-t-1", courseCode: "CPPS Lab", room: "Mrs. M. Suryakumari" },
        "Tuesday-10:40": { id: "1_1B-t-2", courseCode: "CPPS Lab", room: "Mrs. M. Suryakumari" },
        "Tuesday-11:40": { id: "1_1B-t-3", courseCode: "CPPS Lab", room: "Mrs. M. Suryakumari" },
        "Tuesday-01:20": { id: "1_1B-t-4", courseCode: "LA&ODE", room: "G. Shankar" },
        "Tuesday-02:20": { id: "1_1B-t-5", courseCode: "English", room: "B. Gnanesh Netha" },
        "Tuesday-03:20": { id: "1_1B-t-6", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Wednesday-09:40": { id: "1_1B-w-1", courseCode: "English", room: "B. Gnanesh Netha" },
        "Wednesday-10:40": { id: "1_1B-w-2", courseCode: "CPPS", room: "Mrs. M. Suryakumari" },
        "Wednesday-11:40": { id: "1_1B-w-3", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Wednesday-01:20": { id: "1_1B-w-4", courseCode: "ITWS Lab", room: "Workshop" },
        "Wednesday-02:20": { id: "1_1B-w-5", courseCode: "ITWS Lab", room: "Workshop" },
        "Wednesday-03:20": { id: "1_1B-w-6", courseCode: "ITWS Lab", room: "Workshop" },
        "Thursday-09:40": { id: "1_1B-th-1", courseCode: "EC Lab", room: "Chemistry Lab" },
        "Thursday-10:40": { id: "1_1B-th-2", courseCode: "EC Lab", room: "Chemistry Lab" },
        "Thursday-11:40": { id: "1_1B-th-3", courseCode: "EC Lab", room: "Chemistry Lab" },
        "Thursday-01:20": { id: "1_1B-th-4", courseCode: "LA&ODE", room: "G. Shankar" },
        "Thursday-02:20": { id: "1_1B-th-5", courseCode: "CPPS", room: "Mrs. M. Suryakumari" },
        "Thursday-03:20": { id: "1_1B-th-6", courseCode: "English", room: "B. Gnanesh Netha" },
        "Friday-09:40": { id: "1_1B-f-1", courseCode: "English", room: "B. Gnanesh Netha" },
        "Friday-10:40": { id: "1_1B-f-2", courseCode: "LA&ODE", room: "G. Shankar" },
        "Friday-11:40": { id: "1_1B-f-3", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Friday-01:20": { id: "1_1B-f-4", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Friday-02:20": { id: "1_1B-f-5", courseCode: "CPPS", room: "Mrs. M. Suryakumari" },
        "Friday-03:20": { id: "1_1B-f-6", courseCode: "Sports", room: "Ground" },
        "Saturday-09:40": { id: "1_1B-sa-1", courseCode: "LA&ODE", room: "G. Shankar" },
        "Saturday-10:40": { id: "1_1B-sa-2", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Saturday-11:40": { id: "1_1B-sa-3", courseCode: "CPPS", room: "Mrs. M. Suryakumari" },
        "Saturday-01:20": { id: "1_1B-sa-4", courseCode: "English", room: "B. Gnanesh Netha" },
        "Saturday-02:20": { id: "1_1B-sa-5", courseCode: "English", room: "B. Gnanesh Netha" },
        "Saturday-03:20": { id: "1_1B-sa-6", courseCode: "Library", room: "Library" },
    },

    // ── Year 1 Sem 1 ── Section C
    "1-1-C": {
        "Monday-09:40": { id: "1_1C-m-1-th", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Monday-10:40": { id: "1_1C-m-2-th", courseCode: "CPPS", room: "Mrs. P. Vijaya Kumari" },
        "Monday-11:40": { id: "1_1C-m-3-th", courseCode: "LA&ODE", room: "G. Shankar" },
        "Monday-01:20": { id: "1_1C-m-4", courseCode: "EC Lab", room: "Chemistry Lab" },
        "Monday-02:20": { id: "1_1C-m-5", courseCode: "EC Lab", room: "Chemistry Lab" },
        "Monday-03:20": { id: "1_1C-m-6", courseCode: "EC Lab", room: "Chemistry Lab" },
        "Tuesday-09:40": { id: "1_1C-t-1-draw", courseCode: "CAEG", room: "Drawing Hall" },
        "Tuesday-10:40": { id: "1_1C-t-2-draw", courseCode: "CAEG", room: "Drawing Hall" },
        "Tuesday-11:40": { id: "1_1C-t-3-draw", courseCode: "CAEG", room: "Drawing Hall" },
        "Tuesday-01:20": { id: "1_1C-t-4", courseCode: "ELCS Lab", room: "Language Lab" },
        "Tuesday-02:20": { id: "1_1C-t-5", courseCode: "ELCS Lab", room: "Language Lab" },
        "Tuesday-03:20": { id: "1_1C-t-6", courseCode: "ELCS Lab", room: "Language Lab" },
        "Wednesday-09:40": { id: "1_1C-w-1", courseCode: "LA&ODE", room: "G. Shankar" },
        "Wednesday-10:40": { id: "1_1C-w-2", courseCode: "English", room: "B. Gnanesh Netha" },
        "Wednesday-11:40": { id: "1_1C-w-3", courseCode: "CPPS", room: "Mrs. P. Vijaya Kumari" },
        "Wednesday-01:20": { id: "1_1C-w-4", courseCode: "CPPS Lab", room: "Mrs. P. Vijaya Kumari" },
        "Wednesday-02:20": { id: "1_1C-w-5", courseCode: "CPPS Lab", room: "Mrs. P. Vijaya Kumari" },
        "Wednesday-03:20": { id: "1_1C-w-6", courseCode: "CPPS Lab", room: "Mrs. P. Vijaya Kumari" },
        "Thursday-09:40": { id: "1_1C-th-1", courseCode: "English", room: "B. Gnanesh Netha" },
        "Thursday-10:40": { id: "1_1C-th-2", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Thursday-11:40": { id: "1_1C-th-3", courseCode: "English", room: "B. Gnanesh Netha" },
        "Thursday-01:20": { id: "1_1C-th-4", courseCode: "ITWS Lab", room: "Mrs. P. Vijaya Kumari" },
        "Thursday-02:20": { id: "1_1C-th-5", courseCode: "ITWS Lab", room: "Mrs. P. Vijaya Kumari" },
        "Thursday-03:20": { id: "1_1C-th-6", courseCode: "ITWS Lab", room: "Mrs. P. Vijaya Kumari" },
        "Friday-09:40": { id: "1_1C-f-1", courseCode: "LA&ODE", room: "G. Shankar" },
        "Friday-10:40": { id: "1_1C-f-2", courseCode: "LA&ODE", room: "G. Shankar" },
        "Friday-11:40": { id: "1_1C-f-3", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Friday-01:20": { id: "1_1C-f-4", courseCode: "CPPS", room: "Mrs. P. Vijaya Kumari" },
        "Friday-02:20": { id: "1_1C-f-5", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Friday-03:20": { id: "1_1C-f-6", courseCode: "Sports", room: "Ground" },
        "Saturday-09:40": { id: "1_1C-sa-1", courseCode: "LA&ODE", room: "G. Shankar" },
        "Saturday-10:40": { id: "1_1C-sa-2", courseCode: "EC", room: "Dr. A. Premalatha" },
        "Saturday-11:40": { id: "1_1C-sa-3", courseCode: "CPPS", room: "Mrs. P. Vijaya Kumari" },
        "Saturday-01:20": { id: "1_1C-sa-4", courseCode: "English", room: "B. Gnanesh Netha" },
        "Saturday-02:20": { id: "1_1C-sa-5", courseCode: "English", room: "B. Gnanesh Netha" },
        "Saturday-03:20": { id: "1_1C-sa-6", courseCode: "Library", room: "Library" },
    },

    // ── Year 1 Sem 2 ── Section B (rotated labs)
    "1-2-B": {
        "Monday-09:40": { id: "1_2B-m-1", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Monday-10:40": { id: "1_2B-m-2", courseCode: "DS", room: "Manga Rao" },
        "Monday-11:40": { id: "1_2B-m-3", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Monday-01:20": { id: "1_2B-m-4", courseCode: "AP Lab", room: "Dr. K. Rama Rao" },
        "Monday-02:20": { id: "1_2B-m-5", courseCode: "AP Lab", room: "Dr. K. Rama Rao" },
        "Monday-03:20": { id: "1_2B-m-6", courseCode: "AP Lab", room: "Dr. K. Rama Rao" },
        "Tuesday-09:40": { id: "1_2B-t-1", courseCode: "DS Lab", room: "Manga Rao" },
        "Tuesday-10:40": { id: "1_2B-t-2", courseCode: "DS Lab", room: "Manga Rao" },
        "Tuesday-11:40": { id: "1_2B-t-3", courseCode: "DS Lab", room: "Manga Rao" },
        "Tuesday-01:20": { id: "1_2B-t-4", courseCode: "DS", room: "Manga Rao" },
        "Tuesday-02:20": { id: "1_2B-t-5", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Tuesday-03:20": { id: "1_2B-t-6", courseCode: "DS", room: "Manga Rao" },
        "Wednesday-09:40": { id: "1_2B-w-1", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Wednesday-10:40": { id: "1_2B-w-2", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Wednesday-11:40": { id: "1_2B-w-3", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Wednesday-01:20": { id: "1_2B-w-4", courseCode: "BEE Lab", room: "Mr. Ch. Naveen" },
        "Wednesday-02:20": { id: "1_2B-w-5", courseCode: "BEE Lab", room: "Mr. Ch. Naveen" },
        "Wednesday-03:20": { id: "1_2B-w-6", courseCode: "BEE Lab", room: "Mr. Ch. Naveen" },
        "Thursday-09:40": { id: "1_2B-th-1", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Thursday-10:40": { id: "1_2B-th-2", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Thursday-11:40": { id: "1_2B-th-3", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Thursday-01:20": { id: "1_2B-th-4", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Thursday-02:20": { id: "1_2B-th-5", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Thursday-03:20": { id: "1_2B-th-6", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Friday-09:40": { id: "1_2B-f-1", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Friday-10:40": { id: "1_2B-f-2", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Friday-11:40": { id: "1_2B-f-3", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Friday-01:20": { id: "1_2B-f-4", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Friday-02:20": { id: "1_2B-f-5", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Friday-03:20": { id: "1_2B-f-6", courseCode: "Sports", room: "Ground" },
        "Saturday-09:40": { id: "1_2B-sa-1", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Saturday-10:40": { id: "1_2B-sa-2", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Saturday-11:40": { id: "1_2B-sa-3", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Saturday-01:20": { id: "1_2B-sa-4", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Saturday-02:20": { id: "1_2B-sa-5", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Saturday-03:20": { id: "1_2B-sa-6", courseCode: "Library", room: "Library" },
    },

    // ── Year 1 Sem 2 ── Section C (rotated labs)
    "1-2-C": {
        "Monday-09:40": { id: "1_2C-m-1", courseCode: "DS", room: "Manga Rao" },
        "Monday-10:40": { id: "1_2C-m-2", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Monday-11:40": { id: "1_2C-m-3", courseCode: "DS", room: "Manga Rao" },
        "Monday-01:20": { id: "1_2C-m-4", courseCode: "DS", room: "Manga Rao" },
        "Monday-02:20": { id: "1_2C-m-5", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Monday-03:20": { id: "1_2C-m-6", courseCode: "DS", room: "Manga Rao" },
        "Tuesday-09:40": { id: "1_2C-t-1", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Tuesday-10:40": { id: "1_2C-t-2", courseCode: "DS", room: "Manga Rao" },
        "Tuesday-11:40": { id: "1_2C-t-3", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Tuesday-01:20": { id: "1_2C-t-4", courseCode: "BEE Lab", room: "Mr. Ch. Naveen" },
        "Tuesday-02:20": { id: "1_2C-t-5", courseCode: "BEE Lab", room: "Mr. Ch. Naveen" },
        "Tuesday-03:20": { id: "1_2C-t-6", courseCode: "BEE Lab", room: "Mr. Ch. Naveen" },
        "Wednesday-09:40": { id: "1_2C-w-1", courseCode: "DS Lab", room: "Manga Rao" },
        "Wednesday-10:40": { id: "1_2C-w-2", courseCode: "DS Lab", room: "Manga Rao" },
        "Wednesday-11:40": { id: "1_2C-w-3", courseCode: "DS Lab", room: "Manga Rao" },
        "Wednesday-01:20": { id: "1_2C-w-4", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Wednesday-02:20": { id: "1_2C-w-5", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Wednesday-03:20": { id: "1_2C-w-6", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Thursday-09:40": { id: "1_2C-th-1", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Thursday-10:40": { id: "1_2C-th-2", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Thursday-11:40": { id: "1_2C-th-3", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Thursday-01:20": { id: "1_2C-th-4", courseCode: "AP Lab", room: "Dr. K. Rama Rao" },
        "Thursday-02:20": { id: "1_2C-th-5", courseCode: "AP Lab", room: "Dr. K. Rama Rao" },
        "Thursday-03:20": { id: "1_2C-th-6", courseCode: "AP Lab", room: "Dr. K. Rama Rao" },
        "Friday-09:40": { id: "1_2C-f-1", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Friday-10:40": { id: "1_2C-f-2", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Friday-11:40": { id: "1_2C-f-3", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Friday-01:20": { id: "1_2C-f-4", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Friday-02:20": { id: "1_2C-f-5", courseCode: "SM&VC", room: "Dr. P. Madhavi" },
        "Friday-03:20": { id: "1_2C-f-6", courseCode: "Sports", room: "Ground" },
        "Saturday-09:40": { id: "1_2C-sa-1", courseCode: "BEFA", room: "Mrs. G. Sunitha" },
        "Saturday-10:40": { id: "1_2C-sa-2", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Saturday-11:40": { id: "1_2C-sa-3", courseCode: "AP", room: "Dr. K. Rama Rao" },
        "Saturday-01:20": { id: "1_2C-sa-4", courseCode: "DS", room: "Mrs. M. Suryakumari" },
        "Saturday-02:20": { id: "1_2C-sa-5", courseCode: "BEE", room: "Mr. Ch. Naveen" },
        "Saturday-03:20": { id: "1_2C-sa-6", courseCode: "Library", room: "Library" },
    },
    // ── Year 2 Sem 2 ── Section B
    "2-2-B": {
        "Monday-09:40": { id: "2_2B-m-1", courseCode: "JAVA Lab", room: "Mrs. D. Mounika" },
        "Monday-10:40": { id: "2_2B-m-2", courseCode: "JAVA Lab", room: "Mrs. D. Mounika" },
        "Monday-11:40": { id: "2_2B-m-3", courseCode: "JAVA Lab", room: "Mrs. D. Mounika" },
        "Monday-01:20": { id: "2_2B-m-4", courseCode: "WT", room: "Staff" },
        "Monday-02:20": { id: "2_2B-m-5", courseCode: "DAA", room: "Mr. N. Kiran Kumar" },
        "Monday-03:20": { id: "2_2B-m-6", courseCode: "SE", room: "Mrs. E. Radhika" },
        "Tuesday-09:40": { id: "2_2B-t-1", courseCode: "DBMS", room: "Mrs. S. Gnaneshwari" },
        "Tuesday-10:40": { id: "2_2B-t-2", courseCode: "JAVA", room: "Mrs. D. Mounika" },
        "Tuesday-11:40": { id: "2_2B-t-3", courseCode: "DAA", room: "Mr. N. Kiran Kumar" },
        "Thursday-09:40": { id: "2_2B-th-1", courseCode: "SE", room: "Mrs. E. Radhika" },
        "Thursday-10:40": { id: "2_2B-th-2", courseCode: "DBMS", room: "Mrs. S. Gnaneshwari" },
        "Thursday-11:40": { id: "2_2B-th-3", courseCode: "JAVA", room: "Mrs. D. Mounika" },
        "Wednesday-02:20": { id: "w-2-5-B", courseCode: "OOPS", room: "Shanti" },
        "Saturday-02:20": { id: "sa-2-5-B", courseCode: "OOPS", room: "Shanti" },
    },
    // ── Year 2 Sem 2 ── Section C
    "2-2-C": {
        "Monday-09:40": { id: "2_2C-m-1", courseCode: "JAVA Lab", room: "Mrs. P. Vijaya Kumari" },
        "Monday-10:40": { id: "2_2C-m-2", courseCode: "JAVA Lab", room: "Mrs. P. Vijaya Kumari" },
        "Monday-11:40": { id: "2_2C-m-3", courseCode: "JAVA Lab", room: "Mrs. P. Vijaya Kumari" },
        "Monday-01:20": { id: "2_2C-m-4", courseCode: "WT", room: "Mrs. D. Mounika" },
        "Monday-02:20": { id: "2_2C-m-5", courseCode: "DAA", room: "Mrs. S. Gnaneshwari" },
        "Monday-03:20": { id: "2_2C-m-6", courseCode: "SE", room: "Staff" },
        "Tuesday-09:40": { id: "2_2C-t-1", courseCode: "DBMS", room: "Mrs. T. Praneetha" },
        "Tuesday-10:40": { id: "2_2C-t-2", courseCode: "JAVA", room: "Mr. R. Naga Raju" },
        "Tuesday-11:40": { id: "2_2C-t-3", courseCode: "DAA", room: "Mrs. S. Gnaneshwari" },
        "Wednesday-09:40": { id: "2_2C-w-1", courseCode: "DBMS Lab", room: "Mrs. P. Vijaya Kumari" },
        "Wednesday-10:40": { id: "2_2C-w-2", courseCode: "DBMS Lab", room: "Mrs. P. Vijaya Kumari" },
        "Wednesday-11:40": { id: "2_2C-w-3", courseCode: "DBMS Lab", room: "Mrs. P. Vijaya Kumari" },
        "Thursday-09:40": { id: "2_2C-th-1", courseCode: "SE", room: "Staff" },
        "Thursday-10:40": { id: "2_2C-th-2", courseCode: "DBMS", room: "Mrs. T. Praneetha" },
        "Thursday-11:40": { id: "2_2C-th-3", courseCode: "JAVA", room: "Mr. R. Naga Raju" },
        "Wednesday-02:20": { id: "w-2-5-C", courseCode: "OOPS", room: "Shanti" },
        "Saturday-02:20": { id: "sa-2-5-C", courseCode: "OOPS", room: "Shanti" },
    },
    // ── Year 2 Sem 1 ── Section B
    "2-1-B": {
        "Monday-09:40": { id: "2_1B-m-1", courseCode: "PP Lab", room: "Anitha Chowdary" },
        "Monday-10:40": { id: "2_1B-m-2", courseCode: "PP Lab", room: "Anitha Chowdary" },
        "Monday-11:40": { id: "2_1B-m-3", courseCode: "PP Lab", room: "Anitha Chowdary" },
        "Monday-01:20": { id: "2_1B-m-4", courseCode: "4E3ED", room: "Staff" },
        "Tuesday-11:40": { id: "2_1B-t-3", courseCode: "4E3EB", room: "Mrs. D. Mounika" },
    },
    // ── Year 2 Sem 1 ── Section C
    "2-1-C": {
        "Monday-09:40": { id: "2_1C-m-1", courseCode: "PP Lab", room: "Manga Rao" },
        "Monday-10:40": { id: "2_1C-m-2", courseCode: "PP Lab", room: "Manga Rao" },
        "Monday-11:40": { id: "2_1C-m-3", courseCode: "PP Lab", room: "Manga Rao" },
        "Monday-01:20": { id: "2_1C-m-4", courseCode: "4E3ED", room: "Dr. Nallamothu Satyanarayana" },
        "Tuesday-11:40": { id: "2_1C-t-3", courseCode: "PP", room: "Manga Rao" },
    },
    // ── Year 4 Sem 1 ── Section B
    "4-1-B": {
        "Monday-01:20": { id: "4_1B-m-4", courseCode: "BDA", room: "Mrs. P. Rajini" },
        "Monday-03:20": { id: "4_1B-m-6", courseCode: "IS", room: "RAMYA PRIYA" },
        "Tuesday-01:20": { id: "4_1B-t-4", courseCode: "IS", room: "RAMYA PRIYA" },
        "Wednesday-01:20": { id: "4_1B-w-4", courseCode: "BDA", room: "Mrs. P. Rajini" },
        "Wednesday-03:20": { id: "4_1B-w-6", courseCode: "IS", room: "RAMYA PRIYA" },
    },
    // ── Year 3 Sem 2 ── Section C
    "3-2-C": {
        "Monday-01:20": { id: "3_2C-m-4", courseCode: "DL", room: "Mrs. P. Vijaya Kumari" },
        "Tuesday-09:40": { id: "3_2-t-1-C", courseCode: "DL Lab", room: "Mrs. P. Vijaya Kumari" },
        "Tuesday-10:40": { id: "3_2-t-2-C", courseCode: "DL Lab", room: "Mrs. P. Vijaya Kumari" },
        "Tuesday-11:40": { id: "3_2-t-3-C", courseCode: "DL Lab", room: "Mrs. P. Vijaya Kumari" },
    },

    // ── IT BRANCH Section B Overrides (Balanced WSN, IoT, ML, DM) ──
    "IT-3-1-B": {
        "Monday-09:40": { id: "it_31B-m-1", courseCode: "it-4E5FA", room: "Dr. M. Dhasaratham" },
        "Tuesday-09:40": { id: "it_31B-t-1", courseCode: "it-4E5FB", room: "Dr. M. Dhasaratham" },
    },
    "IT-3-2-B": {
        "Monday-09:40": { id: "it_32B-m-1", courseCode: "it-4E6FA", room: "Dr. M. Dhasaratham" },
        "Tuesday-09:40": { id: "it_32B-t-1", courseCode: "it-4E6FB", room: "N. Paparayudu" },
    },
    "IT-4-1-B": {
        "Monday-09:40": { id: "it_41B-m-1", courseCode: "it-4P7FB", room: "Thakur Madhumathi" },
    },

    // ── CSE BRANCH Section B Overrides (Balanced ML, DM, DL) ──
    "CSE-3-1-B": {
        "Monday-09:40": { id: "cse_31B-m-1", courseCode: "4E5EC", room: "Mrs. Y. Latha" },
    },
    "CSE-3-2-B": {
        "Monday-09:40": { id: "cse_32B-m-1", courseCode: "4E6EC", room: "Dr. M. Narender" },
    },
    "CSE-4-1-B": {
        "Monday-09:40": { id: "cse_41B-m-1", courseCode: "4E7EA", room: "Dr. M. Narender" },
    },

    "CSE-2-1-B": {
        "Monday-01:20": { id: "cse_21B-m-4", courseCode: "4E3ED", room: "Mrs. Thirumani Anusha" },
    },

    // ── ECE BRANCH Section B Overrides (Balanced LA&ODE) ──
    "ECE-1-1-B": {
        "Monday-01:20": { id: "ece_11B-m-4", courseCode: "LA&ODE", room: "G. Shankar" },
    },
};

Object.assign(AIML_TIMETABLES, SECTION_VARIANTS);

/**
 * Section-aware timetable lookup.
 * Tries Branch-Year-Sem-Section first, then Branch-Year-Sem, then falls back to legacy year-sem-section.
 * All callers should use this instead of AIML_TIMETABLES directly.
 */
export function getTimetable(year: string | number, sem: string | number, section = 'A', branch = 'CSM') {
    const branchSectionKey = `${branch}-${year}-${sem}-${section}`;
    const branchGenericKey = `${branch}-${year}-${sem}`;
    const legacySectionKey = `${year}-${sem}-${section}`;
    const legacyGenericKey = `${year}-${sem}`;

    return AIML_TIMETABLES[branchSectionKey] ?? 
           AIML_TIMETABLES[branchGenericKey] ?? 
           AIML_TIMETABLES[legacySectionKey] ?? 
           AIML_TIMETABLES[legacyGenericKey] ?? {};
}

export const FACULTY_LOAD = {
    // 1st Year Sem 1 (I-I) - CSM Syllabus Standardized
    "1-1": [
        { code: "CPPS", faculty: "Dr. D. Anitha Kumari", room: "Classroom 101" },
        { code: "CPPS", faculty: "Mrs. P. Rajyalakshmi", room: "Classroom 102" },
        { code: "CPPS Lab", faculty: "Dr. D. Anitha Kumari", room: "Lab 1" },
        { code: "CPPS Lab", faculty: "Mrs. D. Mounika", room: "Lab 2" },
        { code: "CPPS Lab", faculty: "Mrs. P. Rajyalakshmi", room: "Lab 3" },
        { code: "LA&ODE", faculty: "Sreedevi", room: "Classroom 101" },
        { code: "LA&ODE", faculty: "G. Shankar", room: "Classroom 101" },
        { code: "English", faculty: "Sudha Menon", room: "Classroom 101" },
        { code: "ELCS Lab", faculty: "Sudha Menon", room: "Language Lab" },
        { code: "ELCS Lab", faculty: "B. Gnanesh Netha", room: "Language Lab 2" },
        { code: "EC", faculty: "Dr. A. Premalatha", room: "Classroom 101" },
        { code: "EC Lab", faculty: "Dr. A. Premalatha", room: "Chemistry Lab" },
        { code: "EC Lab", faculty: "Dr. K. Rama Rao", room: "Chemistry Lab 2" },
        { code: "ITWS Lab", faculty: "Mrs. M. Suryakumari", room: "Workshop" },
        { code: "ITWS Lab", faculty: "Anitha Chowdary", room: "Workshop 2" },
        { code: "ITWS Lab", faculty: "Mrs. P. Rajyalakshmi", room: "Workshop 3" },
        { code: "CAEG", faculty: "Dhanunjayasingh", room: "Drawing Hall" },
        { code: "CAEG", faculty: "B. Mahesh", room: "Drawing Hall 2" }
    ],
    // 1st Year Sem 2 (I-II) - CSM Syllabus Standardized
    "1-2": [
        { code: "DS", faculty: "Mrs. M. Suryakumari", room: "Classroom 102" },
        { code: "DS Lab", faculty: "Mr. K. Venugopal Reddy", room: "Lab 2" },
        { code: "SM&VC", faculty: "Dr. P. Madhavi", room: "Classroom 102" },
        { code: "AP", faculty: "Dr. K. Rama Rao", room: "Classroom 102" },
        { code: "AP Lab", faculty: "Dr. K. Rama Rao", room: "Physics Lab" },
        { code: "BEE", faculty: "Mr. Ch. Naveen", room: "Classroom 102" },
        { code: "BEE Lab", faculty: "Mr. Ch. Naveen", room: "BEE Lab" },
        { code: "BEFA", faculty: "Mrs. G. Sunitha", room: "Classroom 102" },
        { code: "DS", faculty: "Manga Rao", room: "Classroom 102" }
    ],
    // 2nd Year Sem 1 (II-I) - Semester 3
    "2-1": [
        { code: "SM&VC", faculty: "Dr. P. Madhavi", id: "p-madhavi", room: "Classroom 201" },
        { code: "DS Lab", faculty: "Mrs. D. Mounika", id: "d-mounika", room: "Lab 2" },
        { code: "WT Lab", faculty: "Mrs. Srujana Reddy Aynala", id: "srujana-reddy-aynala", room: "Lab 3" },
        { code: "4E3ED", faculty: "Mrs. Ch. Shilpa", id: "shilpa-ch-csm", room: "Classroom 201" },
        { code: "4E3ED", faculty: "Mrs. M. Indira", id: "m-indira", room: "Classroom 201" },
        { code: "4E3ED", faculty: "Dr. Nallamothu Satyanarayana", id: "nallamothu-satyanarayana", room: "Classroom 201" },
        { code: "4E3EB", faculty: "Mrs. D. Mounika", id: "d-mounika", room: "Classroom 201" },
        { code: "4E3EC", faculty: "Mrs. T. Praneetha", id: "t-praneetha", room: "Classroom 201" },
        { code: "OE", faculty: "Mrs. M. Indira", id: "m-indira", room: "Classroom 201" },
        { code: "4E3EE", faculty: "Mrs. S. Swathi", id: "s-swathi", room: "Classroom 201" },
        { code: "PP Lab", faculty: "Anitha Chowdary", id: "anitha-chowdary", room: "Lab 2" },
        { code: "PP Lab", faculty: "Manga Rao", id: "manga-rao", room: "Lab 2" }
    ],
    // 2nd Year Sem 2 (II-II) - Semester 4
    "2-2": [
        { code: "DBMS Lab", faculty: "Mrs. T. Praneetha", room: "Lab 2" },
        { code: "Java Lab", faculty: "Dr. D. Anitha Kumari", room: "Lab 3" },
        { code: "English Lab", faculty: "Mrs. G. Sunitha", room: "Language Lab" },
        { code: "WT Lab", faculty: "Mrs. E. Radhika", room: "Lab 1" },
        { code: "Java", faculty: "Dr. D. Anitha Kumari", room: "Classroom 202" },
        { code: "DAA", faculty: "Mallayya", room: "Classroom 202" },
        { code: "DBMS", faculty: "Mrs. T. Praneetha", room: "Classroom 202" },
        { code: "SE", faculty: "Mrs. E. Radhika", room: "Classroom 202" },
        { code: "WT", faculty: "Mrs. E. Radhika", room: "Classroom 202" }
    ],
    // 3rd Year Sem 1 (III-I)
    "3-1": [
        { code: "AI", faculty: "Mrs. C. Saritha Reddy", room: "Classroom 301" },
        { code: "ATCD", faculty: "Mrs. D. Uma Maheshwari", room: "Classroom 301" },
        { code: "DevOps", faculty: "Mr. Ande Srinivasa Reddy", room: "Lab 4" },
        { code: "ML", faculty: "Mrs. C. Jaya Lakshmi", room: "Classroom 301" },
        { code: "OOAD", faculty: "Mrs. P. Geethanjali", room: "Classroom 301" },
        { code: "OS", faculty: "Mrs. K. Ishwarya Devi", room: "Classroom 301" }
    ],
    // 3rd Year Sem 2 (III-II)
    "3-2": [
        { code: "Conv. AI", faculty: "Dr. Syed Hussain", room: "Classroom 302" },
        { code: "NLP", faculty: "Vinay", room: "Classroom 302" },
        { code: "NLP Lab", faculty: "Vinay", room: "Lab AI" },
        { code: "DL", faculty: "Mrs. C. Jaya Lakshmi", room: "Classroom 302" },
        { code: "DL Lab", faculty: "Mrs. C. Jaya Lakshmi", room: "Lab AI" },
        { code: "RPA", faculty: "Mr. Ande Srinivasa Reddy", room: "Lab 3" },
        { code: "IS", faculty: "Dr. Syed Hussain", room: "Classroom 302" },
        { code: "OE", faculty: "Mrs. V. Pravalika", room: "Hall B" }
    ],
    // 4th Year Sem 1 (IV-I)
    "4-1": [
        { code: "BDA", faculty: "Mrs. P. Rajini", room: "Classroom 401" },
        { code: "BDA Lab", faculty: "Mrs. P. Rajini", room: "AI Lab" },
        { code: "DM", faculty: "Mrs. V. Pravalika", room: "Classroom 401" },
        { code: "IS", faculty: "Dr. Syed Hussain", room: "Classroom 401" },
        { code: "KRR", faculty: "Mr. K. Venugopal Reddy", room: "Classroom 401" },
        { code: "IS", faculty: "RAMYA PRIYA", room: "Classroom 401" }
    ],
    // 4th Year Sem 2 (IV-II)
    "4-2": [
        { code: "RL", faculty: "Dr. Syed Hussain", room: "Classroom 402" },
        { code: "QC", faculty: "Mrs. D Uma Maheshwari", room: "Classroom 402" },
        { code: "OE", faculty: "Mrs. V. Pravalika", room: "Hall A" },
        { code: "DS OE", faculty: "Dr. B. Sunil Srinivas", room: "Classroom 402" }
    ],

    // --- IT BRANCH SPECIFIC LOADS ---
    "IT-1-1": [
        { code: "4B1AA", faculty: "P Sanjeeva Reddy", room: "T-101" },
        { code: "4B1AM", faculty: "Mrs. B. Madhavi", room: "T-101" },
        { code: "4B1AL", faculty: "Mr. Ch. Naveen", room: "T-101" },
        { code: "4B1AK", faculty: "Dr. K. Rama Rao", room: "T-101" },
        { code: "4E1DC", faculty: "Dhanunjayasingh", room: "Drawing Hall" }
    ],
    "IT-1-2": [
        { code: "4B2AI", faculty: "Dr. P. Madhavi", room: "T-201" },
        { code: "4B2AM", faculty: "Dr. P. Madhavi", room: "T-201" },
        { code: "4E2AJ", faculty: "V. Murugan", room: "T-201" },
        { code: "4E2AT", faculty: "Mrs. B. Madhavi", room: "T-201" },
        { code: "4H2AC", faculty: "B. Gnanesh Netha", room: "T-201" }
    ],
    "IT-2-1": [
        { code: "it-4B3AD", faculty: "Dr. P. Madhavi", room: "N-301" },
        { code: "it-4E3FB", faculty: "Dr. Nallamothu Satyanarayana", room: "N-301" },
        { code: "it-4E3FC", faculty: "Mounika Nakrekanti", room: "N-301" },
        { code: "it-4E3FD", faculty: "Nagaraju Rajupeta", room: "N-301" },
        { code: "it-4H3FA", faculty: "Mrs. G. Sunitha", room: "N-301" }
    ],
    "IT-2-2": [
        { code: "it-4E4FA", faculty: "Mrs. E. Radhika", room: "N-401" },
        { code: "it-4E4FB", faculty: "V. Murugan", room: "N-401" },
        { code: "it-4E4FC", faculty: "P. Swathi", room: "N-401" },
        { code: "it-4E4FD", faculty: "N. Anjali", room: "N-401" },
        { code: "it-4E4FE", faculty: "Mounika Nakrekanti", room: "N-401" }
    ],
    "IT-3-1": [
        { code: "it-4E5FA", faculty: "Dr. R. Muruganantham", room: "N-501" },
        { code: "it-4E5FA", faculty: "Dr. M. Dhasaratham", room: "N-501" },
        { code: "it-4E5FB", faculty: "Dr. R. Muruganantham", room: "N-501" },
        { code: "it-4E5FB", faculty: "Dr. M. Dhasaratham", room: "N-501" },
        { code: "it-4H5EA", faculty: "Mallayya", room: "N-501" },
        { code: "it-4O5FA", faculty: "Mandalreddy Sushma", room: "N-501" },
        { code: "it-4P5FA", faculty: "Jarapala Ramesh", room: "N-501" },
        { code: "it-4P5FD", faculty: "Mrs. P. Rajini", room: "N-501" }
    ],
    "IT-3-2": [
        { code: "it-4E6FA", faculty: "Dr. R. Muruganantham", room: "N-601" },
        { code: "it-4E6FA", faculty: "Dr. M. Dhasaratham", room: "N-601" },
        { code: "it-4E6FB", faculty: "Dr. Nallamothu Satyanarayana", room: "N-601" },
        { code: "it-4E6FB", faculty: "N. Paparayudu", room: "N-601" },
        { code: "it-4E6FC", faculty: "Mrs. S. Swathi", room: "N-601" },
        { code: "it-4O6FA", faculty: "Mrs. V. Pravalika", room: "N-601" },
        { code: "it-4P6FC", faculty: "Dr. Syed Hussain", room: "N-601" }
    ],
    "IT-4-1": [
        { code: "it-4E7FA", faculty: "P. Himabindu", room: "N-701" },
        { code: "it-4O7FA", faculty: "Mrs. M. Indira", room: "N-701" },
        { code: "it-4P7FB", faculty: "D. Kavitha", room: "N-701" },
        { code: "it-4P7FB", faculty: "Thakur Madhumathi", room: "N-701" },
        { code: "it-4P7FD", faculty: "Jarapala Ramesh", room: "N-701" },
        { code: "it-4P7PW", faculty: "B. Upender", room: "N-701" }
    ],

    // --- CSE BRANCH SPECIFIC LOADS ---
    "CSE-1-1": [
        { code: "4E1AJ", faculty: "A. Pradeep", room: "C-101" },
        { code: "4E115", faculty: "Mr. K. Indra Kiran Reddy", room: "ITWS Lab" },
        { code: "4B1AA", faculty: "P Sanjeeva Reddy", room: "C-101" },
        { code: "4B1AG", faculty: "B. Gnanesh Netha", room: "C-101" }
    ],
    "CSE-2-1": [
        { code: "4B3AD", faculty: "Dr. P. Madhavi", room: "C-301" },
        { id: "cse-s3-5", code: "4E3EB", faculty: "Mrs. Thirumani Anusha", room: "C-301" },
        { id: "cse-s3-6", code: "4E3EC", faculty: "Mrs. G. Deepthi", room: "C-301" },
        { id: "cse-s3-7", code: "4E3ED", faculty: "Mrs. G. Deepthi", room: "C-301" },
        { id: "cse-s3-7", code: "4E3ED", faculty: "Mrs. Thirumani Anusha", room: "C-301" },
        { id: "cse-s3-8", code: "4E3EE", faculty: "Mrs. Pragathi Vulpala", room: "C-301" }
    ],
    "CSE-2-2": [
        { code: "4E4EA", faculty: "Mr. B. Srikanth", room: "C-401" },
        { code: "4E4EB", faculty: "Mrs. G. Deepthi", room: "C-401" },
        { code: "4E4EC", faculty: "Mrs. M. Jyothi", room: "C-401" },
        { code: "4E4ED", faculty: "Dr. Kuna Naresh", room: "C-401" },
        { code: "4E4EE", faculty: "A. Pradeep", room: "C-401" }
    ],
    "CSE-3-1": [
        { code: "4E5EA", faculty: "Mrs. G. Deepthi", room: "C-501" },
        { code: "4E5EB", faculty: "Mrs. S. Swathi", room: "C-501" },
        { code: "4E5EC", faculty: "Dr. A. Suresh Rao", room: "C-501" },
        { code: "4E5EC", faculty: "Mrs. Y. Latha", room: "C-501" },
        { code: "4P5EC", faculty: "Mrs. Y. Latha", room: "C-501" },
        { code: "4P5EG", faculty: "Mr. L. Gnanender Reddy", room: "C-501" }
    ],
    "CSE-3-2": [
        { code: "4E6EC", faculty: "Mr. K. Venugopal Reddy", room: "C-601" },
        { code: "4E6EC", faculty: "Dr. M. Narender", room: "C-601" },
        { code: "4P6EA", faculty: "P. Chandra Shekar", room: "C-601" },
        { code: "4P6EE", faculty: "Mrs. M. Thanmayee", room: "C-601" }
    ],
    "CSE-4-1": [
        { code: "4E7EA", faculty: "Dr. Vempati Krishna", room: "C-701" },
        { code: "4E7EA", faculty: "Dr. M. Narender", room: "C-701" },
        { code: "4E7EB", faculty: "Mrs. K. Naga Maha Lakshmi", room: "C-701" }
    ],

    // --- ECE BRANCH SPECIFIC LOADS ---
    "ECE-1-1": [
        { code: "LA&ODE", faculty: "Sreedevi", room: "E-101" },
        { code: "LA&ODE", faculty: "G. Shankar", room: "E-101" },
        { code: "EP", faculty: "Rajnijanth", room: "E-101" },
        { code: "FEE", faculty: "Raju", room: "E-101" },
        { code: "CPPS Lab", faculty: "Pavani", room: "E-101" }
    ],
    "ECE-1-2": [
        { code: "MT", faculty: "B. Mahesh", room: "E-102" },
        { code: "EC", faculty: "Dr. A. Premalatha", room: "E-102" },
        { code: "English", faculty: "B. Gnanesh Netha", room: "E-102" },
        { code: "CAEG", faculty: "Dhanunjayasingh", room: "E-102" }
    ],
    "ECE-2-1": [
        { code: "DLD", faculty: "Mr. M. Sai Krishna", room: "E-301" },
        { code: "NT", faculty: "Mr. K. Hemanth", room: "E-301" },
        { code: "ECA", faculty: "Dr. B. Swapna Rani", room: "E-301" },
        { code: "CAVC", faculty: "Mr. Mahesh", room: "E-301" },
        { code: "SS", faculty: "M. Gnanesh Goud", room: "E-301" }
    ],
    "ECE-2-2": [
        { code: "ADC", faculty: "Ms. B. Shreshta", room: "E-401" },
        { code: "PTSP", faculty: "Mrs. Bhavani", room: "E-401" },
        { code: "PDC", faculty: "Mrs. S. Saritha", room: "E-401" },
        { code: "EMTL", faculty: "Mrs. M. Jhansi Rani", room: "E-401" },
        { code: "LDICA", faculty: "Mrs. D. Swathi", room: "E-401" }
    ],
    "ECE-3-1": [
        { code: "MPMC", faculty: "Dr. P. Venkata Lavanya", room: "E-501" },
        { code: "Python", faculty: "K. Sushma", room: "E-501" }
    ],
    "ECE-3-2": [
        { code: "AWP", faculty: "K. Shalini", room: "E-601" },
        { code: "DSP", faculty: "M. Gnanesh Goud", room: "E-601" },
        { code: "VLSI", faculty: "CH. Divya", room: "E-601" },
        { code: "DIP", faculty: "Dr. P. Venkata Lavanya", room: "E-601" },
        { code: "IoT", faculty: "K. Sushma", room: "E-601" }
    ],
    "ECE-4-1": [
        { code: "MWE", faculty: "Dr. J. Sunitha Kumari", room: "E-701" },
        { code: "PE", faculty: "Dr. R. Rajendranath", room: "E-701" },
        { code: "ESD", faculty: "Ms. CH. Swapna", room: "E-701" },
        { code: "SC", faculty: "Mrs. A. Haritha", room: "E-701" }
    ],
    "ECE-4-2": [
        { code: "OS", faculty: "Ms. CH. Swapna", room: "E-801" },
        { code: "DSP&A", faculty: "Mrs. A. Haritha", room: "E-801" },
        { code: "OFC", faculty: "Mr. B. Pullarao", room: "E-801" },
        { code: "CN", faculty: "Mrs. S. Anusha", room: "E-801" }
    ]
};
