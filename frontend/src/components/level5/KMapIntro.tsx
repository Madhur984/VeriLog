/**
 * KMapIntro.tsx — Scene 5.1: Animated concept introduction for Karnaugh Maps.
 *
 * Visual flow:
 * 1. Truth table fades in row by row
 * 2. Animated paths trace each 1-minterm to its K-Map cell
 * 3. K-Map cell glows on arrival
 * 4. Logic Analyst insight pulses in
 * 5. CTA button unlocks
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';



// 3-variable truth table rows for F = A'BC + ABC + AB'C  (minterms 1,3,5,7)
const TRUTH_ROWS = [
    { idx: 0, a: 0, b: 0, c: 0, f: 0 },
    { idx: 1, a: 0, b: 0, c: 1, f: 1 },
    { idx: 2, a: 0, b: 1, c: 0, f: 0 },
    { idx: 3, a: 0, b: 1, c: 1, f: 1 },
    { idx: 4, a: 1, b: 0, c: 0, f: 0 },
    { idx: 5, a: 1, b: 0, c: 1, f: 1 },
    { idx: 6, a: 1, b: 1, c: 0, f: 0 },
    { idx: 7, a: 1, b: 1, c: 1, f: 1 },
];

interface Props {
    onComplete: () => void;
}

export const KMapIntro: React.FC<Props> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [litCells, setLitCells] = useState<Set<number>>(new Set());
    const [showCTA, setShowCTA] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        // Auto-advance animation
        const delays = [400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 4000, 5200];
        delays.forEach((d, i) => {
            timerRef.current = setTimeout(() => setStep(i + 1), d);
        });
        return () => clearTimeout(timerRef.current);
    }, []);

    // Light up K-Map cells as truth table rows animate in
    useEffect(() => {
        const minterms = [1, 3, 5, 7];
        minterms.forEach((m, i) => {
            setTimeout(() => {
                setLitCells(prev => new Set([...prev, m]));
            }, 2800 + i * 350);
        });
        setTimeout(() => setShowCTA(true), 5400);
    }, []);


    const COLS = ['00', '01', '11', '10'];
    const ROWS = ['0', '1'];

    return (
        <div className="flex flex-col gap-10 px-10 font-mono">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-center">
                <span className="text-[9px] uppercase tracking-[0.25em] text-sky-500 font-black block mb-2">
                    Scene 5.1 — Concept Introduction
                </span>
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter margin-0 uppercase">
                    Why Karnaugh Maps?
                </h2>
                <p className="text-slate-400 text-sm mt-4 max-w-xl mx-auto font-sans font-bold leading-relaxed italic">
                    "Watch how truth table rows map directly into K-Map cells — exposing hidden patterns that eliminate redundant logic."
                </p>
            </motion.div>

            {/* Side-by-side: Truth Table + K-Map */}
            <div className="flex gap-16 justify-center items-start">

                {/* Truth Table */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl min-w-[240px]">
                    <div className="text-[9px] text-sky-500 font-black tracking-widest uppercase mb-6">Truth Table</div>
                    <div className="grid grid-cols-[repeat(3,32px)_40px] gap-2 text-center text-sm">
                        {['A', 'B', 'C'].map(v => <div key={v} className="text-slate-400 font-black">{v}</div>)}
                        <div className="text-sky-500 font-black">F</div>
                        <div className="col-span-4 h-px bg-slate-100 my-2" />
                        {TRUTH_ROWS.map((row, i) => (
                            <React.Fragment key={row.idx}>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > i ? 1 : 0.1 }}
                                    transition={{ duration: 0.3 }} className={row.a ? "text-slate-900 font-bold" : "text-slate-300"}>{row.a}</motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > i ? 1 : 0.1 }}
                                    transition={{ duration: 0.3 }} className={row.b ? "text-slate-900 font-bold" : "text-slate-300"}>{row.b}</motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > i ? 1 : 0.1 }}
                                    transition={{ duration: 0.3 }} className={row.c ? "text-slate-900 font-bold" : "text-slate-300"}>{row.c}</motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > i ? 1 : 0.1 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn("text-sm", row.f ? "text-emerald-500 font-black scale-110" : "text-slate-300")}>
                                    {row.f}
                                </motion.div>
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

                {/* Arrow */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: step > 3 ? 1 : 0 }} transition={{ duration: 0.5 }}
                    className="flex items-center pt-20 text-sky-400">
                    <ArrowRight size={40} className="animate-[pulse_2s_infinite]" />
                </motion.div>

                {/* K-Map */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl">
                    <div className="text-[9px] text-sky-500 font-black tracking-widest uppercase mb-6">K-Map (3 Variable)</div>

                    {/* Column headers */}
                    <div className="flex mb-2">
                        <div className="w-9 text-[9px] text-slate-400 font-black self-end pb-2">A\BC</div>
                        {COLS.map(c => (
                            <div key={c} className="w-[72px] text-center text-[10px] text-slate-400 font-black">{c}</div>
                        ))}
                    </div>

                    {ROWS.map((r) => (
                        <div key={r} className="flex items-center">
                            <div className="w-9 text-xs font-black text-slate-400 text-center">{r}</div>
                            {COLS.map((c, cIdx) => {
                                const bin = r + c;
                                const minterm = parseInt(bin, 2);
                                const isLit = litCells.has(minterm);
                                return (
                                    <motion.div
                                        key={cIdx}
                                        animate={{
                                            background: isLit ? 'rgba(16,185,129,0.05)' : '#F8FAFC',
                                            borderColor: isLit ? '#10B981' : '#E2E8F0',
                                        }}
                                        transition={{ duration: 0.4 }}
                                        className={cn(
                                            "w-[72px] h-[72px] border flex items-center justify-center text-xl font-black relative transition-all duration-500",
                                            isLit ? "text-emerald-500 shadow-[inset_0_0_12px_rgba(16,185,129,0.1)]" : "text-slate-200"
                                        )}
                                    >
                                        <AnimatePresence>
                                            {isLit && (
                                                <motion.span
                                                    initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                >1</motion.span>
                                            )}
                                        </AnimatePresence>
                                        <span className="absolute bottom-1 right-2 text-[8px] font-black text-slate-300 uppercase">
                                            m{minterm}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* AI Insight */}
            <AnimatePresence>
                {step > 7 && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="max-w-3xl mx-auto p-6 bg-white border border-slate-200 rounded-[24px] shadow-lg flex gap-6 items-start">
                        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                            <Info size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-sky-500 font-black uppercase tracking-widest mb-2">Logic Analyst · Engineering Insight</div>
                            <div className="text-sm font-bold text-slate-600 leading-relaxed italic">
                                "Notice how all four 1s in the K-Map are adjacent. A single group of 4 cells eliminates two variables entirely — turning a 3-input AND-OR expression into a single wire. <span className="text-sky-500 font-black">F = C.</span>"
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CTA */}
            <AnimatePresence>
                {showCTA && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                            onClick={onComplete}
                            className="px-10 py-5 bg-sky-500 text-white border-none rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer shadow-xl shadow-sky-100 hover:shadow-sky-200 transition-all flex items-center gap-3 mx-auto"
                        >
                            Open K-Map Explorer <ArrowRight size={18} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
