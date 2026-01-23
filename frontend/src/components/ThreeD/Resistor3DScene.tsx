import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Resistor3DModelProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
}

const Resistor3DModel: React.FC<Resistor3DModelProps> = ({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1
}) => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
            {/* Resistor body */}
            <mesh>
                <cylinderGeometry args={[0.15, 0.15, 1, 32]} />
                <meshStandardMaterial color="#f5deb3" roughness={0.7} metalness={0.1} />
            </mesh>

            {/* Color bands */}
            <mesh position={[-0.3, 0, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[-0.1, 0, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[0.1, 0, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />
                <meshStandardMaterial color="#FF0000" />
            </mesh>
            <mesh position={[0.3, 0, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.06, 32]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Metal leads */}
            <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    );
};

export const Resistor3DScene: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={className} style={{ width: '100%', height: '200px' }}>
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <Resistor3DModel />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
};
