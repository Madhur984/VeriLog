import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalRenderer } from '../../circuit-lab/SignalRenderer';
import { Trophy, ShieldCheck, Cpu } from 'lucide-react';

interface SubModuleProps {
    onComplete: (sip: number) => void;
}

type ChallengeState = 'idle' | 'analyzing' | 'success' | 'fail';

export const SubModule1_6: React.FC<SubModuleProps> = ({ onComplete }) => {
    const [state, setState] = useState<ChallengeState>('idle');
    const [selection, setSelection] = useState<number | null>(null);

    const challenges = [
        {
            title: "Scenario Alpha",
            desc: "A circuit with a battery and a bulb, but the return wire is touching a metal chassis instead of the battery (-) terminal.",
            options: ["Closed Circuit", "Open Circuit", "Short Circuit"],
            correct: 1, // Open (unless chassis is grounded/connected to source)
            feedback: "If it doesn't reach the source, the loop is incomplete."
        }
    ];

    const verify = (idx: number) => {
        setSelection(idx);
        setState('analyzing');
        setTimeout(() => {
            if (idx === challenges[0].correct) {
                setState('success');
            } else {
                setState('fail');
            }
        }, 1500);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-[#0B0F14]">
            <AnimatePresence mode="wait">
                {state !== 'success' ? (
                    <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl w-full">
                        <div className="text-center mb-16">
                            <Trophy size={48} className="mx-auto text-[#FFD700] mb-6" />
                            <h2 className="text-3xl font-bold text-white mb-2">Mastery Challenge</h2>
                            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">Final Diagnostics</p>
                        </div>

                        <div className="bg-[#141B2D] border border-[#1E2332] rounded-3xl p-12">
                             <div className="flex items-start gap-6 mb-12">
                                <div className="p-4 bg-[#0A0E1A] border border-[#1E2332] rounded-2xl text-[#00D2FF]">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{challenges[0].title}</h3>
                                    <p className="text-slate-400 leading-relaxed font-sans">{challenges[0].desc}</p>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {challenges[0].options.map((opt, i) => (
                                    <motion.button
                                        key={opt}
                                        whileHover={{ y: -5 }}
                                        onClick={() => state === 'idle' && verify(i)}
                                        className={`p-6 border rounded-2xl text-center transition-all ${
                                            selection === i 
                                            ? (state === 'fail' ? 'border-red-500 bg-red-500/10 text-white' : 'border-[#00D2FF] bg-[#00D2FF]/10 text-white')
                                            : 'border-[#1E2332] bg-[#0A0E1A] text-slate-400 hover:border-[#00D2FF]/30'
                                        }`}
                                    >
                                        <span className="font-mono text-xs uppercase tracking-widest">{opt}</span>
                                    </motion.button>
                                ))}
                             </div>

                             {state === 'fail' && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center text-red-400 font-mono text-[10px] uppercase tracking-widest">
                                    Re-evaluating logic... Try again.
                                </motion.p>
                             )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                         <div className="w-32 h-32 rounded-full border border-[#22C55E] flex items-center justify-center mb-10 bg-[#22C55E]/10">
                            <ShieldCheck size={60} className="text-[#22C55E]" />
                         </div>
                         <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Certification Complete</h2>
                         <p className="text-lg text-slate-400 mb-12 max-w-md">You have mastered the foundational law of electricity: <br/><strong className="text-white">A signal must return to its source.</strong></p>
                         
                         <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
                            <div className="p-4 border border-[#1E2332] bg-[#141B2D] rounded-xl text-center">
                                <span className="block text-[10px] font-mono text-slate-500 uppercase mb-1">XP Earned</span>
                                <span className="text-xl font-bold text-[#00D2FF]">+250</span>
                            </div>
                            <div className="p-4 border border-[#1E2332] bg-[#141B2D] rounded-xl text-center">
                                <span className="block text-[10px] font-mono text-slate-500 uppercase mb-1">SIP Bonus</span>
                                <span className="text-xl font-bold text-[#22C55E]">+50</span>
                            </div>
                         </div>

                         <button 
                            onClick={() => onComplete(50)}
                            className="px-16 py-4 bg-[#22C55E] text-[#0B0F14] rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                         >
                            Finalize Operations
                         </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.03]">
                 <SignalRenderer path="M 0,0 L 1920,1080" isActive={true} state="smooth" />
                 <SignalRenderer path="M 1920,0 L 0,1080" isActive={true} state="smooth" />
            </svg>
        </div>
    );
};
