import React from 'react';
import { motion } from 'framer-motion';
import { useSectionReveal } from '../../../hooks/useSectionReveal';

const ease = [0.16, 1, 0.3, 1] as const;

export const AboutHero: React.FC = () => {
  const { ref, isInView } = useSectionReveal(0.1);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center
                 justify-center px-6 py-24 overflow-hidden"
    >
      {/* Blueprint grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px,
              rgba(148,163,184,0.06) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient glow — very subtle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2
                   -translate-y-1/2 w-[600px] h-[600px]
                   rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 70%)',
        }}
      />

      {/* Oscilloscope scan line — slow horizontal sweep, ties to LogicTraceScope below */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(34,211,238,0.08), transparent)' }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2 mb-12"
        >
          <span
            className="text-[10px] font-mono tracking-[0.2em]"
            style={{ color: '#475569' }}
          >
            BUILT BY ECE STUDENTS // FOR ECE STUDENTS
          </span>
        </motion.div>

        {/* Main headline — 3 lines, staggered */}
        <h1 className="block font-bold leading-[0.95] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}
        >
          {[
            { text: 'We know why', color: '#F1F5F9', delay: 0 },
            { text: "you're here.", color: '#F1F5F9', delay: 0.12 },
            { text: "You didn't plan to be.", color: '#22D3EE', delay: 0.24 },
          ].map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: line.delay, ease }}
              className="block"
              style={{ color: line.color }}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.45, ease }}
          className="mt-10 space-y-4"
        >
          <p
            className="text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: '#94A3B8' }}
          >
            Most ECE students in India are here because CS cutoffs were
            too high — or a branch change didn't go as planned.
          </p>
          <p
            className="text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: '#94A3B8' }}
          >
            Everyone knows the word "VLSI." Nobody shows you what to
            actually <em>do</em> in it. That gap is why AXE‑OR exists.
          </p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, #22D3EE, transparent)' }}
          />
          <span
            className="text-[9px] font-mono tracking-[0.2em]"
            style={{ color: '#475569' }}
          >
            SCROLL TO READ OUR STORY
          </span>
        </motion.div>
      </div>
    </section>
  );
};
