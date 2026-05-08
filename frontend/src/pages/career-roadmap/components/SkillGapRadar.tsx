import React from 'react';
import { motion } from 'framer-motion';
import { useSkillGap } from '../hooks/useSkillGap';
import { DataTerminal } from './DataTerminal';

export const SkillGapRadar: React.FC = () => {
  const { matches, masteredNodes } = useSkillGap();
  
  // Hardcoded for demo - usually derived from data
  const domains = [
    { label: 'Digital Design', value: 80 },
    { label: 'Architecture', value: 40 },
    { label: 'Verification', value: 60 },
    { label: 'Analog', value: 20 },
    { label: 'Layout/Physical', value: 30 },
    { label: 'Programming', value: 90 },
  ];

  return (
    <DataTerminal title="SKILL GAP RADAR" subtitle="Current Mastery vs. Market Demand" className="h-[400px]">
      <div className="flex h-full p-6 gap-8">
        {/* Radar Visualization Area */}
        <div className="flex-1 relative flex items-center justify-center">
           {/* SVG Radar Chart implementation */}
           <svg viewBox="-120 -120 240 240" className="w-full h-full max-w-[240px] max-h-[240px]">
             {/* Background Web */}
             {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
               <polygon 
                 key={scale}
                 points={domains.length > 0 ? domains.map((_, i) => {
                   const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
                   return `${Math.cos(angle) * 100 * scale},${Math.sin(angle) * 100 * scale}`;
                 }).join(' ') : ''}
                 fill="none"
                 stroke="rgba(255,255,255,0.1)"
                 strokeWidth="1"
               />
             ))}
             {/* Axes */}
             {domains.map((d, i) => {
               const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
               return (
                 <g key={i}>
                   <line 
                     x1="0" y1="0" 
                     x2={Math.cos(angle) * 100} y2={Math.sin(angle) * 100} 
                     stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                   />
                   <text 
                     x={Math.cos(angle) * 120} y={Math.sin(angle) * 120} 
                     fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle"
                   >
                     {d.label}
                   </text>
                 </g>
               );
             })}
             
             {/* Data Polygon */}
             <motion.polygon 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                points={domains.map((d, i) => {
                  const angle = (Math.PI * 2 * i) / domains.length - Math.PI / 2;
                  return `${Math.cos(angle) * d.value},${Math.sin(angle) * d.value}`;
                }).join(' ')}
                fill="rgba(34,211,238,0.2)"
                stroke="#22d3ee"
                strokeWidth="2"
             />
           </svg>
        </div>

        {/* Technical Sidebar */}
        <div className="w-64 border-l border-white/10 pl-6 flex flex-col justify-center">
          <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-4">Critical Missing Nodes</h4>
          <div className="space-y-3">
             {matches[0]?.missingSkills.slice(0, 4).map((skill, idx) => (
               <button 
                 key={idx} 
                 onClick={() => {
                   alert(`Navigating to curriculum module for: ${skill.replace(/-/g, ' ').toUpperCase()}`);
                   // In production: window.location.href = `/curriculum?node=${skill}`;
                 }}
                 className="flex items-start gap-2 w-full text-left group/node"
               >
                 <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0 animate-pulse group-hover/node:bg-cyan-400 transition-colors" />
                 <span className="text-xs font-mono text-slate-300 capitalize group-hover/node:text-cyan-400 transition-colors">
                   {skill.replace(/-/g, ' ')}
                 </span>
                 <span className="text-[8px] font-mono text-slate-600 opacity-0 group-hover/node:opacity-100 transition-opacity ml-auto uppercase">Jump to Module ↗</span>
               </button>
             ))}
             {matches[0]?.missingSkills.length === 0 && (
               <div className="text-xs font-mono text-green-400">All Top Tier Nodes Mastered</div>
             )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Top Match</div>
            <div className="text-xl font-mono text-white font-bold">{matches[0]?.name || 'N/A'}</div>
            <div className="text-xs font-mono text-cyan-400 mt-1">{matches[0]?.matchScore || 0}% ALIGNMENT</div>
          </div>
        </div>
      </div>
    </DataTerminal>
  );
};
