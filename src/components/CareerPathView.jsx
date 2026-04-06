import React, { useState } from 'react';
import {
  Briefcase, ChevronRight, Loader2, ArrowLeft, TrendingUp, AlertTriangle,
  Building2, Target, BookOpen, Layers, CheckCircle, Zap, MonitorPlay,
  Library, Video, BookText, DollarSign, Rocket, Check, X,
  Award, Sparkles, BarChart2, Star, Users
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Area, AreaChart
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

// ─── Design tokens (Stitch "Shiksha Indigo" system) ───────────────────────────
const T = {
  surface:          '#131318',
  surfaceContLow:   '#1b1b20',
  surfaceCont:      '#1f1f25',
  surfaceContHigh:  '#2a292f',
  surfaceContHighest:'#35343a',
  primary:          '#c0c1ff',
  primaryContainer: '#8083ff',
  onSurface:        '#e4e1e9',
  onSurfaceVar:     '#c7c4d7',
  outline:          '#908fa0',
  outlineVar:       '#464554',
  indigo:           '#6366f1',
  emerald:          '#10b981',
  amber:            '#f59e0b',
  red:              '#ef4444',
  blue:             '#3b82f6',
};

const chartStyle = {
  backgroundColor: T.surfaceContHigh,
  border: 'none',
  borderRadius: '12px',
  color: T.onSurface,
  fontSize: '11px',
  padding: '8px 12px',
};

// ─── Micro components ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <p style={{ color: T.primary, letterSpacing: '0.08em', fontSize: '10px' }}
     className="font-bold uppercase mb-1">
    {children}
  </p>
);

const Chip = ({ children, color = 'indigo' }) => {
  const map = {
    indigo: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(128,131,255,0.25)', text: '#c0c1ff' },
    green:  { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)',  text: '#6ee7b7' },
    red:    { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)',   text: '#fca5a5' },
    amber:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', text: '#fcd34d' },
    purple: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', text: '#c4b5fd' },
  };
  const c = map[color] || map.indigo;
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider select-none">
      {children}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, color = 'indigo' }) => {
  const glows = {
    indigo: 'rgba(99,102,241,0.12)',
    green:  'rgba(16,185,129,0.12)',
    amber:  'rgba(245,158,11,0.12)',
    blue:   'rgba(59,130,246,0.12)',
    purple: 'rgba(139,92,246,0.12)',
  };
  const icons = {
    indigo: T.primary,
    green:  T.emerald,
    amber:  T.amber,
    blue:   T.blue,
    purple: '#c4b5fd',
  };
  return (
    <div style={{ background: T.surfaceCont }} className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 group cursor-default">
      <div style={{ background: glows[color] }} className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={20} style={{ color: icons[color] }} />
      </div>
      <div className="min-w-0">
        <SectionLabel>{label}</SectionLabel>
        <p style={{ color: T.onSurface }} className="text-base font-bold truncate leading-tight">{value || '—'}</p>
      </div>
    </div>
  );
};

const SkillPill = ({ children, variant = 'core' }) => {
  const styles = {
    core:     { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(128,131,255,0.2)', text: '#c0c1ff', icon: <MonitorPlay size={11}/> },
    advanced: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(167,139,250,0.2)', text: '#c4b5fd', icon: <Star size={11}/> },
  };
  const s = styles[variant];
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:brightness-125 cursor-default select-none">
      {s.icon}{children}
    </span>
  );
};

const TimelineStep = ({ step, index, total }) => {
  const isFirst = index === 0;
  const isLast  = index === total - 1;
  const dotColors = { first: T.emerald, last: T.indigo, mid: '#8b5cf6' };
  const dot = isFirst ? dotColors.first : isLast ? dotColors.last : dotColors.mid;
  const badgeLabel = isFirst ? 'Foundation' : isLast ? 'Job Ready' : `Step ${index + 1}`;
  const badgeColor = isFirst ? 'green' : isLast ? 'indigo' : 'purple';
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div style={{ border: `2px solid ${dot}`, boxShadow: `0 0 12px ${dot}40`, background: T.surface }}
             className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold" style={{ border: `2px solid ${dot}`, background: T.surface, color: dot, boxShadow: `0 0 10px ${dot}30` }}>
          {index + 1}
        </div>
        {!isLast && <div style={{ background: `linear-gradient(to bottom, ${dot}30, transparent)` }} className="w-px flex-1 min-h-[32px] mt-1 mb-1" />}
      </div>
      <div className="pb-6 flex-1">
        <Chip color={badgeColor}>{badgeLabel}</Chip>
        <p style={{ color: T.onSurfaceVar }} className="mt-2 text-sm leading-relaxed">{step}</p>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource, type }) => {
  const map = {
    Video:  { Icon: Video,   bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   text: '#fca5a5', label: 'Video' },
    Course: { Icon: Library, bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)',  text: '#93c5fd', label: 'Course' },
    Book:   { Icon: BookText,bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  text: '#6ee7b7', label: 'Book' },
  };
  const c = map[type] || map.Book;
  return (
    <div style={{ background: T.surfaceContHigh }} className="rounded-2xl p-4 flex items-start gap-3 transition-all hover:-translate-y-0.5 hover:brightness-105 group cursor-pointer">
      <div style={{ background: c.bg, border: `1px solid ${c.border}` }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
        <c.Icon size={15} style={{ color: c.text }} />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ color: c.text, fontSize: '9px', letterSpacing: '0.08em' }} className="font-bold uppercase mb-0.5">{c.label}</p>
        <p style={{ color: T.onSurfaceVar }} className="text-[13px] leading-snug line-clamp-2 group-hover:text-white transition-colors">{resource}</p>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CareerPathView = ({ aiResult }) => {
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [detailData, setDetailData]         = useState(null);
  const [loading, setLoading]               = useState(false);

  const careers = aiResult?.careerSuggestions || [
    { career: 'Undecided / Exploring', matchScore: 100, reason: 'Take a few subjects to see what sticks!' }
  ];

  // ── API — UNTOUCHED ──────────────────────────────────────────────────────
  const handleSelectCareer = async (careerName) => {
    setSelectedCareer(careerName);
    setLoading(true);
    setDetailData(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/career/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career: careerName, userContext: aiResult })
      });
      const DEV_MODE = true;
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error(`[API ERROR /career/details] Status: ${res.status}`, errorData);
        if (DEV_MODE) {
          console.warn('DEV_MODE active: Using fallback mock career data.');
          setDetailData({
            overview: 'This is a highly demanding role focused on building scalable software systems. AI integration and cloud computing are driving massive growth in this sector. (DEV_MODE FALLBACK)',
            successRate: '65%', failureRate: '35%', competition: 'High',
            averageSalary: '₹10LPA - ₹25LPA', growthPotential: '22% YoY',
            topCompanies: ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro'],
            roadmapSteps: [
              'Learn fundamentals of programming, logic building, and basic data structures (Arrays, Linked Lists, Stacks).',
              'Build real-world projects using modern frameworks and contribute to open source repositories.',
              'Complete internships at tech firms or startups to experience the professional SDLC.',
              'Refine your portfolio, practice system design interviews, and apply to top-tier companies.'
            ],
            technicalSkills: ['JavaScript', 'React', 'DSA', 'System Design', 'Node.js', 'Cloud (AWS/GCP)'],
            softSkills: ['Communication', 'Agile/Scrum', 'Problem Solving', 'Team Leadership'],
            learningResources: [
              'Physics Wallah DSA Series (YouTube)',
              'Coursera Full Stack Certificate',
              'Cracking the Code Interview Book'
            ]
          });
          return;
        }
        window.alert(`Error: ${errorData.error || 'Something went wrong.'}`);
        return;
      }
      const data = await res.json();
      setDetailData(data);
    } catch (err) {
      console.error('[Network/Parsing Error]', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Data helpers — UNTOUCHED ──────────────────────────────────────────────
  const sortResources = (resources) => {
    const vids = [], courses = [], books = [];
    (resources || []).forEach(r => {
      const l = r.toLowerCase();
      if (l.includes('youtube') || l.includes('video') || l.includes('channel')) vids.push(r);
      else if (l.includes('course') || l.includes('certificat') || l.includes('coursera') || l.includes('udemy')) courses.push(r);
      else books.push(r);
    });
    return { vids, courses, books };
  };

  const parseSalary = (s) => {
    const n = (s || '').match(/\d+/g);
    if (!n || n.length < 2) return [{name:'Entry',v:5},{name:'Mid',v:12},{name:'Senior',v:25}];
    const min = parseInt(n[0]), max = parseInt(n[n.length-1]);
    return [{name:'Entry',v:min},{name:'Mid',v:Math.round((min+max)/2)},{name:'Senior',v:max}];
  };

  const competitionValue = (c) => {
    const l = (c||'').toLowerCase();
    return l.includes('high') ? 85 : l.includes('medium') ? 50 : l.includes('low') ? 20 : 60;
  };

  const successPie = (s) => {
    const n = (s||'').match(/\d+/);
    const v = n ? parseInt(n[0]) : 65;
    return [{name:'Success',value:v},{name:'Other',value:100-v}];
  };

  const growthLine = (s) => {
    const base = parseSalary(s);
    const min = base[0].v, max = base[2].v;
    return [
      {year:'Yr 1',salary:min}, {year:'Yr 2',salary:Math.round(min*1.22)},
      {year:'Yr 3',salary:Math.round(min*1.48)}, {year:'Yr 4',salary:Math.round((min+max)/2)},
      {year:'Yr 5',salary:Math.round(max*0.82)}, {year:'Yr 7',salary:max},
    ];
  };

  const skillBars = (tech=[], soft=[]) => {
    const items = [...tech.slice(0,4), ...soft.slice(0,2)];
    const weights = [90,80,75,65,55,45];
    return items.map((s,i) => ({ name: s.length>14?s.slice(0,14)+'…':s, pct: weights[i]||40 }));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DETAIL VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCareer) {
    const rSorted    = detailData ? sortResources(detailData.learningResources) : null;
    const salaryData = detailData ? parseSalary(detailData.averageSalary)       : [];
    const pieSuc     = detailData ? successPie(detailData.successRate)           : [];
    const growth     = detailData ? growthLine(detailData.averageSalary)         : [];
    const skills     = detailData ? skillBars(detailData.technicalSkills, detailData.softSkills) : [];
    const compVal    = detailData ? competitionValue(detailData.competition)     : 0;

    const techAll  = detailData?.technicalSkills || [];
    const coreTech = techAll.slice(0, Math.ceil(techAll.length / 2));
    const advTech  = techAll.slice(Math.ceil(techAll.length / 2));

    const pros = [
      detailData?.growthPotential ? `Strong growth trajectory: ${detailData.growthPotential}` : null,
      detailData?.averageSalary   ? `Salary range: ${detailData.averageSalary}` : null,
      detailData?.successRate     ? `Field success rate: ${detailData.successRate}` : null,
      detailData?.topCompanies?.length ? `Top hirers: ${detailData.topCompanies.slice(0,2).join(', ')} & more` : null,
    ].filter(Boolean);

    const cons = [
      detailData?.competition ? `${detailData.competition} market competition` : null,
      detailData?.failureRate ? `Failure rate: ${detailData.failureRate}`      : null,
      techAll.length > 4      ? 'Steep technical skill requirements'            : null,
      'Continuous upskilling required as technology evolves',
    ].filter(Boolean);

    const compColor = detailData?.competition?.toLowerCase().includes('high') ? 'red'
                    : detailData?.competition?.toLowerCase().includes('medium') ? 'amber' : 'green';

    return (
      <div className="flex flex-col gap-0 animate-in fade-in duration-300" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* ── BACK NAV ──────────────────────────────────────────── */}
        <button
          onClick={() => setSelectedCareer(null)}
          style={{ color: T.onSurfaceVar }}
          className="flex items-center gap-2 hover:text-white transition-colors w-fit text-sm font-semibold group mb-6"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Career Paths
        </button>

        {/* ── A. HEADER ─────────────────────────────────────────── */}
        <div style={{ background: T.surfaceCont, borderBottom: `1px solid ${T.outlineVar}18` }}
             className="rounded-t-3xl px-8 py-7 relative overflow-hidden">
          {/* Indigo backlit glow */}
          <div style={{ background: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.15) 0%, transparent 65%)' }}
               className="absolute inset-0 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(128,131,255,0.2)', boxShadow:'0 0 24px rgba(99,102,241,0.15)' }}
                   className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                <Briefcase size={26} style={{ color: T.primary }} />
              </div>
              <div>
                <h1 style={{ color: T.onSurface, letterSpacing: '-0.02em' }} className="text-3xl md:text-4xl font-black leading-none">{selectedCareer}</h1>
                <p style={{ color: T.onSurfaceVar }} className="text-sm mt-1.5 font-medium">AI-Powered Career Intelligence Report</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {detailData?.competition && <Chip color={compColor}>{detailData.competition} Competition</Chip>}
              {detailData?.growthPotential && <Chip color="green">High Growth</Chip>}
              <Chip color="indigo">AI Matched</Chip>
            </div>
          </div>
        </div>

        {/* Body padding wrapper */}
        <div style={{ background: T.surfaceContLow }} className="rounded-b-3xl px-6 md:px-8 pb-8 pt-6 flex flex-col gap-8">

          {/* ── LOADING ─────────────────────────────────────────── */}
          {loading && (
            <div style={{ background: T.surfaceCont }} className="rounded-2xl flex flex-col items-center justify-center py-24 gap-4">
              <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(128,131,255,0.2)' }}
                   className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse">
                <Loader2 size={28} className="animate-spin" style={{ color: T.primary }} />
              </div>
              <p style={{ color: T.onSurfaceVar }} className="text-sm font-medium">Analyzing industry data & building your career report…</p>
            </div>
          )}

          {!loading && detailData && (<>

            {/* ── B. STAT CARDS ───────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={DollarSign}     label="Avg Salary"      value={detailData.averageSalary}   color="green"  />
              <StatCard icon={TrendingUp}     label="Growth"          value={detailData.growthPotential} color="blue"   />
              <StatCard icon={Target}         label="Success Rate"    value={detailData.successRate}     color="purple" />
              <StatCard icon={AlertTriangle}  label="Competition"     value={detailData.competition}     color="amber"  />
            </div>

            {/* ── C. OVERVIEW ─────────────────────────────────────── */}
            <div style={{ background: T.surfaceCont, borderLeft: `3px solid ${T.indigo}` }} className="rounded-2xl px-6 py-5 relative overflow-hidden">
              <div style={{ background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.08) 0%, transparent 70%)' }} className="absolute inset-0 pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={15} style={{ color: T.primary }} />
                <SectionLabel>Career Overview</SectionLabel>
              </div>
              <p style={{ color: T.onSurfaceVar }} className="text-[15px] leading-relaxed">{detailData.overview}</p>
            </div>

            {/* ── D. SKILLS ───────────────────────────────────────── */}
            <div style={{ background: T.surfaceCont }} className="rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div style={{ background: 'rgba(99,102,241,0.12)' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <MonitorPlay size={16} style={{ color: T.primary }} />
                </div>
                <h2 style={{ color: T.onSurface }} className="font-bold text-base">Skills Required</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SectionLabel>Core Technical Skills</SectionLabel>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {coreTech.map((s,i) => <SkillPill key={i} variant="core">{s}</SkillPill>)}
                  </div>
                </div>
                <div>
                  <SectionLabel>Advanced & Soft Skills</SectionLabel>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[...advTech, ...(detailData.softSkills||[])].map((s,i) => <SkillPill key={i} variant="advanced">{s}</SkillPill>)}
                  </div>
                </div>
              </div>
            </div>

            {/* ── E. ROADMAP ──────────────────────────────────────── */}
            <div style={{ background: T.surfaceCont }} className="rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div style={{ background: 'rgba(16,185,129,0.12)' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Layers size={16} style={{ color: T.emerald }} />
                </div>
                <div>
                  <h2 style={{ color: T.onSurface }} className="font-bold text-base">Preparation Roadmap</h2>
                  <p style={{ color: T.outline }} className="text-xs mt-0.5">Step-by-step path to becoming job-ready</p>
                </div>
              </div>
              <div className="max-w-2xl">
                {(detailData.roadmapSteps || []).map((step, idx) => (
                  <TimelineStep key={idx} step={step} index={idx} total={detailData.roadmapSteps.length} />
                ))}
              </div>
            </div>

            {/* ── F. CHARTS ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Skill Weightage */}
              <div style={{ background: T.surfaceCont }} className="lg:col-span-1 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 size={14} style={{ color: T.primary }} />
                  <SectionLabel>Skill Weightage %</SectionLabel>
                </div>
                <div className="h-[190px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skills} layout="vertical" margin={{ top:0, right:10, left:0, bottom:0 }}>
                      <XAxis type="number" domain={[0,100]} tick={{ fill: T.outline, fontSize:10 }} tickLine={false} axisLine={false} unit="%" />
                      <YAxis type="category" dataKey="name" tick={{ fill: T.onSurfaceVar, fontSize:10 }} tickLine={false} axisLine={false} width={72} />
                      <Tooltip cursor={{ fill:'rgba(255,255,255,0.02)' }} contentStyle={chartStyle} formatter={(v) => [`${v}%`, 'Weight']} />
                      <Bar dataKey="pct" radius={[0,4,4,0]} barSize={10}>
                        {skills.map((_,i) => <Cell key={i} fill={['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6'][i%6]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Salary Growth Area Chart */}
              <div style={{ background: T.surfaceCont }} className="lg:col-span-2 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={14} style={{ color: T.emerald }} />
                  <SectionLabel>Salary Growth Trend (LPA)</SectionLabel>
                </div>
                <div className="h-[190px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growth} margin={{ top:5, right:10, left:-22, bottom:0 }}>
                      <defs>
                        <linearGradient id="salGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={`${T.outlineVar}18`} strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fill: T.outline, fontSize:10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: T.outline, fontSize:10 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={chartStyle} formatter={(v) => [`₹${v} LPA`, 'Salary']} />
                      <Area type="monotone" dataKey="salary" stroke="#6366f1" strokeWidth={2.5} fill="url(#salGrad)"
                            dot={{ fill:'#6366f1', r:4, strokeWidth:0 }} activeDot={{ r:6, strokeWidth:0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Success + Competition row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Donut */}
              <div style={{ background: T.surfaceCont }} className="rounded-2xl p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={14} style={{ color: T.emerald }} />
                  <SectionLabel>Success Rate</SectionLabel>
                </div>
                <div className="flex items-center gap-6 flex-1">
                  <div className="relative h-[110px] w-[110px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieSuc} innerRadius={32} outerRadius={50} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                          <Cell fill={T.emerald} />
                          <Cell fill={T.surfaceContHighest} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ color: T.onSurface }} className="text-lg font-black">{pieSuc[0]?.value}%</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div style={{ background: T.emerald }} className="w-2 h-2 rounded-full" />
                      <span style={{ color: T.onSurfaceVar }} className="text-xs">Success: {pieSuc[0]?.value}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div style={{ background: T.surfaceContHighest, border:`1px solid ${T.outlineVar}` }} className="w-2 h-2 rounded-full" />
                      <span style={{ color: T.onSurfaceVar }} className="text-xs">Other paths: {pieSuc[1]?.value}%</span>
                    </div>
                    <p style={{ color: T.outline }} className="text-[11px] pt-1">Failure rate: {detailData.failureRate || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Competition meter */}
              <div style={{ background: T.surfaceCont }} className="rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={14} style={{ color: T.amber }} />
                  <SectionLabel>Market Competition</SectionLabel>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span style={{ color: T.onSurface }} className="font-bold text-sm capitalize">{detailData.competition}</span>
                  <span style={{ color: T.amber }} className="font-black text-xl">{compVal}%</span>
                </div>
                <div style={{ background: T.surfaceContHighest }} className="w-full h-2.5 rounded-full overflow-hidden mb-3">
                  <div style={{ width: `${compVal}%`, background: 'linear-gradient(to right, #f59e0b, #ef4444)' }}
                       className="h-full rounded-full transition-all duration-1000" />
                </div>
                <p style={{ color: T.outline }} className="text-[11px]">Based on current job market applicant volume.</p>

                <div style={{ borderTop: `1px solid ${T.outlineVar}20` }} className="mt-4 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={12} style={{ color: T.primary }} />
                    <SectionLabel>Salary Path (LPA)</SectionLabel>
                  </div>
                  <div className="h-[70px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salaryData} margin={{ top:0, left:-28, right:0, bottom:0 }}>
                        <XAxis dataKey="name" tick={{ fill: T.outline, fontSize:10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={chartStyle} formatter={(v) => [`₹${v} LPA`,'Salary']} />
                        <Bar dataKey="v" fill="#6366f1" radius={[4,4,0,0]} barSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* ── G. RESOURCES ────────────────────────────────────── */}
            <div style={{ background: T.surfaceCont }} className="rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div style={{ background: 'rgba(59,130,246,0.12)' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <BookOpen size={16} style={{ color: T.blue }} />
                </div>
                <div>
                  <h2 style={{ color: T.onSurface }} className="font-bold text-base">Recommended Resources</h2>
                  <p style={{ color: T.outline }} className="text-xs mt-0.5">Curated learning materials to get you started</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {rSorted?.vids?.map((v,i)   => <ResourceCard key={`v${i}`} resource={v} type="Video"  />)}
                {rSorted?.courses?.map((c,i) => <ResourceCard key={`c${i}`} resource={c} type="Course" />)}
                {rSorted?.books?.map((b,i)   => <ResourceCard key={`b${i}`} resource={b} type="Book"   />)}
              </div>
            </div>

            {/* ── H. TOP COMPANIES ────────────────────────────────── */}
            {detailData.topCompanies?.length > 0 && (
              <div style={{ background: T.surfaceCont }} className="rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div style={{ background: 'rgba(245,158,11,0.12)' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Building2 size={16} style={{ color: T.amber }} />
                  </div>
                  <h2 style={{ color: T.onSurface }} className="font-bold text-base">Top Hiring Partners</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {detailData.topCompanies.map((comp, idx) => (
                    <div key={idx} style={{ background: T.surfaceContHigh }} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:brightness-110 group">
                      <div style={{ background: T.surfaceContHighest }} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 size={14} style={{ color: T.onSurfaceVar }} />
                      </div>
                      <span style={{ color: T.onSurface }} className="text-[12px] font-semibold truncate">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── I. PROS & CONS ───────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div style={{ background: T.surfaceCont, borderLeft: `3px solid ${T.emerald}` }} className="rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ background:'rgba(16,185,129,0.12)' }} className="w-7 h-7 rounded-lg flex items-center justify-center">
                    <Check size={14} style={{ color: T.emerald }} />
                  </div>
                  <SectionLabel>Opportunities & Pros</SectionLabel>
                </div>
                <ul className="space-y-3">
                  {pros.map((p,i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={14} style={{ color: T.emerald }} className="shrink-0 mt-0.5" />
                      <span style={{ color: T.onSurfaceVar }} className="text-sm leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ background: T.surfaceCont, borderLeft: `3px solid ${T.red}` }} className="rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ background:'rgba(239,68,68,0.12)' }} className="w-7 h-7 rounded-lg flex items-center justify-center">
                    <X size={14} style={{ color: T.red }} />
                  </div>
                  <SectionLabel>Challenges & Cons</SectionLabel>
                </div>
                <ul className="space-y-3">
                  {cons.map((c,i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X size={14} style={{ color: '#fca5a5' }} className="shrink-0 mt-0.5" />
                      <span style={{ color: T.onSurfaceVar }} className="text-sm leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── J. CTA BANNER ───────────────────────────────────── */}
            <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.08) 60%, transparent 100%)', border: `1px solid rgba(128,131,255,0.15)`, boxShadow: '0 24px 48px -12px rgba(0,0,0,0.4)' }}
                 className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div style={{ background: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.18), transparent 65%)' }} className="absolute inset-0 pointer-events-none" />
              <div className="relative">
                <h2 style={{ color: T.onSurface, letterSpacing: '-0.01em' }} className="text-xl font-black mb-2">Ready to pursue {selectedCareer}?</h2>
                <p style={{ color: T.onSurfaceVar }} className="text-sm">Take the first step. Our AI will guide you through every stage.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 relative">
                <button style={{ background: T.surfaceContHighest, color: T.onSurfaceVar, border: `1px solid ${T.outlineVar}40` }}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm hover:brightness-125 transition-all">
                  <Award size={15} /> Save Career
                </button>
                <button style={{ background: `linear-gradient(135deg, #6366f1, #7c3aed)`, color: '#fff', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(99,102,241,0.4)] transition-all">
                  <Rocket size={15} /> Start Learning Path
                </button>
              </div>
            </div>

          </>)}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LIST VIEW — Career Cards
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 min-h-[calc(100vh-140px)]" style={{ fontFamily:'Inter,sans-serif' }}>
      <div style={{ background: T.surfaceCont }} className="rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase style={{ color: T.primary }} size={22} />
          <h2 style={{ color: T.onSurface, letterSpacing: '-0.01em' }} className="text-2xl font-black">Recommended Career Paths</h2>
        </div>
        <p style={{ color: T.onSurfaceVar }} className="mb-8 text-sm leading-relaxed">
          AI has matched your current performance, subjects, and study habits with the following high-potential career tracks in the Indian market.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {careers.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectCareer(item.career)}
              style={{ background: T.surfaceContHigh }}
              className="rounded-2xl p-6 group cursor-pointer transition-all hover:-translate-y-1 hover:brightness-110 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div style={{ background:'rgba(99,102,241,0.12)', border:'1px solid rgba(128,131,255,0.15)' }}
                     className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <Briefcase size={20} style={{ color: T.primary }} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-right">
                  <p style={{ color: T.outline, letterSpacing:'0.08em', fontSize:'9px' }} className="font-bold uppercase">AI Match</p>
                  <p style={{ color: T.emerald }} className="text-lg font-black">{item.matchScore}%</p>
                </div>
              </div>
              <h3 style={{ color: T.onSurface }} className="text-xl font-bold mb-3">{item.career}</h3>
              <p style={{ color: T.onSurfaceVar }} className="text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{item.reason}</p>
              <div style={{ borderTop:`1px solid ${T.outlineVar}20`, color: T.primary }}
                   className="flex items-center justify-between text-xs font-bold uppercase tracking-wider pt-4">
                <span>View Details & Roadmap</span>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPathView;
