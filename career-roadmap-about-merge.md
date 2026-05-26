# ECE Career Roadmap & About Page Merge Plan

This plan tracks the work to integrate the newly built `/about` components into the `/career-roadmap` page as the 5th tab. This unifies all roadmap, skill prerequisites, simulation, credentials, and mission components in a single dashboard.

## Success Criteria
- The `/career-roadmap` page includes a 5th tab `ABOUT` displaying the platform mission sections.
- The floating command bar dynamically controls 5 tabs.
- The standalone `/about` route is removed and deleted.
- App builds and compiles successfully.

## Tech Stack
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React

## File Structure
- `[MODIFY]` [index.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/pages/career-roadmap/index.tsx)
- `[MODIFY]` [FloatingCommandBar.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/components/FloatingCommandBar.tsx)
- `[MODIFY]` [App.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/App.tsx)
- `[DELETE]` [index.tsx](file:///d:/games/games/kriten_documents/VeriLog_k1/frontend/src/pages/about/index.tsx)

---

## Task Breakdown

### Task 1: Update FloatingCommandBar.tsx
- **Goal:** Add `ABOUT` to the dashboard pill nav and remove location logic.
- **INPUT:** `FloatingCommandBar.tsx`
- **OUTPUT:** Nav items has 5 tabs: `EXPLORE`, `SKILLS`, `FINANCIALS`, `PORTFOLIO`, `ABOUT`.
- **VERIFY:** Component compiles cleanly.

### Task 2: Integrate About Sections into Career Roadmap
- **Goal:** Update the career roadmap `index.tsx` to handle the `about` tab.
- **INPUT:** `index.tsx`
- **OUTPUT:** Import `AboutHero`, `TheProblem`, `FounderStory`, `TheMission`, `WhatWeBuilt`, `WhoThisIsFor`, `TheDifference`, `AboutCTA`. Handle `activeTab === 'about'` state and render all 8 sections inside. Add shortcut `A`.
- **VERIFY:** Dashboard displays 5 tabs.

### Task 3: Remove Redundant Routes & Files
- **Goal:** Remove `/about` route from `App.tsx` and delete the standalone about page index.
- **INPUT:** `App.tsx` and `src/pages/about/index.tsx`.
- **OUTPUT:** Standalone `/about` route deleted.
- **VERIFY:** Verify route `/about` redirects to portal home.

---

## Phase X: Verification
- Run UX audit scan:
  ```bash
  python .agent/skills/frontend-design/scripts/ux_audit.py frontend/src/pages/career-roadmap
  ```
- Run Build check:
  ```bash
  npm run build
  ```
