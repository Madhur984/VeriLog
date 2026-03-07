

// Shared Gradients & Filters
export const ElectronicDefs = () => (
    <svg width="0" height="0">
        <defs>
            <linearGradient id="metal-lead" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="body-resistor" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="50%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="body-ic-black" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1A1D24" />
                <stop offset="20%" stopColor="#2A2D35" />
                <stop offset="100%" stopColor="#0D0F16" />
            </linearGradient>

            <filter id="drop-shadow-3d">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="2" dy="4" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
    </svg>
);

// 1. Resistor (Axial)
export const Resistor3D = ({ rotation = 0 }: { val?: string, rotation?: number }) => (
    <g transform={`rotate(${rotation})`} filter="url(#drop-shadow-3d)">
        {/* Leads */}
        <path d="M 0 15 L 20 15" stroke="url(#metal-lead)" strokeWidth="4" />
        <path d="M 80 15 L 100 15" stroke="url(#metal-lead)" strokeWidth="4" />

        {/* Body */}
        <rect x="20" y="5" width="60" height="20" rx="4" fill="url(#body-resistor)" />

        {/* Bands (Mock colors for 1k) */}
        <rect x="30" y="5" width="6" height="20" fill="#78350f" /> {/* Brown */}
        <rect x="45" y="5" width="6" height="20" fill="#0D0F16" /> {/* Black */}
        <rect x="60" y="5" width="6" height="20" fill="#dc2626" /> {/* Red */}
        <rect x="72" y="5" width="4" height="20" fill="#d4af37" opacity="0.8" /> {/* Gold */}
    </g>
);

// 2. Capacitor (Electrolytic Radial)
export const Capacitor3D = ({ val = "10uF" }: { val?: string }) => (
    <g filter="url(#drop-shadow-3d)">
        {/* Legs */}
        <path d="M 15 30 L 15 50" stroke="url(#metal-lead)" strokeWidth="3" />
        <path d="M 35 30 L 35 50" stroke="url(#metal-lead)" strokeWidth="3" />

        {/* Cylinder Body */}
        <rect x="10" y="0" width="30" height="40" rx="4" fill="#1e40af" />
        <rect x="10" y="0" width="30" height="40" rx="4" fill="url(#metal-lead)" opacity="0.2" /> {/* Shine */}

        {/* Negative Stripe */}
        <rect x="32" y="0" width="6" height="40" fill="#cbd5e1" />
        <text x="35" y="25" fontSize="10" fill="#1e40af" fontWeight="bold">-</text>

        {/* Top Cap */}
        <ellipse cx="25" cy="0" rx="15" ry="4" fill="#94a3b8" stroke="#64748b" />

        <text x="25" y="25" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{val}</text>
    </g>
);

// 3. LED (5mm)
export const LED3D = ({ color = "#ef4444", on = false }: { color?: string, on?: boolean }) => (
    <g filter="url(#drop-shadow-3d)">
        {/* Legs */}
        <path d="M 15 35 L 15 50" stroke="url(#metal-lead)" strokeWidth="3" />
        <path d="M 25 35 L 25 45" stroke="url(#metal-lead)" strokeWidth="3" /> {/* Shorter Anode/Cathode detail */}

        {/* Dome */}
        <path d="M 10 35 L 30 35 L 30 25 A 10 10 0 0 0 10 25 Z" fill={color} opacity={on ? 1 : 0.6} />

        {/* Glow */}
        {on && <circle cx="20" cy="20" r="15" fill={color} filter="blur(8px)" opacity="0.6" />}

        {/* Highlight Reflection */}
        <ellipse cx="16" cy="18" rx="3" ry="5" fill="white" opacity="0.4" transform="rotate(-15 16 18)" />
    </g>
);

// 4. DIP IC (Generic Generator)
export const DipIC3D = ({ pins = 14, label = "74LS08" }: { pins?: number, label?: string }) => {
    const width = pins * 5 + 20; // Dynamic width
    const height = 30;

    return (
        <g filter="url(#drop-shadow-3d)">
            {/* Legs Top */}
            {Array.from({ length: pins / 2 }).map((_, i) => (
                <path key={`t-${i}`} d={`M ${15 + i * 10} 0 L ${15 + i * 10} ${-5}`} stroke="url(#metal-lead)" strokeWidth="4" />
            ))}

            {/* Legs Bottom */}
            {Array.from({ length: pins / 2 }).map((_, i) => (
                <path key={`b-${i}`} d={`M ${15 + i * 10} ${height} L ${15 + i * 10} ${height + 5}`} stroke="url(#metal-lead)" strokeWidth="4" />
            ))}

            {/* Body */}
            <rect x="5" y="0" width={width} height={height} rx="2" fill="url(#body-ic-black)" />

            {/* Notch */}
            <circle cx="5" cy={height / 2} r="3" fill="#2A2D35" />

            {/* Label */}
            <text x={width / 2 + 5} y={height / 2 + 4} textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="monospace" letterSpacing="1">
                {label}
            </text>

            {/* Pin 1 Dot */}
            <circle cx="15" cy="25" r="2" fill="#e2e8f0" opacity="0.5" />
        </g>
    );
};

// 5. Transistor (TO-92)
export const Transistor3D = ({ type = "NPN" }) => (
    <g filter="url(#drop-shadow-3d)">
        <path d="M 15 25 L 15 45" stroke="url(#metal-lead)" strokeWidth="2" />
        <path d="M 25 25 L 25 45" stroke="url(#metal-lead)" strokeWidth="2" />
        <path d="M 35 25 L 35 45" stroke="url(#metal-lead)" strokeWidth="2" />

        {/* Half Cylinder shape */}
        <path d="M 10 25 L 40 25 L 40 5 A 15 10 0 0 0 10 5 Z" fill="#1A1D24" />
        <text x="25" y="20" textAnchor="middle" fill="white" fontSize="6">{type}</text>
    </g>
);

// 6. Inductor (Coil)
export const Inductor3D = () => (
    <g filter="url(#drop-shadow-3d)">
        <path d="M 0 10 C 5 0, 10 0, 15 10" stroke="#d97706" strokeWidth="3" fill="none" />
        <path d="M 15 10 C 20 0, 25 0, 30 10" stroke="#d97706" strokeWidth="3" fill="none" />
        <path d="M 30 10 C 35 0, 40 0, 45 10" stroke="#d97706" strokeWidth="3" fill="none" />
        <path d="M 45 10 C 50 0, 55 0, 60 10" stroke="#d97706" strokeWidth="3" fill="none" />

        <rect x="10" y="8" width="40" height="4" fill="#4b5563" rx="2" opacity="0.8" /> {/* Core */}
    </g>
);
