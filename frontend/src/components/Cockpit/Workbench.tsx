import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Breadboard3D } from '../Three/Breadboard3D';
import { Chip3D } from '../Three/Chip3D';
import { VoltBot } from '../ui/VoltBot';

interface PlacedChip {
    id: string;
    type: 'AND' | 'OR' | 'NOT' | 'BATTERY' | 'LED';
    position: [number, number, number];
}

export const Workbench = () => {
    const [chips, setChips] = useState<PlacedChip[]>([]);

    const addChip = (type: PlacedChip['type']) => {
        // Simple spawn logic: Random position near center
        const x = Math.round((Math.random() * 4 - 2));
        const z = Math.round((Math.random() * 4 - 2));
        const newChip: PlacedChip = {
            id: `chip-${Date.now()}`,
            type,
            position: [x, 0.5, z]
        };
        setChips([...chips, newChip]);
    };

    return (
        <div className="relative flex-1 h-full bg-deep-void">
            <Canvas shadows camera={{ position: [5, 8, 8], fov: 45 }}>
                <Suspense fallback={null}>
                    <Breadboard3D>
                        {chips.map(chip => (
                            <Chip3D
                                key={chip.id}
                                type={chip.type}
                                position={chip.position}
                                isSelected={false}
                                onClick={() => console.log('Clicked chip', chip.id)}
                            />
                        ))}
                    </Breadboard3D>

                    {/* Bot Overlay */}
                    <VoltBot state="idle" message="Initializing workbench..." className="fixed bottom-8 right-8 scale-90" />

                    <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4} />
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
                </Suspense>
            </Canvas>

            {/* Component Tray Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-panel-grey/90 backdrop-blur border border-bezel-grey rounded-2xl p-2 flex gap-4 shadow-2xl">
                {['BATTERY', 'LED', 'AND', 'OR'].map((type) => (
                    <button
                        key={type}
                        onClick={() => addChip(type as any)}
                        className="w-16 h-16 bg-deep-void border border-bezel-grey rounded-xl flex items-center justify-center text-xs font-mono text-slate-400 hover:text-terminal-green hover:border-terminal-green hover:shadow-[0_0_15px_rgba(0,220,130,0.3)] transition-all active:scale-95"
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
};
