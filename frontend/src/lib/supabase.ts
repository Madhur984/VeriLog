import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://uhtfagdxxvasbtagovwk.supabase.co';
export const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodGZhZ2R4eHZhc2J0YWdvdndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzE5NDQsImV4cCI6MjA4NjY0Nzk0NH0.yfdtJG1aNziJaoteQwXzrQ-V_cnFC-IopGbs0Lt3nn0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
