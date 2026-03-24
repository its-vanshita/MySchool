import 'react-native-url-polyfill/auto';
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { UserProvider } from '../src/context/UserContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme/colors';
import { View, Text } from 'react-native';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F5F7FA' }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 10 }}>Something went wrong</Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>{this.state.error}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <NotificationProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
              animationDuration: 200,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="(parent-drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin-drawer)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(teacher)/assign-notice"
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: 'Assign Notice',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(admin)/admin-leave-approvals"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Leave Approvals',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(admin)/admin-manage-timetable"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Manage Timetable',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(admin)/admin-manage-calendar"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Manage Calendar',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(admin)/admin-lesson-plans"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Syllabus Tracking',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(admin)/admin-analytics"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Analytics Dashboard',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(admin)/admin-attendance-list"
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(teacher)/mark-attendance"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Mark Attendance',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(teacher)/create-notice"
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: 'Send Notice',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(teacher)/create-announcement"
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: 'New Announcement',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(teacher)/apply-leave"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Apply Leave',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerRight: () => null,
              }}
            />
            <Stack.Screen
              name="(teacher)/add-lesson-plan"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Add New Topic',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerRight: () => null,
              }}
            />
            <Stack.Screen
              name="(teacher)/leave-approvals"
              options={{
                headerShown: true,
                headerTitle: 'Leave Approvals',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(shared)/notifications"
              options={{
                headerShown: true,
                headerTitle: 'Notifications',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="(teacher)/add-homework"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Assign Homework',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerRight: () => null,
              }}
            />
            <Stack.Screen
              name="(teacher)/class-students"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Class Students',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerRight: () => null,
              }}
            />
            <Stack.Screen
              name="(teacher)/student-performance"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Student Performance',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerRight: () => null,
              }}
            />
            <Stack.Screen
              name="(shared)/exam-datesheet"
              options={{
                presentation: 'card',
                headerShown: true,
                headerTitle: 'Exam Datesheet',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
          </Stack>
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
