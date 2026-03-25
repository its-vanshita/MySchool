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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { useUser } from '../../src/context/UserContext';
import { useHomework } from '../../src/hooks/useHomework';
import { getClasses, getTimetableForTeacher, uploadFile } from '../../src/services/supabaseService';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { ClassInfo, TimetableEntry } from '../../src/types';

interface AttachedFile {
  name: string;
  size: number;
  uri: string;
  mimeType?: string;
}



interface TimetableOption {
  label: string;
  subject: string;
  classInfo: ClassInfo;
}

export default function AddHomeworkScreen() {
  const { colors, isDark } = useTheme();
  const FILE_ICONS: Record<string, { icon: string; color: string }> = {
    pdf: { icon: 'document-text', color: colors.danger },
    doc: { icon: 'document', color: colors.primary },
    docx: { icon: 'document', color: colors.primary },
    png: { icon: 'image', color: colors.success },
    jpg: { icon: 'image', color: colors.success },
    jpeg: { icon: 'image', color: colors.success },
    default: { icon: 'attach', color: colors.textSecondary },
  };
  const styles = getStyles(colors);
  const router = useRouter();
  const { profile } = useUser();
  const { addHomework } = useHomework(profile?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedOption, setSelectedOption] = useState<TimetableOption | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [timetableOptions, setTimetableOptions] = useState<TimetableOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);

  const DEMO_CLASSES: ClassInfo[] = [
    { id: 'demo-10a', name: 'Class 10A', grade: '10', section: 'A', school_id: 'demo-school' },
    { id: 'demo-10b', name: 'Class 10B', grade: '10', section: 'B', school_id: 'demo-school' },
    { id: 'demo-9a', name: 'Class 9A', grade: '9', section: 'A', school_id: 'demo-school' },
    { id: 'demo-9b', name: 'Class 9B', grade: '9', section: 'B', school_id: 'demo-school' },
    { id: 'demo-9c', name: 'Class 9C', grade: '9', section: 'C', school_id: 'demo-school' },
    { id: 'demo-8a', name: 'Class 8A', grade: '8', section: 'A', school_id: 'demo-school' },
    { id: 'demo-8b', name: 'Class 8B', grade: '8', section: 'B', school_id: 'demo-school' },
  ];

  const DEMO_TIMETABLE: TimetableEntry[] = [
    { id: 't1', teacher_id: 'demo-teacher', subject: 'Mathematics', class_name: 'Class 10A', room: '204', start_time: '09:00', end_time: '09:45', day: 'monday', school_id: 'demo-school' },
    { id: 't2', teacher_id: 'demo-teacher', subject: 'Science', class_name: 'Class 9C', room: 'Lab 02', start_time: '11:30', end_time: '12:15', day: 'monday', school_id: 'demo-school' },
    { id: 't3', teacher_id: 'demo-teacher', subject: 'English', class_name: 'Class 10A', room: '204', start_time: '14:00', end_time: '14:45', day: 'monday', school_id: 'demo-school' },
  ];

  useEffect(() => {
    const loadOptions = async () => {
      let allClasses: ClassInfo[] = [];
      if (profile?.school_id) {
        const data = await getClasses(profile.school_id);
        allClasses = data.length > 0 ? data : DEMO_CLASSES;
      } else {
        allClasses = DEMO_CLASSES;
      }

      if (profile?.id) {
        let timetable = await getTimetableForTeacher(profile.id);
        if (timetable.length === 0 && profile.school_id === 'demo-school') {
          timetable = DEMO_TIMETABLE;
        }
        const teachingEntries = timetable.filter(
          (entry) => entry.class_name && !entry.class_name.toLowerCase().includes('staff')
        );

        // Build unique subject+class combinations
        const seen = new Set<string>();
        const options: TimetableOption[] = [];
        for (const entry of teachingEntries) {
          const key = `${entry.subject}|${entry.class_name}`;
          if (!seen.has(key)) {
            seen.add(key);
            const classInfo = allClasses.find((c) => c.name === entry.class_name);
            if (classInfo) {
              options.push({
                label: `${entry.subject} · ${entry.class_name}`,
                subject: entry.subject,
                classInfo,
              });
            }
          }
        }
        setTimetableOptions(options);
        if (options.length > 0) setSelectedOption(options[0]);
      }
    };

    loadOptions();
  }, [profile]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDueDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets) {
        const newFiles: AttachedFile[] = result.assets.map((a) => ({
          name: a.name,
          size: a.size ?? 0,
          uri: a.uri,
          mimeType: a.mimeType ?? undefined,
        }));
        setAttachments((prev) => [...prev, ...newFiles]);
      }
    } catch {
      Alert.alert('Error', 'Could not pick document.');
    }
  };

  const removeAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    return FILE_ICONS[ext] || FILE_ICONS.default;
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      Alert.alert('Select Class', 'Please choose a class to assign homework.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a homework title.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please describe the homework assignment.');
      return;
    }
    if (!dueDate) {
      Alert.alert('Missing Due Date', 'Please set a due date.');
      return;
    }

    setSubmitting(true);
    try {
      let finalDescription = description.trim();
      
      // Upload attachments if any
      if (attachments.length > 0) {
        const uploadedUrls: string[] = [];
        for (const file of attachments) {
          const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: 'base64',
          });
          const fileData = decode(base64);
          const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
          const path = `homework/${Date.now()}_${safeName}`;
          
          const url = await uploadFile('myschool-files', path, fileData, file.mimeType || 'application/octet-stream');
          uploadedUrls.push(`\n- [${file.name}](${url})`);
        }
        
        if (uploadedUrls.length > 0) {
          finalDescription += '\n\n**Attachments:**' + uploadedUrls.join('');
        }
      }

      await addHomework({
        teacher_id: profile?.id ?? '',
        class_id: selectedOption.classInfo.id,
        class_name: selectedOption.classInfo.name,
        subject: selectedOption.subject + (topic.trim() ? ` - ${topic.trim()}` : ''),
        title: title.trim(),
        description: finalDescription,
        due_date: dueDate,
      });
      Alert.alert('Success', 'Homework assigned!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to assign homework. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd} / ${mm} / ${yyyy}`;
  };

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const dueDateObj = dueDate ? new Date(dueDate + 'T00:00:00') : new Date();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Select Class Dropdown */}
      <Text style={styles.label}>Select Class</Text>
      <TouchableOpacity
        style={styles.classSelector}
        onPress={() => setShowClassPicker(true)}
      >
        <Text style={[styles.classSelectorText, !selectedOption && styles.placeholder]}>
          {selectedOption ? selectedOption.label : 'Select class'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Subject (topic) + Due Date — side by side */}
      <View style={styles.row}>
        <View style={styles.rowHalf}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Algebra"
            placeholderTextColor={colors.textLight}
            value={topic}
            onChangeText={setTopic}
          />
        </View>
        <View style={styles.rowHalf}>
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateInputText}>{formatShortDate(dueDate)}</Text>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        Platform.OS === 'ios' ? (
          <View style={styles.iosPickerContainer}>
            <View style={styles.iosPickerHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.iosPickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={dueDateObj}
              mode="date"
              display="spinner"
              minimumDate={new Date()}
              onChange={onDateChange}
            />
          </View>
        ) : (
          <DateTimePicker
            value={dueDateObj}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={onDateChange}
          />
        )
      )}

      {/* Homework Title */}
      <Text style={styles.label}>Homework Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Quadratic Equations Practice"
        placeholderTextColor={colors.textLight}
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter detailed instructions for students..."
        placeholderTextColor={colors.textLight}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />

      {/* Attachments */}
      <View style={styles.attachHeader}>
        <View style={styles.attachLabelRow}>
          <Ionicons name="attach" size={18} color={colors.textPrimary} />
          <Text style={styles.attachLabel}>Attachments</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={handlePickDocument}>
          <Ionicons name="cloud-upload-outline" size={16} color={colors.primary} />
          <Text style={styles.uploadBtnText}>Upload Files</Text>
        </TouchableOpacity>
      </View>

      {attachments.length > 0 && (
        <View style={styles.attachList}>
          {attachments.map((file, idx) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
const fileIcon = getFileIcon(file.name);
            return (
              <View key={`${file.name}-${idx}`} style={styles.attachItem}>
                <View style={[styles.fileIconWrap, { backgroundColor: fileIcon.color + '18' }]}>
                  <Ionicons name={fileIcon.icon as any} size={18} color={fileIcon.color} />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                  <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                </View>
                <TouchableOpacity onPress={() => removeAttachment(idx)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={22} color={colors.danger} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

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
            <Ionicons name="checkmark-circle" size={20} color={colors.white} />
            <Text style={styles.submitBtnText}>Assign Homework</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Class Picker Modal */}
      <Modal visible={showClassPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowClassPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Class</Text>
            {timetableOptions.length === 0 ? (
              <Text style={styles.noOptionsText}>No classes available</Text>
            ) : (
              timetableOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  style={[
                    styles.modalOption,
                    selectedOption?.label === opt.label && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedOption(opt);
                    setShowClassPicker(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Ionicons
                      name="school-outline"
                      size={20}
                      color={selectedOption?.label === opt.label ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedOption?.label === opt.label && { color: colors.primary, fontWeight: '600' },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </View>
                  {selectedOption?.label === opt.label && (
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

  // Class selector dropdown
  classSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  classSelectorText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
  placeholder: { color: colors.textLight, fontWeight: '400' },

  // Side by side row
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowHalf: { flex: 1 },

  // Inputs
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },

  // Date input
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  dateInputText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },

  // iOS picker
  iosPickerContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  iosPickerHeader: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iosPickerDone: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },

  // Attachments
  attachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  attachLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  attachLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  uploadBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  attachList: {
    gap: spacing.sm,
  },
  attachItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  fileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: { flex: 1 },
  fileName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  fileSize: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },

  // Submit
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

  // Modal
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
    paddingBottom: spacing.xxxl + 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  noOptionsText: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: spacing.xl,
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
