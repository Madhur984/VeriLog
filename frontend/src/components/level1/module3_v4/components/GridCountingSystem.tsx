import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  base: number;
  highlightIllegal?: boolean;
  title: string;
  description: string;
  isDarkMode: boolean;
}

export const GridCountingSystem: React.FC<Props> = ({ 
    base, 
    highlightIllegal = false, 
    title, 
    description,
    isDarkMode 
}) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const borderCol = isDarkMode ? 'border-white/10' : 'border-gray-200';

    const numbers = Array.from({ length: 100 }, (_, i) => {
        const str = i.toString().padStart(2, '0');
        // Check if number contains digits >= base
        const digits = str.split('').map(Number);
        const isIllegal = highlightIllegal && digits.some(d => d >= base);
        return { val: str, isIllegal };
    });

    return (
        <div className="flex flex-col items-center space-y-8 py-8">
            <div className="text-center space-y-2">
                <h3 className={`text-2xl font-black uppercase tracking-tight ${textColor}`}>{title}</h3>
                <p className={`text-sm opacity-60 max-w-lg mx-auto ${textColor}`}>{description}</p>
            </div>

            <div className="w-full max-w-full overflow-x-auto sm:overflow-x-visible -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className={`grid grid-cols-10 gap-1 p-2 w-max mx-auto rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
                    {numbers.map((num, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.005 }}
                            className={`
                                w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md text-[10px] md:text-xs font-mono font-bold
                                transition-colors duration-300
                                ${num.isIllegal
                                    ? 'bg-red-500/80 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                    : isDarkMode ? 'bg-white/5 text-white/40 border border-white/5' : 'bg-gray-50 text-gray-400 border border-gray-100'
                                }
                            `}
                        >
                            {num.val}
                        </motion.div>
                    ))}
                </div>
            </div>

            {highlightIllegal && (
                <div className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 rounded-3xl sm:rounded-full border ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                    <div className="w-2 h-2 flex-shrink-0 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                        Red indicates "Illegal" numbers for Base {base}
                    </p>
                </div>
            )}
        </div>
    );
};
