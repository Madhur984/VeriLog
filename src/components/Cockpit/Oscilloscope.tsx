import { Activity } from 'lucide-react';
import { DroneMascot } from '../Gamification/DroneMascot';

export const Oscilloscope = () => {
    return (
        <aside className="w-[30%] min-w-[300px] bg-panel border border-panel-border rounded-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-10 border-b border-panel-border flex items-center px-4 bg-void/30">
                <Activity size={16} className="text-signal-cyan mr-2" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-dim">Oscilloscope</span>
            </div>

            {/* Visualizer Area */}
            <div className="flex-1 bg-black relative overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        opacity: 0.2
                    }}>
                </div>

                {/* Signal Placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-terminal-green/50 font-mono text-xs animate-pulse">AWAITING INPUT SIGNAL...</div>
                </div>

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-terminal-green/5 to-transparent h-[100px] w-full animate-scanline pointer-events-none"></div>
            </div>

            {/* Mini Console/Drone Area */}
            <div className="h-32 border-t border-panel-border bg-void/50 p-4 relative">
                <DroneMascot status="idle" message="System ready. Waiting for synthesis..." />
            </div>
        </aside>
    );
};
