/**
 * The Demultiplexer (dsd/22) - "One Input, Many Lines".
 * Generic scenes come from the shared _subtractor kit; the courier routing
 * scene, the gate-level 1-to-2 build (live AND gates), the 1-to-4 demux + its
 * computed truth table, the MUX<->DEMUX mirror, and the full proofs StepThrough
 * are bespoke. Every boolean result is COMPUTED in code, never trusted to prose.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Home, ArrowRight } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { DemuxViz, BitToggle } from '../_combo/blocks';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/dsd22-demux.mp4';
const SRC_HI: string | undefined = undefined;
void SRC_HI;

const ACC = { sel: '#f59e0b', good: '#34d399', off: '#fb7185', data: '#38bdf8' };
const bin = (n: number, w: number) => n.toString(2).padStart(w, '0');

/* ───────── bespoke: the parcel-courier routing scene (S02 what-does) ─────────
   Toggle D and the two select bits; the package travels to exactly one house,
   the rest stay empty (0). Every output value computed from Yi = D . minterm. */
const CourierScene: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [D, setD] = useState(1);
  const [s1, setS1] = useState(1);
  const [s0, setS0] = useState(0);
  const idx = s1 * 2 + s0;                 // chosen house
  const out = (i: number) => (i === idx ? D : 0); // computed routing

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-center gap-2">
        <Package size={18} style={{ color: accent }} />
        <span className={`font-mono text-[12px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? 'courier · एक package, चार घर' : 'courier · one package, four houses'}
        </span>
      </div>

      <div className="flex items-center justify-center gap-5">
        {/* the package D */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px]" style={{ color: accent }}>D</span>
          <button onClick={() => setD((v) => v ^ 1)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 active:scale-90"
            style={{ borderColor: accent, background: D ? `${accent}22` : 'transparent' }}>
            <Package size={26} style={{ color: D ? accent : t.faint as string }} />
          </button>
          <span className="font-mono text-[10px]" style={{ color: D ? accent : t.faint as string }}>
            {D ? (lang === 'hi' ? 'भरा' : 'full') : (lang === 'hi' ? 'ख़ाली' : 'empty')} = {D}
          </span>
        </div>

        <ArrowRight size={20} style={{ color: t.faint as string }} />

        {/* the four houses */}
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => {
            const on = i === idx;
            const v = out(i);
            return (
              <motion.div key={i} animate={{ scale: on ? 1.06 : 1 }}
                className="flex flex-col items-center gap-1 rounded-xl border p-2"
                style={{ borderColor: on ? accent : `${t.faint as string}44`, background: on && v ? `${accent}1a` : 'transparent' }}>
                <Home size={20} style={{ color: on && v ? accent : (t.faint as string) }} />
                <span className="font-mono text-[10px]" style={{ color: on ? accent : (t.faint as string) }}>Y{i}</span>
                <BitToggle value={v} color={on && v ? accent : (isDarkMode ? '#334155' : '#cbd5e1')} size={26} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* the address */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'पता' : 'address'}</span>
        <BitToggle value={s1} onClick={() => setS1((v) => v ^ 1)} color={ACC.sel} label="S1" size={32} />
        <BitToggle value={s0} onClick={() => setS0((v) => v ^ 1)} color={ACC.sel} label="S0" size={32} />
        <span className="font-mono text-[12px] font-black" style={{ color: ACC.sel }}>= {idx}</span>
      </div>

      <p className={`mt-4 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>पता <b style={{ color: ACC.sel }}>{bin(idx, 2)}</b> {'->'} घर <b style={{ color: accent }}>Y{idx}</b> को package <b style={{ color: accent }}>{out(idx)}</b> मिलता है, बाक़ी सब 0.</>
          : <>Address <b style={{ color: ACC.sel }}>{bin(idx, 2)}</b> {'->'} house <b style={{ color: accent }}>Y{idx}</b> gets the package <b style={{ color: accent }}>{out(idx)}</b>, all others 0.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: gate-level 1-to-2 demux (S05) ─────────
   Two live AND gates compute Y0 = S'.D and Y1 = S.D for the chosen D, S. */
const OneToTwoGates: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [D, setD] = useState(1);
  const [S, setS] = useState(1);
  const Sn = S ^ 1;
  const Y0 = D & Sn;   // S'.D
  const Y1 = D & S;    // S.D

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
        <BitToggle value={D} onClick={() => setD((v) => v ^ 1)} color={accent} label="D" size={40} />
        <BitToggle value={S} onClick={() => setS((v) => v ^ 1)} color={ACC.sel} label="S" size={40} />
        <span className={`font-mono text-[12px] ${t.faint}`}>S' = {Sn}</span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px]" style={{ color: Y0 ? ACC.good : (t.faint as string) }}>Y0 = S'.D = {Y0}</span>
          <LiveGate type="AND" a={D} b={Sn} isDarkMode={isDarkMode} accent={accent} labelA="D" labelB="S'" labelOut="Y0" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px]" style={{ color: Y1 ? ACC.good : (t.faint as string) }}>Y1 = S.D = {Y1}</span>
          <LiveGate type="AND" a={D} b={S} isDarkMode={isDarkMode} accent={accent} labelA="D" labelB="S" labelOut="Y1" />
        </div>
      </div>

      <p className={`mt-4 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>S = {S} {'->'} package <b style={{ color: ACC.good }}>Y{S}</b> पर ({S ? 'निचला घर' : 'ऊपरी घर'}); दूसरा output 0.</>
          : <>S = {S} {'->'} package routes to <b style={{ color: ACC.good }}>Y{S}</b> (the {S ? 'lower' : 'upper'} house); the other output is 0.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: 1-to-4 demux + computed truth table (S06) ───────── */
const OneToFourBuild: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  // computed truth table: for each select code, which Y carries D (shown as 'D'), rest 0.
  const rows = [0, 1, 2, 3].map((code) => {
    const s1 = (code >> 1) & 1, s0 = code & 1;
    const y = [3, 2, 1, 0].map((i) => (i === code ? 'D' : 0)); // Y3,Y2,Y1,Y0 order
    return { cells: [s1, s0, ...y], highlight: code === 2 };    // highlight the 10 -> Y2 example
  });

  return (
    <div className="space-y-6">
      <DemuxViz isDarkMode={isDarkMode} accent={accent} outputs={4} />
      <TruthTable isDarkMode={isDarkMode} accent={accent}
        headers={['S1', 'S0', 'Y3', 'Y2', 'Y1', 'Y0']}
        rows={rows}
        note={lang === 'hi'
          ? 'हर row में ठीक एक output D के बराबर है (one-hot)। highlighted row: code 10 -> Y2 = D, बाक़ी 0.'
          : 'In every row exactly one output equals D (one-hot). Highlighted row: code 10 -> Y2 = D, the rest 0.'} />
    </div>
  );
};

/* ───────── bespoke: MUX <-> DEMUX mirror (S08) ───────── */
const MuxDemuxMirror: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* MUX: many -> 1 */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: t.faint as string }}>{lang === 'hi' ? 'MUX · many-to-1' : 'MUX · many-to-1'}</span>
          <svg viewBox="0 0 160 120" className="w-full max-w-[200px]">
            {[30, 50, 70, 90].map((y, i) => <line key={i} x1="6" y1={y} x2="60" y2="60" stroke={dim} strokeWidth="2" />)}
            <polygon points="60,30 110,48 110,72 60,90" fill={box} stroke={accent} strokeWidth="2.5" />
            <line x1="110" y1="60" x2="154" y2="60" stroke={accent} strokeWidth="3" />
            <text x="85" y="63" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>4:1</text>
            <text x="150" y="52" textAnchor="end" fontFamily="monospace" fontSize="10" fill={accent}>Y</text>
          </svg>
          <span className={`text-center text-[12px] ${t.sub}`}>{lang === 'hi' ? 'कई inputs एक output में समेटे' : 'many inputs funnel to one'}</span>
        </div>
        {/* DEMUX: 1 -> many */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>{lang === 'hi' ? 'DEMUX · 1-to-many' : 'DEMUX · 1-to-many'}</span>
          <svg viewBox="0 0 160 120" className="w-full max-w-[200px]">
            <line x1="6" y1="60" x2="50" y2="60" stroke={accent} strokeWidth="3" />
            <polygon points="50,48 100,30 100,90 50,72" fill={box} stroke={accent} strokeWidth="2.5" />
            {[30, 50, 70, 90].map((y, i) => <line key={i} x1="100" y1="60" x2="154" y2={y} stroke={i === 2 ? accent : dim} strokeWidth={i === 2 ? 3 : 2} />)}
            <text x="75" y="63" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>1:4</text>
            <text x="8" y="52" fontFamily="monospace" fontSize="10" fill={accent}>D</text>
          </svg>
          <span className={`text-center text-[12px] ${t.sub}`}>{lang === 'hi' ? 'एक input कई outputs में फैले' : 'one input fans out to many'}</span>
        </div>
      </div>
      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>एक ही select logic, उल्टी दिशा। एक decoder जिसका <b style={{ color: accent }}>Enable = D</b> हो, वही एक DEMUX है।</>
          : <>Same select logic, opposite direction. A decoder whose <b style={{ color: accent }}>Enable = D</b> is exactly a DEMUX.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: full proofs walkthrough (S09 StepThrough) ─────────
   The spec derivations rendered step by step. Truth-table / equation values are
   computed in code where they are numeric (the 1-to-4 minterms, the round-trip
   Gray check) so nothing is asserted on faith. */
const ProofsWalkthrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const mono = (s: string, c?: string) => <span className="font-mono font-bold" style={{ color: c ?? (t.ink as string) }}>{s}</span>;

  // computed 1-to-4 minterm table
  const mt = [0, 1, 2, 3].map((i) => {
    const s1 = (i >> 1) & 1, s0 = i & 1;
    return `Y${i} = D . S1${s1 ? '' : "'"} . S0${s0 ? '' : "'"}`;
  });

  // computed Gray round-trip check for B = 1011
  const B = [1, 0, 1, 1]; // B3..B0
  const G = [B[0], B[0] ^ B[1], B[1] ^ B[2], B[2] ^ B[3]];
  const Bb = [G[0], G[0] ^ G[1] /* B2 = B3^G2 */, 0, 0];
  Bb[2] = Bb[1] ^ G[2];
  Bb[3] = Bb[2] ^ G[3];
  const grayOk = Bb.join('') === B.join('');

  const block = (children: React.ReactNode) => (
    <div className={`rounded-xl border p-3 font-mono text-[12px] leading-relaxed ${t.soft} ${t.sub}`}>{children}</div>
  );

  const steps = [
    {
      label: lang === 'hi' ? '1-to-4 equations' : '1-to-4 equations',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? 'truth table से: हर output Yi उस minterm से gate हुआ D है जो उसे चुनता है। index को binary में पढ़कर सीधे minterm बनाइए।'
              : 'From the truth table: each output Yi is D gated by the minterm that selects it. Read the index in binary to write the minterm directly.'}
          </p>
          {block(<div className="space-y-1">{mt.map((m, i) => <div key={i}>{m}</div>)}</div>)}
          <p className={`text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? <>conservation: Y0+Y1+Y2+Y3 = D.(S1'S0' + S1'S0 + S1S0' + S1S0) = D.1 = D - पूरा D ठीक एक line पर जाता है।</>
              : <>Conservation: Y0+Y1+Y2+Y3 = D.(S1'S0' + S1'S0 + S1S0' + S1S0) = D.1 = D - all of D goes to exactly one line.</>}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'decoder = demux' : 'decoder = demux',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? 'enable E वाला 2-to-4 decoder देता है Di = E.minterm_i. E को 0 करिए तो सारे outputs 0; E = 1 पर सिर्फ़ addressed line high.'
              : 'A 2-to-4 decoder with enable E gives Di = E.minterm_i. With E = 0 all outputs are 0; with E = 1 only the addressed line is high.'}
          </p>
          {block(
            <div className="space-y-1">
              <div>{mono('Di = E . minterm_i', accent)}</div>
              <div>{lang === 'hi' ? 'अब E := D रखिए:' : 'now set E := D:'}</div>
              <div>{mono('Di = D . minterm_i = Yi', ACC.good)}</div>
            </div>)}
          <p className={`text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'term-दर-term demux के बराबर। वही silicon - बस enable pin को data कहा।'
              : 'Term for term equal to the demux. Same silicon - the enable pin just renamed data.'}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'inverse 4-to-1 MUX' : 'inverse 4-to-1 MUX',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? 'वही चार minterms, पर fan-IN की तरह: हर input अपने minterm से gate होकर एक OR में जुड़ता है।'
              : 'The same four minterms, but used as a fan-IN: each input is gated by its minterm and summed into one OR.'}
          </p>
          {block(<div>{mono("Y = S1'.S0'.I0 + S1'.S0.I1 + S1.S0'.I2 + S1.S0.I3", accent)}</div>)}
          <p className={`text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'demux वही minterm array fan-OUT करता है (Yi = D.m_i); mux उन्हें fan-IN के बाद OR करता है।'
              : 'The demux fans the same minterm array OUT (Yi = D.m_i); the mux sums them with one OR after fan-IN.'}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'NAND से सब कुछ' : 'all from NAND',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? 'demux सिर्फ़ inverters + AND gates है, और दोनों NAND से बनते हैं, तो पूरा demux एक NAND-only fabric पर बनता है।'
              : 'A demux is just inverters + AND gates, and both come from NAND, so the whole demux maps onto a NAND-only fabric.'}
          </p>
          {block(
            <div className="space-y-1">
              <div>{mono('NOT a = NAND(a,a)', accent)} {lang === 'hi' ? '[1 NAND]' : '[1 NAND]'}</div>
              <div>{mono('AND(a,b) = NOT(NAND(a,b))', accent)} {lang === 'hi' ? '[2 NAND]' : '[2 NAND]'}</div>
              <div>{mono("OR(a,b) = NAND(a', b')", accent)} {lang === 'hi' ? '[3 NAND]' : '[3 NAND]'}</div>
            </div>)}
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Shannon expansion' : 'Shannon expansion',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? "किसी भी function को एक variable के बारे में खोलिए: F = x'.F0 + x.F1, जहाँ F0 = F|x=0 और F1 = F|x=1."
              : "Expand any function about one variable: F = x'.F0 + x.F1, where F0 = F|x=0 and F1 = F|x=1."}
          </p>
          {block(
            <div className="space-y-1">
              <div>{mono("F(x, rest) = x'.F0 + x.F1", accent)}</div>
              <div>{lang === 'hi' ? '2-to-1 MUX: S = x, I0 = F0, I1 = F1 -> Y = F' : '2-to-1 MUX: S = x, I0 = F0, I1 = F1 -> Y = F'}</div>
            </div>)}
          <p className={`text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'demux वही minterm decode का routing dual है, तो एक MUX/DEMUX जोड़ी कोई भी function लागू कर सकती है।'
              : 'The demux is the routing dual of the same minterm decode, so a MUX/DEMUX pair can implement any function.'}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Gray + priority encoder' : 'Gray + priority encoder',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? 'साथी code-routing logic। Binary->Gray: MSB copy, बाक़ी Gi = B(i+1) ^ Bi. Gray->Binary: cascaded XOR।'
              : 'Companion code-routing logic. Binary->Gray: copy the MSB, then Gi = B(i+1) ^ Bi. Gray->Binary: a cascaded XOR chain.'}
          </p>
          {block(
            <div className="space-y-1">
              <div>B = 1011 {'->'} G = {mono(G.join(''), accent)} {'->'} {lang === 'hi' ? 'वापस' : 'back'} B = {mono(Bb.join(''), grayOk ? ACC.good : ACC.off)} {grayOk ? '(ok)' : '(!)'}</div>
              <div>{mono('A1 = D3 + D2', accent)} , {mono("A0 = D3 + D1.D2'", accent)} , {mono('V = D3+D2+D1+D0', accent)}</div>
            </div>)}
          <p className={`text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? "priority encoder के don't-cares 'highest index wins' लागू करते हैं और K-map घटाते हैं।"
              : "The priority encoder's don't-cares implement 'highest index wins' and shrink the K-map to these terms."}
          </p>
        </div>
      ),
    },
  ];

  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.55) ? 'PART II · THE LOGIC'
      : i < n - 2 ? 'PART III · BUILD IT'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (/whatdoes|what a/.test(key)) return 'courier';
  if (/sizing/.test(key)) return 'sizing';
  if (/routing/.test(key)) return 'routing';
  if (/onetotwo|1-to-2/.test(key)) return 'onetotwo';
  if (/onetofour|1-to-4|build it/.test(key)) return 'onetofour';
  if (/truthview|truth table/.test(key)) return 'truth';
  if (/vsdecoder|decoder/.test(key)) return 'mirror';
  if (/proofs|derivations/.test(key)) return 'proofs';
  if (/build the demux|build the/.test(key)) return 'build';
  return null;
};

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="DEMUX · One Input, Many Lines" />;
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
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="DEMUX" tag="Practice · Demultiplexer" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'courier' && <CourierScene isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'sizing' && <DemuxViz isDarkMode={p.isDarkMode} accent={p.accent} outputs={8} />}
          {which === 'routing' && <DemuxViz isDarkMode={p.isDarkMode} accent={p.accent} outputs={4} />}
          {which === 'onetotwo' && <OneToTwoGates isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'onetofour' && <OneToFourBuild isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'truth' && <OneToFourBuild isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'mirror' && <MuxDemuxMirror isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'proofs' && <ProofsWalkthrough isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="demux-1to4"
              titleEN="Build the Demultiplexer (DEMUX) for real"
              titleHI="असली में Demultiplexer (DEMUX) बनाइए"
              bodyEN="Open the live workbench and wire the standard 1-to-4 demux from two inverters and four 3-input AND gates, then prove every truth-table row on real hardware."
              bodyHI="live workbench खोलिए और standard 1-to-4 demux को दो inverters तथा चार 3-input AND gates से wire कीजिए, फिर हर truth-table row असली hardware पर साबित कीजिए।" />
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
