/**
 * Route-aware onboarding tour registry.
 *
 * Each route (or route family) maps to a TourDef with a stable `id` used for the
 * "already seen" localStorage flag. A step may target a real element via a CSS
 * selector (we sprinkle `data-tour="..."` attributes on key landmarks) — when a
 * target is missing (e.g. a desktop-only element on mobile), the step gracefully
 * renders as a centered hero card instead of a spotlight.
 *
 * Steps stay deliberately short (so they fit a phone screen with no scrolling);
 * extra explanation lives in `points` (quick bullets), `tip`, `kbd` (key chips),
 * and `demo` (a small interactive widget). More explanation => more steps, never
 * a taller card.
 */

import type { DemoKind } from './MiniDemo';

export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface TourStep {
  /** CSS selector to spotlight. Omit (or use 'center') for a centered card. */
  target?: string;
  title: string;
  body: string;
  /** Up to ~3 quick takeaways, rendered as a compact checklist. */
  points?: string[];
  /** A highlighted pro-tip line. */
  tip?: string;
  /** Keyboard keys rendered as <kbd> chips. */
  kbd?: string[];
  /** Embed a small interactive widget. */
  demo?: DemoKind;
  emoji?: string;
  accent?: string;
  placement?: Placement;
}

export interface TourDef {
  /** Stable id — used as the localStorage "seen" key. Bump to re-show. */
  id: string;
  name: string;
  steps: TourStep[];
}

const CYAN = '#22D3EE';
const VIOLET = '#A855F7';
const EMERALD = '#34D399';
const AMBER = '#F59E0B';
const PINK = '#EC4899';
const BLUE = '#3B82F6';

/* ─── Exact-path tours ─────────────────────────────────────────────────────── */

const EXACT: Record<string, TourDef> = {
  '/': {
    id: 'landing-v2',
    name: 'Welcome to BitforBytes',
    steps: [
      {
        title: 'Welcome to BitforBytes',
        body: "India's GenZ-native launchpad for electronics & chip design — learn it all right in your browser.",
        points: ['Zero install, 100% free to start', 'Built for the India Semiconductor Mission', 'From school basics to real VLSI'],
        emoji: '⚡',
        accent: CYAN,
        placement: 'center',
      },
      {
        title: 'Bits become logic. Logic becomes silicon.',
        body: 'Every real chip starts as a wiggly analog signal that we "sample" into clean 1s and 0s. Try it:',
        demo: 'wave',
        tip: 'That single idea — analog to digital — is the door to everything else here.',
        emoji: '📈',
        accent: BLUE,
        placement: 'center',
      },
      {
        title: 'One path, thirteen domains',
        body: 'A guided ladder from fundamentals to specialization.',
        points: ['Core foundations first', 'Then branch: Basic Electronics · DSD · Verilog', 'Career roadmap shows where each leads'],
        emoji: '🧭',
        accent: VIOLET,
        placement: 'center',
      },
      {
        title: 'Jump straight in',
        body: 'The first five modules are open to everyone — no signup. Tap any "Start" to enter your first lesson.',
        tip: 'A guided tour like this waits on every page. Tap the compass beacon (bottom-right) to replay it anytime.',
        emoji: '🚀',
        accent: EMERALD,
        placement: 'center',
      },
    ],
  },

  '/portal': {
    id: 'portal-v2',
    name: 'Your Workstation',
    steps: [
      {
        title: 'This is your Workstation',
        body: 'Your command center — everything you learn, build, and unlock lives here. Quick tour?',
        emoji: '🛠️',
        accent: CYAN,
        placement: 'center',
      },
      {
        target: '[data-tour="portal-tree"]',
        title: 'Your Progression Map',
        body: 'This living tree is your curriculum. Tap a glowing node to open that module.',
        points: ['Green = done · Blue = in progress', 'Finish the core path to unlock branches'],
        emoji: '🌳',
        accent: EMERALD,
        placement: 'left',
      },
      {
        target: '[data-tour="portal-radial"]',
        title: 'The Radial Menu',
        body: 'Your quick-launch dial for labs, playgrounds, the boss arena and more.',
        emoji: '🎯',
        accent: VIOLET,
        placement: 'right',
      },
      {
        target: '[data-tour="portal-profile"]',
        title: 'Track Your Growth',
        body: 'XP, level, streak, gems and badges live here.',
        points: ['Keep your daily streak alive', 'Earn gems by completing modules'],
        emoji: '📈',
        accent: AMBER,
        placement: 'left',
      },
      {
        title: 'Everything is interactive',
        body: 'This whole platform is hands-on. Even a humble switch is a real signal — give it a flip:',
        demo: 'switch',
        emoji: '🕹️',
        accent: PINK,
        placement: 'center',
      },
      {
        title: 'Teleport anywhere',
        body: 'Open the command palette to jump across the entire app instantly.',
        kbd: ['⌘', 'K'],
        tip: 'On Windows use Ctrl + K. Search a module name and hit Enter.',
        emoji: '⌨️',
        accent: CYAN,
        placement: 'center',
      },
    ],
  },

  '/career-roadmap': {
    id: 'career-v2',
    name: 'Career Roadmap',
    steps: [
      {
        title: 'Your ECE career, mapped',
        body: 'The whole semiconductor career landscape on one interactive board.',
        points: ['Salaries & company demand', 'Internships & hackathons', 'Government initiatives'],
        emoji: '🗺️',
        accent: CYAN,
        placement: 'center',
      },
      {
        title: 'Find where you fit',
        body: 'Scroll through the skill topology, salary heatmap, and a trajectory simulator that projects your path.',
        tip: 'Tap any domain to see the exact skills it demands.',
        emoji: '💼',
        accent: VIOLET,
        placement: 'center',
      },
    ],
  },

  '/skill-tree': {
    id: 'skilltree-v1',
    name: 'Skill Tree',
    steps: [
      {
        title: 'The Skill Tree',
        body: 'Every concept you master lights up here — watch your competency graph branch out.',
        tip: 'Locked skills show what to learn next.',
        emoji: '🌲',
        accent: EMERALD,
        placement: 'center',
      },
    ],
  },

  '/boss-arena': {
    id: 'boss-v1',
    name: 'Boss Arena',
    steps: [
      {
        title: 'Enter the Boss Arena',
        body: 'Timed, high-stakes challenges that test everything you know.',
        points: ['Beat the clock', 'Chain correct answers for combos', 'Big XP for a clean win'],
        emoji: '👾',
        accent: PINK,
        placement: 'center',
      },
    ],
  },

  '/portfolio': {
    id: 'portfolio-v1',
    name: 'Engineering Portfolio',
    steps: [
      {
        title: 'Your Engineering Portfolio',
        body: 'A shareable record of the circuits you built and modules you conquered — your proof of work.',
        tip: 'Export or share it when you apply for internships.',
        emoji: '📁',
        accent: BLUE,
        placement: 'center',
      },
    ],
  },

  '/workbench': {
    id: 'workbench-v1',
    name: 'The Workbench',
    steps: [
      {
        title: 'The Workbench',
        body: 'A free-form sandbox to wire up components and experiment. No grades, no limits.',
        tip: 'Drag parts in, connect their pins, and watch current flow.',
        emoji: '🔧',
        accent: AMBER,
        placement: 'center',
      },
    ],
  },

  '/kmap-lab': {
    id: 'kmaplab-v1',
    name: 'K-Map Lab',
    steps: [
      {
        title: 'Karnaugh Map Lab',
        body: 'Toggle minterms and group cells to simplify Boolean expressions visually.',
        points: ['Bigger groups = simpler logic', 'Watch the expression update live'],
        emoji: '🗺️',
        accent: CYAN,
        placement: 'center',
      },
    ],
  },

  '/hw-leetcode': {
    id: 'hwleet-v1',
    name: 'Hardware LeetCode',
    steps: [
      {
        title: 'Hardware LeetCode',
        body: 'LeetCode, but for logic — solve hardware challenges and verify against the truth table.',
        points: ['Pick a challenge from the list', 'Build the circuit', 'Run to check every input row'],
        emoji: '🧩',
        accent: VIOLET,
        placement: 'center',
      },
    ],
  },

  '/fsm': {
    id: 'fsm-v1',
    name: 'FSM Playground',
    steps: [
      {
        title: 'Finite State Machine Playground',
        body: 'Design states, draw transitions, and step the clock to watch your machine react.',
        demo: 'switch',
        tip: 'A flip-flop remembers one bit — that toggle is the whole idea of state.',
        emoji: '🔁',
        accent: EMERALD,
        placement: 'center',
      },
    ],
  },

  '/verilog-playground': {
    id: 'verilog-v1',
    name: 'Verilog Playground',
    steps: [
      {
        title: 'Verilog Playground',
        body: 'Write HDL, simulate it, and watch your intent become a netlist.',
        points: ['Edit the code on the left', 'Run to simulate', 'Inspect the waveform output'],
        emoji: '💻',
        accent: CYAN,
        placement: 'center',
      },
    ],
  },

  '/signal-playground': {
    id: 'signal-v1',
    name: 'Signal Playground',
    steps: [
      {
        title: 'Signal Playground',
        body: 'Shape waveforms and feel the jump from analog to digital. Tap to digitize:',
        demo: 'wave',
        emoji: '📡',
        accent: BLUE,
        placement: 'center',
      },
    ],
  },

  '/logic-studio': {
    id: 'logicstudio-v1',
    name: 'Logic Studio',
    steps: [
      {
        title: 'Logic Studio',
        body: 'Place gates, wire them, and probe the signals. Here is the heart of it — an AND gate:',
        demo: 'gate',
        tip: 'Flip both inputs to 1 and the output lights up.',
        emoji: '🎛️',
        accent: VIOLET,
        placement: 'center',
      },
    ],
  },

  '/quests': {
    id: 'quests-v1',
    name: 'Quests',
    steps: [
      {
        title: 'Daily Quests',
        body: 'Bite-sized missions that keep your streak alive and rain XP.',
        tip: 'Fresh quests drop every day — check back.',
        emoji: '🎯',
        accent: AMBER,
        placement: 'center',
      },
    ],
  },

  '/activities': {
    id: 'activities-v1',
    name: 'Activities',
    steps: [
      {
        title: 'Activities',
        body: 'Hands-on mini-experiences to reinforce what you learn — quick, playful, surprisingly deep.',
        emoji: '🧪',
        accent: EMERALD,
        placement: 'center',
      },
    ],
  },

  '/community': {
    id: 'community-v1',
    name: 'Community',
    steps: [
      {
        title: 'The Community',
        body: 'Share circuits, see what others built, and learn in public. You are not grinding alone.',
        tip: 'Post a circuit to get feedback from peers.',
        emoji: '🤝',
        accent: PINK,
        placement: 'center',
      },
    ],
  },

  '/debug-mission': {
    id: 'debug-v1',
    name: 'Debug Mission',
    steps: [
      {
        title: 'Debug Missions',
        body: 'A circuit is broken — find the fault and fix it before time runs out.',
        points: ['Read the symptom', 'Trace the signal', 'Swap the faulty part'],
        emoji: '🐞',
        accent: PINK,
        placement: 'center',
      },
    ],
  },

  '/gatekeeper-game': {
    id: 'gatekeeper-v1',
    name: 'Gatekeeper',
    steps: [
      {
        title: 'The Gatekeeper',
        body: 'Build the right logic to pass each gate. Warm up your Boolean instincts:',
        demo: 'gate',
        emoji: '🚪',
        accent: VIOLET,
        placement: 'center',
      },
    ],
  },

  '/sandbox/verilog': {
    id: 'sandbox-v1',
    name: 'Verilog Sandbox',
    steps: [
      {
        title: 'Verilog Sandbox',
        body: 'A no-pressure space to type combinational logic and watch it synthesize.',
        tip: 'Use & (AND), | (OR), ~ (NOT), ^ (XOR) in your assign statements.',
        emoji: '🧫',
        accent: CYAN,
        placement: 'center',
      },
    ],
  },
};

/* ─── Prefix tours (module families share one tour) ────────────────────────── */

const MODULE_TOUR: TourDef = {
  id: 'module-v2',
  name: 'Inside a Module',
  steps: [
    {
      title: 'Welcome to your first lesson',
      body: 'Modules are scene-by-scene journeys — read, interact, and progress at your own pace.',
      points: ['Each screen builds on the last', 'Most screens have something to tap or drag'],
      emoji: '📚',
      accent: CYAN,
      placement: 'center',
    },
    {
      target: '[data-tour="module-nav"]',
      title: 'Jump between scenes',
      body: 'Tap this menu to open the chapter list and hop to any section.',
      tip: 'On a computer the same list sits in the left sidebar, always visible.',
      emoji: '🧭',
      accent: VIOLET,
      placement: 'bottom',
    },
    {
      title: 'Move at your pace',
      body: 'Step through with Back / Next at the bottom — your progress bar fills as you go.',
      kbd: ['←', '→'],
      tip: 'On desktop, your arrow keys flip pages too.',
      emoji: '➡️',
      accent: EMERALD,
      placement: 'center',
    },
    {
      title: 'Try things fearlessly',
      body: 'Nothing here can break. Poke the toggles and watch the logic respond:',
      demo: 'switch',
      emoji: '🔬',
      accent: AMBER,
      placement: 'center',
    },
  ],
};

const PREFIX: { test: (p: string) => boolean; def: TourDef }[] = [
  { test: (p) => p.startsWith('/module/'), def: MODULE_TOUR },
  { test: (p) => p.startsWith('/dsd/'), def: MODULE_TOUR },
  { test: (p) => p.startsWith('/basic-electronics/'), def: MODULE_TOUR },
];

/** Resolve the tour for a pathname, or null if none. */
export function getTourForPath(pathname: string): TourDef | null {
  if (EXACT[pathname]) return EXACT[pathname];
  for (const { test, def } of PREFIX) {
    if (test(pathname)) return def;
  }
  return null;
}
