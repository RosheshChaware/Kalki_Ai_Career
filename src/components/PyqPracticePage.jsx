import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { REAL_PYQ_PAPERS, REAL_MCQS } from '../data/pyqData';

const PyqPracticePage = ({ onClose, aiResult: freshResult }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(freshResult || null);
  const [mode, setMode] = useState('solve'); // 'solve' or 'papers'



  useEffect(() => {
    if (freshResult || !user) return;
    setLoading(true);
    (async () => {
      try {
        const sessionsRef = collection(db, 'results', user.uid, 'sessions');
        const q = query(sessionsRef, orderBy('createdAt', 'desc'), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setData(snap.docs[0].data());
        }
      } catch (e) {
        console.error('[PYQ] Fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, freshResult]);

  // Profile data
  const inputData = data?.inputData;
  const userClass = inputData?.currentClass || 'Class 12';
  const targetGoal = inputData?.targetGoal || 'Engineering (JEE)';

  // Filtering Logic
  const filteredPapers = REAL_PYQ_PAPERS.filter(p => p.exam === targetGoal || p.classLevel === userClass || p.exam === 'General');
  const filteredQuestions = REAL_MCQS.filter(q => q.exam === targetGoal || q.classLevel === userClass || q.exam === 'General');

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: optionIdx }));
  };

  const handleNext = () => {
    if (currentQIndex < filteredQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    filteredQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score += 1;
    });
    return score;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200 font-sans selection:bg-indigo-500/30">
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
              <h1 className="text-xl font-bold text-white leading-tight">Previous Year Questions</h1>
              <p className="text-xs text-gray-400 mt-0.5">Real exam papers for {targetGoal}</p>
            </div>
          </div>
          
          <div className="flex bg-[#1C1C24] p-1 rounded-xl border border-[#ffffff0A]">
            <button 
              onClick={() => setMode('solve')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${mode === 'solve' ? 'bg-[#252530] text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Solve Questions
            </button>
            <button 
              onClick={() => setMode('papers')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${mode === 'papers' ? 'bg-[#252530] text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              View Full Papers
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-[800px] mx-auto px-6 py-10">
        
        {mode === 'solve' && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto">
            {filteredQuestions.length === 0 ? (
              <p className="text-gray-500 text-center py-20">No practice questions available for your current goal.</p>
            ) : isSubmitted ? (
              <div className="bg-[#1C1C24] p-8 rounded-2xl border border-[#ffffff0A] text-center shadow-lg">
                <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 flex items-center justify-center rounded-full mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Practice Complete!</h2>
                <p className="text-gray-400 mb-6">You answered {Object.keys(selectedAnswers).length} out of {filteredQuestions.length} questions.</p>
                <div className="text-5xl font-black text-indigo-400 mb-8">
                  {calculateScore()} <span className="text-2xl text-gray-500">/ {filteredQuestions.length}</span>
                </div>
                <button 
                  onClick={handleRestart}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2 mx-auto"
                >
                  <RotateCcw size={18} />
                  Retry Practice
                </button>
              </div>
            ) : (
              <div className="bg-[#1C1C24] p-8 rounded-2xl border border-[#ffffff0A] shadow-lg">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-indigo-400 font-bold bg-indigo-500/10 px-4 py-1.5 rounded-lg text-sm">
                    Question {currentQIndex + 1} of {filteredQuestions.length}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">{filteredQuestions[currentQIndex].subject}</span>
                </div>
                
                <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">
                  {filteredQuestions[currentQIndex].text}
                </h3>

                <div className="space-y-4">
                  {filteredQuestions[currentQIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left px-6 py-4 rounded-xl border text-[15px] font-medium transition-all ${
                          isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.15)]' 
                          : 'bg-[#252530] border-transparent hover:bg-[#2A2A35] text-gray-300 hover:border-[#ffffff1A]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQIndex] === undefined}
                    className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {currentQIndex === filteredQuestions.length - 1 ? 'Finish Practice' : 'Next Question'}
                    {currentQIndex !== filteredQuestions.length - 1 && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'papers' && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <h2 className="font-bold text-white text-lg mb-6">Full Exam Papers</h2>
            {filteredPapers.map(paper => (
              <a 
                key={paper.id}
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#1C1C24] p-5 rounded-2xl border border-[#ffffff0A] hover:border-indigo-500/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#252530] text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{paper.title}</h3>
                    <p className="text-xs text-gray-400">{paper.exam} • {paper.classLevel}</p>
                  </div>
                </div>
                <div className="text-gray-500 group-hover:text-indigo-400 transition-colors">
                  <Download size={20} />
                </div>
              </a>
            ))}
            {filteredPapers.length === 0 && (
              <p className="text-gray-500 text-center py-10">No full papers currently match your specific goal.</p>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default PyqPracticePage;
