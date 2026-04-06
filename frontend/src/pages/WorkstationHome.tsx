import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { RadialMenu } from '../components/ui/RadialMenu';
import { CircuitBackground } from '../components/ui/CircuitBackground';

const getTourKey = (name: string | null) => `digi_tour_done_${name ?? 'guest'}`;

// Hexagon Component
const HexNode = ({ label, color, x, y, delay, onClick }: { label: string, color: string, x: number | string, y: number | string, delay: number, onClick?: () => void }) => (
    <div className="absolute z-10" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
        <motion.div 
            className="w-24 h-28 flex flex-col items-center justify-center cursor-pointer group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5, type: 'spring' }}
            onClick={onClick}
        >
            {/* Hexagon shape using pure CSS */}
            <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                 <div 
                    className="w-[86.6%] h-full absolute"
                    style={{
                        backgroundColor: `${color}15`,
                        borderLeft: `2px solid ${color}80`,
                        borderRight: `2px solid ${color}80`,
                        boxShadow: `0 0 20px ${color}40 inset, 0 0 10px ${color}40`,
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                    }} 
                 />
                 <div className="absolute top-[-2px] bottom-[-2px] left-[6.7%] right-[6.7%]"
                      style={{
                        borderTop: `2px solid ${color}80`,
                        borderBottom: `2px solid ${color}80`,
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                      }}
                 />
            </div>
            
            {/* Connection node point at the top center */}
            <div className="absolute -top-1 w-2 h-2 rounded-full shadow-lg" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }} />

            <div className="z-10 text-center mt-2 px-1">
                <div className="text-[10px] font-black tracking-widest leading-tight text-white mb-1 drop-shadow-md">{label}</div>
            </div>
        </motion.div>
    </div>
);


// Right Side Chart Bar
const ChartBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex items-center gap-3 w-full">
        <span className="text-[9px] font-mono text-slate-400 w-16 truncate">{label}</span>
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
                className="h-full rounded-full" 
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </div>
        <span className="text-[9px] font-mono text-slate-300 w-6 text-right">{value}%</span>
    </div>
);

// Matrix Matrix Effect
const LEDMatrix = () => {
    return (
        <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[2px] p-2 bg-[#050810] rounded-lg border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
            {Array.from({ length: 12 * 20 }).map((_, i) => {
                const isLit = Math.random() > 0.7;
                const colors = ['bg-sky-400', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'];
                const color = isLit ? colors[Math.floor(Math.random() * colors.length)] : 'bg-slate-800/30';
                const shadow = isLit ? 'shadow-[0_0_5px_currentColor]' : '';
                return <div key={i} className={`w-1.5 h-1.5 rounded-full ${color} ${shadow}`} />;
            })}
        </div>
    );
}

// --- TREE ARCHITECTURE DATA ---
const TREE_NODES = {
  root: { id: "N_ROOT", label: "FUNDAMENTALS", x: "50%", y: 150, color: "#0ea5e9" }, 
  
  bool: { id: "N_BOOL", label: "BOOLEAN ALG", x: "30%", y: 300, color: "#a855f7" }, 
  sys: { id: "N_SYS", label: "NUM SYSTEMS", x: "70%", y: 300, color: "#ef4444" },
  
  gates: { id: "N_GATES", label: "LOGIC GATES", x: "30%", y: 450, color: "#ec4899" },
  kmaps: { id: "N_KMAPS", label: "K-MAPS", x: "15%", y: 550, color: "#eab308" },
  arith: { id: "N_ARITH", label: "ARITHMETIC", x: "45%", y: 550, color: "#3b82f6" },

  codes: { id: "N_CODES", label: "DATA CODES", x: "85%", y: 450, color: "#f97316" },
  
  combo: { id: "N_COMBO", label: "COMBINATIONAL", x: "30%", y: 750, color: "#22c55e" },
  
  latch: { id: "N_LATCH", label: "LATCHES", x: "70%", y: 650, color: "#14b8a6" },
  ff: { id: "N_FF", label: "FLIP-FLOPS", x: "70%", y: 850, color: "#06b6d4" },

  seq: { id: "N_SEQ", label: "SEQUENTIAL", x: "50%", y: 1050, color: "#6366f1" },
  
  fsm: { id: "N_FSM", label: "FSM DESIGN", x: "50%", y: 1250, color: "#d946ef" },

  rtl: { id: "N_RTL", label: "RTL DESIGN", x: "50%", y: 1450, color: "#8b5cf6" },

  verilog: { id: "N_VLOG", label: "VERILOG", x: "30%", y: 1650, color: "#f43f5e" },
  tb: { id: "N_TB", label: "TESTBENCHES", x: "70%", y: 1650, color: "#10b981" },

  soc: { id: "N_SOC", label: "SYS ON CHIP", x: "50%", y: 1850, color: "#0ea5e9" }
};

const TREE_EDGES = [
    { from: TREE_NODES.root, to: TREE_NODES.bool },
    { from: TREE_NODES.root, to: TREE_NODES.sys },
    
    { from: TREE_NODES.bool, to: TREE_NODES.gates },
    { from: TREE_NODES.gates, to: TREE_NODES.kmaps },
    { from: TREE_NODES.gates, to: TREE_NODES.arith },
    { from: TREE_NODES.kmaps, to: TREE_NODES.combo },
    { from: TREE_NODES.arith, to: TREE_NODES.combo },
    
    { from: TREE_NODES.sys, to: TREE_NODES.codes },
    { from: TREE_NODES.sys, to: TREE_NODES.latch },
    { from: TREE_NODES.latch, to: TREE_NODES.ff },
    
    { from: TREE_NODES.combo, to: TREE_NODES.seq },
    { from: TREE_NODES.ff, to: TREE_NODES.seq },
    
    { from: TREE_NODES.seq, to: TREE_NODES.fsm },
    { from: TREE_NODES.fsm, to: TREE_NODES.rtl },
    
    { from: TREE_NODES.rtl, to: TREE_NODES.verilog },
    { from: TREE_NODES.rtl, to: TREE_NODES.tb },
    
    { from: TREE_NODES.verilog, to: TREE_NODES.soc },
    { from: TREE_NODES.tb, to: TREE_NODES.soc },
];

export const WorkstationHome: React.FC = () => {
    const navigate = useNavigate();
    const { firstName, checkStreak } = useGamificationStore();
    const [cmdOpen, setCmdOpen] = useState(false);
    const [tourOpen, setTourOpen] = useState(false);

    useEffect(() => { checkStreak(); }, [checkStreak]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="h-screen flex overflow-hidden bg-[#0A0D14] text-slate-200 selection:bg-sky-500/30 font-sans">
            {/* Ambient Background OS Circuitry */}
            <CircuitBackground />

            {/* PRESERVED: Radial Menu Integration */}
            <RadialMenu />

            {/* Top-Right Floating Profile Card */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="fixed top-8 right-12 z-50 group flex items-center gap-4 p-2 pr-6 rounded-2xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-slate-800/60 transition-all duration-500 cursor-pointer overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-sky-400 to-indigo-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shadow-2xl relative z-10 bg-slate-950/50 flex flex-col items-center justify-center">
                        {/* Placeholder for Profile Logo since image was removed */}
                        <div className="text-xl font-black text-sky-400">{firstName?.charAt(0).toUpperCase() || 'M'}</div>
                    </div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase leading-none mb-1.5 drop-shadow-md">
                        {firstName?.toUpperCase() || 'MADHUR'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                        <span className="text-[9px] font-bold text-sky-400/80 tracking-[0.15em] uppercase">Hardware Architect</span>
                    </div>
                </div>
            </motion.div>

            {/* Main Application Layout */}
            <main className="flex-1 flex max-w-full h-full relative z-10 pl-[80px]">
                
                {/* LEFT SANDBOX (70%) - Pathways & Layout Map */}
                <div className="flex-1 relative border-r border-sky-900/10 bg-transparent overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: '#0ea5e9 transparent' }}>
                    
                    <div className="relative w-full min-w-[700px] max-w-[1000px] mx-auto h-[2100px] pt-10 pb-40">
                        {/* SVG WIRING LAYER (Underneath Hexagons) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 12px rgba(14,165,233,0.5))' }}>
                            {/* Grid gridlines subtle */}
                            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="40" y2="0" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
                                <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                            {/* Render Tree Connecting Lines */}
                            {TREE_EDGES.map((edge, idx) => (
                                <motion.line 
                                    key={idx}
                                    x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y}
                                    stroke={edge.to.color} strokeWidth="3" strokeOpacity="1"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ delay: 0.5 + idx * 0.05, duration: 1.5, ease: 'easeOut' }}
                                />
                            ))}

                            {/* Central Digital Logic Text watermark */}
                            <text x="50%" y="80" fill="#0ea5e9" textAnchor="middle" fontSize="12" fontFamily="monospace" letterSpacing="4" opacity="0.6" fontWeight="bold">
                                HARDWARE CURRICULUM TREE
                            </text>
                        </svg>

                        {/* RENDER TREE HexNodes */}
                        {Object.values(TREE_NODES).map((node, i) => (
                            <HexNode 
                                key={node.id} 
                                label={node.label} 
                                color={node.color} 
                                x={node.x} 
                                y={node.y} 
                                delay={0.2 + i * 0.1} 
                                onClick={() => {
                                    if(node.label === 'K-MAPS') navigate('/kmap');
                                    else if(['FSM DESIGN', 'FLIP-FLOPS', 'SEQUENTIAL'].includes(node.label)) navigate('/fsm');
                                    else if(['RTL DESIGN', 'VERILOG', 'TESTBENCHES'].includes(node.label)) navigate('/verilog');
                                }}
                            />
                        ))}
                    </div>

                </div>

                {/* RIGHT SIDEBAR (30%) - Metrics & Charts */}
                <div className="w-[380px] p-8 flex flex-col gap-10 bg-[#070b14] border-l border-slate-800/60 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                    
                    {/* Module Title */}
                    <div className="">
                        <h3 className="text-sky-500 font-mono text-[10px] tracking-[0.2em] mb-1">CURRENT MODULE</h3>
                        <h1 className="text-2xl font-black text-white tracking-widest leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">CORE LOGIC<br/><span className="text-sky-400">MASTER</span></h1>
                    </div>

                    {/* LED Matrix Block */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Grid Activity</h4>
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        </div>
                        <LEDMatrix />
                    </div>

                    {/* Verilog Fluency Horizontal Bars */}
                    <div>
                        <h4 className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-4">Verilog Fluency</h4>
                        <div className="flex flex-col gap-3">
                            <ChartBar label="Syntax" value={68} color="#3b82f6" />
                            <ChartBar label="FSM logic" value={45} color="#ec4899" />
                            <ChartBar label="Testbenches" value={22} color="#f59e0b" />
                            <ChartBar label="Timing" value={89} color="#10b981" />
                            <ChartBar label="Synthesis" value={12} color="#8b5cf6" />
                        </div>
                    </div>

                    {/* Lower Layout Panel: Apex Chart & Crystal */}
                    <div className="flex gap-6 mt-4 flex-1">
                        
                        {/* Challenge Apex Equalizer */}
                        <div className="w-20 pl-2 border-l border-slate-800 flex flex-col justify-end">
                            <h4 className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mb-4 whitespace-nowrap rotate-180" style={{ writingMode: 'vertical-rl' }}>Challenge Apex</h4>
                            <div className="flex items-end gap-1 h-32">
                                {[30, 50, 70, 90, 40, 60, 20].map((h, i) => (
                                    <motion.div 
                                        key={i}
                                        className="w-1.5 bg-sky-500 rounded-t-sm opacity-80"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: 0.5 + (i*0.1), duration: 0.8 }}
                                        style={{ filter: 'drop-shadow(0 0 4px rgba(14,165,233,0.5))' }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Crystal Data Block */}
                        <div className="flex-1 relative flex flex-col justify-end items-end pb-8">
                             {/* Large Percentage Numbers */}
                             <div className="flex flex-col gap-0 text-right z-10 mr-4">
                                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 drop-shadow-[0_2px_10px_rgba(14,165,233,0.5)]">45<span className="text-sm ml-1">%</span></div>
                                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 opacity-60">62<span className="text-xs ml-1">%</span></div>
                                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600 opacity-30 mt-[-5px]">88<span className="text-xs ml-1">%</span></div>
                             </div>

                             {/* Glowing Crystal Pure SVG */}
                             <div className="absolute right-[-40px] bottom-[-20px] pointer-events-none opacity-80">
                                  <svg width="200" height="200" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.5))' }}>
                                       {/* Core glow */}
                                       <circle cx="50" cy="50" r="30" fill="url(#core-glow)" opacity="0.6" />
                                       
                                       {/* Polygons */}
                                       <polygon points="50,15 80,40 50,90 20,40" fill="url(#front-face)" opacity="0.9" />
                                       <polygon points="50,15 20,40 50,45" fill="rgba(255,255,255,0.4)" />
                                       <polygon points="50,15 80,40 50,45" fill="rgba(168,85,247,0.6)" />
                                       <polygon points="20,40 50,90 50,45" fill="rgba(56,189,248,0.5)" />
                                       <polygon points="80,40 50,90 50,45" fill="rgba(14,165,233,0.8)" />

                                       <defs>
                                           <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
                                               <stop offset="0%" stopColor="#c084fc" />
                                               <stop offset="100%" stopColor="transparent" />
                                           </radialGradient>
                                           <linearGradient id="front-face" x1="0%" y1="0%" x2="100%" y2="100%">
                                               <stop offset="0%" stopColor="#38bdf8" />
                                               <stop offset="100%" stopColor="#1e3a8a" />
                                           </linearGradient>
                                       </defs>
                                  </svg>
                             </div>
                        </div>

                    </div>
                </div>

            </main>

            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey={getTourKey(firstName)} />
            <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} storageKey={getTourKey(firstName)} />
        </div>
    );
};
