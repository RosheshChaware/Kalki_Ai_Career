import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionStep';
import RecommendationCard from './RecommendationCard';

// ─── Recommendation Engine ───────────────────────────────────────────────────

const STREAMS = [
  {
    id: 'pcm',
    title: 'Science (PCM)',
    description: 'Perfect for students driven by logical thinking and innovation. Opens doors to top engineering and technology institutes.',
    coreSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    careerOptions: ['Engineering', 'Architecture', 'Pilot', 'Data Science', 'Research'],
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'],
    subjectMatch: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
    careerMatch: ['Engineering & Technology', 'Research & Academia'],
    strengthMatch: ['Analytical Thinking', 'Technical Aptitude', 'Attention to Detail'],
    learningMatch: ['Hands-on & Practical', 'Theoretical & Conceptual'],
  },
  {
    id: 'pcb',
    title: 'Science (PCB)',
    description: 'Ideal for those passionate about life sciences and healthcare. The gateway to medicine, biotechnology, and allied health professions.',
    coreSubjects: ['Physics', 'Chemistry', 'Biology'],
    careerOptions: ['Medicine', 'Dentistry', 'Pharmacy', 'Biotechnology', 'Nursing'],
    entranceExams: ['NEET', 'AIIMS', 'JIPMER', 'State Medical Exams'],
    subjectMatch: ['Biology', 'Chemistry', 'Physics'],
    careerMatch: ['Medical & Healthcare', 'Research & Academia'],
    strengthMatch: ['Attention to Detail', 'Research Skills', 'Analytical Thinking'],
    learningMatch: ['Hands-on & Practical', 'Theoretical & Conceptual'],
  },
  {
    id: 'pcmb',
    title: 'Science (PCMB)',
    description: 'The comprehensive science stream that keeps all options open — both engineering and medical pathways remain accessible.',
    coreSubjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    careerOptions: ['Engineering', 'Medicine', 'Research', 'Biotechnology', 'Data Science'],
    entranceExams: ['JEE Main', 'NEET', 'BITSAT', 'AIIMS'],
    subjectMatch: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'],
    careerMatch: ['Engineering & Technology', 'Medical & Healthcare', 'Research & Academia'],
    strengthMatch: ['Analytical Thinking', 'Technical Aptitude', 'Research Skills'],
    learningMatch: ['Hands-on & Practical', 'Theoretical & Conceptual'],
  },
  {
    id: 'commerce',
    title: 'Commerce',
    description: 'Great for students interested in business, finance, and the world of commerce. Build a future in management or entrepreneurship.',
    coreSubjects: ['Accountancy', 'Business Studies', 'Economics'],
    careerOptions: ['CA', 'MBA', 'Banking', 'Finance', 'Entrepreneurship'],
    entranceExams: ['CAT', 'CLAT', 'CMA Foundation', 'CS Foundation'],
    subjectMatch: ['Economics', 'Mathematics'],
    careerMatch: ['Business & Management'],
    strengthMatch: ['Leadership Abilities', 'Communication Skills', 'Teamwork'],
    learningMatch: ['Discussion & Debate', 'Theoretical & Conceptual'],
  },
  {
    id: 'commerce_math',
    title: 'Commerce with Mathematics',
    description: 'A powerful combination for analytical minds who want a career in finance, data analytics, or quantitative business roles.',
    coreSubjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'],
    careerOptions: ['Investment Banking', 'Data Analytics', 'Actuarial Science', 'CA', 'CFA'],
    entranceExams: ['CAT', 'CMA', 'ICAI', 'CUET'],
    subjectMatch: ['Mathematics', 'Economics'],
    careerMatch: ['Business & Management', 'Research & Academia'],
    strengthMatch: ['Analytical Thinking', 'Technical Aptitude', 'Attention to Detail'],
    learningMatch: ['Theoretical & Conceptual', 'Hands-on & Practical'],
  },
  {
    id: 'humanities',
    title: 'Humanities / Arts',
    description: 'Ideal for those passionate about society, language, law, and human behaviour. Opens pathways to civil services, law, and creative professions.',
    coreSubjects: ['History', 'Political Science', 'Geography', 'Psychology', 'English'],
    careerOptions: ['Civil Services', 'Journalism', 'Law', 'Teaching', 'Social Work'],
    entranceExams: ['UPSC', 'CLAT', 'NDA', 'Mass Comm Exams', 'CUET'],
    subjectMatch: ['History', 'Geography', 'English Literature', 'Psychology'],
    careerMatch: ['Government & Civil Services', 'Law & Legal Services', 'Teaching & Education', 'Arts & Creative Fields'],
    strengthMatch: ['Communication Skills', 'Leadership Abilities', 'Research Skills', 'Creative Problem Solving'],
    learningMatch: ['Discussion & Debate', 'Visual & Graphical'],
  },
];

const WEIGHTS = { subject: 2, career: 4, strength: 1, learning: 2 };

function getRecommendations(answers) {
  const scored = STREAMS.map((stream) => {
    let score = 0;

    // Subject interest matches
    (answers.subjects || []).forEach((s) => {
      if (stream.subjectMatch.includes(s)) score += WEIGHTS.subject;
    });

    // Career goal match
    (answers.career || []).forEach((c) => {
      if (stream.careerMatch.includes(c)) score += WEIGHTS.career;
    });

    // Strength matches
    (answers.strengths || []).forEach((s) => {
      if (stream.strengthMatch.includes(s)) score += WEIGHTS.strength;
    });

    // Learning style match
    (answers.learning || []).forEach((l) => {
      if (stream.learningMatch.includes(l)) score += WEIGHTS.learning;
    });

    return { ...stream, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // top 3
    .filter((s) => s.score > 0);
}

const BADGES = ['Best Match', 'Great Option', 'Alternative Path'];

// ─── Component ───────────────────────────────────────────────────────────────

const SubjectAdvisorPage = ({ onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    subjects: [],
    career: [],
    strengths: [],
    learning: [],
  });

  const steps = [
    {
      id: 'subjects',
      title: 'Subject Combination Advisor',
      question: 'Which subjects do you find most interesting?',
      options: [
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics',
        'History', 'Geography', 'English Literature', 'Psychology', 'Computer Science',
      ],
      isMultiple: true,
      progress: 25,
    },
    {
      id: 'career',
      title: 'Subject Combination Advisor',
      question: 'What type of career are you most interested in?',
      options: [
        'Engineering & Technology', 'Medical & Healthcare', 'Business & Management',
        'Arts & Creative Fields', 'Research & Academia', 'Government & Civil Services',
        'Law & Legal Services', 'Teaching & Education',
      ],
      isMultiple: false,
      progress: 50,
    },
    {
      id: 'strengths',
      title: 'Subject Combination Advisor',
      question: 'What are your key strengths?',
      options: [
        'Analytical Thinking', 'Creative Problem Solving', 'Communication Skills',
        'Leadership Abilities', 'Technical Aptitude', 'Research Skills', 'Teamwork',
        'Attention to Detail',
      ],
      isMultiple: true,
      progress: 75,
    },
    {
      id: 'learning',
      title: 'Subject Combination Advisor',
      question: 'How do you prefer to learn?',
      options: [
        'Hands-on & Practical', 'Theoretical & Conceptual', 'Visual & Graphical', 'Discussion & Debate',
      ],
      isMultiple: false,
      progress: 100,
    },
  ];

  const handleNext = () => {
    if (stepIndex < steps.length) setStepIndex(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) onClose();
    else setStepIndex(stepIndex - 1);
  };

  const handleSelect = (selectedOptions) => {
    const currentStepId = steps[stepIndex]?.id;
    setAnswers({ ...answers, [currentStepId]: selectedOptions });
  };

  const isNextDisabled = !answers[steps[stepIndex]?.id]?.length;

  // ── Results page ──────────────────────────────────────────────────────────
  if (stepIndex >= steps.length) {
    const recommendations = getRecommendations(answers);

    return (
      <div className="min-h-screen bg-background p-8 md:p-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <button
              onClick={() => setStepIndex(3)}
              className="text-textMuted flex items-center gap-2 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Assessment</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface hover:bg-surface/80 border border-white/10 transition-colors"
            >
              Exit
            </button>
          </div>

          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Personalized Recommendations</h1>
            <p className="text-textMuted text-lg leading-relaxed max-w-2xl mx-auto">
              Based on your interests, goals, strengths, and learning style — here are the best-fit subject combinations for you.
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center">
              <p className="text-textMuted text-lg mb-6">
                We couldn't generate a strong match. Try going back and reviewing your answers.
              </p>
              <button
                onClick={() => setStepIndex(0)}
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-xl transition-colors"
              >
                Retake Assessment
              </button>
            </div>
          ) : (
            recommendations.map((rec, i) => (
              <RecommendationCard
                key={rec.id}
                badge={BADGES[i]}
                title={rec.title}
                description={rec.description}
                coreSubjects={rec.coreSubjects}
                careerOptions={rec.careerOptions}
                entranceExams={rec.entranceExams}
              />
            ))
          )}

          <div className="glass-card rounded-3xl p-8 text-center mt-8 bg-primary/5 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Need More Guidance?</h3>
            <p className="text-textMuted mb-8">
              Connect with our expert counselors for personalized advice and detailed career path analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-xl transition-colors">
                Book Counseling Session
              </button>
              <button
                onClick={() => setStepIndex(0)}
                className="border border-white/10 hover:bg-white/5 font-medium px-8 py-3 rounded-xl transition-colors"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Assessment steps ──────────────────────────────────────────────────────
  const currentStep = steps[stepIndex];

  return (
    <div className="min-h-screen bg-background p-6 md:p-16 flex flex-col items-center">
      <ProgressBar progress={currentStep.progress} stepTitle={currentStep.title} />

      <div className="w-full flex-grow flex flex-col items-center justify-center">
        <QuestionStep
          question={currentStep.question}
          options={currentStep.options}
          isMultiple={currentStep.isMultiple}
          selections={answers[currentStep.id]}
          onSelect={handleSelect}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto mt-12 flex justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-textMuted hover:text-white transition-colors py-3 px-6 rounded-xl border border-white/5 hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`flex items-center gap-2 font-medium py-3 px-8 rounded-xl transition-all duration-300 ${
            isNextDisabled
              ? 'bg-secondary text-textMuted cursor-not-allowed opacity-50'
              : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
          }`}
        >
          <span>{stepIndex === steps.length - 1 ? 'Get Recommendations' : 'Next'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SubjectAdvisorPage;
