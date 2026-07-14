import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Radio, Cpu, ChevronRight, BookOpen, Scale } from 'lucide-react';

// --- WAVE INTERFACES ---
export interface WaveProps {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  mouseX?: number;
  mouseY?: number;
  label?: string;
  unit?: string;
}

// --- CORE WAVE COMPONENTS (CLEANED) ---

const gridStyle = {
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
    backgroundSize: '20px 20px'
};

export const AnalogWave: React.FC<WaveProps> = ({ 
  color = '#22d3ee', 
  amplitude = 22, 
  frequency = 0.04,
  speed = 0.05,
  mouseX = 0.5,
  mouseY = 0.5,
  label = 'EXT_VOLT_FLUX',
  unit = 'mV'
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>();
  
  const baseAmp = amplitude + (mouseY * 40 - 20);
  const baseFreq = frequency + (mouseX * 0.08 - 0.04);

  useEffect(() => {
    let t = 0;
    const animate = () => {
      if (!pathRef.current) return;
      const w = 400, cy = 50;
      const pts = Array.from({ length: 120 }, (_, i) => {
        const x = (i / 120) * w;
        const y = cy + baseAmp * Math.sin(baseFreq * x + t);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ');
      pathRef.current.setAttribute('d', pts);
      t += speed;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [baseAmp, baseFreq, speed]);

  return (
    <div className="relative w-full group h-[100px]">
      <div className="absolute top-2 left-4 z-20 pointer-events-none text-white">
          <div className="text-[8px] font-mono uppercase tracking-widest opacity-40">{label}</div>
          <div className="text-xs font-mono font-bold">{(baseAmp * 2).toFixed(1)}<span className="text-[8px] ml-1 opacity-30">{unit}</span></div>
      </div>
      
      <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="relative z-10">
        <path ref={pathRef} fill="none" stroke={color} strokeWidth="2.5" />
      </svg>
      
      <div className="absolute inset-0 opacity-[0.05] rounded-xl" style={gridStyle} />
    </div>
  );
};

export const DigitalWave: React.FC<WaveProps & { complexity?: number }> = ({ 
  color = '#a78bfa', 
  complexity = 1,
  mouseX = 0.5,
  label = 'LOGIC_BUS_01'
}) => {
  const [phase, setPhase] = useState(0);
  const modComplexity = complexity + (mouseX * 4);

  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 16), 120);
    return () => clearInterval(id);
  }, []);
  
  const steps = 15;
  const bitSequence = Array.from({ length: steps }).map((_, i) => (Math.sin(i * modComplexity + phase * 0.5) > 0) ? 1 : 0);

  return (
    <div className="relative w-full group h-[100px]">
       <div className="absolute top-2 left-4 z-20 pointer-events-none text-white">
          <div className="text-[8px] font-mono uppercase tracking-widest opacity-40">{label}</div>
          <div className="text-xs font-mono font-bold">{bitSequence.slice(0, 4).join('')}</div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="relative z-10">
        {bitSequence.map((bit, i) => {
          const x = i * (400 / steps);
          const y = bit === 1 ? 20 : 70;
          const w = (400 / steps) - 2;
          return <g key={i}>
            <rect x={x} y={y} width={w} height={bit === 1 ? 30 : 10} fill={`${color}10`} rx="2" />
            <motion.rect 
              initial={false}
              animate={{ y }}
              x={x} width={w} height="3" fill={color} rx="1" 
            />
          </g>;
        })}
      </svg>
      <div className="absolute inset-0 opacity-[0.05] rounded-xl" style={gridStyle} />
    </div>
  );
};

export const SineWaveSmall: React.FC<{ 
  color: string; 
  speed: number; 
  mode?: 'amplitude' | 'frequency' | 'phase';
  isDark?: boolean;
}> = ({ color, speed, mode, isDark }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const refPathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    let t = 0;
    const animate = () => {
      if (!pathRef.current) return;
      const w = 200, cy = 50;
      
      const pts = Array.from({ length: 60 }, (_, i) => {
        const x = (i / 60) * w;
        let amp = 25;
        let freq = 0.15;
        let phase = t;

        if (mode === 'amplitude') {
          amp = 15 + Math.sin(t * 0.5) * 15;
        } else if (mode === 'frequency') {
          freq = 0.1 + (Math.sin(t * 0.5) + 1) * 0.1;
        } else if (mode === 'phase') {
          phase = t * 2;
        }

        const y = cy + amp * Math.sin(freq * x + phase);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ');

      pathRef.current.setAttribute('d', pts);

      if (mode === 'phase' && refPathRef.current) {
        const refPts = Array.from({ length: 60 }, (_, i) => {
          const x = (i / 60) * w;
          const y = cy + 25 * Math.sin(0.15 * x + t);
          return `${i === 0 ? 'M' : 'L'}${x},${y}`;
        }).join(' ');
        refPathRef.current.setAttribute('d', refPts);
      }
      
      t += speed;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed, mode]);

  return (
    <svg width="100%" height="80" viewBox="0 0 200 100" preserveAspectRatio="none">
      {mode === 'phase' && (
        <path 
          ref={refPathRef} 
          fill="none" 
          stroke={isDark ? '#334155' : '#94a3b8'} 
          strokeWidth="1.5" 
          strokeDasharray="5 5" 
          opacity="0.5" 
        />
      )}
      <path ref={pathRef} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const RampWave: React.FC<WaveProps> = ({ color = '#fb7185', mouseX = 0.5, mouseY = 0.5 }) => {
  const slope = 0.5 + mouseX * 2;
  const height = 40 + mouseY * 40;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
      <path d={`M0,80 L${400 / slope},${80 - height} M${400 / slope},80 L${800 / slope},${80 - height}`} fill="none" stroke={color} strokeWidth="3" strokeDasharray="1,2" opacity="0.3" />
      <path 
        d={`M0,80 ${Array.from({ length: 11 }, (_, i) => {
          const x = i * 40;
          const y = 80 - ((x * slope) % height);
          return `L${x},${y} ${((x + 40) * slope) % height < (x * slope) % height ? `M${x},80` : ''}`;
        }).join(' ')}`} 
        fill="none" stroke={color} strokeWidth="3" 
      />
    </svg>
  );
};

export const StepWave: React.FC<WaveProps> = ({ color = '#34d399', mouseX = 0.5, mouseY = 0.5 }) => {
  const stepPos = mouseX * 400;
  const stepHeight = 20 + mouseY * 60;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
      <path d={`M0,80 L${stepPos},80 L${stepPos},${80 - stepHeight} L400,${80 - stepHeight}`} fill="none" stroke={color} strokeWidth="3" />
      <circle cx={stepPos} cy={80} r="4" fill={color} />
      <circle cx={stepPos} cy={80 - stepHeight} r="4" fill={color} />
    </svg>
  );
};

export const ImpulseWave: React.FC<WaveProps> = ({ color = '#f97316', mouseX = 0.5, mouseY = 0.5 }) => {
  const impulsePos = mouseX * 400;
  const impulseHeight = 30 + mouseY * 50;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
       <line x1="0" y1="80" x2="400" y2="80" stroke={color} strokeWidth="1" opacity="0.2" />
       <motion.line 
        x1={impulsePos} y1="80" x2={impulsePos} y2={80 - impulseHeight} 
        stroke={color} strokeWidth="4" 
        animate={{ opacity: [0.6, 1, 0.6] }} 
        transition={{ duration: 1, repeat: Infinity }}
       />
       <path d={`M${impulsePos - 6},${80 - impulseHeight + 6} L${impulsePos},${80 - impulseHeight} L${impulsePos + 6},${80 - impulseHeight + 6}`} fill="none" stroke={color} strokeWidth="3" />
    </svg>
  );
};

export const LocalMouseArea: React.FC<{ render: (x: number, y: number) => React.ReactNode }> = ({ render }) => {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-10" 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0.5, y: 0.5 })}
    >
      {render(pos.x, pos.y)}
    </div>
  );
};

export const KineticText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//_";
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(text.split("").map((char, index) => {
                if (index < iterations) return text[index];
                return letters[Math.floor(Math.random() * letters.length)];
            }).join(""));
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1/4;
        }, 25);
        return () => clearInterval(interval);
    }, [text]);

    return <span className={className}>{display}</span>;
};

export const InsightPanel: React.FC<{ title: string; content: string; career?: string; isDark: boolean }> = ({ title, content, career, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`transition-all duration-700 rounded-3xl overflow-hidden ${isOpen ? (isDark ? 'bg-slate-900/50 border border-slate-700/50 p-6' : 'bg-slate-50 border border-slate-200 p-6') : (isDark ? 'bg-white/5 border border-white/5 p-4' : 'bg-slate-100 border border-slate-200 p-4')}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-all ${isOpen ? 'bg-cyan-500 text-black' : (isDark ? 'bg-white/10 text-white/40' : 'bg-slate-200 text-slate-500')}`}>
                        <BookOpen size={14} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isOpen ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-white/40 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900')}`}>{title}</span>
                    </div>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-90 text-cyan-500' : (isDark ? 'text-white/10' : 'text-slate-300')}`}>
                    <ChevronRight size={18} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-6 space-y-4">
                            <p className={`text-sm leading-relaxed opacity-80 ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>{content}</p>
                            {career && (
                                <div className={`flex items-center gap-3 pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                                    <div className="px-2 py-0.5 bg-cyan-500/10 rounded text-[8px] font-black text-cyan-500 uppercase tracking-widest">Career</div>
                                    <span className={`text-[10px] font-bold italic opacity-40 ${isDark ? 'text-white' : 'text-slate-900'}`}>{career}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ConceptCard: React.FC<{
  icon: React.ReactNode;
  color: string;
  title: string;
  layman: string;
  technical: string;
  example: string;
  isDark: boolean;
}> = ({ icon, color, title, layman, technical, example, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  const bgColor = isDark ? '#0A0C10' : '#f9fafb';
  const borderColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)';

  return (
    <div
      className="rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden"
      style={{
        background: bgColor,
        borderColor: expanded ? `${color}50` : borderColor,
      }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-center gap-4 p-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
          style={{ 
            background: expanded ? color : `${color}15`, 
            color: expanded ? '#fff' : color,
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{layman}</p>
        </div>
        <div className={`transition-transform duration-500 ${expanded ? 'rotate-90' : ''}`}>
           <ChevronRight size={16} className="opacity-20" />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 flex flex-col gap-4 border-t overflow-hidden" 
            style={{ borderColor: `${color}20` }}
          >
            <div className="mt-3">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] opacity-40" style={{ color }}>Details</span>
              <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{technical}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: `${color}0a`, border: `1px solid ${color}25` }}>
               <p className={`text-xs italic ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>"{example}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SignalTypeCard: React.FC<{
  title: string;
  color: string;
  description: string;
  wave: React.ReactNode;
  badge: string;
  isDark: boolean;
}> = ({ title, color, description, wave, badge, isDark }) => (
  <div
    className="rounded-2xl p-6 border flex flex-col gap-4 transition-all hover:translate-y-[-4px]"
    style={{ 
      background: isDark ? '#0A0C10' : '#ffffff', 
      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)',
    }}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold" style={{ color }}>{title}</h3>
      <span
        className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
      >
        {badge}
      </span>
    </div>
    <div className={`rounded-xl h-[100px] overflow-hidden flex items-center justify-center ${isDark ? 'bg-black/20' : 'bg-slate-900'}`}>
      {wave}
    </div>
    <p className={`text-sm leading-relaxed opacity-70 ${isDark ? 'text-slate-200' : 'text-gray-600'}`}>{description}</p>
  </div>
);

export const ComparisonConsole: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const rows = [
        { feat: "Nature", analog: "Continuous", digital: "Discrete", color: "#0EA5E9" },
        { feat: "Values", analog: "Infinite", digital: "Finite (Binary)", color: "#00D4FF" },
        { feat: "Noise", analog: "High Sensitivity", digital: "High Immunity", color: "#22D3EE" },
        { feat: "Storage", analog: "Physical Media", digital: "Binary Memory", color: "#A855F7" },
        { feat: "Processing", analog: "Complex Circuitry", digital: "Logic Gates", color: "#22C55E" }
    ];

    return (
        <div className={`w-full rounded-3xl overflow-hidden p-8 space-y-8 border transition-all duration-500 ${isDark ? 'bg-slate-900/30 border-white/5' : 'bg-slate-50 border-black/5'}`}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-200 dark:bg-white/5 rounded-xl text-slate-500 dark:text-white/40">
                    <Scale size={20} />
                </div>
                <div className="flex flex-col">
                    <h3 className={`text-xl font-black italic uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>System Arbitrage</h3>
                </div>
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-3 px-6 py-2 text-[8px] font-black uppercase tracking-widest opacity-20">
                    <span>Feature</span>
                    <span>Analog Domain</span>
                    <span>Digital Logic</span>
                </div>
                {rows.map((r, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        transition={{ delay: i * 0.05 }}
                        key={r.feat} 
                        className={`grid grid-cols-3 px-6 py-4 rounded-xl border transition-all group ${isDark ? 'bg-white/[0.01] border-white/[0.03] hover:border-white/10' : 'bg-black/[0.01] border-black/[0.03] hover:border-black/10'}`}
                    >
                        <span className={`text-[10px] font-black uppercase transition-colors ${isDark ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-black'}`}>{r.feat}</span>
                        <span className="text-xs font-bold" style={{ color: r.color + 'aa' }}>{r.analog}</span>
                        <span className="text-xs font-bold" style={{ color: r.color }}>{r.digital}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
