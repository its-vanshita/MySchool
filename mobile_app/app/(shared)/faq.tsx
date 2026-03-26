import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BRAND_NAVY = '#153462';
const BRAND_NAVY_LIGHT = '#214d8c';
const BG_LIGHT = '#F8F9FB';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export default function FAQScreen() {
  const router = useRouter();
  const { role } = useUser();
  const insets = useSafeAreaInsets();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('General');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const commonFAQs: FAQItem[] = [
    {
      id: 'c1',
      question: 'How do I change my password?',
      answer: 'Go to Settings > Change Password. Enter your current password and your new desired password twice to confirm.',
    },
    {
      id: 'c2',
      question: 'Who do I contact for technical support?',
      answer: 'For any app-related issues, please contact the IT department at support@school.edu or visit the admin office.',
    },
    {
      id: 'c3',
      question: 'How do I update my profile picture?',
      answer: "Navigate to your Profile tab and tap on your profile image or the edit icon. You'll be able to choose a new photo from your gallery.",
    },
  ];

  const studentParentFAQs: FAQItem[] = [
    { id: 'sp1', question: 'How can I check my attendance?', answer: 'Go to the Attendance tab. You can view your daily attendance status and monthly summary.' },
    { id: 'sp2', question: 'Where can I see exam results?', answer: 'Exam results are published in the Marks/Results tab. You will also receive a notification.' },
  ];


  const teacherFAQs: FAQItem[] = [
    { id: 't1', question: 'How do I mark attendance for my class?', answer: 'Go to the Attendance tab, select your class and section, then tap on the students.' },
    { id: 't2', question: 'How can I upload homework?', answer: 'Navigate to "Add Homework" from your dashboard. Select the class, subject, enter details.' },
    { id: 't3', question: 'How do I enter marks?', answer: 'Navigate to the Marks module on your dashboard. Select your assigned subject, class, and the exam term to input and submit the scores.' },
  ];

  const adminFAQs: FAQItem[] = [
    { id: 'a1', question: 'How do I approve leave requests?', answer: 'Go to "Leave Approvals" dashboard. You will see a list of pending requests. Swipe or tap to approve.' },
    { id: 'a2', question: 'How can I send a notice?', answer: 'Use the "Create Notice" feature. Select "All" as the recipient group to broadcast the message.' },
  ];
  
  const allCategories = ['General', 'Account', 'Attendance', 'Marks', 'Leave'];
  
  let faqsToDisplay = [...commonFAQs];
  if (role === 'admin') faqsToDisplay = [...faqsToDisplay, ...adminFAQs];
  else if (role === 'teacher') faqsToDisplay = [...faqsToDisplay, ...teacherFAQs];
  else faqsToDisplay = [...faqsToDisplay, ...studentParentFAQs];

  // Simple search filter
  if (searchQuery.trim().length > 0) {
    faqsToDisplay = faqsToDisplay.filter(f => 
       f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
       f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Area */}
      <View style={[styles.headerArea, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Support Hub</Text>
            <View style={{ width: 40 }} />
        </View>

        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput 
               style={styles.searchInput}
               placeholder="Search for help..."
               placeholderTextColor="#94A3B8"
               value={searchQuery}
               onChangeText={setSearchQuery}
            />
        </View>
      </View>

      {/* Categories */}
      <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {allCategories.map(cat => (
                  <TouchableOpacity 
                     key={cat} 
                     style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
                     onPress={() => setActiveCategory(cat)}
                  >
                      <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>
                          {cat}
                      </Text>
                  </TouchableOpacity>
              ))}
          </ScrollView>
      </View>

      {/* FAQ List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {faqsToDisplay.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <View key={item.id} style={styles.cardWrapper}>
                {isExpanded && <View style={styles.activeBar} />}
                <TouchableOpacity
                style={[styles.card, isExpanded && styles.cardExpanded]}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.8}
                >
                <View style={styles.questionHeader}>
                    <Text style={[styles.questionText, isExpanded && { color: BRAND_NAVY }]}>{item.question}</Text>
                    <Ionicons
                    name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={20}
                    color={isExpanded ? BRAND_NAVY : '#64748B'}
                    style={{ opacity: 0.8 }}
                    />
                </View>
                {isExpanded && (
                    <View style={styles.answerContainer}>
                        <Text style={styles.answerText}>{item.answer}</Text>
                    </View>
                )}
                </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Support Card */}
      <View style={[styles.footerContainer, { paddingBottom: Math.max(insets.bottom, 20) + 16 }]}>
          <LinearGradient
            colors={[BRAND_NAVY, BRAND_NAVY_LIGHT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.supportCard}
          >
              <View style={styles.supportIconWrapper}>
                 <Ionicons name="headset" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.supportTextContent}>
                  <Text style={styles.supportCardText}>Still have questions? Our team is here to help!</Text>
                  <TouchableOpacity style={styles.supportButton} activeOpacity={0.9}>
                      <Text style={styles.supportButtonText}>Contact Support</Text>
                  </TouchableOpacity>
              </View>
          </LinearGradient>
      </View>
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    height: '100%',
  },
  categoryScroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#E0F2FE', // Light blue background
    borderColor: '#BAE6FD',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: BRAND_NAVY,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 180, // High clearance ensure nothing hides behind floating absolute card
  },
  cardWrapper: {
      flexDirection: 'row',
      marginBottom: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
  },
  activeBar: {
      width: 4,
      backgroundColor: BRAND_NAVY,
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardExpanded: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    paddingRight: 16,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  answerText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  footerContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingTop: 24, // extra shadow space
      zIndex: 100, // keep on top
  },
  supportCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 24,
      padding: 20,
      shadowColor: '#153462',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
      elevation: 12,
  },
  supportIconWrapper: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
  },
  supportTextContent: {
      flex: 1,
  },
  supportCardText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 12,
      lineHeight: 22,
  },
  supportButton: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignSelf: 'flex-start',
  },
  supportButtonText: {
      color: BRAND_NAVY,
      fontSize: 14,
      fontWeight: '700',
  }
});
