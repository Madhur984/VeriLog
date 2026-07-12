import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';

/**
 * Cookie-consent banner backed by Google Consent Mode v2. Analytics default to
 * "denied" (set in index.html) before gtag loads, so no analytics cookies fire
 * until the visitor accepts here. The choice is stored so the banner shows once.
 *
 * Accept  -> consent update analytics_storage: 'granted'
 * Decline -> stays denied (recorded so we don't ask again)
 */

const KEY = 'bfb_consent'; // 'granted' | 'denied' — contact: info@bitforbytes.in

type Gtag = (...args: unknown[]) => void;
function gtag(...args: unknown[]): void {
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof g === 'function') g(...args);
}

function applyConsent(granted: boolean): void {
  gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  });
}

function readChoice(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export const ConsentBanner = () => {
  const [scheme] = useColorScheme();
  const dark = scheme === 'dark';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === 'granted') { applyConsent(true); return; }
    if (choice === 'denied') { applyConsent(false); return; }
    // No decision yet — show the banner (deferred a beat so it doesn't fight first paint).
    const t = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  const decide = (granted: boolean) => {
    try { localStorage.setItem(KEY, granted ? 'granted' : 'denied'); } catch { /* private mode */ }
    applyConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  const card = dark
    ? 'border-[#4A3D7A] bg-[#151030] text-white shadow-[6px_6px_0_#7A3FD0]'
    : 'border-[#1B1436] bg-white text-[#1B1436] shadow-[6px_6px_0_#1B1436]';
  const sub = dark ? 'text-[#B9AEDA]' : 'text-[#4A4560]';

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-2xl sm:inset-x-auto sm:left-4 sm:right-auto"
    >
      <div className={`rounded-2xl border-[2.5px] ${card} p-4 sm:p-5`}>
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl border-[2px] border-current" style={{ color: '#7A3FD0' }}>
            <Cookie size={17} />
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-bold leading-snug">We use cookies for analytics</p>
            <p className={`mt-1 text-[12.5px] leading-relaxed ${sub}`}>
              We use Google Analytics to understand how the site is used and improve it. No analytics cookies are set unless you accept. See our{' '}
              <Link to="/privacy" className="font-semibold underline underline-offset-2" style={{ color: '#7A3FD0' }}>Privacy Policy</Link>.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => decide(true)}
                className="rounded-xl border-[2.5px] border-[#1B1436] bg-[#7A3FD0] px-4 py-2 text-[13px] font-bold text-white shadow-[3px_3px_0_#1B1436] transition-transform hover:-translate-y-[1px] active:translate-y-[1px] dark:border-[#4A3D7A] dark:shadow-[3px_3px_0_#4A3D7A]"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => decide(false)}
                className={`rounded-xl border-[2.5px] px-4 py-2 text-[13px] font-bold transition-colors ${dark ? 'border-white/25 text-white hover:bg-white/[0.06]' : 'border-[#1B1436]/25 text-[#1B1436] hover:bg-[#F1ECFF]'}`}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
