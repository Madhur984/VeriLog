/**
 * Per-route SEO model. `getSeo(pathname)` returns everything the <head> needs
 * for a given URL — a specific title + description, the self-referencing
 * canonical, Open Graph / Twitter fields, and a robots directive. `routeJsonLd`
 * returns the route-level structured data (schema.org) to inject.
 *
 * This is the single source of truth for discoverability; `SeoManager` applies
 * it to the DOM on every navigation. Because the app is a client-rendered SPA,
 * these tags are set at runtime — keep the static defaults in index.html in
 * sync so non-JS scrapers still get a sensible card.
 */
import { getRouteMeta } from './routeMeta';

export const SITE = {
  origin: 'https://bitforbytes.in',
  name: 'BitForBytes',
  twitter: '@bitforbyte_',
  /** 1200x630 share card shipped from /public. */
  ogImage: 'https://bitforbytes.in/og-cover.png',
  defaultDescription:
    'BitForBytes is a free VLSI and digital-design education platform for ECE students. Learn and practice Verilog, RTL and digital logic in your browser — 90+ interactive labs, an online Verilog judge, and a semiconductor career roadmap. No installs.',
} as const;

export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  image: string;
  type: 'website' | 'article';
  robots: string;
  section?: string;
  label?: string;
}

const INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX = 'noindex, follow';

// Routes that must never be indexed (auth + personal). Everything not listed
// and not a known public route falls through to a 404 -> noindex.
const NOINDEX_EXACT = new Set([
  '/login',
  '/verify-email',
  '/reset-password',
  '/profile',
  '/settings',
]);

// Login-gated routes: an anonymous crawler is redirected to /login, so these
// would otherwise index as thin "sign in" pages and dilute the public ones.
// Keep them out of the index (they're also excluded from the sitemap) so
// Google's crawl budget & ranking focus on the strong, public pages.
const GATED_PREFIX = /^\/(dsd|basic-electronics)\//;
const GATED_EXACT = new Set([
  '/module/6', '/boss-arena', '/fsm', '/hw-leetcode', '/logic-studio',
  '/signal-playground', '/quests', '/activities', '/community', '/debug-mission',
  '/gatekeeper-game', '/ai-lab', '/silicon-secrets', '/portfolio', '/skill-tree',
]);
const isGated = (path: string): boolean => GATED_PREFIX.test(path) || GATED_EXACT.has(path);

// Hand-tuned title + description for every public, indexable route.
const ROUTE: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'BitForBytes — VLSI & Digital Design Education Platform | Learn Verilog, Build a Chip-Design Career',
    description:
      'The free VLSI and hardware education platform for ECE students. Learn and practice Verilog, RTL and digital design in your browser — 90+ interactive labs, an online Verilog judge, K-map and circuit tools, and a semiconductor career roadmap. No installs.',
  },
  '/career-roadmap': {
    title: 'VLSI & Semiconductor Career Roadmap 2026 | BitForBytes',
    description:
      'A sourced 2026 roadmap into VLSI, chip design and semiconductor careers — the roles (RTL design, verification, physical design), the skills, and the exact path from ECE student to design engineer.',
  },
  '/portal': {
    title: 'Course Portal — VLSI & Digital-Design Curriculum | BitForBytes',
    description:
      'The full BitForBytes VLSI curriculum: digital system design, Verilog, basic electronics and 90+ hands-on labs — the foundation for RTL design, verification and a semiconductor career. Learn by building.',
  },
  '/verilog-playground': {
    title: 'Verilog Judge — Practice Verilog Online for VLSI Interviews | BitForBytes',
    description:
      'Write, run and auto-grade Verilog in your browser. A LeetCode-style judge for hardware with combinational + sequential problems to sharpen your RTL skills and prep for VLSI interviews. No setup.',
  },
  '/workbench': {
    title: 'Circuit Workbench — Build & Simulate Logic Circuits Online | BitForBytes',
    description:
      'A free in-browser circuit builder and simulator for digital-logic and VLSI practice, with guided builds. Design gates, adders and full circuits — no downloads.',
  },
  '/kmap-lab': {
    title: 'Karnaugh Map Solver — Interactive K-Map Minimizer | BitForBytes',
    description:
      'Minimize Boolean expressions with an interactive Karnaugh map — an essential digital-design and VLSI skill. Enter a truth table and watch the grouped prime implicants and simplified logic appear, step by step.',
  },
  '/library': {
    title: 'B.Tech Previous Year Question Papers — Free PDF Library (ECE, CSE, ME, EE) | BitForBytes',
    description:
      'A free library of 6,500+ B.Tech previous-year question papers and solutions, sorted by branch, year and subject — sessionals, pre-university and unit tests across ECE, CSE, Mechanical, Electrical, Civil and more. Read online or download the PDF, no sign-in needed.',
  },
  '/verilog-library': {
    title: 'Verilog Snippet Library — Patterns & Examples | BitForBytes',
    description:
      'A reference library of Verilog patterns and examples — from basic gates to finite state machines — with copy-ready code for students learning HDL.',
  },
  '/interview-prep': {
    title: 'VLSI Interview Questions & Answers — Digital Design & Verilog | BitForBytes',
    description:
      'A free bank of common VLSI and digital-design interview questions with clear answers — setup/hold time, FSMs, blocking vs non-blocking, K-maps, adders and more. Filter by topic and difficulty. Real prep, not "coming soon".',
  },
  '/analogies': {
    title: 'Digital-Design Analogies — Make Hard Concepts Click | BitForBytes',
    description:
      'Plain-language analogies that make hard digital-design and VLSI concepts click, backed by animated, interactive explanations.',
  },
  '/silicon-map': {
    title: 'From Sand to Silicon — How Chips Are Made | BitForBytes',
    description:
      'An interactive journey through semiconductor fabrication — from raw sand to a finished silicon chip. See every stage of how a chip is made.',
  },
  '/pledge': {
    title: 'The India ECE Pledge | BitForBytes',
    description:
      "Take the India ECE Pledge and join a community of students building India's semiconductor future — one module at a time.",
  },
  '/privacy': {
    title: 'Privacy Policy | BitForBytes',
    description:
      'How BitForBytes collects, uses, and protects your data — accounts, analytics, cookies, third parties, and your rights.',
  },
  '/terms': {
    title: 'Terms of Service | BitForBytes',
    description:
      'The terms that govern your use of BitForBytes — accounts, acceptable use, content and intellectual property, and disclaimers.',
  },
  '/login': {
    title: 'Sign in | BitForBytes',
    description: 'Sign in or create a free BitForBytes account to track your progress across 90+ interactive chip-design labs.',
  },
};

// Per-section copy for the course-module route families (/module, /dsd, /basic-electronics).
const SECTION_DESC: Record<string, string> = {
  Foundations:
    'A free, interactive foundations module in the BitForBytes VLSI curriculum — digital logic and Verilog basics for ECE students, taught with hands-on labs and no installs.',
  'Digital System Design':
    'A hands-on Digital System Design module — adders, multiplexers, finite state machines and more: the RTL and digital-design core of a VLSI career, taught with interactive labs and Verilog on BitForBytes.',
  'Basic Electronics':
    'A hands-on Basic Electronics module — diodes, BJTs, MOSFETs and more: the device physics behind VLSI, taught with interactive analog labs on BitForBytes.',
  Sandbox: 'An open Verilog sandbox to write and simulate HDL in the browser — practice RTL for VLSI on BitForBytes.',
};

/** Resolve the full SEO record for a route. */
export function getSeo(pathname: string): SeoData {
  const path = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const canonical = SITE.origin + (path === '/' ? '/' : path);

  const exact = ROUTE[path];
  if (exact) {
    return {
      title: exact.title,
      description: exact.description,
      canonical,
      image: SITE.ogImage,
      type: path === '/' ? 'website' : 'article',
      robots: NOINDEX_EXACT.has(path) ? NOINDEX : INDEX,
      ...getRouteMeta(path),
    };
  }

  if (NOINDEX_EXACT.has(path)) {
    return { title: `${SITE.name}`, description: SITE.defaultDescription, canonical, image: SITE.ogImage, type: 'website', robots: NOINDEX };
  }

  // Course-module families -> build from the breadcrumb label + section.
  const meta = getRouteMeta(path);
  if (meta.label) {
    const trail = meta.section ? `${meta.section} · ${meta.label}` : meta.label;
    return {
      title: `${trail} | ${SITE.name}`,
      description: (meta.section && SECTION_DESC[meta.section]) || SITE.defaultDescription,
      canonical,
      image: SITE.ogImage,
      type: 'article',
      robots: isGated(path) ? NOINDEX : INDEX,
      section: meta.section,
      label: meta.label,
    };
  }

  // Unknown path -> soft-404. Emit noindex so search engines drop it.
  return {
    title: `Page not found | ${SITE.name}`,
    description: SITE.defaultDescription,
    canonical,
    image: SITE.ogImage,
    type: 'website',
    robots: NOINDEX,
  };
}

/** Static site-wide structured data (Organization + WebSite). Injected once. */
export function siteJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: SITE.name,
      url: SITE.origin + '/',
      logo: SITE.origin + '/logo.png',
      description:
        'BitForBytes is a free VLSI and digital-design education platform helping ECE students learn Verilog and digital design and build toward a semiconductor career.',
      sameAs: [
        'https://x.com/bitforbyte_',
        'https://www.linkedin.com/company/bitforbytes',
        'https://www.instagram.com/bit_for_bytes',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.origin + '/',
    },
  ];
}

/** Route-level structured data: a breadcrumb, plus a Course for module pages. */
export function routeJsonLd(pathname: string, seo: SeoData): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];

  const crumbs: { name: string; item: string }[] = [{ name: 'Home', item: SITE.origin + '/' }];
  if (seo.section) crumbs.push({ name: seo.section, item: SITE.origin + '/portal' });
  if (seo.label && seo.label !== 'Home') crumbs.push({ name: seo.label, item: seo.canonical });
  if (crumbs.length > 1) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    });
  }

  if (pathname === '/career-roadmap') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'EducationalOccupationalProgram',
      name: 'BitForBytes ECE & Semiconductor Career Roadmap',
      description: seo.description,
      url: seo.canonical,
      provider: { '@type': 'EducationalOrganization', name: SITE.name, url: SITE.origin + '/' },
      educationalProgramMode: 'online',
      timeToComplete: 'P4Y',
      occupationalCategory: [
        'VLSI Design Engineer',
        'Design Verification Engineer (UVM)',
        'Physical Design & STA Engineer',
        'Embedded Systems & Firmware Engineer',
        'AI/ML Hardware Accelerator Engineer'
      ],
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock'
      },
      hasCourse: [
        { '@type': 'Course', name: 'VLSI & Chip Design Semester Roadmap', description: 'RTL Design, Verilog HDL, FSMs, RISC-V, UVM Testbenches, OpenLane Tape-out' },
        { '@type': 'Course', name: 'Embedded Systems & IoT Semester Roadmap', description: 'Embedded C, STM32 Bare-metal, FreeRTOS, Linux Device Drivers, CAN/AUTOSAR' },
        { '@type': 'Course', name: 'AI/ML & Edge Computing Semester Roadmap', description: 'Deep Learning, PyTorch, Model Quantization, TensorRT, NPU Accelerator Design' },
        { '@type': 'Course', name: 'Wireless & 5G/6G Signal Processing Roadmap', description: 'Digital Communications, SDR Transceivers, 5G NR PHY Layer, Matlab & GNURadio' }
      ]
    });
  }

  return out;
}
