import React, { useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Check, Binary, Zap, Boxes, type LucideIcon } from 'lucide-react';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ThemeToggle } from '../../components/ThemeToggle';
import { BrandMark } from '../../components/Brand';
import { MODULE_LABELS } from '../../lib/moduleHistory';
import { isAuthenticated } from '../../lib/auth';
import { TextbookEquation } from '../../components/ui/TextbookEquation';

/* ═══════════════════════════════════════════════════════════════════════════
   BitForBytes — landing page.
   Editorial + interactive: a byte you can flip, an XOR you can poke, a signal
   rail that rides your scroll. Same visual language as the portal (lavender /
   ink, hard offset shadows, square-wave rules, single-tone grid). All motion
   is transform/opacity only — nothing here can lag.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── shared bits ── */
const BRAND = '#7A3FD0';

const WAVE_PATH = (() => {
  let d = 'M0 9';
  for (let x = 0; x < 1200; x += 24) d += ` H${x + 12} V1 H${x + 24} V9`;
  return d;
})();
const SquareWave: React.FC<{ stroke: string }> = ({ stroke }) => (
  <svg className="h-[10px] w-full" viewBox="0 0 1200 10" preserveAspectRatio="none" aria-hidden>
    <path d={WAVE_PATH} fill="none" stroke={stroke} strokeWidth="1" opacity="0.55" vectorEffect="non-scaling-stroke" />
  </svg>
);

const GridBackground: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const line = isLight ? '122,63,208' : '167,139,250';
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            `linear-gradient(rgba(${line},${isLight ? 0.055 : 0.045}) 1px, transparent 1px),` +
            `linear-gradient(90deg, rgba(${line},${isLight ? 0.055 : 0.045}) 1px, transparent 1px)`,
          backgroundSize: '34px 34px',
        }}
      />
      <div className="absolute left-0 right-0 top-0 h-[2px] will-change-transform"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${line},0.4), transparent)`, animation: 'grid-current-y 9s linear infinite' }} />
    </div>
  );
};

/* Scroll-in reveal — transform/opacity only. */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-70px' }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* ── paths (single source of truth: lib/moduleHistory) ── */
interface PathDef { title: string; tagline: string; prefix: string; color: string; icon: LucideIcon; to: string; badge?: string; }
const PATHS: PathDef[] = [
  { title: 'Foundation', tagline: 'Digital logic & Verilog, from gates up.', prefix: 'module/', color: '#2563EB', icon: Binary, to: '/module/1', badge: '5 free · no account' },
  { title: 'Basic Electronics', tagline: 'Physics of control to transistors.', prefix: 'basic-electronics/', color: '#EA580C', icon: Zap, to: '/basic-electronics/1', badge: 'start here' },
  { title: 'Digital System Design', tagline: 'Adders, subtractors and beyond.', prefix: 'dsd/', color: '#9333EA', icon: Boxes, to: '/dsd/1' },
];
const modulesFor = (prefix: string): string[] =>
  Object.keys(MODULE_LABELS)
    .filter((k) => k.startsWith(prefix))
    .sort((a, b) => (parseInt(a.split('/')[1], 10) || 0) - (parseInt(b.split('/')[1], 10) || 0))
    .map((k) => MODULE_LABELS[k]);
const TOTAL_MODULES = Object.keys(MODULE_LABELS).length;

const TESTIMONIALS = [
  { quote: 'K-maps finally made sense after one afternoon here. Once I could flip the inputs and watch the output change, it just clicked.', name: 'Aarav', role: '2nd year ECE' },
  { quote: 'The Verilog labs feel like a game. I went from copy-pasting code to actually writing an FSM that runs.', name: 'Meera', role: 'VLSI intern' },
  { quote: 'Way better than sitting through slides. Building the datapath piece by piece is the first time architecture felt real to me.', name: 'Karthik', role: 'Final year ECE' },
];

/* ── THE BYTE — eight bits you can flip. 01000010 = 66 = 'B'. ── */
const ByteFlipper: React.FC<{ panel: React.CSSProperties; dim: string; faint: string; hairline: string; isLight: boolean }> = ({ panel, dim, faint, hairline, isLight }) => {
  const [bits, setBits] = useState<number[]>([0, 1, 0, 0, 0, 0, 1, 0]);
  const value = bits.reduce((acc, b) => (acc << 1) | b, 0);
  const printable = value >= 33 && value < 127;
  const char = printable ? String.fromCharCode(value) : '·';

  // A little square-wave portrait of the byte itself.
  let wave = `M0 ${bits[0] ? 4 : 20}`;
  bits.forEach((b, i) => {
    const y = b ? 4 : 20;
    wave += ` L${i * 20} ${y} L${(i + 1) * 20} ${y}`;
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const runAutoSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    // B -> I -> T -> S ascii sequence: 66, 73, 84, 83
    const targetValues = [66, 73, 84, 83];
    let step = 0;
    const interval = setInterval(() => {
      const target = targetValues[step];
      const newBits = Array.from({ length: 8 }, (_, i) => (target >> (7 - i)) & 1);
      setBits(newBits);
      step++;
      if (step >= targetValues.length) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 600);
  };

  return (
    <div className="relative" style={panel}>
      <span className="absolute inset-y-0 left-0 w-[5px]" style={{ background: BRAND }} />
      <div className="p-5 pl-6 sm:p-6 sm:pl-7">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: faint }}>
            Try it — flip a bit
          </p>
          <button
            onClick={runAutoSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] transition-all hover:bg-[#7A3FD0]/10 disabled:opacity-50"
            style={{ borderColor: hairline, color: BRAND }}
          >
            <Zap size={11} className={isSimulating ? 'animate-pulse' : ''} />
            {isSimulating ? 'Simulating...' : 'Auto Sim (B-I-T-S)'}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-8 gap-1.5 sm:gap-2">
          {bits.map((b, i) => (
            <button
              key={i}
              onClick={() => setBits((prev) => prev.map((v, j) => (j === i ? 1 - v : v)))}
              aria-label={`bit ${7 - i}, currently ${b}`}
              className={`relative flex h-12 items-center justify-center rounded-md border-2 font-mono text-[16px] font-bold transition-all duration-300 active:scale-90 sm:h-14 ${
                isSimulating && b ? 'animate-pulse scale-105' : ''
              }`}
              style={{
                borderColor: b ? (isSimulating ? '#A855F7' : BRAND) : hairline,
                background: b ? (isSimulating ? 'linear-gradient(135deg, #7A3FD0, #A855F7)' : BRAND) : 'transparent',
                color: b ? '#fff' : dim,
                boxShadow: b
                  ? isSimulating
                    ? '0 0 20px rgba(168, 85, 247, 0.85), 0 0 35px rgba(122, 63, 208, 0.6)'
                    : '0 0 10px rgba(122, 63, 208, 0.35)'
                  : 'none',
              }}
            >
              {b}
            </button>
          ))}
        </div>

        <svg className="mt-4 h-6 w-full" viewBox="0 0 160 24" preserveAspectRatio="none" aria-hidden>
          <path d={wave} fill="none" stroke={BRAND} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] font-semibold tabular-nums" style={{ color: dim }}>
          <span>DEC {value}</span>
          <span>HEX 0x{value.toString(16).toUpperCase().padStart(2, '0')}</span>
          <span
            className={`rounded px-1.5 py-0.5 transition-all duration-300 ${
              isSimulating ? 'animate-pulse scale-110' : ''
            }`}
            style={{
              color: isSimulating ? '#fff' : (isLight ? '#1B1436' : '#E2E8F0'),
              background: isSimulating ? 'linear-gradient(135deg, #7A3FD0, #A855F7)' : 'transparent',
              boxShadow: isSimulating ? '0 0 15px rgba(168, 85, 247, 0.8)' : 'none',
            }}
          >
            ASCII {printable ? `'${char}'` : '—'}
          </span>
        </div>

        <p className="mt-3 border-t border-dashed pt-3 text-[12.5px] leading-relaxed" style={{ borderColor: hairline, color: dim }}>
          {isSimulating ? (
            <span className="font-bold tracking-wide" style={{ color: BRAND }}>
              ⚡ Auto-simulating ASCII sequence: B → I → T → S (currently rendering <span className="underline decoration-2 underline-offset-4">{char}</span>)
            </span>
          ) : value === 66 ? (
            <>01000010 is 66 — the letter <b>B</b>, as in Bytes. Every key you press does this.</>
          ) : (
            <>You just made {value}{printable ? <> — the character <b>{char}</b></> : ''}. That's all a byte is.</>
          )}
        </p>
      </div>
    </div>
  );
};

/* ── XOR you can poke ── */
const XorDemo: React.FC<{ panel: React.CSSProperties; dim: string; faint: string; hairline: string; isLight: boolean }> = ({ panel, dim, faint, hairline, isLight }) => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const out = a ^ b;
  const on = BRAND;
  const off = isLight ? 'rgba(27,20,54,0.25)' : 'rgba(255,255,255,0.18)';
  const rows: Array<[number, number, number]> = [[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]];

  const InputSwitch: React.FC<{ label: string; v: number; set: (n: number) => void }> = ({ label, v, set }) => (
    <button
      onClick={() => set(1 - v)}
      className="flex items-center gap-2.5 rounded-lg border-2 px-3.5 py-2.5 font-mono text-[13px] font-bold transition-transform active:scale-95"
      style={{ borderColor: v ? BRAND : hairline, color: v ? BRAND : dim }}
    >
      {label}
      <span className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors" style={{ background: v ? BRAND : off }}>
        <span className={`absolute h-3.5 w-3.5 rounded-full bg-white transition-transform ${v ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
      </span>
      {v}
    </button>
  );

  return (
    <div style={panel}>
      <div className="p-5 sm:p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: faint }}>
          Live circuit · XOR
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <InputSwitch label="A" v={a} set={setA} />
          <InputSwitch label="B" v={b} set={setB} />
        </div>

        {/* gate drawing */}
        <svg className="mt-4 w-full" viewBox="0 0 300 90" aria-hidden>
          {/* input wires */}
          <path d={`M0 30 H96`} stroke={a ? on : off} strokeWidth="2.5" fill="none" />
          <path d={`M0 60 H96`} stroke={b ? on : off} strokeWidth="2.5" fill="none" />
          {/* XOR body */}
          <path d="M104 12 C 138 12, 164 26, 176 45 C 164 64, 138 78, 104 78 C 116 57, 116 33, 104 12 Z"
            fill="none" stroke={isLight ? '#1B1436' : '#E2E8F0'} strokeWidth="2.5" />
          <path d="M94 12 C 106 33, 106 57, 94 78" fill="none" stroke={isLight ? '#1B1436' : '#E2E8F0'} strokeWidth="2.5" />
          {/* output wire + lamp */}
          <path d="M176 45 H240" stroke={out ? on : off} strokeWidth="2.5" fill="none" />
          <circle cx="262" cy="45" r="14" fill={out ? on : 'transparent'} stroke={out ? on : off} strokeWidth="2.5" />
          <text x="262" y="49" textAnchor="middle" fontSize="12" fontFamily="JetBrains Mono, monospace" fontWeight="700" fill={out ? '#fff' : dim}>{out}</text>
        </svg>

        {/* truth table — the live row is marked */}
        <div className="mt-2 overflow-hidden rounded-md border" style={{ borderColor: hairline }}>
          <div className="grid grid-cols-3 border-b px-3 py-1.5 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ borderColor: hairline, color: faint }}>
            <span>A</span><span>B</span><span>A ⊕ B</span>
          </div>
          {rows.map(([ra, rb, ro]) => {
            const live = ra === a && rb === b;
            return (
              <div
                key={`${ra}${rb}`}
                className="grid grid-cols-3 px-3 py-1.5 text-center font-mono text-[12px] font-semibold tabular-nums"
                style={{ background: live ? `${BRAND}1A` : 'transparent', color: live ? (isLight ? '#1B1436' : '#fff') : dim }}
              >
                <span>{ra}</span><span>{rb}</span><span style={live ? { color: BRAND } : undefined}>{ro}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ═══ PAGE ═══ */
export const BrilliantHome: React.FC = () => {
  const navigate = useNavigate();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const { scrollYProgress } = useScroll();
  const authed = isAuthenticated();

  const pageBg = isLight ? '#ECE8FB' : '#04060A';
  const ink = isLight ? '#1B1436' : '#E2E8F0';
  const dim = isLight ? '#4A3F63' : '#94A3B8';
  const faint = isLight ? '#6B5E86' : '#64748B';
  const hairline = isLight ? '#C9BEEA' : 'rgba(255,255,255,0.09)';
  const panel: React.CSSProperties = {
    background: isLight ? '#ECE8FB' : '#0A0F18',
    border: isLight ? '2px solid #1B1436' : '1px solid rgba(148,163,184,0.15)',
    boxShadow: isLight ? '5px 5px 0 0 #1B1436' : '0 18px 44px rgba(0,0,0,0.55)',
    borderRadius: 8,
  };
  const numeralStroke = isLight ? 'rgba(27,20,54,0.28)' : 'rgba(255,255,255,0.15)';

  // Facts as logic-analyzer channels — the waveform IS the number, in 8-bit binary.
  const CHANNELS: Array<{ label: string; value: number }> = [
    { label: 'learning paths', value: 3 },
    { label: 'interactive modules', value: TOTAL_MODULES },
    { label: 'free without sign-up', value: 5 },
    { label: 'installs required', value: 0 },
  ];

  const FAQ_ITEMS: Array<{ q: string; a: string }> = [
    { q: "Is BitForBytes really 100% free?", a: "Yes. All 42 modules across every learning path are completely free. You can start the first 5 modules instantly without an account, and creating a free account unlocks the rest while saving your progress." },
    { q: "What is the entry barrier for these modules?", a: "Zero. The entire runtime layer executes inside an in-browser container. No local EDA licensing or tool installation is required." },
    { q: "Does the platform support hardware description execution?", a: "Yes. You author industry-standard Verilog syntax directly inside our workstation, which synthesizes concurrently into gate-level primitives." },
    { q: "Can I track my logic verification history?", a: "Every testbench run updates automated timing coverage maps, logs propagation slack metrics, and archives passing vectors inside your local workstation profile." }
  ];
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toBits = (n: number) => Array.from({ length: 8 }, (_, i) => (n >> (7 - i)) & 1);
  const bitsWave = (bits: number[]) => {
    let d = `M0 ${bits[0] ? 4 : 20}`;
    bits.forEach((b, i) => { const y = b ? 4 : 20; d += ` L${i * 20} ${y} L${(i + 1) * 20} ${y}`; });
    return d;
  };

  const STEPS: Array<[string, string, string]> = [
    ['Build', 'Drop gates, pull wires, run it. The circuit exists before the vocabulary does.', '01'],
    ['Break', 'Flip inputs. Force a carry. Watch exactly where the signal bends — and why.', '02'],
    ['Understand', 'Now the theory lands on something your hands already know. It sticks.', '03'],
  ];

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden font-sans antialiased transition-colors duration-300"
      style={{ background: pageBg, color: ink }}
    >
      <GridBackground isLight={isLight} />

      {/* Scroll signal — a rail that charges up as you read (desktop). */}
      <div className="fixed bottom-0 left-5 top-0 z-30 hidden w-[2px] xl:block" style={{ background: hairline }} aria-hidden>
        <motion.div className="h-full w-full origin-top" style={{ scaleY: scrollYProgress, background: BRAND }} />
      </div>

      <div className="relative z-10">
        {/* ── Header ── */}
        <header className="sticky top-0 z-40" style={{ background: pageBg }}>
          <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <BrandMark size={28} />
              <span className="text-[16px] font-extrabold tracking-tight">
                Bit<span style={{ color: BRAND }}>For</span>Bytes
              </span>
            </div>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Sections">
              {[['Courses', '#courses'], ['Live demo', '#demo'], ['Method', '#how'], ['FAQ', '#faq'], ['Workbench', '/workbench']].map(([label, href]) => (
                href.startsWith('/') ? (
                  <Link key={href} to={href} className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-60" style={{ color: BRAND }}>
                    {label}
                  </Link>
                ) : (
                  <a key={href} href={href} className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-60" style={{ color: dim }}>
                    {label}
                  </a>
                )
              ))}
            </nav>
            <div className="flex items-center gap-2.5">
              <ThemeToggle variant="minimal" />
              <Link
                to={authed ? '/profile' : '/login'}
                className="hidden text-[13px] font-semibold transition-opacity hover:opacity-70 sm:block"
                style={{ color: dim }}
              >
                {authed ? 'Profile' : 'Sign in'}
              </Link>
              <button
                onClick={() => navigate('/portal')}
                className="rounded-lg px-4 py-2 text-[13.5px] font-bold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: BRAND }}
              >
                Get started
              </button>
            </div>
          </div>
          <SquareWave stroke={hairline} />
        </header>

        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          {/* ── Hero: headline + the byte ── */}
          <section className="grid items-center gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pb-24 lg:pt-24">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: faint }}
              >
                Silicon, in the browser
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 text-[44px] font-extrabold leading-[1.02] tracking-tight sm:text-[60px] lg:text-[68px]"
              >
                Learn electronics<br />
                <span style={{ color: BRAND }}>backwards.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 max-w-md text-[15.5px] leading-relaxed" style={{ color: dim }}
              >
                Build the circuit first. Flip its inputs, watch it answer — the theory clicks
                once your hands already know it.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => navigate('/portal')}
                  className="group inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: BRAND }}
                >
                  Get started <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href="#courses"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold underline-offset-4 transition-opacity hover:opacity-70 hover:underline"
                  style={{ color: dim }}
                >
                  See the three paths <ChevronDown size={14} />
                </a>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: faint }}
              >
                Free for every ECE student in India
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
              <ByteFlipper panel={panel} dim={dim} faint={faint} hairline={hairline} isLight={isLight} />
            </motion.div>
          </section>
        </div>

        <SquareWave stroke={hairline} />

        {/* ── Facts as a logic-analyzer readout — the waveform IS the number ── */}
        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          <div className="py-10">
            {/* Bit positional weight header above waveform channels */}
            <div className="mb-2 flex items-center gap-4 border-b pb-2 sm:gap-6" style={{ borderColor: hairline }}>
              <span className="w-[118px] flex-shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.16em] sm:w-[168px] sm:text-[10px]" style={{ color: faint }}>
                Signal / Bus
              </span>
              <div className="hidden flex-1 items-center justify-between px-1 font-mono text-[9px] font-bold sm:flex" style={{ color: faint }}>
                {['2⁷ (128)', '2⁶ (64)', '2⁵ (32)', '2⁴ (16)', '2³ (8)', '2² (4)', '2¹ (2)', '2⁰ (1)'].map((weight) => (
                  <span key={weight} className="w-full text-center">{weight}</span>
                ))}
              </div>
              <div className="flex-1 font-mono text-[9px] font-bold sm:hidden" style={{ color: faint }}>
                8-bit digital waveform (MSB → LSB)
              </div>
              <span className="w-14 flex-shrink-0 text-right font-mono text-[9px] font-bold uppercase tracking-[0.12em] sm:w-16 sm:text-[10px]" style={{ color: faint }}>
                Dec
              </span>
              <span className="hidden w-[86px] flex-shrink-0 text-right font-mono text-[9px] font-bold uppercase tracking-[0.12em] sm:block" style={{ color: faint }}>
                8-Bit Bus
              </span>
            </div>

            <div className="space-y-1">
              {CHANNELS.map(({ label, value }, i) => {
                const bits = toBits(value);
                const flat = value === 0;
                return (
                  <div key={label} className="flex items-center gap-4 py-2 sm:gap-6">
                    <span className="w-[118px] flex-shrink-0 font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.16em] sm:w-[168px] sm:text-[10.5px]" style={{ color: faint }}>
                      {label}
                    </span>
                    <svg className="h-6 min-w-0 flex-1" viewBox="0 0 160 24" preserveAspectRatio="none" aria-hidden>
                      <motion.path
                        d={bitsWave(bits)}
                        fill="none"
                        stroke={flat ? hairline : BRAND}
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.9, delay: i * 0.12, ease: 'easeOut' }}
                      />
                    </svg>
                    <span className="w-14 flex-shrink-0 text-right text-[24px] font-extrabold leading-none tabular-nums sm:w-16 sm:text-[28px]">
                      {value}
                    </span>
                    <span className="hidden w-[86px] flex-shrink-0 text-right font-mono text-[10.5px] font-semibold tabular-nums sm:block" style={{ color: faint }}>
                      {bits.join('')}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: faint }}>
              <div className="flex items-center gap-2 rounded-full border px-3 py-1" style={{ borderColor: hairline, background: isLight ? 'rgba(122,63,208,0.06)' : 'rgba(168,85,247,0.08)' }}>
                <span className="h-2 w-2 animate-ping rounded-full" style={{ background: BRAND }} />
                <span className="tabular-nums" style={{ color: BRAND }}>● 142,890 logic gates simulated by students this week</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">Waveforms encode binary values via bit weights:</span>
                <TextbookEquation block={false} math="2^0(1) + 2^1(2) + 2^2(4) + 2^3(8) + 2^4(16) + 2^5(32) + 2^6(64) + 2^7(128)" />
              </div>
            </div>
          </div>
        </div>

        <SquareWave stroke={hairline} />

        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          {/* ── Courses ── */}
          <section id="courses" className="scroll-mt-20 py-16 lg:py-24">
            <Reveal>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: faint }}>Courses</p>
              <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
                From one bit to a whole chip.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-7 md:grid-cols-3 md:gap-5 lg:gap-7">
              {PATHS.map((p, i) => {
                const mods = modulesFor(p.prefix);
                return (
                  <Reveal key={p.prefix} delay={i * 0.08}>
                    <div
                      className={`pinned-tape relative flex h-full flex-col p-6 pt-8 ${i === 1 ? '' : i === 0 ? 'pinned-tilt' : 'pinned-tilt-r'}`}
                      style={panel}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-md" style={{ background: `${p.color}1F`, color: p.color }}>
                          <p.icon size={19} />
                        </span>
                        {p.badge && (
                          <span className="rounded-md border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em]" style={{ borderColor: hairline, color: p.color }}>
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-4 text-[18px] font-bold leading-tight">{p.title}</h3>
                      <p className="mt-1 text-[13px]" style={{ color: dim }}>{p.tagline}</p>

                      {/* module tick-strip */}
                      <div className="mt-4 flex h-[8px] gap-[3px]">
                        {mods.map((_, j) => (
                          <span key={j} className="flex-1 rounded-[2px]" style={{ background: `${p.color}33` }} />
                        ))}
                      </div>
                      <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: faint }}>
                        {mods.length} modules
                      </p>

                      <ul className="mt-4 flex-1 space-y-1.5">
                        {mods.slice(0, 4).map((m) => (
                          <li key={m} className="flex items-center gap-2 text-[13px]" style={{ color: dim }}>
                            <Check size={13} style={{ color: p.color }} /> <span className="truncate">{m}</span>
                          </li>
                        ))}
                        {mods.length > 4 && (
                          <li className="pl-[21px] font-mono text-[11px] font-semibold" style={{ color: faint }}>
                            + {mods.length - 4} more
                          </li>
                        )}
                      </ul>

                      <button
                        onClick={() => navigate(p.to)}
                        className="group mt-5 inline-flex items-center gap-2 text-[14px] font-bold transition-opacity hover:opacity-75"
                        style={{ color: p.color }}
                      >
                        Start the path <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={0.1}>
              <p className="mt-10 text-center text-[13.5px]" style={{ color: dim }}>
                Start the first 5 modules instantly without an account. All {TOTAL_MODULES} modules are 100% free with a free account.
                <Link to="/career-roadmap" className="ml-2 font-semibold underline-offset-4 hover:underline" style={{ color: BRAND }}>
                  See where these skills lead
                </Link>
              </p>
            </Reveal>
          </section>
        </div>

        <SquareWave stroke={hairline} />

        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          {/* ── Live demo ── */}
          <section id="demo" className="grid scroll-mt-20 items-center gap-10 py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:py-24">
            <Reveal>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: faint }}>Live demo</p>
              <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
                Poke it. It answers.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: dim }}>
                Every concept on this site is a live circuit, not a diagram. Here's the smallest
                one we have — an XOR gate. Flip A and B and watch the lamp make up its mind.
              </p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed" style={{ color: dim }}>
                When you can read this, you can read a half adder. That's lesson one.
              </p>

              {/* Textbook vs BitForBytes Comparison Card */}
              <div className="mt-6 rounded-lg border p-4 font-mono text-[11px]" style={{ borderColor: hairline, background: isLight ? 'rgba(27,20,54,0.03)' : 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: hairline }}>
                  <span className="font-bold uppercase text-red-500/80">Traditional Textbook</span>
                  <span className="font-bold uppercase" style={{ color: BRAND }}>BitForBytes Workbench</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="text-slate-400">
                    <p className="italic">"Let f(A,B) = A'B + AB'. Memorize page 142 table 4.1..."</p>
                  </div>
                  <div style={{ color: dim }}>
                    <p className="font-bold text-emerald-500">✓ Click switch A → Signal flows → Output glows LIVE</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/workbench')}
                className="group mt-6 inline-flex items-center gap-2 text-[14.5px] font-bold transition-opacity hover:opacity-75"
                style={{ color: BRAND }}
              >
                Open the full Workbench <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Reveal>
            <Reveal delay={0.1}>
              <XorDemo panel={panel} dim={dim} faint={faint} hairline={hairline} isLight={isLight} />
            </Reveal>
          </section>
        </div>

        <SquareWave stroke={hairline} />

        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          {/* ── Method ── */}
          <section id="how" className="scroll-mt-20 py-16 lg:py-24">
            <Reveal>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: faint }}>Method</p>
              <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
                Backwards, on purpose.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
              {STEPS.map(([title, body, num], i) => (
                <Reveal key={num} delay={i * 0.08}>
                  <span
                    className="block select-none text-[72px] font-extrabold leading-[0.85] tracking-tight transition-all duration-300 hover:scale-105"
                    style={{
                      WebkitTextStroke: isLight ? `2px ${BRAND}` : `2px #A855F7`,
                      color: 'transparent',
                      filter: isLight 
                        ? 'drop-shadow(0 0 12px rgba(122, 63, 208, 0.35))'
                        : 'drop-shadow(0 0 18px rgba(168, 85, 247, 0.5)) drop-shadow(0 0 35px rgba(122, 63, 208, 0.3))',
                    }}
                  >
                    {num}
                  </span>
                  <h3 className="mt-4 text-[19px] font-bold">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed" style={{ color: dim }}>{body}</p>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        <SquareWave stroke={hairline} />

        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          {/* ── Students ── */}
          <section className="py-16 lg:py-24">
            <Reveal>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: faint }}>Students</p>
              <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
                Verbatim.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-7 md:grid-cols-3 md:gap-5 lg:gap-7">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <figure className={`pinned-tape relative h-full p-6 pt-8 ${i === 0 ? 'pinned-tilt' : i === 2 ? 'pinned-tilt-r' : ''}`} style={panel}>
                    <blockquote className="text-[14px] leading-relaxed" style={{ color: dim }}>
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-dashed pt-4" style={{ borderColor: hairline }}>
                      <span className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-black text-white" style={{ background: BRAND }}>
                        {t.name[0]}
                      </span>
                      <span>
                        <span className="block text-[13.5px] font-bold">{t.name}</span>
                        <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: faint }}>{t.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        <SquareWave stroke={hairline} />

        {/* ── FAQ Section ── */}
        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          <section id="faq" className="scroll-mt-20 py-16 lg:py-24">
            <Reveal>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: faint }}>Questions</p>
              <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
                Frequently asked.
              </h2>
            </Reveal>
            <div className="mt-10 space-y-4">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <Reveal key={idx} delay={idx * 0.05}>
                    <div style={panel} className="overflow-hidden">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between p-5 text-left text-[15px] font-bold transition-opacity hover:opacity-80 sm:p-6"
                        style={{ color: ink }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: dim }} />
                      </button>
                      {isOpen && (
                        <div className="border-t border-dashed px-5 pb-5 pt-3 text-[14px] leading-relaxed sm:px-6 sm:pb-6" style={{ borderColor: hairline, color: dim }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        </div>

        <SquareWave stroke={hairline} />

        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          {/* ── CTA ── */}
          <section className="py-16 lg:py-24">
            <Reveal>
              <div className="relative overflow-hidden p-8 text-center sm:p-12" style={panel}>
                <span className="absolute inset-x-0 top-0 h-[5px]" style={{ background: BRAND }} />
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: faint }}>
                  No installs · no card · 100% free
                </p>
                <h2 className="mx-auto mt-3 max-w-xl text-[30px] font-extrabold leading-tight tracking-tight sm:text-[40px]">
                  Your first five modules are free. So are the rest.
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[15px]" style={{ color: dim }}>
                  Open the workstation, pick a lane, and flip your first real bit today.
                </p>
                <button
                  onClick={() => navigate('/portal')}
                  className="group mx-auto mt-8 inline-flex items-center gap-2 rounded-lg px-7 py-4 text-[16px] font-bold text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: BRAND }}
                >
                  Open the workstation <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </Reveal>
          </section>

          {/* ── Footer ── */}
          <footer className="border-t pb-12 pt-10" style={{ borderColor: hairline }}>
            <div className="grid gap-8 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <div className="flex items-center gap-2">
                  <BrandMark size={24} />
                  <span className="font-mono text-[14px] font-bold tracking-wider">BitForBytes</span>
                </div>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed" style={{ color: dim }}>
                  Hands-on digital logic & VLSI interactive learning platform. Built for students, self-taught engineers, and silicon enthusiasts.
                </p>
                <div className="mt-4 flex items-center gap-2 font-mono text-[10.5px]" style={{ color: faint }}>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>All Systems Operational (v1.0.4)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 sm:col-span-4 sm:grid-cols-2">
                <div>
                  <h5 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: faint }}>Platform</h5>
                  <ul className="mt-3 space-y-2 font-mono text-[12px] font-semibold" style={{ color: dim }}>
                    <li><button onClick={() => navigate('/workbench')} className="hover:underline">Workbench</button></li>
                    <li><button onClick={() => navigate('/analogies')} className="hover:underline font-mono">Analogy Library</button></li>
                    <li><button onClick={() => navigate('/kmap-lab')} className="hover:underline font-mono">K-Map Solver</button></li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: faint }}>Legal & Support</h5>
                  <ul className="mt-3 space-y-2 font-mono text-[12px] font-semibold" style={{ color: dim }}>
                    <li><a href="mailto:support@bitforbytes.com" className="hover:underline">Contact Us</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); alert("BitForBytes is 100% free open educational software for students."); }} className="hover:underline">Terms of Service</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Your privacy is respected. No personal data sold or tracked."); }} className="hover:underline">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>

              <div className="sm:col-span-3 sm:text-right">
                <h5 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: faint }}>Community</h5>
                <div className="mt-3 flex items-center justify-start gap-3 sm:justify-end">
                  {[
                    {
                      label: 'GitHub',
                      href: 'https://github.com',
                      icon: (
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      ),
                    },
                    {
                      label: 'Discord',
                      href: 'https://discord.gg/NugcR5UXp',
                      icon: (
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.078-.01c3.927 1.793 8.18 1.793 12.061 0a.075.075 0 01.079.009c.12.098.245.195.372.288a.077.077 0 01-.006.128 12.299 12.299 0 01-1.873.891.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                      ),
                    },
                    {
                      label: 'Instagram',
                      href: 'https://www.instagram.com/bit_for_bytes/',
                      icon: (
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      ),
                    },
                    {
                      label: 'LinkedIn',
                      href: 'https://www.linkedin.com/company/bitforbytes/',
                      icon: (
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      ),
                    },
                    {
                      label: 'X (Twitter)',
                      href: 'https://x.com',
                      icon: (
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ),
                    },
                  ].map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 hover:-translate-y-0.5 hover:opacity-100"
                      style={{ borderColor: hairline, color: dim, background: isLight ? 'rgba(27,20,54,0.04)' : 'rgba(255,255,255,0.04)' }}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6 text-center font-mono text-[11px] font-semibold" style={{ borderColor: hairline, color: faint }}>
              © 2026 BitForBytes · Made with care for engineering students worldwide
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BrilliantHome;
