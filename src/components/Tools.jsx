import React from 'react';
import { Book, GraduationCap, TrendingUp, NotebookTabs, Brain } from 'lucide-react';

const Tools = ({ onOpenExplorer, onOpenCareerOutcomes, onOpenLearningPage, onOpenStudyMaterials }) => {
  const tools = [
    {
      icon: <Book className="w-6 h-6 text-primary" />,
      title: "Subject Advisor",
      description: "Get personalized recommendations for subject combinations based on your interests and career goals.",
      onClick: null // Could map to subject advisor if needed
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-primary" />,
      title: "College Explorer",
      description: "Discover local government colleges, courses, and admission requirements tailored to your preferences.",
      onClick: onOpenExplorer
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Career Outcomes",
      description: "Understand job prospects, salary expectations, and skill requirements for different career paths.",
      onClick: onOpenCareerOutcomes
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "Learning Profile",
      description: "View your AI-powered personalized learning roadmap, performance analysis, and smart recommendations.",
      onClick: onOpenLearningPage
    },
    {
      icon: <NotebookTabs className="w-6 h-6 text-primary" />,
      title: "Resource Library",
      description: "Access free e-books, study materials, and skill development resources to support your journey.",
      onClick: onOpenStudyMaterials
    }
  ];

  return (
    <section className="py-24 px-8 flex flex-col items-center">
      <div className="text-center max-w-3xl mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything You Need to Plan Your Future</h2>
        <p className="text-textMuted text-base md:text-lg">
          Comprehensive tools and resources to help you make informed decisions about your education and career path.
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
