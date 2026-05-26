# ECE Career Roadmap Simplification Plan

The ECE Career Roadmap page `/career-roadmap` currently renders 15+ complex sections in a single long scrolling layout, causing extreme cognitive load, duplicate DOM IDs, color ban violations (purple nodes), and accessibility check failures (missing input labels). 

This plan details a tab-based dashboard consolidation, removing unused files, adding semantic labels, and fixing color configurations to satisfy all Maestro design guidelines.

## Success Criteria
- Consolidated dashboard with 4 tabs and a unified command bar navigation.
- 0 accessibility violations regarding form inputs without labels in ECE Roadmap modules.
- 0 occurrences of purple/violet hex codes in the ECE roadmap topology.
- App builds and compiles successfully without any TypeScript or styling errors.

## Tech Stack
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React

## File Structure
No new files will be created. We will modify existing files and delete one orphan file:
- `[MODIFY]` [index.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/pages/career-roadmap/index.tsx)
- `[MODIFY]` [FloatingCommandBar.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/components/FloatingCommandBar.tsx)
- `[MODIFY]` [SkillGraph.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/pages/career-roadmap/components/SkillGraph.tsx)
- `[MODIFY]` [SkillTopology.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/pages/career-roadmap/sections/SkillTopology.tsx)
- `[MODIFY]` [DomainExplorer.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/components/DomainExplorer.tsx)
- `[MODIFY]` [FiscalMatrix.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/pages/career-roadmap/sections/FiscalMatrix.tsx)
- `[DELETE]` [CareerRoadmapLayout.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/pages/career-roadmap/CareerRoadmapLayout.tsx)

---

## Task Breakdown

### Task 1: Clean Up Layouts & Orphans
- **Goal:** Delete the unused `CareerRoadmapLayout.tsx` component.
- **INPUT:** `frontend/src/pages/career-roadmap/CareerRoadmapLayout.tsx`
- **OUTPUT:** File deleted.
- **VERIFY:** Verify the file no longer exists and check if imports in `App.tsx` or `index.tsx` are clean.

### Task 2: Implement Tab Switching in FloatingCommandBar
- **Goal:** Convert `FloatingCommandBar.tsx` from scroll anchors to an interactive tab-state controller.
- **INPUT:** `FloatingCommandBar.tsx`
- **OUTPUT:** Accept `activeTab` and `setActiveTab` callbacks. Highlight the current active tab cleanly.
- **VERIFY:** Verify component compiles cleanly.

### Task 3: Group page sections into Tabbed Dashboard
- **Goal:** Group all 15 sections in `index.tsx` into 4 interactive tabs.
- **INPUT:** `index.tsx`
- **OUTPUT:** Page divided into 4 visual panels selectable from the command bar. Remove duplicate outer IDs.
- **VERIFY:** Load page and click command bar options to swap tabs.

### Task 4: Fix Accessibility Issues (Form Input Labels)
- **Goal:** Add hidden labels to query inputs, dropdowns, and sliders.
- **INPUT:** `SkillTopology.tsx`, `DomainExplorer.tsx`, and `FiscalMatrix.tsx`.
- **OUTPUT:** `<label className="sr-only">` tags for search queries and range sliders.
- **VERIFY:** Run `python .agent/skills/frontend-design/scripts/ux_audit.py` and verify `Cognitive Load` issues are gone.

### Task 5: Comply with Purple Ban
- **Goal:** Replace purple border configurations in the topology skill graph.
- **INPUT:** `SkillGraph.tsx`
- **OUTPUT:** Change `#A78BFA` to teal (`#14B8A6` or `#0D9488`).
- **VERIFY:** Verify no purple nodes appear in the topology graph.

---

## Phase X: Verification

### Automated Verifications
- Run UX audit:
  ```bash
  python .agent/skills/frontend-design/scripts/ux_audit.py frontend/src/pages/career-roadmap
  ```
- Run Build check:
  ```bash
  npm run build
  ```

### Manual Checks
- Verify layout responsiveness and fluid spring-physics transitions between tabs.
- Check keyboard shortcut listeners.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: May 25, 2026
