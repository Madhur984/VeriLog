import React from 'react';
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
 * Usage in an engine:
 *   const [navOpen, setNavOpen] = useState(false);
 *   ...
 *   <DrawerShell open={navOpen} onClose={() => setNavOpen(false)}>
 *     <Sidebar ... onChange={(i) => { setCurrent(i); setNavOpen(false); }} />
 *   </DrawerShell>
 *   ...
 *   <HamburgerButton isDarkMode={isDarkMode} onClick={() => setNavOpen(true)} />
 */

export const DrawerShell: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => (
  <>
    {/* Backdrop - phones only */}
    <div
      aria-hidden
      onClick={onClose}
      className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    />
    {/* Drawer: off-canvas on phones, static column at lg+ */}
    <div
      className={`fixed inset-y-0 left-0 z-50 flex flex-shrink-0 transition-transform duration-300 ease-out lg:static lg:z-auto lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {children}
    </div>
  </>
);

export const HamburgerButton: React.FC<{
  onClick: () => void;
  isDarkMode?: boolean;
  className?: string;
}> = ({ onClick, isDarkMode = true, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Open navigation"
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
