
import { Outlet } from 'react-router-dom';

export const PortalLayout = () => {
    return (
        <div className="w-full bg-[#07080A]">
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
};
