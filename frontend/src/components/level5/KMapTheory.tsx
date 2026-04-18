import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Puzzle, LayoutGrid, ArrowRight, Info, CheckCircle2, XCircle, BookOpen, Target, Layers } from 'lucide-react';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

// ── Shared Styling Utilities ──────────────────────────────────────────────────
const getColors = (isDarkMode: boolean, accent: string = 'sky') => ({
  text: isDarkMode ? 'text-slate-100' : 'text-slate-900',
  muted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  sub: isDarkMode ? `text-${accent}-400` : `text-${accent}-600`,
  cardBg: isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200 shadow-xl',
  cardInner: isDarkMode ? 'bg-black/40 border-slate-800' : 'bg-slate-50 border-slate-100',
});

const MathBlock = ({ children, isDarkMode }: { children: React.ReactNode, isDarkMode: boolean }) => (
  <div className={`p-6 rounded-2xl border font-mono text-center flex justify-center items-center overflow-x-auto
    ${isDarkMode ? 'bg-black/50 border-white/10' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
    <div className={`text-sm md:text-lg ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'} font-bold tracking-wider`}>
      {children}
    </div>
  </div>
);

const CalloutBox = ({ icon, color, title, children, isDarkMode }: any) => (
  <div className={`p-5 rounded-2xl border flex gap-4 items-start ${
    isDarkMode ? `bg-${color}-500/10 border-${color}-500/25` : `bg-${color}-50 border-${color}-200`
  }`}>
    <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-lg`}>{icon}</div>
    <div>
      {title && <p className={`font-black text-xs uppercase tracking-widest mb-1 text-${color}-${isDarkMode?'400':'600'}`}>{title}</p>}
      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{children}</p>
    </div>
  </div>
);

const StepBadge = ({ n, color = 'sky' }: { n: number; color?: string }) => (
  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-black text-sm bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`}>{n}</div>
);

// ── Cell overlay helpers ───────────────────────────────────────────────────────
const getOverlayStyle = (ri: number, ci: number, rows: number, cols: number) => {
  const CELL = 36;
  const GAP = 2;
  return {
    top: `${2 + ri * (CELL + GAP)}px`,
    left: `${2 + ci * (CELL + GAP)}px`,
    width: `${cols * CELL + (cols - 1) * GAP}px`,
    height: `${rows * CELL + (rows - 1) * GAP}px`
  };
};

// Custom MiniMap with fixed 36px cells
const MiniMapFixed = ({ label, isBad, items, groupStyles, isDarkMode, caption, rowLabels, colLabels, activeMinterm }: any) => {
  return (
    <div className={`p-6 rounded-[2rem] flex flex-col items-center gap-4 border ${isDarkMode ? 'bg-slate-900/50 border-white/5 shadow-inner' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
      <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isBad ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-600'}`}>
        {isBad ? '❌ ' : '✅ '}{label}
      </div>
      <div className="relative inline-block mt-2 pl-8 pt-6">
        {/* Column Labels */}
        {colLabels && (
          <div className="absolute top-0 left-8 flex gap-[2px]">
            {colLabels.map((cl: string, i: number) => (
              <div key={i} className="w-9 h-6 flex items-center justify-center font-mono text-[9px] font-bold text-slate-500">{cl}</div>
            ))}
          </div>
        )}
        {/* Row Labels */}
        {rowLabels && (
          <div className="absolute top-6 left-0 flex flex-col gap-[2px]">
            {rowLabels.map((rl: string, i: number) => (
              <div key={i} className="w-8 h-9 flex items-center justify-end pr-2 font-mono text-[9px] font-bold text-slate-500">{rl}</div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-[2px] bg-slate-500/20 p-[2px] rounded-xl overflow-hidden">
          {items.map((row: (number | string)[], ri: number) => (
            <div key={ri} className="flex gap-[2px]">
              {row.map((cell, ci) => (
                <div key={ci} className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  cell === 1 || cell === '1'
                    ? (isDarkMode ? 'bg-slate-800 text-white shadow-sm shadow-black/50 border border-white/5' : 'bg-white text-slate-800 border border-slate-200')
                    : (isDarkMode ? 'bg-slate-800/40 text-white/5 border border-white/5' : 'bg-slate-200/40 text-slate-300 border border-slate-100')
                } ${activeMinterm === cell ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-900 scale-105 z-10' : ''}`}>
                  {cell === 1 || cell === '1' ? '1' : (typeof cell === 'string' && cell.startsWith('m')) ? cell : '0'}
                </div>
              ))}
            </div>
          ))}
        </div>
        {groupStyles && groupStyles.map((style: any, i: number) => (
          <div key={i} className={`absolute border-2 pointer-events-none rounded-xl ${
            style.customColors
              ? style.customColors
              : isBad ? 'border-rose-500 bg-rose-500/30' : 'border-emerald-500 bg-emerald-500/30'
          }`} style={{ 
            ...style.css, 
            top: `calc(${style.css.top} + 24px)`, 
            left: `calc(${style.css.left} + 32px)`,
            transition: 'all 0.3s ease' 
          }} />
        ))}
      </div>
      {caption && <p className={`text-[10px] font-mono text-center max-w-[180px] leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{caption}</p>}
    </div>
  );
};

// ── Labeled grid for construction demos ──────────────────────────────────────
const KMap2x2 = ({ vals, highlights = [], isDarkMode }: { vals: number[], highlights?: number[], isDarkMode: boolean }) => {
  // vals: [m0,m1,m2,m3] → positions: TL,TR,BL,BR → map order: 00,01,10,11 → m0,m1,m2,m3
  const cells = [
    { m: 0, label: "A'B'", row: 0, col: 0 },
    { m: 1, label: "A'B",  row: 0, col: 1 },
    { m: 2, label: "AB'",  row: 1, col: 0 },
    { m: 3, label: "AB",   row: 1, col: 1 },
  ];
  return (
    <div className="inline-grid grid-cols-[28px_64px_64px] grid-rows-[28px_64px_64px] gap-[2px]">
      <div />
      <div className={`flex items-center justify-center text-xs font-bold font-mono ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>B=0</div>
      <div className={`flex items-center justify-center text-xs font-bold font-mono ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>B=1</div>
      {[0, 1].map(r => (
        <React.Fragment key={r}>
          <div className={`flex items-center justify-center text-xs font-bold font-mono ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>{r === 0 ? 'A=0' : 'A=1'}</div>
          {cells.filter(c => c.row === r).map(cell => (
            <div key={cell.m} className={`flex flex-col items-center justify-center rounded-xl border-2 gap-0.5 transition-all duration-300 ${
              highlights.includes(cell.m)
                ? (isDarkMode ? 'bg-amber-500/30 border-amber-400' : 'bg-amber-100 border-amber-400')
                : (isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300')
            }`}>
              <span className={`font-black text-lg ${vals[cell.m] === 1 ? (isDarkMode ? 'text-white' : 'text-slate-900') : (isDarkMode ? 'text-slate-600' : 'text-slate-300')}`}>{vals[cell.m]}</span>
              <span className={`font-mono text-[8px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{cell.label}</span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

// ── Step-through component ────────────────────────────────────────────────────
const StepThrough = ({ steps, accentColor, isDarkMode }: { steps: { title: string; body: React.ReactNode }[], accentColor: string, isDarkMode: boolean }) => {
  const [step, setStep] = useState(0);
  const s = steps[step];
  return (
    <div className={`rounded-[1.5rem] border overflow-hidden ${isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200 shadow-lg'}`}>
      {/* Progress dots */}
      <div className="flex gap-2 p-4 border-b border-white/5 items-center justify-between">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? `bg-${accentColor}-500 w-6` : `bg-slate-600 w-2 hover:bg-slate-500`}`}
            />
          ))}
        </div>
        <span className={`font-mono text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Step {step + 1}/{steps.length}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
          className="p-6 space-y-4">
          <h4 className={`font-black text-base ${isDarkMode ? `text-${accentColor}-400` : `text-${accentColor}-600`}`}>{s.title}</h4>
          {s.body}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between px-6 pb-5 pt-2">
        <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${step === 0 ? 'opacity-30 cursor-not-allowed' : (isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600')}`}>
          ← Prev
        </button>
        <button onClick={() => setStep(p => Math.min(steps.length - 1, p + 1))} disabled={step === steps.length - 1}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${step === steps.length - 1 ? 'opacity-30 cursor-not-allowed' : `bg-${accentColor}-500 text-white hover:bg-${accentColor}-600`}`}>
          Next →
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1: Intro
// ─────────────────────────────────────────────────────────────────────────────
export const IntroTheory: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const c = getColors(isDarkMode);
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <section className="text-center space-y-4">
        <motion.span initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} className={`font-mono text-[10px] tracking-[0.4em] uppercase ${c.sub} block mb-4 font-bold`}>
          The Problem of Simplification
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${c.text}`}>Why Do We Need K-Maps?</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-80 ${c.muted}`}>
          You can write a Boolean expression directly from a Truth Table (SOP). But the resulting expression can be <strong>huge</strong> and require too many physical gates.
        </p>
      </section>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <div className="flex items-center gap-3 mb-6">
          <Puzzle size={24} className="text-emerald-500" />
          <h3 className={`text-xl font-bold ${c.text}`}>The Optimization Challenge</h3>
        </div>
        <p className={`mb-6 leading-relaxed ${c.muted}`}>
          Consider a truth table that results in this Sum-of-Products (SOP) expression. It has four product terms, each needing a 3-input AND gate, plus a massive 4-input OR gate at the end!
        </p>
        <MathBlock isDarkMode={isDarkMode}>Y = A'BC + A'BC' + AB'C + ABC'</MathBlock>
        <div className="flex justify-center my-6 text-slate-400">
          <ArrowRight size={32} className="opacity-50" />
        </div>
        <p className={`mb-6 leading-relaxed ${c.muted}`}>
          Using a <strong>Karnaugh Map (K-Map)</strong>, this massive expression simplifies down to:
        </p>
        <MathBlock isDarkMode={isDarkMode}>Y = A ⊕ B ⊕ C</MathBlock>
        <div className={`mt-8 p-6 rounded-2xl ${c.cardInner}`}>
          <h4 className={`font-bold mb-2 flex items-center gap-2 ${c.text}`}>
            <Zap size={16} className="text-amber-500" /> The Engineer's Goal
          </h4>
          <p className={`text-sm ${c.muted} leading-relaxed`}>
            Minimization reduces expression size, saving logic gates, reducing manufacturing costs, lowering power consumption, and increasing chip speed.
            <strong> K-Maps make this optimization a visual pattern-matching game rather than complex algebra.</strong>
          </p>
        </div>
      </motion.div>

      {/* What IS a K-Map? ELI5 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35 }} className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <div className="flex items-center gap-3 mb-5">
          <BookOpen size={22} className="text-sky-500" />
          <h3 className={`text-xl font-bold ${c.text}`}>What even IS a K-Map? (The ELI-5 version)</h3>
        </div>
        <div className="space-y-5">
          <CalloutBox icon="🗺️" color="sky" title="Think of it as a Magic Map" isDarkMode={isDarkMode}>
            A K-Map is just a <strong>special table</strong> where you put the <strong>1s and 0s from your Truth Table</strong> into special boxes.
            The <em>magic</em> part is how those boxes are arranged — neighbors are not random! Every box that touches another box is just <strong>ONE variable different</strong>. That's the secret.
          </CalloutBox>
          <CalloutBox icon="🎮" color="emerald" title="The Circle Game" isDarkMode={isDarkMode}>
            Once you've placed your 1s, you play a game: <strong>circle the 1s in groups</strong>. The bigger the circle, the simpler your final answer. Each circle eventually becomes just one small term in your final Boolean expression. That's literally all K-Maps are!
          </CalloutBox>
          <CalloutBox icon="🧱" color="amber" title="Why Not Just Use Algebra?" isDarkMode={isDarkMode}>
            Boolean algebra can be extremely painful for more than 2 variables. You'd need to apply De Morgan's law, absorption, and distribution repeatedly — and it's very easy to make mistakes.
            K-Maps are a <strong>visual shortcut</strong> that gives you the minimal form directly without needing algebra.
          </CalloutBox>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2: 2-Variable K-Map (Deep Dive)
// ─────────────────────────────────────────────────────────────────────────────
export const TwoVarTheory: React.FC<Props> = ({ isDarkMode }) => {
  const c = getColors(isDarkMode, 'emerald');

  const constructionSteps = [
    {
      title: 'Step 1: List your variables',
      body: (
        <div className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>We have 2 variables: <strong>A</strong> and <strong>B</strong>. With 2 variables, there are 2² = <strong>4 possible input combinations</strong>.</p>
          <div className={`rounded-lg p-4 font-mono text-xs grid grid-cols-3 gap-1 text-center ${isDarkMode ? 'bg-black/30' : 'bg-slate-100'}`}>
            <div className="font-bold text-emerald-500">A</div><div className="font-bold text-emerald-500">B</div><div className="font-bold text-emerald-500">Y</div>
            <div>0</div><div>0</div><div>?</div>
            <div>0</div><div>1</div><div>?</div>
            <div>1</div><div>0</div><div>?</div>
            <div>1</div><div>1</div><div>?</div>
          </div>
          <p>Each row in this truth table becomes <strong>one cell</strong> in the K-Map.</p>
        </div>
      )
    },
    {
      title: 'Step 2: Draw a 2×2 grid',
      body: (
        <div className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Draw a 2×2 grid. Label the <strong>rows with A</strong> (0 on top, 1 on bottom) and <strong>columns with B</strong> (0 on left, 1 on right).</p>
          <div className="flex justify-center pt-2">
            <KMap2x2 vals={[0,0,0,0]} isDarkMode={isDarkMode} />
          </div>
          <p className="text-center text-xs font-mono opacity-60">Empty 2×2 K-Map grid</p>
        </div>
      )
    },
    {
      title: 'Step 3: Fill in the 1s',
      body: (
        <div className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Let's say Y = 1 for minterms m1 and m3 (when B=1, regardless of A). Place a <strong>1 in those cells</strong>, and a 0 in all others.</p>
          <div className="flex justify-center pt-2">
            <KMap2x2 vals={[0,1,0,1]} highlights={[1,3]} isDarkMode={isDarkMode} />
          </div>
          <p>→ m0 = 0 (A=0, B=0), m1 = <strong>1</strong> (A=0, B=1), m2 = 0 (A=1, B=0), m3 = <strong>1</strong> (A=1, B=1)</p>
        </div>
      )
    },
    {
      title: 'Step 4: Circle the groups',
      body: (
        <div className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>Both 1s are in the <strong>right column</strong> (B=1). They sit vertically adjacent → circle them as a pair of 2!</p>
          <div className="flex justify-center pt-2">
            <MiniMapFixed isDarkMode={isDarkMode} label="Pair in right column" isBad={false}
              items={[[0,1],[0,1]]}
              groupStyles={[{ css: getOverlayStyle(0, 1, 2, 1), customColors: 'border-emerald-500 bg-emerald-500/30' }]} />
          </div>
          <p>A group of 2 cells eliminates <strong>1 variable</strong>. A was 0 in one cell and 1 in the other — so A is eliminated! Only B=1 survives.</p>
        </div>
      )
    },
    {
      title: 'Step 5: Read the final expression',
      body: (
        <div className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          <p>The circled group covers cells where <strong>B = 1</strong>. A varies (both 0 and 1), so A disappears from the term.</p>
          <MathBlock isDarkMode={isDarkMode}>Y = B</MathBlock>
          <p>That's it! From a truth table, directly to <strong>Y = B</strong> — the simplest possible answer. No algebra needed. 🎉</p>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <section className="text-center space-y-4">
        <h2 className={`text-3xl md:text-5xl font-black ${c.text}`}>The 2-Variable Map</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-80 ${c.muted}`}>
          For 2 variables (A, B), there are 2² = 4 possible combinations. This is the simplest K-Map — a 2×2 grid. Perfect to learn the basics.
        </p>
      </section>

      {/* Grid anatomy */}
      <div className={`p-8 rounded-[2rem] border flex flex-col md:flex-row gap-12 items-center justify-center ${c.cardBg}`}>
        <div className="flex-1 space-y-6">
          <h3 className={`text-xl font-bold ${c.text} flex items-center gap-2`}><LayoutGrid size={22} className="text-emerald-500"/>Grid Anatomy</h3>
          <ul className={`space-y-4 ${c.muted}`}>
            <li className="flex items-start gap-3">
              <StepBadge n={1} color="emerald" />
              <div><strong>Rows = Variable A.</strong> Top row = A is 0, bottom row = A is 1.</div>
            </li>
            <li className="flex items-start gap-3">
              <StepBadge n={2} color="emerald" />
              <div><strong>Columns = Variable B.</strong> Left column = B is 0, right column = B is 1.</div>
            </li>
            <li className="flex items-start gap-3">
              <StepBadge n={3} color="emerald" />
              <div><strong>Each cell = one minterm.</strong> The value in the cell is your output Y from the truth table.</div>
            </li>
            <li className="flex items-start gap-3">
              <StepBadge n={4} color="emerald" />
              <div>Neighbors <strong>differ by exactly 1 variable</strong>. This is what makes grouping possible!</div>
            </li>
          </ul>
        </div>
        <div className="flex-1 p-6 flex flex-col items-center gap-4">
          <KMap2x2 vals={[0,1,0,1]} highlights={[1,3]} isDarkMode={isDarkMode} />
          <p className={`text-[11px] font-mono text-center max-w-xs leading-relaxed ${c.muted}`}>
            Example: Y = m1 + m3. The highlighted cells both have Y=1. They form a vertical pair in the B=1 column.
          </p>
        </div>
      </div>

      {/* Step-by-step construction */}
      <div className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <div className="flex items-center gap-3 mb-6">
          <Target size={22} className="text-emerald-500" />
          <h3 className={`text-xl font-bold ${c.text}`}>Step-by-Step: Build Your First K-Map</h3>
        </div>
        <StepThrough steps={constructionSteps} accentColor="emerald" isDarkMode={isDarkMode} />
      </div>

      {/* Minterm → Cell mapping table */}
      <div className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-lg font-bold ${c.text} mb-5 flex items-center gap-2`}><Info size={18} className="text-emerald-500" /> Minterm → Cell Position Reference</h3>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm font-mono rounded-xl overflow-hidden border ${isDarkMode?'border-slate-700':'border-slate-200'}`}>
            <thead>
              <tr className={isDarkMode?'bg-slate-800 text-slate-300':'bg-slate-100 text-slate-600'}>
                <th className="px-4 py-3 text-left">Minterm</th>
                <th className="px-4 py-3">A</th>
                <th className="px-4 py-3">B</th>
                <th className="px-4 py-3">Cell Label</th>
                <th className="px-4 py-3 text-left">English</th>
              </tr>
            </thead>
            <tbody>
              {[
                { m:'m0', a:'0', b:'0', l:"A'B'", e:"A is 0 AND B is 0" },
                { m:'m1', a:'0', b:'1', l:"A'B",  e:"A is 0 AND B is 1" },
                { m:'m2', a:'1', b:'0', l:"AB'",  e:"A is 1 AND B is 0" },
                { m:'m3', a:'1', b:'1', l:"AB",   e:"A is 1 AND B is 1" },
              ].map((r, i) => (
                <tr key={i} className={`border-t ${isDarkMode?'border-slate-700 text-slate-300 hover:bg-slate-800/80':'border-slate-100 text-slate-700 hover:bg-slate-50'}`}>
                  <td className="px-4 py-2 font-black text-emerald-500">{r.m}</td>
                  <td className="px-4 py-2 text-center">{r.a}</td>
                  <td className="px-4 py-2 text-center">{r.b}</td>
                  <td className="px-4 py-2 text-center font-bold">{r.l}</td>
                  <td className="px-4 py-2 text-xs">{r.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3: 3-Variable K-Map (Deep Dive)
// ─────────────────────────────────────────────────────────────────────────────
export const ThreeVarTheory: React.FC<Props> = ({ isDarkMode }) => {
  const c = getColors(isDarkMode, 'blue');
  const [activeMinterm, setActiveMinterm] = useState<number|null>(null);

  // Gray code column order for BC: 00, 01, 11, 10 → m indices per row
  const mintermMap = [
    [0, 1, 3, 2],   // A=0 row
    [4, 5, 7, 6],   // A=1 row
  ];
  const colHeaders = ['00','01','11','10'];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <section className="text-center space-y-4">
        <h2 className={`text-3xl md:text-5xl font-black ${c.text}`}>The 3-Variable Map</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-80 ${c.muted}`}>
          For 3 variables (A, B, C), there are 2³ = 8 possibilities. This requires a 2×4 grid. The twist? The COLUMNS must follow a special order.
        </p>
      </section>

      {/* Gray Code explanation */}
      <div className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h3 className={`text-xl font-bold flex items-center gap-2 ${c.text}`}>
              <LayoutGrid size={24} className="text-blue-500" />
              Why Gray Code? (The Golden Rule)
            </h3>
            <p className={`${c.muted} leading-relaxed`}>
              The whole point of K-Maps is that <strong>adjacent cells differ by exactly ONE variable</strong>. 
              If we used normal binary counting (00, 01, 10, 11), then columns 2 and 3 would be "01" and "10" — two bits change! That would break everything.
            </p>
            <div className={`p-5 rounded-2xl ${c.cardInner} space-y-3`}>
              <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest">The Gray Code Column Order</p>
              <div className="grid grid-cols-4 gap-3 text-center font-mono">
                {['00','01','11','10'].map((code, i) => (
                  <div key={code} className={`p-3 rounded-xl border ${isDarkMode?'bg-blue-500/10 border-blue-500/30 text-blue-300':'bg-blue-50 border-blue-200 text-blue-700'}`}>
                    <div className="font-black text-lg">{code}</div>
                    <div className="text-[9px] opacity-70 mt-1">col {i+1}</div>
                  </div>
                ))}
              </div>
              <p className={`text-xs ${c.muted} leading-relaxed pt-2`}>
                Notice: <strong>00→01</strong> (only C changes), <strong>01→11</strong> (only B changes), <strong>11→10</strong> (only C changes), <strong>10→00</strong> (only B changes). 
                Every step — only ONE bit flips! This is the entire foundation.
              </p>
            </div>
            <CalloutBox icon="🚨" color="rose" title="Common Mistake!" isDarkMode={isDarkMode}>
              Never write columns as 00, 01, 10, 11 (normal binary order). The correct order MUST be 00, 01, <strong>11, 10</strong>. The 3rd and 4th columns are SWAPPED compared to normal counting.
            </CalloutBox>
          </div>

          {/* Interactive 3-var grid */}
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="relative p-6 overflow-x-auto">
              <div className={`absolute top-0 left-14 text-xs font-black ${c.sub}`}>BC →</div>
              <div className={`absolute top-8 left-0 text-xs font-black ${c.sub}`}>A↓</div>
              <div className="ml-10 mt-6 grid grid-cols-[32px_68px_68px_68px_68px] grid-rows-[32px_68px_68px] gap-1">
                <div />
                {colHeaders.map(h => (
                  <div key={h} className={`flex justify-center items-end pb-2 font-bold font-mono text-sm ${c.muted}`}>{h}</div>
                ))}
                {mintermMap.map((row, ri) => (
                  <React.Fragment key={ri}>
                    <div className={`flex justify-end items-center pr-2 font-bold ${c.muted}`}>{ri}</div>
                    {row.map((m) => (
                      <button key={m}
                        onMouseEnter={() => setActiveMinterm(m)}
                        onMouseLeave={() => setActiveMinterm(null)}
                        className={`border-2 flex flex-col items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
                          activeMinterm === m
                            ? (isDarkMode ? 'bg-blue-500/40 border-blue-400' : 'bg-blue-100 border-blue-400')
                            : (isDarkMode ? 'bg-slate-800 border-slate-600 hover:border-slate-500' : 'bg-white border-slate-300 hover:border-blue-300')
                        }`}>
                        <span className={`font-mono text-sm font-bold ${isDarkMode?'text-blue-300':'text-blue-700'}`}>m{m}</span>
                        <span className={`font-mono text-[9px] ${c.muted}`}>{m.toString(2).padStart(3,'0')}</span>
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
            {activeMinterm !== null && (
              <motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}}
                className={`px-4 py-3 rounded-xl border font-mono text-sm text-center ${isDarkMode?'bg-blue-500/10 border-blue-500/30 text-blue-300':'bg-blue-50 border-blue-200 text-blue-700'}`}>
                m{activeMinterm} = A={Math.floor(activeMinterm/4)}, B={Math.floor((activeMinterm%4)/2)}, C={activeMinterm%2}
              </motion.div>
            )}
            <p className={`text-[10px] font-mono text-center max-w-xs opacity-60 ${c.muted}`}>Hover cells to see variable values</p>
          </div>
        </div>
      </div>

      {/* Minterm position cheatsheet */}
      <div className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-lg font-bold ${c.text} mb-6 flex items-center gap-2`}><Layers size={18} className="text-blue-500" /> 3-Variable Minterm Positions (Cheatsheet)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { m: 'm0', abc: '000', pos: 'A=0 row, BC=00 column', label: "A'B'C'" },
            { m: 'm1', abc: '001', pos: 'A=0 row, BC=01 column', label: "A'B'C" },
            { m: 'm2', abc: '010', pos: 'A=0 row, BC=10 column', label: "A'BC'" },
            { m: 'm3', abc: '011', pos: 'A=0 row, BC=11 column', label: "A'BC" },
            { m: 'm4', abc: '100', pos: 'A=1 row, BC=00 column', label: "AB'C'" },
            { m: 'm5', abc: '101', pos: 'A=1 row, BC=01 column', label: "AB'C" },
            { m: 'm6', abc: '110', pos: 'A=1 row, BC=10 column', label: "ABC'" },
            { m: 'm7', abc: '111', pos: 'A=1 row, BC=11 column', label: "ABC" },
          ].map((r,i) => (
            <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border ${isDarkMode?'bg-slate-800/50 border-slate-700 text-slate-300':'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <span className="font-black text-blue-500 font-mono w-6">{r.m}</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-lg ${isDarkMode?'bg-black/30 text-slate-400':'bg-slate-200 text-slate-500'}`}>{r.abc}</span>
              <span className="font-mono text-xs font-bold flex-1">{r.label}</span>
              <span className={`text-[9px] text-right opacity-50`}>{r.pos}</span>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <CalloutBox icon="⚠️" color="amber" title="IMPORTANT: m2 and m3 are NOT in columns 2 and 3!" isDarkMode={isDarkMode}>
            m3 (011) goes in the BC=11 column (column 3), but m2 (010) goes in the BC=10 column (column 4). The columns are in Gray Code order, NOT binary order. Always write out the column header first before placing minterms!
          </CalloutBox>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4: 4-Variable K-Map (Deep Dive)
// ─────────────────────────────────────────────────────────────────────────────
export const FourVarTheory: React.FC<Props> = ({ isDarkMode }) => {
  const c = getColors(isDarkMode, 'purple');

  const gcRows = ['00','01','11','10'];
  const gcCols = ['00','01','11','10'];

  // Row starting minterms: 00→0, 01→4, 11→12, 10→8
  const rowStart = [0, 4, 12, 8];
  // Col offsets (gray code): 00→0, 01→1, 11→3, 10→2
  const colOffset = [0, 1, 3, 2];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <section className="text-center space-y-4">
        <h2 className={`text-3xl md:text-5xl font-black ${c.text}`}>The 4-Variable Map</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-80 ${c.muted}`}>
          For 4 variables (A, B, C, D), there are 2⁴ = 16 minterms. The K-Map is now a 4×4 grid. Both rows AND columns use Gray Code.
        </p>
      </section>

      {/* Grid with explanation */}
      <div className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1 space-y-5">
            <h3 className={`text-xl font-bold ${c.text}`}>The 4×4 Structure</h3>
            <p className={`${c.muted} leading-relaxed`}>
              Now we have 4 variables: <strong>A, B</strong> labelling rows and <strong>C, D</strong> labelling columns.
              Both axis use Gray Code — so both the row jump and the column jump are all single-bit changes.
            </p>
            <div className="space-y-3">
              {[
                { label: 'Row AB', vals: '00 → 01 → 11 → 10', color: 'purple' },
                { label: 'Column CD', vals: '00 → 01 → 11 → 10', color: 'blue' },
              ].map(item => (
                <div key={item.label} className={`flex items-center gap-4 p-4 rounded-xl ${isDarkMode?'bg-black/30':'bg-slate-50'}`}>
                  <span className={`font-black text-[10px] uppercase tracking-widest text-${item.color}-${isDarkMode?'400':'600'} shrink-0 w-24`}>{item.label}</span>
                  <span className={`font-mono text-sm text-${item.color}-${isDarkMode?'300':'700'} font-bold`}>{item.vals}</span>
                </div>
              ))}
            </div>
            <CalloutBox icon="🎯" color="purple" title="The Key Insight" isDarkMode={isDarkMode}>
              With 4×4, you can now make groups of <strong>1, 2, 4, 8, or 16</strong> cells. A group of 16 (all cells) means the output is always 1 and simplifies to Y=1. Groups of 8 mean only one variable survived!
            </CalloutBox>
          </div>

          {/* 4×4 grid */}
          <div className="overflow-x-auto">
            <div className="relative p-2">
              <div className={`text-[10px] font-bold uppercase tracking-widest text-center mb-2 ${isDarkMode?'text-blue-400':'text-blue-600'}`}>CD →</div>
              <div className="grid grid-cols-[44px_52px_52px_52px_52px] grid-rows-[28px_52px_52px_52px_52px] gap-[2px]">
                <div className={`flex items-center justify-end pr-2 text-[9px] font-black uppercase tracking-widest ${isDarkMode?'text-purple-400':'text-purple-600'}`}>AB↓</div>
                {gcCols.map(h => (
                  <div key={h} className={`flex justify-center items-center font-bold font-mono text-xs ${c.muted}`}>{h}</div>
                ))}
                {gcRows.map((r, ri) => (
                  <React.Fragment key={r}>
                    <div className={`flex justify-end items-center pr-2 font-bold font-mono text-xs ${c.muted}`}>{r}</div>
                    {colOffset.map((co, ci) => {
                      const m = rowStart[ri] + co;
                      return (
                        <div key={ci} className={`flex flex-col items-center justify-center rounded-lg border transition-all duration-200 hover:border-purple-400 ${isDarkMode?'bg-slate-800 border-slate-700 hover:bg-purple-500/10':'bg-white border-slate-300 hover:bg-purple-50'}`}>
                          <span className={`font-mono text-[10px] font-bold ${isDarkMode?'text-purple-300':'text-purple-700'}`}>m{m}</span>
                          <span className={`font-mono text-[7px] opacity-50 ${c.muted}`}>{m.toString(2).padStart(4,'0')}</span>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gotchas & tips */}
      <div className={`p-8 rounded-[2rem] border ${c.cardBg} space-y-5`}>
        <h3 className={`text-lg font-bold ${c.text} flex items-center gap-2`}><Zap size={18} className="text-amber-500" /> 4-Variable Traps To Avoid</h3>
        <div className="grid grid-cols-1 gap-12">
          {/* Trap 1: Minterm Placement */}
          <div className={`p-8 rounded-[2.5rem] border ${c.cardBg} space-y-8`}>
            <div className="flex items-center gap-3">
              <Zap className="text-amber-500" size={20} />
              <div className="flex flex-col">
                <h3 className={`text-xl font-black ${c.text}`}>Trap 1: The Index Confusion</h3>
                <p className={`text-xs ${c.muted}`}>Row index vs Binary Value</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MiniMapFixed isBad={true} isDarkMode={isDarkMode} 
                label="Mistake: Normal Order (0,1,2,3)"
                caption="Placing m12 in row 4 because you think row 3 is 10 and row 4 is 11."
                rowLabels={['00','01','10','11']} colLabels={['00','01','11','10']}
                items={[[0,0,0,0],[0,0,0,0],[0,0,0,0],['m12',0,0,0]]} />
              <MiniMapFixed isBad={false} isDarkMode={isDarkMode} 
                label="Truth: Gray Code Order"
                caption="m12 (1100) MUST be in the AB=11 row. In Gray code, that is row 3!"
                rowLabels={['00','01','11','10']} colLabels={['00','01','11','10']}
                items={[[0,0,0,0],[0,0,0,0],['m12',0,0,0],[0,0,0,0]]} />
            </div>
          </div>

          {/* Trap 2: Axis Labeling */}
          <div className={`p-8 rounded-[2.5rem] border ${c.cardBg} space-y-8`}>
            <div className="flex items-center gap-3">
              <Zap className="text-blue-500" size={20} />
              <div className="flex flex-col">
                <h3 className={`text-xl font-black ${c.text}`}>Trap 2: The Binary Axis</h3>
                <p className={`text-xs ${c.muted}`}>Sequential counting breaks K-Maps</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MiniMapFixed isBad={true} isDarkMode={isDarkMode} 
                label="Mistake: 00, 01, 10, 11"
                caption="Columns differ by 2 bits (01 → 10). Groups won't work!"
                rowLabels={['00','01','11','10']} colLabels={['00','01','10','11']}
                items={[[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]} 
                groupStyles={[{ css: getOverlayStyle(0,1,1,2) }]} />
              <MiniMapFixed isBad={false} isDarkMode={isDarkMode} 
                label="Truth: 00, 01, 11, 10"
                caption="Only 1 bit changes between every pair. Perfectly adjacent!"
                rowLabels={['00','01','11','10']} colLabels={['00','01','11','10']}
                items={[[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]}
                groupStyles={[{ css: getOverlayStyle(0,1,1,2), customColors: 'border-emerald-500 bg-emerald-500/30' }]} />
            </div>
          </div>

          {/* Trap 3: Pac-Man Wrap */}
          <div className={`p-8 rounded-[2.5rem] border ${c.cardBg} space-y-8`}>
            <div className="flex items-center gap-3">
              <Zap className="text-purple-500" size={20} />
              <div className="flex flex-col">
                <h3 className={`text-xl font-black ${c.text}`}>Trap 3: The Edge Isolation</h3>
                <p className={`text-xs ${c.muted}`}>Forgetting the map is a donut</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MiniMapFixed isBad={true} isDarkMode={isDarkMode} 
                label="Mistake: Isolated Groups"
                caption="Two small terms (A'B'D' + AB'D'). Not fully optimized."
                rowLabels={['00','01','11','10']} colLabels={['00','01','11','10']}
                items={[[1,0,0,0],[0,0,0,0],[0,0,0,0],[1,0,0,0]]}
                groupStyles={[{ css: getOverlayStyle(0,0,1,1) }, { css: getOverlayStyle(3,0,1,1) }]} />
              <MiniMapFixed isBad={false} isDarkMode={isDarkMode} 
                label="Truth: Wrap-Around Group"
                caption="Top-Left (m0) and Bottom-Left (m8) are neighbors! Results in one simpler term (B'C'D')."
                rowLabels={['00','01','11','10']} colLabels={['00','01','11','10']}
                items={[[1,0,0,0],[0,0,0,0],[0,0,0,0],[1,0,0,0]]}
                groupStyles={[
                  { css: { ...getOverlayStyle(0,0,1,1), borderBottomStyle:'dashed', borderBottomColor:'transparent', borderBottomLeftRadius:0, borderBottomRightRadius:0 }, customColors:'border-emerald-500 bg-emerald-500/30' },
                  { css: { ...getOverlayStyle(3,0,1,1), borderTopStyle:'dashed', borderTopColor:'transparent', borderTopLeftRadius:0, borderTopRightRadius:0 }, customColors:'border-emerald-500 bg-emerald-500/30' }
                ]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 5: Grouping Rules (Deep Dive)
// ─────────────────────────────────────────────────────────────────────────────
const getOverlayStyleH = (ri: number, ci: number, rows: number, cols: number) => {
  const CELL = 36;
  const GAP = 2;
  return {
    top: `${2 + ri * (CELL + GAP)}px`,
    left: `${2 + ci * (CELL + GAP)}px`,
    width: `${cols * CELL + (cols - 1) * GAP}px`,
    height: `${rows * CELL + (rows - 1) * GAP}px`
  };
};

export const GroupingRulesTheory: React.FC<Props> = ({ isDarkMode }) => {
  const c = getColors(isDarkMode, 'amber');

  const rules = [
    {
      title: "Rule 1: Power-of-Two Group Sizes Only",
      icon: "2ⁿ",
      emoji: "🔢",
      layman: "Imagine you're making pizza. A pizza can only be cut into 1, 2, 4, 8, or 16 slices — never 3, 5, or 6! Why? Because each time you double the group size, you cancel out one more variable, giving you a simpler expression. 3 or 5 just doesn't work in binary math.",
      theory: "Groups must have sizes that are powers of 2: 1, 2, 4, 8, 16. This is because grouping 2ⁿ adjacent cells allows exactly n variables to cancel out. You cannot simplify a group of 3 because it would require eliminating a fractional variable — mathematically impossible in Boolean algebra.",
      simplification: "Group of 1 → saves nothing\nGroup of 2 → eliminates 1 variable\nGroup of 4 → eliminates 2 variables\nGroup of 8 → eliminates 3 variables\nGroup of 16 → eliminates ALL variables → Y = 1",
      examples: (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <MiniMapFixed isDarkMode={isDarkMode} label="WRONG: Group of 3" isBad={true} caption="3 is not a power of 2 — illegal!"
            items={[[1,1,1,0],[0,0,0,0]]}
            groupStyles={[{ css: getOverlayStyle(0,0,1,3) }]} />
          <MiniMapFixed isDarkMode={isDarkMode} label="RIGHT: Two groups of 2" isBad={false} caption="Two pairs = two terms in final expression"
            items={[[1,1,1,0],[0,0,0,0]]}
            groupStyles={[
              { css: getOverlayStyle(0,0,1,2), customColors: 'border-emerald-500 bg-emerald-500/30' },
              { css: getOverlayStyle(0,1,1,2), customColors: 'border-blue-500 bg-blue-500/30' }
            ]} />
        </div>
      )
    },
    {
      title: "Rule 2: Only Perfect Rectangles (No L-shapes, No Diagonals)",
      icon: "▬",
      emoji: "📐",
      layman: "Imagine building a wall with Lego bricks. You can only build a flat, rectangular wall. You can't build an L-shape or a staircase pattern. Why? Because L-shapes don't represent any clean Boolean term. A rectangle means 'these variables stay the same, those variables vary'.",
      theory: "A group must form a perfect rectangle (or square) on the K-Map grid. An L-shape has no single corresponding Boolean term. Rectangular groups are required because a valid group represents: 'some variables are CONSTANT across all cells (those survive), while other variables CHANGE across cells (those get eliminated).' Only rectangles have a clean split between changing and constant variables.",
      simplification: "Rectangle corner (ri,ci) to (ri+rows-1, ci+cols-1)\n→ Surviving variables are those with same value in ALL cells.",
      examples: (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <MiniMapFixed isDarkMode={isDarkMode} label="WRONG: L-shape" isBad={true} caption="No single Boolean term equals an L-shape"
            items={[[1,1],[1,0]]}
            groupStyles={[{ css: { top:'2px', left:'2px', width:'76px', height:'76px', borderRadius:'12px' } }]} />
          <MiniMapFixed isDarkMode={isDarkMode} label="RIGHT: Two rectangles" isBad={false} caption="Top pair + left pair = two terms"
            items={[[1,1],[1,0]]}
            groupStyles={[
              { css: getOverlayStyle(0,0,1,2), customColors: 'border-emerald-500 bg-emerald-500/40' },
              { css: getOverlayStyle(0,0,2,1), customColors: 'border-blue-500 bg-blue-500/40' }
            ]} />
        </div>
      )
    },
    {
      title: "Rule 3: Cells Can Be Shared (Overlapping Groups)",
      icon: "∩",
      emoji: "🤝",
      layman: "In K-Maps, a 1 can be a member of MULTIPLE groups simultaneously. Think of it like a student who joins BOTH the Chess Club AND the Science Club. The goal is to make each group as BIG as possible, and sharing members (1s) is the trick to forming bigger groups! Actually, if a cell is already covered, you MUST still try to use it again to form an even bigger group.",
      theory: "Every group must cover at least one 'essential prime implicant' — a '1' that no other group can cover. But beyond that, cells may (and should) be shared between multiple groups. Sharing allows you to form larger prime implicants. The algorithm is: find the biggest legal group for each '1', even if it overlaps an already-covered '1'. Minimize the TOTAL number of groups needed, not the overlap.",
      simplification: "Sharing is ALWAYS allowed.\nSharing helps form LARGER groups → fewer, simpler terms.",
      examples: (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <MiniMapFixed isDarkMode={isDarkMode} label="WRONG: No sharing" isBad={true} caption="Missed a group-of-4! Wasted opportunity."
            items={[[0,1,1,0],[0,1,1,0]]}
            groupStyles={[
              { css: getOverlayStyle(0,1,1,1) },
              { css: getOverlayStyle(0,2,1,1) },
              { css: getOverlayStyle(1,1,1,1) },
              { css: getOverlayStyle(1,2,1,1) },
            ]} />
          <MiniMapFixed isDarkMode={isDarkMode} label="RIGHT: Share to grow" isBad={false} caption="One quad = one simple term. Maximum!"
            items={[[0,1,1,0],[0,1,1,0]]}
            groupStyles={[
              { css: getOverlayStyle(0,1,2,2), customColors: 'border-emerald-500 bg-emerald-500/40' },
            ]} />
        </div>
      )
    },
    {
      title: "Rule 4: The Pac-Man Rule — Wrap-Around",
      icon: "⟳",
      emoji: "👾",
      layman: "Imagine the K-Map is printed on a piece of paper and then you roll it into a cylinder so the left edge touches the right edge, and the top edge touches the bottom edge. Now cells that were on opposite sides are now neighbors! This is the 'wrap-around' rule — edge cells CAN be grouped with their partner on the other side.",
      theory: "A K-Map is topologically a torus (a donut shape). The left and right edges wrap around (horizontally), and the top and bottom edges wrap around (vertically). This means: Column 1 (CD=00) and column 4 (CD=10) are adjacent — they differ by only D. Row 1 (AB=00) and row 4 (AB=10) are adjacent — they differ by only A. Diagonal wrap-arounds are also valid (all 4 corners form a valid group of 4!).",
      simplification: "Valid wraps:\n· Left column ↔ Right column (horizontal)\n· Top row ↔ Bottom row (vertical)\n· All 4 corners form a group of 4",
      examples: (
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <MiniMapFixed isDarkMode={isDarkMode} label="Horizontal wrap (L↔R)" isBad={false} caption="Left col + right col = pair. CD=00 adj to CD=10 (differ by D only)"
            items={[[1,0,0,1],[1,0,0,1]]}
            groupStyles={[
              { css: { ...getOverlayStyleH(0,0,2,1), borderRightStyle:'dashed', borderRightColor:'transparent', borderTopRightRadius:0, borderBottomRightRadius:0 }, customColors:'border-purple-500 bg-purple-500/30' },
              { css: { ...getOverlayStyleH(0,3,2,1), borderLeftStyle:'dashed', borderLeftColor:'transparent', borderTopLeftRadius:0, borderBottomLeftRadius:0 }, customColors:'border-purple-500 bg-purple-500/30' }
            ]} />
          <MiniMapFixed isDarkMode={isDarkMode} label="Vertical wrap (T↔B)" isBad={false} caption="Top row + bottom row = pair. AB=00 adj to AB=10 (differ by A only)"
            items={[[1,1,0,0],[0,0,0,0],[1,1,0,0]]}
            groupStyles={[
              { css: { ...getOverlayStyleH(0,0,1,2), borderBottomStyle:'dashed', borderBottomColor:'transparent', borderBottomLeftRadius:0, borderBottomRightRadius:0 }, customColors:'border-pink-500 bg-pink-500/30' },
              { css: { ...getOverlayStyleH(2,0,1,2), borderTopStyle:'dashed', borderTopColor:'transparent', borderTopLeftRadius:0, borderTopRightRadius:0 }, customColors:'border-pink-500 bg-pink-500/30' }
            ]} />
        </div>
      )
    },
    {
      title: "Rule 5: Make the BIGGEST Groups Possible",
      icon: "↑",
      emoji: "🏆",
      layman: "Always go for the BIGGEST team possible. A team of 4 beats two teams of 2 every single time. Why? Because a bigger group means more variables cancel out, giving you a simpler term with fewer gates. More gates = more money = slower chip. Bigger groups = cheaper, faster electronics.",
      theory: "Always prefer the largest possible group (prime implicant). Never settle for a subgroup if a larger valid group exists. A prime implicant is a group that cannot be made any bigger without including a 0. Your goal is to cover all 1s using the minimum number of prime implicants. An essential prime implicant is a group that is the ONLY group covering at least one '1' — it must be included.",
      simplification: "Prime Implicant = biggest legal group for a given '1'\nEssential PI = only group covering a particular '1'\n→ Essential PIs MUST be included in the final answer.",
      examples: (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <MiniMapFixed isDarkMode={isDarkMode} label="WRONG: Small groups" isBad={true} caption="Two pairs when a quad was possible. Wasted gates!"
            items={[[1,1,1,1],[0,0,0,0]]}
            groupStyles={[
              { css: getOverlayStyle(0,0,1,2) },
              { css: getOverlayStyle(0,2,1,2) }
            ]} />
          <MiniMapFixed isDarkMode={isDarkMode} label="RIGHT: One big quad" isBad={false} caption="One group of 4 = one one-literal term! Half the gates."
            items={[[1,1,1,1],[0,0,0,0]]}
            groupStyles={[
              { css: getOverlayStyle(0,0,1,4), customColors: 'border-emerald-500 bg-emerald-500/30' }
            ]} />
        </div>
      )
    },
    {
      title: "Rule 6: Every '1' Must Be Covered",
      icon: "✓",
      emoji: "☑️",
      layman: "No 1 can be left behind! Every single 1 in your K-Map MUST be inside at least one circle. If you forget to include a 1, your final expression will produce a wrong output for that input. Imagine a scoreboard that shows '1' for the winning condition — you can't leave a win uncounted!",
      theory: "An essential objective: all minterms with output=1 must be covered by at least one prime implicant group. It's fine if a '1' is covered by multiple groups (sharing), but every '1' must be covered by at least one group. Uncovered '1's lead to incorrect simplification. The final expression is the OR of all selected prime implicant terms.",
      simplification: "∀ minterm mᵢ where Y=1: mᵢ must be in at least one selected group.",
      examples: (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <MiniMapFixed isDarkMode={isDarkMode} label="WRONG: Missed one '1'" isBad={true} caption="m3 is uncovered → wrong circuit output!"
            items={[[0,0,1,0],[1,0,1,0]]}
            groupStyles={[
              { css: getOverlayStyle(1,0,1,1) },   // covers m4 equiv
            ]} />
          <MiniMapFixed isDarkMode={isDarkMode} label="RIGHT: All 1s covered" isBad={false} caption="Both groups needed — both 1s covered."
            items={[[0,0,1,0],[1,0,1,0]]}
            groupStyles={[
              { css: getOverlayStyle(0,2,2,1), customColors:'border-emerald-500 bg-emerald-500/30' },
              { css: getOverlayStyle(1,0,1,1), customColors:'border-blue-500 bg-blue-500/30' }
            ]} />
        </div>
      )
    },
    {
      title: "Rule 7: How to Read a Group → Extract the Term",
      icon: "→",
      emoji: "📖",
      layman: "After circling your groups, how do you turn each circle into a math term? Look at the variables across ALL cells in the group. If a variable is ALWAYS 0 in every cell of the group → write it complement (A'). If it's ALWAYS 1 → write it normal (A). If it CHANGES between 0 and 1 across the group → it cancels out! Don't write it at all!",
      theory: "For each selected group, examine each variable across all cells in the group. A variable appears in the term if and only if its value is CONSTANT throughout the group. If a variable is 0 for all cells → include it complemented (X'). If it's 1 for all cells → include it as-is (X). If it changes → it was eliminated by the grouping. Multiply all surviving variables together to get the term for that group. OR all group-terms together for the final expression.",
      simplification: "For group G:\nTerm(G) = AND of all variables that are constant in G\nFinal Y = OR of Term(G) for all selected groups",
      examples: (
        <div className="mt-4 space-y-3">
          <div className={`p-4 rounded-xl font-mono text-xs space-y-1.5 ${isDarkMode?'bg-black/30 text-slate-300':'bg-slate-100 text-slate-800'}`}>
            <p className="font-bold text-amber-500 mb-2">Example: 3-variable group of 4</p>
            <p>Group covers: m0(000), m1(001), m4(100), m5(101)</p>
            <p>→ A: 0,0,1,1 — CHANGES → eliminated</p>
            <p>→ B: 0,0,0,0 — ALWAYS 0 → write B'</p>
            <p>→ C: 0,1,0,1 — CHANGES → eliminated</p>
            <p className="font-black text-emerald-400 pt-1">Term = B' ✓</p>
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8">
      <section className="text-center space-y-4">
        <h2 className={`text-3xl md:text-5xl font-black ${c.text}`}>The Complete Grouping Rulebook</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-80 ${c.muted}`}>
          7 essential rules. Master these and K-Maps become automatic. Each rule is explained like you're 5 — then the theory underneath.
        </p>
      </section>

      <div className="flex flex-col gap-8">
        {rules.map((rule, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className={`p-6 sm:p-10 rounded-[2rem] border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shrink-0 ${isDarkMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-600 border border-amber-200'}`}>
                {rule.emoji}
              </div>
              <div>
                <h3 className={`text-xl font-black ${c.text}`}>{rule.title}</h3>
                <p className={`font-mono text-[10px] uppercase tracking-widest mt-1 ${c.muted} opacity-60`}>Rule {idx + 1} of 7</p>
              </div>
            </div>

            {/* ELI-5 callout */}
            <div className={`mb-6 p-5 rounded-2xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200/50'}`}>
              <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-2">🧒 Explain Like I'm 5</p>
              <p className={`text-base leading-relaxed font-medium ${isDarkMode?'text-amber-200/90':'text-amber-900/80'}`}>
                {rule.layman}
              </p>
            </div>

            {/* Theory */}
            <div className={`mb-6 p-5 rounded-2xl ${isDarkMode ? 'bg-slate-900/60 border border-white/5' : 'bg-slate-50 border border-slate-200'}`}>
              <p className={`text-sky-500 font-black text-[10px] uppercase tracking-widest mb-2`}>🔬 The Real Theory</p>
              <p className={`text-sm leading-relaxed ${c.muted}`}>{rule.theory}</p>
              {rule.simplification && (
                <pre className={`mt-3 text-[11px] font-mono leading-relaxed whitespace-pre-wrap ${isDarkMode?'text-emerald-400':'text-emerald-700'}`}>
                  {rule.simplification}
                </pre>
              )}
            </div>

            {/* Visual examples */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${c.muted} opacity-60`}>Visual Examples</p>
              <div className={`flex flex-wrap gap-4 justify-center sm:justify-start bg-black/5 p-4 rounded-2xl border border-white/5`}>
                {rule.examples}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Final summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className={`p-10 rounded-[2rem] border ${isDarkMode ? 'bg-emerald-950/30 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200'}`}>
        <h3 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>⚡ The 60-Second Cheatsheet</h3>
        <ol className={`space-y-2 text-sm font-mono leading-relaxed ${isDarkMode ? 'text-emerald-200/80' : 'text-emerald-900'}`}>
          {[
            'Fill in the K-Map from the truth table (1s and 0s).',
            'Find all "1"s that need to be covered.',
            'For each "1", find the LARGEST legal group (power of 2, rectangle, can wrap).',
            'Select groups to cover ALL "1"s using the FEWEST groups.',
            'Prefer bigger groups over smaller — always.',
            'For each selected group, identify variables that are CONSTANT → that is your term.',
            'OR all terms together → that is your minimized expression!',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className={`shrink-0 font-black text-emerald-500`}>{i+1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 6: Don't Care Conditions
// ─────────────────────────────────────────────────────────────────────────────
export const DontCareTheory: React.FC<Props> = ({ isDarkMode }) => {
  const c = getColors(isDarkMode, 'rose');
  const CELL = 36, GAP = 2;
  const ov = (ri: number, ci: number, rows: number, cols: number) => ({
    top: `${2 + ri*(CELL+GAP)}px`, left: `${2 + ci*(CELL+GAP)}px`,
    width: `${cols*CELL+(cols-1)*GAP}px`, height: `${rows*CELL+(rows-1)*GAP}px`,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <section className="text-center space-y-4">
        <span className={`font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400 block font-bold`}>The X Factor</span>
        <h2 className={`text-3xl md:text-5xl font-black ${c.text}`}>Don't Care Conditions</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-80 ${c.muted}`}>
          Some input combinations will <strong>never occur</strong> in real life. For those, we literally don't care what the output is — and we can exploit that freedom to make BIGGER groups.
        </p>
      </section>

      {/* ELI5 */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">🤷</span>
          <h3 className={`text-xl font-bold ${c.text}`}>ELI-5: What are Don't Cares?</h3>
        </div>
        <div className={`p-6 rounded-2xl mb-5 ${isDarkMode?'bg-rose-500/10 border border-rose-500/20':'bg-rose-50 border border-rose-100'}`}>
          <p className={`text-base leading-relaxed font-medium ${isDarkMode?'text-rose-200':'text-rose-900'}`}>
            Imagine a vending machine with 4 buttons (A, B, C, D). But only 10 combinations are valid — the other 6 physically can't happen because you can't press those buttons simultaneously. For those impossible inputs, it doesn't matter what the machine does — so we mark the output with an <strong className="font-black text-rose-400">"X"</strong>. We can then treat each X as either 0 or 1, whichever helps us form BIGGER groups and get a simpler expression!
          </p>
        </div>
        <div className={`p-5 rounded-2xl ${c.cardInner}`}>
          <p className={`text-xs font-black uppercase tracking-widest text-amber-500 mb-3`}>Where Do Don't Cares Come From?</p>
          <ul className={`space-y-2 text-sm ${c.muted}`}>
            {[
              ['BCD Inputs', 'BCD uses codes 0–9 only. Codes 1010–1111 (10–15) never appear → 6 don\'t-care cells!'],
              ['Physical constraints', 'Some button combos on a physical panel can\'t be pressed simultaneously.'],
              ['Unused FSM states', 'A 3-bit counter cycling through only 5 states leaves 3 states unused.'],
              ['Design choice', 'Designer says: "I don\'t care about this edge case — optimise the common path."'],
            ].map(([t, d], i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="shrink-0 w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-black mt-0.5">{i+1}</span>
                <div><strong className={isDarkMode?'text-slate-200':'text-slate-800'}>{t}: </strong>{d}</div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Symbol + Rule */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-xl font-bold ${c.text} mb-6 flex items-center gap-2`}><span className="text-2xl">✏️</span> The Symbol and the Golden Rule</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl ${c.cardInner} flex flex-col gap-3`}>
            <p className={`text-xs font-black uppercase tracking-widest text-rose-${isDarkMode?'400':'600'}`}>The Symbol</p>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl font-black border-2 ${isDarkMode?'bg-rose-500/20 border-rose-500/40 text-rose-300':'bg-rose-50 border-rose-300 text-rose-700'}`}>X</div>
              <p className={`text-sm leading-relaxed ${c.muted}`}>Don't care cells are written as <strong>X</strong> (also <strong>d</strong> or <strong>φ</strong>). They appear wherever the input combination is impossible or irrelevant.</p>
            </div>
          </div>
          <div className={`p-6 rounded-2xl ${c.cardInner} flex flex-col gap-3`}>
            <p className={`text-xs font-black uppercase tracking-widest text-emerald-${isDarkMode?'400':'600'}`}>The Golden Rule</p>
            <ul className={`text-sm space-y-2 ${c.muted}`}>
              <li>✅ Treat X as <strong>1</strong> if it helps form a BIGGER group.</li>
              <li>✅ Treat X as <strong>0</strong> — just leave it uncircled.</li>
              <li>🚫 You are <strong>NEVER forced</strong> to use an X.</li>
              <li>🚫 You <strong>CANNOT</strong> form a group of ONLY Xs — every group needs at least one real 1.</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Visual Example */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-xl font-bold ${c.text} mb-6 flex items-center gap-2`}><Target size={20} className="text-rose-400"/>Visual: Don't Cares in Action</h3>
        <div className="flex flex-col sm:flex-row gap-8 items-start flex-wrap">

          {/* Without */}
          <div className="flex flex-col items-center gap-3">
            <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode?'text-slate-400':'text-slate-500'}`}>Without Don't Cares</p>
            <div className="relative inline-block">
              <div className="flex flex-col gap-[2px] bg-slate-500/20 p-[2px] rounded-xl">
                {[['0','1','X','X'],['0','1','X','X'],['0','1','X','X'],['0','1','X','X']].map((row,ri) => (
                  <div key={ri} className="flex gap-[2px]">
                    {row.map((cell,ci) => (
                      <div key={ci} className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        cell==='1'?(isDarkMode?'bg-slate-700 text-emerald-400':'bg-emerald-50 text-emerald-700'):
                        cell==='X'?(isDarkMode?'bg-rose-950/50 text-rose-400 opacity-50':'bg-rose-50 text-rose-500 opacity-60'):
                        (isDarkMode?'bg-slate-800/40 text-slate-600':'bg-white/60 text-slate-400')}`}>{cell}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="absolute border-2 rounded-xl border-emerald-500 bg-emerald-500/20 pointer-events-none" style={ov(0,1,4,1)} />
            </div>
            <p className={`font-mono text-xs ${c.muted}`}>Only a column of 4 → <strong className="text-emerald-400">Y = C'D</strong></p>
          </div>

          <div className="flex items-center self-center text-2xl opacity-30">→</div>

          {/* With */}
          <div className="flex flex-col items-center gap-3">
            <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode?'text-emerald-400':'text-emerald-700'}`}>✅ With Don't Cares Used</p>
            <div className="relative inline-block">
              <div className="flex flex-col gap-[2px] bg-slate-500/20 p-[2px] rounded-xl">
                {[['0','1','X','X'],['0','1','X','X'],['0','1','X','X'],['0','1','X','X']].map((row,ri) => (
                  <div key={ri} className="flex gap-[2px]">
                    {row.map((cell,ci) => (
                      <div key={ci} className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        cell==='1'?(isDarkMode?'bg-slate-700 text-emerald-400':'bg-emerald-50 text-emerald-700'):
                        cell==='X'?(isDarkMode?'bg-rose-900/40 text-rose-300':'bg-rose-50 text-rose-500'):
                        (isDarkMode?'bg-slate-800/40 text-slate-600':'bg-white/60 text-slate-400')}`}>{cell}</div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="absolute border-2 rounded-xl border-emerald-500 bg-emerald-500/20 pointer-events-none" style={ov(0,1,4,2)} />
            </div>
            <p className={`font-mono text-xs text-emerald-400 font-bold`}>Xs used → group of 8 → <strong className="text-emerald-300">Y = D</strong> (Simpler!)</p>
          </div>
        </div>

        <div className={`mt-8 p-5 rounded-2xl ${isDarkMode?'bg-emerald-950/30 border border-emerald-800/30':'bg-emerald-50 border border-emerald-200'}`}>
          <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-2">⚡ The Payoff</p>
          <p className={`text-sm leading-relaxed ${isDarkMode?'text-emerald-200/80':'text-emerald-900'}`}>
            In complex 4-variable problems, using don't cares wisely can reduce a 4-term SOP expression down to 1–2 terms. Always check if any X cells sit next to your 1s before finalizing your groups!
          </p>
        </div>
      </motion.div>

      {/* Quick tips table */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-lg font-bold ${c.text} mb-5`}>📋 Don't Care — Quick Reference</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon:'✅', title:'Always OK',  items:['Treat X as 1 to expand a group','Leave X uncircled (treat as 0)','Use some Xs as 1 and others as 0 in same map'] },
            { icon:'🚫', title:'Never OK',   items:['Create a group of ONLY Xs','Be forced to include every X','Form a group that doesn\'t actually reduce variables'] },
          ].map(sec => (
            <div key={sec.title} className={`p-5 rounded-2xl ${c.cardInner}`}>
              <p className={`font-black text-sm mb-3 ${sec.icon==='✅'?'text-emerald-500':'text-rose-500'}`}>{sec.icon} {sec.title}</p>
              <ul className={`space-y-2 text-sm ${c.muted}`}>
                {sec.items.map((it,i) => <li key={i} className="flex gap-2 items-start"><span className="opacity-40 shrink-0">→</span>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className={`mt-5 p-4 rounded-2xl font-mono text-xs text-center ${isDarkMode?'bg-black/40 text-rose-300':'bg-rose-50 text-rose-700'}`}>
          Don't Cares are written as: <strong>X</strong> or <strong>d</strong> or <strong>φ</strong> — all mean the same thing!
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 7: POS (Product of Sums)
// ─────────────────────────────────────────────────────────────────────────────
export const POSTheory: React.FC<Props> = ({ isDarkMode }) => {
  const c = getColors(isDarkMode, 'violet');
  const CELL = 36, GAP = 2;
  const ov = (ri: number, ci: number, rows: number, cols: number) => ({
    top: `${2 + ri*(CELL+GAP)}px`, left: `${2 + ci*(CELL+GAP)}px`,
    width: `${cols*CELL+(cols-1)*GAP}px`, height: `${rows*CELL+(rows-1)*GAP}px`,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <section className="text-center space-y-4">
        <span className={`font-mono text-[10px] tracking-[0.4em] uppercase ${isDarkMode?'text-violet-400':'text-violet-600'} block font-bold`}>The Mirror Approach</span>
        <h2 className={`text-3xl md:text-5xl font-black ${c.text}`}>Product of Sums (POS)</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-80 ${c.muted}`}>
          Everything so far was <strong>SOP</strong> — we circled the 1s. POS is the mirror image: circle the <strong>0s</strong> to get an equally valid (sometimes simpler) expression.
        </p>
      </section>

      {/* Maxterms Section */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-xl font-bold ${c.text} mb-6 flex items-center gap-2`}><BookOpen size={20} className="text-violet-400"/>Minterms vs Maxterms</h3>
        <p className={`text-sm mb-6 leading-relaxed ${c.muted}`}>
          In digital logic, every row in a truth table can be described in two ways. If the row has output=1, we call it a <strong>Minterm (m)</strong>. If the row has output=0, we call it a <strong>Maxterm (M)</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl ${c.cardInner}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black`}>Σ</span>
              <p className="font-black text-xs uppercase tracking-widest text-emerald-500">SOP Notation</p>
            </div>
            <p className={`text-xs mb-3 font-mono ${c.muted}`}>Uses lowercase <strong>m</strong> and Sum (Σ)</p>
            <div className={`p-3 rounded-xl font-mono text-sm ${isDarkMode?'bg-black/40 text-emerald-400':'bg-white text-emerald-700'}`}>
              Y = Σm(1, 4, 6)
            </div>
            <p className={`text-[10px] mt-3 opacity-60 ${c.muted}`}>"Output is 1 for rows 1, 4, and 6"</p>
          </div>

          <div className={`p-6 rounded-2xl ${c.cardInner}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-black`}>Π</span>
              <p className="font-black text-xs uppercase tracking-widest text-violet-500">POS Notation</p>
            </div>
            <p className={`text-xs mb-3 font-mono ${c.muted}`}>Uses UPCASE <strong>M</strong> and Product (Π)</p>
            <div className={`p-3 rounded-xl font-mono text-sm ${isDarkMode?'bg-black/40 text-violet-400':'bg-white text-violet-700'}`}>
              Y = ΠM(0, 2, 3, 5, 7)
            </div>
            <p className={`text-[10px] mt-3 opacity-60 ${c.muted}`}>"Output is 0 for rows 0, 2, 3, 5, and 7"</p>
          </div>
        </div>

        <div className={`mt-6 p-4 rounded-xl border border-dashed ${isDarkMode?'border-violet-500/20 bg-violet-500/5':'border-violet-200 bg-violet-50'}`}>
          <p className={`text-xs text-center italic ${c.muted}`}>
            Notice: If a row index isn't in the Σ list, it MUST be in the Π list. They are perfect complements!
          </p>
        </div>
      </motion.div>

      {/* SOP vs POS overview */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-xl font-bold ${c.text} mb-6`}>SOP vs POS — The Big Picture</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title:'SOP — Sum of Products', sub:'(What you already know)', color:'emerald',
              steps:['Circle groups of 1s','Each circle → AND term','OR all terms together'],
              circuit:'AND gates → OR gate', ex:'Y = AB + BC\'D' },
            { title:'POS — Product of Sums', sub:'(The mirror approach)', color:'violet',
              steps:['Circle groups of 0s','Each circle → OR term (variables FLIPPED)','AND all terms together'],
              circuit:'OR gates → AND gate', ex:'Y = (A+B)(B\'+C)' },
          ].map(side => (
            <div key={side.title} className={`p-6 rounded-2xl border ${isDarkMode?`bg-${side.color}-950/20 border-${side.color}-800/30`:`bg-${side.color}-50 border-${side.color}-200`}`}>
              <p className={`font-black text-sm text-${side.color}-${isDarkMode?'400':'700'} mb-1`}>{side.title}</p>
              <p className={`text-[10px] font-mono uppercase tracking-widest mb-4 ${c.muted}`}>{side.sub}</p>
              <ol className={`space-y-1.5 text-sm ${c.muted}`}>
                {side.steps.map((s,i) => <li key={i} className="flex gap-2"><span className={`font-black text-${side.color}-${isDarkMode?'400':'600'} shrink-0`}>{i+1}.</span>{s}</li>)}
              </ol>
              <div className={`mt-4 p-3 rounded-xl font-mono text-xs ${isDarkMode?'bg-black/30':'bg-white/70'}`}>
                <span className={`text-[9px] font-black uppercase tracking-widest text-${side.color}-500 block mb-1`}>Circuit type</span>
                <span className={c.muted}>{side.circuit}</span>
              </div>
              <div className={`mt-2 p-3 rounded-xl font-mono text-xs ${isDarkMode?'bg-black/30':'bg-white/70'}`}>
                <span className={`text-[9px] font-black uppercase tracking-widest text-${side.color}-500 block mb-1`}>Example output</span>
                <span className={`font-black text-${side.color}-${isDarkMode?'300':'700'}`}>{side.ex}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={`mt-6 p-5 rounded-2xl ${c.cardInner}`}>
          <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-2">💡 Which one to use?</p>
          <p className={`text-sm leading-relaxed ${c.muted}`}>
            Both SOP and POS produce <strong>logically equivalent</strong> circuits. Use whichever gives <strong>fewer terms with fewer variables</strong>.
            Rule of thumb: more 1s than 0s → SOP; more 0s than 1s → POS; equal → compare both.
          </p>
        </div>
      </motion.div>

      {/* ELI5 */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <div className="flex items-center gap-3 mb-5"><span className="text-3xl">🧒</span><h3 className={`text-xl font-bold ${c.text}`}>POS Explained Like You're 5</h3></div>
        <div className={`p-6 rounded-2xl ${isDarkMode?'bg-violet-500/10 border border-violet-500/20':'bg-violet-50 border border-violet-200'}`}>
          <p className={`text-base leading-relaxed font-medium ${isDarkMode?'text-violet-200':'text-violet-900'}`}>
            In SOP you ask: <em>"When does the light turn ON?"</em> You list all the happy conditions (1s) and say "turn on when A AND B, OR when C AND D."
            <br /><br />
            In POS you instead ask: <em>"When does the light turn OFF?"</em> You list all the sad conditions (0s) and say "it stays OFF when NOT A or NOT B — AND when NOT C or NOT D."
            <br /><br />
            Both fully describe the same light. One starts from the OFF conditions, the other from the ON conditions. Same house — different map.
          </p>
        </div>
      </motion.div>

      {/* The POS Construction Algorithm */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-xl font-bold ${c.text} mb-6 flex items-center gap-3`}><Layers size={22} className="text-violet-400"/>The POS Construction Algorithm</h3>
        <p className={`text-sm mb-6 ${c.muted}`}>
          Building a POS expression is like weaving a safety net. You aren't describing what's there (1s), you're describing what MUST be true for the output to NOT be zero.
        </p>

        <div className="space-y-8">
          {/* Step 1: Mapping */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className={`shrink-0 w-12 h-12 rounded-full border-2 border-violet-500 flex items-center justify-center font-black text-violet-400 bg-violet-500/10`}>1</div>
            <div className="flex-1">
              <p className={`font-bold ${isDarkMode?'text-white':'text-slate-900'} mb-1`}>Map the Zeros</p>
              <p className={`text-xs ${c.muted}`}>Fill the K-Map with 0s and 1s from your truth table. Forget the 1s exist for a moment; we only have eyes for the zeros.</p>
            </div>
          </div>

          {/* Step 2: Grouping with Visual */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className={`shrink-0 w-12 h-12 rounded-full border-2 border-violet-500 flex items-center justify-center font-black text-violet-400 bg-violet-500/10`}>2</div>
            <div className="flex-1">
              <p className={`font-bold ${isDarkMode?'text-white':'text-slate-900'} mb-1`}>Circle the 0s (Power of 2)</p>
              <p className={`text-xs ${c.muted}`}>Just like SOP, group the zeros into pools of 2, 4, or 8. Don't forget the **Wrapping Rule**! Zeros on the edges can reach through the "mirrored walls."</p>
            </div>
            <div className="relative p-2 bg-slate-900/40 rounded-xl border border-white/5">
              <div className="flex flex-col gap-1">
                 <div className="flex gap-1">
                   <div className="w-6 h-6 rounded bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] text-violet-300 font-bold">0</div>
                   <div className="w-6 h-6 rounded bg-black/40 text-slate-700 flex items-center justify-center text-[10px]">1</div>
                   <div className="w-6 h-6 rounded bg-black/40 text-slate-700 flex items-center justify-center text-[10px]">1</div>
                   <div className="w-6 h-6 rounded bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] text-violet-300 font-bold">0</div>
                 </div>
              </div>
              <div className="absolute top-1 left-1 bottom-1 w-7 border-2 border-violet-400 rounded-lg pointer-events-none opacity-50 border-r-0" />
              <div className="absolute top-1 right-1 bottom-1 w-7 border-2 border-violet-400 rounded-lg pointer-events-none opacity-50 border-l-0" />
              <p className="text-[8px] font-mono text-violet-400 mt-1 text-center italic">Wrapping Zeros!</p>
            </div>
          </div>

          {/* Step 3: Extract with Equation */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className={`shrink-0 w-12 h-12 rounded-full border-2 border-violet-500 flex items-center justify-center font-black text-violet-400 bg-violet-500/10`}>3</div>
            <div className="flex-1">
              <p className={`font-bold ${isDarkMode?'text-white':'text-slate-900'} mb-1`}>Write the OR Terms</p>
              <p className={`text-xs ${c.muted}`}>Look at each group. Find who is constant. If a variable is 0, write it normally. If it is 1, complement it. Then ADD (OR) them together.</p>
            </div>
            <div className={`p-3 rounded-lg font-mono text-sm border-2 border-dashed ${isDarkMode?'bg-violet-900/20 border-violet-500/30 text-violet-200':'bg-violet-50 border-violet-200 text-violet-700'}`}>
              (A + B' + C)
            </div>
          </div>
        </div>
      </motion.div>

      {/* The Critical Flip */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-xl font-bold ${c.text} mb-6 flex items-center gap-2`}><span className="text-2xl">⚠️</span> The Critical Flip: Reading POS Terms</h3>
        <p className={`mb-6 leading-relaxed ${c.muted}`}>This is where most students trip up. When you circle 0s for POS, the reading rule is the <strong>exact opposite</strong> of SOP.</p>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { title:'SOP Reading (circling 1s)', color:'emerald',
              rules:['Constant 1 → write normally: A','Constant 0 → write complemented: A\'','Changes → eliminate','Combine with AND ( · )'],
              ex:'Term: AB\'C' },
            { title:'POS Reading (circling 0s) ← FLIPPED!', color:'violet',
              rules:['Constant 0 → write normally: A','Constant 1 → write complemented: A\'','Changes → eliminate','Combine with OR ( + )'],
              ex:'Term: (A + B\' + C)' },
          ].map(side => (
            <div key={side.title} className={`p-5 rounded-2xl border ${isDarkMode?`bg-${side.color}-950/20 border-${side.color}-800/30`:`bg-${side.color}-50 border-${side.color}-200`}`}>
              <p className={`font-black text-${side.color}-${isDarkMode?'400':'700'} text-xs uppercase tracking-widest mb-3`}>{side.title}</p>
              <ul className={`text-sm space-y-2 ${c.muted}`}>
                {side.rules.map((r,i) => <li key={i} className="flex gap-2"><span className={`text-${side.color}-${isDarkMode?'400':'600'} font-bold shrink-0`}>→</span>{r}</li>)}
              </ul>
              <div className={`mt-3 p-3 rounded-xl font-mono text-xs ${isDarkMode?'bg-black/30':'bg-white/70'}`}>
                <span className={`font-black text-${side.color}-${isDarkMode?'300':'700'}`}>{side.ex}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={`mt-5 p-5 rounded-2xl ${isDarkMode?'bg-amber-950/30 border border-amber-800/30':'bg-amber-50 border border-amber-200'}`}>
          <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-2">🔁 Memory Trick</p>
          <p className={`text-sm ${c.muted}`}>
            SOP: circling 1s — constant-1 stays normal. POS: circling 0s — constant-0 stays normal (0 is "at home" in a zeros-group). The unusual value always gets complemented.
          </p>
        </div>
      </motion.div>

      {/* Worked Example Side-by-Side */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        className={`p-8 rounded-[2rem] border ${c.cardBg}`}>
        <h3 className={`text-xl font-bold ${c.text} mb-4`}>🚀 Battle of Methods: When POS Wins</h3>
        <p className={`text-sm mb-8 leading-relaxed ${c.muted}`}>
          Let's look at a map with lots of <strong>1s</strong> and very few <strong>0s</strong>. 
          <br/>Function: <strong>Y = Σm(0, 1, 2, 4, 5, 6)</strong>
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* SOP */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-black text-emerald-500 text-xs uppercase tracking-widest">Method A: SOP (1s)</p>
              <span className="text-[10px] font-mono opacity-50 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Complex</span>
            </div>
            <div className="relative inline-block">
              <div className="flex flex-col gap-[2px] bg-slate-500/20 p-[2px] rounded-xl">
                {[[1,1,0,1],[1,1,0,1]].map((row,ri) => (
                   <div key={ri} className="flex gap-[2px]">
                     {row.map((cell,ci) => (
                       <div key={ci} className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg ${
                         cell===1?(isDarkMode?'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30':'bg-emerald-50 text-emerald-700 border border-emerald-200'):(isDarkMode?'bg-slate-800/40 text-slate-600':'bg-white/50 text-slate-400')}`}>{cell}</div>
                     ))}
                   </div>
                ))}
              </div>
              {/* Group 1: Cols 0 & 1 (Term: B') */}
              <div className="absolute border-2 rounded-xl border-emerald-400 bg-emerald-400/10 pointer-events-none animate-pulse" style={ov(0,0,2,2)} />
              
              {/* Group 2: Cols 0 & 3 (Wrapping) (Term: C') */}
              <div className="absolute border-2 rounded-xl border-emerald-500/60 bg-emerald-400/5 pointer-events-none" style={{...ov(0,0,2,1), borderRight:'none', borderTopRightRadius:0, borderBottomRightRadius:0}} />
              <div className="absolute border-2 rounded-xl border-emerald-500/60 bg-emerald-400/5 pointer-events-none" style={{...ov(0,3,2,1), borderLeft:'none', borderTopLeftRadius:0, borderBottomLeftRadius:0}} />
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode?'bg-black/30':'bg-white/70'} space-y-2`}>
              <p className="text-[11px] font-mono leading-relaxed opacity-70 italic">Two groups of 4 (one wraps!)</p>
              <p className="font-bold text-emerald-500 font-mono text-xs">Y = B' + C'</p>
              <p className="text-[10px] opacity-50 uppercase font-black tracking-tighter">Requires 2 large groups to cover all 1s.</p>
            </div>
          </div>

          {/* POS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-black text-violet-400 text-xs uppercase tracking-widest">Method B: POS (0s)</p>
              <span className="text-[10px] font-mono bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded uppercase font-black tracking-widest animate-pulse">Efficient!</span>
            </div>
            <div className="relative inline-block">
              <div className="flex flex-col gap-[2px] bg-slate-500/20 p-[2px] rounded-xl">
                {[[1,1,0,1],[1,1,0,1]].map((row,ri) => (
                   <div key={ri} className="flex gap-[2px]">
                     {row.map((cell,ci) => (
                       <div key={ci} className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg ${
                         cell===0?(isDarkMode?'bg-violet-500/20 text-violet-300 border border-violet-500/30':'bg-violet-50 text-violet-700 border border-violet-200'):(isDarkMode?'bg-slate-800/40 text-slate-600':'bg-white/50 text-slate-400')}`}>{cell}</div>
                     ))}
                   </div>
                ))}
              </div>
              {/* POS Group */}
              <div className="absolute border-2 rounded-xl border-violet-400 bg-violet-400/20 pointer-events-none" style={ov(0,2,2,1)} />
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode?'bg-black/30':'bg-white/70'} space-y-2`}>
              <p className="text-[11px] font-mono leading-relaxed opacity-70">Just ONE vertical group of 2 zeros! 🎯</p>
              <p className="font-bold text-violet-400 font-mono text-xs italic">Y = (B' + C')</p>
              <p className="text-[10px] opacity-50 uppercase font-black tracking-tighter">Total gates: 1 NOT + 1 OR</p>
            </div>
          </div>
        </div>

        <div className={`mt-8 p-6 rounded-2xl border ${isDarkMode?'bg-indigo-950/20 border-indigo-800/30':'bg-indigo-50 border-indigo-200'}`}>
          <div className="flex items-start gap-4">
            <div className="mt-1"><Zap size={20} className="text-indigo-400"/></div>
            <div>
              <p className={`font-black text-sm mb-1 ${isDarkMode?'text-indigo-300':'text-indigo-800'}`}>The Hardware Advantage</p>
              <p className={`text-sm leading-relaxed ${c.muted}`}>
                While POS is often just a "style choice," it has a secret weapon: <strong>NOR Gates</strong>. 
                In the real world, it's often cheaper and faster to manufacture NOR gates. 
                Since <strong>POS is naturally "NOR-Logic friendly,"</strong> engineers use it to build ultra-fast processors with fewer transistors.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Complete Algorithm Comparison Table */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        className={`p-8 rounded-[2rem] border ${isDarkMode?'bg-violet-950/30 border-violet-800/30':'bg-violet-50 border-violet-200'}`}>
        <h3 className={`text-xl font-black mb-6 ${isDarkMode?'text-violet-300':'text-violet-800'}`}>🗂 Complete SOP vs POS Comparison Table</h3>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm rounded-xl overflow-hidden border ${isDarkMode?'border-violet-800':'border-violet-200'}`}>
            <thead>
              <tr className={isDarkMode?'bg-violet-900/40 text-violet-200':'bg-violet-100 text-violet-800'}>
                <th className="px-4 py-3 text-left">Step</th>
                <th className="px-4 py-3 text-center text-emerald-400">SOP</th>
                <th className="px-4 py-3 text-center text-violet-400">POS</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['What to circle',        'Groups of 1s',           'Groups of 0s'],
                ['Group size rule',       'Power of 2 only',        'Power of 2 only'],
                ['Constant-0 variable',   "Write X' (complement)",  'Write X (normal)'],
                ['Constant-1 variable',   'Write X (normal)',        "Write X' (complement)"],
                ['Changing variable',     'Eliminate it',           'Eliminate it'],
                ['Combine within group',  'AND ( · )',              'OR ( + )'],
                ['Combine all groups',    'OR ( + )',               'AND ( · )'],
                ["Don't cares (X)",       'May treat X as 1',       'May treat X as 0'],
                ['When to prefer',        'More 1s than 0s',        'More 0s than 1s'],
              ].map(([step,sop,pos],i) => (
                <tr key={i} className={`border-t ${isDarkMode?'border-violet-800/50 text-slate-300 hover:bg-violet-900/20':'border-violet-100 text-slate-700 hover:bg-violet-50'}`}>
                  <td className="px-4 py-2.5 font-medium opacity-70 text-xs">{step}</td>
                  <td className={`px-4 py-2.5 text-center font-mono text-xs font-bold ${isDarkMode?'text-emerald-400':'text-emerald-700'}`}>{sop}</td>
                  <td className={`px-4 py-2.5 text-center font-mono text-xs font-bold ${isDarkMode?'text-violet-400':'text-violet-700'}`}>{pos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`mt-4 text-xs font-mono italic text-center ${c.muted}`}>
          For Don't Cares in POS: treat X as 0 (leave uncircled) to avoid covering real 0s — opposite of SOP where X→1.
        </p>
      </motion.div>

      {/* Final Engineering Pro-Tip */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
        className={`p-6 rounded-2xl border-2 border-dashed ${isDarkMode?'bg-emerald-950/10 border-emerald-500/20':'bg-emerald-50 border-emerald-200'} flex items-center gap-6`}>
        <div className="text-4xl text-emerald-400">💡</div>
        <div>
          <p className={`font-black text-xs uppercase tracking-widest text-emerald-${isDarkMode?'400':'600'} mb-1`}>Engineering Pro-Tip</p>
          <p className={`text-sm leading-relaxed ${c.muted}`}>
            If you ever find a truth table where <strong>every single row is 1 except for one row</strong>, don't waste time with 3 or 4 SOP groups. Circle that single 0 and write a <strong>single POS term</strong>. You'll save hours of design time!
          </p>
        </div>
      </motion.div>
    </div>
  );
};
