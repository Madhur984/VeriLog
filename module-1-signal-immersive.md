# Module 1: Signal System Immersive Experience

## Overview
Build a high-fidelity, interactive learning module for "Signals" that replaces traditional teaching with experiential discovery. The user enters a "living electronic system" and gains control over signals through a series of 6 immersive scenes.

## Project Type: WEB (Next.js / Vite + React)

## Success Criteria
- [x] Cinematic 6-8s entry sequence (Tunnel transition).
- [x] 6 core scenes following the SEE -> FEEL -> PREDICT -> TEST -> UNDERSTAND -> APPLY methodology.
- [x] Frame-accurate Wave Engine (<50ms latency, RAF based).
- [x] Premium, MEMORABLE design (No purple, No standard layouts, Deep depth).
- [x] Sensory feedback (Synchronized audio + glitched error states + micro-haptics).

## Tech Stack
- **Framework:** React + Vite (Existing)
- **Animation:** Framer Motion + GSAP
- **Rendering:** HTML5 Canvas (for Wave Engine and Tunnel)
- **State Management:** Zustand (Existing `useGlobalMemory` or local state for the engine)
- **Audio:** Web Audio API or pre-recorded clips
- **Styling:** Vanilla CSS / Tailwind (strictly following Design Commitment)

## File Structure
Modules will be housed under `frontend/src/components/level1/module1_v2/` to avoid breaking existing code while building.

```plaintext
frontend/src/components/level1/module1_v2/
├── Module1Immersive.tsx       # Main Orchestrator
├── Module1Container.tsx       # Layout & Sensory System
├── engines/
│   ├── WaveEngine.ts          # Core RAF logic
│   └── AudioEngine.ts         # Sound & Haptics
├── shared/
│   ├── CinematicTunnel.tsx    # Entry sequence
│   ├── SignalVisualizer.tsx   # Integrated Canvas view
│   └── SliderSet.tsx          # Custom themed controls
├── scenes/
│   ├── Scene1_Noise.tsx       # Why signals exist
│   ├── Scene2_Anatomy.tsx     # Amplitude & Frequency
│   ├── Scene3_Types.tsx       # Signal morphologies
│   ├── Scene4_ControlLab.tsx  # The core challenge
│   ├── Scene5_Interaction.tsx # Interference
│   └── Scene6_ApplyLab.tsx    # Mastery test
└── styles/
    └── module1_v2.css         # Radical design tokens
```

## Task Breakdown

### Phase 1: Analysis & Infrastructure
| Task ID | Name | Agent | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T1.1 | **Design Commitment** | `frontend-specialist` | P0 | None | UI spec → DESIGN COMMITMENT block → Socratic Gate passed |
| T1.2 | **Wave Engine Core** | `frontend-specialist` | P0 | None | Math formulas → `WaveEngine.ts` → Smooth 60fps wave rendering |
| T1.3 | **Audio System Setup** | `frontend-specialist` | P1 | None | Logic tags → `AudioEngine.ts` → Success/Error sounds triggered |

### Phase 2: Immersive Foundations
| Task ID | Name | Agent | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T2.1 | **Cinematic Tunnel** | `frontend-specialist` | P1 | T1.1 | Canvas logic → `CinematicTunnel.tsx` → 6-8s transition sequence |
| T2.2 | **Module Container** | `frontend-specialist` | P1 | T2.1 | Layout spec → `Module1Container.tsx` → Asymmetric layout + Gateway screen |
| T2.3 | **Theory System** | `frontend-specialist` | P1 | T1.1 | 3-Layer logic → `InsightBox.tsx` → Standardized discovery reveal |

### Phase 3: Scene Implementation
| Task ID | Name | Agent | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T3.1 | **Scene 1: Noise** | `frontend-specialist` | P2 | T1.2 | Logic → `Scene1_Noise.tsx` → Signal degrades with noise slider |
| T3.2 | **Scene 2: Anatomy** | `frontend-specialist` | P2 | T3.1 | Logic → `Scene2_Anatomy.tsx` → Amplitude/Freq control + Math toggle |
| T3.3 | **Scene 3: Types** | `frontend-specialist` | P2 | T3.2 | Logic → `Scene3_Types.tsx` → Wave morphs between Sine/Sq/Tri/Pulse |
| T3.4 | **Scene 4: Lab** | `frontend-specialist` | P2 | T3.3 | Logic → `Scene4_ControlLab.tsx` → Pulse travel + causality feedback |
| T3.5 | **Scene 5: Interaction**| `frontend-specialist` | P2 | T3.4 | Logic → `Scene5_Interference.tsx` → Constructive/Destructive visuals |
| T3.6 | **Scene 6: Mastery** | `frontend-specialist` | P2 | T3.5 | Task spec → `Scene6_ApplyLab.tsx` → Logic check + Achievement unlock |

### Phase 4: Integration
| Task ID | Name | Agent | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T4.1 | **V-OS Store Sync** | `frontend-specialist` | P1 | T3.6 | Achievement logic → `useGlobalMemory` → Progress saved to V-OS |
| T4.2 | **Route Binding** | `frontend-specialist` | P1 | T4.1 | App Router → `App.tsx` → Navigate to new Module 1 from Home |

## Phase X: Verification Checklist
- [x] No purple/violet hex codes (#8A2BE2, #9400D3, etc.) used.
- [x] Standard "Split Screen" layouts were rejected for radical asymmetry.
- [x] Frame latency < 16ms (60fps) during wave interaction.
- [x] Socratic Gate was respected (Design choices explained first).
- [x] `ux_audit.py` returns no psychological blockers.
- [x] `security_scan.py` confirms no secrets in frontend.

## ✅ PHASE X COMPLETE
- Lint: [x] 
- Security: [x] 
- Build: [x] 
- Date: [2026-04-05]
