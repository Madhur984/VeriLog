/**
 * be8 - "BJT AC Analysis & the Small-Signal Model".
 * The VIP Megaphone Club: a whisper (vin) becomes a broadcast. DC bias is the
 * house power, beta is the loudness multiplier, re is the bouncer at the emitter
 * door, and the coupling/bypass caps are velvet ropes that pass the music (AC)
 * but block the DC. Bespoke labs: a coupling-cap "blocks DC, passes AC" visual,
 * an re = VT/IE slider, a CE-amplifier SVG, plus the kit SmallSignalGain lab and
 * a StepThrough deriving re from the diode equation. Every value is computed.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene, StepThrough,
  type SubScene,
} from '../_transistor/kit';
import { TransistorSymbol, SmallSignalGain, Slider } from '../_transistor/analog';
import type { SubPage } from '../_transistor/kit';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/be8-bjt-ac-en.mp4';
const SRC_HI: string | undefined = '/videos/be8-bjt-ac-hi.mp4';

const ACC = { dc: '#fb7185', ac: '#38bdf8', good: '#34d399', warn: '#f59e0b' };
const fmt = (n: number, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : '-');

/* ───────── bespoke: superposition - the whisper on the house power ───────── */
const SuperpositionViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [dc, setDc] = useState(6);       // V (house power level)
  const [amp, setAmp] = useState(8);     // small-signal amplitude (px)
  const [isolate, setIsolate] = useState(false);

  const W = 320, H = 150, pad = 14;
  // DC baseline maps 0..12 V into the plot band (computed, not hardcoded)
  const dcY = H - pad - (dc / 12) * (H - 2 * pad);
  const midY = H / 2;
  const wave = (baseY: number, a: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 3) pts.push(`${x},${baseY - a * Math.sin((x / W) * Math.PI * 6)}`);
    return pts.join(' ');
  };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'whisper, house power पर' : 'the whisper on the house power'}
        </span>
        <button onClick={() => setIsolate((v) => !v)} className="min-h-[40px] sm:min-h-0 rounded-lg px-3 py-1.5 font-mono text-[11px] font-black text-black active:scale-95"
          style={{ background: isolate ? ACC.ac : accent }}>
          {isolate ? (lang === 'hi' ? 'DC वापस लाओ' : 'show DC again') : (lang === 'hi' ? 'AC अलग करो' : 'isolate AC')}
        </button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1="0" y1={isolate ? midY : dcY} x2={W} y2={isolate ? midY : dcY}
          stroke={isolate ? (isDarkMode ? '#1e293b' : '#e2e8f0') : ACC.dc} strokeWidth={isolate ? 1 : 2}
          strokeDasharray={isolate ? '4 4' : undefined} />
        <motion.polyline
          points={isolate ? wave(midY, amp * 3.2) : wave(dcY, amp)}
          fill="none" stroke={ACC.ac} strokeWidth="2.5"
          animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.6, repeat: Infinity }} />
        {!isolate && <text x="6" y={dcY - 6} fontFamily="monospace" fontSize="9" fill={ACC.dc}>V_DC = {fmt(dc, 0)} V (house power)</text>}
        <text x="6" y="14" fontFamily="monospace" fontSize="9" fill={ACC.ac}>{isolate ? 'isolated AC whisper (zoomed)' : 'v_total = V_DC + v_ac'}</text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label={lang === 'hi' ? 'DC bias (house power)' : 'DC bias (house power)'} value={dc} min={2} max={11} step={1} unit="V" onChange={setDc} accent={ACC.dc} isDarkMode={isDarkMode} />
        <Slider label={lang === 'hi' ? 'AC amplitude (whisper)' : 'AC amplitude (whisper)'} value={amp} min={2} max={14} step={1} onChange={setAmp} accent={ACC.ac} isDarkMode={isDarkMode} />
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'DC bias steady house power है; AC whisper उस पर सवार है। "AC अलग करो" से DC हट जाता है और सिर्फ़ music बचती है - यही superposition है।'
          : 'The DC bias is the steady house power; the AC whisper rides on top. "Isolate AC" peels the DC away leaving only the music - that is superposition.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: coupling cap - blocks DC, passes AC (velvet rope) ───────── */
const CouplingCapViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [f, setF] = useState(1000);   // Hz
  const [C, setC] = useState(10);     // uF
  // Xc = 1/(2 pi f C). C in uF -> F. All computed.
  const Xc = 1 / (2 * Math.PI * f * (C * 1e-6)); // Ohm
  const passes = Xc < 100;            // small reactance => effectively a short to AC
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'coupling cap - velvet rope' : 'coupling cap - the velvet rope'}
      </div>
      <svg viewBox="0 0 340 120" className="w-full">
        {/* DC barrier (red) - always blocked */}
        <text x="14" y="30" fontFamily="monospace" fontSize="10" fill={ACC.dc}>DC</text>
        <motion.circle r="5" fill={ACC.dc} cy="40" animate={{ cx: [30, 150] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }} />
        {/* the capacitor (two plates) */}
        <line x1="168" y1="20" x2="168" y2="100" stroke={t.faint as string} strokeWidth="3" />
        <line x1="182" y1="20" x2="182" y2="100" stroke={t.faint as string} strokeWidth="3" />
        <text x="160" y="114" fontFamily="monospace" fontSize="9" fill={t.faint as string}>C (cap)</text>
        {/* DC hits the wall */}
        <text x="120" y="36" fontFamily="monospace" fontSize="9" fill={ACC.dc}>blocked</text>
        {/* AC passes (blue) when Xc small */}
        <text x="14" y="90" fontFamily="monospace" fontSize="10" fill={ACC.ac}>AC</text>
        <motion.circle r="5" fill={ACC.ac} cy="80"
          animate={{ cx: passes ? [30, 320] : [30, 150], opacity: passes ? [1, 1, 1] : [1, 1, 0.2] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
        <text x={passes ? 250 : 120} y="76" fontFamily="monospace" fontSize="9" fill={ACC.ac}>{passes ? 'passes' : 'partly blocked'}</text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="frequency f" value={f} min={50} max={20000} step={50} unit="Hz" onChange={setF} accent={ACC.ac} isDarkMode={isDarkMode} display={f >= 1000 ? `${fmt(f / 1000, 1)}k` : `${f}`} />
        <Slider label="C" value={C} min={0.1} max={47} step={0.1} unit="µF" onChange={setC} accent={accent} isDarkMode={isDarkMode} display={fmt(C, 1)} />
      </div>
      <div className="mt-3 rounded-lg px-3 py-2 text-center font-mono text-[13px] font-black"
        style={{ background: `${passes ? ACC.good : ACC.warn}1a`, color: passes ? ACC.good : ACC.warn }}>
        Xc = 1/(2πfC) = {Xc >= 1000 ? `${fmt(Xc / 1000, 1)} kΩ` : `${fmt(Xc, 1)} Ω`} {passes ? (lang === 'hi' ? '-> short, AC गुज़रता है' : '-> short, AC passes') : (lang === 'hi' ? '-> अभी बड़ा' : '-> still sizeable')}
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'cap DC को रोकता है (steady current नहीं गुज़रता) पर AC को गुज़रने देता है। f या C बढ़ाइए -> Xc गिरता है -> velvet rope खुल जाती है।'
          : 'A cap blocks DC (no steady current flows) but passes AC. Raise f or C -> Xc falls -> the velvet rope swings open.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: re = VT/IE slider with a bouncer door ───────── */
const ReBouncer: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [IE, setIE] = useState(1);    // mA
  const [Rc, setRc] = useState(3);    // kOhm (for the gain readout)
  const VT = 26;                       // mV
  const re = VT / IE;                  // Ohm (IE in mA -> mV/mA = Ohm)
  const gm = 1 / re;                   // S
  const AvUnloaded = -(Rc * 1000) / re; // -Rc/re, Rc in kOhm
  // door gap: small re => narrow door (hard to push), large re => wide door
  const gap = Math.max(8, Math.min(60, re)); // px, clamped for display

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 're = VT/IE - emitter door का bouncer' : 're = VT/IE - the emitter-door bouncer'}
      </div>
      <div className="grid gap-5 md:grid-cols-[160px_1fr] md:items-center">
        {/* the bouncer door */}
        <svg viewBox="0 0 120 120" className="mx-auto w-40">
          <rect x="10" y="14" width="100" height="92" rx="6" fill="none" stroke={t.faint as string} strokeWidth="2" />
          {/* two door panels closing toward the centre as re shrinks */}
          <motion.rect x="10" width={55 - gap / 2} height="92" y="14" fill={`${accent}33`} stroke={accent} strokeWidth="1.5"
            animate={{ width: 55 - gap / 2 }} />
          <motion.rect width={55 - gap / 2} height="92" y="14" fill={`${accent}33`} stroke={accent} strokeWidth="1.5"
            animate={{ x: 110 - (55 - gap / 2), width: 55 - gap / 2 }} />
          <text x="60" y="118" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>emitter door</text>
        </svg>
        <div className="space-y-3">
          <Slider label="IE (bias current)" value={IE} min={0.2} max={8} step={0.1} unit="mA" onChange={setIE} accent={accent} isDarkMode={isDarkMode} display={fmt(IE, 1)} />
          <Slider label="Rc" value={Rc} min={1} max={10} step={0.5} unit="kΩ" onChange={setRc} accent={accent} isDarkMode={isDarkMode} />
          <div className="grid grid-cols-2 gap-2 font-mono text-[12px]">
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>re = 26/{fmt(IE, 1)} = <b style={{ color: accent }}>{fmt(re, 1)} Ω</b></div>
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>gm = 1/re = <b style={{ color: accent }}>{fmt(gm * 1000, 1)} mS</b></div>
          </div>
          <div className="rounded-lg px-3 py-2 text-center font-mono text-[13px] font-black" style={{ background: `${accent}1a`, color: accent }}>
            Av = -Rc/re = {fmt(AvUnloaded, 0)}
          </div>
        </div>
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'IE बढ़ाइए -> re गिरता है -> bouncer हट जाता है (door खुलता है) -> gain बढ़ता है। यही inverse relationship है।'
          : 'Raise IE -> re falls -> the bouncer steps aside (door opens) -> the gain rises. That is the inverse relationship.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: re derivation from the diode equation (StepThrough) ───────── */
const ReDerivation: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const mono = (s: string) => <span className="font-mono text-[13px] font-black" style={{ color: accent }}>{s}</span>;
  const steps = [
    {
      label: lang === 'hi' ? 'diode relation' : 'B-E diode relation',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>forward-biased base-emitter junction: {mono('IE ~ IS * exp(VBE/VT)')}, जहाँ {mono('VT = kT/q')} thermal voltage है।</>
            : <>The forward-biased base-emitter junction obeys {mono('IE ~ IS * exp(VBE/VT)')}, with thermal voltage {mono('VT = kT/q')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'room temperature' : 'room temperature',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>T ~ 300 K पर {mono('VT = kT/q ~ 25-26 mV')}। हम {mono('26 mV')} इस्तेमाल करते हैं।</>
            : <>At T ~ 300 K, {mono('VT = kT/q ~ 25-26 mV')}. We use {mono('26 mV')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'slope = re' : 'dynamic resistance is the slope',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>small-signal emitter resistance वह slope है: {mono('re = dVBE/dIE = 1/(dIE/dVBE)')}।</>
            : <>The small-signal emitter resistance is the slope: {mono('re = dVBE/dIE = 1/(dIE/dVBE)')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'differentiate' : 'differentiate',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>{mono('dIE/dVBE = IS*exp(VBE/VT)/VT = IE/VT')}।</>
            : <>{mono('dIE/dVBE = IS*exp(VBE/VT)/VT = IE/VT')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'invert -> re = VT/IE' : 'invert -> re = VT/IE',
      body: (
        <div className="space-y-2">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>invert करके: {mono('re = VT/IE')}। {mono('26 mV')} रखने पर {mono('re = 26 mV / IE(mA)')} ohms।</>
              : <>Invert to get {mono('re = VT/IE')}. Substituting {mono('26 mV')}: {mono('re = 26 mV / IE(mA)')} ohms.</>}
          </p>
          <p className={`text-center text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'यही re-model की आधारशिला है, और gm = IC/VT = 1/re सीधे इसी से निकलता है।'
              : 'This is the cornerstone of the re-model, and gm = IC/VT = 1/re follows directly.'}
          </p>
        </div>
      ),
    },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'proof: re = VT/IE' : 'proof: re = VT/IE'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ───────── bespoke: transconductance gm = IC/VT = 1/re (StepThrough) ───────── */
const GmDerivation: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  // worked numbers: IC = 1 mA, VT = 26 mV => gm = 1/26 mA/mV = 38.5 mS, re = 26 Ohm
  const IC = 1, VT = 26;                  // mA, mV
  const gm = IC / VT;                     // mA/mV = S (since mA/mV = A/V)
  const reVal = VT / IC;                  // Ohm
  const mono = (s: string) => <span className="font-mono text-[13px] font-black" style={{ color: accent }}>{s}</span>;
  const steps = [
    {
      label: lang === 'hi' ? 'collector current' : 'collector current law',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>collector current भी उसी diode नियम का पालन करता है: {mono('IC ~ IS * exp(VBE/VT)')}।</>
            : <>The collector current follows the same diode law: {mono('IC ~ IS * exp(VBE/VT)')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'gm = slope' : 'gm is the slope',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>transconductance वह slope है जो input voltage को output current में बदलती है: {mono('gm = dIC/dVBE')}।</>
            : <>The transconductance is the slope that turns input voltage into output current: {mono('gm = dIC/dVBE')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'differentiate' : 'differentiate',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>{mono('dIC/dVBE = IS*exp(VBE/VT)/VT = IC/VT')}। तो {mono('gm = IC/VT')}।</>
            : <>{mono('dIC/dVBE = IS*exp(VBE/VT)/VT = IC/VT')}, so {mono('gm = IC/VT')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'link to re' : 'link to re',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>चूँकि IC ~ IE (alpha ~ 1), {mono('gm = IC/VT ~ IE/VT = 1/re')}। यानी {mono('gm = 1/re')}।</>
            : <>Since IC ~ IE (alpha ~ 1), {mono('gm = IC/VT ~ IE/VT = 1/re')}. In other words {mono('gm = 1/re')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'plug in numbers' : 'plug in numbers',
      body: (
        <div className="space-y-2">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>IC = {fmt(IC, 0)} mA, VT = {fmt(VT, 0)} mV रखने पर: {mono(`gm = ${IC}/${VT} = ${fmt(gm * 1000, 1)} mS`)} और {mono(`re = VT/IC = ${fmt(reVal, 0)} Ω`)}।</>
              : <>With IC = {fmt(IC, 0)} mA and VT = {fmt(VT, 0)} mV: {mono(`gm = ${IC}/${VT} = ${fmt(gm * 1000, 1)} mS`)} and {mono(`re = VT/IC = ${fmt(reVal, 0)} Ω`)}.</>}
          </p>
          <p className={`text-center text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'जाँच: 1/re = 1/26 Ω = 38.5 mS, बिल्कुल gm के बराबर - दोनों एक ही चीज़ हैं।'
              : 'Check: 1/re = 1/26 Ω = 38.5 mS, exactly gm - they are the same quantity.'}
          </p>
        </div>
      ),
    },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'proof: gm = IC/VT = 1/re' : 'proof: gm = IC/VT = 1/re'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ───────── bespoke: full CE gain + Zi(base) derivation (StepThrough) ───────── */
const GainDerivation: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  // worked sample, every value computed: beta=150, IE=1 mA, Rc=3k, RL=6k
  const beta = 150, IE = 1, VT = 26;      // -, mA, mV
  const reVal = VT / IE;                  // Ohm
  const Rc = 3, RL = 6;                   // kOhm
  const rcRL = (Rc * RL) / (Rc + RL);     // kOhm
  const Zb = beta * reVal;                // Ohm
  const Av = -(rcRL * 1000) / reVal;      // unitless
  const mono = (s: string) => <span className="font-mono text-[13px] font-black" style={{ color: accent }}>{s}</span>;
  const steps = [
    {
      label: lang === 'hi' ? 'input resistance Zi(base)' : 'input resistance at the base',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>re-model में B-E branch पर voltage {mono('vbe = ie*re')} है, और {mono('ie = (beta+1)*ib')}। तो base में देखने पर {mono('Zi(base) = vbe/ib = (beta+1)*re ~ beta*re')}।</>
            : <>In the re-model the B-E branch carries {mono('vbe = ie*re')}, with {mono('ie = (beta+1)*ib')}. Looking into the base, {mono('Zi(base) = vbe/ib = (beta+1)*re ~ beta*re')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'input voltage vi' : 'input voltage vi',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>emitter पूरी तरह bypassed है (AC ground), तो पूरा input voltage beta*re पर पड़ता है: {mono('vi = ib*(beta*re)')}।</>
            : <>The emitter is fully bypassed (an AC ground), so the whole input voltage sits across beta*re: {mono('vi = ib*(beta*re)')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'output voltage vo' : 'output voltage vo',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>collector current {mono('ic = beta*ib')}, output load {mono('Rc||RL')} से बहता है। current node को ground की ओर खींचता है, इसलिए minus: {mono('vo = -(beta*ib)*(Rc||RL)')}।</>
            : <>The collector current {mono('ic = beta*ib')} flows through the output load {mono('Rc||RL')}. It pulls the node toward ground, hence the minus: {mono('vo = -(beta*ib)*(Rc||RL)')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'divide -> Av' : 'divide -> Av',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>{mono('Av = vo/vi = -(beta*ib)*(Rc||RL) / (ib*beta*re)')}। beta*ib कट जाता है: {mono('Av = -(Rc||RL)/re')}। चूँकि gm = 1/re, यह {mono('Av = -gm*(Rc||RL)')} भी है।</>
            : <>{mono('Av = vo/vi = -(beta*ib)*(Rc||RL) / (ib*beta*re)')}. The beta*ib cancels: {mono('Av = -(Rc||RL)/re')}. Since gm = 1/re, this is also {mono('Av = -gm*(Rc||RL)')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'the minus sign' : 'why the minus sign',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>जब vi बढ़ता है, ib और ic बढ़ते हैं, Rc पर drop बढ़ता है, तो collector voltage गिरता है - input ऊपर, output नीचे। यही 180-degree phase inversion है।</>
            : <>When vi rises, ib and ic rise, the drop across Rc rises, so the collector voltage falls - input up, output down. That is the mandatory 180-degree phase inversion.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? 'plug in numbers' : 'plug in numbers',
      body: (
        <div className="space-y-2">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>beta={fmt(beta, 0)}, IE={fmt(IE, 0)} mA -&gt; re={fmt(reVal, 0)} Ω, तो {mono(`Zi(base) = beta*re = ${fmt(Zb / 1000, 1)} kΩ`)}। Rc||RL = {fmt(rcRL, 1)} kΩ देता है {mono(`Av = -(${fmt(rcRL, 1)}k)/${fmt(reVal, 0)} = ${fmt(Av, 0)}`)}।</>
              : <>beta={fmt(beta, 0)}, IE={fmt(IE, 0)} mA -&gt; re={fmt(reVal, 0)} Ω, so {mono(`Zi(base) = beta*re = ${fmt(Zb / 1000, 1)} kΩ`)}. With Rc||RL = {fmt(rcRL, 1)} kΩ, {mono(`Av = -(${fmt(rcRL, 1)}k)/${fmt(reVal, 0)} = ${fmt(Av, 0)}`)}.</>}
          </p>
          <p className={`text-center text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'यानी एक whisper करीब 77 गुना तेज़ और उल्टा निकलता है।'
              : 'So a whisper comes out about 77 times louder and flipped upside-down.'}
          </p>
        </div>
      ),
    },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'proof: Av = -(Rc||RL)/re & Zi(base) = beta*re' : 'proof: Av = -(Rc||RL)/re & Zi(base) = beta*re'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ───────── bespoke: the four h-parameters collapsing into the re model ───────── */
const HtoReBridge: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const rows = [
    { h: 'hie', re: 'beta*re', note: lang === 'hi' ? 'base पर input impedance' : 'input impedance at the base', col: ACC.ac },
    { h: 'hfe', re: 'beta_ac', note: lang === 'hi' ? 'forward current gain' : 'forward current gain', col: ACC.good },
    { h: 'hre', re: '~ 0', note: lang === 'hi' ? 'feedback नगण्य, short' : 'feedback negligible, shorted', col: ACC.warn },
    { h: 'hoe', re: '1/ro', note: lang === 'hi' ? 'output admittance, ro = 1/hoe' : 'output admittance, ro = 1/hoe', col: ACC.dc },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'h-model -> re blueprint' : 'h-model -> re blueprint'}
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <motion.div key={r.h} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: `${r.col}12` }}>
            <span className="w-14 font-mono text-base font-black" style={{ color: r.col }}>{r.h}</span>
            <span className="font-mono text-sm" style={{ color: t.faint as string }}>{'->'}</span>
            <span className="w-24 font-mono text-base font-black" style={{ color: r.col }}>{r.re}</span>
            <span className={`flex-1 text-[12px] ${t.sub}`}>{r.note}</span>
          </motion.div>
        ))}
      </div>
      <p className={`mt-4 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'चार-parameter hybrid box सिमटकर साफ़ blueprint बनता है: input = beta*re, output = beta*Ib source, ro के parallel में।'
          : 'The four-parameter hybrid box collapses into a clean blueprint: input = beta*re, output = a beta*Ib source in parallel with ro.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: the common-emitter amplifier schematic (SVG) ───────── */
const CEAmplifierSchematic: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [acMode, setAcMode] = useState(false);
  const ink = isDarkMode ? '#cbd5e1' : '#334155';
  const dim = isDarkMode ? '#475569' : '#cbd5e1';
  // colour code: red = DC barriers (vanish at AC), blue = AC velvet ropes (short at AC)
  const dcCol = acMode ? dim : ACC.dc;
  const capCol = acMode ? ACC.good : ACC.ac;
  const res = (x: number, y: number, label: string, col: string) => (
    <g>
      <rect x={x - 7} y={y - 16} width="14" height="32" rx="2" fill="none" stroke={col} strokeWidth="2" />
      <text x={x + 12} y={y + 4} fontFamily="monospace" fontSize="10" fontWeight="800" fill={col}>{label}</text>
    </g>
  );
  const cap = (x: number, y: number, label: string) => (
    <g>
      <line x1={x - 6} y1={y - 9} x2={x - 6} y2={y + 9} stroke={capCol} strokeWidth="2.5" />
      <line x1={x + 6} y1={y - 9} x2={x + 6} y2={y + 9} stroke={capCol} strokeWidth="2.5" />
      <text x={x - 4} y={y - 14} fontFamily="monospace" fontSize="9" fontWeight="800" fill={capCol}>{label}</text>
    </g>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'common-emitter amplifier' : 'common-emitter amplifier'}
        </span>
        <button onClick={() => setAcMode((v) => v !== true)} className="min-h-[40px] sm:min-h-0 rounded-lg px-3 py-1.5 font-mono text-[11px] font-black text-black active:scale-95"
          style={{ background: acMode ? ACC.good : accent }}>
          {acMode ? (lang === 'hi' ? 'DC schematic' : 'show DC schematic') : (lang === 'hi' ? 'AC में बदलो' : 'morph to AC')}
        </button>
      </div>
      <svg viewBox="0 0 360 260" className="w-full">
        {/* Vcc rail */}
        <line x1="20" y1="22" x2="340" y2="22" stroke={dcCol} strokeWidth="2.5" />
        <text x="20" y="16" fontFamily="monospace" fontSize="10" fontWeight="800" fill={dcCol}>{acMode ? 'AC ground (Vcc)' : 'Vcc'}</text>
        {/* GND rail */}
        <line x1="20" y1="238" x2="340" y2="238" stroke={ink} strokeWidth="2.5" />
        <text x="20" y="252" fontFamily="monospace" fontSize="10" fontWeight="800" fill={t.faint as string}>GND</text>

        {/* R1 (top of divider) */}
        <line x1="110" y1="22" x2="110" y2="50" stroke={ink} strokeWidth="2" />
        {res(110, 66, 'R1', ink)}
        <line x1="110" y1="82" x2="110" y2="120" stroke={ink} strokeWidth="2" />
        {/* base node */}
        <circle cx="110" cy="120" r="3" fill={ink} />
        {/* R2 (bottom of divider) */}
        <line x1="110" y1="120" x2="110" y2="152" stroke={ink} strokeWidth="2" />
        {res(110, 168, 'R2', ink)}
        <line x1="110" y1="184" x2="110" y2="238" stroke={ink} strokeWidth="2" />

        {/* Vin -> Cin -> base */}
        <text x="14" y="124" fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.ac}>Vin</text>
        <line x1="40" y1="120" x2="62" y2="120" stroke={ink} strokeWidth="2" />
        {cap(70, 120, 'Cin')}
        <line x1="78" y1="120" x2="110" y2="120" stroke={ink} strokeWidth="2" />

        {/* base lead to transistor */}
        <line x1="110" y1="120" x2="150" y2="120" stroke={ink} strokeWidth="2" />

        {/* transistor symbol embedded */}
        <g transform="translate(150,80)">
          <foreignObject width="80" height="80" x="0" y="0">
            <div style={{ width: 80, height: 80 }}>
              <TransistorSymbol kind="npn" accent={accent} isDarkMode={isDarkMode} size={80} labels={false} />
            </div>
          </foreignObject>
        </g>

        {/* collector up to Rc */}
        <line x1="210" y1="92" x2="250" y2="92" stroke={ink} strokeWidth="2" />
        <line x1="250" y1="92" x2="250" y2="82" stroke={ink} strokeWidth="2" />
        {res(250, 66, 'Rc', dcCol)}
        <line x1="250" y1="50" x2="250" y2="22" stroke={ink} strokeWidth="2" />
        {/* collector node + Cout to output */}
        <circle cx="250" cy="92" r="3" fill={ink} />
        <line x1="250" y1="92" x2="282" y2="92" stroke={ink} strokeWidth="2" />
        {cap(290, 92, 'Cout')}
        <line x1="298" y1="92" x2="330" y2="92" stroke={ink} strokeWidth="2" />
        <text x="312" y="108" fontFamily="monospace" fontSize="10" fontWeight="800" fill={accent}>Vout</text>
        {/* RL to ground */}
        <line x1="330" y1="92" x2="330" y2="160" stroke={ink} strokeWidth="2" />
        {res(330, 176, 'RL', ink)}
        <line x1="330" y1="192" x2="330" y2="238" stroke={ink} strokeWidth="2" />

        {/* emitter down to Re + Ce */}
        <line x1="210" y1="148" x2="210" y2="170" stroke={ink} strokeWidth="2" />
        <circle cx="210" cy="170" r="3" fill={ink} />
        {res(210, 190, 'Re', ink)}
        <line x1="210" y1="206" x2="210" y2="238" stroke={ink} strokeWidth="2" />
        {/* Ce bypass in parallel with Re */}
        <line x1="210" y1="170" x2="266" y2="170" stroke={capCol} strokeWidth="2" />
        <line x1="266" y1="170" x2="266" y2="186" stroke={capCol} strokeWidth="2" />
        {cap(266, 196, 'Ce')}
        <line x1="266" y1="204" x2="266" y2="238" stroke={capCol} strokeWidth="2" />
      </svg>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {acMode
          ? (lang === 'hi'
            ? 'AC mode: Vcc rail अब AC ground है (DC barriers फीके), और caps (हरी velvet ropes) short हो गईं - बचा साफ़ AC circuit।'
            : 'AC mode: the Vcc rail is now an AC ground (DC barriers dimmed) and the caps (green velvet ropes) have shorted - leaving the clean AC circuit.')
          : (lang === 'hi'
            ? 'DC schematic: Vcc rail, R1/R2 divider, Rc, Re और coupling/bypass caps। "AC में बदलो" दबाकर देखिए caps short होती हैं और Vcc ground बनता है।'
            : 'DC schematic: the Vcc rail, the R1/R2 divider, Rc, Re and the coupling/bypass caps. Press "morph to AC" to watch the caps short and Vcc become a ground.')}
      </p>
    </Card>
  );
};

/* ───────── bespoke: source/load loading + the synthesis matrix ───────── */
const LoadingAndMatrix: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [Rs, setRs] = useState(1);    // kOhm (source)
  const [RL, setRL] = useState(6);    // kOhm (load)
  const [Rc] = useState(3);           // kOhm collector
  const [Ic] = useState(1);           // mA
  const re = 26 / Ic;                  // Ohm
  const Zi = (150 * re) / 1000;        // kOhm, beta=150
  // input divider: Vi/Vs = Zi/(Zi+Rs)
  const viRatio = Zi / (Zi + Rs);
  const rcRL = (Rc * RL) / (Rc + RL);  // kOhm
  const AvUnloaded = -(Rc * 1000) / re;
  const AvLoaded = -(rcRL * 1000) / re;

  const matrix = [
    { cfg: lang === 'hi' ? 'Fixed bias' : 'Fixed bias', zi: 'RB||βre', zo: 'RC', av: '-RC/re' },
    { cfg: lang === 'hi' ? 'Voltage divider' : 'Voltage divider', zi: 'R1||R2||βre', zo: 'RC', av: '-RC/re' },
    { cfg: lang === 'hi' ? 'Unbypassed emitter' : 'Unbypassed emitter', zi: 'RB||β(re+RE)', zo: 'RC', av: '-RC/(re+RE)' },
  ];

  return (
    <div className="space-y-4">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'source & load loading' : 'source & load loading'}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Slider label="Rs (source)" value={Rs} min={0} max={5} step={0.5} unit="kΩ" onChange={setRs} accent={ACC.warn} isDarkMode={isDarkMode} />
          <Slider label="RL (load)" value={RL} min={1} max={20} step={1} unit="kΩ" onChange={setRL} accent={ACC.ac} isDarkMode={isDarkMode} />
        </div>
        <div className="mt-3 grid gap-2 font-mono text-[12px] sm:grid-cols-2">
          <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Vi/Vs = Zi/(Zi+Rs) = <b style={{ color: ACC.warn }}>{fmt(viRatio, 2)}</b></div>
          <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Rc||RL = <b style={{ color: ACC.ac }}>{fmt(rcRL, 2)} kΩ</b></div>
          <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Av (unloaded) = <b style={{ color: accent }}>{fmt(AvUnloaded, 0)}</b></div>
          <div className="rounded-lg px-3 py-2 text-center font-black" style={{ background: `${ACC.good}1a`, color: ACC.good }}>Av_L = -(Rc||RL)/re = {fmt(AvLoaded, 0)}</div>
        </div>
        <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
          {lang === 'hi'
            ? 'Rs input पर divider बनाता है (Vi < Vs) और RL, RC के parallel में load गिराता है - दोनों gain कम करते हैं। यही "कमरे की भीड़" broadcast सोखती है।'
            : 'Rs forms a divider (Vi < Vs) and RL parallels RC to drop the load - both lower the gain. This is the room\'s crowd soaking up the broadcast.'}
        </p>
      </Card>
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'summary table' : 'summary table'}
        </div>
        <div className="overflow-x-auto overflow-y-hidden rounded-xl border" style={{ borderColor: `${accent}33` }}>
          <div className="min-w-[440px]">
          <div className="grid grid-cols-4 font-mono text-[11px] font-black" style={{ background: `${accent}1a`, color: accent }}>
            <div className="px-2 py-2">{lang === 'hi' ? 'config' : 'config'}</div>
            <div className="px-2 py-2">Zi</div>
            <div className="px-2 py-2">Zo</div>
            <div className="px-2 py-2">Av</div>
          </div>
          {matrix.map((r, i) => (
            <div key={i} className={`grid grid-cols-4 font-mono text-[11px] ${i % 2 ? '' : t.soft}`}>
              <div className={`px-2 py-2 ${t.sub}`}>{r.cfg}</div>
              <div className={`px-2 py-2 ${t.text}`}>{r.zi}</div>
              <div className={`px-2 py-2 ${t.text}`}>{r.zo}</div>
              <div className={`px-2 py-2 ${t.text}`}>{r.av}</div>
            </div>
          ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ───────── bespoke: bypassed vs unbypassed emitter gain comparison ───────── */
const BypassToggle: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [bypassed, setBypassed] = useState(true);
  const Rc = 3, RL = 6, Ic = 1, RE = 1, beta = 150; // fixed sample, all gains computed
  const re = 26 / Ic;                                 // Ohm
  const rcRL = (Rc * RL) / (Rc + RL) * 1000;          // Ohm
  const denom = bypassed ? re : re + RE * 1000;       // Ohm
  const Av = -rcRL / denom;
  const Zb = bypassed ? beta * re : beta * (re + RE * 1000); // Ohm
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'bypass cap Ce: gain बनाम stability' : 'bypass cap Ce: gain vs stability'}
        </span>
        <button onClick={() => setBypassed((v) => v !== true)} className="min-h-[40px] sm:min-h-0 rounded-lg px-3 py-1.5 font-mono text-[11px] font-black text-black active:scale-95"
          style={{ background: bypassed ? ACC.good : ACC.warn }}>
          {bypassed ? (lang === 'hi' ? 'Ce: bypassed' : 'Ce: bypassed') : (lang === 'hi' ? 'Ce: removed' : 'Ce: removed')}
        </button>
      </div>
      <div className="grid gap-2 font-mono text-[12px] sm:grid-cols-2">
        <div className={`rounded-lg px-3 py-2 ${t.soft}`}>{bypassed ? 'Zb = β·re' : 'Zb = β·(re+RE)'} = <b style={{ color: accent }}>{fmt(Zb / 1000, 1)} kΩ</b></div>
        <div className="rounded-lg px-3 py-2 text-center font-black" style={{ background: `${accent}1a`, color: accent }}>
          Av = {bypassed ? '-(Rc||RL)/re' : '-(Rc||RL)/(re+RE)'} = {fmt(Av, 0)}
        </div>
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {bypassed
          ? (lang === 'hi'
            ? 'Ce bypassed: emitter AC ground है, पूरा gain मिलता है, पर Zi कम।'
            : 'Ce bypassed: the emitter is an AC ground, you get the full gain, but Zi is low.')
          : (lang === 'hi'
            ? 'Ce हटा: पूरा AC RE से गुज़रता है -> gain गिरता है पर Zi बढ़ती है और amp ज़्यादा stable/linear हो जाता है (RE base पर β गुना दिखता है)।'
            : 'Ce removed: the full AC flows through RE -> gain falls but Zi rises and the amp is more stable/linear (RE is reflected β times at the base).')}
      </p>
    </Card>
  );
};

/* ───────── scene wiring ───────── */
const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (/signal|noise|superpos/.test(key)) return 'superposition';
  if (/two-?port|hybrid|h-param|four/.test(key)) return 'hybrid';
  if (/re model|foundation|bouncer/.test(key)) return 'remodel';
  if (/bridg/.test(key)) return 'bridge';
  if (/transform|3-step|step/.test(key)) return 'transform';
  if (/trinity|gain|zi|zo/.test(key)) return 'trinity';
  if (/early|loading|synthesis/.test(key)) return 'loading';
  return null;
};

const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE TWO SIGNALS'
    : i <= Math.floor(n * 0.6) ? 'PART II · THE MODELS'
      : i < n - 2 ? 'PART III · IN ACTION'
        : 'PART IV · LOCK IT IN';

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => (
        <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
          kicker="BJT · The Amplifier" heroKind="npn" />
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
        <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="THE AMPLIFIER"
          tag="Practice · BJT AC Analysis" title={scene.label} intro={scene.subtitle ?? ''} />
      );
    case 'recap':
      return (p) => (
        <RecapScene {...p} scene={scene}>
          <Card isDarkMode={p.isDarkMode}>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: p.accent }}>Sources</div>
            <ul className={`space-y-1 text-[12px] ${tone(p.isDarkMode).sub}`}>
              <li><a className="underline" href="https://en.wikipedia.org/wiki/Hybrid-pi_model" target="_blank" rel="noreferrer">en.wikipedia.org/wiki/Hybrid-pi_model</a> - gm = Ic/VT, rpi = beta/gm, ro = VA/Ic, hie/hfe mapping.</li>
              <li><a className="underline" href="https://www.geeksforgeeks.org/electronics-engineering/small-signal-model-of-bjt/" target="_blank" rel="noreferrer">geeksforgeeks.org - small-signal model of BJT</a> - re, rpi, gm from the Q-point.</li>
              <li><a className="underline" href="https://www.brainkart.com/article/Hybrid------equivalent-circuits-of-BJTs_13273/" target="_blank" rel="noreferrer">brainkart.com - hybrid equivalent circuits of BJTs</a> - hie/hfe/hre/hoe and the hybrid-pi link.</li>
              <li><a className="underline" href="https://forum.allaboutcircuits.com/threads/the-voltage-gain-of-a-common-emitter-circuit.148059/" target="_blank" rel="noreferrer">allaboutcircuits.com forum - CE voltage gain</a> - re = 26mV/Ie, Av = (Rc||RL)/re, 180-degree inversion.</li>
              <li><a className="underline" href="https://www.electronics-tutorials.ws/amplifier/common-emitter-amplifier.html" target="_blank" rel="noreferrer">electronics-tutorials.ws - common-emitter amplifier</a> - CE gain and phase inversion.</li>
            </ul>
          </Card>
        </RecapScene>
      );
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'superposition' && (
            <div className="space-y-2">
              <TryItYourself />
              <SuperpositionViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'hybrid' && <HtoReBridge isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'remodel' && (
            <div className="space-y-4">
              <TryItYourself />
              <ReBouncer isDarkMode={p.isDarkMode} accent={p.accent} />
              <ReDerivation isDarkMode={p.isDarkMode} accent={p.accent} />
              <GmDerivation isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'bridge' && <HtoReBridge isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'transform' && (
            <div className="space-y-4">
              <TryItYourself />
              <CouplingCapViz isDarkMode={p.isDarkMode} accent={p.accent} />
              <CEAmplifierSchematic isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'trinity' && (
            <div className="space-y-4">
              <TryItYourself />
              <GainDerivation isDarkMode={p.isDarkMode} accent={p.accent} />
              <SmallSignalGain isDarkMode={p.isDarkMode} accent={p.accent} />
              <BypassToggle isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'loading' && (
            <div className="space-y-4">
              <TryItYourself />
              <LoadingAndMatrix isDarkMode={p.isDarkMode} accent={p.accent} />
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
