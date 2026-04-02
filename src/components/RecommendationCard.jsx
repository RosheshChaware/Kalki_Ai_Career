import React from 'react';
import { BookOpen, Briefcase, GraduationCap } from 'lucide-react';

const RecommendationCard = ({ 
  title, 
  badge, 
  description, 
  coreSubjects, 
  careerOptions, 
  entranceExams 
}) => {
  return (
    <div className="glass-card rounded-3xl p-8 mb-8 border border-white/10 hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <GraduationCap className="w-32 h-32 -rotate-12" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary border border-primary/20">
          {badge}
        </span>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>

      <p className="text-textMuted mb-10 max-w-2xl text-lg leading-relaxed">
        {description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Core Subjects */}
        <div>
          <div className="flex items-center gap-2 text-primary mb-4 font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>Core Subjects</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-textMuted">
            {coreSubjects.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">{s}</span>
            ))}
          </div>
        </div>

        {/* Career Options */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-primary mb-4 font-semibold">
            <Briefcase className="w-5 h-5" />
            <span>Career Options</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {careerOptions.map((c, i) => (
              <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 hover:bg-indigo-500/20 transition-colors">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Entrance Exams */}
        <div>
          <div className="flex items-center gap-2 text-primary mb-4 font-semibold">
            <GraduationCap className="w-5 h-5" />
            <span>Entrance Exams</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-textMuted">
            {entranceExams.map((e, i) => (
              <span key={i} className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
