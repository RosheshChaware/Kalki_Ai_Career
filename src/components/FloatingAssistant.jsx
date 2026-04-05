import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Bot, Sparkles, MessageCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const SUGGESTION_CHIPS = [
  { label: '🗺️ Help with roadmap', message: 'Can you help me plan my study roadmap for upcoming exams?' },
  { label: '🎓 Find scholarships', message: 'What are some scholarships available for Indian students in 2026?' },
  { label: '💼 Career guidance', message: 'Can you guide me on career options after 12th in Science stream?' },
  { label: '📚 Study strategy', message: 'What is the best study strategy for board exam preparation?' },
];

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl rounded-bl-sm px-5 py-3.5 flex items-center gap-2">
      <span className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

const FloatingAssistant = ({ pageContext = 'home' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Hi! 👋 I'm your **Smart AI Assistant**. Ask me about learning paths, careers, scholarships, or study help — I'm powered by Gemini and here to help you succeed!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Show tooltip after 3 seconds if chat was never opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Derive context focus string for the API
  const getContextFocus = useCallback(() => {
    const contextMap = {
      home: 'General academic and career guidance for Indian students',
      dashboard: 'Student progress, weak areas, action plan, and learning analytics',
      roadmap: 'Current roadmap step, adaptation help, and milestone planning',
      career: 'Skills, career growth, roadmap, and industry insights',
      scholarships: 'Scholarship eligibility, deadlines, required documents, and application tips',
      study: 'Study materials, revision strategies, and subject-specific help',
      quiz: 'Quiz preparation, question practice, and performance improvement',
    };
    return contextMap[pageContext] || contextMap.home;
  }, [pageContext]);

  const sendMessage = async (messageText) => {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for the API (exclude the welcome message)
      const historyForApi = updatedMessages
        .filter((_, i) => i > 0) // skip welcome
        .map((msg) => ({ role: msg.role === 'user' ? 'user' : 'model', content: msg.content }));

      // Remove trailing user message from history since it goes as `message`
      if (historyForApi.length > 0 && historyForApi[historyForApi.length - 1].role === 'user') {
        historyForApi.pop();
      }

      const res = await fetch(`${API_URL}/api/v1/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyForApi,
          context: { focus: getContextFocus() },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (err) {
      console.error('[FloatingAssistant] API error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: "I'm sorry, I couldn't connect right now. Please make sure the backend server is running and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleChipClick = (chipMessage) => {
    sendMessage(chipMessage);
  };

  // Simple markdown-like rendering for bold text
  const renderContent = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* ─── Chat Panel ─── */}
      <div
        ref={panelRef}
        className={`fixed bottom-24 right-6 z-[9998] w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-[520px] max-h-[70vh] rounded-3xl border border-white/10 bg-[#0d0d15]/90 backdrop-blur-xl shadow-2xl shadow-purple-500/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-[#1a1a2e] to-[#16162a] shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a2e]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white leading-tight">Smart AI Assistant</h3>
              <p className="text-[11px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Online • Powered by Gemini
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 assistant-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm shadow-lg shadow-purple-500/20'
                      : 'bg-[#1a1a2e] border border-white/5 text-gray-200 rounded-bl-sm'
                  }`}
                >
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-1 last:mb-0">
                      {renderContent(line)}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && <TypingIndicator />}

            {/* Suggestion Chips — show only when there's just the welcome message */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2">
                <p className="text-[11px] text-white/40 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Quick suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTION_CHIPS.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleChipClick(chip.message)}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-white transition-all"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-[#111118] shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-lg shadow-purple-500/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ─── Floating Robot Button ─── */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div className="absolute bottom-full right-0 mb-3 whitespace-nowrap animate-fade-in">
            <div className="bg-[#1a1a2e]/95 backdrop-blur-md text-white text-xs font-medium px-3.5 py-2 rounded-xl border border-white/10 shadow-xl">
              ✨ Ask Smart AI
              <div className="absolute -bottom-1 right-5 w-2.5 h-2.5 bg-[#1a1a2e] border-r border-b border-white/10 rotate-45" />
            </div>
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setShowTooltip(false);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => !isOpen && setShowTooltip(false)}
          className={`group relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl ${
            isOpen
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 rotate-0 shadow-purple-500/30'
              : 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 active:scale-95 assistant-float'
          }`}
        >
          {/* Glow Ring */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 blur-md animate-pulse" />
          )}

          {/* Icon */}
          <div className="relative z-10 transition-transform duration-300">
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <div className="relative">
                <MessageCircle className="w-6 h-6 text-white" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
              </div>
            )}
          </div>

          {/* Online dot */}
          {!isOpen && (
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0d0d15] shadow-sm shadow-green-400/50" />
          )}
        </button>
      </div>

      {/* ─── Scoped Styles ─── */}
      <style>{`
        .assistant-float {
          animation: assistantFloat 3s ease-in-out infinite;
        }
        @keyframes assistantFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .assistant-float:hover {
          animation: none;
        }
        .assistant-scrollbar::-webkit-scrollbar { width: 4px; }
        .assistant-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .assistant-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        .assistant-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
        .animate-fade-in {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default FloatingAssistant;
