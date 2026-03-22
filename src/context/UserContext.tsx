import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';
import type { AppUser, UserRole, RolePermissions, ROLE_PERMISSIONS as RP } from '../types';
import { ROLE_PERMISSIONS } from '../types';

interface UserState {
  profile: AppUser | null;
  role: UserRole;
  permissions: RolePermissions;
  loading: boolean;
  isDemo: boolean;
  refreshProfile: () => Promise<void>;
}

const DEMO_USERS: Record<string, AppUser> = {
  teacher: {
    id: 'demo-teacher',
    unique_id: 'SCH-2024-001',
    email: 'alex.j@myschool.edu',
    name: 'Alex Johnson',
    phone: '+1 (555) 012-3456',
    role: 'teacher',
    subjects: ['Mathematics', 'Science'],
    designation: 'Senior Teacher',
    avatar_url: '',
    school_id: 'demo-school',
    is_first_login: false,
    created_at: new Date().toISOString(),
  },
  admin: {
    id: 'demo-admin',
    unique_id: 'ADMIN',
    email: 'admin@myschool.app',
    name: 'Demo Admin',
    phone: '+91 98765 43211',
    role: 'admin',
    subjects: [],
    avatar_url: '',
    school_id: 'demo-school',
    is_first_login: false,
    created_at: new Date().toISOString(),
  },
  parent: {
    id: 'demo-parent',
    unique_id: 'PARENT',
    email: 'parent@myschool.app',
    name: 'Demo Parent',
    phone: '+91 98765 43212',
    role: 'parent',
    subjects: [],
    avatar_url: '',
    school_id: 'demo-school',
    is_first_login: false,
    created_at: new Date().toISOString(),
  },
};

const UserContext = createContext<UserState | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isDemo, demoRole } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      if (isDemo) {
        setProfile(DEMO_USERS[demoRole] ?? DEMO_USERS.teacher);
        setLoading(false);
        return;
      }
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        // Auto-create profile for new users
        const newProfile: Partial<AppUser> = {
          id: user.id,
          email: user.email ?? '',
          name: user.email?.split('@')[0] ?? 'User',
          phone: '',
          role: 'teacher',
          subjects: [],
          avatar_url: '',
          school_id: '',
        };
        const { data: created } = await supabase
          .from('users')
          .upsert(newProfile)
          .select()
          .single();

        setProfile(created as AppUser | null);
      } else {
        setProfile(data as AppUser);
      }
      setLoading(false);
    } catch (err) {
      console.warn('Failed to fetch profile:', err);
      // Set default profile in case of error
      setProfile(DEMO_USERS[isDemo ? demoRole : 'teacher']);
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      fetchProfile();
    } catch (err) {
      console.error('Profile initialization error:', err);
      setLoading(false);
    }
  }, [user, isDemo, demoRole]);

  const role: UserRole = profile?.role ?? 'teacher';
  const permissions: RolePermissions = ROLE_PERMISSIONS[role];

  return (
    <UserContext.Provider
      value={{ profile, role, permissions, loading, isDemo, refreshProfile: fetchProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserState {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
