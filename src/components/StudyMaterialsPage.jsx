import React, { useState, useEffect } from 'react';
import { FileText, Video, Globe, ArrowLeft, BookOpen, Target, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { STUDY_RESOURCES } from '../data/studyResources';

const getIconForType = (type) => {
  switch (type) {
    case 'PDF': return <FileText size={16} />;
    case 'Video': return <Video size={16} />;
    case 'Article': return <Globe size={16} />;
    default: return <FileText size={16} />;
  }
};

const getButtonLabel = (type) => {
  switch (type) {
    case 'PDF': return 'Open PDF';
    case 'Video': return 'Watch on YouTube';
    case 'Article': return 'Read on Web';
    default: return 'Open Resource';
  }
};

const MaterialCard = ({ item }) => {
  return (
    <div className="bg-[#1C1C24] rounded-2xl border border-[#ffffff0A] flex flex-col h-full hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden shadow-lg">
      <div className="h-40 w-full relative overflow-hidden bg-[#252530]">
        {item.thumb ? (
          <img src={item.thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
        )}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1.5 text-white shadow-md border border-white/10">
          {getIconForType(item.type)}
          <span className="text-[10px] font-bold uppercase tracking-wide">{item.type}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-white font-bold mb-2 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2 text-lg">{item.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
        </div>
        <div className="mt-5 pt-4 border-t border-[#ffffff0A]">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center py-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-400 text-sm font-bold transition-all"
          >
            {getButtonLabel(item.type)}
          </a>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, reason, icon: Icon, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <section className="mb-14">
      <div className="flex items-start gap-4 mb-6 pt-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1C1C24] to-[#252530] border border-[#ffffff10] flex items-center justify-center text-indigo-400 shadow-md shrink-0">
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
          {reason && <p className="text-sm text-indigo-300/80 mt-1 font-medium">{reason}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <MaterialCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

const StudyMaterialsPage = ({ onClose, aiResult: freshResult }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(freshResult || null);

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
        console.error('[StudyMaterials] Fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, freshResult]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Curating your personalized resources...</p>
      </div>
    );
  }

  // Smart Selection Logic
  const inputData = data?.inputData;
  const aiOutput = data?.aiOutput;

  // Identify profiles
  let userClass = inputData?.currentClass || '';
  let weakSubject = '';
  // Prioritize AI output weak subject, otherwise pick from user input
  if (aiOutput?.weakSubjects?.length > 0) weakSubject = aiOutput.weakSubjects[0].subject;
  else if (inputData?.weakSubjects?.length > 0) weakSubject = inputData.weakSubjects[0];

  let careerGoal = inputData?.targetGoal || '';

  // Extract relevant topics to match with
  let allFiltered = STUDY_RESOURCES.map(m => {
    let score = 0;
    if (m.tags.includes(weakSubject)) score += 3;
    if (m.tags.includes(careerGoal)) score += 2;
    if (userClass && (m.classes.includes(userClass) || m.classes.includes('All'))) score += 1;
    return { ...m, score };
  })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score);

  if (allFiltered.length === 0) allFiltered = STUDY_RESOURCES; // Fallback to all if completely mismatched

  const conceptItems = allFiltered.filter(m => m.category === 'Concept Learning').slice(0, 3);
  const practiceItems = allFiltered.filter(m => m.category === 'Practice Resources').slice(0, 3);
  const revisionItems = allFiltered.filter(m => m.category === 'Revision Notes').slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200 font-sans selection:bg-indigo-500/30 pb-20">
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
              <h1 className="text-xl font-bold text-white leading-tight flex items-center gap-2">
                Study Materials 📚 <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-bold border border-indigo-500/20">Smart Match</span>
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Resources intelligently tuned to your profile</p>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-[1200px] mx-auto px-6 py-10 mt-2">
        <Section
          title="Concept Learning"
          reason="Detailed lectures and foundational resources"
          icon={Video}
          items={conceptItems}
        />
        <Section
          title="Practice Resources 📝"
          reason="Real problems and interactive sets"
          icon={Target}
          items={practiceItems}
        />
        <Section
          title="Revision Notes"
          reason="Cheat sheets and quick references"
          icon={BookOpen}
          items={revisionItems}
        />
      </main>
    </div>
  );
};

export default StudyMaterialsPage;
