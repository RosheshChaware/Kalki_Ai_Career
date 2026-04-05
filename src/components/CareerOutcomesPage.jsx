import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';
import { getCategorizedCourses } from '../data/CourseData';
import { getNodeDetails } from '../data/NodeDetailsData';
import { ReactFlow, Background, Handle, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Detail Panel Sub-component
const DetailPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center text-gray-500 bg-[#111]/50 border border-white/5 rounded-xl">
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <p className="text-sm font-medium">Click any node on the map to view its detailed academic or career metrics.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col p-6 bg-[#111] border border-white/10 rounded-xl overflow-y-auto custom-scrollbar shadow-2xl animate-fade-in">
      <div className="mb-6 pb-4 border-b border-white/10">
        <span className="inline-block px-2.5 py-1 bg-white/5 text-primary text-[10px] font-bold uppercase tracking-widest rounded mb-3 border border-white/5">
          {data.type === 'academic' ? 'Academic Phase' : 'Career Role'}
        </span>
        <h2 className="text-2xl font-bold text-white leading-tight mb-2">{data.title}</h2>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{data.description}</p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills?.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {data.type === 'academic' ? (
          <>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expected Duration</h3>
              <p className="text-sm text-white font-medium">{data.duration}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Focus</h3>
              <p className="text-sm text-gray-300">{data.focus}</p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Next Progression Step</h3>
              <p className="text-sm text-primary font-semibold">{data.next}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Salary Range</h3>
              <p className="text-sm text-green-400 font-bold">{data.salary}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Top Recruiters / Sectors</h3>
              <p className="text-sm text-gray-300">{data.companies}</p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Growth Scope & Future Options</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{data.scope}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Custom Node for React Flow
const CareerMapNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded text-xs font-semibold text-center text-white ${data.colorClass} w-[220px] shadow-lg border transition-all duration-300 ${selected ? 'ring-2 ring-white scale-105 border-transparent shadow-white/10' : 'border-white/5 hover:scale-[1.02]'}`}>
      <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0 bg-transparent border-0" />
      {data.label}
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0 bg-transparent border-0" />
    </div>
  );
};

const nodeTypes = {
  modern: CareerMapNode,
};

const CareerOutcomesPage = ({ onClose }) => {
  const categorizedCourses = useMemo(() => getCategorizedCourses(), []);
  const allCourses = useMemo(() => Object.values(categorizedCourses).flat(), [categorizedCourses]);

  const [selectedCourseId, setSelectedCourseId] = useState(allCourses[0]?.id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState(null);

  useEffect(() => {
    // Reset side panel when course changes
    setSelectedNodeData(null);
  }, [selectedCourseId]);

  const selectedCourse = useMemo(() => {
    return allCourses.find(c => c.id === selectedCourseId) || allCourses[0];
  }, [selectedCourseId, allCourses]);

  // Generate Flow Graph based on selected course
  const { nodes, edges } = useMemo(() => {
    const newNodes = [];
    const newEdges = [];
    
    // We center the linear flow relative to the canvas internal coordinate system
    const centerX = 400; 

    // Edge Style
    const edgeStyle = {
      type: 'smoothstep',
      style: { stroke: '#9ca3af', strokeWidth: 1.5, strokeDasharray: '5,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' },
    };

    // 1. Eligibility
    newNodes.push({ id: 'eligibility', type: 'modern', position: { x: centerX, y: 50 }, data: { label: selectedCourse.eligibility, colorClass: 'bg-blue-500' } });
    
    // 2. UG
    newNodes.push({ id: 'ug', type: 'modern', position: { x: centerX, y: 150 }, data: { label: selectedCourse.ug, colorClass: 'bg-green-500' } });
    newEdges.push({ id: 'e1', source: 'eligibility', target: 'ug', ...edgeStyle });

    // 3. PG
    newNodes.push({ id: 'pg', type: 'modern', position: { x: centerX, y: 250 }, data: { label: selectedCourse.pg, colorClass: 'bg-yellow-500' } });
    newEdges.push({ id: 'e2', source: 'ug', target: 'pg', ...edgeStyle });

    // 4. Doctoral
    newNodes.push({ id: 'doc', type: 'modern', position: { x: centerX, y: 350 }, data: { label: selectedCourse.doctoral, colorClass: 'bg-purple-500' } });
    newEdges.push({ id: 'e3', source: 'pg', target: 'doc', ...edgeStyle });

    // 5. Careers
    const careerCount = selectedCourse.outcomes.length;
    const spacing = 250;
    const startX = centerX - ((careerCount - 1) * spacing) / 2;

    selectedCourse.outcomes.forEach((outcome, index) => {
       const id = `career-${index}`;
       newNodes.push({ id, type: 'modern', position: { x: startX + index * spacing, y: 500 }, data: { label: outcome, colorClass: 'bg-orange-500' } });
       newEdges.push({ id: `e4-${index}`, source: 'doc', target: id, ...edgeStyle });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [selectedCourse]);

  const handleNodeClick = (event, node) => {
    const details = getNodeDetails(node.id, node.data.label);
    setSelectedNodeData(details);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Header Navigation */}
      <header
        className="flex items-center gap-4 px-8 py-5 sticky top-0 z-50"
        style={{
          background: 'rgba(8, 8, 12, 0.75)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.35)',
        }}
      >
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-primary">ShikshaSetu</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 md:px-8 py-10 relative">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">Course to Career Mapping</h1>
        <p className="text-gray-400 mb-8 text-center text-sm md:text-base max-w-2xl">
          Choose a course to view its academic and career pathway. <span className="text-white font-medium">Click on any node</span> to see detailed metrics.
        </p>

        {/* Custom Dropdown Overlaid perfectly */}
        <div className="relative w-full max-w-lg mb-8 z-50">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between bg-[#111] border border-white/10 rounded py-3 md:py-3.5 px-4 text-left focus:outline-none focus:border-primary/50 transition-all hover:bg-white/5 shadow-md"
          >
            <span className="font-medium text-white truncate pr-4 text-sm md:text-base">
              {selectedCourse.courseName}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay for closing */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full left-0 mt-1 w-full bg-[#111] border border-white/10 rounded shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                {Object.keys(categorizedCourses).map(category => {
                  const coursesInCategory = categorizedCourses[category];
                  if (coursesInCategory.length === 0) return null;
                  return (
                    <div key={category}>
                      {/* Sticky section header */}
                      <div className="px-4 py-2 bg-[#1a1a1a] text-[11px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10 border-y border-white/5">
                        {category}
                      </div>
                      {coursesInCategory.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors text-left text-sm ${
                            selectedCourseId === course.id ? 'bg-primary/20 text-white' : 'text-gray-300'
                          }`}
                        >
                          <span className="truncate pr-4 pl-2">{course.courseName}</span>
                          {selectedCourseId === course.id && <Check className="w-4 h-4 shrink-0 text-primary" />}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Graph Legend */}
        <div className="flex items-center gap-6 mb-4 z-40 relative px-4 py-2 bg-[#111]/80 border border-white/10 rounded-full backdrop-blur-md">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-blue-500"></div><span className="text-xs font-semibold hidden md:inline">Eligibility</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-green-500"></div><span className="text-xs font-semibold hidden md:inline">UG</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-yellow-500"></div><span className="text-xs font-semibold hidden md:inline">PG</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-purple-500"></div><span className="text-xs font-semibold hidden md:inline">Doctoral</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-orange-500"></div><span className="text-xs font-semibold hidden md:inline">Careers</span></div>
        </div>

        {/* Main Content Area: Map + Side Panel */}
        <div className="w-full max-w-[1400px] flex flex-col lg:flex-row gap-6 h-[800px] lg:h-[700px] z-10 relative">
          
          {/* React Flow Container */}
          <div className="flex-1 h-[450px] lg:h-full bg-transparent border border-white/10 shadow-xl rounded-xl overflow-hidden relative cursor-crosshair">
              <ReactFlow 
                  nodes={nodes} 
                  edges={edges} 
                  nodeTypes={nodeTypes}
                  onNodeClick={handleNodeClick}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  minZoom={0.5}
                  maxZoom={1.5}
                  proOptions={{ hideAttribution: true }} // hide react flow text
              >
                <Background color="#333" gap={16} variant="dots" size={1} />
              </ReactFlow>
          </div>

          {/* Details Panel Sidebar */}
          <div className="w-full lg:w-[400px] h-full flex-shrink-0">
             <DetailPanel data={selectedNodeData} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default CareerOutcomesPage;
