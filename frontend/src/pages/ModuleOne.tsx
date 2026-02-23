import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FlaskConical, Moon, Sun } from 'lucide-react';
import { useColorScheme } from '../hooks/useColorScheme';

/* ══════════════════════════════════════════════════════════════════════
   TABLE OF CONTENTS
 ══════════════════════════════════════════════════════════════════════ */

const TOC = [
    { id: 'what-is-signal', label: 'What is a Signal?' },
    { id: 'types-of-signals', label: 'Types of Signals' },
    { id: 'signal-parameters', label: 'Signal Parameters' },
    { id: 'basic-signals', label: 'Basic Signals' },
    { id: 'signal-in-circuits', label: 'Signal in Circuits' },
    { id: 'why-signal-must-return', label: 'Why Signal Must Return' },
    { id: 'quick-revision', label: 'Quick Revision' },
];

/* ══════════════════════════════════════════════════════════════════════
   THEME TOKENS
 ══════════════════════════════════════════════════════════════════════ */

const themes = {
    light: {
        bg: '#FAFBFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        body: '#1E293B',
        muted: '#64748B',
        faint: '#94A3B8',
        border: '#E2E8F0',
        accent: '#3B82F6',
        accentBg: '#EFF6FF',
        accentText: '#2563EB',
        tocHover: '#F1F5F9',
        tocHoverText: '#334155',
        cardShadow: '0 2px 8px rgba(0,0,0,0.06)',
        warnBg: '#FEF2F2',
        warnBorder: '#FECACA',
        warnText: '#991B1B',
        coreBg: '#EFF6FF',
        coreBorder: '#3B82F6',
        coreTitle: '#1D4ED8',
        coreBody: '#1E3A5F',
        coreBoxBg: '#DBEAFE',
        coreBoxText: '#1E40AF',
        svgGrid: '#E2E8F0',
        svgWave: '#3B82F6',
        svgLabel: '#94A3B8',
    },
    dark: {
        bg: '#0B0F1A',
        surface: '#141B2D',
        text: '#E2E8F0',
        body: '#CBD5E1',
        muted: '#94A3B8',
        faint: '#64748B',
        border: '#1E293B',
        accent: '#60A5FA',
        accentBg: 'rgba(59,130,246,0.08)',
        accentText: '#93C5FD',
        tocHover: 'rgba(255,255,255,0.04)',
        tocHoverText: '#CBD5E1',
        cardShadow: '0 2px 12px rgba(0,0,0,0.3)',
        warnBg: 'rgba(239,68,68,0.08)',
        warnBorder: 'rgba(239,68,68,0.2)',
        warnText: '#FCA5A5',
        coreBg: 'rgba(59,130,246,0.06)',
        coreBorder: '#3B82F6',
        coreTitle: '#93C5FD',
        coreBody: '#CBD5E1',
        coreBoxBg: 'rgba(59,130,246,0.12)',
        coreBoxText: '#93C5FD',
        svgGrid: '#1E293B',
        svgWave: '#60A5FA',
        svgLabel: '#64748B',
    },
};

type Theme = typeof themes.light;

/* ══════════════════════════════════════════════════════════════════════
   SVG ILLUSTRATIONS
 ══════════════════════════════════════════════════════════════════════ */

const WaveIllustration: React.FC<{ t: Theme }> = ({ t }) => (
    <svg viewBox="0 0 400 120" className="w-full max-w-[400px] mx-auto my-6" fill="none">
        <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={t.svgWave} stopOpacity="0.08" />
                <stop offset="50%" stopColor={t.svgWave} stopOpacity="0.2" />
                <stop offset="100%" stopColor={t.svgWave} stopOpacity="0.08" />
            </linearGradient>
        </defs>
        <line x1="0" y1="60" x2="400" y2="60" stroke={t.svgGrid} strokeWidth="1" strokeDasharray="4 4" />
        <path d="M0,60 Q50,10 100,60 Q150,110 200,60 Q250,10 300,60 Q350,110 400,60 L400,120 L0,120Z" fill="url(#waveGrad)" />
        <path d="M0,60 Q50,10 100,60 Q150,110 200,60 Q250,10 300,60 Q350,110 400,60" stroke={t.svgWave} strokeWidth="2.5" strokeLinecap="round" />
        <text x="200" y="16" textAnchor="middle" fill={t.svgWave} fontSize="11" fontWeight="600">Signal (changes over time)</text>
        <text x="10" y="56" fill={t.svgLabel} fontSize="9">0</text>
        <text x="390" y="56" fill={t.svgLabel} fontSize="9" textAnchor="end">t</text>
    </svg>
);

const CircuitLoopDiagram: React.FC<{ t: Theme }> = ({ t }) => (
    <svg viewBox="0 0 420 200" className="w-full max-w-[420px] mx-auto my-6" fill="none">
        <rect x="40" y="30" width="340" height="140" rx="20" stroke={t.accent} strokeWidth="2.5" strokeDasharray="8 4" fill="none" />
        <polygon points="210,30 216,22 204,22" fill={t.accent} />
        <polygon points="210,170 204,178 216,178" fill={t.accent} />
        {/* Battery */}
        <rect x="50" y="70" width="80" height="60" rx="12" fill={t.accentBg} stroke={t.accent} strokeWidth="1.5" />
        <text x="90" y="96" textAnchor="middle" fill={t.text} fontSize="11" fontWeight="600">Battery</text>
        <text x="90" y="112" textAnchor="middle" fill={t.muted} fontSize="9">(Source)</text>
        <text x="170" y="55" textAnchor="middle" fill={t.accent} fontSize="10" fontWeight="500">Current →</text>
        {/* Bulb */}
        <rect x="170" y="70" width="80" height="60" rx="12" fill="rgba(245,158,11,0.08)" stroke="#F59E0B" strokeWidth="1.5" />
        <text x="210" y="96" textAnchor="middle" fill={t.text} fontSize="11" fontWeight="600">Bulb</text>
        <text x="210" y="112" textAnchor="middle" fill={t.muted} fontSize="9">(Load)</text>
        {/* Return */}
        <rect x="290" y="70" width="80" height="60" rx="12" fill="rgba(34,197,94,0.08)" stroke="#22C55E" strokeWidth="1.5" />
        <text x="330" y="96" textAnchor="middle" fill={t.text} fontSize="11" fontWeight="600">Return</text>
        <text x="330" y="112" textAnchor="middle" fill={t.muted} fontSize="9">(Wire)</text>
        <text x="210" y="194" textAnchor="middle" fill="#22C55E" fontSize="10" fontWeight="500">← Return path back to source</text>
    </svg>
);

const UnitStepSVG: React.FC<{ t: Theme }> = ({ t }) => (
    <svg viewBox="0 0 160 80" className="w-full max-w-[160px]" fill="none">
        <line x1="10" y1="60" x2="80" y2="60" stroke={t.faint} strokeWidth="2" />
        <line x1="80" y1="60" x2="80" y2="20" stroke={t.accent} strokeWidth="2" />
        <line x1="80" y1="20" x2="150" y2="20" stroke={t.accent} strokeWidth="2" />
        <circle cx="80" cy="20" r="3" fill={t.accent} />
        <text x="80" y="75" textAnchor="middle" fill={t.svgLabel} fontSize="8">t=0</text>
    </svg>
);

const UnitImpulseSVG: React.FC<{ t: Theme }> = ({ t }) => (
    <svg viewBox="0 0 160 80" className="w-full max-w-[160px]" fill="none">
        <line x1="10" y1="60" x2="150" y2="60" stroke={t.faint} strokeWidth="2" />
        <line x1="80" y1="60" x2="80" y2="12" stroke="#EF4444" strokeWidth="2.5" />
        <polygon points="80,8 76,16 84,16" fill="#EF4444" />
        <text x="80" y="75" textAnchor="middle" fill={t.svgLabel} fontSize="8">t=0</text>
    </svg>
);

const RampSVG: React.FC<{ t: Theme }> = ({ t }) => (
    <svg viewBox="0 0 160 80" className="w-full max-w-[160px]" fill="none">
        <line x1="10" y1="60" x2="80" y2="60" stroke={t.faint} strokeWidth="2" />
        <line x1="80" y1="60" x2="150" y2="15" stroke="#F59E0B" strokeWidth="2.5" />
        <circle cx="80" cy="60" r="3" fill="#F59E0B" />
        <text x="80" y="75" textAnchor="middle" fill={t.svgLabel} fontSize="8">t=0</text>
    </svg>
);

const SinusoidSVG: React.FC<{ t: Theme }> = ({ t }) => (
    <svg viewBox="0 0 160 80" className="w-full max-w-[160px]" fill="none">
        <line x1="10" y1="40" x2="150" y2="40" stroke={t.svgGrid} strokeWidth="1" strokeDasharray="3 3" />
        <path d="M10,40 Q30,10 50,40 Q70,70 90,40 Q110,10 130,40 Q150,70 160,40" stroke="#22C55E" strokeWidth="2.5" fill="none" />
    </svg>
);

const ParametersSVG: React.FC<{ t: Theme }> = ({ t }) => (
    <svg viewBox="0 0 400 160" className="w-full max-w-[400px] mx-auto my-6" fill="none">
        <line x1="30" y1="80" x2="380" y2="80" stroke={t.svgGrid} strokeWidth="1" strokeDasharray="4 4" />
        <path d="M30,80 Q80,20 130,80 Q180,140 230,80 Q280,20 330,80 Q355,110 380,80" stroke={t.svgWave} strokeWidth="2.5" fill="none" />
        <line x1="80" y1="80" x2="80" y2="32" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="60" y="55" fill="#EF4444" fontSize="10" fontWeight="600">Amplitude</text>
        <line x1="130" y1="145" x2="230" y2="145" stroke="#22C55E" strokeWidth="1.5" />
        <line x1="130" y1="140" x2="130" y2="150" stroke="#22C55E" strokeWidth="1.5" />
        <line x1="230" y1="140" x2="230" y2="150" stroke="#22C55E" strokeWidth="1.5" />
        <text x="180" y="158" textAnchor="middle" fill="#22C55E" fontSize="10" fontWeight="600">Period (1/Frequency)</text>
        <circle cx="30" cy="80" r="4" fill="#F59E0B" />
        <text x="30" y="100" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="600">Phase</text>
    </svg>
);

/* ══════════════════════════════════════════════════════════════════════
   SIGNAL TYPE DATA
 ══════════════════════════════════════════════════════════════════════ */

const signalTypes = [
    { title: 'Analog Signal', desc: 'Smooth and continuous.', example: 'E.g. Human voice', color: '#3B82F6' },
    { title: 'Digital Signal', desc: 'Only two values: 0 and 1.', example: 'E.g. Computer data', color: '#8B5CF6' },
    { title: 'Periodic Signal', desc: 'Repeats after a fixed time.', example: 'E.g. Clock signal', color: '#22C55E' },
    { title: 'Non-Periodic Signal', desc: 'Does not repeat.', example: 'E.g. Speech waveform', color: '#F59E0B' },
];

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
 ══════════════════════════════════════════════════════════════════════ */

export const ModuleOne: React.FC = () => {
    const navigate = useNavigate();
    const [scheme, toggleScheme] = useColorScheme();
    const isDark = scheme === 'dark';
    const t = isDark ? themes.dark : themes.light;

    const [activeSection, setActiveSection] = useState(TOC[0].id);
    const [completed, setCompleted] = useState(false);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    /* ── IntersectionObserver for TOC ── */
    const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
            if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: '-80px 0px -60% 0px',
            threshold: 0.1,
        });
        TOC.forEach(({ id }) => {
            const el = sectionRefs.current[id];
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [observerCallback]);

    const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };
    const scrollTo = (id: string) => sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    /* ── Styles ── */
    const heading: React.CSSProperties = { fontSize: 24, fontWeight: 700, color: t.text, marginBottom: 16, marginTop: 0, letterSpacing: '-0.01em' };
    const bullets: React.CSSProperties = { paddingLeft: 24, marginTop: 10, lineHeight: 2 };
    const caption: React.CSSProperties = { textAlign: 'center', fontSize: 13, color: t.faint, fontStyle: 'italic', marginTop: -4 };

    return (
        <div className="min-h-screen transition-colors duration-300" style={{ background: t.bg, color: t.body, fontFamily: "'DM Sans', Inter, system-ui, sans-serif" }}>

            {/* ══ TOP BAR ══ */}
            <div style={{ maxWidth: 1120, margin: '0 auto', padding: '16px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/portal')}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors duration-200"
                    style={{ color: t.muted, background: 'none', border: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = t.accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = t.muted)}
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Module Map
                </button>

                {/* Theme toggle */}
                <button
                    onClick={toggleScheme}
                    className="flex items-center gap-2 cursor-pointer transition-all duration-200"
                    style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        border: `1px solid ${t.border}`,
                        background: t.surface,
                        color: t.muted,
                        fontSize: 13,
                        fontWeight: 500,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = t.accent)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}
                >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            {/* ══ ARTICLE HEADER ══ */}
            <header style={{ maxWidth: 1120, margin: '0 auto', padding: '36px 32px 0' }}>
                <div style={{ maxWidth: 780, marginLeft: 248 }}>
                    <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.25, color: t.text, margin: 0, letterSpacing: '-0.02em' }}>
                        What is a Signal? <span style={{ color: t.faint, fontWeight: 500, fontSize: 28 }}>(Signal Must Return)</span>
                    </h1>
                    <p style={{ fontSize: 17, color: t.muted, marginTop: 10 }}>
                        Foundations of Signals and Circuit Continuity
                    </p>
                    <div className="flex items-center gap-3 flex-wrap" style={{ marginTop: 14, fontSize: 13, color: t.faint, fontWeight: 500 }}>
                        <span style={{ background: t.accentBg, color: t.accent, padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>Beginner Level</span>
                        <span>•</span>
                        <span>15 min read</span>
                        <span>•</span>
                        <span>Module 1 of 7</span>
                    </div>
                    <div style={{ height: 1, background: t.border, marginTop: 28 }} />
                </div>
            </header>

            {/* ══ BODY ══ */}
            <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 96px', display: 'flex', gap: 48 }}>

                {/* ── Sticky TOC ── */}
                <nav style={{ width: 200, flexShrink: 0, position: 'sticky', top: 24, alignSelf: 'flex-start', paddingTop: 32 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.faint, marginBottom: 16 }}>
                        On this page
                    </p>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {TOC.map(item => {
                            const active = activeSection === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => scrollTo(item.id)}
                                        className="cursor-pointer transition-all duration-200"
                                        style={{
                                            display: 'block', width: '100%', textAlign: 'left',
                                            padding: '7px 12px', borderRadius: 8, border: 'none',
                                            background: active ? t.accentBg : 'transparent',
                                            color: active ? t.accentText : t.muted,
                                            fontWeight: active ? 600 : 400, fontSize: 13, lineHeight: 1.5,
                                            borderLeft: active ? `3px solid ${t.accent}` : '3px solid transparent',
                                        }}
                                        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = t.tocHover; e.currentTarget.style.color = t.tocHoverText; } }}
                                        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.muted; } }}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* ── Content ── */}
                <article style={{ flex: 1, maxWidth: 780, paddingTop: 32, fontSize: 17, lineHeight: 1.85, color: t.body }}>

                    {/* § 1 — What is a Signal? */}
                    <section id="what-is-signal" ref={setRef('what-is-signal')} style={{ marginBottom: 60 }}>
                        <h2 style={heading}>What is a Signal?</h2>
                        <p>A signal is just information that changes over time. That's the simplest way to put it.</p>
                        <p style={{ marginTop: 10 }}>Think of it like this — anything that goes up, down, or changes can be called a signal:</p>
                        <ul style={bullets}>
                            <li><strong>Sound</strong> — your voice changes in volume and pitch as you talk</li>
                            <li><strong>Voltage</strong> — the electricity level in a wire goes up and down</li>
                            <li><strong>Temperature</strong> — a room gets hotter during the day and cooler at night</li>
                            <li><strong>Data</strong> — bits in a computer switch rapidly between 0 and 1</li>
                        </ul>
                        <p style={{ marginTop: 12 }}>
                            In electronics, signals carry information from one place to another. When you press a switch, a signal (electricity) tells the light to turn on. When you speak into a phone, your voice becomes an electrical signal that travels through wires or radio waves.
                        </p>
                        <p style={{ marginTop: 10 }}>
                            Without signals, no electronic device would work. Every phone call, every LED glow, every sensor reading — they all depend on signals moving through a circuit.
                        </p>
                        <WaveIllustration t={t} />
                        <p style={caption}>A signal going up and down over time — this is called a waveform</p>
                    </section>

                    {/* § 2 — Types of Signals */}
                    <section id="types-of-signals" ref={setRef('types-of-signals')} style={{ marginBottom: 60 }}>
                        <h2 style={heading}>Types of Signals</h2>
                        <p>Not all signals are the same. They behave differently depending on what kind of information they carry.</p>
                        <p style={{ marginTop: 10 }}>Here are the four main types you need to know:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 20 }}>
                            {signalTypes.map(s => (
                                <div key={s.title} className="hover:shadow-md cursor-default transition-shadow duration-200" style={{
                                    background: t.surface, borderRadius: 12, padding: '20px 22px',
                                    border: `1px solid ${t.border}`, borderLeft: `4px solid ${s.color}`,
                                }}>
                                    <h4 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: 0 }}>{s.title}</h4>
                                    <p style={{ fontSize: 14, color: t.muted, margin: '6px 0 0' }}>{s.desc}</p>
                                    <p style={{ fontSize: 13, color: t.faint, margin: '4px 0 0', fontStyle: 'italic' }}>{s.example}</p>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: 20 }}>
                            <strong>Why does this matter?</strong> When you design a circuit, you need to know what kind of signal you're working with. Analog signals need different handling than digital ones. A music player uses analog signals for the speaker, but digital signals for storing the song file.
                        </p>
                    </section>

                    {/* § 3 — Signal Parameters */}
                    <section id="signal-parameters" ref={setRef('signal-parameters')} style={{ marginBottom: 60 }}>
                        <h2 style={heading}>Signal Parameters</h2>
                        <p>Every signal — no matter how complex — can be described using just three properties. If you understand these, you can describe any signal in the world:</p>
                        <ParametersSVG t={t} />
                        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <ParamRow color="#EF4444" label="Amplitude" desc="How strong the signal is. Think of it like volume — a loud speaker has high amplitude, a whisper has low amplitude." t={t} />
                            <ParamRow color="#22C55E" label="Frequency" desc="How fast the signal repeats. A hummingbird's wings beat at high frequency. A grandfather clock's pendulum swings at low frequency." t={t} />
                            <ParamRow color="#F59E0B" label="Phase" desc="Where the signal starts in its cycle. Two identical waves can be out of sync — one starts a little earlier than the other. That shift is the phase." t={t} />
                        </div>
                        <p style={{ marginTop: 20 }}>
                            Together, these three values fully define a simple wave. In real circuits, engineers measure them using tools like oscilloscopes.
                        </p>
                    </section>

                    {/* § 4 — Basic Signals */}
                    <section id="basic-signals" ref={setRef('basic-signals')} style={{ marginBottom: 60 }}>
                        <h2 style={heading}>Basic Signals</h2>
                        <p>These are the building blocks of all signals. Every complex waveform you see on an oscilloscope is just a combination of these four simple shapes:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ marginTop: 20 }}>
                            <BasicSignalCard title="Unit Step" desc="Like flipping a switch ON. Before t=0, nothing happens. After t=0, the signal jumps to full value and stays there forever." svg={<UnitStepSVG t={t} />} t={t} />
                            <BasicSignalCard title="Unit Impulse" desc="All energy concentrated at a single instant. Imagine clapping your hands once — a sharp burst, then silence. Used to test how systems respond." svg={<UnitImpulseSVG t={t} />} t={t} />
                            <BasicSignalCard title="Ramp Signal" desc="Increases steadily over time, like a car accelerating smoothly from 0. The slope tells you how fast it's growing." svg={<RampSVG t={t} />} t={t} />
                            <BasicSignalCard title="Sinusoidal" desc="The smoothest, most natural wave. This is what AC power looks like. It's the foundation of radio, audio, and communication signals." svg={<SinusoidSVG t={t} />} t={t} />
                        </div>
                        <p style={{ marginTop: 20 }}>
                            <strong>Why learn these?</strong> Engineers use these basic signals to test and understand how circuits behave. If you know how a circuit responds to a step signal, you can predict how it will handle real-world inputs.
                        </p>
                    </section>

                    {/* § 5 — Signal in Circuits */}
                    <section id="signal-in-circuits" ref={setRef('signal-in-circuits')} style={{ marginBottom: 60 }}>
                        <h2 style={heading}>Signal in Electrical Circuits</h2>
                        <p>
                            Here's how signals actually work inside a circuit:
                        </p>
                        <ul style={bullets}>
                            <li>The signal (current) <strong>starts</strong> at the power source (battery).</li>
                            <li>It <strong>travels</strong> through the wire to a component (like a bulb or motor).</li>
                            <li>It <strong>does work</strong> — the bulb glows, the motor spins.</li>
                            <li>It <strong>must return</strong> back to the battery through a return wire.</li>
                        </ul>
                        <p style={{ marginTop: 12 }}>
                            This forms a closed loop. If any part of this loop is broken — even one tiny connection — current stops flowing <strong>everywhere</strong> in the circuit. Not just at the break point. Everywhere.
                        </p>
                        <CircuitLoopDiagram t={t} />
                        <p style={caption}>A complete circuit loop: Battery → Bulb → Return wire → Battery</p>
                        <p style={{ marginTop: 16 }}>
                            Think of it like a circular running track. Runners (electrons) keep going around. If someone puts a wall across the track, all runners stop — not just the ones near the wall.
                        </p>
                        <div style={{
                            background: t.warnBg, border: `1px solid ${t.warnBorder}`,
                            borderRadius: 10, padding: '16px 20px', marginTop: 20,
                            fontSize: 15, color: t.warnText,
                        }}>
                            <strong>Key takeaway:</strong> A circuit is only "on" when the loop is complete. One broken connection = entire circuit dead.
                        </div>
                    </section>

                    {/* § 6 — Why Signal Must Return (CORE) */}
                    <section id="why-signal-must-return" ref={setRef('why-signal-must-return')} style={{ marginBottom: 60 }}>
                        <h2 style={heading}>Why Signal Must Return</h2>
                        <p>This is the most important concept in this entire module. Everything you build in electronics depends on this one rule.</p>

                        <div style={{
                            background: t.coreBg, borderLeft: `5px solid ${t.coreBorder}`,
                            borderRadius: '0 12px 12px 0', padding: '28px 28px', marginTop: 20,
                            fontSize: 16, lineHeight: 1.9, color: t.coreBody,
                        }}>
                            <p style={{ fontWeight: 700, fontSize: 18, color: t.coreTitle, marginBottom: 12 }}>
                                The Closed Loop Rule
                            </p>
                            <p>A signal <strong>always</strong> moves in a complete loop. There are no exceptions.</p>
                            <ul style={{ ...bullets, marginTop: 10, marginBottom: 0 }}>
                                <li>Energy leaves the battery (the source).</li>
                                <li>It flows through the wire to components.</li>
                                <li>It does useful work — a bulb glows, a speaker plays sound, a motor spins.</li>
                                <li>After doing work, it <strong>must return</strong> to the battery through a return path.</li>
                                <li>Then the cycle repeats — over and over, billions of times per second.</li>
                            </ul>
                            <div style={{
                                background: t.coreBoxBg, borderRadius: 8,
                                padding: '12px 16px', marginTop: 16,
                                fontWeight: 700, fontSize: 15, color: t.coreBoxText, textAlign: 'center',
                            }}>
                                No return path = No current flow = Dead circuit
                            </div>
                        </div>
                        <p style={{ marginTop: 20 }}>
                            <strong>Real-world example:</strong> Your phone charger has two prongs. One sends current into the phone, the other is the return path. If you cut either wire, charging stops completely.
                        </p>
                        <p style={{ marginTop: 10 }}>
                            This rule is why circuits are drawn as loops, why ground wires exist, and why electricians always check for "continuity" — they're making sure the return path is intact.
                        </p>
                    </section>

                    {/* § 7 — Quick Revision */}
                    <section id="quick-revision" ref={setRef('quick-revision')} style={{ marginBottom: 60 }}>
                        <h2 style={heading}>Quick Revision</h2>
                        <p>Before moving on, make sure you can confidently say "yes" to each of these:</p>
                        <div style={{
                            background: t.surface, border: `1px solid ${t.border}`,
                            borderRadius: 12, padding: '24px 28px', marginTop: 16,
                        }}>
                            <ul style={{ ...bullets, margin: 0, listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <RevisionItem text="A signal is any information that changes over time — sound, voltage, temperature, or data." t={t} />
                                <RevisionItem text="Analog signals are smooth and continuous. Digital signals use only 0 and 1." t={t} />
                                <RevisionItem text="Every signal has three properties: amplitude (strength), frequency (speed), and phase (start position)." t={t} />
                                <RevisionItem text="Basic signals — step, impulse, ramp, and sine — are the building blocks used to test and understand circuits." t={t} />
                                <RevisionItem text="Current only flows when the circuit forms a complete, unbroken loop." t={t} />
                                <RevisionItem text="If the return path is missing, the circuit is dead. Signal must always return to the source." t={t} />
                            </ul>
                        </div>
                    </section>

                    {/* ── CTAs ── */}
                    <div style={{
                        borderTop: `1px solid ${t.border}`, paddingTop: 32,
                        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                    }}>
                        <button
                            onClick={() => setCompleted(true)}
                            disabled={completed}
                            className="flex items-center gap-2 cursor-pointer transition-all duration-200"
                            style={{
                                padding: '14px 28px', borderRadius: 12,
                                border: completed ? '2px solid #22C55E' : `2px solid ${t.border}`,
                                background: completed ? (isDark ? 'rgba(34,197,94,0.1)' : '#F0FDF4') : t.surface,
                                color: completed ? '#22C55E' : t.text,
                                fontWeight: 600, fontSize: 15,
                            }}
                        >
                            <CheckCircle2 className="w-5 h-5" style={{ color: completed ? '#22C55E' : t.faint }} />
                            {completed ? 'Completed' : 'Mark as Complete'}
                        </button>

                        <button
                            onClick={() => navigate('/portal')}
                            className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:opacity-90"
                            style={{
                                padding: '14px 28px', borderRadius: 12, border: 'none',
                                background: t.accent, color: '#FFFFFF', fontWeight: 600, fontSize: 15,
                            }}
                        >
                            <FlaskConical className="w-5 h-5" />
                            Go to Workbench
                        </button>
                    </div>
                </article>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
 ══════════════════════════════════════════════════════════════════════ */

const ParamRow: React.FC<{ color: string; label: string; desc: string; t: Theme }> = ({ color, label, desc, t }) => (
    <div className="flex items-start gap-3">
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, marginTop: 7, flexShrink: 0 }} />
        <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: t.text }}>{label}</span>
            <span style={{ fontSize: 15, color: t.muted }}> — {desc}</span>
        </div>
    </div>
);

const BasicSignalCard: React.FC<{ title: string; desc: string; svg: React.ReactNode; t: Theme }> = ({ title, desc, svg, t }) => (
    <div className="hover:shadow-md transition-shadow duration-200" style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>{svg}</div>
        <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: 0 }}>{title}</h4>
            <p style={{ fontSize: 14, color: t.muted, margin: '4px 0 0', lineHeight: 1.5 }}>{desc}</p>
        </div>
    </div>
);

const RevisionItem: React.FC<{ text: string; t: Theme }> = ({ text, t }) => (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <CheckCircle2 style={{ width: 18, height: 18, color: '#22C55E', marginTop: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 15, color: t.body, lineHeight: 1.6 }}>{text}</span>
    </li>
);
