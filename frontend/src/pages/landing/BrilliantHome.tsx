import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sun, Moon, Menu, X,
  Binary, Grid3x3, Zap,
  Check, Star, Cpu,
} from 'lucide-react';
import { BrandWordmark } from '../../components/Brand';
import { SignalShowcase } from './SignalShowcase';
import { LANDING_ROUTES } from './landingRoutes';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

/* ── accent system ────────────────────────────────────────────────────────
 * The whole page runs on CSS variables instead of hardcoded colors. The page
 * starts SAKURA PINK + white; when the scroll-driven signal trace reaches the
 * dev board at the bottom, the link "powers up" and the accent flips to LIGHT
 * BLUE + white (latched). No orange anywhere.
 */
const ACCENTS = {
  pink: {
    '--ac': '#F472B6',
    '--ac-strong': '#EC4899',
    '--ac-soft': '#FBCFE8',
    '--ac-glow': 'rgba(244,114,182,0.45)',
    '--ac-tint': 'rgba(244,114,182,0.10)',
    '--ac-tint15': 'rgba(244,114,182,0.15)',
    '--ac-tint20': 'rgba(244,114,182,0.20)',
    '--ac-tint25': 'rgba(244,114,182,0.25)',
  },
  cyan: {
    '--ac': '#38BDF8',
    '--ac-strong': '#0284C7',
    '--ac-soft': '#BAE6FD',
    '--ac-glow': 'rgba(56,189,248,0.45)',
    '--ac-tint': 'rgba(56,189,248,0.10)',
    '--ac-tint15': 'rgba(56,189,248,0.15)',
    '--ac-tint20': 'rgba(56,189,248,0.20)',
    '--ac-tint25': 'rgba(56,189,248,0.25)',
  },
} as const;

/* Scope palettes for the hero oscilloscope (dark card → brighter shades). */
const SIGNAL_SAKURA = {
  main: '#F9A8D4',
  soft: '#F472B6',
  bright: '#FBCFE8',
  glow: 'rgba(244,114,182,0.4)',
};
const SIGNAL_SKY = {
  main: '#7DD3FC',
  soft: '#38BDF8',
  bright: '#BAE6FD',
  glow: 'rgba(56,189,248,0.4)',
};

/* ── data ─────────────────────────────────────────────────────────────── */

// Source of truth: HierarchicalGrindTree. Update here if a module is added or renamed.
const PATHS = [
  {
    icon: Binary, title: 'Digital Logic & Verilog', tag: 'Verilog', color: '#F472B6', base: '/module', startHere: false, comingSoon: true,
    modules: ['Signals & Waves', 'Number Systems', 'Logic Gates', 'Karnaugh Maps', 'Verilog Core', 'Advanced Verilog'],
  },
  {
    icon: Zap, title: 'Basic Electronics', tag: 'Electronics', color: '#2563EB', base: '/basic-electronics', startHere: true, comingSoon: false,
    modules: ['Physics of Control', 'Silicon, Doping & Carriers', 'The P-N Junction', 'Rectifiers & Filters', 'Special-Purpose Diodes'],
  },
  {
    icon: Grid3x3, title: 'Digital System Design', tag: 'DSD', color: '#9333EA', base: '/dsd', startHere: false, comingSoon: false,
    modules: ['Binary & Boolean Logic', 'K-Maps', 'Circuit Realisation', 'Practice Arena', 'Universal Gates', 'Combinational & Sequential', 'The Half Adder', 'The Full Adder'],
  },
];

const FACTS: Array<[string, string]> = [
  ['3', 'learning paths'],
  ['19', 'interactive modules'],
  ['5', 'modules free, no account'],
  ['0', 'installs'],
];

const TESTIMONIALS = [
  { quote: 'K-maps finally made sense after one afternoon here. Once I could flip the inputs and watch the output change, it just clicked.', name: 'Aarav', role: '2nd year ECE' },
  { quote: 'The Verilog labs feel like a game. I went from copy pasting code to actually writing an FSM that runs.', name: 'Meera', role: 'VLSI intern' },
  { quote: 'Way better than sitting through slides. Building the datapath piece by piece is the first time architecture felt real to me.', name: 'Karthik', role: 'Final year ECE' },
];

/* ── small building blocks ───────────────────────────────────────────── */

const Shell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-6xl px-5 sm:px-6 ${className}`}>{children}</div>
);

const PrimaryBtn: React.FC<{ to: string; children: React.ReactNode; className?: string }> = ({ to, children, className = '' }) => (
  <Link
    to={to}
    className={`group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ac)] px-7 py-4 text-[16px] font-bold text-white shadow-[0_14px_38px_-12px_var(--ac-glow)] transition-all hover:bg-[var(--ac-strong)] active:scale-[0.98] ${className}`}
  >
    {children}
    <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
  </Link>
);

/* ── live XOR demo (the "try it" artifact in the why band) ───────────── */

const XOR_ROWS = [
  { a: false, b: false, out: false },
  { a: false, b: true, out: true },
  { a: true, b: false, out: true },
  { a: true, b: true, out: false },
];

const XorDemo: React.FC = () => {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  const out = a !== b;

  const toggleCls = (on: boolean) =>
    `flex h-12 w-12 items-center justify-center rounded-xl border-2 font-mono text-lg font-bold transition-all active:scale-95 ${
      on
        ? 'border-[var(--ac)] bg-[var(--ac-tint)] text-[var(--ac-strong)] dark:text-[var(--ac-soft)]'
        : 'border-slate-300 bg-white text-slate-400 dark:border-white/15 dark:bg-white/[0.04]'
    }`;
  const wireCls = (on: boolean) =>
    on ? 'stroke-[var(--ac)] transition-colors duration-300' : 'stroke-slate-300 transition-colors duration-300 dark:stroke-white/20';

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">XOR gate</span>
        <span className="rounded-full bg-[var(--ac-tint)] px-2 py-0.5 text-[10px] font-bold text-[var(--ac-strong)] dark:bg-[var(--ac-tint15)] dark:text-[var(--ac-soft)]">Live</span>
      </div>

      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-1 text-center font-mono text-[10px] text-slate-400">A</div>
            <button aria-pressed={a} onClick={() => setA((v) => !v)} className={toggleCls(a)}>{a ? '1' : '0'}</button>
          </div>
          <div>
            <div className="mb-1 text-center font-mono text-[10px] text-slate-400">B</div>
            <button aria-pressed={b} onClick={() => setB((v) => !v)} className={toggleCls(b)}>{b ? '1' : '0'}</button>
          </div>
        </div>

        <svg viewBox="0 0 200 96" className="h-24 w-full max-w-[200px]">
          <path d="M0 24 H56" fill="none" strokeWidth={3} strokeLinecap="round" className={wireCls(a)} />
          <path d="M0 72 H56" fill="none" strokeWidth={3} strokeLinecap="round" className={wireCls(b)} />
          <path d="M128 48 H200" fill="none" strokeWidth={3} strokeLinecap="round" className={wireCls(out)} />
          <rect x="56" y="12" width="72" height="72" rx="16" strokeWidth={2} className="fill-white stroke-slate-300 dark:fill-[#13141C] dark:stroke-white/15" />
          <text x="92" y="53" textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 font-mono text-sm font-bold dark:fill-slate-200">XOR</text>
        </svg>

        <div className="flex flex-col items-center gap-2">
          <div className="font-mono text-[10px] text-slate-400">OUT</div>
          <div
            className={`h-12 w-12 rounded-full border-2 transition-all duration-300 ${
              out
                ? 'border-[var(--ac)] bg-[var(--ac)] shadow-[0_0_24px_var(--ac-glow)]'
                : 'border-slate-300 bg-slate-200 dark:border-white/15 dark:bg-white/10'
            }`}
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 font-mono text-xs dark:border-white/10">
        <div className="grid grid-cols-3 bg-slate-100 px-3 py-1.5 text-center font-bold text-slate-500 dark:bg-white/5">
          <span>A</span><span>B</span><span>OUT</span>
        </div>
        {XOR_ROWS.map((row) => {
          const active = row.a === a && row.b === b;
          return (
            <div
              key={`${row.a}${row.b}`}
              className={`grid grid-cols-3 px-3 py-1.5 text-center transition-colors ${
                active ? 'bg-[var(--ac-tint)] font-bold text-[var(--ac-strong)] dark:bg-[var(--ac-tint15)] dark:text-[var(--ac-soft)]' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{row.a ? 1 : 0}</span><span>{row.b ? 1 : 0}</span><span>{row.out ? 1 : 0}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">Try it. This is what every lesson feels like.</p>
    </div>
  );
};

/* ── the dev board the scroll-signal plugs into ──────────────────────── */

const DevBoard: React.FC<{ connected: boolean }> = ({ connected }) => (
  <svg viewBox="0 0 360 200" className="h-auto w-full" role="img" aria-label="BFB-01 dev board">
    {/* board substrate */}
    <rect x="8" y="14" width="344" height="172" rx="14" fill="#0F1626" stroke={connected ? 'var(--ac)' : 'rgba(255,255,255,0.14)'} strokeWidth="2" />
    {/* mounting holes */}
    {[[26, 32], [334, 32], [26, 168], [334, 168]].map(([x, y]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
    ))}
    {/* input port J1 - where the page trace plugs in */}
    <rect x="166" y="6" width="28" height="20" rx="4" fill="#0A0E1A" stroke={connected ? 'var(--ac)' : 'rgba(255,255,255,0.25)'} strokeWidth="2" />
    <text x="180" y="40" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={connected ? 'var(--ac)' : '#64748B'}>PORT J1</text>
    {/* traces from J1 to the chip */}
    <path d="M180 26 V58" fill="none" stroke={connected ? 'var(--ac)' : 'rgba(255,255,255,0.15)'} strokeWidth="2.5"
          style={connected ? { filter: 'drop-shadow(0 0 5px var(--ac))' } : undefined} />
    {/* the MCU */}
    <rect x="130" y="58" width="100" height="76" rx="9" fill="#0A0E1A" stroke={connected ? 'var(--ac)' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
          style={connected ? { filter: 'drop-shadow(0 0 12px var(--ac-glow))' } : undefined} />
    <text x="180" y="90" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={connected ? 'var(--ac)' : '#94A3B8'}>BFB-01</text>
    <text x="180" y="108" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#64748B">LOGIC CORE</text>
    {/* chip pins */}
    {Array.from({ length: 6 }).map((_, i) => (
      <g key={i}>
        <line x1={138 + i * 17} y1="134" x2={138 + i * 17} y2="146" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
        <line x1={138 + i * 17} y1="46" x2={138 + i * 17} y2="58" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
      </g>
    ))}
    {/* side traces, light up when powered */}
    <path d="M130 96 H66 V150 H110" fill="none" stroke={connected ? 'var(--ac)' : 'rgba(255,255,255,0.12)'} strokeWidth="2" />
    <path d="M230 96 H296 V150 H250" fill="none" stroke={connected ? 'var(--ac)' : 'rgba(255,255,255,0.12)'} strokeWidth="2" />
    {/* power LED */}
    <circle cx="318" cy="96" r="7" fill={connected ? 'var(--ac)' : 'transparent'} stroke={connected ? 'var(--ac)' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
            style={connected ? { filter: 'drop-shadow(0 0 10px var(--ac))' } : undefined} />
    <text x="318" y="118" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={connected ? 'var(--ac)' : '#64748B'}>PWR</text>
    {/* silkscreen */}
    <text x="26" y="184" fontSize="8" fontFamily="monospace" fill="#475569">BITFORBYTES DEV BOARD · REV C</text>
  </svg>
);

/* ── page ─────────────────────────────────────────────────────────────── */

export const BrilliantHome: React.FC = () => {
  const authed = useIsAuthenticated();
  // Everyone lands on the portal: visitors without an account can open any 5
  // modules free there (ModuleGate enforces the limit; the rest show locked).
  const primaryTo = LANDING_ROUTES.workstation;
  const primaryLabel = authed ? 'Go to workstation' : 'Get started';

  // Home page is light by default with a working dark toggle. We capture the
  // user's saved app theme on mount and put it back when they leave, so the rest
  // of the app keeps its own setting.
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const savedRef = useRef<string | null>(null);

  useEffect(() => {
    try { savedRef.current = localStorage.getItem('bitforbytes_theme') ?? 'dark'; } catch { savedRef.current = 'dark'; }
    return () => {
      const root = document.documentElement;
      const prev = savedRef.current || 'dark';
      if (prev === 'dark') { root.classList.add('dark'); root.classList.remove('light'); }
      else { root.classList.add('light'); root.classList.remove('dark'); }
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add('dark'); root.classList.remove('light'); }
    else { root.classList.add('light'); root.classList.remove('dark'); }
  }, [dark]);

  /* ── scroll signal: a trace drawn down the page that plugs into the board.
   * When it connects, the page accent flips pink → cyan (latched). */
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const connectedRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [rail, setRail] = useState<{ w: number; h: number; d: string } | null>(null);

  const measure = useCallback(() => {
    const m = mainRef.current, bo = boardRef.current;
    if (!m || !bo) return;
    const mr = m.getBoundingClientRect();
    const br = bo.getBoundingClientRect();
    const w = mr.width;
    const h = m.offsetHeight;
    // The trace meanders down the page's spine as a chain of S-curves, swinging
    // left and right of center, then straightens for the final drop into PORT J1.
    // Cards it crosses sit at z-30, so the signal threads underneath them.
    const plugX = br.left + br.width / 2 - mr.left;
    const startY = 78; // tucked under the floating pill nav (16px gap + 64px pill) - the line hangs from it
    const plugY = br.top - mr.top + 8;
    const amp = Math.min(w * 0.18, 170);
    const approach = 110;                       // straight run into the plug
    const span = Math.max(plugY - approach - startY, 1);
    const waves = Math.max(2, Math.round(span / 650));
    const segH = span / waves;
    let d = `M ${plugX} ${startY}`;
    for (let i = 0; i < waves; i++) {
      const dir = i % 2 === 0 ? 1 : -1;
      const y0 = startY + i * segH;
      const y1 = startY + (i + 1) * segH;
      d += ` C ${plugX + dir * amp} ${y0 + segH * 0.25}, ${plugX + dir * amp} ${y1 - segH * 0.25}, ${plugX} ${y1}`;
    }
    d += ` L ${plugX} ${plugY}`;
    setRail({ w, h, d });
  }, []);

  useEffect(() => {
    measure();
    const m = mainRef.current;
    const ro = new ResizeObserver(() => measure());
    if (m) ro.observe(m);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [measure]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const m = mainRef.current, bo = boardRef.current, p = pathRef.current;
      if (!m || !bo || !p) return;
      const startAbs = m.getBoundingClientRect().top + 78;
      const endAbs = bo.getBoundingClientRect().top + 8;
      const probe = window.innerHeight * 0.82;
      const span = Math.max(endAbs - startAbs, 1);
      const prog = Math.min(1, Math.max(0, (probe - startAbs) / span));
      p.style.strokeDashoffset = String(1 - prog);
      try {
        const len = p.getTotalLength();
        const pt = p.getPointAtLength(len * prog);
        const dot = dotRef.current;
        if (dot) {
          dot.setAttribute('cx', String(pt.x));
          dot.setAttribute('cy', String(pt.y));
          dot.style.opacity = prog > 0.01 && prog < 0.995 ? '1' : '0';
        }
      } catch { /* path not laid out yet */ }
      if (prog >= 0.995 && !connectedRef.current) {
        connectedRef.current = true;
        setConnected(true);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rail]);

  const navLinks = [
    ['Courses', '#courses'],
    ['How it works', '#how'],
    ['Why BitForBytes', '#why'],
  ] as const;

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen w-full text-slate-900 antialiased dark:text-slate-100 selection:bg-[var(--ac-tint25)]"
      style={{
        ...(ACCENTS[connected ? 'cyan' : 'pink'] as React.CSSProperties),
        // one continuous accent gradient over the whole page: strongest at the very
        // top, airy through the middle, deepening again as the signal reaches the board
        background: dark
          ? 'linear-gradient(180deg, var(--ac-tint) 0%, transparent 24%, transparent 62%, var(--ac-tint) 100%), #0A0B12'
          : 'linear-gradient(180deg, var(--ac-tint) 0%, transparent 24%, transparent 62%, var(--ac-tint) 88%, var(--ac-tint15) 100%), #ffffff',
      }}
    >
      {/* ── NAV · floating pill, brilliant.org style ── */}
      <header className="sticky top-4 z-50 px-4 sm:px-6">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full border border-slate-200/70 bg-white/85 px-5 shadow-[0_12px_40px_-14px_rgba(15,23,42,0.25)] backdrop-blur-md dark:border-white/10 dark:bg-[#0A0B12]/85 dark:shadow-[0_12px_40px_-14px_rgba(0,0,0,0.8)] sm:px-7">
          <Link to="/" className="active-press">
            <BrandWordmark size={26} textClassName="text-base text-slate-900 dark:text-white" />
          </Link>

          <nav className="hidden items-center gap-8 text-[14px] font-semibold text-slate-600 dark:text-slate-300 md:flex">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className="transition-colors hover:text-slate-900 dark:hover:text-white">{label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {authed ? (
              <Link to="/profile" className="hidden text-[14px] font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:inline">Profile</Link>
            ) : (
              <Link to="/login" className="hidden text-[14px] font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:inline">Sign in</Link>
            )}
            <Link to={primaryTo} className="hidden rounded-full bg-[var(--ac)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_var(--ac-glow)] transition-all hover:bg-[var(--ac-strong)] md:inline-flex">{primaryLabel}</Link>
            <button onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" className="rounded-full border border-slate-200 p-1.5 text-slate-600 dark:border-white/10 dark:text-slate-300 md:hidden">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-5xl rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.3)] backdrop-blur-md dark:border-white/10 dark:bg-[#0A0B12]/95 md:hidden">
            <div className="flex flex-col gap-1 px-4 py-3 text-[15px] font-semibold text-slate-700 dark:text-slate-200">
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5">{label}</a>
              ))}
              {authed ? (
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5">Profile</Link>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5">Sign in</Link>
              )}
              <Link to={primaryTo} onClick={() => setMenuOpen(false)} className="mt-1 rounded-full bg-[var(--ac)] px-4 py-3 text-center text-white">{primaryLabel}</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[40rem] w-[40rem] rounded-full bg-[var(--ac-tint)] blur-[120px] dark:bg-[var(--ac-tint20)]" />
        <Shell className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--ac-tint20)] bg-[var(--ac-tint)] px-3 py-1.5 text-[12px] font-semibold text-[var(--ac-strong)] dark:border-[var(--ac-tint25)] dark:bg-[var(--ac-tint)] dark:text-[var(--ac-soft)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ac)]" /> Free to use, no account needed
            </div>
            <h1 className="text-[clamp(2.5rem,5.6vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight">
              Learn chip design<br />
              <span className="text-[var(--ac-strong)] dark:text-[var(--ac-soft)]">by doing.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Mess with real logic gates. Write your first Verilog. Work your way up to a CPU you put together yourself. It all happens in the browser.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryBtn to={primaryTo}>{primaryLabel}</PrimaryBtn>
              <a href="#courses" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 text-[16px] font-semibold text-slate-800 transition-colors hover:border-slate-400 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-white/30">
                See the courses
              </a>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={15} className="fill-[var(--ac)] text-[var(--ac)]" />)}</span>
              Free for every ECE student in India.
            </div>
          </div>

          <div className="relative z-30 lg:pl-4">
            <SignalShowcase accent={connected ? SIGNAL_SKY : SIGNAL_SAKURA} />
          </div>
        </Shell>
      </section>

      {/* ── FACT BAR ── */}
      <section className="border-y border-slate-200/70 bg-white/40 dark:border-white/10 dark:bg-white/[0.02]">
        <Shell className="grid grid-cols-2 gap-y-3 py-6 text-center sm:flex sm:items-baseline sm:justify-center sm:gap-0 sm:divide-x sm:divide-slate-200 dark:sm:divide-white/10">
          {FACTS.map(([n, label]) => (
            <div key={label} className="px-6">
              <span className="text-xl font-extrabold text-[var(--ac-strong)] dark:text-[var(--ac-soft)]">{n}</span>
              <span className="ml-2 text-[13px] font-medium text-slate-500 dark:text-slate-400">{label}</span>
            </div>
          ))}
        </Shell>
      </section>

      {/* ── LEARNING PATHS ── */}
      <section id="courses" className="py-20">
        <Shell>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ac-strong)] dark:text-[var(--ac-soft)]">Courses</span>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">From one bit to a whole chip.</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PATHS.map(({ icon: Icon, title, tag, color, base, startHere, comingSoon, modules }) => {
              const inner = (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${color}1A`, color }}>
                      <Icon size={22} />
                    </span>
                    {comingSoon ? (
                      <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:border-white/15 dark:text-slate-500">Coming soon</span>
                    ) : startHere ? (
                      <span className="rounded-full bg-[var(--ac)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Start here</span>
                    ) : (
                      <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color }}>{tag}</span>
                    )}
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold leading-snug">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{modules.length} interactive modules</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                    {modules.slice(0, 4).map((mod) => (
                      <li key={mod} className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 flex-none rounded-full" style={{ background: color }} />
                        {mod}
                      </li>
                    ))}
                    {modules.length > 4 && (
                      <li className="pl-4 text-slate-400 dark:text-slate-500">+ {modules.length - 4} more</li>
                    )}
                  </ul>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    {comingSoon ? (
                      <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Launching soon — stay tuned</span>
                    ) : (
                      <>
                        <span className="text-sm font-semibold" style={{ color }}>Start the path</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color }} />
                      </>
                    )}
                  </div>
                </>
              );
              const cardCls = 'group relative z-30 flex flex-col rounded-3xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-[#13141C]';
              return comingSoon ? (
                <div key={base} className={`${cardCls} opacity-75`} aria-disabled>
                  {inner}
                </div>
              ) : (
                <Link
                  key={base}
                  to={`${base}/1`}
                  className={`${cardCls} transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.25)] dark:hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)]`}
                >
                  {inner}
                </Link>
              );
            })}
          </div>

          <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
            First five modules free, no account needed.
            <Link to={LANDING_ROUTES.career} className="ml-2 font-semibold text-[var(--ac-strong)] hover:underline dark:text-[var(--ac-soft)]">See where these skills lead</Link>
          </p>
        </Shell>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="border-y border-slate-200/70 bg-white/40 py-20 dark:border-white/10 dark:bg-white/[0.02]">
        <Shell>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ac-strong)] dark:text-[var(--ac-soft)]">How it works</span>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">Every lesson is something you do.</h2>
          </div>

          <div className="relative mt-12 grid gap-10 md:grid-cols-3">
            <div aria-hidden className="absolute left-6 right-6 top-6 hidden border-t-2 border-dotted border-slate-300 md:block dark:border-white/15" />
            {([
              ['01', 'Pick a path', 'Nineteen modules, first five free.',
                <div key="v1" className="flex gap-2">
                  {[Binary, Zap, Grid3x3].map((I, i) => (
                    <span key={i} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ac-tint)] text-[var(--ac-strong)] dark:bg-[var(--ac-tint15)] dark:text-[var(--ac-soft)]">
                      <I size={18} />
                    </span>
                  ))}
                </div>],
              ['02', 'Mess with it', 'The circuit answers instantly.',
                <div key="v2" className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ac)] bg-[var(--ac-tint)] font-mono text-sm font-bold text-[var(--ac-strong)] dark:text-[var(--ac-soft)]">1</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-300 bg-white font-mono text-sm font-bold text-slate-400 dark:border-white/15 dark:bg-white/[0.04]">0</span>
                  <ArrowRight size={16} className="text-slate-400" />
                  <span className="h-10 w-10 rounded-full border-2 border-[var(--ac)] bg-[var(--ac)] shadow-[0_0_18px_var(--ac-glow)]" />
                </div>],
              ['03', 'Go from gates to Verilog', 'Real hardware code, in the browser.',
                <code key="v3" className="inline-block rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-[13px] text-slate-700 dark:border-white/10 dark:bg-[#13141C] dark:text-slate-200">
                  assign y = a ^ b;
                </code>],
            ] as Array<[string, string, string, React.ReactNode]>).map(([num, title, line, visual]) => (
              <div key={num}>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-sm font-bold text-[var(--ac-strong)] shadow-sm dark:border-white/10 dark:bg-[#13141C] dark:text-[var(--ac-soft)]">
                  {num}
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <div className="mt-4">{visual}</div>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{line}</p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      {/* ── WHY ── */}
      <section id="why" className="py-20">
        <Shell className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ac-strong)] dark:text-[var(--ac-soft)]">Why it works</span>
            <h2 className="mt-3 text-[clamp(1.8rem,3.6vw,2.75rem)] font-extrabold leading-[1.12] tracking-tight">Understand it. Don't just memorize it.</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Reading about a gate is not the same as flipping its inputs. Try the one on the right.
            </p>
            <ul className="mt-6 space-y-3">
              {['Live simulators in every lesson, not slides', 'Instant feedback on every answer', 'A clear route from basic electronics to Verilog'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[var(--ac-tint)] text-[var(--ac-strong)] dark:bg-[var(--ac-tint15)] dark:text-[var(--ac-soft)]"><Check size={14} /></span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8"><PrimaryBtn to={primaryTo}>Start the first lesson</PrimaryBtn></div>
          </div>
          <XorDemo />
        </Shell>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="border-t border-slate-200/70 bg-white/40 py-20 dark:border-white/10 dark:bg-white/[0.02]">
        <Shell>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ac-strong)] dark:text-[var(--ac-soft)]">From the students</span>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">It just clicks.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="relative z-30 rounded-2xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-[#13141C]">
                <blockquote className="leading-relaxed text-slate-700 dark:text-slate-300">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ac-tint)] text-sm font-bold text-[var(--ac-strong)] dark:bg-[var(--ac-tint15)] dark:text-[var(--ac-soft)]">{t.name[0]}</span>
                  <span className="text-sm font-semibold">{t.name}<span className="font-normal text-slate-400">, {t.role}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Shell>
      </section>

      {/* ── THE BOARD · where the scroll-signal lands ── */}
      <section className="relative border-t border-slate-200/70 py-24 dark:border-white/10">
        <Shell className="flex flex-col items-center text-center">
          <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--ac-strong)] dark:text-[var(--ac-soft)]">
            <Cpu size={14} /> {connected ? 'Link established' : 'Incoming signal'}
          </span>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">
            {connected ? 'Signal delivered. Board is live.' : 'Bring the signal home.'}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            The trace running down this page is the same idea as a trace on a real PCB: one wire,
            one bit. {connected ? 'It just reached the board — and the whole site switched to its powered-on colors.' : 'Scroll it all the way here and watch the board power up.'}
          </p>

          <div
            ref={boardRef}
            className="mt-12 w-full max-w-md rounded-3xl border p-5 transition-all duration-500 sm:p-6"
            style={{
              background: '#0A0E1A',
              borderColor: connected ? 'var(--ac)' : 'rgba(255,255,255,0.12)',
              boxShadow: connected ? '0 30px 80px -30px var(--ac-glow)' : '0 30px 80px -40px rgba(0,0,0,0.5)',
            }}
          >
            <DevBoard connected={connected} />
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] text-white/45">
              <span>PORT J1 · <span style={{ color: connected ? 'var(--ac)' : undefined }}>{connected ? 'CONNECTED' : 'WAITING FOR SIGNAL'}</span></span>
              <span>{connected ? 'PWR ON · 1 bit received' : 'PWR OFF'}</span>
            </div>
          </div>

          {connected && (
            <div className="mt-10">
              <PrimaryBtn to={primaryTo}>Now build the real thing</PrimaryBtn>
            </div>
          )}
        </Shell>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200/70 py-14 dark:border-white/10">
        <Shell className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <BrandWordmark size={24} textClassName="text-sm text-slate-900 dark:text-white" />
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">Bits become logic. Logic becomes silicon. Free for anyone who wants to learn it.</p>
          </div>
          {[
            ['Learn', [['Courses', '#courses'], ['How it works', '#how'], ['Career roadmap', LANDING_ROUTES.career]]],
            ['Platform', [['Sign in', '/login'], ['Workstation', LANDING_ROUTES.workstation]]],
            ['Community', [['GitHub', LANDING_ROUTES.github], ['Discord', LANDING_ROUTES.social.discord], ['Contact', LANDING_ROUTES.social.email]]],
          ].map(([title, links]) => (
            <div key={title as string}>
              <h4 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">{title as string}</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                {(links as [string, string][]).map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('/') ? (
                      <Link to={href} className="transition-colors hover:text-[var(--ac-strong)] dark:hover:text-[var(--ac-soft)]">{label}</Link>
                    ) : (
                      <a href={href} className="transition-colors hover:text-[var(--ac-strong)] dark:hover:text-[var(--ac-soft)]">{label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Shell>
        <Shell className="mt-10 border-t border-slate-200/70 pt-6 text-[13px] text-slate-400 dark:border-white/10">
          &copy; 2026 BitForBytes. Made for people who like to build.
        </Shell>
      </footer>

      {/* ── the scroll-driven signal trace (drawn above section backgrounds, never blocks clicks) ── */}
      {rail && (
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20"
          style={{ width: '100%', height: rail.h }}
          viewBox={`0 0 ${rail.w} ${rail.h}`}
          preserveAspectRatio="none"
          fill="none"
        >
          {/* ghost track so the destination is visible before you get there */}
          <path d={rail.d} stroke="var(--ac)" strokeOpacity={0.14} strokeWidth={2.5} strokeDasharray="6 8" />
          {/* the live signal, drawn by scrolling */}
          <path
            ref={pathRef}
            d={rail.d}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1}
            stroke="var(--ac)"
            strokeWidth={3}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px var(--ac-glow))' }}
          />
          {/* the signal tip */}
          <circle ref={dotRef} r={5} fill="var(--ac)" style={{ filter: 'drop-shadow(0 0 8px var(--ac))', opacity: 0 }} />
        </svg>
      )}
    </main>
  );
};

export default BrilliantHome;
