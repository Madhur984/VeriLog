import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Info, Settings, Play } from 'lucide-react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScreenProps } from '../types';
import { cn } from '../../../../lib/utils';
import { VeriSlider } from '../../../shared/VeriSlider';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';
import { VeriButton } from '../../../shared/VeriButton';

gsap.registerPlugin(MotionPathPlugin);

class Circuit {
  voltage: number = 5; // Volts
  resistance: number = 10; // Ohms
  isOpen: boolean = true;
  
  get current(): number {
    if (this.isOpen) return 0;
    if (this.resistance <= 0) return 20; // Short circuit limit
    return this.voltage / this.resistance;
  }

  get isShortCircuited(): boolean {
    return !this.isOpen && this.resistance < 1;
  }
}

const W = 900;
const H = 600;

const NODES = {
  batPos: { x: 160, y: 300 },
  batNeg: { x: 160, y: 420 },
  tl: { x: 160, y: 80 },
  t1: { x: 300, y: 80 },
  t2: { x: 420, y: 80 },
  swL: { x: 460, y: 80 },
  swR: { x: 540, y: 80 },
  t3: { x: 600, y: 80 },
  tr: { x: 740, y: 80 },
  bulbTop: { x: 740, y: 250 },
  bulbBot: { x: 740, y: 350 },
  br: { x: 740, y: 520 },
  bl: { x: 160, y: 520 },
};

export const EmbeddedCircuitLab: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  onNext, 
  currentHint 
}) => {
  const [circuit] = useState(new Circuit());
  const [isOpen, setIsOpen] = useState(true);
  const [resistance, setResistance] = useState(10);
  const [predictionMode, setPredictionMode] = useState(true);
  const [analystStatus, setAnalystStatus] = useState("Initializing physics environment...");
  const electronContainerRef = useRef<SVGGElement>(null);
  const { focusProps } = useAttentionLock();

  circuit.isOpen = isOpen;
  circuit.resistance = resistance;
  const current = circuit.current;
  const closed = !isOpen;
  const speed = Math.max(0.2, 3 / (current + 0.05)); // Energy-based velocity

  useEffect(() => {
    if (closed) {
      setAnalystStatus("Logic stream active. Signal verified.");
      triggerHaptic?.('success');
      
      const ctx = gsap.context(() => {
        gsap.to(".electron", {
          motionPath: {
            path: "#circuit-path",
            align: "#circuit-path",
            autoRotate: true,
            alignOrigin: [0.5, 0.5]
          },
          duration: speed,
          repeat: -1,
          ease: "none",
          stagger: {
            each: speed / 6,
            repeat: -1
          }
        });
      }, electronContainerRef);
      return () => ctx.revert();
    } else {
      setAnalystStatus("Neural bridge disconnected. Loop broken.");
    }
  }, [closed, current, triggerHaptic, speed]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    triggerHaptic?.('light');
  };

  const circuitPath = `
    M ${NODES.batPos.x} ${NODES.batPos.y}
    L ${NODES.tl.x} ${NODES.tl.y}
    L ${NODES.swL.x} ${NODES.swL.y}
    ${isOpen ? '' : `L ${NODES.swR.x} ${NODES.swR.y}`}
    ${isOpen ? `M ${NODES.swR.x} ${NODES.swR.y}` : ''}
    L ${NODES.tr.x} ${NODES.tr.y}
    L ${NODES.bulbTop.x} ${NODES.bulbTop.y}
    L ${NODES.bulbBot.x} ${NODES.bulbBot.y}
    L ${NODES.br.x} ${NODES.br.y}
    L ${NODES.bl.x} ${NODES.bl.y}
    L ${NODES.batNeg.x} ${NODES.batNeg.y}
  `;

  return (
    <div className="section-content relative overflow-hidden flex flex-col items-center !justify-start pt-8" {...focusProps}>
      {/* AI Hint Notification */}
      <AnimatePresence>
        {currentHint?.type === 'hint' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 z-50 bg-white shadow-xl shadow-sky-100 rounded-2xl p-4 border border-sky-100 flex items-center gap-3"
          >
            <div className="p-2 bg-sky-50 text-sky-500 rounded-lg">
                <Info size={16} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                LAB ASSIST: {currentHint.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-6 mb-12">
        <div className="bg-white p-4 px-6 rounded-[24px] border border-slate-200 shadow-xl flex items-center gap-4">
            <div className={cn("p-2 rounded-xl", closed ? "bg-emerald-50 text-emerald-500" : "bg-sky-50 text-sky-500")}>
                <Activity size={18} />
            </div>
            <p className="text-xs font-bold text-slate-800 italic uppercase tracking-tighter tracking-wide">
                "{analystStatus}"
            </p>
        </div>
      </div>

      <AnimatePresence>
        {circuit.isShortCircuited && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-40 bg-white border-2 border-rose-500/20 shadow-2xl shadow-rose-100 px-8 py-6 z-40 flex flex-col items-center gap-3 rounded-[32px]"
          >
            <div className="flex items-center gap-2 text-rose-500">
              <Zap size={20} fill="currentColor" className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">PHYSICS VIOLATION</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 max-w-[200px] text-center leading-relaxed">
              INFINITE ELECTRON DENSITY DETECTED. ADJUST RESISTANCE.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 w-full px-8">
        {/* Left Panel: Component Reference */}
        <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-lg flex flex-col gap-8 h-fit relative">
          <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Hardware</h3>
              <Settings size={14} className="text-slate-300" />
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-center group cursor-help">
              <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform shadow-sm">
                <Zap size={24} />
              </div>
              <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">DC SOURCE</span>
                  <span className="text-[9px] text-slate-400 font-bold">5.00V Stabilized</span>
              </div>
            </div>

            <div className="flex gap-4 items-center group cursor-help">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-sm">
                <Activity size={24} />
              </div>
              <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">SYSTEM LOAD</span>
                  <span className="text-[9px] text-slate-400 font-bold">Resistive Node</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100">
              <VeriSlider 
                label="RESISTANCE"
                value={resistance}
                min={1}
                max={100}
                onChange={(val) => {
                  setResistance(val);
                  triggerHaptic?.('micro');
                }}
                unit="Ω"
                variant="logic"
              />
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 space-y-4">
            <p className="text-[11px] text-slate-400 leading-relaxed font-bold italic text-center">
              Target: Establish 100% Loop Integrity
            </p>
            
            {closed && (
              <VeriButton
                variant="signal"
                onClick={onNext}
                className="w-full h-14 rounded-[20px]"
              >
                Proceed to Data Log
              </VeriButton>
            )}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="relative group overflow-visible aspect-[1.5] w-full max-w-[900px]">
          <AnimatePresence mode="wait">
            {predictionMode ? (
            <motion.div 
                key="prediction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-[-20px] inset-y-[-20px] z-30 bg-white flex flex-col items-center justify-center p-12 text-center rounded-[48px] border-4 border-white shadow-2xl"
            >
                <div className="p-6 bg-sky-100 text-sky-500 rounded-full mb-6">
                    <Play className="ml-1" fill="currentColor" size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">Physics Sandbox v2.0</h3>
                <p className="text-slate-500 text-sm font-bold max-w-sm mb-10 leading-relaxed italic">
                    "In every circuit, current seeks the return path. Close the switch to begin simulation."
                </p>
                <VeriButton 
                    variant="signal"
                    size="lg"
                    onClick={() => {
                        setPredictionMode(false);
                        triggerHaptic?.('heavy');
                    }}
                    className="px-12 rounded-2xl h-16"
                >
                    INITIALIZE ENVIRONMENT
                </VeriButton>
            </motion.div>
            ) : null}
          </AnimatePresence>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-[48px] border-4 border-white bg-slate-50 shadow-2xl overflow-visible">
             <pattern id="labGrid" width="40" height="40" patternUnits="userSpaceOnUse">
               <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="0.5" opacity="0.03"/>
             </pattern>
             <rect width="100%" height="100%" fill="url(#labGrid)" rx="44" />

             {circuit.isShortCircuited && (
               <motion.rect
                 width="100%" height="100%"
                 fill="#f43f5e"
                 animate={{ opacity: [0, 0.05, 0] }}
                 transition={{ duration: 0.1, repeat: Infinity }}
                 className="pointer-events-none"
                 rx="44"
               />
             )}

             <path 
              id="circuit-path" 
              d={circuitPath} 
              fill="none" 
              stroke={circuit.isShortCircuited ? "#f43f5e" : (closed ? "#0ea5e9" : "#e2e8f0")} 
              strokeWidth={circuit.isShortCircuited ? "12" : closed ? "8" : "6"}
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{ 
                filter: closed ? `drop-shadow(0 0 ${8 + current * 4}px ${circuit.isShortCircuited ? 'rgba(244,63,94,0.4)' : 'rgba(14,165,233,0.4)'})` : 'none',
              }}
             />

             <g ref={electronContainerRef}>
               {closed && [1,2,3,4,5,6].map(i => (
                 <circle 
                   key={i} 
                   className="electron" 
                   r={circuit.isShortCircuited ? "8" : "6"} 
                   fill={circuit.isShortCircuited ? "#f43f5e" : "#0284c7"} 
                 />
               ))}
             </g>

             <g transform={`translate(${NODES.batPos.x - 20}, ${NODES.batPos.y})`}>
                <rect width="40" height="120" rx="12" fill="white" stroke={closed ? "#0ea5e9" : "#cbd5e1"} strokeWidth="4" />
                <text x="20" y="30" textAnchor="middle" fill="#0ea5e9" fontSize="18" className="font-black">+</text>
                <text x="20" y="100" textAnchor="middle" fill="#0ea5e9" fontSize="18" className="font-black">-</text>
             </g>

             <g 
              onClick={handleToggle} 
              className="cursor-pointer group/switch"
              transform={`translate(${NODES.swL.x}, ${NODES.swL.y})`}
             >
                <circle r="12" fill={closed ? "#0ea5e9" : "#cbd5e1"} />
                <motion.line 
                  x1="0" y1="0" 
                  x2={isOpen ? 40 : 80} y2={isOpen ? -40 : 0} 
                  stroke={closed ? "#0ea5e9" : "#64748b"} strokeWidth="12" strokeLinecap="round"
                  animate={{ x2: isOpen ? 40 : 80, y2: isOpen ? -40 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <circle cx="80" cy="0" r="12" fill={closed ? "#0ea5e9" : "#cbd5e1"} />
             </g>

             <g transform={`translate(${NODES.bulbTop.x}, ${(NODES.bulbTop.y + NODES.bulbBot.y)/2})`}>
                <motion.circle 
                   r="60" 
                   fill={closed ? (circuit.isShortCircuited ? "#f43f5e" : "#0ea5e9") : "transparent"} 
                   animate={{ 
                     opacity: closed ? [0.1, 0.3, 0.1] : 0,
                     scale: closed ? [1, 1 + (current/4), 1] : 1
                   }}
                   transition={{ duration: speed, repeat: Infinity }}
                   className="blur-3xl"
                />
                <circle r="40" stroke={closed ? (circuit.isShortCircuited ? "#f43f5e" : "#0ea5e9") : "#e2e8f0"} strokeWidth="4" fill="white" />
                <motion.path 
                  d="M -15 -15 L 15 15 M 15 -15 L -15 15" 
                  stroke={closed ? (circuit.isShortCircuited ? "#f43f5e" : "#0ea5e9") : "#cbd5e1"} 
                  strokeWidth="5" 
                  strokeLinecap="round"
                  animate={{ 
                    opacity: closed ? Math.min(1, 0.4 + current/2) : 0.3,
                  }}
                />
             </g>

             <text x={W-40} y={H-40} textAnchor="end" className="text-[10px] font-black fill-slate-300 tracking-[0.5em] uppercase italic">
               CIRCUIT_PHYSICS_CORE // {closed ? 'STABLE' : 'OPEN'}
             </text>
          </svg>
        </div>
      </div>
    </div>
  );
};


export default EmbeddedCircuitLab;
