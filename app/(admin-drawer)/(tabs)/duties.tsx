import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSharedDuties } from '../../../src/hooks/useSharedDuties';
import { useNotificationBadge } from '../../../src/context/NotificationContext';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../../src/theme/spacing';

const TEACHERS = [
  { id: 't1', name: 'Sarah Jenkins' },
  { id: 'demo-teacher', name: 'Demo Teacher' },
  { id: 't3', name: 'Aman Patel' },
];

const ACTIVITIES = [
  'Exam Invigilation',
  'Assembly Duty',
  'Bus Duty',
  'Playground Supervision',
];

export default function AdminDutiesTab() {
  const { duties, addDuty, removeDuty } = useSharedDuties();
  const { addNotification } = useNotificationBadge();

  const [selectedTeacherId, setSelectedTeacherId] = useState(TEACHERS[1].id);
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');

  const handleAssign = () => {
    if (!date.trim() || !time.trim() || !room.trim()) {
      Alert.alert('Error', 'Please fill in all details (Date, Time, Room, Activity).');
      return;
    }

    const teacher = TEACHERS.find((t) => t.id === selectedTeacherId);

    addDuty({
      teacher_id: selectedTeacherId,
      teacher_name: teacher?.name || 'Unknown',
      activity: selectedActivity,
      date,
      time,
      room,
    });

    addNotification({
      title: `New Duty Assigned: ${selectedActivity}`,
      message: `You have been assigned ${selectedActivity} on ${date} at ${time} in ${room}.`,
      type: 'notice',
    });

    Alert.alert('Success', `Duty assigned to ${teacher?.name} and notification sent!`);
    setDate('');
    setTime('');
    setRoom('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Assign Duties</Text>
        <Text style={styles.subTitle}>Appoint invigilators and assign duties to staff.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Select Teacher</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {TEACHERS.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.chip, selectedTeacherId === t.id && styles.chipSelected]}
                onPress={() => setSelectedTeacherId(t.id)}
              >
                <Text style={[styles.chipText, selectedTeacherId === t.id && styles.chipTextSelected]}>
                  {t.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Select Activity</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {ACTIVITIES.map((act) => (
              <TouchableOpacity
                key={act}
                style={[styles.smallChip, selectedActivity === act && styles.smallChipSelected]}
                onPress={() => setSelectedActivity(act)}
              >
                <Text style={[styles.smallChipText, selectedActivity === act && styles.smallChipTextSelected]}>
                  {act}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Oct 28"
                placeholderTextColor={colors.textLight}
                value={date}
                onChangeText={setDate}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                placeholder="09:00 AM - 12:00 PM"
                placeholderTextColor={colors.textLight}
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>

          <View style={{ marginTop: spacing.md }}>
            <Text style={styles.label}>Room / Location</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Main Hall"
              placeholderTextColor={colors.textLight}
              value={room}
              onChangeText={setRoom}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleAssign}>
            <Ionicons name="send" size={18} color={colors.white} />
            <Text style={styles.submitBtnText}>Assign Duty</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recently Assigned Duties</Text>
        {duties.map((d) => (
          <View key={d.id} style={styles.dutyCard}>
            <View style={styles.dutyHeader}>
              <View style={styles.dutyHeaderLeft}>
                <Ionicons name="clipboard-outline" size={20} color={colors.primary} />
                <Text style={styles.dutyActivity}>{d.activity}</Text>
              </View>
              <TouchableOpacity onPress={() => removeDuty(d.id)}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.dutyDetails}>
              <Text style={styles.dutyTeacher}><Text style={{ fontWeight: '700', color: colors.textSecondary }}>Teacher:</Text> {d.teacher_name}</Text>
              <View style={styles.dutyRow}>
                <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.dutyText}>{d.date}</Text>
              </View>
              <View style={styles.dutyRow}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.dutyText}>{d.time}</Text>
              </View>
              <View style={styles.dutyRow}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.dutyText}>{d.room}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.textPrimary },
  subTitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.xxl,
  },
  label: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.xs, marginTop: spacing.sm },
  
  chipScroll: { flexDirection: 'row', marginBottom: spacing.md },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border, marginRight: 8,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextSelected: { color: colors.white },

  smallChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 8, backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border, marginRight: 8,
  },
  smallChipSelected: { backgroundColor: colors.infoLight, borderColor: colors.primary },
  smallChipText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  smallChipTextSelected: { color: colors.primary, fontWeight: '700' },

  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: 14,
    color: colors.textPrimary, backgroundColor: colors.background,
  },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, paddingVertical: 14, borderRadius: borderRadius.md,
    marginTop: spacing.xl,
  },
  submitBtnText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },

  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  
  dutyCard: {
    backgroundColor: colors.white, padding: spacing.md, borderRadius: borderRadius.md,
    borderLeftWidth: 4, borderLeftColor: colors.primary, elevation: 1,
    marginBottom: spacing.md,
  },
  dutyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 8 },
  dutyHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dutyActivity: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  
  dutyDetails: { gap: 4 },
  dutyTeacher: { fontSize: 13, color: colors.textPrimary, marginBottom: 4 },
  dutyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dutyText: { fontSize: 12, color: colors.textSecondary },
});
