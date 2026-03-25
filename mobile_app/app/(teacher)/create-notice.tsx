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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useNotices } from '../../src/hooks/useNotices';
import { getClasses } from '../../src/services/supabaseService';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { ClassInfo, NoticeType } from '../../src/types';

const getNoticeTypes = (colors: any) => [
  { value: 'general', label: 'General', color: colors.info },
  { value: 'urgent', label: 'Urgent', color: colors.danger },
  { value: 'event', label: 'Event', color: colors.success },
  { value: 'holiday', label: 'Holiday', color: colors.warning },
  { value: 'exam', label: 'Exam', color: colors.purple }
];

export default function CreateNoticeScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { profile } = useUser();
  const { addNotice } = useNotices();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NoticeType>('general');
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile?.school_id) {
      getClasses(profile.school_id).then(setClasses);
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a notice title.');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Missing Message', 'Please enter the notice message.');
      return;
    }

    setSubmitting(true);
    try {
      await addNotice({
        title: title.trim(),
        message: message.trim(),
        type,
        class_id: selectedClass?.id ?? '',
        class_name: selectedClass?.name ?? 'All Classes',
        attachment_url: '',
        created_by: profile?.id ?? '',
        creator_name: profile?.name ?? '',
      });
      Alert.alert('Success', 'Notice sent!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Error', 'Failed to send notice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Notice Type */}
      <Text style={styles.label}>Type</Text>
      <View style={styles.typeRow}>
        {getNoticeTypes(colors).map((t) => (
          <TouchableOpacity
            key={t.value}
            style={[
              styles.typeChip,
              type === t.value && { backgroundColor: t.color + '20', borderColor: t.color },
            ]}
            onPress={() => setType(t.value as NoticeType)}
          >
            <Text
              style={[styles.typeChipText, type === t.value && { color: t.color, fontWeight: '700' }]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Class Selection */}
      <Text style={styles.label}>Send To</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classScroll}>
        <TouchableOpacity
          style={[styles.classChip, !selectedClass && styles.classChipActive]}
          onPress={() => setSelectedClass(null)}
        >
          <Text style={[styles.classChipText, !selectedClass && styles.classChipTextActive]}>
            All Classes
          </Text>
        </TouchableOpacity>
        {classes.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.classChip, selectedClass?.id === c.id && styles.classChipActive]}
            onPress={() => setSelectedClass(c)}
          >
            <Text
              style={[
                styles.classChipText,
                selectedClass?.id === c.id && styles.classChipTextActive,
              ]}
            >
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Notice title"
        placeholderTextColor={colors.textLight}
        value={title}
        onChangeText={setTitle}
      />

      {/* Message */}
      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your notice message here..."
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
            <Text style={styles.submitBtnText}>Send Notice</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 100 },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  typeChip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  typeChipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  classScroll: { marginBottom: spacing.sm },
  classChip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  classChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  classChipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  classChipTextActive: { color: colors.primary, fontWeight: '700' },
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

