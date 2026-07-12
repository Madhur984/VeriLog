import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeo, routeJsonLd, siteJsonLd, SITE } from '../lib/seo';

/**
 * The head manager. On every route change it sets the document title, the meta
 * description, the self-referencing canonical, the full Open Graph + Twitter
 * card, the robots directive (noindex for auth/404), and injects route-level
 * JSON-LD structured data. Site-wide Organization + WebSite JSON-LD is injected
 * once on mount. Renders nothing.
 *
 * Replaces the old title-only RouteTitle so per-page metadata is no longer
 * static/route-invariant — the single biggest SEO gap for a client-rendered SPA.
 */

function upsertMeta(selector: string, attrs: Record<string, string>): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    for (const [k, v] of Object.entries(attrs)) {
      if (k !== 'content') el.setAttribute(k, v);
    }
    document.head.appendChild(el);
  }
  if (attrs.content !== undefined) el.setAttribute('content', attrs.content);
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id: string, data: Record<string, unknown>[]): void {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!data.length) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data.length === 1 ? data[0] : data);
}

export const SeoManager = () => {
  const { pathname } = useLocation();

  // Site-wide structured data, injected once.
  useEffect(() => {
    setJsonLd('ld-site', siteJsonLd());
  }, []);

  useEffect(() => {
    const seo = getSeo(pathname);

    document.title = seo.title;
    upsertMeta('meta[name="description"]', { name: 'description', content: seo.description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.robots });
    upsertLink('canonical', seo.canonical);

    // Open Graph
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonical });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: seo.image });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE.name });

    // Twitter
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.image });
    upsertMeta('meta[name="twitter:site"]', { name: 'twitter:site', content: SITE.twitter });

    setJsonLd('ld-route', routeJsonLd(pathname, seo));
  }, [pathname]);

  return null;
};
