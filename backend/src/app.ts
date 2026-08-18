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
import voltmonkeyRoutes from './voltmonkey/router';
import { requireAuth } from './middleware/requireAuth';

// Auth routes are public (they ARE the auth flow).
app.use('/api/auth', authRoutes);
// Everything else requires a valid session (Supabase JWT or guest token).
app.use('/api/activities', requireAuth, activityRoutes);
// VoltMonkey is public (open chat widget, no login wall), same as the Edge
// Function it replaces — it has its own per-IP rate limit instead.
app.use('/api/voltmonkey', voltmonkeyRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('--- Global Error ---');
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Engine Internal Error',
        type: 'SYSTEM_FAULT'
    });
});

// Keep process alive
setInterval(() => {
    if (process.env.NODE_ENV === 'development') {
        // console.log('Heartbeat: Engine Persistence Active');
    }
}, 60000);

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`⚡️ [Server]: VeriQuest Engine running at http://localhost:${PORT}`);
    console.log(`📡 [Network]: Listening on 0.0.0.0 (All Interfaces)`);
});
