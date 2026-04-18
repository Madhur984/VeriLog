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
            <motion.span 
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-8`}
            >
                8. Module 03 Conclusion -- Binary Awakened
            </motion.span>

            <h2 className={`text-2xl font-black mb-6 ${textColor}`}>What you should be able to do now:</h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-16`}>
                {[
                    "Convert Dec/Bin/Hex/Oct systems effortlessly",
                    "Understand Propagation Delay constraints",
                    "See CPU math as a chain of binary blocks"
                ].map((skill, index) => (
                    <div key={index} className={`flex items-center gap-3 p-4 rounded-xl ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-sky-50 border-sky-100'} border`}>
                        <div className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center">
                            <ArrowRight size={12} className="text-sky-500" />
                        </div>
                        <span className={`text-sm font-medium ${textColor} opacity-80`}>{skill}</span>
                    </div>
                ))}
            </div>

            <p className={`text-lg max-w-2xl mx-auto mb-16 leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                You have successfully deconstructed the atom of the digital world. 
                All computer logic is built from these tiny binary blocks.
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
