import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export const PortalLayout = () => {
    return (
        <div className="w-full min-h-screen relative" style={{ background: 'transparent' }}>
            <div className="fixed top-4 right-4 z-[400]">
                <ThemeToggle />
            </div>
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
};
