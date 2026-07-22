import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { SignalEngine, SignalConfig } from '../SignalEngine';
import { Activity, Radio, Minimize2, Maximize2, Zap, Sliders, Cpu, Terminal, ArrowRight } from 'lucide-react';

import { TechnicalAudit } from '../components/TechnicalAudit';
import { TryItYourself } from '../../../ui/TryItYourself';

// --- Static Assets ---
const LOG_MESSAGES = [
    "SIGNAL_CONFLUENCE: 98% VERIFIED",
    "ENTROPY_BASE: 0.008-SIGMA DETECTED",
    "LANCZOS_KERNEL_LOCKED_SYNC",
    "CONTINUITY_VERIFIED_INFINITE",
    "PHYSICAL_LAYER_ACTIVE",
    "ENTROPY_REJECTION: OPTIMAL"
];

/**
 * S00_Intro: THE SENSE OF FLOW (ELITE VERSION)
 * Focus: High-agency sensory exploration + Engineering Depth.
 * Upgrades: Lissajous Reticle, Harmonic Entropy, Idealist Ghost, Temporal Friction, System Ticker.
 */
export const S00_Intro: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  // --- Animation Sync State ---
  const [targetMousePos, setTargetMousePos] = useState({ x: 0.5, y: 0.5 });
  const [zoom, setZoom] = useState(1);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [complexHarmonics, setComplexHarmonics] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [scrubTime, setScrubTime] = useState<number | null>(null);
  const idleTimer = useRef<any>(null);
  
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setLogIndex(prev => (prev + 1) % LOG_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const springX = useSpring(0.5, { stiffness: 45, damping: 20 });
  const springY = useSpring(0.5, { stiffness: 45, damping: 20 });

  useEffect(() => {
    springX.set(targetMousePos.x);
    springY.set(targetMousePos.y);
  }, [targetMousePos, springX, springY]);

  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 1200);
  };

  const [localTime, setLocalTime] = useState(0);
  useEffect(() => {
    if (!isFrozen && scrubTime === null) {
      setLocalTime(time);
    } else if (scrubTime !== null) {
      setLocalTime(scrubTime);
    }
  }, [time, isFrozen, scrubTime]);

  // Main Wave Config
  const config = useMemo((): SignalConfig => ({
    frequency: (0.2 + targetMousePos.x * 3) / zoom, 
    amplitude: 20 + targetMousePos.y * 60,
    sampleRate: 0, 
    bitDepth: 0,
    // Elite Upgrade: Harmonic Entropy (jitter increases slightly with freq)
    jitter: isIdle ? 0.05 : 0.002 + (targetMousePos.x * 0.005), 
    dither: false,
    reconstruction: 'sinc'
  }), [targetMousePos, zoom, isIdle]);

  // Elite Upgrade: The Idealist Ghost Wave (Perfect Math)
  const ghostConfig = useMemo((): SignalConfig => ({
    ...config,
    jitter: 0,
    amplitude: config.amplitude
  }), [config]);

  // Elite Upgrade: Composite Signal (Sum of Sines)
  const harmonicPoints = useMemo(() => {
    if (!complexHarmonics) return [];
    
    // Generate a second harmonic Points manually via SignalEngine logic
    const res = 200;
    const pts = [];
    const f2 = config.frequency * 2;
    const a2 = config.amplitude * 0.4;
    for(let i=0; i<res; i++) {
        const x = (i / (res - 1)) * 600;
        const t = (x / 600) * Math.PI * 2 * (f2 * 5) + localTime * 4;
        pts.push({ x, y: 125 + a2 * Math.sin(t) });
    }
    return pts;
  }, [complexHarmonics, config.frequency, config.amplitude, localTime]);

  const { analogPoints } = SignalEngine(config, localTime, 600, 250);
  const { analogPoints: ghostPoints } = SignalEngine(ghostConfig, localTime, 600, 250);
  
  // Composite Wave calculation
  const compositePoints = useMemo(() => {
    if (!complexHarmonics) return analogPoints;
    return analogPoints.map((p, i) => {
        const h = harmonicPoints[i];
        if (!h) return p;
        return { ...p, y: p.y + (h.y - 125) };
    });
  }, [analogPoints, harmonicPoints, complexHarmonics]);


  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const strokeColor = isDarkMode ? '#f97316' : '#ea580c';
  const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200';
  const canvasBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-gray-50 border-gray-200';

  return (
    <div className="relative flex flex-col gap-12 max-w-6xl mx-auto mb-32 z-10 px-4 md:px-8">
      {/* ELITE BACKGROUND: Fluid Signal Flux */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden -z-10">
        <motion.div 
            animate={{ 
                x: [targetMousePos.x * -50, targetMousePos.x * 50],
                y: [targetMousePos.y * -50, targetMousePos.y * 50],
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-[-20%] blur-[120px] rounded-full ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-500/10'}`}
        />
      </div>

      <div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]"
        onWheel={(e) => {
            setZoom(prev => Math.max(0.5, Math.min(3, prev + (e.deltaY > 0 ? 0.08 : -0.08))));
            resetIdleTimer();
        }}
      >
        <div className="space-y-12 text-left">
            <motion.div
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
            >
                <h1 className={`text-[clamp(3.5rem,10vw,8rem)] font-black italic tracking-tighter leading-[0.8] ${textColor}`}>
                  What <span className={accentColor}>Flow</span> <br/>Really Is
                </h1>
                
                <div className="space-y-6">
                    <div className={`text-2xl leading-relaxed font-bold tracking-tight ${textColor}`}>
                      <p>Reality doesn’t happen in steps. It flows.</p>
                    </div>
                    <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
                      Every sound, light, or voltage is an unbroken stream of values.
                      An analog signal is like a real rainbow - endless shades blending into each other.
                    </p>
                    <p className={`text-lg font-black italic ${accentColor}`}>
                      But computers can't store infinity. They need to turn the rainbow into a box of crayons.
                    </p>
                </div>
            </motion.div>

            <div className={`p-8 rounded-[2.5rem] border space-y-4 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white shadow-sm border-gray-100'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-40">Engineering Philosophy</span>
                </div>
                <p className={`text-sm italic leading-relaxed ${subTextColor}`}>
                    "Nature is an ocean of infinite precision. Computers are ladders; nature is a smooth ramp."
                </p>
            </div>
        </div>

        <div className="relative group">
            <TryItYourself corner />
            <AnimatePresence>
                {isIdle && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none"
                    >
                        <span className={`text-[10px] font-mono uppercase tracking-[0.4em] font-black ${accentColor}`}>Sense the entropy. Control the stream.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div 
                className={`relative h-[620px] w-full rounded-[4rem] border overflow-hidden shadow-2xl transition-all duration-700 ${isIdle ? 'cursor-default' : 'cursor-grabbing'} ${canvasBg}`}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    
                    setTargetMousePos({ x, y });
                    
                    if (isFrozen) {
                        // Temporal Scrubbing: Mapping cursor X to a historical time offset
                        setScrubTime(time + (x - 0.5) * 5);
                    }
                    
                    resetIdleTimer();
                }}
                onMouseEnter={() => setIsIdle(false)}
                onMouseLeave={() => { setIsIdle(true); setScrubTime(null); }}
                onMouseDown={(e) => { 
                    setIsFrozen(true); 
                    resetIdleTimer();
                    // Initialize scrub on click
                    const rect = e.currentTarget.getBoundingClientRect();
                    setScrubTime(time + (e.clientX - rect.left) / 100);
                }}
                onMouseUp={() => setIsFrozen(false)}
            >
                <div className={`absolute top-10 left-10 right-10 z-10 p-8 rounded-[2.5rem] border transition-all duration-700 ${isDarkMode ? 'bg-bg-elev border-orange-500/20 shadow-neo' : 'bg-white border-gray-100 shadow-neo'}`}>
                    <div className="flex justify-between items-start">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>System Engine</span>
                                <div className={`text-xl font-black italic tracking-tighter ${accentColor}`}>ANALOG REALITY</div>
                            </div>
                            <div className="flex gap-10">
                                <div className="space-y-1">
                                    <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Frequency</span>
                                    <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>{(config.frequency * 10).toFixed(1)} <span className="text-xs not-italic opacity-30">Hz</span></div>
                                </div>
                                <div className="space-y-1">
                                    <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30 ${textColor}`}>Amplitude</span>
                                    <div className={`text-2xl font-black italic tracking-tighter ${textColor}`}>{(config.amplitude).toFixed(0)} <span className="text-xs not-italic opacity-30">V</span></div>
                                </div>
                            </div>
                        </div>

                        {/* SPECTRAL ANALYZER HUD */}
                        <div className="hidden md:flex gap-1.5 h-12 items-end opacity-20 group-hover:opacity-40 transition-opacity">
                            {[1, 2, 3, 4, 5, 2, 1, 4, 2, 5].map((h, i) => (
                                <motion.div 
                                    key={i} 
                                    className={`w-1 rounded-t-full ${isDarkMode ? 'bg-white' : 'bg-black'}`}
                                    animate={{ height: isFrozen ? h * 4 : [h * 4, (h + (Math.random() * 8)) * 4, h * 4] }}
                                    transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                                />
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setComplexHarmonics(!complexHarmonics)}
                                className={`px-6 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${complexHarmonics ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : (isDarkMode ? 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200')}`}
                            >
                                {complexHarmonics ? 'COMPLEX (H2)' : 'PURE (H1)'}
                            </button>
                            <button 
                                onClick={() => setShowGhost(!showGhost)}
                                className={`px-6 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${showGhost ? 'bg-orange-500 text-white border-orange-500' : (isDarkMode ? 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200')}`}
                            >
                                {showGhost ? 'IDEAL: ON' : 'IDEAL: OFF'}
                            </button>
                            <div className={`px-6 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 border-white/10 text-white/40' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                                {scrubTime !== null ? 'MODE: SCRUB' : (isFrozen ? 'MODE: FREEZE' : 'MODE: LIVE')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="100%" height="60%" viewBox="0 0 600 250" preserveAspectRatio="none" className="scale-[1.1]">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        
                        {/* Elite: Idealist Ghost Wave (Pure Math Reference) */}
                        <AnimatePresence>
                            {showGhost && (
                                <motion.path 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    d={ghostPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                                    fill="none" 
                                    stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                />
                            )}
                        </AnimatePresence>

                        {/* COMPOSITE SIGNAL PATH */}
                        <path 
                            d={compositePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} 
                            fill="none" 
                            stroke={strokeColor} 
                            strokeWidth="4"
                            strokeLinecap="round"
                            filter="url(#glow)"
                        />
                    </svg>
                </div>

                {/* Elite Upgrade: Lissajous Reticle & Temporal Friction */}
                <motion.div 
                    className="absolute w-20 h-20 pointer-events-none z-50 flex items-center justify-center"
                    style={{ 
                        left: targetMousePos.x * 100 + '%', 
                        top: targetMousePos.y * 100 + '%',
                        x: '-50%',
                        y: '-50%'
                    }}
                    animate={{ 
                        // Temporal Friction: Jitter cursor based on frequency
                        rotate: [0, Math.sin(time * 20) * (targetMousePos.x * 5), 0],
                        scale: isFrozen ? 0.9 : 1
                    }}
                >
                    <div className="absolute inset-0 border border-orange-500/20 rounded-xl rotate-45" />
                    <div className="absolute inset-0 border border-orange-500/10 rounded-xl" />
                    
                    {/* Tiny Lissajous diagnostic curve */}
                    <svg width="60%" height="60%" viewBox="0 0 40 40" className="opacity-60">
                        <path 
                            d={`M 20 20 ${Array.from({ length: 20 }, (_, i) => {
                                const t = time * 5 + (i * 0.5);
                                const x = 20 + Math.sin(t * targetMousePos.x * 10) * 15;
                                const y = 20 + Math.cos(t * targetMousePos.y * 10) * 15;
                                return `L ${x} ${y}`;
                            }).join(' ')}`}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="1"
                        />
                    </svg>
                    
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_10px_orange]" />
                    
                    <AnimatePresence>
                        {isFrozen && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                className="absolute -top-12 whitespace-nowrap bg-orange-500 text-white px-3 py-1 rounded-full shadow-2xl"
                            >
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em]`}>
                                    Moment Captured
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Elite Upgrade: System Log Ticker */}
                <div className={`absolute bottom-4 left-10 flex items-center gap-4 transition-opacity duration-1000 ${isIdle ? 'opacity-20' : 'opacity-100'}`}>
                    <Terminal size={12} className={accentColor} />
                    <AnimatePresence mode="wait">
                        <motion.span 
                            key={logIndex}
                            initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }}
                            className={`text-[9px] font-mono uppercase font-black tracking-widest ${subTextColor}`}
                        >
                            {LOG_MESSAGES[logIndex]}
                        </motion.span>
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {isIdle && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="absolute top-1/2 left-10 -translate-y-1/2 max-w-[150px]"
                        >
                            <p className={`text-[10px] italic leading-relaxed font-bold ${isDarkMode ? 'text-orange-500/40' : 'text-orange-900/40'}`}>
                                Even reality isn't perfectly smooth. Pausing reveals the underlying texture.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-6 group transition-all duration-300">
                <div className="flex items-center gap-3">
                    <Minimize2 size={12} className={textColor} />
                    <div className={`relative h-1.5 w-48 rounded-full overflow-hidden cursor-pointer ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                        <input 
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.01"
                            value={zoom}
                            onChange={(e) => {
                                setZoom(parseFloat(e.target.value));
                                resetIdleTimer();
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <motion.div 
                            className="absolute inset-y-0 left-0 bg-orange-500" 
                            animate={{ width: ((zoom - 0.5) / 2.5) * 100 + '%' }}
                        />
                    </div>
                    <Maximize2 size={12} className={textColor} />
                </div>
                
                <div className="flex items-center gap-2">
                    <Sliders size={12} className={accentColor} />
                    <span className={`text-[9px] font-mono uppercase font-black tracking-tighter ${subTextColor}`}>
                       Scale: <span className={textColor}>{zoom.toFixed(2)}x</span>
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="text-center mt-32 space-y-8 animate-pulse text-orange-500/40">
           <p className="text-[10px] font-mono uppercase tracking-[0.6em] font-black">
              → What happens when we try to capture this?
           </p>
      </div>

      {/* 🚀 THE ARCHITECTURE PREVIEW */}
      <section className="mt-32 space-y-12">
        <header className="text-center space-y-4">
            <h3 className={`text-4xl font-black italic tracking-tighter ${textColor}`}>The <span className={accentColor}>Pipeline</span> of Nature</h3>
            <p className={`text-lg font-medium opacity-60 max-w-2xl mx-auto ${textColor}`}>
                How nature becomes logic. Every step is a transformation of energy into information.
            </p>
        </header>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 py-10">
            {/* Animated Flow Line (Background) */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-orange-500/10 hidden md:block -translate-y-1/2 overflow-hidden">
                <motion.div 
                    animate={{ x: [-200, 1200] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                />
            </div>

            {[
                { id: "nature", icon: <Radio size={24} />, title: "The Sensor", sub: "Voltage", desc: "Captures physical reality." },
                { id: "sampler", icon: <Activity size={24} />, title: "The Sampler", sub: "Time", desc: "Discretizes the timeline." },
                { id: "quantizer", icon: <Minimize2 size={24} />, title: "The Quantizer", sub: "Value", desc: "Maps height to integers." },
                { id: "encoder", icon: <Cpu size={24} />, title: "The Encoder", sub: "Binary", desc: "Final binary mapping." }
            ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center group w-full max-w-[200px]">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
                        className={`w-20 h-20 rounded-[2rem] border mb-6 flex items-center justify-center transition-all duration-500 ${isDarkMode ? 'bg-black border-white/10 group-hover:border-orange-500 shadow-2xl' : 'bg-white border-gray-100 group-hover:border-orange-500 shadow-xl'}`}
                    >
                        <div className={isDarkMode ? 'text-white/40 group-hover:text-orange-500' : 'text-gray-400 group-hover:text-orange-600'}>
                            {step.icon}
                        </div>
                    </motion.div>
                    <div className="text-center space-y-1">
                        <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${accentColor}`}>{step.sub}</span>
                        <h4 className={`text-lg font-black italic tracking-tight ${textColor}`}>{step.title}</h4>
                        <p className={`text-[10px] font-medium opacity-40 leading-relaxed ${textColor}`}>{step.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <div className="mt-32 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: "1. The Snapshot", brief: "We stop time for a fraction of a second.", deep: "Sampling is the process of selecting specific moments to record the signal. If we ignore too much, we lose the curve (Aliasing).", icon: "📸" },
                { title: "2. The Measurement", brief: "Assigning a number to the height.", deep: "Quantization is mapping a continuous value to a fixed 'bin'. This creates a tiny error called 'Quantization Noise'.", icon: "📏" },
                { title: "3. The Code", brief: "Converting that height to Binary.", deep: "Once we have a bin number, we convert it to 101010. This is the only language a processor understands.", icon: "💻" },
                { title: "4. The Reconstruction", brief: "Connecting the dots back to reality.", deep: "A DAC takes our numbers and draws the smooth ramp back. If we sampled correctly, the reconstruction is identical.", icon: "🎨" }
            ].map((item, i) => (
                <ExpandableCard key={i} item={item} isDarkMode={isDarkMode} />
            ))}
        </div>

        <TechnicalAudit 
            isDarkMode={isDarkMode}
            showFullView={true}
            specs={{
                concept: "The Big Idea: Analog signals exist everywhere - sound, light, temperature, pressure. They are continuous waves flowing without any breaks or steps.",
                physical: "Infinite Detail: Between any two points on an analog wave, there are infinitely more points. This infinite precision is what makes analog signals rich - and also what makes them impossible for computers to store directly.",
                formal: "Continuity: A continuous-time signal x(t) is defined for every real t. It has infinite degrees of freedom. Digital systems, by contrast, have finite memory and must reduce infinity to discrete numbers.",
                insight: "The Rainbow Metaphor: Think of analog as a real rainbow with endless shades blending together. Digital is like a box of crayons - you have to pick from a fixed set of options to represent that beauty.",
                advanced: [
                    {
                        title: "Thermodynamic Reality",
                        content: "Even in 'pure' analog systems, nature adds its own noise - thermal agitation of electrons. No signal is truly infinite in resolution; we are always fighting the entropy of the universe."
                    },
                    {
                        title: "Information Theory",
                        content: "Claude Shannon proved that the amount of information in a truly continuous signal is infinite. Digits are our way of compressing that infinity into something we can actually compute."
                    }
                ]
            }}
        />
      </div>
    </div>
  );
};

const ExpandableCard: React.FC<{ item: any; isDarkMode: boolean }> = ({ item, isDarkMode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`cursor-pointer p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col text-left group
                ${isDarkMode ? `bg-white/[0.03] border-white/5` : `bg-white border-gray-100 shadow-sm`} hover:border-orange-500/40`}
        >
            <div className="flex justify-between items-start mb-6">
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">{item.icon}</span>
                <span className={`text-[10px] ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{isExpanded ? '−' : '+'}</span>
            </div>
            <h4 className="text-lg font-black italic mb-3">{item.title}</h4>
            <p className="text-xs font-medium leading-relaxed opacity-50">{item.brief}</p>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: 16 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-orange-500/10 pt-4"
                    >
                        <p className="text-[11px] leading-relaxed italic opacity-80">{item.deep}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
