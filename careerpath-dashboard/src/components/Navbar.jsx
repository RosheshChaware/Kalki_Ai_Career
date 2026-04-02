import React from 'react';
import { User, GraduationCap } from 'lucide-react';

const Navbar = ({ onStartAssessment }) => {
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-background">
      <div className="flex items-center gap-2">
        <GraduationCap className="text-primary w-6 h-6" />
        <span className="text-xl font-semibold tracking-tight">CareerPath</span>
      </div>
      
      <div className="hidden md:flex items-center gap-6 text-sm text-textMuted">
        <button onClick={onStartAssessment} className="hover:text-textMain transition-colors">Subject Advisor</button>
        <a href="#" className="hover:text-textMain transition-colors">College Explorer</a>
        <a href="#" className="hover:text-textMain transition-colors">Career Outcomes</a>
        <a href="#" className="hover:text-textMain transition-colors">Resources</a>
        <a href="#" className="hover:text-textMain transition-colors">Scholarships</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
          <User className="w-4 h-4" />
          <span>Sign In</span>
        </button>
        <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
