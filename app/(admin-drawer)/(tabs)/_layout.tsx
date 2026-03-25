import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useNotificationBadge } from '../../../src/context/NotificationContext';
import { useUser } from '../../../src/context/UserContext';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';

function HeaderLeft() {
  const { colors, isDark } = useTheme();
  const badgeStyles = getBadgeStyles(colors); const styles = getStyles(colors);
    const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ marginLeft: 12, padding: 4 }}
      onPress={() => {
        try {
          navigation.dispatch(DrawerActions.toggleDrawer());
        } catch {}
      }}
    >
      <Ionicons name="menu" size={26} color={colors.white} />
    </TouchableOpacity>
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
        onPress={() => router.push('/(admin-drawer)/profile')}
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

export default function AdminTabsLayout() {
  const { colors, isDark } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          position: 'absolute',
          bottom: 20,
          left: 16,
          right: 16,
          borderRadius: 20,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'VidDarpan',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="marks"
        options={{
          title: 'Update Marks',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="duties"
        options={{
          title: 'Assign Duty',
          tabBarIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
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
