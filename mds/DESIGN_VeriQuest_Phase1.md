# VeriQuest Design Document (Phase-1)

**Version:** 1.0  
**Date:** January 23, 2026  
**Phase:** Phase-1 (Scope Locked)

---

## Design Philosophy

**Product Feel:** Duolingo × Angry Birds × Among Us (electrical tasks)

**Core Principles:**
1. Visual first, text last
2. Interaction before explanation
3. One action per screen
4. No fear-based feedback
5. Strong physicality (drag, snap, glow, sound)

---

## Visual Style Guide

### Color Palette

```
Primary Background:    #0a0e27 (Deep Space Blue)
Secondary Background:  #1a1f3a (Lighter Space)
Accent Primary:        #00d9ff (Electric Cyan)
Accent Secondary:      #ff6b35 (Warm Orange)
Success:               #4caf50 (Bright Green)
Warning:               #ffc107 (Amber)
Neutral:               #b0bec5 (Soft Gray)
Wire Inactive:         #4a5568 (Dark Gray)
Wire Active:           #fbbf24 (Golden Yellow)
Glow Effect:           #00d9ff with 20px blur
```

### Typography

**Primary Font:** Outfit (Google Fonts)
- Headings: 700 weight, 32-48px
- Bot messages: 600 weight, 18px
- Labels: 500 weight, 14px

**Secondary Font:** Inter (Google Fonts)
- Body text: 400 weight, 16px
- Captions: 400 weight, 12px

### Grid & Spacing

- **Base unit:** 8px
- **Component padding:** 16px (2 units)
- **Section spacing:** 32px (4 units)
- **Screen margins:** 64px (8 units)
- **Snap radius:** 20px

### Icon Style

- **Format:** SVG, 48×48px base size
- **Style:** Rounded corners (4px radius), 2px stroke weight
- **Colors:** Single color with glow on active state
- **Playful but technical:** Simplified circuit symbols with personality

---

## Screen-by-Screen Wireframes

### Screen 1: Website Entry

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│                  [INTRO VIDEO]                          │
│                  Auto-playing                           │
│                  Fullscreen                             │
│                  No controls                            │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specs:**
- Fullscreen takeover (Fullscreen API)
- Video: 16:9 aspect ratio, centered
- Background: #0a0e27
- Auto-advance after video ends (or 30s timeout)
- Skip button: bottom-right, subtle, appears after 5s

---

### Screen 2: Welcome Overlay

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│              ┌─────────────────┐                        │
│              │   🤖 Bot Icon   │                        │
│              │  (LED Mascot)   │                        │
│              └─────────────────┘                        │
│                                                         │
│         "Hey! Let's jump into some activities."         │
│                                                         │
│              ┌─────────────────┐                        │
│              │  Start Playing  │  ← Primary CTA         │
│              └─────────────────┘                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specs:**
- Bot: 120×120px, centered, bounce-in animation (0.3s)
- Text: Outfit 600, 24px, #b0bec5, centered
- CTA button: 200×56px, #00d9ff background, rounded 28px
- Button hover: scale(1.05), glow effect
- Fade-in sequence: Bot → Text → Button (0.2s stagger)

---

### Screen 3: Activity 1 – Complete the Circuit

```
┌─────────────────────────────────────────────────────────┐
│  🤖 "Drag the missing pieces to light up the bulb"      │
│                                                         │
│                                                         │
│    [Battery]─────[  ?  ]─────[  ?  ]─────[Bulb]        │
│                   slot1       slot2      (dark)        │
│                                                         │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │  Component Tray                              │      │
│  │  [Resistor]  [Wire]  [Capacitor (distractor)]│      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Layout Specs:**
- Circuit area: 60% viewport height, centered
- Component tray: Bottom 20%, full width, #1a1f3a background
- Bot message: Top-left, speech bubble, 300px max width
- Slots: 80×80px, dashed border (#4a5568), 4px dash

**Interaction States:**

*Slot (Empty):*
- Border: 2px dashed #4a5568
- Background: transparent
- Hover: border color → #00d9ff

*Slot (Correct Component Hovering):*
- Border: 2px solid #4caf50
- Background: rgba(76, 175, 80, 0.1)
- Magnetic pull animation (20px radius)

*Slot (Filled):*
- Border: none
- Component snapped in place
- Wire connections appear

**Success State:**
- Wire glow animation (0.8s, left to right)
- Bulb lights up (radial gradient glow)
- Spark particles (10 particles, 0.5s)
- Bot message: "You created a signal! Electricity is flowing."

---

### Screen 4: Activity 2 – AND Gate Decision

```
┌─────────────────────────────────────────────────────────┐
│  🤖 "This gate lights the LED when BOTH switches are ON"│
│                                                         │
│     [Switch A]──┐                                       │
│                 │    [  ?  ]─────[LED]                  │
│     [Switch B]──┘    (gate)      (dark)                │
│                                                         │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │  Component Tray                              │      │
│  │  [AND Gate]  [OR Gate]                       │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Switch Component:**
- Size: 60×100px
- Lever: 40×20px rounded rectangle
- States:
  - OFF: Lever at bottom, gray (#4a5568)
  - ON: Lever at top, blue (#00d9ff), glow effect
- Animation: 0.2s ease-out, rotate 30°
- Click area: 80×120px (larger hitbox)
- Sound: `click.mp3` on toggle

**Gate Slot:**
- Size: 100×80px
- Shows gate symbol when filled
- Input pins: left side (2 circles, 8px diameter)
- Output pin: right side (1 circle, 8px diameter)

**LED Component:**
- Size: 40×40px circle
- OFF: #2d3748 (dark gray)
- ON: Radial gradient (#4caf50 → transparent), pulsing (1s loop)

---

### Screen 5: Activity 3 – OR Gate Decision

```
┌─────────────────────────────────────────────────────────┐
│  🤖 "This gate lights the LED when ANY switch is ON"    │
│                                                         │
│     [Switch A]──┐                                       │
│                 │    [  ?  ]─────[LED]                  │
│     [Switch B]──┘    (gate)      (dark)                │
│                                                         │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │  Component Tray                              │      │
│  │  [OR Gate]  [AND Gate]                       │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Specs:** Identical to Screen 4, different gate and bot message

**Gate Visual Difference:**
- AND gate: D-shaped symbol with flat left edge
- OR gate: Curved symbol with pointed left edge
- Both: 2px stroke, #b0bec5 color, labeled pins

---

### Screen 6: Activity 4 – Multi-Gate Workbench

```
┌─────────────────────────────────────────────────────────┐
│  🤖 "Build: LED lights if A is ON AND (B or C) is ON"   │
│                                                         │
│   [A]──┐                                                │
│        │  [Gate 1]──┐                                   │
│   [B]──┤            │  [Gate 2]─────[LED]               │
│        │            │                                   │
│   [C]──┘            │                                   │
│                     │                                   │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │  [AND] [AND] [OR] [OR]                       │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Auto-Connecting Wires:**
- Animate from output pin to input pin (0.3s)
- Path: Straight or 90° bends (no diagonals)
- Color: #fbbf24 (golden yellow)
- Width: 4px, rounded caps
- Glow: 8px blur, #fbbf24

**Success State:**
- All wires glow sequentially (0.2s per segment)
- LED lights up
- Confetti animation (20 particles, 2s duration)
- Sound: `build-complete.mp3` (1s triumphant melody)
- Bot: "You're a circuit builder now!"

---

### Screen 7: Soft Login Prompt

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              ┌─────────────────┐                        │
│              │   🤖 Bot Icon   │                        │
│              │  (celebrating)  │                        │
│              └─────────────────┘                        │
│                                                         │
│              "Amazing work! Want to save                │
│               your progress?"                           │
│                                                         │
│         ┌──────────────┐  ┌──────────────┐             │
│         │ Continue as  │  │    Login     │             │
│         │    Guest     │  │              │             │
│         └──────────────┘  └──────────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Button Specs:**
- Guest button: 180×56px, outlined (#b0bec5), secondary
- Login button: 180×56px, filled (#00d9ff), primary
- Spacing: 16px gap
- Both: rounded 28px, hover scale(1.05)

---

## Bot Character Design

### Visual Design

**Appearance:** LED mascot with logic gate body
- Body: Rounded rectangle (60×80px) resembling AND/OR gate
- Eyes: Two circles (12px) that glow (#00d9ff)
- Antenna: Single line with circle on top (LED bulb)
- Color: #b0bec5 base, glowing accents

### States

**Idle:**
- Gentle float animation (2px vertical, 2s loop)
- Eyes: soft glow pulse (50% opacity variation)

**Success:**
- Jump animation (20px up, 0.3s, bounce easing)
- Eyes: bright glow (#4caf50)
- Antenna LED: blinks 3 times

**Hint:**
- Tilt 15° toward hinted element
- Eyes: look toward target (CSS transform)
- Gentle bounce (5px, 0.5s)

### Speech Bubble

- Background: #1a1f3a, 90% opacity
- Border: 2px solid #00d9ff
- Padding: 16px
- Max width: 300px
- Tail: 20×10px triangle pointing to bot
- Font: Outfit 600, 18px, #ffffff
- Animation: Fade-in + scale (0.3s)

---

## Component Tray UI

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Component Tray                                        │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │
│  │ [Icon] │  │ [Icon] │  │ [Icon] │  │ [Icon] │      │
│  │ Label  │  │ Label  │  │ Label  │  │ Label  │      │
│  └────────┘  └────────┘  └────────┘  └────────┘      │
└────────────────────────────────────────────────────────┘
```

**Specs:**
- Background: #1a1f3a
- Height: 140px
- Padding: 24px
- Component tiles: 80×100px, 16px gap
- Border-radius: 12px

### Component Tile States

**Idle:**
- Background: transparent
- Border: 2px solid #4a5568
- Icon: #b0bec5
- Label: Outfit 500, 14px, #b0bec5

**Hover:**
- Background: rgba(0, 217, 255, 0.1)
- Border: 2px solid #00d9ff
- Icon: #00d9ff with glow
- Cursor: grab
- Scale: 1.05 (0.1s)

**Dragging:**
- Opacity: 0.8
- Scale: 1.1
- Cursor: grabbing
- Shadow: 0 8px 16px rgba(0, 0, 0, 0.3)
- Z-index: 1000

**Disabled (already placed):**
- Opacity: 0.3
- Cursor: not-allowed
- No hover effect

---

## Phase-1 Component Library

### Battery
- **Icon:** Rectangle with + and - terminals
- **Size:** 60×40px
- **Color:** #ff6b35 (orange)
- **Active state:** Glowing terminals

### Resistor
- **Icon:** Zigzag line in rectangle
- **Size:** 60×20px
- **Color:** #b0bec5 → #ff6b35 when active
- **Symbol:** Standard resistor symbol

### Switch
- **Icon:** Lever toggle
- **Size:** 60×100px
- **States:** OFF (gray) / ON (cyan + glow)
- **Interactive:** Click to toggle

### LED/Bulb
- **Icon:** Circle with rays
- **Size:** 40×40px
- **States:** OFF (#2d3748) / ON (green radial gradient)
- **Animation:** Pulse when ON (1s loop)

### AND Gate
- **Icon:** D-shape with flat left
- **Size:** 100×80px
- **Inputs:** 2 pins (left)
- **Output:** 1 pin (right)
- **Label:** "AND" inside shape

### OR Gate
- **Icon:** Curved shape with pointed left
- **Size:** 100×80px
- **Inputs:** 2 pins (left)
- **Output:** 1 pin (right)
- **Label:** "OR" inside shape

---

## Animation Specifications

### Drag & Drop

**Pickup:**
```javascript
anime({
  targets: '.component',
  scale: 1.1,
  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
  duration: 150,
  easing: 'easeOutQuad'
});
```

**Magnetic Snap:**
```javascript
anime({
  targets: '.component',
  translateX: targetX,
  translateY: targetY,
  duration: 200,
  easing: 'easeOutBack'
});
```

**Rejection Bounce:**
```javascript
anime({
  targets: '.component',
  translateX: [
    { value: -3, duration: 50 },
    { value: 3, duration: 50 },
    { value: 0, duration: 50 }
  ],
  easing: 'easeInOutQuad'
});
```

### Wire Glow

**Signal Propagation:**
```css
@keyframes wire-glow {
  0% { 
    stroke-dashoffset: 100;
    filter: brightness(1);
  }
  100% { 
    stroke-dashoffset: 0;
    filter: brightness(1.5) drop-shadow(0 0 8px #fbbf24);
  }
}
.wire-active {
  animation: wire-glow 0.8s ease-out forwards;
}
```

### Switch Toggle

```javascript
anime({
  targets: '.switch-lever',
  rotate: [0, 30],
  translateY: [0, -20],
  backgroundColor: ['#4a5568', '#00d9ff'],
  duration: 200,
  easing: 'easeOutCubic'
});
```

### Success Confetti

```javascript
// 20 particles, random colors
for (let i = 0; i < 20; i++) {
  anime({
    targets: `.particle-${i}`,
    translateX: anime.random(-200, 200),
    translateY: [0, anime.random(300, 500)],
    rotate: anime.random(-360, 360),
    opacity: [1, 0],
    duration: 2000,
    delay: anime.random(0, 200),
    easing: 'easeOutQuad'
  });
}
```

**Timing Standards:**
- Micro-interactions: 100-200ms
- Component animations: 200-500ms
- Success celebrations: 1-2s
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy)

---

## Sound Design Specifications

| Sound | Duration | Description | Trigger | Volume |
|-------|----------|-------------|---------|--------|
| `click.mp3` | 80ms | Mechanical switch click | Switch toggle | 60% |
| `thud.mp3` | 50ms | Satisfying drop | Component snap | 70% |
| `pickup.mp3` | 30ms | Soft whoosh | Drag start | 50% |
| `spark.mp3` | 200ms | Electrical crackle | Circuit complete | 65% |
| `success.mp3` | 300ms | Bright chime | LED lights up | 75% |
| `build-complete.mp3` | 1s | Triumphant melody | Activity 4 done | 80% |

**Audio Implementation:**
- Format: MP3, 44.1kHz, mono
- Total size: <100KB
- Preload: All sounds on page load
- Playback: Web Audio API (low latency)
- Respect: System mute, `prefers-reduced-motion`

---

## Accessibility Specifications

### Keyboard Navigation

- **Tab order:** Component tray → Slots → Bot CTA
- **Drag alternative:** Arrow keys to select, Enter to place
- **Switch toggle:** Space or Enter
- **Focus indicator:** 3px solid #00d9ff outline, 2px offset

### Screen Reader

- **Bot messages:** `aria-live="polite"`
- **Components:** `aria-label="Battery component, draggable"`
- **Slots:** `aria-label="Empty slot for resistor"`
- **Success:** `aria-live="assertive"` for completion messages

### Color Contrast

- Text on dark background: 7:1 (AAA)
- Interactive elements: 4.5:1 minimum (AA)
- Focus indicators: 3:1 against background

### Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

**Phase-1: Desktop Only**
- Minimum: 1366×768
- Optimal: 1920×1080
- Maximum: 2560×1440

**Mobile (Phase-2):**
- Show message: "VeriQuest works best on desktop"
- Provide email signup for mobile launch notification

---

## Implementation Checklist

### Global Setup
- [ ] Fullscreen API integration
- [ ] SVG sprite sheet for components
- [ ] Audio preloader
- [ ] Font loading (Outfit, Inter)
- [ ] Color CSS variables

### Screen Components
- [ ] Video player (auto-play, skip)
- [ ] Bot character (3 states)
- [ ] Speech bubble component
- [ ] Component tray
- [ ] Draggable component wrapper

### Circuit Components
- [ ] Battery (static)
- [ ] Resistor (static)
- [ ] Switch (interactive)
- [ ] LED (animated)
- [ ] AND gate (logic)
- [ ] OR gate (logic)
- [ ] Wire renderer (SVG paths)

### Animations
- [ ] Drag & drop (anime.js)
- [ ] Magnetic snap
- [ ] Wire glow (CSS + JS)
- [ ] Confetti particles
- [ ] Bot reactions

### Audio
- [ ] Sound manager (preload, play)
- [ ] 6 sound effects
- [ ] Volume control
- [ ] Mute respect

### Accessibility
- [ ] Keyboard navigation
- [ ] ARIA labels
- [ ] Focus management
- [ ] Reduced motion support

---

## Design Handoff Notes

### For Figma Designers
1. Use provided color palette exactly
2. Export icons as SVG (48×48px artboard)
3. Create component variants for all states
4. Prototype drag interactions with Smart Animate
5. Include motion specs in Figma comments

### For Frontend Engineers
1. Use `shadcn/ui` for base components (buttons, overlays)
2. Implement drag with `react-dnd` or native HTML5
3. Use `anime.js` for complex animations
4. SVG circuits: inline in React components
5. Audio: Create `AudioManager` singleton class
6. State: React Context for activity progress

### Design Tokens (CSS Variables)
```css
:root {
  --color-bg-primary: #0a0e27;
  --color-bg-secondary: #1a1f3a;
  --color-accent-cyan: #00d9ff;
  --color-accent-orange: #ff6b35;
  --color-success: #4caf50;
  --color-neutral: #b0bec5;
  --spacing-unit: 8px;
  --border-radius-sm: 4px;
  --border-radius-md: 12px;
  --border-radius-lg: 28px;
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

---

**End of Design Document**
