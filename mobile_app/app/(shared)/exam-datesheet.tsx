import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';

// Premium Theme Variables
const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const MATH_BLUE = '#3B82F6';
const ENG_ORANGE = '#F97316';
const SLATE_GREY = '#64748B';

type TabKey = 'datesheet' | 'my-duty';

export default function ExamDatesheetScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('datesheet');

  return (
    <View style={styles.container}>
      {/* Configure Stack Header (transparent to let our custom header flow) */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── HEADER & PROFILE HERO ── */}
      <View style={[styles.headerSection, { paddingTop: insets.top }]}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Datesheet</Text>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.bellBadge} />
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Card Floating Inside Header */}
        <View style={styles.profileCard}>
           <View style={styles.profileInfo}>
              <Text style={styles.greetingText}>Good Morning,</Text>
              <Text style={styles.nameText}>Gaurav Daultani</Text>
           </View>
           <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256' }} 
              style={styles.profileImage} 
           />
        </View>
      </View>

      {/* ── TAB BAR ── */}
      <View style={styles.tabContainer}>
         <View style={styles.tabPillContainer}>
            <TouchableOpacity 
               style={[styles.tabButton, activeTab === 'datesheet' && styles.tabButtonActive]}
               onPress={() => setActiveTab('datesheet')}
               activeOpacity={0.8}
            >
               <Text style={[styles.tabText, activeTab === 'datesheet' && styles.tabTextActive]}>Datesheet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
               style={[styles.tabButton, activeTab === 'my-duty' && styles.tabButtonActive]}
               onPress={() => setActiveTab('my-duty')}
               activeOpacity={0.8}
            >
               <Text style={[styles.tabText, activeTab === 'my-duty' && styles.tabTextActive]}>My Duty</Text>
            </TouchableOpacity>
         </View>
      </View>

      {/* ── DATA-RICH FEED ── */}
      <ScrollView contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
          
          {/* Day 1 Section */}
          <Text style={styles.dateHeader}>MONDAY, 10 FEB 2025</Text>
          
          <View style={styles.commandCard}>
             <View style={[styles.cardAccentLine, { backgroundColor: MATH_BLUE }]} />
             <View style={styles.cardMain}>
                <View style={styles.cardHeader}>
                   <Text style={styles.subjectName}>Mathematics</Text>
                   <Text style={styles.examTime}>09:00 AM</Text>
                </View>
                
                <View style={styles.dataGrid}>
                   <View style={styles.dataRow}>
                      <Ionicons name="people-outline" size={16} color={BRAND_NAVY} style={styles.dataIcon} />
                      <Text style={styles.dataText}>Class 10-A, 10-B</Text>
                   </View>
                   <View style={styles.dataRow}>
                      <Ionicons name="location-outline" size={16} color={BRAND_NAVY} style={styles.dataIcon} />
                      <Text style={styles.dataText}>Hall 1</Text>
                   </View>
                   <View style={[styles.dataRow, { marginBottom: 0 }]}>
                      <Ionicons name="accessibility-outline" size={16} color={BRAND_NAVY} style={styles.dataIcon} />
                      <Text style={styles.dataText}>Accommodation Needs: 3</Text>
                   </View>
                </View>

                {/* Sparkline Mockup */}
                <View style={styles.sparklineContainer}>
                    <Text style={styles.sparklineLabel}>Recent Trend</Text>
                    <View style={styles.sparklineMock}>
                        <View style={[styles.bar, { height: 12, backgroundColor: '#DBEAFE' }]} />
                        <View style={[styles.bar, { height: 18, backgroundColor: '#DBEAFE' }]} />
                        <View style={[styles.bar, { height: 14, backgroundColor: '#93C5FD' }]} />
                        <View style={[styles.bar, { height: 24, backgroundColor: '#60A5FA' }]} />
                        <View style={[styles.bar, { height: 20, backgroundColor: MATH_BLUE }]} />
                    </View>
                </View>
             </View>
             <View style={styles.bgIconWrap}>
                 <Ionicons name="calculator" size={100} color="#F8FAFC" />
             </View>
          </View>

          {/* Day 2 Section */}
          <Text style={styles.dateHeader}>WEDNESDAY, 12 FEB 2025</Text>
          
          <View style={styles.commandCard}>
             <View style={[styles.cardAccentLine, { backgroundColor: ENG_ORANGE }]} />
             <View style={styles.cardMain}>
                <View style={styles.cardHeader}>
                   <Text style={styles.subjectName}>English Lit.</Text>
                   <Text style={styles.examTime}>11:30 AM</Text>
                </View>
                
                <View style={styles.dataGrid}>
                   <View style={styles.dataRow}>
                      <Ionicons name="people-outline" size={16} color={BRAND_NAVY} style={styles.dataIcon} />
                      <Text style={styles.dataText}>Class 10-A, 10-C</Text>
                   </View>
                   <View style={styles.dataRow}>
                      <Ionicons name="location-outline" size={16} color={BRAND_NAVY} style={styles.dataIcon} />
                      <Text style={styles.dataText}>Hall 3</Text>
                   </View>
                </View>

                {/* Sparkline Mockup */}
                <View style={styles.sparklineContainer}>
                    <Text style={styles.sparklineLabel}>Recent Trend</Text>
                    <View style={styles.sparklineMock}>
                        <View style={[styles.bar, { height: 20, backgroundColor: '#FFEDD5' }]} />
                        <View style={[styles.bar, { height: 22, backgroundColor: '#FED7AA' }]} />
                        <View style={[styles.bar, { height: 18, backgroundColor: '#FDBA74' }]} />
                        <View style={[styles.bar, { height: 25, backgroundColor: ENG_ORANGE }]} />
                    </View>
                </View>
             </View>
              <View style={styles.bgIconWrap}>
                 <Ionicons name="book" size={100} color="#FFF7ED" />
             </View>
          </View>

          <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── BOTTOM NAVIGATION (Mockup for high-fidelity) ── */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 16) }]}>
         <View style={styles.navItem}>
             <Ionicons name="home" size={24} color={BRAND_NAVY} />
             <Text style={styles.navItemTextActive}>Home</Text>
         </View>
         <View style={styles.navItem}>
             <Ionicons name="people-outline" size={24} color="#94A3B8" />
             <Text style={styles.navItemText}>My Class</Text>
         </View>
         <View style={styles.navItem}>
             <Ionicons name="create-outline" size={24} color="#94A3B8" />
             <Text style={styles.navItemText}>Grading</Text>
         </View>
         <View style={styles.navItem}>
             <Ionicons name="calendar-outline" size={24} color="#94A3B8" />
             <Text style={styles.navItemText}>Schedule</Text>
         </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  
  // Header Section
  headerSection: {
    backgroundColor: BRAND_NAVY,
    paddingBottom: 45, // Leave room for floating card
  },
  navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
  },
  iconButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
  },
  bellBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#EF4444',
      borderWidth: 2,
      borderColor: BRAND_NAVY,
      zIndex: 10,
  },
  headerTitle: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '700',
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },

  // Floating Profile Card
  profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      marginHorizontal: 20,
      marginTop: 20,
      padding: 16,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      // Pull card down over the navy background
      marginBottom: -45, 
  },
  profileInfo: {
      flex: 1,
  },
  greetingText: {
      fontSize: 13,
      color: SLATE_GREY,
      fontWeight: '500',
      marginBottom: 2,
  },
  nameText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#1E293B',
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#F1F5F9',
  },

  // Tab Separator
  tabContainer: {
      marginTop: 65, // Account for floating card
      paddingHorizontal: 20,
      marginBottom: 20,
  },
  tabPillContainer: {
      flexDirection: 'row',
      backgroundColor: '#E2E8F0', // Inner grey track
      borderRadius: 12,
      padding: 4,
  },
  tabButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 8,
  },
  tabButtonActive: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
  },
  tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#94A3B8',
  },
  tabTextActive: {
      color: BRAND_NAVY,
  },

  // Feed
  feedContent: {
      paddingHorizontal: 20,
  },
  dateHeader: {
      fontSize: 12,
      fontWeight: '700',
      color: SLATE_GREY,
      letterSpacing: 1.2,
      marginBottom: 12,
      marginTop: 8,
  },

  // Command Cards
  commandCard: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 3,
      overflow: 'hidden',
  },
  cardAccentLine: {
      width: 4,
      height: '100%',
  },
  cardMain: {
      flex: 1,
      padding: 20,
      zIndex: 2,
  },
  bgIconWrap: {
      position: 'absolute',
      right: -20,
      bottom: -30,
      zIndex: 1,
      opacity: 0.8,
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
  },
  subjectName: {
      fontSize: 20,
      fontWeight: '800',
      color: '#1E293B',
      fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  examTime: {
      fontSize: 18,
      fontWeight: '800',
      color: BRAND_NAVY,
  },
  dataGrid: {
      marginBottom: 12,
  },
  dataRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
  },
  dataIcon: {
      marginRight: 8,
      opacity: 0.8,
  },
  dataText: {
      fontSize: 14,
      color: '#475569',
      fontWeight: '500',
  },

  // Sparkline
  sparklineContainer: {
      alignItems: 'flex-end',
      marginTop: 4,
  },
  sparklineLabel: {
      fontSize: 10,
      color: '#94A3B8',
      fontWeight: '600',
      marginBottom: 4,
  },
  sparklineMock: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 25,
      gap: 3,
  },
  bar: {
      width: 6,
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
  },

  // Bottom Nav
  bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#F1F5F9',
      paddingTop: 12,
      justifyContent: 'space-around',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 10,
  },
  navItem: {
      alignItems: 'center',
      flex: 1,
  },
  navItemTextActive: {
      fontSize: 11,
      fontWeight: '600',
      color: BRAND_NAVY,
      marginTop: 4,
  },
  navItemText: {
      fontSize: 11,
      fontWeight: '500',
      color: '#94A3B8',
      marginTop: 4,
  }
});
