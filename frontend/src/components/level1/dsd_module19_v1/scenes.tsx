/**
 * The 10's Complement (dsd/19) - "Discard, Don't Carry".
 * Generic scenes come from the shared kit; the radix-idea strip, the live 10's
 * subtractor (with an animated carry tossed in the bin), the two-case cards, the
 * 9's-vs-10's contrast and the hardware bridge are bespoke. Every value is
 * COMPUTED: 10's complement = 10^n - B; positive => discard carry; negative =>
 * re-complement + minus sign.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CornerLeftDown, Cpu, ArrowRight, Plus, Minus, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { CONTENT } from './content';

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };

const widthOf = (a: number, b: number) => Math.max(1, String(Math.max(a, b, 1)).length);
const toCells = (val: number, width: number) =>
  Array.from({ length: width }, (_, i) => Math.floor(val / 10 ** (width - 1 - i)) % 10);

const Cell: React.FC<{ d: number | string; color: string; bg?: string }> = ({ d, color, bg }) => (
  <span className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-lg font-black tabular-nums"
    style={{ color: bg ? '#000' : color, background: bg, border: bg ? undefined : `1.5px solid ${color}55` }}>{d}</span>
);

/* ───────── bespoke: the radix idea (S02) ───────── */
const RadixIdea: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const ex = [4, 7, 2];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="text-center font-mono text-lg font-black" style={{ color: accent }}>
        10's comp(B) = 10<sup>n</sup> - B = 9's comp(B) + 1
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {ex.map((d) => (
          <div key={d} className={`rounded-2xl border p-3 text-center ${t.soft}`}>
            <div className={`font-mono text-sm ${t.faint}`}>B = {d}</div>
            <div className="mt-1 font-mono text-2xl font-black" style={{ color: accent }}>{10 - d}</div>
            <div className={`mt-1 font-mono text-[11px] ${t.faint}`}>10 - {d}</div>
          </div>
        ))}
      </div>
      <p className={`mt-4 text-center text-[12px] ${t.faint}`}>
        {lang === 'hi' ? 'वह "+1" बाद के end-around carry की ज़रूरत मिटा देता है।' : 'That "+1" removes the need for any later end-around carry.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: live 10's subtractor (S03 activity) ───────── */
const TensCalc: React.FC<{ isDarkMode: boolean; accent: string; scene: SubScene }> = ({ isDarkMode, accent, scene }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [A, setA] = useState(7);
  const [B, setB] = useState(4);
  const a = Math.max(0, Math.min(99, A));
  const b = Math.max(0, Math.min(99, B));
  const width = widthOf(a, b);
  const modulus = 10 ** width;
  const comp = modulus - b;
  const rawSum = a + comp;
  const carry = rawSum >= modulus ? 1 : 0;
  const sumLow = toCells(rawSum % modulus, width);
  const finalVal = carry ? rawSum - modulus : modulus - rawSum;
  const sign = carry ? 1 : -1;
  const check = a - b;

  const NumIn: React.FC<{ label: string; val: number; set: (n: number) => void; color: string }> = ({ label, val, set, color }) => (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color }}>{label}</span>
      <input type="number" value={val} min={0} max={99} onChange={(e) => set(parseInt(e.target.value || '0', 10))}
        className={`w-24 rounded-xl border px-3 py-2 font-mono text-sm ${t.soft} ${t.text}`} />
    </label>
  );

  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{scene.label}</Eyebrow>
        {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${t.text}`}>{scene.subtitle}</h2>}
      </section>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-5 flex flex-wrap items-end gap-4">
          <NumIn label="A · minuend" val={a} set={setA} color={ACC.I} />
          <NumIn label="B · subtrahend" val={b} set={setB} color={ACC.II} />
          <div className="flex flex-wrap gap-2">
            {[['7 - 4', 7, 4], ['4 - 7', 4, 7], ['52 - 18', 52, 18]].map(([l, na, nb]) => (
              <button key={l as string} onClick={() => { setA(na as number); setB(nb as number); }}
                className={`rounded-lg border px-3 py-1.5 font-mono text-[12px] ${t.soft} ${t.sub} hover:opacity-80`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className={`w-44 font-mono text-[12px] ${t.faint}`}>10's comp of B = {modulus} - {b}</span>
            <div className="flex gap-1.5">{toCells(comp, width).map((d, i) => <Cell key={i} d={d} color={accent} />)}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`w-44 font-mono text-[12px] ${t.faint}`}>A</span>
            <div className="flex gap-1.5">{toCells(a, width).map((d, i) => <Cell key={i} d={d} color={ACC.I} />)}</div>
          </div>
          <div className="my-1 h-px w-full" style={{ background: `${accent}33` }} />
          <div className="flex items-center gap-3">
            <span className={`w-44 font-mono text-[12px] ${t.faint}`}>A + comp</span>
            <div className="flex items-center gap-1.5">
              <AnimatePresence>
                {carry === 1 && (
                  <motion.span key="carrycell" initial={{ scale: 1, opacity: 1 }} className="relative">
                    <Cell d={1} color={ACC.good} bg={`${ACC.good}`} />
                  </motion.span>
                )}
              </AnimatePresence>
              {sumLow.map((d, i) => <Cell key={i} d={d} color={t.ink as string} />)}
            </div>
          </div>
        </div>

        {/* resolution with animated discard / re-complement */}
        <AnimatePresence mode="wait">
          <motion.div key={carry ? 'pos' : 'neg'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`mt-5 flex items-center gap-3 rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${carry ? ACC.good : ACC.III}55` }}>
            {carry ? (
              <>
                <motion.span animate={{ x: [0, 6, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                  <Trash2 size={20} style={{ color: ACC.good }} />
                </motion.span>
                <p className={`text-[14px] ${t.sub}`}>
                  {lang === 'hi'
                    ? <><b style={{ color: ACC.good }}>carry = 1</b> -&gt; धनात्मक। carry को DISCARD कीजिए (कूड़े में)। बाक़ी ही जवाब है।</>
                    : <><b style={{ color: ACC.good }}>carry = 1</b> -&gt; positive. DISCARD the carry (into the bin). The rest is the answer.</>}
                </p>
              </>
            ) : (
              <>
                <span className="text-2xl font-black" style={{ color: ACC.III }}>-</span>
                <p className={`text-[14px] ${t.sub}`}>
                  {lang === 'hi'
                    ? <><b style={{ color: ACC.III }}>carry = 0</b> -&gt; ऋणात्मक। sum का 10's complement फिर से ({modulus} - {rawSum} = {modulus - rawSum}), minus लगाइए।</>
                    : <><b style={{ color: ACC.III }}>carry = 0</b> -&gt; negative. Re-complement the sum ({modulus} - {rawSum} = {modulus - rawSum}), attach a minus sign.</>}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <p className={`mt-5 text-center text-2xl font-black ${t.text}`}>
          {a} - {b} = <span style={{ color: carry ? ACC.good : ACC.III }}>{sign < 0 ? '-' : ''}{Math.abs(finalVal)}</span>
          <span className={`ml-2 align-middle font-mono text-base ${t.faint}`}>= {check}</span>
        </p>
      </Card>
    </SceneShell>
  );
};

/* ───────── bespoke: guided 5-step walkthrough (S03) ─────────
   Walks 7 - 4 (positive, discard the carry) and 4 - 7 (negative,
   re-complement + minus) one step at a time. Every value is COMPUTED. */
const TensWalkthrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [which, setWhich] = useState<'pos' | 'neg'>('pos');

  // one digit each, so modulus = 10
  const A = which === 'pos' ? 7 : 4;
  const B = which === 'pos' ? 4 : 7;
  const modulus = 10;                 // 10^n with n = 1
  const comp = modulus - B;           // 10's complement of B
  const rawSum = A + comp;            // ordinary addition
  const carry = rawSum >= modulus ? 1 : 0;
  const sumLow = rawSum % modulus;    // digits after the top carry is set aside
  const recomp = modulus - sumLow;    // 10's complement of the sum (negative case)
  const magnitude = carry ? sumLow : recomp;
  const signed = (carry ? 1 : -1) * magnitude;
  const check = A - B;
  const caseColor = carry ? ACC.good : ACC.III;

  // a small digit chip row
  const Chips: React.FC<{ val: number; color: string; bg?: boolean; lead?: number | null }> = ({ val, color, bg, lead }) => (
    <div className="flex items-center gap-1.5">
      {lead != null && (
        <Cell d={lead} color={ACC.good} bg={bg ? `${ACC.good}` : undefined} />
      )}
      <Cell d={val} color={color} bg={bg ? color : undefined} />
    </div>
  );

  const row = (label: string, node: React.ReactNode) => (
    <div className="flex items-center gap-3">
      <span className={`w-40 font-mono text-[12px] ${t.faint}`}>{label}</span>
      {node}
    </div>
  );

  const steps = [
    {
      label: lang === 'hi' ? '10\'s complement of B' : "Form 10's complement of B",
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>B = <b style={{ color: ACC.II }}>{B}</b> का 10's complement = 10<sup>n</sup> - B = {modulus} - {B} = <b style={{ color: accent }}>{comp}</b>.</>
              : <>10's complement of B = <b style={{ color: ACC.II }}>{B}</b> is 10<sup>n</sup> - B = {modulus} - {B} = <b style={{ color: accent }}>{comp}</b>.</>}
          </p>
          <div className={`rounded-2xl border p-4 ${t.soft}`}>
            {row('B', <Chips val={B} color={ACC.II} />)}
            {row(`${modulus} - ${B}`, <Chips val={comp} color={accent} />)}
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'A जोड़िए' : 'Add it to A',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>A - B को A + comp(B) में बदलिए: <b style={{ color: ACC.I }}>{A}</b> + <b style={{ color: accent }}>{comp}</b> = <b style={{ color: t.ink as string }}>{rawSum}</b>.</>
              : <>Turn A - B into A + comp(B): <b style={{ color: ACC.I }}>{A}</b> + <b style={{ color: accent }}>{comp}</b> = <b style={{ color: t.ink as string }}>{rawSum}</b>.</>}
          </p>
          <div className={`rounded-2xl border p-4 ${t.soft}`}>
            {row('A', <Chips val={A} color={ACC.I} />)}
            {row(`comp(${B})`, <Chips val={comp} color={accent} />)}
            <div className="my-2 h-px w-full" style={{ background: `${accent}33` }} />
            {row('A + comp', (
              <div className="flex items-center gap-1.5">
                {carry === 1 && <Cell d={1} color={ACC.good} bg={ACC.good} />}
                <Cell d={sumLow} color={t.ink as string} />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'carry जाँचिए' : 'Inspect the carry',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>ऊपर से carry निकला? <b style={{ color: caseColor }}>carry = {carry}</b>. {carry ? 'हाँ -> जवाब धनात्मक।' : 'नहीं -> जवाब ऋणात्मक।'}</>
              : <>Did a carry come out of the top? <b style={{ color: caseColor }}>carry = {carry}</b>. {carry ? 'Yes -> the answer is positive.' : 'No -> the answer is negative.'}</>}
          </p>
          <div className={`flex items-center gap-3 rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${caseColor}55` }}>
            <motion.span
              animate={carry ? { y: [0, -3, 0] } : { rotate: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}>
              {carry ? <CheckCircle2 size={20} style={{ color: ACC.good }} /> : <Minus size={20} style={{ color: ACC.III }} />}
            </motion.span>
            <span className={`text-[14px] font-bold ${t.text}`}>
              {carry
                ? (lang === 'hi' ? 'carry = 1 -> POSITIVE' : 'carry = 1 -> POSITIVE')
                : (lang === 'hi' ? 'carry = 0 -> NEGATIVE' : 'carry = 0 -> NEGATIVE')}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: carry
        ? (lang === 'hi' ? 'carry DISCARD कीजिए' : 'Discard the carry')
        : (lang === 'hi' ? 'फिर से complement + minus' : 'Re-complement + minus'),
      body: carry ? (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>ऊपरी carry <b style={{ color: ACC.good }}>1</b> को कूड़े में डाल दीजिए। कोई end-around carry नहीं। बचे digits ही जवाब हैं।</>
              : <>Drop the top carry <b style={{ color: ACC.good }}>1</b> in the bin. No end-around carry. The remaining digits are the answer.</>}
          </p>
          <div className={`flex items-center gap-3 rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${ACC.good}55` }}>
            <motion.span animate={{ x: [0, 6, 0], rotate: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Trash2 size={22} style={{ color: ACC.good }} />
            </motion.span>
            <div className="flex items-center gap-1.5">
              <motion.span animate={{ opacity: [1, 0.25, 1], scale: [1, 0.85, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} className="line-through">
                <Cell d={1} color={ACC.good} bg={ACC.good} />
              </motion.span>
              <ArrowRight size={16} style={{ color: t.faint as string }} />
              <Cell d={sumLow} color={ACC.good} bg={ACC.good} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>sum <b>{sumLow}</b> अब भी complement रूप में है। इसका 10's complement फिर से लीजिए: {modulus} - {sumLow} = <b style={{ color: ACC.III }}>{recomp}</b>, और आगे minus।</>
              : <>The sum <b>{sumLow}</b> is still in complement form. Re-complement it: {modulus} - {sumLow} = <b style={{ color: ACC.III }}>{recomp}</b>, then prepend a minus.</>}
          </p>
          <div className={`flex items-center gap-3 rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${ACC.III}55` }}>
            <motion.span animate={{ rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}>
              <RefreshCw size={20} style={{ color: ACC.III }} />
            </motion.span>
            <div className="flex items-center gap-1.5">
              <Cell d={sumLow} color={t.ink as string} />
              <ArrowRight size={16} style={{ color: t.faint as string }} />
              <span className="text-xl font-black" style={{ color: ACC.III }}>-</span>
              <Cell d={recomp} color={ACC.III} bg={ACC.III} />
            </div>
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'जवाब पढ़िए' : 'Read the answer',
      body: (
        <div className="space-y-3">
          <p className={`text-center text-3xl font-black ${t.text}`}>
            {A} - {B} = <span style={{ color: caseColor }}>{signed < 0 ? '-' : ''}{magnitude}</span>
          </p>
          <p className={`text-center font-mono text-[13px] ${t.faint}`}>
            {lang === 'hi' ? 'जाँच' : 'check'}: {A} - {B} = {check} {signed === check ? '✓' : ''}
          </p>
        </div>
      ),
    },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className={`text-[13px] ${t.faint}`}>
          {lang === 'hi' ? 'एक हालत चुनिए, फिर कदम-दर-कदम चलिए:' : 'Pick a case, then walk it step by step:'}
        </p>
        <div className="flex gap-2">
          {([['pos', '7 - 4', ACC.good], ['neg', '4 - 7', ACC.III]] as const).map(([k, l, c]) => (
            <button
              key={k}
              onClick={() => setWhich(k)}
              className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-bold transition-all"
              style={which === k
                ? { background: c, color: '#000', borderColor: c }
                : { borderColor: `${c}55`, color: c, background: 'transparent' }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      {/* remount on case switch so the walkthrough restarts at step 1 */}
      <StepThrough key={which} steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* the activity scene: the live sandbox plus the guided walkthrough below it */
const ActivityScene: React.FC<{ isDarkMode: boolean; accent: string; scene: SubScene }> = ({ isDarkMode, accent, scene }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <>
      <TensCalc isDarkMode={isDarkMode} accent={accent} scene={scene} />
      <SceneShell>
        <section className="space-y-3">
          <Eyebrow accent={accent}>{lang === 'hi' ? 'कदम-दर-कदम' : 'Step by step'}</Eyebrow>
          <h2 className={`text-2xl md:text-3xl font-black ${t.text}`}>
            {lang === 'hi' ? '7 - 4 और 4 - 7 कदम-दर-कदम' : '7 - 4 and 4 - 7, step by step'}
          </h2>
        </section>
        <TensWalkthrough isDarkMode={isDarkMode} accent={accent} />
      </SceneShell>
    </>
  );
};

/* ───────── bespoke: two cases (S04) ───────── */
const TwoCases: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const card = (title: string, body: string, work: string, color: string, icon: React.ReactNode) => (
    <div className={`flex-1 rounded-3xl border p-5 ${t.soft}`} style={{ borderColor: `${color}55` }}>
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color }}>{icon}{title}</div>
      <div className={`mt-3 text-[14px] ${t.text}`}>{body}</div>
      <div className={`mt-3 rounded-xl px-3 py-2 font-mono text-[13px] ${t.text}`} style={{ background: `${color}14` }}>{work}</div>
    </div>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-4 sm:flex-row">
        {card(
          lang === 'hi' ? 'Case 1 · carry = 1 · धनात्मक' : 'Case 1 · carry = 1 · positive',
          lang === 'hi' ? 'carry को discard कीजिए; बाक़ी digits ही जवाब हैं।' : 'Discard the carry; the remaining digits are the answer.',
          '7 - 4: comp(4)=6, 7+6=13, discard 1 -> 3', ACC.good, <Trash2 size={13} />,
        )}
        {card(
          lang === 'hi' ? 'Case 2 · carry = 0 · ऋणात्मक' : 'Case 2 · carry = 0 · negative',
          lang === 'hi' ? 'sum का फिर से 10\'s complement लीजिए, minus लगाइए।' : 'Re-complement the sum, attach a minus sign.',
          '4 - 7: comp(7)=3, 4+3=7, 10-7=3 -> -3', ACC.III, <span className="text-base font-black">-</span>,
        )}
      </div>
    </Card>
  );
};

/* ───────── bespoke: 9's vs 10's contrast (S05) ─────────
   Same subtraction through both systems, with an animated SVG carry: the 9's
   path loops the carry back to the bottom (end-around), the 10's path drops it
   into a bin (discard). Both land on the same answer. All values computed. */

/* small SVG showing the spilled carry digit either wrapping back or binned */
const CarryFate: React.FC<{ mode: 'wrap' | 'discard'; isDarkMode: boolean }> = ({ mode, isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const color = mode === 'wrap' ? ACC.I : ACC.good;
  const topLabel = mode === 'wrap'
    ? (lang === 'hi' ? '9 mirror + jod' : '9 mirror + add')
    : (lang === 'hi' ? '10 mirror + jod' : '10 mirror + add');
  const wrapLabel = lang === 'hi' ? 'end-around carry: 1 ko wapas jodiye' : 'end-around carry: add the 1 back';
  const discardLabel = lang === 'hi' ? 'discard: 1 ko bin me daliye' : 'discard: drop the 1 in the bin';
  return (
    <svg viewBox="0 0 220 110" className="h-auto w-full max-w-[260px]">
      {/* the adder top: a small box emitting a carry "1" */}
      <rect x="20" y="14" width="120" height="26" rx="6" fill="none" stroke={color} strokeWidth="2" />
      <text x="80" y="31" fontFamily="monospace" fontSize="11" fontWeight="700" fill={t.faint as string} textAnchor="middle">
        {topLabel}
      </text>
      {/* carry digit chip */}
      <motion.g
        animate={mode === 'wrap'
          ? { x: [0, 0, -8, -8], y: [0, 0, 50, 50] }
          : { x: [0, 0, 60, 60], y: [0, 0, 40, 40] }}
        transition={{ repeat: Infinity, duration: 2.4, times: [0, 0.3, 0.75, 1] }}>
        <rect x="146" y="14" width="22" height="22" rx="4" fill={color} />
        <text x="157" y="30" fontFamily="monospace" fontSize="13" fontWeight="800" fill="#000" textAnchor="middle">1</text>
      </motion.g>
      {mode === 'wrap' ? (
        <>
          {/* loop arrow back to bottom */}
          <path d="M168,25 q34,0 34,40 q0,28 -150,28 l-22,0" fill="none" stroke={ACC.I} strokeWidth="2" strokeDasharray="4 4" />
          <path d="M30,93 l8,-5 l0,10 z" fill={ACC.I} />
          <text x="110" y="104" fontFamily="monospace" fontSize="10" fontWeight="700" fill={ACC.I} textAnchor="middle">{wrapLabel}</text>
        </>
      ) : (
        <>
          {/* trash bin */}
          <rect x="196" y="58" width="20" height="24" rx="2" fill="none" stroke={ACC.good} strokeWidth="2" />
          <line x1="192" y1="58" x2="220" y2="58" stroke={ACC.good} strokeWidth="2" />
          <line x1="204" y1="50" x2="208" y2="50" stroke={ACC.good} strokeWidth="3" strokeLinecap="round" />
          <text x="120" y="104" fontFamily="monospace" fontSize="10" fontWeight="700" fill={ACC.good} textAnchor="middle">{discardLabel}</text>
        </>
      )}
    </svg>
  );
};

const CarryContrast: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const a = 7, b = 4, modulus = 10;
  // 9's path
  const comp9 = (modulus - 1) - b, sum9 = a + comp9, carry9 = sum9 >= modulus ? 1 : 0;
  const ans9 = carry9 ? (sum9 - modulus) + 1 : -((modulus - 1) - sum9);
  // 10's path
  const comp10 = modulus - b, sum10 = a + comp10, carry10 = sum10 >= modulus ? 1 : 0;
  const ans10 = carry10 ? (sum10 - modulus) : -(modulus - sum10);

  const panel = (
    title: string, comp: number, sum: number, mode: 'wrap' | 'discard',
    tail: React.ReactNode, ans: number, color: string,
  ) => (
    <div className={`flex-1 rounded-3xl border p-5 ${t.soft}`} style={{ borderColor: `${color}55` }}>
      <div className="font-mono text-[12px] font-black uppercase tracking-widest" style={{ color }}>{title}</div>
      <div className={`mt-3 space-y-1 font-mono text-[13px] ${t.text}`}>
        <div>comp({b}) = {comp}</div>
        <div>{a} + {comp} = {sum}</div>
        <div className="flex items-center gap-2">{tail}</div>
      </div>
      <div className="mt-4 flex justify-center"><CarryFate mode={mode} isDarkMode={isDarkMode} /></div>
      <div className="mt-3 text-center text-xl font-black" style={{ color }}>= {ans}</div>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <p className={`mb-4 text-center text-[13px] ${t.faint}`}>{lang === 'hi' ? 'एक ही subtraction: 7 - 4' : 'The same subtraction: 7 - 4'}</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        {panel(
          "9's · end-around", comp9, sum9, 'wrap',
          <><motion.span animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}><CornerLeftDown size={15} style={{ color: ACC.I }} /></motion.span>
            <span>{lang === 'hi' ? 'wrap karke' : 'wrap'}: {sum9 - modulus} + 1</span></>,
          ans9, ACC.I,
        )}
        {panel(
          "10's · discard", comp10, sum10, 'discard',
          <><motion.span animate={{ x: [0, 4, 0], rotate: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}><Trash2 size={15} style={{ color: ACC.good }} /></motion.span>
            <span>{lang === 'hi' ? '1 ko hatao' : 'discard the 1'}</span></>,
          ans10, ACC.good,
        )}
      </div>
      <div className={`mt-4 rounded-2xl border p-3 text-center ${t.soft}`}>
        <span className={`font-mono text-[13px] font-black ${t.text}`}>
          {ans9} {ans9 === ans10 ? '=' : '!='} {ans10}
        </span>
        <span className={`ml-2 text-[12px] ${t.faint}`}>
          {lang === 'hi' ? '(दोनों रास्ते एक ही जवाब पर)' : '(both paths, same answer)'}
        </span>
      </div>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi' ? 'दोनों एक ही जवाब देते हैं - फ़र्क़ सिर्फ़ carry के बर्ताव का है।' : 'Both give the same answer - the only difference is how the carry is treated.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: hardware bridge (S06) ─────────
   Block diagram + a step-by-step of how the 10's-complement generator
   (4-bit adder + XOR gates) actually builds 10^n - B. All bit math computed. */

/* 4-bit BCD example: build the 9's complement of B by XOR-ing each bit with 1,
   then the adder's carry-in of 1 upgrades it to the 10's complement.
   For a single BCD digit the diminished complement is 9 - B (bit-flip works
   because 9 = 1001 is not a full 4-bit mask, but for the analogy we show the
   per-bit XOR that the binary adder/XOR generator performs, then +1). */
const HwGenSteps: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const B = 4;
  const modulus = 10;
  const bits = (v: number) => [3, 2, 1, 0].map((k) => (v >> k) & 1);
  const bBits = bits(B);
  // diminished (9's-style) complement via per-bit XOR with the all-ones control
  const xorBits = bBits.map((x) => x ^ 1);
  const nines = modulus - 1 - B;       // = 5 for B = 4
  const tens = modulus - B;            // = 6, after the +1 carry-in

  const bitRow = (label: string, arr: number[], color: string) => (
    <div className="flex items-center gap-3">
      <span className={`w-28 font-mono text-[12px] ${t.faint}`}>{label}</span>
      <div className="flex gap-1.5">
        {arr.map((d, i) => (
          <span key={i} className="flex h-8 w-8 items-center justify-center rounded-md font-mono text-[15px] font-black"
            style={{ color, border: `1.5px solid ${color}55` }}>{d}</span>
        ))}
      </div>
    </div>
  );

  const steps = [
    {
      label: lang === 'hi' ? 'B को bits में लिखिए' : 'Write B in bits',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>B = <b style={{ color: ACC.II }}>{B}</b> को 4-bit में रखिए। यही generator का input है।</>
              : <>Place B = <b style={{ color: ACC.II }}>{B}</b> as 4 bits. This is the generator's input.</>}
          </p>
          <div className={`rounded-2xl border p-4 ${t.soft}`}>
            {bitRow('B', bBits, ACC.II)}
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'हर bit को XOR कीजिए' : 'XOR each bit',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>control = 1 के साथ हर bit को XOR करने से bits पलट जाते हैं -&gt; diminished (9's-शैली) complement = <b style={{ color: accent }}>{nines}</b>.</>
              : <>XOR every bit with control = 1 to flip it -&gt; the diminished (9's-style) complement = <b style={{ color: accent }}>{nines}</b>.</>}
          </p>
          <div className={`rounded-2xl border p-4 ${t.soft}`}>
            {bitRow('B', bBits, ACC.II)}
            {bitRow('control', [1, 1, 1, 1], ACC.III)}
            <div className="my-2 h-px w-full" style={{ background: `${accent}33` }} />
            {bitRow('B XOR 1', xorBits, accent)}
          </div>
          {/* one live XOR gate per bit so the flip is shown computing */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {bBits.map((bit, i) => (
              <div key={i} className="flex flex-col items-center">
                <LiveGate type="XOR" a={bit} b={1} isDarkMode={isDarkMode} accent={accent}
                  colorA={ACC.II} colorB={ACC.III} colorOut={accent} labelOut={`b${3 - i}`} />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'carry-in = 1 जोड़िए' : 'Add carry-in = 1',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>adder का carry-in = 1 वह "+1" डालता है: 9's comp ({nines}) + 1 = 10's comp = <b style={{ color: ACC.good }}>{tens}</b> = {modulus} - {B}.</>
              : <>The adder's carry-in = 1 injects the "+1": 9's comp ({nines}) + 1 = the 10's comp = <b style={{ color: ACC.good }}>{tens}</b> = {modulus} - {B}.</>}
          </p>
          <div className={`flex items-center gap-3 rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${ACC.good}55` }}>
            <span className={`font-mono text-[14px] ${t.text}`}>{nines}</span>
            <Plus size={16} style={{ color: ACC.good }} />
            <span className={`font-mono text-[14px] ${t.text}`}>1 (carry-in)</span>
            <ArrowRight size={16} style={{ color: t.faint as string }} />
            <span className="font-mono text-xl font-black" style={{ color: ACC.good }}>{tens}</span>
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'यही 10\'s complement है' : "That's the 10's complement",
      body: (
        <div className="space-y-2">
          <p className={`text-center text-2xl font-black ${t.text}`}>
            10<sup>n</sup> - {B} = <span style={{ color: ACC.good }}>{tens}</span>
          </p>
          <p className={`text-center text-[13px] ${t.faint}`}>
            {lang === 'hi'
              ? `बस XOR gates (bit-flip) + एक adder (carry-in से +1) = ${modulus} - ${B}.`
              : `Just XOR gates (the flip) + one adder (carry-in does the +1) = ${modulus} - ${B}.`}
          </p>
        </div>
      ),
    },
  ];

  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

const HardwareBridge: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const block = (title: string, sub: string, color: string) => (
    <div className={`flex-1 rounded-2xl border p-4 text-center ${t.card}`} style={{ borderColor: `${color}55` }}>
      <Cpu size={20} className="mx-auto" style={{ color }} />
      <div className={`mt-2 text-sm font-black ${t.text}`}>{title}</div>
      <div className={`mt-1 text-[11px] ${t.faint}`}>{sub}</div>
    </div>
  );
  return (
    <div className="space-y-6">
      <Card isDarkMode={isDarkMode}>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {block(lang === 'hi' ? "10's-comp generator" : "10's-comp generator", lang === 'hi' ? '1 adder + XOR gates' : '1 adder + XOR gates', ACC.II)}
          <ArrowRight className="rotate-90 sm:rotate-0" style={{ color: accent }} />
          {block('BCD adder', lang === 'hi' ? 'A + comp; sum > 9 हो तो +6' : 'A + comp; +6 when sum > 9', accent)}
        </div>
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
          className="mt-4 text-center text-[12px] font-black" style={{ color: accent }}>
          {lang === 'hi' ? 'अगला module: BCD adder और +6 odometer hack' : 'Next module: the BCD adder and the +6 odometer hack'}
        </motion.p>
      </Card>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Cpu size={14} style={{ color: ACC.II }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ACC.II }}>
            {lang === 'hi' ? 'अंदर झाँकिए: generator कैसे 10^n - B बनाता है' : "Inside the generator: how it builds 10^n - B"}
          </span>
        </div>
        <HwGenSteps isDarkMode={isDarkMode} accent={accent} />
      </div>
    </div>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number): string =>
  i <= 2 ? 'PART I · THE RADIX MIRROR'
    : i <= 5 ? 'PART II · THE METHOD'
      : 'PART III · WIRE IT UP';

const bespokeFor = (scene: SubScene): React.ReactNode => {
  const key = scene.id.toLowerCase();
  if (key.includes('radixidea')) return 'radix';
  if (key.includes('twocases')) return 'cases';
  if (key.includes('carrycontrast')) return 'contrast';
  if (key.includes('hardware')) return 'hardware';
  return null;
};

function componentFor(scene: SubScene): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="10's Complement" />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src="/videos/tens-complement-bcd.mp4" />;
    case 'activity':
      return (p) => <ActivityScene {...p} scene={scene} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3"><Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}</section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="10'S COMP" tag="Practice · 10's Complement" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'radix' && <RadixIdea isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'cases' && <TwoCases isDarkMode={p.isDarkMode} />}
          {which === 'contrast' && <CarryContrast isDarkMode={p.isDarkMode} />}
          {which === 'hardware' && <HardwareBridge isDarkMode={p.isDarkMode} accent={p.accent} />}
        </TheoryScene>
      );
    }
  }
}

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i) => ({
  id: slug(scene.id),
  part: partAt(i),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene),
}));
