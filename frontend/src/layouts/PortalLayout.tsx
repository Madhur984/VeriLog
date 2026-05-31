import { Outlet } from 'react-router-dom';

export const PortalLayout = () => {
    return (
        <div className="w-full min-h-screen relative" style={{ background: 'transparent' }}>
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
};
