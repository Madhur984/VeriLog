
import { CockpitLayout } from '../components/Cockpit/CockpitLayout';
import { MissionLog } from '../components/Cockpit/MissionLog';
import { Synthesizer } from '../components/Cockpit/Synthesizer';
import { Oscilloscope } from '../components/Cockpit/Oscilloscope';

export const TrainingCockpitPage = () => {
    return (
        <CockpitLayout>
            <MissionLog />
            <Synthesizer />
            <Oscilloscope />
        </CockpitLayout>
    );
};
