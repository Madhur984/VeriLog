import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Binary, Zap, Boxes, Lock, Clock, Sparkles, Hash, Grid, Terminal, Layers,
  ShieldCheck, CheckCircle2, Trophy, HelpCircle, X, ExternalLink, Award
} from 'lucide-react';

/* ── Background: single-tone grid + slow "electric current" sweeps ── */
const PCBBackground: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const line = isLight ? '122,63,208' : '167,139,250';
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            `linear-gradient(rgba(${line},${isLight ? 0.06 : 0.04}) 1px, transparent 1px),` +
            `linear-gradient(90deg, rgba(${line},${isLight ? 0.06 : 0.04}) 1px, transparent 1px)`,
          backgroundSize: '34px 34px',
        }}
      />
      <div
        className="absolute left-0 right-0 top-0 h-[2px] will-change-transform"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${line},${isLight ? 0.4 : 0.5}), transparent)`, animation: 'grid-current-y 8s linear infinite' }}
      />
      <div
        className="absolute top-0 bottom-0 left-0 w-[2px] will-change-transform"
        style={{ background: `linear-gradient(180deg, transparent, rgba(${line},${isLight ? 0.3 : 0.4}), transparent)`, animation: 'grid-current-x 11s linear infinite 1.2s' }}
      />
    </div>
  );
};

/* ── Square-wave rule — signature IC chip divider ── */
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

/* ── Live digital workstation clock ── */
const DigitalClock: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const dpc = now.toDateString().split(' ');
  const dateStr = `${dpc[0]} · ${dpc[2]} ${dpc[1]}`.toUpperCase();
  const minuteFrac = (m * 60 + s) / 3600;

  const accent = isLight ? '#7A3FD0' : '#A78BFA';
  const ink = isLight ? '#1B1436' : '#E2E8F0';
  const faint = isLight ? '#6B5E86' : '#64748B';
  const track = isLight ? '#C9BEEA' : 'rgba(255,255,255,0.08)';

  return (
    <div className="flex flex-col leading-none" aria-label={`Local time ${pad(h)}:${pad(m)}`}>
      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: faint }}>
        {dateStr}
      </span>
      <span className="mt-1 font-mono text-[15px] font-extrabold tabular-nums tracking-tight" style={{ color: ink }}>
        {pad(h)}<span style={{ color: accent }}>:</span>{pad(m)}<span style={{ color: accent }}>:{pad(s)}</span>
      </span>
      <span className="mt-1 h-[2px] w-full overflow-hidden rounded-full" style={{ background: track }}>
        <span
          className="block h-full rounded-full transition-[width] duration-1000 ease-linear"
          style={{ width: `${minuteFrac * 100}%`, background: accent }}
        />
      </span>
    </div>
  );
};

/* ── 5 Rich Vibrant Hardware Vector Schematic SVGs ── */
const SignalWaveSVG: React.FC<{ isOpened: boolean; isLight: boolean }> = ({ isOpened, isLight }) => {
  const accent = isOpened ? (isLight ? '#7A3FD0' : '#C084FC') : (isLight ? '#64748B' : '#94A3B8');
  const bgGrad = isLight ? 'url(#waveGradLight)' : 'url(#waveGradDark)';
  const pulse = isOpened ? '#10B981' : '#F59E0B';
  return (
    <svg viewBox="0 0 90 56" className="w-20 h-13 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" fill="none">
      <defs>
        <linearGradient id="waveGradDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="waveGradLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A3FD0" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="82" height="48" rx="8" fill={bgGrad} stroke={accent} strokeWidth="1.8" />
      <line x1="4" y1="28" x2="86" y2="28" stroke={accent} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      <line x1="45" y1="4" x2="45" y2="52" stroke={accent} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      <path d="M 12 36 H 26 V 16 H 44 V 36 H 62 V 16 H 78" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="26" cy="16" r="3" fill={pulse} className="animate-ping" opacity="0.7" />
      <circle cx="26" cy="16" r="3" fill={pulse} />
      <circle cx="62" cy="16" r="3" fill={pulse} />
    </svg>
  );
};

const NumberSystemSVG: React.FC<{ isOpened: boolean; isLight: boolean }> = ({ isOpened, isLight }) => {
  const accent = isOpened ? (isLight ? '#7A3FD0' : '#C084FC') : (isLight ? '#64748B' : '#94A3B8');
  const bgGrad = isLight ? 'url(#waveGradLight)' : 'url(#waveGradDark)';
  const ledOff = isLight ? '#CBD5E1' : '#334155';
  return (
    <svg viewBox="0 0 90 56" className="w-20 h-13 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" fill="none">
      <rect x="4" y="4" width="82" height="48" rx="8" fill={bgGrad} stroke={accent} strokeWidth="1.8" />
      <rect x="11" y="13" width="13" height="17" rx="3.5" fill={accent} opacity="0.3" stroke={accent} strokeWidth="1.2" />
      <text x="15" y="25" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="900">1</text>
      <rect x="29" y="13" width="13" height="17" rx="3.5" fill={ledOff} opacity="0.4" stroke={ledOff} strokeWidth="1.2" />
      <text x="33" y="25" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="9" fontFamily="monospace" fontWeight="900">0</text>
      <rect x="47" y="13" width="13" height="17" rx="3.5" fill={accent} opacity="0.3" stroke={accent} strokeWidth="1.2" />
      <text x="51" y="25" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="900">1</text>
      <rect x="65" y="13" width="13" height="17" rx="3.5" fill={accent} opacity="0.3" stroke={accent} strokeWidth="1.2" />
      <text x="69" y="25" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="900">1</text>
      <text x="28" y="43" fill={accent} fontSize="8.5" fontFamily="monospace" fontWeight="800">BUS: 0xB</text>
    </svg>
  );
};

const LogicGateSVG: React.FC<{ isOpened: boolean; isLight: boolean }> = ({ isOpened, isLight }) => {
  const accent = isOpened ? (isLight ? '#7A3FD0' : '#C084FC') : (isLight ? '#64748B' : '#94A3B8');
  const bgGrad = isLight ? 'url(#waveGradLight)' : 'url(#waveGradDark)';
  return (
    <svg viewBox="0 0 90 56" className="w-20 h-13 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" fill="none">
      <rect x="4" y="4" width="82" height="48" rx="8" fill={bgGrad} stroke={accent} strokeWidth="1.8" />
      <path d="M 24 16 H 42 C 53 16 60 22 60 28 C 60 34 53 40 42 40 H 24 Z" stroke={accent} strokeWidth="2" fill="none" />
      <line x1="12" y1="21" x2="24" y2="21" stroke={accent} strokeWidth="1.8" />
      <line x1="12" y1="35" x2="24" y2="35" stroke={accent} strokeWidth="1.8" />
      <circle cx="64" cy="28" r="3.5" fill={isLight ? '#FFFFFF' : '#0F172A'} stroke={accent} strokeWidth="1.8" />
      <line x1="67.5" y1="28" x2="78" y2="28" stroke={accent} strokeWidth="1.8" />
    </svg>
  );
};

const KMapSVG: React.FC<{ isOpened: boolean; isLight: boolean }> = ({ isOpened, isLight }) => {
  const accent = isOpened ? (isLight ? '#7A3FD0' : '#C084FC') : (isLight ? '#64748B' : '#94A3B8');
  const bgGrad = isLight ? 'url(#waveGradLight)' : 'url(#waveGradDark)';
  const loopColor = '#F59E0B';
  return (
    <svg viewBox="0 0 90 56" className="w-20 h-13 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" fill="none">
      <rect x="4" y="4" width="82" height="48" rx="8" fill={bgGrad} stroke={accent} strokeWidth="1.8" />
      <rect x="20" y="12" width="50" height="32" rx="3" stroke={accent} strokeWidth="1.4" />
      <line x1="45" y1="12" x2="45" y2="44" stroke={accent} strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="20" y1="28" x2="70" y2="28" stroke={accent} strokeWidth="1.2" strokeDasharray="2 2" />
      <text x="29" y="23" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="900">1</text>
      <text x="54" y="23" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="900">1</text>
      <text x="29" y="39" fill={isLight ? '#94A3B8' : '#64748B'} fontSize="9" fontFamily="monospace">0</text>
      <text x="54" y="39" fill={accent} fontSize="9" fontFamily="monospace" fontWeight="900">1</text>
      <rect x="24" y="15" width="42" height="13" rx="5" stroke={loopColor} strokeWidth="1.8" fill={loopColor} fillOpacity="0.25" />
    </svg>
  );
};

const VerilogCoreSVG: React.FC<{ isOpened: boolean; isLight: boolean }> = ({ isOpened, isLight }) => {
  const accent = isOpened ? (isLight ? '#7A3FD0' : '#C084FC') : (isLight ? '#64748B' : '#94A3B8');
  const bgGrad = isLight ? 'url(#waveGradLight)' : 'url(#waveGradDark)';
  return (
    <svg viewBox="0 0 90 56" className="w-20 h-13 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" fill="none">
      <rect x="4" y="4" width="82" height="48" rx="8" fill={bgGrad} stroke={accent} strokeWidth="1.8" />
      <rect x="26" y="13" width="38" height="30" rx="4" stroke={accent} strokeWidth="1.8" fill="none" />
      <text x="31" y="24" fill={accent} fontSize="8" fontFamily="monospace" fontWeight="900">D</text>
      <text x="53" y="24" fill={accent} fontSize="8" fontFamily="monospace" fontWeight="900">Q</text>
      <path d="M 26 34 L 32 36 L 26 38" stroke={accent} strokeWidth="1.5" fill="none" />
      <line x1="12" y1="22" x2="26" y2="22" stroke={accent} strokeWidth="1.8" />
      <line x1="64" y1="22" x2="78" y2="22" stroke={accent} strokeWidth="1.8" />
      <line x1="12" y1="36" x2="26" y2="36" stroke={accent} strokeWidth="1.8" />
    </svg>
  );
};

interface FoundationNodeDef {
  id: string;
  level: string;
  num: string;
  title: string;
  code: string;
  utility: string;
  svg: React.FC<{ isOpened: boolean; isLight: boolean }>;
}

const FOUNDATION_NODES: FoundationNodeDef[] = [
  { id: 'module/1', level: 'L1', num: '01', title: 'Signals & Waves', code: 'WAVE_FOUNDATION', utility: 'Continuous physical voltage thresholds convert into discrete 0 & 1 logic states.', svg: SignalWaveSVG },
  { id: 'module/2', level: 'L2', num: '02', title: 'Number Systems', code: 'NUMBER_SYSTEMS', utility: 'Binary, Hexadecimal & Two\'s Complement signed arithmetic used in CPU ALUs.', svg: NumberSystemSVG },
  { id: 'module/3', level: 'L3', num: '03', title: 'Logic Gates', code: 'GATE_LOGIC', utility: 'Build digital truth tables for AND, OR, NAND, NOR & XOR logic gates.', svg: LogicGateSVG },
  { id: 'module/4', level: 'L4', num: '04', title: 'K-Maps', code: 'MAP_REDUCTION', utility: 'Minimize boolean algebraic expressions using 2 & 4-variable Karnaugh Maps.', svg: KMapSVG },
  { id: 'module/5', level: 'L5', num: '05', title: 'Verilog Core', code: 'HDL_GATEWAY', utility: 'Write hardware description language syntax, wire vs reg & testbenches.', svg: VerilogCoreSVG },
];

/* ── Badges Modal ── */
interface BadgeDef {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  hint: string;
}

const BADGES: BadgeDef[] = [
  { id: 'b1', name: 'Signal Pioneer', icon: '📡', unlocked: true, hint: 'Completed Level 01 Signals & Waves' },
  { id: 'b2', name: 'Gate Architect', icon: '⚡', unlocked: true, hint: 'Built first 4-gate logic circuit' },
  { id: 'b3', name: 'HDL Cipher', icon: '💻', unlocked: false, hint: 'Solve 5 Verilog coding challenges' },
  { id: 'b4', name: 'Die Master', icon: '🗺️', unlocked: false, hint: 'Inspect Silicon Die topography' },
];

const BadgesModal: React.FC<{ isOpen: boolean; onClose: () => void; isLight: boolean }> = ({ isOpen, onClose, isLight }) => {
  if (!isOpen) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isLight ? 'bg-slate-900/40 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-md'}`}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-md p-6 rounded-2xl border ${
          isLight ? 'bg-white border-purple-200 shadow-2xl text-slate-900' : 'bg-slate-900 border-purple-800/60 shadow-2xl text-slate-100'
        }`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-purple-500 font-mono text-[11px] font-extrabold uppercase tracking-wider mb-2">
          <Trophy size={15} />
          <span>SILICON ACHIEVEMENTS</span>
        </div>

        <h3 className="text-base font-extrabold mb-4">Learner Telemetry Badges</h3>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-xl border flex flex-col justify-between ${
                b.unlocked
                  ? (isLight ? 'bg-purple-50 border-purple-200 text-purple-950' : 'bg-purple-950/40 border-purple-500/40 text-purple-200')
                  : (isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-950 border-slate-800 text-slate-500')
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{b.icon}</span>
                {b.unlocked ? <Check size={14} className="text-emerald-500" /> : <Lock size={12} className="opacity-40" />}
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-extrabold">{b.name}</h4>
                <p className="text-[10px] opacity-70 mt-0.5 leading-snug">{b.hint}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
          Close Badges Deck
        </button>
      </motion.div>
    </div>
  );
};

/* ── Interactive Daily Diagnostic Quiz Modal ── */
const DailyChallengeModal: React.FC<{ isOpen: boolean; onClose: () => void; isLight: boolean }> = ({ isOpen, onClose, isLight }) => {
  const { awardXP } = useGamificationStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [earned, setEarned] = useState(false);

  if (!isOpen) return null;

  const question = {
    text: 'What is the output of a 2-input XOR gate when Input A = 1 and Input B = 1?',
    options: [
      { id: 0, text: '0 (LOW)', correct: true },
      { id: 1, text: '1 (HIGH)', correct: false },
      { id: 2, text: 'High Impedance (Z)', correct: false },
      { id: 3, text: 'Undefined (X)', correct: false },
    ]
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (question.options[selected].correct) {
      setEarned(true);
      awardXP('diagnostic', 50);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isLight ? 'bg-slate-900/40 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-md'}`}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-md p-6 rounded-2xl border ${
          isLight ? 'bg-white border-purple-200 shadow-2xl text-slate-900' : 'bg-slate-900 border-purple-800/60 shadow-2xl text-slate-100'
        }`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-amber-500 font-mono text-[11px] font-extrabold uppercase tracking-wider mb-2">
          <Zap size={14} />
          <span>DAILY DIAGNOSTIC · +50 XP</span>
        </div>

        <h3 className="text-base font-extrabold leading-snug mb-4">{question.text}</h3>

        <div className="space-y-2 mb-5">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              disabled={submitted}
              onClick={() => setSelected(opt.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                selected === opt.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{opt.text}</span>
              {submitted && opt.correct && <Check size={14} className="text-emerald-500" />}
            </button>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="w-full py-3 rounded-xl font-extrabold text-xs text-white uppercase tracking-wider bg-purple-600 hover:bg-purple-500 shadow-md transition-transform active:scale-[0.99] disabled:opacity-50"
          >
            Submit Diagnostic Answer
          </button>
        ) : (
          <div className="text-center space-y-3">
            <p className={`text-xs font-extrabold font-mono ${earned ? 'text-emerald-500' : 'text-rose-500'}`}>
              {earned ? '🎉 Correct! +50 XP Added to Telemetry' : '❌ Incorrect. XOR outputs 0 when inputs match!'}
            </p>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              Close Diagnostic
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/* ── Micro-Simulator Popover ── */
const MicroGateSimulatorPopover: React.FC<{ node: FoundationNodeDef; isLight: boolean }> = ({ node, isLight }) => {
  const [inA, setInA] = useState(1);
  const [inB, setInB] = useState(0);

  let out = 0;
  if (node.level === 'L1') out = inA;
  else if (node.level === 'L2') out = inA ^ inB;
  else if (node.level === 'L3') out = inA & inB;
  else if (node.level === 'L4') out = inA | inB;
  else if (node.level === 'L5') out = inA === 0 ? 1 : 0;

  return (
    <div className={`p-3.5 w-60 rounded-xl border text-left text-xs shadow-xl ${
      isLight ? 'bg-white border-purple-200 text-slate-900' : 'bg-slate-900 border-purple-900/60 text-slate-100'
    }`}>
      <div className={`flex items-center justify-between font-mono text-[10px] font-extrabold mb-2 pb-1 border-b ${
        isLight ? 'border-purple-100 text-purple-600' : 'border-slate-800 text-purple-400'
      }`}>
        <span>GATE MICRO-SIMULATOR</span>
        <span className="text-emerald-500">● LIVE</span>
      </div>

      <p className={`text-[11px] mb-3 leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{node.utility}</p>

      <div className={`flex items-center justify-between p-2 rounded-lg border font-mono ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
      }`}>
        <div className="flex items-center gap-1.5 font-bold">
          <span className="opacity-60">IN:</span>
          <button
            onClick={(e) => { e.stopPropagation(); setInA(a => a === 1 ? 0 : 1); }}
            className={`px-2 py-0.5 rounded font-extrabold transition-colors ${
              inA === 1 ? 'bg-purple-600 text-white' : (isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400')
            }`}
          >
            {inA}
          </button>
          {node.level !== 'L1' && node.level !== 'L5' && (
            <button
              onClick={(e) => { e.stopPropagation(); setInB(b => b === 1 ? 0 : 1); }}
              className={`px-2 py-0.5 rounded font-extrabold transition-colors ${
                inB === 1 ? 'bg-purple-600 text-white' : (isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400')
              }`}
            >
              {inB}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 font-bold">
          <span className="opacity-60">OUT:</span>
          <span className={`px-2 py-0.5 rounded font-black ${
            out === 1 ? 'bg-emerald-500 text-white' : (isLight ? 'bg-slate-200 text-slate-400' : 'bg-slate-800 text-slate-500')
          }`}>
            {out}
          </span>
        </div>
      </div>
    </div>
  );
};

const BENCH = [
  { label: 'Workbench', to: '/workbench', icon: Wrench },
  { label: 'K-Map Lab', to: '/kmap-lab', icon: Grid3x3 },
  { label: 'Verilog Judge', to: '/verilog-playground', icon: Cpu },
];

const LIBRARY = [
  { label: 'Analogy Library', to: '/analogy-library', icon: BookOpen },
  { label: 'Verilog Library', to: '/verilog-library', icon: Terminal },
  { label: 'Silicon Map', to: '/silicon-map', icon: Map },
  { label: 'Career Roadmap', to: '/roadmap', icon: Compass },
];

const TOTAL_MODULES = Object.keys(MODULE_LABELS).length;

const modulesFor = (prefix: string) =>
  Object.keys(MODULE_LABELS)
    .filter((k) => k.startsWith(prefix))
    .sort((a, b) => (parseInt(a.split('/')[1], 10) || 0) - (parseInt(b.split('/')[1], 10) || 0))
    .map((k) => ({ id: k, label: MODULE_LABELS[k], path: `/${k}` }));

/* ── MAIN WORKSTATION HOME ── */
export const WorkstationHome: React.FC = () => {
  const navigate = useNavigate();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  const { firstName, xp, streak, checkStreak } = useGamificationStore();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [dailyModalOpen, setDailyModalOpen] = useState(false);
  const [badgesModalOpen, setBadgesModalOpen] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [expandBE, setExpandBE] = useState(false);
  const [expandDSD, setExpandDSD] = useState(false);

  useEffect(() => { checkStreak(); }, [checkStreak]);

  // Keyboard Hotkeys listener (1-5, D, W, K)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(p => !p);
      } else if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key, 10);
        navigate(`/module/${idx}`);
      } else if (e.key.toLowerCase() === 'd') {
        setDailyModalOpen(true);
      } else if (e.key.toLowerCase() === 'w') {
        navigate('/workbench');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const name = firstName ?? getSession().displayName ?? 'Learner';
  const history = getModuleHistory();
  const last = getLastModule();
  const opened = new Set(history.map((h) => h.id));

  const totalXp = typeof xp === 'number' ? xp : (xp?.total ?? 0);
  const currentStreak = typeof streak === 'number' ? streak : (streak?.current ?? 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Styling Tokens
  const panel: React.CSSProperties = {
    background: isLight ? '#ECE8FB' : '#0B0F19',
    border: isLight ? '2px solid #1B1436' : '1px solid rgba(255,255,255,0.08)',
    boxShadow: isLight ? '5px 5px 0 0 #1B1436' : '0 18px 44px rgba(0,0,0,0.55)',
    borderRadius: 12,
  };
  const chip: React.CSSProperties = { ...panel, borderRadius: 8, boxShadow: isLight ? '3px 3px 0 0 #1B1436' : 'none' };
  const dim = isLight ? '#4A3F63' : '#94A3B8';
  const faint = isLight ? '#6B5E86' : '#64748B';
  const hairline = isLight ? '#C9BEEA' : 'rgba(255,255,255,0.08)';

  const scrollToPaths = () => {
    document.getElementById('paths')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="relative min-h-[100svh] w-full overflow-x-hidden font-sans transition-colors duration-300"
      style={{ backgroundColor: isLight ? '#ECE8FB' : '#060911', color: isLight ? 'var(--text-main)' : '#E2E8F0' }}
    >
      <PCBBackground isLight={isLight} />

      {/* Floating Radial Menu */}
      <RadialMenu />

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        {/* Authentic Topbar */}
        <header className="mb-8 flex items-center justify-between border-b pb-4" style={{ borderColor: hairline }}>
          <div className="flex items-center gap-6">
            <DigitalClock isLight={isLight} />
            <div className="hidden md:flex items-center gap-3 border-l pl-6" style={{ borderColor: hairline }}>
              <BrandMark size={30} />
              <span className="font-mono text-sm font-extrabold tracking-tight">BitForBytes</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 font-mono text-xs font-bold uppercase tracking-wider" style={{ color: dim }}>
            <button onClick={() => navigate('/workbench')} className="hover:text-purple-400 transition-colors">WORKBENCH</button>
            <button onClick={() => navigate('/kmap-lab')} className="hover:text-purple-400 transition-colors">K-MAP LAB</button>
            <button onClick={() => navigate('/verilog-playground')} className="hover:text-purple-400 transition-colors">VERILOG JUDGE</button>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak & XP Telemetry Badges */}
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs font-extrabold">
              <span className={`px-2.5 py-1 rounded-lg border ${isLight ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                🔥 {currentStreak}d
              </span>
              <span className={`px-2.5 py-1 rounded-lg border ${isLight ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
                💎 {totalXp} XP
              </span>
              <button
                onClick={() => setBadgesModalOpen(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border hover:opacity-80 transition-opacity ${
                  isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-800 text-purple-300'
                }`}
              >
                <Trophy size={13} className="text-purple-500" />
                <span>Badges</span>
              </button>
            </div>

            <button
              onClick={() => setCmdOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[11px] font-bold"
              style={chip}
            >
              <Command size={12} /> K
            </button>

            <button
              onClick={() => navigate('/settings')}
              aria-label="Settings"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-opacity hover:opacity-70"
              style={{ color: dim }}
            >
              <Settings size={16} />
            </button>
            <ThemeToggle variant="minimal" />

            {/* Profile Avatar Chip */}
            <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: hairline }}>
              <span className="flex h-7 w-7 items-center justify-center rounded-md font-mono text-[12px] font-black text-white bg-purple-600">
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline font-mono text-[12px] font-bold" style={{ color: dim }}>{name}</span>
            </div>
          </div>
        </header>

        <main>
          {/* ── Authentic Hero Section ── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-center"
          >
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                {greeting}, <span className="text-purple-400">{name}.</span>
              </h1>
              <button
                onClick={scrollToPaths}
                className="mt-3 flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wide transition-opacity hover:opacity-80"
                style={{ color: dim }}
              >
                <span>Browse the three paths</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Floating Resume Ticket Card */}
            <div className="w-full md:w-[380px] flex-shrink-0" style={panel}>
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: faint }}>
                  <span>START HERE · FOUNDATION</span>
                  <button
                    onClick={() => setDailyModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                  >
                    <Zap size={10} /> +50 XP
                  </button>
                </div>
                <h3 className="mt-2 text-lg font-bold truncate">
                  {last ? last.label : 'Signals & Waves'}
                </h3>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-purple-950/40 border border-purple-500/20">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.round((opened.size / TOTAL_MODULES) * 100)}%` }} />
                </div>

                <button
                  onClick={() => navigate(last ? last.path : '/module/1')}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5 bg-purple-600 hover:bg-purple-500"
                >
                  <Play size={14} className="fill-current" />
                  <span>{last ? 'Resume lesson' : 'Open lesson'}</span>
                  <ArrowRight size={14} />
                </button>

                <div className="mt-3 flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: faint }}>
                  <span>{last ? `LAST · ${last.label}` : 'FRESH START'}</span>
                  <span className="tabular-nums">{history.length}/{TOTAL_MODULES} OPENED</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── "YOUR PATHS" SECTION ── */}
          <motion.section
            id="paths"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mt-8 overflow-hidden"
            style={panel}
          >
            {/* Header */}
            <div className="flex items-baseline justify-between px-6 pb-4 pt-6 sm:px-8">
              <h2 className="text-xl font-bold tracking-tight">Your paths</h2>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: faint }}>
                3 TRACKS · {TOTAL_MODULES} MODULES
              </span>
            </div>

            <SquareWave stroke={hairline} />

            {/* TRACK 01: FOUNDATION WITH VIBRANT HIGH-FIDELITY SCHEMATIC NODES */}
            <div className="p-6 sm:p-8 border-b" style={{ borderColor: hairline }}>
              <div className="flex items-start gap-6 mb-6">
                <span className="hidden sm:block font-mono font-black text-4xl leading-none opacity-20 select-none">01</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/20 text-purple-400 font-mono text-xs font-bold">01</span>
                    <h3 className="text-lg font-bold">Foundation</h3>
                    <span className="ml-auto font-mono text-xs font-semibold" style={{ color: faint }}>
                      {Array.from(opened).filter(id => id.startsWith('module/')).length} / 5
                    </span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: dim }}>Digital logic & Verilog — signals, gates, K-maps.</p>
                </div>
              </div>

              {/* Animated PCB Trace Signal Line */}
              <div className="relative mb-3 hidden sm:block">
                <svg className="w-full h-3 overflow-visible" fill="none">
                  <line x1="10%" y1="6" x2="90%" y2="6" stroke={isLight ? '#CBD5E1' : '#1E293B'} strokeWidth="2" />
                  <motion.line
                    x1="10%"
                    y1="6"
                    x2="90%"
                    y2="6"
                    stroke="#A78BFA"
                    strokeWidth="2.5"
                    strokeDasharray="14 14"
                    animate={{ strokeDashoffset: [-28, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                  />
                </svg>
              </div>

              {/* Horizontal 5 Vibrant Hardware Module Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                {FOUNDATION_NODES.map((node) => {
                  const isOpened = opened.has(node.id);
                  const isCurrent = (last?.id ?? 'module/1') === node.id;
                  const NodeSVG = node.svg;

                  return (
                    <div
                      key={node.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                    >
                      <AnimatePresence>
                        {hoveredNodeId === node.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.96 }}
                            className="absolute bottom-full mb-3 z-30 pointer-events-auto"
                          >
                            <MicroGateSimulatorPopover node={node} isLight={isLight} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        onClick={() => navigate(`/${node.id}`)}
                        className={`w-full flex flex-col justify-between p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer shadow-md hover:-translate-y-1.5 ${
                          isOpened
                            ? (isLight ? 'bg-gradient-to-b from-purple-50 to-white border-purple-300 shadow-purple-100 hover:border-purple-500' : 'bg-gradient-to-b from-purple-950/40 to-slate-950/90 border-purple-500/50 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]')
                            : isCurrent
                            ? (isLight ? 'bg-gradient-to-b from-purple-100 to-purple-50 border-purple-500 shadow-purple-200' : 'bg-gradient-to-b from-purple-900/50 to-slate-950/90 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]')
                            : (isLight ? 'bg-slate-50 border-slate-200 hover:border-purple-300' : 'bg-gradient-to-b from-slate-900/80 to-slate-950/90 border-slate-800 hover:border-slate-700')
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[10.5px] font-black mb-2">
                          <span className={`px-2 py-0.5 rounded-md border ${
                            isLight ? 'bg-purple-100 border-purple-200 text-purple-900' : 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                          }`}>
                            NODE {node.num}
                          </span>

                          {isOpened ? (
                            <span className="text-emerald-500 flex items-center gap-1 text-[9.5px] font-bold">
                              <CheckCircle2 size={11} /> DONE
                            </span>
                          ) : isCurrent ? (
                            <span className="text-purple-400 flex items-center gap-1 text-[9.5px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" /> ACTIVE
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[9.5px] font-bold">LOCKED</span>
                          )}
                        </div>

                        {/* Rich Glowing Vector SVG */}
                        <div className="my-3 flex items-center justify-center h-14">
                          <NodeSVG isOpened={isOpened || isCurrent} isLight={isLight} />
                        </div>

                        <div>
                          <h4 className="text-xs font-extrabold tracking-tight truncate group-hover:text-purple-400 transition-colors">
                            {node.title}
                          </h4>
                          <span className="font-mono text-[9px] font-bold opacity-60 block mt-0.5" style={{ color: faint }}>
                            {node.code}
                          </span>
                        </div>

                        {/* Bottom Action Indicator */}
                        <div className="mt-3 pt-2.5 border-t flex items-center justify-between font-mono text-[9.5px] font-extrabold" style={{ borderColor: hairline }}>
                          <span className={isOpened ? 'text-emerald-500' : 'text-purple-400 group-hover:translate-x-0.5 transition-transform'}>
                            {isOpened ? 'REVIEW ✓' : 'EXPLORE →'}
                          </span>
                          <span className="opacity-50">{node.level}</span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRACK 02: BASIC ELECTRONICS */}
            <div className="p-6 sm:p-8 border-b" style={{ borderColor: hairline }}>
              <div className="flex items-start gap-6">
                <span className="hidden sm:block font-mono font-black text-4xl leading-none opacity-20 select-none">02</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-orange-500/20 text-orange-400 font-mono text-xs font-bold">⚡</span>
                    <h3 className="text-lg font-bold">Basic Electronics</h3>
                    <span className="ml-auto font-mono text-xs font-semibold" style={{ color: faint }}>
                      {Array.from(opened).filter(id => id.startsWith('basic-electronics/')).length} / 10
                    </span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: dim }}>From the physics of control to transistors.</p>

                  <div className="mt-4 flex items-center gap-1.5">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <div key={idx} className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full ${opened.has(`basic-electronics/${idx + 1}`) ? 'bg-orange-500' : ''}`} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => navigate('/basic-electronics/1')}
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 transition-transform hover:-translate-y-0.5"
                    >
                      <Play size={13} /> Start <ArrowRight size={13} />
                    </button>
                    <button
                      onClick={() => setExpandBE(e => !e)}
                      className="text-xs font-semibold flex items-center gap-1"
                      style={{ color: dim }}
                    >
                      <span>All modules</span>
                      <ChevronDown size={14} className={`transition-transform ${expandBE ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {expandBE && (
                    <div className="mt-3.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {modulesFor('basic-electronics/').map((m, i) => (
                        <button
                          key={m.id}
                          onClick={() => navigate(m.path)}
                          className="flex items-center gap-2.5 rounded-md border px-3 py-2 text-left text-xs font-medium hover:border-slate-700"
                          style={{ borderColor: hairline }}
                        >
                          <span className="font-mono text-orange-400 font-bold">{String(i + 1).padStart(2, '0')}</span>
                          <span className="flex-1 truncate">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TRACK 03: DIGITAL SYSTEM DESIGN */}
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-6">
                <span className="hidden sm:block font-mono font-black text-4xl leading-none opacity-20 select-none">03</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/20 text-purple-400 font-mono text-xs font-bold">🔮</span>
                    <h3 className="text-lg font-bold">Digital System Design</h3>
                    <span className="ml-auto font-mono text-xs font-semibold" style={{ color: faint }}>
                      {Array.from(opened).filter(id => id.startsWith('dsd/')).length} / 27
                    </span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: dim }}>Boolean logic through adders, subtractors and beyond.</p>

                  <div className="mt-4 flex items-center gap-1">
                    {Array.from({ length: 27 }).map((_, idx) => (
                      <div key={idx} className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full ${opened.has(`dsd/${idx + 1}`) ? 'bg-purple-500' : ''}`} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => navigate('/dsd/1')}
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-transform hover:-translate-y-0.5"
                    >
                      <Play size={13} /> Start <ArrowRight size={13} />
                    </button>
                    <button
                      onClick={() => setExpandDSD(e => !e)}
                      className="text-xs font-semibold flex items-center gap-1"
                      style={{ color: dim }}
                    >
                      <span>All modules</span>
                      <ChevronDown size={14} className={`transition-transform ${expandDSD ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {expandDSD && (
                    <div className="mt-3.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2 max-h-[300px] overflow-y-auto pr-1">
                      {modulesFor('dsd/').map((m, i) => (
                        <button
                          key={m.id}
                          onClick={() => navigate(m.path)}
                          className="flex items-center gap-2.5 rounded-md border px-3 py-2 text-left text-xs font-medium hover:border-slate-700"
                          style={{ borderColor: hairline }}
                        >
                          <span className="font-mono text-purple-400 font-bold">{String(i + 1).padStart(2, '0')}</span>
                          <span className="flex-1 truncate">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── BENCH & LIBRARY QUIET STRIP ── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="mt-8 p-5 sm:p-6"
            style={panel}
          >
            <div className="grid gap-6 md:grid-cols-[auto_1px_1fr] md:gap-8">
              <div>
                <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: faint }}>BENCH</p>
                <div className="flex flex-wrap gap-2">
                  {BENCH.map((b) => (
                    <button
                      key={b.to}
                      onClick={() => navigate(b.to)}
                      className="inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[13.5px] font-semibold transition-transform hover:-translate-y-0.5"
                      style={{ borderColor: hairline }}
                    >
                      <b.icon size={15} style={{ color: '#A78BFA' }} /> {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden md:block" style={{ background: hairline }} />
              <div>
                <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: faint }}>LIBRARY</p>
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

      <DailyChallengeModal isOpen={dailyModalOpen} onClose={() => setDailyModalOpen(false)} isLight={isLight} />
      <BadgesModal isOpen={badgesModalOpen} onClose={() => setBadgesModalOpen(false)} isLight={isLight} />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} />
    </div>
  );
};
