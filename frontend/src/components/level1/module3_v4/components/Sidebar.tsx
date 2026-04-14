import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Cpu, Activity } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  hidden?: boolean;
}

interface SidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionClick: (id: string) => void;
  onEnterLabs?: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  progress: number;
}

/**
 * Module 3 Sidebar
 * Clean, wider sidebar from friend's version, refined for scientific minimalism.
 * Uses Cyan/Sky Blue theme to differentiate from Module 2.
 */
const SidebarComponent: React.FC<SidebarProps> = ({ 
  sections, 
  activeSection, 
  onSectionClick, 
  onEnterLabs,
  isDarkMode, 
  toggleTheme,
  progress
}) => {
  const borderColor = isDarkMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  const sidebarBg = isDarkMode ? '#040b15' : '#f9fafb'; // Deep Navy Blue for Module 3 dark mode
  const textColor = isDarkMode ? 'text-sky-50' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-sky-400/60' : 'text-sky-600';

  return (
    <div className="w-[300px] flex-shrink-0 border-r flex flex-col z-10 overflow-y-auto transition-colors duration-500" style={{ background: sidebarBg, borderColor }}>
      <header className="p-8 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg ${isDarkMode ? 'bg-sky-500/10 border-sky-500/20 shadow-sky-500/5' : 'bg-sky-500 shadow-sky-500/20 border-sky-600'}`}>
                <Cpu className={isDarkMode ? 'text-sky-500' : 'text-white'} size={18} />
            </div>
            <div>
                <h2 className={`text-sm font-bold tracking-tight ${textColor}`}>Binary Awakening</h2>
                <p className={`text-[10px] font-mono uppercase tracking-widest mt-1 font-bold ${subTextColor}`}>Module 03</p>
            </div>
        </div>
      </header>

      <nav className="p-8 flex-1">
        <p className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-6 ${isDarkMode ? 'text-sky-900' : 'text-gray-400'}`}>Logical Path</p>
        <div className="flex flex-col gap-2">
          {sections.filter(s => !s.hidden).map(s => {
            const isActive = activeSection === s.id;
            return (
                <button 
                  key={s.id} 
                  onClick={() => onSectionClick(s.id)}
                  className={`
                    group relative block w-full text-left py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300
                    ${isActive 
                      ? (isDarkMode ? 'text-sky-400 bg-sky-950/30 border border-sky-500/20 translate-x-1' : 'text-sky-600 bg-sky-50 border border-sky-200 shadow-sm translate-x-1') 
                      : (isDarkMode ? 'text-sky-800 hover:text-sky-400 hover:bg-sky-950/20 border border-transparent' : 'text-gray-500 hover:text-sky-600 hover:bg-gray-100 border border-transparent')}
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

      <footer className="mt-auto p-8 border-t space-y-6" style={{ borderColor }}>
        <div className="space-y-4 px-1">
            <div className="flex justify-between items-end">
                <span className={`text-[10px] font-mono uppercase tracking-[0.1em] font-black ${isDarkMode ? 'text-sky-900' : 'text-gray-400'}`}>Completion</span>
                <span className={`text-sm font-bold italic tracking-tighter ${isDarkMode ? 'text-sky-500' : 'text-sky-600'}`}>{Math.round(progress)}%</span>
            </div>
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-sky-950/20 shadow-inner' : 'bg-gray-200'}`}>
                <motion.div 
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.4)]"
                />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <button 
                onClick={onEnterLabs}
                className={`w-full h-11 flex items-center justify-center gap-2 rounded-xl border-2 font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300 active:scale-[0.96] shadow-2xl ${isDarkMode 
                    ? 'border-sky-500/20 bg-sky-500/5 text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/40' 
                    : 'border-sky-100 bg-sky-50 text-sky-600 hover:bg-sky-100'}`}
            >
                <Activity size={12} className="animate-pulse" />
                Engineering Labs
            </button>
            
            <button 
                onClick={toggleTheme} 
                className={`w-full h-11 flex items-center justify-center gap-2 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-[0.98] ${isDarkMode 
                    ? 'border-sky-900/40 text-sky-400 hover:bg-sky-950/30' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
            >
                {isDarkMode ? <Sun size={12} className="text-sky-500" /> : <Moon size={12} className="text-sky-600" />} 
                {isDarkMode ? 'Light' : 'Dark'}
            </button>
        </div>
      </footer>
    </div>
  );
};

export const Sidebar = memo(SidebarComponent);
