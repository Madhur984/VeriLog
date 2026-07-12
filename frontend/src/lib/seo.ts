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
    'Free, interactive VLSI and digital-design learning for every ECE student. 90+ hands-on labs — from logic gates to a working CPU. Learn by building, no installs.',
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

// Hand-tuned title + description for every public, indexable route.
const ROUTE: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'BitForBytes — Learn to Design Real Chips | Free VLSI & Digital Design',
    description:
      'Free, interactive VLSI and digital-design learning for every ECE student. 90+ hands-on labs — from logic gates to a working CPU, Verilog, and chip design. No installs.',
  },
  '/career-roadmap': {
    title: 'VLSI & Chip-Design Career Roadmap 2026 | BitForBytes',
    description:
      'A sourced 2026 roadmap into VLSI, chip design, and semiconductor careers — the roles, skills, and the exact path from ECE student to design engineer.',
  },
  '/portal': {
    title: 'Course Portal — 90+ Interactive Chip-Design Labs | BitForBytes',
    description:
      'Browse the full BitForBytes curriculum: digital system design, basic electronics, Verilog, and interactive labs. Learn by building, not memorizing.',
  },
  '/verilog-playground': {
    title: 'Verilog Judge — Practice Verilog Online (Hardware LeetCode) | BitForBytes',
    description:
      'Write, run, and auto-grade Verilog in your browser. A LeetCode-style judge for hardware with combinational + sequential problems and a live schematic. No setup.',
  },
  '/workbench': {
    title: 'Circuit Workbench — Build & Simulate Logic Circuits Online | BitForBytes',
    description:
      'A free in-browser circuit builder and simulator with guided digital-logic builds. Design gates, adders, and full circuits — no downloads.',
  },
  '/kmap-lab': {
    title: 'Karnaugh Map Solver — Interactive K-Map Minimizer | BitForBytes',
    description:
      'Minimize Boolean expressions with an interactive Karnaugh map. Enter a truth table and watch the grouped prime implicants and simplified logic appear, step by step.',
  },
  '/verilog-library': {
    title: 'Verilog Snippet Library — Patterns & Examples | BitForBytes',
    description:
      'A reference library of Verilog patterns and examples — from basic gates to finite state machines — with copy-ready code for students learning HDL.',
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
    'A free, interactive foundations module in the BitForBytes chip-design curriculum — learn by building, with hands-on labs and no installs.',
  'Digital System Design':
    'A hands-on Digital System Design module — adders, multiplexers, finite state machines and more, taught with interactive labs and Verilog on BitForBytes.',
  'Basic Electronics':
    'A hands-on Basic Electronics module — diodes, BJTs, MOSFETs and more, taught with interactive analog labs on BitForBytes.',
  Sandbox: 'An open Verilog sandbox to experiment with HDL in the browser on BitForBytes.',
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
      robots: INDEX,
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
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.origin + '/',
      logo: SITE.origin + '/logo.png',
      description: SITE.defaultDescription,
      sameAs: [
        'https://x.com/bitforbyte_',
        'https://www.linkedin.com/company/bitforbytes',
        'https://www.instagram.com/bitforbytes',
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

  if (/^\/(module|dsd|basic-electronics)\//.test(pathname)) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: seo.title.replace(` | ${SITE.name}`, ''),
      description: seo.description,
      url: seo.canonical,
      provider: { '@type': 'Organization', name: SITE.name, url: SITE.origin + '/' },
      isAccessibleForFree: true,
      inLanguage: 'en',
    });
  }

  return out;
}
