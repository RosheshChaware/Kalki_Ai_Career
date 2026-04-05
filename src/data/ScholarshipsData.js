export const mockScholarships = [
  {
    id: 'ind-1',
    title: 'Central Sector Scheme of Scholarships for College and University Students',
    provider: 'Department of Higher Education, Govt of India',
    type: 'Central Government',
    category: 'Merit-based',
    educationLevel: 'Undergraduate',
    difficulty: 'Medium',
    amount: '₹12,000 - ₹20,000',
    amountValue: 20000,
    deadline: '2026-10-31',
    awardsAvailable: 82000,
    successRate: 45,
    officialUrl: 'https://scholarships.gov.in/',
    description: 'Provides financial assistance to meritorious students from low-income families to meet a part of their day-to-day expenses while pursuing higher studies.',
    eligibility: [
      'Above 80th percentile of successful candidates in the relevant stream from the respective Board of Examination in Class XII',
      'Pursuing regular degree courses and not correspondence or distance mode',
      'Family income should not exceed ₹4,50,000 per annum',
      'Not receiving any other scholarship scheme including State run scholarship schemes'
    ],
    requirements: [
      'Aadhaar card',
      'Class 12th Marksheet',
      'Income Certificate issued by competent authority',
      'Bank Account details linked with Aadhaar'
    ],
    applicationSteps: [
      'Register on the National Scholarship Portal (NSP)',
      'Fill in the application form with accurate personal and academic details',
      'Upload the required scanned documents',
      'Submit for verification by the respective institution'
    ],
    details: 'The scholarship is awarded on the basis of the results of Senior Secondary Examination. 82,000 fresh scholarships are awarded every year (41k for boys and 41k for girls).'
  },
  {
    id: 'ind-2',
    title: 'AICTE Pragati Scholarship for Girls',
    provider: 'All India Council for Technical Education (AICTE)',
    type: 'AICTE',
    category: 'Girls/Women',
    educationLevel: 'Undergraduate',
    difficulty: 'Easy',
    amount: '₹50,000',
    amountValue: 50000,
    deadline: '2026-12-15',
    awardsAvailable: 5000,
    successRate: 60,
    officialUrl: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati-Scholarship-Scheme',
    description: 'A scheme implemented by AICTE aimed at providing assistance for advancement of girls pursuing technical education.',
    eligibility: [
      'Must be a girl student',
      'Admitted to 1st year of Degree/Diploma level course OR 2nd year of Degree/Diploma level course through lateral entry',
      'Maximum two girl children per family are eligible',
      'Family income from all sources should not be more than ₹8,00,000 per annum'
    ],
    requirements: [
      'Aadhaar Card',
      'Income Certificate',
      'Admission Letter issued by Directorate of Technical Education',
      'Certificate issued by Director/Principal of the Institution'
    ],
    applicationSteps: [
      'Visit the National Scholarship Portal to apply',
      'Select the AICTE Pragati Scholarship scheme from the available list',
      'Fill in necessary details and attach required proofs',
      'Submit application and track status on the portal'
    ],
    details: 'The scholarship provides ₹50,000 per annum for every year of study as a lump sum amount towards payment of college fee, purchase of computers, books, equipment, and softwares.'
  },
  {
    id: 'ind-3',
    title: 'Post Matric Scholarship to OBC Students',
    provider: 'MahaDBT (Government of Maharashtra)',
    type: 'State Government',
    category: 'Need-based',
    educationLevel: 'Undergraduate',
    difficulty: 'Medium',
    amount: '₹10,000',
    amountValue: 10000,
    deadline: '2026-03-31',
    awardsAvailable: 100000,
    successRate: 75,
    officialUrl: 'https://mahadbt.maharashtra.gov.in/',
    description: 'Financial assistance provided by the Government of Maharashtra to OBC students pursuing post-matric courses to help them complete their education.',
    eligibility: [
      'Applicant must belong to the OBC category',
      'Must be a resident of Maharashtra',
      'Family annual income must not exceed ₹8,00,000',
      'Must be pursuing a post-matric recognized course'
    ],
    requirements: [
      'Caste Certificate and Caste Validity Certificate',
      'Income Certificate issued by Authorized Revenue Officer',
      'Domicile Certificate',
      'Previous year\'s marksheet'
    ],
    applicationSteps: [
      'Create an account on the MahaDBT portal',
      'Complete the Aadhaar authentication process',
      'Create and complete the User Profile setup',
      'Apply to the specific Post Matric Scholarship scheme targeting OBC students'
    ],
    details: 'The scheme covers maintenance allowance and reimbursement of tuition fees, along with exam fees for eligible students.'
  },
  {
    id: 'ind-4',
    title: 'INSPIRE Scholarship for Higher Education (SHE)',
    provider: 'Department of Science & Technology (DST)',
    type: 'Research',
    category: 'Merit-based',
    educationLevel: 'Undergraduate',
    difficulty: 'Hard',
    amount: '₹80,000',
    amountValue: 80000,
    deadline: '2026-11-09',
    awardsAvailable: 10000,
    successRate: 30,
    officialUrl: 'https://online-inspire.gov.in/',
    description: 'An innovative program sponsored and managed by the DST for attraction of talent to science and encouraging students to pursue higher education in basic and natural sciences.',
    eligibility: [
      'Top 1% of successful students in Class 12th Board examinations',
      'Must be pursuing courses in Basic and Natural Sciences at B.Sc., BS, or Int. M.Sc./MS level',
      'Applicants who have secured ranks in JEE of IIT/NEET/NTSE/KVPY are also eligible'
    ],
    requirements: [
      'Class 12th Marksheet and Top 1% Certificate from the Board (if applicable)',
      'Endorsement Form signed by the Principal/Director of the institution',
      'Aadhaar Card and Bank details',
      'Entrance Exam Rank Certificate (if applicable)'
    ],
    applicationSteps: [
      'Register as a new user on the INSPIRE Web Portal',
      'Log in and fill the detailed application form',
      'Upload the endorsement certificate and other documents',
      'Submit the application and await merit list declaration'
    ],
    details: 'Selected candidates receive ₹80,000 annually, out of which ₹60,000 is given as a cash scholarship and ₹20,000 is a mentorship grant for summer research projects.'
  },
  {
    id: 'ind-5',
    title: 'Pre Matric Scholarship for Minorities',
    provider: 'Ministry of Minority Affairs',
    type: 'Central Government',
    category: 'Minority',
    educationLevel: '10th Pass',
    difficulty: 'Easy',
    amount: '₹6,000',
    amountValue: 6000,
    deadline: '2026-09-30',
    awardsAvailable: 3000000,
    successRate: 85,
    officialUrl: 'https://scholarships.gov.in/',
    description: 'Scholarship provided to students belonging to minority communities studying in academic institutes to encourage them and reduce the financial burden of parents.',
    eligibility: [
      'Must belong to a minority community (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)',
      'Studying in Class 1 to 10th in a Government or recognized private school',
      'Must have secured not less than 50% marks in the previous final examination',
      'Annual family income should not exceed ₹1,00,000'
    ],
    requirements: [
      'Minority Community Certificate (Self-declaration for students 18+, else by parents)',
      'Income Certificate',
      'Previous academic year marksheet',
      'Institutional Verification Form'
    ],
    applicationSteps: [
      'Register on NSP under the Pre-Matric Scheme',
      'Submit required demographic and academic details',
      'Upload required documentation electronically',
      'Await institute and nodal officer verification'
    ],
    details: 'The scholarship covers admission fee, tuition fee, and maintenance allowance for 10 months in an academic year.'
  },
  {
    id: 'ind-6',
    title: 'Commonwealth Master\'s Scholarships',
    provider: 'UK Department for International Development (DFID)',
    type: 'International',
    category: 'Merit-based',
    educationLevel: 'Postgraduate',
    difficulty: 'Hard',
    amount: 'Full Tuition + Stipend',
    amountValue: 500000,
    deadline: '2026-10-15',
    awardsAvailable: 800,
    successRate: 15,
    officialUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/',
    description: 'Aimed at talented individuals from eligible Commonwealth countries who have the potential to make a positive impact on the global stage.',
    eligibility: [
      'Be a citizen of or have been granted refugee status by an eligible Commonwealth country',
      'Hold a first degree of at least upper second class (2:1) honours standard',
      'Be unable to afford to study in the UK without this scholarship'
    ],
    requirements: [
      'Proof of citizenship or refugee status',
      'Full transcripts detailing all higher education qualifications',
      'References from at least two individuals',
      'Supporting statement detailing the development impact of your study'
    ],
    applicationSteps: [
      'Apply to securing a master\'s course at a UK university',
      'Submit an application via the CSC\'s online application system',
      'Complete the required documentation including references',
      'Undergo the selection process based on academic merit and potential impact'
    ],
    details: 'The scholarship covers approved airfare, tuition fees, and provides a living allowance (stipend) of approximately £1,347 per month.'
  },
  {
    id: 'ind-7',
    title: 'L\'Oréal India For Young Women In Science Scholarship',
    provider: 'L\'Oréal India',
    type: 'Women',
    category: 'Girls/Women',
    educationLevel: 'Undergraduate',
    difficulty: 'Medium',
    amount: '₹2,50,000',
    amountValue: 250000,
    deadline: '2026-07-16',
    awardsAvailable: 50,
    successRate: 25,
    officialUrl: 'https://www.loreal.com/en/india/pages/commitments/for-young-women-in-science/',
    description: 'Encourages young women to pursue graduation in science. It is awarded to promising but economically disadvantaged young women.',
    eligibility: [
      'Women candidates who have passed Class 12 in Science stream',
      'Must have secured a minimum of 85% in PCB/PCM/PCMB in Class 12',
      'Annual family income should be less than ₹6,00,000',
      'Maximum 19 years of age as on 31st May of the application year'
    ],
    requirements: [
      'Attested copy of age proof',
      'Class 10 and 12 mark sheets',
      'Income proof of parents',
      'Fee receipt or admission letter from the college/university'
    ],
    applicationSteps: [
      'Register on the scholarship application portal',
      'Fill in the personal, academic, and family income details',
      'Upload the necessary documents',
      'Shortlisted candidates undergo a telephonic interview, followed by a final jury round'
    ],
    details: 'The scholarship consists of an amount of ₹2,50,000, granted in equal annual instalments over the period of the degree of study in a recognized Indian university.'
  }
];
