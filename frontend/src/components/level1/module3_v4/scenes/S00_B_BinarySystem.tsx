import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Binary } from 'lucide-react';
import { GridCountingSystem } from '../components/GridCountingSystem';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

const T = {
    bg: '#0A0B10', card: '#0D0F16', surface: '#1A1D24', border: '#2D3139',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

export const S00_B_BinarySystem: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    const weights = [128, 64, 32, 16, 8, 4, 2, 1];

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
            {/* Header */}
            <section className="text-center space-y-4">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    The Silicon Language — Binary
                </motion.span>
                <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Binary System</h2>
                <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                    Your phone's processor is extremely simple at heart. It doesn't know 2, 3, or 9. It only knows <strong>0 and 1</strong>.
                </p>
            </section>

            <GridCountingSystem 
                base={2} 
                highlightIllegal={true}
                title="Our Best Friends: Binary (0 and 1)"
                description="Look at the grid below. Most of the 'decimal' numbers we know (like 25, 42, or 99) are illegal in Binary. Only 00, 01, 10, and 11 would be valid 2-digit binary numbers."
                isDarkMode={isDarkMode}
            />

            {/* Binary Weights Chart */}
            <div className={`p-8 rounded-[2rem] border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
                <h3 className={`font-mono text-xs uppercase tracking-widest mb-10 text-center ${subTextColor}`}>The Power Grid (Powers of 2)</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {weights.map((w, i) => (
                        <motion.div 
                            key={w}
                            initial={{ y: 20, opacity: 0 }}
                            animate={isActive ? { y: 0, opacity: 1 } : {}}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col items-center group"
                        >
                            <div className={`w-full aspect-square rounded-2xl border flex items-center justify-center font-black text-xl mb-4 transition-all group-hover:scale-105 ${isDarkMode ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 group-hover:bg-sky-500/20' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                {w}
                            </div>
                            <span className="font-mono text-[9px] opacity-40 uppercase mb-1">2^{7-i}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Visual Example: 1101 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : {}}
                    className={`p-10 rounded-3xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20 shadow-2xl shadow-sky-900/10' : 'bg-sky-50 border-sky-100 shadow-xl'}`}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Binary size={18} className="text-sky-500" />
                        <h4 className={`font-black uppercase tracking-widest text-sm ${textColor}`}>Binary Decomposition: 1101</h4>
                    </div>

                    <div className="flex justify-between gap-2 mb-10">
                        {['1', '1', '0', '1'].map((bit, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className={`w-10 h-14 rounded-lg flex items-center justify-center text-xl font-black ${bit === '1' ? 'bg-sky-500 text-white shadow-[0_0_15px_#0ea5e9]' : 'bg-slate-200/20 text-slate-400'}`}>
                                    {bit}
                                </div>
                                <span className="mt-3 font-mono text-[10px] font-bold opacity-60">× {Math.pow(2, 3-i)}</span>
                            </div>
                        ))}
                    </div>

                    <pre className={`font-mono text-[11px] leading-relaxed p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-white/50 shadow-inner'} ${textColor}`}>
{`  (1 × 2³) = 8
+ (1 × 2²) = 4
+ (0 × 2¹) = 0
+ (1 × 2⁰) = 1
─────────────
Result: 13 (Decimal)`}
                    </pre>
                </motion.div>

                <div className="space-y-6">
                    <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
                        <h4 className={`font-bold mb-4 flex items-center gap-2 ${textColor}`}>
                            <Zap size={16} className="text-amber-500" />
                            The Bit
                        </h4>
                        <p className="text-sm opacity-70 leading-relaxed font-medium">
                            A <span className={subTextColor}>Bit</span> (Binary Digit) is the smallest unit of information. It's either 0 or 1. No middle ground. This lack of ambiguity is why binary is so reliable.
                        </p>
                    </div>

                    <div className={`p-8 rounded-3xl border-2 border-dashed ${isDarkMode ? 'border-sky-500/20 bg-sky-500/5' : 'border-sky-200 bg-sky-50'}`}>
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2 opacity-50">Observation</div>
                        <p className="text-sm font-semibold italic leading-relaxed">
                            "In binary, every position to the left is exactly double the value of the position to its right. It's the ultimate geometric progression."
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Callout */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                className={`p-10 rounded-[2.5rem] bg-gradient-to-br from-sky-500/10 to-transparent border ${isDarkMode ? 'border-sky-500/20' : 'border-sky-100'}`}
            >
                <p className={`text-xl font-black leading-tight text-center ${textColor}`}>
                    Total Binary Value = <span className="text-sky-500">Σ (Digit × 2^Position)</span>
                </p>
            </motion.div>
            {/* Light Switches & Binary Counting */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
                    <h3 className={`text-xl font-black mb-6 ${textColor}`}>The Light Switch Model</h3>
                    <p className="text-sm opacity-60 mb-8 leading-relaxed">
                        Each bit is like a light switch. Together, they create values.
                    </p>
                    <div className="flex justify-center gap-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-16 rounded-lg bg-sky-500 shadow-[0_0_20px_#0ea5e9] flex items-center justify-center text-white border-2 border-white/20">
                                <span className="text-[10px] font-black uppercase rotate-90">ON</span>
                            </div>
                            <span className="font-mono font-black text-sky-400">1</span>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 border-2 border-white/5 opacity-50">
                                <span className="text-[10px] font-black uppercase rotate-90">OFF</span>
                            </div>
                            <span className="font-mono font-black text-slate-500">0</span>
                        </div>
                    </div>
                </div>

                <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20 shadow-2xl shadow-sky-900/10' : 'bg-sky-50 border-sky-100 shadow-xl'}`}>
                    <h3 className={`text-xl font-black mb-6 ${textColor}`}>Binary Odometer</h3>
                    <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20 p-4">
                        <table className="w-full font-mono text-[10px] text-left">
                            <thead>
                                <tr className="opacity-40 border-b border-white/10 italic text-[9px]">
                                    <th className="pb-2">Dec</th>
                                    <th className="pb-2 text-sky-400">Binary</th>
                                    <th className="pb-2">Dec</th>
                                    <th className="pb-2 text-sky-400">Binary</th>
                                </tr>
                            </thead>
                            <tbody className={textColor}>
                                <tr><td>0</td><td className="font-black">0000</td><td>8</td><td className="font-black text-rose-500">1000</td></tr>
                                <tr><td>1</td><td className="font-black">0001</td><td>9</td><td className="font-black">1001</td></tr>
                                <tr><td>2</td><td className="font-black text-sky-400">0010</td><td>15</td><td className="font-black">1111</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};
