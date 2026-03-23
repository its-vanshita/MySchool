import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';

import { useSharedUsers } from '../../src/hooks/useSharedUsers';

export default function AdminAttendanceListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type === 'teachers' ? 'teachers' : 'students';

  const { teachers, students } = useSharedUsers();
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');

  const data = type === 'teachers' ? teachers : students;
  const filteredData = data.filter(item => filter === 'all' || item.status === filter);

  const presentCount = data.filter(d => d.status === 'present').length;
  const absentCount = data.filter(d => d.status === 'absent').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {type === 'teachers' ? 'Staff Directory & Attendance' : 'Student Directory & Attendance'}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, filter === 'all' && styles.tabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.tabText, filter === 'all' && styles.tabTextActive]}>
            All ({data.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === 'present' && styles.tabActive]}
          onPress={() => setFilter('present')}
        >
          <Text style={[styles.tabText, filter === 'present' && styles.tabTextActive]}>
            Present ({presentCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === 'absent' && styles.tabActive]}
          onPress={() => setFilter('absent')}
        >
          <Text style={[styles.tabText, filter === 'absent' && styles.tabTextActive]}>
            Absent ({absentCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredData.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSub}>{type === 'teachers' ? (item as any).role : (item as any).class}</Text>
            </View>
            <View style={[styles.statusBadge, item.status === 'present' ? styles.statusPresent : styles.statusAbsent]}>
              <Text style={[styles.statusText, item.status === 'present' ? styles.statusTextPresent : styles.statusTextAbsent]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
        {filteredData.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
            <Ionicons name="people-outline" size={48} color={colors.textLight} />
            <Text style={{ marginTop: 12, color: colors.textSecondary }}>No records found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: spacing.xl,
  },
  backButton: { marginRight: spacing.md },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.white },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 },
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: borderRadius.md },
  tabActive: { backgroundColor: colors.primaryLight },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '700' },

  listContent: { padding: spacing.xl },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: spacing.md, backgroundColor: '#E5E7EB' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  itemSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusPresent: { backgroundColor: '#E8F5E9' },
  statusAbsent: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 10, fontWeight: '800' },
  statusTextPresent: { color: colors.success },
  statusTextAbsent: { color: colors.danger },
});
