import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { useNotificationBadge } from '../../../src/context/NotificationContext';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

function HeaderTitle() {
  return (
    <Text style={{ fontSize: 18, fontWeight: '800', color: colors.white, letterSpacing: 0.5 }}>
      VidDarpan
    </Text>
  );
}

function HeaderRight() {
  const router = useRouter();
  const { unreadCount } = useNotificationBadge();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
      <TouchableOpacity style={{ padding: 6 }} onPress={() => router.push('/notifications')}>
        <Ionicons name="notifications-outline" size={22} color={colors.white} />
        {unreadCount > 0 && (
          <View style={badgeStyles.badge}>
            <Text style={badgeStyles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={() => router.push('/(parent-drawer)/profile')}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' }}
          style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.white }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function ParentTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: '#F0F0F0',
          height: 75,
          paddingBottom: 25,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: { backgroundColor: colors.primary, elevation: 0, shadowOpacity: 0 },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        headerLeft: () => <DrawerToggleButton tintColor={colors.white} />,
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="documents" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marks"
        options={{
          title: 'Marks',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fee"
        options={{
          title: 'Fee',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden existing tabs - kept for routing but not shown in tab bar */}
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          headerTitle: () => <HeaderTitle />,
          href: null,
        }}
      />
      <Tabs.Screen
        name="homework"
        options={{
          title: 'Homework',
          headerTitle: () => <HeaderTitle />,
          href: null,
        }}
      />
      <Tabs.Screen
        name="notices"
        options={{
          title: 'Notices',
          headerTitle: () => <HeaderTitle />,
          href: null,
        }}
      />
      <Tabs.Screen
        name="datesheet"
        options={{
          title: 'Exams',
          headerTitle: () => <HeaderTitle />,
          href: null,
        }}
      />
    </Tabs>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
});
