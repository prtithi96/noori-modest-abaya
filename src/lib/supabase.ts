import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Reads from env variables or browser storage if dynamically configured
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const getSupabaseConfig = () => {
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('noori_supabase_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('noori_supabase_anon_key') : null;

  const url = storedUrl || envUrl;
  const key = storedKey || envAnonKey;

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    !url.includes('your-project-id')
  );

  return { url, key, isConfigured };
};

export const setStoredSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('noori_supabase_url', url.trim());
    localStorage.setItem('noori_supabase_anon_key', key.trim());
    window.location.reload();
  }
};

export const clearStoredSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('noori_supabase_url');
    localStorage.removeItem('noori_supabase_anon_key');
    window.location.reload();
  }
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return cachedClient;
};
