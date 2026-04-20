export interface TimetableEntry {
    id: string;
    courseCode: string;
    courseName?: string;
    room: string;
}

export const AIML_TIMETABLES: Record<string, Record<string, TimetableEntry | null>> = {
    // Year 1, Semester 1 (I-I) - Standardized Syllabus
    "1-1": {
        "Monday-09:40": { id: "1_1-m-1", courseCode: "4E1AJ", room: "Dr. D. Anitha Kumari" },
        "Monday-10:40": { id: "1_1-m-2", courseCode: "4E1AJ", room: "Dr. D. Anitha Kumari" },
        "Monday-11:40": { id: "1_1-m-3", courseCode: "4E1AJ", room: "Dr. D. Anitha Kumari" },
        "Monday-01:20": { id: "1_1-m-4", courseCode: "4B1AA", room: "Sreedevi" },
        "Monday-02:20": { id: "1_1-m-5", courseCode: "4B1AG", room: "Sudha Menon" },
        "Monday-03:20": { id: "1_1-m-6", courseCode: "4E1AJ", room: "Dr. D. Anitha Kumari" },

        "Tuesday-09:40": { id: "1_1-t-1", courseCode: "4B1AA", room: "Sreedevi" },
        "Tuesday-10:40": { id: "1_1-t-2", courseCode: "4H1AH", room: "Dr. A. Premalatha" },
        "Tuesday-11:40": { id: "1_1-t-3", courseCode: "4E1AJ", room: "Dr. D. Anitha Kumari" },
        "Tuesday-01:20": { id: "1_1-t-4", courseCode: "4E115", room: "Workshop" },
        "Tuesday-02:20": { id: "1_1-t-5", courseCode: "4E115", room: "Workshop" },
        "Tuesday-03:20": { id: "1_1-t-6", courseCode: "4E115", room: "Workshop" },

        "Wednesday-09:40": { id: "1_1-w-1", courseCode: "4E114", room: "Chemistry Lab" },
        "Wednesday-10:40": { id: "1_1-w-2", courseCode: "4E114", room: "Chemistry Lab" },
        "Wednesday-11:40": { id: "1_1-w-3", courseCode: "4E114", room: "Chemistry Lab" },
        "Wednesday-01:20": { id: "1_1-w-4", courseCode: "4B1AA", room: "Sreedevi" },
        "Wednesday-02:20": { id: "1_1-w-5", courseCode: "4B1AG", room: "Sudha Menon" },
        "Wednesday-03:20": { id: "1_1-w-6", courseCode: "4E1AJ", room: "Dr. D. Anitha Kumari" },

        "Thursday-09:40": { id: "1_1-th-1", courseCode: "4B108", room: "Language Lab" },
        "Thursday-10:40": { id: "1_1-th-2", courseCode: "4B108", room: "Language Lab" },
        "Thursday-11:40": { id: "1_1-th-3", courseCode: "4B108", room: "Language Lab" },
        "Thursday-01:20": { id: "1_1-th-4", courseCode: "4H1AH", room: "Dr. A. Premalatha" },
        "Thursday-02:20": { id: "1_1-th-5", courseCode: "4B1AA", room: "Sreedevi" },
        "Thursday-03:20": { id: "1_1-th-6", courseCode: "4E1AJ", room: "Dr. D. Anitha Kumari" },

        "Friday-09:40": { id: "1_1-f-1", courseCode: "4E1DD", room: "Drawing Hall" },
        "Friday-10:40": { id: "1_1-f-2", courseCode: "4E1DD", room: "Drawing Hall" },
        "Friday-11:40": { id: "1_1-f-3", courseCode: "4E1DD", room: "Drawing Hall" },
        "Friday-01:20": { id: "1_1-f-4", courseCode: "4H1AH", room: "Dr. A. Premalatha" },
        "Friday-02:20": { id: "1_1-f-5", courseCode: "4E1AJ", room: "Dr. D. Anitha Kumari" },
        "Friday-03:20": { id: "1_1-f-6", courseCode: "Sports", room: "Ground" },

        "Saturday-09:40": { id: "1_1-sa-1", courseCode: "4B1AA", room: "Sreedevi" },
        "Saturday-10:40": { id: "1_1-sa-2", courseCode: "4H1AH", room: "Dr. A. Premalatha" },
        "Saturday-11:40": { id: "1_1-sa-3", courseCode: "4B1AG", room: "Sudha Menon" },
        "Saturday-01:20": { id: "1_1-sa-4", courseCode: "4B1AA", room: "Sreedevi" },
        "Saturday-02:20": { id: "1_1-sa-5", courseCode: "4H1AH", room: "Dr. A. Premalatha" },
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
        "Monday-03:20": { id: "m-2-6", courseCode: "SE", room: "Mrs. Thirumani Anusha" },

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
        "Wednesday-03:20": { id: "w-2-6", courseCode: "SE", room: "Mrs. Thirumani Anusha" },

        // Thursday
        "Thursday-09:40": { id: "th-2-1", courseCode: "SE", room: "Mrs. Thirumani Anusha" },
        "Thursday-10:40": { id: "th-2-2", courseCode: "DBMS", room: "Mrs. P. Geethanjali" },
        "Thursday-11:40": { id: "th-2-3", courseCode: "JAVA", room: "Dr. D. Anitha Kumari" },
        "Thursday-01:20": { id: "th-2-4", courseCode: "DAA", room: "Mallayya" },
        "Thursday-02:20": { id: "th-2-5", courseCode: "DBMS", room: "Mrs. P. Geethanjali" },
        "Thursday-03:20": { id: "th-2-6", courseCode: "JAVA", room: "Dr. D. Anitha Kumari" },

        // Friday
        "Friday-09:40": { id: "f-2-1", courseCode: "DAA", room: "Mallayya" },
        "Friday-10:40": { id: "f-2-2", courseCode: "JAVA", room: "Dr. D. Anitha Kumari" },
        "Friday-11:40": { id: "f-2-3", courseCode: "SE", room: "Mrs. Thirumani Anusha" },
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
        "Monday-09:40": { id: "1_2-m-1", courseCode: "4E211", room: "Mr. K. Venugopal Reddy" },
        "Monday-10:40": { id: "1_2-m-2", courseCode: "4E211", room: "Mr. K. Venugopal Reddy" },
        "Monday-11:40": { id: "1_2-m-3", courseCode: "4E211", room: "Mr. K. Venugopal Reddy" },
        "Monday-01:20": { id: "1_2-m-4", courseCode: "4B2AM", room: "Dr. P. Madhavi" },
        "Monday-02:20": { id: "1_2-m-5", courseCode: "4E2AQ", room: "Mrs. M. Suryakumari" },
        "Monday-03:20": { id: "1_2-m-6", courseCode: "4B2AN", room: "Dr. K. Rama Rao" },

        "Tuesday-09:40": { id: "1_2-t-1", courseCode: "4B2AM", room: "Dr. P. Madhavi" },
        "Tuesday-10:40": { id: "1_2-t-2", courseCode: "4E2AP", room: "Mr. Ch. Naveen" },
        "Tuesday-11:40": { id: "1_2-t-3", courseCode: "4B2AN", room: "Dr. K. Rama Rao" },
        "Tuesday-01:20": { id: "1_2-t-4", courseCode: "4B209", room: "Dr. K. Rama Rao" },
        "Tuesday-02:20": { id: "1_2-t-5", courseCode: "4B209", room: "Dr. K. Rama Rao" },
        "Tuesday-03:20": { id: "1_2-t-6", courseCode: "4B209", room: "Dr. K. Rama Rao" },

        "Wednesday-09:40": { id: "1_2-w-1", courseCode: "4E2AQ", room: "Mrs. M. Suryakumari" },
        "Wednesday-10:40": { id: "1_2-w-2", courseCode: "4E2AP", room: "Mr. Ch. Naveen" },
        "Wednesday-11:40": { id: "1_2-w-3", courseCode: "4H2AL", room: "Mrs. G. Sunitha" },
        "Wednesday-01:20": { id: "1_2-w-4", courseCode: "4E2AQ", room: "Mrs. M. Suryakumari" },
        "Wednesday-02:20": { id: "1_2-w-5", courseCode: "4B2AN", room: "Dr. K. Rama Rao" },
        "Wednesday-03:20": { id: "1_2-w-6", courseCode: "4B2AM", room: "Dr. P. Madhavi" },

        "Thursday-09:40": { id: "1_2-th-1", courseCode: "4E210", room: "Mr. Ch. Naveen" },
        "Thursday-10:40": { id: "1_2-th-2", courseCode: "4E210", room: "Mr. Ch. Naveen" },
        "Thursday-11:40": { id: "1_2-th-3", courseCode: "4E210", room: "Mr. Ch. Naveen" },
        "Thursday-01:20": { id: "1_2-th-4", courseCode: "4B2AM", room: "Dr. P. Madhavi" },
        "Thursday-02:20": { id: "1_2-th-5", courseCode: "4E2AQ", room: "Mrs. M. Suryakumari" },
        "Thursday-03:20": { id: "1_2-th-6", courseCode: "4H2AL", room: "Mrs. G. Sunitha" },

        "Friday-09:40": { id: "1_2-f-1", courseCode: "4E2AP", room: "Mr. Ch. Naveen" },
        "Friday-10:40": { id: "1_2-f-2", courseCode: "4B2AN", room: "Dr. K. Rama Rao" },
        "Friday-11:40": { id: "1_2-f-3", courseCode: "4B2AM", room: "Dr. P. Madhavi" },
        "Friday-01:20": { id: "1_2-f-4", courseCode: "4H2AL", room: "Mrs. G. Sunitha" },
        "Friday-02:20": { id: "1_2-f-5", courseCode: "4E2AP", room: "Mr. Ch. Naveen" },
        "Friday-03:20": { id: "1_2-f-6", courseCode: "Sports", room: "Ground" },

        "Saturday-09:40": { id: "1_2-sa-1", courseCode: "4H2AL", room: "Mrs. G. Sunitha" },
        "Saturday-10:40": { id: "1_2-sa-2", courseCode: "4E2AQ", room: "Mrs. M. Suryakumari" },
        "Saturday-11:40": { id: "1_2-sa-3", courseCode: "4B2AM", room: "Dr. P. Madhavi" },
        "Saturday-01:20": { id: "1_2-sa-4", courseCode: "4E2AP", room: "Mr. Ch. Naveen" },
        "Saturday-02:20": { id: "1_2-sa-5", courseCode: "4B2AN", room: "Dr. K. Rama Rao" },
        "Saturday-03:20": { id: "1_2-sa-6", courseCode: "Library", room: "Library" },
    },


    // Year 2, Semester 1 (II-I)
    // Year 2, Semester 1 (II-I)
    "2-1": {
        "Monday-09:40": { id: "2_1-m-1", courseCode: "4E303", room: "Anitha Chowdary" },
        "Monday-10:40": { id: "2_1-m-2", courseCode: "4E303", room: "Anitha Chowdary" },
        "Monday-11:40": { id: "2_1-m-3", courseCode: "4E303", room: "Anitha Chowdary" },
        "Monday-01:20": { id: "2_1-m-4", courseCode: "4E3ED", room: "Mrs. M. Indira" },
        "Monday-02:20": { id: "2_1-m-5", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Monday-03:20": { id: "2_1-m-6", courseCode: "4E3EE", room: "Mrs. S. Swathi" },

        "Tuesday-09:40": { id: "2_1-t-1", courseCode: "4E3ED", room: "Mrs. M. Indira" },
        "Tuesday-10:40": { id: "2_1-t-2", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Tuesday-11:40": { id: "2_1-t-3", courseCode: "4E3EB", room: "Mrs. D Mounika" },
        "Tuesday-01:20": { id: "2_1-t-4", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Tuesday-02:20": { id: "2_1-t-5", courseCode: "4E3ED", room: "Mrs. M. Indira" },
        "Tuesday-03:20": { id: "2_1-t-6", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },

        "Wednesday-09:40": { id: "2_1-w-1", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Wednesday-10:40": { id: "2_1-w-2", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Wednesday-11:40": { id: "2_1-w-3", courseCode: "4E3ED", room: "Mrs. M. Indira" },
        "Wednesday-01:20": { id: "2_1-w-4", courseCode: "4E3ED", room: "Mrs. M. Indira" },
        "Wednesday-02:20": { id: "2_1-w-5", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Wednesday-03:20": { id: "2_1-w-6", courseCode: "4E3EE", room: "Mrs. S. Swathi" },

        "Thursday-09:40": { id: "2_1-th-1", courseCode: "4E3EB", room: "Mrs. D Mounika" },
        "Thursday-10:40": { id: "2_1-th-2", courseCode: "4E3ED", room: "Mrs. M. Indira" },
        "Thursday-11:40": { id: "2_1-th-3", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Thursday-01:20": { id: "2_1-th-4", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Thursday-02:20": { id: "2_1-th-5", courseCode: "4E3EB", room: "Mrs. D Mounika" },
        "Thursday-03:20": { id: "2_1-th-6", courseCode: "4E3ED", room: "Mrs. M. Indira" },

        "Friday-09:40": { id: "2_1-f-1", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Friday-10:40": { id: "2_1-f-2", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Friday-11:40": { id: "2_1-f-3", courseCode: "4E3EB", room: "Mrs. D Mounika" },
        "Friday-01:20": { id: "2_1-f-4", courseCode: "4E3ED", room: "Mrs. M. Indira" },
        "Friday-02:20": { id: "2_1-f-5", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Friday-03:20": { id: "2_1-f-6", courseCode: "Sports", room: "Ground" },

        "Saturday-09:40": { id: "2_1-sa-1", courseCode: "4E3ED", room: "Mrs. M. Indira" },
        "Saturday-10:40": { id: "2_1-sa-2", courseCode: "4E3EC", room: "Mrs. T. Praneetha" },
        "Saturday-11:40": { id: "2_1-sa-3", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Saturday-01:20": { id: "2_1-sa-4", courseCode: "4E3EB", room: "Mrs. D Mounika" },
        "Saturday-02:20": { id: "2_1-sa-5", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
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
        "Monday-02:20": { id: "2_1-m-5", courseCode: "4E3EC", room: "Mrs. G. Shivaleela" },
        "Monday-03:20": { id: "2_1-m-6", courseCode: "4E3EE", room: "Mrs. S. Swathi" },

        "Tuesday-09:40": { id: "2_1-t-1", courseCode: "4E3ED", room: "Mr. N. Kiran Kumar" },
        "Tuesday-10:40": { id: "2_1-t-2", courseCode: "4E3EC", room: "Mrs. G. Shivaleela" },
        "Tuesday-11:40": { id: "2_1-t-3", courseCode: "4E3EB", room: "Mrs. D. Mounika" },
        "Tuesday-01:20": { id: "2_1-t-4", courseCode: "4B30D", room: "Dr. P. Madhavi" },
        "Tuesday-02:20": { id: "2_1-t-5", courseCode: "4E3EA", room: "Mrs. Jagruthi" },
        "Tuesday-03:20": { id: "2_1-t-6", courseCode: "4E3EE", room: "Mrs. S. Swathi" },

        "Wednesday-09:40": { id: "2_1-w-1", courseCode: "4E312", room: "Mrs. Srujana Reddy Aynala" },
        "Wednesday-10:40": { id: "2_1-w-2", courseCode: "4E312", room: "Mrs. Srujana Reddy Aynala" },
        "Wednesday-11:40": { id: "2_1-w-3", courseCode: "4E312", room: "Mrs. Srujana Reddy Aynala" },
        "Wednesday-01:20": { id: "2_1-w-4", courseCode: "4E3ED", room: "Mr. N. Kiran Kumar" },
        "Wednesday-02:20": { id: "2_1-w-5", courseCode: "4E3EA", room: "Mrs. Jagruthi" },
        "Wednesday-03:20": { id: "2_1-w-6", courseCode: "4B30D", room: "Dr. P. Madhavi" },

        "Thursday-09:40": { id: "2_1-th-1", courseCode: "4B30D", room: "Dr. P. Madhavi" },
        "Thursday-10:40": { id: "2_1-th-2", courseCode: "4E3ED", room: "Mr. N. Kiran Kumar" },
        "Thursday-11:40": { id: "2_1-th-3", courseCode: "4E3EC", room: "Mrs. G. Shivaleela" },
        "Thursday-01:20": { id: "2_1-th-4", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Thursday-02:20": { id: "2_1-th-5", courseCode: "4E3EA", room: "Mrs. Jagruthi" },
        "Thursday-03:20": { id: "2_1-th-6", courseCode: "4B30D", room: "Dr. P. Madhavi" },

        "Friday-09:40": { id: "2_1-f-1", courseCode: "4E3ED", room: "Mr. N. Kiran Kumar" },
        "Friday-10:40": { id: "2_1-f-2", courseCode: "4E3EC", room: "Mrs. G. Shivaleela" },
        "Friday-11:40": { id: "2_1-f-3", courseCode: "4E3EB", room: "Mrs. D. Mounika" },
        "Friday-01:20": { id: "2_1-f-4", courseCode: "4E3EE", room: "Mrs. S. Swathi" },
        "Friday-02:20": { id: "2_1-f-5", courseCode: "4E3EA", room: "Mrs. Jagruthi" },
        "Friday-03:20": { id: "2_1-f-6", courseCode: "Sports", room: "Ground" },

        "Saturday-09:40": { id: "2_1-sa-1", courseCode: "4B30D", room: "Dr. P. Madhavi" },
        "Saturday-10:40": { id: "2_1-sa-2", courseCode: "4E3EC", room: "Mrs. G. Shivaleela" },
        "Saturday-11:40": { id: "2_1-sa-3", courseCode: "4E3ED", room: "Mr. N. Kiran Kumar" },
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
        "Monday-02:20": { id: "4_1-m-5", courseCode: "DM", room: "Mrs. Y. Latha" },
        "Monday-03:20": { id: "4_1-m-6", courseCode: "IS", room: "Dr. Syed Hussain" },

        "Tuesday-09:40": { id: "4_1-t-1", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Tuesday-10:40": { id: "4_1-t-2", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Tuesday-11:40": { id: "4_1-t-3", courseCode: "DM", room: "Mrs. Y. Latha" },
        "Tuesday-01:20": { id: "4_1-t-4", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Tuesday-02:20": { id: "4_1-t-5", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Tuesday-03:20": { id: "4_1-t-6", courseCode: "Mentoring", room: "All Staff" },

        "Wednesday-09:40": { id: "4_1-w-1", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Wednesday-10:40": { id: "4_1-w-2", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Wednesday-11:40": { id: "4_1-w-3", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Wednesday-01:20": { id: "4_1-w-4", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Wednesday-02:20": { id: "4_1-w-5", courseCode: "DM", room: "Mrs. Y. Latha" },
        "Wednesday-03:20": { id: "4_1-w-6", courseCode: "IS", room: "Mrs. E. Radhika" },

        "Thursday-09:40": { id: "4_1-th-1", courseCode: "DM", room: "Mrs. Y. Latha" },
        "Thursday-10:40": { id: "4_1-th-2", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },
        "Thursday-11:40": { id: "4_1-th-3", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Thursday-01:20": { id: "4_1-th-4", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Thursday-02:20": { id: "4_1-th-5", courseCode: "DM", room: "Mrs. Y. Latha" },
        "Thursday-03:20": { id: "4_1-th-6", courseCode: "KRR", room: "Mr. K. Venugopal Reddy" },

        "Friday-09:40": { id: "4_1-f-1", courseCode: "BDA", room: "Dr. K. Srinivas" },
        "Friday-10:40": { id: "4_1-f-2", courseCode: "IS", room: "Mrs. E. Radhika" },
        "Friday-11:40": { id: "4_1-f-3", courseCode: "DM", room: "Mrs. Y. Latha" },
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
        "Monday-03:20": { id: "4_1B-m-6", courseCode: "IS", room: "TBD Faculty" },
        "Tuesday-01:20": { id: "4_1B-t-4", courseCode: "IS", room: "TBD Faculty" },
        "Wednesday-01:20": { id: "4_1B-w-4", courseCode: "BDA", room: "Mrs. P. Rajini" },
        "Wednesday-03:20": { id: "4_1B-w-6", courseCode: "IS", room: "TBD Faculty" },
    },
    // ── Year 3 Sem 2 ── Section C
    "3-2-C": {
        "Monday-01:20": { id: "3_2C-m-4", courseCode: "DL", room: "Mrs. P. Vijaya Kumari" },
        "Tuesday-09:40": { id: "3_2-t-1-C", courseCode: "DL Lab", room: "Mrs. P. Vijaya Kumari" },
        "Tuesday-10:40": { id: "3_2-t-2-C", courseCode: "DL Lab", room: "Mrs. P. Vijaya Kumari" },
        "Tuesday-11:40": { id: "3_2-t-3-C", courseCode: "DL Lab", room: "Mrs. P. Vijaya Kumari" },
    },

    // ── CSM Section B/C Variants (Balanced Workload) ──
    "CSM-1-1-B": {
        "Monday-09:40": { id: "csm_11B-m-1", courseCode: "4E1AJ", room: "Manga Rao" },
        "Monday-01:20": { id: "csm_11B-m-4", courseCode: "4B1AA", room: "Sreedevi" },
        "Monday-02:20": { id: "csm_11B-m-5", courseCode: "4B1AG", room: "B. Gnanesh Netha" },
    },
    "CSM-1-1-C": {
        "Monday-09:40": { id: "csm_11C-m-1", courseCode: "4E1AJ", room: "Dr. D. Anitha Kumari" },
        "Monday-01:20": { id: "csm_11C-m-4", courseCode: "4B1AA", room: "G. Shankar" },
        "Monday-02:20": { id: "csm_11C-m-5", courseCode: "4B1AG", room: "Sudha Menon" },
    },
    "CSM-1-2-B": {
        "Monday-01:20": { id: "csm_12B-m-4", courseCode: "4B2AM", room: "Mrs. P. Manjula" },
        "Monday-02:20": { id: "csm_12B-m-5", courseCode: "4E2AQ", room: "Mrs. M. Suryakumari" },
    },
    "CSM-2-1-B": {
        "Monday-01:20": { id: "csm_21B-m-4", courseCode: "4E3ED", room: "Mr. N. Kiran Kumar" },
        "Monday-02:20": { id: "csm_21B-m-5", courseCode: "4E3EC", room: "Mrs. G. Shivaleela" },
    },
    "CSM-2-2-B": {
        "Monday-01:20": { id: "csm_22B-m-4", courseCode: "4E4ED", room: "Dr. Kuna Naresh" },
    },
    "IT-3-1-B": {
        "Wednesday-09:40": { id: "it_31B-m-1", courseCode: "4E5FA", room: "Dr. M. Dhasaratham" },
        "Tuesday-09:40": { id: "it_31B-t-1", courseCode: "4E5FB", room: "Dr. M. Dhasaratham" },
    },

    // ── Audit: Campus Recruitment Training (CRT) ──
    // 3rd Year 6th Semester (3-2) - Weekly 3 hour block
    "CSM-3-2-A": { "Wednesday-09:40": { id: "crt3-csm-a1", courseCode: "CRT", room: "Auditorium" }, "Wednesday-10:40": { id: "crt3-csm-a2", courseCode: "CRT", room: "Auditorium" }, "Wednesday-11:40": { id: "crt3-csm-a3", courseCode: "CRT", room: "Auditorium" } },
    "CSM-3-2-B": { "Wednesday-09:40": { id: "crt3-csm-b1", courseCode: "CRT", room: "Auditorium" }, "Wednesday-10:40": { id: "crt3-csm-b2", courseCode: "CRT", room: "Auditorium" }, "Wednesday-11:40": { id: "crt3-csm-b3", courseCode: "CRT", room: "Auditorium" } },
    "CSM-3-2-C": { "Wednesday-09:40": { id: "crt3-csm-c1", courseCode: "CRT", room: "Auditorium" }, "Wednesday-10:40": { id: "crt3-csm-c2", courseCode: "CRT", room: "Auditorium" }, "Wednesday-11:40": { id: "crt3-csm-c3", courseCode: "CRT", room: "Auditorium" } },
    "CSE-3-2-A": { "Wednesday-09:40": { id: "crt3-cse-a1", courseCode: "CRT", room: "Auditorium" }, "Wednesday-10:40": { id: "crt3-cse-a2", courseCode: "CRT", room: "Auditorium" }, "Wednesday-11:40": { id: "crt3-cse-a3", courseCode: "CRT", room: "Auditorium" } },
    "CSE-3-2-B": { "Wednesday-09:40": { id: "crt3-cse-b1", courseCode: "CRT", room: "Auditorium" }, "Wednesday-10:40": { id: "crt3-cse-b2", courseCode: "CRT", room: "Auditorium" }, "Wednesday-11:40": { id: "crt3-cse-b3", courseCode: "CRT", room: "Auditorium" } },
    "CSE-3-2-C": { "Wednesday-09:40": { id: "crt3-cse-c1", courseCode: "CRT", room: "Auditorium" }, "Wednesday-10:40": { id: "crt3-cse-c2", courseCode: "CRT", room: "Auditorium" }, "Wednesday-11:40": { id: "crt3-cse-c3", courseCode: "CRT", room: "Auditorium" } },
    "IT-3-2-A": { "Friday-01:20": { id: "crt3-it-a1", courseCode: "CRT", room: "Auditorium" }, "Friday-02:20": { id: "crt3-it-a2", courseCode: "CRT", room: "Auditorium" }, "Friday-03:20": { id: "crt3-it-a3", courseCode: "CRT", room: "Auditorium" } },
    "IT-3-2-B": { "Friday-01:20": { id: "crt3-it-b1", courseCode: "CRT", room: "Auditorium" }, "Friday-02:20": { id: "crt3-it-b2", courseCode: "CRT", room: "Auditorium" }, "Friday-03:20": { id: "crt3-it-b3", courseCode: "CRT", room: "Auditorium" } },
    "IT-3-2-C": { "Friday-01:20": { id: "crt3-it-c1", courseCode: "CRT", room: "Auditorium" }, "Friday-02:20": { id: "crt3-it-c2", courseCode: "CRT", room: "Auditorium" }, "Friday-03:20": { id: "crt3-it-c3", courseCode: "CRT", room: "Auditorium" } },
    "ECE-3-2-A": { "Friday-01:20": { id: "crt3-ece-a1", courseCode: "CRT", room: "Auditorium" }, "Friday-02:20": { id: "crt3-ece-a2", courseCode: "CRT", room: "Auditorium" }, "Friday-03:20": { id: "crt3-ece-a3", courseCode: "CRT", room: "Auditorium" } },
    "ECE-3-2-B": { "Friday-01:20": { id: "crt3-ece-b1", courseCode: "CRT", room: "Auditorium" }, "Friday-02:20": { id: "crt3-ece-b2", courseCode: "CRT", room: "Auditorium" }, "Friday-03:20": { id: "crt3-ece-b3", courseCode: "CRT", room: "Auditorium" } },
    "ECE-3-2-C": { "Friday-01:20": { id: "crt3-ece-c1", courseCode: "CRT", room: "Auditorium" }, "Friday-02:20": { id: "crt3-ece-c2", courseCode: "CRT", room: "Auditorium" }, "Friday-03:20": { id: "crt3-ece-c3", courseCode: "CRT", room: "Auditorium" } },

    // 4th Year 7th Semester (4-1) - Twice Weekly block
    "CSM-4-1-A": { "Monday-09:40": { id: "crt7-csm-a1-1", courseCode: "CRT", room: "Auditorium" }, "Monday-10:40": { id: "crt7-csm-a1-2", courseCode: "CRT", room: "Auditorium" }, "Monday-11:40": { id: "crt7-csm-a1-3", courseCode: "CRT", room: "Auditorium" }, "Thursday-01:20": { id: "crt7-csm-a2-1", courseCode: "CRT", room: "Auditorium" }, "Thursday-02:20": { id: "crt7-csm-a2-2", courseCode: "CRT", room: "Auditorium" }, "Thursday-03:20": { id: "crt7-csm-a2-3", courseCode: "CRT", room: "Auditorium" } },
    "CSM-4-1-B": { "Monday-09:40": { id: "crt7-csm-b1-1", courseCode: "CRT", room: "Auditorium" }, "Monday-10:40": { id: "crt7-csm-b1-2", courseCode: "CRT", room: "Auditorium" }, "Monday-11:40": { id: "crt7-csm-b1-3", courseCode: "CRT", room: "Auditorium" }, "Thursday-01:20": { id: "crt7-csm-b2-1", courseCode: "CRT", room: "Auditorium" }, "Thursday-02:20": { id: "crt7-csm-b2-2", courseCode: "CRT", room: "Auditorium" }, "Thursday-03:20": { id: "crt7-csm-b2-3", courseCode: "CRT", room: "Auditorium" } },
    "CSM-4-1-C": { "Monday-09:40": { id: "crt7-csm-c1-1", courseCode: "CRT", room: "Auditorium" }, "Monday-10:40": { id: "crt7-csm-c1-2", courseCode: "CRT", room: "Auditorium" }, "Monday-11:40": { id: "crt7-csm-c1-3", courseCode: "CRT", room: "Auditorium" }, "Thursday-01:20": { id: "crt7-csm-c2-1", courseCode: "CRT", room: "Auditorium" }, "Thursday-02:20": { id: "crt7-csm-c2-2", courseCode: "CRT", room: "Auditorium" }, "Thursday-03:20": { id: "crt7-csm-c2-3", courseCode: "CRT", room: "Auditorium" } },
    "CSE-4-1-A": { "Monday-09:40": { id: "crt7-cse-a1-1", courseCode: "CRT", room: "Auditorium" }, "Monday-10:40": { id: "crt7-cse-a1-2", courseCode: "CRT", room: "Auditorium" }, "Monday-11:40": { id: "crt7-cse-a1-3", courseCode: "CRT", room: "Auditorium" }, "Thursday-01:20": { id: "crt7-cse-a2-1", courseCode: "CRT", room: "Auditorium" }, "Thursday-02:20": { id: "crt7-cse-a2-2", courseCode: "CRT", room: "Auditorium" }, "Thursday-03:20": { id: "crt7-cse-a2-3", courseCode: "CRT", room: "Auditorium" } },
    "CSE-4-1-B": { "Monday-09:40": { id: "crt7-cse-b1-1", courseCode: "CRT", room: "Auditorium" }, "Monday-10:40": { id: "crt7-cse-b1-2", courseCode: "CRT", room: "Auditorium" }, "Monday-11:40": { id: "crt7-cse-b1-3", courseCode: "CRT", room: "Auditorium" }, "Thursday-01:20": { id: "crt7-cse-b2-1", courseCode: "CRT", room: "Auditorium" }, "Thursday-02:20": { id: "crt7-cse-b2-2", courseCode: "CRT", room: "Auditorium" }, "Thursday-03:20": { id: "crt7-cse-b2-3", courseCode: "CRT", room: "Auditorium" } },
    "CSE-4-1-C": { "Monday-09:40": { id: "crt7-cse-c1-1", courseCode: "CRT", room: "Auditorium" }, "Monday-10:40": { id: "crt7-cse-c1-2", courseCode: "CRT", room: "Auditorium" }, "Monday-11:40": { id: "crt7-cse-c1-3", courseCode: "CRT", room: "Auditorium" }, "Thursday-01:20": { id: "crt7-cse-c2-1", courseCode: "CRT", room: "Auditorium" }, "Thursday-02:20": { id: "crt7-cse-c2-2", courseCode: "CRT", room: "Auditorium" }, "Thursday-03:20": { id: "crt7-cse-c2-3", courseCode: "CRT", room: "Auditorium" } },
    "IT-4-1-A": { "Tuesday-09:40": { id: "crt7-it-a1-1", courseCode: "CRT", room: "Auditorium" }, "Tuesday-10:40": { id: "crt7-it-a1-2", courseCode: "CRT", room: "Auditorium" }, "Tuesday-11:40": { id: "crt7-it-a1-3", courseCode: "CRT", room: "Auditorium" }, "Friday-09:40": { id: "crt7-it-a2-1", courseCode: "CRT", room: "Auditorium" }, "Friday-10:40": { id: "crt7-it-a2-2", courseCode: "CRT", room: "Auditorium" }, "Friday-11:40": { id: "crt7-it-a2-3", courseCode: "CRT", room: "Auditorium" } },
    "IT-4-1-B": { "Tuesday-09:40": { id: "crt7-it-b1-1", courseCode: "CRT", room: "Auditorium" }, "Tuesday-10:40": { id: "crt7-it-b1-2", courseCode: "CRT", room: "Auditorium" }, "Tuesday-11:40": { id: "crt7-it-b1-3", courseCode: "CRT", room: "Auditorium" }, "Friday-09:40": { id: "crt7-it-b2-1", courseCode: "CRT", room: "Auditorium" }, "Friday-10:40": { id: "crt7-it-b2-2", courseCode: "CRT", room: "Auditorium" }, "Friday-11:40": { id: "crt7-it-b2-3", courseCode: "CRT", room: "Auditorium" } },
    "IT-4-1-C": { "Tuesday-09:40": { id: "crt7-it-c1-1", courseCode: "CRT", room: "Auditorium" }, "Tuesday-10:40": { id: "crt7-it-c1-2", courseCode: "CRT", room: "Auditorium" }, "Tuesday-11:40": { id: "crt7-it-c1-3", courseCode: "CRT", room: "Auditorium" }, "Friday-09:40": { id: "crt7-it-c2-1", courseCode: "CRT", room: "Auditorium" }, "Friday-10:40": { id: "crt7-it-c2-2", courseCode: "CRT", room: "Auditorium" }, "Friday-11:40": { id: "crt7-it-c2-3", courseCode: "CRT", room: "Auditorium" } },
    "ECE-4-1-A": { "Tuesday-09:40": { id: "crt7-ece-a1-1", courseCode: "CRT", room: "Auditorium" }, "Tuesday-10:40": { id: "crt7-ece-a1-2", courseCode: "CRT", room: "Auditorium" }, "Tuesday-11:40": { id: "crt7-ece-a1-3", courseCode: "CRT", room: "Auditorium" }, "Friday-09:40": { id: "crt7-ece-a2-1", courseCode: "CRT", room: "Auditorium" }, "Friday-10:40": { id: "crt7-ece-a2-2", courseCode: "CRT", room: "Auditorium" }, "Friday-11:40": { id: "crt7-ece-a2-3", courseCode: "CRT", room: "Auditorium" } },
    "ECE-4-1-B": { "Tuesday-09:40": { id: "crt7-ece-b1-1", courseCode: "CRT", room: "Auditorium" }, "Tuesday-10:40": { id: "crt7-ece-b1-2", courseCode: "CRT", room: "Auditorium" }, "Tuesday-11:40": { id: "crt7-ece-b1-3", courseCode: "CRT", room: "Auditorium" }, "Friday-09:40": { id: "crt7-ece-b2-1", courseCode: "CRT", room: "Auditorium" }, "Friday-10:40": { id: "crt7-ece-b2-2", courseCode: "CRT", room: "Auditorium" }, "Friday-11:40": { id: "crt7-ece-b2-3", courseCode: "CRT", room: "Auditorium" } },
    "ECE-4-1-C": { "Tuesday-09:40": { id: "crt7-ece-c1-1", courseCode: "CRT", room: "Auditorium" }, "Tuesday-10:40": { id: "crt7-ece-c1-2", courseCode: "CRT", room: "Auditorium" }, "Tuesday-11:40": { id: "crt7-ece-c1-3", courseCode: "CRT", room: "Auditorium" }, "Friday-09:40": { id: "crt7-ece-c2-1", courseCode: "CRT", room: "Auditorium" }, "Friday-10:40": { id: "crt7-ece-c2-2", courseCode: "CRT", room: "Auditorium" }, "Friday-11:40": { id: "crt7-ece-c2-3", courseCode: "CRT", room: "Auditorium" } },
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
    "1-1": [
        {
            "code": "4B1AA",
            "faculty": "Dr. M. Narender",
            "room": "101"
        },
        {
            "code": "4B1AA",
            "faculty": "Mrs. K. Naga Maha Lakshmi",
            "room": "101"
        },
        {
            "code": "4B1AG",
            "faculty": "Sudha Menon",
            "room": "101"
        },
        {
            "code": "4B1AG",
            "faculty": "B. Gnanesh Netha",
            "room": "101"
        },
        {
            "code": "4H1AH",
            "faculty": "Dr. A. Premalatha",
            "room": "101"
        },
        {
            "code": "4H1AH",
            "faculty": "Mrs. Mamatha",
            "room": "101"
        },
        {
            "code": "4E1AJ",
            "faculty": "Dr. D. Anitha Kumari",
            "room": "101"
        },
        {
            "code": "4E1AJ",
            "faculty": "Mrs. M. Indira",
            "room": "101"
        },
        {
            "code": "4E1DD",
            "faculty": "Dr. B. Sunil Srinivas",
            "room": "Drawing Hall"
        },
        {
            "code": "4E1DD",
            "faculty": "Dr. Syed Hussain",
            "room": "Drawing Hall"
        },
        {
            "code": "4B108",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "Language Lab"
        },
        {
            "code": "4B108",
            "faculty": "V. Murugan",
            "room": "Language Lab"
        },
        {
            "code": "4E114",
            "faculty": "Mrs. V. Pravalika",
            "room": "Chemistry Lab"
        },
        {
            "code": "4E114",
            "faculty": "Mrs. S. Swathi",
            "room": "Chemistry Lab"
        },
        {
            "code": "4E112",
            "faculty": "Dr. D. Anitha Kumari",
            "room": "Lab 1"
        },
        {
            "code": "4E112",
            "faculty": "Mrs. D. Mounika",
            "room": "Lab 2"
        },
        {
            "code": "4E115",
            "faculty": "Mr. K. Indra Kiran Reddy",
            "room": "Workshop"
        },
        {
            "code": "4E115",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "Workshop"
        }
    ],
    "1-2": [
        {
            "code": "4H2AL",
            "faculty": "Mrs. P. Geethanjali",
            "room": "102"
        },
        {
            "code": "4H2AL",
            "faculty": "B. Gnanesh Netha",
            "room": "102"
        },
        {
            "code": "4B2AM",
            "faculty": "Dr. P. Madhavi",
            "room": "102"
        },
        {
            "code": "4B2AM",
            "faculty": "Mrs. P. Manjula",
            "room": "102"
        },
        {
            "code": "4E2AP",
            "faculty": "Mr. B. Pullarao",
            "room": "102"
        },
        {
            "code": "4E2AP",
            "faculty": "Mr. B. Pullarao",
            "room": "102"
        },
        {
            "code": "4B2AN",
            "faculty": "Mrs. S. Gnaneshwari",
            "room": "101"
        },
        {
            "code": "4B2AN",
            "faculty": "Rajnijanth",
            "room": "101"
        },
        {
            "code": "4E2AQ",
            "faculty": "Mr. N. Kiran Kumar",
            "room": "102"
        },
        {
            "code": "4E2AQ",
            "faculty": "Mrs. M. Suryakumari",
            "room": "102"
        },
        {
            "code": "4B209",
            "faculty": "B. Rajani",
            "room": "Physics Lab"
        },
        {
            "code": "4B209",
            "faculty": "Rajnijanth",
            "room": "Physics Lab"
        },
        {
            "code": "4E210",
            "faculty": "Mrs. E. Radhika",
            "room": "BEE Lab"
        },
        {
            "code": "4E210",
            "faculty": "Mrs. Ch. Shilpa",
            "room": "BEE Lab"
        },
        {
            "code": "4E211",
            "faculty": "Mrs. P. Rajini",
            "room": "Lab 2"
        },
        {
            "code": "4E211",
            "faculty": "Mrs. C. Saritha Reddy",
            "room": "Lab 2"
        },
        {
            "code": "4H203",
            "faculty": "Sudha Menon",
            "room": "Language Lab"
        },
        {
            "code": "4H203",
            "faculty": "B. Gnanesh Netha",
            "room": "Language Lab"
        },
        {
            "code": "4B206",
            "faculty": "Mrs. B. Vijitha",
            "room": "Chemistry Lab"
        },
        {
            "code": "4B206",
            "faculty": "Mr. R. Naga Raju",
            "room": "Chemistry Lab"
        }
    ],
    "2-1": [
        {
            "code": "4B3AD",
            "faculty": "Mrs. P. Manjula",
            "room": "201"
        },
        {
            "code": "4B3AD",
            "faculty": "Dr. P. Madhavi",
            "room": "201"
        },
        {
            "code": "4E3EA",
            "faculty": "Mrs. Jagruthi",
            "room": "201"
        },
        {
            "code": "4E3EA",
            "faculty": "CH. Divya",
            "room": "201"
        },
        {
            "code": "4E3EB",
            "faculty": "Mrs. D. Mounika",
            "room": "201"
        },
        {
            "code": "4E3EB",
            "faculty": "Mrs. Thirumani Anusha",
            "room": "201"
        },
        {
            "code": "4E3EC",
            "faculty": "Mrs. Prathibha",
            "room": "201"
        },
        {
            "code": "4E3EC",
            "faculty": "Shanti",
            "room": "201"
        },
        {
            "code": "4E3ED",
            "faculty": "Mrs. M. Indira",
            "room": "201"
        },
        {
            "code": "4E3ED",
            "faculty": "Mr. N. Kiran Kumar",
            "room": "201"
        },
        {
            "code": "4E3EE",
            "faculty": "Mrs. S. Swathi",
            "room": "201"
        },
        {
            "code": "4E3EE",
            "faculty": "Mrs. Pragathi Vulpala",
            "room": "201"
        },
        {
            "code": "4E303",
            "faculty": "Mrs. D. Mounika",
            "room": "Lab 2"
        },
        {
            "code": "4E303",
            "faculty": "Mrs. Jhansi Rani",
            "room": "Lab 2"
        },
        {
            "code": "4E312",
            "faculty": "Mrs. Srujana Reddy Aynala",
            "room": "Lab 3"
        },
        {
            "code": "4E312",
            "faculty": "Dr. B. Swapna Rani",
            "room": "Lab 3"
        }
    ],
    "2-2": [
        {
            "code": "4E4EA",
            "faculty": "Dr. D. Anitha Kumari",
            "room": "202"
        },
        {
            "code": "4E4EA",
            "faculty": "Mr. B. Srikanth",
            "room": "202"
        },
        {
            "code": "4E4EB",
            "faculty": "TBD Faculty",
            "room": "202"
        },
        {
            "code": "4E4EB",
            "faculty": "G. Bharath",
            "room": "202"
        },
        {
            "code": "4E4EC",
            "faculty": "Mrs. P. Geethanjali",
            "room": "202"
        },
        {
            "code": "4E4EC",
            "faculty": "Mr. K. Venugopal Reddy",
            "room": "202"
        },
        {
            "code": "4E4ED",
            "faculty": "Mrs. E. Radhika",
            "room": "202"
        },
        {
            "code": "4E4ED",
            "faculty": "Dr. Kuna Naresh",
            "room": "202"
        },
        {
            "code": "4E4EE",
            "faculty": "Mrs. E. Radhika",
            "room": "202"
        },
        {
            "code": "4E4EE",
            "faculty": "A. Pradeep",
            "room": "202"
        },
        {
            "code": "4E411",
            "faculty": "Mrs. T. Praneetha",
            "room": "Lab 2"
        },
        {
            "code": "4E411",
            "faculty": "Mrs. D. Uma Maheshwari",
            "room": "Lab 2"
        },
        {
            "code": "4E412",
            "faculty": "Dr. D. Anitha Kumari",
            "room": "Lab 3"
        },
        {
            "code": "4E412",
            "faculty": "Mr. B. Srikanth",
            "room": "Lab 3"
        },
        {
            "code": "4E414",
            "faculty": "Mrs. E. Radhika",
            "room": "Lab 1"
        },
        {
            "code": "4E414",
            "faculty": "A. Pradeep",
            "room": "Lab 1"
        },
        {
            "code": "4E413",
            "faculty": "B. Gnanesh Netha",
            "room": "Language Lab"
        },
        {
            "code": "4E413",
            "faculty": "Sudha Menon",
            "room": "Language Lab"
        }
    ],
    "3-1": [
        {
            "code": "4E5GA",
            "faculty": "Mrs. G. Deepthi",
            "room": "301"
        },
        {
            "code": "4E5GA",
            "faculty": "Mrs. G. Deepthi",
            "room": "301"
        },
        {
            "code": "4E5GB",
            "faculty": "Mrs. K. Ishwarya Devi",
            "room": "301"
        },
        {
            "code": "4E5GB",
            "faculty": "Mrs. S. Swathi",
            "room": "301"
        },
        {
            "code": "4E5GC",
            "faculty": "Mr. K. Hemanth",
            "room": "301"
        },
        {
            "code": "4E5GC",
            "faculty": "Mrs. M. Jhansi Rani",
            "room": "301"
        },
        {
            "code": "4E5GD",
            "faculty": "Mrs. C. Jaya Lakshmi",
            "room": "301"
        },
        {
            "code": "4E5GD",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "301"
        },
        {
            "code": "4P5GC",
            "faculty": "Mr. Ande Srinivasa Reddy",
            "room": "301"
        },
        {
            "code": "4P5GC",
            "faculty": "Ms. S. Manjula",
            "room": "301"
        },
        {
            "code": "4P5GD",
            "faculty": "Mrs. P. Geethanjali",
            "room": "301"
        },
        {
            "code": "4P5GD",
            "faculty": "Mrs. M. Indira",
            "room": "301"
        },
        {
            "code": "4E513",
            "faculty": "Mrs. C. Jaya Lakshmi",
            "room": "AI Lab"
        },
        {
            "code": "4E513",
            "faculty": "Mrs. C. Saritha Reddy",
            "room": "AI Lab"
        },
        {
            "code": "4E514",
            "faculty": "K. Shalini",
            "room": "Lab 2"
        },
        {
            "code": "4E514",
            "faculty": "Technical Trainer 1",
            "room": "Lab 2"
        }
    ],
    "3-2": [
        {
            "code": "4H6GA",
            "faculty": "Mrs. P. Geethanjali",
            "room": "302"
        },
        {
            "code": "4H6GA",
            "faculty": "Dhanunjayasingh",
            "room": "302"
        },
        {
            "code": "4E6GA",
            "faculty": "M. Gnanesh Goud",
            "room": "302"
        },
        {
            "code": "4E6GA",
            "faculty": "M. Gnanesh Goud",
            "room": "302"
        },
        {
            "code": "4E6GB",
            "faculty": "Mrs. C. Jaya Lakshmi",
            "room": "302"
        },
        {
            "code": "4E6GB",
            "faculty": "Mallayya",
            "room": "302"
        },
        {
            "code": "4P6GC",
            "faculty": "Dr. R. Muruganantham",
            "room": "302"
        },
        {
            "code": "4P6GC",
            "faculty": "Dr. M. Dhasaratham",
            "room": "302"
        },
        {
            "code": "4P6GE",
            "faculty": "Dr. R. Rajendranath",
            "room": "302"
        },
        {
            "code": "4P6GE",
            "faculty": "Dr. R. Rajendranath",
            "room": "302"
        },
        {
            "code": "4O6GA",
            "faculty": "Mrs. M. Indira",
            "room": "302"
        },
        {
            "code": "4O6GA",
            "faculty": "Mrs. M. Indira",
            "room": "302"
        },
        {
            "code": "4E611",
            "faculty": "A. Pradeep",
            "room": "Lab AI"
        },
        {
            "code": "4E611",
            "faculty": "Mr. B. Srikanth",
            "room": "Lab AI"
        },
        {
            "code": "4E612",
            "faculty": "Mrs. C. Jaya Lakshmi",
            "room": "Lab AI"
        },
        {
            "code": "4E612",
            "faculty": "D. Kavitha",
            "room": "Lab AI"
        },
        {
            "code": "CRT",
            "faculty": "Technical Trainer",
            "room": "Auditorium"
        }
    ],
    "4-1": [
        {
            "code": "4E706",
            "faculty": "Mrs. P. Rajini",
            "room": "AI Lab"
        },
        {
            "code": "4E706",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "AI Lab"
        },
        {
            "code": "4E7GA",
            "faculty": "Mr. K. Venugopal Reddy",
            "room": "401"
        },
        {
            "code": "4E7GA",
            "faculty": "P. Himabindu",
            "room": "401"
        },
        {
            "code": "4E7GB",
            "faculty": "Mrs. P. Rajini",
            "room": "401"
        },
        {
            "code": "4E7GB",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "401"
        },
        {
            "code": "4O7GB",
            "faculty": "Saileela",
            "room": "401"
        },
        {
            "code": "4O7GB",
            "faculty": "Mrs. D. Divya",
            "room": "402"
        },
        {
            "code": "4O7GB",
            "faculty": "Mrs. N. Kiranmai",
            "room": "403"
        },
        {
            "code": "4P7GB",
            "faculty": "Jarapala Ramesh",
            "room": "401"
        },
        {
            "code": "4P7GB",
            "faculty": "P. Swathi",
            "room": "401"
        },
        {
            "code": "4P7PP1",
            "faculty": "Mrs. S. Gnaneshwari",
            "room": "Project Lab"
        },
        {
            "code": "4P7PP1",
            "faculty": "Mrs. S. Gnaneshwari",
            "room": "Project Lab"
        },
        {
            "code": "CRT",
            "faculty": "Technical Trainer",
            "room": "Auditorium"
        }
    ],
    "4-2": [
        {
            "code": "4E8GA",
            "faculty": "Mr. K. Hemanth",
            "room": "402"
        },
        {
            "code": "4E8GA",
            "faculty": "Mrs. M. Jhansi Rani",
            "room": "402"
        },
        {
            "code": "4P8GA",
            "faculty": "Jarapala Ramesh",
            "room": "402"
        },
        {
            "code": "4P8GA",
            "faculty": "K. Shalini",
            "room": "402"
        },
        {
            "code": "4O8GA",
            "faculty": "Dr. B. Sunil Srinivas",
            "room": "402"
        },
        {
            "code": "4O8GA",
            "faculty": "Dr. Vempati Krishna",
            "room": "402"
        },
        {
            "code": "4O8GB",
            "faculty": "Mrs. V. Pravalika",
            "room": "402"
        },
        {
            "code": "4O8GB",
            "faculty": "N. Anjali",
            "room": "402"
        },
        {
            "code": "4P8PW",
            "faculty": "Dr. Ch. B. Naga Lakshmi",
            "room": "Project Lab"
        },
        {
            "code": "4P8PW",
            "faculty": "Dr. Sirisha K L S",
            "room": "Project Lab"
        }
    ],
    "IT-1-1": [
        {
            "code": "4B1AA",
            "faculty": "Dr. M. Narender",
            "room": "T-101"
        },
        {
            "code": "4B1AA",
            "faculty": "Mrs. K. Naga Maha Lakshmi",
            "room": "T-101"
        },
        {
            "code": "4B1AK",
            "faculty": "Mrs. V. Pavani",
            "room": "T-101"
        },
        {
            "code": "4B1AK",
            "faculty": "Rajnijanth",
            "room": "T-101"
        },
        {
            "code": "4B1AL",
            "faculty": "Mrs. S. Saritha",
            "room": "T-101"
        },
        {
            "code": "4B1AL",
            "faculty": "Mrs. D. Swathi",
            "room": "T-101"
        },
        {
            "code": "4B1AM",
            "faculty": "Mounika Nakrekanti",
            "room": "T-101"
        },
        {
            "code": "4B1AM",
            "faculty": "P. Chandra Shekar",
            "room": "T-101"
        },
        {
            "code": "4E1DC",
            "faculty": "Mrs. Pavani",
            "room": "Drawing Hall"
        },
        {
            "code": "4E1DC",
            "faculty": "Thakur Madhumathi",
            "room": "Drawing Hall"
        },
        {
            "code": "4B116",
            "faculty": "Mrs. Prasanna Pasunari",
            "room": "Physics Lab"
        },
        {
            "code": "4B116",
            "faculty": "Rajnijanth",
            "room": "Physics Lab"
        },
        {
            "code": "4B118",
            "faculty": "Mrs. P. Rajyalakshmi",
            "room": "Lab 1"
        },
        {
            "code": "4B118",
            "faculty": "Mrs. S. Usha Devi",
            "room": "Lab 1"
        },
        {
            "code": "4B117",
            "faculty": "Dr. J. Sunitha Kumari",
            "room": "BEE Lab"
        },
        {
            "code": "4B117",
            "faculty": "Mr. U. Anand",
            "room": "BEE Lab"
        }
    ],
    "IT-1-2": [
        {
            "code": "4E2AI",
            "faculty": "V. Murugan",
            "room": "T-201"
        },
        {
            "code": "4E2AI",
            "faculty": "Mandalreddy Sushma",
            "room": "T-201"
        },
        {
            "code": "4B2AM",
            "faculty": "Dr. P. Madhavi",
            "room": "T-201"
        },
        {
            "code": "4B2AM",
            "faculty": "Mrs. P. Manjula",
            "room": "T-201"
        },
        {
            "code": "4H2AC",
            "faculty": "Sudha Menon",
            "room": "T-201"
        },
        {
            "code": "4H2AC",
            "faculty": "B. Gnanesh Netha",
            "room": "T-201"
        },
        {
            "code": "4B2AI",
            "faculty": "Mrs. C. Saritha Reddy",
            "room": "T-201"
        },
        {
            "code": "4B2AI",
            "faculty": "Mrs. Mamatha",
            "room": "T-201"
        },
        {
            "code": "4E2AJ",
            "faculty": "Mr. M. Sai Krishna",
            "room": "T-201"
        },
        {
            "code": "4E2AJ",
            "faculty": "Mr. A. Koteshwar Rao",
            "room": "T-201"
        },
        {
            "code": "4B206",
            "faculty": "Mrs. V. Ramani",
            "room": "Chemistry Lab"
        },
        {
            "code": "4B206",
            "faculty": "Mrs. A. Srujana",
            "room": "Chemistry Lab"
        },
        {
            "code": "4H203",
            "faculty": "Sudha Menon",
            "room": "Language Lab"
        },
        {
            "code": "4H203",
            "faculty": "Technical Trainer 2",
            "room": "Language Lab"
        },
        {
            "code": "4E213",
            "faculty": "Mrs. Vijayashree",
            "room": "Lab 2"
        },
        {
            "code": "4E213",
            "faculty": "Mrs. D. Mounika",
            "room": "Lab 2"
        },
        {
            "code": "4E207",
            "faculty": "Mr. G. V. Subbarao",
            "room": "Lab 3"
        },
        {
            "code": "4E207",
            "faculty": "Mrs. M. Vaishnavi",
            "room": "Lab 3"
        },
        {
            "code": "4E214",
            "faculty": "Mr. K. Indra Kiran Reddy",
            "room": "Workshop"
        },
        {
            "code": "4E214",
            "faculty": "Mr. K. Indra Kiran Reddy",
            "room": "Workshop"
        }
    ],
    "IT-2-1": [
        {
            "code": "4B3AD",
            "faculty": "Dr. P. Madhavi",
            "room": "N-301"
        },
        {
            "code": "4B3AD",
            "faculty": "Mrs. P. Manjula",
            "room": "N-301"
        },
        {
            "code": "4H3FA",
            "faculty": "Technical Trainer 3",
            "room": "N-301"
        },
        {
            "code": "4H3FA",
            "faculty": "Mrs. V. Pravalika",
            "room": "N-301"
        },
        {
            "code": "4E3FD",
            "faculty": "Mr. M. A. Raghu",
            "room": "N-301"
        },
        {
            "code": "4E3FD",
            "faculty": "Mr. B. Srikanth",
            "room": "N-301"
        },
        {
            "code": "4E3FC",
            "faculty": "Mounika Nakrekanti",
            "room": "N-301"
        },
        {
            "code": "4E3FC",
            "faculty": "Mrs. M. Suryakumari",
            "room": "N-301"
        },
        {
            "code": "4E3FB",
            "faculty": "Dr. Nallamothu Satyanarayana",
            "room": "N-301"
        },
        {
            "code": "4E3FB",
            "faculty": "Mrs. M. Indira",
            "room": "N-301"
        },
        {
            "code": "4E313",
            "faculty": "Mounika Nakrekanti",
            "room": "Lab 2"
        },
        {
            "code": "4E313",
            "faculty": "Mrs. B. Vijitha",
            "room": "Lab 2"
        },
        {
            "code": "4E314",
            "faculty": "Mrs. Ch. Shilpa",
            "room": "Lab 3"
        },
        {
            "code": "4E314",
            "faculty": "Mr. B. Srikanth",
            "room": "Lab 3"
        },
        {
            "code": "4E315",
            "faculty": "Mrs. Ch. Tulasi Ratna Mani",
            "room": "Workshop"
        },
        {
            "code": "4E315",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "Workshop"
        }
    ],
    "IT-2-2": [
        {
            "code": "4E4FA",
            "faculty": "Mrs. E. Radhika",
            "room": "N-401"
        },
        {
            "code": "4E4FA",
            "faculty": "Mrs. G. Shivaleela",
            "room": "N-401"
        },
        {
            "code": "4E4FE",
            "faculty": "Dr. Syed Hussain",
            "room": "N-401"
        },
        {
            "code": "4E4FE",
            "faculty": "TBD Faculty",
            "room": "N-401"
        },
        {
            "code": "4E4FD",
            "faculty": "N. Anjali",
            "room": "N-401"
        },
        {
            "code": "4E4FD",
            "faculty": "Mrs. T. Praneetha",
            "room": "N-401"
        },
        {
            "code": "4E4FC",
            "faculty": "P. Swathi",
            "room": "N-401"
        },
        {
            "code": "4E4FC",
            "faculty": "Mrs. S. Swathi",
            "room": "N-401"
        },
        {
            "code": "4E4FB",
            "faculty": "Mr. Sk Mahaboob Basha",
            "room": "N-401"
        },
        {
            "code": "4E4FB",
            "faculty": "Ms. D V V Deepthi",
            "room": "N-401"
        },
        {
            "code": "4E415",
            "faculty": "P. Swathi",
            "room": "Lab 1"
        },
        {
            "code": "4E415",
            "faculty": "Mrs. S. Swathi",
            "room": "Lab 1"
        },
        {
            "code": "4E416",
            "faculty": "N. Anjali",
            "room": "Lab 2"
        },
        {
            "code": "4E416",
            "faculty": "Mrs. T. Praneetha",
            "room": "Lab 2"
        },
        {
            "code": "4E417",
            "faculty": "Mrs. S. Anusha",
            "room": "Lab 3"
        },
        {
            "code": "4E417",
            "faculty": "Mrs. R. N. S. Kalpana",
            "room": "Lab 3"
        }
    ],
    "IT-3-1": [
        {
            "code": "4H5EA",
            "faculty": "Mrs. P. Geethanjali",
            "room": "N-501"
        },
        {
            "code": "4H5EA",
            "faculty": "Dhanunjayasingh",
            "room": "N-501"
        },
        {
            "code": "4E5FA",
            "faculty": "Dr. R. Muruganantham",
            "room": "N-501"
        },
        {
            "code": "4E5FA",
            "faculty": "Dr. M. Dhasaratham",
            "room": "N-501"
        },
        {
            "code": "4E5FB",
            "faculty": "Dr. M. Dhasaratham",
            "room": "N-501"
        },
        {
            "code": "4E5FB",
            "faculty": "Mrs. M. Thanmayee",
            "room": "N-501"
        },
        {
            "code": "4P5FA",
            "faculty": "Jarapala Ramesh",
            "room": "N-501"
        },
        {
            "code": "4P5FA",
            "faculty": "Mrs. G. Deepthi",
            "room": "N-501"
        },
        {
            "code": "4P5FD",
            "faculty": "B. Rajani",
            "room": "N-501"
        },
        {
            "code": "4P5FD",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "N-501"
        },
        {
            "code": "4O5FA",
            "faculty": "Mandalreddy Sushma",
            "room": "N-501"
        },
        {
            "code": "4O5FA",
            "faculty": "Dr. B. Sunil Srinivas",
            "room": "N-501"
        },
        {
            "code": "4E511",
            "faculty": "Dr. R. Muruganantham",
            "room": "Lab 1"
        },
        {
            "code": "4E511",
            "faculty": "Dr. M. Dhasaratham",
            "room": "Lab 1"
        },
        {
            "code": "4E512",
            "faculty": "Dr. M. Dhasaratham",
            "room": "Lab 2"
        },
        {
            "code": "4E512",
            "faculty": "Dr. R. Muruganantham",
            "room": "Lab 2"
        }
    ],
    "IT-3-2": [
        {
            "code": "4E6FA",
            "faculty": "Dr. R. Muruganantham",
            "room": "N-601"
        },
        {
            "code": "4E6FA",
            "faculty": "Mrs. C. Jaya Lakshmi",
            "room": "N-601"
        },
        {
            "code": "4E6FB",
            "faculty": "Dr. Nallamothu Satyanarayana",
            "room": "N-601"
        },
        {
            "code": "4E6FB",
            "faculty": "N. Paparayudu",
            "room": "N-601"
        },
        {
            "code": "4E6FC",
            "faculty": "Mrs. G. Deepthi",
            "room": "N-601"
        },
        {
            "code": "4E6FC",
            "faculty": "Mrs. D. Uma Maheshwari",
            "room": "N-601"
        },
        {
            "code": "4P6FC",
            "faculty": "Mrs. G. Deepthi",
            "room": "N-601"
        },
        {
            "code": "4P6FC",
            "faculty": "Dr. M. Dhasaratham",
            "room": "N-601"
        },
        {
            "code": "4O6FA",
            "faculty": "G. Bharath",
            "room": "N-601"
        },
        {
            "code": "4O6FA",
            "faculty": "Dr. Syed Hussain",
            "room": "N-601"
        },
        {
            "code": "4E613",
            "faculty": "Dr. R. Muruganantham",
            "room": "Lab 1"
        },
        {
            "code": "4E613",
            "faculty": "Mrs. C. Jaya Lakshmi",
            "room": "Lab 1"
        },
        {
            "code": "4E614",
            "faculty": "Dr. Nallamothu Satyanarayana",
            "room": "Lab 2"
        },
        {
            "code": "4E614",
            "faculty": "Y. Naga Lavanya",
            "room": "Lab 2"
        },
        {
            "code": "4H615",
            "faculty": "Sudha Menon",
            "room": "Language Lab"
        },
        {
            "code": "4H615",
            "faculty": "B. Gnanesh Netha",
            "room": "Language Lab"
        },
        {
            "code": "CRT",
            "faculty": "Technical Trainer",
            "room": "Auditorium"
        }
    ],
    "IT-4-1": [
        {
            "code": "4E7FA",
            "faculty": "P. Himabindu",
            "room": "N-701"
        },
        {
            "code": "4E7FA",
            "faculty": "Mrs. E. Radhika",
            "room": "N-701"
        },
        {
            "code": "4P7FB",
            "faculty": "Mr. K. Hemanth",
            "room": "N-701"
        },
        {
            "code": "4P7FB",
            "faculty": "Mrs. M. Jhansi Rani",
            "room": "N-701"
        },
        {
            "code": "4P7FD",
            "faculty": "Jarapala Ramesh",
            "room": "N-701"
        },
        {
            "code": "4P7FD",
            "faculty": "Dr. Syed Hussain",
            "room": "N-701"
        },
        {
            "code": "4O7FA",
            "faculty": "Saileela",
            "room": "N-701"
        },
        {
            "code": "4O7FA",
            "faculty": "Mrs. D. Divya",
            "room": "N-701"
        },
        {
            "code": "4E705",
            "faculty": "P. Himabindu",
            "room": "Lab 1"
        },
        {
            "code": "4E705",
            "faculty": "Mrs. E. Radhika",
            "room": "Lab 1"
        },
        {
            "code": "4P7PW",
            "faculty": "Mrs. D. Uma Maheshwari",
            "room": "Project Lab"
        },
        {
            "code": "4P7PW",
            "faculty": "Mr. R. Naga Raju",
            "room": "Project Lab"
        },
        {
            "code": "CRT",
            "faculty": "Technical Trainer",
            "room": "Auditorium"
        }
    ],
    "IT-4-2": [
        {
            "code": "4E8FA",
            "faculty": "V. Murugan",
            "room": "N-801"
        },
        {
            "code": "4E8FA",
            "faculty": "Meka Aruna",
            "room": "N-801"
        },
        {
            "code": "4E8FB",
            "faculty": "Mrs. Srujana Reddy Aynala",
            "room": "N-801"
        },
        {
            "code": "4E8FB",
            "faculty": "Shanti",
            "room": "N-801"
        },
        {
            "code": "4P8FA",
            "faculty": "M. Gnanesh Goud",
            "room": "N-801"
        },
        {
            "code": "4P8FA",
            "faculty": "M. Gnanesh Goud",
            "room": "N-801"
        },
        {
            "code": "4O8FA",
            "faculty": "Dr. Ch. B. Naga Lakshmi",
            "room": "N-801"
        },
        {
            "code": "4O8FA",
            "faculty": "Dr. Kuna Naresh",
            "room": "N-801"
        },
        {
            "code": "4P8PW",
            "faculty": "Dr. Sirisha K L S",
            "room": "Project Lab"
        },
        {
            "code": "4P8PW",
            "faculty": "Mrs. Ch. Tulasi Ratna Mani",
            "room": "Project Lab"
        }
    ],
    "CSE-1-1": [
        {
            "code": "4B1AA",
            "faculty": "Dr. M. Narender",
            "room": "C-101"
        },
        {
            "code": "4B1AA",
            "faculty": "Mrs. K. Naga Maha Lakshmi",
            "room": "C-101"
        },
        {
            "code": "4B1AG",
            "faculty": "Mrs. V. Ramani",
            "room": "C-101"
        },
        {
            "code": "4B1AG",
            "faculty": "Mrs. V. Ramani",
            "room": "C-101"
        },
        {
            "code": "4H1AH",
            "faculty": "Dr. A. Premalatha",
            "room": "C-101"
        },
        {
            "code": "4H1AH",
            "faculty": "Mrs. Mamatha",
            "room": "C-101"
        },
        {
            "code": "4E1AJ",
            "faculty": "Mrs. P. Geethanjali",
            "room": "C-101"
        },
        {
            "code": "4E1AJ",
            "faculty": "Mrs. Jhansi Rani",
            "room": "C-101"
        },
        {
            "code": "4E1DB",
            "faculty": "Mrs. Pavani",
            "room": "Drawing Hall"
        },
        {
            "code": "4E1DB",
            "faculty": "Yacharam Uma",
            "room": "Drawing Hall"
        },
        {
            "code": "4B108",
            "faculty": "Dr. Jada Shankar",
            "room": "Language Lab"
        },
        {
            "code": "4B108",
            "faculty": "Mr. P. Venkatesh",
            "room": "Language Lab"
        },
        {
            "code": "4E114",
            "faculty": "Dr. A. Premalatha",
            "room": "Chemistry Lab"
        },
        {
            "code": "4E114",
            "faculty": "Dr. B. Swapna Rani",
            "room": "Chemistry Lab"
        },
        {
            "code": "4E112",
            "faculty": "A. Pradeep",
            "room": "Lab 1"
        },
        {
            "code": "4E112",
            "faculty": "Mr. B. Srikanth",
            "room": "Lab 1"
        },
        {
            "code": "4E115",
            "faculty": "Mr. K. Indra Kiran Reddy",
            "room": "Workshop"
        },
        {
            "code": "4E115",
            "faculty": "K. Shalini",
            "room": "Workshop"
        }
    ],
    "CSE-1-2": [
        {
            "code": "4H2AL",
            "faculty": "Mrs. V. Ramani",
            "room": "C-201"
        },
        {
            "code": "4H2AL",
            "faculty": "Mrs. V. Ramani",
            "room": "C-201"
        },
        {
            "code": "4B2AM",
            "faculty": "Dr. P. Madhavi",
            "room": "C-201"
        },
        {
            "code": "4B2AM",
            "faculty": "Mrs. P. Manjula",
            "room": "C-201"
        },
        {
            "code": "4E211",
            "faculty": "Mr. B. Srikanth",
            "room": "Lab 2"
        },
        {
            "code": "4E211",
            "faculty": "Mallayya",
            "room": "Lab 2"
        },
        {
            "code": "4E2AP",
            "faculty": "Mrs. S. Saritha",
            "room": "C-201"
        },
        {
            "code": "4E2AP",
            "faculty": "Mr. B. Pullarao",
            "room": "C-201"
        },
        {
            "code": "4E2AQ",
            "faculty": "Mr. B. Srikanth",
            "room": "C-201"
        },
        {
            "code": "4E2AQ",
            "faculty": "Mrs. M. Suryakumari",
            "room": "C-201"
        }
    ],
    "CSE-2-1": [
        {
            "code": "4B3AD",
            "faculty": "Mrs. P. Manjula",
            "room": "C-301"
        },
        {
            "code": "4B3AD",
            "faculty": "Dr. P. Madhavi",
            "room": "C-301"
        },
        {
            "code": "4E3EA",
            "faculty": "Mrs. Jagruthi",
            "room": "C-301"
        },
        {
            "code": "4E3EA",
            "faculty": "CH. Divya",
            "room": "C-301"
        },
        {
            "code": "4E3EB",
            "faculty": "Mrs. Thirumani Anusha",
            "room": "C-301"
        },
        {
            "code": "4E3EB",
            "faculty": "P. Chandra Shekar",
            "room": "C-301"
        },
        {
            "code": "4E3EC",
            "faculty": "Mrs. G. Deepthi",
            "room": "C-301"
        },
        {
            "code": "4E3EC",
            "faculty": "Mrs. Prathibha",
            "room": "C-301"
        },
        {
            "code": "4E3ED",
            "faculty": "Mrs. M. Indira",
            "room": "C-301"
        },
        {
            "code": "4E3ED",
            "faculty": "Mr. N. Kiran Kumar",
            "room": "C-301"
        },
        {
            "code": "4E3EE",
            "faculty": "Mrs. Pragathi Vulpala",
            "room": "C-301"
        },
        {
            "code": "4E3EE",
            "faculty": "Dr. Rajesh Banala",
            "room": "C-301"
        },
        {
            "code": "4E303",
            "faculty": "Mrs. Thirumani Anusha",
            "room": "Lab 2"
        },
        {
            "code": "4E303",
            "faculty": "Mrs. V. Pavani",
            "room": "Lab 2"
        },
        {
            "code": "4E312",
            "faculty": "Mrs. Srujana Reddy Aynala",
            "room": "Lab 3"
        },
        {
            "code": "4E312",
            "faculty": "Dr. B. Swapna Rani",
            "room": "Lab 3"
        }
    ],
    "CSE-2-2": [
        {
            "code": "4E4EA",
            "faculty": "Mrs. B. Vijitha",
            "room": "C-401"
        },
        {
            "code": "4E4EA",
            "faculty": "Dr. D. Anitha Kumari",
            "room": "C-401"
        },
        {
            "code": "4E4EB",
            "faculty": "TBD Faculty",
            "room": "C-301"
        },
        {
            "code": "4E4EB",
            "faculty": "G. Bharath",
            "room": "C-301"
        },
        {
            "code": "4E4EC",
            "faculty": "Mr. Sk Mahaboob Basha",
            "room": "C-401"
        },
        {
            "code": "4E4EC",
            "faculty": "Mrs. Prathibha",
            "room": "C-401"
        },
        {
            "code": "4E4ED",
            "faculty": "Dr. Kuna Naresh",
            "room": "C-401"
        },
        {
            "code": "4E4ED",
            "faculty": "Mrs. E. Radhika",
            "room": "C-401"
        },
        {
            "code": "4E4EE",
            "faculty": "A. Pradeep",
            "room": "C-401"
        },
        {
            "code": "4E4EE",
            "faculty": "Mrs. S. Gnaneshwari",
            "room": "C-401"
        },
        {
            "code": "4E411",
            "faculty": "Ms. D V V Deepthi",
            "room": "Lab 2"
        },
        {
            "code": "4E411",
            "faculty": "Mrs. T. Praneetha",
            "room": "Lab 2"
        },
        {
            "code": "4E412",
            "faculty": "Mrs. P. Rajyalakshmi",
            "room": "Lab 3"
        },
        {
            "code": "4E412",
            "faculty": "Dr. D. Anitha Kumari",
            "room": "Lab 3"
        },
        {
            "code": "4E414",
            "faculty": "A. Pradeep",
            "room": "Lab 1"
        },
        {
            "code": "4E414",
            "faculty": "Mrs. B. Vijitha",
            "room": "Lab 1"
        },
        {
            "code": "4E413",
            "faculty": "Mr. M. A. Raghu",
            "room": "Language Lab"
        },
        {
            "code": "4E413",
            "faculty": "Mr. M. A. Raghu",
            "room": "Language Lab"
        }
    ],
    "CSE-3-1": [
        {
            "code": "4H5EA",
            "faculty": "Mrs. N. Kiranmai",
            "room": "C-501"
        },
        {
            "code": "4H5EA",
            "faculty": "Mrs. P. Geethanjali",
            "room": "C-501"
        },
        {
            "code": "4E5EB",
            "faculty": "Mrs. S. Usha Devi",
            "room": "C-501"
        },
        {
            "code": "4E5EB",
            "faculty": "Mrs. K. Ishwarya Devi",
            "room": "C-501"
        },
        {
            "code": "4E5EA",
            "faculty": "Dr. A. Suresh Rao",
            "room": "C-501"
        },
        {
            "code": "4E5EA",
            "faculty": "Dr. Kuna Naresh",
            "room": "C-501"
        },
        {
            "code": "4E5EC",
            "faculty": "Mrs. Y. Latha",
            "room": "C-501"
        },
        {
            "code": "4E5EC",
            "faculty": "Dr. A. Premalatha",
            "room": "C-501"
        },
        {
            "code": "4P5EC",
            "faculty": "Mrs. Y. Latha",
            "room": "C-501"
        },
        {
            "code": "4P5EC",
            "faculty": "B. Upender",
            "room": "C-501"
        },
        {
            "code": "4P5EG",
            "faculty": "Mr. K. Hemanth",
            "room": "C-501"
        },
        {
            "code": "4P5EG",
            "faculty": "Mrs. M. Jhansi Rani",
            "room": "C-501"
        },
        {
            "code": "4E509",
            "faculty": "Mrs. A. Srujana",
            "room": "Lab 1"
        },
        {
            "code": "4E509",
            "faculty": "Mrs. K. Ishwarya Devi",
            "room": "Lab 1"
        },
        {
            "code": "4E510",
            "faculty": "Mrs. Y. Latha",
            "room": "Lab 2"
        },
        {
            "code": "4E510",
            "faculty": "Mrs. C. Jaya Lakshmi",
            "room": "Lab 2"
        }
    ],
    "CSE-3-2": [
        {
            "code": "4E6EA",
            "faculty": "Mr. Ande Srinivasa Reddy",
            "room": "C-601"
        },
        {
            "code": "4E6EA",
            "faculty": "Ms. S. Manjula",
            "room": "C-601"
        },
        {
            "code": "4E6EB",
            "faculty": "Mrs. G. Deepthi",
            "room": "C-601"
        },
        {
            "code": "4E6EB",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "C-601"
        },
        {
            "code": "4E6EC",
            "faculty": "Mr. K. Venugopal Reddy",
            "room": "C-601"
        },
        {
            "code": "4E6EC",
            "faculty": "Dr. A. Premalatha",
            "room": "C-601"
        },
        {
            "code": "4P6EA",
            "faculty": "K. Shalini",
            "room": "C-601"
        },
        {
            "code": "4P6EA",
            "faculty": "Mr. K. Hemanth",
            "room": "C-601"
        },
        {
            "code": "4P6EE",
            "faculty": "Dr. J. Sunitha Kumari",
            "room": "C-101"
        },
        {
            "code": "4P6EE",
            "faculty": "Dr. J. Sunitha Kumari",
            "room": "C-101"
        },
        {
            "code": "4O5EA",
            "faculty": "Mrs. S. Anusha",
            "room": "C-601"
        },
        {
            "code": "4O5EA",
            "faculty": "Mr. G. V. Subbarao",
            "room": "C-601"
        },
        {
            "code": "4E609",
            "faculty": "Mrs. D. Uma Maheshwari",
            "room": "Lab 1"
        },
        {
            "code": "4E609",
            "faculty": "Mr. Ande Srinivasa Reddy",
            "room": "Lab 1"
        },
        {
            "code": "4E610",
            "faculty": "Mr. K. Venugopal Reddy",
            "room": "Lab 2"
        },
        {
            "code": "4E610",
            "faculty": "Dr. A. Pramod Reddy",
            "room": "Lab 2"
        },
        {
            "code": "CRT",
            "faculty": "Technical Trainer",
            "room": "Auditorium"
        }
    ],
    "CSE-4-1": [
        {
            "code": "4E7EA",
            "faculty": "Dr. Vempati Krishna",
            "room": "C-701"
        },
        {
            "code": "4E7EA",
            "faculty": "Mrs. P. Laxmi Prasanna",
            "room": "C-701"
        },
        {
            "code": "4E7EB",
            "faculty": "Mrs. D. Swathi",
            "room": "C-701"
        },
        {
            "code": "4E7EB",
            "faculty": "Mr. U. Anand",
            "room": "C-701"
        },
        {
            "code": "4P7EA",
            "faculty": "M. Gnanesh Goud",
            "room": "C-701"
        },
        {
            "code": "4P7EA",
            "faculty": "M. Gnanesh Goud",
            "room": "C-701"
        },
        {
            "code": "4O7EA",
            "faculty": "Dhanunjayasingh",
            "room": "C-701"
        },
        {
            "code": "4O7EA",
            "faculty": "Dr. R. Rajendranath",
            "room": "C-701"
        },
        {
            "code": "4E704",
            "faculty": "Dr. Vempati Krishna",
            "room": "Lab 1"
        },
        {
            "code": "4E704",
            "faculty": "Mrs. N. Padmavathi",
            "room": "Lab 1"
        },
        {
            "code": "4P7PW",
            "faculty": "Mr. A. Koteshwar Rao",
            "room": "Project Lab"
        },
        {
            "code": "4P7PW",
            "faculty": "Mrs. M. Vaishnavi",
            "room": "Project Lab"
        },
        {
            "code": "CRT",
            "faculty": "Technical Trainer",
            "room": "Auditorium"
        }
    ],
    "CSE-4-2": [
        {
            "code": "4E8EA",
            "faculty": "Dr. Vempati Krishna",
            "room": "C-801"
        },
        {
            "code": "4E8EA",
            "faculty": "Mrs. G. Arpitha",
            "room": "C-801"
        },
        {
            "code": "4P8EC",
            "faculty": "Mrs. Prathibha",
            "room": "C-801"
        },
        {
            "code": "4P8EC",
            "faculty": "Mrs. Ch. Shilpa",
            "room": "C-801"
        },
        {
            "code": "4O8EA",
            "faculty": "Mrs. K. Naga Maha Lakshmi",
            "room": "C-801"
        },
        {
            "code": "4O8EA",
            "faculty": "Mrs. N. Kiranmai",
            "room": "C-801"
        },
        {
            "code": "4P8PW",
            "faculty": "Mrs. R. N. S. Kalpana",
            "room": "Project Lab"
        },
        {
            "code": "4P8PW",
            "faculty": "Mrs. A. Srujana",
            "room": "Project Lab"
        }
    ],
    "ECE-1-1": [
        {
            "code": "4B1AA",
            "faculty": "Dr. M. Narender",
            "room": "E-101"
        },
        {
            "code": "4B1AA",
            "faculty": "Dr. M. Narender",
            "room": "E-101"
        },
        {
            "code": "4B1AB",
            "faculty": "Rajnijanth",
            "room": "E-101"
        },
        {
            "code": "4B1AB",
            "faculty": "Dr. B. Rajinikanth",
            "room": "E-101"
        },
        {
            "code": "4E1AA",
            "faculty": "Mr. R. Naga Raju",
            "room": "E-101"
        },
        {
            "code": "4E1AA",
            "faculty": "Shanti",
            "room": "E-101"
        },
        {
            "code": "4E1AC",
            "faculty": "Mrs. Prasanna Pasunari",
            "room": "E-101"
        },
        {
            "code": "4E1AC",
            "faculty": "Dr. D. Anitha Kumari",
            "room": "E-101"
        },
        {
            "code": "4B108",
            "faculty": "Rajnijanth",
            "room": "Physics Lab"
        },
        {
            "code": "4B108",
            "faculty": "Dr. B. Narasimha",
            "room": "Physics Lab"
        },
        {
            "code": "4B110",
            "faculty": "Dr. D. Gopi Krishna",
            "room": "Workshop"
        },
        {
            "code": "4B110",
            "faculty": "Dr. D. Gopi Krishna",
            "room": "Workshop"
        },
        {
            "code": "4E111",
            "faculty": "Mrs. S. Saritha",
            "room": "BEE Lab"
        },
        {
            "code": "4E111",
            "faculty": "Mrs. D. Swathi",
            "room": "BEE Lab"
        },
        {
            "code": "4E112",
            "faculty": "Mrs. Vijayashree",
            "room": "Lab 1"
        },
        {
            "code": "4E112",
            "faculty": "Mrs. S. Gnaneshwari",
            "room": "Lab 1"
        },
        {
            "code": "4E113",
            "faculty": "Mr. K. Indra Kiran Reddy",
            "room": "Workshop 2"
        },
        {
            "code": "4E113",
            "faculty": "Mr. K. Indra Kiran Reddy",
            "room": "Workshop 2"
        }
    ],
    "ECE-1-2": [
        {
            "code": "4B2AF",
            "faculty": "B. Mahesh",
            "room": "E-102"
        },
        {
            "code": "4B2AF",
            "faculty": "G.Shankar",
            "room": "E-102"
        },
        {
            "code": "4B2AJ",
            "faculty": "Mrs. Mamatha",
            "room": "E-102"
        },
        {
            "code": "4B2AJ",
            "faculty": "Dr. A. Premalatha",
            "room": "E-102"
        },
        {
            "code": "4E2AJ",
            "faculty": "Mr. M. Sai Krishna",
            "room": "E-102"
        },
        {
            "code": "4E2AJ",
            "faculty": "Mr. M. Sai Krishna",
            "room": "E-102"
        },
        {
            "code": "4E2AK",
            "faculty": "Mrs. G. Anantha Lakshmi",
            "room": "Drawing Hall"
        },
        {
            "code": "4E2AK",
            "faculty": "Mrs. K. Anusha",
            "room": "Drawing Hall"
        },
        {
            "code": "4H2AC",
            "faculty": "Mrs. V. Ramani",
            "room": "E-102"
        },
        {
            "code": "4H2AC",
            "faculty": "Mr. M. A. Raghu",
            "room": "E-102"
        },
        {
            "code": "4B206",
            "faculty": "Mrs. Mamatha",
            "room": "Chemistry Lab"
        },
        {
            "code": "4B206",
            "faculty": "Mrs. Jagruthi",
            "room": "Chemistry Lab"
        },
        {
            "code": "4E207",
            "faculty": "CH. Divya",
            "room": "Lab 1"
        },
        {
            "code": "4E207",
            "faculty": "Mr. U. Anand",
            "room": "Lab 1"
        },
        {
            "code": "4E208",
            "faculty": "Mrs. Jhansi Rani",
            "room": "Lab 2"
        },
        {
            "code": "4E208",
            "faculty": "Mrs. D. Mounika",
            "room": "Lab 2"
        },
        {
            "code": "4H203",
            "faculty": "Mrs. V. Ramani",
            "room": "Language Lab"
        },
        {
            "code": "4H203",
            "faculty": "Mr. M. A. Raghu",
            "room": "Language Lab"
        }
    ],
    "ECE-2-1": [
        {
            "code": "4E3DB",
            "faculty": "Mr. M. Sai Krishna",
            "room": "E-301"
        },
        {
            "code": "4E3DB",
            "faculty": "Mrs. Jagruthi",
            "room": "E-301"
        },
        {
            "code": "4E3DC",
            "faculty": "Dr. M. Dhasaratham",
            "room": "E-301"
        },
        {
            "code": "4E3DC",
            "faculty": "Dr. M. Dhasaratham",
            "room": "E-301"
        },
        {
            "code": "4E3DD",
            "faculty": "Dr. B. Swapna Rani",
            "room": "E-301"
        },
        {
            "code": "4E3DD",
            "faculty": "Mr. A. Koteshwar Rao",
            "room": "E-301"
        },
        {
            "code": "4B3BA",
            "faculty": "Sreedevi",
            "room": "E-301"
        },
        {
            "code": "4B3BA",
            "faculty": "Dr. P. Madhavi",
            "room": "E-301"
        },
        {
            "code": "4E3DE",
            "faculty": "M. Gnanesh Goud",
            "room": "E-301"
        },
        {
            "code": "4E3DE",
            "faculty": "K. Shalini",
            "room": "E-301"
        },
        {
            "code": "4E307",
            "faculty": "Mr. M. Sai Krishna",
            "room": "Lab 1"
        },
        {
            "code": "4E307",
            "faculty": "Mrs. Jagruthi",
            "room": "Lab 1"
        },
        {
            "code": "4E308",
            "faculty": "Dr. B. Swapna Rani",
            "room": "Lab 2"
        },
        {
            "code": "4E308",
            "faculty": "Mrs. V. Pravalika",
            "room": "Lab 2"
        },
        {
            "code": "4E309",
            "faculty": "Dr. B. Swapna Rani",
            "room": "Lab 3"
        },
        {
            "code": "4E309",
            "faculty": "Mr. N. Kiran Kumar",
            "room": "Lab 3"
        },
        {
            "code": "4E310",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "Lab 4"
        },
        {
            "code": "4E310",
            "faculty": "Mr. B. Srikanth",
            "room": "Lab 4"
        }
    ],
    "ECE-2-2": [
        {
            "code": "4E4DB",
            "faculty": "Ms. B. Shreshta",
            "room": "E-401"
        },
        {
            "code": "4E4DB",
            "faculty": "Ms. B. Shreshta",
            "room": "E-401"
        },
        {
            "code": "4E4DA",
            "faculty": "Mrs. Bhavani",
            "room": "E-401"
        },
        {
            "code": "4E4DA",
            "faculty": "Mr. J. Rama Krishna",
            "room": "E-401"
        },
        {
            "code": "4E4DC",
            "faculty": "Mrs. S. Saritha",
            "room": "E-401"
        },
        {
            "code": "4E4DC",
            "faculty": "Dr. Ch. B. Naga Lakshmi",
            "room": "E-401"
        },
        {
            "code": "4E4DE",
            "faculty": "Mrs. Ch. Shilpa",
            "room": "E-401"
        },
        {
            "code": "4E4DE",
            "faculty": "Mr. R. Naga Raju",
            "room": "E-401"
        },
        {
            "code": "4E4DD",
            "faculty": "Mr. B. Pullarao",
            "room": "E-401"
        },
        {
            "code": "4E4DD",
            "faculty": "Mrs. K. Naga Maha Lakshmi",
            "room": "E-401"
        },
        {
            "code": "4E407",
            "faculty": "Ms. B. Shreshta",
            "room": "Lab 1"
        },
        {
            "code": "4E407",
            "faculty": "Ms. B. Shreshta",
            "room": "Lab 1"
        },
        {
            "code": "4E408",
            "faculty": "Mrs. S. Saritha",
            "room": "Lab 2"
        },
        {
            "code": "4E408",
            "faculty": "Dr. Sirisha K L S",
            "room": "Lab 2"
        },
        {
            "code": "4E409",
            "faculty": "Mr. B. Pullarao",
            "room": "Lab 3"
        },
        {
            "code": "4E409",
            "faculty": "Mrs. D. Mounika",
            "room": "Lab 3"
        },
        {
            "code": "4E410",
            "faculty": "Mrs. Ch. Tulasi Ratna Mani",
            "room": "Lab 4"
        },
        {
            "code": "4E410",
            "faculty": "Mrs. Jagruthi",
            "room": "Lab 4"
        }
    ],
    "ECE-3-1": [
        {
            "code": "4E5DB",
            "faculty": "Mrs. M. Jhansi Rani",
            "room": "E-501"
        },
        {
            "code": "4E5DB",
            "faculty": "Mr. K. Hemanth",
            "room": "E-501"
        },
        {
            "code": "4O5DA",
            "faculty": "Mallayya",
            "room": "E-501"
        },
        {
            "code": "4O5DA",
            "faculty": "Mrs. D. Mounika",
            "room": "E-501"
        },
        {
            "code": "4E5DA",
            "faculty": "Mrs. M. Jhansi Rani",
            "room": "E-501"
        },
        {
            "code": "4E5DA",
            "faculty": "K. Shalini",
            "room": "E-501"
        },
        {
            "code": "4H5DE",
            "faculty": "Mrs. V. Ramani",
            "room": "E-501"
        },
        {
            "code": "4H5DE",
            "faculty": "Mrs. V. Pravalika",
            "room": "E-501"
        },
        {
            "code": "4P5DB",
            "faculty": "Dr. Rajesh Banala",
            "room": "E-501"
        },
        {
            "code": "4P5DB",
            "faculty": "Mrs. S. Anusha",
            "room": "E-501"
        },
        {
            "code": "4E507",
            "faculty": "M. Gnanesh Goud",
            "room": "Lab 1"
        },
        {
            "code": "4E507",
            "faculty": "M. Gnanesh Goud",
            "room": "Lab 1"
        },
        {
            "code": "4E508",
            "faculty": "Ms. B. Shreshta",
            "room": "Lab 2"
        },
        {
            "code": "4E508",
            "faculty": "Dr. M. Narender",
            "room": "Lab 2"
        },
        {
            "code": "4H502",
            "faculty": "Mr. M. A. Raghu",
            "room": "Language Lab"
        },
        {
            "code": "4H502",
            "faculty": "Mrs. V. Ramani",
            "room": "Language Lab"
        }
    ],
    "ECE-3-2": [
        {
            "code": "4E6DA",
            "faculty": "K. Shalini",
            "room": "E-601"
        },
        {
            "code": "4E6DA",
            "faculty": "Mrs. M. Jhansi Rani",
            "room": "E-601"
        },
        {
            "code": "4E6DB",
            "faculty": "M. Gnanesh Goud",
            "room": "E-601"
        },
        {
            "code": "4E6DB",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "E-601"
        },
        {
            "code": "4E6DC",
            "faculty": "CH. Divya",
            "room": "E-601"
        },
        {
            "code": "4E6DC",
            "faculty": "CH. Divya",
            "room": "E-601"
        },
        {
            "code": "4P6DD",
            "faculty": "G. Bharath",
            "room": "E-601"
        },
        {
            "code": "4P6DD",
            "faculty": "Mr. B. Srikanth",
            "room": "E-601"
        },
        {
            "code": "4O6DA",
            "faculty": "Dr. J. Sunitha Kumari",
            "room": "E-601"
        },
        {
            "code": "4O6DA",
            "faculty": "Dr. J. Sunitha Kumari",
            "room": "E-601"
        },
        {
            "code": "4E605",
            "faculty": "M. Gnanesh Goud",
            "room": "Lab 1"
        },
        {
            "code": "4E605",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "Lab 1"
        },
        {
            "code": "4E606",
            "faculty": "CH. Divya",
            "room": "Lab 2"
        },
        {
            "code": "4E606",
            "faculty": "CH. Divya",
            "room": "Lab 2"
        },
        {
            "code": "4E607",
            "faculty": "Dr. J. Sunitha Kumari",
            "room": "Lab 3"
        },
        {
            "code": "4E607",
            "faculty": "Dr. R. Muruganantham",
            "room": "Lab 3"
        },
        {
            "code": "4E608",
            "faculty": "K. Shalini",
            "room": "Lab 4"
        },
        {
            "code": "4E608",
            "faculty": "Shanti",
            "room": "Lab 4"
        },
        {
            "code": "CRT",
            "faculty": "Technical Trainer",
            "room": "Auditorium"
        }
    ],
    "ECE-4-1": [
        {
            "code": "4E7DA",
            "faculty": "Mrs. P. Geethanjali",
            "room": "E-701"
        },
        {
            "code": "4E7DA",
            "faculty": "Mr. B. Srikanth",
            "room": "E-701"
        },
        {
            "code": "4H7DA",
            "faculty": "Dr. R. Rajendranath",
            "room": "E-701"
        },
        {
            "code": "4H7DA",
            "faculty": "B. Rajani",
            "room": "E-701"
        },
        {
            "code": "4P7DC",
            "faculty": "Ms. CH. Swapna",
            "room": "E-701"
        },
        {
            "code": "4P7DC",
            "faculty": "Mrs. M. Jhansi Rani",
            "room": "E-701"
        },
        {
            "code": "4P7DF",
            "faculty": "Mrs. V. Pravalika",
            "room": "E-701"
        },
        {
            "code": "4P7DF",
            "faculty": "Mrs. K. Naga Maha Lakshmi",
            "room": "E-701"
        },
        {
            "code": "4O7EA",
            "faculty": "Saileela",
            "room": "E-701"
        },
        {
            "code": "4O7EA",
            "faculty": "Mrs. D. Divya",
            "room": "E-701"
        },
        {
            "code": "4E703",
            "faculty": "Mrs. P. Vijaya Kumari",
            "room": "Lab 1"
        },
        {
            "code": "4E703",
            "faculty": "G. Bharath",
            "room": "Lab 1"
        },
        {
            "code": "4P7PW",
            "faculty": "Mr. Sk Mahaboob Basha",
            "room": "Project Lab"
        },
        {
            "code": "4P7PW",
            "faculty": "Ms. D V V Deepthi",
            "room": "Project Lab"
        },
        {
            "code": "CRT",
            "faculty": "Technical Trainer",
            "room": "Auditorium"
        }
    ],
    "ECE-4-2": [
        {
            "code": "4E8DA",
            "faculty": "Mrs. S. Usha Devi",
            "room": "E-801"
        },
        {
            "code": "4E8DA",
            "faculty": "Mr. G. V. Subbarao",
            "room": "E-801"
        },
        {
            "code": "4E8DB",
            "faculty": "Varsha",
            "room": "E-801"
        },
        {
            "code": "4E8DB",
            "faculty": "Manga Rao",
            "room": "E-801"
        },
        {
            "code": "4E8DC",
            "faculty": "Ms. B. Shreshta",
            "room": "E-801"
        },
        {
            "code": "4E8DC",
            "faculty": "Dr. M. Narender",
            "room": "E-801"
        },
        {
            "code": "4E8DD",
            "faculty": "Mrs. S. Anusha",
            "room": "E-801"
        },
        {
            "code": "4E8DD",
            "faculty": "Mrs. Srujana Reddy Aynala",
            "room": "E-801"
        },
        {
            "code": "4P8PW",
            "faculty": "Mrs. M. Vaishnavi",
            "room": "Project Lab"
        },
        {
            "code": "4P8PW",
            "faculty": "Mrs. R. N. S. Kalpana",
            "room": "Project Lab"
        }
    ]
};
