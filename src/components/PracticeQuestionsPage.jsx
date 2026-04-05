import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileClock, BrainCircuit, Sparkles, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../lib/firestoreService';

// Goal-specific hints shown on the Practice landing page
const GOAL_PRACTICE_META = {
  'Engineering (JEE)': {
    emoji: '⚛️',
    tip: 'Focus on JEE PYQs, chapter-wise Physics & Math problems, and timed mock tests.',
    pyqLabel: 'JEE PYQ Papers',
    quizLabel: 'Chapter-wise MCQ Quiz',
  },
  'Medical (NEET)': {
    emoji: '🧬',
    tip: 'Practice NEET Biology MCQs, Chemistry reactions, and Physics numericals.',
    pyqLabel: 'NEET PYQ Papers',
    quizLabel: 'Subject-wise MCQ Quiz',
  },
  'UPSC / Civil Services': {
    emoji: '🏛️',
    tip: 'Solve Prelims GS MCQs, essay topics, and current affairs-based questions.',
    pyqLabel: 'UPSC Prelims PYQs',
    quizLabel: 'GS MCQ Practice',
  },
  'CA / CS': {
    emoji: '📊',
    tip: 'Practice ICAI mock papers, GST numericals, and corporate law MCQs.',
    pyqLabel: 'ICAI Past Papers',
    quizLabel: 'Accounts & Law Quiz',
  },
  'Data Science / AI': {
    emoji: '🤖',
    tip: 'Solve Python challenges, SQL queries, and statistics problem sets.',
    pyqLabel: 'Data Science Challenges',
    quizLabel: 'Python & SQL Quiz',
  },
  'Software Developer': {
    emoji: '💻',
    tip: 'Practice LeetCode-style problems, system design questions, and CS fundamentals.',
    pyqLabel: 'DSA Problem Sets',
    quizLabel: 'Coding Challenge Quiz',
  },
  'Campus Placement': {
    emoji: '🎯',
    tip: 'Drill aptitude puzzles, logical reasoning, and company-specific coding rounds.',
    pyqLabel: 'Placement Aptitude PYQs',
    quizLabel: 'Aptitude & Coding Quiz',
  },
  'MBA': {
    emoji: '📈',
    tip: 'Practice CAT Quant, VARC, and DILR sections with timed sets.',
    pyqLabel: 'CAT / MBA PYQs',
    quizLabel: 'MBA Entrance Quiz',
  },
  'Law (CLAT / AILET)': {
    emoji: '⚖️',
    tip: 'Practice legal reasoning passages, GK, and English comprehension.',
    pyqLabel: 'CLAT Past Papers',
    quizLabel: 'Legal Reasoning Quiz',
  },
  'Government Exams': {
    emoji: '🏅',
    tip: 'Practice SSC / Banking Reasoning, Quantitative Aptitude, and GK MCQs.',
    pyqLabel: 'SSC / Banking PYQs',
    quizLabel: 'GK & Reasoning Quiz',
  },
  'Defense / NDA': {
    emoji: '🎖️',
    tip: 'Solve NDA Maths, English, and General Knowledge practice papers.',
    pyqLabel: 'NDA Past Papers',
    quizLabel: 'NDA Subject Quiz',
  },
};

const DEFAULT_META = {
  emoji: '📝',
  tip: 'Complete your onboarding to get goal-specific practice recommendations.',
  pyqLabel: 'PYQ Practice',
  quizLabel: 'Adaptive Quiz',
};

const PracticeQuestionsPage = ({ onClose, onOpenPyq, onOpenQuiz }) => {
  const { user } = useAuth();
  const [userGoal, setUserGoal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getUserData(user.uid).then(data => {
      if (data?.goal) setUserGoal(data.goal);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const meta = GOAL_PRACTICE_META[userGoal] || DEFAULT_META;

  const cards = [
    {
      id: 1,
      icon: FileClock,
      title: meta.pyqLabel,
      description: userGoal ? `Previous year questions for ${userGoal}` : 'Real previous year questions',
      buttonText: 'Start Practice',
      onClick: onOpenPyq,
      color: 'from-indigo-600/20 to-indigo-600/5',
      border: 'hover:border-indigo-500/40',
      glow: 'hover:shadow-[0_0_25px_rgba(79,70,229,0.2)]',
    },
    {
      id: 2,
      icon: BrainCircuit,
      title: meta.quizLabel,
      description: userGoal ? `AI-powered quiz aligned to ${userGoal}` : 'AI-based personalized questions',
      buttonText: 'Start Quiz',
      onClick: onOpenQuiz,
      color: 'from-purple-600/20 to-purple-600/5',
      border: 'hover:border-purple-500/40',
      glow: 'hover:shadow-[0_0_25px_rgba(147,51,234,0.2)]',
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
              <p className="text-xs text-gray-400 mt-0.5">
                {userGoal ? `Aligned to your goal: ${userGoal}` : 'Test your knowledge and skills'}
              </p>
            </div>
          </div>
          {userGoal && (
            <div className="hidden sm:flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
              <span className="text-lg">{meta.emoji}</span>
              <span className="text-xs text-indigo-300 font-semibold">{userGoal}</span>
            </div>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 py-10 flex flex-col">

        {/* Goal-aware tip banner */}
        {!loading && (
          <div className={`mb-8 rounded-2xl p-5 flex items-start gap-4 border ${userGoal ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-[#1C1C24] border-[#ffffff0A]'}`}>
            <span className="text-2xl shrink-0">{meta.emoji}</span>
            <div>
              <p className={`font-semibold text-sm ${userGoal ? 'text-indigo-200' : 'text-gray-300'}`}>
                {userGoal ? `Practice Strategy for ${userGoal}` : 'No goal set yet'}
              </p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{meta.tip}</p>
            </div>
            {userGoal && (
              <div className="ml-auto shrink-0">
                <Sparkles size={18} className="text-indigo-400" />
              </div>
            )}
          </div>
        )}

        {/* Practice cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`bg-gradient-to-b ${card.color} rounded-[24px] p-8 border border-[#ffffff0A] ${card.border} flex flex-col items-center text-center ${card.glow} transition-all duration-300 shadow-lg group relative overflow-hidden`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-16 h-16 rounded-2xl bg-[#1C1C24] border border-[#ffffff0A] flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-all duration-500">
                  <Icon size={28} className="text-indigo-400" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{card.title}</h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">{card.description}</p>

                <div className="mt-auto w-full">
                  <button
                    onClick={card.onClick}
                    className="w-full py-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-600 hover:border-transparent text-indigo-400 hover:text-white text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95"
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
