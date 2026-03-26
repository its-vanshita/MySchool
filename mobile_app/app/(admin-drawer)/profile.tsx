import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';

export default function AdminProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Area */}
      <View style={[styles.headerArea, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Admin Profile</Text>
            <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* The Identity Hero */}
        <View style={styles.heroCard}>
            <View style={styles.portraitWrap}>
               {/* High-quality circular professional portrait of a male executive */}
               <Image 
                 source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400' }} 
                 style={styles.portraitImage} 
               />
               <View style={styles.statusGlow} />
            </View>
            <Text style={styles.heroName}>Gaurav Daultani</Text>
            <Text style={styles.heroRole}>System Administrator</Text>
        </View>

        {/* Administrator Details */}
        <View style={styles.detailCard}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>FULL NAME</Text>
                <Text style={styles.infoValue}>Gaurav Daultani</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>EMAIL ADDRESS</Text>
                <Text style={styles.infoValue}>admin@school.edu</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PHONE NUMBER</Text>
                <Text style={styles.infoValue}>+91 98765 43210</Text>
            </View>
        </View>

        {/* System Access Card */}
        <View style={styles.detailCard}>
           <View style={styles.systemAccessWrap}>
              <View style={styles.systemAccessIconBox}>
                 <Ionicons name="globe-outline" size={24} color={BRAND_NAVY} />
              </View>
              <View style={styles.systemAccessTextWrap}>
                 <Text style={styles.systemAccessTitle}>Global Dashboard Access</Text>
                 <Text style={styles.systemAccessDesc}>Full read/write privileges granted across all school modules.</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={BRAND_NAVY} style={styles.checkIcon} />
           </View>
        </View>

        {/* Security Protocols */}
        <View style={styles.detailCard}>
           
           <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
               <View style={styles.actionIconPill}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={BRAND_NAVY} />
               </View>
               <View style={styles.actionTextWrap}>
                  <Text style={styles.actionTitle}>Two-Factor Authentication</Text>
                  <Text style={styles.actionSub}>Currently enabled via SMS</Text>
               </View>
               <Ionicons name="chevron-forward" size={18} color="#CBD5E1" strokeWidth={0.5} />
           </TouchableOpacity>

           <View style={styles.divider} />

           <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
               <View style={styles.actionIconPill}>
                  <Ionicons name="lock-closed-outline" size={20} color={BRAND_NAVY} />
               </View>
               <View style={styles.actionTextWrap}>
                  <Text style={styles.actionTitle}>Change Password</Text>
                  <Text style={styles.actionSub}>Last updated 45 days ago</Text>
               </View>
               <Ionicons name="chevron-forward" size={18} color="#CBD5E1" strokeWidth={0.5} />
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
  headerArea: {
    backgroundColor: BRAND_NAVY,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heroCard: {
     backgroundColor: PURE_WHITE,
     borderRadius: 24,
     alignItems: 'center',
     paddingVertical: 32,
     paddingHorizontal: 20,
     marginBottom: 20,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.04,
     shadowRadius: 20,
     elevation: 5,
  },
  portraitWrap: {
     position: 'relative',
     marginBottom: 16,
  },
  portraitImage: {
     width: 100,
     height: 100,
     borderRadius: 50,
     borderWidth: 2,
     borderColor: PURE_WHITE,
  },
  statusGlow: {
     position: 'absolute',
     bottom: 4,
     right: 4,
     width: 18,
     height: 18,
     borderRadius: 9,
     backgroundColor: '#10B981', // green status
     borderWidth: 3,
     borderColor: PURE_WHITE,
     shadowColor: '#10B981',
     shadowOffset: { width: 0, height: 0 },
     shadowOpacity: 0.8,
     shadowRadius: 6,
     elevation: 4,
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
     borderRadius: 24,
     padding: 20,
     marginBottom: 20,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 8 },
     shadowOpacity: 0.03,
     shadowRadius: 16,
     elevation: 3,
  },
  infoRow: {
     paddingVertical: 8,
  },
  infoLabel: {
     fontSize: 10,
     fontWeight: '800',
     color: '#94A3B8',
     letterSpacing: 1.2,
     marginBottom: 4,
  },
  infoValue: {
     fontSize: 15,
     fontWeight: '600',
     color: DARK_TEXT,
  },
  divider: {
     height: 1,
     backgroundColor: '#F1F5F9',
     marginVertical: 12,
  },
  systemAccessWrap: {
     flexDirection: 'row',
     alignItems: 'center',
  },
  systemAccessIconBox: {
     width: 48,
     height: 48,
     borderRadius: 24,
     backgroundColor: '#F1F5F9',
     alignItems: 'center',
     justifyContent: 'center',
     marginRight: 16,
  },
  systemAccessTextWrap: {
     flex: 1,
     paddingRight: 12,
  },
  systemAccessTitle: {
     fontSize: 15,
     fontWeight: '700',
     color: BRAND_NAVY,
     marginBottom: 2,
  },
  systemAccessDesc: {
     fontSize: 12,
     color: SLATE_GREY,
     lineHeight: 18,
  },
  checkIcon: {
     opacity: 0.8,
  },
  actionRow: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingVertical: 4,
  },
  actionIconPill: {
     width: 44,
     height: 44,
     borderRadius: 22,
     backgroundColor: '#F8FAFC',
     alignItems: 'center',
     justifyContent: 'center',
     marginRight: 16,
  },
  actionTextWrap: {
     flex: 1,
  },
  actionTitle: {
     fontSize: 15,
     fontWeight: '600',
     color: DARK_TEXT,
     marginBottom: 2,
  },
  actionSub: {
     fontSize: 12,
     color: SLATE_GREY,
  }
});
