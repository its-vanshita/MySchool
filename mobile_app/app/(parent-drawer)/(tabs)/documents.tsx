import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Premium Theme Variables
const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const SOFT_BG = '#F1F5F9';

const DEMO_DOCUMENTS = [
  {
    id: '1',
    title: 'Report Card - Term 1',
    category: 'Reports',
    date: 'Mar 10, 2026',
    type: 'PDF',
    size: '850 KB',
    icon: 'document-text-outline' as const,
  },
  {
    id: '2',
    title: 'Transfer Certificate',
    category: 'Certificates',
    date: 'Feb 20, 2026',
    type: 'PDF',
    size: '1.2 MB',
    icon: 'ribbon-outline' as const,
  },
  {
    id: '3',
    title: 'Fee Receipt - Q1',
    category: 'Receipts',
    date: 'Mar 01, 2026',
    type: 'PDF',
    size: '420 KB',
    icon: 'receipt-outline' as const,
  },
  {
    id: '4',
    title: 'Character Certificate',
    category: 'Certificates',
    date: 'Jan 15, 2026',
    type: 'PDF',
    size: '980 KB',
    icon: 'document-outline' as const,
  },
  {
    id: '5',
    title: 'Syllabus 2026-2027',
    category: 'Other',
    date: 'Mar 25, 2026',
    type: 'PDF',
    size: '2.5 MB',
    icon: 'book-outline' as const,
  },
];

const CATEGORIES = ['All', 'Reports', 'Certificates', 'Receipts', 'Other'];

export default function DocumentVaultScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = DEMO_DOCUMENTS.filter(doc => {
    const matchesCat = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: BRAND_NAVY },
          headerShadowVisible: false,
          headerTintColor: PURE_WHITE,
          headerTitle: 'Documents',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
            fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          },
        }}
      />

      {/* Header Background Extension for Search Bar */}
      <View style={styles.headerExtension}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={SLATE_GREY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            placeholderTextColor={SLATE_GREY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Category Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesContainer}
          style={styles.categoriesWrapper}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Document List */}
        <View style={styles.listContainer}>
          {filteredDocs.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.iconCircle}>
                <Ionicons name={doc.icon} size={24} color={BRAND_NAVY} strokeWidth={1.5} />
              </View>
              
              <View style={styles.docInfo}>
                <Text style={styles.docTitle} numberOfLines={1}>{doc.title}</Text>
                <Text style={styles.docMeta}>
                  {doc.date} • {doc.type} • {doc.size}
                </Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                  <Ionicons name="eye-outline" size={22} color={BRAND_NAVY} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                  <Ionicons name="download-outline" size={22} color={BRAND_NAVY} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {filteredDocs.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Documents Found</Text>
              <Text style={styles.emptySub}>Try adjusting your search or category</Text>
            </View>
          )}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURE_WHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: DARK_TEXT,
    fontWeight: '500',
    height: '100%',
  },
  content: {
    paddingBottom: 100,
  },
  categoriesWrapper: {
    marginTop: 24,
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: PURE_WHITE,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: BRAND_NAVY,
    borderColor: BRAND_NAVY,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: SLATE_GREY,
  },
  categoryTextActive: {
    color: PURE_WHITE,
  },
  listContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 16,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURE_WHITE,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 0,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: SOFT_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  docInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_NAVY,
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  docMeta: {
    fontSize: 13,
    color: SLATE_GREY,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PURE_WHITE,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_NAVY,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    color: SLATE_GREY,
    marginTop: 8,
  },
});
