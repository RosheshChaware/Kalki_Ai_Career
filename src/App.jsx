import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import Statistics from './components/Statistics';
import Tools from './components/Tools';
import SubjectAdvisorPage from './components/SubjectAdvisorPage';
import CollegeExplorerPage from './components/CollegeExplorerPage';
import AuthPage from './components/auth/AuthPage';
import { useAuth } from './context/AuthContext';
import CareerOutcomesPage from './components/CareerOutcomesPage';
import CareerDetailsPage from './components/CareerDetailsPage';
import PersonalizedLearningPage from './components/PersonalizedLearningPage';
import OnboardingFlow from './components/OnboardingFlow';
import StudyMaterialsPage from './components/StudyMaterialsPage';
import PracticeQuestionsPage from './components/PracticeQuestionsPage';
import PyqPracticePage from './components/PyqPracticePage';
import AdaptiveQuizPage from './components/AdaptiveQuizPage';

function App() {
  const { user } = useAuth();

  const [showAssessment, setShowAssessment] = useState(false);
  const [showCollegeExplorer, setShowCollegeExplorer] = useState(false);
  const [showCareerOutcomes, setShowCareerOutcomes] = useState(false);
  const [showCareerDetails, setShowCareerDetails] = useState(false);
  const [showLearningPage, setShowLearningPage] = useState(false);
  const [showStudyMaterials, setShowStudyMaterials] = useState(false);
  const [showPracticeQuestions, setShowPracticeQuestions] = useState(false);
  const [showPyq, setShowPyq] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [aiResult, setAiResult] = useState(null); // holds fresh AI result after analysis

  const openAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const closeAuth = () => setShowAuth(false);

  // If user clicks "Start Assessment", require login first
  const openAssessment = () => {
    if (user) {
      setShowAssessment(true);
    } else {
      openAuth('signin');
    }
  };

  const closeAssessment = () => setShowAssessment(false);

  const openCollegeExplorer = () => setShowCollegeExplorer(true);
  const closeCollegeExplorer = () => setShowCollegeExplorer(false);

  const openCareerOutcomes = () => setShowCareerOutcomes(true);
  const closeCareerOutcomes = () => setShowCareerOutcomes(false);

  const openCareerDetails = () => setShowCareerDetails(true);
  const closeCareerDetails = () => setShowCareerDetails(false);

  const openStudyMaterials = () => setShowStudyMaterials(true);
  const closeStudyMaterials = () => setShowStudyMaterials(false);

  const openPracticeQuestions = () => setShowPracticeQuestions(true);
  const closePracticeQuestions = () => setShowPracticeQuestions(false);

  const openPyq = () => setShowPyq(true);
  const closePyq = () => setShowPyq(false);

  const openQuiz = () => setShowQuiz(true);
  const closeQuiz = () => setShowQuiz(false);

  const pendingRedirect = useRef(null);

  const openLearningPage = () => {
    if (user) {
      const done = localStorage.getItem(`onboarding_complete_${user.uid}`);
      if (done) {
        setShowLearningPage(true);
      } else {
        setShowOnboarding(true);
      }
    } else {
      pendingRedirect.current = 'learning';
      openAuth('signin');
    }
  };
  const closeLearningPage = () => setShowLearningPage(false);

  // After successful login, redirect to pending page
  useEffect(() => {
    if (user && pendingRedirect.current === 'learning') {
      pendingRedirect.current = null;
      setShowAuth(false);
      const done = localStorage.getItem(`onboarding_complete_${user.uid}`);
      if (done) {
        setShowLearningPage(true);
      } else {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  // On sign-out, clear all dashboard/onboarding state
  useEffect(() => {
    if (!user) {
      setShowLearningPage(false);
      setShowOnboarding(false);
      setShowAssessment(false);
    }
  }, [user]);

  if (showAssessment) {
    return <SubjectAdvisorPage onClose={closeAssessment} />;
  }

  if (showCollegeExplorer) {
    return <CollegeExplorerPage onClose={closeCollegeExplorer} />;
  }

  if (showCareerOutcomes) {
    return <CareerOutcomesPage onClose={closeCareerOutcomes} />;
  }

  if (showCareerDetails) {
    return <CareerDetailsPage onClose={closeCareerDetails} />;
  }

  if (showStudyMaterials) {
    return <StudyMaterialsPage onClose={closeStudyMaterials} aiResult={aiResult} />;
  }

  if (showPyq) {
    return <PyqPracticePage onClose={closePyq} aiResult={aiResult} />;
  }

  if (showQuiz) {
    return <AdaptiveQuizPage onClose={closeQuiz} aiResult={aiResult} />;
  }

  if (showPracticeQuestions) {
    return (
      <PracticeQuestionsPage 
        onClose={closePracticeQuestions} 
        onOpenPyq={openPyq} 
        onOpenQuiz={openQuiz}
      />
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow
        userId={user?.uid}
        onComplete={(payload) => {
          setAiResult(payload);        // store fresh AI result in memory
          setShowOnboarding(false);
          setShowLearningPage(true);
        }}
        onClose={() => setShowOnboarding(false)}
      />
    );
  }

  if (showLearningPage) {
    return <PersonalizedLearningPage
      aiResult={aiResult}          // pass fresh result or null for returning users
      onClose={closeLearningPage}
      onOpenStudyMaterials={openStudyMaterials}
      onOpenPracticeQuestions={openPracticeQuestions}
      onOpenCareerDetails={openCareerDetails}
      onReanalyze={() => {
        if (user) localStorage.removeItem(`onboarding_complete_${user.uid}`);
        setAiResult(null);          // clear cached result so dashboard re-fetches
        setShowLearningPage(false);
        setShowOnboarding(true);
      }}
    />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <Navbar
        onStartAssessment={openAssessment}
        onOpenExplorer={openCollegeExplorer}
        onOpenCareerOutcomes={openCareerOutcomes}
        onOpenLearningPage={openLearningPage}
        onOpenSignIn={() => openAuth('signin')}
        onOpenSignUp={() => openAuth('signup')}
      />
      <Hero onStartJourney={openLearningPage} />
      <FeatureCards onStartAssessment={openAssessment} />
      <Statistics />
      <Tools 
        onOpenExplorer={openCollegeExplorer} 
        onOpenCareerOutcomes={openCareerOutcomes} 
        onOpenLearningPage={openLearningPage}
        onOpenStudyMaterials={openStudyMaterials}
      />

      {/* Auth modal */}
      {showAuth && (
        <AuthPage
          defaultMode={authMode}
          onSuccess={() => {
            closeAuth();
          }}
          onClose={closeAuth}
        />
      )}
    </div>
  );
}

export default App;
