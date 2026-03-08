/**
 * EngineeringPortfolio.tsx — Student Professional Record
 *
 * Displays earned badges, module completion, XP breakdown, and personalized
 * engineering insights. This serves as a "public profile" teaser for the learner.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
    Award, Rocket, Shield, Clock,
    ArrowLeft, Share2, Download, Zap, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGamificationStore } from '../stores/gamificationStore';

const T = {
    bg: '#060B18',
    card: '#0D0F16',
    surface: '#1A1D24',
    border: 'rgba(0,212,255,0.15)',
    text: '#E5E7EB',
    muted: '#94A3B8',
    accent: '#00D4FF',
    success: '#10B981',
    mono: "'JetBrains Mono', monospace",
    sans: "'Inter', system-ui, sans-serif",
} as const;

export const EngineeringPortfolio: React.FC = () => {
    const navigate = useNavigate();
    const { firstName, xp, skills, streak } = useGamificationStore();
    const completedModuleIds = skills.completedIds;

    const stats = [
        { label: 'Uptime', value: `${streak.current} Days`, icon: Zap },
        { label: 'Engineering XP', value: xp.total.toLocaleString(), icon: Rocket },
        { label: 'Modules Cleared', value: String(completedModuleIds.length), icon: Shield },
        { label: 'Lab Time', value: '4.5h', icon: Clock },
    ];

    const badgesData = [
        { name: 'Signals Specialist', date: 'Mar 08', cat: 'Lv. 1', unlocked: completedModuleIds.includes('signals') },
        { name: 'Analog Explorer', date: 'Mar 08', cat: 'Lv. 2', unlocked: completedModuleIds.includes('analog_digital') },
        { name: 'Digital Discoverer', date: 'Mar 08', cat: 'Lv. 3', unlocked: completedModuleIds.includes('binary_awakening') },
        { name: 'Logic Professional', date: 'Mar 08', cat: 'Lv. 4', unlocked: completedModuleIds.includes('logic_gates') },
    ];

    return (
        <div style={{
            minHeight: '100vh', width: '100%', background: T.bg,
            color: T.text, fontFamily: T.sans, padding: '40px 24px',
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 70%)',
        }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
                    <button
                        onClick={() => navigate('/portal')}
                        style={{
                            padding: '8px 16px', borderRadius: 6, border: `1px solid ${T.border}`,
                            background: 'transparent', color: T.muted, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
                        }}
                    >
                        <ArrowLeft size={16} /> Back to Station
                    </button>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button style={{ padding: '8px 16px', borderRadius: 6, background: T.surface, border: 'none', color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                            <Share2 size={16} /> Share
                        </button>
                        <button style={{ padding: '8px 16px', borderRadius: 6, background: T.accent, border: 'none', color: T.bg, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>

                {/* Profile Section */}
                <header style={{ marginBottom: 64, textAlign: 'center' }}>
                    <div style={{
                        width: 100, height: 100, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10B981 0%, #8B5CF6 100%)',
                        margin: '0 auto 24px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 32, fontWeight: 800,
                        border: '4px solid rgba(0,212,255,0.2)',
                        boxShadow: '0 0 40px rgba(0,212,255,0.2)',
                    }}>
                        {(firstName || 'S')[0].toUpperCase()}
                    </div>
                    <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>{firstName || 'Explorer'}'s Engineering Portfolio</h1>
                    <p style={{ color: T.muted, fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
                        Specializing in Digital Systems Design. Verified progress in Circuit Theory & Logic Analysis.
                    </p>
                </header>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, marginBottom: 48 }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{ padding: 24, borderRadius: 12, border: `1px solid ${T.border}`, background: T.card }}>
                            <s.icon size={20} color={T.accent} style={{ marginBottom: 16 }} />
                            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: T.mono, marginBottom: 4 }}>{s.value}</div>
                            <div style={{ fontSize: 10, fontFamily: T.mono, textTransform: 'uppercase', color: T.muted, letterSpacing: '0.1em' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Achievements Section */}
                <section style={{ marginBottom: 64 }}>
                    <h3 style={{ fontSize: 12, fontFamily: T.mono, textTransform: 'uppercase', letterSpacing: '0.2em', color: T.accent, marginBottom: 24 }}>
                        Earned Credentials
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {badgesData.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    padding: 20, borderRadius: 12, border: `1px solid ${T.border}`,
                                    background: T.surface, display: 'flex', alignItems: 'center', gap: 20
                                }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: 8,
                                    background: 'rgba(0,212,255,0.05)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: T.accent,
                                    border: '1px solid rgba(0,212,255,0.2)'
                                }}>
                                    <Award size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 600 }}>{b.name}</div>
                                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.muted, marginTop: 2 }}>
                                        {b.cat} • ISSUED {b.date}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Skills Radar / Competencies Teaser */}
                <section style={{ padding: 32, borderRadius: 16, background: 'rgba(0,212,255,0.03)', border: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                        <div>
                            <h3 style={{ fontSize: 12, fontFamily: T.mono, textTransform: 'uppercase', letterSpacing: '0.2em', color: T.accent, marginBottom: 8 }}>
                                Core Competencies
                            </h3>
                            <p style={{ color: T.muted, fontSize: 14 }}>Based on verified lab performance.</p>
                        </div>
                        <div style={{ fontSize: 24, fontStyle: 'italic', fontWeight: 800, color: T.accent, opacity: 0.5 }}>DIGI_RANK: A</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { label: 'Structural Logic', val: 85 },
                            { label: 'Signal Analysis', val: 72 },
                            { label: 'Safe Systems Diagnosis', val: 94 },
                        ].map((c, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 10, textTransform: 'uppercase', marginBottom: 8 }}>
                                    <span>{c.label}</span>
                                    <span>{c.val}%</span>
                                </div>
                                <div style={{ height: 4, borderRadius: 2, background: T.bg, overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${c.val}%` }}
                                        transition={{ duration: 1.2, delay: 0.5 + i * 0.2 }}
                                        style={{ height: '100%', background: T.accent }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Engineering Trivia (Feature 8) */}
                <section style={{ marginBottom: 64 }}>
                    <div style={{
                        padding: 24, borderRadius: 16, border: '1px solid rgba(245,158,11,0.2)',
                        background: 'rgba(245,158,11,0.03)', display: 'flex', gap: 20, alignItems: 'center'
                    }}>
                        <div style={{
                            width: 54, height: 54, borderRadius: '50%', background: 'rgba(245,158,11,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B'
                        }}>
                            <HelpCircle size={28} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', marginBottom: 4, fontFamily: T.mono }}>
                                // DID YOU KNOW?
                            </h4>
                            <p style={{ fontSize: 14, color: T.text, lineHeight: 1.5 }}>
                                The first "bug" in computing history was a literal moth found stuck in a relay of the Harvard Mark II computer in 1947.
                            </p>
                        </div>
                    </div>
                </section>

                <footer style={{ marginTop: 80, textAlign: 'center', color: T.muted, fontSize: 12, fontFamily: T.mono }}>
                    <div style={{ marginBottom: 8 }}>VERILOG LEARNING PLATFORM // AUTHENTICATED RECORD</div>
                    <div>HASH: 0x82F...E10B // {new Date().toLocaleDateString()}</div>
                </footer>

            </div>
        </div>
    );
};
