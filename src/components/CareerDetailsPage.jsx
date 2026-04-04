import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Briefcase, TrendingUp, Award, DollarSign, Building } from 'lucide-react';
import { CAREER_OUTCOMES_DATA } from '../data/careerOutcomesData';

const CareerDetailsPage = ({ onClose }) => {
  const [goal, setGoal] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // 1. Fetch user data from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    let userGoal = 'Other';
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.goal) userGoal = parsed.goal;
      } catch (e) {
        console.error("Error parsing user profile from localStorage", e);
      }
    }
    setGoal(userGoal);

    // 2. Filter career data matching user.goal
    let matchedData = CAREER_OUTCOMES_DATA[userGoal];
    if (!matchedData) {
      const fallbackKey = Object.keys(CAREER_OUTCOMES_DATA).find(
        key => userGoal.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(userGoal.toLowerCase())
      );
      matchedData = CAREER_OUTCOMES_DATA[fallbackKey] || CAREER_OUTCOMES_DATA['Other'];
    }
    setData(matchedData);
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header Navigation */}
      <header className="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#252530] rounded-full transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Personalized Career Alignment</h1>
          <p className="text-[11px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
             <Target size={12} /> Target: {goal}
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        
        <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-500 fade-in">
           <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1C1C24] to-[#252530] border border-[#ffffff0A] shadow-xl flex items-center justify-center mx-auto mb-6">
              <Briefcase size={36} className="text-indigo-400" />
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
             {data.title}
           </h2>
           <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
             Based strictly on your profile setup, here are the real-world metrics and specific outcomes aligned entirely to your goal constraint.
           </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-backwards delay-100">
           
           <div className="bg-[#1C1C24] p-8 rounded-[24px] border border-[#ffffff0A] hover:border-indigo-500/30 transition-colors shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                    <DollarSign size={20} />
                 </div>
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Est. Salary Range</h3>
              </div>
              <p className="text-3xl font-black text-white">{data.salary}</p>
           </div>

           <div className="bg-[#1C1C24] p-8 rounded-[24px] border border-[#ffffff0A] hover:border-indigo-500/30 transition-colors shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Award size={20} />
                 </div>
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Field Success Rate</h3>
              </div>
              <p className="text-3xl font-black text-white">{data.successRate}</p>
           </div>

           <div className="bg-[#1C1C24] p-8 rounded-[24px] border border-[#ffffff0A] hover:border-indigo-500/30 transition-colors shadow-lg md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <TrendingUp size={20} />
                 </div>
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Industry Growth</h3>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-300 leading-relaxed">{data.growth}</p>
           </div>

           <div className="bg-[#1C1C24] p-8 rounded-[24px] border border-[#ffffff0A] hover:border-indigo-500/30 transition-colors shadow-lg md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <Building size={20} />
                 </div>
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Top Target Companies</h3>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-300 leading-relaxed">{data.companies}</p>
           </div>

        </div>
      </main>
    </div>
  );
};

export default CareerDetailsPage;
