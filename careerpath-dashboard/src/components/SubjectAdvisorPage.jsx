import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, UserCheck, Search, HelpCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionStep';
import RecommendationCard from './RecommendationCard';

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
      title: "Subject Combination Advisor",
      question: "Which subjects do you find most interesting?",
      options: [
        "Mathematics", "Physics", "Chemistry", "Biology", "Economics",
        "History", "Geography", "English Literature", "Psychology", "Computer Science"
      ],
      isMultiple: true,
      progress: 25,
    },
    {
      id: 'career',
      title: "Subject Combination Advisor",
      question: "What type of career are you most interested in?",
      options: [
        "Engineering & Technology", "Medical & Healthcare", "Business & Management",
        "Arts & Creative Fields", "Research & Academia", "Government & Civil Services",
        "Law & Legal Services", "Teaching & Education"
      ],
      isMultiple: false,
      progress: 50,
    },
    {
      id: 'strengths',
      title: "Subject Combination Advisor",
      question: "What are your key strengths?",
      options: [
        "Analytical Thinking", "Creative Problem Solving", "Communication Skills",
        "Leadership Abilities", "Technical Aptitude", "Research Skills", "Teamwork", 
        "Attention to Detail"
      ],
      isMultiple: true,
      progress: 75,
    },
    {
      id: 'learning',
      title: "Subject Combination Advisor",
      question: "How do you prefer to learn?",
      options: [
        "Hands-on & Practical", "Theoretical & Conceptual", "Visual & Graphical", "Discussion & Debate"
      ],
      isMultiple: false,
      progress: 100,
    }
  ];

  const handleNext = () => {
    if (stepIndex < steps.length) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      onClose();
    } else {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSelect = (selectedOptions) => {
    const currentStepId = steps[stepIndex].id;
    setAnswers({
      ...answers,
      [currentStepId]: selectedOptions
    });
  };

  const isNextDisabled = answers[steps[stepIndex]?.id]?.length === 0;

  if (stepIndex >= steps.length) {
    // Result Page
    return (
      <div className="min-h-screen bg-background p-8 md:p-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => setStepIndex(3)} className="text-textMuted flex items-center gap-2 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Assessment</span>
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-surface hover:bg-surface/80 border border-white/10 transition-colors">
              Exit
            </button>
          </div>

          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Personalized Recommendations</h1>
            <p className="text-textMuted text-lg leading-relaxed max-w-2xl mx-auto">
              Based on your responses, here are the subject combinations that align with your interests and goals.
            </p>
          </div>

          <RecommendationCard 
            badge="Best Match"
            title="Science (PCM)"
            description="Perfect for students interested in engineering, technology, and mathematical sciences."
            coreSubjects={["Physics", "Chemistry", "Mathematics"]}
            careerOptions={["Engineering", "Architecture", "Pilot", "Data Science", "Research"]}
            entranceExams={["JEE Main", "JEE Advanced", "BITSAT", "VITEEE"]}
          />

          <RecommendationCard 
            badge="Option 2"
            title="Science (PCB)"
            description="Ideal for students aspiring for careers in medical and life sciences."
            coreSubjects={["Physics", "Chemistry", "Biology"]}
            careerOptions={["Medicine", "Dentistry", "Pharmacy", "Biotechnology", "Nursing"]}
            entranceExams={["NEET", "AIIMS", "State Medical Exams"]}
          />

          <div className="glass-card rounded-3xl p-8 text-center mt-12 bg-primary/5 border-primary/20">
             <h3 className="text-2xl font-bold mb-4">Need More Guidance?</h3>
             <p className="text-textMuted mb-8">Connect with our expert counselors for personalized advice and detailed career path analysis.</p>
             <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-xl transition-colors">Book Counseling Session</button>
                <button className="border border-white/10 hover:bg-white/5 font-medium px-8 py-3 rounded-xl transition-colors">Explore Colleges</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = steps[stepIndex];

  return (
    <div className="min-h-screen bg-background p-6 md:p-16 flex flex-col items-center">
      <ProgressBar 
        progress={currentStep.progress} 
        stepTitle={currentStep.title} 
      />
      
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
              ? "bg-secondary text-textMuted cursor-not-allowed opacity-50" 
              : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          }`}
        >
          <span>{stepIndex === steps.length - 1 ? "Get Recommendations" : "Next"}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SubjectAdvisorPage;
