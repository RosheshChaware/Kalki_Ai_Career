// ─────────────────────────────────────────────────────────────────────────────
//  GOAL INTELLIGENCE — Central adaptive mapping
//  Used by: OnboardingFlow, StudyMaterialsPage, PracticeQuestionsPage
// ─────────────────────────────────────────────────────────────────────────────

// ── 0. Class & Stream Options ──────────────────────────────────────────────────
export const CLASS_OPTIONS = [
  'Class 11', 'Class 12', 
  '1st Year UG', '2nd Year UG', '3rd Year UG', '4th Year UG', 
  'Postgraduate'
];

export const getClassCategory = (cls) => {
  if (!cls) return null;
  if (cls.startsWith('Class')) return 'school';
  if (cls.includes('UG')) return 'ug';
  if (cls === 'Postgraduate') return 'pg';
  return null;
};

export const STREAM_OPTIONS = {
  school: ['Science', 'Commerce', 'Arts / Humanities', 'Other'],
  ug:     ['Engineering (B.Tech)', 'Business (BBA)', 'Science (BSc)', 'Arts (BA)', 'Other'],
  pg:     ['MBA', 'MTech', 'MSc', 'MA', 'MCA', 'Other'],
};

export const STREAM_LABELS = {
  school: 'Stream',
  ug:     'Field of Study',
  pg:     'Specialization',
};

// ── 1. Stream → Goals mapping ──────────────────────────────────────────────
export const STREAM_GOALS = {
  // School streams
  Science: [
    'Engineering (JEE)',
    'Medical (NEET)',
    'Research / Scientist',
    'Data Science / AI',
    'Defense / NDA',
  ],
  Commerce: [
    'CA / CS',
    'Business / Startup',
    'Finance / Investment Banking',
    'Marketing / Management',
    'Government Exams',
  ],
  'Arts / Humanities': [
    'UPSC / Civil Services',
    'Law (CLAT / AILET)',
    'Psychology',
    'Journalism / Media',
    'Design / Creative Arts',
  ],
  Other: [
    'Engineering (JEE)',
    'Medical (NEET)',
    'UPSC / Civil Services',
    'Business / Startup',
    'Government Exams',
  ],
  // UG fields of study
  'Engineering (B.Tech)': [
    'Software Developer',
    'Data Science / AI',
    'Startup Founder',
    'Higher Studies Abroad (MS)',
    'Campus Placement',
  ],
  'Business (BBA)': [
    'MBA',
    'Marketing / Management',
    'Finance / Investment Banking',
    'Startup Founder',
    'Government Exams',
  ],
  'Science (BSc)': [
    'Research / Scientist',
    'Data Science / AI',
    'Higher Studies Abroad (MS)',
    'Government Exams',
    'Medical (NEET PG)',
  ],
  'Arts (BA)': [
    'UPSC / Civil Services',
    'Law (CLAT / AILET)',
    'Journalism / Media',
    'Psychology',
    'Higher Studies Abroad (MA)',
  ],
  // PG specializations
  MBA: [
    'Finance / Investment Banking',
    'Marketing / Management',
    'Startup Founder',
    'Corporate Leadership',
  ],
  MTech: [
    'Research / Scientist',
    'Data Science / AI',
    'Higher Studies Abroad (PhD)',
    'Campus Placement',
  ],
  MSc: [
    'Research / Scientist',
    'Data Science / AI',
    'Higher Studies Abroad (PhD)',
    'Government Exams',
  ],
  MA: [
    'UPSC / Civil Services',
    'Journalism / Media',
    'Psychology',
    'Higher Studies Abroad',
  ],
  MCA: [
    'Software Developer',
    'Data Science / AI',
    'Campus Placement',
    'Startup Founder',
  ],
};

// Fallback for any unmatched stream
export const DEFAULT_GOALS = [
  'Engineering (JEE)',
  'Medical (NEET)',
  'UPSC / Civil Services',
  'Business / Startup',
  'Government Exams',
  'Higher Studies Abroad',
  'Other',
];

// ── 2. Goal → Subjects ─────────────────────────────────────────────────────
export const GOAL_SUBJECTS = {
  'Engineering (JEE)':          ['Mathematics', 'Physics', 'Chemistry'],
  'Medical (NEET)':             ['Biology', 'Physics', 'Chemistry'],
  'Research / Scientist':       ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Statistics'],
  'Data Science / AI':          ['Mathematics', 'Statistics', 'Computer Science', 'Python', 'English'],
  'Defense / NDA':              ['Mathematics', 'Physics', 'English', 'General Knowledge'],
  'CA / CS':                    ['Accountancy', 'Economics', 'Business Studies', 'Mathematics', 'English'],
  'Business / Startup':         ['Economics', 'Mathematics', 'Business Studies', 'English', 'Accountancy'],
  'Finance / Investment Banking':['Economics', 'Mathematics', 'Accountancy', 'Business Studies', 'English'],
  'Marketing / Management':     ['Business Studies', 'Economics', 'English', 'Psychology'],
  'Government Exams':           ['General Knowledge', 'Mathematics', 'Reasoning', 'English', 'Current Affairs'],
  'UPSC / Civil Services':      ['History', 'Geography', 'Political Science', 'Economics', 'English'],
  'Law (CLAT / AILET)':         ['English', 'Legal Reasoning', 'General Knowledge', 'Logical Reasoning'],
  'Psychology':                  ['Psychology', 'Biology', 'English', 'Sociology'],
  'Journalism / Media':          ['English', 'General Knowledge', 'Current Affairs', 'History'],
  'Design / Creative Arts':      ['English', 'General Aptitude', 'Art', 'General Knowledge'],
  'Software Developer':          ['Computer Science', 'Mathematics', 'Data Structures', 'English'],
  'Campus Placement':            ['Aptitude', 'Computer Science', 'English', 'Data Structures', 'Mathematics'],
  'Higher Studies Abroad (MS)':  ['Mathematics', 'English', 'Statistics', 'Computer Science'],
  'Higher Studies Abroad':       ['Mathematics', 'English', 'Statistics', 'Aptitude'],
  'MBA':                         ['Mathematics', 'English', 'Aptitude', 'Economics', 'Business Studies'],
  'Startup Founder':             ['Economics', 'Business Studies', 'Mathematics', 'English'],
  'Corporate Leadership':        ['Business Studies', 'Economics', 'English', 'Psychology'],
  'Medical (NEET PG)':           ['Biology', 'Chemistry', 'Physics', 'Medicine'],
  'Higher Studies Abroad (PhD)': ['Research Methods', 'English', 'Mathematics', 'Statistics'],
  'Higher Studies Abroad (MA)':  ['English', 'Social Sciences', 'General Knowledge'],
  Other: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Economics'],
};

// ── 3. Goal → Study Resources ──────────────────────────────────────────────
// Each entry: { id, category, title, description, type, link, thumb, tags }
// category: 'Concept Learning' | 'Practice Resources' | 'Revision Notes'
export const GOAL_RESOURCES = {
  'Engineering (JEE)': [
    { id: 'jee_1', category: 'Concept Learning', title: 'Complete Physics for JEE Main', description: 'One-shot lecture covering Kinematics, Dynamics & Thermal Physics.', type: 'Video', link: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE', thumb: 'https://img.youtube.com/vi/ZM8ECpBuQYE/hqdefault.jpg' },
    { id: 'jee_2', category: 'Practice Resources', title: 'NCERT Exemplar Problems – Mathematics', description: 'Official complex practice problems by CBSE.', type: 'PDF', link: 'https://ncert.nic.in/exemplar-problems.php?ln=en', thumb: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&q=80' },
    { id: 'jee_3', category: 'Concept Learning', title: 'Calculus Complete Series – Khan Academy', description: 'Comprehensive guide to integral and differential calculus.', type: 'Article', link: 'https://www.khanacademy.org/math/calculus-1', thumb: 'https://images.unsplash.com/photo-1546410531-dd4cbac24b25?w=500&q=80' },
    { id: 'jee_4', category: 'Revision Notes', title: 'Organic Chemistry Reaction Map', description: 'Quick revision notes for Name Reactions — NCERT based.', type: 'PDF', link: 'https://ncert.nic.in/textbook.php?lech2=0-6', thumb: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80' },
    { id: 'jee_5', category: 'Practice Resources', title: 'JEE Main PYQ Papers – Byju\'s', description: 'Download all JEE Main previous year question papers with solutions.', type: 'PDF', link: 'https://byjus.com/jee/jee-main-previous-year-question-papers/', thumb: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80' },
    { id: 'jee_6', category: 'Concept Learning', title: 'JEE Chemistry Full Course – Unacademy', description: 'Systematic chapter-wise chemistry course for JEE.', type: 'Video', link: 'https://www.youtube.com/watch?v=4aNBL3hD1Ns', thumb: 'https://img.youtube.com/vi/4aNBL3hD1Ns/hqdefault.jpg' },
  ],

  'Medical (NEET)': [
    { id: 'neet_1', category: 'Concept Learning', title: 'Human Physiology Crash Course', description: 'Detailed biological systems covered for NEET.', type: 'Video', link: 'https://www.youtube.com/watch?v=_uBExhM4G1c', thumb: 'https://img.youtube.com/vi/_uBExhM4G1c/hqdefault.jpg' },
    { id: 'neet_2', category: 'Revision Notes', title: 'NCERT Biology Quick Summary', description: 'Crucial biology charts for rapid NEET revision.', type: 'PDF', link: 'https://ncert.nic.in/textbook.php?kebo1=0-22', thumb: 'https://images.unsplash.com/photo-1530213786676-4cce15a9fac4?w=500&q=80' },
    { id: 'neet_3', category: 'Practice Resources', title: 'NEET 2023 Full Paper with Solutions', description: 'Official NEET 2023 MCQs with step-by-step solutions.', type: 'PDF', link: 'https://www.vedantu.com/neet/neet-previous-year-question-paper', thumb: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80' },
    { id: 'neet_4', category: 'Concept Learning', title: 'Organic Chemistry for NEET – Vedantu', description: 'Master organic chemistry reactions and mechanisms.', type: 'Video', link: 'https://www.youtube.com/watch?v=oc_Fbu3Ls9Q', thumb: 'https://img.youtube.com/vi/oc_Fbu3Ls9Q/hqdefault.jpg' },
    { id: 'neet_5', category: 'Revision Notes', title: 'Genetics & Evolution – Quick Notes', description: 'High-yield genetics notes for last-minute revision.', type: 'PDF', link: 'https://ncert.nic.in/textbook.php?kebo2=0-16', thumb: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&q=80' },
  ],

  'UPSC / Civil Services': [
    { id: 'upsc_1', category: 'Revision Notes', title: 'Indian Polity – Laxmikanth Highlights', description: 'Core articles, fundamental rights & DPSP mapping.', type: 'PDF', link: 'https://upsc.gov.in', thumb: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80' },
    { id: 'upsc_2', category: 'Concept Learning', title: 'Macroeconomics for Civil Services', description: 'Economic survey summaries & basics.', type: 'Article', link: 'https://www.investopedia.com/terms/m/macroeconomics.asp', thumb: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80' },
    { id: 'upsc_3', category: 'Practice Resources', title: 'UPSC Prelims PYQ Papers', description: 'All previous year General Studies papers for practice.', type: 'PDF', link: 'https://upsc.gov.in/examinations/previous-question-papers', thumb: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=500&q=80' },
    { id: 'upsc_4', category: 'Concept Learning', title: 'Modern History for UPSC – NCERT', description: 'NCERT based modern Indian history for prelims & mains.', type: 'PDF', link: 'https://ncert.nic.in/textbook.php?jeth2=0-10', thumb: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=500&q=80' },
    { id: 'upsc_5', category: 'Revision Notes', title: 'Geography Revision – Atlas + Maps', description: 'World & Indian geography important maps.', type: 'Article', link: 'https://www.pmfias.com/physical-geography/', thumb: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&q=80' },
  ],

  'Data Science / AI': [
    { id: 'ds_1', category: 'Concept Learning', title: 'Python for Data Science – Full Course', description: 'FreeCodeCamp\'s complete Python & pandas tutorial.', type: 'Video', link: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', thumb: 'https://img.youtube.com/vi/r-uOLxNrNk8/hqdefault.jpg' },
    { id: 'ds_2', category: 'Practice Resources', title: 'Kaggle Titanic Dataset Walkthrough', description: 'Real-world data analysis project step-by-step.', type: 'Article', link: 'https://www.kaggle.com/c/titanic/overview', thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80' },
    { id: 'ds_3', category: 'Concept Learning', title: 'Statistics for Machine Learning', description: 'Probability, distributions and hypothesis testing.', type: 'Article', link: 'https://www.khanacademy.org/math/statistics-probability', thumb: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&q=80' },
    { id: 'ds_4', category: 'Practice Resources', title: 'SQL for Data Analysts – Full Tutorial', description: 'Solid SQL fundamentals for aspiring data analysts.', type: 'Video', link: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', thumb: 'https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg' },
    { id: 'ds_5', category: 'Revision Notes', title: 'Machine Learning Cheat Sheet', description: 'All key ML algorithms and formulas on one page.', type: 'PDF', link: 'https://ml-cheatsheet.readthedocs.io', thumb: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80' },
  ],

  'Software Developer': [
    { id: 'dev_1', category: 'Concept Learning', title: 'Data Structures & Algorithms – FreeCodeCamp', description: 'Full 8-hour DSA course for developers.', type: 'Video', link: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', thumb: 'https://img.youtube.com/vi/RBSGKlAvoiM/hqdefault.jpg' },
    { id: 'dev_2', category: 'Practice Resources', title: 'LeetCode Top Interview Questions', description: 'Most commonly asked interview patterns and problems.', type: 'Article', link: 'https://leetcode.com/explore/interview/card/top-interview-questions-easy/', thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80' },
    { id: 'dev_3', category: 'Concept Learning', title: 'Full Stack Web Development Roadmap', description: 'HTML, CSS, JS, React and Node.js complete path.', type: 'Article', link: 'https://roadmap.sh/full-stack', thumb: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=500&q=80' },
    { id: 'dev_4', category: 'Practice Resources', title: 'GitHub Open Source Contribution Guide', description: 'How to find and contribute to real projects.', type: 'Article', link: 'https://opensource.guide/how-to-contribute/', thumb: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&q=80' },
    { id: 'dev_5', category: 'Revision Notes', title: 'System Design Interview Cheat Sheet', description: 'Core concepts: scalability, caching, DB design.', type: 'Article', link: 'https://github.com/donnemartin/system-design-primer', thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80' },
  ],

  'CA / CS': [
    { id: 'ca_1', category: 'Concept Learning', title: 'CA Foundation – Accounts Full Course', description: 'Complete accountancy lecture series for CA Foundation.', type: 'Video', link: 'https://www.youtube.com/watch?v=rRbj3iZMcak', thumb: 'https://img.youtube.com/vi/rRbj3iZMcak/hqdefault.jpg' },
    { id: 'ca_2', category: 'Practice Resources', title: 'CA Foundation Exam Papers – ICAI', description: 'Official ICAI past exam papers with solutions.', type: 'PDF', link: 'https://www.icai.org/post/foundation-course', thumb: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&q=80' },
    { id: 'ca_3', category: 'Revision Notes', title: 'GST & Tax Quick Revision Notes', description: 'Key taxation topics condensed for revision.', type: 'PDF', link: 'https://www.incometax.gov.in', thumb: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500&q=80' },
    { id: 'ca_4', category: 'Concept Learning', title: 'Business Law for CS Exam', description: 'Company law, contracts & compliance for CS aspirants.', type: 'Article', link: 'https://www.icsi.edu/student/', thumb: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80' },
  ],

  'MBA': [
    { id: 'mba_1', category: 'Practice Resources', title: 'CAT Quantitative Aptitude – Prep Course', description: 'High-speed mental math and CAT-level problem solving.', type: 'Video', link: 'https://www.youtube.com/watch?v=qpjbg2rRjPk', thumb: 'https://img.youtube.com/vi/qpjbg2rRjPk/hqdefault.jpg' },
    { id: 'mba_2', category: 'Concept Learning', title: 'Business Communication Mastery', description: 'Writing, presentations and leadership communication.', type: 'Article', link: 'https://www.coursera.org/learn/business-writing', thumb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80' },
    { id: 'mba_3', category: 'Revision Notes', title: 'VARC Strategy for CAT', description: 'Reading comprehension and verbal ability shortcuts.', type: 'PDF', link: 'https://iimcat.ac.in/', thumb: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80' },
    { id: 'mba_4', category: 'Practice Resources', title: 'CAT Previous Year Question Papers', description: 'Authentic CAT papers from IIM official records.', type: 'PDF', link: 'https://iimcat.ac.in/', thumb: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&q=80' },
  ],

  'Campus Placement': [
    { id: 'cp_1', category: 'Concept Learning', title: 'Data Structures & Algorithms – FreeCodeCamp', description: 'Full DSA course to crack technical rounds.', type: 'Video', link: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', thumb: 'https://img.youtube.com/vi/RBSGKlAvoiM/hqdefault.jpg' },
    { id: 'cp_2', category: 'Practice Resources', title: 'LeetCode Top Interview Questions', description: 'Most commonly asked company-specific patterns.', type: 'Article', link: 'https://leetcode.com/explore/interview/card/top-interview-questions-easy/', thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80' },
    { id: 'cp_3', category: 'Concept Learning', title: 'Aptitude & Reasoning – Placement Prep', description: 'Quantitative aptitude and logical reasoning for off-campus.', type: 'Video', link: 'https://www.youtube.com/watch?v=tELIoXc1_zk', thumb: 'https://img.youtube.com/vi/tELIoXc1_zk/hqdefault.jpg' },
    { id: 'cp_4', category: 'Revision Notes', title: 'HR Interview Questions – Top 50', description: 'Behavioural & situational interview question bank.', type: 'Article', link: 'https://www.ambitionbox.com/interviews', thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80' },
  ],

  'Law (CLAT / AILET)': [
    { id: 'law_1', category: 'Concept Learning', title: 'CLAT Legal Reasoning – Full Guide', description: 'Principle-fact based legal questions explained.', type: 'Video', link: 'https://www.youtube.com/watch?v=YXJGYL5c5sA', thumb: 'https://img.youtube.com/vi/YXJGYL5c5sA/hqdefault.jpg' },
    { id: 'law_2', category: 'Practice Resources', title: 'CLAT Previous Year Papers', description: 'Consortium CLAT official papers with full solutions.', type: 'PDF', link: 'https://consortiumofnlus.ac.in/', thumb: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80' },
    { id: 'law_3', category: 'Revision Notes', title: 'Legal GK Quick Revision', description: 'Important landmark cases and constitutional articles.', type: 'PDF', link: 'https://www.legalserviceindia.com/', thumb: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=500&q=80' },
  ],

  'Finance / Investment Banking': [
    { id: 'fin_1', category: 'Concept Learning', title: 'Financial Markets – Yale Free Course', description: 'Prof. Robert Shiller\'s famous markets course.', type: 'Article', link: 'https://www.coursera.org/learn/financial-markets-global', thumb: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&q=80' },
    { id: 'fin_2', category: 'Revision Notes', title: 'Financial Ratios Cheat Sheet', description: 'P/E, ROE, EBITDA and 20+ ratios explained fast.', type: 'PDF', link: 'https://www.investopedia.com/financial-ratios-4689817', thumb: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&q=80' },
    { id: 'fin_3', category: 'Practice Resources', title: 'Wall Street Prep – Free Samples', description: 'Investment banking modelling fundamentals.', type: 'Article', link: 'https://www.wallstreetprep.com/knowledge/', thumb: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80' },
  ],

  'Government Exams': [
    { id: 'gov_1', category: 'Concept Learning', title: 'Reasoning for SSC / Bank Exams', description: 'Logical reasoning tricks and shortcut methods.', type: 'Video', link: 'https://www.youtube.com/watch?v=7sQi-JHhrWo', thumb: 'https://img.youtube.com/vi/7sQi-JHhrWo/hqdefault.jpg' },
    { id: 'gov_2', category: 'Practice Resources', title: 'SSC CGL Previous Papers', description: 'All SSC CGL tier 1 & 2 papers with answer keys.', type: 'PDF', link: 'https://ssc.nic.in/', thumb: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=500&q=80' },
    { id: 'gov_3', category: 'Revision Notes', title: 'Current Affairs Monthly Digest', description: 'Compiled monthly GK for all government exams.', type: 'PDF', link: 'https://affairscloud.com/current-affairs/', thumb: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80' },
  ],

  'Defense / NDA': [
    { id: 'nda_1', category: 'Practice Resources', title: 'NDA Previous Year Papers', description: 'UPSC NDA & NA official past papers for practice.', type: 'PDF', link: 'https://upsc.gov.in/examinations/previous-question-papers', thumb: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80' },
    { id: 'nda_2', category: 'Concept Learning', title: 'NDA Mathematics Full Syllabus', description: 'Algebra, calculus and statistics for NDA exam.', type: 'Video', link: 'https://www.youtube.com/watch?v=eTFXHWzkaAI', thumb: 'https://img.youtube.com/vi/eTFXHWzkaAI/hqdefault.jpg' },
  ],
};

// Fallback resources for goals not in the map
const FALLBACK_RESOURCES = [
  { id: 'fb_1', category: 'Concept Learning', title: 'Khan Academy – Learn Anything', description: 'World\'s most comprehensive free learning platform.', type: 'Article', link: 'https://www.khanacademy.org', thumb: 'https://images.unsplash.com/photo-1546410531-dd4cbac24b25?w=500&q=80' },
  { id: 'fb_2', category: 'Practice Resources', title: 'Brilliant.org – Interactive Problems', description: 'Math, science and CS problems with guided solutions.', type: 'Article', link: 'https://brilliant.org', thumb: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&q=80' },
  { id: 'fb_3', category: 'Revision Notes', title: 'NCERT All Textbooks', description: 'Official NCERT books for all subjects and classes.', type: 'PDF', link: 'https://ncert.nic.in/textbook.php', thumb: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80' },
];

// ── Helper: get resources for a goal ──────────────────────────────────────
export function getGoalResources(goal) {
  // Normalize common aliases
  const aliasMap = {
    'Civil Services (UPSC)': 'UPSC / Civil Services',
    'Higher Studies (MS/MBA)': 'Higher Studies Abroad (MS)',
    'Creative / Design': 'Design / Creative Arts',
  };
  const normalized = aliasMap[goal] || goal;
  return GOAL_RESOURCES[normalized] || FALLBACK_RESOURCES;
}

// ── Helper: get goals for a stream ────────────────────────────────────────
export function getGoalsForStream(stream) {
  return STREAM_GOALS[stream] || DEFAULT_GOALS;
}

// ── Helper: get subjects for a goal ───────────────────────────────────────
export function getSubjectsForGoal(goal) {
  return GOAL_SUBJECTS[goal] || GOAL_SUBJECTS['Other'];
}
