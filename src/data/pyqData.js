export const REAL_PYQ_PAPERS = [
  { id: 1, title: 'JEE Main 2023 - Shift 1', exam: 'Engineering (JEE)', classLevel: 'Class 12', subject: 'All', link: 'https://byjus.com/jee/jee-main-previous-year-question-papers/' },
  { id: 2, title: 'NEET 2023 Full Paper', exam: 'Medical (NEET)', classLevel: 'Class 12', subject: 'Biology', link: 'https://www.vedantu.com/neet/neet-previous-year-question-paper' },
  { id: 3, title: 'UPSC Civil Services Prelims 2023', exam: 'Civil Services (UPSC)', classLevel: '1st Year UG', subject: 'General', link: 'https://upsc.gov.in/examinations/previous-question-papers' },
  { id: 4, title: 'CBSE Class 10 Science Board 2023', exam: 'General', classLevel: 'Class 10', subject: 'Science', link: 'https://cbseacademic.nic.in/SQP_CLASSX_2023-24.html' },
  { id: 5, title: 'CBSE Class 12 Maths Board 2023', exam: 'General', classLevel: 'Class 12', subject: 'Mathematics', link: 'https://cbseacademic.nic.in/SQP_CLASSXII_2023-24.html' },
  { id: 6, title: 'NCERT Exemplar Problems - Physics', exam: 'Engineering (JEE)', classLevel: 'Class 11', subject: 'Physics', link: 'https://ncert.nic.in/exemplar-problems.php' },
  { id: 7, title: 'JEE Advanced 2022 Paper 1', exam: 'Engineering (JEE)', classLevel: 'Class 12', subject: 'All', link: 'https://jeeadv.ac.in/archive.html' },
  { id: 8, title: 'CA Foundation Exam 2023', exam: 'Commerce', classLevel: 'Class 12', subject: 'Accounts', link: 'https://www.icai.org/post/foundation-course' }
];

export const REAL_MCQS = [
  // Engineering (JEE) - Maths
  { id: 'math_1', exam: 'Engineering (JEE)', subject: 'Mathematics', classLevel: 'Class 12', text: 'If a matrix A is both symmetric and skew-symmetric, then A is a:', options: ['Diagonal matrix', 'Zero matrix', 'Scalar matrix', 'Square matrix'], correct: 1 },
  { id: 'math_2', exam: 'Engineering (JEE)', subject: 'Mathematics', classLevel: 'Class 11', text: 'The variance of first 50 even natural numbers is:', options: ['833', '833.25', '833.75', '834'], correct: 0 },
  { id: 'math_3', exam: 'Engineering (JEE)', subject: 'Mathematics', classLevel: 'Class 12', text: 'Integration of e^x(f(x) + f\'(x)) dx is:', options: ['e^x f(x) + C', 'e^x f\'(x) + C', 'x f(x) + C', 'f(x) + C'], correct: 0 },
  { id: 'math_4', exam: 'Engineering (JEE)', subject: 'Mathematics', classLevel: 'Class 11', text: 'What is the sum of coefficients in the binomial expansion of (x + y)^n?', options: ['2^n', 'n!', 'n^2', '2n'], correct: 0 },
  { id: 'math_5', exam: 'Engineering (JEE)', subject: 'Mathematics', classLevel: 'Class 12', text: 'Which of the following functions is strictly decreasing on (0, pi/2)?', options: ['cos x', 'cos 2x', 'cos 3x', 'tan x'], correct: 0 },
  
  // Engineering (JEE) - Physics
  { id: 'phys_1', exam: 'Engineering (JEE)', subject: 'Physics', classLevel: 'Class 11', text: 'The dimensional formula for gravitational constant (G) is:', options: ['[M-1 L3 T-2]', '[M L2 T-2]', '[M L T-1]', '[M-1 L2 T-2]'], correct: 0 },
  { id: 'phys_2', exam: 'Engineering (JEE)', subject: 'Physics', classLevel: 'Class 12', text: 'Which logic gate is known as the universal gate?', options: ['AND', 'OR', 'NAND', 'NOT'], correct: 2 },
  { id: 'phys_3', exam: 'Engineering (JEE)', subject: 'Physics', classLevel: 'Class 11', text: 'The escape velocity of a body on earth is 11.2 km/s. If the mass of the earth is doubled and its radius is halved, the escape velocity will become:', options: ['5.6 km/s', '11.2 km/s', '22.4 km/s', '44.8 km/s'], correct: 2 },
  { id: 'phys_4', exam: 'Engineering (JEE)', subject: 'Physics', classLevel: 'Class 12', text: 'In a Young\'s double-slit experiment, if the separation between the slits is halved and the distance between the slits and the screen is doubled, the fringe width will:', options: ['Be halved', 'Remain the same', 'Be doubled', 'Be quadrupled'], correct: 3 },
  { id: 'phys_5', exam: 'Engineering (JEE)', subject: 'Physics', classLevel: 'Class 12', text: 'The ratio of kinetic energy to the total energy of an electron in a Bohr orbit of the hydrogen atom is:', options: ['1 : -1', '2 : 1', '1 : 2', '1 : 1'], correct: 0 },

  // Medical (NEET) - Biology & Chemistry
  { id: 'bio_1', exam: 'Medical (NEET)', subject: 'Biology', classLevel: 'Class 11', text: 'Which one of the following is responsible for peat formation?', options: ['Marchantia', 'Riccia', 'Funaria', 'Sphagnum'], correct: 3 },
  { id: 'bio_2', exam: 'Medical (NEET)', subject: 'Biology', classLevel: 'Class 12', text: 'In DNA replication, the Okazaki fragments on the lagging strand are joined together by:', options: ['DNA ligase', 'DNA polymerase', 'Helicase', 'Primase'], correct: 0 },
  { id: 'bio_3', exam: 'Medical (NEET)', subject: 'Biology', classLevel: 'Class 11', text: 'The first stable product of CO2 fixation in sorghum is:', options: ['Phosphoglyceric acid', 'Pyruvic acid', 'Oxaloacetic acid', 'Succinic acid'], correct: 2 },
  { id: 'bio_4', exam: 'Medical (NEET)', subject: 'Biology', classLevel: 'Class 12', text: 'Which of the following sexually transmitted diseases is not completely curable?', options: ['Chlamydiasis', 'Gonorrhea', 'Genital warts', 'Genital herpes'], correct: 3 },
  { id: 'chem_1', exam: 'Medical (NEET)', subject: 'Chemistry', classLevel: 'Class 12', text: 'Which of the following is an amphoteric oxide?', options: ['V2O5', 'CrO3', 'Mn2O7', 'CO'], correct: 0 },

  // General Exam (CBSE 10/12)
  { id: 'gen_1', exam: 'General', subject: 'Science', classLevel: 'Class 10', text: 'The heating element of an electric iron is made up of:', options: ['Copper', 'Nichrome', 'Aluminium', 'Iron'], correct: 1 },
  { id: 'gen_2', exam: 'General', subject: 'Science', classLevel: 'Class 10', text: 'Which of the following hormones is responsible for the regulation of blood sugar?', options: ['Estrogen', 'Testosterone', 'Insulin', 'Adrenaline'], correct: 2 },
  { id: 'gen_3', exam: 'General', subject: 'Social Science', classLevel: 'Class 10', text: 'Who among the following wrote the book \'Hind Swaraj\'?', options: ['Jawaharlal Nehru', 'Rabindranath Tagore', 'Mahatma Gandhi', 'Subhas Chandra Bose'], correct: 2 },
  
  // Civil Services
  { id: 'upsc_1', exam: 'Civil Services (UPSC)', subject: 'Economics', classLevel: '1st Year UG', text: 'With reference to the Indian economy, which of the following is an anti-inflationary measure?', options: ['Purchase of securities from the public by the central bank', 'Lowering of the Bank Rate', 'Increasing the Cash Reserve Ratio', 'Abolishing Statutory Liquidity Ratio'], correct: 2 },
  { id: 'upsc_2', exam: 'Civil Services (UPSC)', subject: 'Polity', classLevel: '1st Year UG', text: 'The Ninth Schedule to the Indian Constitution was added by:', options: ['First Amendment', 'Eighth Amendment', 'Ninth Amendment', 'Forty Second Amendment'], correct: 0 },
];
