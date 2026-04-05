import React, { useState, useEffect } from 'react';
import {
  FileText, Video, Globe, ArrowLeft, BookOpen, Target, Sparkles,
  ExternalLink, Loader2, AlertCircle, Brain, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserData } from '../lib/firestoreService';

const API_URL = import.meta.env.VITE_API_URL;

// ── Helpers ──────────────────────────────────────────────────────────────────
const getIconForType = (type) => {
  if (type === 'Video') return <Video size={14} />;
  if (type === 'Article') return <Globe size={14} />;
  return <FileText size={14} />;
};

const difficultyColor = (d) => {
  if (d === 'Beginner') return 'text-green-400 bg-green-400/10 border-green-400/20';
  if (d === 'Advanced') return 'text-red-400 bg-red-400/10 border-red-400/20';
  return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
};

const priorityColor = (p) => {
  if (p === 'high') return 'text-red-400 bg-red-400/10';
  if (p === 'low') return 'text-green-400 bg-green-400/10';
  return 'text-yellow-400 bg-yellow-400/10';
};

// ── Resource Card ─────────────────────────────────────────────────────────────
const ResourceCard = ({ item }) => (
  <div className="bg-[#1C1C24] rounded-2xl border border-[#ffffff0A] flex flex-col hover:border-indigo-500/30 transition-all duration-300 group shadow-lg overflow-hidden">
    <div className="h-2 w-full bg-gradient-to-r from-indigo-600/40 via-purple-600/40 to-transparent" />
    <div className="p-5 flex-1 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${difficultyColor(item.difficulty)}`}>
          {getIconForType(item.type)} {item.type}
        </span>
        {item.difficulty && (
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${difficultyColor(item.difficulty)}`}>
            {item.difficulty}
          </span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-bold mb-1 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2">{item.title}</h3>
        {item.subject && <p className="text-[11px] text-indigo-300/70 font-semibold mb-2">{item.subject}</p>}
        <p className="text-sm text-gray-400 line-clamp-3">{item.description}</p>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-400 text-sm font-bold transition-all border border-indigo-500/20 hover:border-transparent"
      >
        {item.type === 'Video' ? 'Watch Video' : 'Read Article'} <ExternalLink size={14} />
      </a>
    </div>
  </div>
);

// ── Topic Card (accordion) ─────────────────────────────────────────────────────
const TopicCard = ({ topic }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#1C1C24] rounded-2xl border border-[#ffffff0A] overflow-hidden transition-all">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-[#ffffff05] transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <span className={`w-2 h-2 rounded-full shrink-0 ${topic.priority === 'high' ? 'bg-red-400' : topic.priority === 'low' ? 'bg-green-400' : 'bg-yellow-400'}`} />
          <div>
            <p className="text-white font-bold leading-tight">{topic.topic}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{topic.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${priorityColor(topic.priority)}`}>
            {topic.priority}
          </span>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#ffffff0A] pt-4 space-y-3">
          <p className="text-gray-300 text-sm leading-relaxed">{topic.explanation}</p>
          {topic.keyPoints?.length > 0 && (
            <ul className="space-y-2">
              {topic.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-indigo-400 mt-0.5">•</span> {pt}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

// ── Section ────────────────────────────────────────────────────────────────────
const Section = ({ title, subtitle, icon: Icon, children }) => (
  <section className="mb-14">
    <div className="flex items-start gap-4 mb-6">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1C1C24] to-[#252530] border border-[#ffffff10] flex items-center justify-center text-indigo-400 shadow-md shrink-0">
        <Icon size={22} />
      </div>
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-indigo-300/70 mt-0.5 font-medium">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const StudyMaterialsPage = ({ onClose, aiResult: freshResult }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);
  const [profileMeta, setProfileMeta] = useState({ goal: '', cls: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let goal = '', cls = '', subjects = [], weakTopics = [], strongSubjects = [];

        // Priority 1: freshResult from onboarding
        if (freshResult?.inputData) {
          const d = freshResult.inputData;
          goal = d.targetGoal || '';
          cls = d.currentClass || '';
          subjects = d.strongSubjectsAll || [];
          weakTopics = d.weakTopicsAll || [];
          strongSubjects = d.strongSubjectsAll || [];
        } else if (user) {
          // Priority 2: Firestore
          const userData = await getUserData(user.uid);
          if (userData) {
            goal = userData.goal || '';
            cls = userData.class || '';
            subjects = [...(userData.strongSubjects || []), ...(userData.weakSubjects || [])];
            weakTopics = userData.weakTopics || [];
            strongSubjects = userData.strongSubjects || [];
          }
        }

        if (!goal) {
          setError('No learning goal found. Please complete onboarding first.');
          return;
        }

        setProfileMeta({ goal, cls });

        const res = await fetch(`${API_URL}/api/v1/content/study-materials`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goal, subjects, weakTopics, strongSubjects, currentClass: cls }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server error (${res.status})`);
        }

        const data = await res.json();
        setContent(data);
      } catch (e) {
        console.error('[StudyMaterials] Error:', e.message);
        setError(e.message || 'Unable to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, freshResult]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200 font-sans selection:bg-indigo-500/30 pb-20">
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
              <h1 className="text-xl font-bold text-white leading-tight flex items-center gap-2">
                Study Materials 📚
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-bold border border-indigo-500/20">
                  AI Generated
                </span>
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {profileMeta.goal
                  ? `Personalized for: ${profileMeta.goal}${profileMeta.cls ? ` · ${profileMeta.cls}` : ''}`
                  : 'AI-curated resources for your profile'}
              </p>
            </div>
          </div>
          {profileMeta.goal && (
            <div className="hidden sm:flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-xs text-indigo-300 font-semibold">{profileMeta.goal}</span>
            </div>
          )}
        </div>
      </header>

      {/* LOADING */}
      {loading && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Loader2 size={32} className="text-indigo-400 animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">AI is curating your materials...</p>
            <p className="text-gray-400 text-sm mt-1">Generating personalized resources for {profileMeta.goal || 'your goal'}</p>
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
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && content && (
        <main className="max-w-[1200px] mx-auto px-6 py-10">

          {/* Study Topics (AI explanations) */}
          {content.studyTopics?.length > 0 && (
            <Section title="AI Topic Explanations" subtitle={`Key concepts for ${profileMeta.goal}`} icon={Brain}>
              <div className="space-y-3">
                {content.studyTopics.map((topic, i) => (
                  <TopicCard key={i} topic={topic} />
                ))}
              </div>
            </Section>
          )}

          {/* Concept Learning (videos) */}
          {content.conceptLearning?.length > 0 && (
            <Section title="Concept Learning" subtitle="Video lectures and foundational resources" icon={Video}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {content.conceptLearning.map((item, i) => (
                  <ResourceCard key={i} item={item} />
                ))}
              </div>
            </Section>
          )}

          {/* Practice Resources */}
          {content.practiceResources?.length > 0 && (
            <Section title="Practice Resources 📝" subtitle="Problems, tests, and interactive exercises" icon={Target}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {content.practiceResources.map((item, i) => (
                  <ResourceCard key={i} item={item} />
                ))}
              </div>
            </Section>
          )}

          {/* Revision Notes */}
          {content.revisionNotes?.length > 0 && (
            <Section title="Revision Notes" subtitle="Quick references and cheat sheets" icon={BookOpen}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {content.revisionNotes.map((item, i) => (
                  <ResourceCard key={i} item={item} />
                ))}
              </div>
            </Section>
          )}
        </main>
      )}
    </div>
  );
};

export default StudyMaterialsPage;
