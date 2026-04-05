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
import PixelSpotlightBackground from './components/backgrounds/PixelSpotlightBackground';
import ScholarshipsPage from './components/ScholarshipsPage';
import FloatingAssistant from './components/FloatingAssistant';
import Footer from './components/Footer';
import { checkUserExists } from './lib/firestoreService';

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
  const [showScholarships, setShowScholarships] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [aiResult, setAiResult] = useState(null);
  const [currentSubPage, setCurrentSubPage] = useState('Dashboard');

  const openAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const closeAuth = () => setShowAuth(false);

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

  const openScholarships = () => setShowScholarships(true);
  const closeScholarships = () => setShowScholarships(false);

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

  const openLearningPage = async () => {
    if (user) {
      try {
        const exists = await checkUserExists(user.uid);
        if (exists) {
          setShowLearningPage(true);
          setCurrentSubPage('Dashboard');
        } else {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error('[App] Error checking user:', err);
        setShowOnboarding(true);
      }
    } else {
      pendingRedirect.current = 'learning';
      openAuth('signin');
    }
  };
  const closeLearningPage = () => setShowLearningPage(false);

  useEffect(() => {
    if (user && pendingRedirect.current === 'learning') {
      pendingRedirect.current = null;
      setShowAuth(false);
      (async () => {
        try {
          const exists = await checkUserExists(user.uid);
          if (exists) {
            setShowLearningPage(true);
            setCurrentSubPage('Dashboard');
          } else {
            setShowOnboarding(true);
          }
        } catch {
          setShowOnboarding(true);
        }
      })();
    }
  }, [user]);

  // On sub-page or main view change, Reset sub-page defaults
  useEffect(() => {
    if (!showLearningPage) {
        setCurrentSubPage('Dashboard');
    }
  }, [showLearningPage]);

  useEffect(() => {
    if (!user) {
      setShowLearningPage(false);
      setShowOnboarding(false);
      setShowAssessment(false);
    }
  }, [user]);

  // ── Page renders with FloatingAssistant on all pages EXCEPT the Learning/Roadmap page ──

  if (showAssessment) {
    return <><SubjectAdvisorPage onClose={closeAssessment} /><FloatingAssistant pageContext="roadmap" /></>;
  }

  if (showCollegeExplorer) {
    return <><CollegeExplorerPage onClose={closeCollegeExplorer} /><FloatingAssistant pageContext="career" /></>;
  }

  if (showCareerOutcomes) {
    return <><CareerOutcomesPage onClose={closeCareerOutcomes} /><FloatingAssistant pageContext="career" /></>;
  }

  if (showScholarships) {
    return <><ScholarshipsPage onClose={closeScholarships} /><FloatingAssistant pageContext="scholarships" /></>;
  }

  if (showCareerDetails) {
    return <><CareerDetailsPage onClose={closeCareerDetails} /><FloatingAssistant pageContext="career" /></>;
  }

  if (showStudyMaterials) {
    return <><StudyMaterialsPage onClose={closeStudyMaterials} aiResult={aiResult} /><FloatingAssistant pageContext="study" /></>;
  }

  if (showPyq) {
    return <><PyqPracticePage onClose={closePyq} aiResult={aiResult} /><FloatingAssistant pageContext="quiz" /></>;
  }

  if (showQuiz) {
    return <><AdaptiveQuizPage onClose={closeQuiz} aiResult={aiResult} /><FloatingAssistant pageContext="quiz" /></>;
  }

  if (showPracticeQuestions) {
    return (
      <>
        <PracticeQuestionsPage 
          onClose={closePracticeQuestions} 
          onOpenPyq={openPyq} 
          onOpenQuiz={openQuiz}
        />
        <FloatingAssistant pageContext="quiz" />
      </>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow
        userId={user?.uid}
        userName={user?.displayName || ''}
        userEmail={user?.email || ''}
        onComplete={(payload) => {
          setAiResult(payload);
          setShowOnboarding(false);
          setShowLearningPage(true);
        }}
        onClose={() => setShowOnboarding(false)}
      />
    );
  }

  if (showLearningPage) {
    return (
      <>
        <PersonalizedLearningPage
          aiResult={aiResult}
          onClose={closeLearningPage}
          onOpenStudyMaterials={openStudyMaterials}
          onOpenPracticeQuestions={openPracticeQuestions}
          onOpenCareerDetails={openCareerDetails}
          onReanalyze={() => {
            setAiResult(null);
            setShowLearningPage(false);
            setShowOnboarding(true);
          }}
          onMenuChange={setCurrentSubPage}
        />
        {/* Hide assistant only when internally showing the Roadmap (which has the ShikshaSetu Tutor) */}
        {currentSubPage !== 'Roadmap' && (
            <FloatingAssistant pageContext={currentSubPage === 'Dashboard' ? 'dashboard' : 'career'} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      <PixelSpotlightBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onStartAssessment={openAssessment}
          onOpenExplorer={openCollegeExplorer}
          onOpenCareerOutcomes={openCareerOutcomes}
          onOpenLearningPage={openLearningPage}
          onOpenScholarships={openScholarships}
          onOpenSignIn={() => openAuth('signin')}
          onOpenSignUp={() => openAuth('signup')}
        />
        <Hero onStartJourney={openLearningPage} />
        
        <FeatureCards 
           onStartAssessment={openAssessment} 
           onOpenLearningPage={openLearningPage}
           onOpenScholarships={openScholarships}
        />
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

        {/* Footer */}
        <Footer />
      </div>
      <FloatingAssistant pageContext="home" />
    </div>
  );
}

export default App;
