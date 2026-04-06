import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SignalRibbon } from './SignalRibbon';
import { useSignalStore } from '../../store/signalStore';

export const SignalScene: React.FC = () => {
  const scene = useSignalStore((s) => s.scene);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#0A0A0A']} />
          
          {/* Main Ribbon */}
          <SignalRibbon position={[0, 0, 0]} opacity={1.0} />

          {/* Depth Trails (Ghost Layers) - subtle depth experience */}
          <SignalRibbon position={[0, 0, -0.1]} opacity={0.3} />
          <SignalRibbon position={[0, 0, -0.2]} opacity={0.1} />

          {/* S09 Secondary Signal for Interference Study */}
          {scene === 9 && (
            <>
              <SignalRibbon position={[0, 0.1, -0.4]} opacity={0.4} isSecondary={true} />
              <SignalRibbon position={[0, 0.05, -0.3]} opacity={0.2} isSecondary={true} />
            </>
          )}

          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};
