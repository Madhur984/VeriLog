/**
 * The Multiplexer (MUX) - dsd/21, "The Digital Track Switch".
 * Generic scenes come from the shared _subtractor kit; the railroad track-switch
 * selector, the gate-level 2-to-1 / 4-to-1 builds, the worked-example
 * step-throughs, the MUX-as-LUT loader, the enable/cascade visual and the full
 * proofs walkthrough are bespoke. EVERY value (routed input, surviving minterm,
 * gate output, LUT lookup, gate counts) is COMPUTED in code, never hardcoded.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrainFront, Check, X } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { MuxViz } from '../_combo/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };
const SRC_EN: string | undefined = '/videos/dsd21-mux.mp4';
const SRC_HI: string | undefined = undefined;

/* ───────── bespoke: the railroad track switch ─────────
   Four trains parked on tracks I0..I3, a 2-bit select code, and the chosen
   train animates onto the single output main line. Y = inVals[code]. */
const TrackSwitch: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [vals, setVals] = useState<number[]>([1, 0, 1, 0]); // I0..I3 payloads
  const [s1, setS1] = useState(0);
  const [s0, setS0] = useState(0);
  const code = s1 * 2 + s0;          // computed select index
  const Y = vals[code];              // routed output, computed

  const trackY = (i: number) => 26 + i * 34;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-center gap-2">
        <TrainFront size={16} style={{ color: accent }} />
        <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
          {lang === 'hi' ? 'track switch · code dial कीजिए' : 'track switch · dial the code'}
        </span>
      </div>

      <svg viewBox="0 0 320 170" className="mx-auto w-full max-w-xl">
        {/* the four approach tracks + junction lines into the output */}
        {[0, 1, 2, 3].map((i) => {
          const on = i === code;
          const col = on ? accent : (isDarkMode ? '#334155' : '#cbd5e1');
          return (
            <g key={i}>
              <line x1="60" y1={trackY(i)} x2="210" y2={trackY(i)} stroke={col} strokeWidth={on ? 3 : 2} />
              <line x1="210" y1={trackY(i)} x2="250" y2="94" stroke={col} strokeWidth={on ? 3 : 2} strokeDasharray={on ? '0' : '4 4'} />
              {/* parked train */}
              <g>
                <rect x="22" y={trackY(i) - 11} width="34" height="22" rx="5"
                  fill={on ? accent : (isDarkMode ? '#0a0e1a' : '#fff')} stroke={col} strokeWidth="2" />
                <text x="39" y={trackY(i) + 5} textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800"
                  fill={on ? '#000' : col}>{vals[i]}</text>
                <text x="11" y={trackY(i) + 4} textAnchor="middle" fontFamily="monospace" fontSize="9"
                  fill={on ? accent : (t.faint as string)}>I{i}</text>
              </g>
            </g>
          );
        })}
        {/* the moving train along the selected route */}
        <motion.rect width="30" height="20" rx="5" fill={accent} stroke={accent} strokeWidth="2"
          initial={false}
          animate={{ x: [22, 200, 250], y: [trackY(code) - 10, trackY(code) - 10, 84] }}
          transition={{ duration: 1.1, ease: 'easeInOut' }} key={`${code}-${Y}`} />
        {/* output main line */}
        <line x1="250" y1="94" x2="312" y2="94" stroke={accent} strokeWidth="3.5" />
        <circle cx="250" cy="94" r="5" fill={accent} />
        <text x="298" y="84" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={accent}>Y</text>
        <rect x="284" y="84" width="24" height="22" rx="5" fill={Y ? accent : (isDarkMode ? '#0a0e1a' : '#fff')} stroke={accent} strokeWidth="2" />
        <text x="296" y="100" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="900" fill={Y ? '#000' : accent}>{Y}</text>
      </svg>

      {/* payload toggles */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'train के मान' : 'train values'}</span>
        {vals.map((v, i) => (
          <button key={i} onClick={() => setVals((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))}
            className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-black active:scale-90"
            style={{ background: v ? ACC.I : 'transparent', color: v ? '#000' : ACC.I, border: `2px solid ${ACC.I}${v ? '' : '66'}` }}>
            {v}
          </button>
        ))}
      </div>

      {/* the select levers */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'select levers' : 'select levers'}</span>
        {[['S1', s1, setS1] as const, ['S0', s0, setS0] as const].map(([lbl, v, set]) => (
          <button key={lbl} onClick={() => set(v ^ 1)}
            className="flex flex-col items-center gap-1 active:scale-90">
            <span className="font-mono text-[11px] font-bold" style={{ color: ACC.II }}>{lbl}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
              style={{ background: v ? ACC.II : 'transparent', color: v ? '#000' : ACC.II, border: `2px solid ${ACC.II}${v ? '' : '66'}` }}>{v}</span>
          </button>
        ))}
        <span className="font-mono text-sm font-black" style={{ color: ACC.II }}>= {code}</span>
      </div>

      <motion.p key={`${code}-${Y}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>code {code} {'->'} operator track <b style={{ color: accent }}>I{code}</b> को route करता है {'->'} Y = <b style={{ color: accent }}>{Y}</b></>
          : <>code {code} {'->'} operator routes track <b style={{ color: accent }}>I{code}</b> {'->'} Y = <b style={{ color: accent }}>{Y}</b></>}
      </motion.p>
    </Card>
  );
};

/* ───────── bespoke: gate-level 2-to-1 build (live) ─────────
   The four gates of Y = S'.D0 + S.D1, each computing on the live bits, plus a
   computed truth table. */
const TwoToOneGates: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [D0, setD0] = useState(0);
  const [D1, setD1] = useState(1);
  const [S, setS] = useState(1);
  const Sn = S ^ 1;
  const a0 = D0 & Sn;        // S'.D0
  const a1 = D1 & S;         // S.D1
  const Y = a0 | a1;         // OR

  const Tog: React.FC<{ label: string; v: number; set: (n: number) => void; color: string }> = ({ label, v, set, color }) => (
    <button onClick={() => set(v ^ 1)} className="flex flex-col items-center gap-1 active:scale-90">
      <span className="font-mono text-[11px] font-bold" style={{ color }}>{label}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
        style={{ background: v ? color : 'transparent', color: v ? '#000' : color, border: `2px solid ${color}${v ? '' : '66'}` }}>{v}</span>
    </button>
  );

  const rows = [0, 1, 2, 3, 4, 5, 6, 7].map((n) => {
    const s = (n >> 2) & 1, d1 = (n >> 1) & 1, d0 = n & 1;
    const y = (d0 & (s ^ 1)) | (d1 & s);
    return { cells: [s, d1, d0, y], highlight: s === S && d1 === D1 && d0 === D0 };
  });

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? "2-to-1 gates · Y = S'.D0 + S.D1" : "2-to-1 gates · Y = S'.D0 + S.D1"}
        </div>
        <div className="mb-4 flex items-center justify-center gap-4">
          <Tog label="D0" v={D0} set={setD0} color={ACC.I} />
          <Tog label="D1" v={D1} set={setD1} color={ACC.I} />
          <Tog label="S" v={S} set={setS} color={ACC.II} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>S' = NOT(S)</span>
            <LiveGate type="NOT" a={S} isDarkMode={isDarkMode} accent={accent} labelA="S" labelOut="S'" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>S'.D0</span>
            <LiveGate type="AND" a={D0} b={Sn} isDarkMode={isDarkMode} accent={accent} labelA="D0" labelB="S'" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>S.D1</span>
            <LiveGate type="AND" a={D1} b={S} isDarkMode={isDarkMode} accent={accent} labelA="D1" labelB="S" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>OR {'->'} Y</span>
            <LiveGate type="OR" a={a0} b={a1} isDarkMode={isDarkMode} accent={accent} labelA="S'.D0" labelB="S.D1" labelOut="Y" />
          </div>
        </div>
        <p className={`mt-4 text-center font-mono text-[13px] ${t.sub}`}>
          Y = {a0} + {a1} = <b style={{ color: Y ? ACC.good : t.faint }}>{Y}</b>
          {'  '}({S ? (lang === 'hi' ? 'S=1 तो Y=D1' : 'S=1 so Y=D1') : (lang === 'hi' ? 'S=0 तो Y=D0' : 'S=0 so Y=D0')})
        </p>
      </Card>
      <TruthTable isDarkMode={isDarkMode} accent={accent}
        headers={['S', 'D1', 'D0', 'Y']} rows={rows}
        note={lang === 'hi' ? "हर row code में गिना गया: S=0 पर Y=D0, S=1 पर Y=D1।" : 'Every row computed in code: Y=D0 when S=0, Y=D1 when S=1.'} />
    </div>
  );
};

/* ───────── bespoke: 2-to-1 worked example step-through ─────────
   The exact four-step grind from the spec, all arithmetic computed. */
const TwoWorked: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const D0 = 0, D1 = 1, S = 1;
  const Sn = S ^ 1, a0 = D0 & Sn, a1 = D1 & S, Y = a0 | a1;
  const mono = (v: string, c?: string) => <span className="font-mono font-black" style={{ color: c ?? (t.ink as string) }}>{v}</span>;

  const steps = [
    {
      label: lang === 'hi' ? 'समीकरण' : 'Equation',
      body: (
        <div className="space-y-2 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'पहले बिना-शर्त नियम लिखिए।' : 'Write the unconditional law first.'}</p>
          <div className="text-lg">{mono("Y = S'.D0 + S.D1", accent)}</div>
          <p className={`text-[12px] ${t.faint}`}>{lang === 'hi' ? 'दिया: D0=0, D1=1, S=1' : 'Given: D0=0, D1=1, S=1'}</p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'प्रतिस्थापन' : 'Substitute',
      body: (
        <div className="space-y-2 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? "S=1 तो S' = (1)' = 0।" : "S=1 so S' = (1)' = 0."}</p>
          <div className="text-lg">{mono('Y = (1)\'.(0) + (1).(1)', accent)}</div>
          <div className="text-base">{mono('  = (0).(0) + (1).(1)', t.sub as string)}</div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'अंकगणित' : 'Arithmetic',
      body: (
        <div className="space-y-2 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'हर product term एक AND है।' : 'Each product term is an AND.'}</p>
          <div className="text-lg">{mono(`Y = ${a0} + ${a1}`, accent)}</div>
          <p className={`text-[12px] ${t.faint}`}>0 AND 0 = {a0}{'   '}1 AND 1 = {a1}</p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'हल' : 'Solve',
      body: (
        <div className="space-y-2 text-center">
          <div className="text-2xl font-black" style={{ color: ACC.good }}>Y = {Y}</div>
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>S=1 track 1 को address करता है, तो Y = D1 = <b style={{ color: ACC.good }}>{D1}</b>. मेल खाता है.</>
              : <>S=1 addresses track 1, so Y = D1 = <b style={{ color: ACC.good }}>{D1}</b>. It matches.</>}
          </p>
        </div>
      ),
    },
  ];
  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── bespoke: 4-to-1 worked example step-through ─────────
   D0=1 D1=0 D2=1 D3=0, code 10; only S1.S0'.D2 survives. All computed. */
const FourWorked: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const D = [1, 0, 1, 0];          // D0..D3
  const S1 = 1, S0 = 0;
  const S1n = S1 ^ 1, S0n = S0 ^ 1;
  const terms = [
    { lit: "S1'.S0'.D0", val: S1n & S0n & D[0] },
    { lit: "S1'.S0.D1", val: S1n & S0 & D[1] },
    { lit: "S1.S0'.D2", val: S1 & S0n & D[2] },
    { lit: "S1.S0.D3", val: S1 & S0 & D[3] },
  ];
  const Y = terms.reduce((a, x) => a | x.val, 0);
  const code = S1 * 2 + S0;
  const mono = (v: string, c?: string) => <span className="font-mono font-black" style={{ color: c ?? (t.ink as string) }}>{v}</span>;

  const steps = [
    {
      label: lang === 'hi' ? 'समीकरण' : 'Equation',
      body: (
        <div className="space-y-2 text-center">
          <div className="text-[15px]">{mono("Y = S1'.S0'.D0 + S1'.S0.D1 + S1.S0'.D2 + S1.S0.D3", accent)}</div>
          <p className={`text-[12px] ${t.faint}`}>{lang === 'hi' ? 'दिया: D0=1 D1=0 D2=1 D3=0, S1=1 S0=0' : 'Given: D0=1 D1=0 D2=1 D3=0, S1=1 S0=0'}</p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'प्रतिस्थापन' : 'Substitute',
      body: (
        <div className="space-y-1 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? "S1=1 तो S1'=0; S0=0 तो S0'=1." : "S1=1 so S1'=0; S0=0 so S0'=1."}</p>
          <div className="text-[14px]">{mono('Y = (0)(1)(1) + (0)(0)(0) + (1)(1)(1) + (1)(0)(0)', t.sub as string)}</div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'अंकगणित' : 'Arithmetic',
      body: (
        <div className="space-y-2">
          {terms.map((tm, i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 font-mono text-[12px]"
              style={{ borderColor: tm.val ? `${ACC.good}66` : `${t.faint}33`, background: tm.val ? `${ACC.good}14` : 'transparent' }}>
              <span style={{ color: tm.val ? ACC.good : (t.faint as string) }}>{tm.lit}</span>
              <span style={{ color: tm.val ? ACC.good : (t.faint as string) }}>
                = {tm.val} {tm.val ? '' : (lang === 'hi' ? '(मरा)' : '(killed)')}
              </span>
            </div>
          ))}
          <p className={`text-center text-[13px] ${t.sub}`}>Y = {terms.map((tm) => tm.val).join(' + ')} = <b style={{ color: ACC.good }}>{Y}</b></p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'हल' : 'Solve',
      body: (
        <div className="space-y-2 text-center">
          <div className="text-2xl font-black" style={{ color: ACC.good }}>Y = {Y}</div>
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>code S1S0 = 10 = decimal {code} D{code} को address करता है, और D{code} = <b style={{ color: ACC.good }}>{D[code]}</b>. सिर्फ़ S1.S0'.D2 बचा.</>
              : <>code S1S0 = 10 = decimal {code} addresses D{code}, and D{code} = <b style={{ color: ACC.good }}>{D[code]}</b>. Only S1.S0'.D2 survived.</>}
          </p>
        </div>
      ),
    },
  ];
  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── bespoke: 4-to-1 minterm map (computed) ───────── */
const MintermMap: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const rows = [0, 1, 2, 3].map((i) => {
    const s1 = (i >> 1) & 1, s0 = i & 1;
    const lit = `S1${s1 ? '' : "'"}.S0${s0 ? '' : "'"}`;
    return { cells: [`${s1}${s0}`, i, lit, `D${i}`] };
  });
  return (
    <TruthTable isDarkMode={isDarkMode} accent={accent}
      headers={['S1S0', lang === 'hi' ? 'मान' : 'value', lang === 'hi' ? 'minterm' : 'minterm', lang === 'hi' ? 'चुना input' : 'selected']}
      rows={rows}
      note={lang === 'hi' ? 'select code का binary मान ठीक चुने input का index है।' : "The binary value of the select code is exactly the index of the chosen input."} />
  );
};

/* ───────── bespoke: MUX-as-LUT loader ─────────
   Pick a 2-variable function; auto-map A,B -> S1,S0 and the output column ->
   data inputs; walk the code through every row to prove the MUX = the function. */
const LutLoader: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  // F indexed by (A,B): rows 00,01,10,11
  const FUNCS: { id: string; f: number[] }[] = [
    { id: 'XOR', f: [0, 1, 1, 0] },
    { id: 'AND', f: [0, 0, 0, 1] },
    { id: 'OR', f: [0, 1, 1, 1] },
    { id: 'NAND', f: [1, 1, 1, 0] },
  ];
  const [fi, setFi] = useState(0);
  const [A, setA] = useState(0);
  const [B, setB] = useState(0);
  const F = FUNCS[fi].f;
  const code = A * 2 + B;          // S1=A, S0=B
  const data = F;                 // data inputs ARE the output column
  const muxOut = data[code];      // computed lookup
  const truthOut = F[code];       // the function's own value
  const ok = muxOut === truthOut; // always true; proves equivalence

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'MUX as LUT · function चुनिए' : 'MUX as LUT · pick a function'}
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {FUNCS.map((fn, k) => (
          <button key={fn.id} onClick={() => setFi(k)}
            className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={fi === k ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent }}>
            {fn.id}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {/* the truth table loaded onto data inputs */}
        <div className="grid grid-cols-4 gap-1 text-center font-mono text-[12px]">
          <div className={`font-black ${t.faint}`}>A</div><div className={`font-black ${t.faint}`}>B</div>
          <div className="font-black" style={{ color: ACC.II }}>F</div><div className="font-black" style={{ color: accent }}>Di</div>
          {[0, 1, 2, 3].map((r) => (
            <React.Fragment key={r}>
              <div style={{ color: r === code ? accent : undefined, fontWeight: r === code ? 900 : 400 }}>{r >> 1}</div>
              <div style={{ color: r === code ? accent : undefined, fontWeight: r === code ? 900 : 400 }}>{r & 1}</div>
              <div className="font-black" style={{ color: ACC.II }}>{F[r]}</div>
              <div className="flex items-center justify-center">
                <span className="flex h-6 w-6 items-center justify-center rounded font-black"
                  style={{ background: r === code ? accent : 'transparent', color: r === code ? '#000' : accent, border: `1.5px solid ${accent}${r === code ? '' : '55'}` }}>D{r}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* the MUX symbol */}
        <svg viewBox="0 0 90 110" className="w-[80px]">
          <polygon points="12,10 60,30 60,80 12,100" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2.5" />
          <text x="32" y="52" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent}>4:1</text>
          <text x="32" y="64" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>LUT</text>
          <line x1="60" y1="55" x2="88" y2="55" stroke={muxOut ? accent : (isDarkMode ? '#334155' : '#cbd5e1')} strokeWidth="3" />
        </svg>
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[11px]" style={{ color: accent }}>Y</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-lg font-mono text-xl font-black"
            style={{ background: muxOut ? accent : 'transparent', color: muxOut ? '#000' : accent, border: `2px solid ${accent}` }}>{muxOut}</span>
        </div>
      </div>

      {/* select = A,B */}
      <div className="mt-4 flex items-center justify-center gap-4 font-mono text-[12px]">
        <span className={t.faint as string}>S1 = A</span>
        <button onClick={() => setA(A ^ 1)} className="flex h-9 w-9 items-center justify-center rounded-lg font-black active:scale-90"
          style={{ background: A ? ACC.II : 'transparent', color: A ? '#000' : ACC.II, border: `2px solid ${ACC.II}` }}>{A}</button>
        <span className={t.faint as string}>S0 = B</span>
        <button onClick={() => setB(B ^ 1)} className="flex h-9 w-9 items-center justify-center rounded-lg font-black active:scale-90"
          style={{ background: B ? ACC.I : 'transparent', color: B ? '#000' : ACC.I, border: `2px solid ${ACC.I}` }}>{B}</button>
      </div>
      <p className={`mt-3 flex items-center justify-center gap-2 text-center font-mono text-[13px] ${t.sub}`}>
        {ok ? <Check size={15} style={{ color: ACC.good }} /> : <X size={15} style={{ color: ACC.III }} />}
        {FUNCS[fi].id}({A},{B}) = {truthOut} {'->'} {lang === 'hi' ? 'MUX देता है' : 'MUX outputs'} <b style={{ color: ACC.good }}>{muxOut}</b>
        {'  '}({lang === 'hi' ? 'मेल खाता है' : 'they match'})
      </p>
    </Card>
  );
};

/* ───────── bespoke: enable + cascade visual (computed) ───────── */
const EnableCascade: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [EN, setEN] = useState(1);
  const [s2, setS2] = useState(0);
  const [s1, setS1] = useState(1);
  const [s0, setS0] = useState(0);
  // eight inputs I0..I7, computed pattern
  const I = [0, 1, 1, 0, 1, 0, 0, 1];
  const lowIdx = s1 * 2 + s0;             // 4:1-A picks from I0..I3
  const highIdx = 4 + s1 * 2 + s0;        // 4:1-B picks from I4..I7
  const YA = I[lowIdx];
  const YB = I[highIdx];
  const core = s2 ? YB : YA;              // final 2:1 by S2
  const Y = EN & core;                    // enable master gate
  const k = 3;
  const muxCount = (1 << k) - 1;          // 2^k - 1

  const sel = (lbl: string, v: number, set: (n: number) => void) => (
    <button onClick={() => set(v ^ 1)} className="flex flex-col items-center gap-1 active:scale-90">
      <span className="font-mono text-[10px] font-bold" style={{ color: ACC.II }}>{lbl}</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-black"
        style={{ background: v ? ACC.II : 'transparent', color: v ? '#000' : ACC.II, border: `2px solid ${ACC.II}${v ? '' : '66'}` }}>{v}</span>
    </button>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? '8-to-1 cascade + enable' : '8-to-1 cascade + enable'}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[{ name: '4:1-A (I0..I3)', idx: lowIdx, out: YA }, { name: '4:1-B (I4..I7)', idx: highIdx, out: YB }].map((m) => (
          <div key={m.name} className={`rounded-2xl border p-3 text-center ${t.soft}`}>
            <div className={`font-mono text-[10px] ${t.faint}`}>{m.name}</div>
            <div className="mt-1 font-mono text-[12px]" style={{ color: accent }}>{lang === 'hi' ? 'चुना' : 'picks'} I{m.idx}</div>
            <div className="mt-1 font-mono text-lg font-black" style={{ color: m.out ? accent : t.faint }}>{m.out}</div>
          </div>
        ))}
        <div className={`rounded-2xl border p-3 text-center`} style={{ borderColor: `${ACC.good}55`, background: `${ACC.good}0d` }}>
          <div className={`font-mono text-[10px] ${t.faint}`}>2:1 (S2) {'->'} Y</div>
          <div className="mt-1 font-mono text-[12px]" style={{ color: ACC.good }}>{s2 ? 'YB' : 'YA'} . EN</div>
          <div className="mt-1 font-mono text-2xl font-black" style={{ color: Y ? ACC.good : t.faint }}>{Y}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <span className={`font-mono text-[11px] ${t.faint}`}>select</span>
        {sel('S2', s2, setS2)}{sel('S1', s1, setS1)}{sel('S0', s0, setS0)}
        <span className="font-mono text-sm font-black" style={{ color: ACC.II }}>= {s2 * 4 + s1 * 2 + s0}</span>
        <div className="ml-2 flex flex-col items-center gap-1">
          <span className="font-mono text-[10px] font-bold" style={{ color: EN ? ACC.good : ACC.III }}>EN</span>
          <button onClick={() => setEN(EN ^ 1)} className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-black active:scale-90"
            style={{ background: EN ? ACC.good : 'transparent', color: EN ? '#000' : ACC.III, border: `2px solid ${EN ? ACC.good : ACC.III}` }}>{EN}</button>
        </div>
      </div>

      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {EN
          ? <>Y = I{s2 * 4 + s1 * 2 + s0} = <b style={{ color: ACC.good }}>{Y}</b></>
          : <span style={{ color: ACC.III }}>{lang === 'hi' ? 'EN=0 -> junction बंद, Y मजबूरन 0' : 'EN=0 -> junction closed, Y forced to 0'}</span>}
      </p>
      <p className={`mt-1 text-center font-mono text-[11px] ${t.faint}`}>
        {lang === 'hi'
          ? <>सिर्फ़ 2-to-1 से बना 2^{k}-to-1 tree = 2^{k} - 1 = <b style={{ color: accent }}>{muxCount}</b> MUXes</>
          : <>2^{k}-to-1 tree from only 2-to-1 MUXes = 2^{k} - 1 = <b style={{ color: accent }}>{muxCount}</b> MUXes</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: the spec proofs.derivations as a StepThrough ───────── */
const ProofsWalkthrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const mono = (v: string) => <span className="font-mono font-black" style={{ color: accent }}>{v}</span>;
  const body = (en: string, hi: string, eq?: string) => (
    <div className="space-y-2">
      <p className={`text-[13.5px] leading-relaxed ${t.sub}`}>{lang === 'hi' ? hi : en}</p>
      {eq && <div className={`rounded-lg border p-2 text-center ${t.soft}`}>{mono(eq)}</div>}
    </div>
  );
  const steps = [
    {
      label: lang === 'hi' ? '2-to-1 truth table से' : '2-to-1 from its truth table',
      body: body(
        "A 2-to-1 MUX has data I0, I1, select S. Truth table: S=0 -> Y=I0; S=1 -> Y=I1. Group the Y=1 rows by select: when S=0 they contribute S'.I0, when S=1 they contribute S.I1. Sum them. Check: S=0 gives 1.I0+0.I1=I0; S=1 gives 0.I0+1.I1=I1.",
        "एक 2-to-1 MUX में data I0, I1, select S है। Truth table: S=0 -> Y=I0; S=1 -> Y=I1। Y=1 rows को select से समूह कीजिए: S=0 पर ये S'.I0 देती हैं, S=1 पर S.I1। इन्हें जोड़िए। जाँच: S=0 देता है 1.I0+0.I1=I0; S=1 देता है 0.I0+1.I1=I1।",
        "Y = S'.I0 + S.I1"),
    },
    {
      label: lang === 'hi' ? '4-to-1 truth table से' : '4-to-1 from its truth table',
      body: body(
        "Address map 00->I0, 01->I1, 10->I2, 11->I3. For each combination AND the data line with the decoded select term: S1'.S0' enables I0, S1'.S0 enables I1, S1.S0' enables I2, S1.S0 enables I3. The four terms are the 4 minterms of S1,S0, so exactly one is 1 at a time; OR them. Check 10: only S1.S0'=1, so Y=I2.",
        "Address map 00->I0, 01->I1, 10->I2, 11->I3। हर combination के लिए data line को decoded select term से AND कीजिए: S1'.S0' I0 को enable करता है, S1'.S0 I1, S1.S0' I2, S1.S0 I3। चारों terms S1,S0 के 4 minterms हैं, तो एक समय में ठीक एक 1 होता है; इन्हें OR कीजिए। जाँच 10: सिर्फ़ S1.S0'=1, तो Y=I2।",
        "Y = S1'.S0'.I0 + S1'.S0.I1 + S1.S0'.I2 + S1.S0.I3"),
    },
    {
      label: lang === 'hi' ? 'n selects -> 2^n inputs' : 'n selects -> 2^n inputs',
      body: body(
        "With n selects there are 2^n addresses, one per input I_k. Define minterm m_k = product of (Sj if bit j of k is 1, else Sj'); m_k=1 only at address k. General output Y = sum over k of m_k.I_k. The 2^n minterms are mutually exclusive and exhaustive, so exactly one is 1 and Y always equals the selected I_k.",
        "n selects के साथ 2^n addresses हैं, हर input I_k के लिए एक। Minterm m_k = (Sj अगर k का bit j 1 हो, वरना Sj') का गुणनफल; m_k=1 सिर्फ़ address k पर। सामान्य output Y = k पर m_k.I_k का योग। 2^n minterms परस्पर-अनन्य और संपूर्ण हैं, तो ठीक एक 1 होता है और Y हमेशा चुने I_k के बराबर।",
        "Y = sum_k  m_k . I_k"),
    },
    {
      label: lang === 'hi' ? 'Shannon expansion' : 'Shannon expansion',
      body: body(
        "Take F(x, rest). Cofactors F0 = F(0, rest), F1 = F(1, rest). Claim F = x'.F0 + x.F1. Case x=0: RHS = 1.F0 + 0.F1 = F0 = F. Case x=1: RHS = 0.F0 + 1.F1 = F1 = F. Both match. Compare to Y = S'.I0 + S.I1: a 2-to-1 MUX with select=x, I0=F0, I1=F1 realizes any F.",
        "F(x, rest) लीजिए। Cofactors F0 = F(0, rest), F1 = F(1, rest)। दावा F = x'.F0 + x.F1। Case x=0: RHS = 1.F0 + 0.F1 = F0 = F। Case x=1: RHS = 0.F0 + 1.F1 = F1 = F। दोनों मेल खाते हैं। Y = S'.I0 + S.I1 से तुलना: select=x, I0=F0, I1=F1 वाला 2-to-1 MUX किसी भी F को साकार करता है।",
        "F = x'.F0 + x.F1"),
    },
    {
      label: lang === 'hi' ? '2^n:1 = कोई f(n+1)' : '2^n:1 = any f(n+1)',
      body: body(
        "Let F have n+1 variables. Pick n as selects S, leave x. Write F = sum_k m_k.g_k where g_k is the residual cofactor (a function of x only) for address k. Each g_k can only be 0, 1, x, or x'. Wire data I_k = g_k. Then the MUX output sum_k m_k.I_k equals F. So any (n+1)-variable function fits a 2^n:1 MUX with at most one inverter for x'.",
        "मान लीजिए F में n+1 variables हैं। n को selects S चुनिए, x छोड़िए। F = sum_k m_k.g_k लिखिए जहाँ g_k address k का residual cofactor (सिर्फ़ x का function) है। हर g_k सिर्फ़ 0, 1, x, या x' हो सकता है। Data I_k = g_k wire कीजिए। तब MUX output sum_k m_k.I_k बराबर F। तो कोई भी (n+1)-variable function एक 2^n:1 MUX में फ़िट होता है, x' के लिए अधिकतम एक inverter के साथ।",
        "any f(n+1) = 2^n:1 MUX, data in {0,1,x,x'}"),
    },
    {
      label: lang === 'hi' ? "F(A,B,C)=Σm(0,2,5,6)" : 'F(A,B,C)=Σm(0,2,5,6)',
      body: body(
        "n+1=3, use a 4-to-1. Selects S1=B, S0=C; data variable x=A. Two rows: A'=0 row holds minterms 0,1,2,3; A=1 row holds 4,5,6,7, under columns BC=00,01,10,11. Circle F={0,2,5,6}: BC=00 only A'-row -> I0=A'; BC=01 only A-row -> I1=A; BC=10 both rows -> I2=1; BC=11 none -> I3=0.",
        "n+1=3, एक 4-to-1 वापरिए। Selects S1=B, S0=C; data variable x=A। दो rows: A'=0 row में minterms 0,1,2,3; A=1 row में 4,5,6,7, columns BC=00,01,10,11 के नीचे। F={0,2,5,6} circle कीजिए: BC=00 सिर्फ़ A'-row -> I0=A'; BC=01 सिर्फ़ A-row -> I1=A; BC=10 दोनों rows -> I2=1; BC=11 कोई नहीं -> I3=0।",
        "selects B,C; I0=A', I1=A, I2=1, I3=0"),
    },
    {
      label: lang === 'hi' ? '8:1 cascading' : '8:1 cascading',
      body: body(
        "8-to-1 needs S2 S1 S0. MUX-A (4:1) takes I0..I3 with S1,S0; MUX-B (4:1) takes I4..I7 with the same S1,S0. Feed YA, YB into a 2:1 MUX driven by S2: S2=0 -> low half, S2=1 -> high half. Algebraically Y = S2'.YA + S2.YB, which expands to the full 8-minterm sum over S2 S1 S0.",
        "8-to-1 को S2 S1 S0 चाहिए। MUX-A (4:1) I0..I3 को S1,S0 के साथ लेता है; MUX-B (4:1) I4..I7 को उन्हीं S1,S0 के साथ। YA, YB को S2 से चलाए 2:1 MUX में feed कीजिए: S2=0 -> निचला आधा, S2=1 -> ऊपरी आधा। Algebra में Y = S2'.YA + S2.YB, जो S2 S1 S0 पर पूरे 8-minterm sum में फैलता है।",
        "Y = S2'.YA + S2.YB"),
    },
    {
      label: lang === 'hi' ? 'Enable जोड़ना' : 'Adding an enable',
      body: body(
        "Add active-high EN. Requirement: EN=1 normal, EN=0 output forced to 0. Take Y_core = S1'.S0'.I0 + S1'.S0.I1 + S1.S0'.I2 + S1.S0.I3 and AND it with EN: Y = EN.Y_core, via one extra 2-input AND on Y_core (or EN as a 4th input on every AND). EN=1 -> Y=Y_core; EN=0 -> Y=0. Active-low EN_L: substitute EN = EN_L'.",
        "active-high EN जोड़िए। शर्त: EN=1 सामान्य, EN=0 output मजबूरन 0। Y_core = S1'.S0'.I0 + S1'.S0.I1 + S1.S0'.I2 + S1.S0.I3 लीजिए और इसे EN से AND कीजिए: Y = EN.Y_core, Y_core पर एक अतिरिक्त 2-input AND से (या EN हर AND पर 4था input)। EN=1 -> Y=Y_core; EN=0 -> Y=0। Active-low EN_L: EN = EN_L' रखिए।",
        "Y = EN . Y_core ; EN=0 -> Y=0"),
    },
    {
      label: lang === 'hi' ? 'NAND से AND/OR/NOT' : 'AND/OR/NOT from NAND',
      body: body(
        "NAND(a,b)=(a.b)'. NOT: NAND(a,a)=a' (1 gate). AND: NAND then NOT, NAND(NAND(a,b),NAND(a,b))=a.b (2 gates). OR: by De Morgan a+b=(a'.b')', so NAND(NAND(a,a),NAND(b,b))=a+b (3 gates). Since the MUX uses only AND, OR, NOT, any MUX re-expresses in NAND-only logic.",
        "NAND(a,b)=(a.b)'। NOT: NAND(a,a)=a' (1 gate)। AND: NAND फिर NOT, NAND(NAND(a,b),NAND(a,b))=a.b (2 gates)। OR: De Morgan से a+b=(a'.b')', तो NAND(NAND(a,a),NAND(b,b))=a+b (3 gates)। चूँकि MUX सिर्फ़ AND, OR, NOT वापरता है, कोई भी MUX NAND-only logic में फिर से लिखा जा सकता है।",
        "NOT=NAND(a,a); AND=2 NAND; OR=3 NAND"),
    },
  ];
  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* section wrapper for the proofs walkthrough under the recap */
const ProofsSection: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const sources = [
    { claim: '4-to-1 equation, 4 AND + 2 NOT + 1 OR build, 2^n inputs <-> n selects (and three 2:1 = one 4:1).', url: 'https://www.geeksforgeeks.org/digital-logic/multiplexers-in-digital-logic/' },
    { claim: '2-to-1 output Y = S0\'.I0 + S0.I1; log2(N) select lines for N inputs.', url: 'https://www.electronics-tutorials.ws/combination/comb_2.html' },
    { claim: '4-to-1 gate-level build and the two-4:1-plus-2:1 cascade for an 8-to-1.', url: 'https://www.electronicshub.org/multiplexerandmultiplexing/' },
    { claim: '2^n-to-1 MUX implements any function of n+1 variables (implementation table, Shannon cofactors).', url: 'https://electrically4u.com/solved-problems-on-multiplexer/' },
  ];
  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{lang === 'hi' ? 'सबूत · guided' : 'proofs · guided'}</Eyebrow>
        <h2 className={`text-2xl md:text-3xl font-black ${t.text}`}>
          {lang === 'hi' ? 'हर derivation step-by-step' : 'Every derivation, step by step'}
        </h2>
        <p className={`max-w-2xl text-[14px] ${t.sub}`}>
          {lang === 'hi'
            ? 'truth-table से 2:1 और 4:1, n selects का सामान्यीकरण, Shannon expansion, MUX-as-LUT, cascading, enable और NAND-only realization - सब काग़ज़ पर।'
            : 'From the truth table to the 2:1 and 4:1, the n-select generalization, Shannon expansion, MUX-as-LUT, cascading, enable, and NAND-only realization - all on paper.'}
        </p>
      </section>
      <ProofsWalkthrough isDarkMode={isDarkMode} accent={accent} />
      <Card isDarkMode={isDarkMode}>
        <div className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'स्रोत · sources' : 'sources'}</div>
        <ul className="space-y-2">
          {sources.map((s) => (
            <li key={s.url} className="text-[13px]">
              <a href={s.url} target="_blank" rel="noreferrer" className="font-bold underline" style={{ color: accent }}>{s.url}</a>
              <span className={`ml-2 ${t.faint}`}>- {s.claim}</span>
            </li>
          ))}
        </ul>
      </Card>
    </SceneShell>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.55) ? 'PART II · THE LOGIC'
      : i < n - 2 ? 'PART III · BUILD IT'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  // order matters: more specific ids first (xorlut before the generic "4-to-1 mux" match)
  if (key.includes('whatis') || key.includes('what a multiplexer')) return 'trackswitch';
  if (key.includes('sizing')) return 'mux';
  if (key.includes('xorlut')) return 'xorlut';
  if (key.includes('lut')) return 'lut';
  if (key.includes('twotoone')) return 'twogates';
  if (key.includes('fourtoone')) return 'fourgates';
  if (key.includes('enable') || key.includes('cascad')) return 'enablecascade';
  if (key.includes('build')) return 'build';
  return null;
};

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="MUX · The Digital Track Switch" hero={<TrackSwitch isDarkMode={p.isDarkMode} accent={p.accent} />} />;
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="MUX" tag="Practice · Multiplexer" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => (
        <>
          <RecapScene {...p} scene={scene} />
          <ProofsSection isDarkMode={p.isDarkMode} accent={p.accent} />
        </>
      );
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'trackswitch' && (
            <div className="space-y-6">
              <TryItYourself />
              <TrackSwitch isDarkMode={p.isDarkMode} accent={p.accent} />
              <MuxViz isDarkMode={p.isDarkMode} accent={p.accent} inputs={4} />
            </div>
          )}
          {which === 'mux' && (
            <div className="space-y-6">
              <TryItYourself />
              <MuxViz isDarkMode={p.isDarkMode} accent={p.accent} inputs={4} />
              <MuxViz isDarkMode={p.isDarkMode} accent={p.accent} inputs={2} />
            </div>
          )}
          {which === 'twogates' && (
            <div className="space-y-6">
              <TryItYourself />
              <TwoToOneGates isDarkMode={p.isDarkMode} accent={p.accent} />
              <TwoWorked isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'fourgates' && (
            <div className="space-y-6">
              <TryItYourself />
              <MintermMap isDarkMode={p.isDarkMode} accent={p.accent} />
              <MuxViz isDarkMode={p.isDarkMode} accent={p.accent} inputs={4} />
              <FourWorked isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'lut' && (
            <div className="space-y-6">
              <TryItYourself />
              <LutLoader isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'xorlut' && (
            <div className="space-y-6">
              <TryItYourself />
              <LutLoader isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'enablecascade' && (
            <div className="space-y-6">
              <TryItYourself />
              <EnableCascade isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="mux-4to1"
              titleEN="Build the Multiplexer (MUX) for real"
              titleHI="असली में Multiplexer (MUX) बनाइए"
              bodyEN="Open the live workbench and wire a 4-to-1 MUX from two inverters, four 3-input ANDs and one 4-input OR, then prove every select code routes the right input."
              bodyHI="live workbench खोलिए और दो inverters, चार 3-input ANDs और एक 4-input OR से एक 4-to-1 MUX बनाइए, फिर साबित कीजिए कि हर select code सही input route करता है।" />
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
