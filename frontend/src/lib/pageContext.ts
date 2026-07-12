// Builds a short, human-readable description of the page the student is on, so
// DUMMY (the assistant Edge Function) can ground its summaries and answers in
// what's actually on screen. Route map first, then whatever the live DOM tells
// us (tab title + main heading).

interface RouteCtx {
  test: (p: string) => boolean;
  title: string;
  desc: string;
}

const ROUTES: RouteCtx[] = [
  { test: (p) => p === '/', title: 'Home / Landing', desc: 'The BitForBytes landing page — an interactive platform to learn chip design from zero: digital logic, Verilog, VLSI and basic electronics through hands-on labs.' },
  { test: (p) => p.startsWith('/login') || p.startsWith('/register'), title: 'Sign in', desc: 'The login / sign-up screen. Students can sign in with email, Google, LinkedIn or GitHub, or continue as a guest.' },
  { test: (p) => p.startsWith('/portal'), title: 'Workstation (Portal)', desc: 'The student hub listing every module, lab and tool. The first foundation modules are free; green checks mark completed ones.' },
  { test: (p) => p.startsWith('/profile'), title: 'Profile', desc: "The learner's profile: account details, how they signed in, and their real module activity / learning-path timeline." },
  { test: (p) => p.startsWith('/settings'), title: 'Settings', desc: 'Account settings — change display name, email, password, theme, or sign out.' },
  { test: (p) => p.startsWith('/career-roadmap') || p.startsWith('/silicon-map'), title: 'Career Roadmap', desc: 'A map showing how electronics/VLSI skills connect into real careers, and what to learn next.' },
  { test: (p) => p.startsWith('/dsd/'), title: 'Digital System Design module', desc: 'A Digital System Design lesson (adders, subtractors, MUX/DEMUX, encoders, combinational logic, etc.) that builds a real circuit step by step: analogy → build-it-yourself → recap.' },
  { test: (p) => p.startsWith('/basic-electronics/'), title: 'Basic Electronics module', desc: 'A basic-electronics lesson on components like diodes, BJTs, MOSFETs and JFETs — the building blocks of every chip, taught via analogy then math.' },
  { test: (p) => p.startsWith('/module/'), title: 'Foundation module', desc: 'A foundation lesson mixing video, interactive visualisations and practice — signals, number systems, logic gates and the path toward building a CPU.' },
  { test: (p) => p.startsWith('/workbench'), title: 'Logic Workbench', desc: 'A live sandbox to drag logic gates, wire them up and watch signals flow. Guided tutorials (e.g. half-adder, full-adder) teach the ropes.' },
  { test: (p) => p.startsWith('/kmap'), title: 'K-Map Lab', desc: 'Karnaugh-map simplification lab — group the 1s to minimise a boolean expression; larger, fewer groups mean simpler circuits.' },
  { test: (p) => p.startsWith('/verilog-playground') || p.startsWith('/hw-leetcode') || p.startsWith('/verilog-judge'), title: 'Hardware LeetCode (Verilog judge)', desc: 'A hardware coding judge: write Verilog, run it against test cases and get instant pass/fail feedback. Starts with single-bit combinational problems.' },
  { test: (p) => p.startsWith('/verilog-library'), title: 'Verilog Library', desc: 'A quick-reference library of Verilog patterns and snippets.' },
  { test: (p) => p.startsWith('/analog'), title: 'Analogy Library', desc: 'A reference of intuitive analogies that explain electronics and logic concepts.' },
  { test: (p) => p.startsWith('/logic-studio') || p.startsWith('/signal-playground'), title: 'Signal / Logic Studio', desc: 'An open playground to poke at signals and logic and see how they behave — no wrong answers.' },
  { test: (p) => p.startsWith('/boss-arena') || p.startsWith('/gatekeeper-game') || p.startsWith('/debug-mission'), title: 'Challenge Mode', desc: 'Timed challenges and debugging missions that test everything learned so far.' },
];

/**
 * A compact page description for the assistant. Combines the route map with the
 * live tab title + first <h1>, which is often the current lesson/scene name.
 */
export function getPageContext(pathname: string): string {
  const match = ROUTES.find((r) => r.test(pathname));
  const routeInfo = match ? `${match.title} — ${match.desc}` : `A BitForBytes page (${pathname}).`;

  let live = '';
  try {
    const title = typeof document !== 'undefined' ? document.title : '';
    const h1 = typeof document !== 'undefined' ? document.querySelector('h1')?.textContent?.trim() : '';
    live = [title && `Tab title: "${title}"`, h1 && `Main heading on screen: "${h1}"`]
      .filter(Boolean)
      .join('. ');
  } catch {
    /* ignore DOM read errors */
  }

  return `Current route: ${pathname}\n${routeInfo}${live ? `\n${live}` : ''}`;
}
