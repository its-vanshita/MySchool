// ══════════════════════════════════════════════════════════════
// Supabase client — MySchool App
// Uses the same Supabase project as ClassPulse / ParentPulse.
// ══════════════════════════════════════════════════════════════
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// ──────────────────────────────────────────────────────────────
// Replace with your Supabase project values:
//   Dashboard → Settings → API → Project URL  &  anon / public key
// ──────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://uhmssrajcefslpkygrxy.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVobXNzcmFqY2Vmc2xwa3lncnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgzMzcsImV4cCI6MjA4Nzc4NDMzN30.y_AHuqyGelUl136NmsiRNbwHBD_TVSTHVsbRIKOImm8';

let storage: any = undefined;
if (typeof window !== 'undefined') {
  if (Platform.OS !== 'web') {
    storage = require('@react-native-async-storage/async-storage').default;
  } else {
    storage = globalThis.localStorage;
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    ...(storage ? { storage } : {}),
    autoRefreshToken: true,
    persistSession: typeof window !== 'undefined',
    detectSessionInUrl: false,
  },
});
