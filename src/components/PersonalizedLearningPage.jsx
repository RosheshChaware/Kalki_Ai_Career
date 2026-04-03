import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Brain, TrendingUp, TrendingDown, Target, Clock, AlertTriangle, 
  BookOpen, Code, Lightbulb, CheckCircle2, Circle, Zap, Save, Download, FileText, Mic, Briefcase,
  PanelRightClose, PanelRightOpen, X, Layers, HelpCircle, Volume2
} from 'lucide-react';

// ── Dashboard generator from onboarding data ─────────────────────────────────
function buildDashboard(profile) {
  const strong = profile.strongSubjects || [];
  const weak = profile.weakSubjects || [];
  const weakTopics = profile.weakTopics || [];
  const score = parseInt(profile.testScore) || 0;
  const goal = profile.targetGoal || 'your career goals';
  const confidence = profile.confidence || 'Medium';
  const mistakeType = profile.mistakeType || 'Conceptual';
  const practiceStyle = profile.practiceStyle || 'Mixed';

  let pace = 'On Track';
  if (score >= 85) pace = 'Ahead';
  else if (score < 50) pace = 'Needs Boost';

  const strengthPoints = [];
  if (strong.length > 0) strengthPoints.push(`Strong command of ${strong[0]}`);
  if (confidence === 'High') strengthPoints.push('High self-confidence in problem solving');
  if (strong.length > 1) strengthPoints.push(`Good grasp across ${strong.slice(1).join(', ')}`);
  if (strengthPoints.length === 0) strengthPoints.push('Consistent effort observed');

  const weakPoints = [];
  if (weak.length > 0) weakPoints.push(`Needs improvement in ${weak[0]}`);
  if (weakTopics.length > 0) weakPoints.push(`Struggling with ${weakTopics.slice(0, 2).join(', ')}`);
  if (weak.length > 1) weakPoints.push(`${weak[1]} requires focused attention`);
  if (weakPoints.length === 0) weakPoints.push('No major weaknesses identified');

  const mistakePoints = [];
  if (mistakeType === 'Conceptual') {
    mistakePoints.push('Misunderstanding core principles');
    mistakePoints.push('Confusing similar concepts');
  } else if (mistakeType === 'Calculation') {
    mistakePoints.push('Arithmetic errors under pressure');
    mistakePoints.push('Sign/unit conversion mistakes');
  } else {
    mistakePoints.push('Running out of time on complex questions');
    mistakePoints.push('Spending too long on difficult items');
  }

  const roadmap = [
    { id: 1, title: `${weak[0] || 'Core Concepts'} Foundation Review`, reason: `Your score of ${score}% and weakness in ${weak[0] || 'key areas'} indicates a need for foundational review.`, duration: '1 Week', status: 'completed' },
    { id: 2, title: `${strong[0] || 'Primary Subject'} Advanced Practice`, reason: `Build on your strength in ${strong[0] || 'core subjects'} to reach mastery before exams.`, duration: '2 Weeks', status: 'in-progress' },
    { id: 3, title: `${mistakeType} Error Elimination`, reason: `Targeted drills to reduce ${mistakeType.toLowerCase()} mistakes identified in your performance snapshot.`, duration: '2 Weeks', status: 'upcoming' },
    { id: 4, title: `${goal} Preparation Intensive`, reason: `Final push aligned to your target of ${goal}. Includes mock tests and timed practice.`, duration: '4 Weeks', status: 'upcoming' },
  ];

  const studyMaterials = weak.length > 0
    ? [`${weak[0]} Concept Visualizations`, `${weakTopics[0] || weak[0]} Practice Sheets`]
    : ['Core Subject Review Guides', 'Quick Reference Cards'];
  const practiceItems = strong.length > 0
    ? [`${strong[0]} Advanced Problems`, `Timed ${profile.perfSubject || 'Subject'} Quizzes`]
    : ['Daily Mixed Practice Sets', 'Previous Year Papers'];
  const revisionItems = practiceStyle === 'Theory'
    ? ['Summarize each chapter in notes', 'Flashcard-based revision']
    : practiceStyle === 'Practice'
    ? ['Solve 20 problems daily', 'Track accuracy over time']
    : ['Alternate theory and practice sessions', 'Spaced repetition schedule'];

  const careerMap = {
    'Engineering': 'Software Engineering and Systems Design',
    'Medical': 'Healthcare and Clinical Research',
    'Placement': 'Corporate Tech and Management roles',
    'Higher Studies': 'Research and Academia',
    'Civil Services': 'Public Administration and Policy',
    'Creative / Design': 'UX Design and Creative Direction',
    'Business / MBA': 'Management Consulting and Finance',
  };
  const careerText = careerMap[goal] || 'diverse professional opportunities';

  return { score, pace, strong, weak, strengthPoints, weakPoints, mistakePoints, roadmap, studyMaterials, practiceItems, revisionItems, careerText, goal };
}

// ── Quick Actions data ────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { id: 'save', icon: Save, title: 'Save History', desc: 'Bookmark your current progress snapshot', accent: false },
  { id: 'download', icon: Download, title: 'Download Report', desc: 'Export a PDF of your learning analytics', accent: true },
  { id: 'why', icon: HelpCircle, title: 'Why this path?', desc: 'AI explains your roadmap reasoning', accent: false },
  { id: 'voice', icon: Volume2, title: 'Voice Explanation', desc: 'Listen to an audio summary of your plan', accent: false },
];

// ── Quick Action Card ─────────────────────────────────────────────────────────
const ActionCard = ({ icon: Icon, title, desc, accent }) => (
  <button className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 group ${
    accent
      ? 'bg-primary/10 border-primary/30 hover:bg-primary/20'
      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
  }`}>
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
      accent ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500 group-hover:text-white group-hover:bg-white/10'
    }`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <p className={`text-sm font-semibold ${accent ? 'text-white' : 'text-gray-300 group-hover:text-white'} transition-colors`}>{title}</p>
      <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{desc}</p>
    </div>
  </button>
);

// ── Mobile Bottom Drawer ──────────────────────────────────────────────────────
const MobileDrawer = ({ isOpen, onClose }) => (
  <>
    {/* Backdrop */}
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />
    {/* Drawer */}
    <div className={`fixed bottom-0 left-0 right-0 z-[70] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-[#111] border-t border-white/10 rounded-t-2xl p-5 pb-8 max-h-[70vh] overflow-y-auto">
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Quick Actions
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="space-y-2">
          {QUICK_ACTIONS.map(a => <ActionCard key={a.id} {...a} />)}
        </div>
      </div>
    </div>
  </>
);

// ══════════════════════════════════════════════════════════════════════════════
// ── Main Component ────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

const PersonalizedLearningPage = ({ onClose }) => {
  const { user } = useAuth();
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const profile = useMemo(() => {
    if (!user) return null;
    const raw = localStorage.getItem(`onboarding_data_${user.uid}`);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }, [user]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8">
        <Brain className="w-16 h-16 text-gray-600 mb-6" />
        <h2 className="text-2xl font-bold mb-3">No Learning Data Found</h2>
        <p className="text-gray-400 text-sm text-center max-w-md mb-6">Complete the onboarding assessment to generate your personalized learning roadmap.</p>
        <button onClick={onClose} className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">Go Back</button>
      </div>
    );
  }

  const dash = buildDashboard(profile);
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Learner';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-2 text-xl font-semibold tracking-tight text-primary">
            <Brain className="w-6 h-6" /> ShikshaSetu AI
          </div>
        </div>
        {/* Desktop sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center gap-2 text-xs text-gray-400 hover:text-white px-3 py-2 rounded-lg border border-white/5 hover:bg-white/5 transition-all"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          <span className="hidden xl:inline">{sidebarOpen ? 'Hide Panel' : 'Show Panel'}</span>
        </button>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 w-full">
        {/* ── Top Metrics ── */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Welcome back, {displayName}</h1>
          <p className="text-gray-400 text-sm md:text-base mb-8">Here's a personalized breakdown of your current learning trajectory.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Overall Score', value: `${dash.score}%`, icon: Target, color: 'primary', hover: 'primary/30' },
              { label: 'Weakest Area', value: dash.weak[0] || 'N/A', icon: TrendingDown, color: 'red-500', hover: 'red-500/30' },
              { label: 'Strong Area', value: dash.strong[0] || 'N/A', icon: TrendingUp, color: 'green-500', hover: 'green-500/30' },
              { label: 'Learning Pace', value: dash.pace, icon: Clock, color: 'blue-500', hover: 'blue-500/30' },
            ].map(card => (
              <div key={card.label} className={`bg-[#111] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-${card.hover} transition-colors`}>
                <div className={`w-10 h-10 rounded-full bg-${card.color}/10 flex items-center justify-center text-${card.color} shrink-0`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{card.label}</p>
                  <p className="text-xl font-bold text-white">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main + Sidebar grid ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ════ CENTER CONTENT ════ */}
          <div className="w-full lg:flex-1 space-y-10">
            
            {/* A. Input Panel */}
            <section className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
              <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setIsInputOpen(!isInputOpen)}>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" /> Update Your Performance
                </h2>
                <span className={`text-sm text-gray-400 transition-transform ${isInputOpen ? 'rotate-180' : ''}`}>▼</span>
              </div>
              {isInputOpen && (
                <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                  <p className="text-xs text-gray-400 mb-3">Adjust metrics to allow the AI to recalibrate your roadmap.</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Latest quiz score (e.g. 85%)" className="bg-[#111] border border-white/10 rounded px-3 py-2 text-sm flex-1 outline-none focus:border-primary" />
                    <button className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded hover:bg-primary/90 transition">Update</button>
                  </div>
                </div>
              )}
            </section>

            {/* B. AI Performance Analysis */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <Brain className="w-5 h-5 text-primary" /> AI Performance Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111] border border-green-500/20 rounded-xl p-5 hover:border-green-500/40 transition">
                  <h3 className="text-green-400 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Strengths</h3>
                  <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4 marker:text-green-500">
                    {dash.strengthPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
                <div className="bg-[#111] border border-red-500/20 rounded-xl p-5 hover:border-red-500/40 transition">
                  <h3 className="text-red-400 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4" /> Weak Areas</h3>
                  <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4 marker:text-red-500">
                    {dash.weakPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
                <div className="bg-[#111] border border-yellow-500/20 rounded-xl p-5 hover:border-yellow-500/40 transition">
                  <h3 className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Mistake Patterns</h3>
                  <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4 marker:text-yellow-500">
                    {dash.mistakePoints.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            {/* C. Smart Recommendations */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <Lightbulb className="w-5 h-5 text-primary" /> Smart Recommendations
              </h2>
              <div className="flex flex-col gap-4">
                <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition">
                  <div>
                    <h3 className="text-white font-semibold mb-1 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Study Materials</h3>
                    <p className="text-sm text-gray-400">{dash.studyMaterials.map((m, i) => <span key={i}>• {m}<br/></span>)}</p>
                  </div>
                  <button className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-medium transition-colors w-full md:w-auto">View Library</button>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition">
                  <div>
                    <h3 className="text-white font-semibold mb-1 flex items-center gap-2"><Code className="w-4 h-4 text-primary" /> Practice Questions</h3>
                    <p className="text-sm text-gray-400">{dash.practiceItems.map((m, i) => <span key={i}>• {m}<br/></span>)}</p>
                  </div>
                  <button className="text-sm px-4 py-2 bg-primary hover:bg-primary/90 rounded text-white font-medium transition-colors w-full md:w-auto">Start Quiz</button>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition">
                  <div>
                    <h3 className="text-white font-semibold mb-1 flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Revision Strategy</h3>
                    <p className="text-sm text-gray-400">{dash.revisionItems.map((m, i) => <span key={i}>• {m}<br/></span>)}</p>
                  </div>
                  <button className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-medium transition-colors w-full md:w-auto">Set Reminders</button>
                </div>
              </div>
            </section>

            {/* D. Personalized Learning Roadmap */}
            <section className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  Your Learning Roadmap
                </h2>
                {/* Contextual inline action */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all">
                    <HelpCircle className="w-3.5 h-3.5" /> Why this path?
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all">
                    <Volume2 className="w-3.5 h-3.5" /> Listen
                  </button>
                </div>
              </div>
              
              <div className="relative border-l-2 border-white/10 ml-3 md:ml-4 space-y-12 pb-4">
                {dash.roadmap.map((step, idx) => (
                  <div key={step.id} className="relative pl-8 md:pl-10">
                    <div className="absolute -left-[17px] top-1 bg-[#111] p-1 rounded-full">
                      {step.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-500 bg-[#0a0a0a] rounded-full" />}
                      {step.status === 'in-progress' && <div className="w-6 h-6 border-4 border-primary rounded-full animate-pulse bg-primary/20" />}
                      {step.status === 'upcoming' && <Circle className="w-6 h-6 text-gray-600 bg-[#0a0a0a] rounded-full" />}
                    </div>
                    <div className={`p-5 rounded-xl border transition-all ${
                      step.status === 'in-progress' ? 'bg-primary/10 border-primary/50' : 
                      step.status === 'completed' ? 'bg-[#111] border-green-500/20 opacity-80' : 
                      'bg-[#111] border-white/5 opacity-60'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className={`font-bold text-lg ${step.status === 'in-progress' ? 'text-white' : 'text-gray-300'}`}>{step.title}</h3>
                        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5">{step.duration}</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{step.reason}</p>
                    </div>
                    {idx < dash.roadmap.length - 1 && (
                       <div className="absolute -left-[4px] top-8 bottom-[-48px] w-0.5 bg-gradient-to-b from-transparent to-transparent pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ════ RIGHT SIDEBAR (Desktop — collapsible) ════ */}
          <aside className={`hidden lg:flex flex-col flex-shrink-0 space-y-6 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-[320px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
            
            {/* 1. Quick Actions */}
            <div className="bg-[#111] border border-white/5 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Quick Actions
              </h3>
              <div className="space-y-2">
                {QUICK_ACTIONS.map(a => <ActionCard key={a.id} {...a} />)}
              </div>
            </div>

            {/* 2. Progress Overview */}
            <div className="bg-[#111] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Progress Overview</h3>
              <div className="flex items-end gap-2 h-32 mb-2">
                {[40, 65, 80, 60, Math.min(dash.score, 100)].map((h, i) => (
                  <div key={i} className="w-full bg-white/5 rounded-t-sm flex-1 relative group">
                    <div className="absolute bottom-0 w-full bg-primary/60 rounded-t-sm group-hover:bg-primary/80 transition-all" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] uppercase text-gray-500 font-bold mb-4">
                <span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span><span>Curr</span>
              </div>
              <p className="text-xs text-gray-400 text-center">Current test score: {dash.score}%</p>
            </div>

            {/* 3. Career Alignment */}
            <div className="bg-gradient-to-b from-primary/10 to-[#111] border border-primary/20 rounded-xl p-5 relative overflow-hidden">
              <Briefcase className="absolute -right-4 -top-4 w-24 h-24 text-primary/10 rotate-12" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-3 relative z-10">Career Alignment</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-5 relative z-10">
                Your current learning trajectory strongly connects to future roles in {dash.careerText}.
              </p>
              <button className="w-full py-2.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white font-medium rounded-lg text-sm transition-colors relative z-10">
                View Career Paths
              </button>
            </div>

          </aside>

        </div>
      </main>

      {/* ── Mobile floating action button ── */}
      <button
        onClick={() => setMobileDrawerOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Open Quick Actions"
      >
        <Layers className="w-6 h-6 text-white" />
      </button>

      {/* ── Mobile bottom drawer ── */}
      <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
    </div>
  );
};

export default PersonalizedLearningPage;
