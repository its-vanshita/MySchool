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
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useUser } from '../../src/context/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Premium Theme Variables
const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const SUCCESS_GREEN = '#10B981';
const DANGER_RED = '#EF4444';
const DANGER_BG = '#FEF2F2';

export default function PremiumParentProfileScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [pushEnabled, setPushEnabled] = useState(true);

  const parentName = profile?.name || 'Mr. Rajesh Sharma';
  const parentEmail = profile?.email || 'rajesh.sharma@example.com';
  const parentPhone = profile?.phone || '+91 98765 43210';
  
  const studentName = (profile as any)?.metadata?.studentName || 'Arjun Sharma';
  const studentClass = (profile as any)?.metadata?.studentClass || 'Class 10-A';
  const studentRoll = '12';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to securely log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: BRAND_NAVY, shadowOpacity: 0 } as any,
          headerTintColor: PURE_WHITE,
          headerTitle: 'Profile',
          headerTitleStyle: {
             fontWeight: '700',
             fontSize: 20,
             fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero Profile Card */}
        <View style={styles.heroCard}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/300?u=parent123' }} 
            style={styles.heroAvatar} 
          />
          <Text style={styles.heroName}>{parentName}</Text>
          <Text style={styles.heroRole}>Parent</Text>
        </View>

        {/* Section: Child Details */}
        <View style={styles.detailCard}>
           <Text style={styles.cardHeader}>STUDENT DETAIL</Text>
           <View style={styles.childBriefRow}>
              <Image 
                 source={{ uri: 'https://i.pravatar.cc/150?u=student123' }} 
                 style={styles.childAvatar} 
              />
              <View style={styles.childTextCol}>
                 <Text style={styles.childName}>{studentName}</Text>
                 <Text style={styles.childMeta}>{studentClass}  •  Roll {studentRoll}</Text>
              </View>
              <TouchableOpacity style={styles.switchBtn}>
                 <Ionicons name="swap-horizontal" size={16} color={BRAND_NAVY} />
              </TouchableOpacity>
           </View>
        </View>

        {/* Section: Personal Details */}
        <View style={styles.detailCard}>
           <Text style={styles.cardHeader}>PERSONAL DETAILS</Text>
           
           <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>FULL NAME</Text>
              <Text style={styles.fieldValue}>{parentName}</Text>
           </View>
           
           <View style={styles.fieldDivider} />
           
           <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <Text style={styles.fieldValue}>{parentEmail}</Text>
           </View>
           
           <View style={styles.fieldDivider} />
           
           <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
              <Text style={styles.fieldValue}>{parentPhone}</Text>
           </View>
        </View>

        {/* Section: Preferences */}
        <View style={styles.detailCard}>
           <Text style={styles.cardHeader}>PREFERENCES</Text>
           
           <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                 <Ionicons name="notifications" size={20} color={SLATE_GREY} />
                 <Text style={styles.toggleText}>Push Notifications</Text>
              </View>
              <Switch
                 value={pushEnabled}
                 onValueChange={setPushEnabled}
                 trackColor={{ false: '#E2E8F0', true: SUCCESS_GREEN }}
                 thumbColor={PURE_WHITE}
              />
           </View>
           
           <View style={styles.fieldDivider} />
           
           <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
              <View style={styles.actionLeft}>
                 <Ionicons name="lock-closed" size={20} color={SLATE_GREY} />
                 <Text style={styles.actionText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
           </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
           <Ionicons name="log-out" size={20} color={DANGER_RED} />
           <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    padding: 16,
    paddingTop: 24,
  },
  
  heroCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 20,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 5,
  },
  heroAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: BRAND_NAVY,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 4,
  },
  heroRole: {
    fontSize: 15,
    fontWeight: '500',
    color: SLATE_GREY,
  },

  detailCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: SLATE_GREY,
    letterSpacing: 1.2,
    marginBottom: 20,
  },
  
  childBriefRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 14,
  },
  childTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  childName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  childMeta: {
    fontSize: 13,
    color: SLATE_GREY,
    fontWeight: '500',
  },
  switchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  fieldGroup: {
    marginVertical: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_NAVY,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DANGER_BG,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: DANGER_RED,
    marginLeft: 10,
  }
});
