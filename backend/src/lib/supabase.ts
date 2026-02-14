import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

console.log('--- Supabase Initialization ---');
console.log('URL Status:', supabaseUrl ? 'Present' : 'MISSING');
console.log('Key Status:', supabaseAnonKey ? 'Present' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase credentials missing from environmental variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Supabase client successfully initialized.');
