import { useGamificationStore } from '../stores/gamificationStore';
import { Heart, Zap, Shield, ShoppingBag } from 'lucide-react';
import { cn } from '../components/ui/button';

export const ShopPage = () => {
    const { hearts, maxHearts, spendGems, refillHearts } = useGamificationStore();

    const handleRefillHeart = () => {
        if (hearts >= maxHearts) return alert("Full health already!");
        if (spendGems(50)) {
            refillHearts();
            alert("Hearts Refilled!");
        } else {
            alert("Not enough gems!");
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-20">
            <h1 className="text-2xl font-bold font-heading text-neutral-700">Shop</h1>

            {/* Hero Banner */}
            <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-between px-8 text-white relative overflow-hidden">
                <div className="z-10">
                    <h2 className="text-2xl font-bold font-heading mb-2">Super VeriQuest</h2>
                    <p className="max-w-xs mb-6">Learn faster with unlimited hearts and no ads.</p>
                    <button className="bg-white text-blue-500 px-6 py-3 rounded-xl font-bold uppercase hover:bg-neutral-100 transition-colors">
                        Upgrade for $6.99
                    </button>
                </div>
                <Shield size={160} className="absolute -right-8 -bottom-8 opacity-20 rotate-12" />
            </div>

            {/* Power Ups Section */}
            <section>
                <h2 className="text-xl font-bold font-heading text-neutral-700 mb-4 border-b-2 border-neutral-200 pb-2">
                    Power-ups
                </h2>

                <div className="flex flex-col gap-4">
                    {/* Heart Refill */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-neutral-200 bg-white">
                        <Heart className="text-rose-500" size={48} fill="currentColor" />
                        <div className="flex-1">
                            <h3 className="font-bold text-neutral-700">Refill Hearts</h3>
                            <p className="text-neutral-500 text-sm">Get full health so you can worry less about making mistakes.</p>
                        </div>
                        <button
                            onClick={handleRefillHeart}
                            disabled={hearts === maxHearts}
                            className={cn(
                                "py-3 px-6 rounded-xl font-bold uppercase transition-all flex items-center gap-2",
                                hearts === maxHearts
                                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                                    : "bg-white border-2 border-neutral-200 text-blue-500 shadow-[0_2px_0_0_#e5e5e5] active:shadow-none active:translate-y-[2px]"
                            )}
                        >
                            {hearts === maxHearts ? "Full" : (
                                <>
                                    <Zap size={16} fill="currentColor" />
                                    <span>50</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Streak Freeze */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-neutral-200 bg-white">
                        <div className="relative">
                            <ShoppingBag className="text-blue-400" size={48} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold">❄️</div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-neutral-700">Streak Freeze</h3>
                            <p className="text-neutral-500 text-sm">Keep your streak alive for one additional day of inactivity.</p>
                        </div>
                        <button className="py-3 px-6 rounded-xl font-bold uppercase bg-white border-2 border-neutral-200 text-blue-500 shadow-[0_2px_0_0_#e5e5e5] active:shadow-none active:translate-y-[2px] transition-all flex items-center gap-2">
                            <Zap size={16} fill="currentColor" />
                            <span>200</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
