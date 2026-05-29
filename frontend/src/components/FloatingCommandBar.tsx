import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Zap, Share2, FileText } from 'lucide-react';

interface NavItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-2 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-mono transition-colors relative group cursor-pointer whitespace-nowrap
      ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}
    `}
  >
    {label}
    {isActive && (
      <motion.div
        layoutId="active-nav-dot"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
      />
    )}
  </button>
);

export const FloatingCommandBar: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({ activeTab, onTabChange }) => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 150);
  });

  const navItems = [
    { label: 'ABOUT', id: 'about' },
    { label: 'EXPLORE', id: 'explore' },
    { label: 'SKILLS', id: 'skills' },
    { label: 'FINANCIALS', id: 'financials' },
    { label: 'PORTFOLIO', id: 'portfolio' },
  ];

  const handleItemClick = (item: typeof navItems[number]) => {
    onTabChange(item.id);
  };

  return (
    <motion.nav
      variants={{ visible: { y: 0 }, hidden: { y: -100 } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-4 sm:top-10 left-1/2 -translate-x-1/2 z-[300]
                 flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2
                 bg-observatory-surface/80 backdrop-blur-xl
                 border border-white/[0.08] rounded-full
                 shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_20px_40px_rgba(0,0,0,0.4)]
                 max-w-[calc(100vw-16px)] overflow-x-auto scrollbar-hide"
    >
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-cyan-400/10 border border-cyan-400/20
                      flex items-center justify-center mr-1 sm:mr-2 shrink-0">
        <Zap size={11} className="text-cyan-400" />
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {navItems.map(item => (
          <NavItem
            key={item.id}
            label={item.label}
            onClick={() => handleItemClick(item)}
            isActive={activeTab === item.id}
          />
        ))}
      </div>

      <div className="w-px h-4 bg-white/10 mx-1 sm:mx-2 shrink-0" />

      <div className="flex gap-1 sm:gap-2 shrink-0">
        <button className="p-1.5 sm:p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
          <FileText size={13} />
        </button>
        <button className="p-1.5 sm:p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
          <Share2 size={13} />
        </button>
      </div>
    </motion.nav>
  );
};
