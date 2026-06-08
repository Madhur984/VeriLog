import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sun, Moon, Menu, X,
  Binary, Cpu, Sigma, Grid3x3, Waves, GitBranch, Gauge, Zap,
  Check, Star,
} from 'lucide-react';
import { BrandWordmark } from '../../components/Brand';
import { SignalShowcase } from './SignalShowcase';
import { LANDING_ROUTES } from './landingRoutes';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

/* ── data ─────────────────────────────────────────────────────────────── */

const COURSES = [
  { icon: Binary, title: 'Number Systems & Binary', desc: "Bits, hex, and two's complement.", color: '#F97316', lessons: 12 },
  { icon: Cpu, title: 'Logic Gates', desc: 'AND, OR, NAND and XOR by hand.', color: '#EA580C', lessons: 16 },
  { icon: Sigma, title: 'Boolean Algebra', desc: 'Cut equations down with De Morgan.', color: '#DB2777', lessons: 10 },
  { icon: Grid3x3, title: 'Karnaugh Maps', desc: 'Shrink logic on a grid.', color: '#9333EA', lessons: 9 },
  { icon: GitBranch, title: 'Verilog HDL', desc: 'Describe real hardware in code.', color: '#2563EB', lessons: 18 },
  { icon: Zap, title: 'Finite State Machines', desc: 'Build machines that react to input.', color: '#D97706', lessons: 11 },
  { icon: Waves, title: 'Timing & Waveforms', desc: 'Read a signal the way a scope does.', color: '#E11D48', lessons: 8 },
  { icon: Gauge, title: 'CPU Architecture', desc: 'Put a processor together, one stage at a time.', color: '#B45309', lessons: 14 },
];

const STATS = [
  { n: '13', l: 'ECE domains' },
  { n: '90+', l: 'Interactive labs' },
  { n: '100%', l: 'Free forever' },
  { n: '0', l: 'Installs' },
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

/* ── page ─────────────────────────────────────────────────────────────── */

export const BrilliantHome: React.FC = () => {
  const authed = useIsAuthenticated();
  const primaryTo = authed ? LANDING_ROUTES.workstation : LANDING_ROUTES.firstModule;
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
            <Link to="/login" className="hidden text-[14px] font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:inline">Sign in</Link>
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
              <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5">Sign in</Link>
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

      {/* ── STATS ── */}
      <section className="border-y border-slate-200/70 bg-slate-50 dark:border-white/10 dark:bg-white/[0.02]">
        <Shell className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-extrabold text-[#EA580C] dark:text-[#FDBA74]">{s.n}</div>
              <div className="mt-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">{s.l}</div>
            </div>
          ))}
        </Shell>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20">
        <Shell>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#EA580C] dark:text-[#FDBA74]">How it works</span>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">Fifteen minutes a day is enough.</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Skip the lectures. You build something, poke at it until it breaks, and the idea sticks.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ['Try it yourself', 'Flip the inputs, drag the gates around, and watch what the output does.', Cpu],
              ['See the why', 'Truth tables and live waveforms show you what is actually going on underneath.', Waves],
              ['Build for real', 'Go from one gate to writing Verilog, and then to a CPU you wire up yourself.', Gauge],
            ].map(([title, desc, Icon], i) => (
              <div key={title as string} className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#EA580C] dark:bg-[#FB923C]/15 dark:text-[#FDBA74]">
                  {React.createElement(Icon as React.FC<{ size?: number }>, { size: 22 })}
                </div>
                <div className="mb-1 text-[13px] font-mono text-slate-400">0{i + 1}</div>
                <h3 className="text-lg font-bold">{title as string}</h3>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">{desc as string}</p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      {/* ── COURSE GRID ── */}
      <section id="courses" className="border-t border-slate-200/70 bg-slate-50 py-20 dark:border-white/10 dark:bg-white/[0.02]">
        <Shell>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#EA580C] dark:text-[#FDBA74]">Courses</span>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight">From one bit to a whole chip.</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Eight tracks. Each one starts from nothing and builds up.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COURSES.map(({ icon: Icon, title, desc, color, lessons }) => (
              <Link
                to={primaryTo}
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-[#13141C] dark:hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${color}1A`, color }}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold leading-snug">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
                <div className="mt-4 flex items-center justify-between text-[12px] font-medium text-slate-400">
                  <span>{lessons} lessons</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" style={{ color }} />
                </div>
              </Link>
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
              Most courses keep you stuck in the math. Here, every idea is wired to a circuit you can actually touch, so it sticks.
            </p>
            <ul className="mt-6 space-y-3">
              {['Simulators you can play with, not slides', 'You find out right away if you got it right', 'Logic gates now, a working CPU later'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#F97316]/10 text-[#EA580C] dark:bg-[#FB923C]/15 dark:text-[#FDBA74]"><Check size={14} /></span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8"><PrimaryBtn to={primaryTo}>Start the first lesson</PrimaryBtn></div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 dark:border-white/10 dark:from-white/[0.04] dark:to-transparent">
            <SignalShowcase />
          </div>
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
                <div className="mb-3 flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={15} className="fill-[#F59E0B] text-[#F59E0B]" />)}</div>
                <blockquote className="leading-relaxed text-slate-700 dark:text-slate-300">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">
                  {t.name} <span className="font-normal text-slate-400">, {t.role}</span>
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
