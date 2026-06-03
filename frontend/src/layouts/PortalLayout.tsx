import { Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export const PortalLayout = () => {
    const location = useLocation();
    const isSpecialPage = location.pathname === '/career-roadmap';

    return (
        <div className="w-full min-h-screen relative" style={{ background: 'transparent' }}>
            {/* Persistent theme toggle — top-left on all portal pages, except ones with integrated toggles */}
            {!isSpecialPage && (
                <div className="fixed top-4 left-4 z-[400]">
                    <ThemeToggle />
                </div>
            )}
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
};
