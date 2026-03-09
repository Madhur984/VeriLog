import { useGamificationStore } from '../stores/gamificationStore';
import { Heart, Zap, Flame, Shield, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatItem = ({ icon: Icon, value, color }: { icon: LucideIcon, value: number | string, color: string }) => (
    <div className="flex items-center gap-2 font-bold text-neutral-500 hover:bg-neutral-100 px-3 py-2 rounded-xl transition-colors cursor-pointer">
        <Icon className={color} strokeWidth={2.5} size={22} />
        <span>{value}</span>
    </div>
);

export const RightSidebar = () => {
    const { hearts, gems, streak } = useGamificationStore();

    return (
        <div className="hidden lg:flex flex-col gap-8 w-[368px] p-6 sticky top-0 h-screen overflow-y-auto">
            {/* Stats Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <div className="w-8 h-6 bg-blue-400 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">EN</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <StatItem icon={Flame} value={streak.current} color="text-orange-500" />
                    <StatItem icon={Zap} value={gems} color="text-blue-400" />
                    <StatItem icon={Heart} value={hearts} color="text-rose-500" />
                </div>
            </div>

            {/* Try Super Box */}
            <div className="border-2 border-neutral-200 rounded-2xl p-4 flex flex-col gap-4">
                <h3 className="font-heading font-bold text-lg text-neutral-700">Unlock Super VeriQuest</h3>
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Shield className="text-white" size={40} fill="currentColor" />
                    </div>
                    <p className="text-sm text-neutral-500 font-medium">Unlimited hearts and no ads!</p>
                </div>
                <button className="w-full py-3 rounded-xl font-bold uppercase tracking-wide bg-gradient-to-b from-indigo-500 to-purple-600 text-white shadow-[0_4px_0_0_#4c1d95] active:translate-y-[2px] active:shadow-none transition-all">
                    Try Super Free
                </button>
            </div>

            {/* Daily Quests Preview */}
            <div className="border-2 border-neutral-200 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading font-bold text-lg text-neutral-700">Daily Quests</h3>
                    <Link to="/quests" className="text-blue-400 font-bold uppercase text-xs hover:text-blue-500">View all</Link>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Zap className="text-orange-500" size={32} />
                        <div className="flex-1">
                            <p className="font-bold text-neutral-700 text-sm">Earn 50 XP</p>
                            <div className="h-2.5 w-full bg-neutral-200 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-orange-500 w-3/4 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-300 font-medium text-center justify-center">
                <span>ABOUT</span>
                <span>BLOG</span>
                <span>STORE</span>
                <span>CAREERS</span>
                <span>TERMS</span>
                <span>PRIVACY</span>
            </div>
        </div>
    );
};
