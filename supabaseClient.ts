import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase Project URL and Anon Key.
// You can find these in your Supabase project settings under 'API'.
const supabaseUrl = 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

if (supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.error("Supabase credentials are not set. Please update supabaseClient.ts with your project's URL and Anon key.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
