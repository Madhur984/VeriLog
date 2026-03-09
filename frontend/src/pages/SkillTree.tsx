import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import { SkillCanvas } from '../components/ui/SkillCanvas';
import { useGamificationStore } from '../stores/gamificationStore';

const T = {
    bg: '#060C1A', card: '#0D0F16', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    warning: '#F59E0B',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

export function SkillTree() {
    const navigate = useNavigate();
    const { xp } = useGamificationStore();

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: T.bg, color: T.text, fontFamily: T.sans }}>
            {/* Top bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px',
                borderBottom: `1px solid ${T.border}`, background: T.card,
                zIndex: 10,
            }}>
                <button onClick={() => navigate('/portal')} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ArrowLeft size={16} />
                    <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>DASHBOARD</span>
                </button>
                <div style={{ width: 1, height: 20, background: T.border }} />
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${T.accent}80` }}>
                    Engineering Curriculum Map
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={14} style={{ color: T.warning }} />
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.warning }}>{xp.total} XP</span>
                </div>
            </div>

            {/* Skill Canvas */}
            <div style={{ flex: 1, position: 'relative' }}>
                <SkillCanvas />
            </div>
        </div>
    );
}

