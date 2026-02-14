import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// Sign Up
router.post('/signup', async (req: Request, res: Response) => {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: full_name || '',
                },
            },
        });

        if (error) throw error;
        res.status(201).json({ message: 'User created successfully', user: data.user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Sign In
router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        res.status(200).json({ message: 'Login successful', session: data.session, user: data.user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
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
