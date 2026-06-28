import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useColorScheme } from '../hooks/useColorScheme';

// Course-module routes that should show a quick "back to portal" control.
const MODULE_ROUTE = /^\/(module|dsd|basic-electronics|sandbox)(\/|$)/;

export const PortalLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [scheme] = useColorScheme();
    const isLight = scheme === 'light';

    const isSpecialPage = location.pathname === '/career-roadmap';
    const isModule = MODULE_ROUTE.test(location.pathname);
    // Pages whose own UI already ships a theme toggle (so the floating one would duplicate it
    // or, worse, overlap their own header controls like the Verilog bench's back button).
    const hasIntegratedToggle = location.pathname === '/portal'
        || location.pathname === '/verilog-playground';

    return (
        <div className="w-full min-h-screen relative" style={{ background: 'transparent' }}>
            {/* Persistent theme toggle - top-left on portal pages. Course modules ship their own
                dark/light toggle inside the drawer sidebar, so this floating one is hidden on every
                module route to avoid a duplicate (and the overlap with the sidebar header). */}
            {!isSpecialPage && !isModule && !hasIntegratedToggle && (
                <div className="fixed top-4 left-4 z-[400]">
                    <ThemeToggle />
                </div>
            )}

            {/* Back to portal — shown on every course module so you can always get home */}
            {isModule && (
                <button
                    onClick={() => navigate('/portal')}
                    aria-label="Back to portal"
                    className="fixed top-4 right-4 z-[410] inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold backdrop-blur-md transition-colors"
                    style={{
                        background: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(7,12,22,0.85)',
                        border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(59,130,246,0.35)',
                        color: isLight ? '#0F172A' : '#DBEAFE',
                        boxShadow: isLight
                            ? '0 8px 22px rgba(15,23,42,0.12)'
                            : '0 8px 22px rgba(0,0,0,0.5), 0 0 16px rgba(59,130,246,0.15)',
                    }}
                >
                    <ArrowLeft size={16} /> Portal
                </button>
            )}

            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
};
