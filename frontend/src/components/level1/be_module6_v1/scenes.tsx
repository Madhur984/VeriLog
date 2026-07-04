/**
 * BJT Construction & Operation (basic-electronics / be6) - "The Silicon Shopping Mall".
 * A tiny base current steers a huge collector current because the base is too thin
 * to absorb the crowd. Bespoke labs let the student feel each move: an alpha<->beta
 * linker, an Ie = Ic + Ib current split, and an NPN/PNP toggle. The output curves
 * and transistor symbols come from the shared analog kit; the KCL / alpha-beta proof
 * is walked step by step in a StepThrough. Every electrical value is computed here.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene, StepThrough,
  type SubScene,
} from '../_transistor/kit';
import { TransistorSymbol, OutputCurves, Slider } from '../_transistor/analog';
import type { SubPage } from '../_transistor/kit';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

// be6 video sources (see BUILD_SPEC): English cut not yet produced.
const SRC_EN: string | undefined = undefined;
const SRC_HI: string | undefined = '/videos/be6-bjt-construction-hi.mp4';

const ACC = { entrance: '#38bdf8', corridor: '#f59e0b', hall: '#34d399', warn: '#fb7185' };
const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : '-');
const ibFmt = (mA: number) => mA * 1000;                       // mA -> uA for display
const approxEq = (a: number, b: number) => Math.abs(a - b) < 1e-6;

/* ── bespoke: NPN vs PNP toggle (morph symbol + carriers + arrow) ── */
const NpnPnpToggle: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [pnp, setPnp] = useState(false);
  const kind = pnp ? 'pnp' : 'npn';
  const c = pnp ? ACC.warn : ACC.entrance;

  const rows = [
    {
      label: lang === 'hi' ? 'Architecture' : 'Architecture',
      npn: 'n - p - n', pnp: 'p - n - p',
    },
    {
      label: lang === 'hi' ? 'Majority carriers' : 'Majority carriers',
      npn: lang === 'hi' ? 'electrons' : 'electrons',
      pnp: lang === 'hi' ? 'holes' : 'holes',
    },
    {
      label: lang === 'hi' ? 'Minority carriers' : 'Minority carriers',
      npn: lang === 'hi' ? 'holes' : 'holes',
      pnp: lang === 'hi' ? 'electrons' : 'electrons',
    },
    {
      label: lang === 'hi' ? 'Emitter arrow' : 'Emitter arrow',
      npn: lang === 'hi' ? 'BAHAR (out)' : 'points OUT',
      pnp: lang === 'hi' ? 'ANDAR (in)' : 'points IN',
    },
    {
      label: lang === 'hi' ? 'Supply polarity' : 'Supply polarity',
      npn: '+Vcc on collector', pnp: '-Vcc on collector',
    },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
          {lang === 'hi' ? 'NPN <-> PNP toggle' : 'NPN <-> PNP toggle'}
        </span>
        <button onClick={() => setPnp((v) => !v)} className="rounded-lg px-4 py-1.5 font-mono text-sm font-black text-black active:scale-95"
          style={{ background: c }}>
          {kind.toUpperCase()}
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex justify-center">
          <motion.div key={kind} initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <TransistorSymbol kind={kind as any} accent={c} isDarkMode={isDarkMode} size={150} />
          </motion.div>
        </div>
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 border-b py-1.5" style={{ borderColor: `${c}22` }}>
              <span className={`font-mono text-[10px] uppercase tracking-wide ${t.faint}`}>{r.label}</span>
              <motion.span key={`${i}-${kind}`} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                className="font-mono text-[13px] font-black" style={{ color: c }}>{pnp ? r.pnp : r.npn}</motion.span>
            </div>
          ))}
        </div>
      </div>
      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {pnp
          ? (lang === 'hi'
            ? <>PNP: holes भारी काम करते हैं, arrow ANDAR की ओर, batteries उलटी। पर equations वही - <b style={{ color: c }}>Ie = Ic + Ib, Ic = beta*Ib</b>।</>
            : <>PNP: holes do the heavy lifting, the arrow points IN, the batteries flip. But the equations are identical - <b style={{ color: c }}>Ie = Ic + Ib, Ic = beta*Ib</b>.</>)
          : (lang === 'hi'
            ? <>NPN: electrons भारी काम करते हैं, arrow BAHAR की ओर (Not Pointing iN)। यही track का default device है।</>
            : <>NPN: electrons do the heavy lifting, the arrow points OUT (Not Pointing iN). This is the default device on the track.</>)}
      </p>
    </Card>
  );
};

/* ── bespoke: Ie = Ic + Ib current-split visual (the mall crowd splitting) ── */
const CurrentSplit: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [ie, setIe] = useState(2);     // mA emitter current
  const [alpha, setAlpha] = useState(0.98);
  // everything computed: Ic = alpha*Ie, Ib = Ie - Ic (KCL), beta = Ic/Ib
  const ic = alpha * ie;               // mA
  const ib = ie - ic;                  // mA (the tiny leftover)
  const ibUA = ib * 1000;              // uA
  const beta = ic / ib;                // = alpha/(1-alpha)

  // bar geometry (Ic dominant, Ib a sliver) - widths share the emitter total
  const icPct = alpha * 100;
  const ibPct = (1 - alpha) * 100;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Ie crowd बँटती है -> Ic + Ib' : 'The Ie crowd splits -> Ic + Ib'}
      </div>

      {/* the split as a single river that forks */}
      <div className="space-y-2">
        <div className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'Emitter river (Ie)' : 'Emitter river (Ie)'}</div>
        <div className="h-7 w-full overflow-hidden rounded-full" style={{ background: `${ACC.entrance}22` }}>
          <div className="flex h-full items-center justify-center font-mono text-[12px] font-black text-black"
            style={{ background: ACC.entrance, width: '100%' }}>Ie = {fmt(ie)} mA</div>
        </div>
        <div className="flex gap-2 pt-1">
          <motion.div className="h-7 overflow-hidden rounded-full" animate={{ width: `${icPct}%` }} style={{ background: ACC.hall }}>
            <div className="flex h-full items-center justify-center whitespace-nowrap px-2 font-mono text-[12px] font-black text-black">Ic = {fmt(ic)} mA</div>
          </motion.div>
          <motion.div className="flex h-7 min-w-[64px] items-center justify-center overflow-hidden rounded-full px-1" animate={{ width: `${ibPct}%` }}
            style={{ background: ACC.corridor }}>
            <span className="whitespace-nowrap font-mono text-[10px] font-black text-black">Ib = {fmt(ibUA, 0)} uA</span>
          </motion.div>
        </div>
        <div className="flex justify-between font-mono text-[10px]">
          <span style={{ color: ACC.hall }}>{lang === 'hi' ? 'hall तक (collector)' : 'to the hall (collector)'}</span>
          <span style={{ color: ACC.corridor }}>{lang === 'hi' ? 'corridor में (base)' : 'into the corridor (base)'}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Slider label="Ie" value={ie} min={0.5} max={10} step={0.5} unit="mA" onChange={setIe} accent={accent} isDarkMode={isDarkMode} display={fmt(ie, 1)} />
        <Slider label="alpha = Ic/Ie" value={alpha} min={0.90} max={0.995} step={0.005} onChange={setAlpha} accent={accent} isDarkMode={isDarkMode} display={fmt(alpha, 3)} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[12px]">
        <div className={`rounded-lg px-3 py-2 text-center ${t.soft}`}>Ic = <b style={{ color: ACC.hall }}>{fmt(ic)} mA</b></div>
        <div className={`rounded-lg px-3 py-2 text-center ${t.soft}`}>Ib = <b style={{ color: ACC.corridor }}>{fmt(ibUA, 0)} uA</b></div>
        <div className={`rounded-lg px-3 py-2 text-center ${t.soft}`}>beta = <b style={{ color: accent }}>{fmt(beta, 0)}</b></div>
      </div>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>KCL: <b style={{ color: accent }}>Ie = Ic + Ib</b>. alpha को 1 की ओर बढ़ाइए, Ib की sliver सिकुड़ती है और beta फूट पड़ता है (beta = alpha/(1-alpha)).</>
          : <>KCL: <b style={{ color: accent }}>Ie = Ic + Ib</b>. Push alpha toward 1 and the Ib sliver shrinks while beta explodes (beta = alpha/(1-alpha)).</>}
      </p>
    </Card>
  );
};

/* ── bespoke: alpha <-> beta linker (coupled, both directions) ── */
const AlphaBetaLinker: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  // single source of truth = beta; alpha is derived (and vice-versa on drag)
  const [beta, setBeta] = useState(100);
  const alpha = beta / (beta + 1);                 // alpha = beta/(beta+1)
  const setAlpha = (a: number) => {
    const clamped = Math.min(0.999, Math.max(0.5, a));
    setBeta(clamped / (1 - clamped));              // beta = alpha/(1-alpha)
  };

  // bar showing how close alpha sits to unity
  const alphaPct = alpha * 100;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'alpha <-> beta linker' : 'alpha <-> beta linker'}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <Slider label="beta = Ic/Ib" value={beta} min={5} max={500} step={5} onChange={setBeta} accent={ACC.entrance} isDarkMode={isDarkMode} display={fmt(beta, 0)} />
          <Slider label="alpha = Ic/Ie" value={alpha} min={0.5} max={0.999} step={0.001} onChange={setAlpha} accent={ACC.hall} isDarkMode={isDarkMode} display={fmt(alpha, 3)} />
        </div>
        <div className="space-y-2 font-mono text-[12px]">
          <div className={`rounded-lg px-3 py-2 ${t.soft}`}>alpha = beta/(beta+1) = <b style={{ color: ACC.hall }}>{fmt(alpha, 3)}</b></div>
          <div className={`rounded-lg px-3 py-2 ${t.soft}`}>beta = alpha/(1-alpha) = <b style={{ color: ACC.entrance }}>{fmt(beta, 1)}</b></div>
          <div className={`mt-2 ${t.faint} text-[10px] uppercase tracking-wider`}>{lang === 'hi' ? 'alpha unity के कितने पास' : 'how close alpha is to unity'}</div>
          <div className="h-4 w-full overflow-hidden rounded-full" style={{ background: `${ACC.hall}22` }}>
            <motion.div className="h-full" animate={{ width: `${alphaPct}%` }} style={{ background: ACC.hall }} />
          </div>
        </div>
      </div>
      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? 'दोनों sliders जुड़े हैं: एक हिलाइए, दूसरा खुद बदलता है। alpha को 1 की ओर ले जाइए और beta फट पड़ता है - यही current amplification है।'
          : 'The two sliders are coupled: move one and the other follows. Nudge alpha toward 1 and beta blows up - that is current amplification.'}
      </p>
    </Card>
  );
};

/* ── proof walk-through: KCL + alpha/beta definitions + conversion ──
   Every algebra step is shown, and the closing worked example computes its
   numbers live (Ie, Ic, Ib, alpha, beta) so no result is ever hardcoded. */
const GainProof: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const mono = (s: string, c = accent) => <span className="font-mono font-black" style={{ color: c }}>{s}</span>;

  // worked numbers computed live (never hardcoded). Pick a representative Ic, Ib.
  const Ic = 1.98;                 // mA (collector current)
  const Ib = 0.02;                 // mA (base current = 20 uA)
  const Ie = Ic + Ib;             // mA, from KCL: Ie = Ic + Ib
  const alphaN = Ic / Ie;         // alpha = Ic/Ie
  const betaN = Ic / Ib;          // beta  = Ic/Ib
  const alphaFromBeta = betaN / (betaN + 1);   // cross-check alpha = beta/(beta+1)
  const betaFromAlpha = alphaN / (1 - alphaN); // cross-check beta  = alpha/(1-alpha)
  const line = (s: string, c = accent) => <div className="font-mono text-[13px] font-black" style={{ color: c }}>{s}</div>;

  const steps = [
    {
      label: lang === 'hi' ? 'Step 1 - KCL: transistor एक node' : 'Step 1 - KCL: the transistor as one node',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] leading-relaxed ${t.sub}`}>
            {lang === 'hi'
              ? <>BJT को एक ही node मानिए जिसके तीन तार हैं - E, B, C। अंदर जाने वाली कुल current = बाहर जाने वाली कुल current (charge conserve होता है)। emitter पर current अंदर जाती है; collector और base पर बाहर निकलती है।</>
              : <>Treat the whole BJT as one node with three wires - E, B, C. Total current in equals total current out, because charge is conserved. Current goes IN at the emitter and comes OUT at the collector and base.</>}
          </p>
          <div className={`rounded-xl px-4 py-3 ${t.soft} space-y-1`}>
            {line('current in  =  current out')}
            {line('Ie  =  Ic + Ib')}
          </div>
          <p className={`text-[13px] ${t.faint}`}>
            {lang === 'hi'
              ? <>यह हर region में, हर वक़्त सच है। चूँकि लगभग सारे carriers collector तक पहुँचते हैं, {mono('Ic')} सबसे बड़ी है और {mono('Ib')} सबसे छोटी।</>
              : <>This holds in every region, at all times. Since nearly all carriers reach the collector, {mono('Ic')} is the largest and {mono('Ib')} is the smallest.</>}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Step 2 - alpha और beta की परिभाषा' : 'Step 2 - define alpha and beta',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] leading-relaxed ${t.sub}`}>
            {lang === 'hi'
              ? <>common-base gain {mono('alpha')} वह हिस्सा है जो collect होता है, और common-emitter gain {mono('beta')} बताती है कि Ic, Ib से कितनी गुना बड़ी है।</>
              : <>The common-base gain {mono('alpha')} is the fraction that gets collected, and the common-emitter gain {mono('beta')} tells how many times bigger Ic is than Ib.</>}
          </p>
          <div className={`rounded-xl px-4 py-3 ${t.soft} space-y-1`}>
            {line('alpha = Ic / Ie     (< 1, since Ic < Ie)', ACC.hall)}
            {line('beta  = Ic / Ib     (so Ic = beta * Ib)', ACC.entrance)}
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Step 3 - Ib को Ic के पदों में लिखो' : 'Step 3 - write Ib in terms of Ic',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] leading-relaxed ${t.sub}`}>
            {lang === 'hi'
              ? <>{mono('beta = Ic/Ib')} को पलटिए और KCL में रखिए। हर पद में {mono('Ic')} समान है।</>
              : <>Rearrange {mono('beta = Ic/Ib')} and substitute into KCL. Every term shares a common {mono('Ic')}.</>}
          </p>
          <div className={`rounded-xl px-4 py-3 ${t.soft} space-y-1`}>
            {line('beta = Ic / Ib   =>   Ib = Ic / beta')}
            {line('Ie = Ic + Ib = Ic + Ic/beta')}
            {line('Ie = Ic * (1 + 1/beta) = Ic * (beta + 1) / beta')}
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Step 4 - alpha = beta/(beta+1)' : 'Step 4 - form alpha = beta/(beta+1)',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] leading-relaxed ${t.sub}`}>
            {lang === 'hi'
              ? <>अब {mono('alpha = Ic/Ie')} में Step 3 का {mono('Ie')} रखिए। {mono('Ic')} ऊपर-नीचे cancel हो जाता है।</>
              : <>Now put the {mono('Ie')} from Step 3 into {mono('alpha = Ic/Ie')}. The {mono('Ic')} cancels top and bottom.</>}
          </p>
          <div className={`rounded-xl px-4 py-3 ${t.soft} space-y-1`}>
            {line('alpha = Ic / Ie = Ic / [ Ic * (beta+1)/beta ]')}
            {line('alpha = beta / (beta + 1)', ACC.hall)}
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Step 5 - उल्टा: beta = alpha/(1-alpha)' : 'Step 5 - invert: beta = alpha/(1-alpha)',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] leading-relaxed ${t.sub}`}>
            {lang === 'hi'
              ? <>Step 4 को beta के लिए हल कीजिए। cross-multiply करके पदों को इकट्ठा कीजिए।</>
              : <>Solve Step 4 for beta. Cross-multiply, then gather the beta terms.</>}
          </p>
          <div className={`rounded-xl px-4 py-3 ${t.soft} space-y-1`}>
            {line('alpha = beta/(beta+1)  =>  alpha*(beta+1) = beta')}
            {line('alpha*beta + alpha = beta')}
            {line('alpha = beta - alpha*beta = beta*(1 - alpha)')}
            {line('beta = alpha / (1 - alpha)', ACC.entrance)}
          </div>
          <p className={`text-[13px] ${t.faint}`}>
            {lang === 'hi'
              ? <>जाँच: जैसे {mono('alpha -> 1')}, denominator {'->'} 0 तो {mono('beta -> infinity')} (छोटी Ib, विशाल Ic)। यही amplification का गणित है।</>
              : <>Check: as {mono('alpha -> 1')}, the denominator {'->'} 0 so {mono('beta -> infinity')} (tiny Ib, huge Ic). That is amplification in maths.</>}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Step 6 - संख्याओं से जाँच' : 'Step 6 - check with real numbers',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] leading-relaxed ${t.sub}`}>
            {lang === 'hi'
              ? <>मान लीजिए {mono(`Ic = ${fmt(Ic)} mA`, ACC.hall)} और {mono(`Ib = ${fmt(ibFmt(Ib), 0)} uA`, ACC.corridor)}। बाक़ी सब ऊपर के formulas से निकलता है:</>
              : <>Suppose {mono(`Ic = ${fmt(Ic)} mA`, ACC.hall)} and {mono(`Ib = ${fmt(ibFmt(Ib), 0)} uA`, ACC.corridor)}. Everything else follows from the formulas above:</>}
          </p>
          <div className={`rounded-xl px-4 py-3 ${t.soft} space-y-1`}>
            {line(`Ie = Ic + Ib = ${fmt(Ic)} + ${fmt(Ib)} = ${fmt(Ie)} mA`)}
            {line(`alpha = Ic/Ie = ${fmt(Ic)}/${fmt(Ie)} = ${fmt(alphaN, 4)}`, ACC.hall)}
            {line(`beta  = Ic/Ib = ${fmt(Ic)}/${fmt(Ib)} = ${fmt(betaN, 1)}`, ACC.entrance)}
            {line(`cross-check: beta/(beta+1) = ${fmt(alphaFromBeta, 4)} = alpha  ${approxEq(alphaFromBeta, alphaN) ? 'OK' : ''}`, ACC.hall)}
            {line(`cross-check: alpha/(1-alpha) = ${fmt(betaFromAlpha, 1)} = beta  ${approxEq(betaFromAlpha, betaN) ? 'OK' : ''}`, ACC.entrance)}
          </div>
          <p className={`text-[13px] ${t.faint}`}>
            {lang === 'hi'
              ? <>दोनों conversions वही उत्तर देते हैं - alpha और beta एक ही device के दो रूप हैं।</>
              : <>Both conversions return the same answer - alpha and beta are two faces of one device.</>}
          </p>
        </div>
      ),
    },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Proof: KCL से alpha-beta तक' : 'Proof: from KCL to alpha-beta'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ── small inline region matrix for the operating-regions scene ── */
const RegionMatrix: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const rows = [
    { r: 'Active', ebj: lang === 'hi' ? 'Forward' : 'Forward', cbj: lang === 'hi' ? 'Reverse' : 'Reverse', app: lang === 'hi' ? 'Linear amplifier' : 'Linear amplifier', col: ACC.hall },
    { r: 'Saturation', ebj: 'Forward', cbj: 'Forward', app: lang === 'hi' ? 'Closed switch (ON)' : 'Closed switch (ON)', col: ACC.warn },
    { r: 'Cut-off', ebj: 'Reverse', cbj: 'Reverse', app: lang === 'hi' ? 'Open switch (OFF)' : 'Open switch (OFF)', col: ACC.entrance },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 grid grid-cols-4 gap-2 font-mono text-[10px] uppercase tracking-wide" style={{ color: accent }}>
        <span>{lang === 'hi' ? 'Region' : 'Region'}</span><span>EBJ bias</span><span>CBJ bias</span><span>{lang === 'hi' ? 'काम' : 'Application'}</span>
      </div>
      {rows.map((row) => (
        <div key={row.r} className="grid grid-cols-4 items-center gap-2 border-t py-2.5 font-mono text-[12px]" style={{ borderColor: `${row.col}22` }}>
          <span className="font-black" style={{ color: row.col }}>{row.r}</span>
          <span className={t.sub}>{row.ebj}</span>
          <span className={t.sub}>{row.cbj}</span>
          <span className={t.sub}>{row.app}</span>
        </div>
      ))}
      <p className={`mt-3 text-center text-[12px] ${t.faint}`}>
        {lang === 'hi' ? 'दो junctions, चार में से तीन उपयोगी cases - mall के दरवाज़े steer / दोनों खुले / दोनों locked।' : 'Two junctions, three useful of four cases - mall doors steer / both open / both locked.'}
      </p>
    </Card>
  );
};

/* ── sources list for the recap (proofs.sources) ── */
const SOURCES: { label: string; url: string }[] = [
  { label: 'MIT OpenCourseWare 6.071J - BJT Circuits (region table)', url: 'https://ocw.mit.edu/courses/6-071j-introduction-to-electronics-signals-and-measurement-spring-2006/50a8dea3a2f850d40c9333fefa2db6f1_20_bjt_2.pdf' },
  { label: 'Engineering LibreTexts (Fiore) - Voltage Divider Bias', url: 'https://eng.libretexts.org/Bookshelves/Electrical_Engineering/Electronics/Semiconductor_Devices_-_Theory_and_Application_(Fiore)/05:_BJT_Biasing/5.4:_Voltage_Divider_Bias' },
  { label: 'Basic Electronics Tutorials - The BJT (Ie=Ic+Ib, alpha, beta)', url: 'https://www.electronics-tutorials.ws/transistor/tran_1.html' },
  { label: 'Georgia Tech (Leach, ECE 3050) - BJT/device notes', url: 'https://leachlegacy.ece.gatech.edu/ece3050/notes/bjt/BJTBasicsSu10.pdf' },
  { label: 'Basic Electronics Tutorials - Transistor Biasing (re model)', url: 'https://www.electronics-tutorials.ws/amplifier/transistor-biasing.html' },
];

const SourcesList: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Sources (proof references)' : 'Sources (proof references)'}
      </div>
      <ul className="space-y-2">
        {SOURCES.map((s) => (
          <li key={s.url} className="flex items-start gap-2">
            <span style={{ color: accent }}>-</span>
            <a href={s.url} target="_blank" rel="noreferrer" className={`text-[13px] underline decoration-dotted underline-offset-2 ${t.sub}`}>{s.label}</a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

/* ── routing: which bespoke visuals belong on which theory scene ── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE MALL'
    : i <= Math.floor(n * 0.6) ? 'PART II · THE PHYSICS'
      : i < n - 2 ? 'PART III · THE GAIN'
        : 'PART IV · LOCK IT IN';

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="BJT · The Silicon Mall" heroKind="npn" />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} srcEN={SRC_EN} srcHI={SRC_HI} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3"><Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}</section>
          <div className="mb-2"><TryItYourself label="Flip the cards" /></div>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => (
        <SceneShell>
          <div className="mb-2"><TryItYourself label="Take the quiz" /></div>
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="THE MALL" tag="Practice · BJT Construction" title={scene.label} intro={scene.subtitle ?? ''} />
        </SceneShell>
      );
    case 'recap':
      return (p) => (
        <RecapScene {...p} scene={scene}>
          <SourcesList isDarkMode={p.isDarkMode} accent={p.accent} />
        </RecapScene>
      );
    default: {
      const key = `${scene.id} ${scene.label}`.toLowerCase();
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {/* NPN vs PNP toggle */}
          {/npn|pnp|dichotomy/.test(key) && <NpnPnpToggle isDarkMode={p.isDarkMode} accent={p.accent} />}
          {/* depletion / junction engine - show both symbol + a forward/reverse note via current split is not ideal; use symbol */}
          {/junction|depletion|bias engine/.test(key) && (
            <Card isDarkMode={p.isDarkMode} className="text-center">
              <div className="flex justify-center"><TransistorSymbol kind="npn" accent={p.accent} isDarkMode={p.isDarkMode} size={140} /></div>
              <p className={`mt-3 text-[13px] ${tone(p.isDarkMode).sub}`}>
                EBJ forward (narrow depletion, crowd floods in) + CBJ reverse (wide depletion, swept onward) = active mode.
              </p>
            </Card>
          )}
          {/* carrier flow + KCL: the current split */}
          {/carrier|kirchhoff|current law/.test(key) && (
            <div className="space-y-4">
              <Card isDarkMode={p.isDarkMode} className="text-center">
                <div className="flex justify-center"><TransistorSymbol kind="npn" accent={p.accent} isDarkMode={p.isDarkMode} size={130} /></div>
              </Card>
              <CurrentSplit isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {/* three operating regions */}
          {/region/.test(key) && <RegionMatrix isDarkMode={p.isDarkMode} accent={p.accent} />}
          {/* output characteristics: the kit curves */}
          {/output|character|curve/.test(key) && <OutputCurves isDarkMode={p.isDarkMode} accent={p.accent} />}
          {/* alpha & beta: the coupled linker */}
          {/alpha|beta|amplification factor/.test(key) && <AlphaBetaLinker isDarkMode={p.isDarkMode} accent={p.accent} />}
          {/* synthesis: walk the proof */}
          {/synthesis|inevitab/.test(key) && (
            <div className="space-y-4">
              <CurrentSplit isDarkMode={p.isDarkMode} accent={p.accent} />
              <GainProof isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
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
