import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SignalRibbon } from './SignalRibbon';
import { ParticleField } from './ParticleField';

export const SignalScene: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#0A0A0A']} />
          
          <ParticleField />

          {/* Precision Signal Ribbon */}
          <SignalRibbon position={[0, 0, 0]} opacity={1.0} />

          <ambientLight intensity={0.6} />
        </Suspense>
      </Canvas>
    </div>
  );
};

