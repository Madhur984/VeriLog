import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, 
  Square, 
  Sliders, 
  Thermometer, 
  Activity, 
  Music, 
  Lightbulb, 
  Volume2, 
  Camera, 
  Heart, 
  Car, 
  Wifi, 
  Tv, 
  Gamepad2, 
  Home, 
  Zap,
  ArrowRight,
  CheckCircle,
  XCircle,
  Cpu,
  Binary,
  AlertTriangle,
  Lock,
  Search,
  RefreshCw,
  Dna,
  Terminal,
  Skull,
  Watch,
  Disc,
  Smartphone,
  MousePointer2,
  Gauge,
  Crosshair,
  Radio,
  BookOpen,
  Scale,
  ChevronRight,
  Info,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";
import { GlobalSignalState } from "../types";
import { SignalEngine } from "../SignalEngine";

// ----------------------------------------------------------------------
// DATA: ELITE EXPERIENCE GALLERY
// ----------------------------------------------------------------------

export const DAILY_GALLERY = [
    {
        title: "Medical Vitality",
        analog: "Heart voltage fluxes (ECG) represent the raw potential of cellular life. Analog-pure detection allows for zero-latency capture.",
        digital: "12-bit medical-grade ADC quantization ensures that micro-volts are mapped to logic levels that portable diagnostics can parse.",
        icon: <Heart size={20} />,
        theme: "digital",
        image: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=400",
        depth: "In medical ADCs, bits = lives. Lower resolution could miss a subtle arrhythmia. Higher bit-depth captures the slope of the QRS complex with absolute fidelity."
    },
    {
        title: "Satellite Uplink",
        analog: "Electromagnetic radiation traveling through the vacuum of space. Susceptible to solar interference.",
        digital: "Error-correcting binary protocols ensure that cosmic noise doesn't corrupt the mission-critical packet structure.",
        icon: <Wifi size={20} />,
        theme: "digital",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400",
        depth: "Deep space communication uses massive ADCs to dig signals out of the noise floor. Without digitization, data would be lost to the inverse-square law."
    },
    {
        title: "Chronos Flow",
        analog: "Mechanical escapement ticking in circular harmony. Time as a continuous-time stream.",
        digital: "Quartz oscillations counted by logic gates. Time as a finite sequence of discrete events.",
        icon: <Watch size={20} />,
        theme: "analog",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400",
        depth: "In analog clocks, the gears never stop moving. In digital clocks, the crystal oscillates 32,768 times per second. We count these pulses to 'sample' time itself."
    }
];

// ----------------------------------------------------------------------
// LABORATORY INSTRUMENTATION (v8 - DEEP DIVE EDITION)
// ----------------------------------------------------------------------

export const KineticText: React.FC<{ text: string }> = ({ text }) => {
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
        }, 20);
        return () => clearInterval(interval);
    }, [text]);

    return <span className="font-mono">{display}</span>;
};

/**
 * InsightPanel
 * Provides optional depth without increasing task difficulty.
 */
export const InsightPanel: React.FC<{ title: string; content: string; career?: string }> = ({ title, content, career }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`transition-all duration-700 rounded-[3rem] overflow-hidden ${isOpen ? 'bg-orange-500/10 border border-orange-500/20 p-10' : 'bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-6'}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-all ${isOpen ? 'bg-orange-500 text-black' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/40'}`}>
                        <BookOpen size={16} />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/20">Optional // Deep_Dive</span>
                        <span className={`text-[13px] font-black uppercase tracking-tighter transition-colors ${isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{title}</span>
                    </div>
                </div>
                <div className={`transition-transform duration-500 ${isOpen ? 'rotate-90 text-orange-500' : 'text-slate-400 dark:text-white/10'}`}>
                    <ChevronRight size={20} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-8 space-y-6">
                            <p className="text-sm font-medium leading-relaxed italic text-slate-600 dark:text-white/60">{content}</p>
                            {career && (
                                <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-white/5">
                                    <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-[8px] font-black text-[#00D4FF] uppercase tracking-widest">Career_Path</div>
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-white/30 italic">{career}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ComparisonConsole: React.FC = () => {
    const rows = [
        { feat: "Nature", analog: "Continuous", digital: "Discrete", color: "#f97316" },
        { feat: "Values", analog: "Infinite", digital: "Finite (2 for Binary)", color: "#00D4FF" },
        { feat: "Noise", analog: "Poor (Cumulative)", digital: "Excellent (Immune)", color: "#EF4444" },
        { feat: "Storage", analog: "Waveform (Tape/Vinyl)", digital: "Bits (Memory/SSD)", color: "#A855F7" },
        { feat: "Processing", analog: "Complex (Op-Amps)", digital: "Simple (Logic Gates)", color: "#22C55E" }
    ];

    return (
        <div className="w-full bg-[#0A0C10] border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl p-12 space-y-10">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-white/5 rounded-2xl text-white/40">
                    <Scale size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Head-to-Head // Comparison</span>
                    <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Domain Arbitrage</h3>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                    <span>Feature</span>
                    <span>Analog Domain</span>
                    <span>Digital Domain</span>
                </div>
                {rows.map((r, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        key={r.feat} 
                        className="grid grid-cols-3 px-8 py-6 bg-white/[0.02] border border-white/[0.03] rounded-3xl hover:border-white/10 transition-all group"
                    >
                        <span className="text-[11px] font-black uppercase text-white/40 group-hover:text-white transition-colors">{r.feat}</span>
                        <span className="text-sm font-bold italic text-white/60" style={{ color: r.color + '88' }}>{r.analog}</span>
                        <span className="text-sm font-bold italic text-white" style={{ color: r.color }}>{r.digital}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export const InteractiveInstrument: React.FC<{
  state: GlobalSignalState;
  onUpdate: (patch: Partial<GlobalSignalState>) => void;
  time: number;
  mapping: {
      x: { label: string; key: keyof GlobalSignalState; min: number; max: number; unit: string };
      y: { label: string; key: keyof GlobalSignalState; min: number; max: number; unit: string };
  };
}> = ({ state, onUpdate, time, mapping }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const { analogPoints, reconstructedPoints, metrics } = SignalEngine(state, time, 800, 300);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    setCursor({ x: xPct, y: yPct });

    const xVal = Math.floor(mapping.x.min + xPct * (mapping.x.max - mapping.x.min));
    const yVal = Math.floor(mapping.y.min + (1 - yPct) * (mapping.y.max - mapping.y.min));
    
    onUpdate({ 
        [mapping.x.key]: xVal,
        [mapping.y.key]: yVal 
    } as any);
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = canvas.width = canvas.clientWidth; const H = canvas.height = canvas.clientHeight;

    ctx.clearRect(0, 0, W, H);
    
    // Grid (Industrial Style with Parallax)
    const parallaxX = (cursor.x - 0.5) * 40;
    const parallaxY = (cursor.y - 0.5) * 40;
    
    ctx.strokeStyle = "rgba(0, 212, 255, 0.05)"; ctx.lineWidth = 1;
    for (let x = -40; x < W + 40; x += 40) { 
        ctx.beginPath(); 
        ctx.moveTo(x + parallaxX, 0); 
        ctx.lineTo(x + parallaxX, H); 
        ctx.stroke(); 
    }
    for (let y = -40; y < H + 40; y += 40) { 
        ctx.beginPath(); 
        ctx.moveTo(0, y + parallaxY); 
        ctx.lineTo(W, y + parallaxY); 
        ctx.stroke(); 
    }

    // Baseline & Saturation Lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(0, H/4); ctx.lineTo(W, H/4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 3*H/4); ctx.lineTo(W, 3*H/4); ctx.stroke();
    ctx.setLineDash([]);

    // Error Area (Entropy)
    ctx.fillStyle = "rgba(239, 68, 68, 0.05)"; ctx.beginPath();
    reconstructedPoints.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    for (let i = analogPoints.length - 1; i >= 0; i--) { ctx.lineTo(analogPoints[i].x, analogPoints[i].y); }
    ctx.closePath(); ctx.fill();

    // Analog Wave (Reference)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"; ctx.setLineDash([10, 5]); ctx.beginPath();
    analogPoints.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }); ctx.stroke();
    ctx.setLineDash([]);

    // Digital Trace (Active)
    const activeColor = metrics.fidelity > 90 ? "#22C55E" : (metrics.aliasing ? "#EF4444" : "#00D4FF");
    ctx.strokeStyle = activeColor; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); reconstructedPoints.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }); ctx.stroke();
    
    // Bloom
    ctx.globalAlpha = 0.3; ctx.lineWidth = 12; ctx.filter = "blur(12px)"; ctx.stroke();
    ctx.globalAlpha = 1.0; ctx.filter = "none";

    // Dynamic Physics Labels
    ctx.font = '8px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillText('SATURATION_THRESHOLD_MAX', 20, H/4 - 10);
    ctx.fillText('SATURATION_THRESHOLD_MIN', 20, 3*H/4 + 20);
    ctx.fillText('REF_GROUND_ZERO', 20, H/2 - 10);
  }, [state, time, reconstructedPoints, analogPoints, metrics]);

  return (
    <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[550px] rounded-[5rem] bg-[#0A0C10] border border-white/5 overflow-hidden group cursor-none shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Background Decals */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 border border-white/[0.02] rounded-full pointer-events-none" />

      {/* Kinetic Crosshair */}
      <motion.div 
        animate={{ x: cursor.x * 100 + '%', y: cursor.y * 100 + '%' }}
        className="absolute top-0 left-0 w-20 h-20 -ml-10 -mt-10 pointer-events-none z-50 flex items-center justify-center"
      >
        <div className="absolute inset-0 border border-[#00D4FF]/20 rounded-full animate-[spin_10s_linear_infinite]" />
        <div className="absolute w-[150%] h-px bg-[#00D4FF]/20" />
        <div className="absolute h-[150%] w-px bg-[#00D4FF]/20" />
        <div className="absolute w-4 h-4 border-2 border-[#00D4FF] rounded-sm" />
        <MousePointer2 size={16} className="text-[#00D4FF] drop-shadow-lg" />
      </motion.div>

      {/* Industrial Axis Labels */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">EXT_COORD_X // {mapping.x.label}</div>
          <div className="text-4xl font-black italic text-white font-mono tracking-tighter tabular-nums">{state[mapping.x.key] as any}<span className="text-xs ml-1 opacity-20 uppercase">{mapping.x.unit}</span></div>
      </div>

      <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none rotate-[-90deg]">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">EXT_COORD_Y // {mapping.y.label}</div>
          <div className="text-4xl font-black italic text-white font-mono tracking-tighter tabular-nums">{state[mapping.y.key] as any}<span className="text-xs ml-1 opacity-20 uppercase">{mapping.y.unit}</span></div>
      </div>

      {/* Real-time Oscilloscope HUD */}
      <div className="absolute top-12 right-12 text-right pointer-events-none space-y-2">
          <span className="text-[8px] font-mono text-[#00D4FF]/40 uppercase tracking-widest block mb-2">Internal_Logic_Scan</span>
          <div className="flex gap-2 justify-end">
              {Array.from({length: 8}).map((_, i) => (
                  <motion.div 
                    key={i} animate={{ height: [10, 25, 12, 18, 10] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-[#00D4FF]/20 rounded-full"
                  />
              ))}
          </div>
      </div>
      
      <div className="absolute top-12 left-12 flex items-center gap-4">
          <div className="p-3 bg-[#00D4FF]/10 rounded-2xl border border-[#00D4FF]/20">
              <Activity size={20} className="text-[#00D4FF] animate-pulse" />
          </div>
          <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Inst_ID // RX-2025</span>
              <span className="text-[9px] font-mono text-[#00D4FF]"><KineticText text="PROBE_SYNC_ACTIVE" /></span>
          </div>
      </div>
    </div>
  );
};

export const LogicReadout: React.FC<{ metrics: any }> = ({ metrics }) => (
    <div className="p-10 rounded-[4rem] bg-[#0A0C10] border border-white/5 space-y-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #00D4FF 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
        <div className="flex justify-between items-center relative z-10">
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.4em]">Internal_State // Logic_Stream</span>
                <span className="text-[9px] font-mono text-[#00D4FF] uppercase tracking-widest">Live_Decomposition</span>
            </div>
            <div className="p-3 bg-[#00D4FF]/10 rounded-xl border border-[#00D4FF]/20">
                <Terminal size={16} className="text-[#00D4FF]" />
            </div>
        </div>
        
        <div className="flex flex-wrap gap-2 relative z-10">
            {metrics.binaryState?.split('').map((bit: string, i: number) => (
                <motion.div 
                    key={i} 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-10 h-14 rounded-xl flex items-center justify-center font-mono text-xl font-black transition-all ${bit === '1' ? 'bg-[#00D4FF] text-black shadow-[0_0_20px_rgba(0,212,255,0.4)]' : 'bg-white/5 text-white/20 border border-white/5'}`}
                >
                    {bit}
                </motion.div>
            ))}
            {!metrics.binaryState && <span className="text-white/20 font-mono text-xs italic italic">Awaiting sync...</span>}
        </div>
        
        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-white/20 uppercase tracking-widest relative z-10">
            <span>Encoding: Offset_Binary</span>
            <span>Bit_Depth: {metrics.enob || 0}_Bits</span>
        </div>
    </div>
);

export const EngineeringHUD: React.FC<{ metrics: any }> = ({ metrics }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "THD+N", val: metrics.snr.toFixed(2), unit: "dB", icon: <Radio size={14}/>, tech: "Total Harmonic Distortion + Noise. Measures how much 'pure' analog voltage is lost to internal processing friction." },
        { label: "PRECISION", val: metrics.enob, unit: "Bits", icon: <Binary size={14}/>, tech: "Effective Number of Bits. Even if you have 24 bits, noise might reduce your actual usable precision to 18 bits." },
        { label: "COHERENCE", val: (100 - metrics.dataLoss).toFixed(1), unit: "%", icon: <Gauge size={14}/>, tech: "Signal Coherence. Measures the correlation between the original physical flux and the reconstructed digital approximation." },
        { label: "FIDELITY", val: metrics.fidelity.toFixed(1), unit: "%", color: metrics.fidelity > 85 ? "#22C55E" : "#EF4444", icon: <Crosshair size={14}/>, tech: "Total Fidelity. A normalized index of signal reproduction quality. 100% means zero mathematical error." }
      ].map((m, i) => (
        <div key={i} className="group relative bg-[#0A0C10] border border-white/5 p-10 rounded-[3rem] space-y-4 shadow-xl hover:border-[#00D4FF]/20 transition-all overflow-hidden">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-white/20">{m.icon}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/20 font-mono">{m.label}</div>
          </div>
          <div className="text-5xl font-black italic font-mono tracking-tighter" style={{ color: m.color || "#00D4FF" }}>{m.val}<span className="text-[12px] ml-2 opacity-20 font-sans tracking-normal">{m.unit}</span></div>
          
          {/* Depth Layer: Auto-revealing Tech Glossery */}
          <div className="absolute inset-0 bg-black/95 p-8 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#00D4FF]/40 rounded-[3rem]">
              <span className="text-[8px] font-black uppercase text-[#00D4FF] tracking-[0.4em] mb-4">Metric_Specs</span>
              <p className="text-[11px] font-medium leading-relaxed italic text-white/60">{m.tech}</p>
          </div>
        </div>
      ))}
    </div>
);

export const DailyGallery: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {DAILY_GALLERY.map((item, i) => (
            <motion.div 
                key={i} whileHover={{ scale: 1.02, y: -10 }}
                className="group relative rounded-[4rem] bg-[#0A0C10] border border-white/5 transition-all overflow-hidden"
            >
                <div className="aspect-square relative overflow-hidden">
                    <img loading="lazy" decoding="async" src={item.image} alt={item.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] to-transparent" />
                    
                    {/* Depth Overlay */}
                    <div className="absolute inset-0 p-12 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 text-center">
                        <div className="text-[10px] font-black uppercase text-[#00D4FF] tracking-[0.5em] mb-6">Expert_Perspective</div>
                        <p className="text-sm font-medium italic leading-relaxed text-white/60 px-4">{item.depth}</p>
                    </div>
                </div>
                <div className="p-12 space-y-8 absolute bottom-0 left-0 right-0 pointer-events-none group-hover:opacity-20 transition-opacity">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-3xl ${item.theme === 'analog' ? 'bg-[#f97316]/20 text-[#f97316]' : 'bg-[#00D4FF]/20 text-[#00D4FF]'}`}>
                            {item.icon}
                        </div>
                        <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter">{item.title}</h4>
                    </div>
                </div>
            </motion.div>
        ))}
    </div>
);

export const CircuitBench: React.FC<{
  state: GlobalSignalState;
  onUpdate: (patch: Partial<GlobalSignalState>) => void;
}> = ({ state, onUpdate }) => {
  const brightness = state.amplitude / 100;
  return (
    <div className="flex flex-col gap-10 p-12 rounded-[5rem] bg-[#0A0C10] border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center relative z-20">
            <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#f97316] animate-pulse shadow-[0_0_15px_#f97316]" />
                <div className="flex flex-col">
                    <span className="text-[11px] font-black italic text-white uppercase tracking-tighter">Physical_Origin</span>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Hardware_Sync_01</span>
                </div>
            </div>
            <div className="text-6xl font-black italic text-white font-mono tabular-nums leading-none">{state.amplitude}<span className="text-lg opacity-20">%</span></div>
        </div>

        <div className="relative aspect-video rounded-[4rem] bg-white/[0.02] p-12 flex items-center justify-center overflow-hidden border border-white/[0.03]">
             <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
             <svg viewBox="0 0 200 100" className="w-full h-full relative z-10 drop-shadow-[0_0_50px_rgba(249,115,22,0.3)]">
                {/* Circuit Traces reacting to amplitude */}
                <motion.path 
                    d="M0 50 L80 50 M120 50 L200 50" 
                    stroke="#f97316" strokeWidth="0.5" opacity="0.2"
                />
                <motion.circle r={15 + brightness * 35} cx="100" cy="50" fill="url(#ringGlow)" />
                <motion.circle r={15 + brightness * 25} cx="100" cy="50" fill="transparent" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle r="6" cx="100" cy="50" fill="#f97316" className="animate-pulse" />
             </svg>

             {/* Dynamic Annotations for Physics Depth */}
             <div className="absolute top-10 left-10 pointer-events-none space-y-2 opacity-40">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f97316] rounded-full" />
                    <span className="text-[8px] font-mono text-white/60">SOURCE_ENTROPY: 0.02%</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#f97316] rounded-full" />
                    <span className="text-[8px] font-mono text-white/60">CONTINUOUS_FLUX: ACTIVE</span>
                </div>
             </div>
        </div>

        <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5">
            <p className="text-[11px] font-medium italic text-white/30 leading-loose">
                "Analog is reality. It is the unbroken flow of energy before the first threshold is crossed. Measurements are Continuous-Time and Continuous-Amplitude, preserving infinite nuance."
            </p>
        </div>

        {/* Tactical Interaction Overlay */}
        <div 
            className="absolute inset-0 z-30 cursor-ns-resize group"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const yPct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                onUpdate({ amplitude: Math.floor((1 - yPct) * 100) });
            }}
        />
    </div>
  );
};

export const ConceptGate: React.FC<{
  title: string;
  onUnlock: () => void;
  isLocked: boolean;
}> = ({ title, onUnlock, isLocked }) => {
  if (!isLocked) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center p-20 bg-bg-void rounded-[5rem]">
      <div className="text-center space-y-16 max-w-xl">
        <div className="relative mx-auto w-32 h-32">
            <Activity size={100} className="text-orange-500 absolute inset-0 animate-ping opacity-20" />
            <Activity size={100} className="text-orange-500 relative z-10" />
        </div>
        <div className="space-y-6">
          <h3 className="text-6xl font-black italic text-white uppercase tracking-tighter tracking-[-0.05em]"><KineticText text={title} /></h3>
          <p className="text-white/40 text-lg font-medium leading-relaxed italic">The cursor is your probe. The screen is your reality. Initialize the interface to synchronize with the analog source.</p>
        </div>
        <button onClick={onUnlock} className="w-full py-10 bg-orange-500 text-black rounded-[3rem] font-black uppercase tracking-[0.5em] text-sm hover:bg-white hover:scale-105 transition-all shadow-2xl">Initialize_System_Sync</button>
      </div>
    </motion.div>
  );
};

export const SpectrumAnalyzer: React.FC<{ state: GlobalSignalState }> = ({ state }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const W = canvas.width = 400; const H = canvas.height = 250;

        const draw = () => {
            ctx.fillStyle = '#0A0C10'; ctx.fillRect(0, 0, W, H);
            
            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
            for(let i=0; i<W; i+=40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
            for(let i=0; i<H; i+=40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }

            const fundamental = state.frequency;
            const sampling = state.sampleRate;
            const isAliasing = sampling / 2 < fundamental;

            // Fundamental Peak
            const fx = (fundamental / 20) * W;
            const fH = 180;
            ctx.shadowBlur = 20; ctx.shadowColor = '#00D4FF';
            ctx.fillStyle = '#00D4FF'; ctx.fillRect(fx - 1, H - fH, 3, fH);

            // Aliasing Mirror (Ghost)
            if (isAliasing) {
                const aliasFreq = Math.abs(fundamental - (Math.round(fundamental/sampling)*sampling));
                const ax = (aliasFreq / 20) * W;
                const aH = 140;
                ctx.shadowBlur = 30; ctx.shadowColor = '#EF4444';
                ctx.fillStyle = '#EF4444'; ctx.fillRect(ax - 2, H - aH, 4, aH);
                
                ctx.font = '900 10px font-mono'; ctx.fillStyle = '#EF4444';
                ctx.fillText('ALIAS_GHOST', ax + 10, H - aH + 20);
            }

            // Depth Layer: Spectrum Labels
            ctx.font = '7px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillText('POWER_SPECTRAL_DENSITY', 10, 20);
            ctx.fillText('NOISE_FLOOR_LVL: -96dB', 10, H - 10);

            ctx.shadowBlur = 0;
            requestAnimationFrame(draw);
        };
        const raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, [state]);

    return (
        <div className="p-10 rounded-[4rem] bg-[#0A0C10] border border-white/5 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Freq_Domain // Analyser</span>
                    <span className="text-[9px] font-mono text-[#00D4FF]"><KineticText text="FFT_SCAN_ACTIVE" /></span>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black italic uppercase tracking-widest ${state.sampleRate / 2 < state.frequency ? 'bg-red-500/10 text-red-500 border border-red-500/40' : 'bg-green-500/10 text-green-500 border border-green-500/40'}`}>
                    {state.sampleRate / 2 < state.frequency ? 'Aliasing_Detected' : 'Nyquist_Lock'}
                </div>
            </div>
            <canvas ref={canvasRef} className="w-full h-[200px] rounded-[2.5rem] bg-black/40" />
            <div className="flex justify-between items-center px-4">
                 <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-white/20">0 Hz</span>
                    <div className="w-px h-2 bg-white/20 mt-1" />
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-white/40">Nyquist ({state.sampleRate / 2}Hz)</span>
                    <div className="w-px h-4 bg-[#EF4444]/40 mt-1" />
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono text-white/20">20 Hz</span>
                    <div className="w-px h-2 bg-white/20 mt-1" />
                 </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// DATA: MASTERY VERIFICATION (v4 ELITE)
// ----------------------------------------------------------------------

interface Question {
    id: number;
    text: string;
    options: string[];
    correct: number;
    insight: string;
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "You sample a 10 kHz sine wave at 16 kHz. What do you see after reconstruction?",
        options: [
            "A perfect 10 kHz reproduction", 
            "Absolute silence (infinite error)", 
            "A 6 kHz alias 'ghost' frequency", 
            "A 26 kHz harmonic product"
        ],
        correct: 2,
        insight: "f_alias = |f_in - kFs|. Here, |10 - 16| = 6 kHz. Because 16 kHz is below the Nyquist rate (20 kHz), the 10 kHz signal 'folds' into the baseband."
    },
    {
        id: 2,
        text: "Adding one extra bit to your system resolution increases the theoretical SNR by approximately how many dB?",
        options: [
            "1.76 dB", 
            "3.01 dB", 
            "6.02 dB", 
            "20.0 dB"
        ],
        correct: 2,
        insight: "The 6 dB per bit rule: Each bit doubles the possible levels (2^N), which halves the quantization error, leading to a 6.02 dB improvement in dynamic range."
    },
    {
        id: 3,
        text: "Why is TPDF Dither used in professional audio mastering when reducing bit depth?",
        options: [
            "To increase the speed of the DSP processor", 
            "To remove quantization's harmonic distortion", 
            "To filter out frequencies above 20 kHz", 
            "To prevent the signal from clipping at 0 dBFS"
        ],
        correct: 1,
        insight: "Dither decorrelates the error from the signal, replacing harsh harmonic distortion with a benign, constant noise floor. It linearizes the 'staircase'."
    }
];

// ----------------------------------------------------------------------
// COMPONENT: INTERACTIVE QUIZ (v4 ELITE)
// ----------------------------------------------------------------------

export const InteractiveQuiz: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [finished, setFinished] = useState(false);

    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
    const cardBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200';
    const buttonBg = isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 shadow-inner' : 'bg-white border-gray-200 hover:bg-gray-100 shadow-sm';

    const handleNext = () => {
        if (currentIdx < QUESTIONS.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelected(null);
            setShowResult(false);
        } else {
            setFinished(true);
        }
    };

    const handleCheck = (idx: number) => {
        if (showResult) return;
        setSelected(idx);
        setShowResult(true);
    };

    if (finished) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={`p-16 rounded-[4rem] border text-center space-y-10 ${cardBg}`}
            >
                <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="text-green-500" size={40} />
                </div>
                <div className="space-y-4">
                    <h3 className={`text-4xl font-black italic tracking-tighter ${textColor}`}>Mastery Attained</h3>
                    <p className="text-slate-500 dark:text-white/40 text-lg font-medium italic">
                        You have successfully navigated the Digital Bridge. All core concepts are synchronized.
                    </p>
                </div>
                <div className="pt-8 border-t border-slate-200 dark:border-white/5">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-[#00D4FF]">
                        Clearance Level: Elite Engineering
                    </div>
                </div>
            </motion.div>
        );
    }

    const q = QUESTIONS[currentIdx];

    return (
        <div className="flex flex-col gap-12 max-w-6xl mx-auto py-6 text-left">
            <header className="flex items-center gap-8 px-4">
                <div className={`p-5 rounded-3xl border shadow-xl transition-all duration-500 ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 shadow-orange-500/5' : 'bg-orange-50 border-orange-100'}`}>
                    <ShieldAlert className={accentColor} size={28} />
                </div>
                <div className="space-y-2">
                    <h2 className={`text-5xl font-black italic tracking-tighter ${textColor}`}>Challenge <span className={accentColor}>0{currentIdx + 1}</span></h2>
                    <p className={`text-[11px] font-mono uppercase tracking-[0.4em] font-black opacity-30 ${textColor}`}>Mastery Gate Verification</p>
                </div>
            </header>

            <div className={`p-10 md:p-14 rounded-[4rem] border space-y-12 shadow-2xl relative overflow-hidden transition-all duration-700 ${cardBg}`}>
                <div className="absolute top-0 right-0 p-12 select-none pointer-events-none">
                    <span className={`text-[80px] font-black italic ${isDarkMode ? 'text-white/[0.03]' : 'text-black/[0.03]'}`}>
                        {currentIdx + 1}
                    </span>
                </div>

                <div className="space-y-12 relative z-10">
                    <p className={`text-3xl font-black leading-tight pr-14 ${textColor}`}>{q.text}</p>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {q.options.map((opt, i) => {
                            const isCorrect = i === q.correct;
                            const isSelected = i === selected;
                            
                            return (
                                <button 
                                    key={i} disabled={showResult} onClick={() => handleCheck(i)}
                                    className={`
                                        w-full p-8 rounded-[3rem] border text-left transition-all duration-500 flex justify-between items-center group
                                        ${showResult && isCorrect 
                                            ? (isDarkMode ? 'bg-green-500/10 border-green-500 text-white shadow-[0_0_40px_rgba(34,197,94,0.2)]' : 'bg-green-50 border-green-500 text-green-900') 
                                            : showResult && isSelected 
                                            ? (isDarkMode ? 'bg-red-500/10 border-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-red-50 border-red-500 text-red-900') 
                                            : buttonBg}
                                    `}
                                >
                                    <div className="flex flex-col">
                                        <span className={`text-lg font-black tracking-tight ${showResult && !isCorrect && !isSelected ? 'opacity-30' : ''}`}>{opt}</span>
                                        {showResult && isSelected && (
                                            <motion.span 
                                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                                className={`text-[9px] font-black uppercase tracking-widest mt-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                            >
                                                {isCorrect ? 'VERIFIED: CORRECT' : 'AUDIT FAILED: INCORRECT'}
                                            </motion.span>
                                        )}
                                    </div>
                                    {showResult && isCorrect && <CheckCircle2 className="text-green-500" size={24} />}
                                    {showResult && isSelected && !isCorrect && <XCircle className="text-red-500" size={24} />}
                                    {!showResult && <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-orange-500" size={20} />}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {showResult && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                className={`p-12 rounded-[3.5rem] border space-y-6 shadow-inner relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}
                            >
                                <div className={`p-3 rounded-xl inline-flex border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                                    <Cpu size={14} className={accentColor} />
                                </div>
                                <div className="space-y-4">
                                    <span className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black ${accentColor}`}>Engineer's Logic Audit</span>
                                    <p className={`text-lg leading-relaxed font-medium italic opacity-70 ${textColor}`}>
                                        <motion.span 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            "{q.insight}"
                                        </motion.span>
                                    </p>
                                </div>
                                
                                <div className="flex justify-end pt-6">
                                    <button 
                                        onClick={handleNext}
                                        className={`flex items-center gap-6 px-12 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[11px] active:scale-95 transition-all duration-500 shadow-2xl ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-black shadow-black/20'}`}
                                    >
                                        {currentIdx < QUESTIONS.length - 1 ? 'Next Validation' : 'Secure Mastery'} <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
