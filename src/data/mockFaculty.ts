export interface Faculty {
  id: string;
  name: string;
  rollNumber: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  specialization?: string[];
  isNonTeaching?: boolean;
  is_active?: boolean;
  deleted_at?: string | null;
}

export const MOCK_FACULTY: Faculty[] = [
  {
    "id": "sunil-srinivas",
    "name": "Dr. B. Sunil Srinivas",
    "rollNumber": "22F91F6601",
    "designation": "Head of Department (HOD)",
    "department": "CSM",
    "email": "sunilsrinivas@smartcampus.com",
    "phone": "+91 98765 43210",
    "specialization": [
      "Fundamentals of Data Science (FDS)",
      "OE"
    ],
    "isNonTeaching": true
  },
  {
    "id": "anitha-kumari-d",
    "name": "Dr. D. Anitha Kumari",
    "rollNumber": "22F91F6602",
    "designation": "Professor",
    "department": "CSM",
    "email": "anithad@smartcampus.com",
    "phone": "+91 98765 43211",
    "specialization": [
      "Java",
      "Java Lab",
      "CPPS",
      "PPS",
      "PPS Lab",
      "Data Mining",
      "ML"
    ]
  },
  {
    "id": "syed-hussain",
    "name": "Dr. Syed Hussain",
    "rollNumber": "22F91F6603",
    "designation": "Associate Professor",
    "department": "CSM",
    "email": "syedhussain@smartcampus.com",
    "phone": "+91 98765 43212",
    "specialization": [
      "Conversational AI",
      "IS",
      "Conversational AI (CAI)"
    ]
  },
  {
    "id": "m-indira",
    "name": "Mrs. M. Indira",
    "rollNumber": "22F91F6604",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "indiram@smartcampus.com",
    "phone": "+91 98765 43213",
    "specialization": [
      "PP Lab",
      "OE",
      "CAO",
      "CPPS",
      "Java",
      "Python Lab",
      "Embedded Systems",
      "ESD",
      "Embedded Systems Design (ESD)",
      "Intellectual Property Rights (MC)"
    ]
  },
  {
    "id": "c-jaya-lakshmi",
    "name": "Mrs. C. Jaya Lakshmi",
    "rollNumber": "22F91F6605",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "jayalakshmi.c@smartcampus.com",
    "phone": "+91 98765 43214",
    "specialization": [
      "Machine Learning Lab",
      "Deep Learning (DL)",
      "Deep Learning Lab (DL Lab)"
    ]
  },
  {
    "id": "venugopal-reddy-k",
    "name": "Mr. K. Venugopal Reddy",
    "rollNumber": "22F91F6606",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "venugopal.k@smartcampus.com",
    "phone": "+91 98765 43215",
    "specialization": [
      "DS Lab",
      "DBMS Lab",
      "RL",
      "KRR",
      "Machine Learning",
      "Reinforcement Learning (RL)"
    ]
  },
  {
    "id": "p-vijaya-kumari",
    "name": "Mrs. P. Vijaya Kumari",
    "rollNumber": "22F91F6607",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "vijayakumari.p@smartcampus.com",
    "phone": "+91 98765 43216",
    "specialization": [
      "DBMS Lab",
      "DL",
      "DL Lab",
      "C",
      "ITWS Lab",
      "Machine Learning Lab",
      "Deep Learning Lab (DL Lab)"
    ]
  },
  {
    "id": "t-praneetha",
    "name": "Mrs. T. Praneetha",
    "rollNumber": "22F91F6608",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "praneetha.t@smartcampus.com",
    "phone": "+91 98765 43217",
    "specialization": [
      "DBMS",
      "DBMS Lab",
      "MFCS"
    ]
  },
  {
    "id": "v-pravalika",
    "name": "Mrs. V. Pravalika",
    "rollNumber": "22F91F6609",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "pravalika.v@smartcampus.com",
    "phone": "+91 98765 43218",
    "specialization": [
      "OE",
      "KRR",
      "Knowledge Representation & Reasoning",
      "ITE",
      "Information Technology Essentials",
      "Information Technology Essentials (ITE)"
    ]
  },
  {
    "id": "s-swathi",
    "name": "Mrs. S. Swathi",
    "rollNumber": "22F91F6610",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "swathi.s@smartcampus.com",
    "phone": "+91 98765 43219",
    "specialization": [
      "PP Lab",
      "OE",
      "CN",
      "Embedded Systems Design (ESD)",
      "Intellectual Property Rights (MC)"
    ]
  },
  {
    "id": "ishwarya-devi-k",
    "name": "Mrs. K. Ishwarya Devi",
    "rollNumber": "22F91F6611",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "ishwarya.k@smartcampus.com",
    "phone": "+91 98765 43220",
    "specialization": [
      "OS",
      "Operating Systems",
      "Skill Development",
      "DevOps Lab",
      "Constitution of India",
      "Web Technologies (WT)",
      "Web Technologies Lab (WT Lab)"
    ]
  },
  {
    "id": "n-kiran-kumar",
    "name": "Mr. N. Kiran Kumar",
    "rollNumber": "22F91F6612",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "kirankumar.n@smartcampus.com",
    "phone": "+91 98765 43221",
    "specialization": [
      "DAA",
      "RPA",
      "DL Lab",
      "RL",
      "CAO",
      "Design and Analysis of Algorithms (DAA)",
      "Object Oriented Programming through Java Lab (OOPS Lab)",
      "Robotic Process Automation (RPA)"
    ]
  },
  {
    "id": "e-radhika",
    "name": "Mrs. E. Radhika",
    "rollNumber": "22F91F6613",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "radhika.e@smartcampus.com",
    "phone": "+91 98765 43222",
    "specialization": [
      "SE",
      "WT Lab",
      "IS",
      "Java",
      "CPPS",
      "Software Engineering (SE)",
      "Web Technologies Lab (WT Lab)"
    ]
  },
  {
    "id": "shilpa-ch-csm",
    "name": "Mrs. Ch. Shilpa",
    "rollNumber": "22F91F6614",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "shilpa.ch@smartcampus.com",
    "phone": "+91 98765 43223",
    "specialization": [
      "SE",
      "WT Lab",
      "CAO",
      "Software Engineering (SE)",
      "Web Technologies Lab (WT Lab)"
    ]
  },
  {
    "id": "d-mounika",
    "name": "Mrs. D. Mounika",
    "rollNumber": "22F91F6615",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "mounika.d@smartcampus.com",
    "phone": "+91 98765 43224",
    "specialization": [
      "Java",
      "Java Lab",
      "PP Lab",
      "CPPS",
      "PP",
      "Python Lab",
      "Object Oriented Programming through Java (OOPS)",
      "Object Oriented Programming through Java Lab (OOPS Lab)"
    ]
  },
  {
    "id": "d-uma-maheshwari",
    "name": "Mrs. D. Uma Maheshwari",
    "rollNumber": "22F91F6616",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "umamaheshwari.d@smartcampus.com",
    "phone": "+91 98765 43225",
    "specialization": [
      "Conversational AI",
      "NLP Lab",
      "QC",
      "ATCD",
      "OS",
      "Operating Systems",
      "Skill Development",
      "DevOps Lab",
      "Conversational AI (CAI)",
      "Natural Language Processing Lab (NLP Lab)"
    ]
  },
  {
    "id": "p-rajini",
    "name": "Mrs. P. Rajini",
    "rollNumber": "22F91F6617",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "rajini.p@smartcampus.com",
    "phone": "+91 98765 43226",
    "specialization": [
      "Java Lab",
      "QC",
      "BDA",
      "BDA Lab",
      "Quantum Computing (QC)"
    ]
  },
  {
    "id": "geethanjali-p",
    "name": "Mrs. P. Geethanjali",
    "rollNumber": "22F91F6618",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "geethanjali.p@smartcampus.com",
    "phone": "+91 98765 43227",
    "specialization": [
      "DBMS",
      "DBMS Lab",
      "OOAD",
      "Constitution of India",
      "Database Management Systems (DBMS)",
      "Database Management Systems Lab (DBMS Lab)",
      "Environmental Science (ES)"
    ]
  },
  {
    "id": "m-suryakumari",
    "name": "Mrs. M. Suryakumari",
    "rollNumber": "22F91F6619",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "suryakumari.m@smartcampus.com",
    "phone": "+91 98765 43228",
    "specialization": [
      "DS",
      "DS Lab",
      "CPPS",
      "ITWS LAB",
      "PPS",
      "PPS Lab"
    ]
  },
  {
    "id": "c-saritha-reddy",
    "name": "Mrs. C. Saritha Reddy",
    "rollNumber": "22F91F6620",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "sarithareddy.c@smartcampus.com",
    "phone": "+91 98765 43229",
    "specialization": [
      "Java Lab",
      "NLP",
      "AI",
      "Machine Learning Lab",
      "NLP Lab",
      "Natural Language Processing (NLP)",
      "Natural Language Processing Lab (NLP Lab)"
    ]
  },
  {
    "id": "gnaneshwari-s",
    "name": "Mrs. S. Gnaneshwari",
    "rollNumber": "22F91F6621",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "gnaneshwari.s@smartcampus.com",
    "phone": "+91 98765 43230",
    "specialization": [
      "DAA",
      "DBMS Lab",
      "PP Lab",
      "PP",
      "Python Lab",
      "Design and Analysis of Algorithms (DAA)"
    ]
  },
  {
    "id": "b-vijitha",
    "name": "Mrs. B. Vijitha",
    "rollNumber": "22F91F6622",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "vijitha.b@smartcampus.com",
    "phone": "+91 98765 43231",
    "specialization": [
      "Java Lab",
      "DL",
      "DL Lab",
      "ATCD",
      "Skill Development",
      "DevOps Lab",
      "Constitution of India",
      "Deep Learning",
      "Deep Learning Lab",
      "Deep Learning (DL)",
      "Intellectual Property Rights (MC)",
      "Deep Learning Lab (DL Lab)"
    ]
  },
  {
    "id": "srinivasa-reddy",
    "name": "Mr. Ande Srinivasa Reddy",
    "rollNumber": "22F91F6623",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "srinivasa.reddy@smartcampus.com",
    "phone": "+91 98765 43232",
    "specialization": [
      "RPA",
      "NLP Lab",
      "DEVOPS",
      "DevOps Lab",
      "Robotic Process Automation (RPA)",
      "Natural Language Processing Lab (NLP Lab)"
    ]
  },
  {
    "id": "r-naga-raju",
    "name": "Mr. R. Naga Raju",
    "rollNumber": "22F91F6624",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "nagaraju.r@smartcampus.com",
    "phone": "+91 98765 43233",
    "specialization": [
      "Java",
      "Java Lab",
      "CN",
      "Computer Networks",
      "FEE",
      "BEE",
      "Object Oriented Programming through Java (OOPS)",
      "Object Oriented Programming through Java Lab (OOPS Lab)",
      "Environmental Science (ES)"
    ]
  },
  {
    "id": "srujana-reddy-aynala",
    "name": "Mrs. Srujana Reddy Aynala",
    "rollNumber": "22F91F6625",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "srujana.reddy@smartcampus.com",
    "phone": "+91 98765 43234",
    "specialization": [
      "WT",
      "WT Lab",
      "MFCS"
    ]
  },
  {
    "id": "jhansi-rani",
    "name": "Mrs. Jhansi Rani",
    "rollNumber": "22F91F6626",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "jhansirani@smartcampus.com",
    "phone": "+91 98765 43235",
    "specialization": [
      "DS",
      "DS Lab",
      "PP Lab",
      "CPPS",
      "PPS Lab",
      "Engineering Workshop",
      "ITWS"
    ]
  },
  {
    "id": "varsha",
    "name": "Varsha",
    "rollNumber": "22F91F6627",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "varsha@smartcampus.com",
    "phone": "+91 98765 43236",
    "specialization": [
      "DS",
      "DS Lab"
    ]
  },
  {
    "id": "shanti",
    "name": "Shanti",
    "rollNumber": "22F91F6629",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "shanti@smartcampus.com",
    "phone": "+91 98765 43238",
    "specialization": [
      "OOPS",
      "Python Programming",
      "Java",
      "CPPS",
      "Object Oriented Programming through Java (OOPS)",
      "Environmental Science (ES)",
      "Object Oriented Programming through Java Lab (OOPS Lab)"
    ]
  },
  {
    "id": "mallayya",
    "name": "Mallayya",
    "rollNumber": "22F91F6630",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "mallayya@smartcampus.com",
    "phone": "+91 98765 43239",
    "specialization": [
      "DAA",
      "Machine Learning",
      "Java",
      "Python Programming"
    ]
  },
  {
    "id": "anitha-chowdary",
    "name": "Anitha Chowdary",
    "rollNumber": "22F91F6631",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "anitha.chowdary@smartcampus.com",
    "phone": "+91 98765 43240",
    "specialization": [
      "PP Lab"
    ]
  },
  {
    "id": "manga-rao",
    "name": "Manga Rao",
    "rollNumber": "22F91F6632",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "mangarao@smartcampus.com",
    "phone": "+91 98765 43241",
    "specialization": [
      "PP Lab",
      "DS"
    ]
  },
  {
    "id": "g-shivaleela",
    "name": "Mrs. G. Shivaleela",
    "rollNumber": "22F91F6634",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "shivaleela.g@smartcampus.com",
    "phone": "+91 98765 43243",
    "specialization": [
      "MFCS"
    ]
  },
  {
    "id": "p-madhavi",
    "name": "Dr. P. Madhavi",
    "rollNumber": "22F91F0001",
    "designation": "Professor",
    "department": "Mathematics",
    "email": "madhavi.p@smartcampus.com",
    "phone": "+91 98765 43243",
    "specialization": [
      "SM&VC",
      "P&S",
      "Management",
      "FOM",
      "Disaster Management",
      "Statistical Methods and Vector Calculus",
      "LA&ODE"
    ]
  },
  {
    "id": "sudha-menon",
    "name": "Sudha Menon",
    "rollNumber": "22F91F6643",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "sudharani.csm@smartcampus.com",
    "phone": "+91 98765 43288",
    "specialization": [
      "ELCS Lab",
      "PES Lab"
    ]
  },
  {
    "id": "shankar",
    "name": "G.Shankar",
    "rollNumber": "22F91F6644",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "shankar.csm@smartcampus.com",
    "phone": "+91 98765 43299",
    "specialization": [
      "LA&ODE",
      "P&S"
    ]
  },
  {
    "id": "nallamothu-satyanarayana",
    "name": "Dr. Nallamothu Satyanarayana",
    "rollNumber": "22F91F7701",
    "designation": "Head of Department (HOD)",
    "department": "IT",
    "email": "satyanarayana.n@smartcampus.com",
    "phone": "+91 91234 56701",
    "specialization": [
      "Computer Architecture",
      "Wireless Sensor Networks",
      "Data Mining"
    ],
    "isNonTeaching": true
  },
  {
    "id": "muruganantham-r",
    "name": "Dr. R. Muruganantham",
    "rollNumber": "22F91F7702",
    "designation": "Professor",
    "department": "IT",
    "email": "muruganantham.r@smartcampus.com",
    "phone": "+91 91234 56702",
    "specialization": [
      "Internet of Things",
      "Machine Learning",
      "Wireless Sensor Networks",
      "Cryptography",
      "Computer Networks"
    ]
  },
  {
    "id": "dhasaratham-m",
    "name": "Dr. M. Dhasaratham",
    "rollNumber": "22F91F7703",
    "designation": "Associate Professor",
    "department": "IT",
    "email": "dhasaratham.m@smartcampus.com",
    "phone": "+91 91234 56703",
    "specialization": [
      "Cloud Computing",
      "ML",
      "IoT",
      "NET"
    ]
  },
  {
    "id": "kavitha-d",
    "name": "D. Kavitha",
    "rollNumber": "22F91F7704",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "kavitha.d@smartcampus.com",
    "phone": "+91 91234 56704",
    "specialization": [
      "AI",
      "ML"
    ]
  },
  {
    "id": "thakur-madhumathi",
    "name": "Thakur Madhumathi",
    "rollNumber": "22F91F7705",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "madhumathi.t@smartcampus.com",
    "phone": "+91 91234 56705",
    "specialization": [
      "AI"
    ]
  },
  {
    "id": "mandalreddy-sushma",
    "name": "Mandalreddy Sushma",
    "rollNumber": "22F91F7706",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "sushma.m@smartcampus.com",
    "phone": "+91 91234 56706",
    "specialization": [
      "Data Science"
    ]
  },
  {
    "id": "n-paparayudu",
    "name": "N. Paparayudu",
    "rollNumber": "22F91F7707",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "paparayudu.n@smartcampus.com",
    "phone": "+91 91234 56707",
    "specialization": [
      "Data Mining",
      "ML"
    ]
  },
  {
    "id": "jarapala-ramesh",
    "name": "Jarapala Ramesh",
    "rollNumber": "22F91F7708",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "ramesh.j@smartcampus.com",
    "phone": "+91 91234 56708",
    "specialization": [
      "Quantum Computing",
      "Blockchain Technology"
    ]
  },
  {
    "id": "y-naga-lavanya",
    "name": "Y. Naga Lavanya",
    "rollNumber": "22F91F7709",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "nagalavanya.y@smartcampus.com",
    "phone": "+91 91234 56709",
    "specialization": [
      "DS",
      "AI",
      "DL"
    ]
  },
  {
    "id": "meka-aruna",
    "name": "Meka Aruna",
    "rollNumber": "22F91F7710",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "meka.aruna@smartcampus.com",
    "phone": "+91 91234 56710",
    "specialization": [
      "Deep Learning"
    ]
  },
  {
    "id": "mounika-nakrekanti",
    "name": "Mounika Nakrekanti",
    "rollNumber": "22F91F7711",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "mounika.n@smartcampus.com",
    "phone": "+91 91234 56711",
    "specialization": [
      "DAA",
      "Python"
    ]
  },
  {
    "id": "v-murugan",
    "name": "V. Murugan",
    "rollNumber": "22F91F7712",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "v.murugan@smartcampus.com",
    "phone": "+91 91234 56712",
    "specialization": [
      "CS",
      "ML",
      "Cloud Computing"
    ]
  },
  {
    "id": "yacharam-uma",
    "name": "Yacharam Uma",
    "rollNumber": "22F91F7713",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "yacharam.uma@smartcampus.com",
    "phone": "+91 91234 56713",
    "specialization": [
      "AI"
    ]
  },
  {
    "id": "p-himabindu",
    "name": "P. Himabindu",
    "rollNumber": "22F91F7714",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "p.himabindu@smartcampus.com",
    "phone": "+91 91234 56714",
    "specialization": [
      "SE"
    ]
  },
  {
    "id": "g-bharath",
    "name": "G. Bharath",
    "rollNumber": "22F91F7715",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "g.bharath@smartcampus.com",
    "phone": "+91 91234 56715",
    "specialization": [
      "IS",
      "ML"
    ]
  },
  {
    "id": "p-swathi",
    "name": "P. Swathi",
    "rollNumber": "22F91F7716",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "p.swathi@smartcampus.com",
    "phone": "+91 91234 56716",
    "specialization": [
      "OS",
      "CNS"
    ]
  },
  {
    "id": "n-anjali",
    "name": "N. Anjali",
    "rollNumber": "22F91F7717",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "n.anjali@smartcampus.com",
    "phone": "+91 91234 56717",
    "specialization": [
      "DBMS"
    ]
  },
  {
    "id": "b-rajani",
    "name": "B. Rajani",
    "rollNumber": "22F91F7718",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "b.rajani@smartcampus.com",
    "phone": "+91 91234 56718",
    "specialization": [
      "CS",
      "ML"
    ]
  },
  {
    "id": "mrs-b-madhavi",
    "name": "Mrs. B. Madhavi",
    "rollNumber": "22F91F7719",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "b.madhavi@smartcampus.com",
    "phone": "+91 91234 56719",
    "specialization": [
      "PP Lab"
    ]
  },
  {
    "id": "mr-s-pradeep",
    "name": "Mr. S. Pradeep",
    "rollNumber": "22F91F7720",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "s.pradep@smartcampus.com",
    "phone": "+91 91234 56720",
    "specialization": [
      "PP Lab"
    ]
  },
  {
    "id": "b-upender",
    "name": "B. Upender",
    "rollNumber": "22F91F7721",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "b.upender@smartcampus.com",
    "phone": "+91 91234 56721",
    "specialization": [
      "DS",
      "AI"
    ]
  },
  {
    "id": "a-suresh-rao",
    "name": "Dr. A. Suresh Rao",
    "rollNumber": "22F91F8801",
    "designation": "Head of Department (HOD)",
    "department": "CSE",
    "email": "sureshrao.a@smartcampus.com",
    "phone": "+91 92234 56801",
    "specialization": [
      "Data Mining",
      "ML"
    ],
    "isNonTeaching": true
  },
  {
    "id": "m-narender",
    "name": "Dr. M. Narender",
    "rollNumber": "22F91F8802",
    "designation": "Professor",
    "department": "CSE",
    "email": "narender.m@smartcampus.com",
    "phone": "+91 92234 56802",
    "specialization": [
      "CN",
      "NS",
      "ML",
      "DL"
    ]
  },
  {
    "id": "vempati-krishna",
    "name": "Dr. Vempati Krishna",
    "rollNumber": "22F91F8803",
    "designation": "Professor",
    "department": "CSE",
    "email": "krishna.v@smartcampus.com",
    "phone": "+91 92234 56803",
    "specialization": [
      "IP",
      "ML",
      "DL",
      "CV"
    ]
  },
  {
    "id": "ch-b-naga-lakshmi",
    "name": "Dr. Ch. B. Naga Lakshmi",
    "rollNumber": "22F91F8804",
    "designation": "Professor",
    "department": "CSE",
    "email": "nagalakshmi.ch@smartcampus.com",
    "phone": "+91 92234 56804",
    "specialization": [
      "CNS"
    ]
  },
  {
    "id": "rajesh-banala",
    "name": "Dr. Rajesh Banala",
    "rollNumber": "22F91F8807",
    "designation": "Associate Professor",
    "department": "CSE",
    "email": "rajesh.b@smartcampus.com",
    "phone": "+91 92234 56807",
    "specialization": [
      "Networks",
      "AI",
      "BDA"
    ]
  },
  {
    "id": "a-pramod-reddy",
    "name": "Dr. A. Pramod Reddy",
    "rollNumber": "22F91F8808",
    "designation": "Associate Professor",
    "department": "CSE",
    "email": "pramod.a@smartcampus.com",
    "phone": "+91 92234 56808",
    "specialization": [
      "SP",
      "ML"
    ]
  },
  {
    "id": "nelli-chandrakala",
    "name": "Dr. Nelli Chandrakala",
    "rollNumber": "22F91F8809",
    "designation": "Associate Professor",
    "department": "CSE",
    "email": "chandrakala.n@smartcampus.com",
    "phone": "+91 92234 56809",
    "specialization": [
      "Cloud Computing"
    ]
  },
  {
    "id": "kuna-naresh",
    "name": "Dr. Kuna Naresh",
    "rollNumber": "22F91F8810",
    "designation": "Associate Professor",
    "department": "CSE",
    "email": "naresh.k@smartcampus.com",
    "phone": "+91 92234 56810",
    "specialization": [
      "SE"
    ]
  },
  {
    "id": "sirisha-k-l-s",
    "name": "Dr. Sirisha K L S",
    "rollNumber": "22F91F8811",
    "designation": "Associate Professor",
    "department": "CSE",
    "email": "sirisha.k@smartcampus.com",
    "phone": "+91 92234 56811",
    "specialization": [
      "SE"
    ]
  },
  {
    "id": "shirish-reddy-k",
    "name": "Mrs. K. Shirish Reddy",
    "rollNumber": "22F91F8812",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "shirish.k@smartcampus.com",
    "phone": "+91 92234 56812",
    "specialization": [
      "Networking"
    ]
  },
  {
    "id": "indra-kiran-reddy-k",
    "name": "Mr. K. Indra Kiran Reddy",
    "rollNumber": "22F91F8813",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "indrakiran.k@smartcampus.com",
    "phone": "+91 92234 56813",
    "specialization": [
      "IT Workshop"
    ]
  },
  {
    "id": "g-deepthi",
    "name": "Mrs. G. Deepthi",
    "rollNumber": "22F91F8814",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "deepthi.g@smartcampus.com",
    "phone": "+91 92234 56814",
    "specialization": [
      "CO",
      "DAA",
      "FLAT"
    ]
  },
  {
    "id": "p-chandra-shekar",
    "name": "P. Chandra Shekar",
    "rollNumber": "22F91F8815",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "chandrashekar.p@smartcampus.com",
    "phone": "+91 92234 56815",
    "specialization": [
      "Apps Dev"
    ]
  },
  {
    "id": "y-latha",
    "name": "Mrs. Y. Latha",
    "rollNumber": "22F91F8816",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "latha.y@smartcampus.com",
    "phone": "+91 92234 56816",
    "specialization": [
      "Data Mining",
      "ML",
      "BDA",
      "BDA Lab"
    ]
  },
  {
    "id": "m-thanmayee",
    "name": "Mrs. M. Thanmayee",
    "rollNumber": "22F91F8817",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "thanmayee.m@smartcampus.com",
    "phone": "+91 92234 56817",
    "specialization": [
      "IOT",
      "AI"
    ]
  },
  {
    "id": "pragathi-vulpala",
    "name": "Mrs. Pragathi Vulpala",
    "rollNumber": "22F91F8818",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "pragathi.v@smartcampus.com",
    "phone": "+91 92234 56818",
    "specialization": [
      "Networks"
    ]
  },
  {
    "id": "p-laxmi-prasanna",
    "name": "Mrs. P. Laxmi Prasanna",
    "rollNumber": "22F91F8819",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "laxmiprasanna.p@smartcampus.com",
    "phone": "+91 92234 56819",
    "specialization": [
      "Machine Learning"
    ]
  },
  {
    "id": "n-padmavathi",
    "name": "Mrs. N. Padmavathi",
    "rollNumber": "22F91F8820",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "padmavathi.n@smartcampus.com",
    "phone": "+91 92234 56820",
    "specialization": [
      "Machine Learning",
      "Application Development"
    ]
  },
  {
    "id": "g-arpitha",
    "name": "Mrs. G. Arpitha",
    "rollNumber": "22F91F8821",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "arpitha.g@smartcampus.com",
    "phone": "+91 92234 56821",
    "specialization": [
      "Data Mining",
      "BDA",
      "BDA Lab"
    ]
  },
  {
    "id": "g-anantha-lakshmi",
    "name": "Mrs. G. Anantha Lakshmi",
    "rollNumber": "22F91F8822",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "ananthalakshmi.g@smartcampus.com",
    "phone": "+91 92234 56822",
    "specialization": [
      "Machine Learning",
      "Deep Learning"
    ]
  },
  {
    "id": "k-anusha",
    "name": "Mrs. K. Anusha",
    "rollNumber": "22F91F8823",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "anusha.k@smartcampus.com",
    "phone": "+91 92234 56823",
    "specialization": [
      "AI",
      "ML"
    ]
  },
  {
    "id": "a-pradeep-cse",
    "name": "A. Pradeep",
    "rollNumber": "22F91F8824",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "pradeep.a@smartcampus.com",
    "phone": "+91 92234 56824",
    "specialization": [
      "C",
      "IoT",
      "Web Application",
      "Networks",
      "CPPS Lab"
    ]
  },
  {
    "id": "m-vijaya-kumari",
    "name": "Mrs. M. Vijaya Kumari",
    "rollNumber": "22F91F8826",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "vijayakumari.m@smartcampus.com",
    "phone": "+91 92234 56826",
    "specialization": [
      "ML",
      "ACV",
      "DL"
    ]
  },
  {
    "id": "l-gnanender-reddy",
    "name": "Mr. L. Gnanender Reddy",
    "rollNumber": "22F91F8827",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "gnanender.l@smartcampus.com",
    "phone": "+91 92234 56827",
    "specialization": [
      "AI"
    ]
  },
  {
    "id": "v-pavani",
    "name": "Mrs. V. Pavani",
    "rollNumber": "22F91F8828",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "pavani.v@smartcampus.com",
    "phone": "+91 92234 56828",
    "specialization": [
      "AI",
      "CPPS Lab",
      "Applied Physics",
      "BEE",
      "Engineering Drawing",
      "EDCAD"
    ]
  },
  {
    "id": "thirumani-anusha",
    "name": "Mrs. Thirumani Anusha",
    "rollNumber": "22F91F8829",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "anusha.t@smartcampus.com",
    "phone": "+91 92234 56829",
    "specialization": [
      "PP Lab",
      "ML",
      "DL Lab",
      "CPPS Lab"
    ]
  },
  {
    "id": "p-rajyalakshmi",
    "name": "Mrs. P. Rajyalakshmi",
    "rollNumber": "22F91F8830",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "rajyalakshmi.p@smartcampus.com",
    "phone": "+91 92234 56830",
    "specialization": [
      "Data Mining",
      "CPPS",
      "CPPS Lab",
      "ITWS Lab"
    ]
  },
  {
    "id": "a-tejaswini",
    "name": "Mrs. A. Tejaswini",
    "rollNumber": "22F91F8831",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "tejaswini.a@smartcampus.com",
    "phone": "+91 92234 56831",
    "specialization": [
      "DB",
      "ML",
      "Data Mining"
    ]
  },
  {
    "id": "g-jyothi",
    "name": "Mrs. G. Jyothi",
    "rollNumber": "22F91F8832",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "jyothi.g@smartcampus.com",
    "phone": "+91 92234 56832",
    "specialization": [
      "Machine Learning",
      "Deep Learning"
    ]
  },
  {
    "id": "ch-tulasi-ratna-mani",
    "name": "Mrs. Ch. Tulasi Ratna Mani",
    "rollNumber": "22F91F8833",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "tulasiratnamani.ch@smartcampus.com",
    "phone": "+91 92234 56833",
    "specialization": [
      "CNS"
    ]
  },
  {
    "id": "sk-mahaboob-basha",
    "name": "Mr. Sk Mahaboob Basha",
    "rollNumber": "22F91F8834",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "mahaboobbasha.sk@smartcampus.com",
    "phone": "+91 92234 56834",
    "specialization": [
      "CNS",
      "BDA",
      "BDA Lab"
    ]
  },
  {
    "id": "k-naga-maha-lakshmi",
    "name": "Mrs. K. Naga Maha Lakshmi",
    "rollNumber": "22F91F8835",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "nagamahalakshmi.k@smartcampus.com",
    "phone": "+91 92234 56835",
    "specialization": [
      "NS",
      "IP",
      "BDA"
    ]
  },
  {
    "id": "b-naga-jyothi",
    "name": "Mrs. B. Naga Jyothi",
    "rollNumber": "22F91F8836",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "nagajyothi.b@smartcampus.com",
    "phone": "+91 92234 56836",
    "specialization": [
      "Machine Learning"
    ]
  },
  {
    "id": "m-jyothi",
    "name": "Mrs. M. Jyothi",
    "rollNumber": "22F91F8837",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "jyothi.m@smartcampus.com",
    "phone": "+91 92234 56837",
    "specialization": [
      "DB",
      "ML"
    ]
  },
  {
    "id": "vangala-konica-nehal",
    "name": "Ms. Vangala Konica Nehal",
    "rollNumber": "22F91F8838",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "konicanehal.v@smartcampus.com",
    "phone": "+91 92234 56838",
    "specialization": [
      "Machine Learning",
      "AI"
    ]
  },
  {
    "id": "polepaka-prashamsa",
    "name": "Mrs. Polepaka Prashamsa",
    "rollNumber": "22F91F8839",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "prashamsa.p@smartcampus.com",
    "phone": "+91 92234 56839",
    "specialization": [
      "AI",
      "Machine Learning"
    ]
  },
  {
    "id": "p-venkata-kishan-rao",
    "name": "Ms. P. Venkata Kishan Rao",
    "rollNumber": "22F91F8840",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "venkatakishanrao.p@smartcampus.com",
    "phone": "+91 92234 56840",
    "specialization": [
      "DB",
      "Data Mining",
      "BDA",
      "BDA Lab"
    ]
  },
  {
    "id": "b-srikanth",
    "name": "Mr. B. Srikanth",
    "rollNumber": "22F91F8841",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "srikanth.b@smartcampus.com",
    "phone": "+91 92234 56841",
    "specialization": [
      "C",
      "Java",
      "DS"
    ]
  },
  {
    "id": "k-gayathri",
    "name": "Mrs. K. Gayathri",
    "rollNumber": "22F91F8842",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "gayathri.k@smartcampus.com",
    "phone": "+91 92234 56842",
    "specialization": [
      "DB",
      "BD",
      "AI"
    ]
  },
  {
    "id": "prasanna-pasunari",
    "name": "Mrs. Prasanna Pasunari",
    "rollNumber": "22F91F8843",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "prasanna.p@smartcampus.com",
    "phone": "+91 92234 56843",
    "specialization": [
      "CS",
      "DB",
      "Java"
    ]
  },
  {
    "id": "d-v-v-deepthi",
    "name": "Ms. D V V Deepthi",
    "rollNumber": "22F91F8844",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "deepthi.dvv@smartcampus.com",
    "phone": "+91 92234 56844",
    "specialization": [
      "Computer Networks",
      "Cryptography"
    ]
  },
  {
    "id": "ponnam-kishore",
    "name": "Mr. Ponnam Kishore",
    "rollNumber": "22F91F8845",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "kishore.p@smartcampus.com",
    "phone": "+91 92234 56845",
    "specialization": [
      "Machine Learning",
      "Data Warehousing & Mining"
    ]
  },
  {
    "id": "s-usha-devi",
    "name": "Mrs. S. Usha Devi",
    "rollNumber": "22F91F8846",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "ushadevi.s@smartcampus.com",
    "phone": "+91 92234 56846",
    "specialization": [
      "SE",
      "DBMS",
      "Java",
      "CPPS",
      "BEE",
      "EP"
    ]
  },
  {
    "id": "sreedevi",
    "name": "Sreedevi",
    "rollNumber": "22F91F9901",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "sreedevi@smartcampus.com",
    "phone": "+91 93234 56901",
    "specialization": [
      "LA&ODE",
      "Math",
      "P&S"
    ]
  },
  {
    "id": "rajnijanth",
    "name": "Rajnijanth",
    "rollNumber": "22F91F9902",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "rajnijanth@smartcampus.com",
    "phone": "+91 93234 56902",
    "specialization": [
      "EP",
      "Applied Physics",
      "Physics",
      "Advanced Engineering Physics",
      "Engineering Physics Lab"
    ]
  },
  {
    "id": "b-mahesh",
    "name": "B. Mahesh",
    "rollNumber": "22F91F9905",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "mahesh.b@smartcampus.com",
    "phone": "+91 93234 56905",
    "specialization": [
      "MT",
      "Math",
      "Matrices",
      "Calculus",
      "LA&ODE",
      "P&S"
    ]
  },
  {
    "id": "a-premalatha",
    "name": "Dr. A. Premalatha",
    "rollNumber": "22F91F9906",
    "designation": "Associate Professor",
    "department": "ECE",
    "email": "premalatha.a@smartcampus.com",
    "phone": "+91 93234 56906",
    "specialization": [
      "EC",
      "Chemistry"
    ]
  },
  {
    "id": "b-gnanesh-netha",
    "name": "B. Gnanesh Netha",
    "rollNumber": "22F91F9907",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "gnaneshnetha.b@smartcampus.com",
    "phone": "+91 93234 56907",
    "specialization": [
      "English",
      "ELCS Lab"
    ]
  },
  {
    "id": "dhanunjayasingh",
    "name": "Dhanunjayasingh",
    "rollNumber": "22F91F9908",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "dhanunjayasingh@smartcampus.com",
    "phone": "+91 93234 56908",
    "specialization": [
      "CAEG",
      "Disaster Management",
      "DM"
    ]
  },
  {
    "id": "m-sai-krishna",
    "name": "Mr. M. Sai Krishna",
    "rollNumber": "22F91F9909",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "saikrishna.m@smartcampus.com",
    "phone": "+91 93234 56909",
    "specialization": [
      "DLD",
      "CAO"
    ]
  },
  {
    "id": "k-hemanth",
    "name": "Mr. K. Hemanth",
    "rollNumber": "22F91F9910",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "hemanth.k@smartcampus.com",
    "phone": "+91 93234 56910",
    "specialization": [
      "NT",
      "ECA"
    ]
  },
  {
    "id": "b-swapna-rani",
    "name": "Dr. B. Swapna Rani",
    "rollNumber": "22F91F9911",
    "designation": "Associate Professor",
    "department": "ECE",
    "email": "swapnarani.b@smartcampus.com",
    "phone": "+91 93234 56911",
    "specialization": [
      "ECA",
      "DLD"
    ]
  },
  {
    "id": "mahesh-ece",
    "name": "Dr. M. Mahesh",
    "rollNumber": "22F91F9912",
    "designation": "Head of Department (HOD)",
    "department": "ECE",
    "email": "mahesh@smartcampus.com",
    "phone": "+91 93234 56912",
    "specialization": [
      "CAVC"
    ],
    "isNonTeaching": true
  },
  {
    "id": "m-gnanesh-goud",
    "name": "M. Gnanesh Goud",
    "rollNumber": "22F91F9913",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "gnaneshgoud.m@smartcampus.com",
    "phone": "+91 93234 56913",
    "specialization": [
      "SS",
      "DSP"
    ]
  },
  {
    "id": "b-shreshta",
    "name": "Ms. B. Shreshta",
    "rollNumber": "22F91F9914",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "shreshta.b@smartcampus.com",
    "phone": "+91 93234 56914",
    "specialization": [
      "ADC",
      "Communications"
    ]
  },
  {
    "id": "bhavani",
    "name": "Mrs. Bhavani",
    "rollNumber": "22F91F9915",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "bhavani@smartcampus.com",
    "phone": "+91 93234 56915",
    "specialization": [
      "PTSP",
      "P&S"
    ]
  },
  {
    "id": "s-saritha",
    "name": "Mrs. S. Saritha",
    "rollNumber": "22F91F9916",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "saritha.s@smartcampus.com",
    "phone": "+91 93234 56916",
    "specialization": [
      "PDC",
      "DLD",
      "Electronic Devices",
      "BEE"
    ]
  },
  {
    "id": "m-jhansi-rani-ece",
    "name": "Mrs. M. Jhansi Rani",
    "rollNumber": "22F91F9917",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "jhansirani.m@smartcampus.com",
    "phone": "+91 93234 56917",
    "specialization": [
      "EMTL",
      "NT"
    ]
  },
  {
    "id": "d-swathi",
    "name": "Mrs. D. Swathi",
    "rollNumber": "22F91F9918",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "swathi.d@smartcampus.com",
    "phone": "+91 93234 56918",
    "specialization": [
      "LDICA",
      "Electronic Devices & Circuits",
      "BEE",
      "Electronic Devices"
    ]
  },
  {
    "id": "p-venkata-lavanya",
    "name": "Dr. P. Venkata Lavanya",
    "rollNumber": "22F91F9919",
    "designation": "Associate Professor",
    "department": "ECE",
    "email": "venkatalavanya.p@smartcampus.com",
    "phone": "+91 93234 56919",
    "specialization": [
      "MPMC",
      "DIP"
    ]
  },
  {
    "id": "k-sushma",
    "name": "K. Sushma",
    "rollNumber": "22F91F9920",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "sushma.k@smartcampus.com",
    "phone": "+91 93234 56920",
    "specialization": [
      "PP Lab",
      "IOT"
    ]
  },
  {
    "id": "k-shalini",
    "name": "K. Shalini",
    "rollNumber": "22F91F9921",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "shalini.k@smartcampus.com",
    "phone": "+91 93234 56921",
    "specialization": [
      "AWP",
      "NT",
      "Electronic Devices",
      "BEE"
    ]
  },
  {
    "id": "ch-divya",
    "name": "CH. Divya",
    "rollNumber": "22F91F9922",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "divya.ch@smartcampus.com",
    "phone": "+91 93234 56922",
    "specialization": [
      "VLSI",
      "DLD"
    ]
  },
  {
    "id": "j-sunitha-kumari",
    "name": "Dr. J. Sunitha Kumari",
    "rollNumber": "22F91F9923",
    "designation": "Professor",
    "department": "ECE",
    "email": "sunithakumari.j@smartcampus.com",
    "phone": "+91 93234 56923",
    "specialization": [
      "MWE",
      "Internet of Things",
      "Electronic Devices"
    ]
  },
  {
    "id": "r-rajendranath",
    "name": "Dr. R. Rajendranath",
    "rollNumber": "22F91F9924",
    "designation": "Associate Professor",
    "department": "ECE",
    "email": "rajendranath.r@smartcampus.com",
    "phone": "+91 93234 56924",
    "specialization": [
      "PE",
      "IPR",
      "Fundamentals of Management (FOM)"
    ]
  },
  {
    "id": "ch-swapna",
    "name": "Ms. CH. Swapna",
    "rollNumber": "22F91F9925",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "swapna.ch@smartcampus.com",
    "phone": "+91 93234 56925",
    "specialization": [
      "ESD",
      "OS"
    ]
  },
  {
    "id": "a-haritha",
    "name": "Mrs. A. Haritha",
    "rollNumber": "22F91F9926",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "haritha.a@smartcampus.com",
    "phone": "+91 93234 56926",
    "specialization": [
      "SC",
      "DSP&A"
    ]
  },
  {
    "id": "b-pullarao",
    "name": "Mr. B. Pullarao",
    "rollNumber": "22F91F9927",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "pullarao.b@smartcampus.com",
    "phone": "+91 93234 56927",
    "specialization": [
      "OFC",
      "Computer Networks",
      "Electronic Devices",
      "AP",
      "CP"
    ]
  },
  {
    "id": "s-anusha",
    "name": "Mrs. S. Anusha",
    "rollNumber": "22F91F9928",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "anusha.s@smartcampus.com",
    "phone": "+91 93234 56928",
    "specialization": [
      "CNS"
    ]
  },
  {
    "id": "jagruthi-ece",
    "name": "Mrs. Jagruthi",
    "rollNumber": "22F91F9929",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "jagruthi@smartcampus.com",
    "phone": "+91 93234 56929",
    "specialization": [
      "SDC",
      "ECA"
    ]
  },
  {
    "id": "n-surya",
    "name": "Mr. N. Surya",
    "rollNumber": "22F91F9930",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "surya.n@smartcampus.com",
    "phone": "+91 93234 56930",
    "specialization": [
      "CAEG"
    ]
  },
  {
    "id": "u-anand",
    "name": "Mr. U. Anand",
    "rollNumber": "22F91F9931",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "anand.u@smartcampus.com",
    "phone": "+91 93234 56931",
    "specialization": [
      "EC Lab",
      "Chemistry Lab"
    ]
  },
  {
    "id": "a-koteshwar-rao",
    "name": "Mr. A. Koteshwar Rao",
    "rollNumber": "22F91F9932",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "koteshwarrao.a@smartcampus.com",
    "phone": "+91 93234 56932",
    "specialization": [
      "EC Lab"
    ]
  },
  {
    "id": "p-manjula",
    "name": "Mrs. P. Manjula",
    "rollNumber": "22F91F7722",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "manjula.p@smartcampus.com",
    "phone": "+91 91234 56722",
    "specialization": [
      "P&S"
    ]
  },
  {
    "id": "mamatha-ece",
    "name": "Mrs. Mamatha",
    "rollNumber": "22F91F9933",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "mamatha.ece@smartcampus.com",
    "phone": "+91 93234 56933",
    "specialization": [
      "EC"
    ]
  },
  {
    "id": "pavani-it",
    "name": "Mrs. Pavani",
    "rollNumber": "22F91F7723",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "pavani.it@smartcampus.com",
    "phone": "+91 91234 56723",
    "specialization": [
      "Computer Aided Engineering Graphics"
    ]
  },
  {
    "id": "tech-trainer-1",
    "name": "Technical Trainer 1",
    "rollNumber": "TT001",
    "designation": "Technical Trainer",
    "department": "CSM",
    "email": "trainer1@smartcampus.com",
    "phone": "+91 99999 00001",
    "specialization": [
      "Skill Development",
      "Skill Development Lab"
    ]
  },
  {
    "id": "tech-trainer-2",
    "name": "Technical Trainer 2",
    "rollNumber": "TT002",
    "designation": "Technical Trainer",
    "department": "IT",
    "email": "trainer2@smartcampus.com",
    "phone": "+91 99999 00002",
    "specialization": [
      "Skill Development",
      "Skill Development Lab"
    ]
  },
  {
    "id": "tech-trainer-3",
    "name": "Technical Trainer 3",
    "rollNumber": "TT003",
    "designation": "Technical Trainer",
    "department": "CSE",
    "email": "trainer3@smartcampus.com",
    "phone": "+91 99999 00003",
    "specialization": [
      "Skill Development",
      "Skill Development Lab"
    ]
  },
  {
    "id": "saileela",
    "name": "Saileela",
    "rollNumber": "22F91F0055",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "saileela@smartcampus.com",
    "phone": "+91 98765 43255",
    "specialization": [
      "Disaster Management"
    ]
  },
  {
    "id": "ch-vinay-kumar",
    "name": "CH. Vinay Kumar",
    "rollNumber": "22F91F6645",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "vinaykumar.ch@smartcampus.com",
    "phone": "+91 91000 00019",
    "specialization": [
      "Natural Language Processing (NLP)",
      "Natural Language Processing Lab (NLP Lab)"
    ]
  },
  {
    "id": "j-rama-krishna",
    "name": "Mr. J. Rama Krishna",
    "rollNumber": "GEN-M01",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "ramakrishna.j@smartcampus.com",
    "phone": "+91 91000 00001",
    "specialization": [
      "Mathematics",
      "Matrices",
      "Calculus",
      "LA&ODE",
      "P&S"
    ]
  },
  {
    "id": "p-sanjeeva-reddy",
    "name": "Mr. P. Sanjeeva Reddy",
    "rollNumber": "GEN-M02",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "sanjeevareddy.p@smartcampus.com",
    "phone": "+91 91000 00002",
    "specialization": [
      "Mathematics",
      "Matrices",
      "Calculus",
      "P&S",
      "LA&ODE"
    ]
  },
  {
    "id": "k-snehalatha",
    "name": "Mrs. K. Snehalatha",
    "rollNumber": "GEN-M03",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "snehalatha.k@smartcampus.com",
    "phone": "+91 91000 00003",
    "specialization": [
      "Mathematics",
      "LA&ODE",
      "P&S"
    ]
  },
  {
    "id": "jada-shankar",
    "name": "Dr. Jada Shankar",
    "rollNumber": "GEN-P01",
    "designation": "Associate Professor",
    "department": "GEN",
    "email": "jadashankar@smartcampus.com",
    "phone": "+91 91000 00004",
    "specialization": [
      "Physics",
      "Advanced Engineering Physics",
      "Engineering Physics Lab",
      "AEP Lab",
      "EDCAD Lab"
    ]
  },
  {
    "id": "p-venkatesh",
    "name": "Mr. P. Venkatesh",
    "rollNumber": "GEN-P02",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "venkatesh.p@smartcampus.com",
    "phone": "+91 91000 00005",
    "specialization": [
      "Physics",
      "Advanced Engineering Physics",
      "Engineering Physics Lab"
    ]
  },
  {
    "id": "b-rajinikanth",
    "name": "Dr. B. Rajinikanth",
    "rollNumber": "GEN-P03",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "rajinikanth.b@smartcampus.com",
    "phone": "+91 91000 00006",
    "specialization": [
      "Physics",
      "Advanced Engineering Physics"
    ]
  },
  {
    "id": "b-narasimha",
    "name": "Dr. B. Narasimha",
    "rollNumber": "GEN-P04",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "narasimha.b@smartcampus.com",
    "phone": "+91 91000 00007",
    "specialization": [
      "Engineering Physics Lab",
      "AEP Lab",
      "EDCAD Lab"
    ]
  },
  {
    "id": "prathibha",
    "name": "Mrs. Prathibha",
    "rollNumber": "GEN-C01",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "prathibha@smartcampus.com",
    "phone": "+91 91000 00008",
    "specialization": [
      "Engineering Chemistry",
      "EC"
    ]
  },
  {
    "id": "vijayashree",
    "name": "Mrs. Vijayashree",
    "rollNumber": "CSE-C01",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "vijayashree@smartcampus.com",
    "phone": "+91 91000 00009",
    "specialization": [
      "PPS",
      "PPS Lab",
      "ITWS"
    ]
  },
  {
    "id": "d-himaja",
    "name": "Mrs. D. Himaja",
    "rollNumber": "ECE-E01",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "himaja.d@smartcampus.com",
    "phone": "+91 91000 00010",
    "specialization": [
      "EDCAD",
      "Engineering Drawing",
      "EDCAD Lab"
    ]
  },
  {
    "id": "g-tirupathi",
    "name": "Mr. G. Tirupathi",
    "rollNumber": "ECE-E02",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "tirupathi.g@smartcampus.com",
    "phone": "+91 91000 00011",
    "specialization": [
      "EDCAD",
      "Engineering Drawing"
    ]
  },
  {
    "id": "s-triloknath-reddy",
    "name": "Mr. S. Triloknath Reddy",
    "rollNumber": "ECE-E03",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "triloknath.s@smartcampus.com",
    "phone": "+91 91000 00012",
    "specialization": [
      "EDCAD",
      "Engineering Drawing"
    ]
  },
  {
    "id": "d-gopi-krishna",
    "name": "Dr. D. Gopi Krishna",
    "rollNumber": "IT-I01",
    "designation": "Associate Professor",
    "department": "IT",
    "email": "gopikrishna.d@smartcampus.com",
    "phone": "+91 91000 00013",
    "specialization": [
      "Engineering Workshop",
      "ITWS"
    ]
  },
  {
    "id": "jahangeer",
    "name": "Mr. Jahangeer",
    "rollNumber": "GEN-M04",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "jahangeer@smartcampus.com",
    "phone": "+91 91000 00014",
    "specialization": [
      "P&S",
      "Mathematics",
      "LA&ODE"
    ]
  },
  {
    "id": "g-v-subbarao",
    "name": "Mr. G. V. Subbarao",
    "rollNumber": "ECE-S01",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "subbarao.gv@smartcampus.com",
    "phone": "+91 91000 00015",
    "specialization": [
      "SDC",
      "SDC Lab",
      "Semiconductor Devices"
    ]
  },
  {
    "id": "m-vaishnavi",
    "name": "Mrs. M. Vaishnavi",
    "rollNumber": "ECE-S02",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "vaishnavi.m@smartcampus.com",
    "phone": "+91 91000 00016",
    "specialization": [
      "SDC",
      "SDC Lab",
      "Semiconductor Devices"
    ]
  },
  {
    "id": "r-n-s-kalpana",
    "name": "Mrs. R. N. S. Kalpana",
    "rollNumber": "ECE-S03",
    "designation": "Assistant Professor",
    "department": "ECE",
    "email": "kalpana.rns@smartcampus.com",
    "phone": "+91 91000 00017",
    "specialization": [
      "SDC",
      "SDC Lab",
      "Semiconductor Devices"
    ]
  },
  {
    "id": "s-manjula-gen",
    "name": "Ms. S. Manjula",
    "rollNumber": "CSE-M01",
    "designation": "Assistant Professor",
    "department": "CSE",
    "email": "manjula.s@smartcampus.com",
    "phone": "+91 91000 00018",
    "specialization": [
      "DevOps",
      "DevOps Lab"
    ]
  },
  {
    "id": "divya-d",
    "name": "Mrs. D. Divya",
    "rollNumber": "IT-D01",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "divya.d@smartcampus.com",
    "phone": "+91 91000 00020",
    "specialization": [
      "Fundamentals of Management",
      "FOM"
    ]
  },
  {
    "id": "v-ramani",
    "name": "Mrs. V. Ramani",
    "rollNumber": "GEN-E05",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "ramani.v@smartcampus.com",
    "phone": "+91 91000 00021",
    "specialization": [
      "Advanced English Communication Skills Lab (AECS Lab)"
    ]
  },
  {
    "id": "n-kiranmai",
    "name": "Mrs. N. Kiranmai",
    "rollNumber": "22F91F6646",
    "designation": "Assistant Professor",
    "department": "CSM",
    "email": "kiranmai.n@smartcampus.com",
    "phone": "+91 91000 00022",
    "specialization": [
      "Database Management Systems (DBMS)",
      "Database Management Systems Lab (DBMS Lab)"
    ]
  },
  {
    "id": "a-srujana",
    "name": "Mrs. A. Srujana",
    "rollNumber": "IT-S03",
    "designation": "Assistant Professor",
    "department": "IT",
    "email": "srujana.a@smartcampus.com",
    "phone": "+91 91000 00023",
    "specialization": [
      "Web Technologies (WT)",
      "Environmental Science (ES)",
      "Web Technologies Lab (WT Lab)"
    ]
  },
  {
    "id": "m-a-raghu",
    "name": "Mr. M. A. Raghu",
    "rollNumber": "GEN-E06",
    "designation": "Assistant Professor",
    "department": "GEN",
    "email": "raghu.ma@smartcampus.com",
    "phone": "+91 91000 00024",
    "specialization": [
      "Advanced English Communication Skills Lab (AECS Lab)"
    ]
  }
];
