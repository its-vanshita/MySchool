const fs = require('fs');

const content = `import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { useNotificationBadge } from '../../../src/context/NotificationContext';
import { useUser } from '../../../src/context/UserContext';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const BRAND_NAVY = '#153462';

function HeaderLeft() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ marginLeft: 16, padding: 4 }}
      onPress={() => {
        try {
          navigation.dispatch(DrawerActions.toggleDrawer());
        } catch {}
      }}
    >
      <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

function HeaderRight() {
  const router = useRouter();
  // Hardcoded for mockup purposes as '5'
  const unreadCount = 5; 
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
      <TouchableOpacity 
        style={{ padding: 6, position: 'relative' }} 
        onPress={() => router.push('/notifications')}
      >
        <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        {unreadCount > 0 && (
          <View style={badgeStyles.badge}>
            <Text style={badgeStyles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function AdminTabsLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={BRAND_NAVY} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: BRAND_NAVY,
          tabBarInactiveTintColor: '#94A3B8', // Monochromatic blue-grey
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: 'rgba(0,0,0,0.05)',
            height: 85,
            paddingBottom: 25,
            paddingTop: 10,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
          },
          headerStyle: { 
            backgroundColor: BRAND_NAVY,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { 
            fontWeight: '700',
            fontSize: 20,
            fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="marks"
          options={{
            title: 'Update Marks',
            headerTitle: 'Update Marks',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="duties"
          options={{
            title: 'Assign Duty',
            headerTitle: 'Assign Duty',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="clipboard-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Users',
            headerTitle: 'Users',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 4,
    top: 4,
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
`
fs.writeFileSync('app/(admin-drawer)/(tabs)/_layout.tsx', content);
