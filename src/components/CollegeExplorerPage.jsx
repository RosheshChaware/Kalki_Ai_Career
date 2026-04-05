import React, { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, Search, MapPin, Filter } from 'lucide-react';
import MapComponent from './MapComponent';
import CollegeDetailSidebar from './CollegeDetailSidebar';
import { COLLEGES, FIELD_CATEGORIES, haversineDistance } from '../data/CollegeData';

const CollegeExplorerPage = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyKm, setNearbyKm] = useState(10);
  const [userLocation, setUserLocation] = useState({ lat: 21.1458, lng: 79.0882 });
  const [filteredColleges, setFilteredColleges] = useState(COLLEGES);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedField, setSelectedField] = useState("All Fields");

  useEffect(() => {
    // Get user location & update if permitted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const filtered = COLLEGES.filter(college => {
      const distance = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        college.lat,
        college.lng
      );
      
      const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          college.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (college.category && college.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const isWithinDistance = parseFloat(distance) <= nearbyKm;

      const matchesField = selectedField === "All Fields" || college.category === selectedField;
      
      return matchesSearch && isWithinDistance && matchesField;
    });

    setFilteredColleges(filtered);

    // Update search dropdown results
    if (searchQuery.trim().length > 0) {
      setSearchResults(filtered.slice(0, 6));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, nearbyKm, userLocation, selectedField]);

  const handleMarkerClick = (college, distance) => {
    setSelectedCollege(college);
    setSelectedDistance(distance);
  };

  const handleSearchResultClick = (college) => {
    const distance = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      college.lat,
      college.lng
    );
    setSelectedCollege(college);
    setSelectedDistance(distance);
    setShowSearchResults(false);
    setSearchQuery(college.name);
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-background sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-primary w-6 h-6" />
            <span className="text-xl font-semibold tracking-tight">ShikshaSetu</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 md:px-8 py-10 relative">
        <h1 className="text-4xl font-bold mb-4">College Explorer</h1>
        <p className="text-textMuted mb-12 text-center max-w-2xl">
          Discover and explore nearby colleges with smart search, filters, and favorites.
        </p>

        {/* Search and Filters */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text"
              placeholder="Search colleges by name, type, or field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.trim().length > 0) setShowSearchResults(true); }}
              className="w-full bg-surface border border-white/5 rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:border-primary/50 transition-all text-sm font-medium"
            />
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowSearchResults(false)} />
                <div className="absolute top-full left-0 mt-2 w-full bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-40 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {searchResults.map((college) => {
                    const dist = haversineDistance(userLocation.lat, userLocation.lng, college.lat, college.lng);
                    return (
                      <button
                        key={college.id}
                        onClick={() => handleSearchResultClick(college)}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0 ${
                          selectedCollege?.id === college.id ? 'bg-primary/10' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{college.name}</p>
                            <p className="text-[11px] text-gray-500">{college.address}</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono shrink-0 ml-3">{dist} km</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-lg px-4 py-3 shrink-0">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer appearance-none pr-2"
              style={{ backgroundImage: 'none' }}
            >
              {FIELD_CATEGORIES.map((field) => (
                <option key={field} value={field} className="bg-[#111] text-white">
                  {field}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-lg px-4 py-3 shrink-0">
            <span className="text-sm font-medium text-gray-400">Nearby (km):</span>
            <input 
              type="number"
              value={nearbyKm}
              onChange={(e) => setNearbyKm(parseFloat(e.target.value) || 0)}
              className="w-16 bg-transparent focus:outline-none text-sm font-bold border-b border-white/10"
            />
          </div>
        </div>

        {/* Map + Sidebar Layout */}
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 mb-20">
          {/* Map Container */}
          <div className="flex-1 h-[500px] lg:h-[650px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
            {userLocation ? (
              <MapComponent 
                userLocation={userLocation}
                colleges={filteredColleges}
                onMarkerClick={handleMarkerClick}
                selectedCollegeId={selectedCollege?.id}
              />
            ) : (
               <div className="w-full h-full bg-surface/50 flex flex-col items-center justify-center">
                 <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-textMuted animate-pulse">Initializing Map...</p>
               </div>
            )}
          </div>

          {/* College Detail Sidebar */}
          <div className="w-full lg:w-[380px] h-auto lg:h-[650px] flex-shrink-0 lg:sticky lg:top-24">
            <CollegeDetailSidebar 
              college={selectedCollege} 
              distance={selectedDistance} 
            />
          </div>
        </div>

      </main>
    </div>
  );
};

export default CollegeExplorerPage;
