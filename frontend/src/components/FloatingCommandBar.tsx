import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Share2 } from 'lucide-react';

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
      ${isActive ? 'text-signal-core font-bold' : 'text-text-dim hover:text-text-main'}
    `}
  >
    {label}
    {isActive && (
      <motion.div
        layoutId="active-nav-dot"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-signal-core rounded-full shadow-[0_0_8px_rgba(20,184,166,0.6)]"
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BitForBytes ECE & Semiconductor Career Roadmap',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Career Roadmap URL copied to clipboard!');
    }
  };

  return (
    <motion.nav
      variants={{ visible: { y: 0 }, hidden: { y: 100 } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[300]
                 flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2
                 bg-bg-elev/95 backdrop-blur-md
                 border-2 border-edge rounded-full
                 shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                 max-w-[calc(100vw-24px)] overflow-x-auto scrollbar-hide"
    >
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

      <div className="w-px h-4 bg-border-soft mx-1 shrink-0" />

      <button
        onClick={handleShare}
        aria-label="Share Roadmap"
        title="Share Roadmap"
        className="p-1.5 sm:p-2 text-text-dim hover:text-plasma-cyan transition-colors cursor-pointer shrink-0"
      >
        <Share2 size={13} />
      </button>
    </motion.nav>
  );
};

