import React, { useState, useRef, useCallback } from 'react';
import { db } from '../firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { GraduationCap, Brain, Clock, BarChart2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
//  Inline SVG Icons
// ─────────────────────────────────────────────────────────────
const CheckIcon    = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>;
const SparkleIcon  = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>;
const ArrowRight   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>;
const ArrowLeft    = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>;
const PlusIcon     = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>;
const TrashIcon    = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>;
const UploadIcon   = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>;
const FileIcon     = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>;

// ─────────────────────────────────────────────────────────────
//  Adaptive data: subjects per goal
// ─────────────────────────────────────────────────────────────
const GOAL_SUBJECTS = {
  'Engineering (JEE)':        ['Mathematics', 'Physics', 'Chemistry'],
  'Medical (NEET)':           ['Biology', 'Physics', 'Chemistry'],
  'Campus Placement':         ['Aptitude', 'Computer Science', 'English', 'Data Structures', 'Mathematics'],
  'Higher Studies (MS/MBA)':  ['Mathematics', 'English', 'Aptitude', 'Economics', 'Statistics'],
  'Civil Services (UPSC)':    ['History', 'Geography', 'Political Science', 'Economics', 'English'],
  'Creative / Design':        ['English', 'General Aptitude', 'Art', 'Psychology'],
  'Business / Startup':       ['Economics', 'Mathematics', 'Business Studies', 'English', 'Accountancy'],
  'Commerce':                 ['Accountancy', 'Economics', 'Business Studies', 'Mathematics', 'English'],
  'Other':                    ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Economics', 'Computer Science', 'History', 'Geography'],
};

const ALL_SUBJECTS = [...new Set(Object.values(GOAL_SUBJECTS).flat())].sort();

const WEAK_TOPICS = [
  'Algebra', 'Calculus', 'Organic Chemistry', 'Thermodynamics', 'Kinematics',
  'Genetics', 'Statistics', 'Grammar', 'Trigonometry', 'Electrostatics',
  'Probability', 'Mechanics', 'Optics', 'Inorganic Chemistry', 'Integration',
];

const LOADING_STEPS = [
  { label: 'Analyzing your academic profile...' },
  { label: 'Mapping subject strengths & weaknesses...' },
  { label: 'Identifying learning patterns...' },
  { label: 'Generating personalized career paths...' },
  { label: 'Crafting your action plan...' },
  { label: 'Finalizing your AI report...' },
];

const STEPS = [
  { id: 1, title: 'Academic Profile',   subtitle: 'Tell us your class, stream, and goals',              icon: GraduationCap },
  { id: 2, title: 'Strengths & Gaps',   subtitle: 'Where you shine and where you struggle',             icon: Brain },
  { id: 3, title: 'Study Habits',       subtitle: 'How and when you study best',                        icon: Clock },
  { id: 4, title: 'Performance Data',   subtitle: 'Your recent scores and test results',                icon: BarChart2 },
];

// ─────────────────────────────────────────────────────────────
//  Reusable Sub-components
// ─────────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{children}</p>
);

const Select = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <Label>{label}</Label>
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ colorScheme: 'dark' }}
        className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3.5 text-sm text-gray-200 appearance-none
          focus:outline-none focus:border-indigo-500/50 hover:border-[#374151] transition-all cursor-pointer">
        <option value="" disabled style={{ background: '#111827', color: '#9ca3af' }}>{placeholder || 'Select...'}</option>
        {options.map(o => <option key={o} value={o} style={{ background: '#111827', color: '#e5e7eb' }}>{o}</option>)}
      </select>
      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
    </div>
  </div>
);

const RadioGroup = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-3">
    {options.map(opt => (
      <button key={opt} type="button" onClick={() => onChange(opt)}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95 ${
          value === opt
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            : 'bg-[#1f2937]/50 border-[#1f2937] text-gray-400 hover:bg-[#374151] hover:text-gray-200'
        }`}>{opt}</button>
    ))}
  </div>
);

// Chip group with "Other" support
const ChipGroup = ({ options, selected, onToggle, otherValue, onOtherChange, color = 'indigo' }) => {
  const [showOther, setShowOther] = useState(selected.includes('__other__'));
  const accent = { 
    indigo: 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300', 
    red: 'border-red-500/50 bg-red-500/15 text-red-300' 
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {options.map(s => (
          <button key={s} type="button" onClick={() => onToggle(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center gap-2 active:scale-95 ${
              selected.includes(s) ? accent[color] : 'text-gray-400 border-[#1f2937] bg-[#1f2937]/50 hover:bg-[#374151]'
            }`}>
            {selected.includes(s) && <CheckIcon />}{s}
          </button>
        ))}
        <button type="button"
          onClick={() => { setShowOther(p => !p); if (!showOther) onToggle('__other__'); else { onToggle('__other__'); onOtherChange(''); }}}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center gap-2 active:scale-95 ${
            showOther ? 'border-purple-500/50 bg-purple-500/15 text-purple-300' : 'text-gray-400 border-[#1f2937] bg-[#1f2937]/50 hover:bg-[#374151]'
          }`}>
          {showOther && <CheckIcon />}+ Other
        </button>
      </div>
      {showOther && (
        <input value={otherValue} onChange={e => onOtherChange(e.target.value)}
          placeholder="Type your subject / topic here..."
          className="w-full bg-[#111827] border border-purple-500/30 rounded-xl px-4 py-3.5 text-sm text-gray-200
            placeholder-gray-600 focus:outline-none focus:border-purple-500/70 transition-all" />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
//  Loading Screen
// ─────────────────────────────────────────────────────────────
const LoadingScreen = ({ activeStep }) => (
  <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
    <div className="relative mb-10">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center animate-pulse border border-indigo-500/20">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600/50 to-purple-600/50 flex items-center justify-center border border-indigo-500/30">
          <div className="text-indigo-400 animate-bounce"><SparkleIcon /></div>
        </div>
      </div>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-indigo-500" />
      </div>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }}>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-500" />
      </div>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2 text-center">ShikshaSetu AI is Thinking...</h2>
    <p className="text-gray-400 text-sm mb-10 text-center">Gemini is deeply analyzing your academic profile</p>
    <div className="w-full max-w-xs space-y-3">
      {LOADING_STEPS.map((s, i) => {
        const done = i < activeStep, active = i === activeStep;
        return (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${active ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : done ? 'bg-white/[0.02] border-white/5 text-gray-500' : 'bg-transparent border-transparent text-gray-700'}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${done ? 'bg-green-500 border-green-500' : active ? 'border-indigo-400 animate-pulse' : 'border-white/10'}`}>
              {done && <CheckIcon />}
              {active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            </div>
            <span className="text-sm font-medium">{s.label}</span>
          </div>
        );
      })}
    </div>
    <p className="text-gray-600 text-[11px] mt-8">This may take 10–20 seconds. Please wait...</p>
  </div>
);

// ─────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────
const OnboardingFlow = ({ onComplete, onClose, userId }) => {
  const [step, setStep] = useState(0);
  const [dir, setDir]   = useState(1);   // 1 = forward, -1 = backward
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep]   = useState(0);
  const [error, setError]               = useState(null);

  // Core form data
  const [data, setData] = useState({
    currentClass: '', stream: '', targetGoal: '', language: '',
    strongSubjects: [], weakSubjects: [],
    otherStrong: '', otherWeak: '',
    confidence: '',
    biggestChallenge: '',
    studyHours: '', studyTime: '', practiceStyle: '',
    otherStudyStyle: '', resources: [],
    // Multi-subject performance entries
    subjectEntries: [{ subject: '', score: '', correctQ: '', incorrectQ: '', accuracy: '' }],
    weakTopics: [], otherWeakTopic: '',
    mistakeType: '', otherMistakeType: '',
    // File upload
    uploadedFileData: null, uploadedFileName: '',
  });

  const fileInputRef = useRef(null);

  const set   = (key, val) => setData(p => ({ ...p, [key]: val }));
  const toggle = (key, val) => setData(p => ({
    ...p,
    [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val],
  }));

  // Get adaptive subjects based on chosen goal
  const adaptiveSubjects = GOAL_SUBJECTS[data.targetGoal] || ALL_SUBJECTS;

  // Multi-subject helpers
  const updateEntry = (idx, field, val) => {
    setData(p => {
      const entries = [...p.subjectEntries];
      entries[idx] = { ...entries[idx], [field]: val };
      return { ...p, subjectEntries: entries };
    });
  };
  const addEntry    = () => setData(p => ({ ...p, subjectEntries: [...p.subjectEntries, { subject: '', score: '', correctQ: '', incorrectQ: '', accuracy: '' }] }));
  const removeEntry = idx => setData(p => ({ ...p, subjectEntries: p.subjectEntries.filter((_, i) => i !== idx) }));

  // File upload handler
  const handleFile = useCallback(file => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      set('uploadedFileData', e.target.result);
      set('uploadedFileName', file.name);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // Validation
  const canNext = () => {
    if (step === 0) return data.currentClass && data.stream && data.targetGoal;
    if (step === 1) return data.strongSubjects.length > 0 && data.weakSubjects.length > 0 && data.confidence;
    if (step === 2) return data.studyHours && data.studyTime && data.practiceStyle;
    if (step === 3) return data.subjectEntries[0].subject && data.subjectEntries[0].score;
    return false;
  };

  // Navigate
  const goNext = () => { setDir(1);  setStep(s => s + 1); setError(null); window.scrollTo({top:0, behavior:'smooth'}); };
  const goBack = () => { setDir(-1); setStep(s => s - 1); setError(null); window.scrollTo({top:0, behavior:'smooth'}); };

  // Loading animation
  const startLoading = () => {
    let cur = 0;
    const iv = setInterval(() => {
      cur++;
      setLoadingStep(cur);
      if (cur >= LOADING_STEPS.length - 1) clearInterval(iv);
    }, 1400);
    return iv;
  };

  // Submit
  const handleSubmit = async () => {
    setIsGenerating(true);
    setError(null);
    setLoadingStep(0);
    const uid = userId || 'anonymous';
    const sessionId = Date.now().toString();
    const iv = startLoading();

    try {
      // Build enriched payload with all "Other" fields merged
      const enrichedData = {
        ...data,
        strongSubjectsAll: [
          ...data.strongSubjects.filter(s => s !== '__other__'),
          ...(data.otherStrong ? [`Other: ${data.otherStrong}`] : []),
        ],
        weakSubjectsAll: [
          ...data.weakSubjects.filter(s => s !== '__other__'),
          ...(data.otherWeak ? [`Other: ${data.otherWeak}`] : []),
        ],
        weakTopicsAll: [
          ...data.weakTopics.filter(t => t !== '__other__'),
          ...(data.otherWeakTopic ? [`Other: ${data.otherWeakTopic}`] : []),
        ],
        practiceStyleAll: data.practiceStyle === 'Other (specify)' && data.otherStudyStyle ? data.otherStudyStyle : data.practiceStyle,
        mistakeTypeAll: data.mistakeType === 'Other (specify)' && data.otherMistakeType ? data.otherMistakeType : data.mistakeType,
        // Adaptive subjects context
        adaptiveSubjects,
        hasFileUpload: !!data.uploadedFileData,
      };

      const DEV_MODE = true;
      let res;
      let errBody = {};
      try {
        res = await fetch('http://localhost:5000/api/v1/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputData: enrichedData }),
        });
        if (!res.ok) errBody = await res.json().catch(() => ({}));
      } catch (networkErr) {
        // Network error (server offline)
        res = { ok: false, status: 'Network Error' };
        errBody = { error: 'Failed to fetch (Server might be offline)' };
      }
      
      if (!res.ok) {
        console.error(`[API ERROR /analyze] Status: ${res.status}`, errBody);
        
        if (DEV_MODE) {
          console.warn("DEV_MODE active: Using fallback mock AI profile to bypass API quotas.");
          clearInterval(iv);
          setLoadingStep(LOADING_STEPS.length - 1);
          await new Promise(r => setTimeout(r, 600));
          
          const mockOutput = {
            strongSubjects: [{"subject": "Mock Core", "confidence": 90, "reason": "Consistent high scores"}],
            weakSubjects: [],
            subjectScores: [],
            learningProfile: { "learningStyle": "Visual", "consistencyLevel": "High", "focusLevel": "High" },
            learningIssues: [],
            recommendedFocus: [{ "subject": "Computer Science Development", "priority": "high", "reason": "Build core systems.", "actionPlan": ["Review docs", "Build projects"] }],
            careerSuggestions: [{"career": "Software Engineer (DEV FALLBACK)", "matchScore": 99, "reason": "Matches all developmental attributes perfectly."}],
            insights: { "strengthSummary": "Great logic.", "weaknessSummary": "None", "overallAnalysis": "Excellent." }
          };
          
          localStorage.setItem(`onboarding_complete_${uid}`, 'true');
          localStorage.setItem('userProfile', JSON.stringify({ goal: enrichedData.targetGoal }));
          onComplete({ aiOutput: mockOutput, inputData: enrichedData, sessionId, uid });
          return;
        }

        throw new Error(errBody.error || `Server error ${res.status}`);
      }

      const aiOutput = await res.json();
      clearInterval(iv);
      setLoadingStep(LOADING_STEPS.length - 1);
      await new Promise(r => setTimeout(r, 600));

      localStorage.setItem(`onboarding_complete_${uid}`, 'true');
      localStorage.setItem('userProfile', JSON.stringify({ goal: enrichedData.targetGoal }));
      onComplete({ aiOutput, inputData: enrichedData, sessionId, uid });

      // Background Firestore save
      if (uid !== 'anonymous') {
        const { uploadedFileData: _fd, ...safeData } = enrichedData;
        const ref = doc(collection(db, 'results', uid, 'sessions'), sessionId);
        setDoc(ref, { uid, sessionId, inputData: safeData, aiOutput, createdAt: new Date().toISOString() })
          .then(() => console.log('[Firestore] Session saved:', sessionId))
          .catch(e => console.warn('[Firestore] Background save failed:', e.message));
      }

    } catch (err) {
      clearInterval(iv);
      setError(err.message || 'Failed to reach AI. Make sure the server is running.');
      setIsGenerating(false);
    }
  };

  if (isGenerating) return <LoadingScreen activeStep={loadingStep} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex font-sans overflow-hidden">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-[240px] shrink-0 border-r border-[#1f2937] bg-[#0d0d0d] sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
            <SparkleIcon />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">ShikshaSetu AI</p>
            <p className="text-[10px] text-gray-500">Mentorship</p>
          </div>
        </div>

        {/* Step list */}
        <nav className="flex-1 px-4 py-2 space-y-2">
          {STEPS.map((s, i) => {
            const done    = i < step;
            const active  = i === step;
            const locked  = i > step;
            return (
              <button key={s.id} type="button"
                onClick={() => { if (!locked) { setDir(i > step ? 1 : -1); setStep(i); } }}
                className={`w-full flex items-center gap-3 px-3 py-4 rounded-xl text-left transition-all duration-300 ${
                  active  ? 'bg-indigo-500/10 border border-indigo-500/30 shadow-inner text-white' :
                  done    ? 'bg-[#1f2937]/30 border border-transparent text-gray-400 hover:bg-[#1f2937]/50' :
                  'text-gray-600 cursor-default border border-transparent'
                }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                  done   ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                  active ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' :
                  'bg-white/5 border-transparent text-gray-600'
                }`}>
                  {done ? <CheckIcon /> : <s.icon size={18} strokeWidth={1.8} />}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${active ? 'text-indigo-100' : ''}`}>{s.title}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Progress */}
        <div className="p-6">
          <div className="flex justify-between text-xs text-gray-500 mb-3 font-semibold">
            <span>Overall Progress</span><span>{Math.round(((step) / STEPS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1f2937] px-6 py-4 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft /> Back
          </button>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <SparkleIcon /><span>ShikshaSetu AI</span>
          </div>
        </header>

        {/* Mobile progress bar */}
        <div className="md:hidden h-1 bg-[#1f2937]">
          <div className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        {/* Step content */}
        <main className="flex-1 w-full overflow-y-auto">
          <div className="max-w-[900px] mx-auto p-6 md:p-12" key={step} style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>

            {/* Step heading */}
            <div className="mb-10">
              <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-2">Step {step + 1} of {STEPS.length}</p>
              <h1 className="text-4xl font-black text-white mb-3 tracking-tight">{STEPS[step].title}</h1>
              <p className="text-gray-400 text-base">{STEPS[step].subtitle}</p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="mb-8 p-5 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex gap-4 items-start">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div className="leading-relaxed"><strong>Error:</strong> {error}</div>
              </div>
            )}

            {/* ── CENTRAL CARD ── */}
            <div className="bg-[#111827] rounded-[24px] shadow-2xl border border-[#1f2937]/50 p-6 md:p-10">
              
              {/* ═══ STEP 1: Profile ═══ */}
              {step === 0 && (
                <div className="space-y-10">
                  {/* section 1 */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6">Academic Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="mb-4">
                        <Select label="Current Class / Year" value={data.currentClass} onChange={v => set('currentClass', v)}
                          options={['Class 9', 'Class 10', 'Class 11', 'Class 12', '1st Year UG', '2nd Year UG', '3rd Year UG', '4th Year UG', 'Postgraduate']}
                          placeholder="Select your class" />
                      </div>
                      <div className="mb-4">
                        <Label>Stream</Label>
                        <RadioGroup options={['Science', 'Commerce', 'Arts / Humanities', 'Other']} value={data.stream} onChange={v => set('stream', v)}/>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#1f2937]/80" />

                  {/* section 2 */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6">Goal Selection</h3>
                    <div className="mb-4">
                      <Label>What do you want to pursue?</Label>
                      <p className="text-xs text-gray-500 mb-4 font-medium">Core subjects will dynamically align to your selection.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Engineering (JEE)', 'Medical (NEET)', 'Campus Placement', 'Higher Studies (MS/MBA)', 'Civil Services (UPSC)', 'Commerce', 'Creative / Design', 'Business / Startup', 'Other'].map(g => (
                          <button key={g} type="button" onClick={() => set('targetGoal', g)}
                            className={`text-left px-5 py-4 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95 ${
                              data.targetGoal === g
                                ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-500/10 text-indigo-300'
                                : 'bg-[#1f2937]/30 border-[#1f2937] text-gray-400 hover:bg-[#374151] hover:text-gray-200 hover:-translate-y-0.5'
                            }`}>{g}</button>
                        ))}
                      </div>

                      {data.targetGoal && (
                        <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300 flex items-start gap-3">
                          <SparkleIcon />
                          <p>Subjects actively loaded for <strong>{data.targetGoal}</strong>:<span className="block mt-1 text-gray-300">{adaptiveSubjects.join(', ')}</span></p>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr className="border-[#1f2937]/80" />

                  {/* section 3 */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6">Medium of Study</h3>
                    <div className="mb-2">
                      <Label>Language Preference</Label>
                      <RadioGroup options={['English', 'Hindi', 'Regional Language']} value={data.language} onChange={v => set('language', v)}/>
                    </div>
                  </div>

                </div>
              )}

              {/* ═══ STEP 2: Strengths ═══ */}
              {step === 1 && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6">Subject Competency</h3>
                    
                    <div className="mb-8">
                      <Label>Strong Subjects <span className="text-indigo-400 normal-case font-normal text-xs ml-1">(Pick all that apply)</span></Label>
                      <ChipGroup
                        options={adaptiveSubjects.length ? adaptiveSubjects : ALL_SUBJECTS}
                        selected={data.strongSubjects}
                        onToggle={v => toggle('strongSubjects', v)}
                        otherValue={data.otherStrong}
                        onOtherChange={v => set('otherStrong', v)}
                        color="indigo" />
                    </div>

                    <div className="mb-4">
                      <Label>Weak Subjects <span className="text-red-400 normal-case font-normal text-xs ml-1">(Pick all that apply)</span></Label>
                      <ChipGroup
                        options={adaptiveSubjects.length ? adaptiveSubjects : ALL_SUBJECTS}
                        selected={data.weakSubjects}
                        onToggle={v => toggle('weakSubjects', v)}
                        otherValue={data.otherWeak}
                        onOtherChange={v => set('otherWeak', v)}
                        color="red" />
                    </div>
                  </div>

                  <hr className="border-[#1f2937]/80" />

                  <div>
                    <h3 className="text-lg font-bold text-white mb-6">Self Assessment</h3>
                    <div className="mb-8">
                      <Label>Confidence in Academics</Label>
                      <RadioGroup options={['Low', 'Medium', 'High']} value={data.confidence} onChange={v => set('confidence', v)}/>
                    </div>

                    <div className="mb-4">
                      <Label>What's your biggest academic challenge? <span className="normal-case font-normal text-gray-500">(Optional)</span></Label>
                      <textarea value={data.biggestChallenge || ''} onChange={e => set('biggestChallenge', e.target.value)}
                        rows={3} placeholder="e.g. I struggle with long numerical problems under time pressure..."
                        className="w-full bg-[#1f2937]/50 border border-[#1f2937] rounded-xl px-5 py-4 text-sm text-gray-200
                          placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 hover:border-[#374151] transition-all resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ STEP 3: Habits ═══ */}
              {step === 2 && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6">Daily Routine</h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div className="mb-2">
                        <Select label="Study Hours per Day" value={data.studyHours} onChange={v => set('studyHours', v)}
                          options={['Less than 1 hour', '1–2 hours', '2–4 hours', '4–6 hours', '6–8 hours', '8+ hours']}
                          placeholder="Select regular hours" />
                      </div>
                      <div className="mb-2">
                        <Label>Preferred Study Time</Label>
                        <RadioGroup options={['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Late Night']} value={data.studyTime} onChange={v => set('studyTime', v)}/>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#1f2937]/80" />

                  <div>
                    <h3 className="text-lg font-bold text-white mb-6">Learning Approach</h3>
                    <div className="mb-8">
                      <Label>How do you absorb information best?</Label>
                      <RadioGroup options={['Theory First', 'Practice First', 'Mixed Approach', 'Visual / Videos', 'Group Study', 'Other (specify)']} value={data.practiceStyle} onChange={v => set('practiceStyle', v)}/>
                      {data.practiceStyle === 'Other (specify)' && (
                        <input value={data.otherStudyStyle} onChange={e => set('otherStudyStyle', e.target.value)}
                          placeholder="Descirbe your exact study approach..."
                          className="mt-4 w-full bg-[#1f2937]/50 border border-[#1f2937] rounded-xl px-5 py-3.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all"/>
                      )}
                    </div>

                    <div className="mb-2">
                      <Label>Primary Study Resources <span className="normal-case font-normal text-gray-500">(Optional)</span></Label>
                      <div className="flex flex-wrap gap-3">
                        {['YouTube', 'Textbooks', 'Notes', 'Coaching Classes', 'Mock Tests', 'Study Apps'].map(r => (
                          <button key={r} type="button" onClick={() => toggle('resources', r)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all active:scale-95 ${
                              (data.resources || []).includes(r)
                                ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300'
                                : 'text-gray-400 border-[#1f2937] bg-[#1f2937]/50 hover:bg-[#374151]'
                            }`}>{r}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ STEP 4: Performance ═══ */}
              {step === 3 && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6">Academic History</h3>
                    
                    {/* ── File Upload ── */}
                    <div className="mb-10">
                      <Label>Automated Document Extraction <span className="normal-case font-normal text-gray-500">(Optional PDF/IMG)</span></Label>
                      <div
                        onDrop={onDrop} onDragOver={e => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group ${
                          data.uploadedFileName
                            ? 'border-green-500/40 bg-green-500/5'
                            : 'border-[#374151] hover:border-indigo-500/50 hover:bg-indigo-500/5'
                        }`}>
                        <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden"
                          onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }}/>
                        {data.uploadedFileName ? (
                          <div className="flex items-center justify-center gap-3 text-green-400">
                            <FileIcon className="w-6 h-6"/>
                            <span className="text-base font-semibold">{data.uploadedFileName}</span>
                            <button type="button" onClick={e => { e.stopPropagation(); set('uploadedFileData', null); set('uploadedFileName', ''); }}
                              className="ml-3 text-gray-500 hover:text-red-400 transition-colors p-2"><TrashIcon/></button>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-center mb-4 text-gray-500 group-hover:text-indigo-400 transition-colors"><UploadIcon/></div>
                            <p className="text-base font-semibold text-gray-300 mb-1">Upload your Latest Test Result</p>
                            <p className="text-sm text-gray-500">AI directly parses subjects, marks, and mistakes</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ── Multi-subject entries ── */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <Label>Manual Subject Performance</Label>
                        <button type="button" onClick={addEntry}
                          className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/30 px-3 py-2 rounded-xl hover:bg-indigo-500/10 active:scale-95">
                          <PlusIcon/> Add Subject Result
                        </button>
                      </div>
                      <div className="space-y-4">
                        {data.subjectEntries.map((entry, idx) => (
                          <div key={idx} className="bg-[#1f2937]/30 border border-[#1f2937] rounded-[16px] p-6 relative">
                            {data.subjectEntries.length > 1 && (
                              <button type="button" onClick={() => removeEntry(idx)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors bg-[#111827] p-1.5 rounded-lg border border-[#374151]"><TrashIcon/></button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 mt-2">
                              <div className="md:col-span-2">
                                <Label>Subject</Label>
                                <select value={entry.subject} onChange={e => updateEntry(idx, 'subject', e.target.value)}
                                  className="w-full bg-[#111827] border border-[#374151] rounded-xl px-4 py-3 text-sm text-gray-200 appearance-none focus:outline-none focus:border-indigo-500/50 transition-all">
                                  <option value="">Select a subject...</option>
                                  {(adaptiveSubjects.length ? adaptiveSubjects : ALL_SUBJECTS).map(s => <option key={s}>{s}</option>)}
                                  <option value="Other">Other Selection...</option>
                                </select>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                              {[['Overall Score (%)', 'score', '0', '100', 'e.g. 72'], ['Correct Qs', 'correctQ', '0', '', 'e.g. 18'], ['Incorrect Qs', 'incorrectQ', '0', '', 'e.g. 7']].map(([lbl, fld, mn, mx, ph]) => (
                                <div key={fld}>
                                  <Label>{lbl}</Label>
                                  <input type="number" min={mn} max={mx || undefined} value={entry[fld]} onChange={e => updateEntry(idx, fld, e.target.value)}
                                    placeholder={ph}
                                    className="w-full bg-[#111827] border border-[#374151] rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 transition-all"/>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#1f2937]/80" />

                  <div>
                    <h3 className="text-lg font-bold text-white mb-6">Specific Bottlenecks</h3>
                    
                    {/* ── Weak topics ── */}
                    <div className="mb-8">
                      <Label>Granular Weak Topics / Chapters</Label>
                      <ChipGroup
                        options={WEAK_TOPICS}
                        selected={data.weakTopics}
                        onToggle={v => toggle('weakTopics', v)}
                        otherValue={data.otherWeakTopic}
                        onOtherChange={v => set('otherWeakTopic', v)}
                        color="red" />
                    </div>

                    {/* ── Mistake type ── */}
                    <div className="mb-4">
                      <Label>Primary Type Of Mistake</Label>
                      <RadioGroup options={['Conceptual Errors', 'Calculation Mistakes', 'Time Management', 'Silly Mistakes', 'Other (specify)']}
                        value={data.mistakeType} onChange={v => set('mistakeType', v)} />
                      {data.mistakeType === 'Other (specify)' && (
                        <input value={data.otherMistakeType} onChange={e => set('otherMistakeType', e.target.value)}
                          placeholder="Describe your exact mistake pattern..."
                          className="mt-4 w-full bg-[#1f2937]/50 border border-[#1f2937] rounded-xl px-5 py-3.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all"/>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
            
            {/* Blank spacer to push footer cleanly on long pages if needed, though footer is fixed or attached */}
            <div className="h-10" />
            
          </div>
        </main>

        {/* ── FOOTER NAV ── */}
        <footer className="border-t border-[#1f2937] bg-[#0a0a0a] px-6 py-5 sticky bottom-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-[900px] flex justify-between items-center mx-auto w-full">
            <button onClick={step === 0 ? onClose : goBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold px-5 py-3 rounded-xl border border-[#1f2937] hover:bg-[#1f2937]/50 active:scale-95">
              <ArrowLeft/> {step === 0 ? 'Cancel' : 'Go Back'}
            </button>

            {step < 3 ? (
              <button onClick={goNext} disabled={!canNext()}
                className={`flex items-center gap-2 font-bold py-3 px-8 rounded-xl text-sm transition-all duration-300 ${
                  !canNext() ? 'bg-[#1f2937]/30 text-gray-600 border border-[#1f2937]/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-500 active:scale-95'
                }`}>
                Continue <ArrowRight/>
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canNext()}
                className={`flex items-center gap-2 font-bold py-3 px-8 rounded-xl text-sm transition-all duration-300 ${
                  !canNext() ? 'bg-[#1f2937]/30 text-gray-600 border border-[#1f2937]/50 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-500 active:scale-95'
                }`}>
                <SparkleIcon/> Generate AI Insights
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* CSS animation for step transitions */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;
