/**
 * Tiny, dependency-free fallback shown while a lazily-loaded route chunk
 * downloads. Matches the dark theme so route transitions stay seamless.
 */
export const RouteFallback = () => (
  <div className="min-h-[100svh] w-full flex items-center justify-center bg-bg-void">
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full border-2 border-signal-core/20" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-signal-core animate-spin" />
      </div>
      <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-text-dim">Loading</span>
    </div>
  </div>
);
