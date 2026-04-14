import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
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

export const S00_C_OctalSystem: React.FC<Props> = ({ isActive, isDarkMode }) => {
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
                    The Grouping System — Octal
                </motion.span>
                <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Octal System</h2>
                <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                    Base-8 is like Decimal, but we stop counting at 7. This means <strong>8 and 9 are illegal</strong>.
                </p>
            </section>

            <GridCountingSystem 
                base={8} 
                highlightIllegal={true}
                title="Ghost Digits: Octal Doesn't have 8 and 9"
                description="Look at every number that contains an 8 or a 9 (like 08, 19, 88). In Octal, those spots are blank because those digits don't exist in Base-8."
                isDarkMode={isDarkMode}
            />

            {/* Why Octal? */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
                        <h4 className={`font-bold mb-4 flex items-center gap-2 ${textColor}`}>
                            <Layers size={18} className="text-sky-500" />
                            The 3-Bit Rule
                        </h4>
                        <p className="text-sm opacity-70 leading-relaxed font-medium mb-6">
                            Because <span className="font-mono text-sky-500 font-bold">2³ = 8</span>, exactly three binary bits fit into one octal digit. This makes translating between binary and octal incredibly fast.
                        </p>
                        
                        <div className={`p-6 rounded-2xl font-mono text-xs ${isDarkMode ? 'bg-black/40' : 'bg-gray-50'} ${textColor}`}>
                            <div className="flex justify-between mb-2 pb-2 border-b border-white/5">
                                <span className="opacity-40">Binary bits:</span>
                                <span className="text-sky-400 font-black">1 0 1</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-40">Octal digit:</span>
                                <span className="text-sky-400 font-black">5</span>
                            </div>
                        </div>
                    </div>

                    <div className={`p-8 rounded-3xl border-2 border-dashed ${isDarkMode ? 'border-sky-500/20 bg-sky-500/5' : 'border-sky-200 bg-sky-50'}`}>
                        <h4 className={`font-mono text-[10px] uppercase tracking-widest mb-4 opacity-40 ${textColor}`}>Architecture Note</h4>
                        <p className="text-sm font-medium italic">
                            "Octal was the king of the 12-bit, 24-bit, and 36-bit mainframe era. Today, it’s mostly seen in file permissions (chmod 755)."
                        </p>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={isActive ? { opacity: 1, x: 0 } : {}}
                    className={`p-10 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}
                >
                    <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 ${subTextColor}`}>Octal Weights</h3>
                    
                    <div className="flex justify-between gap-2 mb-12">
                        {[
                            { val: '2', weight: '8²', label: '64s' },
                            { val: '4', weight: '8¹', label: '8s' },
                            { val: '7', weight: '8⁰', label: '1s' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <motion.div 
                                    initial={{ scale: 0.8 }}
                                    animate={isActive ? { scale: 1 } : {}}
                                    transition={{ delay: i * 0.1 }}
                                    className={`w-14 h-16 rounded-xl border flex items-center justify-center text-2xl font-black mb-4 ${isDarkMode ? 'bg-white/5 border-white/10 text-sky-400' : 'bg-sky-50 border-sky-200 text-sky-700'}`}
                                >
                                    {item.val}
                                </motion.div>
                                <span className={`font-mono text-xs font-bold ${subTextColor}`}>{item.weight}</span>
                                <span className="font-mono text-[9px] opacity-40 uppercase pt-1">({item.label})</span>
                            </div>
                        ))}
                    </div>

                    <pre className={`font-mono text-[11px] leading-relaxed p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-gray-50'} ${textColor}`}>
{`  (2 × 8²) = 128
+ (4 × 8¹) = 32
+ (7 × 8⁰) = 7
─────────────
Result: 167 (Decimal)`}
                    </pre>
                </motion.div>
            </div>
            {/* Octal counting & Unix Permissions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
                    <h3 className={`text-xl font-black mb-6 ${textColor}`}>The Octal Odometer</h3>
                    <p className="text-sm opacity-60 mb-6 leading-relaxed">
                        In Octal, digits 8 and 9 <strong>do not exist</strong>. When you reach 7, the next number is 10.
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20 p-4">
                        <table className="w-full font-mono text-[10px] text-left">
                            <thead>
                                <tr className="opacity-40 border-b border-white/10 italic">
                                    <th className="pb-2">Dec</th>
                                    <th className="pb-2">Oct</th>
                                    <th className="pb-2">Dec</th>
                                    <th className="pb-2">Oct</th>
                                </tr>
                            </thead>
                            <tbody className={subTextColor}>
                                <tr><td>0</td><td>0</td><td>8</td><td className="font-black text-rose-500">10</td></tr>
                                <tr><td>1</td><td>1</td><td>9</td><td className="font-black text-rose-500">11</td></tr>
                                <tr><td>7</td><td>7</td><td>15</td><td>17</td></tr>
                                <tr><td>-</td><td>-</td><td>16</td><td className="font-black text-sky-400">20</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100 shadow-sm'}`}>
                    <h3 className={`text-xl font-black mb-6 ${textColor}`}>Unix Permissions</h3>
                    <p className="text-sm opacity-60 mb-6 leading-relaxed">
                        When you see <code className="bg-sky-500/20 px-2 py-0.5 rounded text-sky-400">chmod 755</code>, you are using Octal digits to define file access.
                    </p>
                    <div className="space-y-3">
                        <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                            <span className="opacity-40 uppercase">Octal 7</span>
                            <span className="text-emerald-400 font-black">r w x (Full)</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                            <span className="opacity-40 uppercase">Octal 5</span>
                            <span className="text-sky-400 font-black">r - x (Read/Exec)</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
