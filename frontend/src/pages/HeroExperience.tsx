import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalOrb } from '../components/ui/SignalOrb';
import { LayoutDashboard, ArrowRight, Activity, Zap, ShieldCheck } from 'lucide-react';
import { useGamificationStore } from '../stores/gamificationStore';
import { GreetingSequence } from '../components/ui/GreetingSequence';

export const HeroExperience = () => {
    const navigate = useNavigate();
    const { hasSeenGreeting, firstName } = useGamificationStore();
    const [orbInteracted, setOrbInteracted] = useState(false);

    const T = {
        bg: 'bg-slate-50',
        card: 'bg-white',
        text: 'text-slate-900',
        muted: 'text-slate-500',
        primary: 'text-sky-600',
        border: 'border-slate-200',
        shadow: 'shadow-xl shadow-slate-200/50',
    };

    return (
        <div className={`relative w-full h-screen overflow-hidden ${T.bg} font-sans ${T.text}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">

                {/* Header / Navigation */}
                <header className="absolute top-0 left-0 right-0 z-50 p-8 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                            <LayoutDashboard className="w-6 h-6 text-sky-600" />
                        </div>
                        <span className="font-heading font-black text-2xl tracking-tighter uppercase text-slate-900">
                            VeriLog <span className="text-sky-600/50 text-sm ml-2 font-mono tracking-widest">v2.1</span>
                        </span>
                    </motion.div>

                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="hidden md:flex items-center space-x-8"
                    >
                        <button onClick={() => navigate('/learn')} className="font-mono text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors uppercase tracking-wider">Learn</button>
                        <button onClick={() => navigate('/assessment')} className="font-mono text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors uppercase tracking-wider">Assessment</button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            SYSTEM_ACCESS
                        </button>
                    </motion.nav>
                </header>

                {/* Main Interaction Area */}
                <div className="space-y-12 flex flex-col items-center">

                    {/* Logic Status Panel (Replacing Bot) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-2xl ${T.card} ${T.border} ${T.shadow} max-w-sm mb-8 border`}
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`p-2 rounded-lg ${orbInteracted ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                                {orbInteracted ? <ShieldCheck size={20} /> : <Zap size={20} />}
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logic Analysis</div>
                                <div className="text-sm font-bold text-slate-700">
                                    {orbInteracted ? "Signal Flow Stabilized" : "System Standby"}
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 text-left leading-relaxed">
                            {orbInteracted 
                                ? "Spectacular! You've successfully established a pulse in the logic matrix. The gateway is ready." 
                                : "The core signal requires initialization. Drag the glowing orb to find the resonant frequency."}
                        </p>
                    </motion.div>

                    {/* The Artifact */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 1 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-sky-400/20 blur-3xl rounded-full scale-150 animate-pulse pointer-events-none" />
                        <SignalOrb
                            onPulse={() => setOrbInteracted(true)}
                            onDragEnd={() => setOrbInteracted(true)}
                        />
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="space-y-6 pt-8"
                    >
                        <h1 className="font-heading font-extrabold text-6xl md:text-8xl text-slate-900 tracking-tight leading-none">
                            Logic <span className="text-sky-600">Playground</span>
                        </h1>
                        <p className="font-sans text-xl text-slate-500 max-w-lg mx-auto font-medium">
                            Master the invisible forces of digital logic through interactive exploration.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button
                                onClick={() => navigate('/playground')}
                                className="group relative px-10 py-5 bg-sky-600 text-white font-bold rounded-2xl overflow-hidden shadow-lg shadow-sky-600/20 hover:scale-105 transition-all transform active:scale-95"
                            >
                                <span className="relative z-10 flex items-center text-lg">
                                    Initialize Console <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                            
                            <div className="flex items-center gap-2 px-6 py-4 rounded-xl border border-slate-200 bg-white text-slate-600 font-mono text-sm font-bold shadow-sm">
                                <Activity size={16} className="text-emerald-500" />
                                <span>GUEST_SESSION_ACTIVE</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>


            {/* Interactive Greeting Overlay */}
            <AnimatePresence>
                {firstName && !hasSeenGreeting && <GreetingSequence />}
            </AnimatePresence>
        </div>
    );
};
