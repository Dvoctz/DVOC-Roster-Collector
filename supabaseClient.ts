// Fix: Add Vite client type definitions for `import.meta.env`.
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

// In a Vite project, environment variables are accessed via `import.meta.env`.
// These variables are replaced at build time by Vercel.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // This error will be thrown if the environment variables are not set in your Vercel project.
    throw new Error("Supabase credentials are not defined. Ensure you have set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel project settings and redeployed.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
