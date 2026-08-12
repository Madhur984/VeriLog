/**
 * Latches - dsd/29, "The First Memory Cell".
 * Generic scenes come from the shared _subtractor kit; the shared SR/D latch
 * interactives come from the _sequential block library. The cross-coupled memory
 * cell, the forbidden-state race lab, the gated-SR schematic with a live enable,
 * the transparency waveform lab and the doorman analogy are bespoke. EVERY value
 * (latch output, truth-table row, gated Sg/Rg, transparent Q trace) is COMPUTED
 * in code by iterating the cross-coupled gate equations - never hardcoded.
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, DoorOpen, DoorClosed } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  SRLatchViz, DLatchViz, TimingDiagram, StateTable, Toggle,
  type WaveSignal,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { S: '#38bdf8', R: '#fb7185', EN: '#34d399', warn: '#fb7185', good: '#34d399' };
const SRC_EN: string | undefined = '/videos/dsd29-latches.mp4';
const SRC_HI: string | undefined = undefined;

/* ═══════════ computed latch engine (single source of truth) ═══════════
   Iterate the cross-coupled pair to its fixed point. For NOR a=S,b=R; for NAND
   a=S',b=R'. Returns Q and Q' so a contradiction (Q===Q') is detectable. */
type Gate = 'NOR' | 'NAND';
function srLatchState(gate: Gate, a: number, b: number, q0: number): { q: number; qb: number } {
  let q = q0, qb = q0 ^ 1;
  for (let i = 0; i < 6; i++) {
    let nq: number, nqb: number;
    if (gate === 'NOR') {            // Q = NOR(R, Q'), Q' = NOR(S, Q)
      nq = (b | qb) ? 0 : 1;
      nqb = (a | q) ? 0 : 1;
    } else {                         // Q = NAND(S', Q'), Q' = NAND(R', Q)
      nq = (a & qb) ? 0 : 1;
      nqb = (b & q) ? 0 : 1;
    }
    q = nq; qb = nqb;
  }
  return { q, qb };
}

/** Classify an (a,b) input for the truth table by evaluating both present states. */
function srClassify(gate: Gate, a: number, b: number): { qn: string; action: string; forbidden: boolean } {
  const s0 = srLatchState(gate, a, b, 0);
  const s1 = srLatchState(gate, a, b, 1);
  const forbidden = s0.q === s0.qb;                    // Q and Q' driven equal
  if (forbidden) return { qn: `${s0.q} (Q=Q'=${s0.q})`, action: 'Invalid', forbidden: true };
  if (s0.q === 0 && s1.q === 1) return { qn: 'Q', action: 'Hold', forbidden: false };
  if (s0.q === 0 && s1.q === 0) return { qn: '0', action: 'Reset', forbidden: false };
  if (s0.q === 1 && s1.q === 1) return { qn: '1', action: 'Set', forbidden: false };
  return { qn: '?', action: '?', forbidden: false };
}

/* ═══════════ bespoke: computed SR truth table (NOR or NAND) ═══════════ */
const SRTruth: React.FC<{ isDarkMode: boolean; accent: string; gate: Gate }> = ({ isDarkMode, accent, gate }) => {
  const { lang } = useSubLang();
  const [la, lb] = gate === 'NOR' ? ['S', 'R'] : ["S'", "R'"];
  const actLabel = (a: string) =>
    lang === 'hi'
      ? (a === 'Hold' ? 'Hold (याद)' : a === 'Invalid' ? 'Invalid (निषिद्ध)' : a)
      : a;
  const rows = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => {
    const c = srClassify(gate, a, b);
    return [a, b, c.qn, actLabel(c.action)] as (string | number)[];
  });
  return (
    <StateTable isDarkMode={isDarkMode} accent={accent}
      headers={[la, lb, 'Q(t+1)', lang === 'hi' ? 'काम' : 'Action']}
      rows={rows}
      note={gate === 'NOR'
        ? (lang === 'hi' ? 'active-HIGH · हर row cross-coupled NOR gates को iterate करके गिना गया' : 'active-HIGH · every row computed by iterating the cross-coupled NOR gates')
        : (lang === 'hi' ? "active-LOW (S',R') · हर row cross-coupled NAND gates को iterate करके गिना गया" : "active-LOW (S',R') · every row computed by iterating the cross-coupled NAND gates")} />
  );
};

/* ═══════════ bespoke: the cross-coupled memory cell (S02) ═══════════
   Two cross-coupled inverters. Q = NOT(Q'), Q' = NOT(Q): a bistable loop that
   holds its bit. Flip the stored value; the feedback pulses keep re-driving it. */
const CrossCoupleViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [q, setQ] = useState(1);
  const qbar = q ^ 1;                       // computed complement
  const qCol = q ? accent : dim;
  const qbCol = qbar ? accent : dim;

  const Pulse: React.FC<{ xs: number[]; ys: number[]; delay: number }> = ({ xs, ys, delay }) => (
    <motion.circle r="3.5" fill={accent}
      initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
      animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay }} />
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'cross-coupled memory cell · live' : 'cross-coupled memory cell · live'}
      </div>
      <svg viewBox="0 0 320 170" className="mx-auto w-full max-w-lg">
        {/* Q wire: top inverter output -> right -> down -> bottom inverter input */}
        <line x1="176" y1="55" x2="250" y2="55" stroke={qCol} strokeWidth="3" />
        <line x1="250" y1="55" x2="250" y2="115" stroke={qCol} strokeWidth="3" />
        <line x1="250" y1="115" x2="200" y2="115" stroke={qCol} strokeWidth="3" />
        {/* Q' wire: bottom inverter output -> left -> up -> top inverter input */}
        <line x1="144" y1="115" x2="70" y2="115" stroke={qbCol} strokeWidth="3" />
        <line x1="70" y1="115" x2="70" y2="55" stroke={qbCol} strokeWidth="3" />
        <line x1="70" y1="55" x2="120" y2="55" stroke={qbCol} strokeWidth="3" />

        {/* travelling feedback pulses (the loop keeps re-driving itself) */}
        <Pulse xs={[176, 250, 250, 200]} ys={[55, 55, 115, 115]} delay={0} />
        <Pulse xs={[144, 70, 70, 120]} ys={[115, 115, 55, 55]} delay={0.9} />

        {/* top inverter (points right): input Q' -> output Q */}
        <polygon points="120,37 120,73 166,55" fill={box} stroke={accent} strokeWidth="2.4" />
        <circle cx="171" cy="55" r="5" fill={box} stroke={accent} strokeWidth="2.4" />
        <text x="139" y="59" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent}>NOT</text>
        <text x="262" y="50" fontFamily="monospace" fontSize="12" fontWeight="800" fill={qCol}>Q={q}</text>

        {/* bottom inverter (points left): input Q -> output Q' */}
        <polygon points="200,97 200,133 154,115" fill={box} stroke={accent} strokeWidth="2.4" />
        <circle cx="149" cy="115" r="5" fill={box} stroke={accent} strokeWidth="2.4" />
        <text x="181" y="119" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent}>NOT</text>
        <text x="20" y="110" fontFamily="monospace" fontSize="12" fontWeight="800" fill={qbCol}>Q'={qbar}</text>
      </svg>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button onClick={() => setQ(q ^ 1)}
          className="flex items-center gap-2 rounded-2xl px-5 py-2.5 font-black text-black active:scale-95"
          style={{ background: accent }}>
          <RefreshCw size={15} /> {lang === 'hi' ? 'stored bit flip कीजिए' : 'flip the stored bit'}
        </button>
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>कोई input नहीं - फिर भी loop Q=<b style={{ color: accent }}>{q}</b>, Q'=<b style={{ color: accent }}>{qbar}</b> थामे रखता है। यही state है।</>
          : <>no input at all - yet the loop holds Q=<b style={{ color: accent }}>{q}</b>, Q'=<b style={{ color: accent }}>{qbar}</b>. That held bit is the state.</>}
      </p>
      <p className={`mt-1 text-center font-mono text-[11px] ${t.faint}`}>
        {lang === 'hi' ? "हर gate पर एक दूसरा input जोड़िए (NOR/NAND) → वही Set/Reset controls बनते हैं।" : 'add a second input to each gate (NOR/NAND) → those become the Set/Reset controls.'}
      </p>
    </Card>
  );
};

/* ═══════════ bespoke: the forbidden state + race lab (S05) ═══════════
   Force S=R=1 on a NOR latch: Q=Q'=0 (computed). Releasing both together races
   to an unpredictable winner set by gate delays - modelled as a coin flip, with
   a running tally to make the unpredictability visible. */
const ForbiddenViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const forced = srLatchState('NOR', 1, 1, 1);        // {q:0, qb:0} - computed contradiction
  const [settled, setSettled] = useState<number | null>(null);
  const [tally, setTally] = useState<{ ones: number; zeros: number }>({ ones: 0, zeros: 0 });

  const release = () => {
    const winner = Math.random() < 0.5 ? 1 : 0;       // gate-delay coin flip
    setSettled(winner);
    setTally((c) => ({ ones: c.ones + (winner ? 1 : 0), zeros: c.zeros + (winner ? 0 : 1) }));
  };
  const total = tally.ones + tally.zeros;

  const failures = [
    {
      t: lang === 'hi' ? '1 · Contradiction' : '1 · Contradiction',
      b: lang === 'hi' ? "Q=0 और Q'=0 एक साथ - complement टूट गया।" : "Q=0 and Q'=0 at once - the complement is broken.",
    },
    {
      t: lang === 'hi' ? '2 · Race' : '2 · Race',
      b: lang === 'hi' ? 'दोनों को साथ छोड़ने पर तेज़ gate जीतता है।' : 'release both together and the faster gate wins.',
    },
    {
      t: lang === 'hi' ? '3 · Unpredictable' : '3 · Unpredictable',
      b: lang === 'hi' ? 'settle हुआ मान हर बार बदल सकता है (metastable भी)।' : 'the settled value can differ every time (even metastable).',
    },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACC.warn }}>
        <AlertTriangle size={14} /> {lang === 'hi' ? 'forbidden state · S=R=1 (NOR)' : 'forbidden state · S=R=1 (NOR)'}
      </div>

      <svg viewBox="0 0 300 150" className="mx-auto w-full max-w-md">
        {/* two NOR gates both forced to 0 */}
        {[{ y: 40, lbl: 'Q', in1: 'R' }, { y: 110, lbl: "Q'", in1: 'S' }].map((g, i) => (
          <g key={i}>
            <line x1="20" y1={g.y - 8} x2="120" y2={g.y - 8} stroke={ACC.warn} strokeWidth="2.5" />
            <text x="6" y={g.y - 4} fontFamily="monospace" fontSize="11" fontWeight="800" fill={ACC.warn}>{g.in1}=1</text>
            <path d={`M120,${g.y - 22} q34,0 52,22 q-18,22 -52,22 q10,-22 0,-44 Z`} fill={box} stroke={ACC.warn} strokeWidth="2.2" />
            <text x="140" y={g.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={ACC.warn}>NOR</text>
            <line x1="174" y1={g.y} x2="250" y2={g.y} stroke={ACC.warn} strokeWidth="3" />
            <text x="256" y={g.y + 4} fontFamily="monospace" fontSize="13" fontWeight="900" fill={ACC.warn}>{g.lbl}={forced.q}</text>
          </g>
        ))}
        <path d="M250,40 q26,10 26,35 q0,25 -104,35" fill="none" stroke={dim} strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M250,110 q26,-10 26,-35 q0,-25 -104,-35" fill="none" stroke={dim} strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>

      <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {failures.map((f) => (
          <div key={f.t} className="rounded-2xl border p-3" style={{ borderColor: `${ACC.warn}44`, background: `${ACC.warn}0d` }}>
            <div className="font-mono text-[11px] font-black" style={{ color: ACC.warn }}>{f.t}</div>
            <div className={`mt-1 text-[12px] leading-snug ${t.sub}`}>{f.b}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <button onClick={release}
          className="flex items-center gap-2 rounded-2xl px-5 py-2.5 font-black text-black active:scale-95"
          style={{ background: accent }}>
          <RefreshCw size={15} /> {lang === 'hi' ? 'दोनों को साथ छोड़ें (→0,0)' : 'release both together (→0,0)'}
        </button>
        {settled !== null && (
          <motion.p key={`${settled}-${total}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`text-center font-mono text-[13px] ${t.sub}`}>
            {lang === 'hi' ? 'settle हुआ' : 'settled to'} Q = <b style={{ color: settled ? ACC.good : ACC.warn }}>{settled}</b>
            {' · '}<span className={t.faint}>{lang === 'hi' ? 'gate delay ने तय किया' : 'decided by gate delay'}</span>
          </motion.p>
        )}
        {total > 0 && (
          <p className={`text-center font-mono text-[12px] ${t.faint}`}>
            {lang === 'hi' ? 'नतीजे' : 'outcomes'}: Q=1 → <b style={{ color: accent }}>{tally.ones}</b>{'  '}·{'  '}Q=0 → <b style={{ color: accent }}>{tally.zeros}</b>{'  '}
            ({total} {lang === 'hi' ? 'बार' : 'releases'}) — {lang === 'hi' ? 'कोई भरोसेमंद pattern नहीं' : 'no reliable pattern'}
          </p>
        )}
      </div>
    </Card>
  );
};

/* ═══════════ bespoke: the gated SR latch with a live enable (S06) ═══════════
   Sg = S·EN, Rg = R·EN computed live; the internal NOR latch is iterated on the
   gated signals. EN=0 -> Sg=Rg=0 -> hold (locked). EN=1 -> transparent; 1,1 still
   forbidden. */
const GatedSRViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [s, setS] = useState(0);
  const [r, setR] = useState(0);
  const [en, setEn] = useState(1);
  const [q, setQ] = useState(0);
  const sg = s & en, rg = r & en;                       // AND-gated inputs
  const forbidden = en === 1 && s === 1 && r === 1;

  useEffect(() => {
    setQ((prev) => {
      const st = srLatchState('NOR', sg, rg, prev);
      return st.q === st.qb ? prev : st.q;              // forbidden -> don't move
    });
  }, [sg, rg]);
  const qbar = forbidden ? 0 : q ^ 1;

  const wc = (v: number, on: string) => (v ? on : dim);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'gated SR latch · Sg=S·EN, Rg=R·EN' : 'gated SR latch · Sg=S·EN, Rg=R·EN'}
      </div>

      <svg viewBox="0 0 340 180" className="mx-auto w-full max-w-xl">
        {/* input stubs */}
        <line x1="16" y1="40" x2="92" y2="40" stroke={wc(s, ACC.S)} strokeWidth="3" />
        <text x="4" y="35" fontFamily="monospace" fontSize="11" fontWeight="800" fill={wc(s, ACC.S)}>S</text>
        <line x1="16" y1="150" x2="92" y2="150" stroke={wc(r, ACC.R)} strokeWidth="3" />
        <text x="4" y="145" fontFamily="monospace" fontSize="11" fontWeight="800" fill={wc(r, ACC.R)}>R</text>
        {/* EN fans to both AND gates */}
        <line x1="16" y1="95" x2="60" y2="95" stroke={wc(en, ACC.EN)} strokeWidth="3" />
        <line x1="60" y1="95" x2="60" y2="56" stroke={wc(en, ACC.EN)} strokeWidth="3" />
        <line x1="60" y1="56" x2="92" y2="56" stroke={wc(en, ACC.EN)} strokeWidth="3" />
        <line x1="60" y1="95" x2="60" y2="134" stroke={wc(en, ACC.EN)} strokeWidth="3" />
        <line x1="60" y1="134" x2="92" y2="134" stroke={wc(en, ACC.EN)} strokeWidth="3" />
        <text x="26" y="90" fontFamily="monospace" fontSize="11" fontWeight="800" fill={wc(en, ACC.EN)}>EN</text>

        {/* AND gate 1 (S·EN=Sg) */}
        <path d="M92,32 L112,32 A16,16 0 0 1 112,64 L92,64 Z" fill={box} stroke={accent} strokeWidth="2.2" />
        <text x="100" y="52" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent}>&amp;</text>
        <line x1="128" y1="48" x2="196" y2="48" stroke={wc(sg, accent)} strokeWidth="3" />
        <text x="150" y="42" fontFamily="monospace" fontSize="9" fill={t.faint as string}>Sg={sg}</text>
        {/* AND gate 2 (R·EN=Rg) */}
        <path d="M92,118 L112,118 A16,16 0 0 1 112,150 L92,150 Z" fill={box} stroke={accent} strokeWidth="2.2" />
        <text x="100" y="138" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent}>&amp;</text>
        <line x1="128" y1="134" x2="196" y2="134" stroke={wc(rg, accent)} strokeWidth="3" />
        <text x="150" y="128" fontFamily="monospace" fontSize="9" fill={t.faint as string}>Rg={rg}</text>

        {/* SR latch body */}
        <rect x="196" y="36" width="76" height="110" rx="10" fill={box} stroke={accent} strokeWidth="2.5" />
        <text x="234" y="86" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="800" fill={accent}>SR</text>
        <text x="234" y="102" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>latch</text>
        {/* outputs */}
        <line x1="272" y1="60" x2="326" y2="60" stroke={wc(q, accent)} strokeWidth="3" />
        <text x="292" y="54" fontFamily="monospace" fontSize="12" fontWeight="800" fill={wc(q, accent)}>Q={q}</text>
        <line x1="272" y1="122" x2="326" y2="122" stroke={wc(qbar, accent)} strokeWidth="3" />
        <text x="288" y="138" fontFamily="monospace" fontSize="11" fontWeight="800" fill={wc(qbar, accent)}>Q'={qbar}</text>
      </svg>

      <div className="mt-2 flex items-center justify-center gap-4">
        <Toggle label="S" v={s} onClick={() => setS(s ^ 1)} color={ACC.S} />
        <Toggle label="R" v={r} onClick={() => setR(r ^ 1)} color={ACC.R} />
        <Toggle label="EN" v={en} onClick={() => setEn(en ^ 1)} color={ACC.EN} />
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {forbidden
          ? <span style={{ color: ACC.warn }}>{lang === 'hi' ? 'EN=1 पर भी S=R=1 → forbidden (Q=Q\'=0)' : "even with EN=1, S=R=1 → forbidden (Q=Q'=0)"}</span>
          : en === 0
            ? <span style={{ color: ACC.warn }}>{lang === 'hi' ? `EN=0 → locked: Sg=Rg=0, Q=${q} जमा` : `EN=0 → locked: Sg=Rg=0, Q=${q} frozen`}</span>
            : <span style={{ color: ACC.good }}>{lang === 'hi' ? `EN=1 → transparent: Q=${q} (S set, R reset)` : `EN=1 → transparent: Q=${q} (S sets, R resets)`}</span>}
      </p>
    </Card>
  );
};

/* ═══════════ bespoke: the transparency waveform lab (S08) ═══════════
   Editable D and EN tracks; Q is COMPUTED by the level-sensitive rule
   (Q follows D while EN=1, holds while EN=0) and drawn as an aligned waveform. */
const TransparencyLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [D, setD] = useState<number[]>([1, 0, 1, 1, 0, 0, 1, 0, 1, 1]);
  const [EN, setEN] = useState<number[]>([0, 1, 1, 0, 0, 1, 1, 1, 0, 0]);

  // Q computed by the transparent-latch rule
  const Q: number[] = [];
  let cur = 0;
  for (let i = 0; i < D.length; i++) { if (EN[i]) cur = D[i]; Q.push(cur); }

  const signals: WaveSignal[] = [
    { name: 'D', values: D, color: ACC.S },
    { name: 'EN', values: EN, color: ACC.EN },
    { name: 'Q', values: Q, color: accent },
  ];

  const flip = (which: 'D' | 'EN', i: number) => {
    if (which === 'D') setD((a) => a.map((v, j) => (j === i ? v ^ 1 : v)));
    else setEN((a) => a.map((v, j) => (j === i ? v ^ 1 : v)));
  };

  const Grid: React.FC<{ label: string; arr: number[]; color: string; which: 'D' | 'EN' }> = ({ label, arr, color, which }) => (
    <div className="flex items-center justify-center gap-1">
      <span className="w-8 font-mono text-[11px] font-black" style={{ color }}>{label}</span>
      {arr.map((v, i) => (
        <button key={i} onClick={() => flip(which, i)}
          className="flex h-7 w-7 items-center justify-center rounded-md font-mono text-[12px] font-black active:scale-90"
          style={{ background: v ? color : 'transparent', color: v ? '#000' : color, border: `1.5px solid ${color}${v ? '' : '55'}` }}>
          {v}
        </button>
      ))}
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'transparency lab · D और EN edit कीजिए' : 'transparency lab · edit D and EN'}
      </div>
      <div className="space-y-2">
        <Grid label="D" arr={D} color={ACC.S} which="D" />
        <Grid label="EN" arr={EN} color={ACC.EN} which="EN" />
      </div>
      <div className="mt-4">
        <TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={signals} showClock={false} />
      </div>
      <p className={`mt-2 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>Q हर step पर code में गिना गया: EN=1 → Q=D (transparent), EN=0 → Q जमा।</>
          : <>Q is computed at every step in code: EN=1 → Q=D (transparent), EN=0 → Q holds.</>}
      </p>
    </Card>
  );
};

/* ═══════════ bespoke: the doorman analogy (S09) ═══════════
   EN is the doorman's hand, D is the person at the door, Q is who's inside.
   Level-sensitive: while EN=1 the door is open and Q follows D; EN=0 freezes Q. */
const DoorViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [d, setD] = useState(1);
  const [en, setEn] = useState(1);
  const [q, setQ] = useState(0);
  useEffect(() => { if (en) setQ(d); }, [en, d]);       // transparent while EN=1

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {en ? <DoorOpen size={15} /> : <DoorClosed size={15} />}
        {lang === 'hi' ? 'doorman = enable · कमरे में जो है वही Q' : 'doorman = enable · whoever is inside is Q'}
      </div>

      <div className="flex items-center justify-center gap-6">
        {/* person at the door (D) */}
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'दरवाज़े पर' : 'at the door'}</span>
          <div className="flex h-12 w-12 items-center justify-center rounded-full font-mono text-lg font-black"
            style={{ background: d ? ACC.S : 'transparent', color: d ? '#000' : ACC.S, border: `2px solid ${ACC.S}` }}>D={d}</div>
        </div>

        {/* the door leaf, rotates open when EN=1 */}
        <div className="relative h-24 w-20" style={{ perspective: 400 }}>
          <div className="absolute inset-0 rounded-lg border-2" style={{ borderColor: `${accent}55` }} />
          <motion.div className="absolute inset-y-1 left-1 w-16 origin-left rounded-md"
            style={{ background: en ? `${ACC.EN}22` : `${ACC.warn}22`, border: `2px solid ${en ? ACC.EN : ACC.warn}` }}
            animate={{ rotateY: en ? -72 : 0 }} transition={{ duration: 0.5 }} />
          <span className="absolute -bottom-5 left-0 right-0 text-center font-mono text-[10px]" style={{ color: en ? ACC.EN : ACC.warn }}>
            {en ? (lang === 'hi' ? 'खुला' : 'open') : (lang === 'hi' ? 'बंद' : 'shut')}
          </span>
        </div>

        {/* who's inside the room (Q) */}
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'कमरे में' : 'inside'}</span>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl font-mono text-xl font-black"
            style={{ background: q ? accent : 'transparent', color: q ? '#000' : accent, border: `2px solid ${accent}` }}>Q={q}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Toggle label="D" v={d} onClick={() => setD(d ^ 1)} color={ACC.S} />
        <Toggle label="EN" v={en} onClick={() => setEn(en ^ 1)} color={ACC.EN} />
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {en
          ? <span style={{ color: ACC.good }}>{lang === 'hi' ? 'दरवाज़ा खुला → Q, D का पीछा करता है' : 'door open → Q follows D'}</span>
          : <span style={{ color: ACC.warn }}>{lang === 'hi' ? `दरवाज़ा बंद → आख़िरी अंदर वाला जमा (Q=${q})` : `door shut → the last one inside is frozen (Q=${q})`}</span>}
      </p>
    </Card>
  );
};

/* ═══════════ part assignment ═══════════ */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · MEMORY IS BORN'
    : i <= Math.floor(n * 0.55) ? 'PART II · SR LATCHES'
      : i < n - 2 ? 'PART III · GATING & D'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (key.includes('facts')) return 'crosscouple';
  if (key.includes('srnor')) return 'srnor';
  if (key.includes('srnand')) return 'srnand';
  if (key.includes('forbidden')) return 'forbidden';
  if (key.includes('gatedsr')) return 'gatedsr';
  if (key.includes('dlatch')) return 'dlatch';
  if (key.includes('transparency')) return 'transparency';
  if (key.includes('analogy')) return 'analogy';
  if (key.includes('build')) return 'build';
  return null;
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => (
        <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
          kicker="Latches · The First Memory Cell"
          hero={<SRLatchViz isDarkMode={p.isDarkMode} accent={p.accent} gate="NOR" />} />
      );
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="LATCH" tag="Practice · Latches" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'crosscouple' && (
            <div className="space-y-6">
              <TryItYourself />
              <CrossCoupleViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'srnor' && (
            <div className="space-y-6">
              <TryItYourself />
              <SRLatchViz isDarkMode={p.isDarkMode} accent={p.accent} gate="NOR" />
              <SRTruth isDarkMode={p.isDarkMode} accent={p.accent} gate="NOR" />
            </div>
          )}
          {which === 'srnand' && (
            <div className="space-y-6">
              <TryItYourself />
              <SRLatchViz isDarkMode={p.isDarkMode} accent={p.accent} gate="NAND" />
              <SRTruth isDarkMode={p.isDarkMode} accent={p.accent} gate="NAND" />
            </div>
          )}
          {which === 'forbidden' && (
            <div className="space-y-6">
              <TryItYourself />
              <ForbiddenViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'gatedsr' && (
            <div className="space-y-6">
              <TryItYourself />
              <GatedSRViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'dlatch' && (
            <div className="space-y-6">
              <TryItYourself />
              <DLatchViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'transparency' && (
            <div className="space-y-6">
              <TryItYourself />
              <TransparencyLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <DoorViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="sr-latch"
              titleEN="Build the SR latch for real"
              titleHI="असली में SR latch बनाइए"
              bodyEN="Open the live workbench and wire two cross-coupled NOR gates, then test Set, Reset and Hold, provoke the forbidden state, and extend it into a gated and then a safe D latch."
              bodyHI="live workbench खोलिए और दो cross-coupled NOR gates wire कीजिए, फिर Set, Reset और Hold test कीजिए, forbidden state भड़काइए, और इसे gated फिर एक सुरक्षित D latch में बढ़ाइए।" />
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
