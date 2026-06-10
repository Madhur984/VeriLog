import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Flame, Ghost, MousePointerClick } from 'lucide-react';

type Ing = 'milk' | 'leaves' | 'sugar';
type Pot = Record<Ing, boolean>;
type Phase = 'idle' | 'brewing' | 'served';

interface Props { isActive?: boolean; isDarkMode: boolean; }

const ACCENT = '#f59e0b';
const TICKET_LOOP = 7; // seconds · ghost ticket + vendor shrug share this clock

const CHIPS: { id: Ing; label: string; color: string }[] = [
  { id: 'milk',   label: 'Milk',       color: '#93c5fd' },
  { id: 'leaves', label: 'Tea leaves', color: '#34d399' },
  { id: 'sugar',  label: 'Sugar',      color: '#fbbf24' },
];

const cupLook = (p: Pot): { color: string; name: string } => {
  let color: string;
  let name: string;
  if (p.leaves && p.milk) { color = '#c4854f'; name = 'Milky chai'; }
  else if (p.leaves)      { color = '#6b3a16'; name = 'Strong black tea'; }
  else if (p.milk)        { color = '#f0e4d0'; name = 'Warm milk'; }
  else                    { color = '#b7d3e3'; name = 'Plain hot water'; }
  if (p.sugar) name += ' · sweet';
  return { color, name };
};

export const S04_TeaStall: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [pot, setPot]       = useState<Pot>({ milk: false, leaves: true, sugar: false });
  const [phase, setPhase]   = useState<Phase>('idle');
  const [served, setServed] = useState<Pot | null>(null);

  useEffect(() => {
    if (phase !== 'brewing') return;
    const t = window.setTimeout(() => setPhase('served'), 1800);
    return () => window.clearTimeout(t);
  }, [phase]);

  const brew = () => {
    if (phase === 'brewing') return;
    setServed({ ...pot });   // the cup is built ONLY from what is in the pot right now
    setPhase('brewing');
  };

  const brewing = phase === 'brewing';
  const liquid = cupLook(pot).color;
  const cup = phase === 'served' && served ? cupLook(served) : null;

  const stripeA = ACCENT;
  const stripeB = isDarkMode ? '#334155' : '#e2e8f0';
  const woodFill = isDarkMode ? '#54341f' : '#b45309';
  const metal = isDarkMode ? '#334155' : '#64748b';
  const steamC = isDarkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ACCENT }}>
          <Coffee size={14} /> Chapter 04 · The Memoryless Tea Vendor
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          One cup. From what is in his hands. Nothing else.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Hand him ingredients, press brew. The cup depends only on the chips in the pot right now.
        </p>
      </section>

      {/* ── The stall ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        {/* Ghost ticket from yesterday · drifts by and dissolves */}
        <motion.div
          initial={{ left: '-22%', opacity: 0 }}
          animate={{
            left: ['-22%', '38%', '56%', '64%'],
            opacity: [0, 0.95, 0.95, 0],
            filter: ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(8px)'],
          }}
          transition={{ duration: TICKET_LOOP, times: [0, 0.35, 0.72, 1], repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 z-10 pointer-events-none px-3 py-2 rounded-xl border-2 border-dashed font-mono text-[10px] leading-tight"
          style={{
            borderColor: `${ACCENT}77`,
            background: isDarkMode ? 'rgba(2,1,0,0.7)' : 'rgba(255,255,255,0.85)',
            color: ACCENT,
          }}
        >
          <span className="flex items-center gap-1.5 uppercase tracking-widest opacity-80">
            <Ghost size={11} /> Yesterday&apos;s order
          </span>
          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>2 sweet chai · he has no idea</span>
        </motion.div>

        <svg viewBox="0 0 760 380" className="w-full h-auto">
          {/* Awning stripes + scallops */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={`st${i}`} x={60 + i * 80} y={22} width={80} height={40}
                  fill={i % 2 === 0 ? stripeA : stripeB} />
          ))}
          {Array.from({ length: 16 }).map((_, j) => (
            <circle key={`sc${j}`} cx={60 + j * 40 + 20} cy={62} r={20}
                    fill={Math.floor(j / 2) % 2 === 0 ? stripeA : stripeB} />
          ))}

          {/* Hanging sign */}
          <line x1="380" y1="74" x2="380" y2="92" stroke={metal} strokeWidth="2" />
          <rect x="340" y="92" width="80" height="26" rx="6" fill={isDarkMode ? '#0a0e1a' : '#fff'}
                stroke={ACCENT} strokeWidth="2" />
          <text x="380" y="110" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={ACCENT}>CHAI</text>

          {/* Posts + counter */}
          <rect x="56"  y="62" width="7" height="206" fill={woodFill} />
          <rect x="696" y="62" width="7" height="206" fill={woodFill} />
          <rect x="40" y="268" width="680" height="16" rx="4" fill={woodFill} />

          {/* Stove */}
          <rect x="168" y="236" width="124" height="32" rx="4" fill={isDarkMode ? '#1e293b' : '#475569'} />
          <rect x="208" y="244" width="44" height="18" rx="3" fill="#0a0e1a" />
          <motion.path
            d="M 220 260 Q 224 248 229 256 Q 232 244 236 254 Q 241 250 241 260 Z"
            fill="#fb923c"
            animate={{ scaleY: brewing ? [1, 1.7, 1] : [1, 1.2, 1], opacity: brewing ? 1 : 0.7 }}
            transition={{ duration: brewing ? 0.4 : 0.9, repeat: Infinity }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
          />

          {/* Pot */}
          <motion.g
            animate={brewing ? { x: [0, -1.5, 1.5, 0] } : { x: 0 }}
            transition={brewing ? { duration: 0.25, repeat: Infinity } : {}}
          >
            <path d="M 178 176 Q 174 232 230 236 Q 286 232 282 176 Z" fill={metal} stroke={isDarkMode ? '#1e293b' : '#475569'} strokeWidth="2" />
            <motion.ellipse cx="230" cy="176" rx="52" ry="10"
              animate={{ fill: liquid }} stroke={isDarkMode ? '#1e293b' : '#475569'} strokeWidth="2" />
            {/* Handles */}
            <path d="M 176 178 q -12 2 -8 14" fill="none" stroke={metal} strokeWidth="4" strokeLinecap="round" />
            <path d="M 284 178 q 12 2 8 14"  fill="none" stroke={metal} strokeWidth="4" strokeLinecap="round" />

            {/* Ingredients bobbing in the pot · only what is in it RIGHT NOW */}
            {CHIPS.map((c, i) => pot[c.id] && (
              <motion.circle
                key={c.id} cx={208 + i * 22} r={5} fill={c.color}
                initial={{ cy: 168, opacity: 0 }}
                animate={{ cy: [174, 178, 174], opacity: 1 }}
                transition={{ cy: { duration: 1.6, repeat: Infinity, delay: i * 0.3 }, opacity: { duration: 0.3 } }}
              />
            ))}

            {/* Boil bubbles */}
            {brewing && [212, 224, 238, 248].map((bx, i) => (
              <motion.circle
                key={`b${bx}`} cx={bx} fill={isDarkMode ? '#f8fafc' : '#fff'} stroke={steamC} strokeWidth="0.5"
                animate={{ cy: [178, 162], r: [2, 5], opacity: [0.9, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.17 }}
              />
            ))}
          </motion.g>

          {/* Steam over the pot */}
          {brewing && [214, 240].map((sx, i) => (
            <motion.path
              key={`s${sx}`}
              d={`M ${sx} 156 q 6 -12 0 -24 q -6 -12 0 -22`}
              fill="none" stroke={steamC} strokeWidth="3" strokeLinecap="round"
              animate={{ opacity: [0, 0.7, 0], y: [-2, -12] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}

          {/* The served cup · slides out of the pot area onto the counter */}
          {cup && (
            <motion.g
              initial={{ x: 255, y: 262, opacity: 0, scale: 0.5 }}
              animate={{ x: 430, y: 262, opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <ellipse cx="22" cy="4" rx="36" ry="6" fill={metal} opacity="0.8" />
              <rect x="-2" y="-44" width="48" height="46" rx="9"
                    fill={isDarkMode ? '#e2e8f0' : '#f8fafc'} stroke={isDarkMode ? '#94a3b8' : '#64748b'} strokeWidth="2" />
              <ellipse cx="22" cy="-42" rx="21" ry="6" fill={cup.color} stroke={isDarkMode ? '#94a3b8' : '#64748b'} strokeWidth="1.5" />
              <path d="M 46 -36 q 16 4 0 22" fill="none" stroke={isDarkMode ? '#94a3b8' : '#64748b'} strokeWidth="4" strokeLinecap="round" />
              {/* Cup steam */}
              <motion.path
                d="M 22 -52 q 5 -8 0 -16" fill="none" stroke={steamC} strokeWidth="2.5" strokeLinecap="round"
                animate={{ opacity: [0, 0.7, 0], y: [-2, -10] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              {/* Sugar sparkle · only if sugar was in the pot at brew time */}
              {served?.sugar && [
                { x: 6, y: -58, d: 0 }, { x: 34, y: -62, d: 0.4 }, { x: 20, y: -68, d: 0.8 },
              ].map((sp) => (
                <motion.circle
                  key={`${sp.x}-${sp.y}`} cx={sp.x} cy={sp.y} r={2} fill="#fbbf24"
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: sp.d }}
                />
              ))}
            </motion.g>
          )}

          {/* The vendor · shrugs when the ghost ticket dissolves near him */}
          <g>
            <circle cx="600" cy="168" r="17" fill={isDarkMode ? '#e7c49a' : '#f3cf9f'} stroke={woodFill} strokeWidth="1.5" />
            <path d="M 584 160 a 17 17 0 0 1 32 0 Z" fill={woodFill} />
            <circle cx="594" cy="168" r="1.8" fill="#1e293b" />
            <circle cx="606" cy="168" r="1.8" fill="#1e293b" />
            <path d="M 595 176 q 5 4 10 0" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="580" y="188" width="40" height="74" rx="12" fill="#b45309" />
            <rect x="590" y="212" width="20" height="50" rx="6" fill={isDarkMode ? '#e2e8f0' : '#f8fafc'} opacity="0.85" />

            {/* Arms down (default pose) */}
            <motion.g
              animate={{ opacity: [1, 1, 0, 0, 1] }}
              transition={{ duration: TICKET_LOOP, times: [0, 0.66, 0.72, 0.94, 1], repeat: Infinity }}
            >
              <line x1="583" y1="200" x2="568" y2="246" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
              <line x1="617" y1="200" x2="632" y2="246" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
            </motion.g>
            {/* Shrug pose · hands up, palms open */}
            <motion.g
              animate={{ opacity: [0, 0, 1, 1, 0] }}
              transition={{ duration: TICKET_LOOP, times: [0, 0.66, 0.72, 0.94, 1], repeat: Infinity }}
            >
              <line x1="583" y1="200" x2="560" y2="194" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
              <line x1="617" y1="200" x2="640" y2="194" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
              <circle cx="556" cy="192" r="5" fill={isDarkMode ? '#e7c49a' : '#f3cf9f'} />
              <circle cx="644" cy="192" r="5" fill={isDarkMode ? '#e7c49a' : '#f3cf9f'} />
              <text x="632" y="146" fontSize="22" fontFamily="monospace" fontWeight="bold" fill={ACCENT}>?</text>
            </motion.g>
          </g>

          {/* Floor line */}
          <line x1="20" y1="350" x2="740" y2="350" stroke={isDarkMode ? '#1e293b' : '#cbd5e1'} strokeWidth="2" />
          <line x1="120" y1="284" x2="110" y2="350" stroke={woodFill} strokeWidth="5" />
          <line x1="640" y1="284" x2="650" y2="350" stroke={woodFill} strokeWidth="5" />
        </svg>

        {/* Controls */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className={`flex items-center gap-2 text-xs font-mono ${subText} mb-2`}>
              <MousePointerClick size={12} /> Toss chips in or out of the pot
            </div>
            <div className="flex gap-2 flex-wrap">
              {CHIPS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setPot(p => ({ ...p, [c.id]: !p[c.id] }))}
                  className="px-4 py-2.5 rounded-xl border-2 font-mono font-black text-sm transition-all active:scale-95"
                  style={{
                    borderColor: c.color,
                    color: pot[c.id] ? '#000' : c.color,
                    backgroundColor: pot[c.id] ? c.color : 'transparent',
                    boxShadow: pot[c.id] ? `0 0 18px ${c.color}55` : 'none',
                  }}
                >
                  {c.label} {pot[c.id] ? '· in pot' : ''}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={brew}
            disabled={brewing}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-black transition-all active:scale-95 shadow-xl disabled:opacity-70"
            style={{ backgroundColor: ACCENT, boxShadow: `0 10px 30px ${ACCENT}33` }}
          >
            <Flame size={18} /> {brewing ? 'Boiling...' : 'Brew'}
          </button>
        </div>

        {/* Serve readout */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className={`font-mono text-xs px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'} ${subText}`}>
            Cup = F(milk={pot.milk ? 1 : 0}, leaves={pot.leaves ? 1 : 0}, sugar={pot.sugar ? 1 : 0})
          </div>
          <AnimatePresence mode="wait">
            {cup && (
              <motion.div
                key={cup.name}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 font-mono text-xs font-black px-3 py-2 rounded-lg border-2"
                style={{ borderColor: `${ACCENT}66`, color: ACCENT, background: `${ACCENT}10` }}
              >
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: cup.color }} />
                Served: {cup.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── The point ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <p className={`text-xl md:text-2xl font-black ${textColor} text-center mb-6`}>
          &ldquo;He only processes what is in his hands right now.&rdquo;
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { t: 'Chips in hand', m: 'Present inputs' },
            { t: 'Boil and mix',  m: 'Combinational logic' },
            { t: 'Cup out',       m: 'Output, instantly' },
          ].map((r, i) => (
            <motion.div
              key={r.t}
              initial={{ opacity: 0, y: 10 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.08 }}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl border-2 text-center"
              style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}10` }}
            >
              <div className={`font-black text-sm ${textColor}`}>{r.t}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: ACCENT }}>{r.m}</div>
            </motion.div>
          ))}
        </div>
        <p className={`text-xs text-center mt-5 ${subText}`}>
          No yesterday. No count of cups. Change the chips, brew again: the new cup never remembers the old one.
        </p>
      </motion.div>
    </div>
  );
};
