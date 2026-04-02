import React from 'react';
import { Book, GraduationCap, TrendingUp, NotebookTabs } from 'lucide-react';

const Tools = () => {
  const tools = [
    {
      icon: <Book className="w-6 h-6 text-primary" />,
      title: "Subject Advisor",
      description: "Get personalized recommendations for subject combinations based on your interests and career goals."
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-primary" />,
      title: "College Explorer",
      description: "Discover local government colleges, courses, and admission requirements tailored to your preferences."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: "Career Outcomes",
      description: "Understand job prospects, salary expectations, and skill requirements for different career paths."
    },
    {
      icon: <NotebookTabs className="w-6 h-6 text-primary" />,
      title: "Resource Library",
      description: "Access free e-books, study materials, and skill development resources to support your journey."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {tools.map((tool, index) => (
          <div key={index} className="glass-card rounded-2xl p-8 flex flex-col">
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
      
      {/* Visual Indicator for the next section seen in screenshot */}
      <div className="mt-40 mb-10 w-full flex flex-col items-center">
         <h2 className="text-3xl font-bold mb-12">Start Exploring Your Options</h2>
      </div>
    </section>
  );
};

export default Tools;
