import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SignalRibbon } from './SignalRibbon';
import { ParticleField } from './ParticleField';

export const SignalScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ backgroundColor: 'transparent', zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.0} />
          <pointLight position={[10, 10, 10]} />
          
          <ParticleField />

          {/* Precision Signal Ribbon */}
          <SignalRibbon position={[0, 0, 0]} opacity={1.0} />

          <ambientLight intensity={0.6} />
        </Suspense>
      </Canvas>
    </div>
  );
};
