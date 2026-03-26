import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DatesheetIndex() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // High Fidelity Theme Constants
  const THEME = {
    NAVY: '#153462',
    LIGHT_BG: '#F8F9FB',
    CARD_BG: '#FFFFFF',
    SLATE: '#64748B',
    DARK_TEXT: '#1E293B',
    ACCENT_BLUE: '#3B82F6',
    ACCENT_GREEN: '#10B981',
    DIVIDER: '#F1F5F9'
  };

  const handlePressExamInfo = (type: string, name: string) => {
    // In our simplified routing, we just head to the shared view
    // The exact param passing can reflect current logic:
    router.push({
      pathname: '/(shared)/exam-datesheet',
      params: { type, name }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: THEME.LIGHT_BG }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── HEADER HERO ── */}
      <View style={[styles.headerHero, { paddingTop: insets.top, backgroundColor: THEME.NAVY }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Examination Center</Text>
          <TouchableOpacity style={styles.backBtn}>
            <View style={styles.notificationDot} />
            <Ionicons name="notifications-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>Term 2 - Academic Year 2024-25</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Active Exams</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Total Subjects</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── MAIN CONTENT FEED ── */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>UPCOMING EXAMINATIONS</Text>

        {/* Exam Card 1 */}
        <TouchableOpacity 
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => handlePressExamInfo('half-yearly', 'Half Yearly Examination')}
        >
          <View style={[styles.cardAccent, { backgroundColor: THEME.ACCENT_BLUE }]} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                 <Ionicons name="document-text" size={20} color={THEME.ACCENT_BLUE} />
              </View>
              <View style={styles.statusBadge}>
                 <Text style={styles.statusText}>Scheduled</Text>
              </View>
            </View>
            
            <View style={styles.cardBody}>
              <Text style={styles.examTitle}>Half Yearly Examination</Text>
              <Text style={styles.examDate}>Starts Oct 15, 2024</Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="list" size={16} color={THEME.SLATE} style={{marginRight: 6}} />
                <Text style={styles.footerText}>12 Subjects</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={THEME.SLATE} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Exam Card 2 */}
        <TouchableOpacity 
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => handlePressExamInfo('final', 'Final Examination')}
        >
          <View style={[styles.cardAccent, { backgroundColor: THEME.ACCENT_GREEN }]} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
                 <Ionicons name="school" size={20} color={THEME.ACCENT_GREEN} />
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#F1F5F9' }]}>
                 <Text style={[styles.statusText, { color: THEME.SLATE }]}>Upcoming</Text>
              </View>
            </View>
            
            <View style={styles.cardBody}>
              <Text style={styles.examTitle}>Final Examination</Text>
              <Text style={styles.examDate}>Starts Mar 01, 2025</Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="list" size={16} color={THEME.SLATE} style={{marginRight: 6}} />
                <Text style={styles.footerText}>12 Subjects</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={THEME.SLATE} />
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header
  headerHero: {
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#153462',
    shadowOffset: { width: 0, height: 8 },
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
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#153462',
    zIndex: 2,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },

  // Main Content
  scrollContent: {
    padding: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.2,
    marginBottom: 16,
    marginLeft: 4,
  },

  // Premium Cards
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardAccent: {
    width: 5,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 16,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  examDate: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
});
