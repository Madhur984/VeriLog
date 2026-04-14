import React from 'react';
import { motion } from 'framer-motion';
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

export const S00_A_DecimalSystem: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
            {/* Header */}
            <section className="text-center space-y-4">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    Foundation — Number Systems
                </motion.span>
                <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Decimal System</h2>
                <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                    Our standard base-10 system. Every number from 00 to 99 is valid because we have all digits from 0-9.
                </p>
            </section>

            <GridCountingSystem 
                base={10} 
                title="Down the Memory Lane: Decimal Counting"
                description="Think of this like an infinite scroll of all possible 2-digit combinations. In Decimal, they are all 'legal'."
                isDarkMode={isDarkMode}
            />

            {/* Visual Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={isActive ? { opacity: 1, x: 0 } : {}}
                    className={`p-10 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}
                >
                    <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 ${subTextColor}`}>Place Value Decomposition</h3>
                    
                    <div className="flex justify-between items-end gap-2 mb-12">
                        {[
                            { val: '3', weight: '10³', label: '1000s' },
                            { val: '7', weight: '10²', label: '100s' },
                            { val: '2', weight: '10¹', label: '10s' },
                            { val: '5', weight: '10⁰', label: '1s' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={isActive ? { scale: 1, opacity: 1 } : {}}
                                    transition={{ delay: i * 0.1 }}
                                    className={`w-12 h-16 rounded-xl border flex items-center justify-center text-2xl font-black mb-4 ${isDarkMode ? 'bg-white/5 border-white/10 text-sky-400' : 'bg-sky-50 border-sky-200 text-sky-700'}`}
                                >
                                    {item.val}
                                </motion.div>
                                <span className="font-mono text-[10px] opacity-40 uppercase tracking-tighter mb-1">{item.label}</span>
                                <span className={`font-mono text-xs font-bold ${subTextColor}`}>{item.weight}</span>
                            </div>
                        ))}
                    </div>

                    <pre className={`font-mono text-[11px] leading-relaxed p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-gray-50'} ${textColor}`}>
{`3000   (3 × 1000)
+ 700   (7 × 100)
+  20   (2 × 10)
+   5   (5 × 1)
───────
 3725   Final Value`}
                    </pre>
                </motion.div>

                <div className="space-y-8">
                    {/* The Odometer Analogy */}
                    <section className={`p-8 md:p-12 rounded-[2.5rem] border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                        <h3 className={`text-2xl font-black mb-4 ${textColor}`}>The Odometer Model</h3>
                        <p className="text-sm opacity-70 leading-relaxed mb-6">
                            Imagine a car's odometer. You count 0, 1, 2... 8, 9. Now you've run out of digits! To represent "ten", the right wheel resets to <strong>0</strong> and the wheel to its left clicks to <strong>1</strong>.
                        </p>
                        <div className="flex gap-2">
                            {['0', '0', '1', '0'].map((val, i) => (
                                <div key={i} className={`w-10 h-14 rounded-lg border-2 flex items-center justify-center font-mono text-xl font-bold ${isDarkMode ? 'bg-black border-white/20 text-white' : 'bg-white border-gray-300 shadow-inner text-gray-800'}`}>
                                    {val}
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-[10px] opacity-40 uppercase font-bold tracking-widest mb-6">State: 10 Decimal</p>

                        <div className="grid grid-cols-1 gap-4">
                            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-white shadow-md'} border border-sky-500/20`}>
                                <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${subTextColor}`}>What happens after 9?</h4>
                                <p className="text-xs opacity-70 leading-relaxed">
                                    9 + 1 = <span className="font-mono text-sky-400 font-bold">1 0</span>. <br/>
                                    There is no single symbol for ten. We use <strong>Positional Overflow</strong>.
                                </p>
                            </div>
                            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-white shadow-md'} border border-transparent`}>
                                <h4 className={`text-xs font-black uppercase tracking-widest mb-2 opacity-40 ${textColor}`}>Base 10 Meaning</h4>
                                <ul className="text-xs space-y-2 opacity-70">
                                    <li>• 10 Symbols (0-9)</li>
                                    <li>• Each position is 10× bigger than its right</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Mentor Take */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className={`p-10 rounded-[2.5rem] border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100'}`}
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-px bg-sky-500/30" />
                    <span className={`font-mono text-[10px] tracking-widest uppercase ${subTextColor} font-black`}>1 AM Mentor Take</span>
                    <div className="w-8 h-px bg-sky-500/30" />
                </div>
                <p className={`text-xl font-bold leading-tight italic ${textColor}`}>
                    "We use Base 10 because we have 10 fingers. It's an <span className={subTextColor}>arbitrary biology-based choice</span>. Computers have 2 'fingers' (on and off), so they use Base 2."
                </p>
            </motion.div>
        </div>
    );
};
