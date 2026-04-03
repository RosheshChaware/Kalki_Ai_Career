import React, { useState } from 'react';
import { MapPin, GraduationCap, Briefcase, IndianRupee, BookOpen, ChevronDown, ExternalLink, Building2, Award, Users, DollarSign } from 'lucide-react';

const SectionCard = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.02] transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/5">
          {children}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="text-xs text-gray-500 font-medium shrink-0">{label}</span>
    <span className="text-xs text-gray-300 font-medium text-right">{value}</span>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex-1 min-w-[110px] bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center transition-all duration-200 hover:border-white/10 hover:bg-white/[0.05]">
    <Icon className={`w-4 h-4 mx-auto mb-1.5 ${color}`} />
    <div className="text-[11px] text-gray-500 font-medium mb-0.5">{label}</div>
    <div className="text-sm font-bold text-white truncate">{value}</div>
  </div>
);

const CollegeDetailSidebar = ({ college, distance }) => {
  if (!college) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center text-gray-500 bg-[#111]/50 border border-white/5 rounded-xl">
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-sm font-medium">Select a college marker to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl" key={college.id}>
      {/* Header */}
      <div className="p-5 pb-4 border-b border-white/10 animate-[fadeIn_0.3s_ease-in-out]">
        <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded mb-3 border ${
          college.type === 'government' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          {college.collegeType}
        </span>
        {college.category && (
          <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded mb-3 ml-2 border bg-primary/10 text-primary border-primary/20">
            {college.category}
          </span>
        )}
        <h2 className="text-lg font-bold text-white leading-snug mb-1.5">{college.name}</h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin className="w-3 h-3" />
          <span>{college.location}</span>
          {distance && <span className="ml-1 text-primary font-semibold">• {distance} km</span>}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-white/5 animate-[fadeIn_0.3s_ease-in-out_0.1s_both]">
        <div className="flex flex-wrap gap-2">
          <StatCard icon={Briefcase} label="Avg Package" value={college.avgPackage} color="text-green-400" />
          <StatCard icon={Award} label="Top Package" value={college.highestPackage} color="text-yellow-400" />
          <StatCard icon={IndianRupee} label="Fees" value={college.fees} color="text-blue-400" />
        </div>
      </div>

      {/* Scrollable Sections */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 animate-[fadeIn_0.3s_ease-in-out_0.2s_both]">
        
        {/* Overview */}
        <SectionCard title="Overview" icon={Building2} defaultOpen={true}>
          <InfoRow label="College Name" value={college.name} />
          <InfoRow label="Location" value={college.location} />
          {distance && <InfoRow label="Distance" value={`${distance} km away`} />}
          <InfoRow label="College Type" value={college.collegeType} />
          {college.category && <InfoRow label="Field / Stream" value={college.category} />}
          <InfoRow label="Affiliation" value={college.affiliation} />
        </SectionCard>

        {/* Admission Details */}
        <SectionCard title="Admission Details" icon={GraduationCap} defaultOpen={true}>
          <InfoRow label="Cutoff" value={college.cutoff} />
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs text-gray-500 font-medium shrink-0">Entrance Exams</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {college.exams?.map((exam, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-md">
                  {exam}
                </span>
              ))}
            </div>
          </div>
          <InfoRow label="Eligibility" value={college.eligibility} />
        </SectionCard>

        {/* Placements */}
        <SectionCard title="Placements" icon={Briefcase}>
          <InfoRow label="Avg Package" value={college.avgPackage} />
          <InfoRow label="Highest Package" value={college.highestPackage} />
          <div>
            <span className="text-xs text-gray-500 font-medium block mb-2">Top Recruiters</span>
            <div className="flex flex-wrap gap-1.5">
              {college.recruiters?.map((r, i) => (
                <span key={i} className="px-2 py-1 text-[10px] font-semibold bg-white/5 border border-white/10 rounded-md text-gray-300">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Fees Structure */}
        <SectionCard title="Fees Structure" icon={IndianRupee}>
          <InfoRow label="Tuition Fees" value={college.fees} />
          <InfoRow label="Hostel Fees" value={college.hostelFees} />
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-semibold">Estimated Total</span>
              <span className="text-xs text-primary font-bold">
                {college.fees} + {college.hostelFees}
              </span>
            </div>
          </div>
        </SectionCard>

        {/* Additional Details */}
        <SectionCard title="Additional Details" icon={BookOpen}>
          <div>
            <span className="text-xs text-gray-500 font-medium block mb-2">Courses Offered</span>
            <div className="flex flex-wrap gap-1.5">
              {college.courses?.map((c, i) => (
                <span key={i} className="px-2 py-1 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-md">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block mb-2">Facilities</span>
            <div className="flex flex-wrap gap-1.5">
              {college.facilities?.map((f, i) => (
                <span key={i} className="px-2 py-1 text-[10px] font-semibold bg-white/5 border border-white/10 rounded-md text-gray-300">
                  {f}
                </span>
              ))}
            </div>
          </div>
          {college.website && (
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit Official Website
            </a>
          )}
        </SectionCard>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CollegeDetailSidebar;
