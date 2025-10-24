import { createClient } from '@supabase/supabase-js';

// These variables will be loaded from your Vercel project settings.
// The VITE_ prefix is important for Vite-based projects to expose them to the frontend.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are not set in environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel project settings.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
