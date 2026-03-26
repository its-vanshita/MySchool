import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useUser } from '../../src/context/UserContext';
import { Drawer } from 'expo-router/drawer';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const RED_MUTED = '#E11D48';

export default function ProfileScreen() {
  const { profile, role } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [pushNotifications, setNotifications] = useState(true);

  // Fallbacks per high-fidelity spec requirement if null
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Teacher';
  const designation = profile?.designation ? profile.designation : `Subject ${displayRole}`;
  const userName = profile?.name ? profile.name : 'Gaurav Daultani';

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Drawer.Screen 
        options={{ 
           headerTitle: 'Profile',
           headerStyle: {
              backgroundColor: BRAND_NAVY,
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
           },
           headerTintColor: '#FFFFFF',
           headerTitleStyle: {
              fontWeight: '700',
              fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
              fontSize: 20
           }
        }} 
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ── PROFILE HERO SECTION ── */}
        <View style={styles.heroCard}>
          <View style={styles.avatarRingGlow}>
             <View style={styles.avatarBorder}>
                {profile?.avatar_url ? (
                  <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
                ) : (
                  <View style={[styles.avatarImage, { backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="person" size={54} color={BRAND_NAVY} />
                  </View>
                )}
             </View>
          </View>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileRole}>{designation}</Text>
        </View>

        {/* ── PERSONAL DETAILS CARD ── */}
        <View style={styles.detailCard}>
           {/* Full Name */}
           <View style={[styles.detailRow, styles.divider]}>
              <Text style={styles.detailLabel}>FULL NAME</Text>
              <Text style={styles.detailValue}>{userName}</Text>
           </View>
           {/* Email */}
           <View style={[styles.detailRow, styles.divider]}>
              <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
              <Text style={styles.detailValue}>{profile?.email || 'gaurav@viddarpan.com'}</Text>
           </View>
           {/* Phone */}
           <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PHONE NUMBER</Text>
              <Text style={styles.detailValue}>{profile?.phone || '+91 98765 43210'}</Text>
           </View>
        </View>

        {/* ── SECURITY & SETTINGS CARDS ── */}
        <View style={styles.actionCard}>
           {/* Security */}
           <TouchableOpacity 
              style={[styles.actionRow, styles.divider]} 
              activeOpacity={0.7}
              onPress={() => Alert.alert('Security', 'Security settings coming soon.')}
            >
              <View style={styles.actionLeft}>
                 <View style={styles.iconCircle}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={BRAND_NAVY} />
                 </View>
                 <Text style={styles.actionLabel}>Security & Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
           </TouchableOpacity>
           
           {/* Notifications */}
           <View style={styles.actionRow}>
              <View style={styles.actionLeft}>
                 <View style={styles.iconCircle}>
                    <Ionicons name="notifications-outline" size={20} color={BRAND_NAVY} />
                 </View>
                 <Text style={styles.actionLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E2E8F0', true: '#BAE6FD' }}
                thumbColor={pushNotifications ? BRAND_NAVY : '#94A3B8'}
                ios_backgroundColor="#E2E8F0"
              />
           </View>
        </View>

        {/* ── LOG OUT BUTTON ── */}
        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout} activeOpacity={0.8}>
           <Ionicons name="log-out-outline" size={22} color={RED_MUTED} />
           <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
  },
  
  // Hero section
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  avatarRingGlow: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#FFFFFF',
      shadowColor: BRAND_NAVY,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
  },
  avatarBorder: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  profileRole: {
    fontSize: 15,
    fontWeight: '500',
    color: BRAND_NAVY,
  },

  // Detail Maps
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  detailRow: {
      paddingVertical: 20,
      paddingHorizontal: 24,
  },
  divider: {
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9', // Ultra-lite interior line
  },
  detailLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#94A3B8',
      letterSpacing: 1.2,
      marginBottom: 6,
  },
  detailValue: {
      fontSize: 16,
      fontWeight: '600',
      color: '#0F172A',
  },

  // Action Cards
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
      paddingHorizontal: 24,
  },
  actionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F1F5F9', // Softer pale background
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
  },
  actionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },

  // Log Out
  logoutCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      paddingVertical: 20,
      borderRadius: 16,
      shadowColor: RED_MUTED, // Red tinted inner shadow
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
  },
  logoutText: {
      color: RED_MUTED,
      fontSize: 16,
      fontWeight: '700',
      marginLeft: 10,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
