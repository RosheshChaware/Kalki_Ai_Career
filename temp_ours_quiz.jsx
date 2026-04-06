import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, BrainCircuit, CheckCircle2, XCircle, RefreshCw, Zap,
  AlertCircle, BookOpen, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../lib/firestoreService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const difficultyColors = {
  Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const AdaptiveQuizPage = ({ onClose, aiResult }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizMeta, setQuizMeta] = useState({ goal: '', subject: '' });

  // Quiz interaction state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowExplanation({});

    try {
      let goal = '', weakSubject = '', subjects = [], currentClass = '';

      if (aiResult?.inputData) {
        const d = aiResult.inputData;
        goal = d.targetGoal || '';
        weakSubject = aiResult?.aiOutput?.weakSubjects?.[0]?.subject || '';
        subjects = d.strongSubjectsAll || [];
        currentClass = d.currentClass || '';
      } else if (user) {
        const userData = await getUserData(user.uid);
        if (userData) {
          goal = userData.goal || '';
          subjects = [...(userData.weakSubjects || []), ...(userData.strongSubjects || [])];
          currentClass = userData.class || '';
          weakSubject = userData.weakSubjects?.[0] || '';
        }
      }

      if (!goal) {
        setError('No learning goal found. Please complete onboarding first.');
        return;
      }

      setQuizMeta({ goal, subject: weakSubject || subjects[0] || 'General' });

      const res = await fetch(`${API_URL}/api/v1/content/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, weakSubject, subjects, currentClass }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error('AI returned no questions. Please try again.');
      }
      setQuestions(data.questions);
      if (data.subject) setQuizMeta(m => ({ ...m, subject: data.subject }));
    } catch (e) {
      console.error('[AdaptiveQuiz] Error:', e.message);
      setError(e.message || 'Unable to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, aiResult]);

  useEffect(() => { fetchQuiz(); }, [fetchQuiz]);

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
    return questions.reduce((score, q, i) => selectedAnswers[i] === q.correct ? score + 1 : score, 0);
  };

  const score = isSubmitted ? calculateScore() : 0;
  const scorePercent = isSubmitted ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-[#0A0A0F]/85 backdrop-blur-xl border-b border-[#ffffff0A] shadow-sm">
        <div className="max-w-[900px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[#1C1C24] border border-[#ffffff0A] flex items-center justify-center hover:bg-[#252530] transition-all group"
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
              <p className="text-xs text-gray-400">
                {quizMeta.goal ? `${quizMeta.goal} ┬╖ Focus: ${quizMeta.subject}` : 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* LOADING */}
      {loading && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
            <BrainCircuit size={32} className="text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">AI is crafting your quiz...</p>
            <p className="text-gray-400 text-sm mt-1">Generating {quizMeta.goal || ''} questions</p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Unable to load quiz</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={fetchQuiz}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      )}

      {/* QUIZ */}
      {!loading && !error && questions.length > 0 && (
        <main className="max-w-[800px] mx-auto px-6 py-12">

          {/* RESULTS */}
          {isSubmitted ? (
            <div className="bg-[#1C1C24] rounded-3xl border border-[#ffffff0A] shadow-2xl overflow-hidden">
              <div className={`p-10 text-center ${scorePercent >= 70 ? 'bg-gradient-to-b from-green-500/10 to-transparent' : scorePercent >= 40 ? 'bg-gradient-to-b from-yellow-500/10 to-transparent' : 'bg-gradient-to-b from-red-500/10 to-transparent'}`}>
                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center border-4 ${scorePercent >= 70 ? 'border-green-500/50 bg-green-500/10' : scorePercent >= 40 ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                  <span className="text-4xl font-black text-white">{scorePercent}%</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2">
                  {scorePercent >= 70 ? '≡ƒÄë Excellent Work!' : scorePercent >= 40 ? '≡ƒæì Good Effort!' : '≡ƒôÜ Keep Practicing!'}
                </h2>
                <p className="text-gray-400 mb-2">You scored <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span></p>
                <button
                  onClick={fetchQuiz}
                  className="mt-6 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={16} /> New Quiz
                </button>
              </div>

              {/* Answer Review */}
              <div className="p-8 space-y-6 border-t border-[#ffffff0A]">
                <h3 className="font-bold text-white text-lg flex items-center gap-2"><BookOpen size={18} className="text-indigo-400" /> Answer Review</h3>
                {questions.map((q, i) => {
                  const userAns = selectedAnswers[i];
                  const isCorrect = userAns === q.correct;
                  const showExp = showExplanation[i];
                  return (
                    <div key={i} className={`rounded-2xl border p-5 ${isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                      <div className="flex items-start gap-3 mb-3">
                        {isCorrect ? <CheckCircle2 size={20} className="text-green-400 shrink-0 mt-0.5" /> : <XCircle size={20} className="text-red-400 shrink-0 mt-0.5" />}
                        <p className="text-white font-medium text-sm leading-relaxed">{q.text}</p>
                      </div>
                      {!isCorrect && <p className="text-sm text-green-400 mb-1 ml-8">Γ£ô Correct: <span className="font-bold">{q.options[q.correct]}</span></p>}
                      {!isCorrect && userAns !== undefined && <p className="text-sm text-red-400 mb-2 ml-8">Γ£ù Your answer: <span className="font-bold">{q.options[userAns]}</span></p>}
                      {q.explanation && (
                        <button
                          className="ml-8 text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                          onClick={() => setShowExplanation(s => ({ ...s, [i]: !s[i] }))}
                        >
                          {showExp ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Explanation
                        </button>
                      )}
                      {showExp && q.explanation && (
                        <p className="ml-8 mt-2 text-xs text-gray-400 leading-relaxed bg-[#1C1C24] p-3 rounded-xl border border-[#ffffff0A]">{q.explanation}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ACTIVE QUESTION */
            <div className="bg-[#1C1C24] p-8 rounded-3xl border border-[#ffffff0A] shadow-xl">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-lg text-sm border border-indigo-500/10">
                    Q{currentQIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    {questions[currentQIndex]?.difficulty && (
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${difficultyColors[questions[currentQIndex].difficulty]}`}>
                        {questions[currentQIndex].difficulty}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#252530] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-xl text-white font-semibold mb-8 leading-relaxed">
                {questions[currentQIndex].text}
              </h2>

              <div className="space-y-3">
                {questions[currentQIndex].options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left px-5 py-4 rounded-xl border text-[15px] font-medium transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                          : 'bg-[#252530] border-transparent hover:bg-[#2A2A35] text-gray-300 hover:border-[#ffffff1A]'
                      }`}
                    >
                      <span className="text-xs font-bold mr-3 opacity-60">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-end border-t border-[#ffffff0A] pt-6">
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQIndex] === undefined}
                  className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {currentQIndex === questions.length - 1 ? 'See Results' : 'Next Question ΓåÆ'}
                </button>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default AdaptiveQuizPage;
