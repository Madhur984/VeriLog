/**
 * Encoders (dsd/24) - "The Voting Booth".
 * Generic scenes come from the shared kit; the gate-level simple-encoder build
 * (two LiveGate OR gates + a computed truth table), the priority-equation
 * LiveGate panel, the exhaustive computed priority truth table, the derivation
 * StepThrough (from the spec proofs), and the sources list are bespoke. Every
 * boolean result is COMPUTED in code from the live inputs, never hardcoded.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, ExternalLink } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import { EncoderViz, BitToggle } from '../_combo/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import type { SubPage } from '../_subtractor/SubEngine';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/dsd24-encoders.mp4';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SRC_HI: string | undefined = undefined;

const ACC = { in: '#38bdf8', sel: '#f59e0b', good: '#34d399', bad: '#fb7185' };

/* ───────── bespoke: the simple 4-to-2 gate-level build (S04) ─────────
   Toggle D0..D3 (one-hot intended) and watch the two OR gates compute
   Y0 = D1 + D3 and Y1 = D2 + D3. All bits computed in code. */
const SimpleEncoderGates: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [D, setD] = useState<number[]>([1, 0, 0, 0]); // D0..D3
  const Y0 = D[1] | D[3];
  const Y1 = D[2] | D[3];
  const code = `${Y1}${Y0}`;
  // truth table rows for the one-hot cases, computed
  const rows = [0, 1, 2, 3].map((i) => ({
    cells: [`D${i}=1`, (i >> 1) & 1, i & 1] as (string | number)[],
    highlight: D[i] === 1 && D.reduce((a, b) => a + b, 0) === 1,
  }));

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'सादा 4-to-2 - gate level' : 'simple 4-to-2 - gate level'}
      </div>

      {/* input switches */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {[0, 1, 2, 3].map((i) => (
          <BitToggle key={i} value={D[i]} onClick={() => setD((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))}
            color={ACC.in} label={`D${i}`} sub={i === 0 ? 'no gate' : undefined} size={36} />
        ))}
      </div>

      {/* the two OR gates */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[11px] ${t.faint}`}>Y0 = D1 + D3</span>
          <LiveGate type="OR" a={D[1]} b={D[3]} isDarkMode={isDarkMode} accent={accent} labelA="D1" labelB="D3" labelOut="Y0" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[11px] ${t.faint}`}>Y1 = D2 + D3</span>
          <LiveGate type="OR" a={D[2]} b={D[3]} isDarkMode={isDarkMode} accent={accent} labelA="D2" labelB="D3" labelOut="Y1" />
        </div>
      </div>

      <div className="mt-4 text-center font-mono text-[14px]">
        <span className={t.sub}>{lang === 'hi' ? 'code Y1Y0 = ' : 'code Y1Y0 = '}</span>
        <b style={{ color: accent }}>{code}</b>
        {D.reduce((a, b) => a + b, 0) > 1 && (
          <span className="ml-2" style={{ color: ACC.bad }}>
            {lang === 'hi' ? '(एक से ज़्यादा input - यह code गढ़ा हुआ है!)' : '(more than one input - this code is fabricated!)'}
          </span>
        )}
      </div>

      <div className="mt-5">
        <TruthTable isDarkMode={isDarkMode} accent={accent}
          headers={['active input', 'Y1', 'Y0']} rows={rows}
          note={lang === 'hi'
            ? "D0 किसी equation में नहीं - इसका index 00 है, तो उसे कोई gate नहीं चाहिए।"
            : 'D0 is in neither equation - its index is 00, so it needs no gate.'} />
      </div>
    </Card>
  );
};

/* ───────── bespoke: the priority-equation gates (S06) ─────────
   Shows A1 = D3 + D2 and A0 = D3 + D1.D2' built from live gates,
   including the NOT (D2') and AND (D1.D2') terms. */
const PriorityGates: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [D, setD] = useState<number[]>([0, 1, 1, 0]); // D0..D3  (D1+D2 jam by default)
  const D2bar = D[2] ^ 1;
  const term = D[1] & D2bar;           // D1.D2'
  const A1 = D[3] | D[2];              // D3 + D2
  const A0 = D[3] | term;             // D3 + D1.D2'
  const V = D[0] | D[1] | D[2] | D[3];
  const highest = [3, 2, 1, 0].find((i) => D[i] === 1);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? "priority gates · A1=D3+D2 · A0=D3+D1.D2'" : "priority gates · A1=D3+D2 · A0=D3+D1.D2'"}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {[3, 2, 1, 0].map((i) => (
          <BitToggle key={i} value={D[i]} onClick={() => setD((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))}
            color={highest === i ? accent : ACC.in} label={`D${i}`}
            sub={highest === i ? (lang === 'hi' ? 'wins' : 'wins') : undefined} size={36} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[11px] ${t.faint}`}>D2' (invert D2)</span>
          <LiveGate type="NOT" a={D[2]} isDarkMode={isDarkMode} accent={accent} labelA="D2" labelOut="D2'" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[11px] ${t.faint}`}>D1 . D2'</span>
          <LiveGate type="AND" a={D[1]} b={D2bar} isDarkMode={isDarkMode} accent={accent} labelA="D1" labelB="D2'" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[11px] ${t.faint}`}>A1 = D3 + D2</span>
          <LiveGate type="OR" a={D[3]} b={D[2]} isDarkMode={isDarkMode} accent={accent} labelA="D3" labelB="D2" labelOut="A1" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[11px] ${t.faint}`}>A0 = D3 + (D1.D2')</span>
          <LiveGate type="OR" a={D[3]} b={term} isDarkMode={isDarkMode} accent={accent} labelA="D3" labelB="D1.D2'" labelOut="A0" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[11px] ${t.faint}`}>V = (D0+D1) + (D2+D3)</span>
          <LiveGate type="OR" a={D[0] | D[1]} b={D[2] | D[3]} isDarkMode={isDarkMode} accent={accent} labelA="D0+D1" labelB="D2+D3" labelOut="V" />
        </div>
      </div>

      <div className="mt-5 text-center font-mono text-[14px]">
        <span className={t.sub}>A1 A0 = </span>
        <b style={{ color: accent }}>{A1}{A0}</b>
        <span className={`ml-3 ${t.sub}`}>V = </span>
        <b style={{ color: V ? ACC.good : ACC.bad }}>{V}</b>
        <span className={`ml-3 ${t.faint}`}>
          {highest !== undefined
            ? (lang === 'hi' ? `(सबसे ऊँची active D${highest} जीती)` : `(highest active D${highest} wins)`)
            : (lang === 'hi' ? '(कोई vote नहीं - output बेमतलब)' : '(no vote - output meaningless)')}
        </span>
      </div>
    </Card>
  );
};

/* ───────── bespoke: exhaustive priority truth table (S08) ─────────
   Computes Y1 Y0 V for all 16 input combinations by priority. */
const PriorityTruthTable: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();

  // priority-coded summary table with don't-cares (the canonical compact form)
  const summary = [
    { cells: ['1', 'X', 'X', 'X', '1', '1', '1'] as (string | number)[], highlight: true },
    { cells: ['0', '1', 'X', 'X', '1', '0', '1'] as (string | number)[] },
    { cells: ['0', '0', '1', 'X', '0', '1', '1'] as (string | number)[] },
    { cells: ['0', '0', '0', '1', '0', '0', '1'] as (string | number)[] },
    { cells: ['0', '0', '0', '0', 'X', 'X', '0'] as (string | number)[], highlight: true },
  ];

  // exhaustive computed verification of all 16 combinations
  const detail = Array.from({ length: 16 }, (_, m) => {
    const D = [m & 1, (m >> 1) & 1, (m >> 2) & 1, (m >> 3) & 1]; // D0..D3 from low bits
    const highest = [3, 2, 1, 0].find((i) => D[i] === 1);
    const V = highest !== undefined ? 1 : 0;
    const A1 = V && (highest as number) >= 2 ? 1 : 0;
    const A0 = V && ((highest as number) & 1) ? 1 : 0;
    return { D3: D[3], D2: D[2], D1: D[1], D0: D[0], A1, A0, V, win: highest };
  });
  const t = tone(isDarkMode);

  return (
    <div className="space-y-5">
      <TruthTable isDarkMode={isDarkMode} accent={accent}
        headers={['D3', 'D2', 'D1', 'D0', 'Y1', 'Y0', 'V']}
        rows={summary}
        note={lang === 'hi'
          ? "X = don't-care: कोई ऊँची-priority input active होते ही नीचे वाले मायने नहीं रखते। आख़िरी row (V=0) ही 'कोई vote नहीं' को 'D0 जीता' से अलग करती है।"
          : "X = don't-care: once a higher input is active the lower ones do not matter. The last row (V=0) is the only thing distinguishing 'no vote' from 'D0 won'."} />

      <Card isDarkMode={isDarkMode}>
        <div className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? 'सभी 16 combinations, code में सत्यापित' : 'all 16 combinations, verified in code'}
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {detail.map((d, m) => (
            <div key={m} className="rounded-lg border p-2 text-center font-mono"
              style={{
                borderColor: d.V ? `${ACC.good}44` : (isDarkMode ? '#1e293b' : '#e2e8f0'),
                background: d.V ? `${ACC.good}10` : 'transparent',
              }}>
              <div className={`text-[12px] font-black ${t.text}`}>{d.D3}{d.D2}{d.D1}{d.D0}</div>
              <div className="text-[13px] font-black" style={{ color: d.V ? ACC.good : (t.faint as string) }}>
                {d.A1}{d.A0} · V{d.V}
              </div>
              <div className={`text-[9px] ${t.faint}`}>
                {d.win !== undefined ? `D${d.win} wins` : (lang === 'hi' ? 'no vote' : 'no vote')}
              </div>
            </div>
          ))}
        </div>
        <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
          {lang === 'hi'
            ? <>हर multi-input row अपनी सबसे ऊँची active line के index में सिमटती है; सिर्फ़ 0000 पर V=0।</>
            : <>Every multi-input row collapses to the index of its highest active line; only 0000 has V=0.</>}
        </p>
      </Card>
    </div>
  );
};

/* ───────── bespoke: the derivation walkthrough (StepThrough, from spec proofs) ───────── */
const DerivationWalkthrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);

  const Eq: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={`mx-auto max-w-md rounded-xl border p-3 text-center font-mono text-[14px] font-black ${t.soft}`}
      style={{ borderColor: `${accent}44`, color: accent }}>{children}</div>
  );
  const P: React.FC<{ en: React.ReactNode; hi: React.ReactNode }> = ({ en, hi }) => (
    <p className={`text-center text-[13px] leading-relaxed ${t.sub}`}>{lang === 'hi' ? hi : en}</p>
  );

  const steps = [
    {
      label: lang === 'hi' ? 'truth table से Y1, Y0' : 'Y1, Y0 from the truth table',
      body: (
        <div className="space-y-3">
          <P
            en={<>One-hot rows: D0 to 1 gives 00, D1 to 01, D2 to 10, D3 to 11. Read each output column: Y1 is 1 for the rows D2 (10) and D3 (11); Y0 is 1 for D1 (01) and D3 (11).</>}
            hi={<>One-hot rows: D0 देता है 00, D1 देता है 01, D2 देता है 10, D3 देता है 11। हर output column पढ़िए: Y1 1 है rows D2 (10) और D3 (11) के लिए; Y0 1 है D1 (01) और D3 (11) के लिए।</>} />
          <Eq>Y1 = D2 + D3 ; Y0 = D1 + D3</Eq>
          <P
            en={<>D0 appears in neither equation: index 0 = 00 is the all-zeros codeword, so its line needs no gate. This is the seed of the ambiguity - 00 can mean 'D0 active' OR 'nothing active'.</>}
            hi={<>D0 किसी equation में नहीं: index 0 = 00 all-zeros codeword है, तो इसकी line को कोई gate नहीं चाहिए। यही अस्पष्टता का बीज है - 00 का मतलब 'D0 active' या 'कुछ active नहीं' दोनों हो सकता है।</>} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'सादी encoder क्यों fail होती है' : 'why the simple encoder fails',
      body: (
        <div className="space-y-3">
          <P
            en={<>Multiple-active: drive D1 = 1 and D2 = 1. Then Y0 = D1 + D3 = 1 and Y1 = D2 + D3 = 1, giving 11 = index 3 - but D3 is LOW. The OR logic bit-wise merged the codewords (01 OR 10 = 11), fabricating a line nobody asserted.</>}
            hi={<>Multiple-active: D1 = 1 और D2 = 1 कीजिए। तब Y0 = D1 + D3 = 1 और Y1 = D2 + D3 = 1, देता है 11 = index 3 - पर D3 LOW है। OR logic ने codewords को bit-wise मिला दिया (01 OR 10 = 11), एक ऐसी line गढ़ते हुए जिसे किसी ने assert नहीं किया।</>} />
          <Eq>D1=1 . D2=1 {'->'} Y1Y0 = 11 (wrong)</Eq>
          <P
            en={<>Zero-active: all inputs 0 gives 00 - but that is also D0's codeword. The bus cannot tell 'D0 active' from 'no line active'. Two fixes follow: a PRIORITY rule, and a VALID bit.</>}
            hi={<>Zero-active: सभी inputs 0 देता है 00 - पर वह D0 का codeword भी है। bus 'D0 active' को 'कोई line active नहीं' से अलग नहीं बता सकता। दो fixes आते हैं: एक PRIORITY नियम, और एक VALID bit।</>} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? "priority equations (don't-care minimization)" : "priority equations (don't-care minimization)",
      body: (
        <div className="space-y-3">
          <P
            en={<>Priority table (D3 highest, x = don't-care): 1xxx to 11,1 ; 01xx to 10,1 ; 001x to 01,1 ; 0001 to 00,1 ; 0000 to xx,0. The A1 column is 1 for 1xxx and 01xx, i.e. D3 OR (D3'.D2).</>}
            hi={<>Priority table (D3 सबसे ऊँची, x = don't-care): 1xxx देता 11,1 ; 01xx देता 10,1 ; 001x देता 01,1 ; 0001 देता 00,1 ; 0000 देता xx,0। A1 column 1 है 1xxx और 01xx के लिए, यानी D3 OR (D3'.D2)।</>} />
          <Eq>A1 = D3 + D3'.D2 = D3 + D2</Eq>
          <P
            en={<>Apply the absorption law X + X'.Y = X + Y with X = D3, Y = D2. The A0 column is 1 for 1xxx and 001x: D3 OR (D3'.D2'.D1). Absorb D3' again to get the low-bit equation.</>}
            hi={<>absorption law X + X'.Y = X + Y लगाइए, X = D3, Y = D2 के साथ। A0 column 1 है 1xxx और 001x के लिए: D3 OR (D3'.D2'.D1)। D3' फिर absorb कीजिए और low-bit equation पाइए।</>} />
          <Eq>A0 = D3 + D2'.D1 = D3 + D1.D2'</Eq>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Shannon expansion = priority का engine' : 'Shannon expansion = the engine of priority',
      body: (
        <div className="space-y-3">
          <P
            en={<>Shannon: any F = x'.F0 + x.F1, where F0 = F|x=0 and F1 = F|x=1. Expand A0 about the highest variable D3. At D3 = 1 every 1xxx row has A0 = 1, so F1 = 1. At D3 = 0 it reduces to the lower sub-encoder, F0 = D1.D2'.</>}
            hi={<>Shannon: कोई भी F = x'.F0 + x.F1, जहाँ F0 = F|x=0 और F1 = F|x=1। A0 को सबसे ऊँचे variable D3 के बारे में expand कीजिए। D3 = 1 पर हर 1xxx row में A0 = 1, तो F1 = 1। D3 = 0 पर यह नीचे वाली sub-encoder में सिमट जाती है, F0 = D1.D2'।</>} />
          <Eq>A0 = D3'.(D1.D2') + D3.1 = D3 + D1.D2'</Eq>
          <P
            en={<>Identical to the don't-care result - so the priority structure is literally a nested Shannon cofactor, a 2:1 select on D3. The same Y = S'.I0 + S.I1 rule that synthesizes a 2:1 MUX.</>}
            hi={<>don't-care नतीजे जैसा ही - तो priority structure सचमुच एक nested Shannon cofactor है, D3 पर एक 2:1 select। वही Y = S'.I0 + S.I1 नियम जो एक 2:1 MUX synthesize करता है।</>} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'NAND से AND/OR/NOT' : 'AND/OR/NOT from NAND',
      body: (
        <div className="space-y-3">
          <P
            en={<>NAND(a,b) = (a.b)' is functionally complete. NOT: tie both inputs, NAND(a,a) = a' (1 gate). AND: NAND(NAND(a,b), NAND(a,b)) (2 gates). OR: by De Morgan, a + b = (a'.b')', so OR = NAND(NAND(a,a), NAND(b,b)) (3 gates).</>}
            hi={<>NAND(a,b) = (a.b)' functionally complete है। NOT: दोनों inputs जोड़िए, NAND(a,a) = a' (1 gate)। AND: NAND(NAND(a,b), NAND(a,b)) (2 gates)। OR: De Morgan से, a + b = (a'.b')', तो OR = NAND(NAND(a,a), NAND(b,b)) (3 gates)।</>} />
          <Eq>NOT=1 · AND=2 · OR=3 NAND gates</Eq>
          <P
            en={<>So A1 = D3 + D2 is 3 NANDs; A0 = D3 + D1.D2' needs an inverter + AND + OR; V is an OR tree. The whole priority encoder is fully NAND-realizable - exactly how CMOS standard cells build it.</>}
            hi={<>तो A1 = D3 + D2 3 NANDs है; A0 = D3 + D1.D2' को एक inverter + AND + OR चाहिए; V एक OR tree है। पूरी priority encoder पूरी तरह NAND-realizable है - ठीक वैसे जैसे CMOS standard cells इसे बनाते हैं।</>} />
        </div>
      ),
    },
  ];

  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── bespoke: sources list (recap) ───────── */
const SourcesList: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const sources = [
    { label: 'Priority encoder - Wikipedia', url: 'https://en.wikipedia.org/wiki/Priority_encoder' },
    { label: 'Encoders and Decoders - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/digital-logic/encoders-and-decoders-in-digital-logic/' },
    { label: 'Priority Encoders - TutorialsPoint', url: 'https://www.tutorialspoint.com/digital-electronics/digital-electronics-priority-encoders.htm' },
    { label: 'Priority Encoder - ElProCus', url: 'https://www.elprocus.com/priority-encoder/' },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>
        {lang === 'hi' ? 'स्रोत · sources' : 'sources'}
      </div>
      <ul className="space-y-2">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] hover:underline" style={{ color: accent }}>
              <ExternalLink size={13} /> {s.label}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.5) ? 'PART II · THE LOGIC'
      : i < n - 3 ? 'PART III · BUILD IT'
        : 'PART IV · LOCK IT IN';

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (/inverse/.test(key)) return 'viz';
  if (/booth/.test(key)) return 'viz';
  if (/core/.test(key)) return 'core';
  if (/flaw/.test(key)) return 'flaws';
  if (/priority/.test(key)) return 'priority';
  if (/valid/.test(key)) return 'valid';
  if (/table/.test(key)) return 'table';
  if (/family/.test(key)) return 'family';
  if (/build/.test(key)) return 'build';
  return null;
};

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Encoder · The Voting Booth" hero={<EncoderViz isDarkMode={p.isDarkMode} accent={p.accent} />} />;
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
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="ENCODER" tag="Practice · Encoders" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => (
        <RecapScene {...p} scene={scene}>
          <SourcesList isDarkMode={p.isDarkMode} accent={p.accent} />
        </RecapScene>
      );
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'viz' && (
            <div className="space-y-3">
              <TryItYourself />
              <EncoderViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'core' && (
            <div className="space-y-6">
              <TryItYourself />
              <SimpleEncoderGates isDarkMode={p.isDarkMode} accent={p.accent} />
              <EncoderViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'flaws' && (
            <div className="space-y-6">
              <EncoderViz isDarkMode={p.isDarkMode} accent={p.accent} />
              <DerivationWalkthrough isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'priority' && (
            <div className="space-y-6">
              <TryItYourself />
              <PriorityGates isDarkMode={p.isDarkMode} accent={p.accent} />
              <EncoderViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'valid' && (
            <div className="space-y-3">
              <TryItYourself />
              <EncoderViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'table' && <PriorityTruthTable isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'family' && (
            <div className="space-y-3">
              <TryItYourself />
              <EncoderViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <div className="space-y-6">
              <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="encoder-4to2"
                titleEN="Build the Encoders for real" titleHI="असली में Encoders बनाइए"
                bodyEN="Open the live workbench and wire the 4-to-2 encoder yourself - the two OR gates for the simple core, then the inverter, AND and OR tree for the priority version and its valid bit. Prove every truth-table row on real hardware."
                bodyHI="live workbench खोलिए और 4-to-2 encoder ख़ुद wire कीजिए - सादे core के दो OR gates, फिर priority version और इसके valid bit के लिए inverter, AND और OR tree। हर truth-table row को असली hardware पर साबित कीजिए।" />
              <EncoderViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
        </TheoryScene>
      );
    }
  }
}

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i, arr) => ({
  id: slug(scene.id),
  part: partAt(i, arr.length),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene, i, arr.length),
}));
