// ══════════════════════════════════════════════════════════════
// Supabase client — MySchool App (VidDarpan)
// Credentials loaded from .env via EXPO_PUBLIC_ env vars
// ══════════════════════════════════════════════════════════════
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials missing! Check .env file.'
  );
}

// AsyncStorage can only run on the client (React Native / browser).
// During Expo Router's SSR pre-render on Node.js, `window` is
// undefined and AsyncStorage will crash. So we load it lazily.
let storage: any = undefined;
if (typeof window !== 'undefined') {
  try {
    storage = require('@react-native-async-storage/async-storage').default;
  } catch {
    // Fallback: web environment
    storage = globalThis.localStorage;
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(storage ? { storage } : {}),
    autoRefreshToken: true,
    persistSession: typeof window !== 'undefined',
    detectSessionInUrl: false,
  },
});
