import React, { useState } from 'react';
import { motion, AnimatePresence, useTransform } from 'framer-motion';
import { DataTerminal } from './DataTerminal';
import { useCursorGravity } from '../../../hooks/useCursorGravity';
import { useColorScheme } from '../../../hooks/useColorScheme';

const HOTSPOTS = [
  { id: 'bengaluru', name: 'Bengaluru', cx: 68, cy: 45, ppp: '₹18 LPA', entities: ['Intel', 'Qualcomm', 'NVIDIA'], type: 'R&D / Design' },
  { id: 'austin', name: 'Austin', cx: 20, cy: 35, ppp: '$150k', entities: ['Tesla', 'AMD', 'Apple'], type: 'Design / Mfg' },
  { id: 'hsinchu', name: 'Hsinchu', cx: 80, cy: 38, ppp: '$120k', entities: ['TSMC', 'MediaTek'], type: 'Foundry / Design' },
  { id: 'munich', name: 'Munich', cx: 52, cy: 28, ppp: '€85k', entities: ['Infineon', 'Apple', 'BMW'], type: 'Automotive / RF' },
  { id: 'hyderabad', name: 'Hyderabad', cx: 68, cy: 43, ppp: '₹16 LPA', entities: ['Apple', 'Qualcomm', 'Micron'], type: 'Design / Val' },
  { id: 'san-jose', name: 'San Jose', cx: 15, cy: 35, ppp: '$180k', entities: ['NVIDIA', 'Intel', 'Broadcom'], type: 'HQ / R&D' },
  { id: 'chennai', name: 'Chennai', cx: 69, cy: 47, ppp: '₹14 LPA', entities: ['Tata Electronics', 'Foxconn'], type: 'Mfg / Assembly' },
  { id: 'mumbai', name: 'Mumbai / Pune', cx: 67, cy: 43, ppp: '₹15 LPA', entities: ['L&T', 'Tata Motors'], type: 'Embedded / Auto' }
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
          <svg viewBox="0 0 100 60" className="w-full h-full fill-current" style={{ color: accentColor }}>
            <path d="M 10,20 Q 20,10 30,20 T 40,40 T 10,40 Z" opacity="0.1" /> 
            <path d="M 45,20 Q 55,10 65,25 T 55,45 T 45,35 Z" opacity="0.1" /> 
            <path d="M 60,20 Q 80,10 90,30 T 70,50 T 60,30 Z" opacity="0.1" /> 
          </svg>
          <div className={`absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 ${isLight ? 'border-slate-300' : 'border-white'}`} />
        </motion.div>

        {/* Hotspots */}
        {HOTSPOTS.map((spot) => (
          <motion.div
            key={spot.id}
            className="absolute z-10 w-4 h-4 -translate-x-1/2 -translate-y-1/2 cursor-crosshair group"
            style={{ left: `${spot.cx}%`, top: `${spot.cy}%` }}
            onMouseEnter={() => setActiveSpot(spot)}
            onMouseLeave={() => setActiveSpot(null)}
          >
            <div className={`w-2 h-2 rounded-full mx-auto mt-1 group-hover:scale-150 transition-transform`} style={{ background: accentColor }} />
            <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ border: `1px solid ${accentColor}` }} />
          </motion.div>
        ))}

        {/* Info Panel Overlay */}
        <AnimatePresence>
          {activeSpot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute bottom-4 sm:bottom-8 right-2 sm:right-8 w-[min(18rem,calc(100%-1rem))] sm:w-80 backdrop-blur-md border p-4 sm:p-6 z-20 pointer-events-none ${
                isLight 
                  ? 'bg-bg-elev/90 border-signal-core/20 shadow-[0_0_30px_rgba(3,105,161,0.08)]' 
                  : 'bg-black/80 border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]'
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
              className={`absolute bottom-4 sm:bottom-8 right-2 sm:right-8 w-[min(18rem,calc(100%-1rem))] sm:w-80 backdrop-blur-sm border p-4 sm:p-6 z-10 pointer-events-none ${
                isLight ? 'bg-bg-elev/40 border-border-soft' : 'bg-black/40 border-white/5'
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
