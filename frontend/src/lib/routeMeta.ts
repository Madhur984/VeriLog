/**
 * Single source of truth mapping a route path -> a human label (+ optional
 * section). Drives the breadcrumb trail in the portal nav and the per-route
 * document.title, so the app answers "where am I?" consistently.
 */
export interface RouteMeta {
    label: string;
    section?: string;
}

const EXACT: Record<string, RouteMeta> = {
    '/': { label: 'Home' },
    '/portal': { label: 'Portal' },
    '/login': { label: 'Sign in' },
    '/profile': { label: 'Profile', section: 'Account' },
    '/settings': { label: 'Settings', section: 'Account' },
    '/career-roadmap': { label: 'Career Roadmap' },
    '/analogies': { label: 'Analogy Library' },
    '/verilog-library': { label: 'Verilog Library' },
    '/interview-prep': { label: 'Interview Prep' },
    '/silicon-map': { label: 'Silicon Map' },
    '/pledge': { label: 'Pledge' },
    '/privacy': { label: 'Privacy Policy', section: 'Legal' },
    '/terms': { label: 'Terms of Service', section: 'Legal' },
    '/portfolio': { label: 'Portfolio' },
    '/workbench': { label: 'Workbench' },
    '/kmap-lab': { label: 'K-Map Lab' },
    '/boss-arena': { label: 'Boss Arena' },
    '/skill-tree': { label: 'Skill Tree' },
    '/hw-leetcode': { label: 'Hardware LeetCode' },
    '/fsm': { label: 'FSM Playground' },
    '/verilog-playground': { label: 'Verilog Playground' },
    '/signal-playground': { label: 'Signal Playground' },
    '/logic-studio': { label: 'Logic Studio' },
    '/quests': { label: 'Quests' },
    '/activities': { label: 'Activities' },
    '/community': { label: 'Community' },
    '/debug-mission': { label: 'Debug Mission' },
    '/gatekeeper-game': { label: 'Gatekeeper' },
    '/ai-lab': { label: 'AI Lab' },
    '/silicon-secrets': { label: 'Silicon Secrets' },
};

// Course-module route families: prefix -> section + a per-number item label.
const MODULE_SECTIONS: { test: RegExp; section: string; item: (n: string) => string }[] = [
    { test: /^\/dsd\/(\d+)/, section: 'Digital System Design', item: (n) => `Module ${n}` },
    { test: /^\/basic-electronics\/(\d+)/, section: 'Basic Electronics', item: (n) => `Module ${n}` },
    { test: /^\/module\/(\d+)/, section: 'Foundations', item: (n) => `Module ${n}` },
    { test: /^\/sandbox\//, section: 'Sandbox', item: () => 'Verilog' },
];

export function getRouteMeta(pathname: string): RouteMeta {
    if (EXACT[pathname]) return EXACT[pathname];
    for (const m of MODULE_SECTIONS) {
        const match = pathname.match(m.test);
        if (match) return { label: m.item(match[1] ?? ''), section: m.section };
    }
    // Nested routes (e.g. /debug-mission/:id) fall back to their first segment.
    const first = pathname.split('/').filter(Boolean)[0];
    if (first && EXACT['/' + first]) return EXACT['/' + first];
    return { label: '' };
}

const APP_NAME = 'BitForBytes';

export function pageTitle(pathname: string): string {
    const { label, section } = getRouteMeta(pathname);
    if (!label) return APP_NAME;
    const trail = section ? `${section} · ${label}` : label;
    return `${trail} · ${APP_NAME}`;
}
