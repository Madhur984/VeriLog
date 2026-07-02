import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/**
 * App-wide error boundary.
 *
 * Two jobs:
 *  1. Stale/failed code-split chunks - the #1 cause of a blank page that
 *     "fixes itself on reload" after route-based code-splitting. When a lazy
 *     import ultimately fails (stale chunk hash after a new deploy, a
 *     service-worker-cached old manifest, or a dropped fetch), this reloads
 *     ONCE - within a short window, guarded by sessionStorage - to pull the
 *     fresh asset manifest. The guard prevents a reload loop if the fresh
 *     fetch also fails.
 *  2. Any other render error - instead of unmounting the whole tree to a white
 *     screen, show a themed recovery panel with a manual reload.
 */

const RELOAD_TS_KEY = 'app_chunk_reload_ts';
const RELOAD_WINDOW_MS = 10_000;

function isChunkLoadError(err: unknown): boolean {
  const e = err as { name?: string; message?: string } | null;
  const name = e?.name ?? '';
  const msg = e?.message ?? String(err ?? '');
  return (
    name === 'ChunkLoadError' ||
    /Loading chunk \d+ failed/i.test(msg) ||
    /Loading CSS chunk/i.test(msg) ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg)
  );
}

/** True if we may auto-reload right now (i.e. we haven't just reloaded). */
function canAutoReload(): boolean {
  const last = Number(sessionStorage.getItem(RELOAD_TS_KEY) || 0);
  return Date.now() - last > RELOAD_WINDOW_MS;
}

interface State {
  error: Error | null;
  /** When true, render the loading spinner (a reload is in flight) - no error flash. */
  reloading: boolean;
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null, reloading: false };

  static getDerivedStateFromError(error: Error): State {
    // If this is a recoverable chunk error and we haven't just reloaded, we'll
    // reload in componentDidCatch - render the spinner instead of the error UI.
    const reloading = isChunkLoadError(error) && canAutoReload();
    return { error, reloading };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error) && canAutoReload()) {
      sessionStorage.setItem(RELOAD_TS_KEY, String(Date.now()));
      window.location.reload();
      return;
    }
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[AppErrorBoundary] uncaught render error:', error, info.componentStack);
    }
  }

  private handleReload = () => {
    sessionStorage.setItem(RELOAD_TS_KEY, String(Date.now()));
    window.location.reload();
  };

  render() {
    const { error, reloading } = this.state;
    if (!error) return this.props.children;

    // A reload is in flight - show the same calm loading state, not an error.
    if (reloading) {
      return (
        <div className="min-h-[100svh] w-full flex items-center justify-center bg-bg-void">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-10 w-10">
              <span className="absolute inset-0 rounded-full border-2 border-signal-core/20" />
              <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-signal-core animate-spin" />
            </div>
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-text-dim">
              Reconnecting
            </span>
          </div>
        </div>
      );
    }

    // Persistent / non-chunk error - manual recovery.
    return (
      <div className="min-h-[100svh] w-full flex items-center justify-center px-6 bg-bg-void text-text-sub">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-5">
          <div className="brutal bg-bg-elev h-12 w-12 flex items-center justify-center">
            <span className="text-xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-base font-black tracking-[0.2em] uppercase text-text-main">
              Something glitched
            </h1>
            <p className="text-sm text-text-sub leading-relaxed">
              The page hit a snag while loading. Reloading usually clears it.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReload}
            className="brutal-btn mt-1 bg-signal-core text-bg-void px-5 py-2.5 text-[11px] font-mono font-bold uppercase tracking-[0.2em]"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
