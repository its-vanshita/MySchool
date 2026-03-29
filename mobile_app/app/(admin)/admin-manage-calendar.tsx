import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdminCalendarSetup, type AdminCalendarTarget } from '../../src/hooks/useAdminCalendar';
import type { CalendarEventType } from '../../src/types';

const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';
const STATUS_RED = '#DC2626';

const { width } = Dimensions.get('window');

const EVENT_TYPES: { key: CalendarEventType; label: string; icon: any; color: string; bg: string }[] = [
  { key: 'event', label: 'Event', icon: 'star', color: '#0ea5e9', bg: '#e0f2fe' },
  { key: 'exam', label: 'Exam', icon: 'school', color: '#f59e0b', bg: '#fef3c7' },
  { key: 'meeting', label: 'Meeting', icon: 'people', color: '#8b5cf6', bg: '#ede9fe' },
  { key: 'holiday', label: 'Holiday', icon: 'sunny', color: '#ef4444', bg: '#fee2e2' },
];

const TARGET_OPTIONS: { key: AdminCalendarTarget; label: string; icon: any }[] = [
  { key: 'both', label: 'All (School)', icon: 'business' },
  { key: 'teacher', label: 'Teachers', icon: 'school' },
  { key: 'student', label: 'Students', icon: 'people' },
];

function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export default function AdminManageCalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { events, addEvent, deleteEvent } = useAdminCalendarSetup();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CalendarEventType>('event');
  const [targetAudience, setTargetAudience] = useState<AdminCalendarTarget>('both');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');

  const resetForm = () => {
    setTitle('');
    setType('event');
    setTargetAudience('both');
    setDate('');
    setEndDate('');
    setDescription('');
    setTime('');
    setVenue('');
    setShowForm(false);
  };

  const handleAddEvent = () => {
    if (!title.trim() || !date.trim()) {
      Alert.alert('Validation Error', 'Title and start date are required.');
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert('Invalid Date', 'Use YYYY-MM-DD format (e.g. 2026-03-25).');
      return;
    }
    if (endDate.trim() && !dateRegex.test(endDate)) {
      Alert.alert('Invalid Date', 'End date must be YYYY-MM-DD format.');
      return;
    }

    addEvent({
      title: title.trim(),
      type,
      target_audience: targetAudience,
      date: date.trim(),
      end_date: endDate.trim() || date.trim(),
      description: description.trim(),
      time: time.trim() || undefined,
      venue: venue.trim() || undefined,
    });

    Alert.alert('Success', 'Event added successfully.');
    resetForm();
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEvent(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={[styles.headerArea, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={PURE_WHITE} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Manage Calendar</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shared Events</Text>
            <View style={styles.badgeWrap}>
              <Text style={styles.sectionCount}>{events.length}</Text>
            </View>
          </View>

          {/* Event List */}
          {events.length === 0 && !showForm ? (
             <View style={styles.emptyCard}>
               <View style={styles.emptyIconCircle}>
                 <Ionicons name="calendar-outline" size={40} color="#94A3B8" />
               </View>
               <Text style={styles.emptyTitle}>No custom events</Text>
               <Text style={styles.emptySubtext}>
                 Add events to broadcast them to teacher and student calendars.
               </Text>
             </View>
          ) : (
            events.map((ev) => {
              const evConfig = EVENT_TYPES.find((t) => t.key === ev.type)!;
              const tgtConfig = TARGET_OPTIONS.find((t) => t.key === ev.target_audience)!;
              const isMultiDay = ev.date !== ev.end_date;

              return (
                <View key={ev.id} style={[styles.eventCard, { borderLeftColor: evConfig.color, borderLeftWidth: 4 }]}>
                  <View style={styles.eventHeader}>
                    <View style={styles.eventHeaderLeft}>
                      <View style={[styles.typeBadge, { backgroundColor: evConfig.bg }]}>
                        <Ionicons name={evConfig.icon} size={12} color={evConfig.color} />
                        <Text style={[styles.typeBadgeText, { color: evConfig.color }]}>
                          {evConfig.label}
                        </Text>
                      </View>
                      <Text style={styles.eventTitle}>{ev.title}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(ev.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={18} color={STATUS_RED} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateBlock}>
                    <Ionicons name="calendar" size={16} color={SLATE_GREY} />
                    <Text style={styles.dateText}>
                      {formatDateShort(ev.date)}
                      {isMultiDay ? ` - ${formatDateShort(ev.end_date)}` : ''}
                    </Text>
                  </View>

                  {(ev.time || ev.venue) && (
                    <View style={styles.timeVenueRow}>
                      {ev.time && (
                        <View style={styles.tvItem}>
                          <Ionicons name="time-outline" size={14} color={SLATE_GREY} />
                          <Text style={styles.tvText}>{ev.time}</Text>
                        </View>
                      )}
                      {ev.time && ev.venue && <View style={styles.tvDot} />}
                      {ev.venue && (
                        <View style={styles.tvItem}>
                          <Ionicons name="location-outline" size={14} color={SLATE_GREY} />
                          <Text style={styles.tvText}>{ev.venue}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {ev.description ? (
                    <Text style={styles.descriptionText} numberOfLines={2}>
                      {ev.description}
                    </Text>
                  ) : null}

                  <View style={styles.targetRow}>
                    <Text style={styles.targetLabel}>Visible to:</Text>
                    <View style={styles.targetChip}>
                      <Ionicons name={tgtConfig.icon} size={12} color={BRAND_NAVY} />
                      <Text style={styles.targetChipText}>{tgtConfig.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}

          {/* Form */}
          {showForm && (
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Ionicons name="add-circle" size={24} color={BRAND_NAVY} />
                <Text style={styles.formTitle}>Create New Event</Text>
              </View>

              <Text style={styles.label}>Event Title</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Annual Sports Day"
                  placeholderTextColor="#94A3B8"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <Text style={styles.label}>Event Type</Text>
              <View style={styles.typeRow}>
                {EVENT_TYPES.map(t => (
                  <TouchableOpacity
                    key={t.key}
                    style={[styles.typeSelectChip, type === t.key && { backgroundColor: t.bg, borderColor: t.color }]}
                    onPress={() => setType(t.key)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={t.icon} size={16} color={type === t.key ? t.color : SLATE_GREY} />
                    <Text style={[styles.typeSelectText, type === t.key && { color: t.color, fontWeight: '700' }]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Target Audience</Text>
              <View style={styles.targetSelectRow}>
                {TARGET_OPTIONS.map(tg => (
                  <TouchableOpacity
                    key={tg.key}
                    style={[styles.targetSelectBtn, targetAudience === tg.key && styles.targetSelectBtnActive]}
                    onPress={() => setTargetAudience(tg.key)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={tg.icon} size={16} color={targetAudience === tg.key ? PURE_WHITE : SLATE_GREY} />
                    <Text style={[styles.targetSelectText, targetAudience === tg.key && styles.targetSelectTextActive]}>
                      {tg.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.dateInputRow}>
                <View style={styles.dateCol}>
                  <Text style={styles.label}>Start Date</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#94A3B8"
                      value={date}
                      onChangeText={setDate}
                      maxLength={10}
                    />
                  </View>
                </View>
                <View style={styles.dateCol}>
                  <Text style={styles.label}>End Date (Optional)</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#94A3B8"
                      value={endDate}
                      onChangeText={setEndDate}
                      maxLength={10}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.dateInputRow}>
                <View style={styles.dateCol}>
                  <Text style={styles.label}>Time (Optional)</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 10:00 AM"
                      placeholderTextColor="#94A3B8"
                      value={time}
                      onChangeText={setTime}
                    />
                  </View>
                </View>
                <View style={styles.dateCol}>
                  <Text style={styles.label}>Venue (Optional)</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Main Hall"
                      placeholderTextColor="#94A3B8"
                      value={venue}
                      onChangeText={setVenue}
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Description (Optional)</Text>
              <View style={[styles.inputWrap, { minHeight: 80 }]}>
                <TextInput
                  style={[styles.input, { minHeight: 80, paddingTop: 12 }]}
                  placeholder="Additional details..."
                  placeholderTextColor="#94A3B8"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelFormBtn}
                  onPress={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelFormBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitFormBtn} onPress={handleAddEvent} activeOpacity={0.8}>
                  <Ionicons name="save" size={16} color={PURE_WHITE} />
                  <Text style={styles.submitFormBtnText}>Add Event</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!showForm && (
            <TouchableOpacity 
              style={styles.fabBtn} 
              onPress={() => setShowForm(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color={PURE_WHITE} />
              <Text style={styles.fabBtnText}>Add Event</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 4,
  },
  headerTitle: {
    color: PURE_WHITE,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_TEXT,
  },
  badgeWrap: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '700',
    color: SLATE_GREY,
  },
  emptyCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    alignItems: 'center',
    padding: 40,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: SLATE_GREY,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Event Card
  eventCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventHeaderLeft: {
    flex: 1,
    paddingRight: 10,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_TEXT,
  },
  timeVenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tvItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tvText: {
    fontSize: 13,
    color: SLATE_GREY,
    fontWeight: '500',
  },
  tvDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  descriptionText: {
    fontSize: 14,
    color: SLATE_GREY,
    lineHeight: 20,
    marginBottom: 16,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 8,
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: SLATE_GREY,
  },
  targetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  targetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND_NAVY,
  },

  // Form
  formCard: {
    backgroundColor: PURE_WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  input: {
    padding: 16,
    fontSize: 15,
    color: DARK_TEXT,
    fontWeight: '500',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeSelectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURE_WHITE,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  typeSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: SLATE_GREY,
  },
  targetSelectRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
  },
  targetSelectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  targetSelectBtnActive: {
    backgroundColor: BRAND_NAVY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  targetSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: SLATE_GREY,
  },
  targetSelectTextActive: {
    color: PURE_WHITE,
    fontWeight: '700',
  },
  dateInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateCol: {
    flex: 1,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelFormBtn: {
    flex: 1,
    backgroundColor: PURE_WHITE,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelFormBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: SLATE_GREY,
  },
  submitFormBtn: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: BRAND_NAVY,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitFormBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: PURE_WHITE,
  },

  // FAB
  fabBtn: {
    flexDirection: 'row',
    backgroundColor: BRAND_NAVY,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: BRAND_NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  fabBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: PURE_WHITE,
  },
});
