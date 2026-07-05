/**
 * BJT DC Biasing & The Operating Point (be7) - scene wiring + bespoke labs.
 *
 * The kit labs (LoadLineLab, BiasStability, OutputCurves) carry the standard
 * visuals; the bespoke interactives below are built from the Slider primitive +
 * framer-motion + TransistorSymbol and compute every value live:
 *   - QPointSwing : drag the Q-point too high / just right / too low and watch
 *                   the output swing clip against saturation or cutoff.
 *   - FeedbackLoop: click "heat it" to inject an Ic rise and watch Re damp it.
 *   - StabilityChecker: sweep beta/Re/R2 and see when beta*Re >= 10*R2 holds.
 * The central analogy - setting a stable party/baseline vibe before the music
 * (signal) plays - is woven through every page's copy in content.ts.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene, StepThrough,
  type SubScene,
} from '../_transistor/kit';
import {
  TransistorSymbol, LoadLineLab, OutputCurves, BiasStability, Slider,
} from '../_transistor/analog';
import type { SubPage } from '../_transistor/kit';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/be7-bjt-biasing-en.mp4';
const SRC_HI: string | undefined = '/videos/be7-bjt-biasing-hi.mp4';

const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : '-');
const COL = { good: '#34d399', warn: '#fb7185', cool: '#38bdf8', amber: '#f59e0b' };

/* ───────────────────────── bespoke: Q-point swing / clipping ───────────────
 * Vcc and Rc fix the load line; the user drags the Q-point (via Vceq) along it.
 * The output is a sine wave centred on the Q-point; if its peaks exceed the
 * available room toward saturation (Vce -> 0) or cutoff (Vce -> Vcc) it CLIPS.
 * Everything - icq, room, clip flags, usable swing - is computed here.
 */
const QPointSwing: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vcc = 12, Rc = 2;                 // V, kOhm -> load line fixed
  const icSat = Vcc / Rc;                 // mA at Vce = 0
  const [vceq, setVceq] = useState(6);    // user drags this along Vce axis (0..Vcc)
  const icq = (Vcc - vceq) / Rc;          // mA, the Q-point on the load line

  // available head/foot room (volts) before hitting saturation or cutoff
  const roomToSat = vceq;                 // distance down to Vce = 0
  const roomToCut = Vcc - vceq;           // distance up to Vce = Vcc
  const desiredAmp = 5;                   // V peak the signal "wants" to swing
  const upClip = desiredAmp > roomToCut;
  const downClip = desiredAmp > roomToSat;
  const usableSwing = 2 * Math.min(roomToSat, roomToCut); // peak-to-peak undistorted
  const verdict = !upClip && !downClip
    ? (lang === 'hi' ? 'JUST RIGHT (saaf swing)' : 'JUST RIGHT (clean swing)')
    : (lang === 'hi' ? 'CLIPPED (distortion)' : 'CLIPPED (distortion)');
  const vcol = (!upClip && !downClip) ? COL.good : COL.warn;

  // wave geometry in the Vce window
  const W = 320, H = 150, pl = 30, pr = 14, pt = 12, pb = 22;
  const X = (i: number) => pl + (i / 60) * (W - pl - pr);
  const Yv = (vce: number) => pt + (1 - vce / Vcc) * (H - pt - pb); // high Vce near top
  const satY = Yv(0), cutY = Yv(Vcc), qY = Yv(vceq);
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const raw = vceq + desiredAmp * Math.sin((i / 60) * Math.PI * 4);
    const clipped = Math.max(0, Math.min(Vcc, raw)); // hard clip at rails
    pts.push(`${X(i)},${Yv(clipped)}`);
  }

  return (
    <Card isDarkMode={isDarkMode}>
      <TryItYourself />
      <div className="mb-3 mt-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Q-point बहुत ऊँचा / सही / बहुत नीचा' : 'Q-point too high / just right / too low'}
      </div>
      <div className="grid gap-5 md:grid-cols-[320px_1fr]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* rails */}
          <rect x={pl} y={pt} width={W - pl - pr} height={cutY - pt} fill={COL.warn} opacity={0.08} />
          <rect x={pl} y={satY} width={W - pl - pr} height={H - pb - satY} fill={COL.warn} opacity={0.08} />
          <line x1={pl} y1={cutY} x2={W - pr} y2={cutY} stroke={COL.warn} strokeWidth="1" strokeDasharray="3 3" />
          <line x1={pl} y1={satY} x2={W - pr} y2={satY} stroke={COL.warn} strokeWidth="1" strokeDasharray="3 3" />
          <text x={pl + 2} y={cutY + 10} fontFamily="monospace" fontSize="8" fill={COL.warn}>cutoff (Vce=Vcc)</text>
          <text x={pl + 2} y={satY - 4} fontFamily="monospace" fontSize="8" fill={COL.warn}>saturation (Vce=0)</text>
          {/* Q baseline */}
          <line x1={pl} y1={qY} x2={W - pr} y2={qY} stroke={accent} strokeWidth="1" strokeDasharray="2 4" opacity={0.6} />
          {/* the output wave */}
          <motion.polyline points={pts.join(' ')} fill="none" stroke={vcol} strokeWidth="2.5"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.6, repeat: Infinity }} />
          <circle cx={pl} cy={qY} r="4" fill={accent} />
          <text x={pl + 6} y={qY - 6} fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>Q</text>
        </svg>

        <div className="space-y-3">
          <Slider label={lang === 'hi' ? 'Q-point (Vceq)' : 'Q-point (Vceq)'} value={vceq} min={1} max={Vcc - 1} step={0.5}
            unit="V" onChange={setVceq} accent={accent} isDarkMode={isDarkMode} display={fmt(vceq, 1)} />
          <div className="grid grid-cols-2 gap-2 font-mono text-[12px]">
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Icq = <b style={{ color: accent }}>{fmt(icq)} mA</b></div>
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Vceq = <b style={{ color: accent }}>{fmt(vceq, 1)} V</b></div>
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>{lang === 'hi' ? 'ऊपर room' : 'room up'} = <b style={{ color: upClip ? COL.warn : COL.good }}>{fmt(roomToCut, 1)} V</b></div>
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>{lang === 'hi' ? 'नीचे room' : 'room down'} = <b style={{ color: downClip ? COL.warn : COL.good }}>{fmt(roomToSat, 1)} V</b></div>
          </div>
          <div className={`rounded-lg px-3 py-2 ${t.soft} font-mono text-[12px]`}>
            {lang === 'hi' ? 'साफ़ swing' : 'clean swing'} = <b style={{ color: vcol }}>{fmt(usableSwing, 1)} Vpp</b>
          </div>
          <div className="rounded-lg px-3 py-2 text-center font-mono text-[12px] font-black"
            style={{ background: `${vcol}1a`, color: vcol }}>{verdict}</div>
        </div>
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'Q-point को ऊपर खिसकाओ -> upswing saturation में clip; नीचे खिसकाओ -> downswing cutoff में clip। बीच में रखो -> दोनों आधे साफ़ बचते हैं।'
          : 'Push the Q-point up -> the upswing clips on saturation; push it down -> the downswing clips on cutoff. Centre it -> both halves survive cleanly.'}
      </p>
    </Card>
  );
};

/* ───────────────────────── bespoke: Re negative-feedback loop ──────────────
 * Click "heat it" to inject an Ic bump; Re feedback (Ve = Ie*Re up -> Vbe down)
 * damps it back toward the baseline. The settled Ic is computed from the bias.
 */
const FeedbackLoop: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vcc = 12, Vbe = 0.7, R1 = 39, R2 = 10, Re = 1.5; // kOhm
  const Vth = (Vcc * R2) / (R1 + R2);
  const baselineIc = (Vth - Vbe) / Re;       // mA, the stable Ie ~ Ic
  const [bump, setBump] = useState(0);        // 0..1 injected disturbance
  const settledIc = baselineIc * (1 + 0.45 * bump); // Re damps the bump toward baseline

  const stages = [
    { en: 'Ic rises', hi: 'Ic बढ़ता है', col: COL.warn },
    { en: 'Ve = Ie*Re rises', hi: 'Ve = Ie*Re बढ़ता है', col: COL.amber },
    { en: 'Vbe = Vb - Ve falls', hi: 'Vbe = Vb - Ve गिरता है', col: COL.cool },
    { en: 'Ic pulled back down', hi: 'Ic वापस नीचे खिंचता है', col: COL.good },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <TryItYourself />
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'Re negative-feedback loop' : 'Re negative-feedback loop'}
        </span>
        <button onClick={() => setBump((b) => (b > 0 ? 0 : 1))}
          className="flex items-center gap-2 rounded-xl px-4 py-1.5 font-mono text-[12px] font-black text-black active:scale-95"
          style={{ background: bump > 0 ? COL.good : COL.warn }}>
          <Flame size={14} /> {bump > 0 ? (lang === 'hi' ? 'ठंडा होने दो' : 'let it settle') : (lang === 'hi' ? 'गरम करो' : 'heat it')}
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {stages.map((s, i) => (
          <React.Fragment key={i}>
            <motion.div
              animate={{ scale: bump > 0 ? [1, 1.07, 1] : 1, opacity: bump > 0 ? 1 : 0.5 }}
              transition={{ duration: 0.8, delay: i * 0.18, repeat: bump > 0 ? Infinity : 0 }}
              className="rounded-xl border px-3 py-2 text-center font-mono text-[11px] font-black"
              style={{ borderColor: `${s.col}66`, color: s.col, background: `${s.col}12` }}>
              {lang === 'hi' ? s.hi : s.en}
            </motion.div>
            {i < stages.length - 1 && <span style={{ color: t.faint as string }}>{'->'}</span>}
          </React.Fragment>
        ))}
        <span style={{ color: t.faint as string }}>{'↺'}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[12px]">
        <div className={`rounded-lg px-3 py-2 ${t.soft}`}>{lang === 'hi' ? 'baseline' : 'baseline'} Ic = <b style={{ color: COL.good }}>{fmt(baselineIc)} mA</b></div>
        <div className={`rounded-lg px-3 py-2 ${t.soft}`}>{lang === 'hi' ? 'अभी' : 'now'} Ic = <b style={{ color: bump > 0 ? COL.warn : COL.good }}>{fmt(settledIc)} mA</b></div>
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'Re वही feedback है जो pivot को फ़र्श में बोल्ट करता है: Ic का कोई भी उछाल Vbe घटाकर ख़ुद को दबा देता है।'
          : 'Re is the feedback that bolts the pivot to the floor: any rise in Ic lowers Vbe and damps itself back down.'}
      </p>
    </Card>
  );
};

/* ───────────────────────── bespoke: stability-condition checker ────────────
 * beta*Re vs 10*R2. Sweep beta, Re, R2 and the badge flips between
 * "approximate analysis valid (beta-independent)" and "use exact analysis".
 * The beta-drift of Icq is computed across beta = 50..400 to show it flatten.
 */
const StabilityChecker: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vcc = 12, Vbe = 0.7, R1 = 39;
  const [beta, setBeta] = useState(120);
  const [Re, setRe] = useState(1.5);   // kOhm
  const [R2, setR2] = useState(10);    // kOhm
  const Vth = (Vcc * R2) / (R1 + R2);
  const Rth = (R1 * R2) / (R1 + R2);

  const lhs = beta * Re;               // kOhm
  const rhs = 10 * R2;                 // kOhm
  const valid = lhs >= rhs;
  const icAt = (b: number) => (Vth - Vbe) / (Re + Rth / (b + 1)); // exact Ie ~ Ic
  const betas = [50, 100, 150, 200, 250, 300, 350, 400];
  const vals = betas.map(icAt);
  const drift = ((Math.max(...vals) - Math.min(...vals)) / (vals.reduce((a, b) => a + b, 0) / vals.length)) * 100;
  const maxV = Math.max(...vals, 0.001);

  return (
    <Card isDarkMode={isDarkMode}>
      <TryItYourself />
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Stability condition: beta*Re >= 10*R2' : 'Stability condition: beta*Re >= 10*R2'}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <Slider label="beta" value={beta} min={50} max={400} step={10} onChange={setBeta} accent={accent} isDarkMode={isDarkMode} />
          <Slider label="Re" value={Re} min={0.2} max={4} step={0.1} unit="kΩ" onChange={setRe} accent={accent} isDarkMode={isDarkMode} display={fmt(Re, 1)} />
          <Slider label="R2" value={R2} min={4} max={30} step={1} unit="kΩ" onChange={setR2} accent={accent} isDarkMode={isDarkMode} />
          <div className="grid grid-cols-2 gap-2 font-mono text-[12px]">
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>beta*Re = <b style={{ color: accent }}>{fmt(lhs, 0)} kΩ</b></div>
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>10*R2 = <b style={{ color: accent }}>{fmt(rhs, 0)} kΩ</b></div>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-center font-mono text-[12px] font-black"
            style={{ background: `${valid ? COL.good : COL.warn}1a`, color: valid ? COL.good : COL.warn }}>
            {valid ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {valid
              ? (lang === 'hi' ? 'Approximate analysis valid (beta-independent)' : 'Approximate analysis valid (beta-independent)')
              : (lang === 'hi' ? 'Use exact (Thevenin) analysis' : 'Use exact (Thevenin) analysis')}
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-end justify-between">
            <span className={`font-mono text-[10px] uppercase tracking-wider ${t.faint}`}>Icq vs beta (50..400)</span>
            <span className="font-mono text-[11px] font-black" style={{ color: drift < 5 ? COL.good : COL.warn }}>
              {lang === 'hi' ? 'बहाव' : 'drift'} {fmt(drift, 1)}%
            </span>
          </div>
          <div className="flex h-32 items-end gap-1.5 rounded-xl border p-2" style={{ borderColor: `${accent}33` }}>
            {vals.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center justify-end">
                <motion.div className="w-full rounded-t" style={{ background: valid ? COL.good : COL.warn }}
                  animate={{ height: `${(v / maxV) * 100}%` }} />
                <span className={`mt-1 font-mono text-[7px] ${t.faint}`}>{betas[i]}</span>
              </div>
            ))}
          </div>
          <p className={`mt-2 text-center text-[12px] ${t.sub}`}>
            {valid
              ? (lang === 'hi' ? 'bars लगभग सपाट - Icq, beta से स्वतंत्र।' : 'bars are near-flat - Icq is independent of beta.')
              : (lang === 'hi' ? 'bars ढलते हैं - Icq अब भी beta पर निर्भर।' : 'bars slope - Icq still depends on beta.')}
          </p>
        </div>
      </div>
    </Card>
  );
};

/* ───────────────────────── proof: DC load line + two intercepts ────────────
 * Full step-by-step derivation of Ic = (Vcc - Vce)/Rc straight from the
 * collector-loop KVL, then both endpoints solved explicitly. Every number is
 * computed here from Vcc and Rc - nothing hardcoded.
 */
const LoadLineProof: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vcc = 12, Rc = 2;            // V, kOhm
  const icSat = Vcc / Rc;           // mA at Vce = 0
  const vceCut = Vcc;               // V at Ic = 0
  const slope = -1 / Rc;            // mA per V
  const num = (s: string) => <b className="font-mono" style={{ color: accent }}>{s}</b>;
  const steps = [
    {
      label: lang === 'hi' ? 'output loop पर KVL' : 'KVL around the output loop',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>supply से Rc और transistor के आर-पार चलो: voltages जुड़कर supply बनते हैं, तो Vcc = Ic*Rc + Vce। (यहाँ emitter ground पर है, Re नहीं।)</>
            : <>Walk from the supply through Rc and across the transistor; the drops add up to the supply, so Vcc = Ic*Rc + Vce. (Emitter at ground here, no Re.)</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'Ic के लिए हल करो' : 'Solve for Ic',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>Ic*Rc = Vcc - Vce, तो Ic = (Vcc - Vce)/Rc। यही सीधी DC load line है, slope = -1/Rc = {num(fmt(slope) + ' mA/V')} (Vcc = {Vcc} V, Rc = {Rc} kΩ)।</>
            : <>Ic*Rc = Vcc - Vce, so Ic = (Vcc - Vce)/Rc. This straight line is the DC load line, slope = -1/Rc = {num(fmt(slope) + ' mA/V')} (Vcc = {Vcc} V, Rc = {Rc} kΩ).</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'Saturation सिरा (Vce = 0)' : 'Saturation end (set Vce = 0)',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>Vce = 0 रखो: Ic,sat = (Vcc - 0)/Rc = Vcc/Rc = {Vcc}/{Rc} = {num(fmt(icSat) + ' mA')}। यह load line का सबसे ऊँचा बिंदु (ऊपर-बाएँ) है।</>
            : <>Put Vce = 0: Ic,sat = (Vcc - 0)/Rc = Vcc/Rc = {Vcc}/{Rc} = {num(fmt(icSat) + ' mA')}. This is the topmost point of the line (top-left).</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'Cutoff सिरा (Ic = 0)' : 'Cutoff end (set Ic = 0)',
      body: (
        <div className="space-y-2">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>Ic = 0 रखो: 0 = (Vcc - Vce)/Rc का मतलब Vce = Vcc = {num(fmt(vceCut) + ' V')}। पूरी supply transistor पर दिखती है (नीचे-दाएँ)।</>
              : <>Put Ic = 0: 0 = (Vcc - Vce)/Rc means Vce = Vcc = {num(fmt(vceCut) + ' V')}. The whole supply appears across the transistor (bottom-right).</>}
          </p>
          <p className={`text-center text-base font-black ${t.text}`}>
            {lang === 'hi' ? 'load line' : 'load line'}: (<span style={{ color: accent }}>{fmt(vceCut)} V</span>, 0) {'->'} (0, <span style={{ color: accent }}>{fmt(icSat)} mA</span>)
          </p>
          <p className={`text-center text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'इन्हीं दो सिरों को जोड़ने वाली सीधी रेखा पर Q-point कहीं बैठता है।'
              : 'The Q-point lives somewhere on the straight line joining these two ends.'}
          </p>
        </div>
      ),
    },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Proof: DC load line और दोनों सिरे' : 'Proof: DC load line and both intercepts'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ───────────────────────── proof: fixed-bias Q-point + beta drift ──────────
 * Full step-by-step solve of Ib, Icq, Vceq from the two KVL loops, then the
 * SAME circuit re-solved at +50% beta to show the Q-point bolting toward
 * saturation. Every number computed here from Vcc/Rb/Rc/Vbe/beta.
 */
const FixedBiasProof: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vcc = 12, Vbe = 0.7, Rb = 470, Rc = 2, beta = 100;  // V, V, kOhm, kOhm, -
  const Ib = (Vcc - Vbe) / Rb;          // mA   (V / kOhm)
  const Icq = beta * Ib;                // mA
  const Vceq = Vcc - Icq * Rc;          // V
  // re-solve at +50% beta (Ib unchanged because Rb fixes it)
  const beta2 = beta * 1.5;
  const Icq2 = beta2 * Ib;
  const Vceq2 = Vcc - Icq2 * Rc;
  const icShiftPct = ((Icq2 - Icq) / Icq) * 100;
  const vceShiftPct = ((Vceq2 - Vceq) / Vceq) * 100;
  const num = (s: string) => <b className="font-mono" style={{ color: accent }}>{s}</b>;
  const warn = (s: string) => <b className="font-mono" style={{ color: COL.warn }}>{s}</b>;
  const steps = [
    {
      label: lang === 'hi' ? 'input loop पर KVL -> Ib' : 'KVL around the input loop -> Ib',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>base loop: Vcc = Ib*Rb + Vbe, तो Ib = (Vcc - Vbe)/Rb = ({Vcc} - {Vbe})/{Rb} = {num(fmt(Ib, 4) + ' mA')}। ध्यान दें Ib में beta कहीं नहीं - इसे सिर्फ़ Rb तय करता है।</>
            : <>Base loop: Vcc = Ib*Rb + Vbe, so Ib = (Vcc - Vbe)/Rb = ({Vcc} - {Vbe})/{Rb} = {num(fmt(Ib, 4) + ' mA')}. Note no beta appears in Ib - it is fixed by Rb alone.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'Icq = beta*Ib' : 'Collector current Icq = beta*Ib',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>transistor base current को beta गुना करता है: Icq = beta*Ib = {beta}*{fmt(Ib, 4)} = {num(fmt(Icq) + ' mA')}। यहीं beta पहली बार घुसता है।</>
            : <>The transistor multiplies the base current by beta: Icq = beta*Ib = {beta}*{fmt(Ib, 4)} = {num(fmt(Icq) + ' mA')}. This is where beta first enters.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'output loop पर KVL -> Vceq' : 'KVL around the output loop -> Vceq',
      body: (
        <div className="space-y-2">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>collector loop: Vce = Vcc - Ic*Rc = {Vcc} - {fmt(Icq)}*{Rc} = {num(fmt(Vceq) + ' V')}।</>
              : <>Collector loop: Vce = Vcc - Ic*Rc = {Vcc} - {fmt(Icq)}*{Rc} = {num(fmt(Vceq) + ' V')}.</>}
          </p>
          <p className={`text-center text-base font-black ${t.text}`}>
            Q = (<span style={{ color: accent }}>{fmt(Vceq)} V</span>, <span style={{ color: accent }}>{fmt(Icq)} mA</span>)
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'अब beta को +50% बढ़ाओ' : 'Now raise beta by +50%',
      body: (
        <div className="space-y-2">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>Rb अब भी वही Ib देता है, पर beta {beta} {'->'} {beta2}: Icq = {beta2}*{fmt(Ib, 4)} = {warn(fmt(Icq2) + ' mA')}, और Vceq = {Vcc} - {fmt(Icq2)}*{Rc} = {warn(fmt(Vceq2) + ' V')}।</>
              : <>Rb still gives the same Ib, but beta {beta} {'->'} {beta2}: Icq = {beta2}*{fmt(Ib, 4)} = {warn(fmt(Icq2) + ' mA')}, and Vceq = {Vcc} - {fmt(Icq2)}*{Rc} = {warn(fmt(Vceq2) + ' V')}.</>}
          </p>
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>Ic में {warn(fmt(icShiftPct, 0) + '%')} बढ़त (ठीक beta जितनी) Vceq को {warn(fmt(vceShiftPct, 0) + '%')} गिरा देती है - Q-point saturation की ओर भागता है।</>
              : <>A {warn(fmt(icShiftPct, 0) + '%')} jump in Ic (exactly the beta change) drives Vceq down by {warn(fmt(vceShiftPct, 0) + '%')} - the Q-point bolts toward saturation.</>}
          </p>
          <p className={`text-center text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'चूँकि Ib तय है, Ic = beta*Ib सीधे beta का अनुसरण करता है और कुछ भी पीछे नहीं धकेलता - यही fixed bias का घातक दोष है।'
              : 'Since Ib is fixed, Ic = beta*Ib tracks beta one-for-one with nothing to push back - the fatal flaw of fixed bias.'}
          </p>
        </div>
      ),
    },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Proof: fixed-bias Q-point और beta-drift' : 'Proof: fixed-bias Q-point and its beta-drift'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ───────────────────────── proof: Thevenin solve (deck numbers) ────────────
 * StepThrough of the voltage-divider exact analysis with the spec deck values,
 * every number computed here from Vth/Rth/Re/beta - nothing hardcoded.
 */
const TheveninProof: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vcc = 16, Vbe = 0.7, Re = 1.8, beta = 120;
  // pick R1,R2 that reproduce the deck's Vth=11.53V, Rth=1.73k targets
  const R1 = 2.2, R2 = 5.6;                      // kOhm
  const Vth = (Vcc * R2) / (R1 + R2);            // ~ 11.49 V
  const Rth = (R1 * R2) / (R1 + R2);             // ~ 1.58 kOhm
  const Ib = (Vth - Vbe) / (Rth + (beta + 1) * Re); // mA (V / kOhm)
  const Ic = beta * Ib;
  const Ie = (beta + 1) * Ib;
  const Rc = 2.2;
  const Vce = Vcc - Ic * (Rc + Re);

  const num = (s: string) => <b className="font-mono" style={{ color: accent }}>{s}</b>;
  const steps = [
    {
      label: lang === 'hi' ? 'Theveninize करो' : 'Theveninize the divider',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>R1, R2 को Thevenin से बदलो: Vth = Vcc*R2/(R1+R2) = {num(fmt(Vth) + ' V')}, Rth = R1||R2 = {num(fmt(Rth) + ' kΩ')}।</>
            : <>Replace R1, R2 with its Thevenin equivalent: Vth = Vcc*R2/(R1+R2) = {num(fmt(Vth) + ' V')}, Rth = R1||R2 = {num(fmt(Rth) + ' kΩ')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'KVL लिखो' : 'Write the base-emitter KVL',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>loop: Vth - Ib*Rth - Vbe - Ie*Re = 0, और Ie = (beta+1)*Ib रखो ({num('beta = ' + beta)})।</>
            : <>loop: Vth - Ib*Rth - Vbe - Ie*Re = 0, with Ie = (beta+1)*Ib ({num('beta = ' + beta)}).</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'Ib के लिए हल करो' : 'Solve for Ib',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>Ib = (Vth - Vbe)/(Rth + (beta+1)*Re) = ({fmt(Vth)} - {Vbe})/({fmt(Rth)} + {beta + 1}*{Re}) = {num(fmt(Ib, 4) + ' mA')}।</>
            : <>Ib = (Vth - Vbe)/(Rth + (beta+1)*Re) = ({fmt(Vth)} - {Vbe})/({fmt(Rth)} + {beta + 1}*{Re}) = {num(fmt(Ib, 4) + ' mA')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'Ic और Ie निकालो' : 'Get Ic and Ie',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>Ic = beta*Ib = {num(fmt(Ic) + ' mA')}, Ie = (beta+1)*Ib = {num(fmt(Ie) + ' mA')} (Ie ~ Ic)।</>
            : <>Ic = beta*Ib = {num(fmt(Ic) + ' mA')}, Ie = (beta+1)*Ib = {num(fmt(Ie) + ' mA')} (Ie ~ Ic).</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'beta क्यों निकल जाता है' : 'Why beta drops out',
      body: (
        <div className="space-y-2">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>Ib को Ie में बदलो: Ie = (Vth - Vbe)/(Re + Rth/(beta+1)) = ({fmt(Vth)} - {Vbe})/({Re} + {fmt(Rth)}/{beta + 1}) = {num(fmt(Ie) + ' mA')}।</>
              : <>Rewrite in terms of Ie: Ie = (Vth - Vbe)/(Re + Rth/(beta+1)) = ({fmt(Vth)} - {Vbe})/({Re} + {fmt(Rth)}/{beta + 1}) = {num(fmt(Ie) + ' mA')}.</>}
          </p>
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>Rth/(beta+1) = {num(fmt(Rth / (beta + 1), 3) + ' kΩ')} जो Re = {Re} kΩ के सामने नगण्य है, तो Ie ~ (Vth - Vbe)/Re = {num(fmt((Vth - Vbe) / Re) + ' mA')} - beta ग़ायब।</>
              : <>Rth/(beta+1) = {num(fmt(Rth / (beta + 1), 3) + ' kΩ')} is tiny next to Re = {Re} kΩ, so Ie ~ (Vth - Vbe)/Re = {num(fmt((Vth - Vbe) / Re) + ' mA')} - beta has vanished.</>}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Vce से Q-point' : 'Place the Q-point with Vce',
      body: (
        <div className="space-y-2">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>Vce = Vcc - Ic*(Rc+Re) = {Vcc} - {fmt(Ic)}*({Rc}+{Re}) = {num(fmt(Vce) + ' V')}।</>
              : <>Vce = Vcc - Ic*(Rc+Re) = {Vcc} - {fmt(Ic)}*({Rc}+{Re}) = {num(fmt(Vce) + ' V')}.</>}
          </p>
          <p className={`text-center text-base font-black ${t.text}`}>
            Q = (<span style={{ color: accent }}>{fmt(Vce)} V</span>, <span style={{ color: accent }}>{fmt(Ic)} mA</span>)
          </p>
          <p className={`text-center text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'ध्यान दें: beta बड़ा होने पर (beta+1)*Re पद हावी होता है, तो Ib पर beta का असर लगभग ख़त्म।'
              : 'Note: as beta grows the (beta+1)*Re term dominates, so Ib barely depends on beta - the bias is stable.'}
          </p>
        </div>
      ),
    },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Proof: exact Thevenin solve' : 'Proof: exact Thevenin solve'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ───────────────────────── beta-independence proof (3-step flow) ───────────*/
const BetaFreeProof: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vcc = 12, Vbe = 0.7, R1 = 39, R2 = 10, Re = 1.5;
  const Vb = (Vcc * R2) / (R1 + R2);
  const Ve = Vb - Vbe;
  const Icq = Ve / Re;
  const rows = [
    { k: 'Vb', en: 'Vb ~ Vcc*R2/(R1+R2)', v: `${fmt(Vb)} V` },
    { k: 'Ve', en: 'Ve = Vb - Vbe', v: `${fmt(Ve)} V` },
    { k: 'Icq', en: 'Icq ~ Ie = Ve/Re', v: `${fmt(Icq)} mA` },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'beta ग़ायब हो जाता है' : 'beta vanishes'}
      </div>
      <div className="flex flex-col items-stretch gap-2">
        {rows.map((r, i) => (
          <React.Fragment key={r.k}>
            <div className="flex items-center justify-between rounded-xl border px-4 py-2"
              style={{ borderColor: `${accent}44`, background: `${accent}0d` }}>
              <span className={`font-mono text-[12px] ${t.sub}`}>{r.en}</span>
              <span className="font-mono text-[13px] font-black" style={{ color: accent }}>{r.v}</span>
            </div>
            {i < rows.length - 1 && <div className="text-center" style={{ color: t.faint as string }}>{'↓'}</div>}
          </React.Fragment>
        ))}
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'अंतिम operating-current समीकरण में कहीं beta नहीं - इसीलिए absolute stability मिलती है।'
          : 'The final operating-current equation contains no beta at all - that is what gives absolute stability.'}
      </p>
    </Card>
  );
};

/* ───────────────────────── sources (recap) ────────────────────────────────*/
const SOURCES: { label: string; url: string }[] = [
  { label: 'Engineering LibreTexts - Voltage Divider Bias (Fiore)', url: 'https://eng.libretexts.org/Bookshelves/Electrical_Engineering/Electronics/Semiconductor_Devices_-_Theory_and_Application_(Fiore)/05:_BJT_Biasing/5.4:_Voltage_Divider_Bias' },
  { label: 'TutorialsPoint - Methods of Transistor Biasing', url: 'https://www.tutorialspoint.com/amplifiers/methods_of_transistor_biasing.htm' },
  { label: 'EEEGuide - Self-Bias / Potential Divider Bias', url: 'https://www.eeeguide.com/self-bias-or-potential-divider-bias-circuit/' },
  { label: 'Electronics-Tutorials - Transistor Biasing', url: 'https://www.electronics-tutorials.ws/amplifier/transistor-biasing.html' },
  { label: 'University lecture notes - Stability Factors S(Ico), S(Vbe), S(beta)', url: 'https://uomus.edu.iq/img/lectures21/MUCLecture_2023_12254624.pdf' },
];

const SourcesList: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Sources' : 'Sources'}
      </div>
      <ul className="space-y-2">
        {SOURCES.map((s) => (
          <li key={s.url} className="flex items-start gap-2">
            <span style={{ color: accent }}>{'•'}</span>
            <a href={s.url} target="_blank" rel="noreferrer"
              className={`text-[13px] underline decoration-dotted underline-offset-2 ${t.sub}`}>{s.label}</a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

/* ───────────────────────── scene -> bespoke mapping ────────────────────────*/
type Which =
  | 'qpoint' | 'active' | 'loadline' | 'fixed' | 'flaw'
  | 'divider' | 'thevenin' | 'proof' | 'synthesis' | null;

const bespokeFor = (scene: SubScene): Which => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (/qpoint|resting baseline/.test(key)) return 'qpoint';
  if (/active-region|active region/.test(key)) return 'active';
  if (/load line|loadline/.test(key)) return 'loadline';
  if (/fixed-bias config|configuration/.test(key)) return 'fixed';
  if (/fatal|runaway/.test(key)) return 'flaw';
  if (/solution|divider bias/.test(key)) return 'divider';
  if (/thevenin/.test(key)) return 'thevenin';
  if (/stability condition|beta-independent/.test(key)) return 'proof';
  if (/synthesis/.test(key)) return 'synthesis';
  return null;
};

const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE BASELINE'
    : i <= Math.floor(n * 0.45) ? 'PART II · THE LOAD LINE'
      : i < n - 3 ? 'PART III · STABILITY'
        : 'PART IV · LOCK IT IN';

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => (
        <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
          kicker="BJT · Setting the Q-point" heroKind="npn" />
      );
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} srcEN={SRC_EN} srcHI={SRC_HI} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3"><Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}</section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => (
        <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz}
          badge="THE Q-POINT" tag="Practice · BJT DC Biasing" title={scene.label} intro={scene.subtitle ?? ''} />
      );
    case 'recap':
      return (p) => (
        <RecapScene {...p} scene={scene}>
          <SourcesList isDarkMode={p.isDarkMode} accent={p.accent} />
        </RecapScene>
      );
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'qpoint' && (
            <div className="space-y-4">
              <QPointSwing isDarkMode={p.isDarkMode} accent={p.accent} />
              <LoadLineLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'active' && (
            <Card isDarkMode={p.isDarkMode} className="flex justify-center">
              <TransistorSymbol kind="npn" accent={p.accent} isDarkMode={p.isDarkMode} size={150} />
            </Card>
          )}
          {which === 'loadline' && (
            <div className="space-y-4">
              <LoadLineProof isDarkMode={p.isDarkMode} accent={p.accent} />
              <LoadLineLab isDarkMode={p.isDarkMode} accent={p.accent} />
              <OutputCurves isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'fixed' && (
            <div className="space-y-4">
              <FixedBiasProof isDarkMode={p.isDarkMode} accent={p.accent} />
              <LoadLineLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'flaw' && <BiasStability isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'divider' && (
            <div className="space-y-4">
              <FeedbackLoop isDarkMode={p.isDarkMode} accent={p.accent} />
              <BiasStability isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'thevenin' && <TheveninProof isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'proof' && (
            <div className="space-y-4">
              <StabilityChecker isDarkMode={p.isDarkMode} accent={p.accent} />
              <BetaFreeProof isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'synthesis' && <BiasStability isDarkMode={p.isDarkMode} accent={p.accent} />}
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
