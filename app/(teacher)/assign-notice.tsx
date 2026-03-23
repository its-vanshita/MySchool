import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useNotices } from '../../src/hooks/useNotices';
import { useNotificationBadge } from '../../src/context/NotificationContext';
import { getClasses } from '../../src/services/supabaseService';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { ClassInfo, NoticeType } from '../../src/types';

const NOTICE_TYPES: { value: NoticeType; label: string; color: string }[] = [
  { value: 'general', label: 'General', color: colors.info },
  { value: 'urgent', label: 'Urgent', color: colors.danger },
  { value: 'event', label: 'Event', color: colors.success },
];

const MOCK_TEACHERS = [
  { id: 'T-001', name: 'John Doe' },
  { id: 'T-002', name: 'Jane Smith' },
  { id: 'T-003', name: 'Michael Brown' },
];

export default function AssignNoticeScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const { addNotice } = useNotices();
  const { addNotification } = useNotificationBadge();

  // Selections
  const [targetAudience, setTargetAudience] = useState<'students' | 'teachers'>('students');
  const [teacherTarget, setTeacherTarget] = useState<'all' | 'specific'>('all');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const [type, setType] = useState<NoticeType>('general');
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  // Content
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile?.school_id) {
      getClasses(profile.school_id).then(setClasses);
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Missing Fields', 'Please enter both title and message.');
      return;
    }

    if (targetAudience === 'teachers' && teacherTarget === 'specific' && !selectedTeacherId) {
      Alert.alert('Missing Selection', 'Please select a specific teacher.');
      return;
    }

    setSubmitting(true);
    try {
      if (targetAudience === 'students') {
        // Send to students (via notices table)
        await addNotice({
          title: title.trim(),
          message: message.trim(),
          type,
          class_id: selectedClass?.id ?? '',
          class_name: selectedClass?.name ?? 'All Classes',
          attachment_url: '',
          created_by: profile?.id ?? '',
          creator_name: profile?.name ?? 'Admin',
        });
      } else {
        // Send to Teachers - Simulating via adding to local NotificationContext
        let targetLabel = 'All Teachers';
        if (teacherTarget === 'specific') {
          const t = MOCK_TEACHERS.find(x => x.id === selectedTeacherId);
          targetLabel = `${t?.name} (${t?.id})`;
        }

        addNotification({
          title: `Notice: ${title.trim()}`,
          message: message.trim(),
          type: 'notice',
        });

        console.log(`Notice assigned to: ${targetLabel}`);
      }

      Alert.alert('Success', 'Notice assigned successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Error', 'Failed to assign notice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Target Audience */}
      <Text style={styles.label}>Target Audience</Text>
      <View style={styles.audienceRow}>
        <TouchableOpacity
          style={[styles.audienceBtn, targetAudience === 'students' && styles.audienceBtnActive]}
          onPress={() => setTargetAudience('students')}
        >
          <Ionicons name="people" size={20} color={targetAudience === 'students' ? colors.white : colors.textSecondary} />
          <Text style={[styles.audienceBtnText, targetAudience === 'students' && styles.audienceBtnTextActive]}>
            Students
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.audienceBtn, targetAudience === 'teachers' && styles.audienceBtnActive]}
          onPress={() => setTargetAudience('teachers')}
        >
          <Ionicons name="school" size={20} color={targetAudience === 'teachers' ? colors.white : colors.textSecondary} />
          <Text style={[styles.audienceBtnText, targetAudience === 'teachers' && styles.audienceBtnTextActive]}>
            Teachers
          </Text>
        </TouchableOpacity>
      </View>

      {targetAudience === 'students' ? (
        <>
          {/* Class Selection for Students */}
          <Text style={styles.label}>Send To</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            <TouchableOpacity
              style={[styles.chip, !selectedClass && styles.chipActive]}
              onPress={() => setSelectedClass(null)}
            >
              <Text style={[styles.chipText, !selectedClass && styles.chipTextActive]}>All Classes</Text>
            </TouchableOpacity>
            {classes.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.chip, selectedClass?.id === c.id && styles.chipActive]}
                onPress={() => setSelectedClass(c)}
              >
                <Text style={[styles.chipText, selectedClass?.id === c.id && styles.chipTextActive]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          {/* Teacher Selection */}
          <Text style={styles.label}>Target Teachers</Text>
          <View style={styles.audienceRow}>
            <TouchableOpacity
              style={[styles.chip, teacherTarget === 'all' && styles.chipActive]}
              onPress={() => setTeacherTarget('all')}
            >
              <Text style={[styles.chipText, teacherTarget === 'all' && styles.chipTextActive]}>All Teachers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, teacherTarget === 'specific' && styles.chipActive]}
              onPress={() => setTeacherTarget('specific')}
            >
              <Text style={[styles.chipText, teacherTarget === 'specific' && styles.chipTextActive]}>Specific Teacher</Text>
            </TouchableOpacity>
          </View>

          {teacherTarget === 'specific' && (
            <View style={styles.teacherList}>
              {MOCK_TEACHERS.map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.teacherItem, selectedTeacherId === t.id && styles.teacherItemActive]}
                  onPress={() => setSelectedTeacherId(t.id)}
                >
                  <View style={styles.teacherAvatar}>
                    <Ionicons name="person" size={16} color={selectedTeacherId === t.id ? colors.white : colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.teacherName, selectedTeacherId === t.id && { color: colors.white }]}>{t.name}</Text>
                    <Text style={[styles.teacherId, selectedTeacherId === t.id && { color: 'rgba(255,255,255,0.8)' }]}>ID: {t.id}</Text>
                  </View>
                  {selectedTeacherId === t.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.white} style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}

      {/* Notice Type */}
      <Text style={styles.label}>Notice Type</Text>
      <View style={styles.typeRow}>
        {NOTICE_TYPES.map((t) => (
          <TouchableOpacity
            key={t.value}
            style={[styles.typeChip, type === t.value && { backgroundColor: t.color + '20', borderColor: t.color }]}
            onPress={() => setType(t.value)}
          >
            <Text style={[styles.typeChipText, type === t.value && { color: t.color, fontWeight: '700' }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter notice title"
        placeholderTextColor={colors.textLight}
        value={title}
        onChangeText={setTitle}
      />

      {/* Message */}
      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write the notice details here..."
        placeholderTextColor={colors.textLight}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Ionicons name="send" size={20} color={colors.white} />
            <Text style={styles.submitBtnText}>Assign Notice</Text>
          </>
        )}
      </TouchableOpacity>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  audienceRow: { flexDirection: 'row', gap: spacing.sm },
  audienceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  audienceBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  audienceBtnText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  audienceBtnTextActive: {
    color: colors.white,
  },
  scrollRow: { marginBottom: spacing.sm },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.primary, fontWeight: '700' },
  
  teacherList: {
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  teacherItemActive: {
    backgroundColor: colors.primary,
  },
  teacherAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  teacherName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  teacherId: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 'auto',
  },

  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  typeChip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  typeChipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },
});
