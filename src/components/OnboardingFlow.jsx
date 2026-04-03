import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Check, ChevronDown } from 'lucide-react';

const STEP_TITLES = [
  "Let's personalize your learning journey",
  "Tell us about your strengths & challenges",
  "Your study habits",
  "Add your recent performance",
];

const SUBJECT_OPTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'Economics', 'Accountancy', 'Business Studies', 'History',
  'Geography', 'Computer Science', 'Psychology', 'Political Science',
];

const WEAK_TOPIC_OPTIONS = [
  'Algebra', 'Calculus', 'Organic Chemistry', 'Thermodynamics',
  'Kinematics', 'Genetics', 'Statistics', 'Grammar',
  'Trigonometry', 'Electrostatics', 'Probability', 'Mechanics',
];

// Reusable chip-select component
const ChipSelect = ({ options, selected, onToggle, color = 'primary' }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => {
      const isActive = selected.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
            isActive
              ? `bg-${color}/20 border-${color}/40 text-white`
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
          }`}
          style={isActive ? { backgroundColor: `var(--color-${color}, rgba(99,102,241,0.2))`, borderColor: `var(--color-${color}, rgba(99,102,241,0.4))` } : {}}
        >
          {isActive && <Check className="w-3 h-3 inline mr-1" />}
          {opt}
        </button>
      );
    })}
  </div>
);

// Reusable dropdown
const SelectField = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-primary/50 transition-colors"
      >
        <option value="" disabled>{placeholder || 'Select...'}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

// Single-select button group
const ButtonGroup = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${
          value === opt
            ? 'bg-primary/20 border-primary/40 text-white'
            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const OnboardingFlow = ({ onComplete, onClose, userId }) => {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [data, setData] = useState({
    // Step 1
    currentClass: '',
    stream: '',
    targetGoal: '',
    language: '',
    // Step 2
    strongSubjects: [],
    weakSubjects: [],
    confidence: '',
    // Step 3
    studyHours: '',
    studyTime: '',
    practiceStyle: '',
    // Step 4
    perfSubject: '',
    testScore: '',
    correctQ: '',
    incorrectQ: '',
    weakTopics: [],
    mistakeType: '',
  });

  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const toggleArray = (key, value) => {
    setData(prev => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0: return data.currentClass && data.stream && data.targetGoal;
      case 1: return data.strongSubjects.length > 0 && data.weakSubjects.length > 0 && data.confidence;
      case 2: return data.studyHours && data.studyTime && data.practiceStyle;
      case 3: return data.perfSubject && data.testScore;
      default: return false;
    }
  };

  const handleSubmit = () => {
    setIsGenerating(true);
    // Save to localStorage scoped by user UID
    const uid = userId || 'anonymous';
    localStorage.setItem(`onboarding_data_${uid}`, JSON.stringify(data));
    localStorage.setItem(`onboarding_complete_${uid}`, 'true');
    setTimeout(() => {
      setIsGenerating(false);
      onComplete(data);
    }, 2200);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-white">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <Sparkles className="w-16 h-16 text-primary relative animate-bounce" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-3 animate-pulse">Building Your Learning Path...</h2>
        <p className="text-gray-400 text-sm max-w-md text-center">
          Our AI is analyzing your profile, strengths, and study patterns to craft a personalized roadmap just for you.
        </p>
        <div className="mt-10 flex gap-2">
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5">
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <span className="text-sm text-gray-500 font-medium">Step {step + 1} of 4</span>
        <div className="w-9" /> {/* spacer */}
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/5">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / 4) * 100}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-10">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">{STEP_TITLES[step]}</h1>

          <div className="space-y-6">
            {/* ── STEP 1: BASIC PROFILE ── */}
            {step === 0 && (
              <>
                <SelectField
                  label="Current Class / Year"
                  value={data.currentClass}
                  onChange={v => update('currentClass', v)}
                  options={['Class 10', 'Class 11', 'Class 12', '1st Year UG', '2nd Year UG', '3rd Year UG', '4th Year UG']}
                  placeholder="Select your class"
                />
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stream</label>
                  <ButtonGroup
                    options={['Science', 'Commerce', 'Arts / Humanities']}
                    value={data.stream}
                    onChange={v => update('stream', v)}
                  />
                </div>
                <SelectField
                  label="Target Goal"
                  value={data.targetGoal}
                  onChange={v => update('targetGoal', v)}
                  options={['Engineering', 'Medical', 'Placement', 'Higher Studies', 'Civil Services', 'Creative / Design', 'Business / MBA', 'Other']}
                  placeholder="What are you aiming for?"
                />
                <SelectField
                  label="Preferred Language (optional)"
                  value={data.language}
                  onChange={v => update('language', v)}
                  options={['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Kannada', 'Other']}
                  placeholder="Select language"
                />
              </>
            )}

            {/* ── STEP 2: STRENGTHS & WEAKNESSES ── */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Strong Subjects</label>
                  <ChipSelect
                    options={SUBJECT_OPTIONS}
                    selected={data.strongSubjects}
                    onToggle={v => toggleArray('strongSubjects', v)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weak Subjects</label>
                  <ChipSelect
                    options={SUBJECT_OPTIONS}
                    selected={data.weakSubjects}
                    onToggle={v => toggleArray('weakSubjects', v)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confidence Level</label>
                  <ButtonGroup
                    options={['Low', 'Medium', 'High']}
                    value={data.confidence}
                    onChange={v => update('confidence', v)}
                  />
                </div>
              </>
            )}

            {/* ── STEP 3: STUDY PATTERN ── */}
            {step === 2 && (
              <>
                <SelectField
                  label="Study Hours Per Day"
                  value={data.studyHours}
                  onChange={v => update('studyHours', v)}
                  options={['Less than 1 hour', '1–2 hours', '2–4 hours', '4–6 hours', '6+ hours']}
                  placeholder="Select hours"
                />
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preferred Study Time</label>
                  <ButtonGroup
                    options={['Morning', 'Afternoon', 'Night']}
                    value={data.studyTime}
                    onChange={v => update('studyTime', v)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Practice Style</label>
                  <ButtonGroup
                    options={['Theory', 'Practice', 'Mixed']}
                    value={data.practiceStyle}
                    onChange={v => update('practiceStyle', v)}
                  />
                </div>
              </>
            )}

            {/* ── STEP 4: PERFORMANCE SNAPSHOT ── */}
            {step === 3 && (
              <>
                <SelectField
                  label="Subject"
                  value={data.perfSubject}
                  onChange={v => update('perfSubject', v)}
                  options={SUBJECT_OPTIONS}
                  placeholder="Which subject?"
                />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Test Score (%)</label>
                    <input
                      type="number"
                      min="0" max="100"
                      value={data.testScore}
                      onChange={e => update('testScore', e.target.value)}
                      placeholder="e.g. 72"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Correct</label>
                    <input
                      type="number"
                      min="0"
                      value={data.correctQ}
                      onChange={e => update('correctQ', e.target.value)}
                      placeholder="e.g. 18"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Incorrect</label>
                    <input
                      type="number"
                      min="0"
                      value={data.incorrectQ}
                      onChange={e => update('incorrectQ', e.target.value)}
                      placeholder="e.g. 7"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weak Topics</label>
                  <ChipSelect
                    options={WEAK_TOPIC_OPTIONS}
                    selected={data.weakTopics}
                    onToggle={v => toggleArray('weakTopics', v)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mistake Type</label>
                  <ButtonGroup
                    options={['Conceptual', 'Calculation', 'Time Management']}
                    value={data.mistakeType}
                    onChange={v => update('mistakeType', v)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="px-6 md:px-8 py-6 border-t border-white/5">
        <div className="max-w-lg mx-auto flex justify-between">
          <button
            onClick={() => step === 0 ? onClose() : setStep(step - 1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-3 px-5 rounded-xl border border-white/5 hover:bg-white/5 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? 'Exit' : 'Back'}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex items-center gap-2 font-medium py-3 px-6 rounded-xl text-sm transition-all duration-300 ${
                !canProceed()
                  ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
              }`}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={`flex items-center gap-2 font-medium py-3 px-6 rounded-xl text-sm transition-all duration-300 ${
                !canProceed()
                  ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Generate My Learning Path
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default OnboardingFlow;
