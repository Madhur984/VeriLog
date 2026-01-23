
import { TrainingCockpitLayout } from '../components/Cockpit/TrainingCockpitLayout';
import { MissionLog } from '../components/Cockpit/MissionLog';
import { Workbench } from '../components/Cockpit/Workbench';
import { Oscilloscope } from '../components/Cockpit/Oscilloscope';

export const TrainingCockpitPage = () => {
    return (
        <TrainingCockpitLayout
            missionPanel={<MissionLog />}
            editorPanel={<Workbench />}
            visualizerPanel={<Oscilloscope />}
        />
    );
};
