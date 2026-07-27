import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Menu, X, Home, Cpu, Map, BookOpen, Boxes, Wrench, User, ClipboardList, Grid3x3 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useColorScheme } from '../hooks/useColorScheme';
import { getRouteMeta } from '../lib/routeMeta';

// Course-module routes that ship their own drawer nav + get a "back to portal" control.
const MODULE_ROUTE = /^\/(module|dsd|basic-electronics|sandbox)(\/|$)/;

// Primary jump-to destinations for the nav menu, grouped so the menu reads as
// clear sections (Learn / Practice / Account) rather than one long list.
const NAV_GROUPS: { heading: string; links: { to: string; label: string; icon: typeof Home }[] }[] = [
    {
        heading: 'Learn',
        links: [
            { to: '/portal', label: 'Course Portal', icon: Home },
            { to: '/career-roadmap', label: 'Career Roadmap', icon: Map },
            { to: '/analogies', label: 'Analogy Library', icon: BookOpen },
            { to: '/verilog-library', label: 'Verilog Library', icon: Boxes },
        ],
    },
    {
        heading: 'Practice',
        links: [
            { to: '/verilog-playground', label: 'Verilog Judge', icon: Cpu },
            { to: '/interview-prep', label: 'Interview Prep', icon: ClipboardList },
            { to: '/workbench', label: 'Circuit Workbench', icon: Wrench },
            { to: '/kmap-lab', label: 'K-Map Lab', icon: Grid3x3 },
        ],
    },
    {
        heading: 'Account',
        links: [
            { to: '/profile', label: 'Profile', icon: User },
        ],
    },
];

export const PortalLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [scheme] = useColorScheme();
    const isLight = scheme === 'light';

    const [menuOpen, setMenuOpen] = useState(false);
    const clusterRef = useRef<HTMLDivElement>(null);

    const isSpecialPage = location.pathname === '/career-roadmap';
    const isModule = MODULE_ROUTE.test(location.pathname);
    // Pages whose own UI already ships a header/theme toggle (portal hub, Verilog bench)
    // so the floating nav cluster would duplicate or overlap their controls.
    const hasIntegratedToggle = location.pathname === '/portal'
        || location.pathname === '/verilog-playground';
    const showNav = !isSpecialPage && !isModule && !hasIntegratedToggle;
    const crumb = getRouteMeta(location.pathname);

    // Close the menu on navigation.
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    // Close on Escape or outside click.
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
        const onDown = (e: MouseEvent) => {
            if (clusterRef.current && !clusterRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        window.addEventListener('mousedown', onDown);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('mousedown', onDown);
        };
    }, [menuOpen]);

    return (
        <div className="w-full min-h-screen relative" style={{ background: 'transparent' }}>
            {/* Persistent nav cluster — top-left on browse/tool pages. Course modules ship
                their own drawer + back button, and the portal hub / Verilog bench have their
                own headers, so the cluster is hidden there to avoid duplicates/overlap. */}
            {showNav && (
                <nav aria-label="Primary" ref={clusterRef} className="fixed top-4 left-4 z-[400] flex items-center gap-2">
                    <button
                        onClick={() => navigate('/portal')}
                        aria-label="Go to portal"
                        className="brutal-btn inline-flex h-10 items-center gap-2 bg-bg-elev px-3 text-[13px] font-bold text-text-main"
                    >
                        <Home size={16} /> <span className="hidden sm:inline">Portal</span>
                    </button>

                    {/* Breadcrumb — Portal (button, above) > [section >] current page */}
                    {crumb.label && crumb.label !== 'Portal' && (
                        <div className="brutal hidden h-10 items-center gap-1.5 bg-bg-elev px-3 text-[12px] md:flex">
                            {crumb.section && (
                                <>
                                    <span className="text-text-dim">{crumb.section}</span>
                                    <span className="text-text-dim">/</span>
                                </>
                            )}
                            <span className="font-bold text-text-main" aria-current="page">{crumb.label}</span>
                        </div>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Open navigation menu"
                            aria-expanded={menuOpen}
                            className="brutal-btn inline-flex h-10 items-center gap-2 bg-bg-elev px-3 text-[13px] font-bold text-text-main"
                        >
                            {menuOpen ? <X size={16} /> : <Menu size={16} />}
                            <span className="hidden sm:inline">Menu</span>
                        </button>

                        {menuOpen && (
                            <div className="brutal absolute left-0 top-12 w-64 bg-bg-elev p-1.5">
                                {NAV_GROUPS.map((group, gi) => (
                                    <div key={group.heading} className={gi > 0 ? 'mt-1 border-t border-border-soft pt-1' : ''}>
                                        <p className="px-3 pb-1 pt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-text-dim">
                                            {group.heading}
                                        </p>
                                        {group.links.map(({ to, label, icon: Icon }) => {
                                            const active = location.pathname === to;
                                            return (
                                                <button
                                                    key={to}
                                                    onClick={() => { navigate(to); setMenuOpen(false); }}
                                                    aria-current={active ? 'page' : undefined}
                                                    className={`flex w-full items-center gap-2.5 rounded px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                                                        active
                                                            ? 'text-signal-core'
                                                            : 'text-text-sub hover:bg-border-soft hover:text-text-main'
                                                    }`}
                                                >
                                                    <Icon size={15} /> {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <ThemeToggle />
                </nav>
            )}

            {/* Back to portal — shown on every course module so you can always get home. */}
            {isModule && (
                <button
                    onClick={() => navigate('/portal')}
                    aria-label="Back to portal"
                    className="group fixed top-4 right-4 z-[410] inline-flex h-10 items-center gap-2 rounded-md border-2 px-3 lg:px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                        // Translucent surface so it sits on ANY module background
                        // (each module tints its dark bg differently) instead of
                        // fighting it with its own color.
                        background: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                        color: isLight ? '#1B1436' : '#E2E8F0',
                        borderColor: isLight ? '#1B1436' : 'rgba(255,255,255,0.22)',
                        boxShadow: isLight ? '4px 4px 0 0 #1B1436' : '4px 4px 0 0 rgba(0,0,0,0.5)',
                    }}
                >
                    <ArrowLeft size={15} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
                    <span className="hidden lg:inline">Portal</span>
                </button>
            )}

            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
};
