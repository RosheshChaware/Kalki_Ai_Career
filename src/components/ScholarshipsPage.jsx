import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, Filter, BookOpen, Clock, Heart, CheckCircle,
  GraduationCap, Briefcase, HandCoins, User, AlertCircle, Calendar, IndianRupee,
  ChevronDown, X, ExternalLink
} from 'lucide-react';
import { mockScholarships } from '../data/ScholarshipsData';

const ApplicationTips = () => {
  const tips = [
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Start Early",
      description: "Don't wait until the deadline. Start organizing your essays and recommendation letters weeks in advance."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      title: "Prepare Documents",
      description: "Keep your transcripts, certificates, and ID proofs ready in digital format to easily attach when applying."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-primary" />,
      title: "Follow Instructions",
      description: "Read the eligibility and requirements carefully. Even minor mistakes can lead to application rejection."
    }
  ];

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6">Application Tips</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip, index) => (
          <div key={index} className="glass-card rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {tip.icon}
            </div>
            <h4 className="text-lg font-semibold mb-2">{tip.title}</h4>
            <p className="text-textMuted text-sm leading-relaxed">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScholarshipsPage = ({ onClose }) => {
  const [scholarships] = useState(mockScholarships);
  const [searchQuery, setSearchQuery] = useState("");
  const initialFilters = {
    type: 'All Types',
    category: 'All Categories',
    educationLevel: 'All Levels',
    difficulty: 'All Difficulties',
    maxAmount: 500000,
  };
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('Deadline (Nearest First)');
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [selectedScholarship, setSelectedScholarship] = useState(null);
  
  // Local state for actions to match existing safety rules
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Filter Categories
  const filterOptions = {
    type: ['All Types', 'Government', 'State Government', 'Central Government', 'AICTE', 'International', 'Research', 'Minority', 'Sports', 'Women'],
    category: ['All Categories', 'Merit-based', 'Need-based', 'Minority', 'Research', 'Sports', 'Girls/Women'],
    educationLevel: ['All Levels', '10th Pass', '12th Pass', 'Undergraduate', 'Postgraduate', 'Diploma', 'PhD'],
    difficulty: ['All Difficulties', 'Easy', 'Medium', 'Hard'],
  };
  const sortOptions = ['Deadline (Nearest First)', 'Highest Amount', 'Highest Success Rate', 'Most Popular'];

  // Search & Filter Logic
  const filteredScholarships = useMemo(() => {
    let result = scholarships.filter(scholarship => {
      const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesType = false;
      if (appliedFilters.type === 'All Types') {
        matchesType = true;
      } else if (appliedFilters.type === 'Government') {
        matchesType = scholarship.type.includes('Government');
      } else {
        matchesType = scholarship.type === appliedFilters.type;
      }

      const matchesCat = appliedFilters.category === 'All Categories' || scholarship.category === appliedFilters.category;
      const matchesLevel = appliedFilters.educationLevel === 'All Levels' || scholarship.educationLevel === appliedFilters.educationLevel || scholarship.educationLevel.includes(appliedFilters.educationLevel);
      const matchesDiff = appliedFilters.difficulty === 'All Difficulties' || scholarship.difficulty === appliedFilters.difficulty;
      const matchesAmount = scholarship.amountValue <= appliedFilters.maxAmount;
      
      return matchesSearch && matchesType && matchesCat && matchesLevel && matchesDiff && matchesAmount;
    });

    // Sort Logic
    return result.sort((a, b) => {
      if (sortBy === 'Deadline (Nearest First)') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'Highest Amount') {
        return b.amountValue - a.amountValue;
      }
      if (sortBy === 'Highest Success Rate') {
        return b.successRate - a.successRate;
      }
      if (sortBy === 'Most Popular') {
        return b.awardsAvailable - a.awardsAvailable; // proxy for most popular
      }
      return 0;
    });
  }, [scholarships, searchQuery, appliedFilters, sortBy]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setActiveDropdown(null);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setActiveDropdown(null);
  };

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: initialFilters[key] }));
    setAppliedFilters(prev => ({ ...prev, [key]: initialFilters[key] }));
  };

  const Dropdown = ({ label, options, value, onChange, dropKey }) => (
    <div className="relative">
      <button 
        onClick={() => setActiveDropdown(activeDropdown === dropKey ? null : dropKey)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
      >
        <span className="truncate">{value === initialFilters[dropKey] ? label : value}</span>
        <ChevronDown className={`w-4 h-4 text-textMuted transition-transform ${activeDropdown === dropKey ? 'rotate-180' : ''}`} />
      </button>
      {activeDropdown === dropKey && (
        <div className="absolute top-full left-0 right-0 mt-2 p-1 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setActiveDropdown(null); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                value === opt ? 'bg-primary/20 text-primary font-medium' : 'text-textMuted hover:bg-white/5 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const toggleSave = (id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markApplied = (id) => {
    setAppliedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  if (selectedScholarship) {
    const isSaved = savedIds.has(selectedScholarship.id);
    const isApplied = appliedIds.has(selectedScholarship.id);

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <button 
            onClick={() => setSelectedScholarship(null)}
            className="flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Scholarships</span>
          </button>

          {/* Details Hero Section */}
          <div className="glass-card rounded-3xl p-8 mb-8 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/30">
                 {selectedScholarship.category}
               </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 pr-32">{selectedScholarship.title}</h1>
            <p className="text-xl text-primary font-medium mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" /> {selectedScholarship.provider}
            </p>
            <p className="text-textMuted text-lg max-w-3xl leading-relaxed mb-8">
              {selectedScholarship.description}
            </p>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="text-textMuted text-sm mb-1 flex items-center gap-2"><IndianRupee className="w-4 h-4" /> Amount</div>
                <div className="text-2xl font-bold text-white">{selectedScholarship.amount}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="text-textMuted text-sm mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Deadline</div>
                <div className="text-2xl font-bold text-white">{new Date(selectedScholarship.deadline).toLocaleDateString()}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="text-textMuted text-sm mb-1 flex items-center gap-2"><HandCoins className="w-4 h-4" /> Awards</div>
                <div className="text-2xl font-bold text-white">{selectedScholarship.awardsAvailable}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="text-textMuted text-sm mb-1 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Success Rate</div>
                <div className="text-2xl font-bold text-white">{selectedScholarship.successRate}%</div>
              </div>
            </div>
          </div>

          {/* Details Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Eligibility */}
              <div className="glass-card rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <User className="text-primary w-6 h-6" />
                  Eligibility Criteria
                </h3>
                <ul className="space-y-4">
                  {selectedScholarship.eligibility.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-textMuted">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="glass-card rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Briefcase className="text-primary w-6 h-6" />
                  Requirements
                </h3>
                <ul className="space-y-4">
                  {selectedScholarship.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-textMuted">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Application Process */}
              <div className="glass-card rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <CheckCircle className="text-primary w-6 h-6" />
                  Application Steps
                </h3>
                <div className="space-y-6 text-textMuted">
                  {selectedScholarship.applicationSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-bold text-white text-sm">
                        {i + 1}
                      </div>
                      <div className="pt-1">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Actions & Extra Details */}
            <div className="space-y-8">
               <div className="glass-card rounded-2xl p-6 border border-white/10 sticky top-8">
                 <h3 className="font-bold text-lg mb-6">Take Action</h3>
                 <div className="flex flex-col gap-4">
                   <button 
                     onClick={() => markApplied(selectedScholarship.id)}
                     disabled={isApplied}
                     className={`w-full py-4 rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-2 ${
                       isApplied 
                         ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                         : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
                     }`}
                   >
                     {isApplied ? <><CheckCircle className="w-5 h-5"/> Applied Successfully</> : "Apply Now"}
                   </button>
                   
                   <button 
                     onClick={() => toggleSave(selectedScholarship.id)}
                     className={`w-full py-4 rounded-xl font-bold border transition-colors flex items-center justify-center gap-2 ${
                       isSaved
                         ? 'bg-white/10 border-white/20 text-white'
                         : 'border-white/10 hover:bg-white/5 text-textMuted hover:text-white'
                     }`}
                   >
                     <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                     {isSaved ? 'Saved to List' : 'Save for Later'}
                   </button>
                   
                   {selectedScholarship.officialUrl && (
                     <a 
                       href={selectedScholarship.officialUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-full py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-white"
                     >
                       <ExternalLink className="w-5 h-5" /> Visit Official Site
                     </a>
                   )}
                 </div>
                 
                 <div className="h-px w-full bg-white/10 my-6" />
                 
                 <div>
                   <h4 className="text-sm font-semibold text-white mb-2">Additional Information</h4>
                   <p className="text-sm text-textMuted leading-relaxed">
                     {selectedScholarship.details}
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col">
        {/* Navigation & Header Space */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-textMuted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4 text-sm font-medium text-textMuted">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-white">{savedIds.size} Saved</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-white">{appliedIds.size} Applied</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <GraduationCap className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Scholarship Portal</h1>
          <p className="text-textMuted text-lg max-w-2xl mx-auto leading-relaxed">
            Discover scholarships and financial aid opportunities tailored to support your educational journey.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 mb-10 flex flex-col gap-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between z-20">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-textMuted" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Search by name, provider or keyword..."
              />
            </div>
            
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="w-48">
                <Dropdown 
                  label="Sort By" 
                  options={sortOptions} 
                  value={sortBy} 
                  onChange={setSortBy} 
                  dropKey="sortBy" 
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap text-sm font-medium border transition-all ${
                  showFilters ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-textMuted hover:bg-white/10 hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="pt-4 border-t border-white/10 mt-2 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end animate-in fade-in slide-in-from-top-4 z-10">
              <Dropdown label="Type" options={filterOptions.type} value={filters.type} onChange={(v) => setFilters({...filters, type: v})} dropKey="type" />
              <Dropdown label="Category" options={filterOptions.category} value={filters.category} onChange={(v) => setFilters({...filters, category: v})} dropKey="category" />
              <Dropdown label="Education Level" options={filterOptions.educationLevel} value={filters.educationLevel} onChange={(v) => setFilters({...filters, educationLevel: v})} dropKey="educationLevel" />
              <Dropdown label="Difficulty" options={filterOptions.difficulty} value={filters.difficulty} onChange={(v) => setFilters({...filters, difficulty: v})} dropKey="difficulty" />
              
              {/* Max Amount Slider */}
              <div className="w-full px-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-textMuted">Max Amount</span>
                  <span className="font-semibold text-white">₹{filters.maxAmount.toLocaleString('en-IN')}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="500000" 
                  step="5000"
                  value={filters.maxAmount} 
                  onChange={(e) => setFilters({...filters, maxAmount: Number(e.target.value)})}
                  className="w-full accent-primary" 
                />
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-4 lg:col-span-1 flex justify-end gap-3 mt-2">
                <button 
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-textMuted hover:text-white hover:bg-white/5 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={handleApplyFilters}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Active Chips */}
          {(appliedFilters.type !== initialFilters.type || 
            appliedFilters.category !== initialFilters.category || 
            appliedFilters.educationLevel !== initialFilters.educationLevel || 
            appliedFilters.difficulty !== initialFilters.difficulty ||
            appliedFilters.maxAmount !== initialFilters.maxAmount) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-xs text-textMuted mr-1">Active Filters:</span>
              
              {Object.keys(initialFilters).map(key => {
                if (appliedFilters[key] !== initialFilters[key]) {
                  return (
                    <div key={key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                      {key === 'maxAmount' ? `Up to ₹${appliedFilters[key].toLocaleString('en-IN')}` : appliedFilters[key]}
                      <button onClick={() => removeFilter(key)} className="p-0.5 hover:bg-primary/20 rounded-full transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* Dynamic Count */}
        <div className="text-textMuted mb-6 px-2 font-medium">
          Showing <span className="text-white">{filteredScholarships.length}</span> scholarships
        </div>

        {/* Scholarship Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map(scholarship => {
            const isSaved = savedIds.has(scholarship.id);
            const isApplied = appliedIds.has(scholarship.id);

            return (
              <div 
                key={scholarship.id} 
                className="glass-card rounded-2xl flex flex-col border border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6 flex-grow relative">
                  {/* Category Badge & Save */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-textMuted">
                      {scholarship.category}
                    </span>
                    <button 
                      onClick={() => toggleSave(scholarship.id)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-textMuted group-hover:text-white'}`} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{scholarship.title}</h3>
                  <p className="text-primary font-medium text-sm mb-4 line-clamp-1">{scholarship.provider}</p>
                  
                  <p className="text-textMuted text-sm mb-6 line-clamp-3">
                    {scholarship.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-textMuted flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Amount</span>
                      <span className="font-semibold text-white">{scholarship.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-textMuted flex items-center gap-2"><Calendar className="w-4 h-4"/> Deadline</span>
                      <span className="font-semibold text-white">{new Date(scholarship.deadline).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-textMuted flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Success Rate</span>
                        <span className="font-semibold text-white">{scholarship.successRate}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                           className="bg-primary h-full rounded-full transition-all" 
                           style={{ width: `${scholarship.successRate}%`}}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex gap-3">
                  <button 
                    onClick={() => setSelectedScholarship(scholarship)}
                    className="flex-1 py-3 px-3 rounded-xl font-medium text-sm border border-white/10 hover:bg-white/10 transition-colors text-white"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => markApplied(scholarship.id)}
                    disabled={isApplied}
                    className={`flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-colors shadow-lg ${
                      isApplied 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply'}
                  </button>
                  {scholarship.officialUrl && (
                    <a 
                      href={scholarship.officialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors text-white"
                      title="Apply on Official Site"
                    >
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-textMuted" />
            </div>
            <h3 className="text-xl font-bold mb-2">No scholarships found</h3>
            <p className="text-textMuted">Try adjusting your filters or search terms.</p>
            <button 
               onClick={() => {setSearchQuery(""); handleResetFilters();}}
               className="mt-6 text-primary font-medium hover:underline"
            >
               Clear all filters
            </button>
          </div>
        )}

        <ApplicationTips />

      </div>
    </div>
  );
};

export default ScholarshipsPage;
