# 🚀 2D SILICON RUNNER: PHASE 2 GAME ENHANCEMENT PLAN
> **Goal:** Elevate **`Silicon Runner 2D: Tapeout Odyssey`** from a fun arcade mini-game into a full-fledged retro ECE platformer complete with selectable hero classes, boss battles, a Transistor Power-up Shop, parallax environments, and global leaderboards.

---

## 🕹️ New Game Systems & Features

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [PLAYER: TIMING WIZARD]  │  SCORE: 05,420  │  WORLD: 3 (2NM CLEANROOM)  │  TRANSISTORS: 💎 340  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│            ⚡ [SPECIAL: TIME SLOW READY - PRESS E]                                              │
│                                                       👹 [BOSS: 2NM IR DROP TITAN HP: 60%]     │
│        💎      ⭐                                       🔥🔥🔥 [HEAT WAVE BEAM]                 │
│       ┌───┐   ┌───┐                                                                             │
│       │ $ │   │ ★ │                                  ▲▲▲                                        │
│  🧙‍♀️   └───┘   └───┘                                  ███                                        │
│  [STA WIZARD]                                                                                   │
│ ═══════════════════════════════════════════════════════════════════════════════════════════════ │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 1. Playable Hero Classes & Special Abilities

Players can select their hero class before starting a run:

| Class | Title | Special Ability (`E` Key / Mobile Button) | Perk |
| :--- | :--- | :--- | :--- |
| 🏃 **Bit The Engineer** | *RTL Design Hero* | **Overclock Dash** (3-second 2x speed burst) | Balanced jump & laser power |
| 🧙‍♀️ **Nora The Analyst** | *STA Timing Wizard* | **Chronos Time Warp** (Slows all obstacles by 60% for 5s) | Higher double jump height |
| 🥷 **Kael The Hunter** | *UVM Verification Ninja* | **Triple Pulse Barrage** (Shoots 3 logic lasers at once) | Transistor coins give +50% bonus score |

---

## 👹 2. World Boss Battles

At the end of each World stage (every 1,000 points), a Stage Boss enters the screen:

1. **World 1 Boss: `Karnaugh Map Goliath`**
   - Fires truth table blocks (`0` and `1` blocks) at varying heights.
   - **Weakness:** Shoot 5 Logic Lasers at its glowing Karnaugh grid core.
2. **World 2 Boss: `Infinite Loop Hydra`**
   - Spawns recursive clock spikes from the ground.
   - **Weakness:** Jump over 3 recursive waves to overload its buffer stack.
3. **World 3 Boss: `2nm IR Drop Titan`**
   - Fires high-voltage heat wave beams across the middle of the screen (requires sliding/ducking).
   - **Weakness:** Collect 3 Superconductor Cooling Cores to freeze the boss.
4. **World 4 Boss: `The Tape-out Clock`**
   - Final Boss: A giant clock wave that speeds up time and drops timing violation meteorites!

---

## 🛒 3. Transistor Power-Up Shop (`HardwareShopModal.tsx`)

Players can spend accumulated 💎 **Transistor Gems** earned across runs in a persistent hardware shop:

- 🚀 **Rocket Thruster Boots (200 💎):** Unlocks Permanent Triple Jump.
- 🧲 **NVIDIA Coin Magnet (350 💎):** Magnetically pulls stock coins toward player.
- 🛡️ **GAAFET Armor (500 💎):** Player starts every run with +2 Extra Hearts.
- ⚡ **5GHz Frequency Multiplier (600 💎):** Permanent +25% Score Multiplier on all actions.

---

## 🎨 4. Parallax Backgrounds & Sensory Feedback

- **Multi-layered Parallax Backgrounds:**
  - Layer 1: Distant Cyberpunk City skyline / Silicon Fab wafer steppers.
  - Layer 2: Mid-ground glowing EUV laser beams & floating PCB circuit lines.
  - Layer 3: Foreground high-speed conveyor ground.
- **Web Audio Sound Enhancements:**
  - Dynamic chiptune background music loop synthesized via Web Audio API.
  - Haptic feedback pulses (`navigator.vibrate([30])`) on collisions and boss hits.

---

## 🏆 5. Global Arcade Leaderboard & Achievements

- **Leaderboard Tab:** Displays top 10 player high scores with local player handles.
- **Achievement Badges:**
  - 🏆 **"Sub-2nm Tapeout Clearance"** (Beat World 3 Boss).
  - ⚡ **"Frequency Monster"** (Reach 5,000 Pts).
  - 💎 **"Transistor Tycoon"** (Collect 1,000 total Transistors).

---

## 🗓️ Implementation Action Plan

| Step | Component | Description | Status |
| :--- | :--- | :--- | :--- |
| **Step 1** | Hero Class Selection | Add class selection UI (`Bit`, `Nora`, `Kael`) with unique special abilities (`Key E`). | 🚀 Ready |
| **Step 2** | Boss Battle Engine | Add boss spawning logic, boss HP bars, and unique boss attack patterns. | 🚀 Ready |
| **Step 3** | Transistor Power-up Shop | Build persistent shop UI for spending Transistor gems on permanent upgrades. | 🚀 Ready |
| **Step 4** | Parallax & Audio Synth | Add multi-layer parallax canvas rendering & background chiptune sound loop. | 🚀 Ready |

---

## 🏁 Definition of Done (DoD)
- Selectable hero classes with working special abilities.
- Working Boss Battles at 1,000+ points with HP bars and defeat animations.
- Persistent Transistor Shop saving upgrades in `localStorage`.
- Smooth 60fps performance on desktop & mobile devices.
