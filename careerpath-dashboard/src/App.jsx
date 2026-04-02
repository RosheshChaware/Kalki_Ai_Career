import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import Statistics from './components/Statistics';
import Tools from './components/Tools';
import SubjectAdvisorPage from './components/SubjectAdvisorPage';

function App() {
  const [showAssessment, setShowAssessment] = useState(false);

  const openAssessment = () => setShowAssessment(true);
  const closeAssessment = () => setShowAssessment(false);

  if (showAssessment) {
    return <SubjectAdvisorPage onClose={closeAssessment} />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <Navbar onStartAssessment={openAssessment} />
      <Hero onStartAssessment={openAssessment} />
      <FeatureCards onStartAssessment={openAssessment} />
      <Statistics />
      <Tools />
    </div>
  );
}

export default App;
