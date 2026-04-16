import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Info, ChevronDown, ChevronUp, BookOpen, Scaling, Zap } from 'lucide-react';

interface TechSpecs {
    concept: string;
    physical: string | React.ReactNode;
    formal: string | React.ReactNode;
    insight: string;
    advanced?: {
        title: string;
        content: string | React.ReactNode;
    }[];
}

interface TechnicalAuditProps {
    specs: TechSpecs;
    isDarkMode: boolean;
    accentColor?: string;
    showFullView?: boolean;
}

/**
 * TechnicalAudit: A high-fidelity, progressive-disclosure component for engineering depth.
 * Used across all Module 2 scenes to provide "Pro Mode" details without cluttering the UI.
 */
export const TechnicalAudit: React.FC<TechnicalAuditProps> = ({ 
    specs, 
    isDarkMode, 
    accentColor = "text-orange-500",
    showFullView = false 
}) => {
    const [isOpen, setIsOpen] = useState(showFullView);
    
    const bg = isDarkMode ? 'bg-black/60 border-white/10 shadow-2xl backdrop-blur-3xl' : 'bg-white border-gray-100 shadow-xl';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-white/40' : 'text-gray-500';

    return (
        <div className="w-full mt-16 group/audit">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-6 md:p-8 rounded-[2rem] border flex items-center justify-between transition-all duration-500 group ${bg} ${isOpen ? 'border-orange-500/40 ring-1 ring-orange-500/10' : 'hover:border-orange-500/30'}`}
            >
                <div className="flex items-center gap-5 md:gap-7">
                    <div className={`p-4 rounded-xl border transition-all duration-500 ${isOpen ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-white/5 border-white/5 group-hover:bg-white/10'}`}>
                        <Terminal size={18} />
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[9px] font-mono uppercase tracking-[0.4em] font-black ${subTextColor}`}>Hardware Verification Pass</span>
                            <div className={`px-2 py-0.5 rounded-full border text-[7px] font-mono ${isDarkMode ? 'border-white/10 text-white/20' : 'border-black/10 text-black/20'}`}>
                                ID: {Math.random().toString(36).substring(7).toUpperCase()}
                            </div>
                        </div>
                        <h4 className={`text-lg md:text-2xl font-black italic tracking-tighter ${textColor}`}>Technical Audit Pass</h4>
                    </div>
                </div>
                <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`p-3 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}
                >
                    <ChevronDown size={18} className={subTextColor} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1, marginTop: 16 }} 
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="overflow-hidden"
                    >
                        <div className={`p-8 md:p-12 rounded-[2rem] border ${bg} grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative overflow-hidden`}>
                            {/* Decorative Grid Lines */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                            />

                            {/* CONCEPT & PHYSICAL */}
                            <div className="space-y-12 relative z-10">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10">
                                            <Info size={12} className={accentColor} />
                                        </div>
                                        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-black ${accentColor}`}>Core Essence</span>
                                    </div>
                                    <p className={`text-base md:text-lg font-medium leading-relaxed ${textColor}`}>
                                        {specs.concept}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10">
                                            <Scaling size={12} className={accentColor} />
                                        </div>
                                        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-black ${accentColor}`}>Physical Interpretation</span>
                                    </div>
                                    <div className={`text-sm italic leading-relaxed font-bold p-6 rounded-2xl ${isDarkMode ? 'bg-white/[0.03] border border-white-5' : 'bg-gray-50 border border-gray-100'} ${subTextColor}`}>
                                        {specs.physical}
                                    </div>
                                </div>
                            </div>

                            {/* FORMAL & INSIGHT */}
                            <div className="space-y-12 relative z-10">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10">
                                            <BookOpen size={12} className={accentColor} />
                                        </div>
                                        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-black ${accentColor}`}>Formal Logic</span>
                                    </div>
                                    <div className={`text-sm font-mono leading-relaxed p-6 rounded-2xl ${isDarkMode ? 'bg-white/[0.03] border border-white-5' : 'bg-white border border-gray-100'} ${textColor}`}>
                                        {specs.formal}
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10">
                                            <Zap size={12} className={accentColor} />
                                        </div>
                                        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-black ${accentColor}`}>Operational Insight</span>
                                    </div>
                                    <div className={`p-6 rounded-2xl border-l-[6px] border-orange-500 ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'} ${textColor}`}>
                                        <p className="text-sm font-bold leading-relaxed">{specs.insight}</p>
                                    </div>
                                </div>
                            </div>

                            {/* ADVANCED SECTION (Optional) */}
                            {specs.advanced && (
                                <div className="md:col-span-2 pt-12 border-t border-dashed border-white/10 space-y-10 relative z-10">
                                    <div className="text-center">
                                        <span className={`text-[10px] font-mono uppercase tracking-[0.8em] font-black ${subTextColor} opacity-40`}>Advanced Engineering Specs</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {specs.advanced.map((adv, i) => (
                                            <div key={i} className={`p-8 rounded-[2rem] border transition-all duration-300 hover:border-orange-500/20 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                                <h5 className={`text-lg font-black italic mb-4 flex items-center gap-3 ${textColor}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                    {adv.title}
                                                </h5>
                                                <div className={`text-xs leading-relaxed font-medium opacity-60 ${textColor}`}>{adv.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
