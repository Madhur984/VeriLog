import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Breadboard3D } from '../Three/Breadboard3D';
import { Chip3D } from '../Three/Chip3D';
import { Terminal, Settings, Layers, Box, Zap } from 'lucide-react';

interface PlacedChip {
    id: string;
    type: 'AND' | 'OR' | 'NOT' | 'BATTERY' | 'LED';
    position: [number, number, number];
}

export const Workbench = () => {
    const [chips, setChips] = useState<PlacedChip[]>([]);
    const [selectedChipId, setSelectedChipId] = useState<string | null>(null);

    const addChip = (type: PlacedChip['type']) => {
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
        <div className="relative flex-1 h-full bg-[#F8FAFC]">
            {/* Header / Info Panel */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xl flex items-center gap-4">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                        <Terminal size={18} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment</h2>
                        <p className="text-sm font-black text-slate-900 italic">3D_WORKSPACE_01</p>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xl flex items-center gap-4 opacity-60">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Box size={18} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entity Count</h2>
                        <p className="text-sm font-black text-slate-900 italic">{chips.length} Active Nodes</p>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="w-full h-full bg-slate-50 relative">
                <Canvas shadows camera={{ position: [5, 8, 8], fov: 45 }}>
                    <Suspense fallback={null}>
                        <Breadboard3D>
                            {chips.map(chip => (
                                <Chip3D
                                    key={chip.id}
                                    type={chip.type}
                                    position={chip.position}
                                    isSelected={selectedChipId === chip.id}
                                    onClick={() => setSelectedChipId(chip.id)}
                                />
                            ))}
                        </Breadboard3D>

                        <ContactShadows position={[0, 0, 0]} opacity={0.2} scale={20} blur={2} far={4} />
                        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Quick Actions Panel */}
            <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                <button className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-200 hover:shadow-lg transition-all active:scale-90">
                    <Settings size={20} />
                </button>
                <button className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-200 hover:shadow-lg transition-all active:scale-90">
                    <Layers size={20} />
                </button>
            </div>

            {/* Component Tray Overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-bg-elev border-2 border-edge shadow-brutal rounded-[40px] p-4 flex gap-6">
                {['BATTERY', 'LED', 'AND', 'OR'].map((type) => (
                    <button
                        key={type}
                        onClick={() => addChip(type as any)}
                        className="group flex flex-col items-center gap-2"
                    >
                        <div className="w-16 h-16 bg-slate-50 border-2 border-slate-100 rounded-[24px] flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:border-sky-400 group-hover:text-white transition-all transform group-active:scale-90 shadow-sm group-hover:shadow-sky-200"
                        >
                            <span className="text-[10px] font-black uppercase tracking-tighter">{type.slice(0, 3)}</span>
                        </div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
                    </button>
                ))}
            </div>
            
            {selectedChipId && (
                <div className="absolute bottom-10 right-10 bg-white border border-slate-200 rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                            <Zap size={16} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Node Config</h3>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mb-6 font-mono">ID: {selectedChipId}</p>
                    <button 
                        onClick={() => {
                            setChips(chips.filter(c => c.id !== selectedChipId));
                            setSelectedChipId(null);
                        }}
                        className="w-full py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                    >
                        Decommission
                    </button>
                </div>
            )}
        </div>
    );
};
