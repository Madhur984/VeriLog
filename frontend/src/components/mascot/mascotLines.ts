/**
 * Route-aware dialogue for the spider mascot ("Byte").
 *
 * Mirrors the tour's routing model: an EXACT path map plus PREFIX matchers for
 * module families. getMascotLines() returns the lines Byte "speaks" on a page;
 * the mascot cycles through them (like Duolingo's Duo / the Clash builder).
 * Keep each line short and friendly - it's a speech bubble, not a paragraph.
 */

export interface MascotScript {
  /** Stable id (handy for analytics / per-page seen flags). */
  id: string;
  /** Short friendly lines Byte cycles through on this page. */
  lines: string[];
}

const EXACT: Record<string, MascotScript> = {
  '/': {
    id: 'm-landing',
    lines: [
      "Hi, I'm Byte! Your guide to chips & circuits. 🕷️",
      'Bits become logic. Logic becomes silicon. I\'ll show you how!',
      'The first five modules are free - tap "Start free" and dive in.',
      'New here? Hit "Sign in" to save your progress across devices.',
    ],
  },
  '/login': {
    id: 'm-login',
    lines: [
      'Welcome back! Sign in to keep your XP and streak. 🔐',
      'No account? Make one - or jump in as a guest to explore.',
    ],
  },
  '/portal': {
    id: 'm-portal',
    lines: [
      'This is your Workstation - mission control! 🛠️',
      'Tap a glowing node on the tree to open a module.',
      'Green = done, Blue = in progress. Keep that streak alive!',
      'Psst - press Ctrl+K (or ⌘K) to jump anywhere instantly.',
    ],
  },
  '/career-roadmap': {
    id: 'm-career',
    lines: [
      'Your whole ECE career, mapped out. 🗺️',
      'Check salaries, top companies, and which skills they want.',
      'Find the domain that excites you - then we\'ll build the skills.',
    ],
  },
  '/skill-tree': {
    id: 'm-skill',
    lines: [
      'Every concept you master lights up here. 🌲',
      'Locked skills show you what to learn next!',
    ],
  },
  '/boss-arena': {
    id: 'm-boss',
    lines: [
      'The Boss Arena - timed, high-stakes challenges! 👾',
      'Chain correct answers for combos and big XP.',
    ],
  },
  '/portfolio': {
    id: 'm-portfolio',
    lines: [
      'Your proof of work lives here. 📁',
      'Share it when you apply for internships - show what you built!',
    ],
  },
  '/workbench': {
    id: 'm-workbench',
    lines: [
      'The Workbench - a free sandbox. No grades, just build! 🔧',
      'Drag parts in, wire their pins, and watch the current flow.',
    ],
  },
  '/kmap-lab': {
    id: 'm-kmap',
    lines: [
      'Karnaugh Maps! Group the cells to simplify logic. 🗺️',
      'Bigger groups = simpler circuits. Watch it update live.',
    ],
  },
  '/hw-leetcode': {
    id: 'm-hwleet',
    lines: [
      'LeetCode, but for hardware! 🧩',
      'Build the circuit, run it, and beat the truth table.',
    ],
  },
  '/fsm': {
    id: 'm-fsm',
    lines: [
      'Finite State Machines - design states & transitions. 🔁',
      'Step the clock and watch your machine react!',
    ],
  },
  '/verilog-playground': {
    id: 'm-verilog',
    lines: [
      'Write Verilog, simulate it, see it become a netlist. 💻',
      'This is the bridge from code to real silicon!',
    ],
  },
  '/signal-playground': {
    id: 'm-signal',
    lines: [
      'Shape waveforms and feel analog become digital. 📡',
      'Tweak frequency and amplitude - it\'s all live.',
    ],
  },
  '/logic-studio': {
    id: 'm-logic',
    lines: [
      'Logic Studio - place gates, wire them, probe signals. 🎛️',
      'Flip both inputs of an AND gate to light the output!',
    ],
  },
  '/quests': {
    id: 'm-quests',
    lines: [
      'Daily Quests! Quick missions that rain XP. 🎯',
      'Fresh ones drop every day - keep your streak going!',
    ],
  },
  '/activities': {
    id: 'm-activities',
    lines: ['Hands-on mini-experiences to lock in what you learn. 🧪'],
  },
  '/community': {
    id: 'm-community',
    lines: [
      'The Community - share circuits, learn in public. 🤝',
      'You\'re not grinding alone!',
    ],
  },
  '/debug-mission': {
    id: 'm-debug',
    lines: [
      'A circuit is broken. Find the fault, fix it, beat the clock! 🐞',
      'Trace the signal like a real engineer.',
    ],
  },
  '/gatekeeper-game': {
    id: 'm-gatekeeper',
    lines: ['Build the right logic to pass each gate. Trust your instincts! 🚪'],
  },
  '/sandbox/verilog': {
    id: 'm-sandbox',
    lines: [
      'A no-pressure space to type logic and watch it synthesize. 🧫',
      'Try & (AND), | (OR), ~ (NOT), ^ (XOR) in your assigns.',
    ],
  },
};

const MODULE_SCRIPT: MascotScript = {
  id: 'm-module',
  lines: [
    'A lesson! Read, tap, and progress at your own pace. 📚',
    'Tap the menu (☰) to jump between scenes.',
    'Use Back / Next at the bottom - or your arrow keys.',
    'Nothing here can break - poke everything and have fun! 🔬',
  ],
};

const FALLBACK: MascotScript = {
  id: 'm-generic',
  lines: ["I'm Byte - your circuit buddy! Tap me anytime for a tip. 🕷️"],
};

export function getMascotLines(pathname: string): MascotScript {
  if (EXACT[pathname]) return EXACT[pathname];
  if (
    pathname.startsWith('/module/') ||
    pathname.startsWith('/dsd/') ||
    pathname.startsWith('/basic-electronics/')
  ) {
    return MODULE_SCRIPT;
  }
  return FALLBACK;
}
