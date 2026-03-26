import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Premium Theme Variables
const BRAND_NAVY = '#153462';
const EMERALD = '#10B981';
const CORAL_RED = '#EF4444';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const SOFT_BG = '#F1F5F9';

const DEMO_FEE_STRUCTURE = [
  {
    id: '1',
    term: 'Term 1 (Apr - Sep)',
    amount: 25000,
    dueDate: '2025-04-15',
    status: 'paid' as const,
    paidDate: '2025-04-10',
    receiptNo: 'REC-2025-001',
  },
  {
    id: '2',
    term: 'Term 2 (Oct - Mar)',
    amount: 25000,
    dueDate: '2025-10-15',
    status: 'paid' as const,
    paidDate: '2025-10-12',
    receiptNo: 'REC-2025-002',
  },
  {
    id: '3',
    term: 'Term 3 (Apr - Sep)',
    amount: 27000,
    dueDate: '2026-04-15',
    status: 'pending' as const,
    paidDate: null,
    receiptNo: null,
  },
  {
    id: '4',
    term: 'Annual Activities',
    amount: 5000,
    dueDate: '2026-05-01',
    status: 'upcoming' as const,
    paidDate: null,
    receiptNo: null,
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function isOverdue(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export default function FeeManagementScreen() {
  const insets = useSafeAreaInsets();
  
  const totalFee = DEMO_FEE_STRUCTURE.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = DEMO_FEE_STRUCTURE
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = totalFee - paidAmount;
  const progressPercent = Math.round((paidAmount / totalFee) * 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: BRAND_NAVY },
          headerShadowVisible: false,
          headerTintColor: PURE_WHITE,
          headerTitle: 'Fee Management',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
            fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Background Extension for Hero Card Integration */}
        <View style={styles.headerExtension} />

        {/* Hero Summary Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Academic Year 2025-2026</Text>
          <Text style={styles.heroSubtitle}>Arjun Sharma • Class 8-B</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>PAID</Text>
              <Text style={styles.metricValue}>₹{paidAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>PENDING</Text>
              <Text style={styles.metricValuePending}>₹{pendingAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>TOTAL</Text>
              <Text style={styles.metricValue}>₹{totalFee.toLocaleString()}</Text>
            </View>
          </View>

          {/* Progress Bar Container */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarTrack}>
              <LinearGradient
                colors={[BRAND_NAVY, EMERALD]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
              />
            </View>
            <Text style={styles.progressIndicator}>{progressPercent}% Funded</Text>
          </View>
        </View>

        {/* Payment Details List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
        </View>

        <View style={styles.listContainer}>
          {DEMO_FEE_STRUCTURE.map((fee) => {
            const dueDate = new Date(fee.dueDate + 'T00:00:00');
            const dueDateStr = `${MONTHS[dueDate.getMonth()]} ${dueDate.getDate()}, ${dueDate.getFullYear()}`;
            const overdue = fee.status !== 'paid' && isOverdue(fee.dueDate);

            return (
              <View key={fee.id} style={styles.feeCard}>
                <View style={styles.feeTopRow}>
                  <View style={styles.feeTitleContainer}>
                    <Text style={styles.feeTerm}>{fee.term}</Text>
                    <Text style={[styles.feeDue, overdue ? styles.feeDueOverdue : null]}>
                      Due: {dueDateStr}
                    </Text>
                  </View>

                  {fee.status === 'paid' && (
                    <View style={styles.paidBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={EMERALD} />
                      <Text style={styles.paidBadgeText}>Paid</Text>
                    </View>
                  )}
                </View>

                <View style={styles.feeBottomRow}>
                  <Text style={styles.feeAmount}>₹{fee.amount.toLocaleString()}</Text>
                  
                  {fee.status === 'paid' && fee.receiptNo && (
                    <TouchableOpacity style={styles.receiptButton} activeOpacity={0.7}>
                      <Ionicons name="document-text-outline" size={16} color={BRAND_NAVY} style={{ strokeWidth: 1.5 } as any} />
                      <Text style={styles.receiptButtonText}>Receipt</Text>
                    </TouchableOpacity>
                  )}
                  
                  {fee.status === 'pending' && (
                    <TouchableOpacity style={styles.payNowButton} activeOpacity={0.8}>
                      <View style={styles.payNowInner}>
                        <Text style={styles.payNowText}>Pay Now</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  
                  {fee.status === 'upcoming' && (
                    <View style={styles.upcomingBadge}>
                      <Text style={styles.upcomingText}>Upcoming</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
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
  headerExtension: {
    backgroundColor: BRAND_NAVY,
    height: 60,
    width: '100%',
    position: 'absolute',
    top: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content: {
    paddingBottom: 100,
  },
  
  // Hero Card
  heroCard: {
    backgroundColor: PURE_WHITE,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  heroSubtitle: {
    fontSize: 14,
    color: SLATE_GREY,
    marginTop: 4,
    marginBottom: 24,
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: SLATE_GREY,
    letterSpacing: 1,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: DARK_TEXT,
  },
  metricValuePending: {
    fontSize: 16,
    fontWeight: '800',
    color: BRAND_NAVY,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginTop: 16,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: SOFT_BG,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: SLATE_GREY,
    marginTop: 8,
    textAlign: 'right',
  },

  // Payment Details Section
  sectionHeader: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_TEXT,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  feeCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 0,
  },
  feeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  feeTitleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  feeTerm: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 4,
  },
  feeDue: {
    fontSize: 13,
    color: SLATE_GREY,
    fontWeight: '500',
  },
  feeDueOverdue: {
    color: CORAL_RED,
    fontWeight: '600',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: EMERALD,
  },
  feeBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: SOFT_BG,
  },
  feeAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: DARK_TEXT,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND_NAVY,
  },
  payNowButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  payNowInner: {
    backgroundColor: BRAND_NAVY,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)', // Subtle inner glow effect
  },
  payNowText: {
    color: PURE_WHITE,
    fontSize: 14,
    fontWeight: '700',
  },
  upcomingBadge: {
    backgroundColor: SOFT_BG,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upcomingText: {
    color: SLATE_GREY,
    fontSize: 13,
    fontWeight: '600',
  }
});
