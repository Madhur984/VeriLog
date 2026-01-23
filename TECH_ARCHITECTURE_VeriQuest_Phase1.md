# VeriQuest Technology Architecture & Rules (Phase-1)

**Version:** 1.0  
**Date:** January 23, 2026  
**Phase:** Phase-1 (Scope Locked)  
**Audience:** Senior Frontend Engineers

---

## Technical Philosophy

### Core Principles

1. **Frontend-First Architecture:** All logic, simulation, and state management happens client-side
2. **Deterministic Behavior:** No randomness in core interactions; animations and feedback must be predictable
3. **Visual Feedback = Source of Truth:** What users see is what the system state is
4. **Simple Logic > Heavy Engines:** Prefer lightweight solutions over complex frameworks
5. **Clarity Over Abstraction:** Code should be readable and maintainable, not clever

### Performance Targets

- **Page Load:** <2s on 4G connection
- **Time to Interactive:** <3s
- **Frame Rate:** 60 FPS constant (no jank)
- **Bundle Size:** <500KB (gzipped)
- **Animation Latency:** <16ms from trigger to visual update

---

## Technology Stack

### 1. Framework: React 18+ with TypeScript

**Decision Rationale:**
- Component-based architecture aligns with modular circuit design
- Virtual DOM optimizes frequent state updates (switch toggles, wire states)
- TypeScript ensures type safety for complex simulator logic
- Large ecosystem for tooling and libraries

**Mandatory Rules:**

✅ **DO:**
- Use functional components exclusively
- Use TypeScript strict mode (`"strict": true`)
- Use hooks for state and side effects
- Use `React.memo()` for expensive components (gates, wires)
- Use `useMemo()` and `useCallback()` for optimization

❌ **DON'T:**
- No class components (legacy pattern)
- No prop-drilling beyond 2 levels (use Context or Zustand)
- No `any` types (use `unknown` or proper types)
- No inline function definitions in JSX (causes re-renders)
- No direct DOM manipulation (use refs sparingly)

**Example Structure:**
```typescript
// ✅ CORRECT
interface SwitchProps {
  id: string;
  initialState: boolean;
  onToggle: (id: string, state: boolean) => void;
}

const Switch: React.FC<SwitchProps> = React.memo(({ id, initialState, onToggle }) => {
  const [isOn, setIsOn] = useState(initialState);
  
  const handleToggle = useCallback(() => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle(id, newState);
  }, [isOn, id, onToggle]);
  
  return <div onClick={handleToggle}>...</div>;
});

// ❌ INCORRECT
class Switch extends React.Component { ... } // No class components
const Switch = (props: any) => { ... } // No 'any' types
```

---

### 2. Build Tool: Vite

**Decision Rationale:**
- Lightning-fast HMR (Hot Module Replacement) for rapid development
- Optimized production builds with tree-shaking
- Native ESM support
- Better performance than Create React App or Webpack

**Configuration Requirements:**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation': ['animejs'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['animejs', 'zustand']
  }
});
```

---

### 3. Styling: Tailwind CSS + shadcn/ui

**Decision Rationale:**
- Tailwind: Utility-first, no CSS file bloat, easy theming
- shadcn/ui: Accessible, customizable base components

**Usage Rules:**

**Tailwind CSS:**
✅ **DO:**
- Use for layout, spacing, colors
- Define custom colors in `tailwind.config.js`
- Use `@apply` sparingly (only for repeated patterns)

❌ **DON'T:**
- No inline styles (`style={{}}`) unless dynamic values required
- No arbitrary values in production code (`w-[347px]`)
- No Tailwind for animations (use anime.js)

**shadcn/ui:**
✅ **DO:**
- Use for: Button, Dialog, Tooltip, Card
- Customize via `components.json` config
- Wrap in domain-specific components

❌ **DON'T:**
- Don't use shadcn animations (use anime.js)
- Don't use shadcn for circuit components
- Don't modify shadcn source files directly

**Example:**
```typescript
// ✅ CORRECT: Wrap shadcn in domain component
import { Button } from '@/components/ui/button';

export const CTAButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button 
      onClick={onClick}
      className="bg-accent-cyan hover:scale-105 transition-transform"
    >
      Start Playing
    </Button>
  );
};

// ❌ INCORRECT: Direct shadcn usage everywhere
<Button className="bg-[#00d9ff] w-[200px]">...</Button>
```

---

### 4. Micro-Interactions: uiverse.io Components

**Decision Rationale:**
- Pre-built, visually appealing micro-interactions
- Saves development time for non-critical UI elements

**Strict Usage Rules:**

✅ **ALLOWED ONLY FOR:**
- Button hover effects
- Loading spinners (if needed)
- Small decorative elements

❌ **FORBIDDEN FOR:**
- Circuit components
- Drag-and-drop interactions
- Core simulator UI
- Large layout blocks

**Integration Pattern:**
```typescript
// ✅ CORRECT: Isolated wrapper
// src/components/ui/AnimatedButton.tsx
import './uiverse-button.css'; // Scoped CSS from uiverse

export const AnimatedButton: React.FC<ButtonProps> = (props) => {
  return <button className="uiverse-btn-23">{props.children}</button>;
};

// ❌ INCORRECT: Direct copy-paste throughout codebase
```

**Rule:** All uiverse code must be:
1. Copied into `src/components/ui/uiverse/`
2. Wrapped in a named component
3. Documented with source URL
4. Reviewed for accessibility

---

### 5. Animation: anime.js

**Decision Rationale:**
- Lightweight (9KB gzipped)
- Powerful timeline and easing control
- Works seamlessly with React
- Better performance than CSS keyframes for complex sequences

**Mandatory Usage:**

✅ **USE anime.js FOR:**
- Wire glow propagation
- Component drag & snap
- Bot character movements
- Success celebrations (confetti)
- Gate placement animations

❌ **DON'T USE anime.js FOR:**
- Simple hover states (use CSS transitions)
- Static transforms (use Tailwind)

**Performance Rules:**
1. **Always store animation instances:** Clean up on unmount
2. **Use `autoplay: false`:** Start manually on trigger
3. **Prefer `targets` over `querySelectorAll`:** Use refs
4. **Limit concurrent animations:** Max 10 simultaneous

**Example:**
```typescript
// ✅ CORRECT: Controlled animation with cleanup
const WireGlow: React.FC<{ active: boolean }> = ({ active }) => {
  const wireRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);
  
  useEffect(() => {
    if (active && wireRef.current) {
      animationRef.current = anime({
        targets: wireRef.current,
        strokeDashoffset: [100, 0],
        filter: ['brightness(1)', 'brightness(1.5)'],
        duration: 800,
        easing: 'easeOutQuad',
        autoplay: true
      });
    }
    
    return () => {
      animationRef.current?.pause();
    };
  }, [active]);
  
  return <path ref={wireRef} ... />;
};

// ❌ INCORRECT: Uncontrolled, memory leak
useEffect(() => {
  anime({ targets: '.wire', ... }); // No cleanup, no ref
}, []);
```

**Animation Timing Standards:**
```typescript
// src/constants/animations.ts
export const ANIMATION_DURATIONS = {
  MICRO: 100,        // Hover, click feedback
  SHORT: 200,        // Drag pickup, snap
  MEDIUM: 500,       // Wire glow, gate placement
  LONG: 800,         // Success celebration
  CONFETTI: 2000     // Full confetti sequence
} as const;

export const EASING = {
  SNAP: 'easeOutBack',
  SMOOTH: 'easeOutQuad',
  BOUNCE: 'cubicBezier(0.34, 1.56, 0.64, 1)'
} as const;
```

---

### 6. Graphics: SVG (Primary) + Canvas (Secondary)

**Decision Rationale:**
- SVG: Scalable, DOM-accessible, easy to animate, perfect for circuits
- Canvas: High-performance particles (confetti only)

**SVG Rules:**

✅ **USE SVG FOR:**
- All circuit diagrams
- All wires and connections
- All component icons (battery, resistor, gates)
- All interactive elements

**Optimization Rules:**
1. **Inline SVG in React components** (not external files)
2. **Use `<symbol>` and `<use>` for repeated elements**
3. **Limit nodes per screen:** <200 SVG elements
4. **Use `will-change` sparingly:** Only for animating elements

**Example:**
```typescript
// ✅ CORRECT: Reusable SVG symbol
export const CircuitSymbols: React.FC = () => (
  <svg style={{ display: 'none' }}>
    <defs>
      <symbol id="and-gate" viewBox="0 0 100 80">
        <path d="M 0,0 L 50,0 Q 100,40 50,80 L 0,80 Z" />
      </symbol>
    </defs>
  </svg>
);

export const ANDGate: React.FC = () => (
  <svg width="100" height="80">
    <use href="#and-gate" fill="#b0bec5" />
  </svg>
);

// ❌ INCORRECT: Repeated inline paths
<svg><path d="M 0,0 L 50,0 Q 100,40 50,80 L 0,80 Z" /></svg>
<svg><path d="M 0,0 L 50,0 Q 100,40 50,80 L 0,80 Z" /></svg>
```

**Canvas Rules:**

✅ **USE Canvas ONLY FOR:**
- Confetti particles (Activity 4 success)
- Background decorative effects (optional)

❌ **FORBIDDEN FOR:**
- Circuit rendering
- Interactive components
- Core simulator logic

**Canvas Performance:**
```typescript
// ✅ CORRECT: Optimized particle system
const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    let animationId: number;
    const particles: Particle[] = createParticles(20);
    
    const render = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      
      if (particles.some(p => p.isAlive)) {
        animationId = requestAnimationFrame(render);
      }
    };
    
    render();
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
```

---

### 7. State Management: Zustand

**Decision Rationale:**
- Lightweight (1KB gzipped)
- Simpler than Redux
- No boilerplate
- TypeScript-friendly
- Works outside React (useful for simulator logic)

**Architecture:**

**Separate Stores:**
1. **UI Store:** Bot visibility, modal state, current activity
2. **Simulator Store:** Component positions, wire states, gate outputs
3. **Audio Store:** Mute state, volume

**Rules:**

✅ **DO:**
- Use Zustand for cross-component state
- Use React Context for deeply nested props (theme, audio)
- Keep stores small and focused
- Use immer middleware for nested updates

❌ **DON'T:**
- Don't put local component state in Zustand
- Don't create one giant store
- Don't mutate state directly (use `set`)

**Example:**
```typescript
// ✅ CORRECT: Focused store with TypeScript
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface SimulatorState {
  components: Map<string, Component>;
  wires: Wire[];
  addComponent: (component: Component) => void;
  updateWireState: (wireId: string, active: boolean) => void;
}

export const useSimulatorStore = create<SimulatorState>()(
  immer((set) => ({
    components: new Map(),
    wires: [],
    
    addComponent: (component) => set((state) => {
      state.components.set(component.id, component);
    }),
    
    updateWireState: (wireId, active) => set((state) => {
      const wire = state.wires.find(w => w.id === wireId);
      if (wire) wire.active = active;
    })
  }))
);

// ❌ INCORRECT: Mutating state directly
set({ components: state.components.set(id, component) }); // Wrong!
```

---

## Simulator Architecture

### Component Model

**Base Interface:**
```typescript
// src/simulator/types.ts
export interface Component {
  id: string;
  type: 'battery' | 'resistor' | 'switch' | 'led' | 'and-gate' | 'or-gate';
  position: { x: number; y: number };
  inputs: Pin[];
  outputs: Pin[];
  state: ComponentState;
}

export interface Pin {
  id: string;
  componentId: string;
  type: 'input' | 'output';
  value: boolean;
  connectedTo?: string; // Pin ID
}

export interface Wire {
  id: string;
  from: string; // Pin ID
  to: string;   // Pin ID
  active: boolean;
  path: string; // SVG path data
}
```

### Drag-and-Drop Rules

**Implementation:** HTML5 Drag and Drop API (native, no library)

✅ **DO:**
- Use `onDragStart`, `onDragOver`, `onDrop`
- Implement magnetic snapping (20px radius)
- Provide visual feedback (highlight drop zones)
- Use `dataTransfer` for component data

❌ **DON'T:**
- Don't use third-party drag libraries (react-dnd, dnd-kit)
- Don't allow free-form placement (snap to grid)
- Don't allow overlapping components

**Magnetic Snapping Logic:**
```typescript
// src/simulator/snapping.ts
const SNAP_RADIUS = 20; // pixels

export function calculateSnapPosition(
  dragPosition: Point,
  snapZones: SnapZone[]
): Point | null {
  for (const zone of snapZones) {
    const distance = getDistance(dragPosition, zone.center);
    if (distance <= SNAP_RADIUS) {
      return zone.center; // Snap to zone center
    }
  }
  return null; // No snap
}

function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}
```

### Auto-Wire Connection

**Rules:**
1. Wires connect automatically when component is placed
2. Wires use 90° bends only (no diagonals)
3. Wire paths calculated using A* or simple routing
4. Max 2 bends per wire

**Wire Routing:**
```typescript
// src/simulator/wiring.ts
export function calculateWirePath(from: Point, to: Point): string {
  // Simple L-shaped routing (horizontal then vertical)
  const midX = (from.x + to.x) / 2;
  
  return `M ${from.x},${from.y} 
          L ${midX},${from.y} 
          L ${midX},${to.y} 
          L ${to.x},${to.y}`;
}

// For complex routing, use:
// - Horizontal-first if |dx| > |dy|
// - Vertical-first if |dy| > |dx|
```

### Boolean Logic Evaluation

**Rules:**
1. Evaluate circuit on every state change (switch toggle, gate placement)
2. Use topological sort for evaluation order
3. Update wire states based on gate outputs
4. Trigger animations after evaluation

**Evaluation Engine:**
```typescript
// src/simulator/evaluator.ts
export class CircuitEvaluator {
  evaluate(components: Map<string, Component>, wires: Wire[]): void {
    // 1. Topological sort (inputs → gates → outputs)
    const sorted = this.topologicalSort(components);
    
    // 2. Evaluate each component
    sorted.forEach(component => {
      switch (component.type) {
        case 'and-gate':
          component.outputs[0].value = 
            component.inputs.every(pin => pin.value);
          break;
        case 'or-gate':
          component.outputs[0].value = 
            component.inputs.some(pin => pin.value);
          break;
        // ... other components
      }
    });
    
    // 3. Update wire states
    wires.forEach(wire => {
      const fromPin = this.findPin(wire.from, components);
      wire.active = fromPin?.value ?? false;
    });
  }
  
  private topologicalSort(components: Map<string, Component>): Component[] {
    // Kahn's algorithm or DFS-based sorting
    // ...
  }
}
```

---

## Bot Character Implementation

### Architecture

**Bot is a UI Component, Not a State Owner**

```typescript
// src/components/Bot/Bot.tsx
interface BotProps {
  message: string;
  visible: boolean;
  state: 'idle' | 'success' | 'hint';
}

export const Bot: React.FC<BotProps> = ({ message, visible, state }) => {
  const botRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (visible && botRef.current) {
      anime({
        targets: botRef.current,
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutBack'
      });
    }
  }, [visible]);
  
  return (
    <div ref={botRef} className={`bot bot--${state}`}>
      <BotCharacter state={state} />
      <SpeechBubble message={message} />
    </div>
  );
};
```

### Event-Based Triggers

**Rules:**
1. Bot appears in response to user actions (not timers)
2. Bot messages are queued (one at a time)
3. Bot never blocks interaction

**Trigger System:**
```typescript
// src/bot/triggers.ts
export enum BotTrigger {
  ACTIVITY_START = 'activity_start',
  CORRECT_ACTION = 'correct_action',
  INCORRECT_ACTION = 'incorrect_action',
  STUCK = 'stuck', // 30s no action
  ACTIVITY_COMPLETE = 'activity_complete'
}

export const BOT_MESSAGES: Record<BotTrigger, string> = {
  [BotTrigger.ACTIVITY_START]: "Let's build something!",
  [BotTrigger.CORRECT_ACTION]: "Yes! See it glow?",
  [BotTrigger.INCORRECT_ACTION]: "Hmm, try the other one",
  [BotTrigger.STUCK]: "Drag the battery here",
  [BotTrigger.ACTIVITY_COMPLETE]: "You're a natural!"
};

// Usage in activity component
const handleComponentPlaced = (component: Component, correct: boolean) => {
  if (correct) {
    showBot(BotTrigger.CORRECT_ACTION, 'success');
  } else {
    showBot(BotTrigger.INCORRECT_ACTION, 'hint');
  }
};
```

---

## Audio System

### Architecture

**Singleton Audio Manager:**
```typescript
// src/audio/AudioManager.ts
export class AudioManager {
  private static instance: AudioManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private muted: boolean = false;
  
  private constructor() {
    this.preloadSounds();
  }
  
  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }
  
  private preloadSounds() {
    const soundFiles = ['click', 'thud', 'pickup', 'spark', 'success', 'build-complete'];
    soundFiles.forEach(name => {
      const audio = new Audio(`/sounds/${name}.mp3`);
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    });
  }
  
  play(soundName: string, volume: number = 0.7) {
    if (this.muted) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0; // Reset to start
      sound.volume = volume;
      sound.play().catch(err => console.warn('Audio play failed:', err));
    }
  }
  
  setMuted(muted: boolean) {
    this.muted = muted;
  }
}

// Usage
import { AudioManager } from '@/audio/AudioManager';

const handleSwitchToggle = () => {
  AudioManager.getInstance().play('click', 0.6);
};
```

### Rules

✅ **DO:**
- Preload all sounds on page load
- Use singleton pattern (one instance)
- Respect user mute preference
- Handle play() promise rejection (autoplay policy)

❌ **DON'T:**
- Don't create new Audio() instances on every play
- Don't play sounds without user interaction (first time)
- Don't loop sounds during activities
- Don't exceed 80% volume

---

## Performance Optimization

### React Optimization

**1. Memoization:**
```typescript
// ✅ Memoize expensive components
const Gate = React.memo(GateComponent, (prev, next) => {
  return prev.id === next.id && prev.active === next.active;
});

// ✅ Memoize expensive calculations
const wirePathData = useMemo(() => {
  return calculateWirePath(from, to);
}, [from, to]);

// ✅ Memoize callbacks
const handleDrop = useCallback((component: Component) => {
  addComponent(component);
}, [addComponent]);
```

**2. Virtualization:**
- Not needed in Phase-1 (max 10 components per screen)
- Consider for Phase-2 if component tray grows

**3. Code Splitting:**
```typescript
// Lazy load activities
const Activity1 = lazy(() => import('./activities/Activity1'));
const Activity2 = lazy(() => import('./activities/Activity2'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Activity1 />
</Suspense>
```

### Animation Performance

**Rules:**
1. **Use `will-change` only during animation:**
```css
.animating {
  will-change: transform, opacity;
}
/* Remove after animation completes */
```

2. **Prefer `transform` and `opacity`:**
```typescript
// ✅ FAST: GPU-accelerated
anime({ targets: el, translateX: 100, opacity: 0.5 });

// ❌ SLOW: Triggers layout
anime({ targets: el, left: '100px', width: '200px' });
```

3. **Batch DOM reads/writes:**
```typescript
// ✅ CORRECT: Read then write
const positions = elements.map(el => el.getBoundingClientRect()); // Read
positions.forEach((pos, i) => {
  elements[i].style.transform = `translateX(${pos.x}px)`; // Write
});

// ❌ INCORRECT: Interleaved (layout thrashing)
elements.forEach(el => {
  const pos = el.getBoundingClientRect(); // Read
  el.style.transform = `translateX(${pos.x}px)`; // Write
});
```

### Bundle Optimization

**Vite Configuration:**
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'animation': ['animejs'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-tooltip']
        }
      }
    }
  }
});
```

**Lazy Load Assets:**
```typescript
// ✅ Lazy load intro video
<video src="/videos/intro.mp4" preload="none" />

// ✅ Lazy load sounds (already handled by AudioManager)
```

---

## Project Structure

```
veriquest/
├── public/
│   ├── sounds/
│   │   ├── click.mp3
│   │   ├── thud.mp3
│   │   ├── spark.mp3
│   │   └── ...
│   └── videos/
│       └── intro.mp4
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── uiverse/      # Wrapped uiverse components
│   │   ├── Bot/
│   │   │   ├── Bot.tsx
│   │   │   ├── BotCharacter.tsx
│   │   │   └── SpeechBubble.tsx
│   │   ├── Circuit/
│   │   │   ├── Wire.tsx
│   │   │   ├── SnapZone.tsx
│   │   │   └── CircuitCanvas.tsx
│   │   └── ComponentTray/
│   │       ├── ComponentTray.tsx
│   │       └── DraggableComponent.tsx
│   ├── simulator/
│   │   ├── types.ts          # Component, Pin, Wire interfaces
│   │   ├── evaluator.ts      # Boolean logic engine
│   │   ├── snapping.ts       # Magnetic snap logic
│   │   └── wiring.ts         # Auto-wire routing
│   ├── activities/
│   │   ├── Activity1.tsx
│   │   ├── Activity2.tsx
│   │   ├── Activity3.tsx
│   │   └── Activity4.tsx
│   ├── stores/
│   │   ├── simulatorStore.ts
│   │   ├── uiStore.ts
│   │   └── audioStore.ts
│   ├── audio/
│   │   └── AudioManager.ts
│   ├── animations/
│   │   ├── wireGlow.ts
│   │   ├── confetti.ts
│   │   └── constants.ts      # Durations, easing
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── animations.ts
│   │   └── messages.ts       # Bot messages
│   ├── utils/
│   │   ├── geometry.ts       # Distance, point calculations
│   │   └── validators.ts     # Circuit validation
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Naming Conventions

**Files:**
- Components: PascalCase (`ComponentTray.tsx`)
- Utilities: camelCase (`geometry.ts`)
- Constants: camelCase (`animations.ts`)

**Variables:**
- Components: PascalCase (`const Wire: React.FC = ...`)
- Functions: camelCase (`calculateWirePath`)
- Constants: UPPER_SNAKE_CASE (`SNAP_RADIUS`)
- Types/Interfaces: PascalCase (`interface Component`)

---

## Explicitly Forbidden Technologies

### ❌ Phase-1 Blacklist

| Technology | Reason | Alternative |
|------------|--------|-------------|
| **Three.js / WebGL** | Over-engineering, 2D is sufficient | SVG + Canvas |
| **Physics Engines** | Unnecessary complexity | Simple snap logic |
| **Backend APIs** | Phase-1 is frontend-only | Local state |
| **Redux** | Too much boilerplate | Zustand |
| **jQuery** | Legacy, conflicts with React | Native DOM APIs |
| **Lodash** | Bundle bloat | Native ES6 methods |
| **Moment.js** | Not needed, heavy | Native Date (if needed) |
| **Socket.io** | No real-time features | N/A |
| **GraphQL** | No backend | N/A |

### Why These Are Forbidden

**Three.js / WebGL:**
- VeriQuest is 2D; 3D rendering is overkill
- Adds 500KB+ to bundle
- Steeper learning curve for contributors

**Physics Engines (Matter.js, Cannon.js):**
- Drag-and-drop doesn't need physics simulation
- Magnetic snapping is deterministic, not physics-based

**Backend Technologies:**
- Phase-1 is explicitly frontend-only
- All simulation happens client-side
- No user accounts, no data persistence

---

## Scalability Considerations (Phase-2 Ready)

### Future-Proofing

**What We're NOT Building Now, But Designing For:**

1. **User Accounts (Phase-2):**
   - Current: LocalStorage for progress
   - Future: API calls to save progress
   - Design: Keep simulator logic decoupled from persistence

2. **Mobile Support (Phase-2):**
   - Current: Desktop-only (1366×768 minimum)
   - Future: Touch-friendly drag, responsive layout
   - Design: Use relative units, avoid fixed pixel values

3. **Advanced Components (Phase-3+):**
   - Current: 6 components (battery, resistor, switch, LED, AND, OR)
   - Future: Flip-flops, multiplexers, clocks
   - Design: Component interface is extensible

4. **Verilog Integration (Phase-3+):**
   - Current: Visual-only learning
   - Future: Show Verilog code alongside circuit
   - Design: Separate visual and code layers

### Migration Paths

**From Zustand to Backend:**
```typescript
// Phase-1: Local state
const useSimulatorStore = create((set) => ({
  components: new Map(),
  addComponent: (c) => set({ components: ... })
}));

// Phase-2: API integration (same interface)
const useSimulatorStore = create((set) => ({
  components: new Map(),
  addComponent: async (c) => {
    await api.saveComponent(c); // Add API call
    set({ components: ... });
  }
}));
```

**From SVG to Canvas (if needed):**
- Current SVG approach allows easy migration to Canvas
- Keep rendering logic in separate functions
- Swap renderer without changing component logic

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (Vite HMR)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality Tools

**ESLint Configuration:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**Prettier Configuration:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Git Workflow

**Branch Naming:**
- Feature: `feature/activity-1-circuit`
- Bug fix: `fix/wire-glow-animation`
- Refactor: `refactor/simulator-evaluator`

**Commit Messages:**
```
feat: Add magnetic snapping to component drag
fix: Wire glow animation not triggering
refactor: Extract bot message logic to constants
perf: Memoize wire path calculations
```

---

## Testing Strategy (Phase-1 Minimal)

### Unit Tests (Optional for Phase-1)

**Test Critical Logic Only:**
- Circuit evaluator (Boolean logic)
- Wire routing algorithm
- Snap position calculation

**Framework:** Vitest (built into Vite)

```typescript
// src/simulator/__tests__/evaluator.test.ts
import { describe, it, expect } from 'vitest';
import { CircuitEvaluator } from '../evaluator';

describe('CircuitEvaluator', () => {
  it('evaluates AND gate correctly', () => {
    const evaluator = new CircuitEvaluator();
    const components = createMockComponents([
      { type: 'and-gate', inputs: [true, true] }
    ]);
    
    evaluator.evaluate(components, []);
    
    expect(components.get('gate-1')?.outputs[0].value).toBe(true);
  });
});
```

### Manual Testing Checklist

**Per Activity:**
- [ ] Drag-and-drop works smoothly
- [ ] Magnetic snapping feels natural (20px radius)
- [ ] Wire glow animation plays correctly
- [ ] Sounds play on correct triggers
- [ ] Bot appears with correct message
- [ ] Success state triggers confetti (Activity 4)
- [ ] No console errors
- [ ] 60 FPS maintained

**Cross-Browser:**
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

---

## Deployment

### Build Process

```bash
# Production build
npm run build

# Output: dist/ folder
# - index.html
# - assets/
#   - main.[hash].js
#   - main.[hash].css
#   - sounds/
#   - videos/
```

### Hosting: Vercel (Recommended)

**Why Vercel:**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Preview deployments for PRs

**Configuration:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/sounds/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### Environment Variables

```env
# .env.production
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false  # Phase-1: No analytics
```

---

## Monitoring & Analytics (Phase-1: Minimal)

### Performance Monitoring

**Web Vitals (Built-in):**
```typescript
// src/utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals() {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}

// In main.tsx
reportWebVitals();
```

### Error Tracking (Optional)

**Sentry (if needed):**
```typescript
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'YOUR_DSN',
    environment: 'production',
    tracesSampleRate: 0.1
  });
}
```

---

## Onboarding Checklist for New Engineers

### Day 1: Setup
- [ ] Clone repository
- [ ] Install Node.js 18+
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Read PRD and Design Doc

### Day 2: Codebase Familiarization
- [ ] Review project structure
- [ ] Understand simulator architecture
- [ ] Explore component library
- [ ] Run through all 4 activities

### Day 3: First Contribution
- [ ] Pick a small task (e.g., adjust animation timing)
- [ ] Make changes
- [ ] Test manually
- [ ] Submit PR

### Key Files to Understand
1. `src/simulator/evaluator.ts` - Circuit logic
2. `src/stores/simulatorStore.ts` - State management
3. `src/components/Circuit/Wire.tsx` - Wire rendering
4. `src/animations/wireGlow.ts` - Animation logic

---

## FAQ

**Q: Why not use a game engine like Unity or Phaser?**  
A: VeriQuest is a web-first product. Game engines add unnecessary complexity, large bundle sizes, and limit web platform features (SEO, accessibility, deep linking).

**Q: Why Zustand over Redux?**  
A: Zustand has 90% less boilerplate, is easier to learn, and is sufficient for Phase-1 scope. Redux would be over-engineering.

**Q: Can I use CSS animations instead of anime.js?**  
A: For simple hover states, yes. For complex sequences (wire glow, confetti), anime.js provides better control and performance.

**Q: Why no backend in Phase-1?**  
A: Phase-1 focuses on proving the learning experience works. Backend adds complexity (auth, database, deployment) that's unnecessary for validation.

**Q: What if we need more than 6 components?**  
A: The component interface is extensible. Add new types to the `Component` union and implement their evaluation logic in `evaluator.ts`.

**Q: How do we handle browser compatibility?**  
A: Vite transpiles to ES2020. For older browsers, add `@vitejs/plugin-legacy`. Phase-1 targets modern browsers only.

---

**End of Document**

---

## Document Approval

| Role | Name | Date |
|------|------|------|
| Tech Lead | __________ | ______ |
| Senior Engineer | __________ | ______ |
| Product Manager | __________ | ______ |
