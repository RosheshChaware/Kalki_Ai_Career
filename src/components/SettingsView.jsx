import React, { useState, useEffect } from 'react';
import { User as UserIcon, Moon, Sun, Globe, LogOut, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { updateProfile } from '../lib/firestoreService';
import { getGoalsForStream, CLASS_OPTIONS, STREAM_OPTIONS, STREAM_LABELS, getClassCategory } from '../data/goalIntelligence';

const SettingsView = ({ user, inputData }) => {
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    currentClass: inputData?.currentClass || '',
    stream: inputData?.stream || '',
    targetGoal: inputData?.targetGoal || ''
  });
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Apply theme visually (In a real app, this would toggle a 'light' class on body resolving via CSS variables)
    // For this prototype, we store preference and simulate the toggle smoothly.
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme-simulation');
    } else {
      root.classList.remove('light-theme-simulation');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => {
      const newProfile = { ...prev, [name]: value };
      
      // Cascade resets
      if (name === 'currentClass') {
        const oldCat = getClassCategory(prev.currentClass);
        const newCat = getClassCategory(value);
        if (oldCat !== newCat) {
          newProfile.stream = '';
          newProfile.targetGoal = '';
        }
      }
      if (name === 'stream') {
        newProfile.targetGoal = '';
      }
      
      return newProfile;
    });
    setSaveSuccess(false);
  };

  const classCategory = getClassCategory(profile.currentClass);
  const streamOptions = STREAM_OPTIONS[classCategory] || [];
  const streamLabel   = STREAM_LABELS[classCategory] || 'Current Stream';
  const goalOptions = profile.stream ? getGoalsForStream(profile.stream) : [];

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      if (user?.uid) {
        const success = await updateProfile(user.uid, {
          name: profile.name,
          email: profile.email,
          currentClass: profile.currentClass,
          stream: profile.stream,
          goal: profile.targetGoal,
        });
        if (success) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Window reload will automatically push them back to the login screen thanks to AuthContext
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl min-h-[calc(100vh-140px)]">
      <div>
        <h2 className="text-3xl font-black text-white mb-2">Platform Settings</h2>
        <p className="text-gray-400">Manage your profile, preferences, and security sessions.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-[#111116] border border-[#ffffff0A] rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-[#ffffff0A] bg-[#1C1C24] flex items-center gap-3">
          <UserIcon size={18} className="text-indigo-400" />
          <h3 className="font-bold text-white uppercase text-xs tracking-wider">Profile Information</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
            <input 
              name="name" value={profile.name} onChange={handleProfileChange}
              className="w-full bg-[#1C1C24] border border-[#ffffff10] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
            <input 
              disabled value={profile.email}
              className="w-full bg-[#1C1C24] opacity-60 cursor-not-allowed border border-[#ffffff10] rounded-xl px-4 py-3 text-sm text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Current Class</label>
            <select name="currentClass" value={profile.currentClass} onChange={handleProfileChange} className="w-full bg-[#1C1C24] border border-[#ffffff10] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500">
              <option value="" disabled>Select Class</option>
              {CLASS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">{streamLabel}</label>
            <select name="stream" value={profile.stream} onChange={handleProfileChange} disabled={!streamOptions.length} className="w-full bg-[#1C1C24] border border-[#ffffff10] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50">
              <option value="" disabled>{streamOptions.length ? 'Select...' : 'Select class first'}</option>
              {streamOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Target Goal</label>
            <select name="targetGoal" value={profile.targetGoal} onChange={handleProfileChange} disabled={!goalOptions.length} className="w-full bg-[#1C1C24] border border-[#ffffff10] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50">
              <option value="" disabled>{goalOptions.length ? 'Select Goal...' : 'Select stream first'}</option>
              {goalOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          
          <div className="md:col-span-2 flex items-center justify-end mt-2">
            {saveSuccess && <span className="text-green-400 text-sm font-bold flex items-center gap-2 mr-4"><CheckCircle2 size={16}/> Saved Successfully</span>}
            <button 
              onClick={handleSaveProfile} disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Theme Preferences */}
        <div className="bg-[#111116] border border-[#ffffff0A] rounded-2xl overflow-hidden shadow-lg flex flex-col">
          <div className="px-6 py-4 border-b border-[#ffffff0A] bg-[#1C1C24] flex items-center gap-3 shrink-0">
            <Moon size={18} className="text-purple-400" />
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Appearance</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <p className="text-sm text-gray-400 mb-6">Choose your preferred lighting environment for studying.</p>
            
            <div className="flex bg-[#1C1C24] p-1.5 rounded-xl border border-[#ffffff10]">
              <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-[#ffffff05]'}`}>
                <Moon size={16} /> Dark Mode
              </button>
              <button 
                onClick={() => setTheme('light')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-[#ffffff05]'}`}>
                <Sun size={16} /> Light Mode
              </button>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-[#111116] border border-[#ffffff0A] rounded-2xl overflow-hidden shadow-lg flex flex-col">
          <div className="px-6 py-4 border-b border-[#ffffff0A] bg-[#1C1C24] flex items-center gap-3 shrink-0">
            <Globe size={18} className="text-green-400" />
            <h3 className="font-bold text-white uppercase text-xs tracking-wider">Language</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Interface Language</label>
              <select 
                value={language} onChange={e => setLanguage(e.target.value)}
                className="w-full bg-[#1C1C24] border border-[#ffffff10] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500">
                <option value="en">English (Default)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 border-l-2 border-indigo-500/50 pl-3">
              Future AI responses will attempt to incorporate your regional dialect where possible.
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#111116] border border-red-500/20 rounded-2xl overflow-hidden shadow-lg mt-auto">
        <div className="px-6 py-4 border-b border-red-500/10 bg-red-500/5 flex items-center gap-3">
          <ShieldAlert size={18} className="text-red-400" />
          <h3 className="font-bold text-red-400 uppercase text-xs tracking-wider">Account Security</h3>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white mb-1">Sign Out of Device</h4>
            <p className="text-sm text-gray-400">Clear your active session and return to the login screen securely.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold py-3 px-6 rounded-xl transition-all">
            <LogOut size={16} /> Logout Securely
          </button>
        </div>
      </div>
      
      <style>{`
        /* Minimal simulation for Light Theme inversion */
        html.light-theme-simulation {
          filter: invert(0.9) hue-rotate(180deg);
        }
        html.light-theme-simulation img, 
        html.light-theme-simulation svg,
        html.light-theme-simulation .recharts-wrapper {
          filter: invert(1) hue-rotate(180deg);
        }
      `}</style>
    </div>
  );
};

export default SettingsView;
