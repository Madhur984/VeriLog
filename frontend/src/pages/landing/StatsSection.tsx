import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const LANDING_STATS = [
  { value: 13, suffix: '',    label: 'ECE Domains Covered',      color: '#22D3EE' },
  { value: 0,  suffix: '₹',  label: 'Cost for Students',        color: '#10B981', prefix: true },
  { value: 85, suffix: 'K',  label: 'VLSI Engineers Needed Now', color: '#F59E0B' },
  { value: 4,  suffix: '',   label: 'Students Who Built This',   color: '#EA580C' },
];

const AnimatedCounter: React.FC<{ value: number; prefix?: boolean; suffix: string; color: string }> = ({
  value,
  prefix,
  suffix,
  color,
}) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (!inView) return;
    if (value === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const end = value;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 20));

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span ref={ref} className="font-mono text-5xl md:text-6xl font-bold" style={{ color }}>
      {prefix && suffix === '₹' ? '₹' : ''}
      {count}
      {suffix !== '₹' ? suffix : ''}
    </span>
  );
};

export const StatsSection = () => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto w-full select-none">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 items-center justify-center">
        {LANDING_STATS.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center px-4 md:border-r border-white/[0.08] last:border-r-0"
          >
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              color={stat.color}
            />
            <span
              className="text-xs md:text-[13px] font-sans mt-3 text-slate-400 max-w-[150px] leading-tight"
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Honest Manifesto Sentence */}
      <div className="mt-16 text-center">
        <p
          className="text-base md:text-lg font-sans text-slate-400 italic max-w-2xl mx-auto leading-relaxed"
        >
          "Built by students who couldn't find this anywhere else.
          <br className="hidden md:inline" />
          {' '}For students who shouldn't have to."
        </p>
      </div>
    </section>
  );
};
