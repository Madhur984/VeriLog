import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, ChevronDown, ArrowRight } from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';
import { IV_QUESTIONS, IV_TOPICS, IvTopic, IvLevel } from '../data/interviewQuestions';

/**
 * VLSI Interview Prep — a real, searchable bank of common VLSI / digital-design
 * interview questions with answers, filterable by topic and difficulty. Built
 * (not "coming soon"): every answer is written out. Scoped to what the site
 * teaches — digital basics, number systems, Boolean/K-maps, combinational,
 * sequential/FSM, and Verilog.
 */

const LEVELS: IvLevel[] = ['Easy', 'Medium', 'Hard'];
const LEVEL_COLOR: Record<IvLevel, string> = { Easy: '#34D399', Medium: '#F59E0B', Hard: '#FB7185' };

export default function InterviewPrep() {
  const navigate = useNavigate();
  const [scheme] = useColorScheme();
  const dark = scheme === 'dark';

  const [q, setQ] = useState('');
  const [topic, setTopic] = useState<IvTopic | null>(null);
  const [level, setLevel] = useState<IvLevel | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const text = dark ? 'text-white' : 'text-slate-900';
  const sub = dark ? 'text-slate-300' : 'text-slate-600';
  const card = dark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white shadow-sm';

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return IV_QUESTIONS.filter((item) => {
      if (topic && item.topic !== topic) return false;
      if (level && item.level !== level) return false;
      if (needle && !(`${item.q} ${item.a}`.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [q, topic, level]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll = () => setOpen(new Set(filtered.map((f) => f.id)));
  const collapseAll = () => setOpen(new Set());

  return (
    <div className={`min-h-screen w-full pb-24 ${dark ? 'bg-[#0A0B12]' : 'bg-white'} ${text}`}>
      <div className="mx-auto max-w-4xl px-5 pt-20 sm:px-6">
        {/* header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400">
            <ClipboardList size={14} /> VLSI Interview Prep
          </span>
          <h1 className={`mt-4 text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight ${text}`}>
            VLSI interview questions, answered.
          </h1>
          <p className={`mt-4 text-lg leading-relaxed ${sub}`}>
            The questions that actually come up in digital-design and VLSI interviews — digital
            basics, number systems, Boolean algebra, combinational and sequential logic, and Verilog.
            Every answer is written out. Filter by topic, pick a difficulty, and quiz yourself.
          </p>
        </div>

        {/* search + filters */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
            dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
          }`}>
            <Search size={18} className={sub} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: setup time, mux, blocking, metastability..."
              className={`w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400 ${text}`}
            />
            {q && <button onClick={() => setQ('')} className={`text-xs font-bold ${sub} hover:opacity-70`}>clear</button>}
          </div>

          {/* topic chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setTopic(null)}
              className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all"
              style={{
                borderColor: topic === null ? '#22D3EE' : dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                background: topic === null ? 'rgba(34,211,238,0.12)' : 'transparent',
                color: topic === null ? '#22D3EE' : undefined,
              }}
            >
              ALL ({IV_QUESTIONS.length})
            </button>
            {IV_TOPICS.map((t) => {
              const active = topic === t.id;
              const count = IV_QUESTIONS.filter((x) => x.topic === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setTopic(active ? null : t.id)}
                  className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all"
                  style={{
                    borderColor: active ? t.color : dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                    background: active ? `${t.color}1F` : 'transparent',
                    color: active ? t.color : undefined,
                  }}
                >
                  {t.label.toUpperCase()} ({count})
                </button>
              );
            })}
          </div>

          {/* difficulty + expand controls */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {LEVELS.map((lv) => {
              const active = level === lv;
              return (
                <button
                  key={lv}
                  onClick={() => setLevel(active ? null : lv)}
                  className="rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide transition-all"
                  style={{
                    borderColor: active ? LEVEL_COLOR[lv] : dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                    background: active ? `${LEVEL_COLOR[lv]}1F` : 'transparent',
                    color: active ? LEVEL_COLOR[lv] : undefined,
                  }}
                >
                  {lv}
                </button>
              );
            })}
            <span className={`mx-1 text-xs ${sub}`}>·</span>
            <button onClick={expandAll} className={`text-xs font-bold ${sub} hover:opacity-70`}>expand all</button>
            <button onClick={collapseAll} className={`text-xs font-bold ${sub} hover:opacity-70`}>collapse</button>
          </div>
        </div>

        {/* count */}
        <p className={`mt-8 text-center font-mono text-xs ${sub}`}>
          {filtered.length} question{filtered.length === 1 ? '' : 's'}
        </p>

        {/* questions */}
        <div className="mt-4 space-y-3">
          {filtered.map((item) => {
            const t = IV_TOPICS.find((x) => x.id === item.topic)!;
            const isOpen = open.has(item.id);
            return (
              <article key={item.id} className={`rounded-2xl border ${card}`}>
                <button
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest"
                            style={{ background: `${t.color}1A`, color: t.color }}>
                        {t.label}
                      </span>
                      <span className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide"
                            style={{ background: `${LEVEL_COLOR[item.level]}1A`, color: LEVEL_COLOR[item.level] }}>
                        {item.level}
                      </span>
                    </div>
                    <h3 className={`text-[15px] font-bold leading-snug sm:text-base ${text}`}>{item.q}</h3>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`mt-1 flex-shrink-0 transition-transform duration-200 ${sub} ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6">
                    <div className={`rounded-xl border-l-2 pl-4 ${dark ? 'border-cyan-400/50' : 'border-cyan-500/60'}`}>
                      <p className={`text-[14px] leading-relaxed ${sub}`}>{item.a}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {filtered.length === 0 && (
            <p className={`py-16 text-center ${sub}`}>No questions match — try a different topic or clear the search.</p>
          )}
        </div>

        {/* CTA to the coding judge */}
        <div className={`mt-14 rounded-3xl border p-7 text-center sm:p-9 ${card}`}>
          <h2 className={`text-xl font-extrabold tracking-tight ${text}`}>Now write the code.</h2>
          <p className={`mx-auto mt-2 max-w-md text-sm leading-relaxed ${sub}`}>
            Concepts are half the interview — the other half is writing Verilog that runs. Practice on
            the browser judge with instant grading.
          </p>
          <button
            onClick={() => navigate('/verilog-playground')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
          >
            Open the Verilog Judge <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
