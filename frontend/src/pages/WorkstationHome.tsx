import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { RadialMenu } from '../components/ui/RadialMenu';
import { useColorScheme } from '../hooks/useColorScheme';
import { ThemeToggle } from '../components/ThemeToggle';
import { BrandMark } from '../components/Brand';
import { getSession } from '../lib/auth';
import { getModuleHistory, getLastModule, MODULE_LABELS } from '../lib/moduleHistory';
import {
  Play, ArrowRight, ArrowUpRight, ChevronDown, Check, Command, Settings,
  Wrench, Grid3x3, Cpu, Compass, Library, Map, BookOpen,
  Binary, Zap, Boxes, ClipboardList, FileText, type LucideIcon,
} from 'lucide-react';

/* ── Background: single-tone grid + slow "electric current" sweeps (GPU transform) ── */
const PCBBackground: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const line = isLight ? '122,63,208' : '167,139,250';
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            `linear-gradient(rgba(${line},${isLight ? 0.06 : 0.05}) 1px, transparent 1px),` +
            `linear-gradient(90deg, rgba(${line},${isLight ? 0.06 : 0.05}) 1px, transparent 1px)`,
          backgroundSize: '34px 34px',
        }}
      />
      <div className="absolute left-0 right-0 top-0 h-[2px] will-change-transform"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${line},${isLight ? 0.4 : 0.5}), transparent)`, animation: 'grid-current-y 8s linear infinite' }} />
      <div className="absolute top-0 bottom-0 left-0 w-[2px] will-change-transform"
        style={{ background: `linear-gradient(180deg, transparent, rgba(${line},${isLight ? 0.3 : 0.4}), transparent)`, animation: 'grid-current-x 11s linear infinite 1.2s' }} />
    </div>
  );
};

/* ── Square-wave rule — the page's signature divider ── */
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

/* ── Live digital clock (top-left). The accent is NOT hover-driven: it builds
   with the clock itself — the hue drifts slowly across the day and the colour
   saturates as each minute fills, so the tint quietly deepens over time. ── */
const DigitalClock: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const dpc = now.toDateString().split(' ');                 // ["Tue","Jul","15","2026"]
  const dateStr = `${dpc[0]} · ${dpc[2]} ${dpc[1]}`.toUpperCase();
  const dayFrac = (h * 3600 + m * 60 + s) / 86400;           // 0→1 across the day
  const minuteFrac = (m * 60 + s) / 3600;                    // 0→1 across the hour
  const hue = 258 + dayFrac * 66;                            // violet → magenta
  const accent = `hsl(${Math.round(hue)}, ${Math.round(48 + minuteFrac * 44)}%, ${isLight ? 46 : 66}%)`;
  const ink = isLight ? '#1B1436' : '#E2E8F0';
  const faint = isLight ? '#6B5E86' : '#64748B';
  const track = isLight ? '#C9BEEA' : 'rgba(255,255,255,0.08)';
  return (
    <div className="flex flex-col leading-none" aria-label={`Local time ${pad(h)}:${pad(m)}`}>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: faint }}>{dateStr}</span>
      <span className="mt-1 font-mono text-[15px] font-extrabold tabular-nums tracking-tight" style={{ color: ink }}>
        {pad(h)}<span style={{ color: accent }}>:</span>{pad(m)}<span style={{ color: accent }}>:{pad(s)}</span>
      </span>
      {/* colour "adds over the time": the bar fills through each minute */}
      <span className="mt-1 h-[2px] w-full overflow-hidden rounded-full" style={{ background: track }}>
        <span className="block h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${minuteFrac * 100}%`, background: accent }} />
      </span>
    </div>
  );
};

/* ── Learning paths (canonical: lib/moduleHistory MODULE_LABELS) ── */
/** A chapter inside a path, matched on the module's lesson number (dsd/28 -> 28). */
interface PathGroup { id: string; label: string; blurb: string; from: number; to: number }
interface PathDef { key: string; title: string; tagline: string; prefix: string; color: string; icon: LucideIcon; groups?: PathGroup[]; }
const PATHS: PathDef[] = [
  { key: 'foundation', title: 'Foundation', tagline: 'Digital logic & Verilog — signals, gates, K-maps.', prefix: 'module/', color: '#2563EB', icon: Binary },
  { key: 'be', title: 'Basic Electronics', tagline: 'From the physics of control to transistors.', prefix: 'basic-electronics/', color: '#EA580C', icon: Zap },
  {
    key: 'dsd', title: 'Digital System Design', tagline: 'Boolean logic through adders, subtractors and beyond.',
    prefix: 'dsd/', color: '#9333EA', icon: Boxes,
    // 42 modules in one flat list is unreadable, so DSD expands into three
    // collapsible chapters instead and you open only the one you want.
    groups: [
      { id: 'basic',         label: 'Basic',         blurb: 'Binary, Boolean algebra, K-maps, gate-level realisation', from: 1,  to: 6  },
      { id: 'combinational', label: 'Combinational', blurb: 'Adders, subtractors, MUX/DEMUX, decoders, encoders',       from: 7,  to: 27 },
      { id: 'sequential',    label: 'Sequential',    blurb: 'Latches, flip-flops, registers, counters, state machines', from: 28, to: 42 },
    ],
  },
];

/** Lesson number from a module id, e.g. 'dsd/28' -> 28. */
const lessonNo = (id: string): number => parseInt(id.split('/')[1], 10) || 0;

interface ModItem { id: string; label: string; path: string; }
const modulesFor = (prefix: string): ModItem[] =>
  Object.keys(MODULE_LABELS)
    .filter((k) => k.startsWith(prefix))
    .sort((a, b) => (parseInt(a.split('/')[1], 10) || 0) - (parseInt(b.split('/')[1], 10) || 0))
    .map((k) => ({ id: k, label: MODULE_LABELS[k], path: `/${k}` }));

const TOTAL_MODULES = Object.keys(MODULE_LABELS).length;

/* ── One path lane: giant numeral + signal tick-strip + expandable module chips ── */
const PathLane: React.FC<{
  path: PathDef; index: number; opened: Set<string>; lastId: string | null;
  dim: string; faint: string; hairline: string; baseStroke: string;
  onGo: (to: string) => void;
}> = ({ path, index, opened, lastId, dim, faint, hairline, baseStroke, onGo }) => {
  const [expand, setExpand] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const modules = modulesFor(path.prefix);
  const openedCount = modules.filter((m) => opened.has(m.id)).length;
  const pct = modules.length ? Math.round((openedCount / modules.length) * 100) : 0;
  const started = openedCount > 0;
  const resume = lastId ? modules.find((m) => m.id === lastId) : undefined;
  // A started lane earns its numeral in the path's own colour — a quiet reward.
  const numeralStroke = started ? `${path.color}59` : baseStroke;

  return (
    <div
      className="px-5 py-6 transition-colors hover:bg-[var(--lane)] sm:px-7"
      style={{ '--lane': `${path.color}0D` } as React.CSSProperties}
    >
      <div className="flex items-start gap-5">
        <span
          aria-hidden
          className="hidden w-[104px] flex-shrink-0 select-none text-right text-[84px] font-extrabold leading-[0.8] tracking-tight lg:block"
          style={{ WebkitTextStroke: `2px ${numeralStroke}`, color: 'transparent' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-md" style={{ background: `${path.color}1F`, color: path.color }}>
              <path.icon size={18} />
            </span>
            <h3 className="text-[17px] font-bold leading-tight">{path.title}</h3>
            <span className="ml-auto font-mono text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: faint }}>
              {openedCount} / {modules.length}
            </span>
          </div>
          <p className="mt-1.5 text-[13.5px] leading-snug" style={{ color: dim }}>{path.tagline}</p>

          {/* Signal tick-strip — one tick per module */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-[9px] flex-1 gap-[3px]">
              {modules.map((m) => (
                <span
                  key={m.id}
                  title={m.label}
                  className={`flex-1 rounded-[2px] ${m.id === lastId ? 'animate-pulse' : ''}`}
                  style={{ background: opened.has(m.id) ? path.color : `${path.color}2E` }}
                />
              ))}
            </div>
            <span className="w-10 text-right font-mono text-[11px] font-bold tabular-nums" style={{ color: path.color }}>{pct}%</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onGo(resume ? resume.path : (modules[0]?.path ?? '/portal'))}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: path.color }}
            >
              <Play size={13} /> {started ? 'Continue' : 'Start'} <ArrowRight size={13} />
            </button>
            <button
              onClick={() => setExpand((e) => !e)}
              aria-expanded={expand}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-opacity hover:opacity-70"
              style={{ color: dim }}
            >
              {expand ? 'Hide modules' : 'All modules'}
              <ChevronDown size={15} className={`transition-transform ${expand ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {expand && (
            path.groups ? (
              /* Chaptered path (DSD): one collapsible card per chapter. */
              <div className="mt-3 flex flex-col gap-2">
                {path.groups.map((g) => {
                  const inGroup = modules.filter((m) => lessonNo(m.id) >= g.from && lessonNo(m.id) <= g.to);
                  const gOpened = inGroup.filter((m) => opened.has(m.id)).length;
                  const isOpen = openGroup === g.id;
                  return (
                    <div key={g.id} className="rounded-md border overflow-hidden" style={{ borderColor: hairline }}>
                      <button
                        onClick={() => setOpenGroup(isOpen ? null : g.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--lane)]"
                      >
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13.5px] font-bold">{g.label}</span>
                          <span className="block truncate text-[11.5px]" style={{ color: dim }}>{g.blurb}</span>
                        </span>
                        <span className="flex-shrink-0 font-mono text-[10.5px] font-semibold tabular-nums" style={{ color: faint }}>
                          {gOpened}/{inGroup.length}
                        </span>
                        <ChevronDown size={15} className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: dim }} />
                      </button>
                      {isOpen && (
                        <div className="grid grid-cols-1 gap-1.5 px-2 pb-2 sm:grid-cols-2">
                          {inGroup.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => onGo(m.path)}
                              className="group flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-transform hover:-translate-y-0.5"
                              style={{ borderColor: hairline }}
                            >
                              <span className="w-6 flex-shrink-0 font-mono text-[11px] font-bold tabular-nums" style={{ color: path.color }}>
                                {String(lessonNo(m.id)).padStart(2, '0')}
                              </span>
                              <span className="flex-1 truncate text-[13px] font-medium">{m.label}</span>
                              {opened.has(m.id) && <Check size={14} className="flex-shrink-0 text-emerald-500" />}
                              <ArrowRight size={13} className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: dim }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {modules.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => onGo(m.path)}
                    className="group flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-transform hover:-translate-y-0.5"
                    style={{ borderColor: hairline }}
                  >
                    <span className="w-6 flex-shrink-0 font-mono text-[11px] font-bold tabular-nums" style={{ color: path.color }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 truncate text-[13px] font-medium">{m.label}</span>
                    {opened.has(m.id) && <Check size={14} className="flex-shrink-0 text-emerald-500" />}
                    <ArrowRight size={13} className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: dim }} />
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

/* ── MAIN — the workstation desk ────────────────────────────────────────────────── */
export const WorkstationHome: React.FC = () => {
  const navigate = useNavigate();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  const { firstName, checkStreak } = useGamificationStore();
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => { checkStreak(); }, [checkStreak]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const name = firstName ?? getSession().displayName ?? 'Learner';
  const history = getModuleHistory();
  const last = getLastModule();
  const opened = new Set(history.map((h) => h.id));

  // Resume ticket data — the last-opened module, its path, and what follows it.
  const lastPrefix = last ? `${last.id.split('/')[0]}/` : null;
  const lastPath = lastPrefix ? PATHS.find((p) => p.prefix === lastPrefix) : undefined;
  const lastPathModules = lastPrefix ? modulesFor(lastPrefix) : [];
  const lastIdx = last ? lastPathModules.findIndex((m) => m.id === last.id) : -1;
  const upNext = lastIdx >= 0 ? lastPathModules[lastIdx + 1] : undefined;
  const inPathOpened = lastPathModules.filter((m) => opened.has(m.id)).length;
  const inPathPct = lastPathModules.length ? Math.round((inPathOpened / lastPathModules.length) * 100) : 0;

  const ticket = last && lastPath
    ? { color: lastPath.color, pathTitle: lastPath.title, module: last.label, to: last.path, pct: inPathPct, tag: 'Resume' }
    : { color: '#7A3FD0', pathTitle: PATHS[0].title, module: MODULE_LABELS['module/1'], to: '/module/1', pct: 0, tag: 'Start here' };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  /* pinned-board surfaces */
  const panel: React.CSSProperties = {
    background: isLight ? '#ECE8FB' : '#0A0F18',
    border: isLight ? '2px solid #1B1436' : '1px solid rgba(148,163,184,0.14)',
    boxShadow: isLight ? '5px 5px 0 0 #1B1436' : '0 18px 44px rgba(0,0,0,0.55)',
    borderRadius: 8,
  };
  const chip: React.CSSProperties = { ...panel, boxShadow: isLight ? '3px 3px 0 0 #1B1436' : 'none' };
  const dim = isLight ? '#4A3F63' : '#94A3B8';
  const faint = isLight ? '#6B5E86' : '#64748B';
  const hairline = isLight ? '#C9BEEA' : 'rgba(255,255,255,0.08)';
  const baseStroke = isLight ? 'rgba(27,20,54,0.26)' : 'rgba(255,255,255,0.14)';

  const BENCH = [
    { label: 'Workbench', icon: Wrench, to: '/workbench' },
    { label: 'K-Map Lab', icon: Grid3x3, to: '/kmap-lab' },
    { label: 'Verilog Judge', icon: Cpu, to: '/verilog-playground' },
    { label: 'Interview Prep', icon: ClipboardList, to: '/interview-prep' },
  ];
  const LIBRARY = [
    { label: 'Question Papers', icon: FileText, to: '/library' },
    { label: 'Analogy Library', icon: BookOpen, to: '/analogies' },
    { label: 'Verilog Library', icon: Library, to: '/verilog-library' },
    { label: 'Silicon Map', icon: Map, to: '/silicon-map' },
    { label: 'Career Roadmap', icon: Compass, to: '/career-roadmap' },
  ];

  return (
    <div
      className="relative min-h-[100svh] w-full overflow-x-hidden font-sans transition-colors duration-300"
      style={{ backgroundColor: isLight ? '#ECE8FB' : '#04060A', color: isLight ? 'var(--text-main)' : '#E2E8F0' }}
    >
      <PCBBackground isLight={isLight} />

      {/* Live clock pinned to the far top-left corner on wide screens (sits in
          the page margin beside the centered content — as left as it can go). */}
      <div className="absolute left-5 top-5 z-20 hidden xl:block">
        <DigitalClock isLight={isLight} />
      </div>

      {/* Profile chip pinned to the far top-right corner on wide screens —
          mirrors the clock pinned far-left. Below xl it stays in the header. */}
      <div className="absolute right-5 top-5 z-20 hidden xl:block">
        <button
          onClick={() => navigate('/profile')}
          title="Open your profile"
          className="inline-flex items-center gap-2 px-2 py-1.5 transition-transform hover:-translate-y-0.5"
          style={chip}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-black text-white" style={{ background: '#4F46E5' }}>
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="pr-1 text-[13px] font-bold">{name}</span>
        </button>
      </div>

      {/* Cyclic hologram — fixed bottom-left. */}
      <div className="hidden xl:block">
        <RadialMenu />
      </div>

      <div className="relative z-10">
        {/* ── Top bar — quiet: brand, ⌘K, settings, theme, you ── */}
        <header className="mx-auto flex w-full max-w-[1080px] items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* clock inline on md/lg; pinned to the far-left margin on xl+ (below) */}
            <div className="hidden sm:block xl:hidden"><DigitalClock isLight={isLight} /></div>
            <span className="hidden h-9 w-px sm:block xl:hidden" style={{ background: hairline }} />
            <BrandMark size={28} />
            <span className="text-[16px] font-extrabold tracking-tight">
              Bit<span style={{ color: '#7A3FD0' }}>For</span>Bytes
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Tools">
            {BENCH.map((b) => (
              <button
                key={b.to}
                onClick={() => navigate(b.to)}
                className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
                style={{ color: dim }}
              >
                {b.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              title="Command palette (Ctrl+K)"
              className="hidden items-center gap-1.5 px-2.5 py-1.5 font-mono text-[11px] font-bold sm:inline-flex"
              style={chip}
            >
              <Command size={12} /> K
            </button>
            <button
              onClick={() => navigate('/settings')}
              aria-label="Settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-opacity hover:opacity-70"
              style={{ color: dim }}
            >
              <Settings size={17} />
            </button>
            <ThemeToggle variant="minimal" />
            <button
              onClick={() => navigate('/profile')}
              title="Open your profile"
              className="inline-flex items-center gap-2 px-2 py-1.5 transition-transform hover:-translate-y-0.5 xl:hidden"
              style={chip}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-black text-white" style={{ background: '#4F46E5' }}>
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden pr-1 text-[13px] font-bold lg:inline">{name}</span>
            </button>
          </div>
        </header>

        {/* Mobile tool strip (the header nav is desktop-only) */}
        <nav className="flex gap-5 overflow-x-auto px-4 pb-3 md:hidden" aria-label="Tools">
          {BENCH.map((b) => (
            <button
              key={b.to}
              onClick={() => navigate(b.to)}
              className="whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ color: dim }}
            >
              {b.label}
            </button>
          ))}
        </nav>

        {/* Signature rule under the header */}
        <SquareWave stroke={hairline} />

        <main className="mx-auto w-full max-w-[1080px] px-4 pb-32 sm:px-6">
          {/* ── Hero: headline + resume ticket ── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-[1fr_320px] lg:gap-12"
          >
            <div>
              <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-tight sm:text-[46px]">
                {greeting}, {name}<span style={{ color: '#7A3FD0' }}>.</span>
              </h1>
              <button
                onClick={() => document.getElementById('paths')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold underline-offset-4 transition-opacity hover:opacity-70 hover:underline"
                style={{ color: dim }}
              >
                Browse the three paths <ChevronDown size={14} />
              </button>
            </div>

            {/* Resume ticket */}
            <div className="relative overflow-hidden" style={panel}>
              <span className="absolute inset-y-0 left-0 w-[5px]" style={{ background: ticket.color }} />
              <div className="p-5 pl-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: faint }}>
                  {ticket.tag} · {ticket.pathTitle}
                </p>
                <h2 className="mt-1.5 text-[17px] font-bold leading-snug">{ticket.module}</h2>

                <div className="mt-3 flex items-center gap-2.5">
                  <div className="h-[6px] flex-1 overflow-hidden rounded-full" style={{ background: `${ticket.color}26` }}>
                    <div className="h-full rounded-full" style={{ width: `${ticket.pct}%`, background: ticket.color }} />
                  </div>
                  <span className="font-mono text-[10.5px] font-bold tabular-nums" style={{ color: ticket.color }}>{ticket.pct}%</span>
                </div>

                <div className="mt-4 border-t border-dashed pt-4" style={{ borderColor: hairline }}>
                  <button
                    onClick={() => navigate(ticket.to)}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-bold text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: ticket.color }}
                  >
                    <Play size={14} /> Open lesson
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <div className="mt-3 flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: faint }}>
                    <span className="truncate">{upNext ? `Next · ${upNext.label}` : 'Fresh start'}</span>
                    <span className="flex-shrink-0 pl-3 tabular-nums">{history.length}/{TOTAL_MODULES} opened</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── Library: notes + previous-year papers. Sits above the tracks
                 board because it's the thing students come back for between
                 lessons, and it's too big to leave as a footer link. ── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <button
              onClick={() => navigate('/library')}
              className="group flex w-full flex-col gap-4 p-5 text-left transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
              style={panel}
            >
              <span
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ background: '#7A3FD0' }}
              >
                <FileText size={22} className="text-white" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-[17px] font-bold sm:text-[19px]">Question Papers &amp; GATE</span>
                  <span
                    className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                    style={{ background: '#7A3FD0' }}
                  >
                    New
                  </span>
                </span>
                <span className="mt-1 block text-[13.5px] leading-snug" style={{ color: dim }}>
                  Previous-year question papers sorted by branch, year and subject —
                  sessionals, pre-university tests and GATE ECE PYQs. Free to read or download.
                </span>
                <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: faint }}>
                  <span>7,000+ files</span>
                  <span>All branches</span>
                  <span>No sign-in</span>
                </span>
              </span>

              <span
                className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-bold text-white"
                style={{ background: '#7A3FD0' }}
              >
                Browse
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </motion.section>

          {/* ── Paths: one board, three lanes ── */}
          <motion.section
            id="paths"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 scroll-mt-6 overflow-hidden"
            style={panel}
          >
            <div className="flex items-baseline justify-between px-5 pb-4 pt-6 sm:px-7">
              <h2 className="text-[19px] font-bold tracking-tight">Your paths</h2>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: faint }}>
                3 tracks · {TOTAL_MODULES} modules
              </span>
            </div>
            {PATHS.map((p, i) => (
              <React.Fragment key={p.key}>
                <SquareWave stroke={hairline} />
                <PathLane
                  path={p}
                  index={i}
                  opened={opened}
                  lastId={last?.id ?? null}
                  dim={dim}
                  faint={faint}
                  hairline={hairline}
                  baseStroke={baseStroke}
                  onGo={navigate}
                />
              </React.Fragment>
            ))}
          </motion.section>

          {/* ── Bench & library — one quiet strip, no duplication ── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 p-5 sm:p-6"
            style={panel}
          >
            <div className="grid gap-6 md:grid-cols-[auto_1px_1fr] md:gap-8">
              <div>
                <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: faint }}>Bench</p>
                <div className="flex flex-wrap gap-2">
                  {BENCH.map((b) => (
                    <button
                      key={b.to}
                      onClick={() => navigate(b.to)}
                      className="inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[13.5px] font-semibold transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: hairline }}
                    >
                      <b.icon size={15} style={{ color: '#7A3FD0' }} /> {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden md:block" style={{ background: hairline }} />
              <div>
                <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: faint }}>Library</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 pt-1.5">
                  {LIBRARY.map((l) => (
                    <button
                      key={l.to}
                      onClick={() => navigate(l.to)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-opacity hover:opacity-60"
                      style={{ color: dim }}
                    >
                      <l.icon size={14} /> {l.label} <ArrowUpRight size={12} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── Footer ── */}
          <footer className="mt-14 flex items-center justify-between border-t pt-5 font-mono text-[11px]" style={{ borderColor: hairline, color: faint }}>
            <span>© 2026 BitForBytes</span>
            <span>made for students</span>
          </footer>
        </main>
      </div>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} />
    </div>
  );
};
