# Career Roadmap Audit

**Scope:** `http://localhost:5173/career-roadmap`  
**Reviewed:** 9 August 2026  
**Method:** Live route availability check, implementation review of the page and its linked UI, interaction-path tracing, responsive-class review, and static accessibility/performance checks. The route returned HTTP 200. Automated build/lint execution could not complete in this sandbox because Node was denied access while resolving the user profile; this is an environment restriction, not evidence of an application failure.

## Executive summary

This is an unusually rich and differentiated career page. Its strongest idea is the combination of a practical learning roadmap with domain-specific career data, diagnostic guidance, skills tooling, salary exploration, and portfolio support. The main issue is not lack of features; it is **feature density and trust**. A first-time student is asked to interpret several competing navigation systems, dense jargon, and many “intelligence/telemetry” surfaces before reaching a clear next action.

The first release priority should be to repair the two dead opportunity CTAs, make the core guided route unmistakable, and improve the mobile/keyboard behavior of the dense interfaces. Only then should additional interactive modules be added.

## What is working well

- The page has a clear value proposition: it connects an ECE degree to actual semiconductor roles rather than providing generic career advice.
- The top personalization flow is appropriately early and uses familiar stage/domain choices.
- The domain cards, playbooks, salary content, company directory, and resume tooling create a credible end-to-end story.
- A separate beginner/telemetry view acknowledges two audience skill levels.
- External career links use `target="_blank"` with `rel="noopener noreferrer"` where inspected.
- Lazy loading is used for heavyweight telemetry tools, which is a sound baseline performance decision.
- The footer clearly warns that pay and demand figures are ranges, not guarantees.

## Verified findings

| Priority | Finding | User impact | Recommendation |
| --- | --- | --- | --- |
| P0 | **Internship Matrix** and **Govt Initiatives** buttons have empty callbacks. The modal components exist but are not mounted from the page. | Two prominent opportunity routes appear interactive but do nothing, harming trust. | Add `isInternshipsOpen`/`isGovtOpen` state, wire the callbacks, render the modals, and add a smoke test for each CTA. |
| P0 | The internship modal’s **Apply Now** control has no action or target URL. | Students can discover an opportunity but cannot apply. | Add a verified application URL to each internship record. Render a real external link; hide/label unavailable entries rather than offering a dead button. |
| P1 | There are three competing navigation concepts: sticky section rail, floating tab dock, and workflow cards. | Orientation cost is high, especially after a deep scroll or on a small screen. | Make the floating dock the primary cross-page navigation, reduce the top rail to a “Jump to” menu or context-aware section indicator, and preserve tab/scroll position in the URL. |
| P1 | “Launch Trajectory Simulator” switches to Skills, but does not land the user at the simulator. | The CTA does not fulfil its stated promise immediately. | Change tab, then scroll/focus the simulator heading after it mounts; alternatively use a direct `?tab=skills#simulator` URL. |
| P1 | The page opens with a 4.5-second cold splash for every new session. | Returning/keyboard-first users face a blocking interruption before content and navigation are available. | Remove it on normal visits, show it only for an explicit “experience intro,” and always include a visible, focusable Skip button. Respect reduced-motion preferences. |
| P1 | The journey is long and module-heavy before a student reaches one concrete plan. | Beginners may browse rather than progress. | After personalization, show a compact **Your next 3 actions** card: first lesson, one portfolio artifact, and one role/company target. Treat other modules as optional depth. |
| P1 | Career and compensation claims are presented with a single “July 2026” marker while several figures are high-stakes and time-sensitive. | Readers may over-trust broad salary/job-demand numbers. | Add per-stat source and publication date, a last-verified date, geography/seniority/tooltips, and a scheduled data-review owner. Do not use a general source index as the only provenance. |
| P2 | Dense monospace uppercase copy and many 8–11 px text styles are used throughout the page (256 matches in this feature). | Readability and touch usability suffer, particularly on mobile and for low-vision users. | Set 14–16 px as the default body/UI minimum; reserve 11–12 px only for nonessential metadata. Use sentence case for explanations and maintain generous line-height. |
| P2 | Several modal patterns lack dialog semantics, focus trapping, initial focus, focus return, and Escape-key handling. One close label says `[ ESC ] CLOSE`, but Escape is not implemented there. | Keyboard and screen-reader users can lose their place or be unable to dismiss a dialog predictably. | Use a shared accessible dialog primitive: `role="dialog"`, `aria-modal="true"`, labelled title, focus trap, Escape/backdrop close where appropriate, and restore focus to the opener. |
| P2 | Critical hover-only content appears in the internship list (conversion/apply row becomes visible only on hover). | Touch users may never discover the apply route; keyboard users receive a poor affordance. | Keep important actions visible on all input types, or reveal them on `:focus-within` and provide a consistently visible card action. |
| P2 | Icon-only controls, including the diagnostic close control and graph controls, are not consistently labelled. | Screen-reader users cannot reliably identify their purpose. | Require `aria-label`/`title` for every icon-only button and verify focus-visible styles. |
| P2 | The floating dock auto-hides when the user scrolls down. | It can disappear at the point a user needs orientation; the permanent bottom dock also competes with content/actions. | Keep a small persistent “current section / menu” affordance, or reveal the dock on any pointer movement/focus. Add bottom-safe-area padding. |
| P2 | Content personalization is saved to `localStorage` without a visible “saved locally” explanation or reset confirmation. | Shared-device users may be surprised by persistent career choices. | Explain persistence near the control, offer “clear saved roadmap,” and store only the minimum needed preference data. |
| P3 | The telemetry naming system (“Fiscal Matrix,” “Intel Hub,” “Silicon Radar,” “ATS Compiler”) is visually cohesive but can obscure plain-language intent. | New students may not know which tool solves their immediate problem. | Pair every branded label with a plain subtitle and action verb, e.g. “Salary Explorer — compare India and global compensation.” |
| P3 | The page loads several large specialist bundles in the overall application build (Three.js/vendor bundles are large). | Potential mobile/LCP cost if any heavy visual is pulled into the initial route. | Use route-level bundle analysis, defer charts/canvas until their tab opens, use static summaries by default, and set performance budgets for the career route. |

## Suggested information architecture

The page should behave like a guided decision tool, not a catalogue:

1. **Choose your stage and target domain.**
2. **Receive a personal plan:** three actions for this week, one project, and an outcome checkpoint.
3. **Explore evidence:** role details, skill map, company expectations, salary context, and live opportunities.
4. **Prove readiness:** quiz/labs, project evidence, and resume export.

Keep the advanced graph, heatmap, simulator, and financial tools behind an explicit “Explore advanced tools” boundary. They are valuable, but should not compete with the primary roadmap.

## Responsive and visual recommendations

- Test 320 px, 375 px, 768 px, 1024 px, and 1440 px widths. Pay particular attention to the sticky header, horizontal section rail, floating bottom dock, dense card grids, and modal filter rows.
- Prefer one full-width primary action per mobile card. Ensure 44 × 44 px minimum touch targets.
- Let complex data tables transform into labelled cards under the tablet breakpoint; do not require horizontal scrolling for key comparisons.
- Reduce animation and glow effects when `prefers-reduced-motion: reduce` is enabled; stop auto-moving tickers in that mode.
- Use color as reinforcement, not the sole way to communicate “active,” “high demand,” or “selected.”

## Measurement plan

Instrument these events before redesigning further:

- `roadmap_personalized` (stage, domain)
- `recommended_next_step_opened` and `recommended_step_completed`
- `domain_playbook_opened`
- `internship_directory_opened`, `internship_apply_clicked`
- `salary_context_opened` (not salary value)
- `resume_exported`
- `cta_noop_error` for any control without a completed action

Track completion of a student’s first recommended action as the north-star metric. Secondary metrics: personalization completion, opportunity outbound clicks, and return completion rate.

## Delivery order

### Sprint 1 — repair trust and accessibility

1. Wire and test the two empty opportunity CTAs.
2. Replace dead “Apply Now” buttons with verified application links.
3. Fix modal keyboard/focus behavior and icon names.
4. Make the simulator CTA land on the simulator.
5. Remove or make the cold splash fully skippable and motion-safe.

### Sprint 2 — clarify the student path

1. Add the personalized “next 3 actions” plan and progress state.
2. Simplify navigation to one primary system.
3. Rewrite the first-screen copy and section labels in plainer language.
4. Increase minimum text and touch target sizes.

### Sprint 3 — improve confidence and performance

1. Add per-claim data provenance and a refresh process.
2. Run a route-level bundle/Lighthouse audit with real mobile throttling.
3. Load advanced visualisations only on demand and add performance budgets.
4. Validate the completed page with keyboard-only, screen-reader, and device testing.

## Acceptance checklist

- Every visible CTA produces a clear result, a valid route, or a labelled disabled state.
- Keyboard users can navigate, operate, and dismiss every interactive surface without a mouse.
- A first-year student can identify their next action within 30 seconds of finishing personalization.
- Mobile users can access all essential actions without hover, horizontal guessing, or obscured content.
- Salary, demand, and hiring claims identify their source, scope, and last verification date.
- The initial career route remains fast without loading advanced charts/visualisations until requested.
