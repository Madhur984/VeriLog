import React from 'react';
import { motion } from 'framer-motion';

/** Shared reveal-on-scroll preset for the roadmap sections. */
export const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export const SectionHead: React.FC<{ kicker: string; title: string; sub?: string }> = ({ kicker, title, sub }) => (
  <motion.div {...reveal} className="mb-10 max-w-3xl">
    <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-signal-core mb-3">
      <span className="h-2 w-2 bg-signal-core" /> {kicker}
    </div>
    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-main leading-[1.05]">{title}</h2>
    {sub && <p className="mt-4 text-base sm:text-lg text-text-sub leading-relaxed">{sub}</p>}
  </motion.div>
);

/** Outlook pill styles keyed by Domain.outlook. */
export const OUTLOOK: Record<string, { label: string; cls: string }> = {
  'red-hot': { label: 'Red-hot', cls: 'bg-accent-orange text-white' },
  hot: { label: 'Hot', cls: 'bg-signal-core text-white' },
  steady: { label: 'Steady', cls: 'bg-bg-elev text-text-sub border border-edge' },
};

/** A min→max range drawn on a fixed ₹LPA axis (default 0–100). */
export const RangeBar: React.FC<{ min: number; max: number; scaleMax?: number; accent?: string }> = ({
  min, max, scaleMax = 100, accent = 'bg-signal-core',
}) => (
  <div className="relative h-2.5 w-full bg-bg-void border border-edge/40 overflow-hidden">
    <div
      className={`absolute top-0 bottom-0 ${accent}`}
      style={{ left: `${(min / scaleMax) * 100}%`, width: `${Math.max(((max - min) / scaleMax) * 100, 1.5)}%` }}
    />
  </div>
);
