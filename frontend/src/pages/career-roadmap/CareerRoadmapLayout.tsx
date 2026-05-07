import React, { useState, useEffect } from 'react';
import { SiliconTicker } from './components/SiliconTicker';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout as LayoutIcon, Wallet, Target, Activity, Zap, Compass, ChevronRight } from 'lucide-react';

interface CareerRoadmapLayoutProps {
  children: React.ReactNode;
}

export const CareerRoadmapLayout: React.FC<CareerRoadmapLayoutProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { id: 'hero', label: 'MISSION_HOME', icon: <Target size={18} />, shortcut: 'H' },
    { id: 'skill-graph', label: 'SKILL_TOPOLOGY', icon: <LayoutIcon size={18} />, shortcut: 'G' },
    { id: 'fiscal-matrix', label: 'FISCAL_MATRIX', icon: <Wallet size={18} />, shortcut: 'F' },
    { id: 'timeline', label: 'MISSION_TIMELINE', icon: <Activity size={18} />, shortcut: 'L' },
    { id: 'intel-hub', label: 'INTEL_HUB', icon: <Compass size={18} />, shortcut: 'I' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-matte-obsidian text-text-main selection:bg-plasma-cyan selection:text-matte-obsidian flex">
      {/* Tactical Navigation Dock */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 border-r border-ghost-trace bg-solder-mask/80 backdrop-blur-xl z-[110] flex flex-col items-center py-24 gap-8 hidden lg:flex">
        <div className="w-10 h-10 rounded bg-plasma-cyan/10 flex items-center justify-center text-plasma-cyan mb-8 border border-plasma-cyan/20">
          <Zap size={20} className="animate-pulse" />
        </div>
        
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="group relative p-3 transition-all duration-300"
          >
            <div className={`
              transition-all duration-500 
              ${activeSection === item.id ? 'text-plasma-cyan scale-125' : 'text-text-dim hover:text-text-sub'}
            `}>
              {item.icon}
            </div>
            
            {/* Hover Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-matte-obsidian border border-ghost-trace rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-widest text-text-main uppercase">{item.label}</span>
                <span className="font-mono text-[9px] text-plasma-cyan">[{item.shortcut}]</span>
              </div>
            </div>

            {/* Active Indicator */}
            {activeSection === item.id && (
              <motion.div 
                layoutId="active-nav"
                className="absolute left-0 w-1 h-8 bg-plasma-cyan shadow-cyan-glow" 
              />
            )}
          </button>
        ))}

        <div className="mt-auto p-4 opacity-30">
          <div className="w-0.5 h-20 bg-gradient-to-b from-plasma-cyan to-transparent" />
        </div>
      </nav>

      <div className="flex-1 lg:ml-20 flex flex-col">
        {/* Silicon Ticker - Persistent on top */}
        <div className="fixed top-0 left-0 lg:left-20 right-0 z-[100]">
          {SiliconTicker && <SiliconTicker />}
        </div>

      {/* Global Background Grids */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Main Blueprint Grid */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-[0.03] scale-150" />
        
        {/* Animated Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-plasma-cyan/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-orange/5 opacity-40 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 pt-10">
        <div>
          {children}
        </div>
      </main>

      {/* Industrial Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-ghost-trace bg-solder-mask">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
          <div className="font-mono text-[10px] tracking-widest uppercase">
            AXE-OR // CAREER INTEL // v3.0.0
          </div>
          <div className="flex gap-8 font-mono text-[9px] uppercase tracking-widest">
            <span>DATA_VERSION: 2025.Q4</span>
            <span>LAST_UPDATED: MAY_2026</span>
          </div>
          <div className="font-mono text-[10px] text-plasma-cyan uppercase tracking-tighter">
            PRODUCED BY GOOGLE DEEPMIND // ADVANCED AGENTIC CODING
          </div>
        </div>
      </footer>
    </div>
  </div>
);
};
