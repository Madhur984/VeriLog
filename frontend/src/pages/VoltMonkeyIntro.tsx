/**
 * VoltMonkeyIntro.tsx
 *
 * PAGE 1 — Zero-Gravity Chamber Intro
 * Level 1: "A Signal Must Return"
 *
 * Architecture:
 *  - <AmbientField /> — memoized, never re-renders, uses useRef + createElementNS for particles
 *  - VoltMonkey dialogue — staggered CSS class triggers via useEffect + setTimeout
 *  - Start Button — CSS-only magnetic hover, glow pulse, click ripple
 *  - All animations: CSS keyframes only. No per-frame React state.
 */
import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './VoltMonkey-intro.css';

// ─── Ambient Field ─────────────────────────────────────────────────────────────
// Completely isolated component — memoized, no props, never re-renders.
// Particles injected via DOM in a single useEffect.

const PARTICLE_COUNT = 28;
const PARTICLE_CONFIGS = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const startX = (i / PARTICLE_COUNT) * 100;
    const startY = 20 + Math.random() * 60;
    const dur = 14 + Math.random() * 14;
    const delay = -(Math.random() * dur);
    return {
        left: `${startX}%`,
        top: `${startY}%`,
        '--dur': `${dur}s`,
        '--delay': `${delay}s`,
        '--dx1': `${(Math.random() - 0.5) * 80}px`,
        '--dy1': `${-20 - Math.random() * 40}px`,
        '--dx2': `${(Math.random() - 0.5) * 60}px`,
        '--dy2': `${-40 - Math.random() * 50}px`,
        '--dx3': `${(Math.random() - 0.5) * 100}px`,
        '--dy3': `${-30 - Math.random() * 40}px`,
        '--dx4': `${(Math.random() - 0.5) * 70}px`,
        '--dy4': `${-60 - Math.random() * 40}px`,
        opacity: String(0.3 + Math.random() * 0.5),
        width: `${1 + Math.random() * 2}px`,
        height: `${1 + Math.random() * 2}px`,
    };
});

const AmbientField = memo(() => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Inject particles as raw DOM — never triggers React re-render
        PARTICLE_CONFIGS.forEach((cfg) => {
            const el = document.createElement('span');
            el.className = 'VoltMonkey-particle';
            Object.assign(el.style, {
                left: cfg.left,
                top: cfg.top,
                width: cfg.width,
                height: cfg.height,
                opacity: cfg.opacity,
            } as Partial<CSSStyleDeclaration>);
            // Set CSS custom properties
            el.style.setProperty('--dur', cfg['--dur']);
            el.style.setProperty('--delay', cfg['--delay']);
            el.style.setProperty('--dx1', cfg['--dx1']);
            el.style.setProperty('--dy1', cfg['--dy1']);
            el.style.setProperty('--dx2', cfg['--dx2']);
            el.style.setProperty('--dy2', cfg['--dy2']);
            el.style.setProperty('--dx3', cfg['--dx3']);
            el.style.setProperty('--dy3', cfg['--dy3']);
            el.style.setProperty('--dx4', cfg['--dx4']);
            el.style.setProperty('--dy4', cfg['--dy4']);
            container.appendChild(el);
        });

        return () => {
            while (container.firstChild) container.removeChild(container.firstChild);
        };
    }, []); // runs once — particles are static DOM

    return (
        <>
            <div className="VoltMonkey-intro__grid" aria-hidden="true" />
            <div
                ref={containerRef}
                className="VoltMonkey-intro__particles"
                aria-hidden="true"
            />
        </>
    );
});
AmbientField.displayName = 'AmbientField';

// ─── Dialogue Config ────────────────────────────────────────────────────────── 
const DIALOGUE_LINES = [
    { text: 'Before logic. Before processors.', accent: false },
    { text: 'There is one rule.', accent: false },
    { text: 'Energy must return to its source.', accent: true },
    { text: 'The signal must complete its journey.', accent: false },
    { text: "I am VoltMonkey. Let's begin.", accent: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// VoltMonkey SVG Avatar — inline futuristic bot silhouette
// ─────────────────────────────────────────────────────────────────────────────
function VoltMonkeyAvatar() {
    return (
        <svg
            width="72"
            height="88"
            viewBox="0 0 72 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* body shell */}
            <rect x="16" y="32" width="40" height="44" rx="8" fill="#0a1929" stroke="#00BFFF" strokeWidth="1.5" />
            {/* head */}
            <rect x="20" y="8" width="32" height="28" rx="6" fill="#0d2137" stroke="#00BFFF" strokeWidth="1.5" />
            {/* eye left */}
            <rect x="24" y="16" width="10" height="6" rx="2" fill="#00BFFF" opacity="0.9" />
            {/* eye right */}
            <rect x="38" y="16" width="10" height="6" rx="2" fill="#00BFFF" opacity="0.9" />
            {/* mouth */}
            <rect x="27" y="27" width="18" height="2" rx="1" fill="#00BFFF" opacity="0.5" />
            {/* chest indicator */}
            <circle cx="36" cy="52" r="6" fill="none" stroke="#00BFFF" strokeWidth="1" opacity="0.6" />
            <circle cx="36" cy="52" r="3" fill="#00BFFF" opacity="0.7" />
            {/* arm L */}
            <rect x="4" y="34" width="10" height="24" rx="4" fill="#0a1929" stroke="#00BFFF" strokeWidth="1" opacity="0.8" />
            {/* arm R */}
            <rect x="58" y="34" width="10" height="24" rx="4" fill="#0a1929" stroke="#00BFFF" strokeWidth="1" opacity="0.8" />
            {/* legs */}
            <rect x="20" y="76" width="13" height="10" rx="4" fill="#0a1929" stroke="#00BFFF" strokeWidth="1" />
            <rect x="39" y="76" width="13" height="10" rx="4" fill="#0a1929" stroke="#00BFFF" strokeWidth="1" />
            {/* antenna */}
            <line x1="36" y1="8" x2="36" y2="2" stroke="#00BFFF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="36" cy="1.5" r="1.5" fill="#00BFFF" />
        </svg>
    );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export function VoltMonkeyIntro() {
    const navigate = useNavigate();
    const [currentLine, setCurrentLine] = useState(-1); // -1 = nothing shown yet
    const [avatarVisible, setAvatarVisible] = useState(false);
    const [stepsVisible, setStepsVisible] = useState(false);
    const [btnVisible, setBtnVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const lineTimers = useRef<number[]>([]);

    // ── Staggered line reveal ──────────────────────────────────────────────────
    useEffect(() => {
        // Avatar appears first
        const t0 = window.setTimeout(() => setAvatarVisible(true), 300);
        // Steps indicator
        const ts = window.setTimeout(() => setStepsVisible(true), 500);

        // Each dialogue line
        DIALOGUE_LINES.forEach((_, i) => {
            const t = window.setTimeout(() => {
                setCurrentLine(i);
            }, 900 + i * 1800);
            lineTimers.current.push(t);
        });

        // Show start button after all lines
        const tBtn = window.setTimeout(
            () => setBtnVisible(true),
            900 + DIALOGUE_LINES.length * 1800 + 400
        );
        lineTimers.current.push(t0, ts, tBtn);

        return () => {
            lineTimers.current.forEach(clearTimeout);
            lineTimers.current = [];
        };
    }, []);

    // ── Pause animations when tab is inactive ──────────────────────────────────
    useEffect(() => {
        const root = document.querySelector('.VoltMonkey-intro') as HTMLElement | null;
        if (!root) return;

        const onVisible = () => {
            root.style.animationPlayState = document.hidden ? 'paused' : 'running';
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, []);

    // ── Start button ripple + navigation ─────────────────────────────────────
    const handleStart = useCallback(() => {
        const btn = btnRef.current;
        if (!btn) return;

        btn.classList.add('ripple-active');
        setIsExiting(true);

        window.setTimeout(() => {
            navigate('/workbench');
        }, 550);
    }, [navigate]);

    return (
        <div
            className={`VoltMonkey-intro ${isExiting ? 'page-transition-exit' : 'page-transition-enter'}`}
            role="main"
            aria-label="VoltMonkey Introduction Chamber"
        >
            {/* ── Ambient Layer (never re-renders) ── */}
            <AmbientField />
            <div className="VoltMonkey-intro__vignette" aria-hidden="true" />
            <div className="VoltMonkey-intro__scanline" aria-hidden="true" />

            {/* ── Corner Decorations ── */}
            <div className="VoltMonkey-intro__corner VoltMonkey-intro__corner--tl" aria-hidden="true" />
            <div className="VoltMonkey-intro__corner VoltMonkey-intro__corner--tr" aria-hidden="true" />
            <div className="VoltMonkey-intro__corner VoltMonkey-intro__corner--bl" aria-hidden="true" />
            <div className="VoltMonkey-intro__corner VoltMonkey-intro__corner--br" aria-hidden="true" />

            {/* ── Content ── */}
            <div className="VoltMonkey-intro__content">
                {/* VoltMonkey avatar */}
                <div
                    className={`VoltMonkey-intro__avatar ${avatarVisible ? 'is-visible' : ''} ${avatarVisible && currentLine >= 0 ? 'is-idle' : ''}`}
                    aria-label="VoltMonkey — your lab guide"
                >
                    <VoltMonkeyAvatar />
                    <div className="VoltMonkey-intro__avatar-label">VoltMonkey</div>
                </div>

                {/* Step dots */}
                <div
                    className={`VoltMonkey-intro__steps ${stepsVisible ? 'is-visible' : ''}`}
                    aria-hidden="true"
                    style={{ marginBottom: 32 }}
                >
                    {DIALOGUE_LINES.map((_, i) => (
                        <div
                            key={i}
                            className={`step-dot ${i <= currentLine ? 'is-active' : ''}`}
                        />
                    ))}
                </div>

                {/* Dialogue lines — staggered visibility */}
                <div className="VoltMonkey-intro__dialogue" aria-live="polite" aria-atomic="true">
                    {DIALOGUE_LINES.map((line, i) => (
                        <p
                            key={i}
                            className={`dialogue-line ${i === currentLine ? 'is-visible' : ''} ${i < currentLine ? 'is-visible is-idle' : ''}`}
                            style={{
                                display: i === currentLine || i === currentLine - 1 ? 'block' : 'none',
                                paddingBottom: i < currentLine ? 0 : undefined,
                            }}
                        >
                            {line.accent
                                ? <><span className="VoltMonkey-word">"</span>{line.text}<span className="VoltMonkey-word">"</span></>
                                : line.text
                            }
                        </p>
                    ))}
                </div>

                {/* Start button */}
                <div className={`VoltMonkey-intro__btn-wrap ${btnVisible ? 'is-visible' : ''}`}>
                    <button
                        ref={btnRef}
                        className="VoltMonkey-start-btn"
                        onClick={handleStart}
                        aria-label="Enter the Circuit Laboratory"
                        disabled={!btnVisible}
                    >
                        ENTER LAB
                    </button>

                    <p
                        style={{
                            marginTop: 16,
                            color: 'rgba(0,191,255,0.3)',
                            fontSize: 10,
                            letterSpacing: 3,
                            textTransform: 'uppercase',
                        }}
                        aria-hidden="true"
                    >
                        Level 1 · A Signal Must Return
                    </p>
                </div>
            </div>

            {/* ── Skip button (accessibility) ── */}
            <button
                onClick={() => navigate('/workbench')}
                style={{
                    position: 'absolute',
                    bottom: 32,
                    right: 32,
                    background: 'none',
                    border: '1px solid rgba(0,191,255,0.15)',
                    color: 'rgba(0,191,255,0.35)',
                    fontSize: 10,
                    letterSpacing: 2,
                    padding: '6px 14px',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontFamily: "'Courier New', monospace",
                    transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,191,255,0.7)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,191,255,0.4)';
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,191,255,0.35)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,191,255,0.15)';
                }}
                aria-label="Skip introduction and enter lab"
            >
                SKIP
            </button>
        </div>
    );
}
