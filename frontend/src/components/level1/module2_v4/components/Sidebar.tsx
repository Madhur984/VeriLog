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
  const borderColor = isDarkMode ? 'rgba(249, 115, 22, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  const sidebarBg = isDarkMode ? '#040200' : '#f9fafb';
  const textColor = isDarkMode ? 'text-orange-50' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-orange-500/60' : 'text-orange-600';

  return (
    <div className="w-[300px] flex-shrink-0 border-r flex flex-col z-10 overflow-y-auto transition-colors duration-500" style={{ background: sidebarBg, borderColor }}>
      <header className="p-8 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 shadow-orange-500/5' : 'bg-orange-500 shadow-orange-500/20 border-orange-600'}`}>
                <Activity className={isDarkMode ? 'text-orange-500' : 'text-white'} size={18} />
            </div>
            <div>
                <h2 className={`text-sm font-bold tracking-tight ${textColor}`}>Digital Bridge</h2>
                <p className={`text-[10px] font-mono uppercase tracking-widest mt-1 font-bold ${subTextColor}`}>Module 02</p>
            </div>
        </div>
      </header>

      <nav className="p-8 flex-1">
        <p className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-6 ${isDarkMode ? 'text-orange-900' : 'text-gray-400'}`}>Foundation Path</p>
        <div className="flex flex-col gap-2">
          {sections.map(s => {
            const isActive = activeSection === s.id;
            return (
                <button 
                  key={s.id} 
                  onClick={() => onSectionClick(s.id)}
                  className={`
                    group relative block w-full text-left py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? (isDarkMode ? 'text-orange-400 bg-orange-950/30 border border-orange-500/20 translate-x-1' : 'text-orange-600 bg-orange-50 border border-orange-200 shadow-sm translate-x-1') 
                      : (isDarkMode ? 'text-orange-800 hover:text-orange-400 hover:bg-orange-950/20 border border-transparent' : 'text-gray-500 hover:text-orange-600 hover:bg-gray-100 border border-transparent')}
                  `}
                >
                    <span className="relative z-10 inline-block">
                        {s.label}
                    </span>
                    {isActive && (
                        <motion.div 
                            layoutId="active-pill"
                            className="absolute inset-0 bg-transparent rounded-xl"
                        />
                    )}
                </button>
            );
          })}
        </div>
      </nav>

      <footer className="mt-auto p-8 border-t space-y-8" style={{ borderColor }}>
        {/* Progress Display */}
        <div className="space-y-4 px-1">
            <div className="flex justify-between items-end">
                <span className={`text-[10px] font-mono uppercase tracking-[0.1em] font-black ${isDarkMode ? 'text-orange-900' : 'text-gray-400'}`}>Completion</span>
                <span className={`text-sm font-bold italic tracking-tighter ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`}>{Math.round(progress)}%</span>
            </div>
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-orange-950/20 shadow-inner' : 'bg-gray-200'}`}>
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
            className={`w-full h-12 flex items-center justify-center gap-3 rounded-xl border font-bold text-[11px] uppercase tracking-widest transition-all duration-300 active:scale-[0.98] ${isDarkMode 
                ? 'border-orange-900/40 text-orange-400 hover:bg-orange-950/30' 
                : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
        >
            {isDarkMode ? <Sun size={14} className="text-orange-500" /> : <Moon size={14} className="text-orange-600" />} 
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </footer>
    </div>
  );
};

export const Sidebar = memo(SidebarComponent);
