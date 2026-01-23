# VeriQuest Phase-1 TODO

**Phase:** Phase-1 (Scope Locked)  
**Target:** Production-ready web application  
**Status Legend:** `[ ]` Not Started | `[~]` In Progress | `[x]` Done

---

## 🚀 Project Setup

### Repository & Build System
- [ ] Initialize Git repository
- [ ] Create React + TypeScript project with Vite
- [ ] Configure `tsconfig.json` with strict mode
- [ ] Set up ESLint with React + TypeScript rules
- [ ] Configure Prettier for code formatting
- [ ] Create `.gitignore` (node_modules, dist, .env)
- [ ] Set up `package.json` scripts (dev, build, preview, lint, type-check)

### Dependencies Installation
- [ ] Install React 18+ and React DOM
- [ ] Install TypeScript and type definitions
- [ ] Install Tailwind CSS and configure
- [ ] Install shadcn/ui CLI and initialize
- [ ] Install anime.js for animations
- [ ] Install Zustand for state management
- [ ] Install Zustand immer middleware

### Project Structure
- [ ] Create folder structure (`components/`, `simulator/`, `activities/`, `stores/`, `audio/`, `animations/`)
- [ ] Set up path aliases in `tsconfig.json` (`@/components`, `@/simulator`, etc.)
- [ ] Create `constants/` folder (colors, animations, messages)
- [ ] Create `types/` folder for shared TypeScript interfaces

### Design System Setup
- [ ] Configure Tailwind with custom color palette (deep space blue, electric cyan, etc.)
- [ ] Add Google Fonts (Outfit, Inter)
- [ ] Create CSS variables for design tokens
- [ ] Set up shadcn/ui theme configuration
- [ ] Create base component wrappers (Button, Dialog, Tooltip)

---

## 🎬 Core UX Flow

### Fullscreen & Entry Experience
- [ ] Implement Fullscreen API integration
- [ ] Create landing page with fullscreen takeover
- [ ] Add intro video player component (auto-play, 16:9 aspect ratio)
- [ ] Implement video skip button (appears after 5s, bottom-right)
- [ ] Add auto-advance after video ends (or 30s timeout)
- [ ] Handle fullscreen API errors gracefully

### Welcome Overlay
- [ ] Create welcome screen component
- [ ] Implement bot character appearance animation (bounce-in, 0.3s)
- [ ] Add welcome message display
- [ ] Create "Start Playing" CTA button
- [ ] Implement fade-in sequence (bot → text → button, 0.2s stagger)

### Navigation Flow
- [ ] Implement activity progression system (1 → 2 → 3 → 4)
- [ ] Create activity transition animations
- [ ] Add progress indicator (optional, subtle)
- [ ] Prevent back navigation during activities
- [ ] Handle browser back button appropriately

---

## 🤖 Bot Character System

### Bot Component
- [ ] Design bot character visual (LED mascot with logic gate body)
- [ ] Create bot SVG icon (120×120px)
- [ ] Implement bot idle state (gentle float animation, 2s loop)
- [ ] Implement bot success state (jump animation, bright eyes)
- [ ] Implement bot hint state (tilt toward target, gentle bounce)
- [ ] Create speech bubble component (300px max width, tail pointing to bot)

### Bot Behavior System
- [ ] Create bot trigger enum (activity_start, correct_action, incorrect_action, stuck, complete)
- [ ] Implement bot message constants for each trigger
- [ ] Create bot message queue system (one message at a time)
- [ ] Implement contextual bot appearance (0.5s delay after trigger)
- [ ] Add bot fade-in/fade-out animations
- [ ] Ensure bot never blocks user interaction

### Bot State Management
- [ ] Create bot store (Zustand) for visibility and message state
- [ ] Implement `showBot(trigger, state)` function
- [ ] Add "stuck" detection (30s no action timer)
- [ ] Create bot positioning system (bottom-right, fixed)

---

## 🧩 Activity 1: Complete the Circuit

### Layout & Components
- [ ] Create Activity1 component structure
- [ ] Design circuit layout (battery → slot1 → slot2 → bulb)
- [ ] Create battery SVG component (60×40px, orange)
- [ ] Create resistor SVG component (60×20px, zigzag)
- [ ] Create bulb/LED SVG component (40×40px, dark/glow states)
- [ ] Create wire SVG components (4px width, rounded caps)
- [ ] Create snap zone components (80×80px, dashed border)

### Drag-and-Drop
- [ ] Implement component tray with draggable items (resistor, wire, distractor)
- [ ] Add HTML5 drag-and-drop handlers (onDragStart, onDragOver, onDrop)
- [ ] Implement drag visual feedback (scale 1.1, shadow)
- [ ] Create magnetic snapping logic (20px radius)
- [ ] Add snap zone highlighting on hover
- [ ] Implement rejection animation (gentle shake, bounce-back)

### Interaction & Logic
- [ ] Validate correct component placement (resistor in slot1, wire in slot2)
- [ ] Implement circuit completion detection
- [ ] Trigger wire glow animation on completion (0.8s, left to right)
- [ ] Trigger bulb light-up animation (radial gradient glow)
- [ ] Add spark particle effect (10 particles, 0.5s)
- [ ] Play success sound (`spark.mp3`)
- [ ] Show bot success message ("You created a signal! Electricity is flowing.")

### Polish
- [ ] Add component pickup sound (`pickup.mp3`)
- [ ] Add component snap sound (`thud.mp3`)
- [ ] Implement reset functionality (allow retry)
- [ ] Test with keyboard navigation (accessibility)

---

## 🧩 Activity 2: AND Gate Decision

### Layout & Components
- [ ] Create Activity2 component structure
- [ ] Design circuit layout (2 switches → gate slot → LED)
- [ ] Create switch component (60×100px, lever toggle)
- [ ] Create AND gate SVG icon (100×80px, D-shape, labeled pins)
- [ ] Create OR gate SVG icon (distractor, different shape)
- [ ] Position input/output pins correctly

### Switch Interaction
- [ ] Implement switch toggle on click (space/enter for keyboard)
- [ ] Add switch animation (lever rotate 30°, 0.2s)
- [ ] Implement switch state colors (gray OFF, cyan ON)
- [ ] Add switch glow effect when ON
- [ ] Play click sound on toggle (`click.mp3`)
- [ ] Create larger click hitbox (80×120px)

### Gate Logic
- [ ] Implement AND gate boolean logic (`output = inputA && inputB`)
- [ ] Create gate placement validation
- [ ] Connect switch states to gate inputs
- [ ] Update LED based on gate output
- [ ] Implement LED glow animation (green radial gradient, pulsing 1s loop)
- [ ] Play success sound when LED lights (`success.mp3`)

### Feedback & Guidance
- [ ] Show bot message on activity start ("This gate lights the LED when BOTH switches are ON")
- [ ] Detect wrong gate placement (OR instead of AND)
- [ ] Show bot hint if wrong gate placed ("Hmm, try the other one")
- [ ] Show bot success message on correct completion
- [ ] Allow gate swapping without penalty

---

## 🧩 Activity 3: OR Gate Decision

### Layout & Components
- [ ] Create Activity3 component structure (similar to Activity2)
- [ ] Reuse switch and LED components
- [ ] Update component tray (OR gate primary, AND gate distractor)

### Gate Logic
- [ ] Implement OR gate boolean logic (`output = inputA || inputB`)
- [ ] Connect switches to OR gate inputs
- [ ] Update LED based on OR gate output
- [ ] Validate correct gate placement

### Feedback & Guidance
- [ ] Show bot message ("This gate lights the LED when ANY switch is ON")
- [ ] Provide comparative hint if user confuses gates
- [ ] Show bot success message ("That's an OR gate—it says YES if anyone agrees")
- [ ] Allow testing all switch combinations

### Comparison Feature (Optional)
- [ ] Add mini truth table tooltip on gate hover (icons, no text)
- [ ] Highlight difference between AND and OR visually

---

## 🧩 Activity 4: Multi-Gate Mini Workbench

### Layout & Components
- [ ] Create Activity4 component structure
- [ ] Design 2-stage circuit layout (3 inputs, 2 gate slots, 1 LED)
- [ ] Create component tray (2× AND gates, 2× OR gates)
- [ ] Position gate slots with clear input/output pins

### Auto-Wiring System
- [ ] Implement auto-wire routing algorithm (straight or 90° bends)
- [ ] Create wire path calculation function (`calculateWirePath`)
- [ ] Animate wire appearance (0.3s from output to input)
- [ ] Update wire colors based on signal state (gray → golden yellow)
- [ ] Implement wire glow propagation (0.2s per segment)

### Multi-Gate Logic
- [ ] Implement 2-stage circuit evaluation (OR gate → AND gate)
- [ ] Validate correct solution (A AND (B OR C))
- [ ] Detect incorrect gate combinations
- [ ] Update all wire states based on logic evaluation
- [ ] Trigger LED on correct output

### Success Celebration
- [ ] Create confetti particle system (20 particles, Canvas-based)
- [ ] Implement confetti animation (2s duration, random colors/trajectories)
- [ ] Play triumphant sound (`build-complete.mp3`, 1s melody)
- [ ] Show bot celebration message ("You're a circuit builder now!")
- [ ] Ensure confetti only triggers on first success (not replay)

### Hints System
- [ ] Implement attempt counter
- [ ] Show hint after 2 incorrect attempts (highlight first gate slot)
- [ ] Provide progressive hints without giving away solution

---

## 🛠️ Simulator / Workbench Core

### Data Models
- [ ] Define `Component` interface (id, type, position, inputs, outputs, state)
- [ ] Define `Pin` interface (id, componentId, type, value, connectedTo)
- [ ] Define `Wire` interface (id, from, to, active, path)
- [ ] Define `SnapZone` interface (id, center, occupied, acceptedTypes)
- [ ] Create TypeScript types for all component types

### Circuit Evaluator
- [ ] Implement `CircuitEvaluator` class
- [ ] Create topological sort algorithm (Kahn's or DFS-based)
- [ ] Implement component evaluation logic (AND, OR, battery, resistor, switch, LED)
- [ ] Create wire state update system
- [ ] Trigger animations after evaluation
- [ ] Optimize for 60 FPS (< 16ms evaluation time)

### Snap & Placement System
- [ ] Implement `calculateSnapPosition` function (20px radius)
- [ ] Create distance calculation utility (`getDistance`)
- [ ] Validate component placement (type matching, zone availability)
- [ ] Implement magnetic pull animation (anime.js, easeOutBack)
- [ ] Handle invalid placements gracefully (shake animation)

### Wire Routing
- [ ] Implement simple L-shaped wire routing
- [ ] Create SVG path generation (`M L L L` format)
- [ ] Handle horizontal-first vs vertical-first routing
- [ ] Limit wire bends to max 2 per wire
- [ ] Optimize path calculations (memoization)

---

## 🎨 UI Components Library

### shadcn/ui Integration
- [ ] Install and configure Button component
- [ ] Install and configure Dialog component
- [ ] Install and configure Tooltip component
- [ ] Install and configure Card component
- [ ] Customize theme colors to match VeriQuest palette

### Custom Components
- [ ] Create `CTAButton` wrapper (primary action button)
- [ ] Create `ComponentTray` layout component
- [ ] Create `DraggableComponent` wrapper
- [ ] Create `SnapZone` visual component
- [ ] Create `CircuitCanvas` SVG container

### Component Tray
- [ ] Design component tray layout (bottom 20%, full width)
- [ ] Create component tile (80×100px, icon + label)
- [ ] Implement tile states (idle, hover, dragging, disabled)
- [ ] Add hover effects (scale 1.05, cyan border, glow)
- [ ] Disable tiles after component is placed
- [ ] Add cursor changes (grab, grabbing, not-allowed)

### SVG Symbol Library
- [ ] Create reusable SVG symbols (`<symbol>` + `<use>`)
- [ ] Define symbols for all components (battery, resistor, gates, etc.)
- [ ] Optimize SVG paths (reduce node count)
- [ ] Implement SVG sprite sheet pattern

---

## 🎬 Animations & Sound

### Animation System (anime.js)
- [ ] Create animation constants file (durations, easing functions)
- [ ] Implement drag pickup animation (scale 1.1, shadow, 150ms)
- [ ] Implement magnetic snap animation (easeOutBack, 200ms)
- [ ] Implement rejection bounce animation (shake 3px, 150ms)
- [ ] Create wire glow animation (stroke-dashoffset, brightness, 800ms)
- [ ] Implement switch toggle animation (rotate 30°, color shift, 200ms)
- [ ] Create LED pulse animation (radial gradient, 1s loop)
- [ ] Implement bot bounce-in animation (translateY, opacity, 300ms)

### Confetti System
- [ ] Create `Particle` class (position, velocity, color, lifetime)
- [ ] Implement Canvas-based particle renderer
- [ ] Add gravity and random X velocity to particles
- [ ] Implement fade-out after 1.5s
- [ ] Clean up particles after 2s
- [ ] Optimize for 60 FPS (requestAnimationFrame)

### Audio System
- [ ] Create `AudioManager` singleton class
- [ ] Implement sound preloading (6 sounds: click, thud, pickup, spark, success, build-complete)
- [ ] Add `play(soundName, volume)` method
- [ ] Implement mute toggle functionality
- [ ] Handle autoplay policy errors gracefully
- [ ] Respect system mute settings
- [ ] Create audio store (Zustand) for mute state

### Sound Assets
- [ ] Source/create `click.mp3` (80ms, mechanical click)
- [ ] Source/create `thud.mp3` (50ms, satisfying drop)
- [ ] Source/create `pickup.mp3` (30ms, soft whoosh)
- [ ] Source/create `spark.mp3` (200ms, electrical crackle)
- [ ] Source/create `success.mp3` (300ms, bright chime)
- [ ] Source/create `build-complete.mp3` (1s, triumphant melody)
- [ ] Optimize all sounds (< 100KB total)

---

## 🎯 State Management

### Zustand Stores
- [ ] Create `simulatorStore` (components, wires, addComponent, updateWireState)
- [ ] Create `uiStore` (currentActivity, botVisible, botMessage, botState)
- [ ] Create `audioStore` (muted, volume, setMuted)
- [ ] Configure immer middleware for nested state updates
- [ ] Add TypeScript interfaces for all stores

### Store Integration
- [ ] Connect simulator store to circuit evaluator
- [ ] Connect UI store to bot component
- [ ] Connect audio store to AudioManager
- [ ] Implement activity progress tracking
- [ ] Add LocalStorage persistence (optional, for progress saving)

---

## 🔐 Soft Login Prompt

### Login Screen
- [ ] Create login prompt component
- [ ] Design layout (bot celebrating, message, 2 buttons)
- [ ] Add "Continue as Guest" button (outlined, secondary)
- [ ] Add "Login" button (filled, primary, cyan)
- [ ] Implement button spacing and hover effects
- [ ] Show prompt only after Activity 4 completion

### Login Logic (Minimal)
- [ ] Create placeholder login flow (no actual auth in Phase-1)
- [ ] Store "guest" or "logged in" state in LocalStorage
- [ ] Redirect to section-based learning placeholder (Phase-2 scope)
- [ ] Add "Save your progress?" messaging

---

## ⚡ Performance Optimization

### React Optimization
- [ ] Wrap expensive components in `React.memo()` (Gate, Wire, LED)
- [ ] Use `useMemo()` for wire path calculations
- [ ] Use `useCallback()` for event handlers
- [ ] Implement code splitting (lazy load activities)
- [ ] Add `Suspense` boundaries with loading states

### Animation Performance
- [ ] Use `transform` and `opacity` only (GPU-accelerated)
- [ ] Add `will-change` only during active animations
- [ ] Remove `will-change` after animation completes
- [ ] Batch DOM reads/writes to avoid layout thrashing
- [ ] Limit concurrent animations to max 10

### Bundle Optimization
- [ ] Configure Vite manual chunks (vendor, animation, ui)
- [ ] Enable tree-shaking in production build
- [ ] Lazy load intro video (preload="none")
- [ ] Compress images and SVGs
- [ ] Analyze bundle size with `vite-bundle-visualizer`

### SVG Optimization
- [ ] Limit SVG nodes per screen to < 200
- [ ] Use `<symbol>` and `<use>` for repeated elements
- [ ] Optimize SVG paths (remove unnecessary points)
- [ ] Avoid inline styles in SVG (use CSS classes)

---

## ♿ Accessibility

### Keyboard Navigation
- [ ] Implement Tab order (component tray → slots → bot CTA)
- [ ] Add keyboard alternative for drag-and-drop (arrow keys + Enter)
- [ ] Implement Space/Enter for switch toggle
- [ ] Add visible focus indicators (3px cyan outline, 2px offset)
- [ ] Test full keyboard-only navigation

### Screen Reader Support
- [ ] Add ARIA labels to all interactive elements
- [ ] Implement `aria-live="polite"` for bot messages
- [ ] Add `aria-label` to draggable components
- [ ] Add `aria-label` to snap zones (e.g., "Empty slot for resistor")
- [ ] Use `aria-live="assertive"` for success messages

### Color & Contrast
- [ ] Verify text contrast ratios (7:1 for AAA, 4.5:1 minimum for AA)
- [ ] Ensure interactive elements have 3:1 contrast against background
- [ ] Test with color blindness simulators
- [ ] Don't rely solely on color for feedback (use icons/text)

### Motion Sensitivity
- [ ] Implement `prefers-reduced-motion` media query
- [ ] Disable/reduce animations when user prefers reduced motion
- [ ] Ensure core functionality works without animations

---

## 🧪 Testing & QA

### Manual Testing Checklist
- [ ] Test Activity 1 (circuit completion, wire glow, bulb light)
- [ ] Test Activity 2 (AND gate, switch toggles, LED behavior)
- [ ] Test Activity 3 (OR gate, correct logic)
- [ ] Test Activity 4 (multi-gate, auto-wiring, confetti)
- [ ] Test drag-and-drop smoothness (60 FPS)
- [ ] Test magnetic snapping (feels natural, 20px radius)
- [ ] Test all sound effects (correct triggers, appropriate volume)
- [ ] Test bot appearances (correct messages, timing)
- [ ] Test fullscreen mode (entry, exit, errors)
- [ ] Test keyboard navigation (all activities)

### Cross-Browser Testing
- [ ] Test on Chrome 90+ (primary target)
- [ ] Test on Firefox 88+
- [ ] Test on Safari 14+
- [ ] Test on Edge 90+
- [ ] Document any browser-specific issues

### Performance Testing
- [ ] Measure page load time (target: < 2s on 4G)
- [ ] Measure time to interactive (target: < 3s)
- [ ] Monitor frame rate during animations (target: 60 FPS)
- [ ] Check bundle size (target: < 500KB gzipped)
- [ ] Run Lighthouse audit (target: 90+ performance score)

### Accessibility Testing
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA or JAWS)
- [ ] Run axe DevTools accessibility scan
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Verify WCAG AA compliance

---

## 🚢 Deployment & Build

### Build Configuration
- [ ] Configure Vite production build settings
- [ ] Set up environment variables (`.env.production`)
- [ ] Configure asset optimization (minify, compress)
- [ ] Set up CDN for video/audio assets (optional)
- [ ] Configure cache headers for static assets

### Vercel Deployment
- [ ] Create Vercel account and project
- [ ] Connect Git repository to Vercel
- [ ] Configure build command (`npm run build`)
- [ ] Set output directory (`dist`)
- [ ] Configure custom domain (if available)
- [ ] Set up preview deployments for PRs

### Pre-Deployment Checklist
- [ ] Run production build locally (`npm run build`)
- [ ] Test production build (`npm run preview`)
- [ ] Verify all assets load correctly
- [ ] Check console for errors
- [ ] Test on multiple devices/browsers
- [ ] Verify analytics/monitoring setup (if applicable)

---

## 🔒 Phase-1 Feature Freeze

### Scope Verification
- [ ] Verify no Verilog coding features
- [ ] Verify no FSM/clock/timing diagrams
- [ ] Verify no backend API calls
- [ ] Verify no user account system (beyond soft prompt)
- [ ] Verify no mobile app features
- [ ] Verify no exams/scores/grades
- [ ] Verify no section-based learning roadmap (Phase-2)

### Feature Completeness
- [ ] All 4 pre-login activities functional
- [ ] Bot character system complete
- [ ] Drag-and-drop simulator working
- [ ] All animations implemented
- [ ] All sounds integrated
- [ ] Fullscreen mode working
- [ ] Intro video playing
- [ ] Soft login prompt showing

### Documentation
- [ ] Update README.md with setup instructions
- [ ] Document component API (if needed)
- [ ] Add inline code comments for complex logic
- [ ] Create CHANGELOG.md for Phase-1 release
- [ ] Document known issues/limitations

### Final Review
- [ ] Code review by senior engineer
- [ ] Design review against Design Doc
- [ ] Product review against PRD
- [ ] Accessibility audit
- [ ] Performance audit
- [ ] Security review (XSS, CSP, etc.)

---

## 📊 Success Metrics Setup

### Analytics (Optional for Phase-1)
- [ ] Set up basic event tracking (activity completion)
- [ ] Track drop-off rates per activity
- [ ] Track average session duration
- [ ] Track hint usage frequency
- [ ] Set up error logging (Sentry or similar)

### Monitoring
- [ ] Set up Web Vitals reporting (CLS, FID, FCP, LCP, TTFB)
- [ ] Monitor bundle size over time
- [ ] Set up uptime monitoring (if applicable)
- [ ] Create performance dashboard (optional)

---

## 🎉 Launch Preparation

### Pre-Launch
- [ ] Final QA pass on all activities
- [ ] Stakeholder demo/approval
- [ ] Marketing assets prepared (if applicable)
- [ ] Support documentation ready (if applicable)
- [ ] Rollback plan documented

### Launch Day
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Announce launch (if applicable)

### Post-Launch
- [ ] Collect user feedback
- [ ] Monitor success metrics (completion rates, session duration)
- [ ] Document bugs/issues for Phase-2
- [ ] Plan Phase-2 features (out of scope for this TODO)

---

**End of Phase-1 TODO**

_Last Updated: January 23, 2026_  
_Total Tasks: 250+_  
_Estimated Timeline: 8-12 weeks (team of 3-4 engineers)_
