import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useUser } from '../../src/context/UserContext';
import { useAuth } from '../../src/context/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fontSize, spacing } from '../../src/theme/spacing';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

function ParentDrawerContent(props: any) {
  const { colors, isDark } = useTheme(); const styles = getStyles(colors);
  const drawerStyles = StyleSheet.create({
    header: {
      padding: spacing.xl,
      paddingTop: spacing.xxxl,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.15)',
      marginBottom: spacing.sm,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    name: {
      color: colors.drawerText,
      fontSize: fontSize.xl,
      fontWeight: '800',
    },
    role: {
      color: colors.drawerIcon,
      fontSize: fontSize.sm,
      fontWeight: '600',
      marginTop: 2,
      textTransform: 'capitalize',
    },
    email: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: fontSize.xs,
      marginTop: 4,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      marginTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.15)',
    },
    logoutText: {
      color: '#FF6B6B',
      fontSize: fontSize.md,
      fontWeight: '600',
      marginLeft: spacing.md,
    },
    navItemBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      marginHorizontal: spacing.sm,
      marginBottom: spacing.xs,
      borderRadius: 8,
    },
    navItemText: {
      color: colors.drawerIcon,
      fontSize: fontSize.md,
      fontWeight: '600',
      marginLeft: spacing.md,
    },
  });
    const { profile, role } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: colors.drawerBg }}>
      {/* User Header */}
      <View style={drawerStyles.header}>
        <View style={drawerStyles.avatar}>
          <Ionicons name="people" size={32} color={colors.primary} />
        </View>
        <Text style={drawerStyles.name}>{profile?.name ?? 'Parent'}</Text>
        <Text style={drawerStyles.role}>Parent</Text>
        <Text style={drawerStyles.email}>{profile?.email ?? ''}</Text>
      </View>


      {/* Navigation Items */}
      <DrawerItemList {...props} />

      {/* Manual Parent Tool Links */}
      <DrawerItem
        label="Attendance Tracker"
        icon={({ color, size }) => (
          <Ionicons name="checkmark-circle-outline" size={size} color={color} />
        )}
        labelStyle={{ fontSize: fontSize.md, fontWeight: '600' }}
        inactiveTintColor={colors.drawerIcon}
        onPress={() => { router.push('/(parent-drawer)/(tabs)/attendance'); props.navigation.closeDrawer(); }}
      />

      <DrawerItem
        label="Homework & Tasks"
        icon={({ color, size }) => (
          <Ionicons name="book-outline" size={size} color={color} />
        )}
        labelStyle={{ fontSize: fontSize.md, fontWeight: '600' }}
        inactiveTintColor={colors.drawerIcon}
        onPress={() => { router.push('/(parent-drawer)/(tabs)/homework'); props.navigation.closeDrawer(); }}
      />

      <DrawerItem
        label="School Notices"
        icon={({ color, size }) => (
          <Ionicons name="megaphone-outline" size={size} color={color} />
        )}
        labelStyle={{ fontSize: fontSize.md, fontWeight: '600' }}
        inactiveTintColor={colors.drawerIcon}
        onPress={() => { router.push('/(parent-drawer)/(tabs)/notices'); props.navigation.closeDrawer(); }}
      />

      <DrawerItem
        label="Exam Datesheets"
        icon={({ color, size }) => (
          <Ionicons name="calendar-outline" size={size} color={color} />
        )}
        labelStyle={{ fontSize: fontSize.md, fontWeight: '600' }}
        inactiveTintColor={colors.drawerIcon}
        onPress={() => { router.push('/(parent-drawer)/(tabs)/datesheet'); props.navigation.closeDrawer(); }}
      />

      <DrawerItem
        label="Help & FAQs"
        icon={({ color, size }) => (
          <Ionicons name="help-circle-outline" size={size} color={color} />
        )}
        labelStyle={{ fontSize: fontSize.md, fontWeight: '600' }}
        inactiveTintColor={colors.drawerIcon}
        onPress={() => { router.push('/faq' as any); props.navigation.closeDrawer(); }}
      />

      {/* Logout */}
      <TouchableOpacity style={drawerStyles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
        <Text style={drawerStyles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}



export default function ParentDrawerLayout() {
  const { colors, isDark } = useTheme();
  return (
    <Drawer
      drawerContent={(props) => <ParentDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        drawerActiveTintColor: colors.white,
        drawerInactiveTintColor: colors.drawerIcon,
        drawerActiveBackgroundColor: 'rgba(255,255,255,0.15)',
        drawerStyle: { backgroundColor: colors.drawerBg, width: 280 },
        drawerLabelStyle: { fontSize: fontSize.md, fontWeight: '600' },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          drawerIcon: ({ color, size }) => <Ionicons name="today" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}


function getStyles(colors: any) { return {}; }
