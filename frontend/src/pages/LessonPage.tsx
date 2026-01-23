import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Heart } from 'lucide-react';
import { Activity1 } from '../activities/Activity1';
import { Activity2 } from '../activities/Activity2';
import { Activity3 } from '../activities/Activity3';
import { Activity4 } from '../activities/Activity4';

export const LessonPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [progress] = useState(0);
    const [hearts] = useState(5);

    // This is where we interpret the "Level ID" to show a specific activity
    // In a real app, this would fetch lesson data
    const renderActivity = () => {
        const next = () => {
            // Placeholder: just go back to learn path 
            navigate('/learn');
        };

        switch (id) {
            case '1': return <Activity1 onNext={next} />;
            case '2': return <Activity2 onNext={next} />;
            case '3': return <Activity3 onNext={next} />;
            case '4': return <Activity4 onNext={next} />;
            default: return <div>Lesson not found</div>;
        }
    };

    return (
        <div className="h-screen w-screen bg-white flex flex-col">
            {/* Top Bar */}
            <div className="h-20 flex items-center justify-between px-8 max-w-5xl mx-auto w-full">
                <button onClick={() => navigate('/learn')} className="text-neutral-300 hover:text-neutral-400">
                    <X size={32} />
                </button>

                {/* Progress Bar */}
                <div className="flex-1 mx-8 h-4 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Hearts */}
                <div className="flex items-center gap-2 text-rose-500 font-bold text-xl">
                    <Heart fill="#ff4b4b" /> {hearts}
                </div>
            </div>

            {/* Lesson Content (The Activity) */}
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                {renderActivity()}
            </div>

            {/* Bottom Bar (Check Button) - This usually overlays or sits at bottom */}
            {/* Note: The Activities currently have their own "Next" buttons. 
                We should eventually move that logic here to the shell. */}
        </div>
    );
};
