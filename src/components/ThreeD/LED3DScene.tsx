import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface LED3DModelProps {
    position?: [number, number, number];
    isOn?: boolean;
    color?: string;
}

const LED3DModel: React.FC<LED3DModelProps> = ({
    position = [0, 0, 0],
    isOn = false,
    color = '#ef4444'
}) => {
    const meshRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
        if (lightRef.current && isOn) {
            lightRef.current.intensity = 2 + Math.sin(Date.now() * 0.005) * 0.5;
        }
    });

    return (
        <group ref={meshRef} position={position}>
            {/* LED dome */}
            <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshPhysicalMaterial
                    color={isOn ? color : '#666666'}
                    transparent
                    opacity={0.8}
                    roughness={0.1}
                    metalness={0.1}
                    transmission={0.5}
                    emissive={isOn ? color : '#000000'}
                    emissiveIntensity={isOn ? 1 : 0}
                />
            </mesh>

            {/* LED base */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />
                <meshStandardMaterial color="#333333" roughness={0.8} />
            </mesh>

            {/* Cathode (shorter leg) */}
            <mesh position={[-0.15, -0.4, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.5, 16]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Anode (longer leg) */}
            <mesh position={[0.15, -0.5, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.7, 16]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Point light when LED is on */}
            {isOn && (
                <pointLight
                    ref={lightRef}
                    position={[0, 0.3, 0]}
                    color={color}
                    intensity={2}
                    distance={3}
                />
            )}
        </group>
    );
};

export const LED3DScene: React.FC<{ className?: string; isOn?: boolean; color?: string }> = ({
    className,
    isOn = false,
    color = '#22c55e'
}) => {
    return (
        <div className={className} style={{ width: '100%', height: '200px' }}>
            <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={0.5} />
                <LED3DModel isOn={isOn} color={color} />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
};
