import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, PerspectiveCamera, Stars } from '@react-three/drei';

interface LogicGate3DProps {
    type: 'and' | 'or' | 'nand' | 'nor' | 'not';
    color?: string;
}

const GateMesh = ({ type, color = '#3B82F6' }: LogicGate3DProps) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        // Gentle rotation based on mouse
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.4, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.mouse.y * 0.4, 0.1);
    });

    return (
        <group ref={groupRef}>
            {/* IC Package Base */}
            <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[4, 0.15, 2]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
            </mesh>

            {/* Pins */}
            {[-1.5, -0.5, 0.5, 1.5].map((x) => (
                <group key={x}>
                    <mesh position={[x, -0.2, 0.9]}>
                        <boxGeometry args={[0.08, 0.4, 0.08]} />
                        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.2} />
                    </mesh>
                    <mesh position={[x, -0.2, -0.9]}>
                        <boxGeometry args={[0.08, 0.4, 0.08]} />
                        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.2} />
                    </mesh>
                </group>
            ))}

            {/* Symbols (Raised from base) */}
            <group position={[0, 0.15, 0]} scale={[1.2, 1.2, 1.2]}>
                {/* Inputs */}
                <mesh position={[-1.2, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.04, 0.04, 1]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                </mesh>
                {type !== 'not' && (
                    <mesh position={[-1.2, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.04, 0.04, 1]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                    </mesh>
                )}

                {/* Main Body */}
                {type === 'and' || type === 'nand' ? (
                    <mesh position={[-0.2, 0, 0]}>
                        <boxGeometry args={[1, 1.2, 0.2]} />
                        <meshStandardMaterial color={color} transparent opacity={0.8} />
                    </mesh>
                ) : null}
                {(type === 'and' || type === 'nand') && (
                    <mesh position={[0.3, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.6, 0.6, 0.2, 32, 1, false, -Math.PI / 2, Math.PI]} />
                        <meshStandardMaterial color={color} transparent opacity={0.8} />
                    </mesh>
                )}

                {type === 'or' || type === 'nor' ? (
                    <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <sphereGeometry args={[0.7, 32, 16, 0, Math.PI]} />
                        <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
                    </mesh>
                ) : null}

                {type === 'not' && (
                    <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.6, 1.2, 3]} />
                        <meshStandardMaterial color={color} transparent opacity={0.8} />
                    </mesh>
                )}

                {/* Output Bubble */}
                {(type === 'nand' || type === 'nor' || type === 'not') && (
                    <mesh position={[1, 0, 0]}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1.5} />
                    </mesh>
                )}

                {/* Output wire */}
                <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.04, 0.04, 1]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                </mesh>
            </group>
        </group>
    );
};

export const LogicGate3D: React.FC<LogicGate3DProps> = (props) => {
    return (
        <div className="w-full h-64 bg-slate-900/50 rounded-3xl border-4 border-slate-900 overflow-hidden shadow-inner">
            <Canvas gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <GateMesh {...props} />
                </Float>
                <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    );
};
