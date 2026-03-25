import React, { useState, useMemo } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useLeaveRequests } from '../../src/hooks/useLeaveRequests';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { uploadFile } from '../../src/services/supabaseService';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';

// ── Leave types ──
const LEAVE_TYPES = [
  { id: 'casual', label: 'Casual Leave' },
  { id: 'sick', label: 'Sick Leave' },
  { id: 'earned', label: 'Earned Leave' },
  { id: 'maternity', label: 'Maternity Leave' },
  { id: 'compensatory', label: 'Compensatory Off' },
  { id: 'other', label: 'Other' },
];

// ── Calendar helpers ──
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const SHORT_MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function daysBetween(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return Math.round(Math.abs(db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export default function ApplyLeaveScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { profile } = useUser();
  const { applyLeave } = useLeaveRequests(profile?.id);

  // Leave type
  const [leaveType, setLeaveType] = useState<string | null>(null);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const selectedTypeLabel = LEAVE_TYPES.find((t) => t.id === leaveType)?.label;

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  // Date range
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Other fields
  const [reason, setReason] = useState('');
  const [attachmentUri, setAttachmentUri] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [attachmentMime, setAttachmentMime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalDays = startDate && endDate ? daysBetween(startDate, endDate) : 0;

  // Calendar grid
  const calendarRows = useMemo(() => {
    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDay = getFirstDayOfMonth(calYear, calMonth);
    const prevMonthDays = getDaysInMonth(
      calMonth === 0 ? calYear - 1 : calYear,
      calMonth === 0 ? 11 : calMonth - 1
    );

    const cells: { day: number; current: boolean; key: string }[] = [];

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = calMonth === 0 ? 11 : calMonth - 1;
      const y = calMonth === 0 ? calYear - 1 : calYear;
      cells.push({ day: d, current: false, key: toKey(y, m, d) });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, current: true, key: toKey(calYear, calMonth, d) });
    }
    // Next month leading days
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const m = calMonth === 11 ? 0 : calMonth + 1;
        const y = calMonth === 11 ? calYear + 1 : calYear;
        cells.push({ day: d, current: false, key: toKey(y, m, d) });
      }
    }

    // Split into rows of 7
    const rows: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [calYear, calMonth]);

  const handleDayPress = (key: string, current: boolean) => {
    if (!current) return;
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(key);
      setEndDate(null);
    } else {
      // Set end date
      if (key < startDate) {
        setEndDate(startDate);
        setStartDate(key);
      } else {
        setEndDate(key);
      }
    }
  };

  const isInRange = (key: string) => {
    if (!startDate) return false;
    if (!endDate) return key === startDate;
    return key >= startDate && key <= endDate;
  };
  const isStart = (key: string) => key === startDate;
  const isEnd = (key: string) => key === (endDate ?? startDate);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAttachmentUri(result.assets[0].uri);
        setAttachmentName(result.assets[0].name);
        setAttachmentMime(result.assets[0].mimeType ?? 'application/octet-stream');
      }
    } catch {
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const handleSubmit = async () => {
    if (!leaveType) {
      Alert.alert('Missing Leave Type', 'Please select a leave type.');
      return;
    }
    if (!startDate) {
      Alert.alert('Missing Dates', 'Please select a date range.');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Missing Reason', 'Please describe the reason for your leave request.');
      return;
    }

    const fromDate = startDate;
    const toDate = endDate ?? startDate;

    setSubmitting(true);
    try {
      let finalReason = reason.trim();

      if (attachmentUri && attachmentName) {
        const base64 = await FileSystem.readAsStringAsync(attachmentUri, {
          encoding: 'base64',
        });
        const fileData = decode(base64);
        const safeName = attachmentName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const path = `leaves/${Date.now()}_${safeName}`;
        
        const url = await uploadFile('myschool-files', path, fileData, attachmentMime ?? 'application/octet-stream');
        finalReason += `\n\n**Attachment:** [${attachmentName}](${url})`;
      }

      await applyLeave({
        teacher_id: profile?.id ?? '',
        teacher_name: profile?.name ?? '',
        from_date: fromDate,
        to_date: toDate,
        reason: finalReason,
      });
      Alert.alert('Success', 'Leave request submitted!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const msg = err?.message || 'Failed to submit. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Select Leave Type ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Leave Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowTypePicker(true)}
          >
            <Text style={[styles.dropdownText, !leaveType && styles.dropdownPlaceholder]}>
              {selectedTypeLabel ?? 'Choose leave type'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Select Date Range (inline calendar) ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date Range</Text>

          {/* Month navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTHS[calMonth]} {calYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="chevron-forward" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Week day headers */}
          <View style={styles.weekRow}>
            {WEEK_DAYS.map((d, i) => (
              <Text key={i} style={styles.weekDay}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          {calendarRows.map((row, ri) => (
            <View key={ri} style={styles.calRow}>
              {row.map((cell) => {
                const inRange = isInRange(cell.key);
                const start = isStart(cell.key);
                const end = isEnd(cell.key);
                const isRangeMiddle = inRange && !start && !end;

                return (
                  <TouchableOpacity
                    key={cell.key}
                    style={[
                      styles.calCell,
                      isRangeMiddle && styles.calCellMid,
                      start && styles.calCellStart,
                      end && endDate && styles.calCellEnd,
                    ]}
                    onPress={() => handleDayPress(cell.key, cell.current)}
                    activeOpacity={cell.current ? 0.6 : 1}
                  >
                    <View style={[
                      styles.calDayCircle,
                      (start || (end && endDate)) && styles.calDayCircleActive,
                    ]}>
                      <Text
                        style={[
                          styles.calDayText,
                          !cell.current && styles.calDayOther,
                          (start || (end && endDate)) && styles.calDayTextActive,
                          isRangeMiddle && styles.calDayTextRange,
                        ]}
                      >
                        {cell.day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Summary row */}
          {startDate && (
            <View style={styles.dateSummary}>
              <View style={styles.dateSummaryLeft}>
                <Ionicons name="calendar" size={16} color={colors.primary} />
                <Text style={styles.totalDaysLabel}>TOTAL DAYS</Text>
              </View>
              <Text style={styles.totalDaysValue}>{totalDays} Day{totalDays !== 1 ? 's' : ''}</Text>
              <Text style={styles.dateRangeText}>
                {formatDateShort(startDate)}
                {endDate ? ` - ${formatDateShort(endDate)}` : ''}
                {' '}{new Date(endDate ?? startDate).getFullYear()}
              </Text>
            </View>
          )}
        </View>

        {/* ── Reason for Leave ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Leave</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Please describe the reason for your leave request..."
            placeholderTextColor={colors.textLight}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* ── Attachments (Optional) ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments (Optional)</Text>
          <TouchableOpacity
            style={styles.attachBtn}
              onPress={handlePickDocument}
            >
              {attachmentName ? (
                <View style={styles.attachFile}>
                  <Ionicons name="document-attach" size={20} color={colors.primary} />
                  <Text style={styles.attachFileName}>{attachmentName}</Text>       
                  <TouchableOpacity onPress={() => { setAttachmentUri(null); setAttachmentName(null); }}>        
                    <Ionicons name="close-circle" size={20} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.attachPlaceholder}>
                  <Ionicons name="cloud-upload-outline" size={24} color={colors.textLight} />
                  <Text style={styles.attachPlaceholderText}>
                    Tap to select a file
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Submit Leave Request</Text>
              <Ionicons name="send" size={18} color={colors.white} />
            </>
          )}
        </TouchableOpacity>

      {/* ── Leave Type Picker Modal ── */}
      <Modal visible={showTypePicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTypePicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Leave Type</Text>
            {LEAVE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.modalOption,
                  leaveType === type.id && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setLeaveType(type.id);
                  setShowTypePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    leaveType === type.id && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {type.label}
                </Text>
                {leaveType === type.id && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120 },

  // Sections
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  // Dropdown
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
  },
  dropdownText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  dropdownPlaceholder: {
    color: colors.textLight,
  },

  // Calendar
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  monthLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textLight,
  },
  calRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  calCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  calCellMid: {
    backgroundColor: colors.primaryLight,
  },
  calCellStart: {
    backgroundColor: colors.primaryLight,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  calCellEnd: {
    backgroundColor: colors.primaryLight,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  calDayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayCircleActive: {
    backgroundColor: colors.primary,
  },
  calDayText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  calDayOther: {
    color: colors.textLight,
  },
  calDayTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  calDayTextRange: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Date summary
  dateSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  dateSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  totalDaysLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textLight,
  },
  totalDaysValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  dateRangeText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Reason
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Attachments
  attachBtn: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  attachPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  attachPlaceholderText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  attachFile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
  },
  attachFileName: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 25,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
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


