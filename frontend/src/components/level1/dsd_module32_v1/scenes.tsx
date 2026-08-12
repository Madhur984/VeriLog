/**
 * Flip-Flop Representations - dsd/32, "One Cell, Three Tables" (Sequential Logic track).
 * Generic scenes come from the shared _subtractor kit; every table is COMPUTED by
 * the shared _sequential/blocks library (CharTable / ExciteTable / ffCharRows /
 * ffExcite / FF_META), never hardcoded. The three-views cover switcher, the
 * present->next dialect timeline, the forward analysis pipeline (a D flip-flop with
 * D = X (+) Q, walked live on a state diagram), the reverse synthesis pipeline (the
 * same behaviour rebuilt as a T flip-flop with T = X, via a computed excitation
 * table and 2x2 K-map), and the four-portraits analogy are bespoke. Every next
 * state comes from ffNext, every excitation from ffExcite, so nothing can drift.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  CharTable, ExciteTable, ffCharRows, ffExcite, FF_META, FlipFlopViz,
  StateDiagram, StateTable, Toggle, ClockButton, ffNext, type FFType,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { fwd: '#38bdf8', rev: '#fb7185', good: '#34d399', warn: '#f59e0b' };
const SRC_EN: string | undefined = '/videos/dsd32-representations.mp4';
const SRC_HI: string | undefined = undefined;

const TYPES: FFType[] = ['SR', 'JK', 'D', 'T'];

/* a shared 4-type picker */
const TypeTabs: React.FC<{ value: FFType; onChange: (t: FFType) => void; accent: string }>
  = ({ value, onChange, accent }) => (
  <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
    {TYPES.map((ty) => (
      <button key={ty} onClick={() => onChange(ty)}
        className="rounded-lg border px-3.5 py-1.5 font-mono text-[12px] font-black transition-colors active:scale-95"
        style={value === ty
          ? { background: accent, color: '#000', borderColor: accent }
          : { borderColor: `${accent}44`, color: accent }}>
        {ty}
      </button>
    ))}
  </div>
);

/* ───────── bespoke: the cover switcher - one flip-flop, three views ─────────
   Pick a type and read it forward (characteristic) and backward (excitation)
   side by side. Both tables are generated from the same _sequential logic. */
const ThreeViews: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [ty, setTy] = useState<FFType>('JK');
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'एक flip-flop, तीन नज़रिये' : 'one flip-flop, three views'}
      </div>
      <TypeTabs value={ty} onChange={setTy} accent={accent} />
      <div className="mb-4 text-center font-mono text-[12px] font-bold" style={{ color: accent }}>{FF_META[ty].eq}</div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: ACC.fwd }}>
            {lang === 'hi' ? 'characteristic · forward' : 'characteristic · forward'}
          </div>
          <CharTable isDarkMode={isDarkMode} accent={ACC.fwd} type={ty} />
        </div>
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: ACC.rev }}>
            {lang === 'hi' ? 'excitation · reverse' : 'excitation · reverse'}
          </div>
          <ExciteTable isDarkMode={isDarkMode} accent={ACC.rev} type={ty} />
        </div>
      </div>
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>वही {ty} flip-flop — बाएँ table कहती है "next state क्या होगा", दाएँ table कहती है "यह transition पाने को कौन सा input चाहिए"।</>
          : <>the same {ty} flip-flop — the left table says "what the next state will be", the right says "what input is needed to force this transition".</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: the three dialects, labelled ───────── */
const DialectStrip: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const items: { k: string; d: string; c: string }[] = [
    { k: 'operating / truth', d: lang === 'hi' ? 'input combo → mode (Hold/Set/Reset/Toggle)' : 'input combo → mode (Hold/Set/Reset/Toggle)', c: accent },
    { k: 'characteristic', d: lang === 'hi' ? 'inputs + Qₙ → next Qₙ₊₁ · analysis (forward)' : 'inputs + Qₙ → next Qₙ₊₁ · analysis (forward)', c: ACC.fwd },
    { k: 'excitation', d: lang === 'hi' ? 'Qₙ → Qₙ₊₁ ⇒ needed input · synthesis (reverse)' : 'Qₙ → Qₙ₊₁ ⇒ needed input · synthesis (reverse)', c: ACC.rev },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'तीन dialect, एक device' : 'three dialects, one device'}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.k} className="rounded-2xl border p-3.5" style={{ borderColor: `${it.c}55`, background: `${it.c}0d` }}>
            <div className="font-mono text-[12px] font-black uppercase tracking-wide" style={{ color: it.c }}>{it.k}</div>
            <div className={`mt-1.5 text-[12.5px] leading-snug ${t.sub}`}>{it.d}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ───────── bespoke: present Qₙ → next Qₙ₊₁ timeline (live, computed via ffNext) ───────── */
const DialectTimeline: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [ty, setTy] = useState<FFType>('JK');
  const two = FF_META[ty].inputs.length === 2;
  const [q, setQ] = useState(0);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const nx = ffNext(ty, q, a, two ? b : 0);
  const invalid = nx === -1;
  const qn = invalid ? q : nx;
  const [la, lb] = FF_META[ty].inputs;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'present Qₙ → next Qₙ₊₁ · एक clock edge' : 'present Qₙ → next Qₙ₊₁ · one clock edge'}
      </div>
      <TypeTabs value={ty} onChange={setTy} accent={accent} />
      <svg viewBox="0 0 340 132" className="mx-auto w-full max-w-xl">
        {/* present-state box at time t */}
        <rect x="14" y="34" width="70" height="60" rx="10" fill={box} stroke={accent} strokeWidth="2.4" />
        <text x="49" y="26" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>t (now)</text>
        <text x="49" y="58" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string}>Qₙ =</text>
        <text x="49" y="80" textAnchor="middle" fontFamily="monospace" fontSize="20" fontWeight="900" fill={q ? accent : dim}>{q}</text>
        {/* FF in the middle with a rising clock edge */}
        <line x1="84" y1="64" x2="132" y2="64" stroke={accent} strokeWidth="2.6" />
        <rect x="132" y="40" width="76" height="48" rx="9" fill={box} stroke={accent} strokeWidth="2.4" />
        <text x="170" y="60" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="800" fill={accent}>{FF_META[ty].name} FF</text>
        <text x="170" y="76" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>{two ? `${la},${lb}=${a},${b}` : `${la}=${a}`}</text>
        {/* clock edge marker */}
        <path d="M158,112 L170,96 L182,112" fill="none" stroke={ACC.good} strokeWidth="2.2" />
        <text x="170" y="126" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.good}>CLK ▲</text>
        {/* next-state box at time t+1 */}
        <line x1="208" y1="64" x2="256" y2="64" stroke={qn ? accent : dim} strokeWidth="2.6" />
        <rect x="256" y="34" width="70" height="60" rx="10" fill={box} stroke={invalid ? ACC.rev : ACC.good} strokeWidth="2.6" />
        <text x="291" y="26" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>t+1 (next)</text>
        <text x="291" y="58" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string}>Qₙ₊₁ =</text>
        <text x="291" y="80" textAnchor="middle" fontFamily="monospace" fontSize="20" fontWeight="900" fill={invalid ? ACC.rev : (qn ? ACC.good : dim)}>{invalid ? '×' : qn}</text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <Toggle label="Qₙ" v={q} onClick={() => setQ(q ^ 1)} color={accent} />
        <Toggle label={la} v={a} onClick={() => setA(a ^ 1)} color={ACC.fwd} />
        {two && <Toggle label={lb} v={b} onClick={() => setB(b ^ 1)} color={ACC.rev} />}
      </div>
      <motion.p key={`${ty}-${q}-${a}-${b}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {invalid
          ? <span style={{ color: ACC.rev }}>{lang === 'hi' ? 'S=R=1 forbidden — यह combination की मनाही है' : 'S=R=1 forbidden — this input combination is not allowed'}</span>
          : (lang === 'hi'
            ? <><b style={{ color: accent }}>characteristic</b> equation ने {la}{two ? `,${lb}` : ''} और Qₙ={q} से Qₙ₊₁=<b style={{ color: ACC.good }}>{qn}</b> निकाला।</>
            : <>the <b style={{ color: accent }}>characteristic</b> equation turned {la}{two ? `,${lb}` : ''} and Qₙ={q} into Qₙ₊₁=<b style={{ color: ACC.good }}>{qn}</b>.</>)}
      </motion.p>
    </Card>
  );
};

/* ───────── bespoke S03: characteristic (forward) - selector + eq + live proof ───────── */
const CharAnalysis: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [ty, setTy] = useState<FFType>('SR');
  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACC.fwd }}>
          {lang === 'hi' ? 'characteristic · forward / analysis' : 'characteristic · forward / analysis'}
        </div>
        <TypeTabs value={ty} onChange={setTy} accent={ACC.fwd} />
        <div className="mb-3 rounded-lg border p-2 text-center font-mono text-[13px] font-black"
          style={{ borderColor: `${ACC.fwd}44`, color: ACC.fwd }}>{FF_META[ty].eq}</div>
        <CharTable isDarkMode={isDarkMode} accent={ACC.fwd} type={ty} />
        <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
          {lang === 'hi'
            ? 'हर Qₙ₊₁ इसी equation से निकाला गया है — नीचे live flip-flop पर वही मान clock करके देखिए।'
            : 'every Qₙ₊₁ here is produced by that equation — clock the live flip-flop below to see the same value land.'}
        </p>
      </Card>
      <FlipFlopViz key={ty} isDarkMode={isDarkMode} accent={accent} type={ty} />
    </div>
  );
};

/* ───────── bespoke S04: excitation (reverse) - selector + table + live don't-care count ───────── */
const ExciteSynthesis: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [ty, setTy] = useState<FFType>('JK');
  const xCount = ([[0, 0], [0, 1], [1, 0], [1, 1]] as const)
    .reduce((n, [q, qn]) => n + ffExcite(ty, q, qn).filter((v) => v === 'x').length, 0);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACC.rev }}>
        {lang === 'hi' ? 'excitation · reverse / synthesis' : 'excitation · reverse / synthesis'}
      </div>
      <TypeTabs value={ty} onChange={setTy} accent={ACC.rev} />
      <ExciteTable isDarkMode={isDarkMode} accent={ACC.rev} type={ty} />
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {xCount > 0
          ? (lang === 'hi'
            ? <>{ty} की excitation table में <b style={{ color: ACC.rev }}>{xCount}</b> don't-care (x) cell हैं — हर x को K-map में 0 या 1 पढ़कर input equation छोटा किया जा सकता है।</>
            : <>the {ty} excitation table carries <b style={{ color: ACC.rev }}>{xCount}</b> don't-care (x) cell{xCount === 1 ? '' : 's'} — each x may be read as 0 or 1 in a K-map to shrink the input equation.</>)
          : (lang === 'hi'
            ? <>{ty} की हर excitation entry तय है (<b style={{ color: ACC.rev }}>0</b> don't-care) — एक ही input है, तो हर transition के लिए ठीक एक मान।</>
            : <>every {ty} excitation entry is fixed (<b style={{ color: ACC.rev }}>0</b> don't-cares) — a single input means exactly one value per transition.</>)}
      </p>
    </Card>
  );
};

/* ───────── the running machine: a controllable toggle, D-FF with D = X ⊕ Q ─────────
   qn = ffNext('D', q, X ^ q) = X ⊕ q : hold on X=0, flip on X=1 (a pausable ÷2). */
const machineRows = (): number[][] =>
  ([[0, 0], [0, 1], [1, 0], [1, 1]] as const).map(([X, q]) => {
    const D = X ^ q;
    const qn = ffNext('D', q, D);
    return [X, q, D, qn];
  });

const twoStates = (y: number) => [
  { id: 'S0', label: '0', x: 82, y },
  { id: 'S1', label: '1', x: 250, y },
];
const machineEdges = () => machineRows().map(([X, q, , qn]) => ({
  from: `S${q}`, to: `S${qn}`, label: `X=${X}`,
  curve: q === qn ? 0 : (q === 0 ? 46 : -46),
}));

/* live walk of the state diagram (highlights the present state) */
const MachineWalker: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [X, setX] = useState(1);
  const [q, setQ] = useState(0);
  const nextQ = ffNext('D', q, X ^ q);
  const tick = () => setQ((cur) => ffNext('D', cur, X ^ cur));
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'live: machine को state diagram पर चलाइए' : 'live: walk the machine on its state diagram'}
      </div>
      <StateDiagram isDarkMode={isDarkMode} accent={accent}
        states={twoStates(80)} edges={machineEdges()} active={`S${q}`} width={340} height={150} />
      <div className="mt-2 flex items-center justify-center gap-4">
        <Toggle label="X" v={X} onClick={() => setX(X ^ 1)} color={ACC.fwd} sub={X ? (lang === 'hi' ? 'toggle' : 'toggle') : (lang === 'hi' ? 'hold' : 'hold')} />
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[11px] ${t.faint}`}>Qₙ</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
            style={{ background: q ? accent : 'transparent', color: q ? '#000' : accent, border: `2px solid ${accent}` }}>{q}</span>
        </div>
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? <>X={X} → अगली CLK ▲ पर Qₙ₊₁ = <b style={{ color: ACC.good }}>{nextQ}</b> ({X ? 'flip' : 'hold'})</>
          : <>X={X} → on the next CLK ▲, Qₙ₊₁ = <b style={{ color: ACC.good }}>{nextQ}</b> ({X ? 'flip' : 'hold'})</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke S05: the forward analysis pipeline (StepThrough + live walk) ───────── */
const AnalysisFlow: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const rows = machineRows();
  const mono = (v: string) => <span className="font-mono font-black" style={{ color: accent }}>{v}</span>;

  const Circuit = (
    <svg viewBox="0 0 300 140" className="mx-auto w-full max-w-md">
      {/* XOR gate */}
      <path d="M40,40 Q60,66 40,92 Q84,92 100,66 Q84,40 40,40 Z" fill={box} stroke={accent} strokeWidth="2.2" />
      <path d="M34,40 Q54,66 34,92" fill="none" stroke={accent} strokeWidth="2.2" />
      <text x="68" y="70" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>XOR</text>
      {/* inputs */}
      <line x1="8" y1="52" x2="44" y2="52" stroke={ACC.fwd} strokeWidth="2.6" />
      <text x="4" y="46" fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.fwd}>X</text>
      <line x1="8" y1="80" x2="44" y2="80" stroke={dim} strokeWidth="2.6" />
      <text x="4" y="94" fontFamily="monospace" fontSize="10" fontWeight="800" fill={t.faint as string}>Q</text>
      {/* xor -> D */}
      <line x1="100" y1="66" x2="150" y2="66" stroke={accent} strokeWidth="2.6" />
      <text x="126" y="58" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>D</text>
      {/* FF */}
      <rect x="150" y="34" width="70" height="70" rx="9" fill={box} stroke={accent} strokeWidth="2.4" />
      <text x="185" y="66" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="800" fill={accent}>D FF</text>
      <line x1="150" y1="96" x2="140" y2="96" stroke={dim} strokeWidth="2" />
      <path d="M150,90 L158,96 L150,102 Z" fill="none" stroke={isDarkMode ? '#94a3b8' : '#475569'} strokeWidth="1.6" />
      {/* Q out */}
      <line x1="220" y1="58" x2="272" y2="58" stroke={ACC.good} strokeWidth="2.8" />
      <text x="276" y="62" fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.good}>Q</text>
      {/* feedback Q -> XOR's lower input */}
      <path d="M272,58 V126 H22 V80" fill="none" stroke={dim} strokeWidth="1.6" strokeDasharray="4 3" />
    </svg>
  );

  const steps = [
    {
      label: lang === 'hi' ? 'circuit' : 'Circuit',
      body: (
        <div className="space-y-2 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'दिया: एक D flip-flop जिसका D pin X और feed-back Q के XOR से चलता है।' : 'Given: a D flip-flop whose D pin is driven by the XOR of X and the fed-back output Q.'}</p>
          {Circuit}
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'input equation' : 'Input equation',
      body: (
        <div className="space-y-2 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'schematic से FF का input पढ़िए।' : "Read the flip-flop's input straight off the schematic."}</p>
          <div className="text-lg">{mono('D = X ⊕ Q')}</div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'characteristic substitution' : 'Characteristic substitution',
      body: (
        <div className="space-y-2 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? "D का नियम Q(t+1) = D है; input equation डालिए।" : "D's law is Q(t+1) = D; drop the input equation in."}</p>
          <div className="text-base">{mono('Q(t+1) = D = X ⊕ Q')}</div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'state table' : 'State table',
      body: (
        <div className="space-y-2">
          <p className={`text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? 'हर (X, Qₙ) के लिए मान निकालिए — सब code में computed।' : 'Evaluate for every (X, Qₙ) — all computed in code.'}</p>
          <StateTable isDarkMode={isDarkMode} accent={accent}
            headers={['X', 'Qₙ', 'D = X⊕Qₙ', 'Qₙ₊₁']} rows={rows}
            note={lang === 'hi' ? 'X=0 → hold, X=1 → flip: एक रोक सकने वाला toggle।' : 'X=0 holds, X=1 flips: a pausable toggle.'} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'state diagram' : 'State diagram',
      body: (
        <div className="space-y-2 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'हर row एक तीर: X=0 self-loop, X=1 पार।' : 'One arrow per row: X=0 self-loops, X=1 crosses.'}</p>
          <StateDiagram isDarkMode={isDarkMode} accent={accent}
            states={twoStates(72)} edges={machineEdges()} width={330} height={140} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
      <MachineWalker isDarkMode={isDarkMode} accent={accent} />
    </div>
  );
};

/* ───────── bespoke: computed 2x2 K-map for T = X ───────── */
const KMapT: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const cell = (X: number, Q: number) => ffExcite('T', Q, X ^ Q)[0];   // required T for this (X,Q)
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="font-mono text-[11px] font-black" style={{ color: accent }}>
        {lang === 'hi' ? 'T का K-map (rows Qₙ, cols X)' : 'K-map for T (rows Qₙ, cols X)'}
      </div>
      <table className="border-collapse text-center font-mono text-[13px]">
        <thead>
          <tr>
            <th className="px-2 py-1" />
            <th className="px-3 py-1" style={{ color: accent }}>X=0</th>
            <th className="px-3 py-1" style={{ color: accent }}>X=1</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1].map((Q) => (
            <tr key={Q}>
              <th className="px-2 py-1 text-right" style={{ color: accent }}>Qₙ={Q}</th>
              {[0, 1].map((X) => {
                const v = cell(X, Q);
                return (
                  <td key={X} className="px-4 py-2 font-black"
                    style={{ border: `1px solid ${accent}44`, color: v === '1' ? ACC.good : (t.faint as string), background: v === '1' ? `${ACC.good}18` : 'transparent' }}>
                    {v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={`text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi' ? 'दोनों X=1 cell 1, दोनों X=0 cell 0 (Qₙ बेमानी) → T = X' : 'both X=1 cells are 1, both X=0 cells are 0 (Qₙ irrelevant) → T = X'}
      </p>
    </div>
  );
};

/* ───────── bespoke S06: the reverse synthesis pipeline (StepThrough) ───────── */
const SynthesisFlow: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  // same machine: transitions + the T a T-flip-flop needs for each
  const rowsS = ([[0, 0], [0, 1], [1, 0], [1, 1]] as const).map(([X, q]) => {
    const qn = ffNext('D', q, X ^ q);           // desired next state = X ⊕ q
    const T = ffExcite('T', q, qn)[0];          // T needed to excite q -> qn
    return { X, q, qn, T };
  });
  const transRows: (string | number)[][] = rowsS.map((r) => [r.X, r.q, r.qn]);
  const exRows: (string | number)[][] = rowsS.map((r) => [r.X, r.q, r.qn, r.T]);

  const Circuit = (
    <svg viewBox="0 0 250 118" className="mx-auto w-full max-w-sm">
      <line x1="8" y1="46" x2="70" y2="46" stroke={ACC.fwd} strokeWidth="2.8" />
      <text x="6" y="40" fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.fwd}>X</text>
      <text x="86" y="40" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>T = X</text>
      <rect x="70" y="24" width="80" height="72" rx="9" fill={box} stroke={accent} strokeWidth="2.4" />
      <text x="110" y="58" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="800" fill={accent}>T FF</text>
      <line x1="70" y1="86" x2="60" y2="86" stroke={dim} strokeWidth="2" />
      <path d="M70,80 L78,86 L70,92 Z" fill="none" stroke={isDarkMode ? '#94a3b8' : '#475569'} strokeWidth="1.6" />
      <text x="52" y="100" fontFamily="monospace" fontSize="8" fill={t.faint as string}>CLK</text>
      <line x1="150" y1="48" x2="212" y2="48" stroke={ACC.good} strokeWidth="2.8" />
      <text x="216" y="52" fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.good}>Q</text>
    </svg>
  );

  const steps = [
    {
      label: lang === 'hi' ? 'state diagram (माँग)' : 'State diagram (spec)',
      body: (
        <div className="space-y-2 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'चाहिए: X=0 पर hold, X=1 पर flip — यही specification है।' : 'Wanted: hold on X=0, flip on X=1 — this is the given specification.'}</p>
          <StateDiagram isDarkMode={isDarkMode} accent={accent}
            states={twoStates(72)} edges={machineEdges()} width={330} height={140} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'transition list' : 'Transition list',
      body: (
        <div className="space-y-2">
          <p className={`text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? 'हर (X, Qₙ) की ज़रूरी Qₙ₊₁ लिखिए।' : 'Write the required Qₙ₊₁ for every (X, Qₙ).'}</p>
          <StateTable isDarkMode={isDarkMode} accent={accent} headers={['X', 'Qₙ', 'Qₙ₊₁']} rows={transRows} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'excitation (T चुनिए)' : 'Excitation (choose T)',
      body: (
        <div className="space-y-2">
          <p className={`text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? 'T flip-flop: hold को T=0, बदलने को T=1 (excitation table से)।' : 'Build with a T flip-flop: hold needs T=0, change needs T=1 (from the excitation table).'}</p>
          <StateTable isDarkMode={isDarkMode} accent={ACC.rev} headers={['X', 'Qₙ', 'Qₙ₊₁', 'T']} rows={exRows}
            note={lang === 'hi' ? 'T = Qₙ ⊕ Qₙ₊₁, हर row के लिए computed।' : 'T = Qₙ ⊕ Qₙ₊₁, computed for each row.'} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'K-map minimisation' : 'K-map minimisation',
      body: (
        <div className="space-y-2">
          <p className={`text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? 'required T को X, Qₙ के सामने plot कीजिए।' : 'Plot the required T against X and Qₙ.'}</p>
          <KMapT isDarkMode={isDarkMode} accent={ACC.rev} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'circuit' : 'Circuit',
      body: (
        <div className="space-y-2 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'T input को सीधे X से wire कीजिए — बस।' : 'Wire the T input straight to X — that is the whole circuit.'}</p>
          {Circuit}
          <p className={`text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? "JK चुनते तो इसके don't-cares K-map को J = K = X तक सरल कर देते — वही जवाब।"
              : "had we chosen a JK, its don't-cares would simplify the K-map to J = K = X — the same answer."}
          </p>
        </div>
      ),
    },
  ];
  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── bespoke S07: four portraits of one flip-flop (fact-anchored) ───────── */
const PortraitAnalogy: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [ty, setTy] = useState<FFType>('JK');
  const modeOf = (qn: string): string =>
    qn === '0' ? 'Reset (0)' : qn === '1' ? 'Set (1)' : qn === 'Q' ? 'Hold (Q)' : qn === "Q'" ? "Toggle (Q')" : 'Invalid (×)';
  const photoRows: (string | number)[][] = ffCharRows(ty).map((r) => [...r.in, modeOf(r.qn)]);

  const Portrait: React.FC<{ tag: string; sub: string; color: string; children: React.ReactNode }>
    = ({ tag, sub, color, children }) => (
    <div className="rounded-3xl border p-4" style={{ borderColor: `${color}55` }}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="font-mono text-[12px] font-black uppercase tracking-wide" style={{ color }}>{tag}</span>
        <span className={`font-mono text-[10px] ${t.faint}`}>{sub}</span>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'एक व्यक्ति, चार portraits' : 'one person, four portraits'}
        </div>
        <svg viewBox="0 0 320 120" className="mx-auto w-full max-w-lg">
          {/* central figure = the flip-flop */}
          <circle cx="160" cy="42" r="15" fill="none" stroke={accent} strokeWidth="2.4" />
          <path d="M138,92 Q160,64 182,92" fill="none" stroke={accent} strokeWidth="2.4" />
          <text x="160" y="112" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>{ty} flip-flop</text>
          {/* four frames */}
          {[{ x: 20, l: 'photo', y: 14 }, { x: 250, l: 'bio', y: 14 }, { x: 20, l: 'map', y: 66 }, { x: 250, l: 'blueprint', y: 66 }].map((f, i) => (
            <g key={i}>
              <rect x={f.x} y={f.y} width="50" height="40" rx="6" fill={box} stroke={dim} strokeWidth="1.8" />
              <text x={f.x + 25} y={f.y + 24} textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>{f.l}</text>
              <line x1={f.x < 160 ? f.x + 50 : f.x} y1={f.y + 20} x2={f.x < 160 ? 145 : 175} y2="52" stroke={dim} strokeWidth="1" strokeDasharray="3 2" />
            </g>
          ))}
        </svg>
        <TypeTabs value={ty} onChange={setTy} accent={accent} />
        <p className={`text-center font-mono text-[12px] ${t.sub}`}>
          {lang === 'hi' ? 'चारों एक ही flip-flop को बताते हैं — सिर्फ़ सवाल बदलता है, device नहीं।' : 'all four describe the same flip-flop — only the question changes, never the device.'}
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Portrait tag={lang === 'hi' ? 'photo' : 'photo'} sub="operating / truth" color={accent}>
          <StateTable isDarkMode={isDarkMode} accent={accent}
            headers={[...FF_META[ty].inputs, lang === 'hi' ? 'mode' : 'mode']} rows={photoRows} />
        </Portrait>
        <Portrait tag={lang === 'hi' ? 'bio' : 'bio'} sub="characteristic equation" color={ACC.warn}>
          <div className="flex h-full min-h-[70px] items-center justify-center rounded-2xl border p-4 text-center font-mono text-[15px] font-black"
            style={{ borderColor: `${ACC.warn}44`, color: ACC.warn }}>{FF_META[ty].eq}</div>
        </Portrait>
        <Portrait tag={lang === 'hi' ? 'map' : 'map'} sub="characteristic table · forward" color={ACC.fwd}>
          <CharTable isDarkMode={isDarkMode} accent={ACC.fwd} type={ty} />
        </Portrait>
        <Portrait tag={lang === 'hi' ? 'blueprint' : 'blueprint'} sub="excitation table · reverse" color={ACC.rev}>
          <ExciteTable isDarkMode={isDarkMode} accent={ACC.rev} type={ty} />
        </Portrait>
      </div>
    </div>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= 4 ? 'PART II · THE THREE VIEWS'
      : i < n - 3 ? 'PART III · ANALYSIS & SYNTHESIS'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  switch (scene.id) {
    case 'S02_Facts': return 'facts';
    case 'S03_Characteristic': return 'char';
    case 'S04_Excitation': return 'excite';
    case 'S05_Analysis': return 'analysis';
    case 'S06_Synthesis': return 'synthesis';
    case 'S07_Analogy': return 'analogy';
    case 'S08_Build': return 'build';
    default: return null;
  }
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
        kicker="FF Representations · One Cell, Three Tables"
        hero={<ThreeViews isDarkMode={p.isDarkMode} accent={p.accent} />} />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src={SRC_EN} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3">
            <Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}
          </section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => (
        <div className="relative">
          <TryItYourself corner />
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="FF" tag="Practice · FF Representations" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'facts' && (
            <div className="space-y-6">
              <TryItYourself />
              <DialectStrip isDarkMode={p.isDarkMode} accent={p.accent} />
              <DialectTimeline isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'char' && (
            <div className="space-y-6">
              <TryItYourself />
              <CharAnalysis isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'excite' && (
            <div className="space-y-6">
              <TryItYourself />
              <ExciteSynthesis isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analysis' && (
            <div className="space-y-6">
              <TryItYourself />
              <AnalysisFlow isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'synthesis' && (
            <div className="space-y-6">
              <TryItYourself />
              <SynthesisFlow isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <PortraitAnalogy isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="jk-flipflop"
              titleEN="Build a JK and read all three tables"
              titleHI="एक JK बनाइए और तीनों tables पढ़िए"
              bodyEN="Open the live workbench and wire an edge-triggered JK from Q(t+1)=J·Q'+K'·Q, then prove its operating table (hold/reset/set/toggle), confirm the characteristic equation row by row, and drive a wanted transition using its excitation entry."
              bodyHI="live workbench खोलिए और Q(t+1)=J·Q'+K'·Q से एक edge-triggered JK wire कीजिए, फिर इसकी operating table (hold/reset/set/toggle) साबित कीजिए, characteristic equation को row-दर-row पुष्टि कीजिए, और excitation entry से एक मनचाही transition चलाइए।" />
          )}
        </TheoryScene>
      );
    }
  }
}

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i, arr) => ({
  id: slug(scene.id),
  part: partAt(i, arr.length),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene, i, arr.length),
}));
