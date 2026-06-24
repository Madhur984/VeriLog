/**
 * be9 - MOSFET Construction & Operation. The waterpark sluice gate analogy runs
 * through every page: gate voltage = water pressure on a SEALED GLASS gate (the
 * SiO2 oxide), so no current enters the gate; past a threshold pressure Vt the
 * river (drain current) flows.
 *
 * Kit labs reused: MosfetChannel (channel former), TransistorSymbol (nmos/pmos).
 * Bespoke labs built here (all values computed in code):
 *   - GateCurrentZero  : the sealed-glass gate draws no current
 *   - EnhDepToggle     : enhancement vs depletion, Id(VGS=0) and dual mode
 *   - RegionIndicator  : triode vs saturation driven by VDS, live region + law
 *   - VtStepThrough    : the spec proofs.derivations as a guided walkthrough
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Droplets, ExternalLink } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene, StepThrough,
  type SubScene,
} from '../_transistor/kit';
import { TransistorSymbol, MosfetChannel, Slider } from '../_transistor/analog';
import type { SubPage } from '../_transistor/kit';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/be9-mosfet-en.mp4';
const SRC_HI: string | undefined = undefined;

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };
const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : '-');

/* ───────────────── bespoke: gate current = 0 (sealed glass) ──────── */
// You raise VGS, the field bends the channel below, but no current crosses the
// oxide. Ig is shown to stay ~0 while Id climbs - the sealed-glass sluice gate.
const GateCurrentZero: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vt = 2, k = 0.5; // mA/V^2
  const [Vgs, setVgs] = useState(3);
  const over = Math.max(0, Vgs - Vt);
  const Id = (k / 2) * over * over;           // mA, saturation
  const Ig = 1e-6;                            // ~1 pA in mA units: essentially 0
  const on = Vgs > Vt;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center gap-2">
        <Droplets size={15} style={{ color: accent }} />
        <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
          {lang === 'hi' ? 'sealed glass gate - कोई current अंदर नहीं' : 'The sealed glass gate - no current in'}
        </span>
      </div>
      <svg viewBox="0 0 320 150" className="w-full">
        {/* the hand pressing on the glass */}
        <text x="30" y="30" fontFamily="monospace" fontSize="10" fill={t.faint as string}>
          {lang === 'hi' ? 'दबाव VGS' : 'pressure VGS'}
        </text>
        {/* gate plate (sealed glass) */}
        <rect x="60" y="40" width="200" height="12" rx="2" fill={isDarkMode ? '#475569' : '#94a3b8'} />
        <rect x="60" y="52" width="200" height="8" fill={accent} opacity="0.25" />
        <text x="160" y="76" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>
          SiO2 {lang === 'hi' ? '(sealed glass)' : '(sealed glass)'}
        </text>
        {/* the BLOCKED gate-current arrow */}
        <line x1="160" y1="20" x2="160" y2="40" stroke={ACC.III} strokeWidth="2.5" strokeDasharray="3 3" />
        <line x1="150" y1="46" x2="170" y2="34" stroke={ACC.III} strokeWidth="2.5" />
        <line x1="150" y1="34" x2="170" y2="46" stroke={ACC.III} strokeWidth="2.5" />
        <text x="178" y="28" fontFamily="monospace" fontSize="9" fontWeight="800" fill={ACC.III}>Ig = 0</text>
        {/* the river below: drain current */}
        <rect x="40" y="92" width="240" height="34" rx="4" fill={isDarkMode ? '#0a0e1a' : '#f1f5f9'} stroke={t.faint as string} />
        <text x="50" y="112" fontFamily="monospace" fontSize="9" fill={t.faint as string}>S</text>
        <text x="266" y="112" fontFamily="monospace" fontSize="9" fill={t.faint as string}>D</text>
        {on && [0, 1, 2, 3, 4, 5].map((i) => (
          <motion.circle key={i} r="3" fill={ACC.I} cy={109}
            animate={{ cx: [56, 264] }}
            transition={{ duration: Math.max(0.5, 1.6 - over * 0.25), repeat: Infinity, delay: i * 0.18, ease: 'linear' }} />
        ))}
        {!on && (
          <text x="160" y="113" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string}>
            {lang === 'hi' ? 'गेट बंद - नदी रुकी' : 'gate shut - river stopped'}
          </text>
        )}
      </svg>

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <Slider label="VGS" value={Vgs} min={0} max={6} step={0.2} unit="V" onChange={setVgs} accent={accent} isDarkMode={isDarkMode} display={fmt(Vgs, 1)} />
        <div className="flex gap-2">
          <div className="rounded-lg px-3 py-2 text-center font-mono text-[12px] font-black" style={{ background: `${ACC.III}1a`, color: ACC.III }}>
            Ig &lt; 1 pA
          </div>
          <div className="rounded-lg px-3 py-2 text-center font-mono text-[12px] font-black"
            style={{ background: on ? `${ACC.I}1a` : (isDarkMode ? '#1e293b' : '#e2e8f0'), color: on ? ACC.I : (t.faint as string) }}>
            {on ? `Id = ${fmt(Id)} mA` : 'Id = 0'}
          </div>
        </div>
      </div>
      <p className={`mt-3 text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? 'VGS बढ़ाइए: नदी (Id) तेज़ होती है, पर gate में current (Ig) ~0 ही रहता है। आप sealed glass पर दबाव डालते हैं, पानी हाथ में नहीं आता।'
          : 'Raise VGS: the river (Id) speeds up, yet the gate current (Ig) stays ~0. You press on sealed glass; no water enters your hand.'}
      </p>
    </Card>
  );
};

/* ───────────────── bespoke: enhancement vs depletion toggle ──────── */
// Toggle the architecture. Enhancement: Id = 0 at VGS = 0, rises only past Vt.
// Depletion: Id = IDSS at VGS = 0, widens for +VGS and pinches for -VGS.
const EnhDepToggle: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [dep, setDep] = useState(false);          // false = enhancement, true = depletion
  const [Vgs, setVgs] = useState(0);

  // Enhancement nMOS: Vt = +2, Id = (k/2)(VGS - Vt)^2 for VGS > Vt, else 0.
  // Depletion  nMOS: Vt = -2, channel implanted; Id = (k/2)(VGS - Vt)^2 for VGS > Vt.
  const k = 0.8;                                   // mA/V^2
  const Vt = dep ? -2 : 2;
  const Idss = (k / 2) * Vt * Vt;                  // depletion zero-gate current = (k/2)Vt^2
  const on = Vgs > Vt;
  const Id = on ? (k / 2) * (Vgs - Vt) * (Vgs - Vt) : 0;
  const col = dep ? ACC.good : ACC.I;

  // channel thickness 0..1: depletion always has a base channel
  const chan = Math.min(1, Math.max(0, (Vgs - Vt) / 5));

  const min = dep ? -4 : 0, max = dep ? 4 : 6;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-center gap-2">
        <button onClick={() => { setDep(false); setVgs(0); }}
          className="rounded-xl border-2 px-4 py-2 font-mono text-[12px] font-black uppercase tracking-wider transition-all active:scale-95"
          style={{ borderColor: !dep ? ACC.I : `${ACC.I}33`, background: !dep ? `${ACC.I}1a` : 'transparent', color: !dep ? ACC.I : (t.faint as string) }}>
          {lang === 'hi' ? 'Enhancement (Normally OFF)' : 'Enhancement (Normally OFF)'}
        </button>
        <button onClick={() => { setDep(true); setVgs(0); }}
          className="rounded-xl border-2 px-4 py-2 font-mono text-[12px] font-black uppercase tracking-wider transition-all active:scale-95"
          style={{ borderColor: dep ? ACC.good : `${ACC.good}33`, background: dep ? `${ACC.good}1a` : 'transparent', color: dep ? ACC.good : (t.faint as string) }}>
          {lang === 'hi' ? 'Depletion (Normally ON)' : 'Depletion (Normally ON)'}
        </button>
      </div>

      <svg viewBox="0 0 320 120" className="w-full">
        {/* substrate */}
        <rect x="30" y="62" width="260" height="44" rx="4" fill={isDarkMode ? '#0a0e1a' : '#f1f5f9'} stroke={t.faint as string} />
        <text x="160" y="100" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>p-substrate</text>
        {/* source / drain */}
        <rect x="40" y="62" width="44" height="22" rx="3" fill={col} opacity="0.5" /><text x="62" y="58" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>S (n+)</text>
        <rect x="236" y="62" width="44" height="22" rx="3" fill={col} opacity="0.5" /><text x="258" y="58" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>D (n+)</text>
        {/* oxide + gate */}
        <rect x="84" y="50" width="152" height="5" fill={isDarkMode ? '#334155' : '#cbd5e1'} />
        <rect x="84" y="40" width="152" height="8" rx="2" fill={isDarkMode ? '#475569' : '#94a3b8'} /><text x="160" y="34" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>gate</text>
        {/* implanted base channel for depletion (faint, always present) */}
        {dep && <rect x="84" y="60" width="152" height="3" fill={col} opacity="0.35" />}
        {/* live channel */}
        <motion.rect x="84" width="152" fill={col}
          animate={{ opacity: on ? 1 : (dep ? 0.35 : 0), height: 2 + chan * 6, y: 60 - chan * 6 }} />
        {on && [0, 1, 2, 3].map((i) => (
          <motion.circle key={i} r="2.5" fill={col} cy={61}
            animate={{ cx: [90, 230] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.22, ease: 'linear' }} />
        ))}
      </svg>

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <Slider label="VGS" value={Vgs} min={min} max={max} step={0.2} unit="V" onChange={setVgs} accent={col} isDarkMode={isDarkMode} display={fmt(Vgs, 1)} />
        <div className="rounded-lg px-3 py-2 text-center font-mono text-[12px] font-black"
          style={{ background: on ? `${col}1a` : (isDarkMode ? '#1e293b' : '#e2e8f0'), color: on ? col : (t.faint as string) }}>
          {on ? `Id = ${fmt(Id)} mA` : 'Id = 0 (OFF)'}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
        <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Vt = <b style={{ color: col }}>{Vt} V</b></div>
        <div className={`rounded-lg px-3 py-2 ${t.soft}`}>
          {dep ? <>Id(VGS=0) = IDSS = <b style={{ color: col }}>{fmt(Idss)} mA</b></> : <>Id(VGS=0) = <b style={{ color: col }}>0 A</b></>}
        </div>
      </div>
      <p className={`mt-3 text-[13px] ${t.sub}`}>
        {dep
          ? (lang === 'hi'
            ? 'Depletion: channel पहले से बना है, तो VGS = 0 पर भी Id = IDSS। +VGS channel चौड़ा करता है, -VGS उसे सिकोड़ता है - एक gate जो पहले से थोड़ा खुला बना है।'
            : 'Depletion: the channel is implanted, so Id = IDSS even at VGS = 0. +VGS widens it, -VGS pinches it - a gate built already cracked open.')
          : (lang === 'hi'
            ? 'Enhancement: VGS = 0 पर कोई channel नहीं, Id = 0। VGS को Vt के पार दबाते ही channel induce होता है - एक gate जो पूरी तरह बंद शुरू होता है।'
            : 'Enhancement: no channel at VGS = 0, Id = 0. Press VGS past Vt to induce one - a gate that starts fully shut.')}
      </p>
    </Card>
  );
};

/* ───────────────── bespoke: triode vs saturation region indicator ── */
// Fix VGS, sweep VDS; the boundary sits at VDS = VGS - Vt. Below it the channel
// is a resistor (triode); at/above it the channel pinches off (saturation).
const RegionIndicator: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vt = 1, k = 0.8;                 // V, mA/V^2
  const [Vgs, setVgs] = useState(3);
  const [Vds, setVds] = useState(1);
  const over = Math.max(0, Vgs - Vt);    // overdrive = Vds(sat)
  const Vdsat = over;

  const cutoff = Vgs <= Vt;
  const sat = !cutoff && Vds >= Vdsat;
  const region = cutoff ? 'CUTOFF' : sat ? 'SATURATION' : 'TRIODE';
  const regionHI = cutoff ? 'CUTOFF' : sat ? 'SATURATION' : 'TRIODE';
  const col = cutoff ? '#94a3b8' : sat ? ACC.good : ACC.II;

  // computed Id from the matching law (triode clamps at the pinch-off boundary)
  const Idtriode = k * (over * Vds - (Vds * Vds) / 2);
  const Idsat = (k / 2) * over * over;
  const Id = cutoff ? 0 : sat ? Idsat : Idtriode;

  // plot Id vs VDS for this VGS, marking the knee
  const W = 320, H = 180, pl = 40, pr = 14, pt = 14, pb = 30;
  const VdsMax = 6, IdMax = Math.max(0.6, Idsat * 1.25);
  const X = (v: number) => pl + (v / VdsMax) * (W - pl - pr);
  const Y = (i: number) => H - pb - (i / IdMax) * (H - pt - pb);
  const pts: string[] = [];
  for (let v = 0; v <= VdsMax; v += 0.1) {
    const id = cutoff ? 0 : v < Vdsat ? k * (over * v - (v * v) / 2) : Idsat;
    pts.push(`${X(v)},${Y(id)}`);
  }

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'region: VDS के साथ triode -> saturation' : 'Region: triode -> saturation as VDS rises'}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={pl} y1={pt} x2={pl} y2={H - pb} stroke={t.faint as string} strokeWidth="1.5" />
        <line x1={pl} y1={H - pb} x2={W - pr} y2={H - pb} stroke={t.faint as string} strokeWidth="1.5" />
        <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string}>VDS (V)</text>
        <text x={12} y={H / 2} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string} transform={`rotate(-90 12 ${H / 2})`}>Id (mA)</text>
        {/* knee line at Vds = Vgs - Vt */}
        {!cutoff && (
          <>
            <line x1={X(Vdsat)} y1={pt} x2={X(Vdsat)} y2={H - pb} stroke={ACC.III} strokeWidth="1" strokeDasharray="4 3" />
            <text x={X(Vdsat) + 3} y={pt + 10} fontFamily="monospace" fontSize="8" fill={ACC.III}>VDS=VGS-Vt</text>
          </>
        )}
        <motion.polyline points={pts.join(' ')} fill="none" stroke={accent} strokeWidth="2.5" />
        {/* current operating point */}
        {!cutoff && <motion.circle cx={X(Vds)} cy={Y(Id)} r="6" fill={col} animate={{ cx: X(Vds), cy: Y(Id) }} />}
      </svg>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Slider label="VGS" value={Vgs} min={0} max={5} step={0.2} unit="V" onChange={setVgs} accent={accent} isDarkMode={isDarkMode} display={fmt(Vgs, 1)} />
        <Slider label="VDS" value={Vds} min={0} max={VdsMax} step={0.2} unit="V" onChange={setVds} accent={accent} isDarkMode={isDarkMode} display={fmt(Vds, 1)} />
      </div>

      <div className="mt-3 rounded-lg px-3 py-2 text-center font-mono text-[13px] font-black" style={{ background: `${col}1a`, color: col }}>
        {lang === 'hi' ? regionHI : region}{!cutoff && ` · Id = ${fmt(Id)} mA`}
      </div>
      <p className={`mt-3 text-[12px] ${t.sub}`}>
        {cutoff
          ? (lang === 'hi' ? 'VGS <= Vt: कोई channel नहीं, Id = 0 (cutoff)।' : 'VGS <= Vt: no channel, Id = 0 (cutoff).')
          : sat
            ? (lang === 'hi'
              ? 'VDS >= VGS - Vt: channel drain के पास pinch off - Id = (k/2)(VGS-Vt)^2, VDS से लगभग स्वतंत्र।'
              : 'VDS >= VGS - Vt: channel pinches off near the drain - Id = (k/2)(VGS-Vt)^2, nearly independent of VDS.')
            : (lang === 'hi'
              ? 'VDS < VGS - Vt: channel एक resistor - Id = k[(VGS-Vt)VDS - VDS^2/2], VDS के साथ बढ़ता है।'
              : 'VDS < VGS - Vt: channel is a resistor - Id = k[(VGS-Vt)VDS - VDS^2/2], rising with VDS.')}
      </p>
    </Card>
  );
};

/* ───────────────── nMOS / pMOS mirror (uses TransistorSymbol) ─────── */
const NmosPmosMirror: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'nMOS / pMOS - sign का आईना' : 'nMOS / pMOS - the sign mirror'}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center rounded-2xl border p-3" style={{ borderColor: `${ACC.I}44`, background: `${ACC.I}0d` }}>
          <TransistorSymbol kind="nmos" accent={ACC.I} isDarkMode={isDarkMode} size={120} />
          <span className="mt-1 font-mono text-[12px] font-black" style={{ color: ACC.I }}>nMOS</span>
          <span className={`text-center text-[11px] ${t.sub}`}>{lang === 'hi' ? 'electrons · VGS > Vt (Vt > 0)' : 'electrons · VGS > Vt (Vt > 0)'}</span>
        </div>
        <div className="flex flex-col items-center rounded-2xl border p-3" style={{ borderColor: `${ACC.III}44`, background: `${ACC.III}0d` }}>
          <TransistorSymbol kind="pmos" accent={ACC.III} isDarkMode={isDarkMode} size={120} />
          <span className="mt-1 font-mono text-[12px] font-black" style={{ color: ACC.III }}>pMOS</span>
          <span className={`text-center text-[11px] ${t.sub}`}>{lang === 'hi' ? 'holes · VGS < Vt (Vt < 0)' : 'holes · VGS < Vt (Vt < 0)'}</span>
        </div>
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'pMOS, nMOS का आईना है: channel holes का, सारे control voltages का sign उल्टा। CMOS में जोड़ी बनाकर static power लगभग शून्य।'
          : 'pMOS mirrors nMOS: a hole channel, all control voltages reversed in sign. Paired in CMOS, static power is near zero.'}
      </p>
    </Card>
  );
};

/* ───────────────── Vt derivation (spec proofs.derivations) ────────── */
// Every algebraic step from the spec proofs, shown line by line, and EVERY
// number is computed here in code from one shared worked example so the reader
// can check the arithmetic at each stage rather than trusting the closed form.
const VtStepThrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const mono = (s: string) => <span className="font-mono text-[13px] font-black" style={{ color: accent }}>{s}</span>;

  // One shared worked example. Process numbers are deliberately round so the
  // closed-form k comes out clean; the rest of the chain is pure arithmetic.
  const mu = 0.06;        // electron mobility, m^2/(V·s)  (~600 cm^2/V·s)
  const Cox = 5e-3;       // gate-oxide capacitance per area, F/m^2  (~ for a few-nm oxide)
  const W = 10e-6, L = 1e-6;               // channel width / length, m
  const k_SI = mu * Cox * (W / L);         // = mu*Cox*(W/L), A/V^2 (SI)
  const k = k_SI * 1e3;                    // express in mA/V^2 for readable Id
  const Vgs = 3, Vt = 1, Vds = 1.2;        // V (Vds is in triode since Vds < Vgs-Vt = 2)
  const over = Vgs - Vt;                   // overdrive, V
  const Vdsat = over;                      // pinch-off boundary, V
  // triode integral evaluated:  INT_0^Vds (over - V) dV = over*Vds - Vds^2/2
  const integ = over * Vds - (Vds * Vds) / 2;       // V^2
  const IdTriode = k * integ;                        // mA
  // saturation = triode evaluated at Vds = Vdsat, collapses to (k/2)*over^2
  const IdSat = (k / 2) * over * over;               // mA
  const IdTriodeAtSat = k * (over * Vdsat - (Vdsat * Vdsat) / 2); // mA, must equal IdSat
  const num = (n: number, d = 3) => fmt(n, d);

  const steps = [
    {
      label: lang === 'hi' ? '1. structure + worked example' : '1. Structure + worked example',
      body: (
        <div className={`space-y-2 text-[13px] ${t.sub}`}>
          <p>
            {lang === 'hi'
              ? <>p-type substrate पर पतले SiO2 के ऊपर metal/poly gate; S और D, n+ regions। +VGS लगाने पर gate और channel एक parallel-plate capacitor बनाते हैं जिसका {mono('Cox = eps_ox / t_ox')} है।</>
              : <>A metal/poly gate over thin SiO2 over a p-type substrate; S and D are n+ regions. Apply +VGS and the gate plus channel form a parallel-plate capacitor with {mono('Cox = eps_ox / t_ox')}.</>}
          </p>
          <p className={`rounded-lg px-3 py-2 font-mono text-[11.5px] ${t.soft}`}>
            {lang === 'hi' ? 'इस proof में इस्तेमाल किए मान: ' : 'Values used throughout this proof: '}
            mu = {mu} m²/Vs, Cox = {Cox} F/m², W/L = {W / L}, Vgs = {Vgs} V, Vt = {Vt} V, Vds = {Vds} V.
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '2. depletion फिर inversion' : '2. Depletion then inversion',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>छोटा +VGS पहले holes को सतह से दूर धकेलता है (depletion region, अभी कोई mobile carrier नहीं)। VGS बढ़ने पर bands झुकते हैं और सतह invert हो जाती है: surface electron concentration = bulk hole concentration। Strong inversion पर {mono('phi_s = 2*phi_F')}, जहाँ {mono('phi_F = (kT/q)*ln(Na/ni)')}।</>
            : <>A small +VGS first repels holes from the surface (a depletion region, no mobile carriers yet). As VGS rises, the bands bend until the surface inverts: surface electron concentration equals bulk hole concentration. Strong inversion is reached at {mono('phi_s = 2*phi_F')}, where {mono('phi_F = (kT/q)*ln(Na/ni)')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? '3. threshold Vt' : '3. Threshold Vt',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>strong inversion तक पहुँचने वाला gate voltage ही threshold है: {mono('Vt = Vfb + 2*phi_F + Qdep/Cox')}, जहाँ Vfb flat-band voltage है और {mono('Qdep = sqrt(2*q*eps_si*Na*(2*phi_F))')} depletion charge per area। VGS &lt; Vt पर कोई inversion नहीं, तो {mono('Id = 0')} (cutoff)।</>
            : <>The gate voltage that just reaches strong inversion is the threshold: {mono('Vt = Vfb + 2*phi_F + Qdep/Cox')}, where Vfb is the flat-band voltage and {mono('Qdep = sqrt(2*q*eps_si*Na*(2*phi_F))')} is the depletion charge per area. For VGS &lt; Vt there is no inversion, so {mono('Id = 0')} (cutoff).</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? '4. channel charge Qn(y)' : '4. Channel charge Qn(y)',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>source (y=0) से drain (y=L) तक local potential V(y) के साथ, oxide capacitor पर voltage (VGS - V(y)) है और threshold के ऊपर वाला हिस्सा (VGS - Vt - V(y))। तो mobile inversion charge per area {mono('Qn(y) = Cox*(VGS - Vt - V(y))')}; width W पर charge/length = {mono('W*Cox*(VGS - Vt - V(y))')}।</>
            : <>With local potential V(y) from source (y=0) to drain (y=L), the voltage across the oxide capacitor is (VGS - V(y)) and the part above threshold is (VGS - Vt - V(y)). So the mobile inversion charge per area is {mono('Qn(y) = Cox*(VGS - Vt - V(y))')}; over width W the charge per length is {mono('W*Cox*(VGS - Vt - V(y))')}.</>}
        </p>
      ),
    },
    {
      label: lang === 'hi' ? '5. triode: integrate' : '5. Triode: integrate',
      body: (
        <div className={`space-y-2 text-[13px] ${t.sub}`}>
          <p>
            {lang === 'hi'
              ? <>drift current {mono('Id = mu*W*Cox*(VGS - Vt - V)*(dV/dy)')}; Id channel भर में constant है, तो variables अलग कीजिए: {mono('Id*dy = mu*W*Cox*(VGS - Vt - V) dV')}। y: 0 to L और V: 0 to VDS पर integrate कीजिए।</>
              : <>Drift current {mono('Id = mu*W*Cox*(VGS - Vt - V)*(dV/dy)')}; Id is constant along the channel, so separate variables: {mono('Id*dy = mu*W*Cox*(VGS - Vt - V) dV')}. Integrate y over 0 to L and V over 0 to VDS.</>}
          </p>
          <p className={`rounded-lg px-3 py-2 font-mono text-[11.5px] leading-relaxed ${t.soft}`}>
            INT_0^Vds (Vgs-Vt - V) dV = (Vgs-Vt)·Vds - Vds²/2<br />
            = ({over})·({Vds}) - ({Vds})²/2 = {num(over * Vds)} - {num((Vds * Vds) / 2)} = <b style={{ color: accent }}>{num(integ)} V²</b>
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '6. triode law Id' : '6. Triode law Id',
      body: (
        <div className={`space-y-2 text-[13px] ${t.sub}`}>
          <p>
            {lang === 'hi'
              ? <>Id·L = mu·W·Cox·[(VGS-Vt)VDS - VDS²/2]। दोनों तरफ़ L से भाग दीजिए और {mono('k = mu*Cox*(W/L)')} परिभाषित कीजिए: {mono('Id = k[(VGS-Vt)VDS - VDS^2/2]')}।</>
              : <>Id·L = mu·W·Cox·[(VGS-Vt)VDS - VDS²/2]. Divide both sides by L and define {mono('k = mu*Cox*(W/L)')}: {mono('Id = k[(VGS-Vt)VDS - VDS^2/2]')}.</>}
          </p>
          <p className={`rounded-lg px-3 py-2 font-mono text-[11.5px] leading-relaxed ${t.soft}`}>
            k = mu·Cox·(W/L) = {mu}·{Cox}·{W / L} = {num(k_SI, 4)} A/V² = <b style={{ color: accent }}>{num(k)} mA/V²</b><br />
            Id = k · {num(integ)} = {num(k)} · {num(integ)} = <b style={{ color: accent }}>{num(IdTriode)} mA</b>
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '7. pinch-off + saturation' : '7. Pinch-off + saturation',
      body: (
        <div className={`space-y-2 text-[13px] ${t.sub}`}>
          <p>
            {lang === 'hi'
              ? <>Qn तब शून्य होता है जब V(y) = VGS - Vt, यानी channel drain पर pinch off होता है जब {mono('VDS(sat) = VGS - Vt')} = {num(Vdsat, 2)} V। यह मान triode law में रखिए:</>
              : <>Qn vanishes where V(y) = VGS - Vt, i.e. the channel pinches off at the drain when {mono('VDS(sat) = VGS - Vt')} = {num(Vdsat, 2)} V. Substitute this VDS into the triode law:</>}
          </p>
          <p className={`rounded-lg px-3 py-2 font-mono text-[11.5px] leading-relaxed ${t.soft}`}>
            Id = k[(Vgs-Vt)·Vdsat - Vdsat²/2] = k[(Vgs-Vt)² - (Vgs-Vt)²/2] = (k/2)(Vgs-Vt)²<br />
            = ({num(k)}/2)·({over})² = <b style={{ color: accent }}>{num(IdSat)} mA</b>
            <span className={t.faint}> {' '}( triode-at-knee = {num(IdTriodeAtSat)} mA, equal ✓ )</span>
          </p>
          <p>
            {lang === 'hi'
              ? <>VDS &gt; VDS(sat) पर pinch-off बिंदु थोड़ा source की ओर खिसकता है पर conducting हिस्से पर voltage ~ VDS(sat) रहता है, इसलिए {mono('Id = (k/2)(VGS - Vt)^2')} VDS से लगभग स्वतंत्र (आदर्श current source)।</>
              : <>For VDS &gt; VDS(sat) the pinch-off point creeps toward the source but the voltage across the conducting part stays ~ VDS(sat), so {mono('Id = (k/2)(VGS - Vt)^2')} stays nearly independent of VDS (an ideal current source).</>}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '8. gate current = 0' : '8. Gate current = 0',
      body: (
        <p className={`text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>gate को channel से एक insulating SiO2 अलग करता है; gate+channel एक capacitor है और DC steady state में capacitor कोई current नहीं गुज़ारता: {mono('Ig = Cox*A*(dVGS/dt) -> 0')} स्थिर VGS पर। तो {mono('Ig ~ 0')} (सिर्फ़ fA-pA leakage), MOSFET voltage-controlled, input resistance बहुत बड़ा। तुलना: BJT का base असली {mono('Ib = Ic/beta')} खींचता है।</>
            : <>An insulating SiO2 separates gate from channel; gate+channel form a capacitor, and a capacitor passes no DC current: {mono('Ig = Cox*A*(dVGS/dt) -> 0')} at constant VGS. So {mono('Ig ~ 0')} (only fA-pA leakage), the MOSFET is voltage-controlled with an enormous input resistance. Contrast: a BJT base draws a real {mono('Ib = Ic/beta')}.</>}
        </p>
      ),
    },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'proof: Vt और current laws कहाँ से आते हैं' : 'Proof: where Vt and the current laws come from'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ───────────────── recap sources list ─────────────────────────────── */
const SOURCES: { label: string; url: string }[] = [
  { label: 'MOSFET current equation (triode and saturation, VDS = VGS - Vt boundary)', url: 'https://www.electricity-magnetism.org/mosfet-current-equation/' },
  { label: 'T. H. Lee, MOS Device Physics (channel-charge derivation, k = mu*Cox*W/L)', url: 'https://www.ee.columbia.edu/~kinget/EE4303_S02/docs/MOS_Device_Physics_Tom_Lee.pdf' },
  { label: 'Depletion and enhancement modes (Vt sign conventions, nMOS vs pMOS)', url: 'https://en.wikipedia.org/wiki/Depletion_and_enhancement_modes' },
  { label: 'nMOS vs pMOS and enhancement vs depletion mode MOSFETs', url: 'https://www.circuitbread.com/tutorials/nmos-vs-pmos-and-enhancement-vs-depletion-mode-mosfets' },
  { label: 'Georgia Tech ECE3050 (Leach), MOSFET device equations', url: 'https://leachlegacy.ece.gatech.edu/ece3050/notes/mosfet/mosfet2Rev.pdf' },
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
            <ExternalLink size={13} className="mt-0.5 shrink-0" style={{ color: accent }} />
            <a href={s.url} target="_blank" rel="noreferrer" className={`text-[13px] underline-offset-2 hover:underline ${t.sub}`}>
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

/* ───────────────── scene mapping ──────────────────────────────────── */
const partAt = (i: number, n: number): string =>
  i <= 1 ? 'PART I · FOUNDATIONS'
    : i <= Math.floor(n * 0.6) ? 'PART II · THE PHYSICS'
      : i < n - 2 ? 'PART III · IN ACTION'
        : 'PART IV · LOCK IT IN';

function componentFor(scene: SubScene): React.FC<any> {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="MOSFET · The Voltage Gate" heroKind="nmos" />;
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
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="THE VOLTAGE GATE" tag="Practice · MOSFET Construction" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene}><SourcesList isDarkMode={p.isDarkMode} accent={p.accent} /></RecapScene>;
    default:
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {/s02_|s05_|gatecurrentzero/.test(key) && <GateCurrentZero isDarkMode={p.isDarkMode} accent={p.accent} />}
          {/s03_|s06_|s07_|depletion|enhancement|family/.test(key) && <EnhDepToggle isDarkMode={p.isDarkMode} accent={p.accent} />}
          {/s04_|stack/.test(key) && <MosfetChannel isDarkMode={p.isDarkMode} accent={p.accent} />}
          {/s08_|inversion/.test(key) && (
            <div className="space-y-4">
              <MosfetChannel isDarkMode={p.isDarkMode} accent={p.accent} />
              <VtStepThrough isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {/s09_|region|operating/.test(key) && <RegionIndicator isDarkMode={p.isDarkMode} accent={p.accent} />}
          {/s10_|diagnostic|matrix|pmos/.test(key) && <NmosPmosMirror isDarkMode={p.isDarkMode} accent={p.accent} />}
        </TheoryScene>
      );
  }
}

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i, arr) => ({
  id: slug(scene.id),
  part: partAt(i, arr.length),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene),
}));
