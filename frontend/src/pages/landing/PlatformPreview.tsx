import { LogoWordmark } from '../../components/LogoWordmark';

export const PlatformPreview = () => (
  <div className="max-w-4xl mx-auto px-6 py-20 w-full select-none">
    {/* Section Header */}
    <div className="text-center mb-12 space-y-4">
      <span
        className="text-[10px] font-mono tracking-widest uppercase block"
        style={{ color: '#475569' }}
      >
        INSIDE THE PLATFORM
      </span>
      <h2
        className="font-bold tracking-tight uppercase font-sans text-white"
        style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
      >
        See what you're getting into.
      </h2>
    </div>

    {/* Browser chrome */}
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1px solid rgba(148,163,184,0.10)',
        background: '#0D0F12',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}
    >
      {/* Browser top bar */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{
          background: '#131619',
          borderBottom: '1px solid rgba(148,163,184,0.06)',
        }}
      >
        {/* Traffic lights */}
        <div className="flex gap-2">
          {['#EF4444', '#F59E0B', '#10B981'].map(c => (
            <div key={c} className="w-3 h-3 rounded-full"
                 style={{ background: c, opacity: 0.7 }} />
          ))}
        </div>
        {/* URL bar */}
        <div
          className="flex-1 max-w-xs mx-auto rounded px-3 py-1 text-[11px] font-mono text-center"
          style={{
            background: '#07080A',
            color: '#475569',
            border: '1px solid rgba(148,163,184,0.06)',
          }}
        >
          bitforbytes.in/digital-design/d1
        </div>
      </div>

      {/* App UI preview — simplified version of DD-M01 */}
      <div
        className="relative"
        style={{ height: '420px', background: '#07080A', overflow: 'hidden' }}
      >
        {/* Top nav strip */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ borderBottom: '1px solid rgba(148,163,184,0.06)' }}
        >
          <LogoWordmark size="sm" />
          <div className="flex gap-4">
            {['DD-M01', 'SCENE 4/19', '42%'].map((t, i) => (
              <span key={i} className="text-[10px] font-mono"
                    style={{ color: '#475569' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Simulated scene content */}
        <div className="flex items-center justify-center h-full pb-12">
          <div className="text-center">
            <div
              className="text-[10px] font-mono mb-3"
              style={{ color: '#22D3EE', letterSpacing: '0.2em' }}
            >
              PHASE_A // CANONICAL FORMS
            </div>
            <div
              className="font-bold mb-4 font-sans"
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                color: '#F1F5F9',
                letterSpacing: '-0.03em',
              }}
            >
              MINTERMS
            </div>
            <div
              className="text-sm font-mono mb-6"
              style={{ color: '#94A3B8' }}
            >
              F = A·B'·C + A'·B·C' + A·B·C
            </div>
            {/* Simulated interactive truth table rows */}
            <div className="space-y-1">
              {[
                ['0','0','1','0'],
                ['0','1','0','1'],
                ['1','0','1','1'],
                ['1','1','1','1'],
              ].map((row, i) => (
                <div key={i}
                     className="flex gap-4 justify-center text-[11px] font-mono">
                  {row.map((cell, j) => (
                    <span key={j} style={{
                      color: j === 3
                        ? (cell === '1' ? '#22D3EE' : '#475569')
                        : '#94A3B8',
                    }}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient overlay at bottom to fade into the card */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20"
          style={{
            background: 'linear-gradient(to bottom, transparent, #07080A)',
          }}
        />
      </div>
    </div>
  </div>
);
