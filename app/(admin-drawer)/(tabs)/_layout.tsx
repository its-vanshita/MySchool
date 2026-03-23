import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { useNotificationBadge } from '../../../src/context/NotificationContext';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';

function HeaderLeft() {
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
        onPress={() => router.push('/(admin-drawer)/profile')}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' }}
          style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.white }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function AdminTabsLayout() {
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
