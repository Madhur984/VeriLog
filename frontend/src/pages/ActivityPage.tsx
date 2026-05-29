import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimulatorCanvas } from '../components/Simulator/SimulatorCanvas';
import axios from 'axios';

export const ActivityPage = () => {
    const { id } = useParams();
    const [_activity, setActivity] = useState<any>(null);

    useEffect(() => {
        // Fetch from backend (fallback to local if fails for Phase 1 demo)
        axios.get(`/api/activities/${id}`)
            .then(res => setActivity(res.data))
            .catch(err => console.warn("Using local fallback", err));
    }, [id]);

    return (
        <div className="w-full min-h-[100svh]">
            {/* Logic to initialize simulator based on activity data would go here */}
            {/* For now, render the generic canvas */}
            <SimulatorCanvas />
        </div>
    );
};
