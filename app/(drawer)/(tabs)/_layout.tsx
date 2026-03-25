import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useUser } from '../../../src/context/UserContext';
import { useNotificationBadge } from '../../../src/context/NotificationContext';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

function HeaderRight() {
  const { colors, isDark } = useTheme();
  const badgeStyles = getBadgeStyles(colors); const styles = getStyles(colors);
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
        onPress={() => router.push('/(drawer)/profile')}
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

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  const { permissions } = useUser();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 85,
          paddingBottom: 25,
          paddingTop: 15,
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
          title: 'VidDarpan',
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
