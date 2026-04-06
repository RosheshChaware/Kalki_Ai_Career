import React from 'react';
import { Book, GraduationCap, TrendingUp, NotebookTabs, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Tools = ({ onOpenExplorer, onOpenCareerOutcomes, onOpenLearningPage, onOpenStudyMaterials }) => {
  const { t } = useTranslation();
  const tools = [
    {
      icon: <Book className="w-6 h-6 text-primary" />,
      title: t('tools.cards.0.title'),
      description: t('tools.cards.0.description'),
      onClick: null // Could map to subject advisor if needed
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-primary" />,
      title: t('tools.cards.1.title'),
      description: t('tools.cards.1.description'),
      onClick: onOpenExplorer
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: t('tools.cards.2.title'),
      description: t('tools.cards.2.description'),
      onClick: onOpenCareerOutcomes
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: t('tools.cards.3.title'),
      description: t('tools.cards.3.description'),
      onClick: onOpenLearningPage
    },
    {
      icon: <NotebookTabs className="w-6 h-6 text-primary" />,
      title: t('tools.cards.4.title'),
      description: t('tools.cards.4.description'),
      onClick: onOpenStudyMaterials
    }
  ];

  return (
    <section className="py-24 px-8 flex flex-col items-center">
      <div className="text-center max-w-3xl mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('tools.title')}</h2>
        <p className="text-textMuted text-base md:text-lg">
          {t('tools.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full max-w-7xl">
        {tools.map((tool, index) => (
          <div 
            key={index} 
            onClick={tool.onClick}
            className={`glass-card rounded-2xl p-8 flex flex-col ${tool.onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 transition-all duration-300' : ''}`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              {tool.icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{tool.title}</h3>
            <p className="text-textMuted text-sm leading-relaxed">
              {tool.description}
            </p>
          </div>
        ))}
      </div>
      
    </section>
  );
};

export default Tools;
