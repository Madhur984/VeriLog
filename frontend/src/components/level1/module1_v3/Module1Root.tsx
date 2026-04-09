import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Activity, Zap, Radio, Cpu, ChevronRight, ChevronDown, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Interactive Animated SVG Waveforms ─────────────────────────────────────

interface WaveProps {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  mouseX?: number;
  mouseY?: number;
}

const AnalogWave: React.FC<WaveProps> = ({ 
  color = '#22d3ee', 
  amplitude = 22, 
  frequency = 0.04,
  speed = 0.05,
  mouseX = 0.5,
  mouseY = 0.5
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>();
  
  // Real-time modulation based on mouse
  const baseAmp = amplitude + (mouseY * 40 - 20); // Y affects Amplitude
  const baseFreq = frequency + (mouseX * 0.08 - 0.04); // X affects Frequency

  useEffect(() => {
    let t = 0;
    const animate = () => {
      if (!pathRef.current) return;
      const w = 400, cy = 50;
      const pts = Array.from({ length: 120 }, (_, i) => {
        const x = (i / 120) * w;
        // Distort frequency locally near mouse? (Simpler: Global modulation)
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
    <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ display: 'block' }}>
      <path ref={pathRef} fill="none" stroke={color} strokeWidth="3" style={{ filter: `drop-shadow(0 0 8px ${color}80)` }} />
    </svg>
  );
};

const DigitalWave: React.FC<WaveProps & { complexity?: number }> = ({ 
  color = '#a78bfa', 
  complexity = 1,
  mouseX = 0.5
}) => {
  const [phase, setPhase] = useState(0);
  const modComplexity = complexity + (mouseX * 4); // X affects Complexity

  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 16), 120);
    return () => clearInterval(id);
  }, []);
  
  const steps = 15;
  return (
    <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ display: 'block' }}>
      {Array.from({ length: steps }).map((_, i) => {
        const bit = (Math.sin(i * modComplexity + phase * 0.5) > 0) ? 1 : 0;
        const x = i * (400 / steps);
        const y = bit === 1 ? 20 : 70;
        const w = (400 / steps) - 2;
        return <g key={i}>
          <rect x={x} y={y} width={w} height={bit === 1 ? 30 : 10} fill={`${color}12`} rx="2" />
          <rect x={x} y={y} width={w} height="3" fill={color} rx="1" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        </g>;
      })}
    </svg>
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

  // Use a darker color for reference in light mode to improve contrast
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
      {/* Interactive Background Particles/Waves */}
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
        
        {/* The Core Interactive Waveform */}
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

        {/* Text Sequence */}
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

        {/* Interaction Hint */}
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
  const bgColor = isDark ? '#080503' : '#f9fafb';
  const borderColor = isDark ? 'rgba(180,100,30,0.2)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? 'text-orange-50' : 'text-gray-900';
  const subTextColor = isDark ? 'text-orange-300/60' : 'text-gray-500';

  return (
    <div
      className="rounded-xl border transition-all duration-300 cursor-pointer"
      style={{
        background: bgColor,
        borderColor: expanded ? `${color}50` : borderColor,
        boxShadow: expanded ? `0 0 24px ${color}10` : 'none',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-center gap-4 p-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold ${textColor}`}>{title}</h3>
          <p className={`text-sm mt-0.5 line-clamp-2 ${subTextColor}`}>{layman}</p>
        </div>
        {expanded ? (
          <ChevronDown size={18} style={{ color, flexShrink: 0 }} />
        ) : (
          <ChevronRight size={18} style={{ color: isDark ? 'rgba(180,100,30,0.4)' : 'rgba(0,0,0,0.2)', flexShrink: 0 }} />
        )}
      </div>
      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-3 border-t" style={{ borderColor: `${color}20` }}>
          <div className="mt-4">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color }}>Technical Definition</span>
            <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-orange-200/70' : 'text-gray-600'}`}>{technical}</p>
          </div>
          <div className="p-3 rounded-lg" style={{ background: `${color}0a`, border: `1px solid ${color}25` }}>
            <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? 'text-orange-400/50' : 'text-gray-400'}`}>Real-World Example</span>
            <p className={`text-sm mt-1 leading-relaxed italic ${isDark ? 'text-orange-100/80' : 'text-gray-700'}`}>"{example}"</p>
          </div>
        </div>
      )}
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

// ── Main Page Layout ───────────────────────────────────────────────────────

export const Module1Root: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [showHook, setShowHook] = useState(true);

  const sections = [
    { id: 'intro', label: 'Introduction' },
    { id: 'standard', label: 'Standard Signals' },
    { id: 'types', label: 'Types of Signals' },
    { id: 'params', label: 'Signal Parameters' },
    { id: 'processing', label: 'Digital Processing' },
    { id: 'compare', label: 'Analog vs Digital' },
  ];

  useEffect(() => {
    if (showHook) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(s => {
      const el = document.getElementById(s.id);
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
          <p className={`text-[10px] mt-2 font-mono uppercase tracking-widest ${isDarkMode ? 'text-orange-500/60' : 'text-orange-600'}`}>Fundamental Module</p>
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
            onClick={() => setIsDarkMode(!isDarkMode)}
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
      <div className="flex-1 h-full overflow-y-auto relative scroll-smooth" style={{ background: bgColor }}>

        {/* Sticky Nav */}
        <nav className={`sticky top-0 z-50 px-8 py-5 flex justify-between items-center border-b backdrop-blur-md`} style={{ background: isDarkMode ? 'rgba(3,1,0,0.85)' : 'rgba(255,255,255,0.85)', borderColor }}>
          <div className="flex items-center gap-3">
            <span className={`font-mono font-semibold ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>M01</span>
            <span className={isDarkMode ? 'text-orange-900' : 'text-gray-300'}>·</span>
            <span className={`text-sm ${isDarkMode ? 'text-orange-300/60' : 'text-gray-500'}`}>Exploring the Language of Electricity</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-1 w-32 rounded-full overflow-hidden bg-gray-200 dark:bg-orange-900/20">
                <div className="h-full bg-orange-500 w-[20%]"></div>
             </div>
             <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>20% COMPLETED</span>
          </div>
        </nav>

        <main className={`max-w-4xl mx-auto px-8 py-16 space-y-32 ${isDarkMode ? 'text-orange-100' : 'text-gray-800'}`}>

          {/* ── HERO ── */}
          <section id="intro">
            <div className="text-center mb-16">
              <p className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-6 ${isDarkMode ? 'text-orange-600' : 'text-orange-700'}`}>Level 01 · Signal Theory</p>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tighter leading-none">
                <span className={isDarkMode ? 'text-orange-500' : 'text-orange-600'}>What</span>{' '}
                <span className={isDarkMode ? 'text-orange-50' : 'text-gray-900'}>is a Signal?</span>
              </h1>
              <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-orange-300/50' : 'text-gray-500'}`}>
                “A signal is a way to represent change.”
              </p>
            </div>

            {/* Animated live demo */}
            <div className={`rounded-3xl p-8 border mb-12 shadow-2xl transition-all`} style={{ background: isDarkMode ? '#060401' : '#ffffff', borderColor }}>
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
                  <div className={`mt-4 p-3 rounded-lg border text-xs font-mono ${isDarkMode ? 'bg-black/40 border-emerald-900/30 text-emerald-500/70' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                    Equation: u(t) = 1 for t ≥ 0, else 0
                  </div>
                </div>
                <div 
                  className="rounded-2xl p-8 border h-48 flex items-center justify-center relative group overflow-hidden" 
                  style={{ background: isDarkMode ? '#060401' : '#f9fafb', borderColor }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     <div className="absolute inset-0 bg-emerald-500/5 blur-xl" />
                  </div>
                  <StepWave 
                    color="#10b981" 
                    mouseX={useRef(0.5).current} /* Dummy static if no mouse hook on this div specifically? No, let's use global mouse */
                  />
                  {/* We need local mouse tracking for these specifically to feel high-end */}
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
                  <div className={`mt-4 p-3 rounded-lg border text-xs font-mono md:w-fit ${isDarkMode ? 'bg-black/40 border-rose-900/30 text-rose-500/70' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                    Equation: r(t) = t for t ≥ 0, else 0
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
                  <div className={`mt-4 p-3 rounded-lg border text-xs font-mono ${isDarkMode ? 'bg-black/40 border-orange-900/30 text-orange-500/70' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                    Equation: δ(t) = ∞ at t=0, Area = 1
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
            <h2 className={`text-3xl font-extrabold mb-4 ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>The Language of Waves</h2>
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

            <div className={`rounded-3xl p-10 border text-center transition-all`} style={{ background: isDarkMode ? '#000000' : '#f9fafb', borderColor }}>
              <p className={`text-xs font-mono mb-6 uppercase tracking-[0.3em] ${isDarkMode ? 'text-orange-600' : 'text-orange-700'}`}>The Scientist's View</p>
              <div className="inline-block p-8 rounded-2xl bg-orange-500/5 border border-orange-500/10 mb-12">
                <p className="text-4xl font-mono tracking-widest text-orange-500 md:text-5xl">
                  x(t) = A cos(ωt + θ)
                </p>
              </div>

              <div className="mt-12 space-y-8 text-left">
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-gray-900'}`}>What do these letters actually mean? 🧩</h3>
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

          {/* ── COMPARISON ── */}
          <section id="compare">
            <div className={`rounded-[2.5rem] overflow-hidden border shadow-2xl transition-all`} style={{ background: isDarkMode ? '#060401' : '#ffffff', borderColor }}>
              <table className="w-full text-base text-left border-collapse">
                <thead>
                  <tr style={{ background: isDarkMode ? '#0a0502' : '#f3f4f6' }}>
                    <th className={`p-6 font-black uppercase tracking-widest text-xs border-b ${isDarkMode ? 'text-orange-500 border-orange-900/40' : 'text-gray-500 border-gray-200'}`}>Trait</th>
                    <th className={`p-6 font-black uppercase tracking-widest text-xs border-b ${isDarkMode ? 'border-orange-900/40' : 'border-gray-200'}`}>Analog</th>
                    <th className={`p-6 font-black uppercase tracking-widest text-xs border-b ${isDarkMode ? 'border-orange-900/40' : 'border-gray-200'}`}>Digital</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? 'text-orange-100/80' : 'text-gray-700'}>
                  {[
                    ['Continuity', 'Continuous', 'Discrete'],
                    ['Noise', 'Permanent distortion', 'Resistant'],
                    ['Reproduction', 'Loses quality', 'Perfect copies'],
                    ['Software', 'Complex circuits', 'Standard chips'],
                  ].map(([feature, analog, digital]) => (
                    <tr
                      key={feature}
                      className={`border-b group transition-colors ${isDarkMode ? 'border-orange-900/10 hover:bg-orange-950/20' : 'border-gray-100 hover:bg-gray-50'}`}
                    >
                      <td className={`p-6 font-bold text-sm uppercase tracking-widest ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>{feature}</td>
                      <td className="p-6">{analog}</td>
                      <td className="p-6">{digital}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`mt-16 rounded-[2rem] p-10 border text-center`} style={{ background: isDarkMode ? 'rgba(249,115,22,0.05)' : 'rgba(249,115,22,0.05)', borderColor: isDarkMode ? 'rgba(249,115,22,0.3)' : 'rgba(249,115,22,0.4)' }}>
               <h3 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-orange-50' : 'text-gray-900'}`}>“A signal must return.”</h3>
            </div>

            <div className="mt-20 flex flex-col items-center">
               <button
                  className={`group relative flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95`}
                  style={{ background: '#f97316', color: '#ffffff', boxShadow: '0 20px 40px -10px rgba(249,115,22,0.5)' }}
                  onClick={() => window.location.href = '/module/2'}
                >
                  Enter Next Level 
                  <ChevronRight size={28} />
                </button>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};
