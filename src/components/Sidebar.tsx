import { Home, Trophy, Store, User, MoreHorizontal, BookOpen, LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../components/ui/button';

const SidebarItem = ({ icon: Icon, label, to }: { icon: LucideIcon, label: string, to: string }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-bold tracking-wide border-2 border-transparent hover:bg-neutral-200/30",
                isActive
                    ? "text-blue-400 border-blue-100 bg-blue-100/30"
                    : "text-neutral-500"
            )}
        >
            <Icon size={28} strokeWidth={2.5} />
            <span className="text-sm font-heading uppercase hidden xl:block">{label}</span>
        </NavLink>
    );
};

export const Sidebar = () => {
    return (
        <div className="flex flex-col h-full p-4 gap-4 bg-white border-r-2 border-neutral-200 w-[88px] xl:w-[256px] fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="px-4 py-2 mb-4">
                <h1 className="text-orange-500 font-heading font-extrabold text-2xl hidden xl:block tracking-tighter">veriquest</h1>
                <div className="xl:hidden w-10 h-10 bg-orange-500 rounded-lg" />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
                <SidebarItem icon={Home} label="Learn" to="/learn" />
                <SidebarItem icon={Trophy} label="Leaderboard" to="/leaderboard" />
                <SidebarItem icon={BookOpen} label="Quests" to="/quests" />
                <SidebarItem icon={Store} label="Shop" to="/shop" />
                <SidebarItem icon={User} label="Profile" to="/profile" />
                <SidebarItem icon={MoreHorizontal} label="More" to="/more" />
            </nav>
        </div>
    );
};
