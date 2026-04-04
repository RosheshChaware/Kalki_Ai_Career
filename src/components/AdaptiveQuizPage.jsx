import React, { useState, useEffect } from 'react';
import { ArrowLeft, BrainCircuit, CheckCircle2, XCircle, RefreshCw, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { REAL_MCQS } from '../data/pyqData';

const FALLBACK_QUESTIONS = REAL_MCQS.slice(0, 5); // Fallback if API fails

const AdaptiveQuizPage = ({ onClose, aiResult }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(aiResult || null);
  
  // Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchAndGenerate = async () => {
      try {
        setLoading(true);
        setError(null);
        let userData = aiResult;
        
        // Fetch session if not passed
        if (!userData && user) {
          const sessionsRef = collection(db, 'results', user.uid, 'sessions');
          const q = query(sessionsRef, orderBy('createdAt', 'desc'), limit(1));
          const snap = await getDocs(q);
          if (!snap.empty) {
            userData = snap.docs[0].data();
            setData(userData);
          }
        }

        const targetSubject = userData?.aiOutput?.weakSubjects?.[0]?.subject || 'General Knowledge';
        const targetGoal = userData?.inputData?.targetGoal || 'General';

        // Try to hit API
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error("Missing API Key");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Generate exactly 5 adaptive multiple-choice questions for a student preparing for ${targetGoal}, specifically focusing on their weak subject: ${targetSubject}. Return ONLY a valid, minified JSON array of objects. Format: [{"text": "Question text?", "options": ["A", "B", "C", "D"], "correct": 0}] where correct is the integer index (0-3). No markdown formatting or extra text.`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        if (text.startsWith("```json")) {
           text = text.substring(7);
           if(text.endsWith("```")) text = text.substring(0, text.length - 3);
        }
        const generatedQuestions = JSON.parse(text);
        
        // Validate array
        if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) throw new Error("Invalid format");
        setQuestions(generatedQuestions);

      } catch (err) {
        console.warn("API Quiz Generation failed. Using fallback.", err);
        // Fallback System
        setQuestions(FALLBACK_QUESTIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerate();
  }, [user, aiResult]);

  const handleSelectOption = (idx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: idx }));
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) score++;
    });
    return score;
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center animate-pulse">
           <BrainCircuit size={28} className="text-indigo-400" />
        </div>
        <p className="text-gray-400 font-medium">AI is crafting your personalized quiz...</p>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200 font-sans">
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
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Adaptive Quiz
                <span className="bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-black px-2 py-0.5 rounded flex items-center gap-1 border border-indigo-500/20">
                  <Zap size={10} className="fill-indigo-400" /> AI Generated
                </span>
              </h1>
              <p className="text-xs text-gray-400">Targeting: {data?.aiOutput?.weakSubjects?.[0]?.subject || 'General'}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-6 py-12">
        {isSubmitted ? (
          <div className="bg-[#1C1C24] p-10 rounded-3xl border border-[#ffffff0A] text-center shadow-2xl animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-green-500/10 text-green-500 flex items-center justify-center rounded-full mx-auto mb-6">
                <CheckCircle2 size={48} />
             </div>
             <h2 className="text-3xl font-black text-white mb-2">Quiz Completed!</h2>
             <p className="text-gray-400 mb-8">AI analysis of your strong and weak points is stored.</p>
             <div className="text-6xl font-black text-indigo-400 mb-10">
                {calculateScore()} <span className="text-3xl text-gray-500 font-normal">/ {questions.length}</span>
             </div>
             <button 
                onClick={resetQuiz}
                className="px-8 py-3.5 bg-[#252530] hover:bg-[#30303D] text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2 mx-auto border border-[#ffffff0A]"
             >
                <RefreshCw size={18} /> Take Another Quiz
             </button>
          </div>
        ) : (
          <div className="bg-[#1C1C24] p-8 rounded-3xl border border-[#ffffff0A] shadow-xl animate-in fade-in slide-in-from-bottom-5">
             <div className="flex justify-between items-center mb-8">
               <span className="text-indigo-400 font-bold bg-indigo-500/10 px-4 py-1.5 rounded-lg text-sm border border-indigo-500/10">
                 Question {currentQIndex + 1} of {questions.length}
               </span>
               <div className="flex gap-1.5">
                  {questions.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i === currentQIndex ? 'bg-indigo-500' : 'bg-[#ffffff1A]'}`} />
                  ))}
               </div>
             </div>

             <h2 className="text-2xl text-white font-semibold mb-8 leading-relaxed">
               {currentQ.text}
             </h2>

             <div className="space-y-4">
               {currentQ.options.map((opt, idx) => {
                 const isSelected = selectedAnswers[currentQIndex] === idx;
                 return (
                   <button
                     key={idx}
                     onClick={() => handleSelectOption(idx)}
                     className={`w-full text-left px-6 py-4 rounded-xl border text-[15px] font-medium transition-all ${
                       isSelected 
                       ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                       : 'bg-[#252530] border-transparent hover:bg-[#2A2A35] text-gray-300 hover:border-[#ffffff1A]'
                     }`}
                   >
                     {opt}
                   </button>
                 );
               })}
             </div>

             <div className="mt-12 flex justify-end border-t border-[#ffffff0A] pt-6">
                <button 
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQIndex] === undefined}
                  className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {currentQIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
                </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdaptiveQuizPage;
