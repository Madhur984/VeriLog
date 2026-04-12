import React, { memo } from 'react';
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
 * Sidebar (Optimized)
 * Clean, wider sidebar from friend's version, refined for scientific minimalism.
 * Memoized to prevent re-renders from the main animation clock.
 */
const SidebarComponent: React.FC<SidebarProps> = ({ 
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
      <header className="p-8 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <Activity className="text-orange-500" size={18} />
            </div>
            <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Digital Bridge</h2>
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30 mt-1 font-bold">Scientific Lab</p>
            </div>
        </div>
      </header>

      <nav className="p-8 flex-1">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-10 text-white/20 font-black">Foundation Path</p>
        <div className="flex flex-col gap-4">
          {sections.map(s => {
            const isActive = activeSection === s.id;
            return (
                <button 
                  key={s.id} 
                  onClick={() => onSectionClick(s.id)}
                  className={`
                    group relative block w-full text-left py-3.5 px-5 rounded-2xl text-[11px] font-black tracking-tight transition-all duration-500
                    ${isActive 
                      ? 'text-orange-500 bg-orange-500/10 border border-orange-500/20 shadow-xl shadow-orange-500/5 translate-x-1' 
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'}
                  `}
                >
                    {/* Active Indicator Bar */}
                    {isActive && (
                        <motion.div 
                            layoutId="active-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-orange-500 rounded-r-full shadow-[0_0_12px_rgba(249,115,22,0.6)]"
                        />
                    )}
                    
                    <span className="relative z-10 transition-transform group-hover:translate-x-1 inline-block uppercase tracking-wider">
                        {s.label}
                    </span>
                </button>
            );
          })}
        </div>
      </nav>

      <footer className="mt-auto p-8 border-t space-y-8" style={{ borderColor }}>
        {/* Progress Display */}
        <div className="space-y-4 px-2">
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/20 font-black">Proficiency</span>
                <span className="text-sm font-black text-white italic tracking-tighter">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                />
            </div>
        </div>

        <button 
            onClick={toggleTheme} 
            className="w-full h-14 flex items-center justify-center gap-3 rounded-[1.25rem] border border-white/5 bg-white/5 text-[10px] uppercase font-black tracking-[0.2em] text-white/50 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300 active:scale-[0.98]"
        >
            {isDarkMode ? <Sun size={14} className="text-orange-500" /> : <Moon size={14} className="text-cyan-500" />} 
            {isDarkMode ? 'Photon Pulse' : 'Singularity'}
        </button>
      </footer>
    </div>
  );
};

export const Sidebar = memo(SidebarComponent);
