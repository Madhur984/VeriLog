import React, { useEffect, useRef, useState } from 'react';
import { Menu, ChevronsLeftRight } from 'lucide-react';

/**
 * Shared collapsible nav drawer for the Level-1 module engines.
 *
 *   - DESKTOP (lg+): the sidebar is an in-flow column that PUSHES the lesson
 *     content. Open → it takes its width and the content shrinks beside it;
 *     closed → it collapses to 0 width and the content fills the screen. No dim
 *     overlay — both panes stay visible and interactive. The width is
 *     user-resizable by dragging the ⟷ handle on the right edge (or focusing it
 *     and using ← / →); the chosen width persists across modules and sessions.
 *   - PHONES (< lg): there isn't room to push, so it stays an off-canvas overlay
 *     that slides in over a tap-to-dismiss backdrop (a real modal dialog). The
 *     resize handle is desktop-only.
 *
 * Toggle it open/closed with <HamburgerButton/> (triple-line, in the content
 * header); close it with the ✕ in the drawer, by picking a chapter, Escape, or
 * (on phones) the backdrop. Closed → the panel is `inert` so hidden links aren't
 * tabbable.
 */

const LG_QUERY = '(min-width: 1024px)';

// Desktop drawer width bounds. The engines' inner <Sidebar> is authored at
// 320px, so that is the default; it is forced to fill whatever width we set.
const MIN_W = 240;
const MAX_W = 560;
const DEFAULT_W = 320;
const WIDTH_KEY = 'bfb_drawer_width';

const clampW = (n: number) => Math.min(MAX_W, Math.max(MIN_W, Math.round(n)));

export const DrawerShell: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(LG_QUERY).matches
  );

  // Persisted, drag-resizable desktop width.
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_W;
    const saved = parseInt(window.localStorage.getItem(WIDTH_KEY) || '', 10);
    return Number.isFinite(saved) ? clampW(saved) : DEFAULT_W;
  });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef<{ x: number; w: number } | null>(null);
  const latestWidth = useRef(width);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(LG_QUERY);
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Modal (focus-trap + scroll-lock + backdrop) only for the phone overlay.
  const isModal = open && !isDesktop;

  // Take the collapsed panel out of tab / AT order.
  useEffect(() => {
    const panel = panelRef.current;
    if (panel) panel.inert = !open;
  }, [open]);

  // Lock body scroll only while the phone overlay is open.
  useEffect(() => {
    if (!isModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isModal]);

  // While dragging, kill text selection and force the resize cursor everywhere.
  useEffect(() => {
    if (!dragging) return;
    const prevSelect = document.body.style.userSelect;
    const prevCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    return () => {
      document.body.style.userSelect = prevSelect;
      document.body.style.cursor = prevCursor;
    };
  }, [dragging]);

  // Escape closes on any size while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus management + focus trap while the phone overlay is modal.
  useEffect(() => {
    if (!isModal) return;
    const panel = panelRef.current;
    if (!panel) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    const focusables = (): HTMLElement[] =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      restoreFocusRef.current?.focus?.();
    };
  }, [isModal]);

  const persistWidth = (w: number) => {
    try { window.localStorage.setItem(WIDTH_KEY, String(w)); } catch { /* ignore */ }
  };

  const onHandleDown = (e: React.PointerEvent) => {
    e.preventDefault();
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* ignore */ }
    dragOrigin.current = { x: e.clientX, w: width };
    setDragging(true);
  };
  const onHandleMove = (e: React.PointerEvent) => {
    if (!dragOrigin.current) return;
    const next = clampW(dragOrigin.current.w + (e.clientX - dragOrigin.current.x));
    latestWidth.current = next;
    setWidth(next);
  };
  const onHandleUp = (e: React.PointerEvent) => {
    if (!dragOrigin.current) return;
    dragOrigin.current = null;
    setDragging(false);
    persistWidth(latestWidth.current);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
  };
  const onHandleKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = clampW(width + (e.key === 'ArrowRight' ? 16 : -16));
    latestWidth.current = next;
    setWidth(next);
    persistWidth(next);
  };

  return (
    <>
      {/* Backdrop — phones only (desktop pushes, no dim). */}
      <div
        aria-hidden
        onClick={onClose}
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      {/* Drawer: phone off-canvas overlay; desktop in-flow column that collapses to 0. */}
      <div
        ref={panelRef}
        role={isModal ? 'dialog' : undefined}
        aria-modal={isModal ? true : undefined}
        aria-label={open ? 'Navigation menu' : undefined}
        style={isDesktop ? { width: open ? width : 0, transition: dragging ? 'none' : undefined } : undefined}
        className={`z-50 flex flex-shrink-0 transition-all duration-300 ease-out
          fixed inset-y-0 left-0 ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:inset-auto lg:h-full lg:translate-x-0 lg:overflow-hidden`}
      >
        {isDesktop ? (
          <div className="relative flex h-full w-full min-w-0">
            {/* Force the engine's fixed-width <Sidebar> to fill the resizable column. */}
            <div className="h-full w-full min-w-0 overflow-hidden [&>*]:!w-full [&>*]:!min-w-0">
              {children}
            </div>
            {open && (
              <div
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize sidebar — drag, or focus and use the left / right arrow keys"
                aria-valuenow={width}
                aria-valuemin={MIN_W}
                aria-valuemax={MAX_W}
                tabIndex={0}
                onPointerDown={onHandleDown}
                onPointerMove={onHandleMove}
                onPointerUp={onHandleUp}
                onPointerCancel={onHandleUp}
                onKeyDown={onHandleKey}
                className="group absolute inset-y-0 right-0 z-30 flex w-3 cursor-col-resize touch-none items-center justify-center outline-none"
              >
                {/* Grab line */}
                <span className={`absolute inset-y-0 right-0 w-0.5 transition-colors ${dragging ? 'bg-sky-500/70' : 'bg-transparent group-hover:bg-sky-500/40 group-focus-visible:bg-sky-500/60'}`} />
                {/* ⟷ Grip chip */}
                <span className={`relative flex h-9 w-5 items-center justify-center rounded-md bg-slate-800 text-white shadow-md ring-1 ring-black/25 transition-opacity ${dragging ? 'opacity-100' : 'opacity-50 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
                  <ChevronsLeftRight size={13} />
                </span>
              </div>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
};

export const HamburgerButton: React.FC<{
  onClick: () => void;
  isDarkMode?: boolean;
  className?: string;
}> = ({ onClick, isDarkMode = true, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Toggle navigation"
    aria-haspopup="dialog"
    data-tour="module-nav"
    className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-colors active:scale-95 ${
      isDarkMode
        ? 'border-white/10 text-white/80 hover:bg-white/5'
        : 'border-black/10 text-slate-700 hover:bg-black/5'
    } ${className}`}
  >
    <Menu size={20} />
  </button>
);
