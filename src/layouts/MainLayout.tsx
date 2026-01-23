
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { RightSidebar } from '../components/RightSidebar';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-[88px] xl:w-[256px]">
                <Sidebar />
            </div>

            {/* Mobile Sidebar (Bottom Bar) Placeholder - for now just hide on mobile or stack */}
            {/* In a real app we'd have a BottomNav component for mobile */}

            <main className="flex-1 flex justify-center">
                <div className="w-full max-w-[1056px] px-4 md:px-8 py-6">
                    <Outlet />
                </div>
            </main>

            {/* Right Sidebar (Stats & Promo) */}
            <div className="hidden lg:block relative text-neutral-500">
                <RightSidebar />
            </div>
        </div>
    );
};
