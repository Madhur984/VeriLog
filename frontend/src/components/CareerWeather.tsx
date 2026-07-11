
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CAREER_WEATHER = [
  { domain: 'VLSI Design', icon: '☀️', status: 'BOOM SEASON', trend: '+28% YoY demand', color: 'text-cyan-400' },
  { domain: 'Embedded Systems', icon: '⛅', status: 'STEADY', trend: '+15% YoY demand', color: 'text-emerald-400' },
  { domain: '5G/RF Systems', icon: '🌩️', status: 'STORM SURGE', trend: '+35% YoY demand', color: 'text-orange-500' },
  { domain: 'Signal Processing', icon: '🌤️', status: 'AI TAILWIND', trend: '+22% YoY demand', color: 'text-blue-400' },
  { domain: 'Power Electronics', icon: '⚡', status: 'EV LIGHTNING', trend: '+40% YoY demand', color: 'text-amber-400' },
];

export const CareerWeather: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CAREER_WEATHER.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="bg-bg-base border-2 border-edge shadow-brutal-sm px-6 py-3 flex items-center gap-8 overflow-hidden w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 w-full"
          >
            <span className="text-2xl">{CAREER_WEATHER[index].icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  {CAREER_WEATHER[index].domain}
                </span>
                <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/5 ${CAREER_WEATHER[index].color}`}>
                  {CAREER_WEATHER[index].status}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                {CAREER_WEATHER[index].trend}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
