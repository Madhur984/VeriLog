
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TrainingCockpitPage } from './pages/TrainingCockpitPage';
import { HeroExperience } from './pages/HeroExperience';
import { SignalPlayground } from './pages/SignalPlayground';
import { GatekeeperGame } from './pages/GatekeeperGame';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Main Activity Route */}
                <Route path="/" element={<HeroExperience />} />
                <Route path="/training" element={<TrainingCockpitPage />} />
                <Route path="/playground" element={<SignalPlayground />} />
                <Route path="/gatekeeper" element={<GatekeeperGame />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}