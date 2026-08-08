import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Activity, Zap, Radio, Cpu, ChevronRight, ChevronDown, MousePointer2, Scale, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { useModule1Audio } from './hooks/useModule1Audio';

// ── Interactive Animated SVG Waveforms (BitForBytes v7 TACTICAL EDITION) ──────

interface WaveProps {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  mouseX?: number;
  mouseY?: number;
  label?: string;
  unit?: string;
}

const AnalogWave: React.FC<WaveProps> = ({ 
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
    <div className="relative w-full group">
      {/* Tactical HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="hud-label">{label}</div>
          <div className="hud-value">{(baseAmp * 2).toFixed(1)}<span className="text-[8px] ml-1 opacity-30">{unit}</span></div>
      </div>
      <div className="absolute top-4 right-4 z-20 pointer-events-none text-right">
          <div className="hud-label">SAMP_FREQ</div>
          <div className="hud-value">{(baseFreq * 1000).toFixed(0)}<span className="text-[8px] ml-1 opacity-30">Hz</span></div>
      </div>
      
      <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none" className="relative z-10">
        <path ref={pathRef} fill="none" stroke={color} strokeWidth="2.5" style={{ filter: `drop-shadow(0 0 12px ${color}60)` }} />
        {/* Mirror glow */}
        <path ref={pathRef} fill="none" stroke={color} strokeWidth="8" opacity="0.1" style={{ filter: 'blur(8px)' }} />
      </svg>
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] grid-bg rounded-xl" />
    </div>
  );
};

const DigitalWave: React.FC<WaveProps & { complexity?: number }> = ({ 
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
    <div className="relative w-full group">
       <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="hud-label">{label}</div>
          <div className="hud-value">{bitSequence.slice(0, 4).join('')}<span className="text-[8px] ml-1 opacity-30">BIN_HEX</span></div>
      </div>
      <div className="absolute top-4 right-4 z-20 pointer-events-none text-right">
          <div className="hud-label">LOGIC_GATE_SYNC</div>
          <div className="hud-value">ACTIVE</div>
      </div>

      <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none" className="relative z-10">
        {bitSequence.map((bit, i) => {
          const x = i * (400 / steps);
          const y = bit === 1 ? 20 : 70;
          const w = (400 / steps) - 2;
          return <g key={i}>
            <rect x={x} y={y} width={w} height={bit === 1 ? 30 : 10} fill={`${color}08`} rx="2" />
            <motion.rect 
              initial={false}
              animate={{ y }}
              x={x} width={w} height="3" fill={color} rx="1" 
              style={{ filter: `drop-shadow(0 0 10px ${color})` }} 
            />
          </g>;
        })}
      </svg>
      <div className="absolute inset-0 opacity-[0.03] grid-bg rounded-xl" />
    </div>
  );
};

const SineWaveSmall: React.FC<{ 
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

      // Add a reference stationary wave for Phase comparison
      if (mode === 'phase' && refPathRef.current) {
        const refPts = Array.from({ length: 60 }, (_, i) => {
          const x = (i / 60) * w;
          const y = cy + 25 * Math.sin(0.15 * x + t); // The "Normal" wave
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

  const referenceColor = !isDark && mode === 'phase' ? '#94a3b8' : color;
  const referenceOpacity = !isDark && mode === 'phase' ? 0.6 : 0.4;

  return (
    <svg width="100%" height="100" viewBox="0 0 200 100" preserveAspectRatio="none">
      {mode === 'phase' && (
        <path 
          ref={refPathRef} 
          fill="none" 
          stroke={referenceColor} 
          strokeWidth="1.5" 
          strokeDasharray="5 5" 
          opacity={referenceOpacity} 
        />
      )}
      <path ref={pathRef} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

const RampWave: React.FC<WaveProps> = ({ color = '#fb7185', mouseX = 0.5, mouseY = 0.5 }) => {
  const slope = 0.5 + mouseX * 2;
  const height = 40 + mouseY * 40;
  return (
    <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none">
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

const StepWave: React.FC<WaveProps> = ({ color = '#34d399', mouseX = 0.5, mouseY = 0.5 }) => {
  const stepPos = mouseX * 400;
  const stepHeight = 20 + mouseY * 60;
  return (
    <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none">
      <path d={`M0,80 L${stepPos},80 L${stepPos},${80 - stepHeight} L400,${80 - stepHeight}`} fill="none" stroke={color} strokeWidth="3" style={{ filter: `drop-shadow(0 0 8px ${color}80)` }} />
      <circle cx={stepPos} cy={80} r="4" fill={color} />
      <circle cx={stepPos} cy={80 - stepHeight} r="4" fill={color} />
    </svg>
  );
};

const ImpulseWave: React.FC<WaveProps> = ({ color = '#f97316', mouseX = 0.5, mouseY = 0.5 }) => {
  const impulsePos = mouseX * 400;
  const impulseHeight = 30 + mouseY * 50;
  return (
    <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none">
       <line x1="0" y1="80" x2="400" y2="80" stroke={color} strokeWidth="1" opacity="0.2" />
       <motion.line 
        x1={impulsePos} y1="80" x2={impulsePos} y2={80 - impulseHeight} 
        stroke={color} strokeWidth="4" 
        animate={{ opacity: [0.4, 1, 0.4] }} 
        transition={{ duration: 1, repeat: Infinity }}
       />
       <path d={`M${impulsePos - 6},${80 - impulseHeight + 6} L${impulsePos},${80 - impulseHeight} L${impulsePos + 6},${80 - impulseHeight + 6}`} fill="none" stroke={color} strokeWidth="3" />
    </svg>
  );
};

const LocalMouseArea: React.FC<{ render: (x: number, y: number) => React.ReactNode }> = ({ render }) => {
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

// ── Hook Scene ─────────────────────────────────────────────────────────────

const SignalHook: React.FC<{ onComplete: () => void; isDark: boolean }> = ({ onComplete, isDark }) => {
  const [step, setStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  };

  const hookSteps = [
    { text: "Everything you interact with...", sub: "is a signal.", wave: "basic" },
    { text: "Sound is a signal.", sub: "Move your mouse to change Frequency.", wave: "audio" },
    { text: "Touch is a signal.", sub: "Mouse Y affects the Amplitude.", wave: "pulse" },
    { text: "Light is a signal.", sub: "Wave speed shifts with position.", wave: "light" },
    { text: "Data is a signal.", sub: "Complexity is a choice.", wave: "data" },
    { text: "But what actually is a signal?", sub: "Let's find out.", wave: "mystery" },
  ];

  const next = () => {
    if (step < hookSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors duration-1000`}
      style={{ 
        background: isDark ? '#020100' : '#ffffff',
      }}
      onMouseMove={handleMouseMove}
      onClick={next}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div 
          animate={{ x: mousePos.x * 20 - 10, y: mousePos.y * 20 - 10 }}
          className="absolute inset-0"
        >
          <div className="absolute top-[10%] left-[-10%] w-[120%] h-[80%] rotate-3 border-y border-orange-500/20 blur-sm" />
          <div className="absolute top-[20%] left-[-5%] w-[110%] h-[60%] -rotate-2 border-y border-orange-500/10 blur-md" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col items-center text-center">
        <div className="w-full h-32 flex items-center justify-center mb-16 px-12">
           <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="basic" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} className="w-full">
                  <AnalogWave color="#f97316" amplitude={10} frequency={0.03} speed={0.02} mouseX={mousePos.x} mouseY={mousePos.y} />
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="audio" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} className="w-full">
                  <AnalogWave color="#22d3ee" amplitude={25} frequency={0.06} speed={0.12} mouseX={mousePos.x} mouseY={mousePos.y} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="pulse" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} className="w-full">
                  <AnalogWave color="#fbbf24" amplitude={15} frequency={0.02} speed={0.01} mouseX={mousePos.x} mouseY={mousePos.y} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="light" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} className="w-full flex flex-col gap-2">
                  <AnalogWave color="#f472b6" amplitude={15} frequency={0.15} speed={0.08 + mousePos.x * 0.2} mouseX={mousePos.x} mouseY={mousePos.y} />
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 bg-white/5 pointer-events-none blur-[100px]" />
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="data" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }} className="w-full">
                  <DigitalWave color="#a78bfa" complexity={1} mouseX={mousePos.x} />
                </motion.div>
              )}
               {step === 5 && (
                <motion.div key="mystery" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 1 }} className="w-full opacity-40">
                  <AnalogWave color="#f97316" amplitude={2} frequency={0.02} speed={0.01} mouseX={mousePos.x} mouseY={mousePos.y} />
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {hookSteps[step].text}
            </h1>
            <p className={`text-xl font-medium ${isDark ? 'text-orange-500/60' : 'text-gray-500'}`}>
              {hookSteps[step].sub}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="fixed bottom-12 flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-orange-900 mb-1">X: FREQ</span>
                <div className="w-16 h-1 bg-orange-900/20 rounded-full overflow-hidden">
                   <motion.div className="h-full bg-orange-500" style={{ width: `${mousePos.x * 100}%` }} />
                </div>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-orange-900 mb-1">Y: AMP</span>
                <div className="w-16 h-1 bg-orange-900/20 rounded-full overflow-hidden">
                   <motion.div className="h-full bg-orange-500" style={{ width: `${mousePos.y * 100}%` }} />
                </div>
             </div>
          </div>
          <span className={`text-[10px] mt-4 uppercase font-mono tracking-widest ${isDark ? 'text-orange-900' : 'text-gray-300'}`}>
            {step === hookSteps.length - 1 ? "Click to Enter Module" : "Click to Continue"}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

// ── ELITE BitForBytes COMPONENTS ───────────────────────────────────────────────

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
    const audio = useModule1Audio();

    return (
        <div className={`transition-all duration-700 rounded-[2.5rem] overflow-hidden ${isOpen ? (isDark ? 'bg-orange-500/10 border border-orange-500/20 p-8' : 'bg-orange-50 border border-orange-200 p-8') : 'bg-white/5 border border-white/5 p-4'}`}>
            <button 
                onClick={() => {
                  setIsOpen(!isOpen);
                  audio.playPing(isOpen ? 440 : 880, 0.05);
                }}
                className="w-full flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-all ${isOpen ? 'bg-orange-500 text-black shadow-[0_0_15px_#f97316]' : 'bg-white/10 text-white/40'}`}>
                        <BookOpen size={14} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Analytical // Deep_Dive</span>
                        <span className={`text-[12px] font-black uppercase tracking-tighter transition-colors ${isOpen ? (isDark ? 'text-white' : 'text-gray-900') : 'text-white/40 group-hover:text-white'}`}>{title}</span>
                    </div>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-90 text-orange-500' : 'text-white/10'}`}>
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
                        <div className="pt-8 space-y-6">
                            <p className={`text-sm font-medium leading-relaxed italic ${isDark ? 'text-orange-100/60' : 'text-gray-600'}`}>{content}</p>
                            {career && (
                                <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                    <div className="px-3 py-1 bg-orange-500/10 rounded-lg text-[8px] font-black text-orange-500 uppercase tracking-widest">Career_Insight</div>
                                    <span className={`text-[10px] font-bold italic opacity-40 ${isDark ? 'text-white' : 'text-gray-900'}`}>{career}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Components ─────────────────────────────────────────────────────────────

const ConceptCard: React.FC<{
  icon: React.ReactNode;
  color: string;
  title: string;
  layman: string;
  technical: string;
  example: string;
  isDark: boolean;
}> = ({ icon, color, title, layman, technical, example, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  const audio = useModule1Audio();
  const bgColor = isDark ? '#080503' : '#f9fafb';
  const borderColor = isDark ? 'rgba(180,100,30,0.2)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? 'text-orange-50' : 'text-gray-900';
  const subTextColor = isDark ? 'text-orange-300/60' : 'text-gray-500';

  return (
    <div
      className="rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden"
      style={{
        background: bgColor,
        borderColor: expanded ? `${color}50` : borderColor,
        boxShadow: expanded ? `0 20px 40px ${color}15` : 'none',
      }}
      onClick={() => {
        setExpanded(e => !e);
        audio.playPing(expanded ? 330 : 660, 0.05);
      }}
    >
      <div className="flex items-center gap-4 p-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
          style={{ 
            background: expanded ? color : `${color}15`, 
            color: expanded ? '#000' : color,
            border: `1px solid ${color}30` 
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-bold tracking-tight ${textColor}`}>{title}</h3>
          <p className={`text-sm mt-0.5 line-clamp-1 ${subTextColor}`}>{layman}</p>
        </div>
        <div className={`transition-transform duration-500 ${expanded ? 'rotate-90' : ''}`}>
           <ChevronRight size={18} style={{ color: expanded ? color : (isDark ? 'rgba(180,100,30,0.4)' : 'rgba(0,0,0,0.2)'), flexShrink: 0 }} />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 flex flex-col gap-4 border-t overflow-hidden" 
            style={{ borderColor: `${color}20` }}
          >
            <div className="mt-4">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] opacity-40" style={{ color }}>Technical Protocol</span>
              <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-orange-200/70' : 'text-gray-600'}`}>{technical}</p>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: `${color}0a`, border: `1px solid ${color}25` }}>
              <span className={`text-[9px] font-mono font-black uppercase tracking-[0.3em] ${isDark ? 'text-orange-400/50' : 'text-gray-400'}`}>Field Application</span>
              <p className={`text-sm mt-1 leading-relaxed italic ${isDark ? 'text-orange-100/80' : 'text-gray-700'}`}>"{example}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SignalTypeCard: React.FC<{
  title: string;
  color: string;
  description: string;
  wave: React.ReactNode;
  badge: string;
  isDark: boolean;
}> = ({ title, color, description, wave, badge, isDark }) => (
  <div
    className="rounded-2xl p-6 border flex flex-col gap-4"
    style={{ 
      background: isDark ? '#060401' : '#ffffff', 
      borderColor: isDark ? `${color}30` : 'rgba(0,0,0,0.1)',
      boxShadow: isDark ? `0 0 20px ${color}10` : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold" style={{ color }}>{title}</h3>
      <span
        className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider"
        style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
      >
        {badge}
      </span>
    </div>
    <div className="rounded-xl p-3 flex items-center justify-center" style={{ background: isDark ? `${color}08` : '#f3f4f6', border: `${isDark ? '1px solid ' + color + '20' : 'none'}` }}>
      {wave}
    </div>
    <p className={`text-sm leading-relaxed ${isDark ? 'text-orange-300/60' : 'text-gray-600'}`}>{description}</p>
  </div>
);

export const ComparisonConsole: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const rows = [
        { feat: "Nature", analog: "Continuous", digital: "Discrete", color: "#f97316" },
        { feat: "Values", analog: "Infinite", digital: "Finite (2 for Binary)", color: "#00D4FF" },
        { feat: "Noise", analog: "Poor (Cumulative)", digital: "Excellent (Immune)", color: "#EF4444" },
        { feat: "Storage", analog: "Waveform (Tape/Vinyl)", digital: "Bits (Memory/SSD)", color: "#A855F7" },
        { feat: "Processing", analog: "Complex (Op-Amps)", digital: "Simple (Logic Gates)", color: "#22C55E" }
    ];

    const audio = useModule1Audio();

    return (
        <div className={`w-full bfb-glass rounded-[3rem] overflow-hidden p-10 space-y-10 border transition-all duration-500 shadow-2xl ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-white/40">
                    <Scale size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Domain_Arbitrage // Intel</span>
                    <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>System Arbitrage</h3>
                </div>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-3 px-6 py-2 text-[8px] font-black uppercase tracking-widest opacity-20">
                    <span>Variable_Id</span>
                    <span>Analog_Space</span>
                    <span>Digital_Logic</span>
                </div>
                {rows.map((r, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.05 }}
                        key={r.feat} 
                        onMouseEnter={() => audio.playPing(440 + i * 50, 0.02)}
                        className={`grid grid-cols-3 px-8 py-5 rounded-2xl border transition-all group ${isDark ? 'bg-white/[0.01] border-white/[0.03] hover:border-white/10' : 'bg-black/[0.01] border-black/[0.03] hover:border-black/10'}`}
                    >
                        <span className={`text-[10px] font-black uppercase transition-colors ${isDark ? 'text-white/40 group-hover:text-white' : 'text-black/40 group-hover:text-black'}`}>{r.feat}</span>
                        <span className="text-xs font-bold italic" style={{ color: r.color + '99' }}>{r.analog}</span>
                        <span className="text-xs font-bold italic" style={{ color: r.color }}>{r.digital}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// ── Main Page Layout ───────────────────────────────────────────────────────

export const Module1Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [showHook, setShowHook] = useState(true);

  const sections = [
    { id: 'intro', label: 'Signals' },
    { id: 'representation', label: 'Representation' },
    { id: 'analog', label: 'Analog Signals' },
    { id: 'digital', label: 'Digital Signals' },
    { id: 'compare', label: 'Comparison' },
    { id: 'bridge', label: 'ADC/DAC' },
    { id: 'concepts', label: 'Key Concepts' },
    { id: 'systems', label: 'Applications' },
    { id: 'verilog', label: 'Verilog Bridge' },
  ];

  useEffect(() => {
    if (showHook) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const subSignals = ['standard', 'types', 'params', 'processing'];
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (subSignals.includes(entry.target.id)) {
            setActiveSection('intro');
          } else {
            setActiveSection(entry.target.id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    subSignals.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showHook]);

  const bgColor = isDarkMode ? '#030100' : '#ffffff';
  const sidebarBg = isDarkMode ? '#040200' : '#f9fafb';
  const borderColor = isDarkMode ? 'rgba(124, 45, 18, 0.3)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = isDarkMode ? 'text-orange-50' : 'text-gray-900';

  return (
    <div className={`flex h-screen w-full font-sans transition-colors duration-300`} style={{ background: bgColor }}>

      {/* ── Hook Entry Sequence ── */}
      <AnimatePresence>
        {showHook && (
          <motion.div exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="fixed inset-0 z-[100]">
            <SignalHook isDark={isDarkMode} onComplete={() => setShowHook(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <div className="w-[300px] flex-shrink-0 border-r flex flex-col z-10 overflow-y-auto" style={{ background: sidebarBg, borderColor }}>
        <div className="p-8 border-b" style={{ borderColor }}>
          <h2 className={`text-lg font-bold ${textColor}`}>Signal Theory</h2>
          <p className={`text-[10px] mt-2 font-mono uppercase tracking-widest ${isDarkMode ? 'text-orange-500/60' : 'text-orange-600'}`}>Basic Module</p>
        </div>

        <div className="p-8">
          <p className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-6 ${isDarkMode ? 'text-orange-900' : 'text-gray-400'}`}>ON THIS PAGE</p>
          <div className="flex flex-col gap-2">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeSection === s.id
                  ? (isDarkMode ? 'text-orange-400 bg-orange-950/30 border border-orange-500/20' : 'text-orange-600 bg-orange-50 border border-orange-200 shadow-sm')
                  : (isDarkMode ? 'text-orange-800 hover:text-orange-400 hover:bg-orange-950/20' : 'text-gray-500 hover:text-orange-600 hover:bg-gray-100')
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 border-t" style={{ borderColor }}>
           <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border font-medium transition-all ${isDarkMode 
              ? 'border-orange-900/40 text-orange-400 hover:bg-orange-950/30' 
              : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 h-full overflow-y-auto relative scroll-smooth grid-bg" style={{ background: bgColor }}>

        {/* Sticky Nav */}
        <nav className={`sticky top-0 z-50 px-8 py-5 flex justify-between items-center border-b bfb-glass`} style={{ borderColor }}>
          <div className="flex items-center gap-3">
            <span className={`font-mono font-black ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>M01</span>
            <span className={isDarkMode ? 'text-orange-900' : 'text-gray-300'}>·</span>
            <span className={`text-[10px] uppercase font-black tracking-widest ${isDarkMode ? 'text-orange-300/40' : 'text-gray-400'}`}>Signal // Foundation</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-orange-500/40">Sync_Progress</span>
                <div className="h-[2px] w-32 rounded-full overflow-hidden bg-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: '20%' }} className="h-full bg-orange-500 shadow-[0_0_10px_#f97316]"></motion.div>
                </div>
             </div>
             <span className={`text-[10px] font-black font-mono ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>20.00%</span>
          </div>
        </nav>

        <main className={`max-w-4xl mx-auto px-8 py-16 space-y-48 ${isDarkMode ? 'text-orange-100' : 'text-gray-800'}`}>

          {/* ── HERO ── */}
          <section id="intro" className="relative">
              <div className="flex flex-col gap-2 mb-8">
                 <span className="mono-tag">Module_Alpha // Level_01</span>
                 <h1 className="hero-text text-6xl md:text-8xl leading-none">
                    <KineticText text="UNIFIED" className={isDarkMode ? 'text-orange-500' : 'text-orange-600'} />
                    <br />
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>FOUNDATION</span>
                 </h1>
              </div>
              
              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                  <div className={`px-6 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 text-[9px] font-black uppercase tracking-[0.3em] text-orange-500`}>
                      Domain_Sync: Active
                  </div>
                  <p className={`text-xl font-medium leading-relaxed max-w-xl italic ${isDarkMode ? 'text-orange-100/40' : 'text-gray-500'}`}>
                    "The universe speaks in waves. Engineers speak in bits. This is the bridge between them."
                  </p>
              </div>

            {/* Animated live demo */}
            <div className={`rounded-3xl p-8 border mb-12 shadow-2xl transition-all mt-16`} style={{ background: isDarkMode ? '#060401' : '#ffffff', borderColor }}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]`} />
                <span className={`text-xs font-mono uppercase tracking-widest font-bold ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>Live Waveform Interaction</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className={`text-sm font-mono uppercase tracking-wider ${isDarkMode ? 'text-orange-400/50' : 'text-gray-400'}`}>Analog Stream (Continuous)</p>
                  <div className="h-[120px] flex items-center justify-center rounded-2xl bg-black/20 dark:bg-black/40">
                    <AnalogWave color="#22d3ee" />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className={`text-sm font-mono uppercase tracking-wider ${isDarkMode ? 'text-orange-400/50' : 'text-gray-400'}`}>Digital Stream (Discrete)</p>
                  <div className="h-[120px] flex items-center justify-center rounded-2xl bg-black/20 dark:bg-black/40">
                    <DigitalWave color="#a78bfa" complexity={1} />
                  </div>
                </div>
              </div>
            </div>

            {/* Plain English Definition */}
            <div className={`rounded-3xl p-10 border relative overflow-hidden`} style={{ background: isDarkMode ? 'rgba(249,115,22,0.03)' : 'rgba(249,115,22,0.05)', borderColor: isDarkMode ? 'rgba(249,115,22,0.2)' : 'rgba(249,115,22,0.3)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>The Layman's Definition 🎙️</h2>
              <div className="space-y-6 text-base leading-relaxed">
                <p>
                  Imagine you're at one end of a long tube and your friend is at the other. If you shout, you're sending a <strong className="text-orange-500">Sound Signal</strong>. 
                  The air inside the tube vibrates to carry your message. 
                </p>
                <div className={`p-6 rounded-2xl border-l-4 font-medium ${isDarkMode ? 'bg-orange-950/20 border-orange-500 text-orange-200' : 'bg-orange-50 border-orange-500 text-orange-900'}`}>
                   "A signal is just any physical quantity that varies with time, space, or any other variable, to convey information."
                </div>
                <p>
                  In your computer, those shouting voices are replaced by <strong className="text-orange-500">volts</strong>. 
                  High voltage might mean "Yes," and Low voltage might mean "No."
                </p>
              </div>
            </div>

            {/* Real-World Examples */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { emoji: '🎙️', label: 'Human Voice', sub: 'Air pressure wave' },
                { emoji: '📡', label: 'WiFi Signal', sub: 'Electromagnetic wave' },
                { emoji: '💡', label: 'Optical Fiber', sub: 'Light pulses' },
                { emoji: '🌡️', label: 'Sensors', sub: 'Voltage changes' },
              ].map(ex => (
                <div key={ex.label} className={`rounded-2xl p-6 border text-center transition-all hover:translate-y-[-4px]`} style={{ background: isDarkMode ? '#070402' : '#ffffff', borderColor }}>
                  <div className="text-4xl mb-4">{ex.emoji}</div>
                  <p className={`text-base font-bold ${isDarkMode ? 'text-orange-100' : 'text-gray-500'}`}>{ex.label}</p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-orange-500/50' : 'text-gray-500'}`}>{ex.sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── STANDARD SIGNALS ── */}
          <section id="standard">
            <div className="flex flex-col gap-6 mb-16">
              <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>The Standard "Test" Signals</h2>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-300/60' : 'text-gray-600'}`}>
                Engineers don't just use music or voices to test systems. We use "Pure" signals with predictable math. 
                Move your mouse over the waveforms below to see how they respond to change.
              </p>
            </div>

            <div className="space-y-12">
              {/* Unit Step */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-xs font-bold">u(t)</div>
                    <h3 className="text-2xl font-bold">The Unit Step</h3>
                  </div>
                  <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                    Think of a light switch being flipped. It's zero, then suddenly it's one. 
                    This is used to test how a system reacts to a sudden, permanent change. 
                    In Verilog, this is often how we model a "Reset" signal going active.
                  </p>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>• <strong className="text-emerald-500">X-Axis:</strong> Shifts the time of the "flip" (Time Delay).</li>
                    <li>• <strong className="text-emerald-500">Y-Axis:</strong> Changes the step height (Voltage Level).</li>
                  </ul>
                  <div className={`mt-4 p-4 rounded-xl border font-mono font-bold space-y-2 ${isDarkMode ? 'bg-black/40 border-emerald-900/30 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                    <div className="text-[10px] uppercase tracking-widest text-emerald-500/70 font-semibold">Mathematical Definition</div>
                    <div className="text-base tracking-wide">
                      u(t) = &#123; 1, &nbsp;&nbsp;t ≥ 0
                    </div>
                    <div className="text-base tracking-wide pl-[65px]">
                      &nbsp;&nbsp;&nbsp;&#123; 0, &nbsp;&nbsp;t &lt; 0
                    </div>
                  </div>
                </div>
                <div 
                  className="rounded-2xl p-8 border h-48 flex items-center justify-center relative group overflow-hidden" 
                  style={{ background: isDarkMode ? '#060401' : '#f9fafb', borderColor }}
                >
                  <LocalMouseArea render={(x: number, y: number) => (
                    <StepWave color="#10b981" mouseX={x} mouseY={y} />
                  )} />
                </div>
              </div>

              {/* Unit Ramp */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div 
                  className="rounded-2xl p-8 border h-48 flex items-center justify-center relative group overflow-hidden order-2 md:order-1" 
                  style={{ background: isDarkMode ? '#060401' : '#f9fafb', borderColor }}
                >
                  <LocalMouseArea render={(x: number, y: number) => (
                    <RampWave color="#fb7185" mouseX={x} mouseY={y} />
                  )} />
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 font-mono text-xs font-bold">r(t)</div>
                    <h3 className="text-2xl font-bold">The Unit Ramp</h3>
                  </div>
                  <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                    Imagine a car slowly accelerating. The signal increases linearly with time. 
                    Ramps are used to test a system's ability to track a moving target. 
                    In control systems, this helps analyze steady-state error.
                  </p>
                   <ul className="space-y-2 text-sm opacity-80">
                    <li>• <strong className="text-rose-500">X-Axis:</strong> Changes the acceleration rate (Slope/Gradient).</li>
                    <li>• <strong className="text-rose-500">Y-Axis:</strong> Caps the maximum signal level (Saturation).</li>
                  </ul>
                  <div className={`mt-4 p-4 rounded-xl border font-mono font-bold space-y-2 ${isDarkMode ? 'bg-black/40 border-rose-900/30 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                    <div className="text-[10px] uppercase tracking-widest text-rose-500/70 font-semibold">Mathematical Definition</div>
                    <div className="text-base tracking-wide">
                      r(t) = &#123; t, &nbsp;&nbsp;t ≥ 0
                    </div>
                    <div className="text-base tracking-wide pl-[65px]">
                      &nbsp;&nbsp;&nbsp;&#123; 0, &nbsp;&nbsp;t &lt; 0
                    </div>
                  </div>
                </div>
              </div>

              {/* Unit Impulse */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-500 font-mono text-xs font-bold">δ(t)</div>
                    <h3 className="text-2xl font-bold">The Unit Impulse</h3>
                  </div>
                  <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                    A lightning strike or a hammer blow. It has infinite height but exists for zero time. 
                    Mathematically, its area is 1. We use it to find the "soul" (Impulse Response) of a system. 
                    If you know a system's response to this, you know how it reacts to *anything*.
                  </p>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>• <strong className="text-orange-500">X-Axis:</strong> Positions the pulse in time (Translation).</li>
                    <li>• <strong className="text-orange-500">Y-Axis:</strong> Dictates the "Energy" or Weight of the pulse.</li>
                  </ul>
                  <div className={`mt-4 p-4 rounded-xl border font-mono font-bold space-y-2 ${isDarkMode ? 'bg-black/40 border-orange-900/30 text-orange-400' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                    <div className="text-[10px] uppercase tracking-widest text-orange-500/70 font-semibold">Mathematical Definition</div>
                    <div className="text-base tracking-wide">
                      δ(t) = &#123; ∞, &nbsp;&nbsp;t = 0 &nbsp;&nbsp;(with ∫<sub>-∞</sub><sup>∞</sup> δ(t) dt = 1)
                    </div>
                    <div className="text-base tracking-wide pl-[65px]">
                      &nbsp;&nbsp;&nbsp;&#123; 0, &nbsp;&nbsp;t ≠ 0
                    </div>
                  </div>
                </div>
                <div 
                  className="rounded-2xl p-8 border h-48 flex items-center justify-center relative group overflow-hidden" 
                  style={{ background: isDarkMode ? '#060401' : '#f9fafb', borderColor }}
                >
                   <LocalMouseArea render={(x: number, y: number) => (
                    <ImpulseWave color="#f97316" mouseX={x} mouseY={y} />
                  )} />
                </div>
              </div>
            </div>
          </section>

          <section id="types">
            <h2 className={`text-3xl font-extrabold mb-4 ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>The Two Great Families</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <SignalTypeCard
                title="Analog Signal"
                color="#22d3ee"
                badge="The Curve"
                wave={<AnalogWave color="#22d3ee" />}
                isDark={isDarkMode}
                description="Think of a dimmer switch. You can slide it to any brightness level. Analog is natural, organic, and infinite."
              />
              <SignalTypeCard
                title="Digital Signal"
                color="#a78bfa"
                badge="The Step"
                wave={<DigitalWave color="#a78bfa" />}
                isDark={isDarkMode}
                description="Think of a standard light switch. It's either ON or OFF. No in-between. Digital is precise, clean, and logical."
              />
            </div>

            <div className="space-y-4">
               <h3 className={`text-sm font-mono uppercase tracking-widest mb-6 ${isDarkMode ? 'text-orange-700' : 'text-gray-400'}`}>Advanced Categorization</h3>
              <ConceptCard
                isDark={isDarkMode}
                icon={<Activity size={20} style={{ color: '#34d399' }} />}
                color="#34d399"
                title="Periodic (Repeating)"
                layman="A heart beating rhythmically. The signal looks the same every second."
                technical="Periodic signals repeat their path at regular intervals called 'Periods'."
                example="The AC electricity in your house wall socket (50Hz or 60Hz)."
              />
              <ConceptCard
                isDark={isDarkMode}
                icon={<Zap size={20} style={{ color: '#fbbf24' }} />}
                color="#fbbf24"
                title="Random (Noise)"
                layman="Rain falling on a tin roof. You know it's happening, but the pattern is chaotic."
                technical="Signals whose values cannot be predicted with certainty; described via stats."
                example="Static noise heard on an un-tuned radio."
              />
            </div>
          </section>

          {/* ── PARAMETERS ── */}
          <section id="params">
            <h2 className="hero-text text-3xl mb-8"><KineticText text="WAVE_LITERALS" /></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  name: 'Amplitude', color: '#22d3ee', emoji: '📏',
                  layman: 'How STRONG is the pulse?',
                  tech: 'The maximum displacement from zero.',
                  example: 'Turning up the volume.',
                  mode: 'amplitude'
                },
                {
                  name: 'Frequency', color: '#a78bfa', emoji: '⏱️',
                  layman: 'How FAST is it moving?',
                  tech: 'Cycles per second (Hertz).',
                  example: 'FM Radio stations like 98.4.',
                  mode: 'frequency'
                },
                {
                  name: 'Phase', color: '#fbbf24', emoji: '⬅️',
                  layman: 'Where did it BEGIN?',
                  tech: 'The starting point offset in time.',
                  example: 'Synchronization of pulses.',
                  mode: 'phase'
                },
              ].map(param => (
                <div
                  key={param.name}
                  className="rounded-3xl p-6 border flex flex-col gap-6"
                  style={{ background: isDarkMode ? '#060401' : '#ffffff', borderColor }}
                >
                  <div className="text-4xl">{param.emoji}</div>
                  <div>
                    <h3 className="text-2xl font-black mb-2" style={{ color: param.color }}>{param.name}</h3>
                    <p className={`text-sm mb-4 leading-relaxed ${isDarkMode ? 'text-orange-200/80' : 'text-gray-600'}`}>{param.layman}</p>
                    <div className="h-px w-full bg-orange-900/10 mb-4" />
                    <p className={`text-xs font-mono uppercase tracking-widest ${isDarkMode ? 'text-orange-500/40' : 'text-gray-400'}`}>{param.tech}</p>
                  </div>
                  <div className="mt-auto">
                    <SineWaveSmall 
                      color={param.color} 
                      speed={param.name === 'Frequency' ? 0.1 : param.name === 'Phase' ? 0.03 : 0.05} 
                      mode={param.mode as any}
                      isDark={isDarkMode}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <InsightPanel 
                isDark={isDarkMode}
                title="The Mathematical Oscillator"
                content="Physics is periodic at its core. The cosine function isn't just a math trick; it represents the projection of circular motion (rotation) onto a linear axis. In electronics, we use this to describe how voltage oscillates over time."
                career="DSP Engineer // Analog IC Designer"
              />

              <div className={`bfb-glass rounded-[3rem] p-12 text-center relative overflow-hidden border shadow-inner ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                <div className="scan-line absolute inset-0 opacity-10" />
                <p className="mono-tag mb-8 tracking-[0.5em]">The Scientist's View</p>
                <div className="inline-block p-10 rounded-3xl bg-orange-500/5 border border-orange-500/10 mb-12">
                  <p className="text-4xl font-mono tracking-widest text-orange-500 md:text-6xl">
                    x(t) = A cos(ωt + θ)
                  </p>
                </div>

                <div className="space-y-8 text-left max-w-2xl mx-auto">
                   <h3 className={`hero-text text-2xl ${isDarkMode ? 'text-orange-400' : 'text-gray-900'}`}>Variable Decoding 🧩</h3>
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-300/60' : 'text-gray-600'}`}>
                  Think of a <strong className="text-orange-500">Merry-Go-Round</strong> spinning in the dark. 
                  If you shine a flashlight on it from the side, the shadow on the wall moves back and forth in a smooth wave. 
                  That shadow movement is what our equation describes!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* x(t) */}
                  <div className={`p-6 rounded-2xl border transition-all hover:border-orange-500/50 ${isDarkMode ? 'bg-orange-950/10 border-orange-900/30' : 'bg-orange-50/50 border-orange-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center font-mono text-orange-500 font-bold">x</span>
                      <h4 className="font-bold underline decoration-orange-500/30">The Position</h4>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80">
                      If you're drawing the wave, this is where your pen is <strong>right now</strong>. It's the current "answer" or the height of the wave at this exact moment.
                    </p>
                  </div>

                  {/* A */}
                  <div className={`p-6 rounded-2xl border transition-all hover:border-orange-500/50 ${isDarkMode ? 'bg-orange-950/10 border-orange-900/30' : 'bg-orange-50/50 border-orange-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center font-mono text-orange-500 font-bold">A</span>
                      <h4 className="font-bold underline decoration-orange-500/30">The Size (Amplitude)</h4>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80">
                      How big is the Merry-Go-Round? A giant one creates a huge wave (Loud sound); a tiny one creates a small ripple (Whisper).
                    </p>
                  </div>

                  {/* cos */}
                  <div className={`p-6 rounded-2xl border transition-all hover:border-orange-500/50 ${isDarkMode ? 'bg-orange-950/10 border-orange-900/30' : 'bg-orange-50/50 border-orange-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center font-mono text-orange-500 font-bold">cos</span>
                      <h4 className="font-bold underline decoration-orange-500/30">The Nature Rule</h4>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80">
                      This is a math rule that converts "spinning in circles" into "smooth up and down motion". Without this, waves would look like jagged teeth instead of smooth curves.
                    </p>
                  </div>

                  {/* w */}
                  <div className={`p-6 rounded-2xl border transition-all hover:border-orange-500/50 ${isDarkMode ? 'bg-orange-950/10 border-orange-900/30' : 'bg-orange-50/50 border-orange-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center font-mono text-orange-500 font-bold">ω</span>
                      <h4 className="font-bold underline decoration-orange-500/30">The Speed (Omega)</h4>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80">
                      How fast are you spinning that Merry-Go-Round? Spinning fast makes a high-pitched squeak; spinning slow makes a low, deep rumble.
                    </p>
                  </div>

                  {/* t */}
                  <div className={`p-6 rounded-2xl border transition-all hover:border-orange-500/50 ${isDarkMode ? 'bg-orange-950/10 border-orange-900/30' : 'bg-orange-50/50 border-orange-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center font-mono text-orange-500 font-bold">t</span>
                      <h4 className="font-bold underline decoration-orange-500/30">The Time</h4>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80">
                      This is just the clock ticking. As time goes by, the signal moves along its path. Without "t", the world is just a frozen photo.
                    </p>
                  </div>

                  {/* theta */}
                  <div className={`p-6 rounded-2xl border transition-all hover:border-orange-500/50 ${isDarkMode ? 'bg-orange-950/10 border-orange-900/30' : 'bg-orange-50/50 border-orange-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center font-mono text-orange-500 font-bold">θ</span>
                      <h4 className="font-bold underline decoration-orange-500/30">The Head Start</h4>
                    </div>
                    <p className="text-sm leading-relaxed opacity-80">
                      When we started the clock, <strong>where</strong> were you on the Merry-Go-Round? At the top? At the side? This "shifts" the wave's beginning.
                    </p>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border-l-4 ${isDarkMode ? 'bg-orange-900/20 border-orange-500' : 'bg-orange-50 border-orange-500'}`}>
                   <p className="text-sm italic opacity-90">
                     "So, a signal is just <strong>Size</strong> multiplied by a <strong>Pattern Rule</strong>, based on <strong>How Fast</strong> time is passing, starting from a specific <strong>Spot</strong>."
                   </p>
                </div>
              </div>
            </div>
          </div>
        </section>

          {/* ── PROCESSING ── */}
          <section id="processing">
            <h2 className={`text-3xl font-extrabold mb-4 ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>Crossing the Bridge</h2>
            <div className={`rounded-3xl p-10 border mb-8 overflow-x-auto`} style={{ background: isDarkMode ? '#060401' : '#ffffff', borderColor }}>
              <div className="min-w-[700px] flex items-center justify-between gap-4">
                {[
                  { label: 'SENSE', sub: 'Analog Input', color: '#22d3ee', icon: '🎤' },
                  { label: 'CONVERT', sub: 'The ADC Step', color: '#34d399', icon: '🧩' },
                  { label: 'PROCESS', sub: 'Binary Logic', color: '#a78bfa', icon: '⚙️' },
                  { label: 'RESTORE', sub: 'The DAC Step', color: '#fbbf24', icon: '🪄' },
                  { label: 'ACT', sub: 'Analog Output', color: '#fb7185', icon: '🔊' },
                ].map((step, i, arr) => (
                  <React.Fragment key={step.label}>
                    <div className="flex flex-col items-center group">
                      <div
                        className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl mb-4 transition-all"
                        style={{ background: `${step.color}15`, border: `2px solid ${step.color}30` }}
                      >
                        {step.icon}
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: step.color }}>{step.label}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`h-px w-8 ${isDarkMode ? 'bg-orange-900/30' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* ── REPRESENTATION ── */}
          <section id="representation" className="pt-20">
            <div className="text-center mb-16 space-y-4">
              <h2 className="hero-text text-4xl"><KineticText text="DATA_REPRESENTATION" /></h2>
              <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-orange-300/60' : 'text-gray-600'}`}>
                You now understand what a signal is. The next question is: how do electronic systems actually represent and process these signals?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-orange-950/10 border-orange-900/30' : 'bg-orange-50 border-orange-100'}`}>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-2xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-2">Real World</h3>
                <p className="text-sm opacity-80">Signals exist in the physical world as continuous changes (sound, light, heat).</p>
              </div>
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-orange-950/10 border-orange-900/30' : 'bg-orange-50 border-orange-100'}`}>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-2xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold mb-2">The Need</h3>
                <p className="text-sm opacity-80">Systems need a reliable way to store, process, and transmit these signals.</p>
              </div>
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-orange-950/10 border-orange-500' : 'bg-orange-100 border-orange-200'}`}>
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Two Ways</h3>
                <p className="text-sm opacity-80 font-bold">This leads to two basic types: Analog and Digital.</p>
              </div>
            </div>
          </section>

          {/* ── ANALOG SIGNALS ── */}
          <section id="analog" className="pt-20">
            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                    <Radio size={24} />
                  </div>
                  <h2 className="hero-text text-3xl"><KineticText text="ANALOG_DOMAIN" /></h2>
                </div>
                <p className="text-lg font-medium text-cyan-500">Continuous Representation</p>
                <p className={`leading-relaxed ${isDarkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                  An analog signal is <strong>continuous</strong> in both time and amplitude. It closely follows real-world physical behavior, having infinite possible values at any instant.
                </p>
                <div className={`p-4 rounded-xl font-mono text-center ${isDarkMode ? 'bg-cyan-950/30 text-cyan-400' : 'bg-cyan-50 text-cyan-700'}`}>
                  x(t) = A sin(2πft + ϕ)
                </div>
              </div>
              <div className={`flex-1 w-full rounded-3xl border p-8 ${isDarkMode ? 'bg-cyan-950/10 border-cyan-500/30' : 'bg-cyan-50/50 border-cyan-200'}`}>
                <AnalogWave color="#22d3ee" amplitude={30} frequency={0.05} />
                <div className="mt-8 grid grid-cols-2 gap-4 text-xs font-mono uppercase tracking-widest text-cyan-500/60">
                  <div className="p-3 rounded-lg border border-cyan-500/20">Smooth Waveform</div>
                  <div className="p-3 rounded-lg border border-cyan-500/20">Infinite Resolution</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-orange-900/20' : 'bg-white shadow-sm border-gray-100'}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-500">✔</span> Advantages
                </h3>
                <ul className="space-y-3 text-sm opacity-80">
                  <li>• Natural representation of real-world signals</li>
                  <li>• Simple for basic systems</li>
                  <li>• Direct representation of physical quantities</li>
                </ul>
              </div>
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-orange-900/20' : 'bg-white shadow-sm border-gray-100'}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-rose-500">✘</span> Disadvantages
                </h3>
                <ul className="space-y-3 text-sm opacity-80">
                  <li>• Highly sensitive to noise</li>
                  <li>• Degrades over transmission and copying</li>
                  <li>• Difficult to store and process</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
               {['Microphone', 'Analog Thermometer', 'Vinyl Records', 'Analog Clock'].map(ex => (
                 <span key={ex} className={`px-4 py-2 rounded-full text-xs font-bold border ${isDarkMode ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-700'}`}>
                   {ex}
                 </span>
               ))}
            </div>
          </section>

          {/* ── DIGITAL SIGNALS ── */}
          <section id="digital" className="pt-20">
             <div className="flex flex-col md:flex-row-reverse gap-12 items-center mb-16">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-500 border border-violet-500/20">
                    <Cpu size={24} />
                  </div>
                  <h2 className="hero-text text-3xl"><KineticText text="DIGITAL_LOGIC" /></h2>
                </div>
                <p className="text-lg font-medium text-violet-500">Discrete Representation</p>
                <p className={`leading-relaxed ${isDarkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                   A digital signal is <strong>discrete</strong> in time and amplitude. It uses specific values (Binary) to represent information, making it reliable and easy to handle.
                </p>
                <div className="flex gap-4">
                   <div className={`flex-1 p-3 rounded-xl text-center border font-mono ${isDarkMode ? 'border-violet-900/50 bg-violet-950/30 text-violet-400' : 'border-violet-200 bg-violet-50 text-violet-700'}`}>
                      Logic 0: Low
                   </div>
                   <div className={`flex-1 p-3 rounded-xl text-center border font-mono ${isDarkMode ? 'border-violet-900/50 bg-violet-950/30 text-violet-400' : 'border-violet-200 bg-violet-50 text-violet-700'}`}>
                      Logic 1: High
                   </div>
                </div>
              </div>
              <div className={`flex-1 w-full rounded-3xl border p-8 ${isDarkMode ? 'bg-violet-950/10 border-violet-500/30' : 'bg-violet-50/50 border-violet-200'}`}>
                <DigitalWave color="#a78bfa" complexity={1} />
                <div className="mt-8 grid grid-cols-2 gap-4 text-xs font-mono uppercase tracking-widest text-violet-500/60">
                  <div className="p-3 rounded-lg border border-violet-500/20">Step-like Signal</div>
                  <div className="p-3 rounded-lg border border-violet-500/20">Finite Values (2ⁿ)</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-orange-900/20' : 'bg-white shadow-sm border-gray-100'}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <span className="text-violet-500">✔</span> Advantages
                </h3>
                <ul className="space-y-3 text-sm opacity-80">
                  <li>• Strong noise immunity (Reliable)</li>
                  <li>• Reliable storage, copying, and transmission</li>
                  <li>• No cumulative degradation</li>
                </ul>
              </div>
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-orange-900/20' : 'bg-white shadow-sm border-gray-100'}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <span className="text-rose-500">✘</span> Disadvantages
                </h3>
                <ul className="space-y-3 text-sm opacity-80">
                  <li>• Information loss during conversion</li>
                  <li>• Higher system complexity</li>
                  <li>• Requires precise clocking</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4 justify-end">
               {['Memory', 'MP3 Files', 'Keyboard Input', 'LED Displays'].map(ex => (
                 <span key={ex} className={`px-4 py-2 rounded-full text-xs font-bold border ${isDarkMode ? 'bg-violet-950/20 border-violet-500/30 text-violet-400' : 'bg-violet-50 border-violet-200 text-violet-700'}`}>
                   {ex}
                 </span>
               ))}
            </div>
          </section>

          {/* ── COMPARISON ── */}
          <section id="compare" className="pt-20">
             <div className="text-center mb-16 space-y-4">
               <h2 className="hero-text text-4xl"><KineticText text="DOMAIN_ARBITRAGE" /></h2>
               <p className={`mono-tag tracking-[0.5em] ${isDarkMode ? 'text-orange-500/40' : 'text-gray-400'}`}>System_Side_By_Side</p>
             </div>

             <ComparisonConsole isDark={isDarkMode} />
          </section>

          {/* ── BRIDGING WORLDS ── */}
          <section id="bridge" className="pt-20">
            <div className="bfb-glass p-12 rounded-[4rem] relative overflow-hidden" style={{ borderColor: isDarkMode ? 'rgba(249,115,22,0.15)' : 'rgba(249,115,22,0.05)' }}>
               <div className="scan-line absolute inset-0 opacity-10" />
               <div className="relative z-10">
                  <div className="flex flex-col md:flex-row gap-12">
                     <div className="flex-1">
                        <h2 className="hero-text text-3xl mb-8"><KineticText text="TRANS_WORLD_SYST" /></h2>
                        <p className={`mb-8 leading-relaxed ${isDarkMode ? 'text-orange-200/70' : 'text-gray-600'}`}>
                           The real world is analog, but our machines are digital. Conversion enables interaction between these two worlds.
                        </p>
                        
                        <div className="space-y-8">
                           <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-orange-950/20 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
                              <h4 className="font-bold text-orange-500 mb-2 flex items-center gap-2">
                                 <Activity size={18} /> ADC (Analog → Digital)
                              </h4>
                              <p className="text-sm opacity-80 mb-4">Capturing the real world into binary data.</p>
                              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
                                 <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20">SAMPLING</div>
                                 <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20">QUANTIZATION</div>
                                 <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20">ENCODING</div>
                              </div>
                           </div>

                           <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
                              <h4 className="font-bold text-cyan-500 mb-2 flex items-center gap-2">
                                 <Zap size={18} /> DAC (Digital → Analog)
                              </h4>
                              <p className="text-sm opacity-80">Reconstructing data back into physical reality (e.g., sound to speaker).</p>
                           </div>
                        </div>
                     </div>

                     <div className="flex-1 flex flex-col justify-center">
                        <div className={`p-8 rounded-3xl border text-center ${isDarkMode ? 'bg-black/50 border-orange-500/20' : 'bg-white border-gray-200'}`}>
                           <p className="text-xs font-mono text-orange-500 uppercase tracking-widest mb-4">The Golden Rule: Nyquist-Shannon</p>
                           <p className="text-4xl font-mono mb-6">f<sub>s</sub> &gt; 2f<sub>max</sub></p>
                           <p className="text-sm italic opacity-70">
                               "To perfectly capture a signal, you must sample it at least twice as fast as its highest frequency component."
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* ── KEY CONCEPTS ── */}
          <section id="concepts" className="pt-20">
            <div className="text-center mb-16 space-y-4">
               <h2 className="hero-text text-4xl"><KineticText text="CRITICAL_CONCEPTS" /></h2>
               <p className="mono-tag tracking-[0.5em]">Hardware_Logic_Boundaries</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className={`p-8 rounded-3xl border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-black/30 border-orange-900/20' : 'bg-white shadow-sm border-gray-100'}`}>
                  <h3 className="text-xl font-bold mb-3 text-rose-500">Aliasing</h3>
                  <p className="text-sm opacity-70 leading-relaxed">Occurs when sampling rate is too low. High-frequency signals appear as incorrect lower frequencies - like a wagon wheel spinning backward in movies.</p>
               </div>
               <div className={`p-8 rounded-3xl border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-black/30 border-orange-900/20' : 'bg-white shadow-sm border-gray-100'}`}>
                  <h3 className="text-xl font-bold mb-3 text-emerald-500">Quantization Error</h3>
                  <p className="text-sm opacity-70 leading-relaxed">The difference between the actual infinite analog value and the rounded digital value. This is the "noise" created by conversion.</p>
               </div>
               <div className={`p-8 rounded-3xl border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-black/30 border-orange-900/20' : 'bg-white shadow-sm border-gray-100'}`}>
                  <h3 className="text-xl font-bold mb-3 text-violet-500">Bit Depth</h3>
                  <p className="text-sm opacity-70 leading-relaxed">More bits = more precision. Each additional bit doubles the number of possible values, improving signal quality and reducing error.</p>
               </div>
            </div>
          </section>

          {/* ── REAL WORLD SYSTEMS ── */}
          <section id="systems" className="pt-20">
            <h2 className="hero-text text-3xl mb-12"><KineticText text="DEPLOYED_REALITY" /></h2>
            <div className="space-y-4">
              {[
                { name: 'Audio Recording', flow: 'Microphone → ADC → Digital File', icon: '🎙️' },
                { name: 'Audio Playback', flow: 'Digital File → DAC → Speaker', icon: '🔊' },
                { name: 'Temperature Sensor', flow: 'Analog Signal → ADC → Digital Display', icon: '🌡️' },
                { name: 'Mobile Phone', flow: 'Analog RF → Digital Processing', icon: '📱' },
                { name: 'Automotive Systems', flow: 'Sensor → ADC → Control Unit', icon: '🚗' },
              ].map((sys, i) => (
                <div key={i} className={`flex items-center gap-6 p-6 rounded-2xl border transition-all bfb-glass ${isDarkMode ? 'border-orange-900/20 hover:bg-orange-950/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                   <div className="text-3xl bg-white/5 p-3 rounded-xl">{sys.icon}</div>
                   <div>
                      <h4 className="font-bold text-lg">{sys.name}</h4>
                      <p className={`font-mono text-sm ${isDarkMode ? 'text-orange-500/60' : 'text-orange-600'}`}>{sys.flow}</p>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── VERILOG BRIDGE ── */}
          <section id="verilog" className="pt-20 pb-48">
             <div className={`bfb-glass p-16 rounded-[5rem] text-center relative overflow-hidden border shadow-2xl transition-all duration-1000 ${isDarkMode ? 'border-orange-500/30' : 'border-orange-300'}`}>
                <div className="grid-bg absolute inset-0 opacity-10" />
                <div className="scan-line absolute inset-0 opacity-5" />
                
                <p className="mono-tag mb-8 tracking-[0.8em]">Final_Phase // Gateway_01</p>
                <h2 className="hero-text text-6xl md:text-7xl mb-12">
                   <KineticText text="THE_VERILOG" />
                   <br />
                   <span className="text-white">BRIDGE</span>
                </h2>
                
                <div className="max-w-2xl mx-auto space-y-12">
                   <p className="text-2xl font-medium leading-relaxed italic opacity-60">
                      "Analog is the pulse. Digital is the mind. Verilog is the blueprint that organizes them."
                   </p>
                   
                   <div className={`p-10 rounded-[3rem] border-2 border-dashed bfb-glass ${isDarkMode ? 'border-orange-500/20' : 'border-orange-400'}`}>
                      <p className="text-3xl font-black italic uppercase tracking-tighter text-orange-500">
                         Design the intelligence.
                         <br />
                         Master the hardware.
                      </p>
                   </div>

                   <div className="pt-16">
                      <button
                        className="axe-btn-primary"
                        onClick={() => window.location.href = '/module/2'}
                      >
                        Launch_Next_Level
                      </button>
                   </div>
                </div>
             </div>
          </section>

        </main>
      </div>
    </div>
  );
};
