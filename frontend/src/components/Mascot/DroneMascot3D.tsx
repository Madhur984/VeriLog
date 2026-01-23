import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export const DroneMascot3D = ({ position }: { position: [number, number, number] }) => {
    const group = useRef<any>();

    useFrame((state) => {
        if (group.current) {
            // Gentle bobbing is handled by Float, added rotation here
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group position={position} ref={group}>
                {/* Main Body */}
                <mesh>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* Eye (Visor) */}
                <mesh position={[0, 0.1, 0.35]}>
                    <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
                    <meshStandardMaterial color="#00DC82" emissive="#00DC82" emissiveIntensity={2} />
                </mesh>

                {/* Rotors arms */}
                {[45, 135, 225, 315].map((angle, i) => (
                    <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
                        <mesh position={[0.6, 0, 0]}>
                            <boxGeometry args={[0.8, 0.1, 0.1]} />
                            <meshStandardMaterial color="#334155" />
                        </mesh>
                        {/* Propeller */}
                        <mesh position={[1, 0.1, 0]}>
                            <cylinderGeometry args={[0.4, 0.4, 0.05, 8]} />
                            <meshStandardMaterial color="#3B82F6" transparent opacity={0.6} />
                        </mesh>
                    </group>
                ))}

                {/* Antenna */}
                <mesh position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                    <meshStandardMaterial color="#94A3B8" />
                </mesh>
                <mesh position={[0, 0.9, 0]}>
                    <sphereGeometry args={[0.08]} />
                    <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={2} />
                </mesh>
            </group>
        </Float>
    );
};
