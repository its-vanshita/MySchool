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
import { useNotificationBadge } from '../../src/context/NotificationContext';
import { getClasses } from '../../src/services/supabaseService';
import { useSharedUsers } from '../../src/hooks/useSharedUsers';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { ClassInfo, NoticeType, TargetAudience } from '../../src/types';

const NOTICE_TYPES: { value: NoticeType; label: string; color: string }[] = [
  { value: 'general', label: 'General', color: colors.info },
  { value: 'urgent', label: 'Urgent', color: colors.danger },
  { value: 'event', label: 'Event', color: colors.success },
];

export default function AssignNoticeScreen() {
  const router = useRouter();
  const { profile } = useUser();
  const { addNotice } = useNotices();
  const { addNotification } = useNotificationBadge();
  const { teachers, students: allStudents } = useSharedUsers();

  const [targetAudience, setTargetAudience] = useState<TargetAudience>('all');
  
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [type, setType] = useState<NoticeType>('general');
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile?.school_id) {
      getClasses(profile.school_id).then(setClasses);
    }
  }, [profile]);

  const toggleClass = (id: string) => setSelectedClasses(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleTeacher = (id: string) => setSelectedTeachers(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleStudent = (id: string) => setSelectedStudents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Missing Fields', 'Please enter both title and message.');
      return;
    }
    if (targetAudience === 'specific_classes' && selectedClasses.length === 0) return Alert.alert('Error', 'Select at least one class.');
    if (targetAudience === 'specific_teachers' && selectedTeachers.length === 0) return Alert.alert('Error', 'Select at least one teacher.');
    if (targetAudience === 'specific_students' && selectedStudents.length === 0) return Alert.alert('Error', 'Select at least one student.');

    setSubmitting(true);
    try {
      await addNotice({
        title: title.trim(),
        message: message.trim(),
        type,
        class_id: targetAudience === 'specific_classes' ? selectedClasses[0] : '', // legacy compat
        class_name: targetAudience === 'specific_classes' ? 'Selected Classes' : (targetAudience === 'all' ? 'All' : targetAudience),
        attachment_url: '',
        created_by: profile?.id ?? '',
        creator_name: profile?.name ?? 'Admin',
        target_audience: targetAudience,
        target_classes: selectedClasses,
        target_teachers: selectedTeachers,
        target_students: selectedStudents,
      });

      if (targetAudience === 'all' || targetAudience === 'teachers' || targetAudience === 'specific_teachers') {
        addNotification({ title: `Notice: ${title.trim()}`, message: message.trim(), type: 'notice' });
      }

      Alert.alert('Success', 'Notice assigned successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to assign notice. Note: Please ensure UPDATE_NOTICES_SCHEMA.sql was executed in Supabase.');
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

        <Text style={styles.label}>Target Audience</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
          {[
            { id: 'all', label: 'Everybody' },
            { id: 'students', label: 'All Students' },
            { id: 'teachers', label: 'All Teachers' },
            { id: 'specific_classes', label: 'Specific Classes' },
            { id: 'specific_teachers', label: 'Specific Teachers' },
            { id: 'specific_students', label: 'Specific Students' }
          ].map(aud => (
            <TouchableOpacity
              key={aud.id}
              style={[styles.chip, targetAudience === aud.id && styles.chipActive]}
              onPress={() => setTargetAudience(aud.id as TargetAudience)}
            >
              <Text style={[styles.chipText, targetAudience === aud.id && styles.chipTextActive]}>{aud.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {targetAudience === 'specific_classes' && (
          <>
            <Text style={styles.label}>Select Classes</Text>
            <View style={styles.wrapRow}>
              {classes.map((c) => (
                <TouchableOpacity key={c.id} style={[styles.chip, selectedClasses.includes(c.id) && styles.chipActive]} onPress={() => toggleClass(c.id)}>
                  <Text style={[styles.chipText, selectedClasses.includes(c.id) && styles.chipTextActive]}>{c.name} {c.section || ''}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {targetAudience === 'specific_teachers' && (
          <>
            <Text style={styles.label}>Select Teachers</Text>
            <View style={styles.wrapRow}>
              {teachers.map((t) => (
                <TouchableOpacity key={t.id} style={[styles.chip, selectedTeachers.includes(t.id) && styles.chipActive]} onPress={() => toggleTeacher(t.id)}>
                  <Text style={[styles.chipText, selectedTeachers.includes(t.id) && styles.chipTextActive]}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {targetAudience === 'specific_students' && (
          <>
            <Text style={styles.label}>Select Students (Recent 50)</Text>
            <View style={styles.wrapRow}>
              {allStudents.slice(0, 50).map((s) => (
                <TouchableOpacity key={s.id} style={[styles.chip, selectedStudents.includes(s.id) && styles.chipActive]} onPress={() => toggleStudent(s.id)}>
                  <Text style={[styles.chipText, selectedStudents.includes(s.id) && styles.chipTextActive]}>{s.name} ({s.class})</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="Notice title" value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Message</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Write notice here..." value={message} onChangeText={setMessage} multiline numberOfLines={6} textAlignVertical="top" />

        <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color={colors.white} /> : <><Ionicons name="send" size={20} color={colors.white} /><Text style={styles.submitBtnText}>Send Notice</Text></>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 100 },
  label: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm, marginTop: spacing.lg },
  typeRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  typeChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border },
  typeChipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  scrollRow: { flexDirection: 'row', marginBottom: spacing.sm },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  chip: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, marginRight: spacing.sm, marginBottom: spacing.sm },
  chipActive: { backgroundColor: colors.primary + '20', borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  chipTextActive: { color: colors.primary, fontWeight: '700' },
  input: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: fontSize.md, color: colors.textPrimary },
  textArea: { minHeight: 120, paddingTop: spacing.md },
  submitBtn: { flexDirection: 'row', backgroundColor: colors.primary, padding: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700', marginLeft: spacing.sm },
});
