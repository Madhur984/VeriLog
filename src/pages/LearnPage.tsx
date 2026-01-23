import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Lock, Check } from 'lucide-react';
import { cn } from '../components/ui/button';
import { CircuitBoardBackground } from '../components/backgrounds/CircuitBoard';
import { SpaceshipLoader } from '../components/loaders/SpaceshipLoader';

interface LevelNodeProps {
    id: number;
    status: 'locked' | 'active' | 'completed';
    position: number;
    onLevelClick: (id: number) => void;
}

const LevelNode = ({ id, status, position, onLevelClick }: LevelNodeProps) => {
    const translateX = position * 60;

    return (
        <div
            className="relative flex justify-center mb-8"
            style={{ transform: `translateX(${translateX}px)` }}
        >
            <button
                onClick={() => status !== 'locked' && onLevelClick(id)}
                className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center relative transition-transform active:scale-95 border-4",
                    status === 'active'
                        ? "bg-orange-500 shadow-[0_6px_0_0_#cc7700] border-orange-600 animate-pulse"
                        : status === 'completed'
                            ? "bg-green-500 shadow-[0_6px_0_0_#22c55e] border-green-600"
                            : "bg-neutral-200 shadow-[0_6px_0_0_#d7d7d7] cursor-not-allowed border-neutral-300"
                )}
            >
                {status === 'locked' ? (
                    <Lock className="text-neutral-400" size={32} />
                ) : status === 'completed' ? (
                    <Check className="text-white" size={40} strokeWidth={4} />
                ) : (
                    <Star className="text-white fill-current" size={40} />
                )}

                {status === 'active' && (
                    <div className="absolute -top-16 bg-white border-2 border-neutral-200 px-4 py-2 rounded-xl animate-bounce shadow-lg">
                        <span className="text-orange-500 font-bold font-heading uppercase tracking-wider">Start</span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-white border-b-2 border-r-2 border-neutral-200 rotate-45" />
                    </div>
                )}
            </button>
        </div>
    );
};

export const LearnPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLevelClick = (id: number) => {
        setLoading(true);
        setTimeout(() => {
            navigate(`/lesson/${id}`);
        }, 1500);
    };

    if (loading) {
        return <SpaceshipLoader />;
    }

    return (
        <div className="relative min-h-screen">
            {/* Circuit Board Background */}
            <CircuitBoardBackground opacity={0.08} />

            <div className="flex flex-col gap-8 max-w-[600px] mx-auto pb-24 relative z-10">
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur z-10 py-4 border-b-2 border-neutral-200 mb-8 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <div className="w-8 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm shadow-md" />
                            <span className="font-bold text-neutral-700 uppercase tracking-widest text-sm">Logic Course</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-orange-500 text-lg">🔥 0</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-400 text-lg">💎 500</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unit 1 */}
                <div className="flex flex-col">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl mb-12 flex justify-between items-center shadow-[0_6px_0_0_#cc7700] border-2 border-orange-600">
                        <div>
                            <h2 className="font-heading font-extrabold text-2xl">Unit 1</h2>
                            <p className="text-orange-100 text-lg">Intro to Digital Logic</p>
                        </div>
                        <div className="text-4xl">⚡</div>
                    </div>

                    {/* SVG for wired connections */}
                    <svg className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[800px] pointer-events-none" style={{ top: '200px' }}>
                        <defs>
                            <linearGradient id="copper-wire" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#d4af37" />
                                <stop offset="50%" stopColor="#ffd700" />
                                <stop offset="100%" stopColor="#d4af37" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Wire from Level 1 to Level 2 */}
                        <path
                            d="M 300,80 L 240,180"
                            stroke="url(#copper-wire)"
                            strokeWidth="6"
                            fill="none"
                            filter="url(#glow)"
                            className="animate-pulse"
                        />
                        {/* Solder joints */}
                        <circle cx="300" cy="80" r="8" fill="#d4af37" filter="url(#glow)" />
                        <circle cx="240" cy="180" r="8" fill="#d4af37" filter="url(#glow)" />

                        {/* Wire from Level 2 to Level 3 */}
                        <path
                            d="M 240,260 L 360,360"
                            stroke="#94a3b8"
                            strokeWidth="6"
                            fill="none"
                            opacity="0.3"
                        />
                        <circle cx="240" cy="260" r="8" fill="#94a3b8" opacity="0.3" />
                        <circle cx="360" cy="360" r="8" fill="#94a3b8" opacity="0.3" />

                        {/* Wire from Level 3 to Level 4 */}
                        <path
                            d="M 360,440 L 300,540"
                            stroke="#94a3b8"
                            strokeWidth="6"
                            fill="none"
                            opacity="0.3"
                        />
                        <circle cx="360" cy="440" r="8" fill="#94a3b8" opacity="0.3" />
                        <circle cx="300" cy="540" r="8" fill="#94a3b8" opacity="0.3" />
                    </svg>

                    <div className="flex flex-col items-center relative z-20">
                        <LevelNode id={1} status="active" position={0} onLevelClick={handleLevelClick} />
                        <LevelNode id={2} status="locked" position={-1} onLevelClick={handleLevelClick} />
                        <LevelNode id={3} status="locked" position={1} onLevelClick={handleLevelClick} />
                        <LevelNode id={4} status="locked" position={0} onLevelClick={handleLevelClick} />

                        <div className="w-24 h-24 my-8 opacity-50 grayscale">
                            <div className="text-6xl text-center">🎯</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
