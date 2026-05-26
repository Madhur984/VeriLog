import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PROBLEM_STATS, HONEST_PROBLEM_ITEMS } from '../data/aboutData';
import { SectionWrapper } from '../../../components/SectionWrapper';

// Simple Count-up component to animate stats
const StatCounter: React.FC<{ value: string; color: string }> = ({ value, color }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayVal, setDisplayVal] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    const isMillion = value.includes('M');
    const isPercent = value.includes('%');
    const isCurrency = value.includes('₹');
    const isLess = value.includes('<');
    const cleanNum = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;

    let startTime: number | null = null;
    const duration = 1500; // ms

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      // Quadratic ease out
      const easedProgress = progress * (2 - progress);
      const current = easedProgress * cleanNum;

      let formatted = '';
      if (isLess) formatted += '< ';
      if (isCurrency) formatted += '₹';

      if (isMillion) {
        formatted += current.toFixed(1) + 'M';
      } else if (cleanNum >= 1000) {
        formatted += Math.round(current).toLocaleString();
      } else if (isPercent) {
        formatted += Math.round(current) + '%';
      } else {
        formatted += Math.round(current).toString();
      }

      setDisplayVal(formatted);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <span ref={ref} className={color}>
      {displayVal}
    </span>
  );
};

import { TerminalTextReveal } from '../../../components/TerminalTextReveal';

export const TheProblem: React.FC = () => {
  return (
    <SectionWrapper id="the-problem" className="bg-[#07080A] border-y border-white/[0.03]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">
            THE GAP
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase leading-[1.1] max-w-3xl">
            <TerminalTextReveal text="1.5 million ECE graduates." />{' '}
            <span className="text-cyan-400">
              <TerminalTextReveal text="< 8% in core roles." delay={300} />
            </span>
          </h2>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-6">
          {/* Left Column - Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROBLEM_STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#0D0F12] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between min-h-[160px] hover:border-slate-600 hover:bg-[#131619] transition-all duration-200"
              >
                <div className="font-mono text-3xl md:text-4xl font-bold">
                  <StatCounter value={stat.value} color={stat.color} />
                </div>
                <div className="space-y-2 mt-4">
                  <div className="text-xs font-semibold text-white leading-snug">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-500 italic leading-snug">
                    {stat.context}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Honest List */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white font-sans">
              What nobody tells ECE students
            </h3>

            <div className="space-y-4">
              {HONEST_PROBLEM_ITEMS.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="pl-4 py-3 border-l-2 border-amber-400 bg-amber-400/[0.02] hover:bg-amber-400/[0.05] transition-colors rounded-r-lg"
                >
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
