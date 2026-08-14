import React, {
  useMemo, useState, useEffect, useCallback, useRef,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, ChevronDown, ArrowRight, CheckCircle2, Circle,
  Brain, BookOpen, Bookmark, BookmarkCheck, Zap, Flame,
  LayoutGrid, List, Maximize2, X, BarChart2, ChevronLeft,
  ChevronRight, Keyboard, Trophy, RotateCcw, Download,
  Pencil, Copy, Dice5, Star, Share2, Upload,
  CreditCard, Swords, Undo2, Volume2, VolumeX, Printer,
  Building2, CheckSquare, Sparkles, Sun, Moon, Home,
} from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { IV_QUESTIONS, IV_TOPICS, IvTopicMeta, IvTopic, IvLevel } from '../data/interviewQuestions';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * VLSI Interview Prep — Beast Mode Study Engine.
 * Phase 1-6: Glassmorphic UI, XP, SR, Focus Mode, Stats, Mobile.
 * Phase 7: Flashcard 3D flip, Rank system, Mock Interview, Daily Challenge,
 *           Notes, Time tracking, Deep links, Copy answer, Random Q, Undo, Stagger.
 */

// ── Constants & Types ──────────────────────────────────────────────────────

const LEVELS: IvLevel[] = ['Easy', 'Medium', 'Hard', 'Numerical'];
const LEVEL_COLOR: Record<IvLevel, string> = {
  Easy: '#34D399', Medium: '#F59E0B', Hard: '#FB7185', Numerical: '#F97316',
};

// Company Tracks
export interface CompanyTrack {
  id: string;
  name: string;
  color: string;
  emoji: string;
  tagline: string;
  topics: IvTopic[];
  keywords: string[];
}

export const COMPANY_TRACKS: CompanyTrack[] = [
  {
    id: 'nvidia',
    name: 'NVIDIA',
    color: '#76B900',
    emoji: '🟢',
    tagline: 'RTL Architecture, Clock Domain Crossing & GPU DV',
    topics: ['spec-arch', 'rtl-dv', 'sta-timing', 'seq'],
    keywords: ['clock', 'cdc', 'fifo', 'pipeline', 'uvm', 'scoreboard', 'axi', 'metastability'],
  },
  {
    id: 'qualcomm',
    name: 'Qualcomm',
    color: '#E2231A',
    emoji: '🔴',
    tagline: 'Physical Design, Low-Power Multi-Vt & Signoff STA',
    topics: ['pd-signoff', 'sta-timing', 'analog-physics'],
    keywords: ['slack', 'setup', 'hold', 'cts', 'antenna', 'leakage', 'padring', 'lef', 'def', 'crosstalk'],
  },
  {
    id: 'apple',
    name: 'Apple Silicon',
    color: '#94A3B8',
    emoji: '⚪',
    tagline: 'High-Performance Microarch, Caches & Custom Silicon',
    topics: ['spec-arch', 'rtl-dv', 'emb-c', 'analog-physics'],
    keywords: ['cache', 'coherency', 'dma', 'branch', 'hazard', 'power', 'ppa', 'latch', 'frequency'],
  },
  {
    id: 'intel-amd',
    name: 'Intel / AMD',
    color: '#0071C5',
    emoji: '🔵',
    tagline: 'Synthesis Optimization, DFT Scan & Advanced Fab',
    topics: ['synth-dft', 'fab-silicon', 'sta-timing', 'comb', 'seq'],
    keywords: ['scan', 'dft', 'atpg', 'bist', 'synthesis', 'yield', 'drc', 'finfet', 'euv'],
  },
  {
    id: 'arm-embedded',
    name: 'ARM / Embedded',
    color: '#0091BD',
    emoji: '🟣',
    tagline: 'Bare-Metal C/C++, FreeRTOS, DMA & Hardware Protocols',
    topics: ['emb-basics', 'emb-c', 'emb-protocols', 'emb-rtos', 'emb-debug'],
    keywords: ['volatile', 'interrupt', 'mutex', 'semaphore', 'i2c', 'spi', 'uart', 'can', 'priority inversion'],
  },
];

// Speech synthesizer helper
function cleanTextForSpeech(raw: string): string {
  return raw
    .replace(/§[FCR]:/g, '')
    .replace(/\\(frac|sqrt|text|mathbf|alpha|beta|gamma|Delta|times|approx|le|ge)/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_#>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Key Concept Extractor
function extractKeyConcepts(answerText: string): string[] {
  const lines = answerText.split('\n');
  const concepts: string[] = [];
  
  for (const line of lines) {
    const s = line.trim();
    if (s.startsWith('§F:')) {
      concepts.push('Formula: ' + s.slice(3).replace(/\$|`/g, '').trim().slice(0, 50));
    } else if (s.startsWith('§R:')) {
      concepts.push('Key Result: ' + s.slice(3).trim().slice(0, 50));
    } else if (/^•|^\*|^-\s|^[1-9]\./.test(s)) {
      const clean = s.replace(/^[-•*]\s*|^[1-9]\.\s*/, '').replace(/[*`$]/g, '').trim();
      if (clean.length >= 10 && clean.length <= 75) concepts.push(clean);
    } else if (s.includes('**') || s.includes(':')) {
      const parts = s.split(':');
      if (parts.length > 1 && parts[0].length >= 4 && parts[0].length <= 35) {
        concepts.push(parts[0].replace(/[*`$]/g, '').trim());
      }
    }
    if (concepts.length >= 4) break;
  }

  if (concepts.length < 2) {
    // Fallback: take significant phrases
    const sentences = answerText.replace(/§[FCR]:/g, '').split(/[.!?\n]/).map(x => x.trim()).filter(x => x.length >= 15 && x.length <= 60);
    sentences.slice(0, 3).forEach(st => concepts.push(st.replace(/[*`$]/g, '')));
  }

  return Array.from(new Set(concepts)).slice(0, 4);
}

const LEVEL_XP: Record<IvLevel, number> = {
  Easy: 5, Medium: 10, Hard: 20, Numerical: 25,
};

// Rank ladder
const RANKS = [
  { title: 'Fresher Intern',      xp: 0,    color: '#94A3B8', emoji: '🌱' },
  { title: 'Junior Engineer',     xp: 100,  color: '#22D3EE', emoji: '⚡' },
  { title: 'Mid-Level Engineer',  xp: 300,  color: '#3B82F6', emoji: '🔧' },
  { title: 'Senior Engineer',     xp: 600,  color: '#A855F7', emoji: '🏗️' },
  { title: 'Staff Engineer',      xp: 1000, color: '#F97316', emoji: '🚀' },
  { title: 'Principal Engineer',  xp: 1500, color: '#F59E0B', emoji: '💎' },
  { title: 'Silicon Wizard',      xp: 2000, color: 'rainbow', emoji: '🧙' },
];

function getRank(xp: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].xp) return { rank: RANKS[i], nextRank: RANKS[i + 1] ?? null, index: i };
  }
  return { rank: RANKS[0], nextRank: RANKS[1], index: 0 };
}

// localStorage keys
const PROGRESS_KEY  = 'iv_progress_v1';
const XP_KEY        = 'iv_xp_v1';
const STREAK_KEY    = 'iv_streak_v1';
const BOOKMARK_KEY  = 'iv_bookmarks_v1';
const SR_KEY        = 'iv_sr_v1';
const ACTIVITY_KEY  = 'iv_activity_v1';
const NOTES_KEY     = 'iv_notes_v1';
const TIME_KEY      = 'iv_time_v1';
const MOCK_KEY      = 'iv_mock_history_v1';
const DAILY_KEY     = 'iv_daily_v1';

// Spaced repetition metadata
interface SrMeta { lastReviewed: number; repCount: number; nextDue: number; }

// Mock interview attempt record
interface MockAttempt { date: string; score: number; total: number; durationSec: number; }

// ── localStorage helpers ───────────────────────────────────────────────────

const loadSet = (key: string): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
  catch { return new Set(); }
};
const saveSet = (key: string, s: Set<string>) => {
  try { localStorage.setItem(key, JSON.stringify([...s])); } catch {}
};
const loadJson = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
};
const saveJson = (key: string, v: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
};

// Streak
interface StreakData { count: number; lastDate: string; }
const todayStr = () => new Date().toISOString().slice(0, 10);
const loadStreak = (): StreakData => loadJson<StreakData>(STREAK_KEY, { count: 0, lastDate: '' });
const bumpStreak = (sd: StreakData): StreakData => {
  const today = todayStr();
  if (sd.lastDate === today) return sd;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return { count: sd.lastDate === yesterday ? sd.count + 1 : 1, lastDate: today };
};

const bumpActivity = () => {
  const map: Record<string, number> = loadJson(ACTIVITY_KEY, {});
  const today = todayStr();
  map[today] = (map[today] || 0) + 1;
  saveJson(ACTIVITY_KEY, map);
};

// Spaced repetition
const loadSr = (): Record<string, SrMeta> => loadJson<Record<string, SrMeta>>(SR_KEY, {});
const saveSr = (sr: Record<string, SrMeta>) => saveJson(SR_KEY, sr);
const srAfterGot = (id: string, sr: Record<string, SrMeta>): Record<string, SrMeta> => {
  const meta = sr[id] || { lastReviewed: 0, repCount: 0, nextDue: 0 };
  const rep = meta.repCount + 1;
  return { ...sr, [id]: { lastReviewed: Date.now(), repCount: rep, nextDue: Date.now() + Math.pow(2, Math.min(rep, 7)) * 86400000 } };
};
const srAfterMissed = (id: string, sr: Record<string, SrMeta>): Record<string, SrMeta> => ({
  ...sr, [id]: { lastReviewed: Date.now(), repCount: 0, nextDue: Date.now() + 3600000 },
});

// Daily challenge — deterministic per day
function getDailyId(): string {
  const dayNum = Math.floor(Date.now() / 86400000);
  return IV_QUESTIONS[dayNum % IV_QUESTIONS.length].id;
}

// ── KaTeX ──────────────────────────────────────────────────────────────────

function renderKatexMath(mathStr: string, displayMode = false) {
  try { return katex.renderToString(mathStr, { displayMode, throwOnError: false }); }
  catch { return mathStr; }
}

function HighlightedText({ text, needle, dark }: { text: string; needle: string; dark: boolean }) {
  if (!needle) return <>{text}</>;
  const parts = text.split(new RegExp(`(${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === needle.toLowerCase()
          ? <mark key={i} style={{ background: dark ? 'rgba(250,204,21,0.35)' : 'rgba(250,204,21,0.6)', color: 'inherit', borderRadius: '2px', padding: '0 1px' }}>{p}</mark>
          : p
      )}
    </>
  );
}

function renderInlineMathAndCode(textStr: string, key: number, dark: boolean, needle = '') {
  const isLabelHeader = /^(Given:|Option [A-D]:|Note:|Key takeaways:|Best approach:)/i.test(textStr.trim());
  const parts = textStr.split(/(\$[^\$]+\$|`[^`]+`)/g);
  const bodyTextColor = dark ? 'rgba(241,245,249,0.95)' : 'rgba(15,23,42,0.92)';
  return (
    <div key={key} className="mt-2.5 flex items-start gap-2">
      {!isLabelHeader && <span className="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: dark ? '#7DD3FC' : '#0284C7' }} />}
      <p className={`text-[15px] md:text-[16px] leading-relaxed ${isLabelHeader ? 'font-semibold text-amber-500 mt-1' : ''}`}
        style={{ color: isLabelHeader ? undefined : bodyTextColor }}>
        {parts.map((p, i) => {
          if (p.startsWith('$') && p.endsWith('$') && p.length > 2)
            return <span key={i} className="inline-katex font-mono px-1 font-semibold" style={{ color: dark ? '#38BDF8' : '#0369A1' }} dangerouslySetInnerHTML={{ __html: renderKatexMath(p.slice(1, -1)) }} />;
          if (p.startsWith('`') && p.endsWith('`') && p.length > 2)
            return <code key={i} className="font-mono px-1.5 py-0.5 rounded text-[13px] font-semibold" style={{ background: dark ? 'rgba(56,189,248,0.12)' : 'rgba(2,132,199,0.1)', color: dark ? '#38BDF8' : '#0284C7', border: `1px solid ${dark ? 'rgba(56,189,248,0.3)' : 'rgba(2,132,199,0.25)'}` }}>{p.slice(1, -1)}</code>;
          return needle ? <HighlightedText key={i} text={p} needle={needle} dark={dark} /> : p;
        })}
      </p>
    </div>
  );
}

function renderAnswer(a: string, dark: boolean, needle = '') {
  return a.split('\n').map((line, i) => {
    const s = line.trim();
    if (s.startsWith('§F:')) return (
      <div key={i} className="iv-formula-block my-3 p-3.5 rounded-md border-l-4 shadow-sm overflow-x-auto custom-scrollbar" style={{ borderColor: dark ? '#F59E0B' : '#D97706', background: dark ? 'rgba(245,158,11,0.08)' : '#FFFBEB', color: dark ? '#FDE68A' : '#78350F', WebkitOverflowScrolling: 'touch' }}>
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1 opacity-75">Formula Definition</div>
        <div dangerouslySetInnerHTML={{ __html: renderKatexMath(s.slice(3).trim(), true) }} />
      </div>
    );
    if (s.startsWith('§C:')) return (
      <div key={i} className="iv-formula-block my-3 p-3.5 rounded-md border-l-4 shadow-sm overflow-x-auto custom-scrollbar" style={{ borderColor: dark ? '#38BDF8' : '#0284C7', background: dark ? 'rgba(56,189,248,0.08)' : '#F0F9FF', color: dark ? '#BAE6FD' : '#0C4A6E', WebkitOverflowScrolling: 'touch' }}>
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1 opacity-75">Calculation Step</div>
        <div dangerouslySetInnerHTML={{ __html: renderKatexMath(s.slice(3).trim(), true) }} />
      </div>
    );
    if (s.startsWith('§R:')) return (
      <div key={i} className="mt-4 mb-2 flex items-center gap-2.5 rounded-lg px-4 py-2.5 font-mono text-[13px] md:text-[14px] font-bold shadow-sm overflow-x-auto custom-scrollbar" style={{ border: `1px solid ${dark ? 'rgba(52,211,153,0.4)' : 'rgba(16,185,129,0.4)'}`, background: dark ? 'rgba(52,211,153,0.12)' : '#ECFDF5', color: dark ? '#34D399' : '#065F46' }}>
        <span className="text-[16px]">✓</span><span>{s.slice(3).trim()}</span>
      </div>
    );
    if (!s) return <div key={i} className="h-2" />;
    return renderInlineMathAndCode(s, i, dark, needle);
  });
}

// ── SVG Section Arc ────────────────────────────────────────────────────────

function SectionArc({ pct, color, size = 22 }: { pct: number; color: string; size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  );
}

// ── Confetti Burst ─────────────────────────────────────────────────────────

function ConfettiBurst({ trigger }: { trigger: boolean }) {
  if (!trigger) return null;
  const pieces = Array.from({ length: 32 }, (_, i) => i);
  const colors = ['#F59E0B', '#22D3EE', '#A855F7', '#34D399', '#FB7185', '#F97316'];
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map(i => {
        const left = 20 + Math.random() * 60;
        const color = colors[i % colors.length];
        const delay = Math.random() * 0.5;
        const duration = 1.2 + Math.random() * 0.8;
        const size = 6 + Math.random() * 8;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${left}%`, top: '-10px', width: size, height: size,
            background: color, borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `iv-confetti-fall ${duration}s ease-in ${delay}s forwards`,
          }} />
        );
      })}
    </div>
  );
}

// ── Rank Badge ─────────────────────────────────────────────────────────────

function RankBadge({ xp, compact = false }: { xp: number; compact?: boolean }) {
  const { rank, nextRank } = getRank(xp);
  const isRainbow = rank.color === 'rainbow';
  const style: React.CSSProperties = {
    background: isRainbow
      ? 'linear-gradient(135deg, #F59E0B, #EC4899, #8B5CF6, #22D3EE)'
      : `${rank.color}22`,
    color: isRainbow ? '#fff' : rank.color,
    border: `1px solid ${isRainbow ? 'transparent' : rank.color + '50'}`,
    fontFamily: 'monospace',
    fontSize: compact ? '10px' : '11px',
    fontWeight: 700,
    padding: compact ? '2px 8px' : '3px 10px',
    borderRadius: '99px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  };
  return (
    <span style={style} title={nextRank ? `Next: ${nextRank.title} at ${nextRank.xp} XP` : 'Max Rank!'}>
      {rank.emoji} {compact ? '' : rank.title}
    </span>
  );
}

// ── Toast System ───────────────────────────────────────────────────────────

interface ToastItem { id: string; message: string; type: 'success' | 'info' | 'rank'; onUndo?: () => void; }

function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-4 z-[60] flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-2rem)]">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-2xl font-mono text-[12px] font-bold touch-manipulation"
          style={{
            background: t.type === 'rank' ? 'linear-gradient(135deg, #F59E0B, #EC4899)' : t.type === 'success' ? 'rgba(52,211,153,0.95)' : 'rgba(30,41,59,0.97)',
            color: t.type === 'info' ? '#E2E8F0' : '#000',
            border: '1px solid rgba(255,255,255,0.15)',
            animation: 'iv-toast-in 0.3s ease-out',
            backdropFilter: 'blur(12px)',
          }}>
          <span>{t.message}</span>
          {t.onUndo && (
            <button onClick={() => { t.onUndo!(); onDismiss(t.id); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold min-h-[30px] active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Undo2 size={11} /> Undo
            </button>
          )}
          <button onClick={() => onDismiss(t.id)} className="p-1 min-h-[28px] min-w-[28px] flex items-center justify-center" style={{ opacity: 0.6 }}><X size={13} /></button>
        </div>
      ))}
    </div>
  );
}

// ── 3D Flashcard Deck ─────────────────────────────────────────────────────

function FlashcardDeck({ questions, done, dark, onDone, onBookmark, bookmarks, needle, speakingId, onToggleSpeech }: {
  questions: typeof IV_QUESTIONS;
  done: Set<string>;
  bookmarks: Set<string>;
  dark: boolean;
  onDone: (id: string) => void;
  onBookmark: (id: string) => void;
  needle: string;
  speakingId: string | null;
  onToggleSpeech: (id: string, text: string) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(questions);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const shuffle = useCallback(() => {
    setShuffled([...questions].sort(() => Math.random() - 0.5));
    setIdx(0); setFlipped(false);
  }, [questions]);

  useEffect(() => { setShuffled(questions); setIdx(0); setFlipped(false); }, [questions]);

  const item = shuffled[idx];
  if (!item) return <div className="flex-1 flex items-center justify-center font-mono text-sm" style={{ color: dark ? '#64748B' : '#94A3B8' }}>No questions</div>;

  const t = IV_TOPICS.find(x => x.id === item.topic)!;
  const isDone = done.has(item.id);
  const isBookmarked = bookmarks.has(item.id);
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const go = useCallback((dir: 1 | -1) => {
    setIdx(i => Math.max(0, Math.min(shuffled.length - 1, i + dir)));
    setFlipped(false);
  }, [shuffled.length]);

  // Touch swipe support (passive swipe gestures for mobile & tablets)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    // Horizontal swipe threshold: 45px, with horizontal intent > vertical
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) go(1); // swipe left -> next card
      else go(-1); // swipe right -> prev card
    }
    touchStartRef.current = null;
  };

  // Keyboard for flashcard mode
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setFlipped(f => !f); }
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if ((e.key === 'd' || e.key === 'D') && item) onDone(item.id);
      if ((e.key === 'b' || e.key === 'B') && item) onBookmark(item.id);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [item, go, onDone, onBookmark]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-6 md:py-12 select-none touch-manipulation w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>
      {/* Controls */}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 flex-wrap justify-center">
        <button onClick={shuffle} className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[11px] font-bold transition-all min-h-[38px] active:scale-95"
          style={{ background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: dark ? '#94A3B8' : '#64748B', border: `1px solid ${border}` }}>
          <Dice5 size={13} /> Shuffle
        </button>
        <button onClick={() => onToggleSpeech(item.id, `${item.q}. ${item.a}`)}
          title={speakingId === item.id ? 'Stop Audio Readout' : 'Listen to Question & Answer'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[11px] font-bold transition-all min-h-[38px] active:scale-95"
          style={{ background: speakingId === item.id ? 'rgba(34,211,238,0.18)' : (dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'), color: speakingId === item.id ? '#22D3EE' : (dark ? '#94A3B8' : '#64748B'), border: `1px solid ${speakingId === item.id ? 'rgba(34,211,238,0.4)' : border}` }}>
          {speakingId === item.id ? <VolumeX size={13} className="animate-pulse" /> : <Volume2 size={13} />}
          {speakingId === item.id ? 'Stop' : 'Listen'}
        </button>
        <span className="font-mono text-[12px] font-bold" style={{ color: dark ? '#94A3B8' : '#64748B' }}>
          {idx + 1} / {shuffled.length}
        </span>
        <span className="hidden sm:inline font-mono text-[10px]" style={{ color: dark ? '#64748B' : '#94A3B8' }}>
          Tap / Space to flip · Swipe ← →
        </span>
      </div>

      {/* 3D Card */}
      <div style={{ perspective: '1200px', width: '100%', maxWidth: '560px' }}>
        <div
          onClick={() => setFlipped(f => !f)}
          style={{
            position: 'relative',
            width: '100%',
            height: '350px',
            minHeight: '320px',
            maxHeight: '62vh',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
            cursor: 'pointer',
            touchAction: 'pan-y',
          }}>
          {/* Front face */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: '20px',
            background: dark ? `linear-gradient(135deg, rgba(15,17,26,0.98), rgba(${parseInt(t.color.slice(1,3),16)},${parseInt(t.color.slice(3,5),16)},${parseInt(t.color.slice(5,7),16)},0.06))` : '#ffffff',
            border: `2px solid ${t.color}40`, boxShadow: `0 20px 60px ${t.color}20, 0 0 0 1px ${t.color}20`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem md:2rem' }}>
            <span className="px-3 py-1 rounded-full font-mono text-[10px] font-bold mb-4 md:mb-6"
              style={{ background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}40` }}>{t.label}</span>
            <h2 className="text-[17px] md:text-[22px] font-extrabold text-center leading-snug px-2"
              style={{ color: dark ? '#F1F5F9' : '#0F172A' }}>
              <HighlightedText text={item.q} needle={needle} dark={dark} />
            </h2>
            <p className="mt-4 md:mt-6 font-mono text-[11px]" style={{ color: dark ? '#475569' : '#94A3B8' }}>
              👆 Tap to reveal answer
            </p>
          </div>

          {/* Back face */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)', borderRadius: '20px',
            background: dark ? 'rgba(15,17,26,0.98)' : '#ffffff',
            border: `2px solid ${t.color}50`, boxShadow: `0 20px 60px ${t.color}20`,
            display: 'flex', flexDirection: 'column', padding: '1.25rem md:1.5rem', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div className="flex items-center gap-2 mb-3 flex-shrink-0">
              <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold"
                style={{ background: `${t.color}18`, color: t.color }}>{t.label}</span>
              <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold"
                style={{ background: `${LEVEL_COLOR[item.level]}15`, color: LEVEL_COLOR[item.level] }}>{item.level}</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ borderLeft: `3px solid ${t.color}60`, paddingLeft: '0.85rem' }}>
              {renderAnswer(item.a, dark, needle)}
            </div>
          </div>
        </div>
      </div>

      {/* Card stack shadow illusion */}
      <div className="hidden sm:flex justify-center relative mt-2 w-full max-w-[560px]">
        {[2, 1].map(z => (
          <div key={z} style={{ position: 'absolute', width: `calc(100% - ${z * 24}px)`, height: '12px',
            background: dark ? `rgba(255,255,255,0.0${z})` : `rgba(0,0,0,0.0${z * 2})`,
            borderRadius: '0 0 20px 20px', top: `${z * 4}px`, zIndex: -z }} />
        ))}
      </div>

      {/* Navigation + actions */}
      <div className="flex items-center justify-center gap-3 md:gap-4 mt-8 md:mt-10 w-full max-w-sm">
        <button onClick={() => go(-1)} disabled={idx === 0}
          title="Previous question (← or Swipe Right)"
          className="p-3 rounded-xl transition-all disabled:opacity-25 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
          style={{ background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', border: `1px solid ${border}` }}>
          <ChevronLeft size={20} style={{ color: dark ? '#94A3B8' : '#64748B' }} />
        </button>
        <button onClick={() => onDone(item.id)}
          title="Mark done (D)"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono text-[12px] font-bold transition-all active:scale-95 min-h-[44px]"
          style={{
            background: isDone ? 'rgba(52,211,153,0.15)' : (dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
            color: isDone ? '#34D399' : (dark ? '#94A3B8' : '#64748B'),
            border: `1px solid ${isDone ? 'rgba(52,211,153,0.4)' : border}`,
          }}>
          {isDone ? <CheckCircle2 size={15} /> : <Circle size={15} />}
          {isDone ? 'Done' : 'Mark Done'}
        </button>
        <button onClick={() => onBookmark(item.id)}
          title="Bookmark question (B)"
          className="p-3 rounded-xl transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
          style={{ background: isBookmarked ? 'rgba(245,158,11,0.15)' : (dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'), border: `1px solid ${isBookmarked ? 'rgba(245,158,11,0.4)' : border}` }}>
          {isBookmarked ? <BookmarkCheck size={18} style={{ color: '#F59E0B' }} /> : <Bookmark size={18} style={{ color: dark ? '#64748B' : '#94A3B8' }} />}
        </button>
        <button onClick={() => go(1)} disabled={idx >= shuffled.length - 1}
          title="Next question (→ or Swipe Left)"
          className="p-3 rounded-xl transition-all disabled:opacity-25 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
          style={{ background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', border: `1px solid ${border}` }}>
          <ChevronRight size={20} style={{ color: dark ? '#94A3B8' : '#64748B' }} />
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-6 flex-wrap justify-center max-w-xs">
        {shuffled.slice(Math.max(0, idx - 4), idx + 5).map((q, i) => {
          const actualIdx = Math.max(0, idx - 4) + i;
          return (
            <button key={q.id} onClick={() => { setIdx(actualIdx); setFlipped(false); }}
              className="rounded-full transition-all min-h-[6px]"
              style={{
                width: actualIdx === idx ? '20px' : '6px',
                height: '6px',
                background: actualIdx === idx ? t.color : (done.has(q.id) ? '#34D399' : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)')),
              }} />
          );
        })}
      </div>
    </div>
  );
}

// ── Mock Interview Overlay ─────────────────────────────────────────────────

const MOCK_DURATIONS = [10, 15, 20, 30];

function MockInterview({ dark, onClose, onComplete }: {
  dark: boolean;
  onClose: () => void;
  onComplete: (got: number, total: number, durationSec: number) => void;
}) {
  const [durationMin, setDurationMin] = useState(20);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<typeof IV_QUESTIONS>([]);
  const [qIdx, setQIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ got: 0, missed: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const pickQuestions = useCallback(() => {
    const pick = (level: IvLevel, n: number) =>
      IV_QUESTIONS.filter(q => q.level === level).sort(() => Math.random() - 0.5).slice(0, n);
    return [...pick('Easy', 5), ...pick('Medium', 5), ...pick('Hard', 3), ...pick('Numerical', 2)].sort(() => Math.random() - 0.5);
  }, []);

  const start = () => {
    const qs = pickQuestions();
    setQuestions(qs);
    setQIdx(0);
    setRevealed(false);
    setScore({ got: 0, missed: 0 });
    const totalSec = durationMin * 60;
    setTimeLeft(totalSec);
    setStartTime(Date.now());
    setStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const timeUp = timeLeft === 0 && started;
  const answered = score.got + score.missed;
  const item = questions[qIdx];
  const t = item ? IV_TOPICS.find(x => x.id === item.topic)! : null;

  const handleGot = () => { setScore(s => ({ ...s, got: s.got + 1 })); nextQ(); };
  const handleMissed = () => { setScore(s => ({ ...s, missed: s.missed + 1 })); nextQ(); };
  const nextQ = () => {
    const next = qIdx + 1;
    if (next >= questions.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete(score.got + 1, questions.length, Math.floor((Date.now() - startTime) / 1000));
    } else { setQIdx(next); setRevealed(false); }
  };

  // Timer ring
  const totalSec = durationMin * 60;
  const pct = timeLeft / totalSec;
  const r = 38; const circ = 2 * Math.PI * r;
  const timerColor = pct > 0.25 ? '#22D3EE' : pct > 0.1 ? '#F59E0B' : '#FB7185';
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  if (!started) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
        <div className="w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center"
          style={{ background: dark ? 'rgba(15,17,26,0.98)' : '#fff', border: `1px solid ${border}` }}>
          <Swords size={32} style={{ color: '#F59E0B', margin: '0 auto 12px' }} />
          <h2 className="font-mono font-extrabold text-[20px] mb-2" style={{ color: dark ? '#F1F5F9' : '#0F172A' }}>Mock Interview</h2>
          <p className="font-mono text-[12px] mb-6" style={{ color: dark ? '#94A3B8' : '#64748B' }}>
            15 random questions • 5 Easy, 5 Medium, 3 Hard, 2 Numerical
          </p>
          <div className="mb-6">
            <p className="font-mono text-[11px] mb-3 font-bold" style={{ color: dark ? '#64748B' : '#94A3B8' }}>Select Duration</p>
            <div className="flex gap-2 justify-center">
              {MOCK_DURATIONS.map(d => (
                <button key={d} onClick={() => setDurationMin(d)}
                  className="px-4 py-2 rounded-xl font-mono text-[12px] font-bold transition-all"
                  style={{
                    background: d === durationMin ? 'rgba(34,211,238,0.15)' : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    color: d === durationMin ? '#22D3EE' : (dark ? '#64748B' : '#94A3B8'),
                    border: `1px solid ${d === durationMin ? 'rgba(34,211,238,0.35)' : border}`,
                  }}>{d}m</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={start} className="flex-1 py-3 rounded-xl font-mono text-[13px] font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #22D3EE, #0EA5E9)', color: '#000' }}>
              Start Interview
            </button>
            <button onClick={onClose} className="px-4 py-3 rounded-xl font-mono text-[12px] font-bold"
              style={{ border: `1px solid ${border}`, color: dark ? '#64748B' : '#94A3B8' }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: dark ? '#0A0B12' : '#ffffff' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: border }}>
        <div className="flex items-center gap-3">
          <Swords size={18} style={{ color: '#F59E0B' }} />
          <span className="font-mono font-bold text-[13px]" style={{ color: dark ? '#E2E8F0' : '#0F172A' }}>Mock Interview</span>
          <span className="font-mono text-[11px] font-bold" style={{ color: dark ? '#64748B' : '#94A3B8' }}>
            Q{qIdx + 1}/{questions.length} · {score.got} correct
          </span>
        </div>
        {/* Countdown ring */}
        <div className="flex items-center gap-3">
          <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'scale(0.85)' }}>
            <circle cx="45" cy="45" r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'} strokeWidth="6" />
            <circle cx="45" cy="45" r={r} fill="none" stroke={timerColor} strokeWidth="6"
              strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round" transform="rotate(-90 45 45)"
              style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s' }} />
            <text x="45" y="49" textAnchor="middle"
              style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'monospace', fill: timerColor }}>
              {timeUp ? '⏰' : `${mm}:${ss}`}
            </text>
          </svg>
          <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); onClose(); }}
            className="p-2 rounded-lg" style={{ border: `1px solid ${border}` }}>
            <X size={16} style={{ color: dark ? '#64748B' : '#94A3B8' }} />
          </button>
        </div>
      </div>

      {/* Time up or finished */}
      {(timeUp || qIdx >= questions.length) ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Trophy size={48} style={{ color: '#F59E0B', margin: '0 auto 16px' }} />
            <h2 className="font-mono font-extrabold text-[24px] mb-2" style={{ color: dark ? '#F1F5F9' : '#0F172A' }}>
              {timeUp ? 'Time\'s Up!' : 'Interview Complete!'}
            </h2>
            <p className="font-mono text-[15px] mb-8" style={{ color: dark ? '#94A3B8' : '#64748B' }}>
              Score: {score.got} / {answered} ({answered > 0 ? Math.round(score.got / answered * 100) : 0}%)
            </p>
            <button onClick={() => { onComplete(score.got, answered, Math.floor((Date.now() - startTime) / 1000)); }}
              className="px-8 py-3 rounded-xl font-mono text-[13px] font-bold"
              style={{ background: 'linear-gradient(135deg, #22D3EE, #0EA5E9)', color: '#000' }}>
              See Results
            </button>
          </div>
        </div>
      ) : item && t ? (
        <div className="flex-1 overflow-y-auto flex items-start justify-center py-8 px-4">
          <div className="w-full max-w-2xl">
            {/* Question */}
            <div className="rounded-2xl p-8 mb-6" style={{
              border: `2px solid ${t.color}40`,
              background: dark ? 'rgba(15,17,26,0.9)' : '#ffffff',
              boxShadow: `0 0 60px ${t.color}12`,
            }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold"
                  style={{ background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}40` }}>{t.label}</span>
                <span className="px-2 py-1 rounded-lg font-mono text-[10px] font-bold"
                  style={{ background: `${LEVEL_COLOR[item.level]}15`, color: LEVEL_COLOR[item.level] }}>{item.level}</span>
              </div>
              <h2 className="text-[20px] font-extrabold leading-snug mb-6" style={{ color: dark ? '#F1F5F9' : '#0F172A' }}>
                {item.q}
              </h2>
              {revealed ? (
                <div style={{ borderLeft: `3px solid ${t.color}60`, paddingLeft: '1rem' }}>
                  {renderAnswer(item.a, dark)}
                </div>
              ) : (
                <button onClick={() => setRevealed(true)}
                  className="px-6 py-3 rounded-xl font-mono text-[13px] font-bold transition-all hover:scale-105"
                  style={{ border: `1px solid ${t.color}50`, color: t.color, background: `${t.color}10` }}>
                  Reveal Answer →
                </button>
              )}
            </div>
            {revealed && (
              <div className="flex gap-3 justify-center">
                <button onClick={handleGot}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-[13px] font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.4)' }}>
                  <CheckCircle2 size={16} /> Got It Right
                </button>
                <button onClick={handleMissed}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-[13px] font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(251,113,133,0.12)', color: '#FB7185', border: '1px solid rgba(251,113,133,0.4)' }}>
                  ✗ Needs Review
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ── Stats Dashboard ────────────────────────────────────────────────────────

function StatsDashboard({ done, dark, onClose, xp, totalTimeMs, sr }: {
  done: Set<string>; dark: boolean; onClose: () => void; xp: number; totalTimeMs: number; sr: Record<string, SrMeta>;
}) {
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const dim = dark ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.55)';
  const sections = [
    { title: 'VLSI Design Flow', color: '#F97316', topics: IV_TOPICS.filter(t => t.section === 'VLSI Design Flow') },
    { title: 'Embedded Systems', color: '#14B8A6', topics: IV_TOPICS.filter(t => t.section === 'Embedded Systems') },
    { title: 'Digital Fundamentals', color: '#22D3EE', topics: IV_TOPICS.filter(t => t.section === 'Digital Fundamentals') },
    { title: 'Career & Tools', color: '#10B981', topics: IV_TOPICS.filter(t => t.section === 'Career & Tools') },
  ];
  const diffBreak = LEVELS.map(l => {
    const total = IV_QUESTIONS.filter(q => q.level === l).length;
    const doneN = IV_QUESTIONS.filter(q => q.level === l && done.has(q.id)).length;
    return { l, total, done: doneN, pct: total ? Math.round((doneN / total) * 100) : 0 };
  });
  const topicStats = IV_TOPICS.map(t => {
    const qs = IV_QUESTIONS.filter(q => q.topic === t.id);
    const doneFrac = qs.length ? qs.filter(q => done.has(q.id)).length / qs.length : 0;
    return { ...t, doneFrac, total: qs.length };
  }).sort((a, b) => a.doneFrac - b.doneFrac).slice(0, 5);
  const activityMap: Record<string, number> = loadJson(ACTIVITY_KEY, {});
  const heatDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(Date.now() - (34 - i) * 86400000);
    const s = d.toISOString().slice(0, 10);
    return { s, count: activityMap[s] || 0 };
  });
  const maxAct = Math.max(...heatDays.map(d => d.count), 1);
  const mockHistory: MockAttempt[] = loadJson(MOCK_KEY, []);
  const readinessScore = Math.min(100, Math.round(
    (done.size / IV_QUESTIONS.length) * 40 +
    (xp > 0 ? Math.min(30, xp / 20) : 0) +
    (mockHistory.length > 0 ? Math.min(30, (mockHistory[mockHistory.length - 1].score / mockHistory[mockHistory.length - 1].total) * 30) : 0)
  ));
  const totalHours = Math.floor(totalTimeMs / 3600000);
  const totalMins = Math.floor((totalTimeMs % 3600000) / 60000);

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify({ done: [...done], xp, activityMap, exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `interview_prep_${todayStr()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl custom-scrollbar"
        style={{ background: dark ? 'rgba(15,17,26,0.97)' : '#ffffff', border: `1px solid ${border}` }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: border }}>
          <span className="font-mono font-bold text-[14px]" style={{ color: dark ? '#E2E8F0' : '#0F172A' }}>📊 Stats Dashboard</span>
          <button onClick={onClose}><X size={18} style={{ color: dark ? '#94A3B8' : '#64748B' }} /></button>
        </div>
        <div className="p-5 space-y-6">
          {/* Readiness score + time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl text-center" style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${border}` }}>
              <p className="font-mono text-[28px] font-extrabold" style={{ color: readinessScore > 70 ? '#34D399' : readinessScore > 40 ? '#F59E0B' : '#FB7185' }}>{readinessScore}</p>
              <p className="font-mono text-[10px]" style={{ color: dim }}>Interview Readiness</p>
            </div>
            <div className="p-4 rounded-xl text-center" style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${border}` }}>
              <p className="font-mono text-[24px] font-extrabold" style={{ color: '#22D3EE' }}>{totalHours}h {totalMins}m</p>
              <p className="font-mono text-[10px]" style={{ color: dim }}>Time Invested</p>
            </div>
          </div>

          {/* Section rings */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider mb-3 font-bold" style={{ color: dim }}>Section Completion</p>
            <div className="grid grid-cols-2 gap-3">
              {sections.map(s => {
                const qs = IV_QUESTIONS.filter(q => s.topics.some(t => t.id === q.topic));
                const d = qs.filter(q => done.has(q.id)).length;
                const pct = qs.length ? Math.round((d / qs.length) * 100) : 0;
                const r2 = 30; const circ = 2 * Math.PI * r2;
                return (
                  <div key={s.title} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${border}` }}>
                    <svg width="44" height="44" viewBox="0 0 44 44">
                      <circle cx={22} cy={22} r={r2} fill="none" stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} strokeWidth="5" />
                      <circle cx={22} cy={22} r={r2} fill="none" stroke={s.color} strokeWidth="5"
                        strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round" transform="rotate(-90 22 22)" />
                      <text x="22" y="26" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 700, fontFamily: 'monospace', fill: s.color }}>{pct}%</text>
                    </svg>
                    <div>
                      <p className="font-bold text-[11px]" style={{ color: dark ? '#E2E8F0' : '#0F172A' }}>{s.title}</p>
                      <p className="font-mono text-[10px]" style={{ color: dim }}>{d}/{qs.length}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty bars */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider mb-3 font-bold" style={{ color: dim }}>Difficulty Breakdown</p>
            <div className="space-y-2">
              {diffBreak.map(({ l, total, done: d, pct }) => (
                <div key={l} className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-bold w-20 flex-shrink-0" style={{ color: LEVEL_COLOR[l] }}>{l}</span>
                  <div className="flex-1 rounded-full overflow-hidden h-2" style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: LEVEL_COLOR[l] }} />
                  </div>
                  <span className="font-mono text-[10px] w-10 text-right" style={{ color: dim }}>{d}/{total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity heatmap */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider mb-3 font-bold" style={{ color: dim }}>Last 35 Days Activity</p>
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {heatDays.map(({ s, count }) => (
                <div key={s} title={`${s}: ${count}`} className="rounded-sm aspect-square"
                  style={{ background: count === 0 ? (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)') : `rgba(34,211,238,${0.15 + 0.85 * (count / maxAct)})` }} />
              ))}
            </div>
          </div>

          {/* Weak topics */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider mb-3 font-bold" style={{ color: dim }}>Weakest Topics</p>
            {topicStats.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-1">
                <span className="font-mono text-[11px] font-bold flex-1 truncate" style={{ color: t.color }}>{t.label}</span>
                <span className="font-mono text-[10px] font-bold" style={{ color: dim }}>{Math.round(t.doneFrac * 100)}%</span>
              </div>
            ))}
          </div>

          {/* 7-Day Spaced Repetition Retention Forecast */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] uppercase tracking-wider font-bold" style={{ color: dim }}>7-Day Review Schedule</p>
              <span className="font-mono text-[10px] font-bold text-cyan-400">SM-2 Spaced Repetition</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 p-3 rounded-xl" style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${border}` }}>
              {(() => {
                const days = ['Today', '+1d', '+2d', '+3d', '+4d', '+5d', '+6d'];
                const now = Date.now();
                const forecast = days.map((label, offset) => {
                  const dStart = now + offset * 86400000;
                  const dEnd = dStart + 86400000;
                  const count = IV_QUESTIONS.filter(q => {
                    const m = sr[q.id];
                    if (offset === 0) return !m || m.nextDue <= now;
                    return m && m.nextDue > dStart && m.nextDue <= dEnd;
                  }).length;
                  return { label, count };
                });
                const maxCount = Math.max(...forecast.map(f => f.count), 1);
                return forecast.map(f => (
                  <div key={f.label} className="flex flex-col items-center gap-1.5">
                    <div className="w-full rounded-t-md relative flex items-end justify-center" style={{ height: '48px', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                      <div className="w-full rounded-t-md transition-all duration-500"
                        style={{
                          height: `${Math.max((f.count / maxCount) * 100, f.count > 0 ? 15 : 0)}%`,
                          background: f.label === 'Today' ? '#FB7185' : f.count > 10 ? '#F59E0B' : '#22D3EE',
                        }} />
                      <span className="absolute top-1 text-[9px] font-mono font-bold" style={{ color: dark ? '#fff' : '#000' }}>{f.count}</span>
                    </div>
                    <span className="font-mono text-[9px] font-bold" style={{ color: f.label === 'Today' ? '#FB7185' : dim }}>{f.label}</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Mock history */}
          {mockHistory.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider mb-3 font-bold" style={{ color: dim }}>Mock Interview History</p>
              {mockHistory.slice(-5).reverse().map((a, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: border }}>
                  <span className="font-mono text-[11px]" style={{ color: dim }}>{a.date}</span>
                  <span className="font-mono text-[11px] font-bold" style={{ color: a.score / a.total >= 0.7 ? '#34D399' : '#F59E0B' }}>
                    {a.score}/{a.total} · {Math.round(a.durationSec / 60)}m
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Export / Import */}
          <div className="flex gap-2">
            <button onClick={exportProgress} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-mono text-[12px] font-bold"
              style={{ border: `1px solid ${border}`, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: dim }}>
              <Download size={14} /> Export
            </button>
            <label className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-mono text-[12px] font-bold cursor-pointer"
              style={{ border: `1px solid ${border}`, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: dim }}>
              <Upload size={14} /> Import
              <input type="file" accept=".json" className="hidden" onChange={e => {
                const file = e.target.files?.[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                  try {
                    const data = JSON.parse(ev.target?.result as string);
                    if (data.done) { saveJson(PROGRESS_KEY, data.done); window.location.reload(); }
                  } catch { alert('Invalid progress file.'); }
                };
                reader.readAsText(file);
              }} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Bulletproof 2-Column Print Engine ──────────────────────────────────────

function printCheatSheet(questions: typeof IV_QUESTIONS, title: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const cardsHtml = questions.map((q, i) => {
    const t = IV_TOPICS.find(x => x.id === q.topic);
    const cleanA = q.a.split('\n').map(line => {
      const s = line.trim();
      if (s.startsWith('§F:')) return `<div style="background:#fef3c7;border-left:3px solid #d97706;padding:5px 8px;margin:5px 0;font-family:monospace;font-size:10.5px;color:#92400e;border-radius:3px;"><b>Formula:</b> ${renderKatexMath(s.slice(3).trim(), true)}</div>`;
      if (s.startsWith('§C:')) return `<div style="background:#ecfdf5;border-left:3px solid #059669;padding:5px 8px;margin:5px 0;font-family:monospace;font-size:10.5px;color:#065f46;border-radius:3px;"><b>Circuit:</b> ${s.slice(3)}</div>`;
      if (s.startsWith('§R:')) return `<div style="background:#eff6ff;border-left:3px solid #2563eb;padding:5px 8px;margin:5px 0;font-family:monospace;font-size:10.5px;color:#1e40af;border-radius:3px;"><b>Key Result:</b> ${s.slice(3)}</div>`;

      const parts = s.split(/(\$[^\$]+\$|`[^`]+`)/g);
      const rendered = parts.map(p => {
        if (p.startsWith('$') && p.endsWith('$')) return `<span style="color:#0284c7;font-weight:600;">${renderKatexMath(p.slice(1, -1))}</span>`;
        if (p.startsWith('`') && p.endsWith('`')) return `<code style="background:#f1f5f9;padding:1px 4px;border-radius:3px;font-family:monospace;font-size:10.5px;color:#0f172a;border:1px solid #cbd5e1;">${p.slice(1, -1)}</code>`;
        return p;
      }).join('');
      return `<div style="margin:3px 0;line-height:1.4;">${rendered}</div>`;
    }).join('');

    return `
      <div class="q-card" style="break-inside:avoid;page-break-inside:avoid;border:1px solid #cbd5e1;border-radius:7px;padding:9px 11px;margin-bottom:9px;background:#ffffff;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-family:monospace;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;">
          <span style="background:#e2e8f0;color:#0f172a;padding:2px 5px;border-radius:3px;">Q${i + 1}</span>
          <span style="color:${t?.color || '#0284c7'};">${t?.label || ''}</span>
          <span>•</span>
          <span>${q.level}</span>
        </div>
        <div style="font-weight:700;font-size:12.5px;color:#0f172a;margin-bottom:5px;line-height:1.3;">${q.q}</div>
        <div style="font-size:11px;color:#334155;border-left:2px solid #94a3b8;padding-left:7px;">
          ${cleanA}
        </div>
      </div>
    `;
  }).join('');

  const docHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - BitForBytes</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
        <style>
          @page { size: A4 portrait; margin: 8mm; }
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background: #ffffff; color: #0f172a; font-size: 11px; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 18px; font-weight: 800; margin: 0; color: #0f172a; }
          .subtitle { font-size: 10px; color: #64748b; font-family: monospace; margin-top: 2px; }
          .badge { font-family: monospace; font-size: 10px; font-weight: 700; background: #0f172a; color: #ffffff; padding: 3px 8px; border-radius: 4px; }
          .columns { column-count: 2; column-gap: 10px; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${title}</h1>
            <div class="subtitle">BitForBytes VLSI & Embedded Revision Kit • ${questions.length} Essential Questions • ${todayStr()}</div>
          </div>
          <div class="badge">bitforbytes.in</div>
        </div>
        <div class="columns">
          ${cardsHtml}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(docHtml);
  printWindow.document.close();
}

// ── Printable Cheat Sheet Modal Component ──────────────────────────────────

function PrintableCheatSheet({
  questions, dark, onClose, title = 'VLSI & Embedded Hardware Interview Cheat Sheet',
}: {
  questions: typeof IV_QUESTIONS; dark: boolean; onClose: () => void; title?: string;
}) {
  const [sheetDark, setSheetDark] = useState(dark);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        printCheatSheet(questions, title);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, questions, title]);

  return (
    <div className="printable-sheet-overlay fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md">
      {/* Top action bar */}
      <div className="no-print flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-slate-950 text-white z-10 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Printer size={18} className="text-cyan-400" />
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs md:text-sm">Printable Cheat Sheet</span>
            <span className="font-mono text-[11px] text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/30">
              {questions.length} Qs
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Segmented Mode Selector */}
          <div className="flex items-center p-0.5 rounded-lg border border-white/15 bg-white/5 text-xs font-mono font-bold">
            <button onClick={() => setSheetDark(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${!sheetDark ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'}`}>
              <Sun size={12} className={!sheetDark ? 'text-amber-500' : ''} /> Light
            </button>
            <button onClick={() => setSheetDark(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${sheetDark ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs' : 'text-slate-400 hover:text-white'}`}>
              <Moon size={12} className={sheetDark ? 'text-cyan-300' : ''} /> Dark
            </button>
          </div>

          <button onClick={() => printCheatSheet(questions, title)}
            title="Print or Save as PDF (Ctrl+P)"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-400 text-black font-mono text-xs font-bold shadow-lg hover:bg-cyan-300 active:scale-95 transition-all">
            <Printer size={14} /> Print / PDF
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Sheet view */}
      <div className={`printable-sheet-content flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar transition-colors ${
        sheetDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className={`border-b pb-4 mb-6 ${sheetDark ? 'border-slate-800' : 'border-slate-300'}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">{title}</h1>
              <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded ${
                sheetDark ? 'bg-slate-800 text-cyan-400' : 'bg-slate-100 text-slate-700'
              }`}>
                BitForBytes Revision Kit
              </span>
            </div>
            <p className={`text-xs font-mono mt-1.5 ${sheetDark ? 'text-slate-400' : 'text-slate-600'}`}>
              High-Density 2-Column Revision Sheet • {questions.length} Questions • Full LaTeX & Formula Blocks • {todayStr()}
            </p>
          </div>

          <div className="printable-grid grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {questions.map((q, i) => {
              const t = IV_TOPICS.find(x => x.id === q.topic);
              return (
                <div key={q.id} className={`printable-card p-4 rounded-xl border transition-all ${
                  sheetDark
                    ? 'bg-slate-800/60 border-slate-700/80 shadow-xs'
                    : 'bg-slate-50/70 border-slate-300 shadow-xs'
                }`}>
                  <div className="flex items-center gap-2 mb-2 font-mono text-[10px] font-bold">
                    <span className={`px-1.5 py-0.5 rounded ${
                      sheetDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-800'
                    }`}>
                      Q{i + 1}
                    </span>
                    <span style={{ color: t?.color }}>{t?.label}</span>
                    <span className={sheetDark ? 'text-slate-500' : 'text-slate-400'}>•</span>
                    <span className={sheetDark ? 'text-slate-400' : 'text-slate-600'}>{q.level}</span>
                  </div>
                  <h3 className="font-bold text-[13.5px] mb-2 leading-snug">{q.q}</h3>
                  <div className={`text-[12px] leading-relaxed border-l-2 pl-3 ${
                    sheetDark
                      ? 'text-slate-300 border-slate-600'
                      : 'text-slate-800 border-slate-400'
                  }`}>
                    {renderAnswer(q.a, sheetDark)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Session Summary ────────────────────────────────────────────────────────

function SessionSummary({ got, missed, xpEarned, onClose, onStudyAgain, dark }: {
  got: number; missed: number; xpEarned: number; onClose: () => void; onStudyAgain: () => void; dark: boolean;
}) {
  const total = got + missed;
  const pct = total > 0 ? Math.round((got / total) * 100) : 0;
  const r = 50; const circ = 2 * Math.PI * r;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl text-center p-8"
        style={{ background: dark ? 'rgba(15,17,26,0.98)' : '#ffffff', border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
        <Trophy size={28} style={{ color: '#F59E0B', margin: '0 auto 12px' }} />
        <h2 className="font-mono font-extrabold text-[20px] mb-1" style={{ color: dark ? '#F1F5F9' : '#0F172A' }}>Session Complete!</h2>
        <p className="font-mono text-[12px] mb-6" style={{ color: dark ? '#94A3B8' : '#64748B' }}>{total} questions reviewed</p>
        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-4">
          <circle cx="60" cy="60" r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'} strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none"
            stroke={pct >= 70 ? '#34D399' : pct >= 40 ? '#F59E0B' : '#FB7185'}
            strokeWidth="10" strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
          <text x="60" y="55" textAnchor="middle" style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'monospace', fill: dark ? '#F1F5F9' : '#0F172A' }}>{pct}%</text>
          <text x="60" y="73" textAnchor="middle" style={{ fontSize: '10px', fontFamily: 'monospace', fill: dark ? '#94A3B8' : '#64748B' }}>accuracy</text>
        </svg>
        <div className="flex justify-center gap-8 mb-6">
          <div><p className="font-mono font-extrabold text-[22px]" style={{ color: '#34D399' }}>{got}</p><p className="font-mono text-[11px]" style={{ color: dark ? '#94A3B8' : '#64748B' }}>Got it</p></div>
          <div><p className="font-mono font-extrabold text-[22px]" style={{ color: '#FB7185' }}>{missed}</p><p className="font-mono text-[11px]" style={{ color: dark ? '#94A3B8' : '#64748B' }}>Needs Review</p></div>
        </div>
        <div className="mb-6 py-3 px-4 rounded-xl font-mono font-bold text-[14px]"
          style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
          <Zap size={14} className="inline mr-1" />+{xpEarned} XP earned
        </div>
        <div className="flex gap-3">
          <button onClick={onStudyAgain} className="flex-1 py-2.5 rounded-xl font-mono text-[13px] font-bold" style={{ background: '#22D3EE', color: '#000' }}>
            <RotateCcw size={13} className="inline mr-1" />Study Again
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-mono text-[13px] font-bold"
            style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, color: dark ? '#94A3B8' : '#64748B' }}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ── Mobile Bottom Sheet ───────────────────────────────────────────────────

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  topic: IvTopic | null;
  setTopic: (t: IvTopic | null) => void;
  done: Set<string>;
  dark: boolean;
  onOpenStats: () => void;
  onOpenMock: () => void;
  onToggleFlashcard: () => void;
  onJumpDaily: () => void;
  onJumpRandom: () => void;
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (v: boolean | ((prev: boolean) => boolean)) => void;
  bookmarksCount: number;
  companyTrack: string | null;
  setCompanyTrack: (c: string | null) => void;
  onOpenCheatSheet: () => void;
}

function MobileSheet({
  open, onClose, topic, setTopic, done, dark,
  onOpenStats, onOpenMock, onToggleFlashcard, onJumpDaily, onJumpRandom,
  showBookmarksOnly, setShowBookmarksOnly, bookmarksCount,
  companyTrack, setCompanyTrack, onOpenCheatSheet,
}: MobileSheetProps) {
  const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const sections = [
    { title: 'VLSI Design Flow', topics: IV_TOPICS.filter(t => t.section === 'VLSI Design Flow') },
    { title: 'Embedded Systems', topics: IV_TOPICS.filter(t => t.section === 'Embedded Systems') },
    { title: 'Digital Fundamentals', topics: IV_TOPICS.filter(t => t.section === 'Digital Fundamentals') },
    { title: 'Career & Tools', topics: IV_TOPICS.filter(t => t.section === 'Career & Tools') },
  ];
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />}
      <div className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 md:hidden touch-manipulation"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          background: dark ? 'rgba(15,17,26,0.98)' : '#ffffff',
          borderTop: `1px solid ${border}`,
          borderRadius: '24px 24px 0 0',
          maxHeight: '84vh',
          overflowY: 'auto',
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 16px))',
          WebkitOverflowScrolling: 'touch',
        }}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full opacity-30" style={{ background: dark ? '#fff' : '#000' }} />
        </div>

        <div className="flex items-center justify-between px-5 py-2 border-b" style={{ borderColor: border }}>
          <span className="font-mono font-bold text-[14px]" style={{ color: dark ? '#E2E8F0' : '#0F172A' }}>⚡ Study Menu & Tracks</span>
          <button onClick={onClose} className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg" style={{ color: dark ? '#94A3B8' : '#64748B' }}><X size={18} /></button>
        </div>

        {/* Quick Action Grid for Mobile */}
        <div className="p-4 grid grid-cols-2 gap-2 border-b" style={{ borderColor: border }}>
          <button onClick={() => { onOpenMock(); onClose(); }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-[12px] font-bold min-h-[44px] active:scale-95 transition-all text-left"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
            <Swords size={16} /> Mock Interview
          </button>
          <button onClick={() => { onToggleFlashcard(); onClose(); }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-[12px] font-bold min-h-[44px] active:scale-95 transition-all text-left"
            style={{ background: 'rgba(34,211,238,0.12)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.3)' }}>
            <CreditCard size={16} /> 3D Flashcards
          </button>
          <button onClick={() => { onOpenStats(); onClose(); }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-[12px] font-bold min-h-[44px] active:scale-95 transition-all text-left"
            style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: dark ? '#E2E8F0' : '#0F172A', border: `1px solid ${border}` }}>
            <BarChart2 size={16} className="text-cyan-400" /> Stats Dashboard
          </button>
          <button onClick={() => { onOpenCheatSheet(); onClose(); }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-[12px] font-bold min-h-[44px] active:scale-95 transition-all text-left"
            style={{ background: 'rgba(52,211,153,0.12)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }}>
            <Printer size={16} /> Print Cheat Sheet
          </button>
          <button onClick={() => { onJumpDaily(); onClose(); }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-[12px] font-bold min-h-[44px] active:scale-95 transition-all text-left"
            style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Star size={16} /> Daily Challenge
          </button>
          <button onClick={() => { setShowBookmarksOnly(b => !b); onClose(); }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-[12px] font-bold min-h-[44px] active:scale-95 transition-all text-left"
            style={{ background: showBookmarksOnly ? 'rgba(245,158,11,0.18)' : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'), color: showBookmarksOnly ? '#F59E0B' : (dark ? '#94A3B8' : '#64748B'), border: `1px solid ${border}` }}>
            <Bookmark size={16} /> Saved ({bookmarksCount})
          </button>
        </div>

        {/* Company Sprints on Mobile */}
        <div className="p-4 border-b" style={{ borderColor: border }}>
          <p className="font-mono text-[10px] uppercase tracking-widest font-bold mb-2.5" style={{ color: dark ? '#F59E0B' : '#D97706' }}>🎯 Target Company Tracks</p>
          <div className="flex flex-wrap gap-2">
            {COMPANY_TRACKS.map(c => {
              const active = companyTrack === c.id;
              return (
                <button key={c.id} onClick={() => { setCompanyTrack(active ? null : c.id); setTopic(null); setShowBookmarksOnly(false); onClose(); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-[11px] font-bold min-h-[38px] active:scale-95 transition-transform"
                  style={{
                    background: active ? `${c.color}25` : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                    color: active ? c.color : (dark ? '#E2E8F0' : '#0F172A'),
                    border: `1px solid ${active ? c.color : border}`,
                  }}>
                  <span>{c.emoji}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          <button onClick={() => { setTopic(null); setCompanyTrack(null); setShowBookmarksOnly(false); onClose(); }} className="w-full py-3 rounded-xl font-mono text-[12px] font-bold min-h-[44px] active:scale-95 transition-transform"
            style={{ background: !topic && !companyTrack && !showBookmarksOnly ? 'rgba(34,211,238,0.15)' : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'), color: !topic && !companyTrack && !showBookmarksOnly ? '#22D3EE' : (dark ? '#94A3B8' : '#64748B'), border: `1px solid ${!topic && !companyTrack && !showBookmarksOnly ? 'rgba(34,211,238,0.3)' : border}` }}>
            All Questions ({IV_QUESTIONS.length})
          </button>
          {sections.map(s => (
            <div key={s.title}>
              <p className="font-mono text-[10px] uppercase tracking-widest font-bold mb-2.5" style={{ color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)' }}>{s.title}</p>
              <div className="flex flex-wrap gap-2">
                {s.topics.map(t => {
                  const count = IV_QUESTIONS.filter(q => q.topic === t.id).length;
                  const active = topic === t.id && !companyTrack;
                  return (
                    <button key={t.id} onClick={() => { setTopic(active ? null : t.id); setCompanyTrack(null); setShowBookmarksOnly(false); onClose(); }}
                      className="px-3.5 py-2 rounded-xl font-mono text-[11px] font-bold min-h-[38px] active:scale-95 transition-transform"
                      style={{ background: active ? `${t.color}22` : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'), color: active ? t.color : (dark ? '#94A3B8' : '#64748B'), border: `1px solid ${active ? `${t.color}60` : border}` }}>
                      {t.label} · {count}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Shortcut HUD ──────────────────────────────────────────────────────────

function ShortcutHUD({ dark, onClose }: { dark: boolean; onClose: () => void }) {
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const shortcuts = [['J / ↓', 'Next Q'], ['K / ↑', 'Prev Q'], ['Space', 'Expand/Flip'], ['D', 'Mark done'], ['B', 'Bookmark'], ['F', 'Focus Mode'], ['R', 'Random Q'], ['?', 'Shortcuts']];
  return (
    <div className="fixed bottom-20 right-4 z-40 rounded-2xl shadow-2xl p-4 w-52" style={{ background: dark ? 'rgba(15,17,26,0.97)' : '#ffffff', border: `1px solid ${border}`, backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono font-bold text-[11px]" style={{ color: dark ? '#94A3B8' : '#64748B' }}><Keyboard size={11} className="inline mr-1" />Shortcuts</span>
        <button onClick={onClose}><X size={12} style={{ color: dark ? '#64748B' : '#94A3B8' }} /></button>
      </div>
      {shortcuts.map(([key, desc]) => (
        <div key={key} className="flex items-center justify-between py-0.5">
          <code className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', color: dark ? '#7DD3FC' : '#0284C7' }}>{key}</code>
          <span className="font-mono text-[10px]" style={{ color: dark ? '#64748B' : '#94A3B8' }}>{desc}</span>
        </div>
      ))}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────

interface SidebarProps {
  topic: IvTopic | null; setTopic: (t: IvTopic | null) => void;
  done: Set<string>; bookmarks: Set<string>; dark: boolean;
  width: number; setWidth: (w: number) => void;
  xp: number; streak: StreakData;
  showStats: boolean; setShowStats: (v: boolean) => void;
  quizDueOnly: boolean; setQuizDueOnly: (v: boolean) => void;
  sr: Record<string, SrMeta>;
  showBookmarksOnly: boolean; setShowBookmarksOnly: (v: boolean) => void;
  dailyId: string;
  companyTrack: string | null;
  setCompanyTrack: (c: string | null) => void;
  onOpenCheatSheet: () => void;
  activeTrackedTopic?: IvTopic | null;
}

function IvSidebar({
  topic, setTopic, done, bookmarks, dark, width, setWidth,
  xp, streak, showStats, setShowStats, quizDueOnly, setQuizDueOnly,
  sr, showBookmarksOnly, setShowBookmarksOnly, dailyId,
  companyTrack, setCompanyTrack, onOpenCheatSheet, activeTrackedTopic,
}: SidebarProps) {
  const total = IV_QUESTIONS.length;
  const doneCount = done.size;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const dueCount = IV_QUESTIONS.filter(q => { const m = sr[q.id]; return !m || m.nextDue <= Date.now(); }).length;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    'Company Tracks': false, 'VLSI Design Flow': false, 'Embedded Systems': false, 'Digital Fundamentals': false, 'Career & Tools': false,
  });
  const toggleSection = (s: string) => setCollapsed(p => ({ ...p, [s]: !p[s] }));
  const vlsiTopics = IV_TOPICS.filter(t => t.section === 'VLSI Design Flow');
  const embeddedTopics = IV_TOPICS.filter(t => t.section === 'Embedded Systems');
  const digitalTopics = IV_TOPICS.filter(t => t.section === 'Digital Fundamentals');
  const careerTopics = IV_TOPICS.filter(t => t.section === 'Career & Tools');
  const dim = dark ? 'rgba(255,255,255,0.5)' : '#475569';
  const border = dark ? 'rgba(255,255,255,0.07)' : '#E2E8F0';

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMove = (ev: MouseEvent) => setWidth(Math.min(Math.max(ev.clientX, 180), 420));
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  };

  const sectionPct = (topics: IvTopicMeta[]) => {
    const qs = IV_QUESTIONS.filter(q => topics.some(t => t.id === q.topic));
    return !qs.length ? 0 : Math.round((qs.filter(q => done.has(q.id)).length / qs.length) * 100);
  };

  const { rank, nextRank } = getRank(xp);
  const xpInLevel = nextRank ? xp - rank.xp : xp;
  const xpForLevel = nextRank ? nextRank.xp - rank.xp : 1;
  const xpPct = Math.min(xpInLevel / xpForLevel, 1);

  // Auto-scroll the sidebar to keep the tracked active topic in view as the user scrolls questions
  useEffect(() => {
    if (!activeTrackedTopic || topic) return;
    const trackedMeta = IV_TOPICS.find(t => t.id === activeTrackedTopic);
    if (trackedMeta?.section) {
      setCollapsed(p => (p[trackedMeta.section] ? { ...p, [trackedMeta.section]: false } : p));
    }
    const el = document.getElementById(`sidebar-topic-${activeTrackedTopic}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeTrackedTopic, topic]);

  const navItem = (id: string | undefined, label: string, count: number, active: boolean, isTracked: boolean, color: string, doneFrac: number, onClick: () => void, extra?: React.ReactNode) => (
    <button id={id} key={label} onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-left transition-all relative overflow-hidden"
      style={{
        borderLeft: active ? `3px solid ${color}` : isTracked ? `3px solid ${color}` : '3px solid transparent',
        background: active ? `${color}20` : isTracked ? `${color}12` : 'transparent',
        color: (active || isTracked) ? (dark ? '#FFFFFF' : '#0F172A') : dim,
        fontSize: '12.5px',
        fontWeight: (active || isTracked) ? 700 : 500,
        fontFamily: 'inherit',
        boxShadow: isTracked && !active ? `inset 0 0 14px ${color}15` : 'none',
      }}>
      {doneFrac > 0 && <span className="absolute bottom-0 left-3 h-[2px] rounded-full" style={{ width: `${doneFrac * 100}%`, maxWidth: 'calc(100% - 48px)', background: color, opacity: 0.4 }} />}
      <span className="truncate flex items-center gap-1.5">
        {isTracked && !active && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: color }} />}
        {label}{extra}
      </span>
      <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded opacity-80" style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>{count}</span>
    </button>
  );

  const renderSectionHeader = (title: string, topics?: IvTopicMeta[], badgeColor?: string) => {
    const isClosed = collapsed[title];
    const spct = topics ? sectionPct(topics) : 0;
    const color = badgeColor || topics?.[0]?.color || '#22D3EE';
    return (
      <button onClick={() => toggleSection(title)} className="w-full flex items-center justify-between py-1.5 px-1 transition-colors select-none">
        <span className="font-mono tracking-[0.13em] uppercase font-bold text-[10px] flex items-center gap-1.5" style={{ color: dim }}>
          <ChevronDown size={12} className={`transition-transform duration-200 ${isClosed ? '-rotate-90' : ''}`} />{title}
        </span>
        {topics ? <SectionArc pct={spct} color={color} size={22} /> : null}
      </button>
    );
  };

  return (
    <aside className="hidden md:flex flex-col h-full border-r relative flex-shrink-0 select-none overflow-hidden"
      style={{ width: `${width}px`, borderColor: border, background: dark ? 'rgba(10,11,18,0.7)' : '#FFFFFF', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div onMouseDown={startResizing} className="absolute top-0 right-0 w-1 h-full cursor-col-resize z-20 hover:bg-cyan-400/40" />
      <div className="p-3.5 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
        {/* Top actions */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <button onClick={() => setShowStats(!showStats)}
            title="Stats Dashboard — view completion, readiness score, and 7-day forecast"
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-md font-mono text-[11px] font-bold transition-all"
            style={{ background: showStats ? 'rgba(34,211,238,0.15)' : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'), color: showStats ? '#22D3EE' : dim, border: `1px solid ${showStats ? 'rgba(34,211,238,0.3)' : border}` }}>
            <BarChart2 size={13} /> Stats
          </button>
          <button onClick={onOpenCheatSheet}
            title="Printable Cheat Sheet — export 2-column revision sheet to PDF or printer"
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-md font-mono text-[11px] font-bold transition-all"
            style={{ background: dark ? 'rgba(52,211,153,0.08)' : 'rgba(16,185,129,0.08)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)' }}>
            <Printer size={13} /> PDF Sheet
          </button>
        </div>

        {/* All */}
        <div className="mb-1">{navItem('sidebar-topic-all', `All Questions`, total, !topic && !companyTrack && !quizDueOnly && !showBookmarksOnly, false, '#22D3EE', doneCount / Math.max(total, 1), () => { setTopic(null); setCompanyTrack(null); setQuizDueOnly(false); setShowBookmarksOnly(false); })}</div>
        {/* Daily challenge */}
        <div className="mb-1">{navItem('sidebar-topic-daily', '🌟 Daily Challenge', 1, false, false, '#F59E0B', 0, () => { setTopic(null); setCompanyTrack(null); setQuizDueOnly(false); setShowBookmarksOnly(false); const el = document.getElementById(`q-${dailyId}`); el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); })}</div>
        {/* Bookmarks */}
        <div className="mb-1">{navItem('sidebar-topic-bookmarks', 'Bookmarks', bookmarks.size, showBookmarksOnly, false, '#F59E0B', 0, () => { setShowBookmarksOnly(!showBookmarksOnly); setTopic(null); setCompanyTrack(null); setQuizDueOnly(false); })}</div>
        {/* Due today */}
        {dueCount > 0 && <div className="mb-1">{navItem('sidebar-topic-due', 'Due Today', dueCount, quizDueOnly, false, '#FB7185', 0, () => { setTopic(null); setCompanyTrack(null); setQuizDueOnly(!quizDueOnly); setShowBookmarksOnly(false); })}</div>}

        <div className="my-2.5" style={{ borderTop: `1px solid ${border}` }} />

        {/* Target Company Tracks */}
        <div>
          {renderSectionHeader('Target Company Sprints', undefined, '#F59E0B')}
          {!collapsed['Company Tracks'] && (
            <div className="space-y-0.5 mt-1 pl-1">
              {COMPANY_TRACKS.map(c => {
                const count = IV_QUESTIONS.filter(q => c.topics.includes(q.topic)).length;
                const active = companyTrack === c.id;
                return (
                  <button key={c.id} onClick={() => { setCompanyTrack(active ? null : c.id); setTopic(null); setShowBookmarksOnly(false); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-left transition-all relative"
                    style={{ borderLeft: active ? `3px solid ${c.color}` : '3px solid transparent', background: active ? `${c.color}18` : 'transparent', color: active ? (dark ? '#FFFFFF' : '#0F172A') : dim, fontSize: '12.5px', fontWeight: active ? 600 : 500 }}>
                    <span className="truncate flex items-center gap-1.5">
                      <span>{c.emoji}</span>
                      <span>{c.name}</span>
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded opacity-80" style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="my-2.5" style={{ borderTop: `1px solid ${border}` }} />

        {[{ title: 'VLSI Design Flow', topics: vlsiTopics }, { title: 'Embedded Systems', topics: embeddedTopics }, { title: 'Digital Fundamentals', topics: digitalTopics }, { title: 'Career & Tools', topics: careerTopics }].map((s, si) => (
          <React.Fragment key={s.title}>
            <div>
              {renderSectionHeader(s.title, s.topics)}
              {!collapsed[s.title] && (
                <div className="space-y-0.5 mt-1 pl-1">
                  {s.topics.map(t => {
                    const qs = IV_QUESTIONS.filter(q => q.topic === t.id);
                    const doneFrac = qs.length ? qs.filter(q => done.has(q.id)).length / qs.length : 0;
                    const isActive = topic === t.id && !companyTrack;
                    const isTracked = activeTrackedTopic === t.id && !topic && !companyTrack;
                    return navItem(
                      `sidebar-topic-${t.id}`,
                      t.label,
                      qs.length,
                      isActive,
                      isTracked,
                      t.color,
                      doneFrac,
                      () => {
                        if (topic === t.id) {
                          setTopic(null);
                        } else if (!topic && !companyTrack && !showBookmarksOnly) {
                          // Scroll smoothly to this topic's first question
                          const firstQ = IV_QUESTIONS.find(q => q.topic === t.id);
                          if (firstQ) {
                            const el = document.getElementById(`q-${firstQ.id}`);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              return;
                            }
                          }
                          setTopic(t.id);
                        } else {
                          setTopic(t.id);
                        }
                        setCompanyTrack(null);
                      }
                    );
                  })}
                </div>
              )}
            </div>
            {si < 3 && <div className="my-2.5" style={{ borderTop: `1px solid ${border}` }} />}
          </React.Fragment>
        ))}

        <div className="my-3" style={{ borderTop: `1px solid ${border}` }} />

        {/* XP Ring + Streak */}
        <div className="px-2 py-2 space-y-3">
          <div className="flex items-center gap-3">
            <svg width={60} height={60} viewBox="0 0 60 60">
              <circle cx={30} cy={30} r={25} fill="none" stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} strokeWidth="5" />
              <circle cx={30} cy={30} r={25} fill="none" stroke={rank.color === 'rainbow' ? '#F59E0B' : rank.color} strokeWidth="5"
                strokeDasharray={`${xpPct * 2 * Math.PI * 25} ${2 * Math.PI * 25}`} strokeLinecap="round" transform="rotate(-90 30 30)" />
              <text x="30" y="35" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'monospace', fill: dark ? '#FDE68A' : '#92400E' }}>{xp}XP</text>
            </svg>
            <div>
              <RankBadge xp={xp} compact />
              <div className="flex items-center gap-1.5 mt-1">
                <Flame size={12} style={{ color: '#F97316' }} />
                <span className="font-mono text-[12px] font-bold" style={{ color: '#F97316' }}>{streak.count}d</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-mono font-semibold text-[11px]" style={{ color: dim }}>Progress</span>
              <span className="font-mono font-bold text-[12px]" style={{ color: dark ? '#34D399' : '#059669' }}>{doneCount}/{total}</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: '5px', background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #34D399, #10B981)' }} />
            </div>
            <p className="mt-1 font-mono font-semibold text-[10px]" style={{ color: dim }}>{pct}% complete</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function InterviewPrep() {
  const navigate = useNavigate();
  const [scheme, toggleColorScheme] = useColorScheme();
  const dark = scheme === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  const [q, setQ] = useState('');
  const [topic, setTopicRaw] = useState<IvTopic | null>(() => {
    const t = searchParams.get('topic');
    return IV_TOPICS.some(x => x.id === t) ? (t as IvTopic) : null;
  });
  const setTopic = (t: IvTopic | null) => setTopicRaw(t);

  const [activeTrackedTopic, setActiveTrackedTopic] = useState<IvTopic | null>(null);
  const mainScrollRef = useRef<HTMLElement | null>(null);

  // Scrollspy: detect which question/topic is currently at the top of the viewport
  const handleMainScroll = useCallback(() => {
    if (!mainScrollRef.current) return;
    const container = mainScrollRef.current;
    const containerTop = container.getBoundingClientRect().top;
    const articles = container.querySelectorAll<HTMLElement>('article[data-topic]');

    let currentTopic: IvTopic | null = null;
    for (let i = 0; i < articles.length; i++) {
      const rect = articles[i].getBoundingClientRect();
      const relativeTop = rect.top - containerTop;
      // When the card is within the top view band
      if (relativeTop >= -50 && relativeTop <= 260) {
        currentTopic = articles[i].getAttribute('data-topic') as IvTopic;
        break;
      }
    }
    if (currentTopic && currentTopic !== activeTrackedTopic) {
      setActiveTrackedTopic(currentTopic);
    }
  }, [activeTrackedTopic]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (topic) params.topic = topic;
    setSearchParams(params, { replace: true });
  }, [topic]);

  // Deep link: ?q=<id>
  useEffect(() => {
    const qId = searchParams.get('q');
    if (qId) {
      setTimeout(() => {
        const el = document.getElementById(`q-${qId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setOpen(prev => new Set(prev).add(qId));
      }, 400);
    }
  }, []);

  // Core state
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [done, setDone] = useState<Set<string>>(() => loadSet(PROGRESS_KEY));
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => loadSet(BOOKMARK_KEY));
  const [xp, setXp] = useState<number>(() => loadJson<number>(XP_KEY, 0));
  const [streak, setStreak] = useState<StreakData>(loadStreak);
  const [sr, setSr] = useState<Record<string, SrMeta>>(loadSr);
  const [notes, setNotes] = useState<Record<string, string>>(() => loadJson(NOTES_KEY, {}));
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);

  // Time tracking
  const [openTime, setOpenTime] = useState<Record<string, number>>({});
  const [totalTimeMs, setTotalTimeMs] = useState<number>(() => loadJson<number>(TIME_KEY, 0));
  const openTimeRef = useRef<Record<string, number>>({});
  // Track when cards opened
  const cardOpenedAt = useRef<Record<string, number>>({});

  // Quiz mode
  const [quizMode, setQuizMode] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [quizScore, setQuizScore] = useState({ got: 0, missed: 0 });
  const [quizXpEarned, setQuizXpEarned] = useState(0);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [quizDueOnly, setQuizDueOnly] = useState(false);

  // View modes
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'flashcard'>('list');
  const [focusMode, setFocusMode] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(252);
  const [showStats, setShowStats] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [showMockInterview, setShowMockInterview] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [companyTrack, setCompanyTrack] = useState<string | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Audio Speech Synthesis
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const toggleSpeech = useCallback((id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = cleanTextForSpeech(text);
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1.0;
    u.onend = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(u);
  }, [speakingId]);

  // Key Concepts Self-Audit Checklist
  const [activeConceptCard, setActiveConceptCard] = useState<string | null>(null);
  const [checkedConcepts, setCheckedConcepts] = useState<Record<string, Set<string>>>({});
  const toggleConceptCheck = (cardId: string, concept: string) => {
    setCheckedConcepts(prev => {
      const set = new Set(prev[cardId] || []);
      set.has(concept) ? set.delete(concept) : set.add(concept);
      return { ...prev, [cardId]: set };
    });
  };

  // Daily challenge
  const dailyId = useMemo(() => getDailyId(), []);
  const dailyDoneToday = useMemo(() => {
    const d: Record<string, string> = loadJson(DAILY_KEY, {});
    return d[todayStr()] === dailyId;
  }, [dailyId]);

  // Keyboard focus
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [doneAnim, setDoneAnim] = useState<Set<string>>(new Set());
  const [cardFlash, setCardFlash] = useState<{ id: string; type: 'got' | 'missed' } | null>(null);

  // Confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const prevRankIndex = useRef(getRank(xp).index);

  // Undo toast
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'rank'; onUndo?: () => void }[]>([]);
  const addToast = useCallback((toast: Omit<typeof toasts[0], 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { ...toast, id }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), []);

  // Filtered list
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const activeTrack = COMPANY_TRACKS.find(c => c.id === companyTrack);

    return IV_QUESTIONS.filter(item => {
      if (activeTrack) {
        const matchesTopic = activeTrack.topics.includes(item.topic);
        const matchesKeyword = activeTrack.keywords.some(kw => `${item.q} ${item.a}`.toLowerCase().includes(kw));
        if (!matchesTopic && !matchesKeyword) return false;
      }
      if (topic && item.topic !== topic) return false;
      if (quizDueOnly) { const m = sr[item.id]; if (m && m.nextDue > Date.now()) return false; }
      if (showBookmarksOnly && !bookmarks.has(item.id)) return false;
      if (needle && !(`${item.q} ${item.a}`.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [q, topic, companyTrack, quizDueOnly, showBookmarksOnly, bookmarks, sr]);

  const toggle = (id: string) => {
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Track time
        const openedAt = cardOpenedAt.current[id];
        if (openedAt) {
          const elapsed = Date.now() - openedAt;
          setTotalTimeMs(t => { const n = t + elapsed; saveJson(TIME_KEY, n); return n; });
          delete cardOpenedAt.current[id];
        }
      } else {
        next.add(id);
        cardOpenedAt.current[id] = Date.now();
      }
      return next;
    });
  };

  const expandAll = () => {
    const now = Date.now();
    filtered.forEach(f => { if (!cardOpenedAt.current[f.id]) cardOpenedAt.current[f.id] = now; });
    setOpen(new Set(filtered.map(f => f.id)));
  };
  const collapseAll = () => setOpen(new Set());

  // Mark done with undo
  const toggleDone = useCallback((id: string) => {
    setDone(prev => {
      const next = new Set(prev);
      const wasDone = prev.has(id);
      wasDone ? next.delete(id) : next.add(id);
      saveSet(PROGRESS_KEY, next);
      if (!wasDone) {
        const item = IV_QUESTIONS.find(q => q.id === id);
        const gained = item ? LEVEL_XP[item.level] ?? 5 : 5;
        // XP + rank check
        setXp(x => {
          const n = x + gained;
          saveJson(XP_KEY, n);
          const newRankIdx = getRank(n).index;
          if (newRankIdx > prevRankIndex.current) {
            prevRankIndex.current = newRankIdx;
            const r = getRank(n).rank;
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2500);
            addToast({ message: `🎉 Rank Up! ${r.emoji} ${r.title}`, type: 'rank' });
          }
          return n;
        });
        // Daily challenge bonus
        if (id === dailyId && !dailyDoneToday) {
          const d: Record<string, string> = loadJson(DAILY_KEY, {});
          d[todayStr()] = dailyId;
          saveJson(DAILY_KEY, d);
          setXp(x => { const n = x + 50; saveJson(XP_KEY, n); return n; });
          addToast({ message: '🌟 Daily Challenge +50 XP!', type: 'rank' });
        }
        setStreak(s => { const ns = bumpStreak(s); saveJson(STREAK_KEY, ns); return ns; });
        bumpActivity();
        setDoneAnim(a => { const na = new Set(a); na.add(id); return na; });
        setTimeout(() => setDoneAnim(a => { const na = new Set(a); na.delete(id); return na; }), 600);
        // Undo toast
        addToast({ message: '✓ Marked as done', type: 'success', onUndo: () => toggleDone(id) });
      }
      return next;
    });
  }, [dailyId, dailyDoneToday, addToast]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveSet(BOOKMARK_KEY, next);
      return next;
    });
  }, []);

  const toggleQuizMode = () => {
    if (quizMode && (quizScore.got + quizScore.missed) > 0) setShowSessionSummary(true);
    setQuizMode(m => !m);
    setRevealed(new Set());
    setQuizXpEarned(0);
    setQuizScore({ got: 0, missed: 0 });
  };

  const revealAnswer = (id: string) => setRevealed(prev => new Set(prev).add(id));
  const handleGot = (id: string) => {
    const item = IV_QUESTIONS.find(q => q.id === id);
    const gained = item ? LEVEL_XP[item.level] ?? 5 : 5;
    setQuizScore(s => ({ ...s, got: s.got + 1 }));
    setQuizXpEarned(x => x + gained);
    setCardFlash({ id, type: 'got' });
    setTimeout(() => { setCardFlash(null); toggleDone(id); }, 350);
    setSr(prev => { const next = srAfterGot(id, prev); saveSr(next); return next; });
  };
  const handleMissed = (id: string) => {
    setQuizScore(s => ({ ...s, missed: s.missed + 1 }));
    setCardFlash({ id, type: 'missed' });
    setTimeout(() => setCardFlash(null), 350);
    setSr(prev => { const next = srAfterMissed(id, prev); saveSr(next); return next; });
  };

  // Focus mode nav
  const focusNext = useCallback(() => setFocusIdx(i => Math.min(i + 1, filtered.length - 1)), [filtered.length]);
  const focusPrev = useCallback(() => setFocusIdx(i => Math.max(i - 1, 0)), []);

  // Random question
  const jumpRandom = useCallback(() => {
    const unfinished = filtered.filter(f => !done.has(f.id));
    const pool = unfinished.length > 0 ? unfinished : filtered;
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setOpen(prev => new Set(prev).add(pick.id));
    setTimeout(() => document.getElementById(`q-${pick.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  }, [filtered, done]);

  // Share question
  const shareQuestion = useCallback((id: string) => {
    const url = `${window.location.origin}${window.location.pathname}?q=${id}`;
    navigator.clipboard.writeText(url).then(() => addToast({ message: '🔗 Link copied!', type: 'info' }));
  }, [addToast]);

  // Copy answer
  const copyAnswer = useCallback((a: string) => {
    navigator.clipboard.writeText(a).then(() => addToast({ message: '📋 Answer copied', type: 'info' }));
  }, [addToast]);

  // Save note
  const saveNote = useCallback((id: string, text: string) => {
    setNotes(prev => {
      const next = { ...prev, [id]: text };
      if (!text) delete next[id];
      saveJson(NOTES_KEY, next);
      return next;
    });
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?') { setShowShortcuts(s => !s); return; }
      if (e.key === 'r' || e.key === 'R') { jumpRandom(); return; }
      if (focusMode) {
        if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') { e.preventDefault(); focusNext(); }
        if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') { e.preventDefault(); focusPrev(); }
        if (e.key === 'Escape') setFocusMode(false);
        if ((e.key === 'd' || e.key === 'D') && filtered[focusIdx]) toggleDone(filtered[focusIdx].id);
        if ((e.key === 'b' || e.key === 'B') && filtered[focusIdx]) toggleBookmark(filtered[focusIdx].id);
        return;
      }
      if (e.key === 'f' || e.key === 'F') { setFocusMode(m => !m); return; }
      if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === ' ' && focusedIdx >= 0 && filtered[focusedIdx]) { e.preventDefault(); toggle(filtered[focusedIdx].id); }
      if ((e.key === 'd' || e.key === 'D') && focusedIdx >= 0 && filtered[focusedIdx]) toggleDone(filtered[focusedIdx].id);
      if ((e.key === 'b' || e.key === 'B') && focusedIdx >= 0 && filtered[focusedIdx]) toggleBookmark(filtered[focusedIdx].id);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focusMode, focusedIdx, filtered, focusIdx, focusNext, focusPrev, toggleDone, toggleBookmark, jumpRandom]);

  // Style
  const text = dark ? 'text-white' : 'text-slate-900';
  const sub = dark ? 'text-slate-400' : 'text-slate-600';
  const border = dark ? 'rgba(255,255,255,0.07)' : '#E2E8F0';
  const totalQuestions = filtered.length;
  const needle = q.trim().toLowerCase();
  const activeTopicMeta = topic ? IV_TOPICS.find(t => t.id === topic) : null;
  const glowColor = activeTopicMeta?.color ?? '#22D3EE';
  const firstVlsiIdx = filtered.findIndex(q => ['spec-arch','rtl-dv','synth-dft','pd-signoff','sta-timing','analog-physics','fab-silicon'].includes(q.topic));

  return (
    <div className={`h-screen max-h-screen overflow-hidden flex flex-col ${text}`} style={{ background: dark ? '#0A0B12' : '#F8FAFC', position: 'relative' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 60% 50% at 65% 30%, ${glowColor}08 0%, transparent 70%)`, transition: 'background 1.2s ease' }} />

      {/* Confetti */}
      <ConfettiBurst trigger={showConfetti} />

      {/* ── Header ── */}
      <header className="h-14 flex items-center justify-between px-4 md:px-5 border-b flex-shrink-0 z-10 relative"
        style={{ borderColor: border, background: dark ? 'rgba(10,11,18,0.88)' : 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('/portal')}
            title="Back to Course Portal"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-[11px] font-bold transition-all mr-1"
            style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: dark ? '#94A3B8' : '#475569', border: `1px solid ${border}` }}>
            <Home size={13} />
            <span className="hidden sm:inline">Portal</span>
          </button>
          <BookOpen size={18} className="text-sky-400" />
          <span className="font-mono text-[12px] md:text-[13px] tracking-[0.2em] font-bold uppercase text-sky-400">VLSI Prep</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(125,211,252,0.12)', color: '#7DD3FC' }}>{IV_QUESTIONS.length} Qs</span>
          <RankBadge xp={xp} compact />
        </div>
        <div className="flex items-center gap-2">
          {streak.count > 0 && <span className="hidden md:flex items-center gap-1 font-mono text-[12px] font-bold" style={{ color: '#F97316' }}><Flame size={14} />{streak.count}d</span>}
          <span className="hidden md:flex items-center gap-1 font-mono text-[12px] font-bold" style={{ color: '#F59E0B' }}><Zap size={13} />{xp} XP</span>
          {quizMode && (quizScore.got + quizScore.missed) > 0 && <span className="font-mono text-[11px] font-bold text-emerald-400">{quizScore.got}/{quizScore.got + quizScore.missed}</span>}
          {/* View toggle */}
          <div className="hidden md:flex items-center gap-1">
            {(['list', 'grid', 'flashcard'] as const).map(mode => {
              const labels: Record<string, string> = {
                list: 'List View — scrollable card list with full answers (J/K to navigate)',
                grid: 'Grid View — compact 2-column card layout for quick scanning',
                flashcard: '3D Flashcard Mode — click to flip cards, Space to flip, ←/→ to navigate',
              };
              return (
                <button key={mode} onClick={() => setViewMode(mode)}
                  title={labels[mode]}
                  className="px-2 py-1.5 rounded font-mono text-[10px] font-bold transition-all"
                  style={{ background: viewMode === mode ? 'rgba(34,211,238,0.12)' : (dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'), color: viewMode === mode ? '#22D3EE' : (dark ? '#94A3B8' : '#64748B'), border: `1px solid ${viewMode === mode ? 'rgba(34,211,238,0.3)' : border}` }}>
                  {mode === 'list' ? <List size={13} /> : mode === 'grid' ? <LayoutGrid size={13} /> : <CreditCard size={13} />}
                </button>
              );
            })}
          </div>
          {/* Focus */}
          <button onClick={() => { setFocusMode(m => !m); setFocusIdx(0); }}
            title="Focus Mode — one question at a time, full screen. Press F to toggle, Esc to exit"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-[11px] font-bold transition-all"
            style={{ background: focusMode ? 'rgba(34,211,238,0.12)' : (dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'), color: focusMode ? '#22D3EE' : (dark ? '#94A3B8' : '#64748B'), border: `1px solid ${focusMode ? 'rgba(34,211,238,0.3)' : border}` }}>
            <Maximize2 size={13} />
          </button>
          {/* Printable Cheat Sheet */}
          <button onClick={() => setShowCheatSheet(true)}
            title="1-Click Printable / PDF Interview Cheat Sheet — high-density 2-column revision sheet with KaTeX formulas"
            className="hidden md:flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] font-bold transition-all shadow-sm"
            style={{ background: dark ? 'rgba(52,211,153,0.12)' : 'rgba(16,185,129,0.08)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }}>
            <Printer size={13} />Cheat Sheet
          </button>
          {/* Mock interview */}
          <button onClick={() => setShowMockInterview(true)}
            title="Mock Interview — 15 timed questions (5E+5M+3H+2N), configurable 10–30 min countdown. Get scored and debriefed!"
            className="hidden md:flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] font-bold transition-all shadow-sm"
            style={{ background: dark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)', color: '#F59E0B', border: `1px solid rgba(245,158,11,0.3)` }}>
            <Swords size={13} />Mock
          </button>
          {/* Quiz */}
          <button onClick={toggleQuizMode}
            title={quizMode ? 'Exit Quiz Mode — shows session summary with your accuracy and XP earned' : 'Quiz Mode — hide answers, reveal one-by-one. Got it / Needs Review scoring with spaced repetition'}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] font-bold transition-all shadow-sm"
            style={{ background: quizMode ? '#F97316' : dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', color: quizMode ? '#000' : undefined, border: `1px solid ${quizMode ? '#F97316' : border}` }}>
            <Brain size={14} />{quizMode ? 'Exit Quiz' : 'Quiz'}
          </button>
        </div>
      </header>

      {/* Mobile top bar with quick action buttons & topics */}
      <div className="flex md:hidden overflow-x-auto py-2 px-3 border-b gap-1.5 scrollbar-none z-10 relative items-center touch-manipulation"
        style={{ borderColor: border, background: dark ? 'rgba(10,11,18,0.92)' : '#F8FAFC', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setShowMobileSheet(true)}
          title="Open Study Menu & Topics Drawer"
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold border min-h-[36px] active:scale-95 transition-transform"
          style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', color: dark ? '#7DD3FC' : '#0284C7', borderColor: border }}>
          ☰ {topic ? IV_TOPICS.find(t => t.id === topic)?.label.replace(/^\d\.\s/, '') : 'Menu'}
        </button>

        {/* Quick action buttons on mobile */}
        <button onClick={() => setShowCheatSheet(true)}
          title="Open Printable 2-Column PDF Cheat Sheet"
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold border min-h-[36px] active:scale-95 transition-transform"
          style={{ background: 'rgba(52,211,153,0.12)', color: '#34D399', borderColor: 'rgba(52,211,153,0.3)' }}>
          <Printer size={13} /> Sheet
        </button>

        <button onClick={() => setViewMode(v => v === 'flashcard' ? 'list' : 'flashcard')}
          title="Toggle 3D Flashcard mode"
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold border min-h-[36px] active:scale-95 transition-transform"
          style={{ background: viewMode === 'flashcard' ? 'rgba(34,211,238,0.18)' : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'), color: viewMode === 'flashcard' ? '#22D3EE' : (dark ? '#94A3B8' : '#64748B'), borderColor: viewMode === 'flashcard' ? 'rgba(34,211,238,0.4)' : border }}>
          <CreditCard size={13} /> Cards
        </button>

        <button onClick={() => setShowMockInterview(true)}
          title="Start Mock Interview"
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold border min-h-[36px] active:scale-95 transition-transform"
          style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', borderColor: 'rgba(245,158,11,0.3)' }}>
          <Swords size={13} /> Mock
        </button>

        <button onClick={() => setShowStats(true)}
          title="Open Stats Dashboard"
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold border min-h-[36px] active:scale-95 transition-transform"
          style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', color: dark ? '#94A3B8' : '#64748B', borderColor: border }}>
          <BarChart2 size={13} className="text-cyan-400" /> Stats
        </button>

        <button onClick={jumpRandom}
          title="Jump to Random Question"
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold border min-h-[36px] active:scale-95 transition-transform"
          style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', color: dark ? '#94A3B8' : '#64748B', borderColor: border }}>
          <Dice5 size={13} />
        </button>

        {/* Scrollable topic chips */}
        {IV_TOPICS.filter(t => filtered.some(q => q.topic === t.id)).slice(0, 4).map(t => {
          const active = topic === t.id;
          return (
            <button key={t.id} onClick={() => setTopic(active ? null : t.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold min-h-[36px] active:scale-95 transition-transform"
              style={{ background: active ? `${t.color}22` : `${t.color}11`, color: active ? t.color : `${t.color}BB`, border: `1px solid ${t.color}40` }}>
              {t.label.replace(/^\d\.\s/, '')}
            </button>
          );
        })}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 z-10 relative overflow-hidden">

        {/* Sidebar */}
        {!focusMode && viewMode !== 'flashcard' && (
          <IvSidebar
            topic={topic} setTopic={setTopic}
            done={done} bookmarks={bookmarks} dark={dark}
            width={sidebarWidth} setWidth={setSidebarWidth}
            xp={xp} streak={streak}
            showStats={showStats} setShowStats={setShowStats}
            quizDueOnly={quizDueOnly} setQuizDueOnly={setQuizDueOnly}
            sr={sr}
            showBookmarksOnly={showBookmarksOnly} setShowBookmarksOnly={setShowBookmarksOnly}
            dailyId={dailyId}
            companyTrack={companyTrack} setCompanyTrack={setCompanyTrack}
            onOpenCheatSheet={() => setShowCheatSheet(true)}
            activeTrackedTopic={activeTrackedTopic}
          />
        )}

        {/* Main */}
        <main ref={mainScrollRef} onScroll={handleMainScroll} className="flex-1 h-full overflow-y-auto flex flex-col custom-scrollbar">

          {/* Flashcard mode */}
          {viewMode === 'flashcard' && !focusMode && (
            <FlashcardDeck
              questions={filtered}
              done={done}
              dark={dark}
              onDone={toggleDone}
              onBookmark={toggleBookmark}
              bookmarks={bookmarks}
              needle={needle}
              speakingId={speakingId}
              onToggleSpeech={toggleSpeech}
            />
          )}

          {/* Focus mode with touch swipe support */}
          {viewMode !== 'flashcard' && focusMode && filtered.length > 0 && (() => {
            const item = filtered[Math.min(focusIdx, filtered.length - 1)];
            const t = IV_TOPICS.find(x => x.id === item.topic)!;
            const isDone = done.has(item.id); const isBookmarked = bookmarks.has(item.id);
            return (
              <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-16 touch-manipulation select-none"
                onTouchStart={e => { (e.currentTarget as any)._touchX = e.touches[0].clientX; (e.currentTarget as any)._touchY = e.touches[0].clientY; }}
                onTouchEnd={e => {
                  const sx = (e.currentTarget as any)._touchX; const sy = (e.currentTarget as any)._touchY;
                  if (sx === undefined) return;
                  const dx = e.changedTouches[0].clientX - sx; const dy = e.changedTouches[0].clientY - sy;
                  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
                    if (dx < 0) focusNext(); else focusPrev();
                  }
                }}>
                <div className="w-full max-w-2xl">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <button onClick={focusPrev} disabled={focusIdx === 0} title="Previous question (← / Swipe Right)" className="p-3 rounded-xl disabled:opacity-30 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95" style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${border}` }}><ChevronLeft size={20} style={{ color: dark ? '#94A3B8' : '#64748B' }} /></button>
                    <span className="font-mono text-[12px] font-bold" style={{ color: dark ? '#94A3B8' : '#64748B' }}>{focusIdx + 1} / {filtered.length}</span>
                    <button onClick={focusNext} disabled={focusIdx >= filtered.length - 1} title="Next question (→ / Swipe Left)" className="p-3 rounded-xl disabled:opacity-30 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95" style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${border}` }}><ChevronRight size={20} style={{ color: dark ? '#94A3B8' : '#64748B' }} /></button>
                  </div>
                  <div className="rounded-2xl p-6 md:p-8 shadow-2xl" style={{ border: `1.5px solid ${t.color}30`, background: dark ? 'rgba(15,17,26,0.9)' : '#ffffff', boxShadow: `0 0 60px ${t.color}15` }}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold" style={{ background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}40` }}>{t.label}</span>
                      <span className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold" style={{ background: `${LEVEL_COLOR[item.level]}15`, color: LEVEL_COLOR[item.level] }}>{item.level}</span>
                    </div>
                    <h2 className="text-[19px] md:text-[26px] font-extrabold leading-snug mb-6 md:mb-8" style={{ color: dark ? '#F1F5F9' : '#0F172A' }}>{item.q}</h2>
                    <div style={{ borderLeft: `3px solid ${t.color}`, paddingLeft: '1rem' }} className="overflow-x-auto custom-scrollbar">{renderAnswer(item.a, dark, needle)}</div>
                    <div className="mt-8 flex items-center gap-2.5 md:gap-3 flex-wrap">
                      <button onClick={() => toggleDone(item.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[12px] font-bold transition-all active:scale-95 min-h-[42px]" style={{ background: isDone ? 'rgba(52,211,153,0.15)' : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'), color: isDone ? '#34D399' : (dark ? '#94A3B8' : '#64748B'), border: `1px solid ${isDone ? 'rgba(52,211,153,0.4)' : border}` }}>
                        {isDone ? <CheckCircle2 size={15} /> : <Circle size={15} />}{isDone ? 'Done' : 'Mark Done'}
                      </button>
                      <button onClick={() => toggleBookmark(item.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[12px] font-bold transition-all active:scale-95 min-h-[42px]" style={{ background: isBookmarked ? 'rgba(245,158,11,0.15)' : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'), color: isBookmarked ? '#F59E0B' : (dark ? '#94A3B8' : '#64748B'), border: `1px solid ${isBookmarked ? 'rgba(245,158,11,0.4)' : border}` }}>
                        {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}Bookmark
                      </button>
                      <button onClick={() => copyAnswer(item.a)} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-[12px] font-bold min-h-[42px] active:scale-95" style={{ color: dark ? '#64748B' : '#94A3B8', border: `1px solid ${border}` }}><Copy size={13} />Copy</button>
                      <button onClick={() => setFocusMode(false)} className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-[12px] font-bold min-h-[42px] active:scale-95" style={{ color: dark ? '#64748B' : '#94A3B8', border: `1px solid ${border}` }}><X size={13} />Exit Focus</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Normal / Grid list */}
          {viewMode !== 'flashcard' && !focusMode && (
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 w-full">
              {/* Search */}
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4 transition-all"
                style={{ border: `1px solid ${q ? (dark ? 'rgba(34,211,238,0.3)' : '#0284C7') : (dark ? 'rgba(255,255,255,0.08)' : '#CBD5E1')}`, background: dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF', boxShadow: q ? `0 0 0 3px ${dark ? 'rgba(34,211,238,0.07)' : 'rgba(2,132,199,0.07)'}` : (dark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)') }}>
                <Search size={16} className={sub} />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search questions, topics, keywords..."
                  className={`w-full bg-transparent text-[14px] outline-none placeholder:text-slate-400 font-medium ${dark ? 'text-white' : 'text-slate-900'}`} />
                {q && <button onClick={() => setQ('')} className="font-mono text-[11px] font-bold px-2 py-0.5 rounded" style={{ color: dark ? '#38BDF8' : '#0284C7', background: dark ? 'rgba(56,189,248,0.1)' : 'rgba(2,132,199,0.08)' }}>clear</button>}
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-2 mb-4 font-mono text-[11px] flex-wrap">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button onClick={expandAll} title="Expand All — open every question card at once" className={`font-bold ${sub} hover:opacity-70`}>Expand All</button>
                  <span className={sub}>·</span>
                  <button onClick={collapseAll} title="Collapse All — close all cards, reset to compact view" className={`font-bold ${sub} hover:opacity-70`}>Collapse All</button>
                  <span className={sub}>·</span>
                  <button onClick={() => setShowCheatSheet(true)} title="Printable Cheat Sheet — export 2-column revision sheet to PDF" className="font-bold text-emerald-400 hover:underline flex items-center gap-1"><Printer size={12} />Sheet</button>
                  {(topic || q || showBookmarksOnly || quizDueOnly || companyTrack) && (
                    <>
                      <span className={sub}>·</span>
                      <button onClick={() => { setTopic(null); setQ(''); setShowBookmarksOnly(false); setQuizDueOnly(false); setCompanyTrack(null); }} title="Reset all filters — show all questions" className="font-bold text-cyan-400 hover:underline">Reset</button>
                    </>
                  )}
                  <span className={sub}>·</span>
                  <button onClick={() => setShowBookmarksOnly(b => !b)} title={showBookmarksOnly ? 'Show All — exit bookmarks filter' : 'Saved — show only bookmarked questions'} className={`font-bold flex items-center gap-1 ${showBookmarksOnly ? 'text-amber-400' : sub}`}><Bookmark size={11} />{showBookmarksOnly ? 'All' : 'Saved'}</button>
                  <span className={sub}>·</span>
                  <button onClick={jumpRandom} title="Random Question (keyboard: R)" className={`font-bold flex items-center gap-1 ${sub} hover:opacity-70`}><Dice5 size={11} />Random</button>
                </div>
                <span className={sub}>{totalQuestions} question{totalQuestions !== 1 ? 's' : ''}</span>
              </div>

              {/* Company Track active indicator */}
              {companyTrack && (() => {
                const trk = COMPANY_TRACKS.find(c => c.id === companyTrack);
                if (!trk) return null;
                return (
                  <div className="mb-4 flex items-center justify-between px-4 py-2.5 rounded-xl text-[12px] font-mono font-bold"
                    style={{ background: `${trk.color}15`, border: `1px solid ${trk.color}40`, color: trk.color }}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{trk.emoji}</span>
                      <span>Targeting {trk.name}: {trk.tagline}</span>
                    </div>
                    <button onClick={() => setCompanyTrack(null)} className="p-1 rounded hover:opacity-75"><X size={14} /></button>
                  </div>
                );
              })()}

              {/* Daily challenge banner */}
              {!topic && !showBookmarksOnly && !quizDueOnly && !q && (() => {
                const dq = IV_QUESTIONS.find(x => x.id === dailyId)!;
                const dt = IV_TOPICS.find(x => x.id === dq.topic)!;
                const completed = done.has(dailyId);
                return (
                  <div className="mb-6 rounded-2xl p-5 cursor-pointer" style={{ border: `2px solid ${completed ? 'rgba(52,211,153,0.4)' : 'rgba(245,158,11,0.4)'}`, background: completed ? (dark ? 'rgba(52,211,153,0.05)' : '#ECFDF5') : (dark ? 'rgba(245,158,11,0.06)' : '#FFFBEB'), boxShadow: `0 0 30px ${completed ? 'rgba(52,211,153,0.08)' : 'rgba(245,158,11,0.1)'}`, animation: completed ? 'none' : 'iv-pulse-border 2.5s ease-in-out infinite' }}
                    id={`q-${dailyId}`}
                    onClick={() => toggle(dailyId)}>
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={14} style={{ color: '#F59E0B' }} />
                      <span className="font-mono text-[11px] font-bold" style={{ color: '#F59E0B' }}>DAILY CHALLENGE · +50 XP Bonus</span>
                      {completed && <CheckCircle2 size={14} style={{ color: '#34D399' }} />}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold" style={{ background: `${dt.color}18`, color: dt.color }}>{dt.label}</span>
                    </div>
                    <p className="font-bold text-[15px]" style={{ color: dark ? '#F1F5F9' : '#0F172A' }}>{dq.q}</p>
                    {open.has(dailyId) && (
                      <div className="mt-4" style={{ borderLeft: `3px solid ${dt.color}60`, paddingLeft: '1rem' }}>
                        {renderAnswer(dq.a, dark, needle)}
                        {!completed && (
                          <button onClick={e => { e.stopPropagation(); toggleDone(dailyId); }}
                            className="mt-4 px-4 py-2 rounded-xl font-mono text-[12px] font-bold"
                            style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                            ⭐ Complete Challenge (+50 XP)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Question list */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-2'}>
                {filtered.map((item, globalIdx) => {
                  if (item.id === dailyId && !topic && !showBookmarksOnly && !quizDueOnly && !q) return null; // already shown above
                  const t = IV_TOPICS.find(x => x.id === item.topic)!;
                  const isOpen = open.has(item.id);
                  const isDone = done.has(item.id);
                  const isRevd = revealed.has(item.id);
                  const isBookmarked = bookmarks.has(item.id);
                  const isFocused = focusedIdx === globalIdx;
                  const flash = cardFlash?.id === item.id ? cardFlash.type : null;
                  const bouncing = doneAnim.has(item.id);
                  const hasNote = !!notes[item.id];
                  const showDivider = viewMode === 'list' && globalIdx === firstVlsiIdx && !topic;

                  return (
                    <React.Fragment key={item.id}>
                      {showDivider && (
                        <div className="my-8 flex items-center gap-4">
                          <div className="flex-1 border-t" style={{ borderColor: 'rgba(249,115,22,0.2)' }} />
                          <span className="font-mono tracking-[0.25em] uppercase font-bold" style={{ fontSize: '9px', color: '#F97316' }}>VLSI Silicon Design Flow</span>
                          <div className="flex-1 border-t" style={{ borderColor: 'rgba(249,115,22,0.2)' }} />
                        </div>
                      )}
                      <article id={`q-${item.id}`} data-topic={item.topic}
                        style={{
                          border: `1px solid ${flash === 'got' ? '#34D399' : flash === 'missed' ? '#FB7185' : isDone ? (dark ? 'rgba(52,211,153,0.35)' : '#10B981') : isFocused ? `${t.color}80` : (dark ? 'rgba(255,255,255,0.07)' : '#E2E8F0')}`,
                          borderRadius: '12px',
                          boxShadow: isDone ? (dark ? `0 0 20px rgba(52,211,153,0.12)` : `0 1px 3px rgba(16,185,129,0.15)`) : isFocused ? `0 0 0 3px ${t.color}25` : (dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'),
                          background: flash === 'got' ? 'rgba(52,211,153,0.1)' : flash === 'missed' ? 'rgba(251,113,133,0.1)' : isDone ? (dark ? 'rgba(52,211,153,0.04)' : '#F0FDF4') : (dark ? 'rgba(255,255,255,0.025)' : '#FFFFFF'),
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                          animation: `iv-card-in 0.35s ease-out ${Math.min(globalIdx, 12) * 30}ms both`,
                        }}>
                        <button onClick={() => toggle(item.id)} aria-expanded={isOpen} className="flex w-full items-start gap-3 px-5 py-4 text-left">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-md" style={{ background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}30` }}>Q{globalIdx + 1}</span>
                              <span className="rounded-md px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest" style={{ background: dark ? `${t.color}18` : `${t.color}14`, color: t.color, border: `1px solid ${t.color}35` }}>{t.label}</span>
                              <span className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold" style={{ background: `${LEVEL_COLOR[item.level]}15`, color: LEVEL_COLOR[item.level] }}>{item.level}</span>
                              {isDone && <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-500"><CheckCircle2 size={12} className={bouncing ? 'scale-125' : ''} />Done</span>}
                              {hasNote && <span title="Has notes" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />}
                            </div>
                            <h3 className={`text-[15px] md:text-[16.5px] font-bold leading-snug ${dark ? 'text-slate-100' : 'text-slate-900'}`} style={{ color: dark ? '#F1F5F9' : '#0F172A' }}>
                              <HighlightedText text={item.q} needle={needle} dark={dark} />
                            </h3>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-shrink-0">
                            <button onClick={e => { e.stopPropagation(); toggleBookmark(item.id); }}
                              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                              className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg transition-all active:scale-95"
                              style={{ color: isBookmarked ? '#F59E0B' : (dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)') }}>
                              {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                            </button>
                            <button onClick={e => { e.stopPropagation(); shareQuestion(item.id); }}
                              title="Share Question Link"
                              className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg transition-all active:scale-95"
                              style={{ color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)' }}>
                              <Share2 size={15} />
                            </button>
                            <div className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center">
                              <ChevronDown size={18} className={`transition-transform duration-300 ${dark ? 'text-slate-400' : 'text-slate-500'} ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5" style={{ animation: 'iv-answer-reveal 0.25s ease-out' }}>
                            <div className="rounded-r-lg pl-4 pt-1" style={{ borderLeft: `3px solid ${dark ? t.color + '80' : t.color + '60'}` }}>
                              {quizMode && !isRevd ? (
                                <div className="py-5 text-center">
                                  <button onClick={() => revealAnswer(item.id)} className="rounded-xl px-6 py-2.5 font-mono text-[13px] font-bold transition-all hover:scale-105" style={{ border: `1px solid ${t.color}60`, color: t.color, background: `${t.color}10` }}>Reveal Answer →</button>
                                </div>
                              ) : (
                                <div>
                                  {renderAnswer(item.a, dark, needle)}
                                  {quizMode && isRevd && (
                                    <div className="mt-5 flex items-center gap-3">
                                      <button onClick={() => handleGot(item.id)} className="flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-[12px] font-bold hover:scale-105 shadow-sm" style={{ border: '1px solid rgba(52,211,153,0.5)', background: dark ? 'rgba(52,211,153,0.12)' : '#ECFDF5', color: dark ? '#34D399' : '#047857' }}><CheckCircle2 size={14} />Got it Right</button>
                                      <button onClick={() => handleMissed(item.id)} className="flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-[12px] font-bold hover:scale-105 shadow-sm" style={{ border: '1px solid rgba(251,113,133,0.5)', background: dark ? 'rgba(251,113,133,0.12)' : '#FFF1F2', color: dark ? '#FB7185' : '#BE123C' }}>✗ Needs Review</button>
                                    </div>
                                  )}
                                </div>
                              )}
                              {!quizMode && (
                                <div className="mt-5 flex items-center gap-2 flex-wrap">
                                  <button onClick={() => toggleDone(item.id)} className="inline-flex items-center gap-2 rounded-xl border px-4 py-1.5 font-mono text-[12px] font-bold hover:scale-105" style={{ borderColor: isDone ? (dark ? 'rgba(52,211,153,0.5)' : '#059669') : (dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'), background: isDone ? (dark ? 'rgba(52,211,153,0.12)' : '#ECFDF5') : (dark ? 'rgba(255,255,255,0.03)' : '#F8FAFC'), color: isDone ? (dark ? '#34D399' : '#047857') : (dark ? 'rgba(255,255,255,0.7)' : '#334155') }}>
                                    {isDone ? <CheckCircle2 size={14} className={bouncing ? 'scale-125' : ''} /> : <Circle size={14} />}
                                    {isDone ? 'Completed ✓' : 'Mark as Done'}
                                  </button>
                                  <button onClick={() => toggleSpeech(item.id, `${item.q}. ${item.a}`)}
                                    title={speakingId === item.id ? 'Stop audio readout' : 'Listen to question & answer aloud'}
                                    className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-[11px] font-bold transition-all active:scale-95"
                                    style={{
                                      borderColor: speakingId === item.id ? 'rgba(34,211,238,0.4)' : border,
                                      background: speakingId === item.id ? 'rgba(34,211,238,0.12)' : undefined,
                                      color: speakingId === item.id ? '#22D3EE' : (dark ? '#64748B' : '#94A3B8'),
                                    }}>
                                    {speakingId === item.id ? <VolumeX size={12} className="animate-pulse" /> : <Volume2 size={12} />}
                                    {speakingId === item.id ? 'Stop' : 'Listen'}
                                  </button>
                                  <button onClick={() => setActiveConceptCard(activeConceptCard === item.id ? null : item.id)}
                                    title="Active recall self-audit: check off essential keywords & concepts"
                                    className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-[11px] font-bold transition-all active:scale-95"
                                    style={{
                                      borderColor: activeConceptCard === item.id ? 'rgba(245,158,11,0.4)' : border,
                                      background: activeConceptCard === item.id ? 'rgba(245,158,11,0.12)' : undefined,
                                      color: activeConceptCard === item.id ? '#F59E0B' : (dark ? '#64748B' : '#94A3B8'),
                                    }}>
                                    <Sparkles size={12} /> Key Concepts
                                  </button>
                                  <button onClick={() => copyAnswer(item.a)} className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-[11px] font-bold" style={{ borderColor: border, color: dark ? '#64748B' : '#94A3B8' }}><Copy size={12} />Copy</button>
                                  <button onClick={() => setOpenNoteId(openNoteId === item.id ? null : item.id)} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-[11px] font-bold ${hasNote ? 'text-amber-400' : ''}`} style={{ borderColor: hasNote ? 'rgba(245,158,11,0.4)' : border, color: hasNote ? '#F59E0B' : (dark ? '#64748B' : '#94A3B8') }}><Pencil size={12} />{hasNote ? 'My Notes' : 'Add Note'}</button>
                                </div>
                              )}

                              {/* Key Concepts Self-Audit Checklist */}
                              {activeConceptCard === item.id && (() => {
                                const concepts = extractKeyConcepts(item.a);
                                const checked = checkedConcepts[item.id] || new Set();
                                const pctRecall = concepts.length > 0 ? Math.round((checked.size / concepts.length) * 100) : 0;
                                return (
                                  <div className="mt-4 p-3.5 rounded-xl border" style={{ borderColor: 'rgba(245,158,11,0.25)', background: dark ? 'rgba(245,158,11,0.04)' : 'rgba(245,158,11,0.03)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                        <CheckSquare size={12} /> Key Concepts Recall Checklist
                                      </span>
                                      <span className="font-mono text-[10px] font-bold text-amber-400">
                                        {checked.size}/{concepts.length} ({pctRecall}%)
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {concepts.map(c => {
                                        const isChk = checked.has(c);
                                        return (
                                          <button key={c} onClick={() => toggleConceptCheck(item.id, c)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold text-left transition-all active:scale-95"
                                            style={{
                                              background: isChk ? 'rgba(52,211,153,0.18)' : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                                              color: isChk ? '#34D399' : (dark ? '#CBD5E1' : '#334155'),
                                              border: `1px solid ${isChk ? 'rgba(52,211,153,0.4)' : border}`,
                                            }}>
                                            <span>{isChk ? '✓' : '○'}</span>
                                            <span>{c}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Notes editor */}
                              {openNoteId === item.id && (
                                <div className="mt-3" style={{ animation: 'iv-answer-reveal 0.2s ease-out' }}>
                                  <textarea
                                    defaultValue={notes[item.id] || ''}
                                    onBlur={e => saveNote(item.id, e.target.value)}
                                    placeholder="Add your notes, mnemonics, or key insights here..."
                                    className="w-full rounded-xl px-4 py-3 font-mono text-[13px] resize-none outline-none"
                                    rows={3}
                                    maxLength={500}
                                    style={{ background: dark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.3)', color: dark ? '#FDE68A' : '#78350F' }}
                                    onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) { e.currentTarget.blur(); setOpenNoteId(null); } }}
                                  />
                                  <p className="font-mono text-[10px] mt-1" style={{ color: dark ? '#64748B' : '#94A3B8' }}>Ctrl+Enter to save</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </article>
                    </React.Fragment>
                  );
                })}

                {filtered.filter(item => !(item.id === dailyId && !topic && !showBookmarksOnly && !quizDueOnly && !q)).length === 0 && (
                  <p className={`py-16 text-center ${sub}`}>No questions match — try a different topic or clear the search.</p>
                )}
              </div>

              {/* CTA */}
              <div className="mt-12 rounded-2xl text-center p-8" style={{ border: `1.5px solid ${border}`, background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(34,211,238,0.03)' }}>
                <h2 className={`text-lg font-extrabold tracking-tight ${text}`}>Now write the code.</h2>
                <p className={`mx-auto mt-2 max-w-md text-sm leading-relaxed ${sub}`}>Concepts are half the interview — the other half is writing Verilog that runs.</p>
                <button onClick={() => navigate('/verilog-playground')} className="mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all" style={{ background: 'linear-gradient(135deg, #22D3EE, #0EA5E9)', color: '#000' }}>
                  Open the Verilog Judge <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Overlays ── */}
      {showCheatSheet && (
        <PrintableCheatSheet
          questions={filtered}
          dark={dark}
          onClose={() => setShowCheatSheet(false)}
          title={companyTrack ? `${COMPANY_TRACKS.find(c => c.id === companyTrack)?.name} Interview Cheat Sheet` : topic ? `${IV_TOPICS.find(t => t.id === topic)?.label} Cheat Sheet` : 'VLSI & Embedded Hardware Interview Cheat Sheet'}
        />
      )}
      {showStats && <StatsDashboard done={done} dark={dark} onClose={() => setShowStats(false)} xp={xp} totalTimeMs={totalTimeMs} sr={sr} />}
      {showMobileSheet && (
        <MobileSheet
          open={showMobileSheet}
          onClose={() => setShowMobileSheet(false)}
          topic={topic}
          setTopic={setTopic}
          done={done}
          dark={dark}
          onOpenStats={() => setShowStats(true)}
          onOpenMock={() => setShowMockInterview(true)}
          onToggleFlashcard={() => setViewMode(v => v === 'flashcard' ? 'list' : 'flashcard')}
          onJumpDaily={() => { setTopic(null); setCompanyTrack(null); setQuizDueOnly(false); setShowBookmarksOnly(false); const el = document.getElementById(`q-${dailyId}`); el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
          onJumpRandom={jumpRandom}
          showBookmarksOnly={showBookmarksOnly}
          setShowBookmarksOnly={setShowBookmarksOnly}
          bookmarksCount={bookmarks.size}
          companyTrack={companyTrack}
          setCompanyTrack={setCompanyTrack}
          onOpenCheatSheet={() => setShowCheatSheet(true)}
        />
      )}
      {showSessionSummary && (
        <SessionSummary
          got={quizScore.got}
          missed={quizScore.missed}
          xpEarned={quizXpEarned}
          dark={dark}
          onClose={() => setShowSessionSummary(false)}
          onStudyAgain={() => {
            setShowSessionSummary(false);
            setQuizMode(true);
            setRevealed(new Set());
            setQuizScore({ got: 0, missed: 0 });
            setQuizXpEarned(0);
          }}
        />
      )}
      {showMockInterview && (
        <MockInterview
          dark={dark}
          onClose={() => setShowMockInterview(false)}
          onComplete={(got, total, dur) => {
            const attempts: MockAttempt[] = loadJson(MOCK_KEY, []);
            attempts.push({ date: todayStr(), score: got, total, durationSec: dur });
            saveJson(MOCK_KEY, attempts.slice(-20));
            setXp(x => { const n = x + got * 15; saveJson(XP_KEY, n); return n; });
            setShowMockInterview(false);
            addToast({ message: `🏆 Mock complete! ${got}/${total} · +${got * 15} XP`, type: 'rank' });
          }}
        />
      )}
      {showShortcuts && <ShortcutHUD dark={dark} onClose={() => setShowShortcuts(false)} />}

      {/* Toast stack */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {/* Floating ? with safe-area spacing */}
      <button onClick={() => setShowShortcuts(s => !s)}
        title="Keyboard & Touch Shortcuts"
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-[14px] shadow-lg active:scale-95 transition-all touch-manipulation"
        style={{ background: dark ? 'rgba(30,35,48,0.9)' : 'rgba(240,243,246,0.95)', color: dark ? '#94A3B8' : '#64748B', border: `1px solid ${border}`, backdropFilter: 'blur(8px)' }}>?</button>

      <style>{`
        @keyframes iv-answer-reveal { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes iv-card-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes iv-confetti-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        @keyframes iv-toast-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes iv-pulse-border { 0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.15); } 50% { box-shadow: 0 0 35px rgba(245,158,11,0.3); } }
        .touch-manipulation { touch-action: manipulation; }

        /* Multi-Page 2-Column PDF & Print Engine */
        @media print {
          @page {
            margin: 10mm;
            size: A4 portrait;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 11px !important;
          }
          header, aside, main, .no-print, button, [role="tooltip"], nav {
            display: none !important;
          }
          .printable-sheet-overlay {
            position: static !important;
            display: block !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            z-index: 1 !important;
          }
          .printable-sheet-content {
            position: static !important;
            display: block !important;
            background: transparent !important;
            color: #000000 !important;
            overflow: visible !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .printable-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .printable-card {
            display: block !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 8px !important;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            padding: 10px 12px !important;
            margin-bottom: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
