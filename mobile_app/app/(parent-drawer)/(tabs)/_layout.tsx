import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../src/context/UserContext';
import { useNotificationBadge } from '../../../src/context/NotificationContext';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

const BRAND_NAVY = '#153462';

function HeaderTitle() {
  return (
    <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5, fontFamily: 'System' }}>
      VidDarpan
    </Text>
  );
}

function HeaderRight() {
  const router = useRouter();
  const { unreadCount } = useNotificationBadge();
  const { profile } = useUser();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
      <TouchableOpacity style={{ padding: 6 }} onPress={() => router.push('/notifications')}>
        <Ionicons name="notifications-outline" size={22} color="#FFFFFF" strokeWidth={2} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={() => router.push('/(parent-drawer)/profile')}
      >
        {profile?.avatar_url ? (
          <Image
            source={{ uri: profile.avatar_url }}
            style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: '#FFFFFF' }}
          />
        ) : (
          <View style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function ParentTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BRAND_NAVY,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: 85,
          paddingBottom: 25,
          paddingTop: 15,
          elevation: 10,
          shadowColor: BRAND_NAVY,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: { backgroundColor: BRAND_NAVY, elevation: 0 },
        headerShadowVisible: false,
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
        headerLeft: () => <DrawerToggleButton tintColor="#FFFFFF" />,
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "document-text" : "document-text-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="datesheet"
        options={{
          title: 'Exams',
          headerTitle: () => <HeaderTitle />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "school" : "school-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance', headerTitle: () => <HeaderTitle />, href: null }} />
      <Tabs.Screen name="homework" options={{ title: 'Homework', headerTitle: () => <HeaderTitle />, href: null }} />
      <Tabs.Screen name="notices" options={{ title: 'Notices', headerTitle: () => <HeaderTitle />, href: null }} />
      <Tabs.Screen name="marks" options={{ title: 'Marks', headerTitle: () => <HeaderTitle />, href: null }} />
      <Tabs.Screen name="fee" options={{ title: 'Fee', headerTitle: () => <HeaderTitle />, href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BRAND_NAVY,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
