const fs = require('fs');

const content = `import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useUser } from '../../src/context/UserContext';
import { useAuth } from '../../src/context/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

// Premium Mobile Side Navigation Drawer UI
// Matte Solid Dark Royal Blue (#153462)
// Pure White Text and Icons (#FFFFFF)

function CustomDrawerContent(props: any) {
  const { profile, role } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const { state, navigation, descriptors } = props;

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const drawerStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#153462', // Solid Dark Royal Blue Matte
    },
    scrollContent: {
      flexGrow: 1,
      paddingTop: 0, 
    },
    header: {
      padding: 24, // Generous 24dp padding
      paddingTop: 64, // Extra for safe area/status bar
      marginBottom: 8,
    },
    avatarContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      backgroundColor: 'rgba(255,255,255,0.1)',
      overflow: 'hidden',
    },
    avatarFallback: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      color: '#FFFFFF',
      fontSize: 20,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
      fontWeight: '600',
    },
    role: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
      fontWeight: '500',
      marginTop: 4,
      textTransform: 'capitalize',
    },
    itemsContainer: {
      flex: 1,
      paddingTop: 8,
    },
    drawerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      marginHorizontal: 16,
      height: 52,
      borderRadius: 12,
      paddingRight: 16,
      overflow: 'hidden',
    },
    drawerItemActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)', // Active pill
    },
    activeIndicator: {
      position: 'absolute',
      left: 0,
      top: 10,
      bottom: 10,
      width: 4,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      backgroundColor: '#FFFFFF',
    },
    iconContainer: {
      width: 56,
      alignItems: 'center',
      justifyContent: 'center',
    },
    drawerLabel: {
      fontSize: 15,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    },
    footerSpacer: {
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginHorizontal: 24,
      marginTop: 24,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 24,
      paddingBottom: 40, 
    },
    logoutText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
      fontWeight: '500',
      marginLeft: 16,
    },
  });

  return (
    <View style={drawerStyles.container}>
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={drawerStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={drawerStyles.header}>
          <View style={drawerStyles.avatarContainer}>
            <View style={drawerStyles.avatarFallback}>
              <Ionicons name="person-outline" size={32} color="#FFFFFF" />
            </View>
          </View>
          <Text style={drawerStyles.name}>{profile?.name ?? 'Admin User'}</Text>
          <Text style={drawerStyles.role}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
        </View>

        <View style={drawerStyles.itemsContainer}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            if (options.drawerItemStyle?.display === 'none') return null;
            
            const isFocused = state.index === index;
            const label = options.title !== undefined ? options.title : route.name;
            const icon = options.drawerIcon;

            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(route.name)}
                style={[
                  drawerStyles.drawerItem,
                  isFocused && drawerStyles.drawerItemActive
                ]}
              >
                {isFocused && <View style={drawerStyles.activeIndicator} />}
                
                <View style={drawerStyles.iconContainer}>
                  {icon && icon({ focused: isFocused, color: '#FFFFFF', size: 22 })}
                </View>
                <Text style={[
                  drawerStyles.drawerLabel, 
                  { 
                    color: '#FFFFFF',
                    fontWeight: isFocused ? '600' : '500',
                    opacity: isFocused ? 1 : 0.85
                  }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            key="analytics-static"
            activeOpacity={0.7}
            onPress={() => {
              navigation.closeDrawer();
              router.push('/admin-analytics');
            }}
            style={drawerStyles.drawerItem}
          >
            <View style={drawerStyles.iconContainer}>
              <Ionicons name="pie-chart-outline" size={22} color="#FFFFFF" />
            </View>
            <Text style={[drawerStyles.drawerLabel, { color: '#FFFFFF', fontWeight: '500', opacity: 0.85 }]}>
              Analytics Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            key="leave-approvals-static"
            activeOpacity={0.7}
            onPress={() => {
              navigation.closeDrawer();
              router.push('/admin-leave-approvals');
            }}
            style={drawerStyles.drawerItem}
          >
            <View style={drawerStyles.iconContainer}>
              <Ionicons name="document-text-outline" size={22} color="#FFFFFF" />
            </View>
            <Text style={[drawerStyles.drawerLabel, { color: '#FFFFFF', fontWeight: '500', opacity: 0.85 }]}>
              Leave Approvals
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            key="faq-static"
            activeOpacity={0.7}
            onPress={() => {
              navigation.closeDrawer();
              router.push('/faq' as any);
            }}
            style={drawerStyles.drawerItem}
          >
            <View style={drawerStyles.iconContainer}>
              <Ionicons name="help-circle-outline" size={22} color="#FFFFFF" />
            </View>
            <Text style={[drawerStyles.drawerLabel, { color: '#FFFFFF', fontWeight: '500', opacity: 0.85 }]}>
              Help & FAQs
            </Text>
          </TouchableOpacity>

        </View>

        <View style={drawerStyles.footerSpacer} />

        <View style={drawerStyles.divider} />

        <TouchableOpacity 
          style={drawerStyles.logoutBtn} 
          activeOpacity={0.7} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          <Text style={drawerStyles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </DrawerContentScrollView>
    </View>
  );
}

export default function AdminDrawerLayout() {
  const { colors } = useTheme();
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        drawerStyle: { width: 300, backgroundColor: "transparent" },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="admin-datesheet"
        options={{
          title: 'Upload Datesheet',
          drawerIcon: ({ color, size }) => <Ionicons name="cloud-upload-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Admin Profile',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}
`
fs.writeFileSync('app/(admin-drawer)/_layout.tsx', content);
