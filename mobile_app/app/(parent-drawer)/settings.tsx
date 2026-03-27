import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { Drawer } from 'expo-router/drawer';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const RED_MUTED = '#E11D48';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of VidDarpan?', [
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

  const handleChangePassword = () => {
    Alert.alert('Reset Password', 'A password reset link will be sent to your registered email.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Link', onPress: () => Alert.alert('Sent', 'Check your inbox for the reset link.') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Drawer.Screen 
        options={{ 
           headerTitle: 'Settings',
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PREFERENCES */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.cardGroup}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="notifications-outline" size={20} color={BRAND_NAVY} style={{ opacity: 0.9 }} />
              </View>
              <Text style={styles.settingsLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E2E8F0', true: '#BAE6FD' }}
              thumbColor={notifications ? BRAND_NAVY : '#94A3B8'}
              ios_backgroundColor="#E2E8F0"
            />
          </View>
        </View>

        {/* SECURITY */}
        <Text style={styles.sectionHeader}>SECURITY</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.settingsRow} onPress={handleChangePassword} activeOpacity={0.7}>
            <View style={styles.settingsLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed-outline" size={20} color={BRAND_NAVY} style={{ opacity: 0.9 }} />
              </View>
              <Text style={styles.settingsLabel}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* SUPPORT */}
        <Text style={styles.sectionHeader}>SUPPORT</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity 
             style={[styles.settingsRow, styles.rowBorder]} 
             activeOpacity={0.7}
             onPress={() => Linking.openURL('mailto:support@viddarpan.com')}
          >
            <View style={styles.settingsLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="help-buoy-outline" size={20} color={BRAND_NAVY} style={{ opacity: 0.9 }} />
              </View>
              <Text style={styles.settingsLabel}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
          
          <TouchableOpacity 
             style={styles.settingsRow} 
             activeOpacity={0.7}
             onPress={() => router.push('/privacy-policy')}
          >
            <View style={styles.settingsLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="shield-checkmark-outline" size={20} color={BRAND_NAVY} style={{ opacity: 0.9 }} />
              </View>
              <Text style={styles.settingsLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* ABOUT */}
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={styles.cardGroup}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <View style={styles.iconCircle}>
                 <Ionicons name="information-circle-outline" size={20} color={BRAND_NAVY} style={{ opacity: 0.9 }} />
              </View>
              <Text style={styles.settingsLabel}>App Version</Text>
            </View>
            <Text style={styles.versionText}>v1.0.0 (Build 42)</Text>
          </View>
        </View>

        {/* SIGN OUT */}
        <View style={{ marginTop: 24, marginBottom: 40 }}>
           <TouchableOpacity style={styles.logoutCard} onPress={handleLogout} activeOpacity={0.8}>
               <Ionicons name="log-out-outline" size={22} color={RED_MUTED} />
               <Text style={styles.logoutText}>Sign Out</Text>
           </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  scrollContent: {
    padding: 24, // Consistent 24dp padding
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B', // Muted Grey
    letterSpacing: 1.2,
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden', // to keep border radius intact with touchables
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9', // Very subtle inner divider
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#E0F2FE', // Light blue background
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
  },
  settingsLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  versionText: {
      fontSize: 14,
      color: '#94A3B8',
      fontWeight: '500',
  },
  logoutCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      paddingVertical: 20,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 2,
  },
  logoutText: {
      color: RED_MUTED,
      fontSize: 16,
      fontWeight: '700',
      marginLeft: 8,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
