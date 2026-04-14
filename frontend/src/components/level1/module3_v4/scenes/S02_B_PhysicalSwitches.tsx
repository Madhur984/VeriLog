import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Square } from 'lucide-react';
import { useGlobalSensory } from '../../../../hooks/useGlobalSensory';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S02_B_PhysicalSwitches: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
            {/* 3. Interaction Gates — Bits as Physical Switches */}
            <section className="space-y-8">
                <div className="text-center space-y-4">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : {}}
                        className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                    >
                        3. Interaction Gates — Bits as Physical Switches
                    </motion.span>
                    <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Bits as Physical Switches</h2>
                    <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                        In digital logic, we use <strong>Gates</strong> to decide when the light should be ON.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* AND Gate */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={isActive ? { opacity: 1, x: 0 } : {}}
                        className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Zap size={16} className="text-sky-500" />
                            <h3 className={`font-mono text-xs uppercase tracking-widest ${subTextColor}`}>The AND Gate</h3>
                        </div>
                        <p className={`text-sm mb-6 ${textColor} opacity-70`}>
                            Light is ON only if Switch A <strong>AND</strong> Switch B are both ON.
                        </p>
                        <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-gray-50'} ${textColor}`}>
{`A ───[AND]─── Light
B ───/

Truth Table:
A | B | Out
--|---|----
0 | 0 | 0
0 | 1 | 0
1 | 0 | 0
1 | 1 | 1 (ON!)`}
                        </pre>
                    </motion.div>

                    {/* OR Gate */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={isActive ? { opacity: 1, x: 0 } : {}}
                        className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100 shadow-sm'}`}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Square size={16} className={subTextColor} />
                            <h3 className={`font-mono text-xs uppercase tracking-widest ${subTextColor}`}>The OR Gate</h3>
                        </div>
                        <p className={`text-sm mb-6 ${textColor} opacity-70`}>
                            Light is ON if Switch A <strong>OR</strong> Switch B is ON.
                        </p>
                        <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-white/50 border border-sky-100'} ${textColor}`}>
{`A ───[OR]─── Light
B ───/

Truth Table:
A | B | Out
--|---|----
0 | 0 | 0
0 | 1 | 1
1 | 0 | 1
1 | 1 | 1`}
                        </pre>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};
