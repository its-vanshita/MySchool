import React, { useState } from 'react';
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
import { useUser } from '../src/context/UserContext';
import { useAnnouncements } from '../src/hooks/useAnnouncements';
import { colors } from '../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../src/theme/spacing';
import type { AnnouncementPriority } from '../src/types';

const PRIORITIES: { value: AnnouncementPriority; label: string; color: string; icon: string }[] = [
  { value: 'low', label: 'Low', color: colors.textSecondary, icon: 'arrow-down' },
  { value: 'normal', label: 'Normal', color: colors.info, icon: 'remove' },
  { value: 'high', label: 'High', color: colors.warning, icon: 'arrow-up' },
  { value: 'urgent', label: 'Urgent', color: colors.danger, icon: 'alert-circle' },
];

export default function CreateAnnouncementScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const { addAnnouncement } = useAnnouncements();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title.');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Missing Message', 'Please enter the announcement message.');
      return;
    }

    setSubmitting(true);
    try {
      await addAnnouncement({
        title: title.trim(),
        message: message.trim(),
        priority,
        created_by: profile?.id ?? '',
        creator_name: profile?.name ?? '',
        school_id: profile?.school_id ?? '',
      });
      Alert.alert('Success', 'Announcement published!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to publish. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={colors.info} />
        <Text style={styles.infoText}>
          Announcements are visible to all teachers and staff members.
        </Text>
      </View>

      {/* Priority */}
      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[
              styles.priorityChip,
              priority === p.value && { backgroundColor: p.color + '20', borderColor: p.color },
            ]}
            onPress={() => setPriority(p.value)}
          >
            <Ionicons name={p.icon as any} size={16} color={priority === p.value ? p.color : colors.textLight} />
            <Text
              style={[
                styles.priorityChipText,
                priority === p.value && { color: p.color, fontWeight: '700' },
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Announcement title"
        placeholderTextColor={colors.textLight}
        value={title}
        onChangeText={setTitle}
      />

      {/* Message */}
      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your announcement here..."
        placeholderTextColor={colors.textLight}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={8}
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
            <Ionicons name="megaphone" size={20} color={colors.white} />
            <Text style={styles.submitBtnText}>Publish Announcement</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoText: { flex: 1, fontSize: fontSize.sm, color: colors.info },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  priorityRow: { flexDirection: 'row', gap: spacing.sm },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  priorityChipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  textArea: { minHeight: 150, textAlignVertical: 'top' },
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
