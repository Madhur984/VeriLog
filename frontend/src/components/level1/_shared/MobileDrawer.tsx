import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';

/**
 * Shared collapsible nav drawer for the Level-1 module engines.
 *
 *   - DESKTOP (lg+): the sidebar is an in-flow column that PUSHES the lesson
 *     content. Open → it takes its 320px and the content shrinks beside it;
 *     closed → it collapses to 0 width and the content fills the screen. No dim
 *     overlay — both panes stay visible and interactive.
 *   - PHONES (< lg): there isn't room to push, so it stays an off-canvas overlay
 *     that slides in over a tap-to-dismiss backdrop (a real modal dialog).
 *
 * Toggle it open with <HamburgerButton/> (triple-line, in the content header);
 * close it with the ✕ in the drawer, by picking a chapter, Escape, or (on phones)
 * the backdrop. Closed → the panel is `inert` so hidden links aren't tabbable.
 */

const LG_QUERY = '(min-width: 1024px)';

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
        className={`z-50 flex flex-shrink-0 transition-all duration-300 ease-out
          fixed inset-y-0 left-0 ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:inset-auto lg:h-full lg:translate-x-0 lg:overflow-hidden ${
            open ? 'lg:w-[320px]' : 'lg:w-0'
          }`}
      >
        {children}
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
