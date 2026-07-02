import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * Branded 404. Replaces the old silent redirect-to-home so a mistyped or dead
 * URL explains itself and always offers a clear way back. Token-based, so it
 * adapts to light/dark automatically, and uses the neo-brutalist system.
 */
export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-[100svh] w-full flex items-center justify-center px-6 bg-bg-void text-text-main">
            <div className="w-full max-w-md text-center flex flex-col items-center gap-7">
                <div className="brutal bg-bg-elev px-7 py-4">
                    <span className="font-mono text-6xl font-black tracking-tight text-signal-core">404</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-lg font-black uppercase tracking-[0.15em]">Dead trace</h1>
                    <p className="text-sm text-text-sub leading-relaxed">
                        This route isn't wired to anything, so the signal goes nowhere. Let's get you back on a live net.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={() => navigate('/portal')}
                        className="brutal-btn bg-signal-core text-bg-void px-5 py-2.5 inline-flex items-center gap-2 text-sm"
                    >
                        <ArrowLeft size={16} /> Back to Portal
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="brutal-btn bg-bg-elev text-text-main px-5 py-2.5 inline-flex items-center gap-2 text-sm"
                    >
                        <Home size={16} /> Home
                    </button>
                </div>
            </div>
        </main>
    );
};
