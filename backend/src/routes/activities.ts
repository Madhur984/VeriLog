import { Router } from 'express';
import { ACTIVITIES } from '../data/activities';

const router = Router();

router.get('/', (req, res) => {
    res.json(ACTIVITIES);
});

router.get('/:id', (req, res) => {
    const activity = ACTIVITIES.find(a => a.id === req.params.id);
    if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activity);
});

export default router;
