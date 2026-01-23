import { Grid } from '@react-three/drei';

export const Breadboard3D = ({ children }: { children: React.ReactNode }) => {
    return (
        <group>
            {/* Cyber Grid */}
            <Grid
                args={[20, 20]}
                cellSize={1}
                cellThickness={1}
                cellColor="#1E293B"
                sectionSize={5}
                sectionThickness={1.5}
                sectionColor="#334155"
                fadeDistance={20}
                fadeStrength={1}
                infiniteGrid
            />

            {/* Base Plane (Dark) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial color="#0F172A" />
            </mesh>

            {/* Lighting Setup */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#3B82F6" />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#EAB308" />
            <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={2} color="#00DC82" />

            {/* Components Layer */}
            <group position={[0, 0, 0]}>
                {children}
            </group>
        </group>
    );
};
