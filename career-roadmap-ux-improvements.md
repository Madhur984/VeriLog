# Career Roadmap UX & Accessibility Improvements

## Goal
Implement a series of usability and clarity enhancements to the `/career-roadmap` page, including interactive acronym tooltips, a silicon-wafer themed timeline, a simplified user interface toggle, domain interest filtering, and real-world career path trajectories.

## Tasks
- [ ] Task 1: Create a unified Glossary/Tooltip utility (`src/pages/career-roadmap/components/AcronymTooltip.tsx`) and wrap key ECE terms (RTL, STA, UVM, ASIC, VLSI, CAD) in `DomainGrid.tsx` and `SkillGapRadar.tsx`.  
  → Verify: Hovering over the terms displays a clean explanation panel in the UI.
- [ ] Task 2: Refactor `StudentPathSection` in `src/pages/career-roadmap/sections/RoadmapSections.tsx` to display a silicon-layered timeline (Silicon Substrate, Active Transistors, Metal Interconnects, Packaging).  
  → Verify: Undergrad roadmap is styled like layers of a microchip with corresponding icons.
- [ ] Task 3: Add a "Telemetry / Beginner Mode" toggle to the page header / command bar in `src/pages/career-roadmap/index.tsx`. When in "Beginner Mode", hide complex charts and show simplified bulleted insights.  
  → Verify: Toggling the button shifts components into their respective simplified modes.
- [ ] Task 4: Build a "Help Me Choose" onboarding diagnostic modal inside `src/pages/career-roadmap/components/DiagnosticModal.tsx`. Connect it to a CTA button on the Explore page to help users find their ideal ECE domain.  
  → Verify: Answering the 3 diagnostic questions highlights the recommended domain card in the grid.
- [ ] Task 5: Add a "Typical Alumni Trajectories" case studies section to the About/Explore tab in `src/pages/career-roadmap/sections/RoadmapSections.tsx`.  
  → Verify: Three ECE alumni story paths (e.g. from service companies or college direct-to-core) are readable.

## Done When
- [ ] All 5 UX and accessibility improvements are rendered and interactable on `/career-roadmap`.
- [ ] Project compiles cleanly with no linting errors or color bans violated.
- [ ] The `ux_audit.py` scan reports success.

## Notes
- Tooltips will use standard Tailwind CSS hover utilities combined with absolute positioning.
- Use compliant brand colors (Teal, Cyan, Orange) and avoid any purple gradients or highlights.
