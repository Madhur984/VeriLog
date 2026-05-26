import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

app.use(cors());

// --- AI service reverse proxy ---------------------------------------------
// Mount BEFORE express.json() so streaming POST bodies are forwarded
// byte-for-byte. http-proxy-middleware v3 uses `pathFilter` instead of
// Express's app.use(path) prefix-strip semantics; this preserves /ai/* in
// the forwarded URL so FastAPI sees the exact same path.
const aiProxy = createProxyMiddleware({
    target: AI_SERVICE_URL,
    changeOrigin: true,
    pathFilter: '/ai/**',
    proxyTimeout: 10 * 60 * 1000,
    timeout: 10 * 60 * 1000,
    logger: console,
    on: {
        proxyReq: (proxyReq: any, req: any) => {
            console.log(`[ai-proxy] → ${req.method} ${req.url} → ${AI_SERVICE_URL}${req.url}`);
            proxyReq.setHeader('Accept-Encoding', 'identity');
        },
        error: (err: any, _req: any, res: any) => {
            console.error('[ai-proxy] error:', err.message);
            if (res && !res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'ai_service_unreachable',
                    detail: `Could not reach AI service at ${AI_SERVICE_URL}: ${err.message}`,
                }));
            }
        },
    },
});
app.use(aiProxy as any);

app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        message: 'VeriQuest Engine Online',
        version: '1.0',
        ai_service: AI_SERVICE_URL,
    });
});

import activityRoutes from './routes/activities';
import authRoutes from './routes/auth';

app.use('/api/activities', activityRoutes);
app.use('/api/auth', authRoutes);

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
