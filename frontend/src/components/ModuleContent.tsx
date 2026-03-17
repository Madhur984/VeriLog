import React, { useState } from 'react';
import { 
    AlertTriangle, Play, CheckCircle2, 
    Zap, RefreshCw, Smartphone, Cpu, CarFront, GraduationCap, Lightbulb, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ModuleContentProps {
    activeSection: string;
}





const CircuitDiscoveryLab: React.FC = () => {
    const [isClosed, setIsClosed] = useState(false);
    const [voltage, setVoltage] = useState(1.5);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-md">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-100 italic tracking-tight uppercase">CIRCUIT DISCOVERY LAB</h2>
                    <p className="text-chart-cyan font-mono text-xs tracking-widest mt-2">MODULE 1: SIGNAL FLOW FOUNDATIONS</p>
                </div>

                <div className="relative py-16 px-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-20" 
                        style={{ backgroundImage: 'radial-gradient(circle at center, #06B6D4 0%, transparent 70%)' }} />
                    
                    <svg width="500" height="150" viewBox="0 0 500 150" className="relative z-10 overflow-visible">
                        {/* Loop Path */}
                        <rect x="50" y="40" width="400" height="80" rx="10" 
                            className={`fill-none stroke-current transition-all duration-700 ${isClosed ? 'text-chart-cyan stroke-[4px] filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]' : 'text-slate-800 stroke-[2px] stroke-dasharray-[10,5]'}`} />
                        
                        {/* Switch Gap */}
                        {!isClosed && (
                            <rect x="230" y="35" width="40" height="10" fill="#020617" />
                        )}

                        {/* Battery */}
                        <g transform="translate(20, 55)">
                            <rect width="60" height="40" rx="4" fill="#1e293b" stroke="#06B6D4" strokeWidth="2" />
                            <rect x="60" y="10" width="4" height="20" fill="#06B6D4" />
                            <Zap x="15" y="10" size={16} className={isClosed ? "text-chart-cyan animate-pulse" : "text-slate-600"} />
                        </g>

                        {/* Switch */}
                        <g transform="translate(210, 20)" className="cursor-pointer group" onClick={() => setIsClosed(!isClosed)}>
                            <circle cx="20" cy="20" r="5" fill="#475569" />
                            <circle cx="60" cy="20" r="5" fill="#475569" />
                            <motion.line 
                                x1="20" y1="20" x2="60" y2={isClosed ? "20" : "0"} 
                                stroke={isClosed ? "#06B6D4" : "#94a3b8"} 
                                strokeWidth="5" 
                                strokeLinecap="round"
                                animate={{ y2: isClosed ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        </g>

                        {/* LED */}
                        <g transform="translate(420, 55)">
                            <motion.circle 
                                cx="20" cy="20" r="22" 
                                fill={isClosed ? "#06B6D4" : "#1e293b"} 
                                stroke={isClosed ? "#06B6D4" : "#475569"} 
                                strokeWidth="2"
                                animate={{ 
                                    opacity: isClosed ? [0.7, 1, 0.7] : 1,
                                    scale: isClosed ? [1, 1.05, 1] : 1
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            {isClosed && (
                                <motion.circle 
                                    cx="20" cy="20" r="35" 
                                    fill="rgba(6,182,212,0.15)" 
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                            <Lightbulb x="10" y="10" size={20} className={isClosed ? "text-slate-950" : "text-slate-600"} />
                        </g>

                        {/* Particles */}
                        {isClosed && (
                            <g>
                                {[...Array(12)].map((_, i) => (
                                    <motion.circle
                                        key={i}
                                        r="2.5"
                                        fill="#06B6D4"
                                        initial={{ offsetDistance: `${(i / 12) * 100}%` }}
                                        animate={{ offsetDistance: "100%" }}
                                        transition={{ 
                                            duration: 3 / (voltage / 1.5), 
                                            repeat: Infinity, 
                                            ease: "linear",
                                            delay: -(i / 12) * (3 / (voltage / 1.5))
                                        }}
                                        style={{ offsetPath: "path('M 50 40 L 450 40 L 450 120 L 50 120 Z')" }}
                                    />
                                ))}
                            </g>
                        )}
                    </svg>

                    <div className="mt-12 flex gap-4">
                        <button 
                            onClick={() => setIsClosed(true)}
                            className={`px-6 py-2 rounded-xl font-bold transition-all ${isClosed ? 'bg-chart-cyan text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        >
                            CLOSE CIRCUIT
                        </button>
                        <button 
                            onClick={() => setIsClosed(false)}
                            className={`px-6 py-2 rounded-xl font-bold transition-all ${!isClosed ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        >
                            OPEN CIRCUIT
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {[
                        { label: 'Voltage', value: `${voltage}V`, color: 'text-blue-400' },
                        { label: 'Path', value: isClosed ? 'CLOSED' : 'OPEN', color: isClosed ? 'text-chart-cyan' : 'text-amber-500' },
                        { label: 'Flow', value: isClosed ? '2.4 e⁻/s' : '0 e⁻/s', color: isClosed ? 'text-chart-cyan' : 'text-slate-500' },
                        { label: 'LED', value: isClosed ? 'ON' : 'OFF', color: isClosed ? 'text-chart-cyan' : 'text-slate-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono mb-1">{stat.label}</p>
                            <p className={`text-sm font-bold font-mono ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex items-center gap-4 bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                    <span className="text-[10px] uppercase font-mono text-slate-500">Adjust Voltage:</span>
                    <input 
                        type="range" min="0" max="12" step="0.5" 
                        value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))}
                        className="flex-1 accent-chart-cyan h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-chart-cyan font-mono text-xs w-12">{voltage}V</span>
                </div>
                
                <div className="mt-10 p-6 rounded-2xl bg-chart-cyan/5 border border-chart-cyan/10 flex items-start gap-4">
                    <Info className="text-chart-cyan shrink-0 mt-1" size={20} />
                    <p className="text-slate-400 text-sm italic leading-relaxed">
                        "Welcome to the Signal Lab! Today you'll discover the secret of flowing signals. Try closing the switch above to see what happens when the loop is complete."
                    </p>
                </div>
            </div>
        </div>
    );
};

const CoreLoopRuleTheory: React.FC = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-100 italic tracking-tight uppercase">THE CORE LOOP RULE</h2>
                <p className="text-chart-cyan font-mono text-xs tracking-widest mt-2">KIRCHHOFF'S FIRST PRINCIPLE</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                        <RefreshCw className="text-chart-cyan" size={20} />
                        The Conservation of Charge
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        In any circuit, every electron that leaves the power source **MUST** find its way back. If the loop is broken at any point, the entire flow freezes instantly.
                    </p>
                    <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-mono text-slate-500 uppercase">Interactive Loop Visualizer</span>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-chart-cyan animate-pulse" />
                                <div className="w-2 h-2 rounded-full bg-chart-cyan animate-pulse delay-75" />
                                <div className="w-2 h-2 rounded-full bg-chart-cyan animate-pulse delay-150" />
                            </div>
                        </div>
                        <div className="aspect-video bg-slate-900/30 rounded-xl flex items-center justify-center p-8 border border-white/5">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-chart-cyan animate-spin duration-[3s]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-chart-cyan">ΣI = 0</p>
                                        <p className="text-[8px] font-mono text-slate-500">NET FLOW</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl p-6">
                        <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Key Takeaway
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Think of the circuit as a water system. If you block the return pipe, the pump can't push any more water into the supply line.
                        </p>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                        <h4 className="font-bold text-slate-200 mb-4">Broken Loops</h4>
                        <div className="space-y-4">
                            {['Floating Nodes', 'Open Switches', 'Blown Fuses'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-slate-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReturnPhysicsTheory: React.FC = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-100 italic tracking-tight uppercase">RETURN PHYSICS</h2>
                <p className="text-chart-cyan font-mono text-xs tracking-widest mt-2">ELECTROMAGNETIC WAVEGUIDES</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <div className="inline-flex p-4 rounded-2xl bg-chart-cyan/10 text-chart-cyan mb-4">
                        <Smartphone size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100 italic">"The signal isn't in the wire..."</h3>
                    <p className="text-lg text-slate-400 leading-relaxed italic">
                        "...it's in the space between the signal path and the return path. Every trace is half of a transmission line."
                    </p>
                    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="space-y-4 p-6 rounded-2xl bg-slate-950/40 border border-slate-800">
                            <h4 className="font-mono text-chart-cyan text-xs uppercase tracking-widest">Electric Fields (E)</h4>
                            <p className="text-sm text-slate-500">Potential difference created between conductors.</p>
                            <div className="h-1 bg-gradient-to-r from-transparent via-chart-cyan to-transparent opacity-30" />
                        </div>
                        <div className="space-y-4 p-6 rounded-2xl bg-slate-950/40 border border-slate-800">
                            <h4 className="font-mono text-chart-cyan text-xs uppercase tracking-widest">Magnetic Fields (H)</h4>
                            <p className="text-sm text-slate-500">Current flow induces fields that wrap around loops.</p>
                            <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SignalPropagationTheory: React.FC = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-100 italic tracking-tight uppercase">SIGNAL PROPAGATION</h2>
                <p className="text-chart-cyan font-mono text-xs tracking-widest mt-2">THE VELOCITY OF INFORMATION</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                <p className="text-slate-300 leading-relaxed">
                    Signals don't just "appear" at the end of a wire. They travel as electromagnetic waves at nearly 70% the speed of light. This means the return path must also be ready at that exact moment.
                </p>
            </div>
        </div>
    );
};

const SignalIntegrityTheory: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-100 italic tracking-tight uppercase">SIGNAL INTEGRITY</h2>
                <p className="text-chart-cyan font-mono text-xs tracking-widest mt-2">REFLECTIONS & RETURN PATHS</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
                    <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                        <AlertTriangle className="text-amber-500" size={20} />
                        The Reflection Problem
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        When a signal hits a break or a mismatch in the return path, it doesn't just stop. It bounces back, creating **Reflections** that interfere with the original signal.
                    </p>
                    <div className="h-32 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                        <motion.div 
                            className="absolute left-0 w-1/2 h-0.5 bg-chart-cyan"
                            animate={{ x: [0, 200, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="absolute right-[45%] w-1 h-8 bg-rose-500/50 blur-[2px]" />
                        <p className="text-[10px] uppercase font-mono text-slate-600 mt-12">Impedance Discontinuity</p>
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-chart-cyan/5 border border-chart-cyan/10 space-y-6">
                    <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                        <CheckCircle2 className="text-chart-cyan" size={20} />
                        The Golden Rule
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed italic">
                        "Route the return path as close as possible to the signal path to minimize the loop area and prevent EMI interference."
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <p className="text-chart-cyan font-bold text-lg">90%</p>
                            <p className="text-[8px] uppercase font-mono text-slate-500 leading-tight">Reduction in Noise Exposure</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <p className="text-blue-400 font-bold text-lg">Speed</p>
                            <p className="text-[8px] uppercase font-mono text-slate-500 leading-tight">Faster Switching Speeds</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CircuitExperiment: React.FC = () => {
    const [isClosed, setIsClosed] = useState(false);
    const [scenario, setScenario] = useState<'Standard' | 'Short' | 'Broken'>('Standard');

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-md">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-chart-cyan rounded-full inline-block" />
                            Signal Flow Experiment
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Multi-Scenario Logic Analysis</p>
                    </div>
                    <div className="flex gap-2">
                        {(['Standard', 'Short', 'Broken'] as const).map(s => (
                            <button 
                                key={s}
                                onClick={() => setScenario(s)}
                                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] border transition-all ${scenario === s ? 'bg-chart-cyan/20 border-chart-cyan text-chart-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative py-12 px-4 rounded-xl bg-slate-950/50 border border-slate-800/50 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-20" 
                        style={{ backgroundImage: 'radial-gradient(circle at center, #06B6D4 0%, transparent 70%)' }} />
                    
                    <svg width="600" height="150" viewBox="0 0 600 150" className="relative z-10 overflow-visible">
                        {/* Wires */}
                        <path d="M 50 70 L 250 70" 
                            className={`fill-none stroke-current transition-all duration-500 ${isClosed && scenario !== 'Broken' ? 'text-chart-cyan stroke-[3px] filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-800 stroke-[2px] stroke-dasharray-[8,4]'}`} />
                        
                        {/* Short Circuit Path */}
                        {scenario === 'Short' && (
                            <path d="M 210 70 L 210 120 L 590 120 L 590 70" 
                                className={`fill-none stroke-rose-500/30 stroke-[2px] stroke-dasharray-[4,4] transition-all`} />
                        )}

                        <path d="M 350 70 L 550 70" 
                            className={`fill-none stroke-current transition-all duration-500 ${isClosed && scenario === 'Standard' ? 'text-chart-cyan stroke-[3px] filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-800 stroke-[2px] stroke-dasharray-[8,4]'}`} />
                        <path d="M 50 70 L 50 120 L 550 120 L 550 70" 
                            className={`fill-none stroke-current transition-all duration-500 ${isClosed && scenario !== 'Broken' ? 'text-chart-cyan stroke-[3px] filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-800 stroke-[2px] stroke-dasharray-[8,4]'}`} />

                        {/* Components */}
                        <g transform="translate(20, 45)">
                            <rect width="60" height="50" rx="4" fill="#1e293b" stroke="#06B6D4" strokeWidth="2" />
                            <Zap x="22" y="17" size={16} className={isClosed ? "text-chart-cyan animate-pulse" : "text-slate-600"} />
                        </g>

                        <g transform="translate(260, 50)" className="cursor-pointer" onClick={() => setIsClosed(!isClosed)}>
                            <rect width="80" height="40" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                            <motion.line 
                                x1="10" y1="20" x2="70" y2={isClosed ? 20 : 5} 
                                stroke={isClosed ? "#06B6D4" : "#94a3b8"} 
                                strokeWidth="4" 
                                animate={{ y2: isClosed ? 20 : 5 }}
                            />
                        </g>

                        <g transform="translate(530, 50)">
                            <motion.circle 
                                cx="20" cy="20" r="20" 
                                fill={isClosed && scenario === 'Standard' ? "#06B6D4" : "#1e293b"} 
                                stroke={isClosed && scenario === 'Standard' ? "#06B6D4" : "#475569"} 
                                strokeWidth="2"
                                animate={{ opacity: isClosed && scenario === 'Short' ? 0.3 : 1 }}
                            />
                            <Lightbulb x="10" y="10" size={20} className={isClosed && scenario === 'Standard' ? "text-slate-950" : "text-slate-600"} />
                        </g>

                        {/* Particles */}
                        {isClosed && scenario !== 'Broken' && (
                            <g>
                                {[...Array(10)].map((_, i) => (
                                    <motion.circle
                                        key={i}
                                        r="2.5"
                                        fill={scenario === 'Short' ? "#f43f5e" : "#06B6D4"}
                                        initial={{ offsetDistance: `${(i / 10) * 100}%` }}
                                        animate={{ offsetDistance: "100%" }}
                                        transition={{ duration: scenario === 'Short' ? 0.8 : 2.5, repeat: Infinity, ease: "linear", delay: -(i / 10) * (scenario === 'Short' ? 0.8 : 2.5) }}
                                        style={{ offsetPath: `path('${scenario === 'Short' ? "M 50 70 L 210 70 L 210 120 L 590 120 L 590 70 L 550 70 L 550 120 L 50 120 Z" : "M 50 70 L 250 70 M 350 70 L 550 70 L 550 120 L 50 120 L 50 70" }')` }}
                                    />
                                ))}
                            </g>
                        )}
                    </svg>
                </div>
                
                <div className="mt-8 p-6 bg-slate-950/40 rounded-xl border border-slate-800">
                    <p className="text-sm font-mono text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                        <Info size={14} className="text-chart-cyan" />
                        Scenario Analysis
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed italic">
                        {scenario === 'Standard' && "Standard Loop: Current flows through the load (LED) and returns to source."}
                        {scenario === 'Short' && "Short Circuit: Current takes the path of least resistance, bypassing the LED and causing high flow rate (Hazardous!)."}
                        {scenario === 'Broken' && "Broken Ground: The return path is severed. No matter how much voltage you apply, the signal cannot move."}
                    </p>
                </div>
            </div>
        </div>
    );
};

const AdvancedSignalLab: React.FC = () => {
    const [toolbox, setToolbox] = useState([
        { id: 'bat', name: 'Battery', icon: Zap, placed: true },
        { id: 'wir', name: 'Wire', icon: RefreshCw, placed: true },
        { id: 'swi', name: 'Switch', icon: Play, placed: false },
        { id: 'led', name: 'LED', icon: Lightbulb, placed: false },
    ]);

    const togglePlacement = (id: string) => {
        setToolbox(prev => prev.map(item => item.id === id ? { ...item, placed: !item.placed } : item));
    };

    const isLoopComplete = toolbox.every(item => item.placed);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-100 italic tracking-tight uppercase">ADVANCED SIGNAL LAB</h2>
                <p className="text-chart-cyan font-mono text-xs tracking-widest mt-2">COMPONENT LIBRARY SYNTHESIS</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Toolbox */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-fit">
                    <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">Component Library</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                        {toolbox.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => togglePlacement(item.id)}
                                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${item.placed ? 'bg-chart-cyan/10 border-chart-cyan/40 text-chart-cyan' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                            >
                                <item.icon size={18} />
                                <span className="font-bold text-xs">{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Simulation Canvas */}
                <div className="lg:col-span-3 bg-slate-950/40 border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center relative min-h-[400px]">
                    <div className="absolute inset-0 opacity-10" 
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #475569 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    
                    <div className="relative z-10 flex items-center justify-center gap-8">
                        {toolbox.filter(i => i.placed).map((item, idx) => (
                            <React.Fragment key={item.id}>
                                <motion.div 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center relative group"
                                >
                                    <item.icon size={32} className={isLoopComplete ? "text-chart-cyan" : "text-slate-600"} />
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        <p className="text-[8px] font-mono text-slate-500 uppercase">{item.name}</p>
                                    </div>
                                </motion.div>
                                {idx < toolbox.filter(i => i.placed).length - 1 && (
                                    <div className={`h-1 w-8 rounded-full ${isLoopComplete ? 'bg-chart-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-800'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {!isLoopComplete && (
                        <p className="mt-12 text-slate-600 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
                            Construct Loop to Verify Signal
                        </p>
                    )}

                    {isLoopComplete && (
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mt-12 p-4 rounded-xl bg-chart-cyan/10 border border-chart-cyan/20 flex items-center gap-3"
                        >
                            <CheckCircle2 className="text-chart-cyan" size={16} />
                            <span className="text-chart-cyan text-xs font-bold uppercase tracking-widest">Loop Integral Verified</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ModulePreview: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
                <h2 className="text-4xl font-black text-slate-100 italic tracking-tight mb-4 uppercase">NEXT PHASE: VELOCITY</h2>
                <p className="text-chart-cyan font-mono text-sm tracking-widest uppercase italic">You have mastered the Loop. Now, master the Speed.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-slate-800 group-hover:text-chart-cyan/10 transition-colors">
                    <Zap size={180} />
                </div>
                
                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-2xl font-bold text-slate-100 mb-6">Coming Up in Module 2:</h3>
                    <div className="space-y-6">
                        {[
                            { title: 'Propagation Delay', desc: 'Understanding why "instantly" doesn\'t exist in electronics.' },
                            { title: 'Rise Times', desc: 'The moment a signal switches determines its integrity.' },
                            { title: 'Controlled Impedance', desc: 'Taming electromagnetic energy with geometric precision.' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6">
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-chart-cyan text-xs">
                                    0{idx + 2}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-200 mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-12 px-10 py-4 bg-slate-100 text-slate-950 font-black rounded-xl hover:bg-chart-cyan transition-all uppercase tracking-widest text-xs">
                        Unlock Next Module
                    </button>
                </div>
            </div>
        </div>
    );
};

const ModuleContent: React.FC<ModuleContentProps> = ({ activeSection }) => {
    // Local state for interactive sections
    const [quizStep, setQuizStep] = useState(0);
    const [matches, setMatches] = useState<Record<number, string>>({});
    const [blankValue, setBlankValue] = useState('');
    const [diagnosisSelection, setDiagnosisSelection] = useState<number | null>(null);

    const quizQuestions = [
        {
            q: "If voltage exists but no current flows, the circuit is:",
            options: ["Open circuit", "Short circuit", "High gain", "Amplified"],
            correct: 0,
            feedback: "Voltage alone does not guarantee flow. The path must be closed."
        },
        {
            q: "If one wire in a working circuit breaks, what happens instantly?",
            options: ["Voltage increases", "Current stops", "Bulb dims slowly", "Battery drains faster"],
            correct: 1,
            feedback: "Current cannot partially flow in a broken loop. It ceases immediately."
        },
        {
            q: "In a simple bulb circuit, current:",
            options: ["Starts at bulb", "Is used up by bulb", "Flows in a closed loop", "Stays inside battery"],
            correct: 2,
            feedback: "Energy is transferred, but current always returns to the source in a closed loop."
        }
    ];

    const sourceItems = [
        { id: 1, text: "Source", matchId: "C" },
        { id: 2, text: "Load", matchId: "B" },
        { id: 3, text: "Open Circuit", matchId: "A" },
        { id: 4, text: "Closed Circuit", matchId: "D" },
        { id: 5, text: "Return Path", matchId: "E" },
    ];
    
    const targetItems = [
        { id: "A", text: "Break in connection" },
        { id: "B", text: "Converts electrical energy" },
        { id: "C", text: "Provides potential difference" },
        { id: "D", text: "Continuous conducting loop" },
        { id: "E", text: "Completes the electrical cycle" },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'Circuit Discovery Lab':
                return <CircuitDiscoveryLab />;

            case 'Signal Propagation':
                return <SignalPropagationTheory />;

            case 'Core Loop Rule':
                return <CoreLoopRuleTheory />;

            case 'Return Physics':
                return <ReturnPhysicsTheory />;

            case 'Signal Integrity':
                return <SignalIntegrityTheory />;

            case 'Signal Flow Experiment':
                return <CircuitExperiment />;

            case 'Loop Knowledge Quiz':
                const q = quizQuestions[quizStep];
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-mono text-xs text-slate-500">CHECKPOINT {quizStep + 1}/{quizQuestions.length}</span>
                                <div className="flex gap-1.5">
                                    {quizQuestions.map((_, i) => (
                                        <div key={i} className={`h-1 w-8 rounded-full ${i <= quizStep ? 'bg-chart-cyan' : 'bg-slate-800'}`} />
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-8 leading-relaxed">{q.q}</h3>
                            <div className="grid gap-4">
                                {q.options.map((opt, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => {
                                            if (idx === q.correct) {
                                                if (quizStep < quizQuestions.length - 1) setQuizStep((s: number) => s + 1);
                                            }
                                        }}
                                        className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-chart-cyan hover:bg-chart-cyan/5 transition-all text-left flex items-center gap-4 group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-xs text-slate-500 group-hover:text-chart-cyan transition-colors">
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-slate-300 group-hover:text-slate-100">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'Structural Matching':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-slate-100 mb-2">Structural Synthesis</h3>
                            <p className="text-sm text-slate-500 mb-10">Match the components to their structural role in a circuit.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    {sourceItems.map(item => {
                                        const isMatched = !!matches[item.id];
                                        return (
                                            <div key={item.id} className={`p-4 rounded-xl border ${isMatched ? 'border-chart-cyan bg-chart-cyan/10' : 'border-slate-800 bg-slate-900/50'} relative transition-all`}>
                                                <span className={isMatched ? 'text-chart-cyan font-semibold' : 'text-slate-300'}>{item.text}</span>
                                                {isMatched && (
                                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-chart-cyan text-slate-950 flex items-center justify-center text-[10px] font-bold">
                                                        {matches[item.id]}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="space-y-4">
                                    {targetItems.map(target => (
                                        <button 
                                            key={target.id}
                                            onClick={() => {
                                                const nextId = sourceItems.find(s => !matches[s.id])?.id;
                                                if (nextId) setMatches((prev: Record<number, string>) => ({ ...prev, [nextId]: target.id }));
                                            }}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-chart-cyan transition-all text-left"
                                        >
                                            <div className="w-10 h-10 shrink-0 rounded-lg bg-chart-cyan/10 border border-chart-cyan/20 flex items-center justify-center font-mono text-chart-cyan">
                                                {target.id}
                                            </div>
                                            <span className="text-xs text-slate-400 group-hover:text-slate-200">{target.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {Object.keys(matches).length === sourceItems.length && (
                                <button 
                                    onClick={() => setMatches({})}
                                    className="mt-10 w-full py-3 rounded-xl border border-slate-700 text-slate-500 hover:text-chart-cyan hover:border-chart-cyan transition-all text-sm font-mono uppercase tracking-widest"
                                >
                                    Reset Schema
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'Conceptual Synthesis':
                return (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="space-y-4">
                            <GraduationCap className="mx-auto text-chart-cyan/40" size={48} />
                            <h2 className="text-3xl font-bold text-slate-100 max-w-2xl leading-relaxed">
                                In a working circuit, current must leave the source and <br />
                                <input 
                                    type="text" 
                                    placeholder="......" 
                                    value={blankValue}
                                    onChange={e => setBlankValue(e.target.value)}
                                    className="mx-2 bg-transparent border-b-2 border-chart-cyan outline-none text-chart-cyan text-center w-28 uppercase font-mono tracking-widest"
                                />
                                to it.
                            </h2>
                        </div>
                        {blankValue.toLowerCase() === 'return' ? (
                            <div className="flex items-center gap-3 text-emerald-400 font-mono text-sm animate-bounce">
                                <CheckCircle2 size={18} /> RULE VALIDATED
                            </div>
                        ) : (
                            <p className="text-slate-500 text-xs uppercase tracking-widest font-mono">Fill in the missing principle</p>
                        )}
                    </div>
                );

            case 'System Diagnosis':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-slate-100 mb-2">Safe Systems Diagnosis</h2>
                            <p className="text-slate-500">Select the configuration that represents a critical loop failure.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Proper Loop', detail: 'Steady Equilibrium', icon: CheckCircle2, color: 'text-emerald-400' },
                                { label: 'Open Loop', detail: 'Signal Termination', icon: AlertTriangle, color: 'text-amber-400' },
                                { label: 'Short Circuit', detail: 'Load Bypassed', icon: Zap, color: 'text-rose-500' }
                            ].map((sys, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setDiagnosisSelection(idx)}
                                    className={`p-8 rounded-2xl border-2 flex flex-col items-center gap-6 transition-all ${diagnosisSelection === idx ? 'border-chart-cyan bg-chart-cyan/5 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'}`}
                                >
                                    <div className={`p-4 rounded-xl bg-slate-950 border border-slate-800 ${sys.color}`}>
                                        <sys.icon size={32} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-slate-100 mb-1">{sys.label}</h3>
                                        <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500">{sys.detail}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        {diagnosisSelection === 2 && (
                            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-center animate-in zoom-in-95 duration-300">
                                <p className="text-rose-400 text-sm italic font-medium">"Correct. A short circuit causes a dangerous surge of current as the load's resistance is removed from the loop."</p>
                            </div>
                        )}
                    </div>
                );

            case 'Summary & Achievements':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center">
                            <div className="w-16 h-1 w-chart-cyan mx-auto mb-6 rounded-full" />
                            <h2 className="text-4xl font-black text-slate-100 italic tracking-tight mb-2 uppercase">RECAP PERSPECTIVE</h2>
                            <p className="text-slate-500 font-mono text-sm tracking-widest">RETURN PATH INTEGRITY DEFINES RELIABILITY</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Smartphone', icon: Smartphone, desc: 'Ground line break = No power even if battery is full.' },
                                { title: 'PCB Failure', icon: Cpu, desc: 'Microscopic trace snap = Entire motherboard fails.' },
                                { title: 'Electric Vehicle', icon: CarFront, desc: 'Loose return path = Catastrophic pack failure.' }
                            ].map((item, idx) => (
                                <div key={idx} className="group p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-chart-cyan/50 transition-all">
                                    <item.icon className="text-chart-cyan mb-4 group-hover:scale-110 transition-transform" size={24} />
                                    <h3 className="font-bold text-slate-100 mb-3">{item.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 rounded-3xl bg-chart-cyan/5 border border-chart-cyan/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-chart-cyan/10">
                                <RefreshCw size={120} className="animate-[spin_10s_linear_infinite]" />
                            </div>
                            <div className="relative z-10 max-w-xl">
                                <p className="text-chart-cyan font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Core Invariant</p>
                                <p className="text-2xl font-medium text-slate-100 leading-normal">
                                    "Did you know? In high-speed digital design, return paths are not just wires—they are electromagnetic wave-guides. Master the loop, master the system."
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'Advanced Signal Lab':
                return <AdvancedSignalLab />;

            case 'Module Preview':
                return <ModulePreview />;

            case 'Open Sandbox':
                return (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in zoom-in-95 duration-700">
                        <div className="w-24 h-24 rounded-full bg-chart-cyan/10 border border-chart-cyan/30 flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                            <div className="w-16 h-16 rounded-full bg-chart-cyan/20 flex items-center justify-center">
                                <Play className="text-chart-cyan ml-1" fill="currentColor" size={32} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-slate-100 mb-4 tracking-tighter">INITIALIZE SANDBOX</h2>
                            <p className="text-slate-400 max-w-md mx-auto font-sans leading-relaxed text-sm">
                                Launch the high-fidelity circuit environment to manually verify signal propagation and loop integrity.
                            </p>
                        </div>
                        <button className="px-12 py-5 bg-chart-cyan text-slate-950 font-black rounded-xl hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-widest text-xs">
                            Access Virtual Workbench
                        </button>
                    </div>
                );

            default:
                return (
                    <div className="p-20 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-600 italic font-mono text-sm">
                        [ SYSTEM_LOG: Module section "{activeSection}" pending implementation ]
                    </div>
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            {renderContent()}
        </div>
    );
};

export default ModuleContent;
