/**
 * Flip-Flop Conversions - dsd/33, "The Flip-Flop Adapter" (Sequential Logic track).
 * Generic scenes come from the shared _subtractor kit; the live available flip-flop
 * and its excitation table come from the shared _sequential/blocks library
 * (FlipFlopViz + ExciteTable). The interactive conversion machine, the general
 * conversion-model diagram, the 4-step method pipeline, the JK->D and SR->T worked
 * StepThroughs (master conversion table + K-maps + live circuit), the universal
 * conversion-matrix explorer and the power-plug adapter analogy are bespoke. EVERY
 * displayed value (target next state, required inputs, K-map cells, gate outputs,
 * glue verification) is COMPUTED in code from ffNext / ffExcite, never hardcoded.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat2, Check, X, Plug, Cpu, ArrowRight } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  ffExcite, ffNext, FF_META, FlipFlopViz, StateTable, ExciteTable, Toggle, ClockButton,
  type FFType,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { a: '#38bdf8', b: '#fb7185', good: '#34d399', warn: '#f59e0b' };
const SRC_EN: string | undefined = '/videos/dsd33-conversions.mp4';
const SRC_HI: string | undefined = undefined;

const FF_TYPES: FFType[] = ['SR', 'JK', 'D', 'T'];

/* ═══════════════════════ conversion algebra (single source of truth) ═══════════════════════
   The glue equations are the canonical closed forms; every master-conversion-table
   cell and every K-map cell is recomputed from ffNext / ffExcite so nothing is
   trusted on faith. */

type Glue = { eqs: string[]; fb: boolean };
const MATRIX: Record<FFType, Partial<Record<FFType, Glue>>> = {
  D: {
    SR: { eqs: ["S = D", "R = D'"], fb: false },
    JK: { eqs: ["J = D", "K = D'"], fb: false },
  },
  T: {
    SR: { eqs: ["S = T·Q'", "R = T·Q"], fb: true },
    JK: { eqs: ["J = T", "K = T"], fb: false },
    D:  { eqs: ["D = T ⊕ Q"], fb: true },
  },
  JK: {
    SR: { eqs: ["S = J·Q'", "R = K·Q"], fb: true },
    D:  { eqs: ["D = J·Q' + K'·Q"], fb: true },
  },
  SR: {
    JK: { eqs: ["J = S", "K = R"], fb: false },
    D:  { eqs: ["D = S + R'·Q"], fb: true },
  },
};

function glueFor(tgt: FFType, avail: FFType): Glue | 'identity' | null {
  if (tgt === avail) return 'identity';
  return MATRIX[tgt][avail] ?? null;
}

/** The master conversion table for (available <- target): every target-input
 *  combination with the present state Q, the desired next state, and the required
 *  available-FF inputs (from its excitation table). Rows: [...tgtIns, q, qn, ...exc]. */
function masterRows(avail: FFType, tgt: FFType): (string | number)[][] {
  const two = FF_META[tgt].inputs.length === 2;
  const combos: number[][] = two ? [[0, 0], [0, 1], [1, 0], [1, 1]] : [[0], [1]];
  const rows: (string | number)[][] = [];
  for (const ins of combos) {
    for (const q of [0, 1]) {
      const qn = ffNext(tgt, q, ins[0], two ? ins[1] : 0);
      if (qn === -1) continue;                 // skip a forbidden target transition
      rows.push([...ins, q, qn, ...ffExcite(avail, q, qn)]);
    }
  }
  return rows;
}

function masterHeaders(avail: FFType, tgt: FFType): string[] {
  return [...FF_META[tgt].inputs, 'Q(t)', 'Q(t+1)', ...FF_META[avail].inputs];
}

/** K-map cells for a SINGLE-input target (D or T) + present state Q. Returns
 *  cells[inVal][q] = the required available-input at column index outIdx. */
function kcells(avail: FFType, tgt: FFType, outIdx: number): string[][] {
  return [0, 1].map((inv) => [0, 1].map((q) => {
    const qn = ffNext(tgt, q, inv, 0);
    return ffExcite(avail, q, qn)[outIdx];
  }));
}

/* ═══════════════════════ small shared visuals ═══════════════════════ */

/** A computed 2-variable K-map (target single input across rows, Q across cols). */
const KMap2: React.FC<{ isDarkMode: boolean; accent: string; title: string; inLabel: string; cells: string[][]; result: string }>
  = ({ isDarkMode, accent, title, inLabel, cells, result }) => {
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  return (
    <div className={`rounded-2xl border p-4 ${t.soft}`}>
      <div className="mb-2 text-center font-mono text-[11px] font-black" style={{ color: accent }}>{title}</div>
      <div className="mx-auto w-max font-mono text-[12px]">
        <div className="flex items-center">
          <div className="w-12" />
          {[0, 1].map((q) => <div key={q} className={`w-14 text-center ${t.faint}`}>Q={q}</div>)}
        </div>
        {[0, 1].map((inv) => (
          <div key={inv} className="flex items-center">
            <div className={`w-12 pr-2 text-right ${t.faint}`}>{inLabel}={inv}</div>
            {[0, 1].map((q) => {
              const v = cells[inv][q];
              const one = v === '1';
              const dc = v === 'x';
              return (
                <div key={q} className="w-14 p-1">
                  <div className="flex h-9 items-center justify-center rounded-lg font-black"
                    style={{
                      background: one ? `${accent}22` : 'transparent',
                      color: one ? accent : dc ? (t.faint as string) : (t.ink as string),
                      border: `1.5px solid ${one ? accent : dim}`,
                    }}>{v}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 text-center font-mono text-[12px] font-black" style={{ color: ACC.good }}>{result}</div>
    </div>
  );
};

/* ═══════════════════════ bespoke: the conversion machine (cover hero) ═══════════════════════
   Pick a TARGET and an AVAILABLE flip-flop; the combinational glue box, its
   equations (from the universal matrix) and the COMPUTED master conversion table
   all update. The feedback wire lights only when the glue reads Q. */
const ConversionMachine: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [tgt, setTgt] = useState<FFType>('D');
  const [avail, setAvail] = useState<FFType>('JK');
  const glue = glueFor(tgt, avail);
  const tin = FF_META[tgt].inputs;
  const ain = FF_META[avail].inputs;
  const isConv = glue !== 'identity' && glue !== null;
  const fb = isConv && (glue as Glue).fb;

  const picker = (label: string, val: FFType, set: (f: FFType) => void, color: string) => (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color }}>{label}</span>
      <div className="flex gap-1">
        {FF_TYPES.map((f) => (
          <button key={f} onClick={() => set(f)}
            className="rounded-lg px-2.5 py-1.5 font-mono text-[12px] font-black active:scale-90"
            style={val === f ? { background: color, color: '#000' } : { border: `1.5px solid ${color}66`, color }}>{f}</button>
        ))}
      </div>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode} className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Repeat2 size={16} style={{ color: accent }} />
        <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
          {lang === 'hi' ? 'conversion machine · pair चुनिए' : 'conversion machine · pick a pair'}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-6">
        {picker(lang === 'hi' ? 'चाहिए · target' : 'want · target', tgt, setTgt, ACC.b)}
        {picker(lang === 'hi' ? 'है · available' : 'have · available', avail, setAvail, ACC.a)}
      </div>

      <svg viewBox="0 0 340 150" className="mx-auto w-full max-w-xl">
        {/* external target inputs */}
        <text x="12" y="16" fontFamily="monospace" fontSize="8" fill={t.faint as string}>{lang === 'hi' ? 'target inputs' : 'target inputs'}</text>
        {tin.map((lbl, i) => {
          const y = tin.length === 2 ? 36 + i * 30 : 52;
          return (
            <g key={lbl}>
              <line x1="12" y1={y} x2="72" y2={y} stroke={ACC.b} strokeWidth="2.5" />
              <text x="12" y={y - 5} fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.b}>{lbl}</text>
            </g>
          );
        })}
        {/* glue box */}
        <rect x="72" y="26" width="88" height="70" rx="10" fill={box} stroke={accent} strokeWidth="2.5" />
        <text x="116" y="48" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="800" fill={accent}>GLUE</text>
        <text x="116" y="62" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={t.faint as string}>combinational</text>
        {/* glue -> available FF inputs */}
        {ain.map((lbl, i) => {
          const y = ain.length === 2 ? 42 + i * 28 : 56;
          return (
            <g key={lbl}>
              <line x1="160" y1={y} x2="212" y2={y} stroke={accent} strokeWidth="2.5" />
              <text x="180" y={y - 4} fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>{lbl}</text>
            </g>
          );
        })}
        {/* available FF box */}
        <rect x="212" y="26" width="70" height="70" rx="10" fill={box} stroke={ACC.a} strokeWidth="2.5" />
        <text x="247" y="56" textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="800" fill={ACC.a}>{avail}</text>
        <text x="247" y="70" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={t.faint as string}>FF</text>
        {/* Q output */}
        <line x1="282" y1="48" x2="332" y2="48" stroke={ACC.good} strokeWidth="3" />
        <text x="320" y="42" fontFamily="monospace" fontSize="11" fontWeight="800" fill={ACC.good}>Q</text>
        {/* feedback path (only when the glue reads Q) */}
        {fb && (
          <>
            <path d="M305,48 V122 H116 V96" fill="none" stroke={ACC.good} strokeWidth="1.8" strokeDasharray="4 3" />
            <text x="150" y="118" fontFamily="monospace" fontSize="8" fill={ACC.good}>Q feedback</text>
          </>
        )}
      </svg>

      {/* glue equations */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {glue === null ? (
          <span className={`font-mono text-[12px] ${t.faint}`}>{lang === 'hi' ? 'इस set में नहीं — पर वही 4 step लागू' : 'not in this set — same 4 steps still apply'}</span>
        ) : glue === 'identity' ? (
          <span className="font-mono text-[13px] font-black" style={{ color: ACC.good }}>{lang === 'hi' ? 'एक ही FF — सीधा तार, कोई glue नहीं' : 'same FF — direct wire, no glue'}</span>
        ) : (
          (glue as Glue).eqs.map((e) => (
            <span key={e} className="rounded-lg px-3 py-1.5 font-mono text-[13px] font-black" style={{ background: `${accent}18`, color: accent }}>{e}</span>
          ))
        )}
      </div>
      {isConv && (
        <p className={`mt-2 text-center font-mono text-[12px] ${t.sub}`}>
          {fb
            ? (lang === 'hi' ? 'glue present state Q पढ़ता है — feedback चाहिए' : 'the glue reads present state Q — feedback needed')
            : (lang === 'hi' ? 'glue सिर्फ़ target inputs पढ़ता है — कोई feedback नहीं' : 'the glue reads only the target inputs — no feedback')}
        </p>
      )}

      {/* computed master conversion table proving the mapping */}
      {isConv && (
        <div className="mt-4">
          <StateTable isDarkMode={isDarkMode} accent={accent}
            headers={masterHeaders(avail, tgt)} rows={masterRows(avail, tgt)}
            note={lang === 'hi'
              ? "हर row: target का Q(t+1) निकाला, फिर available FF की excitation से inputs पढ़े (x = don't-care)"
              : "each row: target's Q(t+1) computed, then the available FF's excitation gives the inputs (x = don't-care)"} />
        </div>
      )}
    </Card>
  );
};

/* ═══════════════════════ bespoke: the general conversion model ═══════════════════════ */
const ConversionModel: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'conversion model · signal path' : 'conversion model · signal path'}
      </div>
      <svg viewBox="0 0 340 150" className="mx-auto w-full max-w-xl">
        {/* external target inputs X */}
        <text x="10" y="18" fontFamily="monospace" fontSize="8" fill={t.faint as string}>{lang === 'hi' ? 'target inputs X' : 'target inputs X'}</text>
        {[40, 66].map((y, i) => (
          <g key={y}>
            <line x1="12" y1={y} x2="86" y2={y} stroke={ACC.b} strokeWidth="2.5" />
            <text x="12" y={y - 5} fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.b}>X{i + 1}</text>
          </g>
        ))}
        {/* comb glue block */}
        <rect x="86" y="24" width="96" height="72" rx="12" fill={box} stroke={accent} strokeWidth="2.5" />
        <text x="134" y="52" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="800" fill={accent}>COMB.</text>
        <text x="134" y="66" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>GLUE</text>
        <text x="134" y="80" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={t.faint as string}>{lang === 'hi' ? 'no memory' : 'no memory'}</text>
        {/* glue -> available FF inputs */}
        <line x1="182" y1="46" x2="226" y2="46" stroke={accent} strokeWidth="2.5" />
        <line x1="182" y1="74" x2="226" y2="74" stroke={accent} strokeWidth="2.5" />
        <text x="196" y="40" fontFamily="monospace" fontSize="8" fill={t.faint as string}>{lang === 'hi' ? 'FF inputs' : 'FF inputs'}</text>
        {/* available FF */}
        <rect x="226" y="24" width="64" height="72" rx="12" fill={box} stroke={ACC.a} strokeWidth="2.5" />
        <text x="258" y="56" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill={ACC.a}>AVAIL.</text>
        <text x="258" y="70" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>FF</text>
        {/* Q out */}
        <line x1="290" y1="46" x2="332" y2="46" stroke={ACC.good} strokeWidth="3" />
        <text x="320" y="40" fontFamily="monospace" fontSize="11" fontWeight="800" fill={ACC.good}>Q</text>
        {/* present-state feedback */}
        <path d="M312,46 V126 H134 V96" fill="none" stroke={ACC.good} strokeWidth="1.8" strokeDasharray="4 3" />
        <text x="150" y="122" fontFamily="monospace" fontSize="8" fill={ACC.good}>{lang === 'hi' ? 'present state Q (जब चाहिए)' : 'present state Q (when needed)'}</text>
        {/* traveling pulse */}
        <motion.circle r="3.5" fill={ACC.b}
          animate={{ cx: [12, 86, 134, 226, 258, 290, 332], cy: [40, 40, 60, 46, 46, 46, 46], opacity: [0, 1, 1, 1, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
      </svg>
      <p className={`mt-2 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? "target inputs (+ ज़रूरत पर Q) → glue → available FF inputs → FF → Q. बाहर से यह target FF जैसा दिखता है।"
          : 'target inputs (+ Q when needed) → glue → available FF inputs → FF → Q. From outside it looks like the target FF.'}
      </p>
    </Card>
  );
};

/* ═══════════════════════ bespoke: excitation-table explorer (the blueprint) ═══════════════════════ */
const ExciteExplorer: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [avail, setAvail] = useState<FFType>('JK');
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'blueprint · available FF की excitation table' : 'the blueprint · available FF excitation table'}
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {FF_TYPES.map((f) => (
          <button key={f} onClick={() => setAvail(f)}
            className="rounded-lg px-3 py-1.5 font-mono text-[12px] font-black active:scale-90"
            style={avail === f ? { background: accent, color: '#000' } : { border: `1.5px solid ${accent}66`, color: accent }}>{f}</button>
        ))}
      </div>
      <ExciteTable isDarkMode={isDarkMode} accent={accent} type={avail} />
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>यह table हर transition Q(t) → Q(t+1) के लिए ज़रूरी <b style={{ color: accent }}>{FF_META[avail].inputs.join(', ')}</b> देती है — conversion का दिल।</>
          : <>this table gives the <b style={{ color: accent }}>{FF_META[avail].inputs.join(', ')}</b> needed for every transition Q(t) → Q(t+1) — the heart of conversion.</>}
      </p>
    </Card>
  );
};

/* ═══════════════════════ bespoke: the 4-step method pipeline ═══════════════════════
   Four clickable stages; each reveals the concrete, COMPUTED artifact for the
   JK -> D example so the abstract recipe is anchored to real values. */
const MethodPipeline: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [stage, setStage] = useState(0);
  const labels = lang === 'hi'
    ? ['1 · Identify', '2 · Master table', '3 · K-map', '4 · Realise']
    : ['1 · Identify', '2 · Master table', '3 · K-map', '4 · Realise'];

  const body = () => {
    switch (stage) {
      case 0:
        return (
          <div className="space-y-2 text-center">
            <p className={`text-[13.5px] ${t.sub}`}>
              {lang === 'hi'
                ? 'target = D (Q+ = D); available = JK (Q+ = J·Q\' + K\'·Q). दोनों equations लिखिए।'
                : "target = D (Q+ = D); available = JK (Q+ = J·Q' + K'·Q). Write both equations."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[13px] font-black">
              <span className="rounded-lg px-3 py-1.5" style={{ background: `${ACC.b}18`, color: ACC.b }}>D: Q+ = D</span>
              <span className="rounded-lg px-3 py-1.5" style={{ background: `${ACC.a}18`, color: ACC.a }}>JK: Q+ = J·Q' + K'·Q</span>
            </div>
          </div>
        );
      case 1:
        return (
          <StateTable isDarkMode={isDarkMode} accent={accent}
            headers={masterHeaders('JK', 'D')} rows={masterRows('JK', 'D')}
            note={lang === 'hi' ? "हर row: Q+ = D, फिर JK excitation से J,K (x = don't-care)" : "each row: Q+ = D, then JK excitation gives J,K (x = don't-care)"} />
        );
      case 2:
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KMap2 isDarkMode={isDarkMode} accent={accent} title="J  (of D, Q)" inLabel="D" cells={kcells('JK', 'D', 0)} result="J = D" />
            <KMap2 isDarkMode={isDarkMode} accent={accent} title="K  (of D, Q)" inLabel="D" cells={kcells('JK', 'D', 1)} result="K = D'" />
          </div>
        );
      default:
        return (
          <div className="space-y-2 text-center">
            <p className={`text-[13.5px] ${t.sub}`}>
              {lang === 'hi'
                ? "glue बनाइए: J = D (सीधा तार), K = D' (एक NOT)। कोई equation Q नहीं रखता → कोई feedback नहीं।"
                : "Build the glue: J = D (direct wire), K = D' (one NOT). No equation contains Q → no feedback."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[13px] font-black">
              <span className="rounded-lg px-3 py-1.5" style={{ background: `${accent}18`, color: accent }}>J = D</span>
              <span className="rounded-lg px-3 py-1.5" style={{ background: `${accent}18`, color: accent }}>K = D'</span>
              <span className="rounded-lg px-3 py-1.5" style={{ background: `${ACC.good}18`, color: ACC.good }}>{lang === 'hi' ? 'feed-forward' : 'feed-forward'}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? '4-step pipeline · stage चुनिए (JK → D)' : '4-step pipeline · click a stage (JK → D)'}
      </div>
      {/* the pipeline nodes */}
      <div className="mb-5 flex items-center justify-between gap-1">
        {labels.map((lbl, i) => (
          <React.Fragment key={i}>
            <button onClick={() => setStage(i)} className="flex flex-1 flex-col items-center gap-1.5 active:scale-95">
              <span className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-[13px] font-black transition-all"
                style={i <= stage
                  ? { background: accent, color: '#000', border: `2px solid ${accent}` }
                  : { background: 'transparent', color: accent, border: `2px solid ${accent}55` }}>{i + 1}</span>
              <span className="text-center font-mono text-[9px] font-bold leading-tight" style={{ color: i === stage ? accent : (t.faint as string) }}>
                {lbl.replace(/^\d+ · /, '')}
              </span>
            </button>
            {i < labels.length - 1 && <ArrowRight size={14} className="flex-shrink-0 opacity-40" style={{ color: i < stage ? accent : undefined }} />}
          </React.Fragment>
        ))}
      </div>
      <div className="min-h-[120px]">{body()}</div>
    </Card>
  );
};

/* ═══════════════════════ bespoke: JK -> D worked step-through ═══════════════════════ */
const JKtoDWorked: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const steps = [
    {
      label: lang === 'hi' ? 'Identify' : 'Identify',
      body: (
        <div className="space-y-3">
          <p className={`text-[13.5px] ${t.sub}`}>
            {lang === 'hi'
              ? "target = D flip-flop, Q(t+1) = D. available = JK flip-flop। इसकी excitation table blueprint है:"
              : 'target = D flip-flop, Q(t+1) = D. available = JK flip-flop. Its excitation table is the blueprint:'}
          </p>
          <ExciteTable isDarkMode={isDarkMode} accent={accent} type="JK" />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Master table' : 'Master table',
      body: (
        <div className="space-y-2">
          <p className={`text-[13.5px] ${t.sub}`}>
            {lang === 'hi'
              ? "हर (D, Q) के लिए Q(t+1) = D; फिर JK excitation से ज़रूरी J, K पढ़े — सब code में गिने:"
              : 'For each (D, Q), Q(t+1) = D; then read the required J, K from JK excitation — all computed:'}
          </p>
          <StateTable isDarkMode={isDarkMode} accent={accent}
            headers={masterHeaders('JK', 'D')} rows={masterRows('JK', 'D')} note="x = don't-care" />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'K-map' : 'K-map',
      body: (
        <div className="space-y-3">
          <p className={`text-[13.5px] ${t.sub}`}>
            {lang === 'hi'
              ? "J और K columns को (D, Q) पर K-map कीजिए। don't-cares मुफ़्त हैं और group को साफ़ कर देते हैं:"
              : "K-map the J and K columns over (D, Q). The don't-cares are free and clean the grouping:"}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KMap2 isDarkMode={isDarkMode} accent={accent} title="J-map" inLabel="D" cells={kcells('JK', 'D', 0)} result="J = D" />
            <KMap2 isDarkMode={isDarkMode} accent={accent} title="K-map" inLabel="D" cells={kcells('JK', 'D', 1)} result="K = D'" />
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Realise' : 'Realise',
      body: (
        <div className="space-y-2 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[15px] font-black">
            <span className="rounded-lg px-3 py-1.5" style={{ background: `${accent}18`, color: accent }}>J = D</span>
            <span className="rounded-lg px-3 py-1.5" style={{ background: `${accent}18`, color: accent }}>K = D'</span>
          </div>
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>D सीधे J से, D एक NOT से K तक। कोई Q नहीं ⇒ <b style={{ color: ACC.good }}>कोई feedback नहीं</b>. जाँच: J·Q' + K'·Q = D·Q' + D·Q = <b style={{ color: ACC.good }}>D</b>.</>
              : <>D straight to J, D through one NOT to K. No Q ⇒ <b style={{ color: ACC.good }}>no feedback</b>. Check: J·Q' + K'·Q = D·Q' + D·Q = <b style={{ color: ACC.good }}>D</b>.</>}
          </p>
        </div>
      ),
    },
  ];
  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ═══════════════════════ bespoke: JK -> D live circuit ═══════════════════════
   D wired to J directly and through a NOT (LiveGate) to K. Every value computed:
   the JK next state must equal D for both present states. */
const JKtoDCircuit: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [d, setD] = useState(1);
  const [q, setQ] = useState(0);
  const J = d;
  const K = d ^ 1;                                 // D'
  const jkNext = ffNext('JK', q, J, K);            // computed
  const dNext = ffNext('D', q, d);                 // target
  const ok = jkNext === dNext;
  const proof = [0, 1].map((qq) => {
    const jn = ffNext('JK', qq, d, d ^ 1);
    return [qq, d, d ^ 1, jn, ffNext('D', qq, d), jn === d ? '=' : '≠'];
  });

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'JK-as-D · live circuit' : 'JK-as-D · live circuit'}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        {/* wiring diagram: D -> J direct, D -> NOT -> K */}
        <svg viewBox="0 0 180 110" className="w-full max-w-[240px]">
          <line x1="4" y1="55" x2="30" y2="55" stroke={d ? ACC.a : dim} strokeWidth="3" />
          <text x="2" y="48" fontFamily="monospace" fontSize="11" fontWeight="800" fill={d ? ACC.a : dim}>D={d}</text>
          {/* J branch straight up */}
          <line x1="30" y1="55" x2="30" y2="30" stroke={J ? ACC.a : dim} strokeWidth="2.4" />
          <line x1="30" y1="30" x2="104" y2="30" stroke={J ? ACC.a : dim} strokeWidth="2.4" />
          <text x="66" y="24" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>J={J}</text>
          {/* K branch via NOT */}
          <line x1="30" y1="55" x2="44" y2="55" stroke={d ? ACC.a : dim} strokeWidth="2.4" />
          <path d="M44,46 L44,64 L60,55 Z" fill={box} stroke={accent} strokeWidth="2" />
          <circle cx="63" cy="55" r="3.5" fill={box} stroke={accent} strokeWidth="2" />
          <text x="52" y="76" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={dim}>NOT</text>
          <line x1="67" y1="55" x2="84" y2="55" stroke={K ? ACC.a : dim} strokeWidth="2.4" />
          <line x1="84" y1="55" x2="84" y2="80" stroke={K ? ACC.a : dim} strokeWidth="2.4" />
          <line x1="84" y1="80" x2="104" y2="80" stroke={K ? ACC.a : dim} strokeWidth="2.4" />
          <text x="74" y="94" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>K={K}</text>
          {/* JK box */}
          <rect x="104" y="18" width="48" height="74" rx="8" fill={box} stroke={ACC.a} strokeWidth="2.4" />
          <text x="128" y="52" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="800" fill={ACC.a}>JK</text>
          <text x="128" y="64" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={dim}>FF</text>
          <line x1="152" y1="34" x2="176" y2="34" stroke={jkNext ? ACC.good : dim} strokeWidth="3" />
          <text x="160" y="28" fontFamily="monospace" fontSize="9" fill={t.faint as string}>Q+={jkNext}</text>
        </svg>
        <div className="flex items-center gap-4">
          <Toggle label="D" v={d} onClick={() => setD(d ^ 1)} color={ACC.a} />
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>K = D'</span>
            <LiveGate type="NOT" a={d} isDarkMode={isDarkMode} accent={accent} labelA="D" labelOut="K" />
          </div>
          <Toggle label="Q(t)" v={q} onClick={() => setQ(q ^ 1)} color={ACC.good} />
        </div>
      </div>
      <div className="mt-4">
        <StateTable isDarkMode={isDarkMode} accent={accent}
          headers={['Q(t)', 'J', 'K', 'JK Q+', 'D Q+', '?']} rows={proof}
          note={lang === 'hi' ? "दोनों present states पर JK का Q+ = D — कोई feedback नहीं" : "for both present states JK's Q+ = D — no feedback"} />
      </div>
      <p className={`mt-3 flex items-center justify-center gap-2 text-center font-mono text-[13px] ${t.sub}`}>
        {ok ? <Check size={15} style={{ color: ACC.good }} /> : <X size={15} style={{ color: ACC.b }} />}
        {lang === 'hi'
          ? <>अभी: D={d}, Q={q} ⇒ JK Q+ = <b style={{ color: ACC.good }}>{jkNext}</b> = D. यह अब D flip-flop है.</>
          : <>now: D={d}, Q={q} ⇒ JK Q+ = <b style={{ color: ACC.good }}>{jkNext}</b> = D. It is now a D flip-flop.</>}
      </p>
    </Card>
  );
};

/* ═══════════════════════ bespoke: SR -> T worked step-through ═══════════════════════ */
const SRtoTWorked: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const steps = [
    {
      label: lang === 'hi' ? 'Identify' : 'Identify',
      body: (
        <div className="space-y-3">
          <p className={`text-[13.5px] ${t.sub}`}>
            {lang === 'hi'
              ? 'target = T flip-flop, Q(t+1) = T ⊕ Q. available = SR flip-flop। इसकी excitation table:'
              : 'target = T flip-flop, Q(t+1) = T ⊕ Q. available = SR flip-flop. Its excitation table:'}
          </p>
          <ExciteTable isDarkMode={isDarkMode} accent={accent} type="SR" />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Master table' : 'Master table',
      body: (
        <div className="space-y-2">
          <p className={`text-[13.5px] ${t.sub}`}>
            {lang === 'hi'
              ? 'हर (T, Q) के लिए Q(t+1) = T ⊕ Q; फिर SR excitation से S, R पढ़े — सब गिने:'
              : 'For each (T, Q), Q(t+1) = T ⊕ Q; then read S, R from SR excitation — all computed:'}
          </p>
          <StateTable isDarkMode={isDarkMode} accent={accent}
            headers={masterHeaders('SR', 'T')} rows={masterRows('SR', 'T')} note="x = don't-care" />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'K-map' : 'K-map',
      body: (
        <div className="space-y-3">
          <p className={`text-[13.5px] ${t.sub}`}>
            {lang === 'hi'
              ? 'S और R columns को (T, Q) पर K-map कीजिए। दोनों में Q बचता है ⇒ feedback अनिवार्य:'
              : 'K-map the S and R columns over (T, Q). Both keep Q ⇒ feedback is unavoidable:'}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KMap2 isDarkMode={isDarkMode} accent={accent} title="S-map" inLabel="T" cells={kcells('SR', 'T', 0)} result="S = T·Q'" />
            <KMap2 isDarkMode={isDarkMode} accent={accent} title="R-map" inLabel="T" cells={kcells('SR', 'T', 1)} result="R = T·Q" />
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Realise' : 'Realise',
      body: (
        <div className="space-y-2 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[15px] font-black">
            <span className="rounded-lg px-3 py-1.5" style={{ background: `${accent}18`, color: accent }}>S = T·Q'</span>
            <span className="rounded-lg px-3 py-1.5" style={{ background: `${accent}18`, color: accent }}>R = T·Q</span>
          </div>
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>दो AND gates; Q और Q' output से <b style={{ color: ACC.b }}>feedback</b>. S·R कभी 1·1 नहीं ⇒ forbidden state सुरक्षित.</>
              : <>Two AND gates; Q and Q' fed back from the output — <b style={{ color: ACC.b }}>feedback required</b>. S·R is never 1·1 ⇒ the forbidden state is safe.</>}
          </p>
        </div>
      ),
    },
  ];
  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ═══════════════════════ bespoke: SR -> T live circuit (feedback) ═══════════════════════
   Two AND gates S = T·Q', R = T·Q with Q / Q' fed back. Clock actually toggles Q so
   the SR pair is shown behaving as a T flip-flop. Every value computed. */
const SRtoTCircuit: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [T, setT] = useState(1);
  const [q, setQ] = useState(0);
  const qn = q ^ 1;                                 // Q' fed back
  const S = T & qn;                                 // T·Q'
  const R = T & q;                                  // T·Q
  const srNext = ffNext('SR', q, S, R);            // computed next state
  const tNext = ffNext('T', q, T);                 // target
  const ok = srNext === tNext;
  const tick = () => setQ((cur) => {
    const nx = ffNext('SR', cur, T & (cur ^ 1), T & cur);
    return nx === -1 ? cur : nx;
  });

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'SR-as-T · live circuit (feedback)' : 'SR-as-T · live circuit (feedback)'}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        {/* wiring with feedback */}
        <svg viewBox="0 0 200 120" className="w-full max-w-[260px]">
          {/* T input rail */}
          <line x1="4" y1="20" x2="60" y2="20" stroke={T ? ACC.b : dim} strokeWidth="2.6" />
          <text x="2" y="14" fontFamily="monospace" fontSize="10" fontWeight="800" fill={T ? ACC.b : dim}>T={T}</text>
          <line x1="20" y1="20" x2="20" y2="82" stroke={T ? ACC.b : dim} strokeWidth="2.2" />
          {/* AND-S */}
          <path d="M60,10 h12 a14,14 0 0 1 0,28 h-12 Z" fill={box} stroke={accent} strokeWidth="2.2" />
          <text x="64" y="28" fontFamily="monospace" fontSize="8" fill={accent}>&amp;</text>
          <line x1="86" y1="24" x2="120" y2="24" stroke={S ? accent : dim} strokeWidth="2.6" />
          <text x="96" y="18" fontFamily="monospace" fontSize="9" fill={t.faint as string}>S={S}</text>
          <line x1="20" y1="16" x2="60" y2="16" stroke={T ? ACC.b : dim} strokeWidth="2.2" />
          <line x1="44" y1="32" x2="60" y2="32" stroke={qn ? ACC.good : dim} strokeWidth="2.2" />
          <text x="30" y="30" fontFamily="monospace" fontSize="8" fill={qn ? ACC.good : dim}>Q'={qn}</text>
          {/* AND-R */}
          <path d="M60,72 h12 a14,14 0 0 1 0,28 h-12 Z" fill={box} stroke={accent} strokeWidth="2.2" />
          <text x="64" y="90" fontFamily="monospace" fontSize="8" fill={accent}>&amp;</text>
          <line x1="86" y1="86" x2="120" y2="86" stroke={R ? accent : dim} strokeWidth="2.6" />
          <text x="96" y="80" fontFamily="monospace" fontSize="9" fill={t.faint as string}>R={R}</text>
          <line x1="20" y1="78" x2="60" y2="78" stroke={T ? ACC.b : dim} strokeWidth="2.2" />
          <line x1="44" y1="94" x2="60" y2="94" stroke={q ? ACC.good : dim} strokeWidth="2.2" />
          <text x="30" y="98" fontFamily="monospace" fontSize="8" fill={q ? ACC.good : dim}>Q={q}</text>
          {/* SR box */}
          <rect x="120" y="30" width="46" height="50" rx="8" fill={box} stroke={ACC.a} strokeWidth="2.4" />
          <text x="143" y="52" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill={ACC.a}>SR</text>
          <text x="143" y="64" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={dim}>FF</text>
          <line x1="166" y1="48" x2="192" y2="48" stroke={q ? ACC.good : dim} strokeWidth="3" />
          <text x="176" y="42" fontFamily="monospace" fontSize="9" fill={ACC.good}>Q={q}</text>
          {/* feedback loop from Q back down and around to the ANDs */}
          <path d="M184,48 V112 H10 V34" fill="none" stroke={ACC.good} strokeWidth="1.6" strokeDasharray="4 3" />
          <text x="60" y="110" fontFamily="monospace" fontSize="7" fill={ACC.good}>Q, Q' feedback</text>
        </svg>
        <div className="flex items-center gap-3">
          <Toggle label="T" v={T} onClick={() => setT(T ^ 1)} color={ACC.b} />
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>S = T·Q'</span>
            <LiveGate type="AND" a={T} b={qn} isDarkMode={isDarkMode} accent={accent} labelA="T" labelB="Q'" labelOut="S" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>R = T·Q</span>
            <LiveGate type="AND" a={T} b={q} isDarkMode={isDarkMode} accent={accent} labelA="T" labelB="Q" labelOut="R" />
          </div>
        </div>
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 flex items-center justify-center gap-2 text-center font-mono text-[13px] ${t.sub}`}>
        {ok ? <Check size={15} style={{ color: ACC.good }} /> : <X size={15} style={{ color: ACC.b }} />}
        {lang === 'hi'
          ? <>T={T}, Q={q} ⇒ S={S}, R={R} ⇒ SR Q+ = <b style={{ color: ACC.good }}>{srNext}</b> = T⊕Q. {T ? 'हर tick पलटता है' : 'hold'}.</>
          : <>T={T}, Q={q} ⇒ S={S}, R={R} ⇒ SR Q+ = <b style={{ color: ACC.good }}>{srNext}</b> = T⊕Q. {T ? 'it toggles every tick' : 'it holds'}.</>}
      </p>
    </Card>
  );
};

/* ═══════════════════════ bespoke: universal conversion matrix explorer ═══════════════════════
   The full grid (target rows x available columns); click a cell to select the pair,
   see its glue equations, and render the COMPUTED master conversion table. */
const MatrixExplorer: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [sel, setSel] = useState<{ tgt: FFType; avail: FFType }>({ tgt: 'T', avail: 'SR' });
  const selGlue = glueFor(sel.tgt, sel.avail);

  const cellText = (tgt: FFType, avail: FFType): { text: string; kind: 'conv' | 'id' | 'none' } => {
    const g = glueFor(tgt, avail);
    if (g === 'identity') return { text: '—', kind: 'id' };
    if (g === null) return { text: '·', kind: 'none' };
    return { text: g.eqs.join(', '), kind: 'conv' };
  };

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'universal matrix · cell tap कीजिए' : 'universal matrix · tap a cell'}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center font-mono">
            <thead>
              <tr>
                <th className="px-2 py-2 text-[11px]" style={{ color: accent, borderBottom: `2px solid ${accent}55` }}>
                  {lang === 'hi' ? 'target ↓ / avail →' : 'target ↓ / avail →'}
                </th>
                {FF_TYPES.map((a) => (
                  <th key={a} className="px-2 py-2 text-[12px] font-black" style={{ color: ACC.a, borderBottom: `2px solid ${accent}55` }}>{a}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FF_TYPES.map((tgt) => (
                <tr key={tgt}>
                  <td className="px-2 py-2 text-[12px] font-black" style={{ color: ACC.b, borderTop: `1px solid ${accent}22` }}>{tgt}</td>
                  {FF_TYPES.map((avail) => {
                    const c = cellText(tgt, avail);
                    const on = sel.tgt === tgt && sel.avail === avail;
                    return (
                      <td key={avail} className="p-1" style={{ borderTop: `1px solid ${accent}22` }}>
                        <button
                          disabled={c.kind !== 'conv'}
                          onClick={() => setSel({ tgt, avail })}
                          className="w-full rounded-lg px-2 py-1.5 text-[10.5px] font-bold leading-tight transition-all"
                          style={c.kind === 'conv'
                            ? (on ? { background: accent, color: '#000' } : { background: `${accent}12`, color: accent, border: `1px solid ${accent}44` })
                            : { color: (t.faint as string), cursor: 'default' }}>
                          {c.text}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`mt-2 text-center font-mono text-[11px] ${t.faint}`}>
          {lang === 'hi' ? "— = वही FF (सीधा तार); · = इस set में नहीं" : '— = same FF (direct wire); · = not in this set'}
        </p>
      </Card>

      {selGlue !== null && selGlue !== 'identity' && (
        <Card isDarkMode={isDarkMode}>
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2 font-mono text-[13px] font-black">
            <span className="rounded-lg px-3 py-1.5" style={{ background: `${ACC.b}18`, color: ACC.b }}>{lang === 'hi' ? 'target' : 'target'} {sel.tgt}</span>
            <ArrowRight size={14} className="opacity-40" />
            <span className="rounded-lg px-3 py-1.5" style={{ background: `${ACC.a}18`, color: ACC.a }}>{lang === 'hi' ? 'from' : 'from'} {sel.avail}</span>
            {selGlue.eqs.map((e) => (
              <span key={e} className="rounded-lg px-3 py-1.5" style={{ background: `${accent}18`, color: accent }}>{e}</span>
            ))}
            <span className="rounded-lg px-3 py-1.5" style={{ background: selGlue.fb ? `${ACC.b}18` : `${ACC.good}18`, color: selGlue.fb ? ACC.b : ACC.good }}>
              {selGlue.fb ? (lang === 'hi' ? 'feedback' : 'feedback') : (lang === 'hi' ? 'no feedback' : 'no feedback')}
            </span>
          </div>
          <StateTable isDarkMode={isDarkMode} accent={accent}
            headers={masterHeaders(sel.avail, sel.tgt)} rows={masterRows(sel.avail, sel.tgt)}
            note={lang === 'hi' ? "master conversion table — हर cell code में गिना" : 'master conversion table — every cell computed in code'} />
        </Card>
      )}
    </div>
  );
};

/* ═══════════════════════ bespoke: the power-plug adapter analogy ═══════════════════════ */
const PlugAdapter: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [tgt, setTgt] = useState<FFType>('T');
  const [avail, setAvail] = useState<FFType>('SR');
  const glue = glueFor(tgt, avail);
  const isConv = glue !== 'identity' && glue !== null;
  const fb = isConv && (glue as Glue).fb;

  const picker = (label: string, val: FFType, set: (f: FFType) => void, color: string) => (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color }}>{label}</span>
      <div className="flex gap-1">
        {FF_TYPES.map((f) => (
          <button key={f} onClick={() => set(f)}
            className="rounded-lg px-2 py-1 font-mono text-[11px] font-black active:scale-90"
            style={val === f ? { background: color, color: '#000' } : { border: `1.5px solid ${color}66`, color }}>{f}</button>
        ))}
      </div>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-center gap-2">
        <Plug size={16} style={{ color: accent }} />
        <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
          {lang === 'hi' ? 'power-plug adapter' : 'power-plug adapter'}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-6">
        {picker(lang === 'hi' ? 'device · target' : 'device · target', tgt, setTgt, ACC.b)}
        {picker(lang === 'hi' ? 'wall · available' : 'wall · available', avail, setAvail, ACC.a)}
      </div>
      <svg viewBox="0 0 320 120" className="mx-auto w-full max-w-lg">
        {/* device plug (target) */}
        <rect x="14" y="40" width="52" height="40" rx="8" fill={box} stroke={ACC.b} strokeWidth="2.4" />
        <text x="40" y="58" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill={ACC.b}>{tgt}</text>
        <text x="40" y="72" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={t.faint as string}>{lang === 'hi' ? 'plug' : 'plug'}</text>
        <line x1="66" y1="52" x2="96" y2="52" stroke={ACC.b} strokeWidth="2.4" />
        <line x1="66" y1="68" x2="96" y2="68" stroke={ACC.b} strokeWidth="2.4" />
        {/* adapter (glue) */}
        <rect x="96" y="30" width="120" height="60" rx="12" fill={box} stroke={accent} strokeWidth="2.6" />
        <Cpu x={140} y={38} size={16} color={accent} />
        <text x="156" y="70" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>
          {isConv ? (glue as Glue).eqs[0] : (lang === 'hi' ? 'direct' : 'direct')}
        </text>
        {isConv && (glue as Glue).eqs[1] && (
          <text x="156" y="82" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>{(glue as Glue).eqs[1]}</text>
        )}
        {/* wall socket (available) */}
        <line x1="216" y1="52" x2="246" y2="52" stroke={ACC.a} strokeWidth="2.4" />
        <line x1="216" y1="68" x2="246" y2="68" stroke={ACC.a} strokeWidth="2.4" />
        <rect x="246" y="34" width="58" height="52" rx="8" fill={box} stroke={ACC.a} strokeWidth="2.4" />
        <text x="275" y="56" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="800" fill={ACC.a}>{avail}</text>
        <text x="275" y="70" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={t.faint as string}>{lang === 'hi' ? 'socket' : 'socket'}</text>
        {/* sensing (feedback) wire — lights only for feedback conversions */}
        {fb && (
          <>
            <path d="M290,86 V104 H156 V90" fill="none" stroke={ACC.good} strokeWidth="1.6" strokeDasharray="4 3" />
            <text x="196" y="100" fontFamily="monospace" fontSize="7" fill={ACC.good}>{lang === 'hi' ? 'Q sensing' : 'Q sensing'}</text>
          </>
        )}
        {/* power pulse */}
        <motion.circle r="3.5" fill={ACC.warn}
          animate={{ cx: [16, 96, 156, 246, 300], cy: [60, 60, 60, 60, 60], opacity: [0, 1, 1, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }} />
      </svg>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? <>power (behaviour) वही; socket (available FF) अलग; adapter = combinational glue. {fb ? <b style={{ color: ACC.good }}>यह present state Q भाँपता है।</b> : <b style={{ color: ACC.good }}>सिर्फ़ reshape, कोई sensing नहीं।</b>}</>
          : <>same power (behaviour), different socket (available FF); the adapter is the combinational glue. {fb ? <b style={{ color: ACC.good }}>It senses present state Q.</b> : <b style={{ color: ACC.good }}>A plain reshape, no sensing.</b>}</>}
      </p>
    </Card>
  );
};

/* ═══════════════════════ part assignment ═══════════════════════ */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE PROBLEM'
    : i <= Math.floor(n * 0.55) ? 'PART II · THE METHOD'
      : i < n - 3 ? 'PART III · MAKE IT REAL'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  switch (scene.id) {
    case 'S02_Facts': return 'facts';
    case 'S03_Method': return 'method';
    case 'S04_JKtoD': return 'jktod';
    case 'S05_SRtoT': return 'srtot';
    case 'S06_Matrix': return 'matrix';
    case 'S07_Analogy': return 'analogy';
    case 'S08_Build': return 'build';
    default: return null;
  }
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
        kicker="FF Conversions · The Adapter"
        hero={<ConversionMachine isDarkMode={p.isDarkMode} accent={p.accent} />} />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src={SRC_EN} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3">
            <Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}
          </section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => (
        <div className="relative">
          <TryItYourself corner />
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="CONV" tag="Practice · FF Conversions" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'facts' && (
            <div className="space-y-6">
              <TryItYourself />
              <ConversionModel isDarkMode={p.isDarkMode} accent={p.accent} />
              <FlipFlopViz isDarkMode={p.isDarkMode} accent={p.accent} type="JK" />
              <ExciteExplorer isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'method' && (
            <div className="space-y-6">
              <TryItYourself />
              <MethodPipeline isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'jktod' && (
            <div className="space-y-6">
              <TryItYourself />
              <JKtoDWorked isDarkMode={p.isDarkMode} accent={p.accent} />
              <JKtoDCircuit isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'srtot' && (
            <div className="space-y-6">
              <TryItYourself />
              <SRtoTWorked isDarkMode={p.isDarkMode} accent={p.accent} />
              <SRtoTCircuit isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'matrix' && (
            <div className="space-y-6">
              <TryItYourself />
              <MatrixExplorer isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <PlugAdapter isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="jk-to-d"
              titleEN="Build a JK -> D flip-flop for real"
              titleHI="असली में एक JK -> D flip-flop बनाइए"
              bodyEN="Open the live workbench and turn a JK flip-flop into a D flip-flop: wire D straight to J and D through one NOT gate to K, then prove Q(t+1)=D for every case - the whole adapter is one wire and one inverter."
              bodyHI="live workbench खोलिए और एक JK flip-flop को D flip-flop में बदलिए: D सीधे J से और D एक NOT gate से K तक wire कीजिए, फिर हर case के लिए Q(t+1)=D साबित कीजिए - पूरा adapter एक तार और एक inverter है।" />
          )}
        </TheoryScene>
      );
    }
  }
}

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i, arr) => ({
  id: slug(scene.id),
  part: partAt(i, arr.length),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene, i, arr.length),
}));
