
import { Outlet } from 'react-router-dom';

export const PortalLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            <main className="w-full h-full">
                <Outlet />
            </main>
        </div>
    );
};
