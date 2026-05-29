import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import { SkillCanvas } from '../components/ui/SkillCanvas';
import { useGamificationStore } from '../stores/gamificationStore';

const T = {
    bg: '#F8FAFC', card: '#FFFFFF', border: '#E2E8F0',
    text: '#0F172A', muted: '#64748B', accent: '#0284C7',
    warning: '#D97706',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;


export function SkillTree() {
    const navigate = useNavigate();
    const { xp } = useGamificationStore();

    return (
        /* Root: min-h on mobile allows scroll; flex column fills desktop viewport */
        <div
            className="flex flex-col min-h-[100svh] overflow-x-hidden"
            style={{ background: T.bg, color: T.text, fontFamily: T.sans }}
        >
            {/* Top bar */}
            <div
                className="flex items-center gap-3 px-4 lg:px-6 py-3 shrink-0"
                style={{ borderBottom: `1px solid ${T.border}`, background: T.card, zIndex: 10 }}
            >
                <button
                    onClick={() => navigate('/portal')}
                    className="flex items-center gap-1.5 min-h-[40px] min-w-[40px]"
                    style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer' }}
                >
                    <ArrowLeft size={16} />
                    <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>DASHBOARD</span>
                </button>
                <div className="hidden sm:block" style={{ width: 1, height: 20, background: T.border }} />
                <span
                    className="hidden sm:inline truncate"
                    style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${T.accent}80` }}
                >
                    Engineering Curriculum Map
                </span>
                <div className="ml-auto flex items-center gap-2 shrink-0">
                    <Zap size={14} style={{ color: T.warning }} />
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.warning }}>{xp.total} XP</span>
                </div>
            </div>

            {/* Skill Canvas - grows to fill remaining height; on mobile the canvas itself must handle its own scroll/sizing */}
            <div className="flex-1 relative min-h-[500px] overflow-auto">
                <SkillCanvas />
            </div>
        </div>
    );
}

