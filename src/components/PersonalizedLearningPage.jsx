import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { jsPDF } from 'jspdf';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Target, 
  Briefcase, 
  Settings, 
  Search, 
  Bell, 
  Trophy, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen,
  ClipboardList,
  LogOut,
  Sparkles,
  Bot,
  ChevronDown,
  Download,
  History,
  FileText,
  X,
  Save,
  MoreVertical
} from 'lucide-react';
import AdaptiveRoadmap from './AdaptiveRoadmap';
import CareerPathView from './CareerPathView';
import SettingsView from './SettingsView';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];
const PersonalizedLearningPage = ({ onClose, onReanalyze, onOpenStudyMaterials, onOpenPracticeQuestions, onOpenCareerDetails, aiResult: freshResult }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(!freshResult);
  const [data, setData] = useState(freshResult || null);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Quick Actions State
  const [actionsOpen, setActionsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [notesContent, setNotesContent] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    if (freshResult || !user) return;
    (async () => {
      try {
        const sessionsRef = collection(db, 'results', user.uid, 'sessions');
        const q = query(sessionsRef, orderBy('createdAt', 'desc'), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setData(snap.docs[0].data());
        } else {
          onReanalyze?.();
        }
      } catch (e) {
        console.error('[Dashboard] Firestore fetch error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, freshResult, onReanalyze]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const localNotes = JSON.parse(localStorage.getItem('ai_learning_notes') || '[]');
    setSavedNotes(localNotes);
    
    const localHistory = JSON.parse(localStorage.getItem('ai_learning_history') || '[]');
    setHistoryList(localHistory);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.aiOutput) return null;

  const ai = data.aiOutput;
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const avgScore = ai.subjectScores?.length 
    ? Math.round(ai.subjectScores.reduce((a, b) => a + (Number(b.score) || 0), 0) / ai.subjectScores.length)
    : 0;

  // Process data for Mistake Distribution Pie Chart
  const mistakeData = ai.learningIssues?.length > 0 
    ? ai.learningIssues.map(iss => ({
        name: iss.type,
        value: iss.severity === 'high' ? 3 : iss.severity === 'medium' ? 2 : 1
      }))
    : [{ name: 'No Major Issues', value: 1 }];

  // Persist History when data updates
  useEffect(() => {
    if (ai && ai.subjectScores) {
        const localHistory = JSON.parse(localStorage.getItem('ai_learning_history') || '[]');
        
        // Prevent duplicate consecutive saves
        const isDuplicate = localHistory.length > 0 && 
                            localHistory[0].score === `${avgScore}%` && 
                            localHistory[0].subject === (ai.weakSubjects?.[0]?.subject || 'N/A') &&
                            localHistory[0].issues === (ai.learningIssues?.length || 0);
                            
        if (!isDuplicate) {
            const newEntry = {
                date: new Date().toLocaleString(),
                subject: ai.weakSubjects?.[0]?.subject || 'N/A',
                score: `${avgScore}%`,
                issues: ai.learningIssues?.length || 0,
                detail: `Analyzed ${ai.subjectScores.length} subjects with ${ai.learningIssues?.length || 0} issues found.`
            };
            const updatedHistory = [newEntry, ...localHistory];
            localStorage.setItem('ai_learning_history', JSON.stringify(updatedHistory));
            setHistoryList(updatedHistory);
        }
    }
  }, [ai, avgScore]);

  const downloadPDF = async () => {
    setActionsOpen(false);
    if (!ai) {
      alert("No data available to generate report.");
      return;
    }
    
    try {
      const doc = new jsPDF();
      let y = 20;
      
      const addText = (text, size, isBold = false, color = [0, 0, 0]) => {
          doc.setFont('helvetica', isBold ? 'bold' : 'normal');
          doc.setFontSize(size);
          doc.setTextColor(color[0], color[1], color[2]);
          const lines = doc.splitTextToSize(String(text), 170);
          
          if (y + (lines.length * (size/2)) > 280) {
              doc.addPage();
              y = 20;
          }
          
          doc.text(lines, 20, y);
          y += (lines.length * (size/2.5)) + 4;
      };

      // 1. Title & Header
      addText(`Student Learning Report`, 22, true, [30, 58, 138]);
      y += 2;
      addText(`Student Name: ${displayName}`, 12, true);
      addText(`Report Generated: ${new Date().toLocaleString()}`, 10, false, [100, 100, 100]);
      y += 6;
      
      // 2. Overview Section
      addText('1. Overall Performance', 16, true, [50, 50, 50]);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y-3, 190, y-3);
      y += 3;
      addText(`Score: ${avgScore}%`, 12);
      addText(`Strong Area: ${ai.strongSubjects?.[0]?.subject || 'N/A'}`, 12);
      addText(`Weak Area: ${ai.weakSubjects?.[0]?.subject || 'N/A'}`, 12);
      addText(`Learning Pace: ${ai.learningProfile?.consistencyLevel || 'Moderate'}`, 12);
      y += 6;
      
      // 3. Subject-wise Summary
      addText('2. Subject Profile', 16, true, [50, 50, 50]);
      doc.line(20, y-3, 190, y-3);
      y += 3;
      if (ai.subjectScores && ai.subjectScores.length > 0) {
          ai.subjectScores.forEach(ss => addText(`• ${ss.subject}: ${ss.score}%`, 11));
      } else {
          addText('No subject data found.', 11);
      }
      y += 6;
      
      // 4. Mistake Patterns
      addText('3. Error Analysis', 16, true, [50, 50, 50]);
      doc.line(20, y-3, 190, y-3);
      y += 3;
      if (ai.learningIssues && ai.learningIssues.length > 0) {
          ai.learningIssues.forEach(iss => addText(`• [${iss.severity.toUpperCase()}] ${iss.type}`, 11));
      } else {
          addText('No major issues detected.', 11);
      }
      y += 6;
      
      // 5. Smart Recommendations & Roadmap
      addText('4. Learning Roadmap', 16, true, [50, 50, 50]);
      doc.line(20, y-3, 190, y-3);
      y += 3;
      if (ai.recommendedFocus && ai.recommendedFocus.length > 0) {
          ai.recommendedFocus.forEach((plan, idx) => {
              addText(`${idx + 1}. ${plan.subject}`, 12, true);
              addText(`Goal: ${plan.reason}`, 10, false, [80,80,80]);
              if (plan.actionPlan) {
                  plan.actionPlan.forEach(action => addText(`  - ${action}`, 10));
              }
              y += 2;
          });
      } else {
          addText('No roadmap data found.', 11);
      }
      y += 6;
      
      // 6. AI Insights
      addText('5. AI Insights', 16, true, [50, 50, 50]);
      doc.line(20, y-3, 190, y-3);
      y += 3;
      addText(ai.insights?.overallAnalysis || "We are still gathering enough data to provide deep insights.", 11, false, [50,50,50]);
      
      const filename = `${displayName.replace(/[^a-zA-Z0-9]/g, '_')}_Learning_Report.pdf`;
      doc.save(filename);
      
    } catch (err) {
      console.error("PDF Export failed", err);
      alert("Failed to export true PDF.");
    }
  };

  const saveNote = () => {
    if (!notesContent.trim()) return;
    const note = { text: notesContent, timestamp: new Date().toLocaleString() };
    const updatedNotes = [note, ...savedNotes];
    setSavedNotes(updatedNotes);
    localStorage.setItem('ai_learning_notes', JSON.stringify(updatedNotes));
    setNotesContent('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-200 font-sans flex text-sm selection:bg-indigo-500/30">
      
      {/* ── LEFT SIDEBAR (FIXED) ── */}
      <aside className="w-64 bg-[#111116] border-r border-[#ffffff0A] flex flex-col hidden md:flex sticky top-0 h-screen z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Zap size={18} />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">Smart AI</span>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Roadmap', icon: Target },
            { id: 'Career Path', icon: Briefcase },
            { id: 'Settings', icon: Settings },
          ].map(m => (
            <button 
              key={m.id} 
              onClick={() => setActiveMenu(m.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeMenu === m.id ? 'bg-[#1C1C24] text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-[#ffffff05]'
              }`}>
              <m.icon size={18} className={activeMenu === m.id ? 'text-indigo-400' : ''} /> 
              {m.id}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#ffffff0A]">
          <button onClick={onClose} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium">
            <LogOut size={18} /> Exit Dashboard
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        
        {/* ── TOP SECTION ── */}
        <header className="px-8 py-6 flex items-end justify-between sticky top-0 bg-[#0A0A0F]/90 backdrop-blur-md z-10 border-b border-[#ffffff0A]">
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">Hello, {displayName}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {activeMenu === 'Roadmap' ? "Here is your adaptive learning sequencer designed by AI." : "Here's your learning intelligence overview."}
            </p>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-64 bg-[#111116] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-[#ffffff0A] placeholder-gray-500 transition-all" 
              />
            </div>
            <button className="text-gray-400 hover:text-white transition-colors relative hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0A0A0F]" />
            </button>
            
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setActionsOpen(!actionsOpen)}
                className="flex items-center gap-2 bg-[#1A1A22] hover:bg-[#252530] text-gray-200 border border-[#ffffff10] px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
              >
                <span className="hidden sm:inline">Actions</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${actionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Actions Menu */}
              {actionsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-[2px]" 
                    onClick={() => setActionsOpen(false)} 
                  />
                  <div className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 bg-[#1C1C24] border border-[#ffffff10] shadow-2xl md:w-56 rounded-t-2xl md:rounded-xl z-50 overflow-hidden transform transition-all duration-300 py-2">
                    <div className="px-4 py-4 mb-2 border-b border-[#ffffff0A] md:hidden">
                      <h3 className="text-white font-bold text-center text-lg">Quick Actions</h3>
                    </div>
                    
                    <button onClick={downloadPDF} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#ffffff0A] text-gray-300 hover:text-white transition-colors group">
                      <Download size={16} className="text-gray-500 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-sm font-medium">Download Report (PDF)</span>
                    </button>
                    
                    <button onClick={() => { setActionsOpen(false); setIsHistoryOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#ffffff0A] text-gray-300 hover:text-white transition-colors group">
                      <History size={16} className="text-gray-500 group-hover:text-green-400 transition-colors" />
                      <span className="text-sm font-medium">View Learning History</span>
                    </button>
                    
                    <button onClick={() => { setActionsOpen(false); setIsNotesOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#ffffff0A] text-gray-300 hover:text-white transition-colors group">
                      <FileText size={16} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                      <span className="text-sm font-medium">My Notes</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md border border-[#ffffff10] cursor-pointer hover:opacity-90 transition-opacity shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] w-full mx-auto space-y-8">
          
          {activeMenu === 'Roadmap' ? (
            <AdaptiveRoadmap aiResult={data.aiOutput} user={user} />
          ) : activeMenu === 'Career Path' ? (
            <CareerPathView aiResult={data.aiOutput} />
          ) : activeMenu === 'Settings' ? (
            <SettingsView user={user} inputData={data.inputData} />
          ) : (
            <>
              {/* ── ROW 1: SUMMARY CARDS ── */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-[#111116] rounded-2xl p-5 border border-[#ffffff0A] flex items-center gap-4 hover:border-indigo-500/30 transition-colors">
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Overall Score</p>
                    <p className="text-xl font-bold text-white">{avgScore}%</p>
                  </div>
                </div>
                <div className="bg-[#111116] rounded-2xl p-5 border border-[#ffffff0A] flex items-center gap-4 hover:border-green-500/30 transition-colors">
                  <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Strong Area</p>
                    <p className="text-xl font-bold text-white truncate max-w-[140px]">{ai.strongSubjects?.[0]?.subject || 'N/A'}</p>
                  </div>
                </div>
                <div className="bg-[#111116] rounded-2xl p-5 border border-[#ffffff0A] flex items-center gap-4 hover:border-orange-500/30 transition-colors">
                  <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Weak Area</p>
                    <p className="text-xl font-bold text-white truncate max-w-[140px]">{ai.weakSubjects?.[0]?.subject || 'N/A'}</p>
                  </div>
                </div>
                <div className="bg-[#111116] rounded-2xl p-5 border border-[#ffffff0A] flex items-center gap-4 hover:border-purple-500/30 transition-colors">
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                    <Zap size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Learning Pace</p>
                    <p className="text-xl font-bold text-white capitalize">{ai.learningProfile?.consistencyLevel || 'Moderate'}</p>
                  </div>
                </div>
              </section>

              {/* ── ROW 2: CHART SECTION ── */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#111116] rounded-2xl p-6 border border-[#ffffff0A]">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-white">Subject Performance</h2>
                    <button onClick={onReanalyze} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">Update Data</button>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ai.subjectScores || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: '#1C1C24', border: '1px solid #ffffff10', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="score" radius={[4, 4, 4, 4]} barSize={24}>
                          {(ai.subjectScores || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#111116] rounded-2xl p-6 border border-[#ffffff0A] flex flex-col">
                  <h2 className="font-bold text-white mb-6">Mistake Distribution</h2>
                  <div className="flex-1 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mistakeData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {mistakeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1C1C24', border: '1px solid #ffffff10', borderRadius: '8px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-white">{ai.learningIssues?.length || 0}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Issues</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── ROW 3: AI INSIGHTS ── */}
              <section className="bg-[#111116] rounded-2xl p-8 border border-indigo-500/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl" />
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="text-indigo-400" size={20} />
                  <h2 className="font-bold text-white text-lg">AI Insights</h2>
                </div>
                <p className="text-gray-300 leading-relaxed max-w-5xl text-[15px]">
                  {ai.insights?.overallAnalysis || "We are still gathering enough data to provide deep insights. Complete more sessions to unlock comprehensive intelligence."}
                </p>
              </section>

              {/* ── ROW 4: ACTION PLAN ── */}
              <section>
                <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                  <Target size={18} className="text-purple-400" /> Action Plan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {(ai.recommendedFocus || []).slice(0, 3).map((plan, idx) => (
                    <div key={idx} className="bg-[#111116] rounded-2xl p-6 border border-[#ffffff0A] hover:-translate-y-1 transition-transform duration-300">
                      <div className="w-8 h-8 rounded-full bg-[#1C1C24] flex items-center justify-center text-xs font-bold text-white mb-4 border border-[#ffffff10]">
                        0{idx + 1}
                      </div>
                      <h3 className="font-bold text-white mb-2">{plan.subject}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed border-b border-[#ffffff0A] pb-4 mb-4">
                        {plan.reason}
                      </p>
                      <ul className="space-y-2">
                        {(plan.actionPlan || ['Review standard syllabus', 'Practice weak areas']).map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2 text-[11px] text-gray-300">
                            <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── ROW 5: SMART RECOMMENDATIONS ── */}
              <section className="relative bg-[#111116]/80 backdrop-blur-sm border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl p-8 mb-8 mt-2">
                <style>{`
                  @keyframes floatBot {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                  }
                `}</style>
                
                {/* AI Visual Element */}
                <div 
                  className="absolute top-4 right-4 text-indigo-400/50 hover:text-indigo-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.8)] group cursor-help z-20" 
                  style={{ animation: 'floatBot 3s ease-in-out infinite' }}
                >
                  <Bot size={26} />
                  
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full right-0 mb-3 w-max px-3 py-2 bg-[#1C1C24]/90 backdrop-blur border border-[#ffffff1A] rounded-lg shadow-xl text-xs text-gray-200 pointer-events-none whitespace-nowrap">
                    AI Recommendations powered by Smart Engine
                    {/* Tooltip Arrow pointing down */}
                    <div className="absolute top-full right-3 -mt-[1px] border-solid border-t-[#ffffff1A] border-t-8 border-x-transparent border-x-8 border-b-0 w-0 h-0" />
                    <div className="absolute top-full right-[13px] -mt-[2px] border-solid border-t-[#1C1C24] border-t-[6px] border-x-transparent border-x-[6px] border-b-0 w-0 h-0" />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Lightbulb size={22} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" /> Smart Recommendations
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Focused action outputs driven by your performance AI</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mix-blend-lighten">
                  {/* Study Materials */}
                  <div className="bg-[#1C1C24]/60 rounded-xl p-6 border border-[#ffffff0A] hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(79,70,229,0.1)] transition-all duration-300">
                    <h3 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                      <BookOpen size={20} className="text-indigo-400 shrink-0" />
                      Study Materials
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 truncate">Curated dynamically based on your learning style.</p>
                    <button 
                      onClick={onOpenStudyMaterials}
                      className="w-full py-3 rounded-lg bg-[#252530]/80 hover:bg-indigo-600/10 hover:text-indigo-300 font-semibold transition-all border border-transparent hover:border-indigo-500/30 text-gray-300 active:scale-95"
                    >
                      View Resources
                    </button>
                  </div>

                  {/* Practice Questions */}
                  <div className="bg-[#1C1C24]/60 rounded-xl p-6 border border-[#ffffff0A] hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(79,70,229,0.1)] transition-all duration-300">
                    <h3 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                      <ClipboardList size={20} className="text-indigo-400 shrink-0" />
                      Practice Questions
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 truncate">Targeting your key weakness: {ai.weakSubjects?.[0]?.subject || 'Identified Gaps'}.</p>
                    <button 
                      onClick={onOpenPracticeQuestions}
                      className="w-full py-3 rounded-lg bg-[#252530]/80 hover:bg-indigo-600/10 hover:text-indigo-300 font-semibold transition-all border border-transparent hover:border-indigo-500/30 text-gray-300 active:scale-95"
                    >
                      Start Practice
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

        </div>
      </main>

      {/* ── SLIDE-OVER PANELS ── */}
      {/* Overlay Background */}
      {(isNotesOpen || isHistoryOpen) && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => { setIsNotesOpen(false); setIsHistoryOpen(false); }}
        />
      )}

      {/* My Notes Slide-Over Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#111116] border-l border-[#ffffff0A] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isNotesOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-6 py-5 border-b border-[#ffffff10] flex justify-between items-center bg-[#0A0A0F]/50 shrink-0">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <h2 className="font-bold">My Notes</h2>
          </div>
          <button onClick={() => setIsNotesOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#1C1C24] transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto w-full flex flex-col gap-4">
          <p className="text-gray-400 text-sm">Jot down key takeaways or formulas you want to remember from your learning journey.</p>
          <div className="flex flex-col gap-2 relative">
            <textarea
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              placeholder="Start typing your notes here..."
              className="w-full h-[150px] bg-[#1A1A22] text-gray-200 border border-[#ffffff10] focus:border-purple-500/40 rounded-xl p-4 text-sm leading-relaxed focus:outline-none transition-all resize-none shadow-inner"
            />
            <button onClick={saveNote} className="absolute bottom-3 right-3 flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-500 text-white font-medium py-1.5 px-4 rounded-xl transition-all shadow-md shadow-purple-900/40 text-xs">
              <Save size={14} /> Save
            </button>
          </div>
          
          <div className="border-t border-[#ffffff0A] pt-4 mt-2 flex-1 flex flex-col gap-3">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Previous Notes</h3>
            {savedNotes.length === 0 ? (
                <p className="text-xs text-gray-600 italic px-2">No notes saved yet.</p>
            ) : (
                savedNotes.map((note, i) => (
                    <div key={i} className="bg-[#1C1C24] border border-[#ffffff0A] rounded-xl p-4 flex flex-col gap-2 hover:border-[#ffffff15] transition-colors">
                        <p className="text-gray-300 text-[13px] leading-relaxed whitespace-pre-wrap">{note.text}</p>
                        <p className="text-[10px] text-gray-500 text-right font-medium">{note.timestamp}</p>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Learning History Slide-Over Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#111116] border-l border-[#ffffff0A] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-6 py-5 border-b border-[#ffffff10] flex justify-between items-center bg-[#0A0A0F]/50 shrink-0">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
              <History size={18} />
            </div>
            <h2 className="font-bold">Learning History</h2>
          </div>
          <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#1C1C24] transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto relative w-full">
          {/* Timeline Line */}
          <div className="absolute left-10 top-6 bottom-6 w-px bg-white/5" />
          
          <div className="space-y-8 relative">
            {historyList.length === 0 ? (
                <p className="text-xs text-gray-600 italic px-2">No history available yet.</p>
            ) : (
                historyList.map((hist, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-[#0A0A0F] border-2 border-[#1A1A22] flex items-center justify-center shrink-0 z-10 text-[10px] text-gray-500 font-bold group-hover:border-green-500/50 transition-colors shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="bg-[#1A1A22] p-4 rounded-xl border border-[#ffffff05] shadow-sm flex-1 group hover:border-[#ffffff15] transition-all hover:-translate-y-0.5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-200 text-sm group-hover:text-white transition-colors line-clamp-1 pr-2">{hist.subject}</h3>
                        <span className="text-[11px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-bold shrink-0">{hist.score}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mb-2 font-medium tracking-wide rounded-full inline-block border border-[#ffffff0A] bg-[#111116] px-2 py-0.5">{hist.date}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{hist.detail}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedLearningPage;
