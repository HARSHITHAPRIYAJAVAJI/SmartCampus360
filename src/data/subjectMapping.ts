
export const SUBJECT_MAPPING: Record<string, string> = {
  "CN": "Computer Networks",
  "OS": "Operating Systems",
  "DSP": "Digital Signal Processing",
  "LA&ODE": "Linear Algebra & Ordinary Differential Equations",
  "DS": "Data Science",
  "OE": "Open Elective",
  "FDS": "Foundations of Data Science",
  "Java": "Java Programming",
  "Java Lab": "Java Programming Lab",
  "CPPS": "Computer Programming & Problem Solving",
  "CPPS Lab": "Computer Programming & Problem Solving Lab",
  "IS": "Information Security",
  "DL": "Deep Learning",
  "DL Lab": "Deep Learning Lab",
  "ML": "Machine Learning",
  "RL": "Reinforcement Learning",
  "KRR": "Knowledge Representation & Reasoning",
  "DBMS": "Database Management Systems",
  "DBMS Lab": "Database Management Systems Lab",
  "MFCS": "Mathematical Foundations of Computer Science",
  "DAA": "Design & Analysis of Algorithms",
  "RPA": "Robotic Process Automation",
  "SE": "Software Engineering",
  "WT": "Web Technologies",
  "WT Lab": "Web Technologies Lab",
  "BDA": "Big Data Analytics",
  "OOAD": "Object Oriented Analysis & Design",
  "ATCD": "Automata Theory & Compiler Design",
  "QC": "Quantum Computing",
  "NLP": "Natural Language Processing",
  "NLP Lab": "Natural Language Processing Lab",
  "DEVOPS": "DevOps",
  "ITWS Lab": "IT Workshop Lab",
  "SM&VC": "Statistical Methods & Vector Calculus",
  "P&S": "Probability & Statistics",
  "CO": "Computer Organization",
  "FLAT": "Formal Languages & Automata Theory",
  "IoT": "Internet of Things",
  "AI": "Artificial Intelligence",
  "PP Lab": "Python Programming Lab",
  "EP": "Engineering Physics",
  "FEE": "Fundamentals of Electrical Engineering",
  "MT": "Mathematics",
  "EC": "Engineering Chemistry",
  "English": "English for Skill Enhancement",
  "CAEG": "Computer Aided Engineering Graphics",
  "DLD": "Digital Logic Design",
  "NT": "Network Theory",
  "ECA": "Electronic Circuit Analysis",
  "CAVC": "Complex Analysis & Vector Calculus",
  "SS": "Signals & Systems",
  "ADC": "Analog & Digital Communications",
  "PTSP": "Probability Theory & Stochastic Processes",
  "PDC": "Pulse & Digital Circuits",
  "EMTL": "Electromagnetic Theory & Transmission Lines",
  "LDICA": "Linear & Digital IC Applications",
  "MPMC": "Microprocessors & Microcontrollers",
  "DIP": "Digital Image Processing",
  "AWP": "Antennas & Wave Propagation",
  "VLSI": "VLSI Design",
  "MWE": "Microwave Engineering",
  "PE": "Power Electronics",
  "ESD": "Embedded Systems Design",
  "SC": "Satellite Communications",
  "DSP&A": "Digital Signal Processing & Architecture",
  "OFC": "Optical Fiber Communications",
  "SDC": "Semiconductor Devices & Circuits",
  "CNS": "Computer Networks & Security",
  "DCCN": "Data Communications & Computer Networks",
  "CAO": "Computer Architecture & Organization",
  "PP": "Python Programming",
  "PP LAB": "Python Programming Lab",
  "DS Lab": "Data Structures Lab",
  "OOPS": "Object Oriented Programming Systems",
  "CP": "Competitive Programming",
  "IOT": "Internet of Things",
  "PES Lab": "Professional English for Skill Enhancement Lab",
  "DM": "Disaster Management",
  "DWDM": "Data Warehousing & Data Mining"
};

export const formatSubject = (subject: string): string[] => {
  // Normalize common cases where full names and shortcuts might be mixed or in different casing
  const normalized = subject.trim();

  // Special Case: CNS (Computer Networks & Security)
  if (normalized.includes("CNS") || normalized.includes("Computer Networks & Security")) {
    return [
      "Computer Networks (CN)",
      "Data Communications & Computer Networks (DCCN)",
      "Operating Systems (OS)"
    ];
  }

  // Check if it's already in "Full Name (Abbreviation)" format
  const match = normalized.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    const [_, fullName, abbrev] = match;
    return [`${fullName} (${abbrev})`];
  }

  // Check if the input is an abbreviation in the map
  if (SUBJECT_MAPPING[normalized]) {
    return [`${SUBJECT_MAPPING[normalized]} (${normalized})`];
  }

  // Check if the input is a full name and find its abbreviation
  const entry = Object.entries(SUBJECT_MAPPING).find(([abbr, full]) => full.toLowerCase() === normalized.toLowerCase());
  if (entry) {
    return [`${entry[1]} (${entry[0]})`];
  }

  // Default: Return as is if no mapping found
  return [normalized];
};

/**
 * Standardizes subject names to "Full Name (Abbreviation)" format.
 * Returns a single string.
 */
export const formatSubjectName = (subject: string): string => {
  if (!subject) return "";
  const normalized = subject.trim();

  // Check if it's already in "Full Name (Abbreviation)" format
  if (/\(.*\)$/.test(normalized)) {
    return normalized;
  }

  // Check if it's an abbreviation in our map
  const fullName = SUBJECT_MAPPING[normalized];
  if (fullName) {
    return `${fullName} (${normalized})`;
  }

  // Check if it's a full name and find its abbreviation
  const entry = Object.entries(SUBJECT_MAPPING).find(([abbr, full]) =>
    full.toLowerCase() === normalized.toLowerCase()
  );
  if (entry) {
    return `${entry[1]} (${entry[0]})`;
  }

  return normalized;
};

/**
 * Returns ONLY the abbreviation if possible.
 */
export const getSubjectAbbreviation = (subject: string): string => {
  if (!subject) return "";
  const normalized = subject.trim();

  // If already "Full Name (ABBR)", extract ABBR
  const match = normalized.match(/\((.*?)\)$/);
  if (match) return match[1];

  // If it's an abbreviation in our map, return it
  if (SUBJECT_MAPPING[normalized]) return normalized;

  // If it's a full name, find the key
  const entry = Object.entries(SUBJECT_MAPPING).find(([abbr, full]) =>
    full.toLowerCase() === normalized.toLowerCase()
  );
  if (entry) return entry[0];

  return normalized;
};
