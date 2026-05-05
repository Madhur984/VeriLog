import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowRight, Sparkles } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Law {
  name: string;
  forms: { lhs: string; rhs: string }[];
  why: string;
}

const LAWS: Law[] = [
  {
    name: 'Identity',
    forms: [{ lhs: 'A + 0', rhs: 'A' }, { lhs: 'A · 1', rhs: 'A' }],
    why: '0 doesn\'t add anything to OR; 1 doesn\'t restrict an AND.',
  },
  {
    name: 'Domination',
    forms: [{ lhs: 'A + 1', rhs: '1' }, { lhs: 'A · 0', rhs: '0' }],
    why: '1 wins any OR; 0 wins any AND.',
  },
  {
    name: 'Idempotence',
    forms: [{ lhs: 'A + A', rhs: 'A' }, { lhs: 'A · A', rhs: 'A' }],
    why: 'Combining a variable with itself is the variable.',
  },
  {
    name: 'Complement',
    forms: [{ lhs: "A + A'", rhs: '1' }, { lhs: "A · A'", rhs: '0' }],
    why: 'Either A or its complement is always true; both can never be true at once.',
  },
  {
    name: 'Double Negation',
    forms: [{ lhs: "(A')'", rhs: 'A' }],
    why: 'Two inversions cancel.',
  },
  {
    name: 'Commutative',
    forms: [{ lhs: 'A + B', rhs: 'B + A' }, { lhs: 'A · B', rhs: 'B · A' }],
    why: 'Order does not matter for AND or OR.',
  },
  {
    name: 'Associative',
    forms: [{ lhs: '(A + B) + C', rhs: 'A + (B + C)' }, { lhs: '(A · B) · C', rhs: 'A · (B · C)' }],
    why: 'Grouping is irrelevant — chains of ORs/ANDs collapse into multi-input forms.',
  },
  {
    name: 'Distributive',
    forms: [{ lhs: 'A·(B + C)', rhs: 'A·B + A·C' }, { lhs: 'A + B·C', rhs: '(A+B)·(A+C)' }],
    why: 'Same shape as ordinary algebra for the first; the second is unique to Boolean.',
  },
  {
    name: 'Absorption',
    forms: [{ lhs: 'A + A·B', rhs: 'A' }, { lhs: 'A · (A + B)', rhs: 'A' }],
    why: 'When A is already there, the extra B-clause is redundant.',
  },
  {
    name: 'De Morgan',
    forms: [{ lhs: "(A + B)'", rhs: "A' · B'" }, { lhs: "(A · B)'", rhs: "A' + B'" }],
    why: 'The most powerful identity in digital design — turns ORs into ANDs and vice versa.',
  },
];

interface Sample {
  expr: string;
  steps: { from: string; to: string; law: string }[];
}

const SAMPLES: Sample[] = [
  {
    expr: "A·B + A·B'",
    steps: [
      { from: "A·B + A·B'",   to: "A·(B + B')", law: 'Distributive' },
      { from: "A·(B + B')",   to: 'A · 1',      law: 'Complement' },
      { from: 'A · 1',        to: 'A',          law: 'Identity' },
    ],
  },
  {
    expr: "A + A'·B",
    steps: [
      { from: "A + A'·B",         to: "(A + A')·(A + B)", law: 'Distributive (Boolean)' },
      { from: "(A + A')·(A + B)", to: '1 · (A + B)',      law: 'Complement' },
      { from: '1 · (A + B)',      to: 'A + B',            law: 'Identity' },
    ],
  },
  {
    expr: "(A·B)' · (A + B)",
    steps: [
      { from: "(A·B)' · (A + B)",     to: "(A' + B') · (A + B)", law: 'De Morgan' },
      { from: "(A' + B') · (A + B)",  to: "A·A' + A·B' + A'·B + B·B'", law: 'Distributive' },
      { from: "A·A' + A·B' + A'·B + B·B'", to: "0 + A·B' + A'·B + 0", law: 'Complement' },
      { from: "0 + A·B' + A'·B + 0",  to: "A·B' + A'·B = A ⊕ B",      law: 'Identity ⇒ XOR' },
    ],
  },
];

export const S16_AlgebraLab: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [sampleIdx, setSampleIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const sample = SAMPLES[sampleIdx];
  const visibleSteps = sample.steps.slice(0, stepIdx + 1);

  const advance = () => {
    if (stepIdx < sample.steps.length - 1) setStepIdx(stepIdx + 1);
    else { setSampleIdx((sampleIdx + 1) % SAMPLES.length); setStepIdx(0); }
  };
  const reset = () => setStepIdx(0);

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Calculator size={14} /> Chapter · Algebra Lab
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Boolean Simplification Rules</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Algebra is the engine that drives K-Map intuition. These ten laws are the toolkit
          — internalise them and most exam questions collapse in two or three steps.
        </p>
      </section>

      {/* Laws cheat board */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-5">
          The ten commandments of Boolean algebra
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LAWS.map((law, i) => (
            <motion.div
              key={law.name}
              initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.03 * i }}
              className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">{law.name}</div>
              <div className="space-y-1.5">
                {law.forms.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2 font-mono text-xs">
                    <span className={textColor}>{f.lhs}</span>
                    <ArrowRight size={11} className="text-amber-400 flex-shrink-0" />
                    <span className="text-amber-300 font-bold">{f.rhs}</span>
                  </div>
                ))}
              </div>
              <p className={`text-[10px] ${subText} mt-2 italic leading-relaxed`}>{law.why}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Step-by-step worked example */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-1">
              Worked example {sampleIdx + 1} / {SAMPLES.length}
            </div>
            <h3 className={`text-xl font-black ${textColor}`}>Simplify · {sample.expr}</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}
            >
              Reset
            </button>
            <button
              onClick={advance}
              className="px-4 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-[11px]"
            >
              {stepIdx < sample.steps.length - 1 ? 'Next step →' : 'Next example →'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className={`p-4 rounded-xl border-2 border-amber-400 bg-amber-500/10 font-mono`}>
            <div className="text-[10px] uppercase tracking-widest text-amber-300 mb-1">Start</div>
            <div className={`text-lg font-black ${textColor}`}>{sample.expr}</div>
          </div>

          <AnimatePresence>
            {visibleSteps.map((step, i) => (
              <motion.div
                key={`${sampleIdx}-${i}`}
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 py-1">
                  <ArrowRight className="text-amber-400" size={16} />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
                    {step.law}
                  </span>
                </div>
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'} font-mono`}>
                  <div className={`text-base ${textColor}`}>{step.to}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {stepIdx === sample.steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`p-4 rounded-xl border-2 border-emerald-400 bg-emerald-500/10`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-1">
                Final answer
              </div>
              <div className={`text-xl font-black font-mono text-emerald-200`}>
                {sample.steps[sample.steps.length - 1].to}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        className={`p-6 rounded-3xl border ${cardBg} flex items-start gap-3`}
      >
        <Sparkles className="text-amber-300 flex-shrink-0 mt-0.5" size={18} />
        <p className={`text-sm ${subText}`}>
          <strong className="text-amber-300">Bridge:</strong> every K-Map grouping rule you
          learned in module 2 is just one of these laws applied geometrically. Two cells
          differing in one variable? That&apos;s the <em>Complement</em> law collapsing them.
        </p>
      </motion.div>
    </div>
  );
};
