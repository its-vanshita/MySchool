import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import { useUser } from '../../src/context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  items: FAQItem[];
};

export default function FAQScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { role } = useUser();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    {
      id: 'sp1',
      question: 'How can I check my attendance?',
      answer: 'Go to the Attendance tab. You can view your daily attendance status and monthly summary.',
    },
    {
      id: 'sp2',
      question: 'Where can I see exam results?',
      answer: 'Exam results are published in the Marks/Results tab. You will also receive a notification when new results are declared.',
    },
    {
      id: 'sp3',
      question: 'How do I apply for leave?',
      answer: 'Go to the Leave tab and tap on "Apply Leave". Fill in the dates and reason, then submit. You will be notified once it is approved.',
    },
     {
      id: 'sp4',
      question: 'How do I view the class timetable?',
      answer: 'Navigate to the Timetable section from the drawer menu to see the weekly schedule.',
    },
  ];

  const teacherFAQs: FAQItem[] = [
    {
      id: 't1',
      question: 'How do I mark attendance for my class?',
      answer: 'Go to the Attendance tab, select your class and section, then tap on the students to toggle their status. Click Submit to save.',
    },
    {
      id: 't2',
      question: 'How can I upload homework?',
      answer: 'Navigate to "Add Homework" from your dashboard. Select the class, subject, enter details, and attach any files if necessary.',
    },
    {
      id: 't3',
      question: 'Where can I see my leave balance?',
      answer: 'Your leave balance is displayed at the top of the "Apply Leave" screen.',
    },
    {
      id: 't4',
      question: 'How do I enter marks for students?',
      answer: 'Go to the Marks tab, select the exam and subject. You can then enter obtained marks for each student in the list.',
    },
  ];

  const adminFAQs: FAQItem[] = [
    {
      id: 'a1',
      question: 'How do I approve leave requests?',
      answer: 'Go to "Leave Approvals" dashboard. You will see a list of pending requests. Swipe or tap to approve or reject.',
    },
    {
      id: 'a2',
      question: 'How can I send a notice to the whole school?',
      answer: 'Use the "Create Notice" feature. Select "All" as the recipient group to broadcast the message to all students and staff.',
    },
    {
        id: 'a3',
        question: 'How to manage user accounts?',
        answer: 'You can add or deactivate users from the User Management section in your admin dashboard.',
    }
  ];

  let faqsToDisplay = [...commonFAQs];

  if (role === 'admin') {
    faqsToDisplay = [...faqsToDisplay, ...adminFAQs];
  } else if (role === 'teacher') {
    faqsToDisplay = [...faqsToDisplay, ...teacherFAQs];
  } else {
    // Parent or Student
    faqsToDisplay = [...faqsToDisplay, ...studentParentFAQs];
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Help & FAQs', headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
            <Text style={styles.headerSubtitle}>
                Find answers to common questions about using the app.
            </Text>
        </View>

        {faqsToDisplay.map((item) => (
          <View key={item.id} style={styles.card}>
            <TouchableOpacity
              style={styles.questionHeader}
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.questionText}>{item.question}</Text>
              <Ionicons
                name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
            {expandedId === item.id && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
        
        <View style={styles.supportContainer}>
            <Ionicons name="headset-outline" size={24} color={colors.primary} />
            <Text style={styles.supportText}>Still need help? Contact support</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textLight,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  questionText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    paddingRight: spacing.sm,
  },
  answerContainer: {
    padding: spacing.md,
    paddingTop: 0,
    backgroundColor: colors.white,
  },
  answerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  supportContainer: {
      marginTop: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
      opacity: 0.7
  },
  supportText: {
      color: colors.primary,
      fontWeight: '600'
  }
});
