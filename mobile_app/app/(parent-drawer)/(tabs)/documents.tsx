import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';

const DEMO_DOCUMENTS = [
  {
    id: '1',
    title: 'Report Card - Term 1',
    type: 'report',
    date: '2025-12-15',
    icon: 'document-text' as const,
    color: '#1565C0',
    bgColor: '#E3F2FD',
  },
  {
    id: '2',
    title: 'Transfer Certificate',
    type: 'certificate',
    date: '2025-10-20',
    icon: 'ribbon' as const,
    color: '#7B1FA2',
    bgColor: '#F3E5F5',
  },
  {
    id: '3',
    title: 'Fee Receipt - March 2026',
    type: 'receipt',
    date: '2026-03-01',
    icon: 'receipt' as const,
    color: '#2E7D32',
    bgColor: '#E8F5E9',
  },
  {
    id: '4',
    title: 'Character Certificate',
    type: 'certificate',
    date: '2025-11-10',
    icon: 'shield-checkmark' as const,
    color: '#E65100',
    bgColor: '#FFF3E0',
  },
  {
    id: '5',
    title: 'Report Card - Term 2',
    type: 'report',
    date: '2026-03-10',
    icon: 'document-text' as const,
    color: '#1565C0',
    bgColor: '#E3F2FD',
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ParentDocumentsScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerIconCircle}>
          <Ionicons name="folder-open" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Documents</Text>
          <Text style={styles.headerSub}>
            Arjun Sharma • Class 8-B
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{DEMO_DOCUMENTS.length}</Text>
        </View>
      </View>

      {/* Document Categories */}
      <View style={styles.categoriesRow}>
        <TouchableOpacity style={[styles.categoryPill, styles.categoryPillActive]}>
          <Text style={[styles.categoryText, styles.categoryTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryPill}>
          <Text style={styles.categoryText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryPill}>
          <Text style={styles.categoryText}>Certificates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryPill}>
          <Text style={styles.categoryText}>Receipts</Text>
        </TouchableOpacity>
      </View>

      {/* Documents List */}
      {DEMO_DOCUMENTS.map((doc) => {
        const d = new Date(doc.date + 'T00:00:00');
        const dateStr = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        return (
          <TouchableOpacity key={doc.id} style={styles.docCard} activeOpacity={0.7}>
            <View style={[styles.docIcon, { backgroundColor: doc.bgColor }]}>
              <Ionicons name={doc.icon} size={22} color={doc.color} />
            </View>
            <View style={styles.docContent}>
              <Text style={styles.docTitle}>{doc.title}</Text>
              <View style={styles.docMeta}>
                <Ionicons name="calendar-outline" size={12} color={colors.textLight} />
                <Text style={styles.docDate}>{dateStr}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="download-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { paddingBottom: 100 },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  headerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },

  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.white,
  },

  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: 10,
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
  docIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docContent: { flex: 1 },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  docMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  docDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

