import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdminCalendarSetup, type AdminCalendarTarget } from '../../src/hooks/useAdminCalendar';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { CalendarEventType } from '../../src/types';

const EVENT_TYPES: { key: CalendarEventType; label: string; icon: string; color: string }[] = [
  { key: 'event', label: 'Event', icon: 'star', color: '#10B981' },
  { key: 'exam', label: 'Exam', icon: 'school', color: '#F59E0B' },
  { key: 'meeting', label: 'Meeting', icon: 'people', color: '#7C3AED' },
  { key: 'holiday', label: 'Holiday', icon: 'sunny', color: '#EF4444' },
];

const TARGET_OPTIONS: { key: 'teacher' | 'student' | 'both'; label: string; icon: string }[] = [
  { key: 'both', label: 'All (School)', icon: 'business' },
  { key: 'teacher', label: 'Teachers Only', icon: 'school' },
  { key: 'student', label: 'Students Only', icon: 'people' },
];

export default function AdminManageCalendarScreen() {
  const { events, addEvent, deleteEvent } = useAdminCalendarSetup();
  
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CalendarEventType>('event');
  const [targetAudience, setTargetAudience] = useState<'teacher' | 'student' | 'both'>('both');
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manage Calendar Events</Text>
          <Text style={styles.headerCount}>{events.length} added events</Text>
        </View>

        {/* List Events */}
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar" size={32} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No custom events</Text>
            <Text style={styles.emptySubtext}>Add events to make them available in the teacher and parent dashboards.</Text>
          </View>
        ) : (
          events.map((ev) => {
            const evConfig = EVENT_TYPES.find((t) => t.key === ev.type)!;
            const tgtConfig = TARGET_OPTIONS.find((t) => t.key === ev.target_audience)!;
            
            return (
              <View key={ev.id} style={[styles.eventCard, { borderLeftColor: evConfig.color }]}>
                <View style={styles.eventTop}>
                  <View style={styles.eventTopLeft}>
                    <View style={[styles.typeBadge, { backgroundColor: evConfig.color + '20' }]}>
                      <Ionicons name={evConfig.icon as any} size={12} color={evConfig.color} />
                      <Text style={[styles.typeBadgeText, { color: evConfig.color }]}>{evConfig.label}</Text>
                    </View>
                    <View style={styles.targetBadge}>
                      <Ionicons name={tgtConfig.icon as any} size={10} color={colors.textSecondary} />
                      <Text style={styles.targetBadgeText}>{tgtConfig.label}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(ev.id)} style={{ padding: 4 }}>
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.eventTitle}>{ev.title}</Text>
                
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
                  <Text style={styles.dateText}>
                    {ev.date}
                    {ev.end_date && ev.end_date !== ev.date ? ` — ${ev.end_date}` : ''}
                  </Text>
                </View>
                {ev.time || ev.venue ? (
                  <View style={styles.dateRow}>
                    <Ionicons name="location-outline" size={14} color={colors.textLight} />
                    <Text style={styles.dateText}>
                      {[ev.time, ev.venue].filter(Boolean).join(' • ')}
                    </Text>
                  </View>
                ) : null}
                
                {ev.description ? (
                  <Text style={styles.eventDesc}>{ev.description}</Text>
                ) : null}
              </View>
            );
          })
        )}

        {/* Add Event Form */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Event</Text>
            
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Science Fair"
              placeholderTextColor={colors.textLight}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Event Type</Text>
            <View style={styles.typeRow}>
              {EVENT_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.typeOption, type === t.key && { backgroundColor: t.color, borderColor: t.color }]}
                  onPress={() => setType(t.key)}
                >
                  <Ionicons name={t.icon as any} size={14} color={type === t.key ? '#fff' : t.color} />
                  <Text style={[styles.typeOptionText, { color: type === t.key ? '#fff' : colors.textSecondary }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Target Audience</Text>
            <View style={styles.targetRow}>
              {TARGET_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.targetOption, targetAudience === t.key && styles.targetOptionActive]}
                  onPress={() => setTargetAudience(t.key)}
                >
                  <Ionicons name={t.icon as any} size={16} color={targetAudience === t.key ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.targetOptionText, targetAudience === t.key && styles.targetOptionTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textLight}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>End Date (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textLight}
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Time (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 09:00 AM"
                  placeholderTextColor={colors.textLight}
                  value={time}
                  onChangeText={setTime}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Venue (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Auditorium"
                  placeholderTextColor={colors.textLight}
                  value={venue}
                  onChangeText={setVenue}
                />
              </View>
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Event details..."
              placeholderTextColor={colors.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleAddEvent}>
                <Ionicons name="add" size={20} color={colors.white} />
                <Text style={styles.submitBtnText}>Add Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      {!showForm && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { padding: spacing.lg, paddingBottom: 100 },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.textPrimary },
  headerCount: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textSecondary },
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  emptySubtext: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center' },
  
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  eventTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  eventTopLeft: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, gap: 4 },
  typeBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  targetBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, backgroundColor: '#F3F4F6', gap: 4 },
  targetBadgeText: { fontSize: 10, fontWeight: '600', color: colors.textSecondary },
  eventTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  dateText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500' },
  eventDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 8, lineHeight: 20 },
  
  formCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary, shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  formTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.md },
  label: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1, borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, paddingVertical: 12,
    fontSize: fontSize.sm, color: colors.textPrimary,
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeOption: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: '#fff',
  },
  typeOptionText: { fontSize: 13, fontWeight: '600' },
  targetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  targetOption: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: '#fff',
  },
  targetOptionActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  targetOptionText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  targetOptionTextActive: { color: colors.primary, fontWeight: '700' },
  
  row: { flexDirection: 'row', gap: spacing.md },
  col: { flex: 1 },
  
  formActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  cancelBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: borderRadius.md, backgroundColor: '#F3F4F6' },
  cancelBtnText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textSecondary },
  submitBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: borderRadius.md, backgroundColor: colors.primary },
  submitBtnText: { fontSize: fontSize.md, fontWeight: '700', color: colors.white },
  
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
});

