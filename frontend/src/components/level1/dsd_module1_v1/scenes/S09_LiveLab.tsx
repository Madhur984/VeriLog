import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Zap, RefreshCw, Calculator, Trophy, Cpu } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const literal = (name: string, val: 0 | 1, mode: 'min' | 'max') => {
  if (mode === 'min') return val === 1 ? name : `${name}'`;
  return val === 0 ? name : `${name}'`;
};

const buildMinterm = (idx: number) => {
  const X = (idx >> 2) & 1, Y = (idx >> 1) & 1, Z = idx & 1;
  return `${literal('X', X as 0|1, 'min')}·${literal('Y', Y as 0|1, 'min')}·${literal('Z', Z as 0|1, 'min')}`;
};
const buildMaxterm = (idx: number) => {
  const X = (idx >> 2) & 1, Y = (idx >> 1) & 1, Z = idx & 1;
  return `${literal('X', X as 0|1, 'max')}+${literal('Y', Y as 0|1, 'max')}+${literal('Z', Z as 0|1, 'max')}`;
};

export const S09_LiveLab: React.FC<Props> = ({ isActive, isDarkMode }) => {
  // 8-row truth table that user can edit
  const [outputs, setOutputs] = useState<(0 | 1)[]>([1, 0, 1, 0, 0, 1, 1, 0]);

  const ones  = useMemo(() => outputs.map((o, i) => (o === 1 ? i : -1)).filter(i => i >= 0), [outputs]);
  const zeros = useMemo(() => outputs.map((o, i) => (o === 0 ? i : -1)).filter(i => i >= 0), [outputs]);

  const sopShort = ones.length === 0 ? '0' : ones.length === 8 ? '1' : `Σm(${ones.join(', ')})`;
  const posShort = zeros.length === 0 ? '1' : zeros.length === 8 ? '0' : `ΠM(${zeros.join(', ')})`;

  const sopExpand = ones.length === 0 ? '0' : ones.map(i => `(${buildMinterm(i)})`).join(' + ');
  const posExpand = zeros.length === 0 ? '1' : zeros.map(i => `(${buildMaxterm(i)})`).join(' · ');

  // Circuit cost: each canonical term has 3 literals (3 vars), gates = #terms + 1 (the OR/AND collector)
  const sopLiterals = ones.length === 0 || ones.length === 8 ? 0 : ones.length * 3;
  const posLiterals = zeros.length === 0 || zeros.length === 8 ? 0 : zeros.length * 3;
  const sopGates    = ones.length === 0 || ones.length === 8 ? 0 : ones.length + 1;
  const posGates    = zeros.length === 0 || zeros.length === 8 ? 0 : zeros.length + 1;
  const cheaperForm: 'sop' | 'pos' | 'tie' =
    sopLiterals === posLiterals ? 'tie' : sopLiterals < posLiterals ? 'sop' : 'pos';

  const reset = (preset: 'all' | 'none' | 'random' | 'ben') => {
    if (preset === 'all') setOutputs([1, 1, 1, 1, 1, 1, 1, 1]);
    else if (preset === 'none') setOutputs([0, 0, 0, 0, 0, 0, 0, 0]);
    else if (preset === 'ben') setOutputs([1, 1, 1, 0, 1, 0, 0, 0]);
    else setOutputs(Array.from({ length: 8 }, () => (Math.random() < 0.5 ? 0 : 1) as 0 | 1));
  };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          Chapter 09 · Live Lab
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Design Your Own Function
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          You are the architect. Toggle any output bit in the truth table and watch the canonical
          SOP and POS regenerate live. Bot lenses always describe the same function — the lab
          proves it for whatever you build.
        </p>
      </section>

      {/* Preset toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className={`font-mono text-[10px] uppercase tracking-widest ${subText}`}>presets:</span>
        {[
          { k: 'ben', l: "Ben's picnic", c: '#10b981' },
          { k: 'all', l: 'Always 1', c: '#38bdf8' },
          { k: 'none', l: 'Always 0', c: '#f43f5e' },
          { k: 'random', l: 'Random', c: '#a78bfa' },
        ].map(p => (
          <button
            key={p.k}
            onClick={() => reset(p.k as any)}
            className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-black transition-all border`}
            style={{
              background: `${p.c}11`, color: p.c, borderColor: `${p.c}55`,
            }}
          >
            <RefreshCw size={11} className="inline mr-1.5" /> {p.l}
          </button>
        ))}
      </div>

      {/* Editable truth table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Zap size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Click an output cell to flip it · {ones.length} ones · {zeros.length} zeros
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className={isDarkMode ? 'bg-white/5' : 'bg-slate-50'}>
                {['#', 'X', 'Y', 'Z', 'Output F', 'Term'].map(h => (
                  <th key={h} className={`px-4 py-3 text-left text-[10px] uppercase tracking-widest font-black opacity-50 ${textColor}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }, (_, i) => i).map(i => {
                const X = (i >> 2) & 1, Y = (i >> 1) & 1, Z = i & 1;
                const F = outputs[i];
                return (
                  <tr key={i} className={`border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'} ${
                    F === 1 ? (isDarkMode ? 'bg-emerald-500/5' : 'bg-emerald-50') : (isDarkMode ? 'bg-rose-500/5' : 'bg-rose-50')
                  }`}>
                    <td className={`px-4 py-3 ${textColor} opacity-50`}>{i}</td>
                    <td className={`px-4 py-3 ${textColor}`}>{X}</td>
                    <td className={`px-4 py-3 ${textColor}`}>{Y}</td>
                    <td className={`px-4 py-3 ${textColor}`}>{Z}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setOutputs(o => o.map((v, idx) => idx === i ? (v === 0 ? 1 : 0) : v) as (0|1)[])}
                        className="w-9 h-9 rounded-lg font-black text-base border-2 transition-all"
                        style={{
                          background: F === 1 ? '#10b98122' : '#f43f5e22',
                          color: F === 1 ? '#10b981' : '#f43f5e',
                          borderColor: F === 1 ? '#10b981' : '#f43f5e',
                        }}
                      >
                        {F}
                      </button>
                    </td>
                    <td className={`px-4 py-3 text-[12px] ${F === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {F === 1 ? `m${i} = ${buildMinterm(i)}` : `M${i} = ${buildMaxterm(i)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Generated forms */}
      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          key={`sop-${sopShort}`}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical size={14} className="text-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-black">
              Canonical Sum of Products
            </span>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-black text-emerald-400 mb-3 break-words">
            F = {sopShort}
          </div>
          <div className={`font-mono text-[12px] leading-relaxed break-words ${subText}`}>
            F = {sopExpand}
          </div>
        </motion.div>

        <motion.div
          key={`pos-${posShort}`}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-amber-500/5 border-amber-500/30' : 'bg-amber-50 border-amber-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical size={14} className="text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-black">
              Canonical Product of Sums
            </span>
          </div>
          <div className="font-mono text-2xl md:text-3xl font-black text-amber-400 mb-3 break-words">
            F = {posShort}
          </div>
          <div className={`font-mono text-[12px] leading-relaxed break-words ${subText}`}>
            F = {posExpand}
          </div>
        </motion.div>
      </div>

      {/* Cost analysis — literals + gates */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Calculator size={14} className="text-fuchsia-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400">
            Circuit cost analysis · canonical form
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {/* SOP cost */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
          }`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-3">
              Sum of Products
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1">terms</div>
                <div className="text-2xl font-black text-emerald-400">{ones.length}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1">literals</div>
                <div className="text-2xl font-black text-emerald-400">{sopLiterals}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1">gates</div>
                <div className="text-2xl font-black text-emerald-400">{sopGates}</div>
              </div>
            </div>
            <div className={`text-[10px] mt-3 leading-relaxed ${subText}`}>
              {ones.length} AND-gate(s) feeding 1 OR-gate · {sopLiterals} input wires
            </div>
          </div>
          {/* POS cost */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-amber-500/5 border-amber-500/30' : 'bg-amber-50 border-amber-300'
          }`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-3">
              Product of Sums
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1">terms</div>
                <div className="text-2xl font-black text-amber-400">{zeros.length}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1">literals</div>
                <div className="text-2xl font-black text-amber-400">{posLiterals}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1">gates</div>
                <div className="text-2xl font-black text-amber-400">{posGates}</div>
              </div>
            </div>
            <div className={`text-[10px] mt-3 leading-relaxed ${subText}`}>
              {zeros.length} OR-gate(s) feeding 1 AND-gate · {posLiterals} input wires
            </div>
          </div>
        </div>

        {/* Winner */}
        <div className={`p-4 rounded-2xl flex items-start gap-3 ${
          cheaperForm === 'tie'
            ? (isDarkMode ? 'bg-cyan-500/10 border border-cyan-400/30' : 'bg-cyan-50 border border-cyan-300')
            : cheaperForm === 'sop'
              ? (isDarkMode ? 'bg-emerald-500/10 border border-emerald-400/30' : 'bg-emerald-50 border border-emerald-300')
              : (isDarkMode ? 'bg-amber-500/10 border border-amber-400/30' : 'bg-amber-50 border border-amber-300')
        }`}>
          <Trophy size={18} className={
            cheaperForm === 'tie' ? 'text-cyan-400 mt-0.5 shrink-0'
              : cheaperForm === 'sop' ? 'text-emerald-400 mt-0.5 shrink-0'
              : 'text-amber-400 mt-0.5 shrink-0'
          } />
          <p className={`text-sm leading-relaxed ${textColor}`}>
            <strong>
              {cheaperForm === 'tie' && 'Tie — both forms cost identically.'}
              {cheaperForm === 'sop' && `SOP wins by ${posLiterals - sopLiterals} literal(s).`}
              {cheaperForm === 'pos' && `POS wins by ${sopLiterals - posLiterals} literal(s).`}
            </strong>{' '}
            {cheaperForm === 'tie'
              ? 'Pick whichever lens matches your problem statement.'
              : cheaperForm === 'sop'
                ? 'This function has fewer happy rows — painting the 1s is the cheaper blueprint.'
                : 'This function has fewer disaster rows — bricking up the 0s is the cheaper blueprint.'}{' '}
            <em>Note: K-Map minimisation in the next module typically reduces both costs much further.</em>
          </p>
        </div>
      </motion.div>

      {/* Implementation preview */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Two-level gate implementation preview
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <pre className={`font-mono text-xs leading-relaxed p-4 rounded-2xl overflow-x-auto ${
            isDarkMode ? 'bg-black/40 text-emerald-300' : 'bg-emerald-50 text-emerald-800'
          }`}>{`// SOP: AND→OR (2 levels)
${ones.length === 0
  ? '  F = 0  (no minterms)'
  : ones.map(i => `  AND${i}: ${buildMinterm(i)}`).join('\n') +
    `\n  OR: ${ones.map(i => `AND${i}`).join(' + ')}` +
    `\n  F = OR.out`}`}</pre>

          <pre className={`font-mono text-xs leading-relaxed p-4 rounded-2xl overflow-x-auto ${
            isDarkMode ? 'bg-black/40 text-amber-300' : 'bg-amber-50 text-amber-800'
          }`}>{`// POS: OR→AND (2 levels)
${zeros.length === 0
  ? '  F = 1  (no maxterms)'
  : zeros.map(i => `  OR${i}: ${buildMaxterm(i)}`).join('\n') +
    `\n  AND: ${zeros.map(i => `OR${i}`).join(' · ')}` +
    `\n  F = AND.out`}`}</pre>
        </div>
      </motion.div>
    </div>
  );
};
