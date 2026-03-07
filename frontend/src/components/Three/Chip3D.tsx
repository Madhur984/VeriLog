import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Chip3DProps {
    type: 'AND' | 'OR' | 'NOT' | 'BATTERY' | 'LED';
    position: [number, number, number];
    label?: string;
    color?: string;
    isSelected?: boolean;
    onClick?: () => void;
}

export const Chip3D: React.FC<Chip3DProps> = ({ type, position, label, color = '#1A1D24', isSelected, onClick }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const glowColor = isSelected ? '#00DC82' : '#10B981';

    useFrame((state) => {
        if (mesh.current && isSelected) {
            // Floating animation when selected
            mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.5;
        }
    });

    const isPower = type === 'BATTERY';
    const bodyWidth = isPower ? 2.5 : 2;
    const bodyHeight = 0.5;
    const bodyDepth = 1.2;

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
            {/* Chip Body */}
            <RoundedBox ref={mesh} args={[bodyWidth, bodyHeight, bodyDepth]} radius={0.1} smoothness={4}>
                <meshStandardMaterial
                    color={color}
                    roughness={0.3}
                    metalness={0.8}
                    emissive={isSelected ? glowColor : '#000000'}
                    emissiveIntensity={0.2}
                />
            </RoundedBox>

            {/* Label */}
            <Text
                position={[0, bodyHeight / 2 + 0.01, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.4}
                color={isPower ? '#000000' : '#FFFFFF'}
                font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0pnF8RD8yKxTOlOV.woff"
            >
                {label || type}
            </Text>

            {/* Pins (Simple Visuals) */}
            {!isPower && Array.from({ length: 4 }).map((_, i) => (
                <mesh key={`pin-l-${i}`} position={[-0.6 + i * 0.4, -0.2, 0.6]} rotation={[0.2, 0, 0]}>
                    <boxGeometry args={[0.1, 0.4, 0.1]} />
                    <meshStandardMaterial color="#94A3B8" metalness={1} roughness={0.2} />
                </mesh>
            ))}
            {!isPower && Array.from({ length: 4 }).map((_, i) => (
                <mesh key={`pin-r-${i}`} position={[-0.6 + i * 0.4, -0.2, -0.6]} rotation={[-0.2, 0, 0]}>
                    <boxGeometry args={[0.1, 0.4, 0.1]} />
                    <meshStandardMaterial color="#94A3B8" metalness={1} roughness={0.2} />
                </mesh>
            ))}

            {/* Selection Ring (Hologram) */}
            {isSelected && (
                <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.2, 1.3, 32]} />
                    <meshBasicMaterial color={glowColor} transparent opacity={0.5} side={THREE.DoubleSide} />
                </mesh>
            )}
        </group>
    );
};
