import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, FileText, ExternalLink, CheckCircle2, XCircle,
  ArrowRight, RotateCcw, Loader2, AlertCircle, RefreshCw,
  ChevronDown, ChevronUp, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../lib/firestoreService';

const API_URL = import.meta.env.VITE_API_URL;

const difficultyColors = {
  Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const PyqPracticePage = ({ onClose, aiResult: freshResult }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [papers, setPapers] = useState([]);
  const [mode, setMode] = useState('solve'); // 'solve' | 'papers'
  const [pyqMeta, setPyqMeta] = useState({ goal: '', cls: '' });

  // Quiz interaction state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});

  const fetchPyq = async () => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setPapers([]);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowExplanation({});

    try {
      let goal = '', subjects = [], weakTopics = [], currentClass = '';

      if (freshResult?.inputData) {
        const d = freshResult.inputData;
        goal = d.targetGoal || '';
        subjects = [...(d.strongSubjectsAll || []), ...(d.weakSubjectsAll || [])];
        weakTopics = d.weakTopicsAll || [];
        currentClass = d.currentClass || '';
      } else if (user) {
        const userData = await getUserData(user.uid);
        if (userData) {
          goal = userData.goal || '';
          subjects = [...(userData.strongSubjects || []), ...(userData.weakSubjects || [])];
          weakTopics = userData.weakTopics || [];
          currentClass = userData.class || '';
        }
      }

      if (!goal) {
        setError('No learning goal found. Please complete onboarding first.');
        return;
      }

      setPyqMeta({ goal, cls: currentClass });

      const res = await fetch(`${API_URL}/api/v1/content/pyq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, subjects, weakTopics, currentClass }),
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
      setPapers(data.papers || []);
    } catch (e) {
      console.error('[PyqPractice] Error:', e.message);
      setError(e.message || 'Unable to load PYQ content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPyq(); }, [user, freshResult]);

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }));
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) setCurrentQIndex(currentQIndex + 1);
    else setIsSubmitted(true);
  };

  const calculateScore = () =>
    questions.reduce((s, q, i) => selectedAnswers[i] === q.correct ? s + 1 : s, 0);

  const score = isSubmitted ? calculateScore() : 0;
  const scorePercent = isSubmitted && questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200 font-sans selection:bg-indigo-500/30">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-[#0A0A0F]/85 backdrop-blur-xl border-b border-[#ffffff0A] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[#1C1C24] border border-[#ffffff0A] flex items-center justify-center hover:bg-[#252530] transition-all group"
            >
              <ArrowLeft size={20} className="text-gray-400 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Previous Year Questions</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                AI-generated PYQ-style practice for {pyqMeta.goal || '...'}
              </p>
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

      {/* LOADING */}
      {loading && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
            <Loader2 size={32} className="text-indigo-400 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">AI is generating PYQ practice...</p>
            <p className="text-gray-400 text-sm mt-1">Creating exam-style questions for {pyqMeta.goal || 'your goal'}</p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Unable to load content</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={fetchPyq}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && (
        <main className="max-w-[800px] mx-auto px-6 py-10">

          {/* SOLVE MODE */}
          {mode === 'solve' && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto">
              {questions.length === 0 ? (
                <p className="text-gray-500 text-center py-20">No questions available. Try refreshing.</p>
              ) : isSubmitted ? (
                /* RESULTS */
                <div className="bg-[#1C1C24] rounded-3xl border border-[#ffffff0A] shadow-2xl overflow-hidden">
                  <div className={`p-10 text-center ${scorePercent >= 70 ? 'bg-gradient-to-b from-green-500/10 to-transparent' : scorePercent >= 40 ? 'bg-gradient-to-b from-yellow-500/10 to-transparent' : 'bg-gradient-to-b from-red-500/10 to-transparent'}`}>
                    <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center border-4 ${scorePercent >= 70 ? 'border-green-500/50 bg-green-500/10' : scorePercent >= 40 ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                      <span className="text-4xl font-black text-white">{scorePercent}%</span>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">Practice Complete!</h2>
                    <p className="text-gray-400 mb-6">
                      You answered <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span> correctly
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={fetchPyq}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2"
                      >
                        <RotateCcw size={18} /> New Practice Set
                      </button>
                    </div>
                  </div>

                  {/* Answer review */}
                  <div className="p-8 border-t border-[#ffffff0A] space-y-5">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2"><BookOpen size={18} className="text-indigo-400" /> Answer Review</h3>
                    {questions.map((q, i) => {
                      const userAns = selectedAnswers[i];
                      const isCorrect = userAns === q.correct;
                      const showExp = showExplanation[i];
                      return (
                        <div key={i} className={`rounded-2xl border p-5 ${isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                          <div className="flex items-start gap-3 mb-2">
                            {isCorrect ? <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" /> : <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />}
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {q.subject && <span className="text-[10px] font-bold text-gray-500 uppercase">{q.subject}</span>}
                                {q.difficulty && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[q.difficulty]}`}>{q.difficulty}</span>}
                                {q.yearHint && <span className="text-[10px] text-gray-500 italic">{q.yearHint}</span>}
                              </div>
                              <p className="text-white text-sm font-medium leading-relaxed">{q.text}</p>
                            </div>
                          </div>
                          {!isCorrect && <p className="text-sm text-green-400 ml-7 mb-1">✓ Correct: <span className="font-bold">{q.options[q.correct]}</span></p>}
                          {!isCorrect && userAns !== undefined && <p className="text-sm text-red-400 ml-7 mb-1">✗ Your answer: <span className="font-bold">{q.options[userAns]}</span></p>}
                          {q.explanation && (
                            <button
                              className="ml-7 text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold mt-1"
                              onClick={() => setShowExplanation(s => ({ ...s, [i]: !s[i] }))}
                            >
                              {showExp ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Explanation
                            </button>
                          )}
                          {showExp && q.explanation && (
                            <p className="ml-7 mt-2 text-xs text-gray-400 leading-relaxed bg-[#1C1C24] p-3 rounded-xl border border-[#ffffff0A]">{q.explanation}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ACTIVE QUESTION */
                <div className="bg-[#1C1C24] p-8 rounded-2xl border border-[#ffffff0A] shadow-lg">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1.5 rounded-lg text-sm border border-indigo-500/10">
                        Question {currentQIndex + 1} of {questions.length}
                      </span>
                      <div className="flex items-center gap-2">
                        {questions[currentQIndex]?.subject && (
                          <span className="text-xs text-gray-500 font-semibold">{questions[currentQIndex].subject}</span>
                        )}
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
                    {questions[currentQIndex]?.yearHint && (
                      <p className="text-[11px] text-gray-500 italic mt-2">{questions[currentQIndex].yearHint}</p>
                    )}
                  </div>

                  <h3 className="text-xl text-white font-medium mb-8 leading-relaxed">
                    {questions[currentQIndex].text}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentQIndex].options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full text-left px-5 py-4 rounded-xl border text-[15px] font-medium transition-all ${
                            isSelected
                              ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.15)]'
                              : 'bg-[#252530] border-transparent hover:bg-[#2A2A35] text-gray-300 hover:border-[#ffffff1A]'
                          }`}
                        >
                          <span className="text-xs font-bold mr-3 opacity-60">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={selectedAnswers[currentQIndex] === undefined}
                      className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {currentQIndex === questions.length - 1 ? 'Finish Practice' : 'Next Question'}
                      {currentQIndex !== questions.length - 1 && <ArrowRight size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PAPERS MODE */}
          {mode === 'papers' && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-white text-lg">Official PYQ Papers</h2>
                <button
                  onClick={fetchPyq}
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-semibold"
                >
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {papers.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <p className="font-medium">No papers loaded yet.</p>
                  <p className="text-sm mt-1">Try refreshing or switch to Solve mode.</p>
                </div>
              ) : (
                papers.map((paper, i) => (
                  <a
                    key={i}
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-[#1C1C24] p-5 rounded-2xl border border-[#ffffff0A] hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#252530] text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold mb-0.5">{paper.title}</h3>
                        <p className="text-xs text-gray-400">{paper.exam}</p>
                      </div>
                    </div>
                    <ExternalLink size={18} className="text-gray-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </a>
                ))
              )}
            </div>
          )}

        </main>
      )}
    </div>
  );
};

export default PyqPracticePage;
