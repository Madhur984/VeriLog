import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

const LogicComponent = ({ position, color, type }: { position: [number, number, number], color: string, type: 'and' | 'chip' | 'wire' }) => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Smoothly lean toward mouse
        const x = (state.mouse.x * state.viewport.width) / 2;
        const y = (state.mouse.y * state.viewport.height) / 2;

        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, (y - position[1]) * 0.1, 0.05);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (x - position[0]) * 0.1, 0.05);
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={meshRef} position={position}>
                {type === 'and' && (
                    <mesh>
                        <capsuleGeometry args={[0.3, 0.4, 4, 16]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
                    </mesh>
                )}
                {type === 'chip' && (
                    <mesh>
                        <boxGeometry args={[0.6, 0.6, 0.1]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
                    </mesh>
                )}
                {type === 'wire' && (
                    <mesh rotation={[0, 0, Math.PI / 4]}>
                        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />
                    </mesh>
                )}
            </group>
        </Float>
    );
};

const Particles = () => {
    const { viewport } = useThree();
    const count = 40;

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const type = ['and', 'chip', 'wire'][Math.floor(Math.random() * 3)] as 'and' | 'chip' | 'wire';
            const color = ['#3A86FF', '#2EC4B6', '#F97316'][Math.floor(Math.random() * 3)];
            const pos: [number, number, number] = [
                (Math.random() - 0.5) * viewport.width * 2,
                (Math.random() - 0.5) * viewport.height * 2,
                (Math.random() - 0.5) * 5
            ];
            temp.push({ id: i, pos, color, type });
        }
        return temp;
    }, [viewport]);

    return (
        <>
            {particles.map((p) => (
                <LogicComponent key={p.id} position={p.pos} color={p.color} type={p.type} />
            ))}
        </>
    );
};

export const LogicStormBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none bg-[#0F172A]">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="#3A86FF" intensity={0.5} />

                <Particles />

                {/* Subtle grid in 3D space */}
                <gridHelper args={[20, 20, '#1E293B', '#1E293B']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]} />

                <fog attach="fog" args={['#0F172A', 5, 15]} />
            </Canvas>
        </div>
    );
};
