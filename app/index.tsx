import React, { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useUser } from '../src/context/UserContext';
import { colors } from '../src/theme/colors';

export default function Index() {
  const router = useRouter();
  const { user, isDemo, loading: authLoading } = useAuth();
  const { profile, loading: userLoading, role } = useUser();

  useEffect(() => {
    if (authLoading) return;

    if (!user && !isDemo) {
      router.replace('/login');
      return;
    }

    if (!profile && userLoading) return;

    if (role === 'admin' || role === 'super_admin' || role === 'principal') {
      router.replace('/(admin-drawer)/(tabs)');
    } else if (role === 'parent' || (role as string) === 'student') {
      router.replace('/(parent-drawer)/(tabs)');
    } else {
      router.replace('/(drawer)/(tabs)');
    }
  }, [authLoading, userLoading, user, isDemo, profile, role, router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
