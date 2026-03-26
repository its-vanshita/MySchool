import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useUser } from '../../../src/context/UserContext';
import { useNotificationBadge } from '../../../src/context/NotificationContext';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

// Premium Variables
const BRAND_NAVY = '#153462';
const PURE_WHITE = '#FFFFFF';

function HeaderRight() {
  const router = useRouter();
  const { unreadCount } = useNotificationBadge();
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
      <TouchableOpacity 
        style={styles.bellButton} 
        onPress={() => router.push('/notifications')}
        activeOpacity={0.7}
      >
        <Ionicons name="notifications-outline" size={24} color={PURE_WHITE} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

function HeaderLeft() {
  return (
    <View style={{ marginLeft: 4 }}>
      <DrawerToggleButton tintColor={PURE_WHITE} />
    </View>
  );
}

export default function TabsLayout() {
  const { permissions } = useUser();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BRAND_NAVY,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: PURE_WHITE,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.05)',
          height: Platform.OS === 'ios' ? 92 : 88, 
          paddingBottom: Platform.OS === 'ios' ? 30 : 16,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          paddingVertical: Platform.OS === 'ios' ? 0 : 5,
        },
        headerStyle: { 
          backgroundColor: BRAND_NAVY,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: PURE_WHITE,
        headerTitleStyle: { 
          fontWeight: '800',
          fontSize: 20,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          letterSpacing: -0.5,
        },
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'VidDarpan',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeTabPill : styles.inactiveTabPill}>
              <Ionicons name={focused ? "grid" : "grid-outline"} size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="myclass"
        options={{
          title: 'My Class',
          tabBarIcon: ({ color, size, focused }) => (
             <View style={focused ? styles.activeTabPill : styles.inactiveTabPill}>
               <Ionicons name={focused ? "school" : "school-outline"} size={24} color={color} />
             </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notices"
        options={{
          title: 'Notice',
          tabBarIcon: ({ color, size, focused }) => (
             <View style={focused ? styles.activeTabPill : styles.inactiveTabPill}>
               <Ionicons name={focused ? "megaphone" : "megaphone-outline"} size={22} color={color} />
             </View>
          ),
        }}
      />
      <Tabs.Screen
        name="marks"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          title: 'Leave',
          tabBarIcon: ({ color, size, focused }) => (
             <View style={focused ? styles.activeTabPill : styles.inactiveTabPill}>
                <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={color} />
             </View>
          ),
          href: permissions.canRequestLeave || permissions.canApproveLeave ? undefined : null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bellButton: {
    padding: 8,
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: '#EF4444', // Premium Red
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BRAND_NAVY, // Match header to cut out
    paddingHorizontal: 4,
  },
  badgeText: {
    color: PURE_WHITE,
    fontSize: 9,
    fontWeight: '800',
  },
  activeTabPill: {
    width: 48,
    height: 32,
    backgroundColor: '#F1F5F9', // light blue soft pill
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTabPill: {
    width: 48,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
