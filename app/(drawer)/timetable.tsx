import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useTimetable } from '../../src/hooks/useTimetable';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { DayOfWeek, TimetableEntry } from '../../src/types';

// ── Day config ──
const DAY_LABELS: { key: DayOfWeek; short: string; full: string }[] = [
  { key: 'monday', short: 'M', full: 'Monday' },
  { key: 'tuesday', short: 'T', full: 'Tuesday' },
  { key: 'wednesday', short: 'W', full: 'Wednesday' },
  { key: 'thursday', short: 'T', full: 'Thursday' },
  { key: 'friday', short: 'F', full: 'Friday' },
  { key: 'saturday', short: 'S', full: 'Saturday' },
];

// ── Subject color palette ──
const SUBJECT_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  Mathematics: { bg: '#EEF2FF', accent: '#6366F1', text: '#4338CA' },
  Science:     { bg: '#ECFDF5', accent: '#10B981', text: '#047857' },
  English:     { bg: '#FFF7ED', accent: '#F97316', text: '#C2410C' },
  Hindi:       { bg: '#FDF2F8', accent: '#EC4899', text: '#BE185D' },
  History:     { bg: '#FFFBEB', accent: '#F59E0B', text: '#B45309' },
  Geography:   { bg: '#F0FDFA', accent: '#14B8A6', text: '#0F766E' },
  Physics:     { bg: '#EFF6FF', accent: '#3B82F6', text: '#1D4ED8' },
  Chemistry:   { bg: '#FEF2F2', accent: '#EF4444', text: '#B91C1C' },
  Biology:     { bg: '#F0FDF4', accent: '#22C55E', text: '#15803D' },
  Computer:    { bg: '#F5F3FF', accent: '#8B5CF6', text: '#6D28D9' },
};
const DEFAULT_COLOR = { bg: '#F3F4F6', accent: '#6B7280', text: '#374151' };

function getSubjectColor(subject: string) {
  for (const key of Object.keys(SUBJECT_COLORS)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) {
      return SUBJECT_COLORS[key];
    }
  }
  return DEFAULT_COLOR;
}

// ── Holidays / Occasions per day ──
// Maps day-of-week to special occasions. In production this would come from the calendar API.
interface Occasion {
  title: string;
  type: 'holiday' | 'event';
}

function getOccasionsForDay(day: DayOfWeek, weekOffset: number): Occasion[] {
  // Demo: derive a date for the selected week and check against known occasions
  const today = new Date();
  const currentDayIdx = today.getDay(); // 0=Sun
  const dayIdx = DAY_LABELS.findIndex((d) => d.key === day) + 1; // 1=Mon
  const diff = dayIdx - (currentDayIdx === 0 ? 7 : currentDayIdx);
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff + weekOffset * 7);
  const dateStr = targetDate.toISOString().split('T')[0];

  // Demo occasion data — matching calendar events
  const OCCASIONS: Record<string, Occasion[]> = {
    '2026-03-10': [{ title: 'Holi Holiday 🎨', type: 'holiday' }],
    '2026-04-03': [{ title: 'Good Friday', type: 'holiday' }],
    '2026-04-14': [{ title: 'Dr. Ambedkar Jayanti', type: 'holiday' }],
    '2026-05-01': [{ title: 'May Day', type: 'holiday' }],
    '2026-05-12': [{ title: 'Buddha Purnima', type: 'holiday' }],
    '2026-03-14': [{ title: 'Pi Day — Math Quiz', type: 'event' }],
    '2026-03-20': [{ title: 'Annual Sports Day 🏅', type: 'event' }],
  };

  return OCCASIONS[dateStr] ?? [];
}

function getDateForDay(day: DayOfWeek, weekOffset: number): Date {
  const today = new Date();
  const currentDayIdx = today.getDay();
  const dayIdx = DAY_LABELS.findIndex((d) => d.key === day) + 1;
  const diff = dayIdx - (currentDayIdx === 0 ? 7 : currentDayIdx);
  const target = new Date(today);
  target.setDate(today.getDate() + diff + weekOffset * 7);
  return target;
}

export default function TimetableScreen() {
  const { profile } = useUser();
  const { allEntries, loading, getEntriesForDay } = useTimetable(profile?.id);

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    const idx = new Date().getDay();
    return idx === 0 ? 'monday' : DAY_LABELS[idx - 1].key;
  });

  const entries = getEntriesForDay(selectedDay);
  const occasions = getOccasionsForDay(selectedDay, weekOffset);
  const isHoliday = occasions.some((o) => o.type === 'holiday');
  const selectedDate = getDateForDay(selectedDay, weekOffset);

  // Week range label
  const weekStart = getDateForDay('monday', weekOffset);
  const weekEnd = getDateForDay('saturday', weekOffset);
  const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekLabel = `${SHORT_MONTHS[weekStart.getMonth()]} ${weekStart.getDate()} – ${SHORT_MONTHS[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Week Navigation ── */}
      <View style={styles.weekNav}>
        <TouchableOpacity onPress={() => setWeekOffset(weekOffset - 1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.weekCenter}>
          <Text style={styles.weekLabel}>{weekLabel}</Text>
          {weekOffset === 0 && <Text style={styles.thisWeekBadge}>This Week</Text>}
        </View>
        <TouchableOpacity onPress={() => setWeekOffset(weekOffset + 1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-forward" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* ── Day Selector ── */}
      <View style={styles.dayBar}>
        {DAY_LABELS.map((d) => {
          const isActive = d.key === selectedDay;
          const date = getDateForDay(d.key, weekOffset);
          const dayNum = date.getDate();
          const hasOccasion = getOccasionsForDay(d.key, weekOffset).length > 0;
          const dayIsHoliday = getOccasionsForDay(d.key, weekOffset).some((o) => o.type === 'holiday');
          const isToday = weekOffset === 0 && new Date().getDay() === DAY_LABELS.indexOf(d) + 1;

          return (
            <TouchableOpacity
              key={d.key}
              style={[styles.dayTab, isActive && styles.dayTabActive]}
              onPress={() => setSelectedDay(d.key)}
            >
              <Text style={[styles.dayShort, isActive && styles.dayShortActive]}>
                {d.short}
              </Text>
              <Text style={[
                styles.dayNum,
                isActive && styles.dayNumActive,
                dayIsHoliday && !isActive && styles.dayNumHoliday,
              ]}>
                {dayNum}
              </Text>
              {hasOccasion && !isActive && (
                <View style={[
                  styles.dayIndicator,
                  dayIsHoliday ? { backgroundColor: colors.danger } : { backgroundColor: colors.primary },
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Day Header ── */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayHeaderTitle}>
          {DAY_LABELS.find((d) => d.key === selectedDay)?.full},{' '}
          {SHORT_MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
        </Text>
        <Text style={styles.dayHeaderCount}>
          {isHoliday ? 'Holiday' : `${entries.length} Class${entries.length !== 1 ? 'es' : ''}`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Occasion Banners ── */}
        {occasions.map((occ, i) => (
          <View
            key={i}
            style={[
              styles.occasionBanner,
              occ.type === 'holiday' ? styles.occasionHoliday : styles.occasionEvent,
            ]}
          >
            <Ionicons
              name={occ.type === 'holiday' ? 'sunny' : 'calendar'}
              size={20}
              color={occ.type === 'holiday' ? colors.danger : colors.primary}
            />
            <View style={styles.occasionTextWrap}>
              <Text style={[
                styles.occasionTitle,
                { color: occ.type === 'holiday' ? colors.danger : colors.primary },
              ]}>
                {occ.title}
              </Text>
              <Text style={styles.occasionSubtext}>
                {occ.type === 'holiday' ? 'No classes today — School closed' : 'Special event scheduled'}
              </Text>
            </View>
          </View>
        ))}

        {/* ── Class Timeline ── */}
        {!isHoliday && entries.length > 0 && (
          <View style={styles.timeline}>
            {entries.map((entry, idx) => {
              const sc = getSubjectColor(entry.subject);
              const isLast = idx === entries.length - 1;
              return (
                <View key={entry.id || idx} style={styles.timelineItem}>
                  {/* Time column */}
                  <View style={styles.timeCol}>
                    <Text style={styles.timeStart}>{entry.start_time}</Text>
                    <Text style={styles.timeEnd}>{entry.end_time}</Text>
                  </View>

                  {/* Dot & line */}
                  <View style={styles.dotCol}>
                    <View style={[styles.dot, { backgroundColor: sc.accent }]} />
                    {!isLast && <View style={styles.connector} />}
                  </View>

                  {/* Card */}
                  <View style={[styles.classCard, { backgroundColor: sc.bg, borderLeftColor: sc.accent }]}>
                    <Text style={[styles.classSubject, { color: sc.text }]}>{entry.subject}</Text>
                    <View style={styles.classDetails}>
                      <View style={styles.classDetail}>
                        <Ionicons name="people-outline" size={13} color={sc.accent} />
                        <Text style={[styles.classDetailText, { color: sc.text }]}>{entry.class_name}</Text>
                      </View>
                      {entry.room ? (
                        <View style={styles.classDetail}>
                          <Ionicons name="location-outline" size={13} color={sc.accent} />
                          <Text style={[styles.classDetailText, { color: sc.text }]}>Room {entry.room}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Empty (non-holiday, no classes) ── */}
        {!isHoliday && entries.length === 0 && occasions.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="cafe-outline" size={50} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No Classes</Text>
            <Text style={styles.emptySubtext}>Enjoy your free day!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Week nav
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weekCenter: {
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  thisWeekBadge: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },

  // Day bar
  dayBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  dayTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  dayTabActive: {
    backgroundColor: colors.primary,
  },
  dayShort: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textLight,
  },
  dayShortActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  dayNum: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  dayNumActive: {
    color: colors.white,
  },
  dayNumHoliday: {
    color: colors.danger,
  },
  dayIndicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 4,
  },

  // Day header
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dayHeaderTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dayHeaderCount: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Occasion banner
  occasionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  occasionHoliday: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  occasionEvent: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  occasionTextWrap: {
    flex: 1,
  },
  occasionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  occasionSubtext: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Content
  content: {
    paddingBottom: spacing.xxl,
  },

  // Timeline
  timeline: {
    paddingHorizontal: spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timeCol: {
    width: 50,
    alignItems: 'flex-end',
    paddingRight: spacing.sm,
    paddingTop: spacing.sm,
  },
  timeStart: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeEnd: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
  dotCol: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: spacing.md,
    borderWidth: 2,
    borderColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
  },

  // Class card
  classCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
  },
  classSubject: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  classDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  classDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  classDetailText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  emptySubtext: {
    color: colors.textLight,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
