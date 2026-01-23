import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '../../lib/utils';

interface CyberPCB3DProps {
    className?: string;
    intensity?: number;
}

const CircuitTrace = ({ points, color, speed }: any) => {
    const ref = useRef<any>();

    // Create geometry from points
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(
            points.map((p: any) => new THREE.Vector3(...p))
        );
    }, [points]);

    useFrame((_state) => {
        if (ref.current) {
            // Animate dashed line offset to simulate electron flow
            ref.current.material.dashOffset -= speed * 0.01;
        }
    });

    return (
        <mesh>
            <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
            <meshBasicMaterial
                ref={ref}
                color={color}
                transparent
                opacity={0.6}
            />
        </mesh>
    );
};

const ElectronPacket = ({ route }: any) => {
    const ref = useRef<any>();
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(
            route.map((p: any) => new THREE.Vector3(...p))
        );
    }, [route]);

    useFrame((state) => {
        if (ref.current) {
            const t = (state.clock.elapsedTime * 0.5) % 1;
            const pos = curve.getPoint(t);
            ref.current.position.copy(pos);
        }
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#00ffcc" />
            <pointLight distance={2} intensity={2} color="#00ffcc" />
        </mesh>
    );
};

const GridFloor = () => {
    return (
        <gridHelper
            args={[50, 50, 0x1e293b, 0x0f172a]}
            position={[0, -2, 0]}
        />
    );
}


export const CyberPCB3D: React.FC<CyberPCB3DProps> = ({ className, intensity: _intensity = 1 }) => {

    // Generate some random routes for traces
    const routes = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 10; i++) {
            // z unused
            const xVal = (Math.random() * 20) - 10;
            // Simple path: Start -> Mid -> End
            arr.push([
                [xVal, -2, -10],
                [xVal + (Math.random() * 5 - 2.5), (Math.random() * 4) - 1, 0],
                [xVal, -2, 10]
            ]);
        }
        return arr;
    }, []);

    return (
        <div className={cn("absolute inset-0 -z-10 bg-slate-950", className)}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={60} />
                <ambientLight intensity={0.5} />

                <GridFloor />

                <fog attach="fog" args={['#0f172a', 5, 25]} />

                {/* Circuit Traces */}
                {routes.map((route, i) => (
                    <group key={i}>
                        <CircuitTrace
                            points={route}
                            color={i % 2 === 0 ? "#3A86FF" : "#2EC4B6"}
                            speed={1 + Math.random()}
                        />
                        <ElectronPacket route={route} />
                    </group>
                ))}

                {/* Floating Particles or "Data" */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <mesh key={i} position={[
                        (Math.random() * 30) - 15,
                        (Math.random() * 10) - 5,
                        (Math.random() * 20) - 10
                    ]}>
                        <boxGeometry args={[0.05, 0.05, 0.05]} />
                        <meshBasicMaterial color={Math.random() > 0.5 ? "#FFBE0B" : "#3A86FF"} />
                    </mesh>
                ))}
            </Canvas>
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)] pointer-events-none" />
        </div>
    );
};
