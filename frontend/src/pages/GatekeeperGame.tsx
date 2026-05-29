import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wire } from '../components/ui/Wire';
import { ArrowLeft, Lock, Unlock, Shield, Zap, Info, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export const GatekeeperGame = () => {
    const navigate = useNavigate();
    const [guardA, setGuardA] = useState(false);
    const [guardB, setGuardB] = useState(false);
    const [gateType, setGateType] = useState<'AND' | 'OR'>('AND');
    const [showSuccess, setShowSuccess] = useState(false);

    // Logic Check
    const isOpen = gateType === 'AND' ? (guardA && guardB) : (guardA || guardB);

    const checkSuccess = () => {
        if (isOpen) {
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    const T = {
        bg: 'bg-slate-50',
        card: 'bg-white',
        text: 'text-slate-900',
        muted: 'text-slate-500',
        border: 'border-slate-200',
        shadow: 'shadow-xl shadow-slate-200/50',
    };

    return (
        <div className={`min-h-[100svh] ${T.bg} ${T.text} flex flex-col p-4 sm:p-8 relative font-sans overflow-x-hidden`}>
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dotGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <circle cx="30" cy="30" r="1.5" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dotGrid)" />
                </svg>
            </div>

            <header className="flex items-center justify-between mb-6 sm:mb-12 relative z-10 gap-3">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-sky-600 hover:border-sky-200 transition-all shadow-sm shrink-0 min-h-[40px]"
                >
                    <ArrowLeft className="mr-1 sm:mr-2 w-4 h-4" /> <span className="hidden sm:inline">Exit to Lounge</span><span className="sm:hidden">Exit</span>
                </button>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-lg shrink-0">
                        <Zap size={18} />
                    </div>
                    <div className="text-base sm:text-xl font-heading font-black tracking-tight text-slate-800 uppercase truncate">
                        Module 02: <span className="text-sky-600">Gatekeeper</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 max-w-7xl mx-auto w-full relative z-10">

                {/* Left: Logic Controls */}
                <div className={`${T.card} rounded-[32px] p-5 sm:p-8 ${T.border} border ${T.shadow} lg:col-span-3 flex flex-col space-y-5 sm:space-y-8 h-fit`}>
                    <div className="space-y-1">
                        <h2 className="text-xl font-black font-heading tracking-tight">Logic Matrix</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Configuration Panel</p>
                    </div>

                    {/* Gate Type Toggle */}
                    <div className="bg-slate-100 p-1.5 rounded-2xl flex border border-slate-200 shadow-inner">
                        {['AND', 'OR'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setGateType(type as any)}
                                className={cn(
                                    "flex-1 py-3.5 rounded-xl font-mono font-black text-sm tracking-widest transition-all",
                                    gateType === type 
                                        ? "bg-white text-sky-600 shadow-md border border-slate-100" 
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-2">Input A (Pulse Alpha)</div>
                            <button
                                onClick={() => setGuardA(!guardA)}
                                className={cn(
                                    "w-full py-5 rounded-2xl font-black flex items-center justify-center transition-all border-2",
                                    guardA 
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/10" 
                                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 shadow-sm"
                                )}
                            >
                                <Shield className={cn("mr-2 w-5 h-5", guardA ? "animate-pulse" : "opacity-30")} /> 
                                {guardA ? 'LOGIC HIGH' : 'LOGIC LOW'}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-2">Input B (Pulse Beta)</div>
                            <button
                                onClick={() => setGuardB(!guardB)}
                                className={cn(
                                    "w-full py-5 rounded-2xl font-black flex items-center justify-center transition-all border-2",
                                    guardB 
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/10" 
                                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 shadow-sm"
                                )}
                            >
                                <Shield className={cn("mr-2 w-5 h-5", guardB ? "animate-pulse" : "opacity-30")} /> 
                                {guardB ? 'LOGIC HIGH' : 'LOGIC LOW'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-start gap-3">
                        <Info size={16} className="text-sky-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-sky-700 font-bold leading-relaxed">
                            {gateType === 'AND' 
                                ? "For an AND gate, BOTH inputs must be in HIGH state (1) to permit signal propagation." 
                                : "For an OR gate, ANY input in HIGH state (1) will trigger the gateway mechanism."}
                        </p>
                    </div>
                </div>

                {/* Center: The Castle Gate */}
                <div className="lg:col-span-6 flex flex-col items-center relative py-8 sm:py-12">
                    {/* Wires */}
                    <div className="absolute top-0 w-full flex justify-between px-12 sm:px-24 opacity-30">
                        <div className="w-2 h-44 relative bg-slate-200 rounded-full">
                            <Wire active={guardA} color="bg-emerald-500" className="h-full w-2" />
                        </div>
                        <div className="w-2 h-44 relative bg-slate-200 rounded-full">
                            <Wire active={guardB} color="bg-emerald-500" className="h-full w-2" />
                        </div>
                    </div>

                    {/* The Gate Visual */}
                    <div className="mt-24 relative z-10">
                        <motion.div
                            animate={{
                                scale: isOpen ? 1.05 : 1,
                                filter: isOpen ? "drop-shadow(0 20px 40px rgba(14, 165, 233, 0.2))" : "none"
                            }}
                            className="w-64 h-80 sm:w-80 sm:h-96 bg-slate-100 rounded-t-full border-[6px] border-slate-200 flex items-end justify-center overflow-hidden relative shadow-inner"
                        >
                            {/* Doors */}
                            <motion.div
                                animate={{ width: isOpen ? "0%" : "50%" }}
                                className="absolute left-0 h-full bg-white border-r border-slate-200 flex items-center justify-center shadow-lg"
                            >
                                <div className="w-16 h-16 rounded-full border-2 border-slate-100 bg-slate-50 flex items-center justify-center opacity-50 shadow-inner">
                                    <Lock size={20} className="text-slate-300" />
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ width: isOpen ? "0%" : "50%" }}
                                className="absolute right-0 h-full bg-white border-l border-slate-200 flex items-center justify-center shadow-lg"
                            >
                                <div className="w-16 h-16 rounded-full border-2 border-slate-100 bg-slate-50 flex items-center justify-center opacity-50 shadow-inner">
                                    <Lock size={20} className="text-slate-300" />
                                </div>
                            </motion.div>

                            {/* Inner Chamber (Visible when open) */}
                            <div className="absolute inset-0 bg-sky-400/10 flex items-center justify-center -z-10">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ 
                                        opacity: isOpen ? 1 : 0,
                                        scale: isOpen ? 1 : 0.5,
                                        y: isOpen ? 0 : 20
                                    }}
                                    className="text-center"
                                >
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-sky-200 shadow-xl">
                                        <Unlock className="w-12 h-12 text-sky-600" />
                                    </div>
                                    <div className="font-heading font-black text-slate-800 text-xl tracking-tight uppercase">ACCESS GRANTED</div>
                                    <div className="text-[10px] text-sky-600 font-black tracking-widest uppercase mt-1 animate-pulse">Establishing Tunnel</div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Gate Status Icon */}
                        <motion.div 
                            animate={{ 
                                background: isOpen ? '#10B981' : '#F1F5F9',
                                scale: isOpen ? 1.1 : 1
                            }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-white rounded-[24px] flex items-center justify-center z-20 shadow-xl"
                        >
                            {isOpen ? <ShieldCheck className="text-white" size={32} /> : <Lock className="text-slate-300" size={32} />}
                        </motion.div>
                    </div>

                    {/* Action */}
                    <div className="mt-8 sm:mt-16 w-full flex justify-center">
                        <button
                            onClick={checkSuccess}
                            disabled={!isOpen}
                            className={cn(
                                "group relative w-full max-w-xs sm:w-auto px-8 sm:px-14 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-xl tracking-tight transition-all active:scale-95 shadow-2xl min-h-[48px]",
                                isOpen
                                    ? "bg-sky-600 text-white hover:bg-sky-700 shadow-sky-600/20"
                                    : "bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed shadow-none"
                            )}
                        >
                            {showSuccess ? "BYPASSING SECURITY..." : "INITIALIZE HANDSHAKE"}
                        </button>
                    </div>

                </div>

                {/* Right: Analysis & Feedback (Replacing Bot) */}
                <div className="lg:col-span-3 flex flex-col justify-center gap-4 sm:gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${T.card} p-5 sm:p-8 rounded-[32px] ${T.border} border ${T.shadow}`}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Logic Parser</h3>
                                <p className="text-lg font-black text-slate-800">Observation</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                                    "{showSuccess 
                                        ? "Perfect synchronization! The logic sequence matches the required hash. Phase 2 complete." 
                                        : isOpen 
                                            ? "The gateway condition is met. Proceed with the encrypted handshake in the main console." 
                                            : gateType === 'AND' 
                                                ? "Detection sensor: Input A and Input B are not yet polarized. AND logic requires unified HIGH state." 
                                                : "Detection sensor: The OR circuit is dormant. Any single HIGH pulse will activate the resonant flow."}"
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Input Harmony</span>
                                    <span className={cn("text-xs font-black", (guardA && guardB) ? "text-emerald-500" : "text-amber-500")}>
                                        {Math.floor(((guardA ? 0.5 : 0) + (guardB ? 0.5 : 0)) * 100)}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        animate={{ width: `${((guardA ? 0.5 : 0) + (guardB ? 0.5 : 0)) * 100}%` }}
                                        className={cn("h-full transition-all duration-500", (guardA && guardB) ? "bg-emerald-500" : "bg-amber-400")}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="p-6 bg-white border border-slate-200 rounded-3xl flex items-center gap-4 shadow-sm grayscale opacity-50">
                        <Shield className="text-slate-400 shrink-0" size={20} />
                        <div>
                            <div className="text-[8px] font-black tracking-[0.3em] uppercase text-slate-400">Security Note</div>
                            <p className="text-[10px] font-bold text-slate-500 leading-tight">Handshake protocol requires manual verification on every state change.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
