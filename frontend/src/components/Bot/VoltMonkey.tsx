import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   VoltMonkey — Premium Game-Quality Animated SVG Mascot
   ──────────────────────────────────────────────────────────────────
   High-detail green robot-monkey with:
   • Multi-tone metallic gradients, thick outlines, inner shadows
   • Glossy multi-layer eyes with iris gradients and highlights
   • Segmented mechanical tail with articulated joints
   • Detailed body armor with panel segments + screws
   • Lightning bolt with radial glow
   • Ambient glow + top-light highlight + drop shadow
   • 6 animation states: idle · waving · happy · thinking · talking · alert
   • Eye cursor tracking via eyeTarget prop
   ═══════════════════════════════════════════════════════════════ */

export type MonkeyState = 'idle' | 'waving' | 'happy' | 'thinking' | 'talking' | 'alert';
export type MonkeySize = 'sm' | 'md' | 'lg';

interface VoltMonkeyProps {
    state?: MonkeyState;
    size?: MonkeySize;
    onClick?: () => void;
    className?: string;
    eyeTarget?: { x: number; y: number } | null;
}

const SIZES: Record<MonkeySize, number> = { sm: 80, md: 110, lg: 160 };

/* ── body animation presets ── */
const bodyVariants = {
    idle: {
        y: [0, -4, 0],
        rotate: 0,
        transition: { y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } },
    },
    waving: {
        y: [0, -3, 0],
        rotate: [0, -3, 3, 0],
        transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
    happy: {
        y: [0, -12, 0],
        scale: [1, 1.06, 1],
        transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
    },
    thinking: {
        y: 0,
        rotate: [0, 8, 0],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
    talking: {
        y: [0, -2, 0],
        transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
    },
    alert: {
        y: [0, -5, 0, -5, 0],
        x: [0, -2, 2, -2, 0],
        transition: { duration: 0.4, repeat: 3, ease: 'easeInOut' },
    },
};

const blinkVariants = {
    idle: { scaleY: [1, 1, 0.08, 1, 1], transition: { duration: 3.5, repeat: Infinity, times: [0, 0.42, 0.45, 0.48, 1] } },
    waving: { scaleY: [1, 0.08, 1], scaleX: [1, 1.15, 1], transition: { duration: 0.8, repeat: Infinity } },
    happy: { scaleY: [1, 0.25, 1], scaleX: [1, 1.3, 1], transition: { duration: 0.45, repeat: Infinity } },
    thinking: { scaleY: 1, x: [0, 2, -2, 0], transition: { duration: 1.8, repeat: Infinity } },
    talking: { scaleY: [1, 1, 0.12, 1], transition: { duration: 2.5, repeat: Infinity, times: [0, 0.6, 0.65, 0.7] } },
    alert: { scaleY: [1, 1.15, 1], scaleX: [1, 1.1, 1], transition: { duration: 0.3, repeat: 4 } },
};

const boltVariants = {
    idle: { rotate: 0, scale: 1, opacity: [0.85, 1, 0.85], transition: { opacity: { duration: 2.5, repeat: Infinity }, duration: 0.4 } },
    waving: { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1], transition: { duration: 1, repeat: Infinity } },
    happy: { rotate: [0, 15, -15, 0], scale: [1, 1.25, 1], transition: { duration: 0.4, repeat: Infinity } },
    thinking: { rotate: 360, transition: { duration: 2, repeat: Infinity, ease: 'linear' } },
    talking: { scale: [1, 1.12, 1], transition: { duration: 0.5, repeat: Infinity } },
    alert: { rotate: [0, -20, 20, -20, 0], scale: [1, 1.35, 1.35, 1.35, 1], transition: { duration: 0.35, repeat: 3 } },
};

const leftArmVariants = {
    idle: { rotate: 0, transition: { duration: 0.4 } },
    waving: { rotate: [0, -35, 10, -35, 0], transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } },
    happy: { rotate: [0, -20, 0], transition: { duration: 0.4, repeat: Infinity } },
    thinking: { rotate: 0 },
    talking: { rotate: [0, -8, 0], transition: { duration: 0.7, repeat: Infinity } },
    alert: { rotate: [0, -15, 15, 0], transition: { duration: 0.3, repeat: 3 } },
};

const tailVariants = {
    idle: { rotate: [0, 8, -8, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
    waving: { rotate: [0, 15, -5, 0], transition: { duration: 1, repeat: Infinity } },
    happy: { rotate: [0, 22, -12, 0], transition: { duration: 0.5, repeat: Infinity } },
    thinking: { rotate: [0, 5, 0], transition: { duration: 2.5, repeat: Infinity } },
    talking: { rotate: [0, 10, -10, 0], transition: { duration: 1.2, repeat: Infinity } },
    alert: { rotate: [0, 25, -25, 0], transition: { duration: 0.3, repeat: 4 } },
};

const mouthVariants = {
    idle: { scaleY: 1, transition: { duration: 0.3 } },
    waving: { scaleY: [1, 1.2, 1], transition: { duration: 0.8, repeat: Infinity } },
    happy: { scaleY: [1, 1.4, 1], scaleX: [1, 1.1, 1], transition: { duration: 0.4, repeat: Infinity } },
    thinking: { scaleY: 0.6, scaleX: 0.7, transition: { duration: 0.5 } },
    talking: { scaleY: [0.5, 1.3, 0.4, 1.1, 0.5], transition: { duration: 0.5, repeat: Infinity } },
    alert: { scaleY: [1, 0.4, 1], scaleX: [1, 0.8, 1], transition: { duration: 0.3, repeat: 3 } },
};

/* ═══════════════════════════════════════════════════════════════ */

export const VoltMonkey: React.FC<VoltMonkeyProps> = ({
    state = 'idle',
    size = 'md',
    onClick,
    className = '',
    eyeTarget = null,
}) => {
    const px = SIZES[size];
    const isAlert = state === 'alert';

    const eyeOff = useMemo(() => {
        if (!eyeTarget) return { x: 0, y: 0 };
        return {
            x: Math.round(eyeTarget.x * 4.5 * 10) / 10,
            y: Math.round(eyeTarget.y * 3.5 * 10) / 10,
        };
    }, [eyeTarget]);

    return (
        <motion.svg
            viewBox="0 0 240 280"
            width={px}
            height={px * 1.17}
            className={`cursor-pointer select-none ${className}`}
            onClick={onClick}
            variants={bodyVariants}
            animate={state}
            style={{ overflow: 'visible', filter: 'drop-shadow(0 4px 12px rgba(34,197,94,0.15))' }}
        >
            <defs>
                {/* ── Metallic helmet gradient ── */}
                <linearGradient id="vm-helmet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3EC066" />
                    <stop offset="35%" stopColor="#2D9D4E" />
                    <stop offset="100%" stopColor="#1A7A38" />
                </linearGradient>
                <linearGradient id="vm-helmet-edge" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4AE07A" />
                    <stop offset="50%" stopColor="#2D9D4E" />
                    <stop offset="100%" stopColor="#145428" />
                </linearGradient>
                {/* ── Body armor gradient ── */}
                <linearGradient id="vm-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38B860" />
                    <stop offset="50%" stopColor="#2A9A4A" />
                    <stop offset="100%" stopColor="#1E7A3A" />
                </linearGradient>
                <linearGradient id="vm-chest" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="#B4E86E" />
                    <stop offset="50%" stopColor="#8CC63F" />
                    <stop offset="100%" stopColor="#6BA530" />
                </linearGradient>
                {/* ── Face gradient ── */}
                <radialGradient id="vm-face" cx="0.5" cy="0.4" r="0.55">
                    <stop offset="0%" stopColor="#B5E650" />
                    <stop offset="60%" stopColor="#8CC63F" />
                    <stop offset="100%" stopColor="#6BA530" />
                </radialGradient>
                {/* ── Eye gradients (glossy) ── */}
                <radialGradient id="vm-eye-white" cx="0.45" cy="0.35" r="0.6">
                    <stop offset="0%" stopColor="#F0FFE0" />
                    <stop offset="70%" stopColor="#D4F5A0" />
                    <stop offset="100%" stopColor="#B8E878" />
                </radialGradient>
                <radialGradient id="vm-iris" cx="0.4" cy="0.35" r="0.55">
                    <stop offset="0%" stopColor="#40C060" />
                    <stop offset="50%" stopColor="#2D8040" />
                    <stop offset="100%" stopColor="#1A5028" />
                </radialGradient>
                <radialGradient id="vm-eye-ring" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#60DD80" />
                    <stop offset="100%" stopColor="#2D9D4E" />
                </radialGradient>
                {/* ── Lightning bolt glow ── */}
                <radialGradient id="vm-bolt-radial" cx="0.5" cy="0.5" r="0.75">
                    <stop offset="0%" stopColor="#FFE066" />
                    <stop offset="50%" stopColor="#F5C518" />
                    <stop offset="100%" stopColor="#D4A50A" />
                </radialGradient>
                <filter id="vm-bolt-glow" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="4" result="glow" />
                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* ── Ambient glow around mascot ── */}
                <filter id="vm-ambient" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="10" result="ambient" />
                    <feMerge><feMergeNode in="ambient" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* ── Drop shadow under feet ── */}
                <filter id="vm-foot-shadow" x="-30%" y="-10%" width="160%" height="150%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.25)" floodOpacity="0.5" />
                </filter>
                {/* ── Metallic shine filter ── */}
                <filter id="vm-shine" x="-5%" y="-5%" width="110%" height="110%">
                    <feSpecularLighting result="spec" specularExponent="20" lightingColor="white" surfaceScale="3">
                        <fePointLight x="100" y="20" z="80" />
                    </feSpecularLighting>
                    <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.15" k4="0" />
                </filter>
                {/* ── Top light highlight ── */}
                <linearGradient id="vm-toplight" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                    <stop offset="40%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
                {/* ── Inner shadow for depth ── */}
                <filter id="vm-inner-shadow">
                    <feOffset dx="0" dy="2" />
                    <feGaussianBlur stdDeviation="3" result="shadow" />
                    <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                </filter>
                {/* ── Alert glow ── */}
                <filter id="vm-alert-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="ag" />
                    <feMerge><feMergeNode in="ag" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* ── Ear gradient ── */}
                <linearGradient id="vm-ear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3BAF5C" />
                    <stop offset="100%" stopColor="#1E7A3A" />
                </linearGradient>
            </defs>

            {/* ═══ AMBIENT GLOW ═══ */}
            <ellipse cx="120" cy="140" rx="88" ry="100" fill="url(#vm-helmet)" opacity="0.08" filter="url(#vm-ambient)" />

            {/* ═══ ALERT RING ═══ */}
            {isAlert && (
                <motion.ellipse
                    cx="120" cy="140" rx="100" ry="115"
                    fill="none" stroke="#FF6B35" strokeWidth="3" opacity={0.6}
                    animate={{ opacity: [0, 0.6, 0], scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                />
            )}

            {/* ═══ GROUND SHADOW ═══ */}
            <ellipse cx="120" cy="268" rx="55" ry="10"
                fill="rgba(0,0,0,0.2)"
                filter="url(#vm-foot-shadow)"
            />

            {/* ═══════════════ TAIL (segmented mechanical) ═══════════════ */}
            <motion.g variants={tailVariants} animate={state} style={{ originX: '175px', originY: '170px' }}>
                {/* Segment 1 — base */}
                <rect x="168" y="162" width="18" height="12" rx="5"
                    fill="url(#vm-helmet)" stroke="#145428" strokeWidth="1.5" />
                {/* Joint 1 */}
                <circle cx="188" cy="160" r="5" fill="#2D9D4E" stroke="#145428" strokeWidth="1.2" />
                {/* Segment 2 */}
                <rect x="186" y="150" width="16" height="11" rx="4"
                    fill="url(#vm-helmet)" stroke="#145428" strokeWidth="1.5"
                    transform="rotate(-20 194 155)" />
                {/* Joint 2 */}
                <circle cx="196" cy="145" r="4.5" fill="#3BAF5C" stroke="#145428" strokeWidth="1.2" />
                {/* Segment 3 */}
                <rect x="192" y="134" width="14" height="10" rx="4"
                    fill="url(#vm-helmet)" stroke="#145428" strokeWidth="1.5"
                    transform="rotate(-40 199 139)" />
                {/* Joint 3 */}
                <circle cx="200" cy="128" r="4" fill="#2D9D4E" stroke="#145428" strokeWidth="1.2" />
                {/* Segment 4 (tip) */}
                <rect x="196" y="118" width="12" height="9" rx="3.5"
                    fill="url(#vm-helmet)" stroke="#145428" strokeWidth="1.5"
                    transform="rotate(-55 202 122)" />
                {/* Tail tip sphere */}
                <circle cx="204" cy="112" r="6" fill="#3BAF5C" stroke="#145428" strokeWidth="1.5" />
                <circle cx="202" cy="110" r="2" fill="rgba(255,255,255,0.3)" />
            </motion.g>

            {/* ═══════════════ LEGS ═══════════════ */}
            {/* Left leg */}
            <rect x="80" y="205" width="28" height="34" rx="10"
                fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
            <rect x="84" y="210" width="20" height="16" rx="5"
                fill="#1E7A3A" opacity="0.4" />
            {/* Left foot */}
            <ellipse cx="94" cy="240" rx="20" ry="10"
                fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
            <ellipse cx="94" cy="238" rx="14" ry="6" fill="#3BAF5C" />
            <ellipse cx="90" cy="236" rx="3" ry="1.5" fill="rgba(255,255,255,0.15)" />

            {/* Right leg */}
            <rect x="132" y="205" width="28" height="34" rx="10"
                fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
            <rect x="136" y="210" width="20" height="16" rx="5"
                fill="#1E7A3A" opacity="0.4" />
            {/* Right foot */}
            <ellipse cx="146" cy="240" rx="20" ry="10"
                fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
            <ellipse cx="146" cy="238" rx="14" ry="6" fill="#3BAF5C" />
            <ellipse cx="142" cy="236" rx="3" ry="1.5" fill="rgba(255,255,255,0.15)" />

            {/* ═══════════════ BODY ARMOR ═══════════════ */}
            {/* Main torso */}
            <rect x="72" y="142" width="96" height="72" rx="24"
                fill="url(#vm-body)" stroke="#145428" strokeWidth="2.5"
                filter="url(#vm-inner-shadow)" />
            {/* Armor panel lines */}
            <rect x="77" y="147" width="86" height="62" rx="20"
                fill="none" stroke="#1E7A3A" strokeWidth="1" opacity="0.5" />
            {/* Center chest plate (iron-man style) */}
            <rect x="88" y="152" width="64" height="50" rx="16"
                fill="url(#vm-chest)" stroke="#4A8C20" strokeWidth="1.5" />
            {/* Chest glow center */}
            <rect x="98" y="160" width="44" height="34" rx="11"
                fill="#C8F060" opacity="0.4" />
            {/* Chest arc details */}
            <path d="M104 163 Q120 155, 136 163" fill="none" stroke="#3BAF5C" strokeWidth="1.5" opacity="0.6" />
            <path d="M100 175 Q120 167, 140 175" fill="none" stroke="#3BAF5C" strokeWidth="1" opacity="0.3" />
            {/* Body armor side rivets */}
            <circle cx="82" cy="168" r="3" fill="#1E7A3A" stroke="#145428" strokeWidth="0.8" />
            <line x1="80.5" y1="168" x2="83.5" y2="168" stroke="#145428" strokeWidth="0.6" />
            <circle cx="158" cy="168" r="3" fill="#1E7A3A" stroke="#145428" strokeWidth="0.8" />
            <line x1="156.5" y1="168" x2="159.5" y2="168" stroke="#145428" strokeWidth="0.6" />
            {/* Top-light reflection on armor */}
            <rect x="72" y="142" width="96" height="36" rx="24"
                fill="url(#vm-toplight)" />

            {/* ═══════════════ LEFT ARM (animated wave) ═══════════════ */}
            <motion.g variants={leftArmVariants} animate={state} style={{ originX: '72px', originY: '160px' }}>
                {/* Shoulder joint */}
                <circle cx="72" cy="160" r="10" fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
                <circle cx="70" cy="157" r="2.5" fill="rgba(255,255,255,0.2)" />
                {/* Upper arm */}
                <rect x="38" y="150" width="38" height="20" rx="10"
                    fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
                <rect x="42" y="154" width="18" height="12" rx="4"
                    fill="#1E7A3A" opacity="0.3" />
                {/* Hand */}
                <circle cx="42" cy="160" r="13" fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
                <circle cx="42" cy="160" r="8" fill="url(#vm-face)" />
                <circle cx="39" cy="157" r="2" fill="rgba(255,255,255,0.2)" />
                {/* Fingers */}
                <circle cx="32" cy="155" r="5" fill="url(#vm-helmet)" stroke="#145428" strokeWidth="1.5" />
                <circle cx="32" cy="165" r="5" fill="url(#vm-helmet)" stroke="#145428" strokeWidth="1.5" />
            </motion.g>

            {/* ═══════════════ RIGHT ARM ═══════════════ */}
            <g>
                {/* Shoulder joint */}
                <circle cx="168" cy="160" r="10" fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
                <circle cx="166" cy="157" r="2.5" fill="rgba(255,255,255,0.2)" />
                {/* Upper arm */}
                <rect x="164" y="150" width="38" height="20" rx="10"
                    fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
                <rect x="180" y="154" width="18" height="12" rx="4"
                    fill="#1E7A3A" opacity="0.3" />
                {/* Hand */}
                <circle cx="198" cy="160" r="13" fill="url(#vm-helmet)" stroke="#145428" strokeWidth="2" />
                <circle cx="198" cy="160" r="8" fill="url(#vm-face)" />
                <circle cx="195" cy="157" r="2" fill="rgba(255,255,255,0.2)" />
                {/* Fingers */}
                <circle cx="208" cy="155" r="5" fill="url(#vm-helmet)" stroke="#145428" strokeWidth="1.5" />
                <circle cx="208" cy="165" r="5" fill="url(#vm-helmet)" stroke="#145428" strokeWidth="1.5" />
            </g>

            {/* ═══════════════ HEAD / HELMET ═══════════════ */}
            {/* Main helmet shell */}
            <rect x="52" y="32" width="136" height="116" rx="28"
                fill="url(#vm-helmet)"
                stroke="#145428" strokeWidth="3"
                filter={isAlert ? 'url(#vm-alert-glow)' : undefined}
            />
            {/* Helmet brow ridge */}
            <rect x="60" y="30" width="120" height="16" rx="8"
                fill="url(#vm-helmet-edge)" stroke="#145428" strokeWidth="2" />
            {/* Helmet panel division line */}
            <rect x="58" y="48" width="124" height="3" rx="1.5"
                fill="#1E7A3A" opacity="0.3" />
            {/* Top light reflection */}
            <rect x="52" y="32" width="136" height="50" rx="28"
                fill="url(#vm-toplight)" />

            {/* ── EARS (bracket-style, with depth) ── */}
            {/* Left ear */}
            <rect x="34" y="66" width="24" height="40" rx="7"
                fill="url(#vm-ear)" stroke="#145428" strokeWidth="2" />
            <rect x="30" y="71" width="14" height="30" rx="5"
                fill="#1E7A3A" stroke="#145428" strokeWidth="1.5" />
            <rect x="32" y="78" width="10" height="16" rx="4"
                fill="#3BAF5C" />
            <circle cx="37" cy="86" r="2" fill="#50D070" opacity="0.5" />

            {/* Right ear */}
            <rect x="182" y="66" width="24" height="40" rx="7"
                fill="url(#vm-ear)" stroke="#145428" strokeWidth="2" />
            <rect x="196" y="71" width="14" height="30" rx="5"
                fill="#1E7A3A" stroke="#145428" strokeWidth="1.5" />
            <rect x="198" y="78" width="10" height="16" rx="4"
                fill="#3BAF5C" />
            <circle cx="203" cy="86" r="2" fill="#50D070" opacity="0.5" />

            {/* ── HELMET SCREWS (4 corners, detailed) ── */}
            {[
                [68, 48], [172, 48], [68, 136], [172, 136]
            ].map(([cx, cy], i) => (
                <g key={`screw-${i}`}>
                    <circle cx={cx} cy={cy} r="5.5" fill="#1E7A3A" stroke="#145428" strokeWidth="1.5" />
                    <circle cx={cx} cy={cy} r="3" fill="#0D3D1A" />
                    <line x1={cx as number - 2.5} y1={cy} x2={cx as number + 2.5} y2={cy}
                        stroke="#0A2E14" strokeWidth="1.2" />
                    <line x1={cx} y1={cy as number - 2.5} x2={cx} y2={cy as number + 2.5}
                        stroke="#0A2E14" strokeWidth="1.2" />
                    {/* Screw highlight */}
                    <circle cx={cx as number - 1} cy={cy as number - 1} r="1.2" fill="rgba(255,255,255,0.15)" />
                </g>
            ))}

            {/* ═══════════════ FACE PLATE ═══════════════ */}
            <ellipse cx="120" cy="96" rx="50" ry="46"
                fill="url(#vm-face)" stroke="#4A8C20" strokeWidth="1.5" />
            {/* Face inner shadow at bottom */}
            <ellipse cx="120" cy="106" rx="42" ry="30"
                fill="#6BA530" opacity="0.15" />

            {/* ═══════════════ LIGHTNING BOLT ⚡ ═══════════════ */}
            <motion.g variants={boltVariants} animate={state}
                style={{ originX: '120px', originY: '50px' }}
                filter="url(#vm-bolt-glow)">
                <polygon
                    points="115,34 125,34 122,48 131,48 114,68 118,54 108,54"
                    fill={isAlert ? '#FF6B35' : 'url(#vm-bolt-radial)'}
                    stroke={isAlert ? '#CC4400' : '#B89010'}
                    strokeWidth="1.5" strokeLinejoin="round"
                />
                {/* Bolt inner highlight */}
                <polygon
                    points="117,38 123,38 121,47 126,47 116,60 118,52 112,52"
                    fill="rgba(255,255,200,0.35)"
                />
            </motion.g>

            {/* ═══════════════ EYES (glossy multi-layer) ═══════════════ */}
            {/* Left eye */}
            {/* Outer dark socket ring */}
            <ellipse cx="100" cy="92" rx="21" ry="22"
                fill="#1E7A3A" stroke="#145428" strokeWidth="2" />
            {/* Inner bright ring */}
            <ellipse cx="100" cy="92" rx="18" ry="19"
                fill="url(#vm-eye-ring)" />
            {/* Eye white (glossy) */}
            <ellipse cx="100" cy="92" rx="15" ry="16"
                fill="url(#vm-eye-white)" />
            <motion.g variants={blinkVariants} animate={state} style={{ originX: '100px', originY: '92px' }}>
                {/* Iris (gradient) */}
                <ellipse cx={100 + eyeOff.x} cy={93 + eyeOff.y}
                    rx={isAlert ? 11 : 9.5} ry={isAlert ? 12 : 10.5}
                    fill="url(#vm-iris)" />
                {/* Pupil */}
                <ellipse cx={100 + eyeOff.x} cy={93 + eyeOff.y}
                    rx="5" ry="5.5" fill="#0A2E14" />
                {/* Primary gloss highlight */}
                <circle cx={97 + eyeOff.x} cy={88 + eyeOff.y}
                    r="4" fill="white" opacity="0.9" />
                {/* Secondary highlight */}
                <circle cx={104 + eyeOff.x} cy={96 + eyeOff.y}
                    r="2" fill="white" opacity="0.5" />
                {/* Tiny sparkle */}
                <circle cx={95 + eyeOff.x} cy={86 + eyeOff.y}
                    r="1" fill="white" opacity="0.7" />
            </motion.g>

            {/* Right eye */}
            <ellipse cx="140" cy="92" rx="21" ry="22"
                fill="#1E7A3A" stroke="#145428" strokeWidth="2" />
            <ellipse cx="140" cy="92" rx="18" ry="19"
                fill="url(#vm-eye-ring)" />
            <ellipse cx="140" cy="92" rx="15" ry="16"
                fill="url(#vm-eye-white)" />
            <motion.g variants={blinkVariants} animate={state} style={{ originX: '140px', originY: '92px' }}>
                <ellipse cx={140 + eyeOff.x} cy={93 + eyeOff.y}
                    rx={isAlert ? 11 : 9.5} ry={isAlert ? 12 : 10.5}
                    fill="url(#vm-iris)" />
                <ellipse cx={140 + eyeOff.x} cy={93 + eyeOff.y}
                    rx="5" ry="5.5" fill="#0A2E14" />
                <circle cx={137 + eyeOff.x} cy={88 + eyeOff.y}
                    r="4" fill="white" opacity="0.9" />
                <circle cx={144 + eyeOff.x} cy={96 + eyeOff.y}
                    r="2" fill="white" opacity="0.5" />
                <circle cx={135 + eyeOff.x} cy={86 + eyeOff.y}
                    r="1" fill="white" opacity="0.7" />
            </motion.g>

            {/* ═══════════════ NOSE ═══════════════ */}
            <ellipse cx="120" cy="107" rx="5" ry="3"
                fill="#4A8C20" opacity="0.35" />

            {/* ═══════════════ MOUTH ═══════════════ */}
            <motion.g variants={mouthVariants} animate={state} style={{ originX: '120px', originY: '118px' }}>
                <path
                    d={isAlert
                        ? "M108 118 Q120 114, 132 118"
                        : "M106 115 Q112 126, 120 126 Q128 126, 134 115"
                    }
                    fill="none" stroke="#145428" strokeWidth="3" strokeLinecap="round"
                />
                {/* Cheek dimples */}
                <circle cx="102" cy="112" r="2" fill="#6BA530" opacity="0.3" />
                <circle cx="138" cy="112" r="2" fill="#6BA530" opacity="0.3" />
            </motion.g>
        </motion.svg>
    );
};
