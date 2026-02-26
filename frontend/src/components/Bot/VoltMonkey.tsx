import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   Courage — Villain Mask Variant
   Close visual reconstruction from reference image.
   Layered groups: body · spot · tail · arms · legs ·
                   ears · head · mask · eyes · muzzle ·
                   nose · mouth · whiskers
   Same animation prop API as original VoltMonkey.
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

const SIZES: Record<MonkeySize, number> = { sm: 80, md: 120, lg: 170 };

// ── palette (from image) ────────────────────────────────────────
const P = {
    pink: '#C8849C',  // main body fill
    pinkDark: '#B06882',  // shadow/depth tone
    outline: '#1A0808',  // thick black outlines
    brown: '#7A4820',  // ear inner, muzzle
    brownDark: '#4A2010',  // nose top, darker shadow
    brownLight: '#A06030',  // muzzle highlight
    black: '#080404',  // mask, spot
    eyeWhite: '#F2EEE0',  // eye whites (slightly warm)
    pupil: '#0C0606',  // pupils
    teeth: '#E8E0A0',  // pale yellow-cream teeth
    mouthRed: '#A82838',  // inner mouth
    tongue: '#C83848',  // tongue
    whisker: '#907080',  // whisker lines
};

// ── body float / bounce ───────────────────────────────────────
const bodyVariants = {
    idle: { y: [0, -4, 0], transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } },
    waving: { y: [0, -3, 0], rotate: [0, -2, 2, 0], transition: { duration: 1.2, repeat: Infinity } },
    happy: { y: [0, -14, 0], scale: [1, 1.05, 1], transition: { duration: 0.5, repeat: Infinity } },
    thinking: { rotate: [0, 6, 0], transition: { duration: 2.2, repeat: Infinity } },
    talking: { y: [0, -2, 0], transition: { duration: 0.7, repeat: Infinity } },
    alert: { x: [0, -3, 3, -3, 0], transition: { duration: 0.35, repeat: 4 } },
};

const leftArmVariants = {
    idle: { rotate: 0 },
    waving: { rotate: [0, -42, 12, -42, 0], transition: { duration: 0.8, repeat: Infinity } },
    happy: { rotate: [0, -20, 0], transition: { duration: 0.45, repeat: Infinity } },
    thinking: { rotate: 20 },
    talking: { rotate: [0, -10, 0], transition: { duration: 0.7, repeat: Infinity } },
    alert: { rotate: [0, -22, 22, 0], transition: { duration: 0.3, repeat: 3 } },
};

const tailVariants = {
    idle: { rotate: [0, 10, -10, 0], transition: { duration: 2.8, repeat: Infinity } },
    waving: { rotate: [0, 20, -8, 0], transition: { duration: 1, repeat: Infinity } },
    happy: { rotate: [0, 30, -14, 0], transition: { duration: 0.5, repeat: Infinity } },
    thinking: { rotate: [0, 5, 0], transition: { duration: 2.5, repeat: Infinity } },
    talking: { rotate: [0, 14, -14, 0], transition: { duration: 1.2, repeat: Infinity } },
    alert: { rotate: [0, 32, -32, 0], transition: { duration: 0.3, repeat: 4 } },
};

const mouthVariants = {
    idle: { scaleY: 1 },
    waving: { scaleY: [1, 1.2, 1], transition: { duration: 0.9, repeat: Infinity } },
    happy: { scaleY: [1, 1.4, 1], scaleX: [1, 1.1, 1], transition: { duration: 0.45, repeat: Infinity } },
    thinking: { scaleY: 0.35, scaleX: 0.6 },
    talking: { scaleY: [0.35, 1.35, 0.25, 1.15, 0.35], transition: { duration: 0.5, repeat: Infinity } },
    alert: { scaleY: [1, 0.28, 1], transition: { duration: 0.3, repeat: 3 } },
};

const blinkVariants = {
    idle: { scaleY: [1, 1, 0.06, 1, 1], transition: { duration: 4.2, repeat: Infinity, times: [0, 0.4, 0.44, 0.48, 1] } },
    waving: { scaleY: [1, 0.08, 1], transition: { duration: 0.9, repeat: Infinity } },
    happy: { scaleY: [1, 0.18, 1], transition: { duration: 0.45, repeat: Infinity } },
    thinking: { x: [0, 2, -2, 0], transition: { duration: 1.8, repeat: Infinity } },
    talking: { scaleY: [1, 1, 0.08, 1], transition: { duration: 2.5, repeat: Infinity, times: [0, 0.6, 0.65, 0.7] } },
    alert: { scaleY: [1, 1.2, 1], transition: { duration: 0.3, repeat: 4 } },
};

// ── Cross-paw helper (hands & feet) ──────────────────────────
const CrossPaw: React.FC<{ cx: number; cy: number; r?: number }> = ({ cx, cy, r = 7 }) => (
    <g>
        <circle cx={cx} cy={cy} r={r} fill={P.pink} stroke={P.outline} strokeWidth="2.2" />
        <line x1={cx - r - 3} y1={cy} x2={cx + r + 3} y2={cy} stroke={P.outline} strokeWidth="3.5" strokeLinecap="round" />
        <line x1={cx} y1={cy - r - 3} x2={cx} y2={cy + r + 3} stroke={P.outline} strokeWidth="3.5" strokeLinecap="round" />
    </g>
);

/* ═══════════════════════════════════════════════════════════════ */

export const VoltMonkey: React.FC<VoltMonkeyProps> = ({
    state = 'idle',
    size = 'md',
    onClick,
    className = '',
    eyeTarget = null,
}) => {
    const px = SIZES[size];

    const eyeOff = useMemo(() => {
        if (!eyeTarget) return { x: 0, y: 0 };
        return {
            x: Math.round(eyeTarget.x * 3.5 * 10) / 10,
            y: Math.round(eyeTarget.y * 2.8 * 10) / 10,
        };
    }, [eyeTarget]);

    return (
        <motion.svg
            viewBox="0 0 340 490"
            width={px}
            height={px * (490 / 340)}
            className={`cursor-pointer select-none ${className}`}
            onClick={onClick}
            variants={bodyVariants}
            animate={state}
            style={{ overflow: 'visible', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.38))' }}
        >
            {/* ═══ GROUND SHADOW ═══ */}
            <ellipse cx="175" cy="478" rx="58" ry="9" fill="rgba(0,0,0,0.18)" />

            {/* ═══ TAIL ═══ */}
            <motion.g
                variants={tailVariants} animate={state}
                style={{ originX: '250px', originY: '400px' }}
            >
                <path
                    d="M250,400 Q275,388 285,405 Q278,426 260,418 Z"
                    fill={P.pink} stroke={P.outline} strokeWidth="2.8" strokeLinejoin="round"
                />
            </motion.g>

            {/* ═══ BODY ═══ */}
            {/* Main bean/pear body — widest ~⅔ down */}
            <path
                d="M128,278
                   Q98,318  98,370
                   Q98,435 148,462
                   Q175,475 205,472
                   Q245,468 262,442
                   Q280,418 278,372
                   Q278,318 248,283
                   Q228,268 195,265
                   Q158,264 128,278 Z"
                fill={P.pink} stroke={P.outline} strokeWidth="3.2"
            />

            {/* ── BLACK SPOT on body (right side) ── */}
            <ellipse cx="248" cy="378" rx="27" ry="33"
                fill={P.black} />

            {/* ═══ LEGS ═══ */}
            {/* Left leg */}
            <line x1="163" y1="445" x2="155" y2="476"
                stroke={P.outline} strokeWidth="7.5" strokeLinecap="round" />
            <CrossPaw cx={155} cy={478} r={7} />

            {/* Right leg */}
            <line x1="210" y1="447" x2="220" y2="477"
                stroke={P.outline} strokeWidth="7.5" strokeLinecap="round" />
            <CrossPaw cx={220} cy={479} r={7} />

            {/* ═══ RIGHT ARM ═══ */}
            <line x1="255" y1="318" x2="315" y2="308"
                stroke={P.outline} strokeWidth="8" strokeLinecap="round" />
            <CrossPaw cx={316} cy={306} r={8} />

            {/* ═══ LEFT ARM (waving) ═══ */}
            <motion.g
                variants={leftArmVariants} animate={state}
                style={{ originX: '126px', originY: '313px' }}
            >
                <line x1="126" y1="313" x2="64" y2="325"
                    stroke={P.outline} strokeWidth="8" strokeLinecap="round" />
                <CrossPaw cx={62} cy={326} r={8} />
            </motion.g>

            {/* ═══ EARS ═══ */}

            {/* LEFT EAR — points up-left */}
            <g id="left-ear">
                {/* Outer ear (pink base + brown tip) */}
                <path
                    d="M145,115
                       Q130,78  120,38
                       Q130,24  148,32
                       Q164,82  168,114 Z"
                    fill={P.pink} stroke={P.outline} strokeWidth="3.2"
                />
                {/* Brown inner fill */}
                <path
                    d="M147,112
                       Q134,78  126,42
                       Q133,32  146,38
                       Q159,84  162,110 Z"
                    fill={P.brown}
                />
                {/* Darker tip */}
                <path
                    d="M133,50 Q138,30 148,34 Q155,52 144,62 Z"
                    fill={P.brownDark} opacity="0.7"
                />
            </g>

            {/* RIGHT EAR — droops down-right */}
            <g id="right-ear">
                <path
                    d="M222,110
                       Q258,135  305,162
                       Q298,175  285,170
                       Q242,150  218,120 Z"
                    fill={P.pink} stroke={P.outline} strokeWidth="3.2"
                />
                {/* Brown inner */}
                <path
                    d="M222,114
                       Q256,138  300,164
                       Q296,172  286,168
                       Q244,150  220,122 Z"
                    fill={P.brownDark}
                />
            </g>

            {/* ═══ HEAD ═══ */}
            <ellipse cx="188" cy="190" rx="96" ry="90"
                fill={P.pink} stroke={P.outline} strokeWidth="3.2" />

            {/* ═══ VILLAIN MASK ═══
                Solid black angular domino mask.
                Two eye-sections + narrow nose bridge.
                Angular peaks at top of each side.           */}
            <g id="mask">
                {/* Left mask section — angled top */}
                <path
                    d="M97,198
                       Q96,162  108,150
                       L124,142
                       L138,134
                       L152,143
                       L160,155
                       Q164,163 164,198
                       Q152,215 126,216
                       Q100,214 97,198 Z"
                    fill={P.black}
                />
                {/* Nose bridge connection */}
                <rect x="164" y="168" width="28" height="30" rx="3"
                    fill={P.black} />
                {/* Right mask section */}
                <path
                    d="M192,160
                       Q193,150 200,142
                       L216,133
                       L232,140
                       L252,148
                       L265,162
                       Q275,178 274,198
                       Q273,215 250,218
                       Q226,220 210,212
                       Q192,203 192,198
                       Q192,175 192,160 Z"
                    fill={P.black}
                />
                {/* Tiny top-edge bevel for slight 3-D feel — lighter strip */}
                <path
                    d="M108,150 L124,142 L138,134 L152,143 L160,155"
                    fill="none" stroke="rgba(255,255,255,0.10)"
                    strokeWidth="2.5" strokeLinecap="round"
                />
                <path
                    d="M200,142 L216,133 L232,140 L252,148 L265,162"
                    fill="none" stroke="rgba(255,255,255,0.10)"
                    strokeWidth="2.5" strokeLinecap="round"
                />
            </g>

            {/* ═══ EYES inside mask ═══ */}
            {/* Left eye — slightly tilted, inner corner lower */}
            <motion.g
                variants={blinkVariants} animate={state}
                style={{ originX: '126px', originY: '186px' }}
            >
                <ellipse cx={126 + eyeOff.x} cy={186 + eyeOff.y}
                    rx="23" ry="18"
                    fill={P.eyeWhite}
                    transform={`rotate(-8 ${126 + eyeOff.x} ${186 + eyeOff.y})`}
                />
                {/* Pupil */}
                <ellipse cx={128 + eyeOff.x} cy={187 + eyeOff.y}
                    rx="13" ry="12"
                    fill={P.pupil}
                    transform={`rotate(-8 ${128 + eyeOff.x} ${187 + eyeOff.y})`}
                />
                {/* Gloss */}
                <circle cx={121 + eyeOff.x} cy={181 + eyeOff.y} r="5"
                    fill="white" opacity="0.85" />
                <circle cx={130 + eyeOff.x} cy={192 + eyeOff.y} r="2.5"
                    fill="white" opacity="0.4" />
            </motion.g>

            {/* Right eye — slightly tilted inward */}
            <motion.g
                variants={blinkVariants} animate={state}
                style={{ originX: '228px', originY: '183px' }}
            >
                <ellipse cx={228 + eyeOff.x} cy={183 + eyeOff.y}
                    rx="22" ry="17"
                    fill={P.eyeWhite}
                    transform={`rotate(-10 ${228 + eyeOff.x} ${183 + eyeOff.y})`}
                />
                {/* Pupil */}
                <ellipse cx={229 + eyeOff.x} cy={184 + eyeOff.y}
                    rx="12" ry="11"
                    fill={P.pupil}
                    transform={`rotate(-10 ${229 + eyeOff.x} ${184 + eyeOff.y})`}
                />
                {/* Gloss */}
                <circle cx={222 + eyeOff.x} cy={177 + eyeOff.y} r="4.5"
                    fill="white" opacity="0.85" />
                <circle cx={232 + eyeOff.x} cy={189 + eyeOff.y} r="2"
                    fill="white" opacity="0.4" />
            </motion.g>

            {/* ═══ MUZZLE / MOUTH AREA ═══ */}
            <g id="muzzle">
                {/* Large protruding oval snout */}
                <ellipse cx="188" cy="258" rx="52" ry="33"
                    fill={P.brownLight} stroke={P.outline} strokeWidth="2.8" />

                {/* ── MOUTH (open, wide, diagonal grin) ── */}
                <motion.g
                    variants={mouthVariants} animate={state}
                    style={{ originX: '185px', originY: '270px' }}
                >
                    {/* Mouth opening shape — wide, goes right */}
                    <path
                        d="M148,260
                           Q162,250 188,250
                           Q215,250 240,260
                           Q254,274 254,298
                           Q250,320 228,328
                           Q205,335 185,330
                           Q162,325 152,312
                           Q142,298 148,260 Z"
                        fill={P.mouthRed} stroke={P.outline} strokeWidth="2.5"
                    />

                    {/* Tongue on right side (bulging out) */}
                    <path
                        d="M225,290
                           Q250,278 258,298
                           Q254,320 236,328
                           Q215,332 220,312 Z"
                        fill={P.tongue}
                    />

                    {/* Teeth — top row, pale yellow, uneven */}
                    <path
                        d="M152,262
                           L152,278 L163,282 L167,262
                           L168,262 L170,282 L180,284 L182,262
                           L183,262 L186,284 L196,282 L196,262
                           L197,262 L200,282 L210,279 L208,262
                           L209,262 L215,276 L225,270 L220,262"
                        fill={P.teeth} stroke={P.outline} strokeWidth="1.6"
                        strokeLinejoin="round"
                    />
                    {/* Tooth divider crease */}
                    <path d="M152,260 Q188,250 240,260"
                        fill="none" stroke={P.outline} strokeWidth="2" />
                </motion.g>

                {/* ── NOSE (top of snout) ── */}
                <g id="nose">
                    {/* Outer nose shape */}
                    <path
                        d="M168,240 Q178,226 188,225 Q200,225 210,240
                           Q214,248 202,252 Q190,254 178,252 Q165,248 168,240 Z"
                        fill={P.brown} stroke={P.outline} strokeWidth="2.5"
                    />
                    {/* Darker top shading */}
                    <path
                        d="M172,238 Q183,228 193,230 Q204,236 200,240
                           Q190,242 180,240 Q170,242 172,238 Z"
                        fill={P.brownDark} opacity="0.8"
                    />
                    {/* Nostril divider */}
                    <path d="M178,243 Q188,248 199,243"
                        fill="none" stroke={P.brownDark} strokeWidth="2" strokeLinecap="round"
                    />
                </g>

                {/* Whisker dots */}
                <circle cx="150" cy="253" r="3.5" fill={P.pinkDark} opacity="0.8" />
                <circle cx="150" cy="262" r="3.5" fill={P.pinkDark} opacity="0.8" />
                <circle cx="153" cy="270" r="3" fill={P.pinkDark} opacity="0.7" />
            </g>

            {/* ── WHISKERS ── */}
            <line x1="132" y1="252" x2="92" y2="244" stroke={P.whisker} strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
            <line x1="133" y1="260" x2="91" y2="260" stroke={P.whisker} strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
            <line x1="135" y1="268" x2="96" y2="275" stroke={P.whisker} strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />

            {/* ── CHEEK FRECKLE DOTS ── */}
            <circle cx="150" cy="232" r="2.8" fill={P.pinkDark} opacity="0.4" />
            <circle cx="160" cy="228" r="2.5" fill={P.pinkDark} opacity="0.35" />
        </motion.svg>
    );
};
