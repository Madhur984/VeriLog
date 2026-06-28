/**
 * Universal Logic & Shannon (dsd/26) - "The Swiss Army Knife & The Traffic
 * Intersection".
 * Generic scenes come from the shared _subtractor kit; the NAND/NOR foldout
 * panels, the gate-level OR-from-NAND schematic, the Shannon derivation +
 * two-case proof step-through, and the MUX-tree sizer are bespoke. The two
 * interactive blocks - NandUniversal and ShannonExpander - come from _combo.
 * Every boolean/arithmetic value is COMPUTED in code, never hardcoded.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import { ShannonExpander, NandUniversal } from '../_combo/blocks';
import type { SubPage } from '../_subtractor/SubEngine';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/dsd26-shannon-en.mp4';
const SRC_HI: string | undefined = undefined;
void SRC_HI; // single-src VideoScene; HI cut not wired yet

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399', knife: '#a78bfa' };

/* ───────── bespoke: gate-level OR = NAND(A',B') (S04) ─────────
   Two NAND-inverters make A' and B'; a third (drawn OR via DeMorgan) outputs
   A + B. Toggle A and B; every value is computed from a, b in code. */
const OrFromNand: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const nand = (p: number, q: number) => (p & q) ^ 1;
  const ia = nand(a, a);          // A'
  const ib = nand(b, b);          // B'
  const Y = nand(ia, ib);         // (A'.B')' = A + B
  const ok = Y === (a | b);

  const Toggle: React.FC<{ v: number; set: () => void; label: string; color: string }> = ({ v, set, label, color }) => (
    <button onClick={set} className="flex flex-col items-center gap-1 active:scale-90">
      <span className="font-mono text-[11px] font-bold" style={{ color }}>{label}</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-lg font-black"
        style={{ background: v ? color : 'transparent', color: v ? '#000' : color, border: `2px solid ${color}${v ? '' : '66'}` }}>{v}</span>
    </button>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? "gate-level: OR = NAND(A',B')" : "gate-level: OR = NAND(A',B')"}
      </div>

      <div className="flex items-center justify-center gap-5">
        <div className="flex flex-col gap-4">
          <Toggle v={a} set={() => setA((x) => x ^ 1)} label="A" color={ACC.I} />
          <Toggle v={b} set={() => setB((x) => x ^ 1)} label="B" color={ACC.III} />
        </div>

        {/* two NAND-inverters -> A', B' */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center">
            <span className={`font-mono text-[10px] ${t.faint}`}>NAND(A,A) = A'</span>
            <LiveGate type="NOT" a={a} isDarkMode={isDarkMode} accent={accent} labelOut="A'" colorOut={ACC.II} />
          </div>
          <div className="flex flex-col items-center">
            <span className={`font-mono text-[10px] ${t.faint}`}>NAND(B,B) = B'</span>
            <LiveGate type="NOT" a={b} isDarkMode={isDarkMode} accent={accent} labelOut="B'" colorOut={ACC.II} />
          </div>
        </div>

        {/* the bubbled-input NAND = OR */}
        <div className="flex flex-col items-center">
          <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? "NAND(A',B') = A+B" : "NAND(A',B') = A+B"}</span>
          <LiveGate type="OR" a={ia} b={ib} isDarkMode={isDarkMode} accent={accent} labelA="A'" labelB="B'" labelOut="Y" colorOut={ACC.good} />
        </div>
      </div>

      <div className="mt-4 text-center font-mono text-[13px]" style={{ color: ok ? ACC.good : ACC.III }}>
        ({a}'.{b}')' = ({ia}.{ib})' = <b>{Y}</b> {' '} {ok ? '=' : '!='} {' '} A + B = {a | b} {ok ? '✓' : '✗'}
      </div>
      <p className={`mt-2 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'दो NAND inputs को invert करते हैं, तीसरा NAND उन्हें मिलाता है - bubbles input wires पर सरक आते हैं और AND, OR बन जाता है (DeMorgan)।'
          : 'Two NANDs invert the inputs, a third NAND combines them - the bubbles slide onto the input wires and AND becomes OR (DeMorgan).'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: NOR dual foldout (S05) ─────────
   Same idea as the _combo NandUniversal block but for NOR. NOT(1), OR(2),
   AND(3); each value computed from a,b; checked against the standard gate. */
const NorUniversal: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const nor = (p: number, q: number) => (p | q) ^ 1;
  const NOT = nor(a, a);                       // (a+a)' = a'
  const OR = nor(nor(a, b), nor(a, b));        // ((a+b)')' = a+b
  const AND = nor(nor(a, a), nor(b, b));       // (a'+b')' = a.b
  const rows = [
    { name: "NOT a", build: 'a NOR a', val: NOT, check: a ^ 1, gates: 1 },
    { name: 'a OR b', build: '(a NOR b) NOR (a NOR b)', val: OR, check: a | b, gates: 2 },
    { name: 'a AND b', build: '(a NOR a) NOR (b NOR b)', val: AND, check: a & b, gates: 3 },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'NOR = दूसरा Swiss-army blade' : 'NOR = the second Swiss-army blade'}
      </div>
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setA((v) => v ^ 1)} className="flex flex-col items-center gap-1 active:scale-90">
          <span className="font-mono text-[11px] font-bold" style={{ color: ACC.I }}>a</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-lg font-black" style={{ background: a ? ACC.I : 'transparent', color: a ? '#000' : ACC.I, border: `2px solid ${ACC.I}${a ? '' : '66'}` }}>{a}</span>
        </button>
        <button onClick={() => setB((v) => v ^ 1)} className="flex flex-col items-center gap-1 active:scale-90">
          <span className="font-mono text-[11px] font-bold" style={{ color: ACC.III }}>b</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-lg font-black" style={{ background: b ? ACC.III : 'transparent', color: b ? '#000' : ACC.III, border: `2px solid ${ACC.III}${b ? '' : '66'}` }}>{b}</span>
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.name} className={`flex items-center justify-between gap-2 rounded-lg border p-2 ${t.soft}`}>
            <div>
              <div className="font-mono text-[12px] font-black" style={{ color: accent }}>{r.name} <span className={t.faint}>· {r.gates} {r.gates === 1 ? 'gate' : 'gates'}</span></div>
              <div className={`font-mono text-[10px] ${t.faint}`}>{r.build}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-base font-black" style={{ background: r.val ? accent : 'transparent', color: r.val ? '#000' : accent, border: `1.5px solid ${accent}66` }}>{r.val}</span>
              <span className="font-mono text-[12px]" style={{ color: r.val === r.check ? ACC.good : ACC.III }}>{r.val === r.check ? '✓' : '✗'}</span>
            </div>
          </div>
        ))}
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? "NAND के दर्पण में: NOR के साथ सस्ता क्रम NOT, OR, AND है - AND और OR जगह बदल लेते हैं।"
          : 'Mirror of NAND: with NOR the cheap order is NOT, OR, AND - the AND and OR swap places.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: Shannon derivation + proof (StepThrough, S07) ─────────
   Computes cofactors of F = w1.w2 + w1.w3 + w2.w3 about w1 over all 4 (w2,w3)
   rows, then proves F = x'.F0 + x.F1 by the two binary cases. */
const ShannonDerivation: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);

  // F(w1,w2,w3) = w1.w2 + w1.w3 + w2.w3, computed truth values
  const F = (w1: number, w2: number, w3: number) => ((w1 & w2) | (w1 & w3) | (w2 & w3));
  // cofactors as functions of (w2,w3)
  const F0row = (w2: number, w3: number) => F(0, w2, w3); // w1=0 -> expect w2.w3
  const F1row = (w2: number, w3: number) => F(1, w2, w3); // w1=1 -> expect w2+w3
  const combos = [[0, 0], [0, 1], [1, 0], [1, 1]] as const;

  const MiniTable: React.FC<{ title: string; fn: (w2: number, w3: number) => number; expectLabel: string }> = ({ title, fn, expectLabel }) => (
    <div className={`rounded-xl border p-3 ${t.soft}`}>
      <div className="mb-1 text-center font-mono text-[11px] font-black" style={{ color: accent }}>{title}</div>
      <table className="mx-auto font-mono text-[12px]">
        <thead><tr className={t.faint}><th className="px-2">w2</th><th className="px-2">w3</th><th className="px-2" style={{ color: accent }}>=</th></tr></thead>
        <tbody>
          {combos.map(([w2, w3]) => (
            <tr key={`${w2}${w3}`}>
              <td className="px-2 text-center">{w2}</td>
              <td className="px-2 text-center">{w3}</td>
              <td className="px-2 text-center font-black" style={{ color: fn(w2, w3) ? ACC.good : t.faint as string }}>{fn(w2, w3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`mt-1 text-center font-mono text-[11px] ${t.sub}`}>{expectLabel}</div>
    </div>
  );

  const steps = [
    {
      label: lang === 'hi' ? 'function लिखिए' : 'State the function',
      body: (
        <div className="space-y-3 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'एक 3-input majority-शैली function, w1 के बारे में expand कीजिए।' : 'A 3-input majority-style function, to be expanded about w1.'}</p>
          <div className="font-mono text-lg font-black" style={{ color: accent }}>F = w1.w2 + w1.w3 + w2.w3</div>
        </div>
      ),
    },
    {
      label: 'w1 = 0',
      body: (
        <div className="space-y-3">
          <p className={`text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? "w1 = 0 रखिए: w1 वाले terms ग़ायब, बचा negative cofactor F0।" : 'Set w1 = 0: the w1 terms vanish, leaving the negative cofactor F0.'}</p>
          <div className="text-center font-mono text-[14px]">F0 = 0.w2 + 0.w3 + w2.w3 = <b style={{ color: ACC.good }}>w2.w3</b></div>
          <MiniTable title="F0 = F|w1=0" fn={F0row} expectLabel={lang === 'hi' ? 'यह बिलकुल w2.w3 है (बाईं सड़क)' : 'this is exactly w2.w3 (left road)'} />
        </div>
      ),
    },
    {
      label: 'w1 = 1',
      body: (
        <div className="space-y-3">
          <p className={`text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? "w1 = 1 रखिए: absorption से positive cofactor F1 सरल होता है।" : 'Set w1 = 1: absorption simplifies the positive cofactor F1.'}</p>
          <div className="text-center font-mono text-[14px]">F1 = w2 + w3 + w2.w3 = <b style={{ color: ACC.good }}>w2 + w3</b></div>
          <MiniTable title="F1 = F|w1=1" fn={F1row} expectLabel={lang === 'hi' ? 'यह बिलकुल w2 + w3 है (दाईं सड़क)' : 'this is exactly w2 + w3 (right road)'} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'फिर जोड़िए' : 'Recombine',
      body: (
        <div className="space-y-3 text-center">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi' ? 'Shannon से वापस जोड़िए और मूल function फिर पाइए।' : 'Recombine with Shannon and recover the original function.'}</p>
          <div className="font-mono text-[15px] font-black" style={{ color: accent }}>F = w1'.(w2.w3) + w1.(w2 + w3)</div>
          <p className={`text-[12px] ${t.faint}`}>{lang === 'hi' ? 'वापस गुणा कीजिए -> w1.w2 + w1.w3 + w2.w3, बिलकुल मूल।' : 'Multiply back out -> w1.w2 + w1.w3 + w2.w3, exactly the original.'}</p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'सबूत (2 cases)' : 'Proof (2 cases)',
      body: (
        <div className="space-y-3">
          <p className={`text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? 'चूँकि x binary है, F = x\'.F0 + x.F1 को सिर्फ़ दो cases से साबित कीजिए।' : "Because x is binary, prove F = x'.F0 + x.F1 with just two cases."}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className={`rounded-xl border p-3 text-center font-mono text-[13px] ${t.soft}`} style={{ borderColor: `${ACC.good}44` }}>
              <div className="font-black" style={{ color: accent }}>x = 0</div>
              <div className="mt-1">1.F0 + 0.F1 = <b style={{ color: ACC.good }}>F0</b> = F ✓</div>
            </div>
            <div className={`rounded-xl border p-3 text-center font-mono text-[13px] ${t.soft}`} style={{ borderColor: `${ACC.good}44` }}>
              <div className="font-black" style={{ color: accent }}>x = 1</div>
              <div className="mt-1">0.F0 + 1.F1 = <b style={{ color: ACC.good }}>F1</b> = F ✓</div>
            </div>
          </div>
          <p className={`text-center text-[12px] ${t.sub}`}>{lang === 'hi' ? 'दोनों cases मिलते हैं, तो identity हर function के लिए सही है। QED.' : 'Both cases agree, so the identity holds for every function. QED.'}</p>
        </div>
      ),
    },
  ];

  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── bespoke: MUX-tree sizer (S09) ─────────
   Pick N = 2,4,8,16; compute select lines n = log2(N) and 2:1 count = 2^n - 1,
   and draw the per-stage breakdown (N/2 + N/4 + ... + 1). All computed. */
const MuxTreeSizer: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const SIZES = [2, 4, 8, 16] as const;
  const [N, setN] = useState<number>(8);
  const n = Math.log2(N);                       // select lines
  const total = N - 1;                           // 2^n - 1 two-to-one MUXes
  const stages = Array.from({ length: n }, (_, i) => N / (1 << (i + 1))); // N/2, N/4, ..., 1

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'MUX tree का आकार' : 'sizing the MUX tree'}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className={`font-mono text-[11px] ${t.faint}`}>N =</span>
        {SIZES.map((s) => (
          <button key={s} onClick={() => setN(s)} className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={N === s ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent }}>
            {s}:1
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
        <div className={`rounded-xl border p-3 ${t.soft}`}>
          <div className={`font-mono text-[10px] uppercase ${t.faint}`}>{lang === 'hi' ? 'select lines' : 'select lines'}</div>
          <div className="font-mono text-2xl font-black" style={{ color: ACC.II }}>{n}</div>
          <div className={`font-mono text-[10px] ${t.faint}`}>log2({N})</div>
        </div>
        <div className={`rounded-xl border p-3 ${t.soft}`}>
          <div className={`font-mono text-[10px] uppercase ${t.faint}`}>{lang === 'hi' ? '2:1 MUX count' : '2:1 MUX count'}</div>
          <div className="font-mono text-2xl font-black" style={{ color: accent }}>{total}</div>
          <div className={`font-mono text-[10px] ${t.faint}`}>2^{n} - 1</div>
        </div>
        <div className={`col-span-2 rounded-xl border p-3 sm:col-span-1 ${t.soft}`}>
          <div className={`font-mono text-[10px] uppercase ${t.faint}`}>{lang === 'hi' ? 'stages' : 'stages'}</div>
          <div className="font-mono text-2xl font-black" style={{ color: ACC.good }}>{n}</div>
          <div className={`font-mono text-[10px] ${t.faint}`}>{stages.join(' + ')} = {total}</div>
        </div>
      </div>

      {/* per-stage bracket */}
      <div className="mt-5 flex items-end justify-center gap-4">
        {stages.map((cnt, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="flex flex-col gap-1">
              {Array.from({ length: cnt }, (_, k) => (
                <motion.div key={k} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 + k * 0.02 }}
                  className="h-3 w-6 rounded-sm" style={{ background: accent }} />
              ))}
            </div>
            <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? `स्तर ${i + 1}` : `lvl ${i + 1}`}</span>
            <span className="font-mono text-[11px] font-black" style={{ color: accent }}>{cnt}</span>
          </div>
        ))}
      </div>
      <p className={`mt-4 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>एक {N}-to-1 MUX = <b style={{ color: accent }}>{total}</b> छोटे 2-to-1 MUXes, {n} stages में, {n} select lines से चलाए।</>
          : <>A {N}-to-1 MUX = <b style={{ color: accent }}>{total}</b> small 2-to-1 MUXes across {n} stages, driven by {n} select lines.</>}
      </p>
    </Card>
  );
};

/* ───────── small reference: gate-count summary table (S03) ───────── */
const GateCountTable: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  return (
    <TruthTable isDarkMode={isDarkMode} accent={accent}
      headers={['Gate', 'From NAND', 'Cost']}
      rows={[
        { cells: ['NOT', 'NAND(A,A)', '1'] },
        { cells: ['AND', '((A.B)\')\'', '2'], highlight: true },
        { cells: ['OR', "NAND(A',B')", '3'] },
      ]}
      note={lang === 'hi'
        ? 'हर blade सिर्फ़ NAND से बना - 1, 2, फिर 3 gates। {NOT, AND, OR} complete है, तो NAND universal है।'
        : 'Each blade from NAND only - 1, 2, then 3 gates. {NOT, AND, OR} is complete, so NAND is universal.'} />
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
  if (/foldout|out of nand/.test(key)) return 'nand';
  if (/gatelevel|gate-level/.test(key)) return 'orbuild';
  if (/nordual|nor is universal/.test(key)) return 'nor';
  if (/shannon's expansion|if-then-else/.test(key)) return 'shannon-intro';
  if (/derivation|proof/.test(key)) return 'derivation';
  if (/muxshannon|2-to-1 mux/.test(key)) return 'shannon-mux';
  if (/muxtree|mux tree/.test(key)) return 'tree';
  if (/build it for real/.test(key)) return 'build';
  return null;
};

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Universal Logic · One Tool for All" hero={<NandUniversal isDarkMode={p.isDarkMode} accent={p.accent} />} />;
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
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="UNIVERSAL LOGIC" tag="Practice · Universal Logic & Shannon" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => (
        <RecapScene {...p} scene={scene}>
          <Card isDarkMode={p.isDarkMode}>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest" style={{ color: p.accent }}>
              Sources
            </div>
            <ul className="space-y-2 text-[13px]">
              {[
                { label: 'CircuitVerse - Universal gates (NAND/NOR constructions)', url: 'https://learn.circuitverse.org/docs/comb-ssi/universal-gates.html' },
                { label: "Boole's expansion theorem (Wikipedia)", url: "https://en.wikipedia.org/wiki/Boole's_expansion_theorem" },
                { label: 'UW BEE271 - Multiplexers and Shannon expansion (PDF)', url: 'https://staff.washington.edu/kd1uj/BEE271/Lectures/BEE%20271%20Lecture%208%20-%20Multiplexers%20and%20Shannons%20expansion%20-%202017-04-19.pdf' },
                { label: 'GeeksforGeeks - Multiplexers in digital logic', url: 'https://www.geeksforgeeks.org/digital-logic/multiplexers-in-digital-logic/' },
              ].map((s) => (
                <li key={s.url} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: p.accent }} />
                  <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2 hover:opacity-80 break-all" style={{ color: p.accent }}>{s.label}</a>
                </li>
              ))}
            </ul>
          </Card>
        </RecapScene>
      );
    case 'build':
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          <NandUniversal isDarkMode={p.isDarkMode} accent={p.accent} />
          <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="nand-universal"
            titleEN="Build the Universal Logic & Shannon for real"
            titleHI="असली में Universal Logic & Shannon बनाइए"
            bodyEN="Open the live workbench, wire NOT, AND and OR from NAND only, then take the headline challenge - build XOR from 4 NANDs and prove the universality on real hardware."
            bodyHI="live workbench खोलिए, सिर्फ़ NAND से NOT, AND और OR wire कीजिए, फिर मुख्य चुनौती लीजिए - 4 NANDs से XOR बनाइए और असली hardware पर universality साबित कीजिए।" />
        </TheoryScene>
      );
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'nand' && (
            <div className="space-y-6">
              <NandUniversal isDarkMode={p.isDarkMode} accent={p.accent} />
              <GateCountTable isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'orbuild' && <OrFromNand isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'nor' && <NorUniversal isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'shannon-intro' && <ShannonExpander isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'derivation' && <ShannonDerivation isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'shannon-mux' && <ShannonExpander isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'tree' && <MuxTreeSizer isDarkMode={p.isDarkMode} accent={p.accent} />}
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
