import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Activity } from 'lucide-react';

interface Section {
  id: string;
  label: string;
}

interface SidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionClick: (id: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  progress: number;
}

/**
 * Sidebar
 * Clean, wider sidebar from friend's version, refined for scientific minimalism.
 */
export const Sidebar: React.FC<SidebarProps> = ({ 
  sections, 
  activeSection, 
  onSectionClick, 
  isDarkMode, 
  toggleTheme,
  progress
}) => {
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)';
  const bgColor = isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.8)';

  return (
    <div className="w-[300px] flex-shrink-0 border-r flex flex-col z-10 overflow-y-auto backdrop-blur-xl" style={{ background: bgColor, borderColor }}>
      <div className="p-8 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Activity className="text-orange-500" size={16} />
            </div>
            <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">The Digital Bridge</h2>
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">ADC Theory & Practice</p>
            </div>
        </div>
      </div>

      <div className="p-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-8 text-white/20">Learning Path</p>
        <div className="flex flex-col gap-3">
          {sections.map(s => {
            const isActive = activeSection === s.id;
            return (
                <button 
                  key={s.id} 
                  onClick={() => onSectionClick(s.id)}
                  className={`
                    group relative block w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300
                    ${isActive 
                      ? 'text-orange-500 bg-orange-500/5 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                      : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'}
                  `}
                >
                    {/* Active Indicator Bar */}
                    {isActive && (
                        <motion.div 
                            layoutId="active-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-orange-500 rounded-r-full"
                        />
                    )}
                    
                    <span className="relative z-10 transition-transform group-hover:translate-x-1 inline-block">
                        {s.label}
                    </span>
                </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-8 border-t space-y-6" style={{ borderColor }}>
        {/* Progress Display */}
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/20">System Proficiency</span>
                <span className="text-sm font-black text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-orange-500"
                />
            </div>
        </div>

        <button 
            onClick={toggleTheme} 
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-white/5 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} 
            {isDarkMode ? 'Photon Mode' : 'Void Mode'}
        </button>
      </div>
    </div>
  );
};
