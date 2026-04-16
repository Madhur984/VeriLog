import React, { useState, useEffect } from 'react';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { Module2Engine } from './Module2Engine';
import './module2.css';

import { GlobalSignalState } from './types';

export const Module2Root: React.FC = () => {
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const [time, setTime] = useState(0);

  // --- GLOBAL SYSTEM STATE ---
  const [signalState, setSignalState] = useState<GlobalSignalState>({
    samplingRate: 48,
    bitDepth: 8,
    frequency: 4,
    amplitude: 80,
    jitter: 0,
    dither: false,
    reconstruction: 'zoh'
  });

  // Unified Animation Clock
  useEffect(() => {
    let raf: number;
    const animate = (t: number) => {
      setTime(t / 1000);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const updateSignal = (patch: Partial<GlobalSignalState>) => {
    setSignalState(prev => ({ ...prev, ...patch }));
  };

  return (
    <div className={`h-screen w-full overflow-hidden ${isDarkMode ? 'bg-[#030100]' : 'bg-white'}`}>
        {/* Tactical Overlay (Global) */}
        {isDarkMode && <div className="nvg-overlay pointer-events-none opacity-20" />}
        
        <Module2Engine 
            isDarkMode={isDarkMode}
            onThemeToggle={toggleTheme}
            state={signalState}
            onUpdate={updateSignal}
            time={time}
        />
    </div>
  );
};
