# 🎮 2D SILICON RUNNER: THE TAPEOUT ODYSSEY (MARIO / DINO STYLE ARCADE GAME)
> **Concept:** A 2D retro side-scrolling platformer & endless runner embedded directly inside the Career Roadmap page. Players control a pixelated Silicon Engineer running through 4 hardware worlds, jumping over clock skew glitches, collecting transistor coins, defeating timing violation monsters, and securing high-paying FANG hardware offers!

---

## 🕹️ Game Overview & Mechanics

Inspired by **Super Mario Bros** and the **Google Chrome Dino Game**, **`Silicon Runner 2D`** blends addictive retro arcade platforming with real ECE hardware lore.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  SCORE: 02450  │  STAGE: WORLD 2 (VERILOG CITY)  │  TRANSISTORS: 💎 148  │  HP: ❤❤❤  │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                                           👾 [Setup Violation]                   │
│        💎     💎                                                                 │
│       ┌───┐  ┌───┐                     ⚡ [Clock Skew]                           │
│       │ ? │  │ $ │                                                               │
│  🏃   └───┘  └───┘                  ▲▲▲                                         │
│  [BIT]                              ███                                         │
│ ════════════════════════════════════════════════════════════════════════════════ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Gameplay Features

### 1. Player Controls & Movement Physics
- **Controls:**
  - `Space` / `Up Arrow` / `Tap`: **Jump** (Double jump unlocked at Level 2).
  - `Down Arrow` / `S`: **Slide / Duck** under floating wire obstacles.
  - `Shift` / `F`: **Fire Logic Pulse** (Shoots a 1-bit logic beam to destroy timing bugs).
- **Physics Engine:** Smooth 60fps HTML5 Canvas 2D engine with gravity, momentum, particle trail effects, and collision detection.

### 2. Enemies & Hardware Obstacles
- 👾 **Setup/Hold Violation Bugs:** Crawling glitch monsters that must be stomped on or shot with logic pulses.
- ⚡ **Clock Skew Spikes:** High-voltage spikes rising from the floor (Jump over!).
- 🚧 **Unrouted Wire Obstacles:** Low-hanging power rails (Slide under!).
- 🌀 **Metastability Vortex:** Floating hazards moving in sine waves across the screen.

### 3. Power-ups & Collectibles
- 💎 **Transistors (+10 Pts & +5 XP):** Scattered across platforms.
- 💰 **NVIDIA / Intel Stock Coins (+100 Pts):** Rare golden coins floating in high places.
- ⭐ **Verilog Star Power (Super Mario Star):** Gives 5 seconds of rainbow invincibility with a high-speed dash!
- 🛡️ **UVM Testbench Shield:** Protects player from 1 collision hit.

---

## 🗺️ 4 Interactive World Stages

| World Stage | Theme | Background Aesthetic | World Boss |
| :--- | :--- | :--- | :--- |
| **World 1** | *Digital Logic Kingdom* | Green PCB Circuit Traces & Logic Gates | **Karnaugh Map Goliath** |
| **World 2** | *Verilog RTL City* | Cyberpunk Neon Code Towers & FPGA Matrix | **Infinite Loop Dragon** |
| **World 3** | *2nm GAAFET Cleanroom* | Glowing Silicon Wafers & High-NA EUV Lasers | **Sub-2nm IR Drop Titan** |
| **World 4** | *FANG Silicon Peak* | Futuristic Glass Fabs & Golden Stock Vaults | **The Tape-out Deadline** |

---

## 🏆 Career Rewards & Roadmap Integration

- **High Score = Career XP:** Every 500 game points earned grants **+100 Career XP** in the roadmap's System HUD!
- **Secret Level Unlocks:** Beating World 4 unlocks:
  - 🏆 **"Arcade Tape-out Master"** Profile Badge.
  - 📂 **Exclusive Downloadable Interview Deck:** *Tier-1 Silicon Company Verification Cheatsheet*.
- **Global & Local Leaderboard:** Tracks high scores with local player handles in `localStorage`.

---

## 🛠️ Technical Architecture

### Component File Structure
```
frontend/src/pages/career-roadmap/
├── components/
│   ├── SiliconRunner2D.tsx         # Main HTML5 2D Canvas Game Component
│   ├── GameOverlayHUD.tsx          # retro 8-bit score, hearts, and power-up HUD
│   ├── GameLeaderboardModal.tsx    # High score modal & badge rewards
│   └── SoundFxEngine.ts            # Chiptune 8-bit Web Audio sound effects
```

### Canvas Loop Implementation Spec (`SiliconRunner2D.tsx`)
```tsx
export const SiliconRunner2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId: number;
    let score = 0;
    
    // Game Loop
    const render = () => {
      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 2. Draw Retro Cyberpunk Background & Ground
      drawBackground(ctx);
      
      // 3. Update & Draw Player Physics
      updatePlayer();
      drawPlayer(ctx);
      
      // 4. Update & Draw Obstacles, Collectibles, & Enemies
      updateObstacles();
      drawObstacles(ctx);
      
      // 5. Check Collisions & Score
      checkCollisions();
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-teal-500/50 shadow-[0_0_40px_rgba(20,184,166,0.3)]">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-auto bg-[#0A0D14]" />
    </div>
  );
};
```

---

## 🗓️ Implementation Action Steps

1. **Step 1:** Create `SiliconRunner2D.tsx` featuring 60fps canvas animation loop, pixel player character, jumping/ducking mechanics, and ground rendering.
2. **Step 2:** Add obstacle generator (clock skew spikes, setup violation bugs, transistor collectibles).
3. **Step 3:** Implement Chiptune 8-bit sound synth (`SoundFxEngine.ts`) for jump sound, coin pickup, and game over tune.
4. **Step 4:** Build high score leaderboard and career roadmap XP reward wiring (`+100 XP` added to player System HUD).
5. **Step 5:** Embed the 2D Game component directly on the Explore / Skills tab with a glowing arcade toggle button (`🎮 LAUNCH 2D FAB RUNNER`).

---

## 🏁 Definition of Done (DoD)
- Smooth 60fps 2D platforming experience on desktop & mobile touch controls.
- Addictive Super Mario / Dino game mechanics with authentic ECE hardware themes.
- Saves high scores and awards XP directly to the student's career profile.
