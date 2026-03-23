import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../config/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { UserRole } from '../types';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (uniqueId: string, password: string) => Promise<{ isFirstLogin: boolean }>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  resetPassword: (uniqueId: string) => Promise<void>;
  enterDemoMode: (role?: UserRole) => void;
  isDemo: boolean;
  demoRole: UserRole;
  error: string | null;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

function sanitizeError(raw: unknown): string {
  if (!raw) return 'Something went wrong';
  const str = typeof raw === 'string' ? raw : (raw as any)?.message ?? String(raw);
  if (str.startsWith('{') || str.startsWith('[') || str.length > 150) {
    return 'Could not connect to server. Please check your internet connection.';
  }
  if (/network|aborted|timeout|fetch/i.test(str)) {
    return 'Could not connect to server. Please check your internet connection.';
  }
  return str;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 1500): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const isNetwork = /network|aborted|timeout|fetch/i.test(err?.message ?? '');
      if (i < retries && isNetwork) {
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Request failed after retries');
}

/** Convert unique_id to a deterministic email for Supabase Auth */
function uniqueIdToEmail(uniqueId: string): string {
  return `${uniqueId.toLowerCase().replace(/\s+/g, '')}@myschool.app`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [demoRole, setDemoRole] = useState<UserRole>('teacher');
  const [error, setErrorRaw] = useState<string | null>(null);

  const setError = (val: string | null) => setErrorRaw(val ? sanitizeError(val) : null);

  useEffect(() => {
    try {
      // Set a timeout so demo mode isn't blocked by slow network
      const timeout = setTimeout(() => {
        if (loading) setLoading(false);
      }, 3000);

      supabase.auth
        .getSession()
        .then(({ data: { session: s } }) => {
          setSession(s);
          setUser(s?.user ?? null);
          setLoading(false);
          clearTimeout(timeout);
        })
        .catch((err) => {
          console.warn('Failed to get session:', err);
          setLoading(false);
          clearTimeout(timeout);
        });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setLoading(false);
      });

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error('Auth initialization error:', err);
      setLoading(false);
    }
  }, []);

  const signIn = async (uniqueId: string, password: string, isEmail = false): Promise<{ isFirstLogin: boolean }> => {
    setError(null);

    let email = uniqueId.trim().toLowerCase();

    if (!isEmail) {
        // Look up the user by unique_id to get their email
        const { data: userRow, error: lookupErr } = await supabase
        .from('users')
        .select('email, is_first_login')
        .eq('unique_id', uniqueId.toUpperCase().trim())
        .single();

        if (lookupErr || !userRow) {
            const msg = 'Invalid Unique ID. Please check and try again.';
            setError(msg);
            throw new Error(msg);
        }
        email = userRow.email;
    }

    let result;
    try {
      result = await withRetry(() => supabase.auth.signInWithPassword({ email, password }));
    } catch {
      const msg = 'Could not connect to server. Please check your internet connection.';
      setError(msg);
      throw new Error(msg);
    }
    if (result.error) {
      const raw = sanitizeError(result.error.message);
      const msg = raw.includes('Invalid login credentials')
        ? 'Incorrect Email/ID or Password. Please try again.'
        : raw.includes('rate limit')
        ? 'Too many attempts. Please wait a few minutes.'
        : raw;
      setError(msg);
      throw new Error(msg);
    }

    const { data: userRow } = await supabase
        .from('users')
        .select('is_first_login')
        .eq('id', result.data.user.id)
        .single();

    return { isFirstLogin: userRow?.is_first_login ?? false };
  };

  const changePassword = async (newPassword: string) => {
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) {
      const msg = sanitizeError(err.message);
      setError(msg);
      throw new Error(msg);
    }
    // Mark first login as complete
    if (user) {
      await supabase.from('users').update({ is_first_login: false }).eq('id', user.id);
    }
  };

  const resetPassword = async (uniqueId: string) => {
    setError(null);

    // Look up email from unique_id
    const { data: userRow, error: lookupErr } = await supabase
      .from('users')
      .select('email')
      .eq('unique_id', uniqueId.toUpperCase().trim())
      .single();

    if (lookupErr || !userRow) {
      const msg = 'Unique ID not found. Please contact your administrator.';
      setError(msg);
      throw new Error(msg);
    }

    const { error: err } = await supabase.auth.resetPasswordForEmail(userRow.email);
    if (err) {
      const msg = sanitizeError(err.message);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signOut = async () => {
    setIsDemo(false);
    setDemoRole('teacher');
    setError(null);
    await supabase.auth.signOut();
  };

  const enterDemoMode = (role: UserRole = 'teacher') => {
    setDemoRole(role);
    setIsDemo(true);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signOut, changePassword, resetPassword, enterDemoMode, isDemo, demoRole, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
