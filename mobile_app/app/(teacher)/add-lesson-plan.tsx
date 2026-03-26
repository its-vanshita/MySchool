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
  Modal,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useLessonPlans } from '../../src/hooks/useLessonPlans';
import { getTimetableForTeacher, uploadFile } from '../../src/services/supabaseService';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { TimetableEntry } from '../../src/types';

interface SubjectClass {
  label: string;
  subject: string;
  className: string;
}

const DEMO_TIMETABLE: TimetableEntry[] = [
  { id: 't1', teacher_id: 'demo-teacher', subject: 'Mathematics', class_name: 'Class 10A', room: '204', start_time: '09:00', end_time: '09:45', day: 'monday', school_id: 'demo-school' },
  { id: 't2', teacher_id: 'demo-teacher', subject: 'Science', class_name: 'Class 9C', room: 'Lab 02', start_time: '11:30', end_time: '12:15', day: 'monday', school_id: 'demo-school' },
  { id: 't3', teacher_id: 'demo-teacher', subject: 'English', class_name: 'Class 10A', room: '204', start_time: '14:00', end_time: '14:45', day: 'monday', school_id: 'demo-school' },
];

export default function AddLessonPlanScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { profile } = useUser();
  const { addPlan } = useLessonPlans(profile?.id);

  const [subjectClasses, setSubjectClasses] = useState<SubjectClass[]>([]);
  const [selected, setSelected] = useState<SubjectClass | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [unitName, setUnitName] = useState('');
  const [topicName, setTopicName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; type: string } | null>(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        setSelectedFile({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType || 'application/octet-stream',
        });
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  useEffect(() => {
    const load = async () => {
      let timetable: TimetableEntry[] = [];
      if (profile?.id) {
        timetable = await getTimetableForTeacher(profile.id);
        if (timetable.length === 0 && profile.school_id === 'demo-school') {
          timetable = DEMO_TIMETABLE;
        }
      }
      const seen = new Set<string>();
      const opts: SubjectClass[] = [];
      for (const entry of timetable) {
        const key = `${entry.subject}|${entry.class_name}`;
        if (!seen.has(key)) {
          seen.add(key);
          opts.push({
            label: `${entry.subject} - ${entry.class_name}`,
            subject: entry.subject,
            className: entry.class_name,
          });
        }
      }
      
      opts.sort((a, b) => a.label.localeCompare(b.label));
      
      setSubjectClasses(opts);
      if (opts.length > 0) setSelected(opts[0]);
    };
    load();
  }, [profile]);

  const handleSubmit = async () => {
    if (!selected) {
      Alert.alert('Select Class', 'Please choose a subject & class.');
      return;
    }
    if (!topicName.trim()) {
      Alert.alert('Missing Topic', 'Please enter a topic name.');
      return;
    }

    setSubmitting(true);
    try {
      let uploadedUrl = '';
      if (selectedFile) {
        try {
          const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, { encoding: 'base64' });
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          uploadedUrl = await uploadFile('lesson-plans', `${profile?.id}/${fileName}`, decode(base64), selectedFile.type);
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          Alert.alert('Upload Failed', 'Failed to upload your file. Ensure "lesson-plans" storage bucket exists and is public in Supabase.');
          setSubmitting(false);
          return;
        }
      }

      await addPlan({
        teacher_id: profile?.id ?? '',
        subject: selected.subject,
        topic: unitName.trim() ? `${unitName.trim()} — ${topicName.trim()}` : topicName.trim(),
        description: description.trim(),
        class_name: selected.className,
        file_url: uploadedUrl,
      });
      Alert.alert('Success', 'Topic added!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Subject & Class */}
      <Text style={styles.label}>Subject & Class</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.selectorText, !selected && styles.placeholder]}>
          {selected?.label ?? 'Select subject & class'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Unit Name */}
      <Text style={styles.label}>Unit Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Geometry"
        placeholderTextColor={colors.textLight}
        value={unitName}
        onChangeText={setUnitName}
      />

      {/* Topic Name */}
      <Text style={styles.label}>Topic Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Triangles & Congruence"
        placeholderTextColor={colors.textLight}
        value={topicName}
        onChangeText={setTopicName}
      />

      {/* Description */}
      <Text style={styles.label}>Description / Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe what will be covered in this topic..."
        placeholderTextColor={colors.textLight}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      {/* Upload Document */}
      <Text style={styles.label}>Attachment (Optional)</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={pickFile}>
        <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
        <Text style={[styles.uploadBtnText, { color: colors.primary }]}>
          {selectedFile ? selectedFile.name : 'Upload Document or Image'}
        </Text>
      </TouchableOpacity>
      {selectedFile && (
        <TouchableOpacity style={{ marginTop: 8, marginBottom: 10 }} onPress={() => setSelectedFile(null)}>
          <Text style={{ color: colors.danger, fontSize: 14 }}>Remove Attachment</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Ionicons name="add-circle" size={20} color={colors.white} />
            <Text style={styles.submitBtnText}>Add Topic</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Picker Modal */}
      <Modal visible={showPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Subject & Class</Text>
            {subjectClasses.length === 0 ? (
              <View style={{ padding: spacing.xl, alignItems: 'center' }}>
                <Ionicons name="folder-open-outline" size={32} color={colors.textLight} style={{ marginBottom: 8 }} />
                <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: '600' }}>No classes available</Text>
                <Text style={{ color: colors.textLight, fontSize: 12, textAlign: 'center', marginTop: 4 }}>You need subjects assigned in your timetable to add lesson plans.</Text>
              </View>
            ) : (
              subjectClasses.map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  style={[
                    styles.modalOption,
                    selected?.label === opt.label && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setSelected(opt);
                    setShowPicker(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Ionicons
                      name="book-outline"
                      size={20}
                      color={selected?.label === opt.label ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.modalOptionText,
                        selected?.label === opt.label && { color: colors.primary, fontWeight: '600' },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </View>
                  {selected?.label === opt.label && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selectorText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholder: { color: colors.textLight, fontWeight: '400' },
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
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    gap: spacing.sm,
  },
  uploadBtnText: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xxl,
    paddingBottom: spacing.xxl + 25,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  modalOptionSelected: {
    backgroundColor: colors.primaryLight,
  },
  modalOptionText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
});

