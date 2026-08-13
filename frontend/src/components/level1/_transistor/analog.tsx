/**
 * Shared ANALOG visual primitives for the transistor track (Basic Electronics 6-10).
 *
 * Correct-by-construction and theme-aware (isDarkMode + accent), framer-motion.
 * Every electrical result is COMPUTED in code here - never hardcoded - so the
 * curves, load lines, Q-points and gains always agree with the physics.
 *
 *   - Slider            : labeled range input used by the labs
 *   - TransistorSymbol  : schematic symbols (npn/pnp BJT, n/p MOSFET, n-JFET)
 *   - LoadLineLab       : interactive DC load line + live Q-point (be7)
 *   - OutputCurves      : Ic-Vce characteristic family with the load line (be6/be7)
 *   - SmallSignalGain   : live re-model voltage-gain calculator + waves (be8)
 *   - MosfetChannel     : VGS grows the inversion channel, Id turns on (be9)
 *   - JfetTransfer      : Shockley transfer curve Id = Idss(1-Vgs/Vp)^2 (be10)
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { tone, useSubLang } from '../_subtractor/kit';
import { TryItYourself } from '../../ui/TryItYourself';

const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : '-');

/* ───────────────────────── slider ──────────────────────────────── */

export const Slider: React.FC<{
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; unit?: string; accent: string; isDarkMode: boolean; display?: string;
}> = ({ label, value, min, max, step = 1, onChange, unit, accent, isDarkMode, display }) => {
  const t = tone(isDarkMode);
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className={`font-mono text-[11px] uppercase tracking-wider ${t.faint}`}>{label}</span>
        <span className="font-mono text-[13px] font-black tabular-nums" style={{ color: accent }}>
          {display ?? value}{unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer appearance-none rounded-full"
        style={{ accentColor: accent, height: 6, background: isDarkMode ? '#1e293b' : '#e2e8f0' }}
      />
    </label>
  );
};

/* ───────────────────────── transistor symbols ──────────────────── */

export type DeviceKind = 'npn' | 'pnp' | 'nmos' | 'pmos' | 'njfet';

export const TransistorSymbol: React.FC<{
  kind: DeviceKind; accent: string; isDarkMode: boolean; size?: number; animate?: boolean; labels?: boolean;
}> = ({ kind, accent, isDarkMode, size = 150, animate = true, labels = true }) => {
  const t = tone(isDarkMode);
  const ink = isDarkMode ? '#e2e8f0' : '#0f172a';
  const lbl = (x: number, y: number, s: string) =>
    labels ? <text x={x} y={y} fontFamily="monospace" fontSize="11" fontWeight="800" fill={t.faint as string}>{s}</text> : null;
  const pulse = animate ? { animate: { opacity: [0.55, 1, 0.55] as number[] }, transition: { duration: 1.6, repeat: Infinity } } : {};

  if (kind === 'nmos' || kind === 'pmos') {
    const p = kind === 'pmos';
    return (
      <svg viewBox="0 0 120 120" width={size} height={size} className="h-auto max-w-full">
        {/* gate */}
        <line x1="20" y1="60" x2="48" y2="60" stroke={ink} strokeWidth="3" />
        <line x1="48" y1="34" x2="48" y2="86" stroke={ink} strokeWidth="3" />
        {/* insulated channel (3 segments) */}
        {[40, 60, 80].map((y) => <line key={y} x1="56" y1={y - 8} x2="56" y2={y + 8} stroke={accent} strokeWidth="4" />)}
        {/* drain / source leads */}
        <line x1="56" y1="40" x2="84" y2="40" stroke={ink} strokeWidth="3" />
        <line x1="84" y1="40" x2="84" y2="20" stroke={ink} strokeWidth="3" />
        <line x1="56" y1="80" x2="84" y2="80" stroke={ink} strokeWidth="3" />
        <line x1="84" y1="80" x2="84" y2="100" stroke={ink} strokeWidth="3" />
        {/* body arrow (in for nMOS, out for pMOS) */}
        <line x1="56" y1="60" x2="84" y2="60" stroke={ink} strokeWidth="3" />
        <polygon points={p ? '64,55 64,65 56,60' : '76,55 76,65 84,60'} fill={accent} />
        <motion.circle cx="60" cy="60" r="34" fill="none" stroke={accent} strokeWidth="1.5" {...(pulse as any)} opacity={0.5} />
        {lbl(88, 18, 'D')}{lbl(6, 64, 'G')}{lbl(88, 106, 'S')}
      </svg>
    );
  }

  if (kind === 'njfet') {
    return (
      <svg viewBox="0 0 120 120" width={size} height={size} className="h-auto max-w-full">
        {/* channel bar */}
        <line x1="56" y1="30" x2="56" y2="90" stroke={accent} strokeWidth="4" />
        {/* drain/source */}
        <line x1="56" y1="34" x2="84" y2="34" stroke={ink} strokeWidth="3" /><line x1="84" y1="34" x2="84" y2="18" stroke={ink} strokeWidth="3" />
        <line x1="56" y1="86" x2="84" y2="86" stroke={ink} strokeWidth="3" /><line x1="84" y1="86" x2="84" y2="102" stroke={ink} strokeWidth="3" />
        {/* gate with arrow pointing into channel (n-channel) */}
        <line x1="20" y1="60" x2="56" y2="60" stroke={ink} strokeWidth="3" />
        <polygon points="44,55 44,65 54,60" fill={accent} />
        <motion.circle cx="60" cy="60" r="34" fill="none" stroke={accent} strokeWidth="1.5" {...(pulse as any)} opacity={0.5} />
        {lbl(88, 16, 'D')}{lbl(6, 64, 'G')}{lbl(88, 108, 'S')}
      </svg>
    );
  }

  // BJT npn / pnp
  const npn = kind === 'npn';
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className="h-auto max-w-full">
      {/* base bar + lead */}
      <line x1="20" y1="60" x2="50" y2="60" stroke={ink} strokeWidth="3" />
      <line x1="50" y1="40" x2="50" y2="80" stroke={ink} strokeWidth="4" />
      {/* collector lead */}
      <line x1="50" y1="52" x2="82" y2="32" stroke={ink} strokeWidth="3" />
      <line x1="82" y1="32" x2="82" y2="16" stroke={ink} strokeWidth="3" />
      {/* emitter lead with arrow */}
      <line x1="50" y1="68" x2="82" y2="88" stroke={ink} strokeWidth="3" />
      <line x1="82" y1="88" x2="82" y2="104" stroke={ink} strokeWidth="3" />
      {/* emitter arrow: OUT of base for npn, INTO base for pnp */}
      <polygon points={npn ? '74,78 82,88 70,86' : '60,71 50,68 62,63'} fill={accent} />
      <motion.circle cx="58" cy="60" r="36" fill="none" stroke={accent} strokeWidth="1.5" {...(pulse as any)} opacity={0.5} />
      {lbl(86, 14, 'C')}{lbl(6, 64, 'B')}{lbl(86, 110, 'E')}
    </svg>
  );
};

/* ───────────────────────── DC load line lab ────────────────────── */
// Move the sliders; the DC load line, the Q-point and the operating region all
// recompute live. Ic = beta*Ib (clamped at saturation Vcc/Rc); Vce = Vcc - Ic*Rc.

export const LoadLineLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [Vcc, setVcc] = useState(12);
  const [Rc, setRc] = useState(2);      // kOhm
  const [Ib, setIb] = useState(20);     // uA
  const [beta, setBeta] = useState(100);

  const icSat = Vcc / Rc;               // mA  (V / kOhm)
  const icDrive = (beta * Ib) / 1000;   // mA  (beta * uA)
  const icq = Math.min(icDrive, icSat); // clamp into saturation
  const vceq = Math.max(0, Vcc - icq * Rc);
  const region = Ib <= 0 ? 'Cutoff' : icDrive >= icSat ? 'Saturation' : 'Active';
  const regionHI = region === 'Cutoff' ? 'Cutoff (बंद)' : region === 'Saturation' ? 'Saturation (पूरा ON)' : 'Active (amplify)';
  const regionColor = region === 'Active' ? '#34d399' : region === 'Saturation' ? '#fb7185' : '#94a3b8';

  // plot geometry
  const W = 320, H = 210, pl = 42, pr = 14, pt = 14, pb = 34;
  const X = (vce: number) => pl + (vce / Vcc) * (W - pl - pr);
  const Y = (ic: number) => H - pb - (ic / icSat) * (H - pt - pb);

  return (
    <div className={`relative rounded-3xl border p-4 pt-12 sm:p-5 sm:pt-5 ${t.card}`}>
      <TryItYourself corner />
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'DC load line + Q-point' : 'DC load line + Q-point'}
      </div>
      <div className="grid gap-5 md:grid-cols-[320px_1fr]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* grid */}
          {[0.25, 0.5, 0.75].map((f) => (
            <g key={f}>
              <line x1={X(Vcc * f)} y1={pt} x2={X(Vcc * f)} y2={H - pb} stroke={isDarkMode ? '#1e293b' : '#eef2f7'} strokeWidth="1" />
              <line x1={pl} y1={Y(icSat * f)} x2={W - pr} y2={Y(icSat * f)} stroke={isDarkMode ? '#1e293b' : '#eef2f7'} strokeWidth="1" />
            </g>
          ))}
          {/* axes */}
          <line x1={pl} y1={pt} x2={pl} y2={H - pb} stroke={t.faint as string} strokeWidth="1.5" />
          <line x1={pl} y1={H - pb} x2={W - pr} y2={H - pb} stroke={t.faint as string} strokeWidth="1.5" />
          <text x={W / 2} y={H - 6} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string}>Vce (V)</text>
          <text x={12} y={H / 2} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string} transform={`rotate(-90 12 ${H / 2})`}>Ic (mA)</text>
          {/* load line */}
          <motion.line x1={X(Vcc)} y1={Y(0)} x2={X(0)} y2={Y(icSat)} stroke={accent} strokeWidth="2.5"
            initial={false} animate={{ x1: X(Vcc), y1: Y(0), x2: X(0), y2: Y(icSat) }} />
          {/* projections */}
          <line x1={X(vceq)} y1={Y(icq)} x2={X(vceq)} y2={Y(0)} stroke={regionColor} strokeWidth="1" strokeDasharray="3 3" />
          <line x1={X(vceq)} y1={Y(icq)} x2={pl} y2={Y(icq)} stroke={regionColor} strokeWidth="1" strokeDasharray="3 3" />
          {/* Q point */}
          <motion.circle cx={X(vceq)} cy={Y(icq)} r="6" fill={regionColor} animate={{ cx: X(vceq), cy: Y(icq) }} />
          <text x={X(vceq) + 9} y={Y(icq) - 6} fontFamily="monospace" fontSize="10" fontWeight="800" fill={regionColor}>Q</text>
        </svg>

        <div className="space-y-3">
          <Slider label="Vcc" value={Vcc} min={4} max={20} step={1} unit="V" onChange={setVcc} accent={accent} isDarkMode={isDarkMode} />
          <Slider label="Rc" value={Rc} min={0.5} max={6} step={0.5} unit="kΩ" onChange={setRc} accent={accent} isDarkMode={isDarkMode} />
          <Slider label="Ib" value={Ib} min={0} max={80} step={2} unit="µA" onChange={setIb} accent={accent} isDarkMode={isDarkMode} />
          <Slider label="β" value={beta} min={50} max={300} step={10} onChange={setBeta} accent={accent} isDarkMode={isDarkMode} />
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[12px]">
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Icq = <b style={{ color: accent }}>{fmt(icq)} mA</b></div>
            <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Vceq = <b style={{ color: accent }}>{fmt(vceq)} V</b></div>
          </div>
          <div className="rounded-lg px-3 py-2 text-center font-mono text-[12px] font-black" style={{ background: `${regionColor}1a`, color: regionColor }}>
            {lang === 'hi' ? regionHI : region}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────── output characteristic curves ────────── */
// Ic-Vce family for a set of base currents, with the load line overlaid.

export const OutputCurves: React.FC<{ isDarkMode: boolean; accent: string; beta?: number }>
  = ({ isDarkMode, accent, beta = 100 }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vcc = 12, Rc = 2;
  const icSat = Vcc / Rc;
  const ibSet = [10, 20, 30, 40, 50]; // uA
  const W = 320, H = 210, pl = 42, pr = 14, pt = 14, pb = 34;
  const X = (vce: number) => pl + (vce / Vcc) * (W - pl - pr);
  const Y = (ic: number) => H - pb - (ic / icSat) * (H - pt - pb);
  // simple knee model: rises fast then flattens at Ic=beta*Ib with slight Early slope
  const curve = (ibUA: number) => {
    const icFlat = (beta * ibUA) / 1000;
    const pts: string[] = [];
    for (let v = 0; v <= Vcc; v += 0.4) {
      const knee = 1 - Math.exp(-v / 0.35);
      const early = 1 + v / 90;
      const ic = Math.min(icFlat * knee * early, icSat * 1.2);
      pts.push(`${X(v)},${Y(ic)}`);
    }
    return pts.join(' ');
  };
  return (
    <div className={`rounded-3xl border p-4 sm:p-5 ${t.card}`}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Output characteristics (Ic vs Vce)' : 'Output characteristics (Ic vs Vce)'}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={pl} y1={pt} x2={pl} y2={H - pb} stroke={t.faint as string} strokeWidth="1.5" />
        <line x1={pl} y1={H - pb} x2={W - pr} y2={H - pb} stroke={t.faint as string} strokeWidth="1.5" />
        <text x={W / 2} y={H - 6} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string}>Vce (V)</text>
        <text x={12} y={H / 2} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string} transform={`rotate(-90 12 ${H / 2})`}>Ic (mA)</text>
        {ibSet.map((ib, i) => (
          <motion.polyline key={ib} points={curve(ib)} fill="none" stroke={accent} strokeWidth="2"
            style={{ opacity: 0.35 + (i / ibSet.length) * 0.6 }}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: i * 0.12 }} />
        ))}
        {/* load line */}
        <line x1={X(Vcc)} y1={Y(0)} x2={X(0)} y2={Y(icSat)} stroke="#fb7185" strokeWidth="2" strokeDasharray="5 4" />
        <text x={X(Vcc) - 4} y={Y(0) - 6} textAnchor="end" fontFamily="monospace" fontSize="9" fill="#fb7185">load line</text>
        {ibSet.map((ib) => <text key={ib} x={W - pr - 2} y={Y(Math.min((beta * ib) / 1000, icSat)) + 3} textAnchor="end" fontFamily="monospace" fontSize="8" fill={t.faint as string}>{ib}µA</text>)}
      </svg>
    </div>
  );
};

/* ───────────────────────── small-signal gain lab ───────────────── */
// re = VT/IE, Av = -(Rc||RL)/re. Live numbers + an animated in/out wave pair
// showing the 180-degree inversion and the amplification.

export const SmallSignalGain: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [Ic, setIc] = useState(1);     // mA
  const [Rc, setRc] = useState(3);     // kOhm
  const [RL, setRL] = useState(6);     // kOhm
  const [beta, setBeta] = useState(150);

  const re = 26 / Ic;                   // Ohm  (VT=26mV, IE~IC)
  const rcRL = (Rc * RL) / (Rc + RL);   // kOhm
  const Av = -(rcRL * 1000) / re;       // unitless
  const Zin = beta * re;                // Ohm
  const gm = 1 / re;                    // S

  // wave paths: input small sine, output = inverted, scaled (clamped to a band)
  const W = 320, H = 120, mid = H / 2;
  const inAmp = 14, outAmp = Math.min(46, inAmp * Math.min(Math.abs(Av) / 30, 3.2));
  const wave = (amp: number, sign: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 4) pts.push(`${x},${mid - sign * amp * Math.sin((x / W) * Math.PI * 4)}`);
    return pts.join(' ');
  };

  return (
    <div className={`relative rounded-3xl border p-4 pt-12 sm:p-5 sm:pt-5 ${t.card}`}>
      <TryItYourself corner />
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 're-model voltage gain' : 're-model voltage gain'}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <Slider label="Ic" value={Ic} min={0.2} max={8} step={0.2} unit="mA" onChange={setIc} accent={accent} isDarkMode={isDarkMode} display={fmt(Ic, 1)} />
          <Slider label="Rc" value={Rc} min={1} max={10} step={0.5} unit="kΩ" onChange={setRc} accent={accent} isDarkMode={isDarkMode} />
          <Slider label="RL" value={RL} min={1} max={20} step={1} unit="kΩ" onChange={setRL} accent={accent} isDarkMode={isDarkMode} />
          <Slider label="β" value={beta} min={50} max={300} step={10} onChange={setBeta} accent={accent} isDarkMode={isDarkMode} />
        </div>
        <div className="space-y-2 font-mono text-[12px]">
          <div className={`rounded-lg px-3 py-2 ${t.soft}`}>re = VT/IE = 26mV / {fmt(Ic, 1)}mA = <b style={{ color: accent }}>{fmt(re, 1)} Ω</b></div>
          <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Rc‖RL = <b style={{ color: accent }}>{fmt(rcRL)} kΩ</b></div>
          <div className={`rounded-lg px-3 py-2 ${t.soft}`}>Zin(base) = β·re = <b style={{ color: accent }}>{fmt(Zin / 1000)} kΩ</b></div>
          <div className="rounded-lg px-3 py-2 text-center text-[15px] font-black" style={{ background: `${accent}1a`, color: accent }}>
            Av = -(Rc‖RL)/re = {fmt(Av, 1)}
          </div>
        </div>
      </div>
      {/* waves */}
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full">
        <line x1="0" y1={mid} x2={W} y2={mid} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="1" />
        <motion.polyline points={wave(inAmp, 1)} fill="none" stroke="#38bdf8" strokeWidth="2" />
        <motion.polyline points={wave(outAmp, -1)} fill="none" stroke={accent} strokeWidth="2.5"
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.6, repeat: Infinity }} />
        <text x="4" y="14" fontFamily="monospace" fontSize="9" fill="#38bdf8">Vin</text>
        <text x="4" y={H - 6} fontFamily="monospace" fontSize="9" fill={accent}>Vout (×{fmt(Math.abs(Av), 0)}, inverted)</text>
      </svg>
      <p className={`mt-2 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'Ic बढ़ाइए -> re घटता है -> gain बढ़ता है। output उल्टा (180°) है - यही CE amplifier की पहचान है।'
          : 'Raise Ic -> re falls -> gain rises. The output is inverted (180°) - the signature of a CE amplifier.'}
      </p>
    </div>
  );
};

/* ───────────────────────── MOSFET channel former ───────────────── */
// VGS slider: below Vt no channel (cutoff); above Vt an inversion layer forms
// and grows, Id = (k/2)(VGS-Vt)^2 (saturation). The channel + electrons animate.

export const MosfetChannel: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Vt = 2, k = 0.5; // mA/V^2
  const [Vgs, setVgs] = useState(0);
  const on = Vgs > Vt;
  const over = Math.max(0, Vgs - Vt);
  const Id = (k / 2) * over * over;             // mA (saturation)
  const chan = Math.min(1, over / 3);           // 0..1 channel thickness

  return (
    <div className={`relative rounded-3xl border p-4 pt-12 sm:p-5 sm:pt-5 ${t.card}`}>
      <TryItYourself corner />
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Channel कैसे बनता है' : 'Forming the channel'}
      </div>
      <svg viewBox="0 0 320 150" className="w-full">
        {/* substrate */}
        <rect x="30" y="80" width="260" height="50" rx="4" fill={isDarkMode ? '#0a0e1a' : '#f1f5f9'} stroke={t.faint as string} />
        <text x="160" y="122" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>p-substrate</text>
        {/* source / drain n+ wells */}
        <rect x="40" y="80" width="46" height="26" rx="3" fill={accent} opacity="0.5" /><text x="63" y="76" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>S (n+)</text>
        <rect x="234" y="80" width="46" height="26" rx="3" fill={accent} opacity="0.5" /><text x="257" y="76" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>D (n+)</text>
        {/* oxide + gate */}
        <rect x="86" y="66" width="148" height="6" fill={isDarkMode ? '#334155' : '#cbd5e1'} />
        <rect x="86" y="54" width="148" height="10" rx="2" fill={isDarkMode ? '#475569' : '#94a3b8'} /><text x="160" y="48" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>gate</text>
        {/* inversion channel */}
        <motion.rect x="86" y={78 - chan * 6} width="148" height={2 + chan * 6} fill={on ? accent : 'transparent'}
          animate={{ opacity: on ? 1 : 0, height: 2 + chan * 6, y: 78 - chan * 6 }} />
        {/* electrons flowing when on */}
        {on && [0, 1, 2, 3, 4].map((i) => (
          <motion.circle key={i} r="2.5" fill={accent} cy={79}
            animate={{ cx: [90, 230] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2, ease: 'linear' }} />
        ))}
      </svg>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <Slider label="VGS" value={Vgs} min={0} max={5} step={0.2} unit="V" onChange={setVgs} accent={accent} isDarkMode={isDarkMode} display={fmt(Vgs, 1)} />
        <div className="rounded-lg px-3 py-2 text-center font-mono text-[12px] font-black"
          style={{ background: on ? `${accent}1a` : (isDarkMode ? '#1e293b' : '#e2e8f0'), color: on ? accent : (t.faint as string) }}>
          {on ? `Id = ${fmt(Id)} mA` : (lang === 'hi' ? 'OFF (VGS < Vt)' : 'OFF (VGS < Vt)')}
        </div>
      </div>
      <p className={`mt-2 text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? `Vt = ${Vt}V. VGS इससे ऊपर जाते ही inversion channel बनता है और Id = (k/2)(VGS-Vt)² से बढ़ता है।`
          : `Vt = ${Vt}V. Push VGS past it and an inversion channel forms; Id grows as (k/2)(VGS-Vt)².`}
      </p>
    </div>
  );
};

/* ───────────────────────── bias stability lab ──────────────────── */
// Sweep beta and watch the Q-point: fixed bias (Ic = beta*Ib) drifts wildly,
// voltage-divider bias (Ic ~ (Vth-Vbe)/Re) barely moves. The whole reason the
// voltage divider wins, shown as a live bar chart across beta = 50..300.

export const BiasStability: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [beta, setBeta] = useState(150);
  const Vcc = 12, Vbe = 0.7;
  // fixed bias
  const Rb = 470;                                   // kOhm
  const ibFixed = (Vcc - Vbe) / Rb;                 // mA  (V/kOhm)
  const icFixed = (b: number) => b * ibFixed;       // mA
  // voltage-divider bias
  const R1 = 39, R2 = 10, Re = 1;                   // kOhm
  const Vth = (Vcc * R2) / (R1 + R2);
  const Rth = (R1 * R2) / (R1 + R2);
  const icDiv = (b: number) => (Vth - Vbe) / (Re + Rth / (b + 1)); // ~ Ie ~ Ic

  const betas = [50, 100, 150, 200, 250, 300];
  const fixedVals = betas.map(icFixed);
  const divVals = betas.map(icDiv);
  const drift = (vals: number[]) => ((Math.max(...vals) - Math.min(...vals)) / (vals.reduce((a, b) => a + b, 0) / vals.length)) * 100;
  const maxIc = Math.max(...fixedVals);

  const Bars: React.FC<{ vals: number[]; title: string; col: string }> = ({ vals, title, col }) => (
    <div className="rounded-2xl border p-4" style={{ borderColor: `${col}44`, background: `${col}0d` }}>
      <div className="mb-2 font-mono text-[11px] font-black uppercase tracking-wider" style={{ color: col }}>{title}</div>
      <div className="flex h-24 items-end gap-1.5">
        {vals.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end">
            <motion.div className="w-full rounded-t" style={{ background: col }} animate={{ height: `${(v / maxIc) * 100}%` }} />
            <span className={`mt-1 font-mono text-[8px] ${t.faint}`}>{betas[i]}</span>
          </div>
        ))}
      </div>
      <div className={`mt-2 font-mono text-[11px] ${t.sub}`}>
        Ic(β={beta}) = <b style={{ color: col }}>{fmt(title.includes('Fixed') ? icFixed(beta) : icDiv(beta))} mA</b>
        {' · '}{lang === 'hi' ? 'बहाव' : 'drift'} <b style={{ color: col }}>{fmt(drift(vals), 0)}%</b>
      </div>
    </div>
  );

  return (
    <div className={`relative rounded-3xl border p-4 pt-12 sm:p-5 sm:pt-5 ${t.card}`}>
      <TryItYourself corner />
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'β बदलिए - कौन सा bias टिकता है?' : 'Sweep β - which bias holds?'}
      </div>
      <div className="mb-4"><Slider label="β (current gain)" value={beta} min={50} max={300} step={10} onChange={setBeta} accent={accent} isDarkMode={isDarkMode} /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Bars vals={fixedVals} title={lang === 'hi' ? 'Fixed bias' : 'Fixed bias'} col="#fb7185" />
        <Bars vals={divVals} title={lang === 'hi' ? 'Voltage-divider bias' : 'Voltage-divider bias'} col="#34d399" />
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'fixed bias में Ic, β के साथ सीधे बदलता है (भारी बहाव)। voltage-divider में Re feedback Ic को β से लगभग स्वतंत्र रखता है।'
          : 'In fixed bias Ic scales directly with β (huge drift). In the voltage divider, Re feedback keeps Ic almost independent of β.'}
      </p>
    </div>
  );
};

/* ───────────────────────── JFET transfer curve ─────────────────── */
// Shockley: Id = Idss (1 - Vgs/Vp)^2 for Vp <= Vgs <= 0 (n-channel, depletion).

export const JfetTransfer: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Idss = 10, Vp = -4; // mA, V
  const [Vgs, setVgs] = useState(-1);
  const id = Vgs <= 0 && Vgs >= Vp ? Idss * (1 - Vgs / Vp) ** 2 : Vgs > 0 ? Idss : 0;

  const W = 320, H = 200, pl = 40, pr = 14, pt = 14, pb = 32;
  const X = (vgs: number) => pl + ((vgs - Vp) / (0 - Vp)) * (W - pl - pr);   // Vp..0 -> left..right
  const Y = (i: number) => H - pb - (i / Idss) * (H - pt - pb);
  const pts: string[] = [];
  for (let v = Vp; v <= 0; v += 0.1) pts.push(`${X(v)},${Y(Idss * (1 - v / Vp) ** 2)}`);

  return (
    <div className={`relative rounded-3xl border p-4 pt-12 sm:p-5 sm:pt-5 ${t.card}`}>
      <TryItYourself corner />
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'JFET transfer curve (Shockley)' : 'JFET transfer curve (Shockley)'}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={pl} y1={pt} x2={pl} y2={H - pb} stroke={t.faint as string} strokeWidth="1.5" />
        <line x1={pl} y1={H - pb} x2={W - pr} y2={H - pb} stroke={t.faint as string} strokeWidth="1.5" />
        <text x={W / 2} y={H - 6} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string}>Vgs (V)</text>
        <text x={12} y={H / 2} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={t.faint as string} transform={`rotate(-90 12 ${H / 2})`}>Id (mA)</text>
        <text x={pl - 4} y={Y(Idss) + 3} textAnchor="end" fontFamily="monospace" fontSize="9" fill={t.faint as string}>Idss</text>
        <text x={X(Vp)} y={H - pb + 14} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>Vp</text>
        <motion.polyline points={pts.join(' ')} fill="none" stroke={accent} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
        <motion.circle cx={X(Math.max(Vp, Math.min(0, Vgs)))} cy={Y(id)} r="6" fill={accent} animate={{ cx: X(Math.max(Vp, Math.min(0, Vgs))), cy: Y(id) }} />
      </svg>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <Slider label="VGS" value={Vgs} min={Vp} max={0} step={0.1} unit="V" onChange={setVgs} accent={accent} isDarkMode={isDarkMode} display={fmt(Vgs, 1)} />
        <div className="rounded-lg px-3 py-2 text-center font-mono text-[12px] font-black" style={{ background: `${accent}1a`, color: accent }}>Id = {fmt(id)} mA</div>
      </div>
      <p className={`mt-2 text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? `Idss=${Idss}mA, Vp=${Vp}V. VGS को 0 से Vp की ओर ले जाइए - channel सिकुड़ता है, Id गिरता है (square-law)।`
          : `Idss=${Idss}mA, Vp=${Vp}V. Sweep VGS from 0 toward Vp - the channel pinches and Id falls off (square-law).`}
      </p>
    </div>
  );
};
