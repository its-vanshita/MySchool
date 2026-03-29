import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSharedUsers } from '../../src/hooks/useSharedUsers';

const BRAND_NAVY = '#153462';
const BRAND_NAVY_LIGHT = '#2563EB';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const { width } = Dimensions.get('window');

export default function AdminAttendanceListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const type = params.type === 'teachers' ? 'teachers' : 'students';
  const insets = useSafeAreaInsets();

  const { teachers, students } = useSharedUsers();
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');

  const data = type === 'teachers' ? teachers : students;
  const filteredData = data.filter(item => filter === 'all' || item.status === filter);

  const presentCount = data.filter(d => d.status === 'present').length;
  const absentCount = data.filter(d => d.status === 'absent').length;

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={[styles.headerArea, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={PURE_WHITE} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>
              {type === 'teachers' ? 'Daily Staff List' : 'Daily Overview'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {type === 'teachers' ? 'Staff Directory & Attendance' : 'Student Directory & Attendance'}
            </Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, filter === 'all' && styles.tabActive]}
            onPress={() => setFilter('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, filter === 'all' && styles.tabTextActive]}>
              All ({data.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, filter === 'present' && styles.tabActive]}
            onPress={() => setFilter('present')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, filter === 'present' && styles.tabTextActive]}>
              Present ({presentCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, filter === 'absent' && styles.tabActive]}
            onPress={() => setFilter('absent')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, filter === 'absent' && styles.tabTextActive]}>
              Absent ({absentCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredData.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSub}>{type === 'teachers' ? (item as any).role : (item as any).class}</Text>
            </View>
            <View style={[styles.statusBadge, item.status === 'present' ? styles.statusPresent : styles.statusAbsent]}>
              <View style={[styles.statusDot, item.status === 'present' ? { backgroundColor: '#16A34A'} : { backgroundColor: '#DC2626' }]} />
              <Text style={[styles.statusText, item.status === 'present' ? styles.statusTextPresent : styles.statusTextAbsent]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
        {filteredData.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="people-outline" size={40} color="#94A3B8" />    
            </View>
            <Text style={styles.emptyTitle}>No records found.</Text>
            <Text style={styles.emptySub}>No one is currently in this status.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: BG_LIGHT 
  },
  headerArea: {
    backgroundColor: BRAND_NAVY,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 6,
  },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderRadius: 12 
  },
  tabActive: { 
    backgroundColor: PURE_WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#E2E8F0' 
  },
  tabTextActive: { 
    color: BRAND_NAVY, 
    fontWeight: '700' 
  },

  listContent: { 
    padding: 20, 
    paddingTop: 24,
    paddingBottom: 100 
  },
  itemCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: PURE_WHITE,
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16,        
    borderWidth: 1, 
    borderColor: 'rgba(0,0,0,0.03)',
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 12, 
    shadowOffset: { width: 0, height: 6 }
  },
  avatar: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    marginRight: 16, 
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#F8FAFC'
  },
  itemInfo: { flex: 1 },
  itemName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: DARK_TEXT,
    marginBottom: 4,
  },     
  itemSub: { 
    fontSize: 13, 
    color: SLATE_GREY, 
    fontWeight: '500'
  },

  statusBadge: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusPresent: { 
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0'
  },
  statusAbsent: { 
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  statusText: { 
    fontSize: 11, 
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusTextPresent: { color: '#16A34A' },
  statusTextAbsent: { color: '#DC2626' },

  emptyState: {
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: { 
    fontSize: 18,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: SLATE_GREY,
  }
});
