import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Zap, RefreshCw, Calculator, Trophy, Cpu, AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const GATE_BUDGET = 5;

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

const detectPattern = (outputs: (0|1)[]): string | null => {
  const ones = outputs.filter(v => v === 1).length;
  if (ones === 0) return 'constant-zero';
  if (ones === 8) return 'constant-one';
  if (ones === 1) return 'single-minterm';
  if (ones === 7) return 'single-maxterm';
  const indices = outputs.map((o,i) => o ? i : -1).filter(i => i >= 0);
  if (indices.length > 0 && indices.every(i => i % 2 === 1)) return 'all-odd';
  if (indices.length > 0 && indices.every(i => i % 2 === 0)) return 'all-even';
  if (ones <= 3) return 'sparse-ones';
  if (ones >= 5) return 'sparse-zeros';
  return 'balanced';
};

const PATTERN_HINTS: Record<string, { msg: string; color: string; rec: 'sop'|'pos'|null }> = {
  'single-minterm': { msg: 'Single 1 detected — SOP is trivially 1 term', color: '#10b981', rec: 'sop' },
  'single-maxterm': { msg: 'Single 0 detected — POS is trivially 1 term', color: '#f59e0b', rec: 'pos' },
  'sparse-ones':    { msg: 'Sparse 1s detected → SOP is likely more efficient', color: '#10b981', rec: 'sop' },
  'sparse-zeros':   { msg: 'Sparse 0s detected → POS is likely more efficient', color: '#f59e0b', rec: 'pos' },
  'all-odd':        { msg: 'Parity pattern detected — only odd row addresses active', color: '#a78bfa', rec: null },
  'all-even':       { msg: 'Symmetry detected — only even row addresses active', color: '#a78bfa', rec: null },
  'constant-zero':  { msg: 'Null function — all outputs are grounded', color: '#64748b', rec: 'sop' },
  'constant-one':   { msg: 'Identity function — output is tied to VCC', color: '#38bdf8', rec: 'pos' },
  'balanced':       { msg: 'Balanced load — no dominant strategy', color: '#64748b', rec: null },
};

export const S09_LiveLab: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [outputs, setOutputs] = useState<(0 | 1)[]>([1, 0, 1, 0, 0, 1, 1, 0]);
  const [pulsingRow, setPulsingRow] = useState<number | null>(null);

  const ones  = useMemo(() => outputs.map((o, i) => (o === 1 ? i : -1)).filter(i => i >= 0), [outputs]);
  const zeros = useMemo(() => outputs.map((o, i) => (o === 0 ? i : -1)).filter(i => i >= 0), [outputs]);

  const sopShort = ones.length === 0 ? '0' : ones.length === 8 ? '1' : `Σm(${ones.join(', ')})`;
  const posShort = zeros.length === 0 ? '1' : zeros.length === 8 ? '0' : `ΠM(${zeros.join(', ')})`;

  const sopExpand = ones.length === 0 ? '0' : ones.map(i => `(${buildMinterm(i)})`).join(' + ');
  const posExpand = zeros.length === 0 ? '1' : zeros.map(i => `(${buildMaxterm(i)})`).join(' · ');

  const sopLiterals = ones.length === 0 || ones.length === 8 ? 0 : ones.length * 3;
  const posLiterals = zeros.length === 0 || zeros.length === 8 ? 0 : zeros.length * 3;
  const sopGates    = ones.length === 0 || ones.length === 8 ? 0 : ones.length + 1;
  const posGates    = zeros.length === 0 || zeros.length === 8 ? 0 : zeros.length + 1;
  
  const cheaperGates = Math.min(sopGates, posGates);
  const cheaperForm: 'sop' | 'pos' | 'tie' =
    sopLiterals === posLiterals ? 'tie' : sopLiterals < posLiterals ? 'sop' : 'pos';

  const systemState = cheaperGates > GATE_BUDGET ? 'fail' : cheaperGates === GATE_BUDGET ? 'warning' : 'nominal';
  const pattern = detectPattern(outputs);
  const hint = pattern ? PATTERN_HINTS[pattern] : null;

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
    <div className={`max-w-6xl mx-auto space-y-12 py-4 transition-opacity duration-500 ${systemState === 'fail' ? 'opacity-90' : 'opacity-100'}`}>
      <section className="space-y-3 relative">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          Chapter 09 · Live Lab
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Design Your Own Function
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          You are the architect. Toggle any output bit and watch the canonical
          forms regenerate live. In the real world, area budget is everything — 
          keep your gate count under <strong>{GATE_BUDGET}</strong> or your chip will fail.
        </p>

        <AnimatePresence>
          {systemState === 'fail' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute -right-4 top-0 hidden xl:flex flex-col items-end gap-2"
            >
              <div className="bg-rose-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-rose-500/40">
                <ShieldAlert size={18} />
                <span className="font-black text-xs uppercase tracking-widest">Design Invalid</span>
              </div>
              <div className="text-[10px] font-mono text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                Area budget exceeded
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* Pattern Hint Engine */}
      <AnimatePresence mode="wait">
        {hint && (
          <motion.div
            key={pattern}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`p-4 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-black/20' : 'bg-slate-50'}`}
            style={{ borderColor: `${hint.color}33` }}
          >
            <div className="p-2 rounded-xl" style={{ backgroundColor: `${hint.color}22` }}>
              <Lightbulb size={16} style={{ color: hint.color }} />
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest opacity-50 mb-0.5">Pattern Detected</div>
              <div className="text-sm font-bold" style={{ color: hint.color }}>{hint.msg}</div>
            </div>
            {hint.rec && (
              <div className="ml-auto px-3 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-[9px] uppercase tracking-widest opacity-60">
                Strategy: {hint.rec.toUpperCase()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editable truth table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border transition-all duration-700 ${cardBg} ${
          systemState === 'fail' ? 'border-rose-500/50 shadow-2xl shadow-rose-500/10' : 
          systemState === 'warning' ? 'border-amber-500/50' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap size={14} className={systemState === 'fail' ? 'text-rose-400' : 'text-cyan-400'} />
            <span className={`font-mono text-[10px] uppercase tracking-widest ${systemState === 'fail' ? 'text-rose-400' : 'text-cyan-400'}`}>
              Interactive truth table · {ones.length} ones · {zeros.length} zeros
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono uppercase tracking-widest opacity-40">System State</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                  systemState === 'fail' ? 'text-rose-400' : systemState === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {systemState === 'fail' ? 'Critical Failure' : systemState === 'warning' ? 'Warning' : 'Nominal'}
                </span>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full font-mono text-sm transition-all duration-500 ${systemState === 'fail' ? 'grayscale-[0.5]' : ''}`}>
            <thead>
              <tr className={isDarkMode ? 'bg-white/5' : 'bg-slate-50'}>
                {['#', 'X', 'Y', 'Z', 'Output F', 'Requirement'].map(h => (
                  <th key={h} className={`px-4 py-3 text-left text-[10px] uppercase tracking-widest font-black opacity-50 ${textColor}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }, (_, i) => i).map(i => {
                const X = (i >> 2) & 1, Y = (i >> 1) & 1, Z = i & 1;
                const F = outputs[i];
                return (
                  <tr key={i} className={`border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'} transition-colors duration-300 ${
                    F === 1 ? (isDarkMode ? 'bg-emerald-500/5' : 'bg-emerald-50') : (isDarkMode ? 'bg-rose-500/5' : 'bg-rose-50')
                  }`}>
                    <td className={`px-4 py-3 ${textColor} opacity-30`}>{i}</td>
                    <td className={`px-4 py-3 ${textColor}`}>{X}</td>
                    <td className={`px-4 py-3 ${textColor}`}>{Y}</td>
                    <td className={`px-4 py-3 ${textColor}`}>{Z}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setOutputs(o => o.map((v, idx) => idx === i ? (v === 0 ? 1 : 0) : v) as (0|1)[]);
                          setPulsingRow(i);
                          setTimeout(() => setPulsingRow(null), 500);
                        }}
                        className={`w-9 h-9 rounded-lg font-black text-base border-2 transition-all relative overflow-hidden ${
                          pulsingRow === i ? 'scale-110' : ''
                        }`}
                        style={{
                          background: F === 1 ? '#10b98122' : '#f43f5e22',
                          color: F === 1 ? '#10b981' : '#f43f5e',
                          borderColor: F === 1 ? '#10b981' : '#f43f5e',
                        }}
                      >
                        {F}
                        {pulsingRow === i && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0.5 }}
                            animate={{ scale: 2, opacity: 0 }}
                            className="absolute inset-0 bg-current rounded-full"
                          />
                        )}
                      </button>
                    </td>
                    <td className={`px-4 py-3 text-[11px] font-bold ${F === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {F === 1 ? `m${i} Snapshot` : `M${i} Barricade`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Generated forms */}
      <div className={`grid md:grid-cols-2 gap-5 transition-all duration-500 ${systemState === 'fail' ? 'scale-[0.98] blur-[0.5px]' : ''}`}>
        <motion.div
          key={`sop-${sopShort}`}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-3xl border transition-all duration-500 ${
            isDarkMode ? 'bg-emerald-500/5' : 'bg-emerald-50'
          } ${cheaperForm === 'sop' ? 'border-emerald-400 border-2 shadow-lg shadow-emerald-500/10' : 'border-emerald-500/30'}`}
        >
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <FlaskConical size={14} className="text-emerald-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-black">
                  Canonical SOP
                </span>
             </div>
             {cheaperForm === 'sop' && <div className="text-[8px] font-mono px-2 py-0.5 bg-emerald-500 text-black rounded font-black uppercase tracking-tighter">Optimal Path</div>}
          </div>
          <div className="font-mono text-2xl md:text-3xl font-black text-emerald-400 mb-3 break-words">
            F = {sopShort}
          </div>
          <div className={`font-mono text-[12px] leading-relaxed break-words transition-opacity ${subText} ${cheaperForm === 'pos' ? 'opacity-40' : 'opacity-100'}`}>
            F = {sopExpand}
          </div>
        </motion.div>

        <motion.div
          key={`pos-${posShort}`}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-3xl border transition-all duration-500 ${
            isDarkMode ? 'bg-amber-500/5' : 'bg-amber-50'
          } ${cheaperForm === 'pos' ? 'border-amber-400 border-2 shadow-lg shadow-amber-500/10' : 'border-amber-500/30'}`}
        >
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <FlaskConical size={14} className="text-amber-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-black">
                  Canonical POS
                </span>
             </div>
             {cheaperForm === 'pos' && <div className="text-[8px] font-mono px-2 py-0.5 bg-amber-500 text-black rounded font-black uppercase tracking-tighter">Optimal Path</div>}
          </div>
          <div className="font-mono text-2xl md:text-3xl font-black text-amber-400 mb-3 break-words">
            F = {posShort}
          </div>
          <div className={`font-mono text-[12px] leading-relaxed break-words transition-opacity ${subText} ${cheaperForm === 'sop' ? 'opacity-40' : 'opacity-100'}`}>
            F = {posExpand}
          </div>
        </motion.div>
      </div>

      {/* Cost analysis & Strategy Choice */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-3xl border transition-all duration-500 ${cardBg} ${
          systemState === 'fail' ? 'border-rose-500/50 bg-rose-500/5' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calculator size={14} className={systemState === 'fail' ? 'text-rose-400' : 'text-fuchsia-400'} />
            <span className={`font-mono text-[10px] uppercase tracking-widest ${systemState === 'fail' ? 'text-rose-400' : 'text-fuchsia-400'}`}>
              Circuit cost analysis · Hardware Blueprint
            </span>
          </div>

          <div className="flex items-center gap-3">
             <div className="text-[10px] font-mono uppercase opacity-40">Limit: {GATE_BUDGET} Gates</div>
             <div className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${
               systemState === 'fail' ? 'bg-rose-500 text-white' : 
               systemState === 'warning' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'
             }`}>
               {systemState === 'fail' ? 'Critical Failure' : systemState === 'warning' ? 'Budget Warning' : 'Safe'}
             </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {/* SOP cost */}
          <div className={`p-5 rounded-2xl border transition-all duration-500 ${
            isDarkMode ? 'bg-emerald-500/5' : 'bg-emerald-50'
          } ${cheaperForm === 'sop' ? 'border-emerald-500/40' : 'border-white/5 opacity-50'}`}>
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
                <div className={`text-2xl font-black ${sopGates > GATE_BUDGET ? 'text-rose-400' : 'text-emerald-400'}`}>{sopGates}</div>
              </div>
            </div>
          </div>

          {/* POS cost */}
          <div className={`p-5 rounded-2xl border transition-all duration-500 ${
            isDarkMode ? 'bg-amber-500/5' : 'bg-amber-50'
          } ${cheaperForm === 'pos' ? 'border-amber-500/40' : 'border-white/5 opacity-50'}`}>
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
                <div className={`text-2xl font-black ${posGates > GATE_BUDGET ? 'text-rose-400' : 'text-amber-400'}`}>{posGates}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Decision Winner */}
        <div className={`p-4 rounded-2xl flex items-start gap-4 transition-all duration-500 ${
          systemState === 'fail' 
            ? 'bg-rose-500/10 border border-rose-500/30' 
            : cheaperForm === 'tie'
              ? (isDarkMode ? 'bg-cyan-500/10 border border-cyan-400/30' : 'bg-cyan-50 border border-cyan-300')
              : cheaperForm === 'sop'
                ? (isDarkMode ? 'bg-emerald-500/10 border border-emerald-400/30' : 'bg-emerald-50 border border-emerald-300')
                : (isDarkMode ? 'bg-amber-500/10 border border-amber-400/30' : 'bg-amber-50 border border-amber-300')
        }`}>
          {systemState === 'fail' ? (
            <AlertTriangle size={20} className="text-rose-400 mt-1 shrink-0 animate-pulse" />
          ) : (
            <Trophy size={20} className={
              cheaperForm === 'tie' ? 'text-cyan-400 mt-1 shrink-0'
                : cheaperForm === 'sop' ? 'text-emerald-400 mt-1 shrink-0'
                : 'text-amber-400 mt-1 shrink-0'
            } />
          )}
          <div className={`text-sm leading-relaxed ${textColor}`}>
            <strong>
              {systemState === 'fail' 
                ? "CRITICAL: Current design exceeds area budget." 
                : cheaperForm === 'tie' 
                  ? 'Strategic Tie — choose based on problem phrasing.'
                  : `STRATEGY WINNER: ${cheaperForm.toUpperCase()} is more efficient.`}
            </strong>{' '}
            {systemState === 'fail' ? (
              <span className="text-rose-400 font-bold block mt-1">
                Both SOP and POS require more than {GATE_BUDGET} gates. Simplify the logic or reduce output assertions.
              </span>
            ) : (
              <span>
                {cheaperForm === 'sop' 
                  ? `SOP saves ${posGates - sopGates} gates. Targeting the few "1s" is the better blueprint here.` 
                  : `POS saves ${sopGates - posGates} gates. Bricking the few "0s" is the winning design choice.`}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Implementation preview */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-3xl border transition-all duration-500 ${cardBg} ${systemState === 'fail' ? 'opacity-30 pointer-events-none' : ''}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Silicon Blueprint · Two-level gate implementation
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <pre className={`font-mono text-[11px] leading-relaxed p-4 rounded-2xl overflow-x-auto ${
            isDarkMode ? 'bg-black/40 text-emerald-300' : 'bg-emerald-50 text-emerald-800'
          }`}>{`// SOP: AND→OR (2 levels)
${ones.length === 0
  ? '  F = 0  (no minterms)'
  : ones.map(i => `  AND${i}: ${buildMinterm(i)}`).join('\n') +
    `\n  OR: ${ones.map(i => `AND${i}`).join(' + ')}` +
    `\n  F = OR.out`}`}</pre>

          <pre className={`font-mono text-[11px] leading-relaxed p-4 rounded-2xl overflow-x-auto ${
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
