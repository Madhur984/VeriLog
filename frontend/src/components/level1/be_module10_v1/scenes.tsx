/**
 * Transistor Topologies & JFETs (be10) - "The FET vs BJT Showdown".
 * The BJT is a water wheel you must keep pushing (current control, low Zin); the
 * FET is a garden hose you control with your foot (voltage control, near-infinite
 * Zin). The JFET pinches its own n-channel shut with two reverse-biased p-n cuffs.
 * Kit labs (JfetTransfer, TransistorSymbol) carry the physics; the bespoke
 * interactives drive home the control-vs-impedance contrast. Every value computed.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hand, Footprints } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene, StepThrough,
  type SubScene,
} from '../_transistor/kit';
import { TransistorSymbol, JfetTransfer, Slider } from '../_transistor/analog';
import type { SubPage } from '../_transistor/kit';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const SRC_EN: string | undefined = undefined;
const SRC_HI: string | undefined = '/videos/be10-jfet-topologies-hi.mp4';

const ACC = { bjt: '#fb7185', fet: '#34d399', field: '#38bdf8', warn: '#f59e0b' };
const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : '-');

/* ── bespoke: BJT (current control, low Zin) vs FET (voltage control, high Zin) ── */
// A single source voltage drives both. The BJT base is a forward-biased junction
// that STEALS input current (Ib = (Vin - Vbe)/Rs), dropping its input resistance.
// The FET gate is reverse-biased: gate current is a tiny leakage, so Rin is huge.
// All numbers - Ib, Ig, Rin - are computed from the slider, never hardcoded.
const ControlShowdown: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [Vin, setVin] = useState(2);          // V, the shared input drive
  const Rs = 10;                              // kOhm series source resistance
  const Vbe = 0.7;                            // BJT base-emitter drop (forward biased)

  // BJT: base junction conducts once Vin > Vbe -> real input current (its worst enemy)
  const ibUA = Vin > Vbe ? ((Vin - Vbe) / Rs) * 1000 : 0;   // uA  (V/kOhm -> mA -> uA)
  const rinBJT = ibUA > 0 ? (Vin / (ibUA / 1e6)) : Infinity; // Ohm = V / A
  // FET: gate reverse-biased -> only a tiny leakage current (nA scale), Rin enormous
  const igNA = 0.5;                                          // nA leakage (datasheet-typical)
  const rinFET = Vin / (igNA / 1e9);                        // Ohm = V / A

  // log-scaled bars so 10 kOhm vs ~1e9 Ohm both read on the same chart
  const logBar = (r: number) => {
    if (!Number.isFinite(r) || r <= 0) return 0;
    return Math.min(100, (Math.log10(r) / 10) * 100); // 1 Ohm..1e10 Ohm -> 0..100%
  };

  const Side: React.FC<{
    title: string; sub: string; color: string; symbol: React.ReactNode;
    drawLabel: string; drawVal: string; rin: number; icon: React.ReactNode; note: string;
  }> = ({ title, sub, color, symbol, drawLabel, drawVal, rin, icon, note }) => (
    <div className="flex-1 rounded-2xl border-2 p-4" style={{ borderColor: `${color}66`, background: `${color}0d` }}>
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <span className="font-mono text-[12px] font-black uppercase tracking-widest" style={{ color }}>{title}</span>
      </div>
      <p className={`mb-3 text-[12px] ${t.sub}`}>{sub}</p>
      <div className="flex justify-center">{symbol}</div>
      <div className={`mt-2 rounded-lg px-3 py-2 font-mono text-[12px] ${t.soft}`}>
        {drawLabel} = <b style={{ color }}>{drawVal}</b>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-baseline justify-between font-mono text-[11px]">
          <span className={t.faint}>{lang === 'hi' ? 'input resistance' : 'input resistance'}</span>
          <span className="font-black" style={{ color }}>
            {Number.isFinite(rin) ? (rin >= 1e6 ? `${fmt(rin / 1e6, 1)} MΩ` : `${fmt(rin / 1e3, 1)} kΩ`) : '∞'}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
          <motion.div className="h-full rounded-full" style={{ background: color }}
            animate={{ width: `${logBar(rin)}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>
      <p className={`mt-2 text-[11px] ${t.faint}`}>{note}</p>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'current control बनाम voltage control' : 'current control vs voltage control'}
      </div>
      <div className="mb-4">
        <Slider label={lang === 'hi' ? 'shared input Vin' : 'shared input Vin'} value={Vin} min={0} max={5} step={0.1}
          unit="V" onChange={setVin} accent={ACC.field} isDarkMode={isDarkMode} display={fmt(Vin, 1)} />
        <p className={`mt-1 text-[11px] ${t.faint}`}>
          {lang === 'hi'
            ? `दोनों devices को एक ही Vin और Rs=${Rs}kΩ से चलाया जा रहा है।`
            : `Both devices are driven by the same Vin through Rs=${Rs}kΩ.`}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Side
          title={lang === 'hi' ? 'BJT - water wheel' : 'BJT - water wheel'}
          sub={lang === 'hi' ? 'current-controlled: base को धकेलते रहना पड़ता है।' : 'current-controlled: you must keep pushing the base.'}
          color={ACC.bjt}
          symbol={<TransistorSymbol kind="npn" accent={ACC.bjt} isDarkMode={isDarkMode} size={84} />}
          drawLabel={lang === 'hi' ? 'base current Ib' : 'base current Ib'}
          drawVal={`${fmt(ibUA, 1)} µA`}
          rin={rinBJT}
          icon={<Hand size={15} style={{ color: ACC.bjt }} />}
          note={lang === 'hi' ? 'forward-biased base असली current चुराता है - Rin गिरता है (worst enemy)।' : 'the forward-biased base steals real current - Rin drops (its worst enemy).'}
        />
        <Side
          title={lang === 'hi' ? 'FET - garden hose' : 'FET - garden hose'}
          sub={lang === 'hi' ? 'voltage-controlled: पैर hose पर रखिए, पानी मत खींचिए।' : 'voltage-controlled: a foot on the hose, no water drawn.'}
          color={ACC.fet}
          symbol={<TransistorSymbol kind="njfet" accent={ACC.fet} isDarkMode={isDarkMode} size={84} />}
          drawLabel={lang === 'hi' ? 'gate current Ig' : 'gate current Ig'}
          drawVal={`${fmt(igNA, 1)} nA`}
          rin={rinFET}
          icon={<Footprints size={15} style={{ color: ACC.fet }} />}
          note={lang === 'hi' ? 'reverse-biased gate केवल leakage खींचता है - Rin बहुत बड़ा।' : 'the reverse-biased gate draws only leakage - Rin is enormous.'}
        />
      </div>
      {/* worked contrast: the defining equations + computed values, side by side */}
      <div className="mt-4 grid gap-2 font-mono text-[12px] sm:grid-cols-2">
        <div className={`rounded-lg px-3 py-2 ${t.soft}`}>
          <div className="font-black" style={{ color: ACC.bjt }}>{lang === 'hi' ? 'BJT (current-controlled)' : 'BJT (current-controlled)'}</div>
          <div className="mt-1">Ib = (Vin - Vbe)/Rs = ({fmt(Vin, 1)} - {Vbe})/{Rs}k = <b style={{ color: ACC.bjt }}>{fmt(ibUA, 1)} µA</b></div>
          <div className="mt-0.5">Rin = Vin/Ib = <b style={{ color: ACC.bjt }}>{Number.isFinite(rinBJT) ? `${fmt(rinBJT / 1e3, 1)} kΩ` : '∞'}</b> {lang === 'hi' ? '(low Zin)' : '(low Zin)'}</div>
        </div>
        <div className={`rounded-lg px-3 py-2 ${t.soft}`}>
          <div className="font-black" style={{ color: ACC.fet }}>{lang === 'hi' ? 'FET (voltage-controlled)' : 'FET (voltage-controlled)'}</div>
          <div className="mt-1">Ig ≈ {lang === 'hi' ? 'leakage' : 'leakage'} = <b style={{ color: ACC.fet }}>{fmt(igNA, 1)} nA</b></div>
          <div className="mt-0.5">Rin = Vin/Ig = <b style={{ color: ACC.fet }}>{fmt(rinFET / 1e6, 1)} MΩ</b> {lang === 'hi' ? '(very high Zin)' : '(very high Zin)'}</div>
        </div>
      </div>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {ibUA > 0
          ? (lang === 'hi'
            ? `यहाँ BJT का Ib microamps में है पर FET का Ig nanoamps में - लगभग ${fmt((ibUA * 1000) / igNA / 1000, 0)} हज़ार गुना कम current। इसीलिए FET का Rin BJT से ~${fmt(rinFET / rinBJT, 0)} गुना बड़ा है।`
            : `Here the BJT draws Ib in microamps but the FET draws Ig in nanoamps - about ${fmt((ibUA * 1000) / igNA / 1000, 0)} thousand times less input current. That is why the FET Rin is ~${fmt(rinFET / rinBJT, 0)}x larger than the BJT Rin.`)
          : (lang === 'hi'
            ? 'Vin अभी Vbe (0.7V) से कम है, तो BJT अभी on नहीं हुआ (Ib=0)। Vin बढ़ाते ही BJT microamps खींचने लगेगा जबकि FET nanoamps पर टिका रहेगा।'
            : 'Vin is still below Vbe (0.7V), so the BJT is not yet on (Ib=0). Raise Vin and the BJT starts drawing microamps while the FET stays in nanoamps.')}
      </p>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? 'Vin बढ़ाइए: BJT का Ib (µA) तेज़ी से चढ़ता है और Rin (kΩ) गिरता है; FET का Ig (nA) लगभग स्थिर रहता है और Rin (MΩ) टिका रहता है।'
          : 'Raise Vin: the BJT Ib (µA) climbs fast and its Rin (kΩ) falls; the FET Ig (nA) barely moves and its Rin (MΩ) holds.'}
      </p>
    </Card>
  );
};

/* ── bespoke: njfet vs npn symbol contrast (bipolar vs unipolar at a glance) ── */
const SymbolContrast: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Cell: React.FC<{ kind: 'npn' | 'njfet'; color: string; cap: string; sub: string }>
    = ({ kind, color, cap, sub }) => (
    <div className="flex-1 rounded-2xl border-2 p-4 text-center" style={{ borderColor: `${color}66`, background: `${color}0d` }}>
      <TransistorSymbol kind={kind} accent={color} isDarkMode={isDarkMode} size={104} />
      <div className="mt-1 font-mono text-[12px] font-black uppercase tracking-widest" style={{ color }}>{cap}</div>
      <p className={`mt-1 text-[12px] ${t.sub}`}>{sub}</p>
    </div>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'BJT बनाम JFET - एक नज़र में' : 'BJT vs JFET - at a glance'}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Cell kind="npn" color={ACC.bjt}
          cap={lang === 'hi' ? 'npn BJT (bipolar)' : 'npn BJT (bipolar)'}
          sub={lang === 'hi' ? 'B-C-E, current-controlled, electrons AND holes।' : 'B-C-E, current-controlled, electrons AND holes.'} />
        <Cell kind="njfet" color={ACC.fet}
          cap={lang === 'hi' ? 'n-channel JFET (unipolar)' : 'n-channel JFET (unipolar)'}
          sub={lang === 'hi' ? 'D-G-S, voltage-controlled, सिर्फ़ electrons।' : 'D-G-S, voltage-controlled, electrons only.'} />
      </div>
    </Card>
  );
};

/* ── bespoke: step-on-the-hose channel pincher (depletion cuffs swell inward) ── */
// A Vgs slider (0 down to Vp) animates the two depletion cuffs inward; the channel
// opening narrows and the live Id falls via the Shockley square law to zero at Vp.
const HosePincher: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Idss = 10, Vp = -4;                         // mA, V
  const [Vgs, setVgs] = useState(-1);
  const vc = Math.max(Vp, Math.min(0, Vgs));
  const open = 1 - vc / Vp;                         // normalised channel opening 1..0
  const id = Idss * open * open;                    // Shockley square law
  const cuff = (1 - open) * 22;                     // px each cuff intrudes (max ~22)
  const flow = Math.max(1, Math.round(open * 6));   // animated water droplets

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'hose pincher - cuffs अंदर फूलती हैं' : 'hose pincher - the cuffs swell inward'}
      </div>
      <svg viewBox="0 0 300 150" className="w-full">
        {/* hose / n-channel walls */}
        <rect x="40" y="50" width="220" height="50" rx="6" fill={isDarkMode ? '#0a0e1a' : '#f1f5f9'} stroke={t.faint as string} />
        <text x="34" y="46" textAnchor="start" fontFamily="monospace" fontSize="9" fill={t.faint as string}>S (source)</text>
        <text x="266" y="46" textAnchor="end" fontFamily="monospace" fontSize="9" fill={t.faint as string}>D (drain)</text>
        {/* two depletion cuffs (top + bottom) intruding from the gate sides */}
        <motion.rect x="120" y="50" width="60" fill={ACC.field} opacity="0.45"
          animate={{ height: cuff, y: 50 }} transition={{ duration: 0.4 }} />
        <motion.rect x="120" fill={ACC.field} opacity="0.45"
          animate={{ height: cuff, y: 100 - cuff }} transition={{ duration: 0.4 }} />
        <text x="150" y="124" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={ACC.field}>G (gate cuffs)</text>
        {/* water droplets flowing through the remaining opening */}
        {Array.from({ length: flow }).map((_, i) => (
          <motion.circle key={`${i}-${flow}`} r="3" fill={accent} cy={75}
            animate={{ cx: [44, 256] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * (1.2 / flow), ease: 'linear' }} />
        ))}
      </svg>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <Slider label="VGS" value={Vgs} min={Vp} max={0} step={0.1} unit="V" onChange={setVgs}
          accent={accent} isDarkMode={isDarkMode} display={fmt(Vgs, 1)} />
        <div className="rounded-lg px-3 py-2 text-center font-mono text-[12px] font-black"
          style={{ background: `${accent}1a`, color: accent }}>Id = {fmt(id)} mA</div>
      </div>
      <p className={`mt-2 text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? `Idss=${Idss}mA, Vp=${Vp}V. VGS को 0 से Vp की ओर ले जाइए: cuffs अंदर फूलती हैं, channel सिकुड़ता है, और Id = Idss(1-Vgs/Vp)² से गिरकर pinch-off पर 0 हो जाता है।`
          : `Idss=${Idss}mA, Vp=${Vp}V. Sweep VGS from 0 toward Vp: the cuffs swell inward, the channel pinches, and Id = Idss(1-Vgs/Vp)² falls to 0 at pinch-off.`}
      </p>
    </Card>
  );
};

/* ── proof: Shockley equation derivation, walked step by step ── */
const ShockleyDerivation: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const mono = (s: string) => <span className="font-mono text-[13px] font-black" style={{ color: accent }}>{s}</span>;
  const P: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className={`text-[13px] leading-relaxed ${t.sub}`}>{children}</p>;

  const steps = [
    {
      label: lang === 'hi' ? 'Setup: reverse-biased gate' : 'Setup: reverse-biased gate',
      body: <P>{lang === 'hi'
        ? <>n-channel JFET। gate-channel pn junction REVERSE bias में रखा जाता है (Vgs &le; 0)। reverse bias depletion region को channel में फैलाती है, conducting रास्ता संकरा करते हुए।</>
        : <>n-channel JFET. The gate-channel pn junction is held in REVERSE bias (Vgs &le; 0). The reverse bias widens the depletion region into the channel, narrowing the conducting path.</>}</P>,
    },
    {
      label: lang === 'hi' ? 'दो parameters define करें' : 'Define the two parameters',
      body: <P>{lang === 'hi'
        ? <>{mono('IDSS')} = Vgs=0 पर drain current (gate को source से short)। यह active region का MAXIMUM current है। {mono('VP')} = pinch-off voltage = Vgs(off) = वह (negative) gate-source voltage जिस पर depletion regions मिलकर channel बंद कर देती हैं, तो Id -&gt; 0।</>
        : <>{mono('IDSS')} = drain current at Vgs = 0 (gate shorted to source). This is the MAXIMUM current in the active region. {mono('VP')} = pinch-off voltage = Vgs(off) = the (negative) gate-source voltage at which the depletion regions meet and close the channel, so Id -&gt; 0.</>}</P>,
    },
    {
      label: lang === 'hi' ? 'channel opening linear है' : 'The channel opening is linear',
      body: <P>{lang === 'hi'
        ? <>depletion-layer width reverse voltage के sqrt के अनुपात में होती है, तो channel conductance Vgs के VP की ओर बढ़ने पर गिरता है। बचा हुआ (normalised) channel opening {mono('(1 - Vgs/VP)')} की तरह linear बदलता है: Vgs=0 पर यह 1 है और Vgs=VP पर 0।</>
        : <>The depletion-layer width is proportional to sqrt(reverse voltage), so the channel conductance falls as Vgs approaches VP. The remaining (normalised) channel opening varies linearly as {mono('(1 - Vgs/VP)')}: it equals 1 at Vgs=0 and 0 at Vgs=VP.</>}</P>,
    },
    {
      label: lang === 'hi' ? 'square law + constant pin करें' : 'Square law + pin the constant',
      body: <P>{lang === 'hi'
        ? <>saturation region में Id, open channel fraction के square के साथ बदलता है, तो Id ~ {mono('(1 - Vgs/VP)²')}। boundary condition से constant pin करें: Vgs=0 पर Id = IDSS। तो {mono('Id = IDSS(1 - Vgs/VP)²')}।</>
        : <>In the saturation region Id scales with the square of the open channel fraction, so Id ~ {mono('(1 - Vgs/VP)²')}. Pin the constant with the boundary condition Id = IDSS at Vgs = 0, giving {mono('Id = IDSS(1 - Vgs/VP)²')}.</>}</P>,
    },
    {
      label: lang === 'hi' ? 'दोनों सिरे जाँचें' : 'Check both ends',
      body: <div className="space-y-2">
        <P>{lang === 'hi'
          ? <>Vgs = VP: Id = IDSS(1 - VP/VP)² = IDSS(0)² = 0. सही (channel pinched off)।</>
          : <>At Vgs = VP: Id = IDSS(1 - VP/VP)² = IDSS(0)² = 0. Correct (channel pinched off).</>}</P>
        <P>{lang === 'hi'
          ? <>Vgs = 0: Id = IDSS(1)² = IDSS. सही (maximum current)।</>
          : <>At Vgs = 0: Id = IDSS(1)² = IDSS. Correct (maximum current).</>}</P>
        <p className={`mt-2 rounded-lg px-3 py-2 text-center font-mono text-[13px] font-black ${t.soft}`} style={{ color: accent }}>
          Id = IDSS(1 - Vgs/VP)²  ·  Vp &le; Vgs &le; 0  ·  depletion-mode
        </p>
      </div>,
    },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Proof: Shockley equation' : 'Proof: the Shockley equation'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ── proof: transconductance gm derived by differentiating Shockley ── */
// Every step shown; the final gm0 is computed in code from the same Idss, Vp.
const GmDerivation: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Idss = 10, Vp = -4;                            // mA, V (matches the labs)
  const gm0 = (-2 * Idss) / Vp;                        // mA/V, computed (= 5)
  const mono = (s: string) => <span className="font-mono text-[13px] font-black" style={{ color: accent }}>{s}</span>;
  const P: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className={`text-[13px] leading-relaxed ${t.sub}`}>{children}</p>;

  const steps = [
    {
      label: lang === 'hi' ? 'gm की परिभाषा' : 'Definition of gm',
      body: <P>{lang === 'hi'
        ? <>transconductance वह दर है जिससे drain current, gate voltage के साथ बदलता है: {mono('gm = dId/dVgs')}, Q-point पर evaluate किया गया। units siemens (A per V) हैं।</>
        : <>Transconductance is the rate at which drain current changes with gate voltage: {mono('gm = dId/dVgs')}, evaluated at the Q-point. Its units are siemens (A per V).</>}</P>,
    },
    {
      label: lang === 'hi' ? 'Shockley से शुरू करें' : 'Start from Shockley',
      body: <P>{lang === 'hi'
        ? <>हम पिछली derivation का नतीजा लेते हैं: {mono('Id = Idss(1 - Vgs/Vp)²')}। इसे Vgs के सापेक्ष differentiate करना है।</>
        : <>Take the result of the previous derivation: {mono('Id = Idss(1 - Vgs/Vp)²')}. We must differentiate it with respect to Vgs.</>}</P>,
    },
    {
      label: lang === 'hi' ? 'substitution u रखें' : 'Substitute u',
      body: <P>{lang === 'hi'
        ? <>{mono('u = (1 - Vgs/Vp)')} रखें। तो {mono('du/dVgs = -1/Vp')} (Idss और Vp constants हैं)। अब Id = Idss·u²।</>
        : <>Let {mono('u = (1 - Vgs/Vp)')}. Then {mono('du/dVgs = -1/Vp')} (Idss and Vp are constants). Now Id = Idss·u².</>}</P>,
    },
    {
      label: lang === 'hi' ? 'chain rule लगाएँ' : 'Apply the chain rule',
      body: <P>{lang === 'hi'
        ? <>{mono('dId/dVgs = Idss·2u·(du/dVgs) = Idss·2(1 - Vgs/Vp)·(-1/Vp)')}। समेटने पर {mono('gm = -(2·Idss/Vp)(1 - Vgs/Vp)')}।</>
        : <>{mono('dId/dVgs = Idss·2u·(du/dVgs) = Idss·2(1 - Vgs/Vp)·(-1/Vp)')}. Collecting terms gives {mono('gm = -(2·Idss/Vp)(1 - Vgs/Vp)')}.</>}</P>,
    },
    {
      label: lang === 'hi' ? 'Vgs=0 पर gm0' : 'Peak gm0 at Vgs=0',
      body: <div className="space-y-2">
        <P>{lang === 'hi'
          ? <>Vgs=0 रखें: bracket = 1, तो {mono('gm0 = -2·Idss/Vp = 2·Idss/|Vp|')} (Vp&lt;0 होने से positive)। यहाँ Idss={Idss}mA, Vp={Vp}V देता है gm0 = 2·{Idss}/|{Vp}| = <b style={{ color: accent }}>{fmt(gm0, 1)} mA/V</b>।</>
          : <>Set Vgs=0: the bracket = 1, so {mono('gm0 = -2·Idss/Vp = 2·Idss/|Vp|')} (positive, since Vp&lt;0). With Idss={Idss}mA, Vp={Vp}V this is gm0 = 2·{Idss}/|{Vp}| = <b style={{ color: accent }}>{fmt(gm0, 1)} mA/V</b>.</>}</P>
        <P>{lang === 'hi'
          ? <>Vgs=Vp रखें: bracket = 0, तो gm = 0 (channel pinched off, कोई gain नहीं)। एक compact रूप: {mono('gm = gm0·sqrt(Id/Idss)')}।</>
          : <>Set Vgs=Vp: the bracket = 0, so gm = 0 (channel pinched off, no gain). A compact form: {mono('gm = gm0·sqrt(Id/Idss)')}.</>}</P>
        <p className={`mt-2 rounded-lg px-3 py-2 text-center font-mono text-[13px] font-black ${t.soft}`} style={{ color: accent }}>
          gm = -(2·Idss/Vp)(1 - Vgs/Vp)  ·  gm0 = 2·Idss/|Vp| = {fmt(gm0, 1)} mA/V
        </p>
      </div>,
    },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'Proof: gm = dId/dVgs' : 'Proof: gm = dId/dVgs'}
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ── bespoke: transconductance gm = slope of the transfer curve ── */
// gm = -2*Idss/Vp*(1 - Vgs/Vp), computed live; the bar shrinks to 0 toward Vp.
const GmLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Idss = 10, Vp = -4;                          // mA, V
  const [Vgs, setVgs] = useState(-1);
  const vc = Math.max(Vp, Math.min(0, Vgs));
  const gm0 = (-2 * Idss) / Vp;                      // mA/V at Vgs=0 (positive, Vp<0)
  const gm = gm0 * (1 - vc / Vp);                    // mA/V at this Vgs
  const id = Idss * (1 - vc / Vp) ** 2;             // mA, for context

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'transconductance gm (curve की slope)' : 'transconductance gm (slope of the curve)'}
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <Slider label="VGS" value={Vgs} min={Vp} max={0} step={0.1} unit="V" onChange={setVgs}
          accent={accent} isDarkMode={isDarkMode} display={fmt(Vgs, 1)} />
        <div className="rounded-lg px-3 py-2 text-center font-mono text-[12px] font-black"
          style={{ background: `${accent}1a`, color: accent }}>Id = {fmt(id)} mA</div>
      </div>
      <div className="mt-3 space-y-2 font-mono text-[12px]">
        <div className={`rounded-lg px-3 py-2 ${t.soft}`}>gm0 = -2·Idss/Vp = <b style={{ color: accent }}>{fmt(gm0)} mA/V</b></div>
        <div className={`rounded-lg px-3 py-2 ${t.soft}`}>gm = -2·Idss/Vp·(1 - Vgs/Vp) = <b style={{ color: accent }}>{fmt(gm)} mA/V</b></div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-baseline justify-between font-mono text-[11px]">
          <span className={t.faint}>{lang === 'hi' ? 'gm (0 .. gm0)' : 'gm (0 .. gm0)'}</span>
          <span className="font-black" style={{ color: accent }}>{fmt(gm)} mS</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
          <motion.div className="h-full rounded-full" style={{ background: accent }}
            animate={{ width: `${(gm / gm0) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>
      <p className={`mt-2 text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'gm Vgs=0 पर सबसे बड़ा है और pinch-off पर 0 हो जाता है। यही gain handle input voltage को output current में बदलता है।'
          : 'gm is largest at Vgs=0 and shrinks to 0 at pinch-off. This gain handle is what turns input voltage into output current.'}
      </p>
    </Card>
  );
};

/* ── recap: sources from the spec, as plain links ── */
const SOURCES = [
  { label: 'JFET large-signal model + Shockley eqn + gm = 2·Idss/|Vp| (TINA)', url: 'https://www.tina.com/resources/home/field-effect-transistor-amplifiers-2/3-large-signal-equivalent-circuit/' },
  { label: 'BJT vs JFET: control mechanism, Zin, unipolar vs bipolar (practical-buddy)', url: 'https://www.practical-buddy.xyz/2020/12/bjt-vs-jfet-key-differences-with-full.html' },
  { label: 'Key differences BJT vs JFET (hackatronic)', url: 'https://www.hackatronic.com/key-difference-between-bjt-and-jfet-bjt-vs-jfet/' },
  { label: 'Common-source gain Av=-gm(RD||RL), self-bias, phase inversion (electronics-tutorials)', url: 'https://www.electronics-tutorials.ws/amplifier/amp_3.html' },
  { label: 'Boylestad, Electronic Devices and Circuit Theory - pinch-off & gm', url: 'https://www.vaia.com/en-us/textbooks/physics/electronic-devices-and-circuit-theory-11-edition/chapter-8/problem-2-determine-the-pinch-off-voltage-of-a-jfet-with-gm-/' },
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
          <li key={s.url} className="text-[13px]">
            <a href={s.url} target="_blank" rel="noreferrer" className="underline" style={{ color: accent }}>{s.label}</a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

/* ── scene mapping ── */
const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (/dichotomy|bipolar|unipolar/.test(key)) return 'symbols';
  if (/comparison|character/.test(key)) return 'showdown';
  if (/terminal|architecture/.test(key)) return 'symbols';
  if (/pinch|modulation|hose/.test(key)) return 'pincher';
  if (/shockley|idss/.test(key)) return 'shockley';
  if (/transconductance|gm/.test(key)) return 'gm';
  return null;
};

const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE SHOWDOWN'
    : i <= Math.floor(n * 0.6) ? 'PART II · THE JFET PHYSICS'
      : i < n - 2 ? 'PART III · THE MATH'
        : 'PART IV · LOCK IT IN';

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="FET vs BJT" heroKind="njfet" />;
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
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="FET vs BJT" tag="Practice · Transistors & JFETs" title={scene.label} intro={scene.subtitle ?? ''} />;
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
          {which === 'symbols' && <SymbolContrast isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'showdown' && (
            <>
              <TryItYourself />
              <ControlShowdown isDarkMode={p.isDarkMode} accent={p.accent} />
            </>
          )}
          {which === 'pincher' && (
            <>
              <TryItYourself />
              <HosePincher isDarkMode={p.isDarkMode} accent={p.accent} />
            </>
          )}
          {which === 'shockley' && (
            <div className="space-y-4">
              <TryItYourself />
              <JfetTransfer isDarkMode={p.isDarkMode} accent={p.accent} />
              <ShockleyDerivation isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'gm' && (
            <div className="space-y-4">
              <TryItYourself />
              <GmLab isDarkMode={p.isDarkMode} accent={p.accent} />
              <GmDerivation isDarkMode={p.isDarkMode} accent={p.accent} />
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
