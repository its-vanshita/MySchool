import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';

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

const STATUS_CONFIG = {
  paid: { label: 'Paid', color: '#2E7D32', bgColor: '#E8F5E9', icon: 'checkmark-circle' as const },
  pending: { label: 'Pending', color: '#E65100', bgColor: '#FFF3E0', icon: 'time' as const },
  upcoming: { label: 'Upcoming', color: '#1565C0', bgColor: '#E3F2FD', icon: 'calendar' as const },
  overdue: { label: 'Overdue', color: '#C62828', bgColor: '#FFEBEE', icon: 'alert-circle' as const },
};

export default function ParentFeeScreen() {
  const totalFee = DEMO_FEE_STRUCTURE.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = DEMO_FEE_STRUCTURE
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = totalFee - paidAmount;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Fee Summary</Text>
        <Text style={styles.summarySubtitle}>Arjun Sharma • Class 8-B</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryDot, { backgroundColor: '#2E7D32' }]} />
            <View>
              <Text style={styles.summaryAmount}>₹{paidAmount.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Paid</Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <View style={[styles.summaryDot, { backgroundColor: '#E65100' }]} />
            <View>
              <Text style={styles.summaryAmount}>₹{pendingAmount.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <View style={[styles.summaryDot, { backgroundColor: '#1565C0' }]} />
            <View>
              <Text style={styles.summaryAmount}>₹{totalFee.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round((paidAmount / totalFee) * 100)}%` as any },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round((paidAmount / totalFee) * 100)}% paid
        </Text>
      </View>

      {/* Fee Items */}
      <Text style={styles.sectionTitle}>Payment Details</Text>

      {DEMO_FEE_STRUCTURE.map((fee) => {
        const config = STATUS_CONFIG[fee.status];
        const dueDate = new Date(fee.dueDate + 'T00:00:00');
        const dueDateStr = `${MONTHS[dueDate.getMonth()]} ${dueDate.getDate()}, ${dueDate.getFullYear()}`;

        return (
          <View key={fee.id} style={styles.feeCard}>
            <View style={styles.feeTop}>
              <View style={[styles.feeIcon, { backgroundColor: config.bgColor }]}>
                <Ionicons name={config.icon} size={22} color={config.color} />
              </View>
              <View style={styles.feeInfo}>
                <Text style={styles.feeTerm}>{fee.term}</Text>
                <Text style={styles.feeDue}>Due: {dueDateStr}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
                <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
              </View>
            </View>

            <View style={styles.feeBottom}>
              <Text style={styles.feeAmount}>₹{fee.amount.toLocaleString()}</Text>
              {fee.status === 'paid' && fee.receiptNo && (
                <TouchableOpacity style={styles.receiptBtn}>
                  <Ionicons name="receipt-outline" size={14} color={colors.primary} />
                  <Text style={styles.receiptText}>{fee.receiptNo}</Text>
                </TouchableOpacity>
              )}
              {fee.status === 'pending' && (
                <TouchableOpacity style={styles.payBtn}>
                  <Text style={styles.payBtnText}>Pay Now</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.white} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { paddingBottom: 32 },

  summaryCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#1565C0',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summarySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  summaryAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  progressText: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 6,
    textAlign: 'right',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },

  feeCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  feeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  feeInfo: { flex: 1 },
  feeTerm: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  feeDue: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  feeBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  receiptText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  payBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
});
