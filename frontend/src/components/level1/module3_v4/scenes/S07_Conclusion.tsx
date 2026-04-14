import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S07_Conclusion: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const navigate = useNavigate();
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 transition-colors duration-500 ${isDarkMode ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-sky-500 border border-sky-600 shadow-2xl shadow-sky-500/20'}`}
            >
                <Trophy size={40} className={isDarkMode ? 'text-sky-500' : 'text-white'} />
            </motion.div>

            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-8 ${textColor}`}>
                Binary <span className={subTextColor}>Mastered</span>
            </h1>

            <p className={`text-xl max-w-2xl mx-auto mb-16 leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                You have successfully deconstructed the atom of the digital world. 
                The "1" is no longer just a number; it is a physical state, a threshold met, and a logic gate opened.
            </p>

            <div className="flex flex-col md:flex-row gap-6">
                <button
                    onClick={() => navigate('/portal')}
                    className="group px-10 py-5 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-mono text-[11px] font-black tracking-widest uppercase shadow-xl shadow-sky-500/20 transition-all flex items-center gap-4"
                >
                    Return to Portal
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={() => navigate('/')}
                    className={`px-10 py-5 rounded-2xl font-mono text-[11px] font-black tracking-widest uppercase transition-all flex items-center gap-4 border ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                    <Home size={16} />
                    Workstation Home
                </button>
            </div>

            {/* Achievement Toast-like detail */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className={`mt-24 px-8 py-4 rounded-full border flex items-center gap-4 ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}
            >
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                <span className={`font-mono text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
                    UNLOCKED: The Language of Machines
                </span>
                <span className={`text-xs font-black ${subTextColor}`}>+500 XP</span>
            </motion.div>
        </div>
    );
};
