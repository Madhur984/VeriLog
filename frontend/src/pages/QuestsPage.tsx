import { useGamificationStore } from '../stores/gamificationStore';
import { Zap, CheckCircle } from 'lucide-react';

const QuestCard = ({ title, progress, total, reward, completed }: { title: string, progress: number, total: number, reward: number, completed: boolean }) => {
    const percentage = Math.min((progress / total) * 100, 100);

    return (
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-neutral-200 rounded-2xl bg-white">
            <div className="relative shrink-0">
                <Zap className={completed ? "text-yellow-400" : "text-neutral-300"} size={40} fill="currentColor" />
                {completed && <CheckCircle className="absolute -bottom-1 -right-1 text-green-500 bg-white rounded-full" size={18} />}
            </div>

            <div className="flex-1 flex flex-col gap-2 min-w-0">
                <div className="flex flex-wrap justify-between items-center gap-1">
                    <h3 className="font-bold text-neutral-700 text-sm sm:text-base">{title}</h3>
                    <div className="text-neutral-400 font-bold text-xs sm:text-sm bg-neutral-100 px-2 py-1 rounded-lg whitespace-nowrap">
                        Reward: {reward} XP
                    </div>
                </div>

                <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export const QuestsPage = () => {
    const { xp, streak } = useGamificationStore();

    return (
        <div className="flex flex-col gap-6 pb-20 pt-20">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-5 sm:p-8 text-white flex justify-between items-center shadow-[0_6px_0_0_#0369a1]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-heading mb-2">Daily Quests</h1>
                    <p className="text-sky-100 text-sm sm:text-base">Complete quests to earn gems and XP!</p>
                </div>
                <div className="text-4xl sm:text-6xl">🎯</div>
            </div>

            <div className="flex flex-col gap-4">
                <QuestCard
                    title="Earn 50 XP"
                    progress={xp.total}
                    total={50}
                    reward={10}
                    completed={xp.total >= 50}
                />
                <QuestCard
                    title="Extend your streak"
                    progress={streak.current}
                    total={streak.current + 1} // Mock logic: goal is always current + 1
                    reward={20}
                    completed={false}
                />
                <QuestCard
                    title="Complete 3 Lessons"
                    progress={1}
                    total={3}
                    reward={50}
                    completed={false}
                />
            </div>
        </div>
    );
};
