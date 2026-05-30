import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const STATS = [
  { value: 13, prefix: '', suffix: '', label: 'ECE domains mapped', color: '#22D3EE' },
  { value: 0, startFrom: 999, prefix: '₹', suffix: '', label: 'Cost for students', color: '#10B981' },
  { value: 85, prefix: '', suffix: 'K', label: 'Designers India needs', color: '#F59E0B' },
  { value: 1, prefix: '$', suffix: 'T', label: 'Chip industry by 2030', color: '#EA580C' },
];

const Counter: React.FC<{ value: number; startFrom?: number; prefix: string; suffix: string; color: string }> = ({ value, startFrom = 0, prefix, suffix, color }) => {
  const [count, setCount] = useState(startFrom);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (!inView) return;
    let start = startFrom;
    const diff = value - startFrom;
    if (diff === 0) {
      setCount(value);
      return;
    }
    const steps = Math.min(Math.abs(diff), 60);
    const inc = diff / steps;
    const timer = setInterval(() => {
      start += inc;
      if ((inc > 0 && start >= value) || (inc < 0 && start <= value)) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 24);
    return () => clearInterval(timer);
  }, [value, inView, startFrom]);

  const display = Math.round(count);
  return (
    <span ref={ref} className="font-mono text-5xl md:text-6xl font-extrabold tabular-nums" style={{ color }}>
      {prefix}{display}{suffix}
    </span>
  );
};

export const StatsSection = () => {
  return (
    <section className="w-full" style={{ background: '#0B1220' }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center px-2 md:border-r last:border-r-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <Counter value={s.value} startFrom={s.startFrom} prefix={s.prefix} suffix={s.suffix} color={s.color} />
              <span className="mt-3 text-[13px] leading-tight max-w-[150px]" style={{ color: '#94A3B8' }}>{s.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-base md:text-lg italic max-w-2xl mx-auto leading-relaxed" style={{ color: '#CBD5E1' }}>
          &ldquo;Built by students who couldn&apos;t find this anywhere else - for students who shouldn&apos;t have to.&rdquo;
        </p>
      </div>

      {/* Subtle divider */}
      <div className="max-w-2xl mx-auto px-6" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.18), transparent)' }} />
    </section>
  );
};
