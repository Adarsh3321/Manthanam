import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://missing-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing_key';

if (supabaseUrl === 'https://missing-url.supabase.co' || supabaseAnonKey === 'missing_key') {
  console.error('CRITICAL: Missing Supabase environment variables. Database connections will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  avatar_url?: string;
  theme_preference: string;
  created_at: string;
  updated_at: string;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  entry_text: string;
  sentiment?: string;
  emotion?: string;
  stress_score?: number;
  ai_summary?: string;
  ai_affirmation?: string;
  created_at: string;
  risk_level?: string;
  confidence?: number;
};
