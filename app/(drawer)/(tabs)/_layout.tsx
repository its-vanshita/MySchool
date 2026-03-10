import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { useUser } from '../../../src/context/UserContext';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

function HeaderRight() {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
      <TouchableOpacity style={{ padding: 6 }} onPress={() => router.push('/notifications')}>
        <Ionicons name="notifications-outline" size={22} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={() => router.push('/(drawer)/profile')}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' }}
          style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.white }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function TabsLayout() {
  const { permissions } = useUser();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        headerLeft: () => <DrawerToggleButton tintColor={colors.white} />,
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'My School',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          href: null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="myclass"
        options={{
          title: 'My Class',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notices"
        options={{
          title: 'Notices',
          href: null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marks"
        options={{
          title: 'Marks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          title: 'Leave',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
          // Hide for admin who can't request leave
          href: permissions.canRequestLeave || permissions.canApproveLeave ? undefined : null,
        }}
      />
    </Tabs>
  );
}
