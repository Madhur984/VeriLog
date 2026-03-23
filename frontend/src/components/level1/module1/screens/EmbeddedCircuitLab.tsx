import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Info } from 'lucide-react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScreenProps } from '../types';
import { VoltMonkey, MonkeyState } from '../../../../components/Bot/VoltMonkey';

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

import { VeriSlider } from '../../../shared/VeriSlider';
import { useAttentionLock } from '../../../../hooks/useAttentionLock';
import { VeriButton } from '../../../shared/VeriButton';

export const EmbeddedCircuitLab: React.FC<ScreenProps> = ({ 
  triggerHaptic, 
  onNext, 
  currentHint 
}) => {
  const [circuit] = useState(new Circuit());
  const [isOpen, setIsOpen] = useState(true);
  const [resistance, setResistance] = useState(10);
  const [predictionMode, setPredictionMode] = useState(true);
  const [botState, setBotState] = useState<MonkeyState>('idle');
  const electronContainerRef = useRef<SVGGElement>(null);
  const { focusProps } = useAttentionLock();

  circuit.isOpen = isOpen;
  circuit.resistance = resistance;
  const current = circuit.current;
  const closed = !isOpen;
  const speed = Math.max(0.2, 3 / (current + 0.05)); // Energy-based velocity

  useEffect(() => {
    if (closed) {
      setBotState('happy');
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
      setBotState('idle');
    }
  }, [closed, current, triggerHaptic]);

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
    <div className="section-content relative overflow-hidden flex flex-col items-center !justify-start pt-20" {...focusProps}>
      {/* AI Hint Notification */}
      <AnimatePresence>
        {currentHint?.type === 'hint' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-0 z-50 glass-card p-3 border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-[10px] uppercase tracking-[0.2em] font-mono"
          >
            AI ASSIST: {currentHint.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">
        <VoltMonkey state={botState} size="sm" />
      </div>

      <AnimatePresence>
        {circuit.isShortCircuited && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, boxShadow: ["0 0 0px transparent", "0 0 40px var(--accent-secondary)", "0 0 0px transparent"] }}
            transition={{ duration: 0.2, repeat: 3 }}
            className="absolute top-32 glass-card border-[var(--accent-secondary)]/40 px-6 py-4 z-40 flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 text-[var(--accent-secondary)]">
              <Zap size={16} fill="currentColor" className="animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] glitch-text" data-text="System Overload">System Overload</span>
            </div>
            <p className="text-[8px] font-mono text-slate-400 max-w-[200px] text-center leading-relaxed">
              Infinite current detected. Increase resistance to protect the system.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 w-full mt-10">
        {/* Left Panel: Component Reference */}
        <div className="glass-card p-6 flex flex-col gap-6 h-fit relative border-white/5">
          {currentHint?.type === 'pulse' && (
              <motion.div 
                animate={{ opacity: [0, 0.4, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 bg-[var(--accent-primary)]/5 rounded-xl border border-[var(--accent-primary)]/20 pointer-events-none"
              />
          )}
          <h3 className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">Components</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-center opacity-60">
              <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center text-[#00E5FF]">
                <Zap size={20} />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono">DC Source</div>
            </div>
            <div className="flex gap-4 items-center opacity-60">
              <div className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center text-[#00FF9C]">
                <Activity size={20} />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Load (Bulb)</div>
            </div>
            
            <div className="pt-4">
              <VeriSlider 
                label="Resistance"
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
          
          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#00E5FF]">
                <Info size={14} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Goal</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono italic">
                Close the switch to establish a continuous flow.
              </p>
            </div>
            
            {closed && (
              <VeriButton
                variant="signal"
                onClick={onNext}
                className="w-full"
              >
                Proceed to Validation
              </VeriButton>
            )}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="relative group overflow-visible">
          <AnimatePresence mode="wait">
            {predictionMode ? (
            <motion.div 
                key="prediction"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-[#070B14]/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-white/5"
            >
                <Activity className="text-[var(--accent-primary)] w-10 h-10 mb-4 animate-pulse" />
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2">Closed Loop Theory</h3>
                <p className="body text-white/50 text-[10px] max-w-xs mb-6">In a perfect vacuum, energy would flow forever. In our circuit, resistance is the gatekeeper. Ready to test?</p>
                <VeriButton 
                    variant="signal"
                    onClick={() => {
                        setPredictionMode(false);
                        triggerHaptic?.('heavy');
                    }}
                >
                    Initialize Lab
                </VeriButton>
            </motion.div>
            ) : null}
          </AnimatePresence>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-2xl border border-white/10 bg-black/40 shadow-2xl overflow-visible">
            {/* ... svg content remains mostly same but using V1 colors and standardized glow ... */}
             <pattern id="labGrid" width="40" height="40" patternUnits="userSpaceOnUse">
               <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.05"/>
             </pattern>
             <rect width="100%" height="100%" fill="url(#labGrid)" />

             {circuit.isShortCircuited && (
               <motion.rect
                 width="100%" height="100%"
                 fill="var(--accent-secondary)"
                 animate={{ opacity: [0, 0.05, 0] }}
                 transition={{ duration: 0.1, repeat: Infinity }}
                 className="pointer-events-none"
               />
             )}

             <path 
              id="circuit-path" 
              d={circuitPath} 
              fill="none" 
              stroke={circuit.isShortCircuited ? "var(--accent-secondary)" : (closed ? "var(--accent-primary)" : "rgba(255,255,255,0.05)")} 
              strokeWidth={circuit.isShortCircuited ? "8" : closed ? "6" : "4"}
              className="transition-all duration-300"
              style={{ 
                filter: closed ? `drop-shadow(0 0 ${8 + current * 4}px ${circuit.isShortCircuited ? 'var(--accent-secondary)' : 'var(--accent-primary)'})` : 'none',
              }}
             />

             <g ref={electronContainerRef}>
               {closed && [1,2,3,4,5,6].map(i => (
                 <circle 
                   key={i} 
                   className="electron" 
                   r={circuit.isShortCircuited ? "6" : "4"} 
                   fill={circuit.isShortCircuited ? "var(--accent-secondary)" : "var(--accent-primary)"} 
                 />
               ))}
             </g>

             <g transform={`translate(${NODES.batPos.x - 20}, ${NODES.batPos.y})`}>
                <rect width="40" height="120" rx="4" fill="#0A0F1C" stroke={closed ? "var(--accent-primary)" : "#1a2a3a"} strokeWidth="2" />
                <text x="20" y="30" textAnchor="middle" fill="var(--accent-primary)" fontSize="12" className="font-bold">+</text>
                <text x="20" y="100" textAnchor="middle" fill="var(--accent-primary)" fontSize="14" className="font-bold">-</text>
             </g>

             <g 
              onClick={handleToggle} 
              className="cursor-pointer group/switch"
              transform={`translate(${NODES.swL.x}, ${NODES.swL.y})`}
             >
                <circle r="6" fill="var(--accent-primary)" />
                <motion.line 
                  x1="0" y1="0" 
                  x2={isOpen ? 40 : 80} y2={isOpen ? -40 : 0} 
                  stroke="var(--accent-primary)" strokeWidth="6" strokeLinecap="round"
                  animate={{ x2: isOpen ? 40 : 80, y2: isOpen ? -40 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <circle cx="80" cy="0" r="6" fill="var(--accent-primary)" />
             </g>

             <g transform={`translate(${NODES.bulbTop.x}, ${(NODES.bulbTop.y + NODES.bulbBot.y)/2})`}>
                <motion.circle 
                   r="40" 
                   fill={closed ? (circuit.isShortCircuited ? "var(--accent-secondary)" : "var(--accent-primary)") : "#0A0F1C"} 
                   animate={{ 
                     opacity: closed ? [0.2 * (current/0.5), 0.5 * (current/0.5), 0.2 * (current/0.5)] : 0,
                     scale: closed ? [1, 1 + (current/5), 1] : 1
                   }}
                   transition={{ duration: speed, repeat: Infinity }}
                   className="blur-2xl"
                />
                <circle r="30" stroke={closed ? (circuit.isShortCircuited ? "var(--accent-secondary)" : "var(--accent-primary)") : "#1a2a3a"} strokeWidth="2" fill="none" />
                <motion.path 
                  d="M -10 -10 L 10 10 M 10 -10 L -10 10" 
                  stroke={closed ? (circuit.isShortCircuited ? "var(--accent-secondary)" : "var(--accent-primary)") : "#1a2a3a"} 
                  strokeWidth="3" 
                  animate={{ 
                    opacity: closed ? Math.min(1, 0.3 + current) : 0.3,
                  }}
                />
             </g>

             <text x={W-20} y={H-20} textAnchor="end" className="text-[10px] font-mono fill-slate-700 tracking-[0.2em] uppercase italic">
               Physics Sim v2.0 // {closed ? 'Flux Active' : 'Loop Broken'}
             </text>
          </svg>
        </div>
      </div>
    </div>
  );
};


export default EmbeddedCircuitLab;
