/**
 * EngineeringPortfolio.tsx - Student Professional Record
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
    bg: '#F8FAFC',
    card: '#FFFFFF',
    surface: '#F1F5F9',
    border: '#E2E8F0',
    text: '#0F172A',
    muted: '#64748B',
    accent: '#0284C7',
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
        <div
            className="min-h-[100svh] w-full overflow-x-hidden px-4 py-8 sm:px-6 md:py-10"
            style={{
                background: T.bg,
                color: T.text,
                fontFamily: T.sans,
                backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(2,132,199,0.05) 0%, transparent 70%)',
            }}
        >
            <div className="mx-auto w-full max-w-[800px]">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-10 md:mb-12">
                    <button
                        onClick={() => navigate('/portal')}
                        style={{
                            padding: '8px 16px', borderRadius: 6, border: `1px solid ${T.border}`,
                            background: 'transparent', color: T.muted, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
                            minHeight: 40,
                        }}
                    >
                        <ArrowLeft size={16} /> Back to Station
                    </button>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button style={{ padding: '8px 16px', borderRadius: 6, background: T.surface, border: 'none', color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, minHeight: 40 }}>
                            <Share2 size={16} /> Share
                        </button>
                        <button style={{ padding: '8px 16px', borderRadius: 6, background: T.accent, border: 'none', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, minHeight: 40 }}>
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>

                {/* Profile Section */}
                <header className="mb-12 md:mb-16 text-center">
                    <div style={{
                        width: 100, height: 100, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0284C7 0%, #3B82F6 100%)',
                        margin: '0 auto 24px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 32, fontWeight: 800,
                        border: '4px solid #FFFFFF',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        color: '#FFFFFF'
                    }}>
                        {(firstName || 'S')[0].toUpperCase()}
                    </div>
                    <h1
                        className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 leading-tight"
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        {firstName || 'Explorer'}'s Engineering Portfolio
                    </h1>
                    <p
                        className="text-sm sm:text-base mx-auto px-2"
                        style={{ color: T.muted, maxWidth: 500, lineHeight: 1.6 }}
                    >
                        Specializing in Digital Systems Design. Verified progress in Circuit Theory &amp; Logic Analysis.
                    </p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 md:mb-12">
                    {stats.map((s, i) => (
                        <div key={i} style={{ padding: 24, borderRadius: 12, border: `1px solid ${T.border}`, background: T.card }}>
                            <s.icon size={20} color={T.accent} style={{ marginBottom: 16 }} />
                            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: T.mono, marginBottom: 4 }}>{s.value}</div>
                            <div style={{ fontSize: 10, fontFamily: T.mono, textTransform: 'uppercase', color: T.muted, letterSpacing: '0.1em' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Achievements Section */}
                <section className="mb-12 md:mb-16">
                    <h3 style={{ fontSize: 12, fontFamily: T.mono, textTransform: 'uppercase', letterSpacing: '0.2em', color: T.accent, marginBottom: 24 }}>
                        Earned Credentials
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {badgesData.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    padding: 20, borderRadius: 12, border: `1px solid ${T.border}`,
                                    background: T.surface, display: 'flex', alignItems: 'center', gap: 16
                                }}
                            >
                                <div style={{
                                    width: 48, height: 48, flexShrink: 0, borderRadius: 8,
                                    background: 'rgba(2,132,199,0.05)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: T.accent,
                                    border: `1px solid ${T.border}`
                                }}>
                                    <Award size={24} />
                                </div>
                                <div className="min-w-0">
                                    <div style={{ fontSize: 15, fontWeight: 600 }} className="truncate">{b.name}</div>
                                    <div style={{ fontSize: 10, fontFamily: T.mono, color: T.muted, marginTop: 2 }}>
                                        {b.cat} • ISSUED {b.date}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Skills Radar / Competencies Teaser */}
                <section
                    className="mb-12 md:mb-16"
                    style={{ padding: 32, borderRadius: 16, background: '#FFFFFF', border: `1px solid ${T.border}` }}
                >
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
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
                <section className="mb-12 md:mb-16">
                    <div
                        className="flex flex-col sm:flex-row gap-4 sm:gap-5 sm:items-center"
                        style={{
                            padding: 24, borderRadius: 16, border: '1px solid rgba(245,158,11,0.2)',
                            background: 'rgba(245,158,11,0.03)',
                        }}
                    >
                        <div style={{
                            width: 54, height: 54, flexShrink: 0, borderRadius: '50%', background: 'rgba(245,158,11,0.1)',
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

                <footer className="mt-16 md:mt-20 text-center" style={{ color: T.muted, fontSize: 12, fontFamily: T.mono }}>
                    <div style={{ marginBottom: 8 }}>VERILOG LEARNING PLATFORM // AUTHENTICATED RECORD</div>
                    <div>HASH: 0x82F...E10B // {new Date().toLocaleDateString()}</div>
                </footer>

            </div>
        </div>
    );
};
