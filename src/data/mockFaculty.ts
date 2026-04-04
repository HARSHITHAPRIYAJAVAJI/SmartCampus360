export interface Faculty {
  id: string;
  name: string;
  rollNumber: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  specialization?: string[];
}

export const MOCK_FACULTY: Faculty[] = [
  {
    id: "sunil-srinivas",
    name: "Dr. B. Sunil Srinivas",
    rollNumber: "22F91F6601",
    designation: "Head of Department (HOD)",
    department: "CSM",
    email: "sunil.srinivas@smartcampus.com",
    phone: "+91 98765 43210",
    specialization: ["DS OE", "FDS"]
  },
  {
    id: "anitha-kumari-d",
    name: "Dr. D. Anitha Kumari",
    rollNumber: "22F91F6602",
    designation: "Professor",
    department: "CSM",
    email: "anitha.d@smartcampus.com",
    phone: "+91 98765 43211",
    specialization: ["Java", "Java Lab", "CPPS"]
  },
  {
    id: "syed-hussain",
    name: "Dr. Syed Hussain",
    rollNumber: "22F91F6603",
    designation: "Associate Professor",
    department: "CSM",
    email: "syed.hussain@smartcampus.com",
    phone: "+91 98765 43212",
    specialization: ["Conversational AI", "IS"]
  },
  {
    id: "m-indira",
    name: "Mrs. M. Indira",
    rollNumber: "22F91F6604",
    designation: "Assistant Professor",
    department: "CSM",
    email: "indira.m@smartcampus.com",
    phone: "+91 98765 43213",
    specialization: ["PP Lab", "OE", "CAO"]
  },
  {
    id: "c-jaya-lakshmi",
    name: "Mrs. C. Jaya Lakshmi",
    rollNumber: "22F91F6605",
    designation: "Assistant Professor",
    department: "CSM",
    email: "jayalakshmi.c@smartcampus.com",
    phone: "+91 98765 43214",
    specialization: ["DL", "DL Lab", "ML"]
  },
  {
    id: "venugopal-reddy-k",
    name: "Mr. K. Venugopal Reddy",
    rollNumber: "22F91F6606",
    designation: "Assistant Professor",
    department: "CSM",
    email: "venugopal.k@smartcampus.com",
    phone: "+91 98765 43215",
    specialization: ["DS Lab", "DBMS Lab", "RL", "KRR"]
  },
  {
    id: "p-vijaya-kumari",
    name: "Mrs. P. Vijaya Kumari",
    rollNumber: "22F91F6607",
    designation: "Assistant Professor",
    department: "CSM",
    email: "vijayakumari.p@smartcampus.com",
    phone: "+91 98765 43216",
    specialization: ["DBMS Lab", "DL", "DL Lab", "C", "ITWS Lab"]
  },
  {
    id: "t-praneetha",
    name: "Mrs. T. Praneetha",
    rollNumber: "22F91F6608",
    designation: "Assistant Professor",
    department: "CSM",
    email: "praneetha.t@smartcampus.com",
    phone: "+91 98765 43217",
    specialization: ["DBMS", "DBMS Lab", "MFCS"]
  },
  {
    id: "v-pravalika",
    name: "Mrs. V. Pravalika",
    rollNumber: "22F91F6609",
    designation: "Assistant Professor",
    department: "CSM",
    email: "pravalika.v@smartcampus.com",
    phone: "+91 98765 43218",
    specialization: ["OE", "KRR"]
  },
  {
    id: "s-swathi",
    name: "Mrs. S. Swathi",
    rollNumber: "22F91F6610",
    designation: "Assistant Professor",
    department: "CSM",
    email: "swathi.s@smartcampus.com",
    phone: "+91 98765 43219",
    specialization: ["PP Lab", "OE", "CN"]
  },
  {
    id: "ishwarya-devi-k",
    name: "Mrs. K. Ishwarya Devi",
    rollNumber: "22F91F6611",
    designation: "Assistant Professor",
    department: "CSM",
    email: "ishwarya.k@smartcampus.com",
    phone: "+91 98765 43220",
    specialization: ["OS"]
  },
  {
    id: "n-kiran-kumar",
    name: "Mr. N. Kiran Kumar",
    rollNumber: "22F91F6612",
    designation: "Assistant Professor",
    department: "CSM",
    email: "kirankumar.n@smartcampus.com",
    phone: "+91 98765 43221",
    specialization: ["DAA", "RPA", "DL Lab", "RL"]
  },
  {
    id: "e-radhika",
    name: "Mrs. E. Radhika",
    rollNumber: "22F91F6613",
    designation: "Assistant Professor",
    department: "CSM",
    email: "radhika.e@smartcampus.com",
    phone: "+91 98765 43222",
    specialization: ["SE", "WT Lab", "IS"]
  },
  {
    id: "shilpa-ch-csm",
    name: "Mrs. Ch. Shilpa",
    rollNumber: "22F91F6614",
    designation: "Assistant Professor",
    department: "CSM",
    email: "shilpa.ch@smartcampus.com",
    phone: "+91 98765 43223",
    specialization: ["SE", "WT Lab", "CAO"]
  },
  {
    id: "d-mounika",
    name: "Mrs. D. Mounika",
    rollNumber: "22F91F6615",
    designation: "Assistant Professor",
    department: "CSM",
    email: "mounika.d@smartcampus.com",
    phone: "+91 98765 43224",
    specialization: ["Java", "Java Lab", "PP", "PP LAB"]
  },
  {
    id: "d-uma-maheshwari",
    name: "Mrs. D. Uma Maheshwari",
    rollNumber: "22F91F6616",
    designation: "Assistant Professor",
    department: "CSM",
    email: "umamaheshwari.d@smartcampus.com",
    phone: "+91 98765 43225",
    specialization: ["Conversational AI", "NLP Lab", "QC", "ATCD"]
  },
  {
    id: "p-rajini",
    name: "Mrs. P. Rajini",
    rollNumber: "22F91F6617",
    designation: "Assistant Professor",
    department: "CSM",
    email: "rajini.p@smartcampus.com",
    phone: "+91 98765 43226",
    specialization: ["Java Lab", "QC", "BDA"]
  },
  {
    id: "geethanjali-p",
    name: "Mrs. P. Geethanjali",
    rollNumber: "22F91F6618",
    designation: "Assistant Professor",
    department: "CSM",
    email: "geethanjali.p@smartcampus.com",
    phone: "+91 98765 43227",
    specialization: ["DBMS", "DBMS Lab", "OOAD"]
  },
  {
    id: "m-suryakumari",
    name: "Mrs. M. Suryakumari",
    rollNumber: "22F91F6619",
    designation: "Assistant Professor",
    department: "CSM",
    email: "suryakumari.m@smartcampus.com",
    phone: "+91 98765 43228",
    specialization: ["DS", "DS Lab", "CPPS", "ITWS LAB"]
  },
  {
    id: "c-saritha-reddy",
    name: "Mrs. C. Saritha Reddy",
    rollNumber: "22F91F6620",
    designation: "Assistant Professor",
    department: "CSM",
    email: "sarithareddy.c@smartcampus.com",
    phone: "+91 98765 43229",
    specialization: ["Java Lab", "NLP", "AI"]
  },
  {
    id: "gnaneshwari-s",
    name: "Mrs. S. Gnaneshwari",
    rollNumber: "22F91F6621",
    designation: "Assistant Professor",
    department: "CSM",
    email: "gnaneshwari.s@smartcampus.com",
    phone: "+91 98765 43230",
    specialization: ["DAA", "DBMS Lab", "PP", "PP LAB"]
  },
  {
    id: "b-vijitha",
    name: "Mrs. B. Vijitha",
    rollNumber: "22F91F6622",
    designation: "Assistant Professor",
    department: "CSM",
    email: "vijitha.b@smartcampus.com",
    phone: "+91 98765 43231",
    specialization: ["Java Lab", "DL", "DL Lab", "ATCD"]
  },
  {
    id: "srinivasa-reddy",
    name: "Mr. Ande Srinivasa Reddy",
    rollNumber: "22F91F6623",
    designation: "Assistant Professor",
    department: "CSM",
    email: "srinivasa.reddy@smartcampus.com",
    phone: "+91 98765 43232",
    specialization: ["RPA", "NLP Lab", "DEVOPS"]
  },
  {
    id: "r-naga-raju",
    name: "Mr. R. Naga Raju",
    rollNumber: "22F91F6624",
    designation: "Assistant Professor",
    department: "CSM",
    email: "nagaraju.r@smartcampus.com",
    phone: "+91 98765 43233",
    specialization: ["Java", "Java Lab", "CN"]
  },
  {
    id: "srujana-reddy-aynala",
    name: "Mrs. Srujana Reddy Aynala",
    rollNumber: "22F91F6625",
    designation: "Assistant Professor",
    department: "CSM",
    email: "srujana.reddy@smartcampus.com",
    phone: "+91 98765 43234",
    specialization: ["WT", "WT Lab", "MFCS"]
  },
  {
    id: "jhansi-rani",
    name: "Mrs. Jhansi Rani",
    rollNumber: "22F91F6626",
    designation: "Assistant Professor",
    department: "CSM",
    email: "jhansirani@smartcampus.com",
    phone: "+91 98765 43235",
    specialization: ["DS", "DS Lab", "PP Lab", "CPPS"]
  },
  {
    id: "varsha",
    name: "Varsha",
    rollNumber: "22F91F6627",
    designation: "Assistant Professor",
    department: "CSM",
    email: "varsha@smartcampus.com",
    phone: "+91 98765 43236",
    specialization: ["DS", "DS Lab"]
  },
  {
    id: "vinay",
    name: "Vinay",
    rollNumber: "22F91F6628",
    designation: "Assistant Professor",
    department: "CSM",
    email: "vinay@smartcampus.com",
    phone: "+91 98765 43237",
    specialization: ["NLP", "NLP Lab"]
  },
  {
    id: "shanti",
    name: "Shanti",
    rollNumber: "22F91F6629",
    designation: "Assistant Professor",
    department: "CSM",
    email: "shanti@smartcampus.com",
    phone: "+91 98765 43238",
    specialization: ["OOPS"]
  },
  {
    id: "mallayya",
    name: "Mallayya",
    rollNumber: "22F91F6630",
    designation: "Assistant Professor",
    department: "CSM",
    email: "mallayya@smartcampus.com",
    phone: "+91 98765 43239",
    specialization: ["DAA"]
  },
  {
    id: "anitha-chowdary",
    name: "Anitha Chowdary",
    rollNumber: "22F91F6631",
    designation: "Assistant Professor",
    department: "CSM",
    email: "anitha.chowdary@smartcampus.com",
    phone: "+91 98765 43240",
    specialization: ["PP Lab"]
  },
  {
    id: "manga-rao",
    name: "Manga Rao",
    rollNumber: "22F91F6632",
    designation: "Assistant Professor",
    department: "CSM",
    email: "mangarao@smartcampus.com",
    phone: "+91 98765 43241",
    specialization: ["PP Lab", "DS"]
  },
  {
    id: "ramya-priya",
    name: "RAMYA PRIYA",
    rollNumber: "22F91F6633",
    designation: "Assistant Professor",
    department: "CSM",
    email: "ramyapriya@smartcampus.com",
    phone: "+91 98765 43242",
    specialization: ["IS"]
  },
  {
    id: "p-madhavi",
    name: "Dr. P. Madhavi",
    rollNumber: "22F91F0001",
    designation: "Professor",
    department: "Mathematics",
    email: "madhavi.p@smartcampus.com",
    phone: "+91 98765 43243",
    specialization: ["SM&VC", "P&S"]
  },
  {
    id: "sudha-rani",
    name: "Sudha Rani",
    rollNumber: "22F91F6643",
    designation: "Assistant Professor",
    department: "CSM",
    email: "sudharani.csm@smartcampus.com",
    phone: "+91 98765 43288",
    specialization: ["English Language and Communication Skills Lab", "English for Skill Enhancement"]
  },
  {
    id: "shankar",
    name: "Shankar",
    rollNumber: "22F91F6644",
    designation: "Assistant Professor",
    department: "CSM",
    email: "shankar.csm@smartcampus.com",
    phone: "+91 98765 43299",
    specialization: ["LA&ODE"]
  },
  // IT Branch Faculty
  {
    id: "nallamothu-satyanarayana",
    name: "Dr. Nallamothu Satyanarayana",
    rollNumber: "22F91F7701",
    designation: "Professor",
    department: "IT",
    email: "satyanarayana.n@smartcampus.com",
    phone: "+91 91234 56701",
    specialization: ["Computer Architecture", "Wireless Sensor Networks", "Data Mining"]
  },
  {
    id: "muruganantham-r",
    name: "Dr. R. Muruganantham",
    rollNumber: "22F91F7702",
    designation: "Professor",
    department: "IT",
    email: "muruganantham.r@smartcampus.com",
    phone: "+91 91234 56702",
    specialization: ["Internet of Things", "Machine Learning", "Wireless Sensor Networks", "Cryptography", "Computer Networks"]
  },
  {
    id: "dhasaratham-m",
    name: "Dr. M. Dhasaratham",
    rollNumber: "22F91F7703",
    designation: "Associate Professor",
    department: "IT",
    email: "dhasaratham.m@smartcampus.com",
    phone: "+91 91234 56703",
    specialization: ["Cloud Computing", "Machine Learning", "Internet of Things", "Networking"]
  },
  {
    id: "kavitha-d",
    name: "D. Kavitha",
    rollNumber: "22F91F7704",
    designation: "Assistant Professor",
    department: "IT",
    email: "kavitha.d@smartcampus.com",
    phone: "+91 91234 56704",
    specialization: ["Artificial Intelligence", "Machine Learning"]
  },
  {
    id: "thakur-madhumathi",
    name: "Thakur Madhumathi",
    rollNumber: "22F91F7705",
    designation: "Assistant Professor",
    department: "IT",
    email: "madhumathi.t@smartcampus.com",
    phone: "+91 91234 56705",
    specialization: ["Artificial Intelligence"]
  },
  {
    id: "mandalreddy-sushma",
    name: "Mandalreddy Sushma",
    rollNumber: "22F91F7706",
    designation: "Assistant Professor",
    department: "IT",
    email: "sushma.m@smartcampus.com",
    phone: "+91 91234 56706",
    specialization: ["Data Science"]
  },
  {
    id: "n-paparayudu",
    name: "N. Paparayudu",
    rollNumber: "22F91F7707",
    designation: "Assistant Professor",
    department: "IT",
    email: "paparayudu.n@smartcampus.com",
    phone: "+91 91234 56707",
    specialization: ["Data Mining", "Machine Learning"]
  },
  {
    id: "jarapala-ramesh",
    name: "Jarapala Ramesh",
    rollNumber: "22F91F7708",
    designation: "Assistant Professor",
    department: "IT",
    email: "ramesh.j@smartcampus.com",
    phone: "+91 91234 56708",
    specialization: ["Quantum Computing", "Blockchain Technology"]
  },
  {
    id: "y-naga-lavanya",
    name: "Y. Naga Lavanya",
    rollNumber: "22F91F7709",
    designation: "Assistant Professor",
    department: "IT",
    email: "nagalavanya.y@smartcampus.com",
    phone: "+91 91234 56709",
    specialization: ["Data Science", "Artificial Intelligence", "Deep Learning"]
  },
  {
    id: "meka-aruna",
    name: "Meka Aruna",
    rollNumber: "22F91F7710",
    designation: "Assistant Professor",
    department: "IT",
    email: "meka.aruna@smartcampus.com",
    phone: "+91 91234 56710",
    specialization: ["Deep Learning"]
  },
  {
    id: "mounika-nakrekanti",
    name: "Mounika Nakrekanti",
    rollNumber: "22F91F7711",
    designation: "Assistant Professor",
    department: "IT",
    email: "mounika.n@smartcampus.com",
    phone: "+91 91234 56711",
    specialization: ["DAA", "Python"]
  },
  {
    id: "v-murugan",
    name: "V. Murugan",
    rollNumber: "22F91F7712",
    designation: "Assistant Professor",
    department: "IT",
    email: "v.murugan@smartcampus.com",
    phone: "+91 91234 56712",
    specialization: ["Cyber Security", "Machine Learning", "Cloud Computing"]
  },
  {
    id: "yacharam-uma",
    name: "Yacharam Uma",
    rollNumber: "22F91F7713",
    designation: "Assistant Professor",
    department: "IT",
    email: "yacharam.uma@smartcampus.com",
    phone: "+91 91234 56713",
    specialization: ["Artificial Intelligence"]
  },
  {
    id: "p-himabindu",
    name: "P. Himabindu",
    rollNumber: "22F91F7714",
    designation: "Assistant Professor",
    department: "IT",
    email: "p.himabindu@smartcampus.com",
    phone: "+91 91234 56714",
    specialization: ["Software Engineering"]
  },
  {
    id: "g-bharath",
    name: "G. Bharath",
    rollNumber: "22F91F7715",
    designation: "Assistant Professor",
    department: "IT",
    email: "g.bharath@smartcampus.com",
    phone: "+91 91234 56715",
    specialization: ["Information Security", "Machine Learning"]
  },
  {
    id: "p-swathi",
    name: "P. Swathi",
    rollNumber: "22F91F7716",
    designation: "Assistant Professor",
    department: "IT",
    email: "p.swathi@smartcampus.com",
    phone: "+91 91234 56716",
    specialization: ["Operating Systems (OS)", "Computer Networks & Security (CNS)"]
  },
  {
    id: "n-anjali",
    name: "N. Anjali",
    rollNumber: "22F91F7717",
    designation: "Assistant Professor",
    department: "IT",
    email: "n.anjali@smartcampus.com",
    phone: "+91 91234 56717",
    specialization: ["DBMS"]
  },
  {
    id: "b-rajani",
    name: "B. Rajani",
    rollNumber: "22F91F7718",
    designation: "Assistant Professor",
    department: "IT",
    email: "b.rajani@smartcampus.com",
    phone: "+91 91234 56718",
    specialization: ["Cyber Security", "Machine Learning"]
  },
  {
    id: "mrs-b-madhavi",
    name: "Mrs. B. Madhavi",
    rollNumber: "22F91F7719",
    designation: "Assistant Professor",
    department: "IT",
    email: "b.madhavi@smartcampus.com",
    phone: "+91 91234 56719",
    specialization: ["Python Programming"]
  },
  {
    id: "mr-s-pradeep",
    name: "Mr. S. Pradeep",
    rollNumber: "22F91F7720",
    designation: "Assistant Professor",
    department: "IT",
    email: "s.pradep@smartcampus.com",
    phone: "+91 91234 56720",
    specialization: ["Python Programming"]
  },
  {
    id: "b-upender",
    name: "B. Upender",
    rollNumber: "22F91F7721",
    designation: "Assistant Professor",
    department: "IT",
    email: "b.upender@smartcampus.com",
    phone: "+91 91234 56721",
    specialization: ["Data Science", "Artificial Intelligence"]
  },
  // CSE Branch Faculty
  {
    id: "a-suresh-rao",
    name: "Dr. A. Suresh Rao",
    rollNumber: "22F91F8801",
    designation: "Professor",
    department: "CSE",
    email: "sureshrao.a@smartcampus.com",
    phone: "+91 92234 56801",
    specialization: ["Data Mining", "Machine Learning"]
  },
  {
    id: "m-narender",
    name: "Dr. M. Narender",
    rollNumber: "22F91F8802",
    designation: "Professor",
    department: "CSE",
    email: "narender.m@smartcampus.com",
    phone: "+91 92234 56802",
    specialization: ["Computer Networks", "Network Security", "Machine Learning", "Deep Learning"]
  },
  {
    id: "vempati-krishna",
    name: "Dr. Vempati Krishna",
    rollNumber: "22F91F8803",
    designation: "Professor",
    department: "CSE",
    email: "krishna.v@smartcampus.com",
    phone: "+91 92234 56803",
    specialization: ["Image Processing", "Machine Learning", "Deep Learning", "Computer Vision"]
  },
  {
    id: "ch-b-naga-lakshmi",
    name: "Dr. Ch. B. Naga Lakshmi",
    rollNumber: "22F91F8804",
    designation: "Professor",
    department: "CSE",
    email: "nagalakshmi.ch@smartcampus.com",
    phone: "+91 92234 56804",
    specialization: ["Computer Networks"]
  },

  {
    id: "rajesh-banala",
    name: "Dr. Rajesh Banala",
    rollNumber: "22F91F8807",
    designation: "Associate Professor",
    department: "CSE",
    email: "rajesh.b@smartcampus.com",
    phone: "+91 92234 56807",
    specialization: ["Networks", "Artificial Intelligence"]
  },
  {
    id: "a-pramod-reddy",
    name: "Dr. A. Pramod Reddy",
    rollNumber: "22F91F8808",
    designation: "Associate Professor",
    department: "CSE",
    email: "pramod.a@smartcampus.com",
    phone: "+91 92234 56808",
    specialization: ["Speech Processing", "Machine Learning"]
  },
  {
    id: "nelli-chandrakala",
    name: "Dr. Nelli Chandrakala",
    rollNumber: "22F91F8809",
    designation: "Associate Professor",
    department: "CSE",
    email: "chandrakala.n@smartcampus.com",
    phone: "+91 92234 56809",
    specialization: ["Cloud Computing"]
  },
  {
    id: "kuna-naresh",
    name: "Dr. Kuna Naresh",
    rollNumber: "22F91F8810",
    designation: "Associate Professor",
    department: "CSE",
    email: "naresh.k@smartcampus.com",
    phone: "+91 92234 56810",
    specialization: ["Software Engineering"]
  },
  {
    id: "sirisha-k-l-s",
    name: "Dr. Sirisha K L S",
    rollNumber: "22F91F8811",
    designation: "Associate Professor",
    department: "CSE",
    email: "sirisha.k@smartcampus.com",
    phone: "+91 92234 56811",
    specialization: ["Software Engineering"]
  },
  {
    id: "shirish-reddy-k",
    name: "Mrs. K. Shirish Reddy",
    rollNumber: "22F91F8812",
    designation: "Assistant Professor",
    department: "CSE",
    email: "shirish.k@smartcampus.com",
    phone: "+91 92234 56812",
    specialization: ["Networking"]
  },
  {
    id: "indra-kiran-reddy-k",
    name: "Mr. K. Indra Kiran Reddy",
    rollNumber: "22F91F8813",
    designation: "Assistant Professor",
    department: "CSE",
    email: "indrakiran.k@smartcampus.com",
    phone: "+91 92234 56813",
    specialization: ["IT Workshop"]
  },
  {
    id: "g-deepthi",
    name: "Mrs. G. Deepthi",
    rollNumber: "22F91F8814",
    designation: "Assistant Professor",
    department: "CSE",
    email: "deepthi.g@smartcampus.com",
    phone: "+91 92234 56814",
    specialization: ["CO", "DAA", "FLAT"]
  },
  {
    id: "p-chandra-shekar",
    name: "P. Chandra Shekar",
    rollNumber: "22F91F8815",
    designation: "Assistant Professor",
    department: "CSE",
    email: "chandrashekar.p@smartcampus.com",
    phone: "+91 92234 56815",
    specialization: ["Application Development"]
  },
  {
    id: "y-latha",
    name: "Mrs. Y. Latha",
    rollNumber: "22F91F8816",
    designation: "Assistant Professor",
    department: "CSE",
    email: "latha.y@smartcampus.com",
    phone: "+91 92234 56816",
    specialization: ["Data Mining", "Machine Learning"]
  },
  {
    id: "m-thanmayee",
    name: "Mrs. M. Thanmayee",
    rollNumber: "22F91F8817",
    designation: "Assistant Professor",
    department: "CSE",
    email: "thanmayee.m@smartcampus.com",
    phone: "+91 92234 56817",
    specialization: ["IoT", "AI"]
  },
  {
    id: "pragathi-vulpala",
    name: "Mrs. Pragathi Vulpala",
    rollNumber: "22F91F8818",
    designation: "Assistant Professor",
    department: "CSE",
    email: "pragathi.v@smartcampus.com",
    phone: "+91 92234 56818",
    specialization: ["Networks"]
  },
  {
    id: "p-laxmi-prasanna",
    name: "Mrs. P. Laxmi Prasanna",
    rollNumber: "22F91F8819",
    designation: "Assistant Professor",
    department: "CSE",
    email: "laxmiprasanna.p@smartcampus.com",
    phone: "+91 92234 56819",
    specialization: ["Machine Learning"]
  },
  {
    id: "n-padmavathi",
    name: "Mrs. N. Padmavathi",
    rollNumber: "22F91F8820",
    designation: "Assistant Professor",
    department: "CSE",
    email: "padmavathi.n@smartcampus.com",
    phone: "+91 92234 56820",
    specialization: ["Machine Learning", "Application Development"]
  },
  {
    id: "g-arpitha",
    name: "Mrs. G. Arpitha",
    rollNumber: "22F91F8821",
    designation: "Assistant Professor",
    department: "CSE",
    email: "arpitha.g@smartcampus.com",
    phone: "+91 92234 56821",
    specialization: ["Data Mining"]
  },
  {
    id: "g-anantha-lakshmi",
    name: "Mrs. G. Anantha Lakshmi",
    rollNumber: "22F91F8822",
    designation: "Assistant Professor",
    department: "CSE",
    email: "ananthalakshmi.g@smartcampus.com",
    phone: "+91 92234 56822",
    specialization: ["Machine Learning", "Deep Learning"]
  },
  {
    id: "k-anusha",
    name: "Mrs. K. Anusha",
    rollNumber: "22F91F8823",
    designation: "Assistant Professor",
    department: "CSE",
    email: "anusha.k@smartcampus.com",
    phone: "+91 92234 56823",
    specialization: ["Artificial Intelligence", "Machine Learning"]
  },
  {
    id: "a-pradeep-cse",
    name: "A. Pradeep",
    rollNumber: "22F91F8824",
    designation: "Assistant Professor",
    department: "CSE",
    email: "pradeep.a@smartcampus.com",
    phone: "+91 92234 56824",
    specialization: ["C", "IoT", "Web Application", "Networks"]
  },
  {
    id: "k-venugopal-reddy-cse",
    name: "Mr. K. Venugopal Reddy",
    rollNumber: "22F91F8825",
    designation: "Assistant Professor",
    department: "CSE",
    email: "venugopal.k@smartcampus.com",
    phone: "+91 92234 56825",
    specialization: ["Machine Learning"]
  },

  {
    id: "m-vijaya-kumari",
    name: "Mrs. M. Vijaya Kumari",
    rollNumber: "22F91F8826",
    designation: "Assistant Professor",
    department: "CSE",
    email: "vijayakumari.m@smartcampus.com",
    phone: "+91 92234 56826",
    specialization: ["ML", "Advanced Computer Vision", "DL"]
  },
  {
    id: "l-gnanender-reddy",
    name: "Mr. L. Gnanender Reddy",
    rollNumber: "22F91F8827",
    designation: "Assistant Professor",
    department: "CSE",
    email: "gnanender.l@smartcampus.com",
    phone: "+91 92234 56827",
    specialization: ["Artificial Intelligence"]
  },
  {
    id: "v-pavani",
    name: "Mrs. V. Pavani",
    rollNumber: "22F91F8828",
    designation: "Assistant Professor",
    department: "CSE",
    email: "pavani.v@smartcampus.com",
    phone: "+91 92234 56828",
    specialization: ["Artificial Intelligence"]
  },
  {
    id: "thirumani-anusha",
    name: "Mrs. Thirumani Anusha",
    rollNumber: "22F91F8829",
    designation: "Assistant Professor",
    department: "CSE",
    email: "anusha.t@smartcampus.com",
    phone: "+91 92234 56829",
    specialization: ["Python", "ML"]
  },
  {
    id: "p-rajyalakshmi",
    name: "Mrs. P. Rajyalakshmi",
    rollNumber: "22F91F8830",
    designation: "Assistant Professor",
    department: "CSE",
    email: "rajyalakshmi.p@smartcampus.com",
    phone: "+91 92234 56830",
    specialization: ["Data Mining"]
  },
  {
    id: "a-tejaswini",
    name: "Mrs. A. Tejaswini",
    rollNumber: "22F91F8831",
    designation: "Assistant Professor",
    department: "CSE",
    email: "tejaswini.a@smartcampus.com",
    phone: "+91 92234 56831",
    specialization: ["Databases", "Machine Learning", "Data Mining"]
  },
  {
    id: "g-jyothi",
    name: "Mrs. G. Jyothi",
    rollNumber: "22F91F8832",
    designation: "Assistant Professor",
    department: "CSE",
    email: "jyothi.g@smartcampus.com",
    phone: "+91 92234 56832",
    specialization: ["Machine Learning"]
  },
  {
    id: "ch-tulasi-ratna-mani",
    name: "Mrs. Ch. Tulasi Ratna Mani",
    rollNumber: "22F91F8833",
    designation: "Assistant Professor",
    department: "CSE",
    email: "tulasiratnamani.ch@smartcampus.com",
    phone: "+91 92234 56833",
    specialization: ["Computer Networks"]
  },
  {
    id: "sk-mahaboob-basha",
    name: "Mr. Sk Mahaboob Basha",
    rollNumber: "22F91F8834",
    designation: "Assistant Professor",
    department: "CSE",
    email: "mahaboobbasha.sk@smartcampus.com",
    phone: "+91 92234 56834",
    specialization: ["Computer Networks"]
  },
  {
    id: "k-naga-maha-lakshmi",
    name: "Mrs. K. Naga Maha Lakshmi",
    rollNumber: "22F91F8835",
    designation: "Assistant Professor",
    department: "CSE",
    email: "nagamahalakshmi.k@smartcampus.com",
    phone: "+91 92234 56835",
    specialization: ["Network Security", "Image Processing"]
  },
  {
    id: "b-naga-jyothi",
    name: "Mrs. B. Naga Jyothi",
    rollNumber: "22F91F8836",
    designation: "Assistant Professor",
    department: "CSE",
    email: "nagajyothi.b@smartcampus.com",
    phone: "+91 92234 56836",
    specialization: ["Machine Learning"]
  },
  {
    id: "m-jyothi",
    name: "Mrs. M. Jyothi",
    rollNumber: "22F91F8837",
    designation: "Assistant Professor",
    department: "CSE",
    email: "jyothi.m@smartcampus.com",
    phone: "+91 92234 56837",
    specialization: ["Databases", "Machine Learning"]
  },
  {
    id: "vangala-konica-nehal",
    name: "Ms. Vangala Konica Nehal",
    rollNumber: "22F91F8838",
    designation: "Assistant Professor",
    department: "CSE",
    email: "konicanehal.v@smartcampus.com",
    phone: "+91 92234 56838",
    specialization: ["Machine Learning", "AI"]
  },
  {
    id: "polepaka-prashamsa",
    name: "Mrs. Polepaka Prashamsa",
    rollNumber: "22F91F8839",
    designation: "Assistant Professor",
    department: "CSE",
    email: "prashamsa.p@smartcampus.com",
    phone: "+91 92234 56839",
    specialization: ["AI", "Machine Learning"]
  },
  {
    id: "p-venkata-kishan-rao",
    name: "Ms. P. Venkata Kishan Rao",
    rollNumber: "22F91F8840",
    designation: "Assistant Professor",
    department: "CSE",
    email: "venkatakishanrao.p@smartcampus.com",
    phone: "+91 92234 56840",
    specialization: ["Databases", "Data Mining", "Big Data"]
  },
  {
    id: "b-srikanth",
    name: "Mr. B. Srikanth",
    rollNumber: "22F91F8841",
    designation: "Assistant Professor",
    department: "CSE",
    email: "srikanth.b@smartcampus.com",
    phone: "+91 92234 56841",
    specialization: ["C", "Java"]
  },
  {
    id: "k-gayathri",
    name: "Mrs. K. Gayathri",
    rollNumber: "22F91F8842",
    designation: "Assistant Professor",
    department: "CSE",
    email: "gayathri.k@smartcampus.com",
    phone: "+91 92234 56842",
    specialization: ["Databases", "Big Data", "AI"]
  },
  {
    id: "prasanna-pasunari",
    name: "Mrs. Prasanna Pasunari",
    rollNumber: "22F91F8843",
    designation: "Assistant Professor",
    department: "CSE",
    email: "prasanna.p@smartcampus.com",
    phone: "+91 92234 56843",
    specialization: ["Computer Science", "Database", "Java"]
  },
  {
    id: "d-v-v-deepthi",
    name: "Ms. D V V Deepthi",
    rollNumber: "22F91F8844",
    designation: "Assistant Professor",
    department: "CSE",
    email: "deepthi.dvv@smartcampus.com",
    phone: "+91 92234 56844",
    specialization: ["Computer Networks", "Cryptography"]
  },
  {
    id: "ponnam-kishore",
    name: "Mr. Ponnam Kishore",
    rollNumber: "22F91F8845",
    designation: "Assistant Professor",
    department: "CSE",
    email: "kishore.p@smartcampus.com",
    phone: "+91 92234 56845",
    specialization: ["Machine Learning"]
  },
  {
    id: "s-usha-devi",
    name: "Mrs. S. Usha Devi",
    rollNumber: "22F91F8846",
    designation: "Assistant Professor",
    department: "CSE",
    email: "ushadevi.s@smartcampus.com",
    phone: "+91 92234 56846",
    specialization: ["Software Engineering"]
  },
  {
    id: "anitha-kumari-cse",
    name: "Dr. D. Anitha Kumari",
    rollNumber: "22F91F6602",
    designation: "Professor",
    department: "CSE",
    email: "anitha.d@smartcampus.com",
    phone: "+91 98765 43211",
    specialization: ["Data Mining", "Machine Learning"]
  },
  // ECE Branch Faculty
  {
    id: "sreedevi",
    name: "Sreedevi",
    rollNumber: "22F91F9901",
    designation: "Assistant Professor",
    department: "ECE",
    email: "sreedevi@smartcampus.com",
    phone: "+91 93234 56901",
    specialization: ["LA&ODE"]
  },
  {
    id: "rajnijanth",
    name: "Rajnijanth",
    rollNumber: "22F91F9902",
    designation: "Assistant Professor",
    department: "ECE",
    email: "rajnijanth@smartcampus.com",
    phone: "+91 93234 56902",
    specialization: ["EP"]
  },
  {
    id: "raju",
    name: "Raju",
    rollNumber: "22F91F9903",
    designation: "Assistant Professor",
    department: "ECE",
    email: "raju@smartcampus.com",
    phone: "+91 93234 56903",
    specialization: ["FEE"]
  },
  {
    id: "pavani-ece",
    name: "Pavani",
    rollNumber: "22F91F9904",
    designation: "Assistant Professor",
    department: "ECE",
    email: "pavani@smartcampus.com",
    phone: "+91 93234 56904",
    specialization: ["CPPS Lab"]
  },
  {
    id: "b-mahesh",
    name: "B. Mahesh",
    rollNumber: "22F91F9905",
    designation: "Assistant Professor",
    department: "ECE",
    email: "mahesh.b@smartcampus.com",
    phone: "+91 93234 56905",
    specialization: ["MT"]
  },
  {
    id: "a-premalatha",
    name: "Dr. A. Premalatha",
    rollNumber: "22F91F9906",
    designation: "Associate Professor",
    department: "ECE",
    email: "premalatha.a@smartcampus.com",
    phone: "+91 93234 56906",
    specialization: ["EC"]
  },
  {
    id: "b-gnanesh-netha",
    name: "B. Gnanesh Netha",
    rollNumber: "22F91F9907",
    designation: "Assistant Professor",
    department: "ECE",
    email: "gnaneshnetha.b@smartcampus.com",
    phone: "+91 93234 56907",
    specialization: ["English"]
  },
  {
    id: "dhanunjayasingh",
    name: "Dhanunjayasingh",
    rollNumber: "22F91F9908",
    designation: "Assistant Professor",
    department: "ECE",
    email: "dhanunjayasingh@smartcampus.com",
    phone: "+91 93234 56908",
    specialization: ["CAEG"]
  },
  {
    id: "m-sai-krishna",
    name: "Mr. M. Sai Krishna",
    rollNumber: "22F91F9909",
    designation: "Assistant Professor",
    department: "ECE",
    email: "saikrishna.m@smartcampus.com",
    phone: "+91 93234 56909",
    specialization: ["DLD"]
  },
  {
    id: "k-hemanth",
    name: "Mr. K. Hemanth",
    rollNumber: "22F91F9910",
    designation: "Assistant Professor",
    department: "ECE",
    email: "hemanth.k@smartcampus.com",
    phone: "+91 93234 56910",
    specialization: ["NT"]
  },
  {
    id: "b-swapna-rani",
    name: "Dr. B. Swapna Rani",
    rollNumber: "22F91F9911",
    designation: "Associate Professor",
    department: "ECE",
    email: "swapnarani.b@smartcampus.com",
    phone: "+91 93234 56911",
    specialization: ["ECA"]
  },
  {
    id: "mahesh-ece",
    name: "Mr. Mahesh",
    rollNumber: "22F91F9912",
    designation: "Assistant Professor",
    department: "ECE",
    email: "mahesh@smartcampus.com",
    phone: "+91 93234 56912",
    specialization: ["CAVC"]
  },
  {
    id: "m-gnanesh-goud",
    name: "M. Gnanesh Goud",
    rollNumber: "22F91F9913",
    designation: "Assistant Professor",
    department: "ECE",
    email: "gnaneshgoud.m@smartcampus.com",
    phone: "+91 93234 56913",
    specialization: ["SS", "DSP"]
  },
  {
    id: "b-shreshta",
    name: "Ms. B. Shreshta",
    rollNumber: "22F91F9914",
    designation: "Assistant Professor",
    department: "ECE",
    email: "shreshta.b@smartcampus.com",
    phone: "+91 93234 56914",
    specialization: ["ADC"]
  },
  {
    id: "bhavani",
    name: "Mrs. Bhavani",
    rollNumber: "22F91F9915",
    designation: "Assistant Professor",
    department: "ECE",
    email: "bhavani@smartcampus.com",
    phone: "+91 93234 56915",
    specialization: ["PTSP"]
  },
  {
    id: "s-saritha",
    name: "Mrs. S. Saritha",
    rollNumber: "22F91F9916",
    designation: "Assistant Professor",
    department: "ECE",
    email: "saritha.s@smartcampus.com",
    phone: "+91 93234 56916",
    specialization: ["PDC"]
  },
  {
    id: "m-jhansi-rani-ece",
    name: "Mrs. M. Jhansi Rani",
    rollNumber: "22F91F9917",
    designation: "Assistant Professor",
    department: "ECE",
    email: "jhansirani.m@smartcampus.com",
    phone: "+91 93234 56917",
    specialization: ["EMTL"]
  },
  {
    id: "d-swathi",
    name: "Mrs. D. Swathi",
    rollNumber: "22F91F9918",
    designation: "Assistant Professor",
    department: "ECE",
    email: "swathi.d@smartcampus.com",
    phone: "+91 93234 56918",
    specialization: ["LDICA"]
  },
  {
    id: "p-venkata-lavanya",
    name: "Dr. P. Venkata Lavanya",
    rollNumber: "22F91F9919",
    designation: "Associate Professor",
    department: "ECE",
    email: "venkatalavanya.p@smartcampus.com",
    phone: "+91 93234 56919",
    specialization: ["MPMC", "DIP"]
  },
  {
    id: "k-sushma",
    name: "K. Sushma",
    rollNumber: "22F91F9920",
    designation: "Assistant Professor",
    department: "ECE",
    email: "sushma.k@smartcampus.com",
    phone: "+91 93234 56920",
    specialization: ["Python", "IoT"]
  },
  {
    id: "k-shalini",
    name: "K. Shalini",
    rollNumber: "22F91F9921",
    designation: "Assistant Professor",
    department: "ECE",
    email: "shalini.k@smartcampus.com",
    phone: "+91 93234 56921",
    specialization: ["AWP"]
  },
  {
    id: "ch-divya",
    name: "CH. Divya",
    rollNumber: "22F91F9922",
    designation: "Assistant Professor",
    department: "ECE",
    email: "divya.ch@smartcampus.com",
    phone: "+91 93234 56922",
    specialization: ["VLSI"]
  },
  {
    id: "j-sunitha-kumari",
    name: "Dr. J. Sunitha Kumari",
    rollNumber: "22F91F9923",
    designation: "Professor",
    department: "ECE",
    email: "sunithakumari.j@smartcampus.com",
    phone: "+91 93234 56923",
    specialization: ["MWE"]
  },
  {
    id: "r-rajendranath",
    name: "Dr. R. Rajendranath",
    rollNumber: "22F91F9924",
    designation: "Associate Professor",
    department: "ECE",
    email: "rajendranath.r@smartcampus.com",
    phone: "+91 93234 56924",
    specialization: ["PE"]
  },
  {
    id: "ch-swapna",
    name: "Ms. CH. Swapna",
    rollNumber: "22F91F9925",
    designation: "Assistant Professor",
    department: "ECE",
    email: "swapna.ch@smartcampus.com",
    phone: "+91 93234 56925",
    specialization: ["ESD", "OS"]
  },
  {
    id: "a-haritha",
    name: "Mrs. A. Haritha",
    rollNumber: "22F91F9926",
    designation: "Assistant Professor",
    department: "ECE",
    email: "haritha.a@smartcampus.com",
    phone: "+91 93234 56926",
    specialization: ["SC", "DSP&A"]
  },
  {
    id: "b-pullarao",
    name: "Mr. B. Pullarao",
    rollNumber: "22F91F9927",
    designation: "Assistant Professor",
    department: "ECE",
    email: "pullarao.b@smartcampus.com",
    phone: "+91 93234 56927",
    specialization: ["OFC"]
  },
  {
    id: "s-anusha",
    name: "Mrs. S. Anusha",
    rollNumber: "22F91F9928",
    designation: "Assistant Professor",
    department: "ECE",
    email: "anusha.s@smartcampus.com",
    phone: "+91 93234 56928",
    specialization: ["CN"]
  }
];
