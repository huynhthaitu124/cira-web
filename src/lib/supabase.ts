import { createClient } from '@supabase/supabase-js';

// Make env vars optional during build, validate at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
    return !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey);
};

// Create clients (will be dummy clients if not configured)
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

// Server-side client with service role key (for admin operations)
export const supabaseAdmin = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseServiceKey || 'placeholder-key',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Types
export interface WaitlistEntry {
    id: string;
    email: string;
    language: 'vi' | 'en';
    created_at: string;
    email_sent: boolean;
    email_sent_at: string | null;
    metadata: Record<string, any>;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject_vi: string;
    subject_en: string;
    body_vi: string;
    body_en: string;
    created_at: string;
    updated_at: string;
}
