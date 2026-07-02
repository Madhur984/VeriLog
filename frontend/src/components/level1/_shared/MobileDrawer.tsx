import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';

/**
 * Shared mobile-nav primitives for the Level-1 module engines.
 *
 * Every module engine lays out as `flex h-screen` with a fixed-width sidebar
 * followed by a content column. On phones that sidebar eats the whole screen,
 * so we turn it into an off-canvas drawer:
 *
 *   - DrawerShell wraps the existing <Sidebar/> untouched. On phones it slides
 *     in from the left over a tap-to-dismiss backdrop; at lg+ it collapses back
 *     to a normal static flex column (identical to the old desktop layout).
 *   - HamburgerButton is the triple-line toggle. Drop it in the content header
 *     with `lg:hidden` so it only shows on phones.
 *
 * Accessibility: while open on phones the drawer is a real modal dialog —
 * role=dialog + aria-modal, Escape-to-close, focus trapped inside and restored
 * to the opener on close, body scroll locked. When off-canvas it is `inert` so
 * keyboard/screen-reader users can't land on hidden links. It also auto-closes
 * when the viewport grows to lg+ (so a drawer opened on a phone doesn't get
 * stuck "open" behind the now-static desktop sidebar).
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

  // Track the lg breakpoint; auto-close the drawer when we cross into desktop.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(LG_QUERY);
    const onChange = () => {
      setIsDesktop(mq.matches);
      if (mq.matches && open) onClose();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open, onClose]);

  const isModal = open && !isDesktop;

  // Take the off-canvas panel out of tab/AT order on phones while it's closed.
  useEffect(() => {
    const panel = panelRef.current;
    if (panel) panel.inert = !isDesktop && !open;
  }, [isDesktop, open]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!isModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isModal]);

  // Focus management + Escape + focus trap while modal.
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
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // Restore focus to whatever opened the drawer (the hamburger).
      restoreFocusRef.current?.focus?.();
    };
  }, [isModal, onClose]);

  return (
    <>
      {/* Backdrop - phones only */}
      <div
        aria-hidden
        onClick={onClose}
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      {/* Drawer: off-canvas on phones, static column at lg+ */}
      <div
        ref={panelRef}
        role={isModal ? 'dialog' : undefined}
        aria-modal={isModal ? true : undefined}
        aria-label={isModal ? 'Navigation menu' : undefined}
        className={`fixed inset-y-0 left-0 z-50 flex flex-shrink-0 transition-transform duration-300 ease-out lg:static lg:z-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
    aria-label="Open navigation"
    aria-haspopup="dialog"
    data-tour="module-nav"
    className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border transition-colors active:scale-95 ${
      isDarkMode
        ? 'border-white/10 text-white/80 hover:bg-white/5'
        : 'border-black/10 text-slate-700 hover:bg-black/5'
    } ${className}`}
  >
    <Menu size={20} />
  </button>
);
