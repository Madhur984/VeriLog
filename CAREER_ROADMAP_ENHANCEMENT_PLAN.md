# Career Roadmap Enhancement Plan

**Scope:** `/career-roadmap`  
**Goal:** Make the roadmap dependable, easier to follow for students, accessible on every input type, and credible as career guidance.

## Success definition

A first-time student should be able to select their stage and interest, understand their next three actions, open a relevant opportunity, and return later to continue—all without encountering a dead control or needing to decode product jargon.

## Delivery principles

- Repair broken journeys before adding new modules.
- Keep the guided student route primary; advanced telemetry remains optional.
- Use real destinations or clearly marked unavailable states—never decorative CTAs.
- Ship every UI change with keyboard, mobile, and empty/error-state checks.
- Treat salary, hiring, and opportunity data as dated guidance with visible provenance.

## Phase 0 — baseline and safeguards

**Outcome:** A measurable, testable starting point before changing the experience.

| Work item | Implementation | Acceptance criteria |
| --- | --- | --- |
| Capture baseline | Record current completion funnel: page visit, preference selection, domain opening, opportunity click, resume export. | Events are visible in the chosen analytics tool and documented. |
| Create journey tests | Add browser-level smoke tests for first visit, personalization, floating navigation, Skills, Financials, Portfolio, diagnostic, internship, and government CTAs. | Tests fail when a CTA has no visible resulting state or valid outbound destination. |
| Add a CTA inventory | Maintain a small data/config list of all user-visible CTAs, owner, destination, and status. | Every CTA is either operational, intentionally disabled with explanation, or removed. |
| Set quality gates | Add route-specific checks for TypeScript/build, lint, keyboard navigation, mobile layout, and no console errors. | Changes cannot merge without the defined checks passing. |

## Phase 1 — repair trust breaks

**Outcome:** All promised actions work and feedback is unambiguous.

### 1. Wire opportunity modules

Implement `isInternshipsOpen` and `isGovtOpen` state in the page shell. Pass opening callbacks to `IntelHubSection` and mount `InternshipDirectoryModal` and `GovtInitiativesModal` when their state is active.

- Change “Internship Matrix” and “Govt Initiatives” from no-ops to real dialogs.
- Close each dialog by close control, Escape, and optional backdrop click.
- Restore focus to the originating control after dismissal.

**Acceptance criteria:** Both buttons open their respective content in one activation and work with mouse, touch, and keyboard.

### 2. Repair application paths

Extend internship data with a required `applicationUrl` or an explicit `status: 'coming-soon' | 'closed'`.

- Render “Apply now” as an `<a>` for verified URLs, opening safely in a new tab.
- For unavailable listings, show a non-interactive “Application link unavailable” state.
- Add source/last-checked metadata for each listing.

**Acceptance criteria:** No `Apply now` label appears without a valid destination; external links are safe and distinguishable.

### 3. Make simulator launch exact

Replace the current “switch to Skills tab” behavior with a direct route state, for example `?tab=skills#simulator`.

- Set the Skills tab.
- Wait for its lazy content to mount.
- Scroll the simulator heading into view and move keyboard focus there.

**Acceptance criteria:** Activating “Launch Trajectory Simulator” places the user at the simulator, not merely somewhere in the Skills tab.

### 4. Remove deceptive affordances

Search for buttons without actions and links pointing to placeholder URLs. Replace each with a destination, disabled state with reason, or removal.

**Acceptance criteria:** CTA inventory and automated smoke tests contain no no-op controls.

## Phase 2 — make the student path clear

**Outcome:** The main page answers “what should I do next?” before offering advanced exploration.

### 1. Add a personalized action plan

After stage and domain selection, render a “Your next 3 actions” panel containing:

1. **Learn:** one focused lesson/lab.
2. **Build:** one portfolio artifact with a clear definition of done.
3. **Prepare:** one role/company or opportunity action.

Use stage × domain configuration rather than hard-coded page logic. Include estimated time, prerequisites, and a “mark complete” control.

**Acceptance criteria:** Every combination of career stage and domain produces three actionable, valid recommendations.

### 2. Simplify navigation

Retain one primary global navigation system: the floating dock or a compact sticky tab bar.

- Convert the long sticky section rail into a context-aware “Jump to section” control within Explore.
- Preserve selected tab and key section in the URL.
- Reset scroll to the top when changing major tabs, except for direct deep links.

**Acceptance criteria:** At every scroll position, users can tell where they are and reach a major area in at most two actions.

### 3. Use plainer language

Keep “Silicon” branding but lead with plain-language purpose:

| Current label | Recommended label |
| --- | --- |
| Intel Hub | Opportunities & company links |
| Silicon Radar | Skill-gap assessment |
| Fiscal Matrix | Salary explorer |
| Silicon Resume Compiler | Resume bullet builder |
| Telemetry mode | Advanced tools |

**Acceptance criteria:** Each module has a plain-language heading, one-sentence explanation, and explicit action verb.

### 4. Rework the cold open

Make the introduction optional rather than blocking.

- Default to content on normal visits.
- Offer “Watch roadmap intro” as a voluntary experience.
- If retained, add a visible button, instant skip, and `prefers-reduced-motion` support.

**Acceptance criteria:** Content and navigation are usable immediately on every visit.

## Phase 3 — accessibility and mobile quality

**Outcome:** Essential use cases work equally with touch, keyboard, screen readers, and reduced-motion settings.

### 1. Standardize dialogs

Create or adopt one dialog primitive with:

- `role="dialog"` and `aria-modal="true"`
- a programmatic title/description
- focus trap and initial focus
- Escape dismissal
- focus return to the trigger
- scroll locking without layout shift

Migrate diagnostic, internship, government, quiz, and simulator dialogs.

### 2. Improve legibility and targets

- Raise primary body copy and interactive labels to at least 14 px.
- Use 12 px minimum for nonessential metadata.
- Limit all-caps/monospace text to labels and small metadata, not explanatory paragraphs.
- Ensure 44 × 44 px touch targets, including icon controls.
- Add a visible `:focus-visible` state to every interactive element.

### 3. Remove hover-only essential actions

Keep Apply, close, and key card actions visible on touch devices. Use `:focus-within` only as supplemental enhancement.

### 4. Build responsive variants

| Width | Expected treatment |
| --- | --- |
| 320–375 px | Single column; one clear CTA per card; no obscured dock content. |
| 768 px | Two-column cards where reading order remains obvious; tables convert to cards when necessary. |
| 1024 px+ | Full data views; sticky controls do not overlap headings or actions. |

**Acceptance criteria:** Keyboard-only and screen-reader checks pass; essential flows pass at 320, 375, 768, 1024, and 1440 px widths.

## Phase 4 — data credibility and performance

**Outcome:** Advice is transparent and the route stays fast on modest devices.

### 1. Add claim-level provenance

Each market statistic, salary figure, and opportunity should show:

- source name and direct link
- publication date
- date last verified
- scope (country, city/company tier, experience level, compensation type)

Use a data-review schedule and an owner. Expired facts should show “Needs verification” rather than appearing current.

### 2. Make advanced tools demand-loaded

- Keep graphs, heatmaps, canvas/3D, and PDF generation out of the initial Explore route.
- Use static summaries and an explicit “Open advanced tool” trigger.
- Audit bundle composition for the career route; defer libraries that do not support its first screen.

### 3. Establish performance budgets

Set budget targets after a baseline mobile test, then enforce them in CI. Suggested initial measures: route JavaScript, first contentful paint, largest contentful paint, interaction latency, and cumulative layout shift.

**Acceptance criteria:** Advanced assets are not fetched before a user opens their corresponding experience; budget regressions block merges or require an explicit exception.

## Recommended implementation sequence

1. Phase 0 baseline and tests.
2. Phase 1 CTA repairs and dialog wiring.
3. Phase 3 dialog/accessibility foundation—needed by the Phase 1 modals.
4. Phase 2 personalized action plan and navigation simplification.
5. Phase 4 data provenance and performance work.

## Definition of done

The enhancement is complete when:

- Every visible CTA has a tested result.
- Internship/application flows have verified destinations or an honest unavailable state.
- A selected student profile produces three concrete next actions.
- The main navigation, dialogs, and essential actions are keyboard- and touch-complete.
- Critical career claims show scope, source, and freshness.
- Mobile layout and performance are validated against the stated breakpoints and budgets.
