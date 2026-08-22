# PD Interview Prep — Full Implementation Plan (v3 Final)

> **Route:** `/interview-prep` · **Files:** `interviewQuestions.ts`, `InterviewPrep.tsx`, `seo.ts`, `index.css`

---

## Goal

Transform `/interview-prep` from a 29-question static accordion into a **professional 129-question PD study engine**. Add all 100 Physical Design questions, rich formula rendering, a two-panel layout with sidebar category navigator, quiz mode, progress tracking, URL-persistent filters, and `FAQPage` JSON-LD — all consistent with the site's neo-brutalist design system.

---

## Design Commitment

| Attribute | Decision |
|-----------|----------|
| **Style** | Neo-Brutalist Utility Tool (VerilogJudge aesthetic) |
| **Palette** | `--signal-core` #7DD3FC for theory tags · `--accent-orange` #F97316 for PD category · `--nvg-core` #22C55E for correct answers. **No purple. No glassmorphism.** |
| **Typography** | JetBrains Mono for labels/code · Inter for prose · Outfit for headings |
| **Layout** | Two-panel: left sidebar (category nav + stats) + right content (search + questions). NOT a single scrolling column |
| **Motion** | GPU-only (`transform`, `opacity`). `framer-motion` `AnimatePresence` for quiz reveal. `prefers-reduced-motion` respected |

---

## Files Modified

| File | Change |
|------|--------|
| `src/data/interviewQuestions.ts` | Schema extension + 100 new PD questions |
| `src/pages/InterviewPrep.tsx` | Full layout redesign + all new features |
| `src/lib/seo.ts` | `FAQPage` JSON-LD in `routeJsonLd()` |
| `src/index.css` | `.iv-formula-block` utility class |

---

## Layout Blueprint

```
┌─────────────────────────────────────────────────────────────┐
│  Header: VLSI Interview Prep  ·  [Quiz Mode] [Expand All]   │
├──────────────┬──────────────────────────────────────────────┤
│  LEFT PANEL  │  RIGHT PANEL                                  │
│  w-60 shrink │  flex-1 overflow-y-auto                       │
│              │                                               │
│  CORE TOPICS │  [Search bar]  [active filter chips]          │
│  ○ All (129) │                                               │
│  ○ Digital   │  ┌──── Q1 ────────────────────────────┐      │
│  ○ Number    │  │ [Digital Basics] [Easy]  ▼          │      │
│  ○ Boolean   │  │ What is the diff between…           │      │
│  ○ Combinator│  └────────────────────────────────────-┘      │
│  ○ Sequential│                                               │
│  ○ Verilog   │  ──── Physical Design · 100 Questions ─────  │
│              │                                               │
│  PHYSICAL    │  ┌──── Q51 ───────────────────────────┐      │
│  DESIGN      │  │ [Physical Design] [Numerical]  ▼   │      │
│  ○ Theory 50 │  │ Given a Reg-to-Reg path…           │      │
│  ○ Numer. 50 │  └─────────────────────────────────────┘      │
│              │                                               │
│  ──────────  │                                               │
│  47/129 ✓   │                                               │
│  ████░░ 36% │                                               │
└──────────────┴──────────────────────────────────────────────┘
```

---

## Phase 1 — Data Layer (`interviewQuestions.ts`)

### 1.1 — Extend TypeScript types

```ts
// Add to IvTopic union
export type IvTopic = 'digital' | 'number' | 'boolean' | 'comb' | 'seq' | 'verilog' | 'pd';

// Add to IvLevel union
export type IvLevel = 'Easy' | 'Medium' | 'Hard' | 'Numerical';

// Extend IvTopicMeta
export interface IvTopicMeta {
  id: IvTopic;
  label: string;
  color: string;
  section?: 'Core Topics' | 'Physical Design'; // NEW
}
```

Add to `IV_TOPICS`:
```ts
{ id: 'pd', label: 'Physical Design', color: '#F97316', section: 'Physical Design' }
```

Mark all 6 existing topics with `section: 'Core Topics'`.

→ **Verify:** `tsc --noEmit` zero errors on `IvTopic` / `IvLevel` usages.

---

### 1.2 — Answer format specification

All 100 PD answers use structured line-prefix markers:

| Prefix | Meaning | Visual Output |
|--------|---------|--------------|
| `§F:` | Formula / equation | Amber border block, JetBrains Mono |
| `§C:` | Calculation step | Cyan border block, JetBrains Mono |
| `§R:` | Result / final answer | Green badge pill |
| `` `x` `` | Inline code token | `<code>` in signal-core color |
| _(plain)_ | Prose explanation | Inter, text-sub color |

**Example — Q51 Setup Slack answer string:**
```
Launch latency 0.8 ns, Clk-to-Q 0.4 ns, combo delay 3.1 ns. Capture latency 0.6 ns, T_clk = 5 ns, T_setup = 0.3 ns.
§F: T_arrival = T_launch_lat + T_clk→q + T_combo
§C: = 0.8 + 0.4 + 3.1 = 4.3 ns
§F: T_required = T_clk + T_capt_lat − T_setup
§C: = 5.0 + 0.6 − 0.3 = 5.3 ns
§R: Setup Slack = T_required − T_arrival = 5.3 − 4.3 = +1.0 ns ✓
```

---

### 1.3 — All 100 PD questions to append

**Part 1 — Theory Q1–50 (`topic: 'pd'`, `level: Easy | Medium | Hard`)**

| Category | Q Range | IDs (prefix `pd-`) | Level |
|----------|---------|-------------------|-------|
| Inputs, Libraries & Formats | Q1–4 | `lef-def`, `lib-db`, `tlu-plus`, `sdc-contents` | Easy, Easy, Medium, Medium |
| Floorplanning & Power Planning | Q5–10 | `core-sizing`, `halo-blockage`, `flyline`, `pdn-arch`, `ir-drop-types`, `decap` | Medium, Medium, Easy, Hard, Medium, Easy |
| Placement & Optimization | Q11–16 | `placement-phases`, `tap-cells`, `vt-swap`, `endcap`, `tie-cells`, `scan-reorder` | Easy, Easy, Medium, Easy, Easy, Medium |
| CTS | Q17–22 | `cts-goals`, `clock-topo`, `clock-latency`, `useful-skew`, `icg-cells`, `clock-buffers` | Easy, Medium, Medium, Hard, Medium, Easy |
| Routing & Signal Integrity | Q23–28 | `routing-phases`, `ndr-shield`, `crosstalk-mech`, `crosstalk-fixes`, `antenna-effect`, `em-factors` | Easy, Medium, Medium, Medium, Medium, Easy |
| Advanced Nodes & Technology | Q29–33 | `temp-inversion`, `finfet-layout`, `mcmm`, `ocv-aocv-pocv`, `gba-pba` | Hard, Medium, Medium, Hard, Medium |
| Physical Verification & ECO | Q34–38 | `drc-lvs-erc`, `lvs-debug`, `metal-fill`, `eco-types`, `lec` | Easy, Medium, Easy, Medium, Easy |
| Low Power | Q39–41 | `upf-terms`, `level-shifters`, `isolation-cells` | Medium, Medium, Medium |
| Miscellaneous Methodology | Q42–50 | `congestion-map`, `max-tran-fix`, `placement-constraints`, `latch-timeborrow`, `dmsa`, `etm-ilm`, `metal-stack`, `unconstrained-ep`, `esd-protection` | Easy, Easy, Easy, Hard, Medium, Medium, Easy, Easy, Easy |

**Part 2 — Numericals Q51–100 (`topic: 'pd'`, `level: 'Numerical'`)**

| Sub-category | Q Range | IDs (prefix `pd-num-`) |
|---|---|---|
| Setup & Hold Basics | Q51–55 | `setup-slack`, `hold-slack`, `fmax`, `setup-hold-check`, `hold-fix-delay` |
| Skew, Jitter & Derating | Q56–60 | `skew-id`, `ocv-skew`, `aocv-skew`, `max-combo-delay`, `duty-jitter` |
| Half-Cycle & Multicycle | Q61–65 | `half-cycle-max`, `half-cycle-hold`, `mc-arrival`, `mc-hold-edge`, `mc-hold-sdc` |
| Floorplanning & Area | Q66–70 | `core-area`, `core-dimensions`, `die-core-util`, `cell-rows`, `keepout-area` |
| Power, IR Drop & Decap | Q71–75 | `total-power`, `dvdd-reduction`, `stripe-ir`, `decap-sizing`, `transient-ir` |
| RC Delay & Elmore | Q76–80 | `rc-lumped`, `elmore-delay`, `repeater-scaling`, `metal-resistance`, `driver-propagation` |
| Crosstalk & SI | Q81–84 | `xtalk-peak-voltage`, `xtalk-mcf2-cap`, `xtalk-mcf0-cap`, `xtalk-driver-upsize` |
| Antenna Ratio & DRC | Q85–88 | `antenna-ratio`, `antenna-drc-cut`, `via-array-res`, `routing-tracks` |
| Clock Gating & ICG | Q89–90 | `icg-max-path`, `icg-enable-check` |
| Clock Mesh & Latency | Q91–92 | `latency-skew-buffer`, `clock-branch-power` |
| Advanced STA | Q93–95 | `hyperperiod`, `voltage-slack`, `fmax-wns` |
| Advanced ECO | Q96–100 | `buffer-swaps-setup`, `hold-buffer-selection`, `dual-slack-buffer`, `input-port-slack`, `output-port-combo` |

→ **Verify:** `IV_QUESTIONS.length === 129` · `filter(q => q.topic === 'pd').length === 100` · `filter(q => q.level === 'Numerical').length === 50`

---

## Phase 2 — Rich Answer Renderer

Add `renderAnswer()` and `renderInlineMono()` as module-level functions in `InterviewPrep.tsx`:

```tsx
function renderInlineMono(line: string, key: number) {
  const parts = line.split(/(`[^`]+`)/g);
  return (
    <p key={key} className="text-[14px] leading-relaxed text-text-sub mt-1">
      {parts.map((p, i) =>
        p.startsWith('`') && p.endsWith('`')
          ? <code key={i} className="font-mono text-[13px] text-signal-core bg-white/5 rounded px-1">{p.slice(1, -1)}</code>
          : p
      )}
    </p>
  );
}

function renderAnswer(a: string) {
  return a.split('\n').map((line, i) => {
    const s = line.trim();
    if (s.startsWith('§F:'))
      return <pre key={i} className="iv-formula-block border-l-2 border-amber-400 bg-amber-400/5 text-amber-200">{s.slice(3).trim()}</pre>;
    if (s.startsWith('§C:'))
      return <pre key={i} className="iv-formula-block border-l-2 border-cyan-400 bg-cyan-400/5 text-cyan-200">{s.slice(3).trim()}</pre>;
    if (s.startsWith('§R:'))
      return (
        <div key={i} className="mt-3 inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[12px] font-bold text-emerald-400">
          <span>▶</span> {s.slice(3).trim()}
        </div>
      );
    if (!s) return <div key={i} className="h-2" />;
    return renderInlineMono(s, i);
  });
}
```

Replace in question card: `<p className="...">{item.a}</p>` → `{renderAnswer(item.a)}`

→ **Verify:** Q51 shows amber `§F:` block + cyan `§C:` steps + green `§R:` badge. Q1 renders as clean prose.

---

## Phase 3 — Two-Panel Layout Redesign (`InterviewPrep.tsx`)

### 3.1 — Top-level structure change
```tsx
// Before: single div > max-w-4xl > ...
// After:
<div className="min-h-screen flex flex-col bg-[#0A0B12]">
  <header className="h-14 border-b border-border-soft ..."> {/* Header */} </header>
  <div className="flex flex-1 min-h-0">
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border-soft overflow-y-auto">
      <IvSidebar ... />
    </aside>
    <main className="flex-1 overflow-y-auto">
      {/* search + chips + question list */}
    </main>
  </div>
</div>
```

### 3.2 — `IvSidebar` component (inline in InterviewPrep.tsx)

Renders:
1. `CORE TOPICS` section heading — JetBrains Mono 10px uppercase
2. "All (129)" button
3. 6 existing topic nav items with colored left-border when active
4. `──` separator
5. `PHYSICAL DESIGN` section heading
6. "Theory (50)" and "Numericals (50)" shortcut buttons
7. `──` separator
8. Stats block — `{done.size}/{IV_QUESTIONS.length}` + CSS progress bar

Active item style: `border-l-2 border-[color] bg-white/5 text-text-main pl-3`
Inactive: `text-text-dim hover:text-text-main hover:bg-white/[0.03] pl-3`

### 3.3 — Difficulty chips (header strip above question list)
```tsx
<div className="flex flex-wrap items-center gap-2 px-5 pt-4">
  {(['Easy','Medium','Hard','Numerical'] as IvLevel[]).map(lv => (
    <button key={lv} onClick={() => setLevel(active ? null : lv)} ...>
      {lv}
    </button>
  ))}
  <span className="mx-1 text-xs text-text-dim">·</span>
  <button onClick={expandAll}>expand all</button>
  <button onClick={collapseAll}>collapse</button>
</div>
```

`Numerical` chip color: `#F97316` (accent-orange).

### 3.4 — Question card — neo-sm style
```tsx
// Before: rounded-2xl border
// After:  neo-sm class (1.5px border, 3px offset shadow, 5px radius)
<article key={item.id} className="neo-sm">
```

Show question number: `Q{globalIdx + 1}` in `font-mono text-[10px] text-text-dim` in card header.

### 3.5 — PD section divider
Before first `pd` question in ALL view:
```tsx
<div className="my-8 flex items-center gap-4">
  <div className="flex-1 border-t border-orange-400/20" />
  <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-orange-400">
    Physical Design · 100 Questions
  </span>
  <div className="flex-1 border-t border-orange-400/20" />
</div>
```

### 3.6 — Mobile
Sidebar: `hidden md:flex`. On mobile, render topic + level chips as a single horizontally-scrollable chip strip above the question list (existing chip pattern, extended).

→ **Verify:** Two-panel at ≥768px. Sidebar topic items filter correctly. Q cards use neo-sm. PD divider present in ALL view.

---

## Phase 4 — Progress Persistence

```ts
const PROGRESS_KEY = 'iv_progress_v1';

const loadProgress = (): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')); }
  catch { return new Set(); }
};

// In component
const [done, setDone] = useState<Set<string>>(loadProgress);

const toggleDone = (id: string) => {
  setDone(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify([...next])); } catch {}
    return next;
  });
};
```

Add to each open question card footer:
```tsx
<button onClick={() => toggleDone(item.id)} className={`mt-4 inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-[11px] font-bold transition-colors ${
  done.has(item.id)
    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
    : 'border-border-soft text-text-dim hover:border-emerald-500/40 hover:text-emerald-400'
}`}>
  {done.has(item.id) ? <CheckCircle2 size={13} /> : <Circle size={13} />}
  {done.has(item.id) ? 'Done' : 'Mark done'}
</button>
```

Add ✓ indicator in card header when `done.has(item.id)`.

→ **Verify:** Mark Q1 done → checkmark appears, sidebar stats update. Refresh → persists.

---

## Phase 5 — Quiz Mode

```ts
const [quizMode, setQuizMode] = useState(false);
const [revealed, setRevealed] = useState<Set<string>>(new Set());
const [quizScore, setQuizScore] = useState({ got: 0, missed: 0 });
```

**When `quizMode === true`:**
- Replace answer body with blurred overlay + "Reveal Answer" button
- On reveal: show answer + two buttons: `✓ Got it` (emerald) · `✗ Missed it` (rose)
- "Got it" → `quizScore.got++` + `toggleDone(id)` to mark complete
- "Missed it" → `quizScore.missed++` only
- Session score in header: `Score: {got} / {got + missed}`

**Quiz Mode toggle button (header):**
```tsx
<button
  onClick={() => { setQuizMode(q => !q); setRevealed(new Set()); setQuizScore({ got: 0, missed: 0 }); }}
  className={`brutal-btn px-3 py-1.5 text-[12px] font-bold flex items-center gap-2 ${
    quizMode ? 'bg-accent-orange text-black' : 'bg-bg-elev text-text-main'
  }`}
>
  <Brain size={14} /> {quizMode ? 'Exit Quiz' : 'Quiz Mode'}
</button>
```

Use `<AnimatePresence>` + `motion.div` for answer reveal: `initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}`.

→ **Verify:** Toggle quiz mode → answers hidden. Reveal → Got it / Missed it. Score counter increments. Exit quiz resets score.

---

## Phase 6 — URL Filter Persistence

```ts
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();

// Read on mount
const [topic, setTopic] = useState<IvTopic | null>(() => {
  const t = searchParams.get('topic');
  return IV_TOPICS.some(x => x.id === t) ? (t as IvTopic) : null;
});
const [level, setLevel] = useState<IvLevel | null>(() => {
  const l = searchParams.get('level');
  return (['Easy','Medium','Hard','Numerical'] as IvLevel[]).includes(l as IvLevel) ? (l as IvLevel) : null;
});

// Write on change
useEffect(() => {
  const params: Record<string, string> = {};
  if (topic) params.topic = topic;
  if (level) params.level = level;
  setSearchParams(params, { replace: true });
}, [topic, level]);
```

→ **Verify:** Select PD + Numerical → URL becomes `?topic=pd&level=Numerical`. Refresh → same filters active.

---

## Phase 7 — FAQPage JSON-LD (`seo.ts`)

In `routeJsonLd()`, add before the `career-roadmap` block:

```ts
import { IV_QUESTIONS } from '../data/interviewQuestions';

if (pathname === '/interview-prep') {
  const faqItems = IV_QUESTIONS
    .filter(q => q.level !== 'Numerical') // prose-only for Google compliance
    .slice(0, 20);                         // Google FAQ schema: max ~20 items

  out.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(q => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.a
          .split('\n')
          .filter(l => !l.trimStart().startsWith('§'))
          .join(' ')
          .replace(/`([^`]+)`/g, '$1')
          .trim()
      }
    }))
  });
}
```

→ **Verify:** DevTools → `<script type="application/ld+json">` on `/interview-prep` contains `"@type": "FAQPage"` with 20 objects. Answers are plain text (no `§` markers, no backticks).

---

## Phase 8 — CSS Utility (`index.css`)

Add to `@layer utilities`:

```css
/* Interview Prep — formula / calculation answer blocks */
.iv-formula-block {
  font-family: 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;
  border-left-width: 2px;
  border-radius: 0 4px 4px 0;
  padding: 8px 12px;
  margin-top: 6px;
  overflow-x: auto;
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 1.6;
}
```

→ **Verify:** Formula blocks render in JetBrains Mono in production build (no Tailwind purge issue).

---

## Phase 9 — Production Build Verification

```powershell
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```

→ **Verify:** Zero TypeScript errors · Zero lint errors · `dist/` emitted · `interviewQuestions.ts` is the only significant bundle size increase (~30KB gzip for 100 Q&A pairs).

---

## Implementation Order (Critical Path)

```
Phase 1 (data types + 100 Qs)
  → Phase 2 (renderAnswer)
    → Phase 8 (CSS utility — needed before rendering)
      → Phase 3 (layout redesign)
        → Phase 4 (progress tracking)
          → Phase 5 (quiz mode)
            → Phase 6 (URL params)
              → Phase 7 (SEO JSON-LD — independent after data exists)
                → Phase 9 (build verification — always last)
```

---

## Done When

- [ ] `ALL (129)` shown in header
- [ ] Left sidebar shows Core Topics + Physical Design sections with counts
- [ ] Theory/Numericals sub-filters in sidebar work
- [ ] Q51 answer: amber `§F:` formula block + cyan `§C:` steps + green `§R:` badge
- [ ] Q1 answer: clean prose, no artifacts
- [ ] SDC commands (`set_multicycle_path`, etc.) render as inline `<code>` spans
- [ ] "Mark done" toggle persists across refresh
- [ ] Progress bar in sidebar reflects `done.size`
- [ ] Quiz mode hides answers; Got it / Missed it buttons work; score shown in header
- [ ] URL `?topic=pd&level=Numerical` restores filters on load
- [ ] `FAQPage` JSON-LD present with 20 prose-only questions, no `§` markers
- [ ] Mobile: sidebar collapses to horizontal chip strip at `<md` breakpoint
- [ ] `npm run build` passes with zero errors and zero TypeScript warnings

---

## Technical Notes

| Note | Detail |
|------|--------|
| `useSearchParams` | Already available — project uses React Router v6. No new dependency needed. |
| No KaTeX | `§`-prefix monospace blocks give sufficient formula legibility at ~0KB bundle cost. |
| `LEVEL_COLOR` type | Record is `Record<IvLevel, string>` — adding `'Numerical': '#F97316'` is a required type-safe extension. |
| Mobile sidebar | `hidden md:flex` on aside. On mobile, render topic chips as `overflow-x-auto flex gap-2 px-4`. |
| Quiz reveal animation | Use `<AnimatePresence>` + `motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}` — consistent with VerilogJudge. |
| JSON-LD marker strip | `.replace(/§[FCR]:\s*/g, '')` cleanly removes all markers. |
| `IvTopicMeta.section` field | Optional — backward compatible. Existing topics get `section: 'Core Topics'`. |
