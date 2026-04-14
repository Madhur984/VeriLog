import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
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

export const S00_D_HexSystem: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    const hexMap = [
        { h: 'A', d: 10, b: '1010' },
        { h: 'B', d: 11, b: '1011' },
        { h: 'C', d: 12, b: '1100' },
        { h: 'D', d: 13, b: '1101' },
        { h: 'E', d: 14, b: '1110' },
        { h: 'F', d: 15, b: '1111' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
            {/* Header */}
            <section className="text-center space-y-4">
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
                >
                    The Professional Choice — Hexadecimal
                </motion.span>
                <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Hexadecimal (Base 16)</h2>
                <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                    Why stop at 9? In Hex, we use letters <span className={subTextColor}>A, B, C, D, E, F</span> to count even further in a single position.
                </p>
            </section>

            <GridCountingSystem 
                base={16} 
                title="Power User's Dream: Hex Counting"
                description="Notice how every single cell is filled, but many have letters. In Hex, '1A' is a perfectly valid number. It's the most efficient way for humans to represent large binary strings."
                isDarkMode={isDarkMode}
            />

            {/* The Alpha Symbols */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
                        <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 ${subTextColor}`}>The A–F Mapping</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                            {hexMap.map((item, i) => (
                                <motion.div 
                                    key={item.h}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={isActive ? { scale: 1, opacity: 1 } : {}}
                                    transition={{ delay: i * 0.05 }}
                                    className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all hover:border-sky-500/50 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}
                                >
                                    <span className="text-2xl font-black text-sky-500">{item.h}</span>
                                    <span className={`text-[10px] font-mono font-bold opacity-40 ${textColor}`}>DEC {item.d}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className={`p-8 rounded-3xl border-2 border-dashed ${isDarkMode ? 'border-sky-500/20 bg-sky-500/5' : 'border-sky-200 bg-sky-50'}`}>
                        <h4 className={`font-mono text-[10px] uppercase tracking-widest mb-4 opacity-40 ${textColor}`}>The 4-Bit Power</h4>
                        <p className="text-sm font-medium leading-relaxed">
                            Since <span className="font-mono text-sky-500 font-bold">2⁴ = 16</span>, one hex digit represents exactly 4 bits (a "nibble"). This is why memory addresses like <span className="font-mono text-sky-400">0x7FFE</span> are so common — they compress long binary strings perfectly.
                        </p>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : {}}
                    className={`p-10 rounded-3xl border border-sky-500/20 bg-gradient-to-b from-sky-500/10 to-transparent flex flex-col justify-center items-center text-center`}
                >
                    <Hexagon size={48} className="text-sky-500 mb-6 mx-auto" />
                    <h3 className={`text-4xl font-black mb-2 ${textColor}`}>0x3F</h3>
                    <p className="text-xs font-mono opacity-50 mb-8 uppercase tracking-widest">Example Breakdown</p>
                    
                    <div className="w-full space-y-4 text-left font-mono text-xs">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-black/20">
                            <span className="opacity-40">3 × 16¹</span>
                            <span className="text-sky-400 font-bold">= 48</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-black/20">
                            <span className="opacity-40">F × 16⁰</span>
                            <span className="text-sky-400 font-bold">= 15</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between items-center p-3">
                            <span className="opacity-40">Total</span>
                            <span className="text-2xl font-black text-sky-400">63</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Mentor Look */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className={`p-10 rounded-[2.5rem] border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100'}`}
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-px bg-sky-500/30" />
                    <span className={`font-mono text-[10px] tracking-widest uppercase ${subTextColor} font-black`}>1 AM Mentor Take</span>
                    <div className="w-8 h-px bg-sky-500/30" />
                </div>
                <p className={`text-xl font-bold leading-tight italic ${textColor}`}>
                    "Binary is too long for humans. Decimal doesn't align with hardware. <span className={subTextColor}>Hex is the compromise</span> — the bridge between the silicon's 0s and 1s and the human brain's pattern recognition."
                </p>
            </motion.div>
        </div>
    );
};
