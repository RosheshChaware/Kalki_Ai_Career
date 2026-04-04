import React from 'react';
import { ArrowLeft, FileClock, BrainCircuit } from 'lucide-react';

const PracticeQuestionsPage = ({ onClose, onOpenPyq, onOpenQuiz }) => {
  const cards = [
    {
      id: 1,
      icon: FileClock,
      title: 'PYQ Practice',
      description: 'Real previous year questions',
      buttonText: 'Start Practice',
      onClick: onOpenPyq,
    },
    {
      id: 2,
      icon: BrainCircuit,
      title: 'Adaptive Quiz',
      description: 'AI-based personalized questions',
      buttonText: 'Start Quiz',
      onClick: onOpenQuiz,
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-[#0A0A0F]/85 backdrop-blur-xl border-b border-[#ffffff0A] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[#1C1C24] border border-[#ffffff0A] flex items-center justify-center hover:bg-[#252530] hover:text-white transition-all group"
            >
              <ArrowLeft size={20} className="text-gray-400 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Practice Questions</h1>
              <p className="text-xs text-gray-400 mt-0.5">Test your knowledge and skills</p>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT (Centered Layout) */}
      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 py-12 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id} 
                className="bg-[#1C1C24] rounded-[24px] p-8 border border-[#ffffff0A] flex flex-col items-center text-center hover:border-indigo-500/30 transition-all duration-300 shadow-lg group relative overflow-hidden"
              >
                {/* Subtle top glow on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#252530] to-[#1C1C24] border border-[#ffffff0A] flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-all duration-500">
                  <Icon size={28} className="text-indigo-400" />
                </div>
                
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{card.title}</h2>
                <p className="text-gray-400 text-sm mb-8 line-clamp-1">{card.description}</p>
                
                <div className="mt-auto w-full">
                  <button 
                    onClick={card.onClick}
                    className="w-full py-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-600 border-transparent text-indigo-400 hover:text-white text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95"
                  >
                    {card.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default PracticeQuestionsPage;
