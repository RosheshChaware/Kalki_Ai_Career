import React, { useState, useEffect, useRef } from 'react';
import { Target, CheckCircle2, Circle, MessageSquare, Send, RefreshCw, AlertCircle, FileText, CheckCheck, XCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

const AdaptiveRoadmap = ({ aiResult, user }) => {
  const { i18n } = useTranslation();
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([{ role: 'model', content: "Hi! I'm your AI Mentor. Let me know if you need help with any step on your roadmap!" }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Progress inputs
  const [progressInput, setProgressInput] = useState('');
  const [testScore, setTestScore] = useState('');

  // Validation & feedback state
  const [validationError, setValidationError] = useState('');
  const [updateStatus, setUpdateStatus] = useState(null); // null | 'success' | 'error'
  const [updateMessage, setUpdateMessage] = useState('');

  const chatEndRef = useRef(null);

  // Initialize roadmap from AI analysis
  useEffect(() => {
    if (aiResult?.recommendedFocus) {
      const initialRoadmap = aiResult.recommendedFocus.map((focus, index) => ({
        id: `rm_${index}`,
        title: focus.subject,
        status: index === 0 ? 'in-progress' : 'pending',
        priority: focus.priority || 'medium',
        tasks: (focus.actionPlan || []).map((t, i) => ({ id: `t_${index}_${i}`, desc: t, completed: false })),
        aiAdvice: focus.reason
      }));
      setRoadmap(initialRoadmap);
    }
  }, [aiResult]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (updateStatus) {
      const timer = setTimeout(() => {
        setUpdateStatus(null);
        setUpdateMessage('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [updateStatus]);

  const toggleTask = (rmId, taskId) => {
    setRoadmap(prev => prev.map(rm => {
      if (rm.id !== rmId) return rm;
      const tasks = rm.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      const allDone = tasks.length > 0 && tasks.every(t => t.completed);
      return { ...rm, tasks, status: allDone ? 'completed' : 'in-progress' };
    }));
  };

  const validateInputs = () => {
    setValidationError('');

    const trimmedMsg = progressInput.trim();
    const trimmedScore = testScore.trim();

    if (!trimmedMsg && !trimmedScore) {
      setValidationError('Please enter a learning update, a test score, or both before analyzing.');
      return false;
    }

    if (trimmedScore !== '') {
      const scoreNum = parseFloat(trimmedScore);
      if (isNaN(scoreNum)) {
        setValidationError('Test score must be a valid number (e.g., 72).');
        return false;
      }
      if (scoreNum < 0 || scoreNum > 100) {
        setValidationError('Test score must be between 0 and 100.');
        return false;
      }
    }

    return true;
  };

  const submitProgressUpdate = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setUpdateStatus(null);
    setUpdateMessage('');

    try {
      const payload = {
        currentRoadmap: roadmap,
        userContext: { ...aiResult, language: i18n.language },
        newProgress: {
          experience: progressInput.trim(),
          testScore: testScore.trim(),
          subject: aiResult?.weakSubjects?.[0]?.subject || aiResult?.recommendedFocus?.[0]?.subject || 'General'
        }
      };

      let res;
      let errData = {};

      try {
        res = await fetch(`${API_URL}/api/v1/roadmap/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          errData = await res.json().catch(() => ({}));
        }
      } catch {
        setUpdateStatus('error');
        setUpdateMessage('Could not reach the server. Make sure the backend is running on port 5000.');
        return;
      }

      if (!res.ok) {
        setUpdateStatus('error');
        setUpdateMessage(errData.error || `Server error (${res.status}). Please try again.`);
        return;
      }

      const data = await res.json();

      if (!data.roadmap || !Array.isArray(data.roadmap) || data.roadmap.length === 0) {
        setUpdateStatus('error');
        setUpdateMessage('The AI returned an unexpected response. Please try again with more detail.');
        return;
      }

      setRoadmap(data.roadmap);
      setProgressInput('');
      setTestScore('');
      setUpdateStatus('success');

      // Build a summary message
      const scoreHint = testScore.trim() ? ` based on your ${testScore}% score` : '';
      const msgHint = progressInput.trim() ? ` and your update about "${progressInput.trim().slice(0, 40)}${progressInput.trim().length > 40 ? '...' : ''}"` : '';
      setUpdateMessage(`Roadmap adapted${scoreHint}${msgHint}! ${data.roadmap.length} new milestones generated.`);

    } catch (err) {
      console.error('Unexpected error:', err);
      setUpdateStatus('error');
      setUpdateMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const newChat = [...chatHistory, { role: 'user', content: chatInput }];
    setChatHistory(newChat);
    setChatInput('');
    setChatLoading(true);

    try {
      let res;
      let errData = {};
      try {
        res = await fetch(`${API_URL}/api/v1/roadmap/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: chatInput,
            history: chatHistory,
            context: {
              focus: roadmap.find(r => r.status === 'in-progress')?.title || 'General',
              weakness: aiResult?.weakSubjects?.[0]?.subject,
              language: i18n.language
            }
          })
        });
        if (!res.ok) errData = await res.json().catch(() => ({}));
      } catch {
        setChatHistory([...newChat, { role: 'model', content: 'I could not reach the server right now. Please check your connection and try again.' }]);
        return;
      }

      if (!res.ok) {
        setChatHistory([...newChat, { role: 'model', content: errData.error || 'Something went wrong. Please try again.' }]);
        return;
      }

      const data = await res.json();
      if (data.reply) {
        setChatHistory([...newChat, { role: 'model', content: data.reply }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory([...newChat, { role: 'model', content: 'An unexpected error occurred. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'high') return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (p === 'medium') return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    return 'text-green-400 bg-green-400/10 border-green-400/20';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">

      {/* ── LEFT & CENTER: TIMELINE & PROGRESS (Takes 65%) ── */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-10">

        {/* Dynamic Update Box */}
        <div className="bg-[#111116] border border-[#ffffff0A] rounded-2xl p-6 shadow-md shrink-0">
          <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
            <Target size={20} className="text-indigo-400" /> Update &amp; Adapt Roadmap
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            Tell the AI how you are doing or input a recent test score to re-calibrate your learning path automatically.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="e.g. 'I am struggling with integration formulas...'"
              value={progressInput}
              onChange={e => { setProgressInput(e.target.value); setValidationError(''); }}
              disabled={loading}
              className="flex-1 bg-[#1C1C24] border border-[#ffffff10] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
            <input
              type="number"
              placeholder="Test Score %"
              value={testScore}
              onChange={e => { setTestScore(e.target.value); setValidationError(''); }}
              disabled={loading}
              min="0"
              max="100"
              className="w-36 bg-[#1C1C24] border border-[#ffffff10] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4">
              <XCircle size={16} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Success / Error Feedback */}
          {updateStatus === 'success' && (
            <div className="flex items-start gap-2 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3 mb-4">
              <CheckCheck size={16} className="shrink-0 mt-0.5" />
              <span>{updateMessage}</span>
            </div>
          )}
          {updateStatus === 'error' && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4">
              <XCircle size={16} className="shrink-0 mt-0.5" />
              <span>{updateMessage}</span>
            </div>
          )}

          <button
            onClick={submitProgressUpdate}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/20 select-none"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Analyzing &amp; Adapting...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze &amp; Adapt Path
              </>
            )}
          </button>

          {loading && (
            <p className="text-xs text-indigo-400/70 mt-3 italic animate-pulse">
              AI is analyzing your input and generating a personalized roadmap. This may take a few seconds...
            </p>
          )}
        </div>

        {/* Roadmap Timeline */}
        <div className="bg-[#111116] border border-[#ffffff0A] rounded-2xl p-6 shadow-md flex-1">
          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <FileText size={20} className="text-green-400" /> Adaptive Learning Sequencer
          </h2>

          {roadmap.length === 0 ? (
            <p className="text-gray-500 text-sm italic">
              {aiResult ? 'Loading your personalized roadmap...' : 'Complete your learning profile to generate a roadmap.'}
            </p>
          ) : (
            <div className="relative border-l border-indigo-500/20 ml-4 space-y-8 pb-4">
              {roadmap.map((milestone) => (
                <div key={milestone.id} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-[#111116]
                    ${milestone.status === 'completed' ? 'border-green-500' : milestone.status === 'in-progress' ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-gray-600'}`}>
                    {milestone.status === 'completed' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                    {milestone.status === 'in-progress' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />}
                  </div>

                  <div className={`bg-[#1C1C24] border border-[#ffffff0A] rounded-2xl p-5 transition-all ${milestone.status === 'in-progress' ? 'ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'opacity-80'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`font-bold text-lg ${milestone.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>{milestone.title}</h3>
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${getPriorityColor(milestone.priority)}`}>
                        {milestone.priority} Priority
                      </span>
                    </div>

                    <p className="text-xs text-indigo-300 bg-indigo-500/10 px-3 py-2 rounded-lg mb-4 italic flex gap-2">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" /> {milestone.aiAdvice}
                    </p>

                    <div className="space-y-3">
                      {milestone.tasks?.map(task => (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(milestone.id, task.id)}
                          className="flex items-start gap-3 cursor-pointer group"
                        >
                          <button className={`mt-0.5 shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-500 group-hover:text-indigo-400 transition-colors'}`}>
                            {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                          </button>
                          <span className={`text-sm select-none ${task.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{task.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: AI CHATBOT (Takes 35%) ── */}
      <div className="w-full lg:w-[400px] shrink-0 bg-[#111116] border border-[#ffffff0A] rounded-2xl flex flex-col shadow-xl overflow-hidden self-start h-full">
        <div className="bg-[#1C1C24] p-5 border-b border-[#ffffff0A] flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <MessageSquare size={18} />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">EduVeda Tutor</h2>
            <p className="text-[11px] text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online &amp; Context Aware</p>
          </div>
        </div>

        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 custom-scrollbar bg-[#0A0A0F]/50">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-[13px] leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-[#1C1C24] border border-[#ffffff0A] text-gray-200 rounded-bl-sm'
              }`}>
                {msg.content.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1C1C24] border border-[#ffffff0A] rounded-2xl rounded-bl-sm p-4 w-16 flex items-center justify-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-[#1C1C24] border-t border-[#ffffff0A] flex flex-col gap-3 shrink-0">
          <div className="text-center px-2">
            <p className="text-[11px] text-indigo-400 font-medium italic">
              💡 Ask anything about this step — I know your current topic and weak areas.
            </p>
          </div>
          <form onSubmit={sendChatMessage} className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Need help with this topic?"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 min-w-0 bg-[#111116] border border-[#ffffff10] rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-full flex items-center justify-center text-white transition-colors shrink-0 shadow-lg shadow-indigo-600/20"
            >
              <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffffff10; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ffffff20; }
      `}</style>
    </div>
  );
};

export default AdaptiveRoadmap;
