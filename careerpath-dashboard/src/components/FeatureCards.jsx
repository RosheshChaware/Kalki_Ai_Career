import React from 'react';
import { Briefcase, UserCircle, DollarSign } from 'lucide-react';

const FeatureCards = ({ onStartAssessment }) => {
  const features = [
    {
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      title: "Career Path Finder",
      description: "Take our comprehensive assessment to discover careers that match your interests and strengths.",
      buttonText: "Start Assessment",
      onClick: onStartAssessment
    },
    {
      icon: <UserCircle className="w-6 h-6 text-primary" />,
      title: "Personal Dashboard",
      description: "Track your progress, manage preferences, and get personalized recommendations for your journey.",
      buttonText: "View Profile"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      title: "Scholarship Portal",
      description: "Discover scholarships and financial aid opportunities to support your educational journey.",
      buttonText: "Find Scholarships"
    }
  ];

  return (
    <section className="py-16 px-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-12">Start Exploring Your Options</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {features.map((feature, index) => (
          <div key={index} className="glass-card rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-textMuted text-sm mb-8 flex-grow">
              {feature.description}
            </p>
            <button 
              onClick={feature.onClick}
              className="w-full py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              {feature.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
