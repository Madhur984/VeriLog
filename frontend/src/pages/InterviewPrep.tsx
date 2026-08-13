import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, ChevronDown, ArrowRight, CheckCircle2, Circle,
  Brain, BookOpen,
} from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { IV_QUESTIONS, IV_TOPICS, IvTopic, IvLevel } from '../data/interviewQuestions';

/**
 * VLSI Interview Prep — 129-question study engine.
 * Phase 2: rich §-marker answer renderer (§F: formula, §C: calc, §R: result).
 * Phase 3: two-panel layout with sidebar category navigator.
 * Phase 4: progress persistence via localStorage.
 * Phase 5: quiz mode with Got-it / Missed-it scoring.
 * Phase 6: URL filter persistence (?topic=pd&level=Numerical).
 */

const LEVELS: IvLevel[] = ['Easy', 'Medium', 'Hard', 'Numerical'];
const LEVEL_COLOR: Record<IvLevel, string> = {
  Easy: '#34D399',
  Medium: '#F59E0B',
  Hard: '#FB7185',
  Numerical: '#F97316',
};

const PROGRESS_KEY = 'iv_progress_v1';

const loadProgress = (): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')); }
  catch { return new Set(); }
};

const saveProgress = (done: Set<string>) => {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify([...done])); } catch {}
};

import katex from 'katex';
import 'katex/dist/katex.min.css';

// ── Phase 2: Rich KaTeX Answer Renderer ───────────────────────────────────

function renderKatexMath(mathStr: string, displayMode: boolean = false) {
  try {
    return katex.renderToString(mathStr, {
      displayMode,
      throwOnError: false,
    });
  } catch {
    return mathStr;
  }
}

function renderInlineMathAndCode(textStr: string, key: number, dark: boolean) {
  // Check if string is structured key-value/point (e.g. "Given:", "Option B:", "Note:")
  const isLabelHeader = /^(Given:|Option [A-D]:|Note:|Key takeaways:|Best approach:)/i.test(textStr.trim());
  const parts = textStr.split(/(\$[^\$]+\$|`[^`]+`)/g);

  const bodyTextColor = dark ? 'rgba(241, 245, 249, 0.95)' : 'rgba(15, 23, 42, 0.92)';

  return (
    <div key={key} className="mt-2.5 flex items-start gap-2">
      {!isLabelHeader && (
        <span
          className="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0"
          style={{ background: dark ? '#7DD3FC' : '#0284C7' }}
        />
      )}
      <p
        className={`text-[15px] md:text-[16px] leading-relaxed ${isLabelHeader ? 'font-semibold text-amber-500 dark:text-amber-400 mt-1' : ''}`}
        style={{ color: isLabelHeader ? undefined : bodyTextColor }}
      >
        {parts.map((p, i) => {
          if (p.startsWith('$') && p.endsWith('$') && p.length > 2) {
            const html = renderKatexMath(p.slice(1, -1), false);
            return (
              <span
                key={i}
                className="inline-katex font-mono px-1 font-semibold"
                style={{ color: dark ? '#38BDF8' : '#0369A1' }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
          if (p.startsWith('`') && p.endsWith('`') && p.length > 2) {
            return (
              <code
                key={i}
                className="font-mono px-1.5 py-0.5 rounded text-[13px] font-semibold"
                style={{
                  background: dark ? 'rgba(56,189,248,0.12)' : 'rgba(2,132,199,0.1)',
                  color: dark ? '#38BDF8' : '#0284C7',
                  border: `1px solid ${dark ? 'rgba(56,189,248,0.3)' : 'rgba(2,132,199,0.25)'}`,
                }}
              >
                {p.slice(1, -1)}
              </code>
            );
          }
          return p;
        })}
      </p>
    </div>
  );
}

function renderAnswer(a: string, dark: boolean) {
  return a.split('\n').map((line, i) => {
    const s = line.trim();
    if (s.startsWith('§F:')) {
      const latex = s.slice(3).trim();
      const html = renderKatexMath(latex, true);
      return (
        <div
          key={i}
          className="iv-formula-block my-3 p-3.5 rounded-md border-l-4 shadow-sm"
          style={{
            borderColor: dark ? '#F59E0B' : '#D97706',
            background: dark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
            color: dark ? '#FDE68A' : '#78350F',
          }}
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1 opacity-75">
            Formula Definition
          </div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      );
    }
    if (s.startsWith('§C:')) {
      const latex = s.slice(3).trim();
      const html = renderKatexMath(latex, true);
      return (
        <div
          key={i}
          className="iv-formula-block my-3 p-3.5 rounded-md border-l-4 shadow-sm"
          style={{
            borderColor: dark ? '#38BDF8' : '#0284C7',
            background: dark ? 'rgba(56,189,248,0.08)' : '#F0F9FF',
            color: dark ? '#BAE6FD' : '#0C4A6E',
          }}
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1 opacity-75">
            Calculation Step
          </div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      );
    }
    if (s.startsWith('§R:')) {
      const resultText = s.slice(3).trim();
      return (
        <div
          key={i}
          className="mt-4 mb-2 flex items-center gap-2.5 rounded-lg px-4 py-2.5 font-mono text-[14px] font-bold shadow-sm"
          style={{
            border: `1px solid ${dark ? 'rgba(52,211,153,0.4)' : 'rgba(16,185,129,0.4)'}`,
            background: dark ? 'rgba(52,211,153,0.12)' : '#ECFDF5',
            color: dark ? '#34D399' : '#065F46',
          }}
        >
          <span className="text-[16px]">✓</span>
          <span>{resultText}</span>
        </div>
      );
    }
    if (!s) return <div key={i} className="h-2" />;
    return renderInlineMathAndCode(s, i, dark);
  });
}


// ── Phase 3: Sidebar Component ────────────────────────────────────────────

interface SidebarProps {
  topic: IvTopic | null;
  setTopic: (t: IvTopic | null) => void;
  done: Set<string>;
  dark: boolean;
  width: number;
  setWidth: (w: number) => void;
}

function IvSidebar({ topic, setTopic, done, dark, width, setWidth }: SidebarProps) {
  const total = IV_QUESTIONS.length;
  const doneCount = done.size;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const [isResizing, setIsResizing] = useState(false);

  const coreTopics   = IV_TOPICS.filter(t => t.section === 'Core Hardware');
  const designTopics = IV_TOPICS.filter(t => t.section === 'Design & Backend');
  const careerTopics = IV_TOPICS.filter(t => t.section === 'Career & Tools');

  const dim    = dark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.6)';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.min(Math.max(moveEvent.clientX, 180), 400);
      setWidth(newWidth);
    };
    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const navItem = (label: string, count: number, active: boolean, color: string, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 rounded text-left transition-all group"
      style={{
        borderLeft: active ? `3px solid ${color}` : '3px solid transparent',
        background: active ? (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'transparent',
        color: active ? (dark ? '#FFFFFF' : '#0F172A') : dim,
        fontSize: '13px',
        fontWeight: active ? 600 : 500,
        fontFamily: 'inherit',
      }}
    >
      <span className="truncate">{label}</span>
      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded opacity-80" style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>{count}</span>
    </button>
  );

  return (
    <aside
      className="hidden md:flex flex-col border-r relative flex-shrink-0 select-none"
      style={{
        width: `${width}px`,
        borderColor: border,
        background: dark ? 'rgba(255,255,255,0.015)' : '#F8FAFC',
      }}
    >
      {/* Resizer Handle */}
      <div
        onMouseDown={startResizing}
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-cyan-400/50 transition-colors z-20"
        title="Drag to resize sidebar"
      />

      <div className="p-4 space-y-1 overflow-y-auto flex-1">
        {/* CORE HARDWARE heading */}
        <p className="font-mono tracking-[0.2em] uppercase mb-2 font-bold" style={{ fontSize: '10px', color: dim }}>
          Core Hardware
        </p>

        {/* All */}
        {navItem(`All (${total})`, total, topic === null, '#22D3EE', () => setTopic(null))}

        {/* Core topic items */}
        {coreTopics.map(t => {
          const count = IV_QUESTIONS.filter(q => q.topic === t.id).length;
          return navItem(t.label, count, topic === t.id, t.color, () => setTopic(topic === t.id ? null : t.id));
        })}

        {/* Separator */}
        <div className="my-3" style={{ borderTop: `1px solid ${border}` }} />

        {/* DESIGN & BACKEND heading */}
        <p className="font-mono tracking-[0.2em] uppercase mb-2 font-bold" style={{ fontSize: '10px', color: dim }}>
          Design & Backend
        </p>

        {designTopics.map(t => {
          const count = IV_QUESTIONS.filter(q => q.topic === t.id).length;
          return navItem(t.label, count, topic === t.id, t.color, () => setTopic(topic === t.id ? null : t.id));
        })}

        {/* Separator */}
        <div className="my-3" style={{ borderTop: `1px solid ${border}` }} />

        {/* CAREER & TOOLS heading */}
        <p className="font-mono tracking-[0.2em] uppercase mb-2 font-bold" style={{ fontSize: '10px', color: dim }}>
          Career & Tools
        </p>

        {careerTopics.map(t => {
          const count = IV_QUESTIONS.filter(q => q.topic === t.id).length;
          return navItem(t.label, count, topic === t.id, t.color, () => setTopic(topic === t.id ? null : t.id));
        })}

        {/* Separator */}
        <div className="my-3" style={{ borderTop: `1px solid ${border}` }} />

        {/* Progress stats */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono font-semibold" style={{ fontSize: '11px', color: dim }}>Progress</span>
            <span className="font-mono font-bold" style={{ fontSize: '12px', color: dark ? '#34D399' : '#059669' }}>
              {doneCount}/{total}
            </span>
          </div>
          <div
            className="rounded-full overflow-hidden"
            style={{ height: '5px', background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: dark ? '#34D399' : '#059669' }}
            />
          </div>
          <p className="mt-1 font-mono font-semibold" style={{ fontSize: '10px', color: dim }}>{pct}% complete</p>
        </div>
      </div>
    </aside>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export default function InterviewPrep() {
  const navigate   = useNavigate();
  const [scheme]   = useColorScheme();
  const dark       = scheme === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();

  // Phase 6: URL filter persistence — read on mount
  const [q, setQ]       = useState('');
  const [topic, setTopicRaw] = useState<IvTopic | null>(() => {
    const t = searchParams.get('topic');
    return IV_TOPICS.some(x => x.id === t) ? (t as IvTopic) : null;
  });

  const [open, setOpen]       = useState<Set<string>>(new Set());
  const [done, setDone]       = useState<Set<string>>(loadProgress);

  // Phase 5: Quiz mode
  const [quizMode, setQuizMode]   = useState(false);
  const [revealed, setRevealed]   = useState<Set<string>>(new Set());
  const [quizScore, setQuizScore] = useState({ got: 0, missed: 0 });

  // Phase 6: write to URL on filter change
  const setTopic = (t: IvTopic | null) => setTopicRaw(t);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (topic) params.topic = topic;
    setSearchParams(params, { replace: true });
  }, [topic]);

  // Phase 4: Progress toggle
  const toggleDone = (id: string) => {
    setDone(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveProgress(next);
      return next;
    });
  };

  const toggleQuizMode = () => {
    setQuizMode(m => !m);
    setRevealed(new Set());
    setQuizScore({ got: 0, missed: 0 });
  };

  const revealAnswer = (id: string) => {
    setRevealed(prev => new Set(prev).add(id));
  };

  const handleGot = (id: string) => {
    setQuizScore(s => ({ ...s, got: s.got + 1 }));
    toggleDone(id);
  };

  const handleMissed = (id: string) => {
    void id;
    setQuizScore(s => ({ ...s, missed: s.missed + 1 }));
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return IV_QUESTIONS.filter((item) => {
      if (topic && item.topic !== topic) return false;
      if (needle && !(`${item.q} ${item.a}`.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [q, topic]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll   = () => setOpen(new Set(filtered.map((f) => f.id)));
  const collapseAll = () => setOpen(new Set());

  // PD divider: index of first pd question in filtered list
  const firstPdIdx = filtered.findIndex(q => q.topic === 'pd');

  // style helpers
  const text   = dark ? 'text-white' : 'text-slate-900';
  const sub    = dark ? 'text-slate-300' : 'text-slate-600';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';

  const totalQuestions = filtered.length;
  const quizTotal      = quizScore.got + quizScore.missed;
  const [sidebarWidth, setSidebarWidth] = useState(240);

  return (
    <div
      className={`min-h-screen flex flex-col ${text}`}
      style={{ background: dark ? '#0A0B12' : '#ffffff' }}
    >
      {/* ── Header ── */}
      <header
        className="h-14 flex items-center justify-between px-4 md:px-5 border-b flex-shrink-0"
        style={{ borderColor: border, background: dark ? 'rgba(10,11,18,0.95)' : '#ffffff' }}
      >
        <div className="flex items-center gap-2.5">
          <BookOpen size={18} className="text-sky-400" />
          <span className="font-mono text-[12px] md:text-[13px] tracking-[0.2em] font-bold uppercase text-sky-400">
            VLSI Prep
          </span>
          <span
            className="font-mono text-[10px] px-2 py-0.5 rounded font-bold"
            style={{ background: 'rgba(125,211,252,0.12)', color: '#7DD3FC' }}
          >
            {IV_QUESTIONS.length} Qs
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {quizMode && quizTotal > 0 && (
            <span className="font-mono text-[11px] font-bold text-emerald-400">
              Score: {quizScore.got}/{quizTotal}
            </span>
          )}
          {/* Quiz mode toggle */}
          <button
            onClick={toggleQuizMode}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] font-bold transition-all shadow-sm"
            style={{
              background: quizMode ? '#F97316' : dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              color: quizMode ? '#000' : undefined,
              border: `1px solid ${quizMode ? '#F97316' : border}`,
            }}
          >
            <Brain size={14} />
            {quizMode ? 'Exit Quiz' : 'Quiz Mode'}
          </button>
        </div>
      </header>

      {/* Mobile Horizontal Category Scrollbar */}
      <div className="flex md:hidden overflow-x-auto py-2.5 px-4 border-b gap-2 scrollbar-none" style={{ borderColor: border, background: dark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' }}>
        <button
          onClick={() => setTopic(null)}
          className={`flex-shrink-0 px-3 py-1 rounded font-mono text-[11px] font-bold ${topic === null ? 'bg-cyan-500 text-black' : 'bg-slate-800/40 text-slate-300'}`}
        >
          All ({IV_QUESTIONS.length})
        </button>
        {IV_TOPICS.map(t => {
          const count = IV_QUESTIONS.filter(item => item.topic === t.id).length;
          const active = topic === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTopic(active ? null : t.id)}
              className="flex-shrink-0 px-3 py-1 rounded font-mono text-[11px] font-bold transition-colors"
              style={{
                background: active ? t.color : `${t.color}1A`,
                color: active ? '#000000' : t.color,
                border: `1px solid ${t.color}40`,
              }}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Body: Sidebar + Content ── */}
      <div className="flex flex-1 min-h-0">

        {/* Left Sidebar */}
        <IvSidebar
          topic={topic}
          setTopic={setTopic}
          done={done}
          dark={dark}
          width={sidebarWidth}
          setWidth={setSidebarWidth}
        />

        {/* Right: Search + Questions */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">

            {/* Search */}
            <div
              className="flex items-center gap-3 rounded-lg px-4 py-3 mb-4"
              style={{
                border: `1px solid ${border}`,
                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              }}
            >
              <Search size={16} className={sub} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: setup time, Elmore delay, IR drop, antenna effect..."
                className={`w-full bg-transparent text-[14px] outline-none placeholder:opacity-40 ${text}`}
              />
              {q && (
                <button onClick={() => setQ('')} className={`text-[11px] font-bold ${sub} hover:opacity-70`}>
                  clear
                </button>
              )}
            </div>



            {/* Clean control toolbar */}
            <div className="flex items-center justify-between gap-2 mb-5 font-mono text-[11px]">
              <div className="flex items-center gap-3">
                <button onClick={expandAll} className={`font-bold ${sub} hover:opacity-70`}>
                  Expand All
                </button>
                <span className={sub}>·</span>
                <button onClick={collapseAll} className={`font-bold ${sub} hover:opacity-70`}>
                  Collapse All
                </button>
                {(topic || q) && (
                  <>
                    <span className={sub}>·</span>
                    <button
                      onClick={() => { setTopic(null); setQ(''); }}
                      className="font-bold text-cyan-400 hover:underline"
                    >
                      Reset Filters
                    </button>
                  </>
                )}
              </div>
              <span className={sub}>
                {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Question list */}
            <div className="space-y-2">
              {filtered.map((item, globalIdx) => {
                const t       = IV_TOPICS.find((x) => x.id === item.topic)!;
                const isOpen  = open.has(item.id);
                const isDone  = done.has(item.id);
                const isRevd  = revealed.has(item.id);

                // PD section divider before first pd question in ALL view
                const showDivider = item.topic === 'pd' && globalIdx === firstPdIdx && !topic;

                return (
                  <React.Fragment key={item.id}>
                    {showDivider && (
                      <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 border-t" style={{ borderColor: 'rgba(249,115,22,0.2)' }} />
                        <span
                          className="font-mono tracking-[0.25em] uppercase font-bold"
                          style={{ fontSize: '9px', color: '#F97316' }}
                        >
                          Physical Design · 100 Questions
                        </span>
                        <div className="flex-1 border-t" style={{ borderColor: 'rgba(249,115,22,0.2)' }} />
                      </div>
                    )}

                    {/* Question card */}
                    <article
                      style={{
                        border: `1.5px solid ${isDone ? (dark ? 'rgba(52,211,153,0.35)' : '#059669') : border}`,
                        borderRadius: '8px',
                        boxShadow: isDone
                          ? (dark ? '3px 3px 0 rgba(52,211,153,0.2)' : '3px 3px 0 rgba(16,185,129,0.15)')
                          : (dark ? '3px 3px 0 rgba(0,0,0,0.4)' : '3px 3px 0 rgba(0,0,0,0.06)'),
                        background: dark ? 'rgba(255,255,255,0.025)' : '#ffffff',
                      }}
                    >
                      <button
                        onClick={() => toggle(item.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start gap-3 px-5 py-4 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span
                              className="font-mono font-semibold"
                              style={{ fontSize: '11px', color: dark ? 'rgba(125,211,252,0.8)' : '#0284C7' }}
                            >
                              Q{globalIdx + 1}
                            </span>
                            <span
                              className="rounded px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest"
                              style={{
                                background: dark ? `${t.color}22` : `${t.color}18`,
                                color: t.color,
                                border: `1px solid ${t.color}40`,
                              }}
                            >
                              {t.label}
                            </span>
                            {isDone && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={14} className="flex-shrink-0" />
                                Completed
                              </span>
                            )}
                          </div>
                          <h3 className={`text-[16px] md:text-[17px] font-bold leading-snug ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
                            {item.q}
                          </h3>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`mt-1 flex-shrink-0 transition-transform duration-200 ${dark ? 'text-slate-400' : 'text-slate-500'} ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Answer section */}
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <div
                            className="rounded-r-lg pl-4 pt-1"
                            style={{ borderLeft: `3px solid ${dark ? '#38BDF8' : '#0284C7'}` }}
                          >
                            {quizMode && !isRevd ? (
                              /* Quiz mode: hidden answer */
                              <div className="py-5 text-center">
                                <button
                                  onClick={() => revealAnswer(item.id)}
                                  className="rounded-md px-5 py-2.5 font-mono text-[13px] font-bold transition-all shadow-sm"
                                  style={{
                                    border: `1px solid ${dark ? '#38BDF8' : '#0284C7'}`,
                                    color: dark ? '#38BDF8' : '#0284C7',
                                    background: dark ? 'rgba(56,189,248,0.1)' : '#F0F9FF',
                                  }}
                                >
                                  Reveal Answer
                                </button>
                              </div>
                            ) : (
                              /* Answer rendered */
                              <div>
                                {renderAnswer(item.a, dark)}
                                {quizMode && isRevd && (
                                  <div className="mt-5 flex items-center gap-3">
                                    <button
                                      onClick={() => handleGot(item.id)}
                                      className="flex items-center gap-2 rounded-md px-4 py-2 font-mono text-[12px] font-bold transition-all shadow-sm"
                                      style={{
                                        border: '1px solid rgba(52,211,153,0.5)',
                                        background: dark ? 'rgba(52,211,153,0.15)' : '#ECFDF5',
                                        color: dark ? '#34D399' : '#047857',
                                      }}
                                    >
                                      <CheckCircle2 size={15} /> Got it Right
                                    </button>
                                    <button
                                      onClick={() => handleMissed(item.id)}
                                      className="flex items-center gap-2 rounded-md px-4 py-2 font-mono text-[12px] font-bold transition-all shadow-sm"
                                      style={{
                                        border: '1px solid rgba(251,113,133,0.5)',
                                        background: dark ? 'rgba(251,113,133,0.15)' : '#FFF1F2',
                                        color: dark ? '#FB7185' : '#BE123C',
                                      }}
                                    >
                                      ✗ Needs Review
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Mark done (outside quiz mode) */}
                            {!quizMode && (
                              <button
                                onClick={() => toggleDone(item.id)}
                                className="mt-5 inline-flex items-center gap-2 rounded-md border px-3.5 py-1.5 font-mono text-[12px] font-bold transition-all shadow-sm"
                                style={{
                                  borderColor: isDone ? (dark ? 'rgba(52,211,153,0.5)' : '#059669') : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
                                  background: isDone ? (dark ? 'rgba(52,211,153,0.15)' : '#ECFDF5') : (dark ? 'rgba(255,255,255,0.03)' : '#F8FAFC'),
                                  color: isDone ? (dark ? '#34D399' : '#047857') : (dark ? 'rgba(255,255,255,0.8)' : '#334155'),
                                }}
                              >
                                {isDone ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                {isDone ? 'Completed' : 'Mark as Done'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  </React.Fragment>
                );
              })}

              {filtered.length === 0 && (
                <p className={`py-16 text-center ${sub}`}>
                  No questions match — try a different topic or clear the search.
                </p>
              )}
            </div>

            {/* CTA to Verilog Judge */}
            <div
              className="mt-12 rounded text-center p-7"
              style={{
                border: `1.5px solid ${border}`,
                boxShadow: dark ? '3px 3px 0 rgba(0,0,0,0.4)' : '3px 3px 0 rgba(0,0,0,0.08)',
              }}
            >
              <h2 className={`text-lg font-extrabold tracking-tight ${text}`}>Now write the code.</h2>
              <p className={`mx-auto mt-2 max-w-md text-sm leading-relaxed ${sub}`}>
                Concepts are half the interview — the other half is writing Verilog that runs.
                Practice on the browser judge with instant grading.
              </p>
              <button
                onClick={() => navigate('/verilog-playground')}
                className="mt-4 inline-flex items-center gap-2 rounded px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
                style={{ background: '#22D3EE', color: '#000' }}
              >
                Open the Verilog Judge <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
