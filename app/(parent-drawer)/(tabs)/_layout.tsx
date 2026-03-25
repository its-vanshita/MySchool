import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useNotificationBadge } from '../../../src/context/NotificationContext';
import { useUser } from '../../../src/context/UserContext';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

function HeaderTitle() {
  const { colors, isDark } = useTheme();
  const badgeStyles = getBadgeStyles(colors); const styles = getStyles(colors);
    return (
    <Text style={{ fontSize: 18, fontWeight: '800', color: colors.white, letterSpacing: 0.5 }}>
      VidDarpan
    </Text>
  );
}

function HeaderRight() {
  const { colors, isDark } = useTheme(); 
  const badgeStyles = getBadgeStyles(colors);
  const styles = getStyles(colors);
    const router = useRouter();
  const { unreadCount } = useNotificationBadge();
  const { profile } = useUser();
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
        {profile?.avatar_url ? (
          <Image
            source={{ uri: profile.avatar_url }}
            style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.white }}
          />
        ) : (
          <View style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.white, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="person" size={16} color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function ParentTabsLayout() {
  const { colors, isDark } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 85,
          paddingBottom: 25,
          paddingTop: 15,
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

const getBadgeStyles = (colors: any) => StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  }
});


function getStyles(colors: any) { return {}; }
