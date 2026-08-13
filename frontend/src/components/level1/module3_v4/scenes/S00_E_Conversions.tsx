import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, CornerDownRight } from 'lucide-react';
import { useBinaryStore } from '../../../../stores/binaryStore';

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

export const S00_E_Conversions: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
    const systemTemperature = useBinaryStore(state => state.systemTemperature);

    const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '14, 165, 233';

    return (
        <div className="max-w-5xl mx-auto space-y-24 py-12 transition-all duration-1000" style={{
            filter: systemTemperature > 0.1 ? `drop-shadow(0 0 ${systemTemperature * 30}px rgba(${glowColor}, 0.2))` : 'none'
        }}>
            {/* Header */}
            <section className="text-center space-y-4">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[11px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    Reference - Transitions
                </motion.span>
                <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Art of Conversion</h2>
                <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                    How we move between the worlds. There are two primary methods you need to master.
                </p>
            </section>

            {/* Method A: Decimal to Any */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={isActive ? { opacity: 1, x: 0 } : {}}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 font-bold">A</div>
                        <h3 className={`text-2xl font-black ${textColor}`}>The Remainder Method</h3>
                    </div>
                    <p className="text-sm opacity-70 leading-relaxed font-medium">
                        To convert <span className="font-bold">Decimal to Any Base</span>, repeatedly divide by that base and collect the remainders from <span className="text-sky-400">bottom to top</span>.
                    </p>
                    
                    <div className={`p-5 sm:p-8 rounded-3xl border border-sky-500/20 bg-sky-500/5 relative overflow-hidden`}>
                    <div className="mb-3 sm:mb-0 sm:absolute sm:top-4 sm:right-4 text-[11px] font-mono opacity-20 uppercase tracking-widest italic">Example: 25 to Binary</div>
                        <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto ${subTextColor}`}>
{`25 / 2 = 12  remainder: 1  (LSB)
12 / 2 = 6   remainder: 0
6 / 2 = 3    remainder: 0
3 / 2 = 1    remainder: 1
1 / 2 = 0    remainder: 1  (MSB)

Result: 11001`}
                        </pre>
                        <div className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter opacity-40">
                            <CornerDownRight size={12} /> Read direction: MSB to LSB
                        </div>
                    </div>
                </motion.div>

                {/* Method B: Any to Decimal */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={isActive ? { opacity: 1, x: 0 } : {}}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 font-bold">B</div>
                        <h3 className={`text-2xl font-black ${textColor}`}>The Weight Method</h3>
                    </div>
                    <p className="text-sm opacity-70 leading-relaxed font-medium">
                        To convert <span className="font-bold">Any Base to Decimal</span>, multiply each digit by its positional weight and sum the results.
                    </p>

                    <div className={`p-5 sm:p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 relative overflow-hidden`}>
                        <div className="mb-3 sm:mb-0 sm:absolute sm:top-4 sm:right-4 text-[11px] font-mono opacity-20 uppercase tracking-widest italic">Example: 1011 (Bin) to Dec</div>
                        <pre className={`font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto text-amber-500/80`}>
{`1 0 1 1
| | | +-- (1 * 2^0) = 1
| | +---- (1 * 2^1) = 2
| +------ (0 * 2^2) = 0
+-------- (1 * 2^3) = 8
                  ----
          Total:   11`}
                        </pre>
                        <div className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-tighter opacity-40">
                             Sigma Summation
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* The Golden Rule */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className={`p-6 sm:p-10 rounded-[2.5rem] border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20 shadow-2xl shadow-sky-900/10' : 'bg-sky-50 border-sky-100 shadow-xl'}`}
            >
                <div className="text-center space-y-4">
                    <h3 className={`text-2xl font-black ${textColor}`}>Universal Positional Theorem</h3>
                    <p className={`text-sm opacity-60 max-w-2xl mx-auto leading-relaxed ${textColor}`}>
                        No matter the base, the value of any number is simply the sum of its digits multiplied by the base raised to its position.
                    </p>
                    <div className={`mt-8 p-4 sm:p-6 rounded-2xl font-mono text-base sm:text-xl font-black break-words ${isDarkMode ? 'bg-black/40 text-sky-400' : 'bg-white text-sky-600 shadow-sm'}`}>
                        V = Sum (Digit * Base^Position)
                    </div>
                </div>
            </motion.div>

            {/* Quick Chart */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className={`overflow-hidden rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}
            >
                <div className={`p-6 border-b flex items-center gap-3 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                    <ArrowLeftRight size={16} className="text-sky-500" />
                    <h4 className={`font-mono text-xs uppercase tracking-widest ${textColor}`}>Master Conversion Chart (0-15)</h4>
                </div>
                <div className={`grid grid-cols-2 sm:grid-cols-4 divide-x font-mono text-[11px] ${isDarkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
                    <div className="p-4 space-y-2">
                        <div className="opacity-40 uppercase mb-2">Decimal</div>
                        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(v => <div key={v} className={textColor}>{v}</div>)}
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="opacity-40 uppercase mb-2 text-sky-400">Binary</div>
                        {[
                            '0000','0001','0010','0011','0100','0101','0110','0111',
                            '1000','1001','1010','1011','1100','1101','1110','1111'
                        ].map(v => <div key={v} className="text-sky-400">{v}</div>)}
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="opacity-40 uppercase mb-2 text-amber-500">Octal</div>
                        {[0,1,2,3,4,5,6,7,10,11,12,13,14,15,16,17].map(v => <div key={v} className="text-amber-500">{v}</div>)}
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="opacity-40 uppercase mb-2 text-emerald-400">Hex</div>
                        {['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'].map(v => <div key={v} className="text-emerald-400">{v}</div>)}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
