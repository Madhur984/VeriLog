import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sun, Moon, Menu, X,
  Binary, Grid3x3, Zap,
  Check, Star,
} from 'lucide-react';
import { BrandWordmark } from '../../components/Brand';
import { SignalShowcase } from './SignalShowcase';
import { LANDING_ROUTES } from './landingRoutes';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

/* ── data ─────────────────────────────────────────────────────────────── */

// Source of truth: HierarchicalGrindTree. Update here if a module is added or renamed.
const PATHS = [
  {
    icon: Binary, title: 'Digital Logic & Verilog', tag: 'Verilog', color: '#F97316', base: '/module', startHere: true,
    modules: ['Signals & Waves', 'Number Systems', 'Logic Gates', 'Karnaugh Maps', 'Verilog Core', 'Advanced Verilog'],
  },
  {
    icon: Zap, title: 'Basic Electronics', tag: 'Electronics', color: '#2563EB', base: '/basic-electronics', startHere: false,
    modules: ['Physics of Control', 'Silicon, Doping & Carriers', 'The P-N Junction', 'Rectifiers & Filters', 'Special-Purpose Diodes'],
  },
  {
    icon: Grid3x3, title: 'Digital System Design', tag: 'DSD', color: '#9333EA', base: '/dsd', startHere: false,
    modules: ['Binary & Boolean Logic', 'K-Maps', 'Circuit Realisation', 'Sequential Logic', 'Finite State Machines'],
  },
];

// One card per real module, each linking to its real route.
const MODULE_CARDS = PATHS.flatMap((p) =>
  p.modules.map((title, i) => ({
    title,
    icon: p.icon,
    tag: p.tag,
    color: p.color,
    num: i + 1,
    route: `${p.base}/${i + 1}`,
    startHere: p.startHere && i === 0,
  }))
);

const FACTS: Array<[string, string]> = [
  ['3', 'learning paths'],
  ['16', 'interactive modules'],
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
    className={`group inline-flex items-center justify-center gap-2 rounded-full bg-[#F97316] px-7 py-4 text-[16px] font-bold text-white shadow-[0_14px_38px_-12px_rgba(249,115,22,0.7)] transition-all hover:bg-[#EA580C] active:scale-[0.98] ${className}`}
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
        ? 'border-[#F97316] bg-[#F97316]/10 text-[#EA580C] dark:text-[#FDBA74]'
        : 'border-slate-300 bg-white text-slate-400 dark:border-white/15 dark:bg-white/[0.04]'
    }`;
  const wireCls = (on: boolean) =>
    on ? 'stroke-[#F97316] transition-colors duration-300' : 'stroke-slate-300 transition-colors duration-300 dark:stroke-white/20';

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">XOR gate</span>
        <span className="rounded-full bg-[#F97316]/10 px-2 py-0.5 text-[10px] font-bold text-[#C2410C] dark:bg-[#FB923C]/15 dark:text-[#FDBA74]">Live</span>
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
                ? 'border-[#F97316] bg-[#F97316] shadow-[0_0_24px_rgba(249,115,22,0.55)]'
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
                active ? 'bg-[#F97316]/10 font-bold text-[#C2410C] dark:bg-[#FB923C]/15 dark:text-[#FDBA74]' : 'text-slate-600 dark:text-slate-300'
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

  const navLinks = [
    ['Courses', '#courses'],
    ['How it works', '#how'],
    ['Why BitForBytes', '#why'],
  ] as const;

  return (
    <main className="min-h-screen w-full bg-white text-slate-900 antialiased dark:bg-[#0A0B12] dark:text-slate-100 selection:bg-[#F97316]/25">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0A0B12]/80">
        <Shell className="flex h-16 items-center justify-between">
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
            <Link to={primaryTo} className="hidden rounded-full bg-[#F97316] px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(249,115,22,0.6)] transition-all hover:bg-[#EA580C] md:inline-flex">{primaryLabel}</Link>
            <button onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" className="rounded-lg border border-slate-200 p-1.5 text-slate-600 dark:border-white/10 dark:text-slate-300 md:hidden">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </Shell>
        {menuOpen && (
          <div className="border-t border-slate-200/70 dark:border-white/10 md:hidden">
            <Shell className="flex flex-col gap-1 py-3 text-[15px] font-semibold text-slate-700 dark:text-slate-200">
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5">{label}</a>
              ))}
              {authed ? (
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5">Profile</Link>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5">Sign in</Link>
              )}
              <Link to={primaryTo} onClick={() => setMenuOpen(false)} className="mt-1 rounded-full bg-[#F97316] px-4 py-3 text-center text-white">{primaryLabel}</Link>
            </Shell>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[40rem] w-[40rem] rounded-full bg-[#F97316]/[0.08] blur-[120px] dark:bg-[#F97316]/20" />
        <Shell className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F97316]/20 bg-[#F97316]/[0.08] px-3 py-1.5 text-[12px] font-semibold text-[#C2410C] dark:border-[#FDBA74]/25 dark:bg-[#FB923C]/10 dark:text-[#FDBA74]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" /> Free to use, no account needed
            </div>
            <h1 className="text-[clamp(2.5rem,5.6vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight">
              Learn chip design<br />
              <span className="text-[#EA580C] dark:text-[#FDBA74]">by doing.</span>
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
              <span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={15} className="fill-[#F59E0B] text-[#F59E0B]" />)}</span>
              Free for every ECE student in India.
            </div>
          </div>

          <div className="lg:pl-4">
            <SignalShowcase />
          </div>
        </Shell>
      </section>

      {/* ── FACT BAR ── */}
      <section className="border-y border-slate-200/70 bg-slate-50 dark:border-white/10 dark:bg-white/[0.02]">
        <Shell className="grid grid-cols-2 gap-y-3 py-6 text-center sm:flex sm:items-baseline sm:justify-center sm:gap-0 sm:divide-x sm:divide-slate-200 dark:sm:divide-white/10">
          {FACTS.map(([n, label]) => (
            <div key={label} className="px-6">
              <span className="text-xl font-extrabold text-[#EA580C] dark:text-[#FDBA74]">{n}</span>
              <span className="ml-2 text-[13px] font-medium text-slate-500 dark:text-slate-400">{label}</span>
            </div>
          ))}
        </Shell>
      </section>

      {/* ── LEARNING PATHS ── */}
      <section id="courses" className="py-20">
        <Shell>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#EA580C] dark:text-[#FDBA74]">Courses</span>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">From one bit to a whole chip.</h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {MODULE_CARDS.map(({ icon: Icon, title, tag, color, num, route, startHere }) => (
              <Link
                key={route}
                to={route}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-[#13141C] dark:hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)]"
                style={{ borderColor: undefined }}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}1A`, color }}>
                    <Icon size={18} />
                  </span>
                  {startHere ? (
                    <span className="rounded-full bg-[#F97316] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Start here</span>
                  ) : (
                    <span className="font-mono text-[11px] font-semibold text-slate-400">{String(num).padStart(2, '0')}</span>
                  )}
                </div>
                <h3 className="mt-4 text-[15px] font-bold leading-snug">{title}</h3>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color }}>{tag}</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color }} />
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
            First five modules free, no account needed.
            <Link to={LANDING_ROUTES.career} className="ml-2 font-semibold text-[#EA580C] hover:underline dark:text-[#FDBA74]">See where these skills lead</Link>
          </p>
        </Shell>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="border-y border-slate-200/70 bg-slate-50 py-20 dark:border-white/10 dark:bg-white/[0.02]">
        <Shell>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#EA580C] dark:text-[#FDBA74]">How it works</span>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">Every lesson is something you do.</h2>
          </div>

          <div className="relative mt-12 grid gap-10 md:grid-cols-3">
            <div aria-hidden className="absolute left-6 right-6 top-6 hidden border-t-2 border-dotted border-slate-300 md:block dark:border-white/15" />
            {([
              ['01', 'Pick a path', 'Sixteen modules, first five free.',
                <div key="v1" className="flex gap-2">
                  {[Binary, Zap, Grid3x3].map((I, i) => (
                    <span key={i} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#EA580C] dark:bg-[#FB923C]/15 dark:text-[#FDBA74]">
                      <I size={18} />
                    </span>
                  ))}
                </div>],
              ['02', 'Mess with it', 'The circuit answers instantly.',
                <div key="v2" className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#F97316] bg-[#F97316]/10 font-mono text-sm font-bold text-[#EA580C] dark:text-[#FDBA74]">1</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-300 bg-white font-mono text-sm font-bold text-slate-400 dark:border-white/15 dark:bg-white/[0.04]">0</span>
                  <ArrowRight size={16} className="text-slate-400" />
                  <span className="h-10 w-10 rounded-full border-2 border-[#F97316] bg-[#F97316] shadow-[0_0_18px_rgba(249,115,22,0.5)]" />
                </div>],
              ['03', 'Go from gates to Verilog', 'Real hardware code, in the browser.',
                <code key="v3" className="inline-block rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-[13px] text-slate-700 dark:border-white/10 dark:bg-[#13141C] dark:text-slate-200">
                  assign y = a ^ b;
                </code>],
            ] as Array<[string, string, string, React.ReactNode]>).map(([num, title, line, visual]) => (
              <div key={num}>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-sm font-bold text-[#EA580C] shadow-sm dark:border-white/10 dark:bg-[#13141C] dark:text-[#FDBA74]">
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
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#EA580C] dark:text-[#FDBA74]">Why it works</span>
            <h2 className="mt-3 text-[clamp(1.8rem,3.6vw,2.75rem)] font-extrabold leading-[1.12] tracking-tight">Understand it. Don't just memorize it.</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Reading about a gate is not the same as flipping its inputs. Try the one on the right.
            </p>
            <ul className="mt-6 space-y-3">
              {['Live simulators in every lesson, not slides', 'Instant feedback on every answer', 'A clear route from basic electronics to Verilog'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#F97316]/10 text-[#EA580C] dark:bg-[#FB923C]/15 dark:text-[#FDBA74]"><Check size={14} /></span>
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
      <section className="border-t border-slate-200/70 bg-slate-50 py-20 dark:border-white/10 dark:bg-white/[0.02]">
        <Shell>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#EA580C] dark:text-[#FDBA74]">From the students</span>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">It just clicks.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-[#13141C]">
                <blockquote className="leading-relaxed text-slate-700 dark:text-slate-300">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F97316]/10 text-sm font-bold text-[#EA580C] dark:bg-[#FB923C]/15 dark:text-[#FDBA74]">{t.name[0]}</span>
                  <span className="text-sm font-semibold">{t.name}<span className="font-normal text-slate-400">, {t.role}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
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
                      <Link to={href} className="transition-colors hover:text-[#EA580C] dark:hover:text-[#FDBA74]">{label}</Link>
                    ) : (
                      <a href={href} className="transition-colors hover:text-[#EA580C] dark:hover:text-[#FDBA74]">{label}</a>
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
    </main>
  );
};

export default BrilliantHome;
