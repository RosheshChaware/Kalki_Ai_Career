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
import PersonalizedLearningPage from './components/PersonalizedLearningPage';
import OnboardingFlow from './components/OnboardingFlow';

function App() {
  const { user } = useAuth();

  const [showAssessment, setShowAssessment] = useState(false);
  const [showCollegeExplorer, setShowCollegeExplorer] = useState(false);
  const [showCareerOutcomes, setShowCareerOutcomes] = useState(false);
  const [showLearningPage, setShowLearningPage] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

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

  if (showOnboarding) {
    return (
      <OnboardingFlow
        userId={user?.uid}
        onComplete={() => {
          setShowOnboarding(false);
          setShowLearningPage(true);
        }}
        onClose={() => setShowOnboarding(false)}
      />
    );
  }

  if (showLearningPage) {
    return <PersonalizedLearningPage onClose={closeLearningPage} />;
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
