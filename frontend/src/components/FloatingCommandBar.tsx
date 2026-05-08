import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Zap, Share2, FileText } from 'lucide-react';

interface NavItemProps {
  label: string;
  href: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, href, isActive }) => (
  <a
    href={href}
    className={`
      px-4 py-1.5 text-[11px] font-mono transition-colors relative group
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
  </a>
);

export const FloatingCommandBar: React.FC<{ activeSection: string }> = ({ activeSection }) => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 150);
  });

  const navItems = [
    { label: 'MISSION', href: '#hero', id: 'hero' },
    { label: 'TOPOLOGY', href: '#topology', id: 'topology' },
    { label: 'SKILL GAP', href: '#skill-gap', id: 'skill-gap' },
    { label: 'FISCAL', href: '#fiscal-matrix', id: 'fiscal-matrix' },
    { label: 'HEATMAP', href: '#global-heatmap', id: 'global-heatmap' },
    { label: 'CABINET', href: '#cabinet', id: 'cabinet' },
  ];

  return (
    <motion.nav
      variants={{ visible: { y: 0 }, hidden: { y: -100 } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-10 left-1/2 -translate-x-1/2 z-[300]
                 flex items-center gap-1 px-3 py-2
                 bg-observatory-surface/80 backdrop-blur-xl
                 border border-white/[0.08] rounded-full
                 shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_20px_40px_rgba(0,0,0,0.4)]"
    >
      <div className="w-7 h-7 rounded-full bg-cyan-400/10 border border-cyan-400/20
                      flex items-center justify-center mr-2">
        <Zap size={12} className="text-cyan-400" />
      </div>

      {navItems.map(item => (
        <NavItem 
          key={item.id} 
          label={item.label} 
          href={item.href} 
          isActive={activeSection === item.id} 
        />
      ))}

      <div className="w-px h-4 bg-white/10 mx-2" />
      
      <div className="flex gap-2">
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <FileText size={14} />
        </button>
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <Share2 size={14} />
        </button>
      </div>
    </motion.nav>
  );
};
