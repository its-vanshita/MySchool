import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { UserProvider } from '../src/context/UserContext';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen
            name="mark-attendance"
            options={{
              presentation: 'card',
              headerShown: true,
              headerTitle: 'Mark Attendance',
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="create-notice"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Send Notice',
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="create-announcement"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'New Announcement',
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="apply-leave"
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
            name="add-lesson-plan"
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
            name="leave-approvals"
            options={{
              headerShown: true,
              headerTitle: 'Leave Approvals',
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="notifications"
            options={{
              headerShown: true,
              headerTitle: 'Notifications',
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.white,
            }}
          />
          <Stack.Screen
            name="add-homework"
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
            name="class-students"
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
            name="student-performance"
            options={{
              presentation: 'card',
              headerShown: true,
              headerTitle: 'Student Performance',
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.white,
              headerRight: () => null,
            }}
          />
        </Stack>
      </UserProvider>
    </AuthProvider>
  );
}
