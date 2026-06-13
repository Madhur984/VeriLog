import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Share2, Target } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ROSE = '#fb7185';
const AMBER = '#f59e0b';
const VIOLET = '#a78bfa';
const CYAN = '#22d3ee';

const FACTS: Array<[string, string]> = [
  ['20', 'flip cards: analogy on the front, real logic on the back'],
  ['34', 'self-marking questions with instant walkthroughs'],
  ['3', 'topics: combinational, sequential and adders'],
  ['1', 'shareable, watermarked deck to post when it clicks'],
];

const JOURNEY = ['Flip the deck', 'Combinational', 'Sequential', 'Adders', 'Mixed boss', 'Cheatsheet'];

export const S00_Cover: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── Title block ── */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ROSE }}>
          <Layers size={14} /> DSD Module 09 · Recall & Prove
        </div>
        <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${textColor}`}>
          Review is where <span style={{ color: ROSE }}>it sticks.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          You have built half adders and full adders, met combinational and sequential logic, and
          watched a circuit learn to remember. This module locks it in: a deck of shareable flash
          cards to re-ground the analogies, then drills that make you prove the logic from memory.
        </p>
      </motion.section>

      {/* ── facts strip ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FACTS.map(([n, label]) => (
          <div key={label} className={`p-5 rounded-2xl border text-center ${cardBg}`}>
            <div className="font-mono text-3xl font-black" style={{ color: ROSE }}>{n}</div>
            <div className={`text-xs mt-1 ${subText}`}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── how this module works ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="grid md:grid-cols-3 gap-4">
        {[
          { Icon: Layers, color: ROSE, title: 'First, the brief', body: 'A 20-card recall deck. Each front is the analogy we taught with; each back is the real logic and where it lives in silicon.' },
          { Icon: Target, color: AMBER, title: 'Then, the drills', body: 'Three topic arenas plus a mixed boss. Every question explains itself the moment you answer, right or wrong.' },
          { Icon: Share2, color: VIOLET, title: 'And share the win', body: 'Any card exports as a branded 1080x1080 image with the BitForBytes watermark, so a concept that clicked can click for someone else.' },
        ].map(({ Icon, color, title, body }) => (
          <div key={title} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}26`, border: `1px solid ${color}55` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>{title}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Journey strip ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4 text-center" style={{ color: ROSE }}>
          The route through this module
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {JOURNEY.map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-4 py-2 rounded-full border-2 font-mono text-[11px] font-black"
                    style={{
                      borderColor: i === 0 ? `${ROSE}88` : i === JOURNEY.length - 1 ? `${VIOLET}88` : `${AMBER}44`,
                      color: i === 0 ? ROSE : i === JOURNEY.length - 1 ? VIOLET : AMBER,
                      background: i === 0 ? `${ROSE}10` : i === JOURNEY.length - 1 ? `${VIOLET}10` : `${AMBER}08`,
                    }}>
                {step}
              </span>
              {i < JOURNEY.length - 1 && <ArrowRight size={13} className="opacity-40" />}
            </React.Fragment>
          ))}
        </div>
        <p className={`mt-4 text-sm text-center max-w-2xl mx-auto ${subText}`}>
          Flip the deck to warm up, then drill combinational, sequential and adder questions in
          turn, take the mixed boss round, and walk away with a one-page cheatsheet.
        </p>
        <p className="mt-3 text-xs text-center font-mono" style={{ color: CYAN }}>
          Pulls together Modules 06 (Combinational & Sequential), 07 (Half Adder) and 08 (Full Adder).
        </p>
      </motion.div>
    </div>
  );
};

export default S00_Cover;
