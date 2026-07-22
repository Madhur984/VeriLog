import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, ChevronRight, ChevronDown, 
  MousePointer2, Binary, Ruler, AlertTriangle, 
  ShieldCheck, Workflow, Signal, Search, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useColorScheme } from '../../../hooks/useColorScheme';

// ── Shared Visual Components (Unified with Module 1 Style) ────────────────

interface WaveProps {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  mouseX?: number;
  mouseY?: number;
  samplingRate?: number;
  mode?: 'analog' | 'sampled' | 'quantized';
}

const AnalogWave: React.FC<WaveProps> = ({ 
  color = '#fb923c', 
  amplitude = 22, 
  frequency = 0.04,
  speed = 0.05,
  mouseX = 0.5,
  mouseY = 0.5
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
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [baseAmp, baseFreq, speed]);

  return (
    <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none">
      <path ref={pathRef} fill="none" stroke={color} strokeWidth="3" style={{ filter: `drop-shadow(0 0 8px ${color}80)` }} />
    </svg>
  );
};

const DigitalWave: React.FC<WaveProps> = ({ color = '#10b981' }) => {
    return (
      <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path d="M0,80 L50,80 L50,20 L100,20 L100,80 L150,80 L150,20 L200,20 L200,80 L250,80 L250,20 L300,20 L300,80 L350,80 L350,20 L400,20" 
          fill="none" stroke={color} strokeWidth="3" style={{ filter: `drop-shadow(0 0 8px ${color}80)` }} />
      </svg>
    );
};


const LocalMouseArea: React.FC<{ render: (x: number, y: number) => React.ReactNode }> = ({ render }) => {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };
  return (
    <div ref={containerRef} className="absolute inset-0 z-10" onMouseMove={handleMouseMove} onMouseLeave={() => setPos({ x: 0.5, y: 0.5 })}>
      {render(pos.x, pos.y)}
    </div>
  );
};

// ── Laboratory Component (Digital Signal Lab) - Obsidian Style ───────────

const DigitalSignalLab: React.FC = () => {
    const [freq, setFreq] = useState(1);
    const [rate, setRate] = useState(12);
    const [bits, setBits] = useState(4);
    const [jitter, setJitter] = useState(0);
    const [t, setT] = useState(0);
    const [showAliasingAlert, setShowAliasingAlert] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(function animate(time) {
            setT(time / 1000);
            requestAnimationFrame(animate);
        });
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        setShowAliasingAlert(rate < 2 * freq * 10);
    }, [freq, rate]);

    const w = 500, h = 200, cy = 100, amp = 60;
    const samples = Array.from({ length: Math.floor(rate) }, (_, i) => {
        const x = (i / (rate - 1)) * w;
        const timeFactor = (x / w) * Math.PI * 2 * freq * 5 + t * 2;
        const jitterOffset = (Math.random() - 0.5) * jitter * 20;
        let rawVal = Math.sin(timeFactor);
        const levels = Math.pow(2, bits);
        const stepSize = 2 / (levels - 1);
        const quantizedVal = Math.round(rawVal / stepSize) * stepSize;
        return { x: x + jitterOffset, y: cy + quantizedVal * amp, isPoint: true };
    });

    return (
        <div className="p-8 rounded-3xl border border-orange-500/10 bg-black/40 space-y-8">
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                    <Workflow className="text-orange-500" size={16} />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500/60">Lab: Signal Workshop v2.1</span>
                </div>
                {showAliasingAlert && (
                    <motion.div animate={{ opacity: [1, 0, 1] }} className="flex items-center gap-2 text-red-500 text-[9px] font-bold">
                        <AlertTriangle size={12} /> ALIASING_SIGNAL_LOSS
                    </motion.div>
                )}
            </div>
            <div className="relative h-[250px] w-full bg-black/60 rounded-2xl border border-white/5 overflow-hidden">
                <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                    <path d={Array.from({length: 100}, (_, i) => {
                        const x = (i/99) * w;
                        const y = cy + amp * Math.sin((x / w) * Math.PI * 2 * freq * 5 + t * 2);
                        return `${i===0?'M':'L'}${x},${y}`;
                    }).join(' ')} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                    <path d={samples.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} fill="none" stroke="#f97316" strokeWidth="2.5" />
                    {samples.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#f97316" />
                    ))}
                </svg>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <LabSlider label="Signal Freq" val={freq} min={0.5} max={5} step={0.1} onChange={setFreq} />
                <LabSlider label="Sample Rate" val={rate} min={4} max={64} step={1} onChange={setRate} />
                <LabSlider label="Bit Precision" val={bits} min={1} max={8} step={1} onChange={setBits} />
                <LabSlider label="System Jitter" val={jitter} min={0} max={0.2} step={0.01} onChange={setJitter} />
            </div>
        </div>
    );
};

const LabSlider: React.FC<{ label: string; val: number; min: number; max: number; step: number; onChange: (v: number) => void }> = ({ label, val, min, max, step, onChange }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-orange-900">{label}</span>
            <span className="text-[10px] font-mono text-orange-500">{val}</span>
        </div>
        <input type="range" min={min} max={max} step={step} value={val} onChange={e => onChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-orange-950 rounded-full appearance-none accent-orange-500 cursor-pointer" />
    </div>
);

// ── Components (Shared Structure with Module 1) ───────────────────────────

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
    <div className="rounded-xl border transition-all duration-300 cursor-pointer"
      style={{ background: bgColor, borderColor: expanded ? `${color}50` : borderColor, boxShadow: expanded ? `0 0 24px ${color}10` : 'none' }}
      onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center gap-4 p-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold ${textColor}`}>{title}</h3>
          <p className={`text-sm mt-0.5 line-clamp-2 ${subTextColor}`}>{layman}</p>
        </div>
        {expanded ? <ChevronDown size={18} style={{ color }} /> : <ChevronRight size={18} style={{ color: isDark ? 'rgba(180,100,30,0.4)' : 'rgba(0,0,0,0.2)' }} />}
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

// ── Main Page Layout ───────────────────────────────────────────────────────

export const Module2Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const [activeSection, setActiveSection] = useState('intro');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const sections = [
    { id: 'intro', label: 'Digital Theory' },
    { id: 'analog-vs-digital', label: 'Nature vs Numbers' },
    { id: 'sampling', label: 'Sampling Flipbooks' },
    { id: 'quantization', label: 'Rounding Steps' },
    { id: 'equation', label: 'The 2x Rule' },
    { id: 'lab', label: 'Lab: Signal Workshop' },
    { id: 'archive', label: 'Research Library' },
    { id: 'noise', label: 'Zero-Loss Storage' },
    { id: 'questions', label: 'Final Check' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const bgColor = isDarkMode ? '#030100' : '#ffffff';
  const sidebarBg = isDarkMode ? '#040200' : '#f9fafb';
  const borderColor = isDarkMode ? 'rgba(124, 45, 18, 0.3)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = isDarkMode ? 'text-orange-50' : 'text-gray-900';

  return (
    <div className="flex h-screen w-full font-sans transition-colors duration-300" style={{ background: bgColor }}>
      
      {/* ── Sidebar (Exact Duplicate of Module 1 Layout) ── */}
      <div className="w-[300px] flex-shrink-0 border-r flex flex-col z-10 overflow-y-auto" style={{ background: sidebarBg, borderColor }}>
        <div className="p-8 border-b" style={{ borderColor }}>
          <h2 className={`text-lg font-bold ${textColor}`}>A/D Theory</h2>
          <p className={`text-[10px] mt-2 font-mono uppercase tracking-widest ${isDarkMode ? 'text-orange-500/60' : 'text-orange-600'}`}>Digital Foundation</p>
        </div>
        <div className="p-8">
          <p className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-6 ${isDarkMode ? 'text-orange-900' : 'text-gray-400'}`}>ON THIS PAGE</p>
          <div className="flex flex-col gap-2">
            {sections.map(s => (
                <button key={s.id} onClick={() => { setActiveSection(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }}
                    className={`block w-full text-left py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeSection === s.id
                      ? (isDarkMode ? 'text-orange-400 bg-orange-950/30 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'text-orange-600 bg-orange-50 border border-orange-200 shadow-sm')
                      : (isDarkMode ? 'text-orange-800 hover:text-orange-400 hover:bg-orange-950/20' : 'text-gray-500 hover:text-orange-600 hover:bg-gray-100')}`}>
                    {s.label}
                </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-8 border-t" style={{ borderColor }}>
            <button onClick={toggleTheme} className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border font-medium transition-all ${isDarkMode ? 'border-orange-900/40 text-orange-400 hover:bg-orange-950/30' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex-1 h-full overflow-y-auto relative scroll-smooth" style={{ background: bgColor }}>
        <nav className="sticky top-0 z-50 px-8 py-5 flex justify-between items-center border-b" style={{ background: isDarkMode ? '#030100' : '#FFFFFF', borderColor }}>
          <div className="flex items-center gap-3">
            <span className={`font-mono font-semibold ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>M02</span>
            <span className={isDarkMode ? 'text-orange-900' : 'text-gray-300'}>·</span>
            <span className={`text-sm ${isDarkMode ? 'text-orange-300/60' : 'text-gray-500'}`}>Exploring the Translation Bridge</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-1 w-32 rounded-full overflow-hidden bg-gray-200 dark:bg-orange-900/20">
                <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${(sections.findIndex(s=>s.id===activeSection)+1)/sections.length*100}%` }}></div>
             </div>
             <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>{Math.round((sections.findIndex(s=>s.id===activeSection)+1)/sections.length*100)}% COMPLETED</span>
          </div>
        </nav>

        <main className={`max-w-4xl mx-auto px-8 py-24 space-y-40 ${isDarkMode ? 'text-orange-100' : 'text-gray-800'}`}>
            
            {/* HERO SECTION */}
            <section id="intro">
                <div className="text-center mb-16">
                    <p className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-6 ${isDarkMode ? 'text-orange-600' : 'text-orange-700'}`}>Level 01 · Signal Conversion</p>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter italic">
                        <span className={isDarkMode ? 'text-orange-500' : 'text-orange-600'}>The</span>{' '}
                        <span className={isDarkMode ? 'text-orange-50' : 'text-gray-900'}>Digital Bridge</span>
                    </h1>
                    <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-orange-300/50' : 'text-gray-500'}`}>
                        “Translation is the art of turning nature into numbers.”
                    </p>
                </div>
                <div className={`rounded-3xl p-8 border mb-12 shadow-2xl transition-all`} style={{ background: isDarkMode ? '#060401' : '#ffffff', borderColor: isDarkMode ? 'white/5' : borderColor }}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                        <span className={`text-xs font-mono uppercase tracking-widest font-bold ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>Live Translation Matrix</span>
                    </div>
                    <div className="h-[200px] flex items-center justify-center relative group overflow-hidden bg-black/40 rounded-2xl">
                        <LocalMouseArea render={(x, y) => (
                            <AnalogWave color="#f97316" mouseX={x} mouseY={y} />
                        )} />
                    </div>
                </div>
                <div className={`rounded-3xl p-10 border relative overflow-hidden`} style={{ background: isDarkMode ? 'rgba(249,115,22,0.03)' : 'rgba(249,115,22,0.05)', borderColor: isDarkMode ? 'rgba(249,115,22,0.2)' : 'rgba(249,115,22,0.3)' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                    <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>The Layman's Definition 📽️</h2>
                    <div className="space-y-6 text-base leading-relaxed">
                        <p>Reality is a continuous ocean of information. Computers are containers of finite capacity. To talk to a machine, we must convert smooth reality into indexed counting.</p>
                        <div className={`p-6 rounded-2xl border-l-4 font-medium ${isDarkMode ? 'bg-orange-950/20 border-orange-500 text-orange-200' : 'bg-orange-50 border-orange-500 text-orange-900'}`}>
                            "Digital systems don't see the whole wave; they see a fast-moving flipbook of data points."
                        </div>
                    </div>
                </div>
            </section>

            {/* NATURE VS NUMBERS */}
            <section id="analog-vs-digital" className="space-y-12">
                <div className="flex flex-col gap-4">
                    <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>Nature <span className="text-orange-500">Vs</span> Numbers</h2>
                    <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-300/60' : 'text-gray-600'}`}>One is a smooth slide; the other is a staircase. Here's how they handle reality.</p>
                </div>
                <div className="overflow-hidden rounded-3xl border" style={{ borderColor }}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={isDarkMode ? 'bg-orange-500/10' : 'bg-gray-100'}>
                                <th className="p-6 text-xs font-mono uppercase tracking-widest text-orange-500">Feature</th>
                                <th className="p-6 text-xs font-mono uppercase tracking-widest text-orange-400">Analog</th>
                                <th className="p-6 text-xs font-mono uppercase tracking-widest text-orange-600">Digital</th>
                            </tr>
                        </thead>
                        <tbody className={isDarkMode ? 'text-orange-100/60' : 'text-gray-600'}>
                            {[
                                { dim: "Nature", a: "Infinite Curves", d: "Indexed Steps" },
                                { dim: "Precision", a: "Varies with physics", d: "Fixed by Bit Depth" },
                                { dim: "Storage", a: "Magnetic/Physical", d: "Virtual / Binary" },
                                { dim: "Noise", a: "Permanent Hiss", d: "Cured by Logic" }
                            ].map((row, i) => (
                                <tr key={i} className="border-t" style={{ borderColor: isDarkMode ? 'white/5' : 'rgba(0,0,0,0.05)' }}>
                                    <td className="p-6 font-bold text-xs uppercase tracking-widest text-white/40">{row.dim}</td>
                                    <td className="p-6 text-sm italic">{row.a}</td>
                                    <td className="p-6 text-sm font-semibold text-orange-500">{row.d}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* SAMPLING & NYQUIST */}
            <section id="sampling" className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>Sampling: The <span className="text-orange-500">Blink</span></h2>
                        <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-300/60' : 'text-gray-600'}`}>
                            Think of a movie camera. It takes 24 photos per second. If you move faster than that, your motion looks like a blur or a "ghost".
                            Sampling is the temporal "Blink" of the digital system-the frequency at which we freeze reality into a snapshot.
                        </p>
                        
                        <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
                             <div className="flex items-center gap-3 mb-4">
                                <Ruler className="text-orange-500" size={18} />
                                <span className="text-xs font-mono uppercase tracking-[0.2em] font-black">The Nyquist-Shannon Rule</span>
                             </div>
                             <div className="flex justify-center py-6">
                                <span className={`text-3xl font-serif italic ${isDarkMode ? 'text-orange-50' : 'text-gray-900'}`}>
                                    f<sub>s</sub> &gt; 2 · f<sub>max</sub>
                                </span>
                             </div>
                             <p className="text-[11px] leading-relaxed opacity-60 text-center">
                                To capture a wave perfectly, you must blink at least <strong>twice</strong> as fast as the wave's highest peak.
                             </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <ConceptCard isDark={isDarkMode} icon={<MousePointer2 size={18} color="#f97316"/>} color="#f97316" title="Sampling Rate" layman="How fast we blink." technical="Sampling Frequency (Fs) measured in Hertz (Hz). Higher rates capture finer time details." example="CDs blink 44,100 times per second." />
                        <ConceptCard isDark={isDarkMode} icon={<Signal size={18} color="#ea580c"/>} color="#ea580c" title="Aliasing 'Ghosts'" layman="The Optical Illusion." technical="When Fs < 2f, high frequencies 'fold' back into the audible range as distortion." example="Car wheels looking like they spin backwards on film." />
                    </div>
                </div>
            </section>

            {/* EQUATION DEEP DIVE */}
            <section id="equation" className="space-y-12">
                <div className="flex flex-col gap-4">
                    <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>Scaling the <span className="text-orange-500">Peak</span></h2>
                    <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-300/60' : 'text-gray-600'}`}>
                        The math is simple, but the consequences are absolute. If you fail the 2x rule, reality "Aliases"-it creates artifacts that weren't there in the original signal.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "The Input (f-max)", val: "20 kHz", note: "The highest sound a human can hear." },
                        { title: "The Guard Band", val: "+10%", note: "Extra space to prevent edge distortion." },
                        { title: "Standard Fs", val: "44.1 kHz", note: "The industry standard for perfect capture." }
                    ].map((item, i) => (
                        <div key={i} className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                            <span className="text-[10px] font-mono uppercase text-orange-500/60 mb-2 block">{item.title}</span>
                            <div className="text-2xl font-black mb-1 italic">{item.val}</div>
                            <p className="text-[10px] opacity-40 leading-relaxed">{item.note}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* QUANTIZATION */}
            <section id="quantization" className="space-y-12">
                <div className="flex flex-col gap-4">
                    <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>Quantization: The <span className="text-orange-500">Ruler</span></h2>
                    <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-300/60' : 'text-gray-600'}`}>
                        If sampling is <strong>when</strong> we look, quantization is <strong>what</strong> we see. It’s the precision of our measurement-how many "rungs" are on our ladder of volume.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-10 rounded-3xl border border-white/5 bg-black/20 flex flex-col gap-6">
                        <Binary size={34} className="text-orange-500" />
                        <h3 className="font-bold">The Bit Paradox</h3>
                        <p className="text-xs opacity-60 leading-relaxed">
                            A computer can't store "about 5 volts". It must choose between 5.0 and 5.1. 
                            <strong>Bit Depth</strong> determines the number of choices. 
                            Increasing bits doesn't make the sound "louder"-it makes the quiet parts "cleaner".
                        </p>
                        <div className="mt-4 flex gap-4">
                            <div className="flex-1 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                                <span className="block text-xs font-bold text-orange-500">16-Bit</span>
                                <span className="text-[9px] opacity-50">65,536 Steps</span>
                            </div>
                            <div className="flex-1 p-4 rounded-xl bg-orange-500/20 border border-orange-500/40 text-center shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                <span className="block text-xs font-bold text-orange-500 underline decoration-orange-500/40">24-Bit</span>
                                <span className="text-[9px] opacity-50">16.7 Million Steps</span>
                            </div>
                        </div>
                     </div>
                     <div className="p-10 rounded-3xl bg-orange-500 text-black space-y-4 shadow-xl">
                        <h3 className="text-xl font-black uppercase italic">Quantization Noise</h3>
                        <p className="text-xs font-bold leading-relaxed opacity-80">
                            When we round a measurement, we lose the "in-between" data. This lost data doesn't just disappear-it shows up as a grainy hiss called Quantization Noise.
                        </p>
                        <div className="p-4 bg-black rounded-xl font-mono text-[9px] space-y-1">
                            <div className="flex justify-between"><span>Micro-Reality:</span><span className="text-orange-500">0.50032v</span></div>
                            <div className="flex justify-between text-white/30"><span>Digital Grid:</span><span>0.50000v</span></div>
                            <div className="border-t border-white/10 mt-2 flex justify-between text-red-500"><span>Error (Noise):</span><span>0.00032v</span></div>
                        </div>
                     </div>
                </div>
            </section>


            {/* THE LAB */}
            <section id="lab" className="space-y-12">
                 <div className="flex flex-col gap-4 text-center items-center">
                    <h2 className={`text-4xl font-extrabold italic ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}><span className="text-orange-500">The</span> Signal Workshop</h2>
                    <div className="h-[2px] w-24 bg-orange-500/20" />
                 </div>
                 <DigitalSignalLab />
            </section>


            {/* RESEARCH ARCHIVE */}
            <section id="archive" className="space-y-12">
                <div className="flex items-center gap-4 text-orange-500/40">
                    <Search size={22} />
                    <h3 className="text-2xl font-black uppercase tracking-widest italic">Research Archive</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { title: "Dynamic Range", color: "#fbbf24", desc: "Every bit added improves SNR by ~6.02dB. 16-bit audio has 96dB of range." },
                        { title: "Reconstruction", color: "#60a5fa", desc: "The 'Smoothing Filter' that turns digital pulses back into beautiful music." },
                        { title: "Clock Jitter", color: "#a78bfa", desc: "Tiny timing errors that blur the signal's focus. The 'Shaky Camera' of ADCs." },
                        { title: "PCM Standards", color: "#f472b6", desc: "Pulse Code Modulation. The worldwide standard for storing digital audio." }
                    ].map((t, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all">
                            <h4 className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: t.color }}>{t.title}</h4>
                            <p className="text-[10px] opacity-40 leading-relaxed">{t.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* NOISE RESISTANCE */}
            <section id="noise" className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                <div className="space-y-8">
                     <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-orange-100' : 'text-gray-900'}`}>Why <span className="text-orange-500">Digital</span> Wins</h2>
                     <p className={`text-base leading-relaxed ${isDarkMode ? 'text-orange-300/60' : 'text-gray-600'}`}>
                        Analog is like whispering a secret through 10 people-it gets distorted. 
                        Digital is like holding up cards with "1" or "0". Even if the cards are a bit dirty, you can still see the numbers.
                     </p>
                     <div className="flex gap-4">
                        <Tag icon={<ShieldCheck size={14}/>} label="Zero Loss Copy" />
                        <Tag icon={<Zap size={14}/>} label="Bit Perfect" />
                     </div>
                </div>
                <div className="p-12 rounded-[3rem] bg-black/40 border border-white/5">
                    <DigitalWave color="#10b981" />
                </div>
            </section>

            {/* KNOWLEDGE CHECK */}
            <section id="questions" className="space-y-24 pb-48">
                <div className="h-[1px] w-full bg-orange-950/20" />
                <div className="p-16 rounded-[4rem] border border-orange-500/10 bg-orange-950/5 relative overflow-hidden text-center max-w-2xl mx-auto">
                    <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
                    <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-orange-500/60 mb-6 font-black">Knowledge Gate 02.B</h4>
                    <p className={`text-2xl font-bold mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>If you sample a 10Hz signal at exactly 5Hz, what happens?</p>
                    <div className="flex flex-col gap-4">
                         {[
                            "The signal is captured perfectly", 
                            "The signal 'Ghosts' into a lower frequency (Aliasing)", 
                            "The signal becomes 20Hz", 
                            "The system explodes"
                        ].map((q, i) => (
                            <button key={i} onClick={()=>setSelectedOption(i)} 
                                className={`p-6 rounded-3xl border text-sm font-bold transition-all duration-300 ${selectedOption === i ? 'bg-orange-500 border-orange-500 text-black shadow-[0_0_30px_rgba(249,115,22,0.3)]' : 'border-white/5 bg-white/[0.02] text-white/40 hover:bg-white/5'}`}>
                                {q}
                            </button>
                         ))}
                    </div>
                </div>
            </section>

        </main>
      </div>
    </div>
  );
};

const Tag = ({ icon, label }: any) => (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/[0.02]">
        {icon} {label}
    </div>
);
