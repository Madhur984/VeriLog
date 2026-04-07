import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SignalRibbon } from './SignalRibbon';
import { ParticleField } from './ParticleField';
import { canvasState } from '../../engine/canvasState';

/**
 * Tunnel Effect — High-fidelity wireframe rings.
 */
const Tunnel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const count = 12;
  const rings = Array.from({ length: count });

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Driven by canvasState
    groupRef.current.position.z = (canvasState.introProgress * 0.1) % 5;
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      mesh.position.z = -i * 2 + (t * 2 % 2);
      mesh.scale.setScalar(1 + i * 0.2);
      (mesh.material as THREE.MeshBasicMaterial).opacity = canvasState.tunnelOpacity * (1 - i/count);
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((_, i) => (
        <mesh key={i}>
          <ringGeometry args={[1.5, 1.52, 64]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * CameraController — Syncs R3F camera with canvasState.
 */
const CameraController: React.FC = () => {
  useFrame((state) => {
    state.camera.position.z += (canvasState.cameraZ - state.camera.position.z) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

export const SignalScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ backgroundColor: 'transparent', zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <ambientLight intensity={1.0} />
          <pointLight position={[10, 10, 10]} />
          
          <Tunnel />
          <ParticleField />

          <SignalRibbon position={[0, 0, 0]} opacity={1.0} />
          <ambientLight intensity={0.6} />
        </Suspense>
      </Canvas>
    </div>
  );
};
