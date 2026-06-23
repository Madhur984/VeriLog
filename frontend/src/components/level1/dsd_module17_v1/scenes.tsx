/**
 * Full Subtractor (dsd/17) - "The Digital Ledger" (personal finance).
 * x = wallet (minuend), y = bill (subtrahend), z = existing debt (borrow-in).
 * D = x⊕y⊕z (loose coins), Bout = x'y + x'z + yz (overdraft). Rebuilt so every
 * page carries an analogy visual (no transcript outside the video page): the
 * ledger variable map, half-vs-full, the processing block, the transaction log,
 * the interactive PARITY SCALE for D, the gate circuit and the live ledger.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, FileText, CreditCard, Coins, AlertTriangle, ArrowRight, ArrowLeft, Infinity as InfinityIcon, Brain, Calculator, Layers, CornerDownLeft, Sigma } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene, LiveGate,
  StepThrough,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { FullSubtractorCircuit } from '../_subtractor/circuit';
import { WorkbenchCTA } from '../_subtractor/kit';
import { CONTENT } from './content';

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', coins: '#34d399' };

const fullSub = (x: number, y: number, z: number) => ({
  D: x ^ y ^ z,
  B: ((~x & 1) & y) | ((~x & 1) & z) | (y & z),
});

/* ── bespoke: ledger variable map (S02) ── */
const LedgerVariableMap: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const row = (sym: string, role: string, desc: string, color: string, icon: React.ReactNode) => (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${color}44` }}>
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}1a`, color }}>{icon}</div>
      <div>
        <div className="font-mono text-sm font-black" style={{ color }}>{sym} = {role}</div>
        <div className={`mt-0.5 text-[12px] ${t.sub}`}>{desc}</div>
      </div>
    </div>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="grid gap-3 sm:grid-cols-3">
        {row('x', 'Wallet', lang === 'hi' ? 'Minuend - आपके पास मौजूद पैसा।' : 'Minuend - the money you currently have.', ACC.coins, <Wallet size={18} />)}
        {row('y', 'Bill', lang === 'hi' ? 'Subtrahend - अभी माँगा गया खर्च।' : 'Subtrahend - the cost requested right now.', ACC.II, <FileText size={18} />)}
        {row('z', 'Debt (Bin)', lang === 'hi' ? 'Borrow-in - पिछला उधार/याद।' : 'Borrow-in - memory of past debt.', ACC.III, <CreditCard size={18} />)}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {row('D', 'Difference', lang === 'hi' ? 'खुले पैसे या तुरंत की कमी।' : 'Loose coins, or the immediate shortfall.', ACC.coins, <Coins size={18} />)}
        {row('Bout', 'Borrow-out', lang === 'hi' ? 'Overdraft - अगले cycle का नया उधार।' : 'Overdraft - new debt for the next cycle.', ACC.III, <AlertTriangle size={18} />)}
      </div>
    </Card>
  );
};

/* ── bespoke: half vs full (S03) ── */
const HalfVsFull: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const col = (title: string, rows: [React.ReactNode, string, string][], color: string) => (
    <div className={`flex-1 rounded-3xl border p-5 ${t.soft}`} style={{ borderColor: `${color}55` }}>
      <div className="text-center font-mono text-[12px] font-black uppercase tracking-widest" style={{ color }}>{title}</div>
      <div className="mt-4 space-y-3">
        {rows.map(([icon, k, v], i) => (
          <div key={i} className="flex items-start gap-3">
            <span style={{ color }}>{icon}</span>
            <div><span className={`text-[12px] font-black ${t.text}`}>{k}: </span><span className={`text-[12px] ${t.sub}`}>{v}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-4 sm:flex-row">
        {col('The Half Subtractor', [
          [<Brain size={15} key="m" />, lang === 'hi' ? 'Memory' : 'Memory', lang === 'hi' ? 'भुलक्कड़ - पिछला debt नहीं सँभाल सकता।' : 'Amnesic - cannot process past debt.'],
          [<FileText size={15} key="s" />, lang === 'hi' ? 'Scope' : 'Scope', lang === 'hi' ? 'सिर्फ़ Wallet बनाम Bill।' : 'Wallet versus Current Bill only.'],
          [<span key="i" className="font-mono text-xs">xy</span>, lang === 'hi' ? 'Inputs' : 'Inputs', lang === 'hi' ? 'दो (x, y)।' : 'Two (x, y).'],
        ], ACC.I)}
        {col('The Full Subtractor', [
          [<InfinityIcon size={15} key="m" />, lang === 'hi' ? 'Memory' : 'Memory', lang === 'hi' ? 'लगातार - cascaded operations सँभालता है।' : 'Continuous - handles cascaded operations.'],
          [<CreditCard size={15} key="s" />, lang === 'hi' ? 'Scope' : 'Scope', lang === 'hi' ? 'Wallet बनाम Bill AND पिछला Debt।' : 'Wallet versus Bill AND Existing Debt.'],
          [<span key="i" className="font-mono text-xs">xyz</span>, lang === 'hi' ? 'Inputs' : 'Inputs', lang === 'hi' ? 'तीन (x, y, z)।' : 'Three (x, y, z).'],
        ], ACC.III)}
      </div>
    </Card>
  );
};

/* ── bespoke: processing block (S04) ── */
const ProcessingViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const chip = (icon: React.ReactNode, label: string, color: string) => (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${t.soft}`} style={{ borderColor: `${color}55` }}>
      <span style={{ color }}>{icon}</span><span className={`text-[12px] font-bold ${t.text}`}>{label}</span>
    </div>
  );
  const Flow = () => (
    <motion.div animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}><ArrowRight size={18} style={{ color: accent }} /></motion.div>
  );
  // step-by-step annotation rail under the block diagram
  const annot = (n: number, color: string, en: string, hi: string) => (
    <div className={`flex items-start gap-3 rounded-2xl border p-3 ${t.soft}`} style={{ borderColor: `${color}44` }}>
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-black text-black" style={{ background: color }}>{n}</span>
      <span className={`text-[12px] leading-relaxed ${t.sub}`}>{lang === 'hi' ? hi : en}</span>
    </div>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
        <div className="space-y-2">
          {chip(<Wallet size={15} />, 'x · Wallet', ACC.coins)}
          {chip(<FileText size={15} />, 'y · Bill', ACC.II)}
          {chip(<CreditCard size={15} />, 'z · Debt', ACC.III)}
        </div>
        <Flow />
        <div className="rounded-2xl border-2 px-6 py-5 text-center font-black" style={{ borderColor: accent, color: accent }}>
          FULL<br />SUBTRACTOR
        </div>
        <Flow />
        <div className="space-y-2">
          {chip(<Coins size={15} />, lang === 'hi' ? 'D · खुले पैसे' : 'D · loose coins', ACC.coins)}
          {chip(<AlertTriangle size={15} />, lang === 'hi' ? 'Bout · overdraft' : 'Bout · overdraft', ACC.III)}
        </div>
      </div>

      {/* step-by-step read-out: how the block turns 3 bits into 2 answers */}
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {annot(1, ACC.coins, 'Collect the three inputs of this column: wallet x, bill y, and old debt z.', 'इस column के तीनों inputs लीजिए: wallet x, bill y, और पुराना debt z।')}
        {annot(2, ACC.II, 'Settle the demands: pay the bill y and the old debt z out of the wallet x.', 'माँगें चुकाइए: wallet x में से bill y और पुराना debt z अदा कीजिए।')}
        {annot(3, ACC.coins, 'D = whatever coins remain in hand this column (the difference bit).', 'D = इस column में हाथ में बचे coins (difference bit)।')}
        {annot(4, ACC.III, 'Bout = 1 only if the wallet fell short, borrowing one unit from the next column.', 'Bout = 1 तभी जब wallet कम पड़ा और अगले column से एक unit उधार लिया।')}
      </div>
      <p className={`mt-4 rounded-2xl border px-4 py-3 text-center text-[13px] font-bold ${t.soft}`} style={{ borderColor: `${accent}33` }}>
        {lang === 'hi'
          ? <>"चुकाने के बाद मेरे पास <span style={{ color: ACC.coins }}>D</span> coins बचे, और मुझ पर अगले column का <span style={{ color: ACC.III }}>Bout</span> उधार है।"</>
          : <>"After paying, I keep <span style={{ color: ACC.coins }}>D</span> coins, and I owe <span style={{ color: ACC.III }}>Bout</span> to the next column."</>}
      </p>
    </Card>
  );
};

/* ── bespoke: transaction log scenarios (S05) ── */
const TransactionLog: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const cases: { x: number; y: number; z: number; en: string; hi: string; stepEN: string; stepHI: string }[] = [
    { x: 1, y: 0, z: 0, en: 'Funds, nothing owed', hi: 'पैसा है, कुछ देना नहीं',
      stepEN: 'Wallet has 1 unit, no bill and no debt -> keep the unit (D=1), nothing to borrow (Bout=0).',
      stepHI: 'Wallet में 1 unit, न bill न debt -> unit रख लिया (D=1), उधार कुछ नहीं (Bout=0)।' },
    { x: 1, y: 1, z: 0, en: 'Funds exactly match the bill', hi: 'पैसा बिल के बराबर',
      stepEN: 'Wallet 1 pays bill 1 exactly -> nothing left (D=0), no overdraft (Bout=0).',
      stepHI: 'Wallet 1 से bill 1 बिल्कुल चुका -> कुछ नहीं बचा (D=0), overdraft नहीं (Bout=0)।' },
    { x: 0, y: 1, z: 0, en: 'Empty wallet, a bill arrives', hi: 'खाली wallet, बिल आया',
      stepEN: 'Wallet 0 cannot pay bill 1 -> borrow one unit from the next column (Bout=1), pay leaves D=1.',
      stepHI: 'Wallet 0, bill 1 नहीं चुका सकता -> अगले column से एक unit उधार (Bout=1), चुकाने पर D=1।' },
    { x: 1, y: 1, z: 1, en: 'Must pay both bill and debt', hi: 'बिल और debt दोनों देने हैं',
      stepEN: 'Wallet 1 must cover bill 1 AND debt 1 -> one unit cannot cover two, borrow (Bout=1), D=1.',
      stepHI: 'Wallet 1 को bill 1 और debt 1 दोनों ढकने हैं -> एक unit दो को नहीं ढकता, उधार (Bout=1), D=1।' },
  ];
  const Bag: React.FC<{ on: number; icon: React.ReactNode; color: string }> = ({ on, icon, color }) => (
    <span style={{ color: on ? color : '#64748b', opacity: on ? 1 : 0.35 }}>{icon}</span>
  );
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cases.map((c, i) => {
        const { D, B } = fullSub(c.x, c.y, c.z);
        return (
          <div key={i} className={`rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: B ? `${ACC.III}55` : `${ACC.coins}44`, background: B ? `${ACC.III}0d` : `${ACC.coins}0a` }}>
            <div className="flex items-center gap-3">
              <Bag on={c.x} icon={<Wallet size={18} />} color={ACC.coins} />
              <Bag on={c.y} icon={<FileText size={18} />} color={ACC.II} />
              <Bag on={c.z} icon={<CreditCard size={18} />} color={ACC.III} />
              <div className="ml-auto flex gap-3 font-mono text-[13px]">
                <span style={{ color: ACC.coins }}>D={D}</span>
                <span style={{ color: B ? ACC.III : t.faint }}>Bout={B}</span>
              </div>
            </div>
            <div className={`mt-1 font-mono text-[11px] ${t.faint}`}>x={c.x} y={c.y} z={c.z}</div>
            <div className={`mt-2 text-[13px] ${t.sub}`}>{lang === 'hi' ? c.hi : c.en}</div>
            {/* step-by-step reasoning for this transaction */}
            <div className={`mt-2 flex items-start gap-2 rounded-xl border p-2.5 ${t.card}`}>
              <CornerDownLeft size={13} className="mt-0.5 flex-shrink-0" style={{ color: B ? ACC.III : ACC.coins }} />
              <span className={`text-[11.5px] leading-relaxed ${t.sub}`}>{lang === 'hi' ? c.stepHI : c.stepEN}</span>
            </div>
            <div className="mt-2 text-[11px] font-black" style={{ color: B ? ACC.III : ACC.coins }}>
              {B ? (lang === 'hi' ? 'OVERDRAFT' : 'OVERDRAFT') : (lang === 'hi' ? 'संतुलित' : 'SETTLED')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── bespoke: the Parity Scale + overdraft conditions (S07 logic, interactive) ── */
const LogicViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);
  const [z, setZ] = useState(0);
  const active = x + y + z;
  const { D, B } = fullSub(x, y, z);
  const nx = x ^ 1;
  // overdraft terms
  const t1 = nx & y, t2 = nx & z, t3 = y & z;

  const Toggle: React.FC<{ label: string; val: number; on: () => void; icon: React.ReactNode; color: string }> = ({ label, val, on, icon, color }) => (
    <button onClick={on} className={`flex flex-col items-center gap-1 rounded-2xl border px-4 py-3 active:scale-95 ${t.card}`}>
      <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest" style={{ color }}>{icon}{label}</span>
      <span className="text-2xl font-black tabular-nums" style={{ color: val ? color : t.faint }}>{val}</span>
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3">
        <Toggle label="x · wallet" val={x} on={() => setX((v) => v ^ 1)} icon={<Wallet size={12} />} color={ACC.coins} />
        <Toggle label="y · bill" val={y} on={() => setY((v) => v ^ 1)} icon={<FileText size={12} />} color={ACC.II} />
        <Toggle label="z · debt" val={z} on={() => setZ((v) => v ^ 1)} icon={<CreditCard size={12} />} color={ACC.III} />
      </div>

      {/* the parity scale */}
      <Card isDarkMode={isDarkMode}>
        <div className="text-center font-mono text-lg font-black" style={{ color: accent }}>D = x XOR y XOR z</div>
        <div className="relative mx-auto mt-4 h-28 w-64">
          {/* fulcrum */}
          <div className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2"
            style={{ borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: `26px solid ${accent}` }} />
          {/* beam tilts when D=1 (odd, imbalanced) */}
          <motion.div className="absolute left-1/2 top-6 h-1.5 w-56 -translate-x-1/2 rounded-full"
            style={{ background: D ? ACC.III : ACC.coins, transformOrigin: 'center' }}
            animate={{ rotate: D ? -11 : 0 }} transition={{ type: 'spring', stiffness: 120 }} />
          <motion.div className="absolute top-0 text-center" style={{ left: 8 }} animate={{ y: D ? 16 : 0 }} transition={{ type: 'spring', stiffness: 120 }}>
            <div className="text-2xl font-black" style={{ color: ACC.coins }}>{active}</div>
            <div className={`text-[9px] ${t.faint}`}>{lang === 'hi' ? 'active' : 'active'}</div>
          </motion.div>
        </div>
        <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
          {D
            ? (lang === 'hi' ? <><b style={{ color: ACC.III }}>विषम (odd)</b> active factors -&gt; scale झुका -&gt; D = 1।</> : <><b style={{ color: ACC.III }}>Odd</b> number of active factors -&gt; scale tips -&gt; D = 1.</>)
            : (lang === 'hi' ? <><b style={{ color: ACC.coins }}>सम (even)</b> active factors -&gt; scale संतुलित -&gt; D = 0।</> : <><b style={{ color: ACC.coins }}>Even</b> number of active factors -&gt; scale balances -&gt; D = 0.</>)}
        </p>
      </Card>

      {/* overdraft conditions */}
      <Card isDarkMode={isDarkMode}>
        <div className="text-center font-mono text-base font-black" style={{ color: ACC.III }}>Bout = x'y + x'z + yz</div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col items-center"><LiveGate type="AND" a={nx} b={y} isDarkMode={isDarkMode} accent={ACC.III} colorA={ACC.coins} colorB={ACC.II} colorOut={ACC.III} labelOut="x'y" /></div>
          <div className="flex flex-col items-center"><LiveGate type="AND" a={nx} b={z} isDarkMode={isDarkMode} accent={ACC.III} colorA={ACC.coins} colorB={ACC.III} colorOut={ACC.III} labelOut="x'z" /></div>
          <div className="flex flex-col items-center"><LiveGate type="AND" a={y} b={z} isDarkMode={isDarkMode} accent={ACC.III} colorA={ACC.II} colorB={ACC.III} colorOut={ACC.III} labelOut="yz" /></div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3 font-mono text-sm">
          <span className={t.sub}>{t1} + {t2} + {t3}</span>
          <span className={t.faint}>=</span>
          <motion.span key={B} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-2xl font-black" style={{ color: B ? ACC.III : ACC.coins }}>Bout = {B}</motion.span>
        </div>
        <p className={`mt-2 text-center text-[13px] ${t.sub}`}>
          {B
            ? (lang === 'hi' ? 'कोई एक शर्त सच -> overdraft बना, अगले column में।' : 'Any one condition true -> overdraft, carried to the next column.')
            : (lang === 'hi' ? 'कोई शर्त सच नहीं -> खाता संतुलित।' : 'No condition true -> the account is settled.')}
        </p>
      </Card>
    </div>
  );
};

/* ── bespoke: 8-row truth table (S06) ── */
const FullTruth: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const rows = [0, 1].flatMap((x) => [0, 1].flatMap((y) => [0, 1].map((z) => {
    const { D, B } = fullSub(x, y, z);
    return { cells: [x, y, z, D, B], highlight: B === 1 };
  })));
  return (
    <TruthTable isDarkMode={isDarkMode} accent={accent}
      headers={['x', 'y', 'z (Bin)', 'D', 'Bout']}
      rows={rows}
      note="Highlighted rows are 'overdraft' (Bout = 1): the wallet could not cover the bill plus the debt." />
  );
};

/* The two-half-subtractor schematic now lives in _subtractor/circuit.tsx as the
   clean, interactive FullSubtractorCircuit (z correctly wired into HALF SUB 2). */

/* ── bespoke: interactive ledger (S09 activity) ── */
const FullSubActivity: React.FC<{ isDarkMode: boolean; accent: string; scene: SubScene }> = ({ isDarkMode, accent, scene }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(1);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const { D, B } = fullSub(x, y, z);

  const Toggle: React.FC<{ label: string; val: number; on: () => void; icon: React.ReactNode }> = ({ label, val, on, icon }) => (
    <button onClick={on} className={`flex flex-col items-center gap-2 rounded-3xl border p-5 transition-all active:scale-95 ${t.card}`}>
      <div className="flex items-center gap-1.5 text-center font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>{icon}{label}</div>
      <div className="text-4xl font-black tabular-nums" style={{ color: val ? accent : undefined }}>{val}</div>
    </button>
  );

  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{scene.label}</Eyebrow>
        {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${t.text}`}>{scene.subtitle}</h2>}
      </section>

      <div className="grid grid-cols-3 gap-3 sm:max-w-xl sm:mx-auto">
        <Toggle label="Wallet (x)" val={x} on={() => setX((v) => v ^ 1)} icon={<Wallet size={12} />} />
        <Toggle label="Bill (y)" val={y} on={() => setY((v) => v ^ 1)} icon={<FileText size={12} />} />
        <Toggle label="Debt (z)" val={z} on={() => setZ((v) => v ^ 1)} icon={<CreditCard size={12} />} />
      </div>

      <Card isDarkMode={isDarkMode} className="text-center">
        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            <Coins size={30} style={{ color: ACC.coins }} />
            <motion.div key={`d${D}`} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-1 text-4xl font-black" style={{ color: ACC.coins }}>{D}</motion.div>
            <span className={`text-[11px] ${t.faint}`}>{lang === 'hi' ? 'Difference · खुले पैसे' : 'Difference · loose coins'}</span>
          </div>
          <div className="flex flex-col items-center">
            <motion.div animate={B ? { rotate: [0, -12, 12, 0] } : { rotate: 0 }} transition={{ repeat: B ? Infinity : 0, duration: 1, repeatDelay: 0.4 }}>
              <AlertTriangle size={30} style={{ color: B ? ACC.III : undefined }} className={B ? '' : 'opacity-30'} />
            </motion.div>
            <motion.div key={`b${B}`} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-1 text-4xl font-black" style={{ color: B ? ACC.III : undefined }}>{B}</motion.div>
            <span className={`text-[11px] ${t.faint}`}>{lang === 'hi' ? 'Borrow-out · overdraft' : 'Borrow-out · overdraft'}</span>
          </div>
          <AnimatePresence>
            {B === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: [0, 8, 0] }} exit={{ opacity: 0, x: 20 }}
                transition={{ x: { repeat: Infinity, duration: 1.4 } }} className="flex flex-col items-center">
                <ArrowRight size={26} style={{ color: ACC.III }} />
                <span className="text-[10px] font-black" style={{ color: ACC.III }}>{lang === 'hi' ? 'अगला column' : 'next column'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className={`mt-5 text-[14px] ${t.sub}`}>
          {B
            ? (lang === 'hi' ? 'Wallet, bill और debt को नहीं ढक पाया - overdraft बना, अगले column में जाएगा।' : 'The wallet could not cover the bill and the debt - an overdraft is created and carried to the next column.')
            : (lang === 'hi' ? 'कोई overdraft नहीं - खाता संतुलित है।' : 'No overdraft - the account is settled this column.')}
        </p>
      </Card>
    </SceneShell>
  );
};

/* ── bespoke: STEP-THROUGH one ledger column (wired onto S07 Logic) ── */
// Processes a single full-subtractor column the way the two-half-subtractor
// build does, step by step, with the student setting x, y, z. Every value is
// COMPUTED here (half-sub diff/borrow, OR of borrows), never hardcoded.
const halfSub = (a: number, b: number) => ({ d: a ^ b, b: (a ^ 1) & b }); // diff = a XOR b, borrow = a' AND b

const ColumnStepThrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);
  const [z, setZ] = useState(1);

  // computed intermediates (two half subtractors + OR)
  const h1 = halfSub(x, y);          // x - y
  const d1 = h1.d, b1 = h1.b;
  const h2 = halfSub(d1, z);         // (x-y) - z
  const D = h2.d, b2 = h2.b;
  const Bout = b1 | b2;
  const check = fullSub(x, y, z);    // sanity: must agree

  const Toggle: React.FC<{ label: string; val: number; on: () => void; icon: React.ReactNode; color: string }> = ({ label, val, on, icon, color }) => (
    <button onClick={on} className={`flex flex-col items-center gap-1 rounded-2xl border px-4 py-3 active:scale-95 ${t.card}`}>
      <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest" style={{ color }}>{icon}{label}</span>
      <span className="text-2xl font-black tabular-nums" style={{ color: val ? color : t.faint }}>{val}</span>
    </button>
  );

  const Bit: React.FC<{ v: number; color: string; label?: string }> = ({ v, color, label }) => (
    <span className="inline-flex flex-col items-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border font-mono text-lg font-black"
        style={{ borderColor: `${color}66`, color: v ? color : t.faint, background: v ? `${color}14` : 'transparent' }}>{v}</span>
      {label && <span className={`mt-1 font-mono text-[9px] ${t.faint}`}>{label}</span>}
    </span>
  );

  const steps = [
    {
      label: lang === 'hi' ? 'Inputs पढ़ें' : 'Read the inputs',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi'
            ? 'इस column के तीन bits: wallet x, bill y, और पुराना debt z (borrow-in)।'
            : 'The three bits of this column: wallet x, bill y, and old debt z (borrow-in).'}</p>
          <div className="flex items-end justify-center gap-5">
            <Bit v={x} color={ACC.coins} label="x" />
            <Bit v={y} color={ACC.II} label="y" />
            <Bit v={z} color={ACC.III} label="z" />
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'पहला half-sub: x - y' : 'First half-sub: x - y',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi'
            ? 'पहला half subtractor wallet में से bill घटाता है: diff1 = x XOR y, borrow1 = x′ AND y.'
            : 'The first half subtractor subtracts the bill from the wallet: diff1 = x XOR y, borrow1 = x′ AND y.'}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col items-center"><LiveGate type="XOR" a={x} b={y} isDarkMode={isDarkMode} accent={ACC.II} colorA={ACC.coins} colorB={ACC.II} colorOut={ACC.coins} labelOut="diff1" /></div>
            <div className="flex flex-col items-center"><LiveGate type="AND" a={x ^ 1} b={y} isDarkMode={isDarkMode} accent={ACC.III} colorA={ACC.coins} colorB={ACC.II} colorOut={ACC.III} labelOut="borrow1" /></div>
          </div>
          <div className="flex items-end justify-center gap-5">
            <Bit v={d1} color={ACC.coins} label="diff1" />
            <Bit v={b1} color={ACC.III} label="borrow1" />
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'दूसरा half-sub: diff1 - z' : 'Second half-sub: diff1 - z',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi'
            ? 'दूसरा half subtractor उस diff1 में से पुराना debt z घटाता है: D = diff1 XOR z, borrow2 = diff1′ AND z.'
            : 'The second half subtractor subtracts the old debt z from diff1: D = diff1 XOR z, borrow2 = diff1′ AND z.'}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col items-center"><LiveGate type="XOR" a={d1} b={z} isDarkMode={isDarkMode} accent={ACC.coins} colorA={ACC.coins} colorB={ACC.III} colorOut={ACC.coins} labelOut="D" /></div>
            <div className="flex flex-col items-center"><LiveGate type="AND" a={d1 ^ 1} b={z} isDarkMode={isDarkMode} accent={ACC.III} colorA={ACC.coins} colorB={ACC.III} colorOut={ACC.III} labelOut="borrow2" /></div>
          </div>
          <div className="flex items-end justify-center gap-5">
            <Bit v={D} color={ACC.coins} label="D" />
            <Bit v={b2} color={ACC.III} label="borrow2" />
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'दोनों borrows को OR करें' : 'OR the two borrows',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi'
            ? 'किसी एक half subtractor ने भी उधार लिया तो column overdraft में है: Bout = borrow1 OR borrow2.'
            : 'If either half subtractor borrowed, the column is in overdraft: Bout = borrow1 OR borrow2.'}</p>
          <div className="flex flex-col items-center"><LiveGate type="OR" a={b1} b={b2} isDarkMode={isDarkMode} accent={ACC.III} colorA={ACC.III} colorB={ACC.III} colorOut={ACC.III} labelOut="Bout" /></div>
          <div className="flex items-end justify-center gap-5">
            <Bit v={b1} color={ACC.III} label="borrow1" />
            <span className={`pb-2 font-mono text-lg ${t.faint}`}>OR</span>
            <Bit v={b2} color={ACC.III} label="borrow2" />
            <span className={`pb-2 font-mono text-lg ${t.faint}`}>=</span>
            <Bit v={Bout} color={ACC.III} label="Bout" />
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'D और Bout पढ़ें' : 'Read D and Bout',
      body: (
        <div className="space-y-3">
          <p className={`text-[13px] ${t.sub}`}>{lang === 'hi'
            ? 'column का अंतिम जवाब: difference D और borrow-out Bout। यह पूरे full-subtractor formula से मेल खाता है।'
            : 'The column’s final answer: difference D and borrow-out Bout. It matches the full-subtractor formula exactly.'}</p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <Coins size={26} style={{ color: ACC.coins }} />
              <div className="mt-1 text-3xl font-black" style={{ color: ACC.coins }}>{D}</div>
              <span className={`text-[10px] ${t.faint}`}>D · {lang === 'hi' ? 'खुले पैसे' : 'loose coins'}</span>
            </div>
            <div className="flex flex-col items-center">
              <AlertTriangle size={26} style={{ color: Bout ? ACC.III : t.faint }} className={Bout ? '' : 'opacity-30'} />
              <div className="mt-1 text-3xl font-black" style={{ color: Bout ? ACC.III : t.faint }}>{Bout}</div>
              <span className={`text-[10px] ${t.faint}`}>Bout · {lang === 'hi' ? 'overdraft' : 'overdraft'}</span>
            </div>
          </div>
          <div className={`rounded-xl border px-3 py-2 text-center font-mono text-[11px] ${t.soft}`}
            style={{ borderColor: `${accent}33`, color: check.D === D && check.B === Bout ? ACC.coins : ACC.III }}>
            {lang === 'hi' ? 'सत्यापन' : 'check'}: x⊕y⊕z = {check.D}, x′y+x′z+yz = {check.B}
            {' '}{check.D === D && check.B === Bout ? '✓' : '✗'}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-3">
        <Toggle label="x · wallet" val={x} on={() => setX((v) => v ^ 1)} icon={<Wallet size={12} />} color={ACC.coins} />
        <Toggle label="y · bill" val={y} on={() => setY((v) => v ^ 1)} icon={<FileText size={12} />} color={ACC.II} />
        <Toggle label="z · debt" val={z} on={() => setZ((v) => v ^ 1)} icon={<CreditCard size={12} />} color={ACC.III} />
      </div>
      <p className={`text-center text-[12px] ${t.faint}`}>
        {lang === 'hi' ? 'x, y, z set कीजिए, फिर एक-एक step आगे बढ़िए।' : 'Set x, y, z, then walk one step at a time.'}
      </p>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </div>
  );
};

/* ── bespoke: MULTI-BIT 4-bit RIPPLE subtractor (wired onto S08 Circuit) ── */
// Subtracts two 4-bit numbers column by column with the FULL-subtractor logic,
// animating how each column's borrow-out CHAINS into the next column's
// borrow-in. Makes concrete why a borrow-in input (a full subtractor) is needed.
const RippleSubtractor4Bit: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [A, setA] = useState(0b1001); // 9
  const [B, setB] = useState(0b0011); // 3
  const [col, setCol] = useState(0);  // active column index 0..3 (LSB first)

  const bitsOf = (n: number) => [3, 2, 1, 0].map((i) => (n >> i) & 1); // MSB..LSB
  const aBits = bitsOf(A), bBits = bitsOf(B);

  // ripple from LSB (pos 0) to MSB (pos 3); the borrow chains forward
  const cols: { x: number; y: number; bin: number; D: number; bout: number }[] = [];
  let borrow = 0;
  for (let pos = 0; pos < 4; pos++) {
    const x = (A >> pos) & 1;
    const y = (B >> pos) & 1;
    const { D, B: bout } = fullSub(x, y, borrow);
    cols.push({ x, y, bin: borrow, D, bout });
    borrow = bout;
  }
  const finalBorrow = borrow;
  const diffVal = cols.reduce((acc, c, pos) => acc + (c.D << pos), 0);
  const trueDiff = A - B; // signed reference

  // active column counts from LSB: col 0 = pos 0
  const activePos = Math.min(col, 3);
  const cur = cols[activePos];

  const stepCol = (label: string, value: number, color: string, on: boolean) => (
    <span className="inline-flex flex-col items-center">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-base font-black"
        style={{ borderColor: on ? color : `${color}44`, color: value ? color : t.faint, background: on ? `${color}1a` : 'transparent' }}>{value}</span>
      <span className={`mt-0.5 font-mono text-[8px] ${t.faint}`}>{label}</span>
    </span>
  );

  const Row: React.FC<{ label: string; bits: number[]; color: string; lead?: React.ReactNode }> = ({ label, bits, color, lead }) => (
    <div className="flex items-center gap-2">
      <span className={`w-16 text-right font-mono text-[11px] ${t.faint}`}>{label}</span>
      <span className="w-6">{lead}</span>
      {bits.map((b, i) => {
        const pos = 3 - i; // bits array is MSB..LSB
        const on = pos === activePos;
        return (
          <span key={i} className="flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-lg font-black"
            style={{ borderColor: on ? `${accent}` : `${color}33`, color: b ? color : t.faint, background: on ? `${accent}1a` : 'transparent' }}>{b}</span>
        );
      })}
    </div>
  );

  // borrow chain row (one borrow-in per column, MSB..LSB display)
  const binRow = [3, 2, 1, 0].map((pos) => cols[pos].bin);
  const diffBits = [3, 2, 1, 0].map((pos) => cols[pos].D);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-center gap-2">
        <Layers size={16} style={{ color: accent }} />
        <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
          {lang === 'hi' ? '4-bit ripple: A - B' : '4-bit ripple: A - B'}
        </span>
      </div>

      {/* number pickers */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-6">
        {([['A', A, setA, ACC.coins], ['B', B, setB, ACC.II]] as const).map(([nm, val, set, color]) => (
          <div key={nm} className="flex items-center gap-2">
            <span className="font-mono text-sm font-black" style={{ color }}>{nm} = {val}</span>
            <button onClick={() => { set((v) => (v + 15) % 16); setCol(0); }}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border ${t.soft}`} aria-label="decrement">-</button>
            <span className="font-mono text-sm tabular-nums" style={{ minWidth: 28 }}>{val.toString(2).padStart(4, '0')}</span>
            <button onClick={() => { set((v) => (v + 1) % 16); setCol(0); }}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border ${t.soft}`} aria-label="increment">+</button>
          </div>
        ))}
      </div>

      {/* the columnar subtraction grid */}
      <div className={`rounded-2xl border p-4 ${t.soft}`}>
        {/* borrow-in chain on top */}
        <div className="flex items-center gap-2">
          <span className={`w-16 text-right font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'borrow' : 'borrow'}</span>
          <span className="w-6" />
          {binRow.map((b, i) => {
            const pos = 3 - i;
            const on = pos === activePos;
            return stepCol('bin', b, ACC.III, on);
          })}
        </div>
        <Row label="A (x)" bits={aBits} color={ACC.coins} />
        <Row label="B (y)" bits={bBits} color={ACC.II} lead={<span className="font-mono text-lg" style={{ color: ACC.II }}>-</span>} />
        <div className="my-2 ml-[88px] h-px" style={{ background: `${accent}44` }} />
        <Row label={lang === 'hi' ? 'D (diff)' : 'D (diff)'} bits={diffBits} color={ACC.coins} />
        {finalBorrow === 1 && (
          <div className={`mt-2 flex items-center gap-2 text-[12px] font-bold`} style={{ color: ACC.III }}>
            <AlertTriangle size={14} />
            {lang === 'hi'
              ? 'अंतिम borrow-out = 1: A < B, यानी जवाब negative है (4 bits में wrap हो गया)।'
              : 'Final borrow-out = 1: A < B, so the true answer is negative (it wrapped in 4 bits).'}
          </div>
        )}
      </div>

      {/* borrow chaining animation: highlight current column */}
      <div className="mt-5 flex items-center justify-center gap-1">
        {[0, 1, 2, 3].map((pos) => (
          <React.Fragment key={pos}>
            <button onClick={() => setCol(pos)}
              className="flex flex-col items-center rounded-xl border px-2 py-1.5"
              style={{ borderColor: pos === activePos ? accent : (isDarkMode ? '#1e293b' : '#e2e8f0'), background: pos === activePos ? `${accent}14` : 'transparent' }}>
              <span className={`font-mono text-[9px] ${t.faint}`}>col {pos}</span>
              <span className="font-mono text-[11px] font-black" style={{ color: cols[pos].bout ? ACC.III : ACC.coins }}>
                bout={cols[pos].bout}
              </span>
            </button>
            {pos < 3 && (
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ color: cols[pos].bout ? ACC.III : t.faint }}>
                <ArrowLeft size={14} />
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* per-column read-out for the active column, computed live */}
      <div className={`mt-4 rounded-2xl border p-4 ${t.card}`}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
            {lang === 'hi' ? `column ${activePos} (वज़न 2^${activePos})` : `column ${activePos} (weight 2^${activePos})`}
          </span>
          <span className={`font-mono text-[11px] ${t.faint}`}>x={cur.x} y={cur.y} bin={cur.bin}</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          {stepCol('x', cur.x, ACC.coins, true)}
          <span className={`font-mono text-base ${t.faint}`}>-</span>
          {stepCol('y', cur.y, ACC.II, true)}
          <span className={`font-mono text-base ${t.faint}`}>-</span>
          {stepCol('bin', cur.bin, ACC.III, true)}
          <span className={`font-mono text-base ${t.faint}`}>=</span>
          {stepCol('D', cur.D, ACC.coins, true)}
          <span className={`font-mono text-[10px] ${t.faint}`}>,</span>
          {stepCol('bout', cur.bout, ACC.III, true)}
        </div>
        <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
          {cur.bout
            ? (lang === 'hi'
              ? <>इस column में wallet कम पड़ा -&gt; <b style={{ color: ACC.III }}>borrow-out 1</b> अगले (बाएँ) column का borrow-in बन जाता है। यही chaining है।</>
              : <>This column fell short -&gt; its <b style={{ color: ACC.III }}>borrow-out 1</b> becomes the next (left) column’s borrow-in. That is the chaining.</>)
            : (lang === 'hi'
              ? <>इस column में कोई उधार नहीं -&gt; अगले column का borrow-in <b style={{ color: ACC.coins }}>0</b> रहता है।</>
              : <>No borrow here -&gt; the next column’s borrow-in stays <b style={{ color: ACC.coins }}>0</b>.</>)}
        </p>
      </div>

      {/* result line, computed */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-[13px]">
        <Calculator size={15} style={{ color: accent }} />
        <span className={t.sub}>{A} - {B} =</span>
        <span className="font-black" style={{ color: finalBorrow ? ACC.III : ACC.coins }}>
          {trueDiff} ({lang === 'hi' ? '4-bit नतीजा' : '4-bit result'} {diffVal.toString(2).padStart(4, '0')} = {diffVal})
        </span>
        <Sigma size={14} className="opacity-40" />
      </div>
      <p className={`mt-2 text-center text-[12px] ${t.faint}`}>
        {lang === 'hi'
          ? 'हर column एक FULL subtractor है: borrow-in के बिना यह chaining असंभव है - इसीलिए borrow-in input ज़रूरी है।'
          : 'Every column is a FULL subtractor: without a borrow-in this chaining is impossible - that is exactly why the borrow-in input exists.'}
      </p>
    </Card>
  );
};

/* ── section wrappers (own the hook so the eyebrow label localises) ── */
const ColumnStepSection: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <div className="space-y-3 pt-2">
      <Eyebrow accent={accent}>{lang === 'hi' ? 'एक column, step by step' : 'One column, step by step'}</Eyebrow>
      <p className={`text-[14px] ${t.sub}`}>
        {lang === 'hi'
          ? 'x, y, z चुनिए और देखिए कि दो half subtractors + एक OR एक ledger column को कैसे हल करते हैं।'
          : 'Pick x, y, z and watch two half subtractors + one OR solve a single ledger column.'}
      </p>
      <ColumnStepThrough isDarkMode={isDarkMode} accent={accent} />
    </div>
  );
};

const RippleSection: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <div className="space-y-3 pt-2">
      <Eyebrow accent={accent}>{lang === 'hi' ? 'कई bits: borrow का chaining' : 'Many bits: the borrow chain'}</Eyebrow>
      <p className={`text-[14px] ${t.sub}`}>
        {lang === 'hi'
          ? 'दो 4-bit numbers घटाइए। हर column का borrow-out अगले column का borrow-in बनता है - इसीलिए full subtractor चाहिए।'
          : 'Subtract two 4-bit numbers. Each column’s borrow-out becomes the next column’s borrow-in - which is why a full subtractor is needed.'}
      </p>
      <RippleSubtractor4Bit isDarkMode={isDarkMode} accent={accent} />
    </div>
  );
};

const partAt = (i: number): string =>
  i <= 3 ? 'PART I · THE LEDGER'
    : i <= 8 ? 'PART II · THE MECHANISM'
      : 'PART III · PROVE IT';

const bespokeFor = (scene: SubScene): string | null => {
  const k = scene.id.toLowerCase();
  if (k.includes('variables')) return 'vars';
  if (k.includes('halfvsfull')) return 'halfvsfull';
  if (k.includes('processing')) return 'processing';
  if (k.includes('logic')) return 'logic';
  return null;
};

function componentFor(scene: SubScene): React.FC<any> {
  const id = scene.id.toLowerCase();
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Full Subtractor" />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src="/videos/full-subtractor.mp4" />;
    case 'truth':
      // two 'truth' scenes: the transaction log (scenarios) and the rigorous table
      if (id.includes('transaction')) return (p) => <TheoryScene {...p} scene={scene}><TransactionLog isDarkMode={p.isDarkMode} /></TheoryScene>;
      return (p) => <TheoryScene {...p} scene={scene}><FullTruth isDarkMode={p.isDarkMode} accent={p.accent} /></TheoryScene>;
    case 'circuit':
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          <FullSubtractorCircuit isDarkMode={p.isDarkMode} accent={p.accent} />
          <RippleSection isDarkMode={p.isDarkMode} accent={p.accent} />
          <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="full-subtractor"
            titleEN="Build the full subtractor for real" titleHI="असली में full subtractor बनाइए" />
        </TheoryScene>
      );
    case 'activity':
      return (p) => <FullSubActivity {...p} scene={scene} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3"><Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}</section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="FULL SUB" tag="Practice · Full Subtractor" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'vars' && <LedgerVariableMap isDarkMode={p.isDarkMode} />}
          {which === 'halfvsfull' && <HalfVsFull isDarkMode={p.isDarkMode} />}
          {which === 'processing' && <ProcessingViz isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'logic' && (
            <>
              <LogicViz isDarkMode={p.isDarkMode} accent={p.accent} />
              <ColumnStepSection isDarkMode={p.isDarkMode} accent={p.accent} />
            </>
          )}
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
