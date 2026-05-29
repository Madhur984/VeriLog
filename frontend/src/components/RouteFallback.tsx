/**
 * Tiny, dependency-free fallback shown while a lazily-loaded route chunk
 * downloads. Matches the dark theme so route transitions stay seamless.
 */
export const RouteFallback = () => (
  <div className="min-h-[100svh] w-full flex items-center justify-center" style={{ background: '#05070E' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full border-2" style={{ borderColor: 'rgba(34,211,238,0.18)' }} />
        <span className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: '#22D3EE' }} />
      </div>
      <span className="text-[11px] font-mono tracking-[0.3em] uppercase" style={{ color: '#475569' }}>Loading</span>
    </div>
  </div>
);
