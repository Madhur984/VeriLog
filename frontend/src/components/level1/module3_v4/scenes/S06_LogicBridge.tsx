import React from 'react';
import { motion } from 'framer-motion';
import { SceneLogicBridge } from '../../../level3/SceneLogicBridge';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
  onEnterLabs?: () => void;
}

export const S06_LogicBridge: React.FC<Props> = ({ isActive, isDarkMode, onEnterLabs }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* 7. Logic Bridge -- From Physics to Code */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
            <motion.span 
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
            >
                7. Logic Bridge -- From Physics to Code
            </motion.span>
            <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Hierarchy</h2>
            <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                How bits become thoughts. The journey from physical electrons to abstract intelligence.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* The Stack Diagram */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-white/10 shadow-2xl shadow-sky-500/10' : 'bg-white border-gray-100 shadow-xl'}`}
            >
                <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 ${subTextColor}`}>The Silicon Stack</h3>
                <div className="space-y-2 font-mono text-xs">
                    {[
                        { level: "Level 3", name: "ALU/CPU", icon: "", color: "text-sky-400" },
                        { level: "Level 2", name: "REGISTERS/MEM", icon: "", color: "text-sky-500" },
                        { level: "Level 1", name: "LOGIC GATES", icon: "", color: "text-sky-600" },
                        { level: "Base", name: "PHYSICAL VOLTAGE", icon: "[!] ", color: "text-orange-500" }
                    ].map((item, i) => (
                        <div key={i} className={`group flex items-center p-3 rounded-xl border border-transparent hover:border-sky-500/20 hover:bg-sky-500/5 transition-all duration-300`}>
                            <span className="w-16 opacity-30 text-[9px] font-black">{item.level}</span>
                            <span className={`flex-1 font-black tracking-widest ${item.color}`}>{item.name}</span>
                            <span>{item.icon}</span>
                        </div>
                    ))}
                </div>
                <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                    <pre className={`text-[10px] opacity-40 leading-tight ${textColor}`}>
{`[ ABSTRACT INTEL ]
       [^]
        (Architecture)
       [v]
[ PHYSICAL MATTER ]
`}
                    </pre>
                </div>
            </motion.div>

            <div className="space-y-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-4 text-sky-500">
                        <div className="w-1 h-10 bg-sky-500 rounded-full" />
                        <h3 className="text-2xl font-black italic">Putting It All Together</h3>
                    </div>
                    <p className={`text-sm opacity-60 leading-relaxed ${textColor}`}>
                        A single logic gate is trivial. But billions of them, organized into <strong>Hierarchies</strong>, create the modern world. You have seen how a voltage threshold becomes a bit, how bits become numbers, and how numbers become calculations.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-3xl mb-2">[!] </div>
                        <div className="text-[10px] font-bold uppercase opacity-40 mb-1">Reality</div>
                        <div className="text-sm font-black">Electrons</div>
                    </div>
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-3xl mb-2"></div>
                        <div className="text-[10px] font-bold uppercase opacity-40 mb-1">Logic</div>
                        <div className="text-sm font-black">Truth</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 1 AM Mentor Take */}
      <div className={`p-8 rounded-[2.5rem] text-center ${isDarkMode ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-sky-50 border border-sky-100'}`}>
          <p className={`font-mono text-xs font-black mb-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
              "1 AM Mentor Take"
          </p>
          <p className={`text-xl md:text-2xl font-medium italic ${textColor} max-w-3xl mx-auto leading-tight`}>
              "Everything you see on a screen--every pixel, every AI thought, every line of code--is just a carefully arranged sequence of <strong>silicon switches</strong> closing and opening. You now see the code behind reality."
          </p>
      </div>
    </div>
    );
};
