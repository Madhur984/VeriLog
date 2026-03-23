import React, { useState } from 'react';
import { 
    AlertTriangle, Play, CheckCircle2, 
    Zap, RefreshCw, Smartphone, Cpu, CarFront, GraduationCap, Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';

// Modular Sub-module Imports
import SubModule1_1 from './level1/SubModule1_1';
import { SubModule1_2 } from './level1/SubModule1_2';
import { SubModule1_3 } from './level1/SubModule1_3';
import { SubModule1_4 } from './level1/SubModule1_4';
import { SubModule1_5 } from './level1/SubModule1_5';
import { SubModule1_6 } from './level1/SubModule1_6';

interface ModuleContentProps {
    activeSection: string;
}





// Legacy components removed. Using modular SubModule components.


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
                return <SubModule1_1 onComplete={(sip: number) => console.log('S1.1 Complete, SIP:', sip)} />;

            case 'Signal Propagation':
                return <SubModule1_2 onComplete={(sip) => console.log('S1.2 Complete, SIP:', sip)} />;

            case 'Core Loop Rule':
                return <SubModule1_4 onComplete={(sip) => console.log('S1.4 Complete, SIP:', sip)} />;

            case 'Return Physics':
                return <SubModule1_5 onComplete={(sip) => console.log('S1.5 Complete, SIP:', sip)} />;

            case 'Signal Integrity':
                return <SignalIntegrityTheory />;

            case 'Signal Flow Experiment':
                return <SubModule1_3 onComplete={(sip) => console.log('S1.3 Complete, SIP:', sip)} />;

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
                return <SubModule1_6 onComplete={(sip) => console.log('Mastery Complete, SIP:', sip)} />;

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
