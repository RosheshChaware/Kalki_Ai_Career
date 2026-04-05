import React from 'react';
import { motion } from 'framer-motion';

const SkillVisualization = () => {
  // Generate random nodes for the visualization
  const nodes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10, // 10% to 90%
    y: Math.random() * 80 + 10,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    color: ['#3b82f6', '#8b5cf6', '#06b6d4'][i % 3], // Blue, Purple, Cyan
  }));

  // Define connections for the network
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [8, 9], [9, 10], [10, 11], [11, 8],
    [0, 4], [1, 5], [2, 6], [3, 7],
    [4, 8], [5, 9], [6, 10], [7, 11],
    [12, 0], [13, 5], [14, 10]
  ];

  return (
    <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-500/5 to-transparent blur-3xl" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[600px] opacity-80">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Connecting Lines */}
        {connections.map(([fromIdx, toIdx], i) => {
          const fromNode = nodes[fromIdx];
          const toNode = nodes[toIdx];
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`line-${i}`}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke={fromNode.color}
              strokeWidth="0.15"
              strokeOpacity="0.2"
              animate={{
                x1: [`${fromNode.x}%`, `${fromNode.x + (Math.random() - 0.5) * 5}%`, `${fromNode.x}%`],
                y1: [`${fromNode.y}%`, `${fromNode.y + (Math.random() - 0.5) * 5}%`, `${fromNode.y}%`],
                x2: [`${toNode.x}%`, `${toNode.x + (Math.random() - 0.5) * 5}%`, `${toNode.x}%`],
                y2: [`${toNode.y}%`, `${toNode.y + (Math.random() - 0.5) * 5}%`, `${toNode.y}%`],
              }}
              transition={{
                duration: Math.min(fromNode.duration, toNode.duration),
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Dynamic Nodes */}
        {nodes.map((node) => (
          <motion.g
            key={`node-${node.id}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              x: [0, (Math.random() - 0.5) * 10, 0],
              y: [0, (Math.random() - 0.5) * 10, 0],
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size / 10}
              fill={node.color}
              filter="url(#glow)"
              className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            />
            {/* Inner Glow Core */}
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size / 20}
              fill="white"
              className="opacity-40"
            />
          </motion.g>
        ))}
      </svg>

      {/* Floating Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillVisualization;
