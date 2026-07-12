/**
 * Resolve a media URL, optionally through an external media host / CDN.
 *
 * Lecture videos are large (40–60 MB each). Serving them from the app origin is
 * slow and eats origin bandwidth, so we route every media URL through this
 * single helper. Set `VITE_MEDIA_BASE_URL` at build time (e.g. a Cloudflare
 * Stream / Bunny / R2 subdomain like `https://cdn.bitforbytes.in`) and all
 * root-relative media (`/videos/foo.mp4`, `/images/bar.png`) is served from
 * there instead — with zero changes at the call sites, because the shared
 * CustomVideoPlayer resolves its `src`/`poster` through here.
 *
 * When the env var is unset (the default), URLs are returned unchanged, so the
 * app keeps serving media from `/public` exactly as before.
 */
const RAW_BASE = (import.meta.env.VITE_MEDIA_BASE_URL as string | undefined)?.trim();
const BASE = RAW_BASE ? RAW_BASE.replace(/\/+$/, '') : '';

export function mediaUrl(path?: string): string | undefined {
  if (!path) return path;
  // Absolute URLs, data URIs, and blobs are already fully qualified.
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (!BASE) return path;
  return path.startsWith('/') ? BASE + path : `${BASE}/${path}`;
}

/** True when an external media host is configured. */
export const hasMediaCdn = BASE.length > 0;
