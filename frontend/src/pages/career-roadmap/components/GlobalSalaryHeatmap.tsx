import React, { useState } from 'react';
import { motion, AnimatePresence, useTransform } from 'framer-motion';
import { DataTerminal } from './DataTerminal';
import { useCursorGravity } from '../../../hooks/useCursorGravity';
import { useColorScheme } from '../../../hooks/useColorScheme';

const HOTSPOTS = [
  { id: 'bengaluru', name: 'Bengaluru', cx: 68, cy: 58, ppp: '₹18 LPA', entities: ['Intel', 'Qualcomm', 'NVIDIA'], type: 'R&D / Design' },
  { id: 'austin', name: 'Austin', cx: 20, cy: 42, ppp: '$150k', entities: ['Tesla', 'AMD', 'Apple'], type: 'Design / Mfg' },
  { id: 'hsinchu', name: 'Hsinchu', cx: 80, cy: 44, ppp: '$120k', entities: ['TSMC', 'MediaTek'], type: 'Foundry / Design' },
  { id: 'munich', name: 'Munich', cx: 50, cy: 28, ppp: '€85k', entities: ['Infineon', 'Apple', 'BMW'], type: 'Automotive / RF' },
  { id: 'hyderabad', name: 'Hyderabad', cx: 65, cy: 52, ppp: '₹16 LPA', entities: ['Apple', 'Qualcomm', 'Micron'], type: 'Design / Val' },
  { id: 'san-jose', name: 'San Jose', cx: 12, cy: 38, ppp: '$180k', entities: ['NVIDIA', 'Intel', 'Broadcom'], type: 'HQ / R&D' },
  { id: 'chennai', name: 'Chennai', cx: 69, cy: 62, ppp: '₹14 LPA', entities: ['Tata Electronics', 'Foxconn'], type: 'Mfg / Assembly' },
  { id: 'mumbai', name: 'Mumbai / Pune', cx: 62, cy: 50, ppp: '₹15 LPA', entities: ['L&T', 'Tata Motors'], type: 'Embedded / Auto' }
];

export const GlobalSalaryHeatmap: React.FC = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [activeSpot, setActiveSpot] = useState<typeof HOTSPOTS[0] | null>(null);
  const { mouseX, mouseY } = useCursorGravity();
  
  const parallaxX = useTransform(mouseX, [0, 1920], [-20, 20]);
  const parallaxY = useTransform(mouseY, [0, 1080], [-20, 20]);

  const accentColor = isLight ? '#0369A1' : '#22d3ee';

  return (
    <DataTerminal title="GLOBAL SILICON HOTSPOTS" subtitle="Real-time PPP Analysis & Entity Presence">
      <div className={`relative w-full h-[320px] sm:h-[500px] overflow-hidden rounded-sm flex ${
        isLight ? 'bg-bg-base' : 'bg-[#020408]'
      }`}>
        {/* SVG World Map Background (Simplified Abstract) */}
        <motion.div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ x: parallaxX, y: parallaxY }}
        >
          <svg viewBox="0 0 200 100" className="w-full h-full" style={{ color: accentColor }}>
            {/* Simplified world continents outline */}
            {/* North America */}
            <path d="M 15,18 L 22,15 L 30,17 L 38,20 L 40,28 L 35,35 L 28,40 L 22,45 L 18,42 L 15,35 L 12,28 Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.15" />
            {/* South America */}
            <path d="M 28,50 L 35,48 L 38,55 L 40,65 L 37,75 L 32,80 L 28,75 L 26,65 L 25,55 Z" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.12" />
            {/* Europe */}
            <path d="M 85,15 L 95,12 L 102,15 L 105,22 L 100,28 L 92,30 L 88,27 L 85,22 Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.15" />
            {/* Africa */}
            <path d="M 90,35 L 100,33 L 108,40 L 110,55 L 105,68 L 98,72 L 92,65 L 88,50 L 88,40 Z" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.12" />
            {/* Asia / India / Southeast Asia */}
            <path d="M 110,15 L 125,12 L 145,15 L 160,20 L 165,30 L 158,40 L 145,45 L 130,50 L 120,48 L 115,40 L 108,30 L 108,22 Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.15" />
            {/* India subcontinent */}
            <path d="M 125,42 L 132,40 L 138,48 L 135,58 L 128,62 L 123,55 L 122,48 Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.2" />
            {/* Australia */}
            <path d="M 155,60 L 168,58 L 175,62 L 175,70 L 168,74 L 158,72 L 155,66 Z" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.12" />
          </svg>
          <div className={`absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 ${isLight ? 'border-slate-300' : 'border-white'}`} />
        </motion.div>

        {/* Hotspots Selector Sidebar */}
        <div className={`absolute top-4 left-4 z-20 flex flex-col gap-1.5 p-3 rounded-xl border-2 border-edge shadow-brutal-sm transition-all pointer-events-auto ${
          isLight
            ? 'bg-bg-elev'
            : 'bg-bg-elev'
        }`}>
          <div className="text-[9px] font-mono text-text-dim uppercase tracking-widest border-b pb-1.5 mb-1" style={{ borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)' }}>
            Silicon Nodes
          </div>
          <div className="flex flex-col gap-0.5">
            {HOTSPOTS.map(spot => {
              const isActive = activeSpot?.id === spot.id;
              return (
                <button
                  key={spot.id}
                  onMouseEnter={() => setActiveSpot(spot)}
                  onMouseLeave={() => setActiveSpot(null)}
                  className={`text-left text-[10px] font-mono uppercase px-2.5 py-1 rounded-md transition-all flex items-center justify-between gap-4 ${
                    isActive 
                      ? (isLight ? 'bg-signal-core/10 text-signal-core font-bold' : 'bg-cyan-400/10 text-cyan-400 font-bold') 
                      : 'text-text-dim hover:text-text-sub hover:bg-white/5'
                  }`}
                >
                  <span>{spot.name}</span>
                  <span className="text-[8px] opacity-60">{spot.ppp}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hotspots */}
        {HOTSPOTS.map((spot) => {
          const isActive = activeSpot?.id === spot.id;
          return (
            <motion.div
              key={spot.id}
              className="absolute z-10 w-4 h-4 -translate-x-1/2 -translate-y-1/2 cursor-crosshair group"
              style={{ left: `${spot.cx}%`, top: `${spot.cy}%` }}
              onMouseEnter={() => setActiveSpot(spot)}
              onMouseLeave={() => setActiveSpot(null)}
            >
              <div 
                className={`w-2.5 h-2.5 rounded-full mx-auto mt-1 transition-all duration-300 ${
                  isActive ? 'scale-150' : 'group-hover:scale-150'
                }`} 
                style={{ 
                  background: accentColor,
                  boxShadow: isActive ? `0 0 10px ${accentColor}` : 'none'
                }} 
              />
              <div 
                className={`absolute inset-0 rounded-full animate-ping opacity-50 ${
                  isActive ? 'block' : 'hidden group-hover:block'
                }`} 
                style={{ border: `1px solid ${accentColor}` }} 
              />
            </motion.div>
          );
        })}

        {/* Info Panel Overlay */}
        <AnimatePresence>
          {activeSpot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute bottom-4 sm:bottom-8 right-2 sm:right-8 w-[min(18rem,calc(100%-1rem))] sm:w-80 border p-4 sm:p-6 z-20 pointer-events-none shadow-neo ${
                isLight
                  ? 'bg-bg-elev border-signal-core/20'
                  : 'bg-bg-elev border-cyan-400/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: accentColor }}>{activeSpot.type}</div>
                   <h3 className="text-lg sm:text-2xl font-bold text-text-main font-mono tracking-tighter">{activeSpot.name}</h3>
                 </div>
                 <div className="text-right">
                   <div className="text-[9px] font-mono text-text-dim uppercase tracking-widest">PPP Adjusted</div>
                   <div className="text-lg font-bold text-text-main font-mono">{activeSpot.ppp}</div>
                 </div>
              </div>
              
              <div className={`space-y-2 pt-4 border-t ${isLight ? 'border-border-soft' : 'border-white/10'}`}>
                <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Dominant Entities</div>
                <div className="flex flex-wrap gap-2">
                  {activeSpot.entities.map(e => (
                    <span key={e} className={`px-2 py-1 border text-[10px] font-mono ${
                      isLight ? 'bg-bg-base border-border-soft text-text-sub' : 'bg-white/5 border-white/10 text-slate-300'
                    }`}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Idle state panel */}
        <AnimatePresence>
          {!activeSpot && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={`absolute bottom-4 sm:bottom-8 right-2 sm:right-8 w-[min(18rem,calc(100%-1rem))] sm:w-80 border p-4 sm:p-6 z-10 pointer-events-none shadow-neo-sm ${
                isLight ? 'bg-bg-elev border-border-soft' : 'bg-bg-elev border-white/5'
              }`}
            >
              <div className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center animate-spin-slow mb-4" style={{ borderColor: `${accentColor}80` }}>
                <div className="w-1 h-1 rounded-full" style={{ background: accentColor }} />
              </div>
              <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest">
                SCANNING GLOBAL TELEMETRY...<br/>
                HOVER OVER NODES FOR INTELLIGENCE
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DataTerminal>
  );
};
