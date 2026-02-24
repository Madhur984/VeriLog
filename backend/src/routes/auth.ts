import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Sign Up
router.post('/signup', async (req: Request, res: Response) => {
    const { email, password, full_name } = req.body;
    console.log(`[AUTH] SIGNUP REQUEST: ${email}`);

    if (!email || !password) {
        console.warn('[AUTH] Signup missing fields');
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        console.log('[AUTH] Calling Supabase signUp...');
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: full_name || '',
                },
            },
        });

        if (error) {
            console.error('[AUTH] Supabase error during signup:', error.message);
            return res.status(400).json({ error: error.message });
        }

        console.log('[AUTH] User created successfully:', data.user?.id);
        res.status(201).json({ message: 'User created successfully', user: data.user });
    } catch (error: any) {
        console.error('[AUTH] Catch-all error in signup:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Sign In
router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`[AUTH] SIGNIN REQUEST: ${email}`);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('[AUTH] Supabase error during signin:', error.message);
            // Friendly message for email confirmation requirement
            if (error.message.toLowerCase().includes('email not confirmed')) {
                return res.status(400).json({
                    error: 'Please confirm your email before signing in. Check your inbox for a verification link.',
                });
            }
            if (error.message.toLowerCase().includes('invalid login credentials')) {
                return res.status(400).json({ error: 'Invalid email or password. Double-check and try again.' });
            }
            return res.status(400).json({ error: error.message });
        }

        // data.session is null when Supabase requires email confirmation
        if (!data.session) {
            return res.status(400).json({
                error: 'Please confirm your email before signing in. Check your inbox.',
            });
        }

        console.log('[AUTH] Login successful for:', data.user?.id);
        res.status(200).json({ message: 'Login successful', session: data.session, user: data.user });
    } catch (error: any) {
        console.error('[AUTH] Catch-all error in signin:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
