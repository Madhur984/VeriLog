import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import type { VarCount } from './KMapEngine';

interface Props {
    variables: VarCount;
    groups: string[][];
    expression: string;
    onComplete: () => void;
    isDarkMode?: boolean;
}

const GRAY_1 = ['0', '1'];
const GRAY_2 = ['00', '01', '11', '10'];

const GROUP_COLORS = [
    { bg: 'bg-amber-500/10', border: 'border-amber-500', text: 'text-amber-500', shadow: 'shadow-amber-500/20' }, // Amber
    { bg: 'bg-emerald-500/10', border: 'border-emerald-500', text: 'text-emerald-500', shadow: 'shadow-emerald-500/20' }, // Emerald
    { bg: 'bg-violet-500/10', border: 'border-violet-500', text: 'text-violet-500', shadow: 'shadow-violet-500/20' }, // Violet
    { bg: 'bg-pink-500/10', border: 'border-pink-500', text: 'text-pink-500', shadow: 'shadow-pink-500/20' }, // Pink
];

export const BooleanSimplification: React.FC<Props> = ({ variables, groups, onComplete, isDarkMode = true }) => {
    // We expect students to type the boolean term for each group (e.g. A'C or a'c or !A&C)
    // We will normalize it to basic uppercase letters for comparison.
    const [inputs, setInputs] = useState<Record<number, string>>({});
    const [feedback, setFeedback] = useState<Record<number, boolean>>({});

    const derivationSteps = useMemo(() => {
        return groups.map(group => {
            const cols_gray = variables === 2 ? GRAY_1 : GRAY_2;
            const rows_gray = variables === 4 ? GRAY_2 : GRAY_1;
            const rowVars = variables === 4 ? 'AB' : 'A';
            const colVars = variables === 2 ? 'B' : (variables === 3 ? 'BC' : 'CD');
            const allVars = rowVars + colVars;

            const bitStrings = group.map(cell => {
                const [r, c] = cell.split('-').map(Number);
                return rows_gray[r] + cols_gray[c];
            });

            const steps = [];
            let term = '';
            for (let i = 0; i < allVars.length; i++) {
                const bits = new Set(bitStrings.map(bs => bs[i]));
                const isConstant = bits.size === 1;
                const value = Array.from(bits)[0];
                steps.push({ var: allVars[i], isConstant, value });
                if (isConstant) {
                    term += value === '1' ? allVars[i] : allVars[i] + "'";
                }
            }
            return { term, steps, bitStrings };
        });
    }, [groups, variables]);

    const correctTerms = useMemo(() => derivationSteps.map(d => d.term), [derivationSteps]);

    const normalize = (s: string) => s.toUpperCase().replace(/\s/g, '').replace(/!/g, "'").replace(/~/g, "'").replace(/&/g, '').replace(/\*/g, '');

    const handleInput = (idx: number, val: string) => {
        setInputs(prev => ({ ...prev, [idx]: val }));
        if (normalize(val) === normalize(correctTerms[idx])) {
            setFeedback(prev => ({ ...prev, [idx]: true }));
        } else {
            setFeedback(prev => ({ ...prev, [idx]: false }));
        }
    };

    const allCorrect = groups.length > 0 && groups.every((_, i) => feedback[i]);

    return (
        <div className="flex flex-col gap-8 px-10 max-w-4xl mx-auto font-mono w-full">
            <div className="text-center mb-4">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-cyan-500 font-black mb-2 block">
                    Scene 5.5 - Simplification
                </span>
                <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Deriving the Expression
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-sans font-medium max-w-2xl mx-auto leading-relaxed`}>
                    For each highlighted group, identify the variables that remain constant. <br />
                    Type the simplified product term. Use <code className="text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">A'</code> or <code className="text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">!A</code> for NOT A.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {groups.map((group, idx) => {
                    const color = GROUP_COLORS[idx % GROUP_COLORS.length];
                    const isCorrect = feedback[idx];

                    return (
                        <div key={idx} className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col gap-5 ${
                            isCorrect 
                            ? `${isDarkMode ? 'bg-emerald-950/20' : 'bg-emerald-50/50'} border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]`
                            : `${isDarkMode ? 'bg-slate-900' : 'bg-white'} ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} shadow-lg`
                        }`}>
                            <div className="flex items-center gap-6">
                                {/* Group Preview */}
                                <div className={`w-20 h-16 rounded-xl border flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0 ${color.bg} ${color.border} ${color.text}`}>
                                    <div className="text-xs font-bold z-10">Group {idx + 1}</div>
                                    <div className="text-[10px] opacity-80 z-10">{group.length} cells</div>
                                    <div className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
                                </div>

                                <ChevronRight className={isDarkMode ? 'text-slate-600' : 'text-slate-400'} />

                                {/* Variable Analysis */}
                                <div className="flex-1 flex gap-3 flex-wrap">
                                    {derivationSteps[idx].steps.map((s, si) => (
                                        <div key={si} className={`px-4 py-2 rounded-lg border flex flex-col items-center min-w-[50px] ${
                                            s.isConstant 
                                                ? `bg-cyan-500/5 border-cyan-500/20 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}` 
                                                : `bg-rose-500/5 border-rose-500/20 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`
                                        }`}>
                                            <div className="text-[10px] font-bold mb-1 opacity-80">{s.var}</div>
                                            <div className={`text-lg font-black ${s.isConstant ? '' : 'line-through opacity-50'}`}>
                                                {s.isConstant ? s.value : 'X'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Input Field */}
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={inputs[idx] || ''}
                                        onChange={e => handleInput(idx, e.target.value)}
                                        placeholder="Type the product term..."
                                        disabled={isCorrect}
                                        className={`w-full py-4 px-6 rounded-xl font-mono text-lg outline-none transition-all duration-300 tracking-[0.1em] ${
                                            isCorrect 
                                                ? `bg-emerald-500/10 border border-emerald-500/50 text-emerald-500` 
                                                : `${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-500'} border`
                                        }`}
                                    />
                                    <AnimatePresence>
                                        {isCorrect && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }} 
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"
                                            >
                                                <CheckCircle2 size={24} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence>
                {allCorrect && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-6 mt-8 p-10 rounded-3xl bg-cyan-500/5 border border-cyan-500/20"
                    >
                        <div className="text-center font-mono">
                            <div className="text-xs text-cyan-500 tracking-[0.2em] font-bold uppercase mb-2">Final Expression</div>
                            <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-wider`}>
                                F = {correctTerms.join(' + ')}
                            </div>
                        </div>
                        <button
                            onClick={onComplete}
                            className={`px-8 py-4 rounded-xl font-mono text-sm font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-3 ${
                                isDarkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-cyan-600 text-white hover:bg-cyan-500 hover:shadow-lg'
                            }`}
                        >
                            Compare Circuits <ChevronRight size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
