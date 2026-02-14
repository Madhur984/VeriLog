import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'VeriQuest Engine Online', version: '1.0' });
});

import activityRoutes from './routes/activities';
import authRoutes from './routes/auth';

app.use('/api/activities', activityRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`⚡️ [Server]: VeriQuest Engine running at http://localhost:${PORT}`);
});
