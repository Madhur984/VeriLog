import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets the window scroll to the top on every route change. React Router keeps
 * the previous page's scroll offset by default, so opening a new page (the
 * libraries, the silicon map, etc.) would otherwise land the viewer halfway down
 * the page. In-page anchor links (#section) are left alone so they still work.
 *
 * Course-module engines scroll their own inner container (the window stays at 0),
 * so resetting window scroll here is a harmless no-op for them.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default ScrollToTop;
