import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://itsyfxwcvvfkazqgfivb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY_HERE'; // TODO: Update with real anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
