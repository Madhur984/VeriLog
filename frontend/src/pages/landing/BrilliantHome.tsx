import React, { useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Check, Binary, Zap, Boxes, type LucideIcon } from 'lucide-react';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ThemeToggle } from '../../components/ThemeToggle';
import { BrandMark } from '../../components/Brand';
import { MODULE_LABELS } from '../../lib/moduleHistory';
import { isAuthenticated } from '../../lib/auth';

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

  return (
    <div className="relative" style={panel}>
      <span className="absolute inset-y-0 left-0 w-[5px]" style={{ background: BRAND }} />
      <div className="p-5 pl-6 sm:p-6 sm:pl-7">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: faint }}>
          Try it — flip a bit
        </p>

        <div className="mt-4 grid grid-cols-8 gap-1.5 sm:gap-2">
          {bits.map((b, i) => (
            <button
              key={i}
              onClick={() => setBits((prev) => prev.map((v, j) => (j === i ? 1 - v : v)))}
              aria-label={`bit ${7 - i}, currently ${b}`}
              className="flex h-12 items-center justify-center rounded-md border-2 font-mono text-[16px] font-bold transition-transform active:scale-90 sm:h-14"
              style={{
                borderColor: b ? BRAND : hairline,
                background: b ? BRAND : 'transparent',
                color: b ? '#fff' : dim,
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
          <span style={{ color: isLight ? '#1B1436' : '#E2E8F0' }}>ASCII {printable ? `'${char}'` : '—'}</span>
        </div>

        <p className="mt-3 border-t border-dashed pt-3 text-[12.5px] leading-relaxed" style={{ borderColor: hairline, color: dim }}>
          {value === 66
            ? <>01000010 is 66 — the letter <b>B</b>, as in Bytes. Every key you press does this.</>
            : <>You just made {value}{printable ? <> — the character <b>{char}</b></> : ''}. That's all a byte is.</>}
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
    { label: 'free, no account', value: 5 },
    { label: 'installs required', value: 0 },
  ];
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
              {[['Courses', '#courses'], ['Live demo', '#demo'], ['Method', '#how']].map(([label, href]) => (
                <a key={href} href={href} className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-60" style={{ color: dim }}>
                  {label}
                </a>
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
            <p className="mt-5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: faint }}>
              Every number here is just bits — these four included
            </p>
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
                First five modules free, no account needed.
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
                    className="block select-none text-[72px] font-extrabold leading-[0.85] tracking-tight"
                    style={{ WebkitTextStroke: `2px ${numeralStroke}`, color: 'transparent' }}
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

        <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
          {/* ── CTA ── */}
          <section className="py-16 lg:py-24">
            <Reveal>
              <div className="relative overflow-hidden p-8 text-center sm:p-12" style={panel}>
                <span className="absolute inset-x-0 top-0 h-[5px]" style={{ background: BRAND }} />
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: faint }}>
                  No installs · no card · no excuses
                </p>
                <h2 className="mx-auto mt-3 max-w-xl text-[30px] font-extrabold leading-tight tracking-tight sm:text-[40px]">
                  Your first five modules are free.
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
          <footer className="border-t pb-12 pt-8" style={{ borderColor: hairline }}>
            <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
              <div className="flex items-center gap-2">
                <BrandMark size={22} />
                <span className="font-mono text-[11px] font-semibold" style={{ color: faint }}>© 2026 BitForBytes · made for students</span>
              </div>
              <div className="flex items-center gap-6">
                {[
                  ['Discord', 'https://discord.gg/NugcR5UXp'],
                  ['Instagram', 'https://www.instagram.com/bit_for_bytes/'],
                  ['LinkedIn', 'https://www.linkedin.com/company/bitforbytes/'],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-60"
                    style={{ color: dim }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BrilliantHome;
