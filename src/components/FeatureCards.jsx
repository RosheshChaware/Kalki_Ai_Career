import React from 'react';
import { Briefcase, UserCircle, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeatureCards = ({ onStartAssessment, onOpenLearningPage, onOpenScholarships }) => {
  const { t } = useTranslation();
  const features = [
    {
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      title: t('featureCards.features.0.title'),
      description: t('featureCards.features.0.description'),
      buttonText: t('featureCards.features.0.buttonText'),
      onClick: onStartAssessment
    },
    {
      icon: <UserCircle className="w-6 h-6 text-primary" />,
      title: t('featureCards.features.1.title'),
      description: t('featureCards.features.1.description'),
      buttonText: t('featureCards.features.1.buttonText'),
      onClick: onOpenLearningPage
    },
    {
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      title: t('featureCards.features.2.title'),
      description: t('featureCards.features.2.description'),
      buttonText: t('featureCards.features.2.buttonText'),
      onClick: onOpenScholarships
    }
  ];

  return (
    <section className="py-16 px-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-12">{t('featureCards.title')}</h2>
      
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
