import React, { useMemo, useState } from 'react';
import { Search, Share2, RotateCw } from 'lucide-react';

/**
 * The Recall Deck: shareable flip cards used as the "brief" that opens the
 * review module. Front = the analogy we teach a concept with; back = the real
 * logic behind it. Every card exports as a branded 1080x1080 PNG carrying the
 * BitForBytes wordmark plus a large diagonal watermark, so a card that finally
 * made something click can be shared and do the same for the next student.
 *
 * It mirrors the public Analogy Library's card + canvas pattern, but lives
 * inside the module so the deck stays in lockstep with what each chapter drills.
 */

export type DeckCatId = 'comb' | 'seq' | 'adder' | 'timing';

export const DECK_CATEGORIES: Array<{ id: DeckCatId; label: string; color: string }> = [
  { id: 'comb',   label: 'Combinational', color: '#22d3ee' },
  { id: 'seq',    label: 'Sequential',    color: '#a78bfa' },
  { id: 'adder',  label: 'Adders',        color: '#f59e0b' },
  { id: 'timing', label: 'Timing',        color: '#34d399' },
];

export interface DeckCard {
  id: string;
  concept: string;
  category: DeckCatId;
  /** Front of the card: the real-world analogy we demonstrate the concept with. */
  analogy: string;
  /** Back of the card: the real logic (boolean / behavioural truth). */
  logic: string;
  /** Back of the card: where this shows up in real hardware. */
  where: string;
}

/* ── share image generation (1080x1080 canvas) ──────────────────────── */

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const tryLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(tryLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = tryLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** The exact BitForBytes mark (same one Brand.tsx renders), loaded once and reused. */
const LOGO_SRC = '/logo.png';
let logoPromise: Promise<HTMLImageElement> | null = null;
function loadLogo(): Promise<HTMLImageElement> {
  if (logoPromise) return logoPromise;
  logoPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = LOGO_SRC; // same-origin asset, so it never taints the canvas
  });
  return logoPromise;
}

/**
 * The logo PNG has a transparent background with a blue mark, which disappears
 * on the share card's dark background. Recolour just the mark (source-in keeps
 * the alpha) so it reads as a clean white silhouette on dark.
 */
function recolorLogo(logo: HTMLImageElement, color: string): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const cx = c.getContext('2d')!;
  cx.drawImage(logo, 0, 0, 512, 512);
  cx.globalCompositeOperation = 'source-in';
  cx.fillStyle = color;
  cx.fillRect(0, 0, 512, 512);
  return c;
}

async function renderCardImage(a: DeckCard): Promise<Blob> {
  const cat = DECK_CATEGORIES.find((c) => c.id === a.category)!;
  const S = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d')!;
  const logo = await loadLogo().catch(() => null);
  // The card background is always dark, so use a white silhouette of the mark.
  const logoMark = logo ? recolorLogo(logo, '#FFFFFF') : null;

  // background
  ctx.fillStyle = '#0A0E1A';
  ctx.fillRect(0, 0, S, S);
  // faint grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= S; i += 54) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
  }
  // accent glow
  const glow = ctx.createRadialGradient(S - 140, 150, 0, S - 140, 150, 600);
  glow.addColorStop(0, `${cat.color}33`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, S, S);

  // ── watermark: the exact BitForBytes logo, large and faint (white on dark) ──
  if (logoMark) {
    const wm = 720;
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.drawImage(logoMark, (S - wm) / 2, (S - wm) / 2 + 36, wm, wm);
    ctx.restore();
  }

  // ── header lockup: the exact logo mark + wordmark ──
  ctx.textBaseline = 'alphabetic';
  let hx = 80;
  if (logoMark) {
    const m = 56;
    ctx.drawImage(logoMark, hx, 74, m, m);
    hx += m + 18;
  }
  ctx.font = '900 46px Arial, sans-serif';
  ctx.fillStyle = '#FFFFFF'; ctx.fillText('Bit', hx, 122); hx += ctx.measureText('Bit').width;
  ctx.fillStyle = cat.color;  ctx.fillText('for', hx, 122); hx += ctx.measureText('for').width;
  ctx.fillStyle = '#FFFFFF'; ctx.fillText('Bytes', hx, 122);
  // series label
  ctx.font = '700 24px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('THE RECALL DECK · PRACTICE & REVIEW', 80, 168);

  // category pill
  ctx.font = '700 26px Arial, sans-serif';
  const catLabel = cat.label.toUpperCase();
  const pillW = ctx.measureText(catLabel).width + 48;
  ctx.fillStyle = `${cat.color}26`;
  ctx.strokeStyle = cat.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(80, 236, pillW, 56);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = cat.color;
  ctx.fillText(catLabel, 104, 274);

  // concept
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 82px Arial, sans-serif';
  const conceptLines = wrapText(ctx, a.concept, 920);
  let y = 400;
  for (const line of conceptLines) { ctx.fillText(line, 80, y); y += 92; }

  // analogy (quoted)
  ctx.fillStyle = cat.color;
  ctx.font = 'italic 600 44px Georgia, serif';
  const quoteLines = wrapText(ctx, `"${a.analogy}"`, 900);
  y += 18;
  for (const line of quoteLines) { ctx.fillText(line, 80, y); y += 60; }

  // the real logic (small, monospace-ish)
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '600 30px Arial, sans-serif';
  const logicLines = wrapText(ctx, a.logic, 920);
  y += 28;
  for (const line of logicLines.slice(0, 3)) { ctx.fillText(line, 80, y); y += 42; }

  // footer
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath(); ctx.moveTo(80, 970); ctx.lineTo(1000, 970); ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 32px Arial, sans-serif';
  ctx.fillText('Learn electronics backwards.', 80, 1024);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '600 26px Arial, sans-serif';
  const tag = 'bitforbytes';
  ctx.fillText(tag, 1000 - ctx.measureText(tag).width, 1024);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

const captionFor = (a: DeckCard) =>
  `Finally understood ${a.concept} through BitForBytes. ${a.analogy}`;

/* ── component ───────────────────────────────────────────────────────── */

export const FlashCardDeck: React.FC<{ cards: DeckCard[]; isDarkMode: boolean }> = ({ cards, isDarkMode }) => {
  const dark = isDarkMode;
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<DeckCatId | null>(null);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return cards.filter((a) => {
      if (cat && a.category !== cat) return false;
      if (!needle) return true;
      const hay = `${a.concept} ${a.analogy} ${a.logic} ${DECK_CATEGORIES.find((c) => c.id === a.category)?.label}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [cards, q, cat]);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const share = async (a: DeckCard) => {
    try {
      const blob = await renderCardImage(a);
      const caption = captionFor(a);
      const file = new File([blob], `bitforbytes-${a.id}.png`, { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] } as ShareData)) {
        await navigator.share({ files: [file], text: caption } as ShareData);
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bitforbytes-${a.id}.png`;
      link.click();
      URL.revokeObjectURL(url);
      try { await navigator.clipboard.writeText(caption); } catch { /* clipboard blocked */ }
      notify('Card image downloaded and the caption is on your clipboard. Paste it anywhere.');
    } catch {
      notify('Could not generate the share image in this browser.');
    }
  };

  const text = dark ? 'text-white' : 'text-slate-900';
  const sub = dark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div>
      {/* search + filters */}
      <div className="mx-auto max-w-3xl">
        <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
          dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
        }`}>
          <Search size={18} className={sub} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the deck: MUX, flip-flop, carry, clock..."
            className={`w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400 ${text}`}
          />
          {q && (
            <button onClick={() => setQ('')} className={`text-xs font-bold ${sub} hover:opacity-70`}>clear</button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCat(null)}
            className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all"
            style={{
              borderColor: cat === null ? '#fb7185' : dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
              background: cat === null ? 'rgba(251,113,133,0.12)' : 'transparent',
              color: cat === null ? '#fb7185' : undefined,
            }}
          >
            ALL ({cards.length})
          </button>
          {DECK_CATEGORIES.map((c) => {
            const active = cat === c.id;
            const count = cards.filter((x) => x.category === c.id).length;
            if (!count) return null;
            return (
              <button
                key={c.id}
                onClick={() => setCat(active ? null : c.id)}
                className="rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-wider transition-all"
                style={{
                  borderColor: active ? c.color : dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                  background: active ? `${c.color}1F` : 'transparent',
                  color: active ? c.color : undefined,
                }}
              >
                {c.label.toUpperCase()} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* cards */}
      <div className="mx-auto mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => {
          const c = DECK_CATEGORIES.find((x) => x.id === a.category)!;
          const isFlipped = !!flipped[a.id];
          return (
            <div key={a.id} className="h-[400px] [perspective:1400px]">
              <div
                className="relative h-full w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                onClick={() => setFlipped((f) => ({ ...f, [a.id]: !f[a.id] }))}
              >
                {/* front */}
                <div
                  className={`absolute inset-0 flex flex-col overflow-hidden rounded-3xl border p-6 [backface-visibility:hidden] ${
                    dark ? 'border-white/10 bg-[#10121d]' : 'border-slate-200 bg-white shadow-lg'
                  }`}
                >
                  {/* faint corner watermark */}
                  <img loading="lazy" decoding="async" src="/logo.png" alt="" aria-hidden draggable={false}
                       className="pointer-events-none absolute bottom-3 right-3 h-14 w-14 select-none"
                       style={{ opacity: dark ? 0.18 : 0.08, filter: dark ? 'brightness(0) invert(1)' : undefined }} />
                  <div className="flex items-center justify-between">
                    <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest"
                          style={{ background: `${c.color}1A`, color: c.color }}>
                      {c.label}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); void share(a); }}
                      title="Share this card"
                      className={`rounded-full border p-2 transition-all active:scale-90 ${
                        dark ? 'border-white/10 hover:border-white/30' : 'border-slate-200 hover:border-slate-400'
                      }`}
                      style={{ color: c.color }}
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                  <div className={`mt-4 font-mono text-[10px] uppercase tracking-widest ${sub}`}>The analogy</div>
                  <h3 className={`mt-1 text-2xl font-extrabold tracking-tight ${text}`}>{a.concept}</h3>
                  <p className="mt-3 text-[17px] font-medium italic leading-relaxed" style={{ color: c.color }}>
                    "{a.analogy}"
                  </p>
                  <div className={`mt-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${sub}`}>
                    <RotateCw size={12} /> tap for the real logic
                  </div>
                </div>

                {/* back */}
                <div
                  className={`absolute inset-0 flex flex-col overflow-y-auto rounded-3xl border p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    dark ? 'border-white/10 bg-[#10121d]' : 'border-slate-200 bg-white shadow-lg'
                  }`}
                  style={{ borderColor: `${c.color}55` }}
                >
                  <img loading="lazy" decoding="async" src="/logo.png" alt="" aria-hidden draggable={false}
                       className="pointer-events-none absolute bottom-3 right-3 h-14 w-14 select-none"
                       style={{ opacity: dark ? 0.18 : 0.08, filter: dark ? 'brightness(0) invert(1)' : undefined }} />
                  <h3 className="text-lg font-extrabold tracking-tight" style={{ color: c.color }}>{a.concept}</h3>
                  <div className="mt-3 space-y-3 text-[13px] leading-relaxed">
                    <div>
                      <div className={`font-mono text-[10px] font-bold uppercase tracking-widest ${sub}`}>The real logic</div>
                      <p className={`mt-0.5 ${text}`}>{a.logic}</p>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: c.color }}>
                        Where it shows up
                      </div>
                      <p className={`mt-0.5 ${text}`}>{a.where}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${sub}`}>
                      <RotateCw size={12} /> tap to flip back
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); void share(a); }}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-black transition-all active:scale-95"
                      style={{ background: c.color }}
                    >
                      <Share2 size={12} /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className={`mt-16 text-center text-sm ${sub}`}>
          Nothing in the deck matches "{q}". Try "carry", "clock" or "MUX".
        </p>
      )}

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-pink-400/40 bg-slate-950 px-5 py-4 text-center text-sm text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default FlashCardDeck;
