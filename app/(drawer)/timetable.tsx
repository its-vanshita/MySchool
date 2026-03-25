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
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { DayOfWeek, TimetableEntry } from '../../src/types';

// ── Day config ──
const DAY_LABELS: { key: DayOfWeek; short: string; full: string }[] = [
  { key: 'monday', short: 'MON', full: 'Monday' },
  { key: 'tuesday', short: 'TUE', full: 'Tuesday' },
  { key: 'wednesday', short: 'WED', full: 'Wednesday' },
  { key: 'thursday', short: 'THU', full: 'Thursday' },
  { key: 'friday', short: 'FRI', full: 'Friday' },
  { key: 'saturday', short: 'SAT', full: 'Saturday' },
];

// ── Subject color palette ──
const SUBJECT_COLORS: Record<string, { bg: string; accent: string; text: string; badge: string; badgeText: string }> = {
  Mathematics: { bg: '#FFFFFF', accent: '#F97316', text: '#1F2937', badge: '#FFF7ED', badgeText: '#EA580C' },
  Science:     { bg: '#FFFFFF', accent: '#10B981', text: '#1F2937', badge: '#ECFDF5', badgeText: '#059669' },
  English:     { bg: '#FFFFFF', accent: '#7C3AED', text: '#1F2937', badge: '#F5F3FF', badgeText: '#7C3AED' },
  Hindi:       { bg: '#FFFFFF', accent: '#EC4899', text: '#1F2937', badge: '#FDF2F8', badgeText: '#DB2777' },
  History:     { bg: '#FFFFFF', accent: '#F59E0B', text: '#1F2937', badge: '#FFFBEB', badgeText: '#D97706' },
  Geography:   { bg: '#FFFFFF', accent: '#14B8A6', text: '#1F2937', badge: '#F0FDFA', badgeText: '#0D9488' },
  Physics:     { bg: '#FFFFFF', accent: '#3B82F6', text: '#1F2937', badge: '#EFF6FF', badgeText: '#2563EB' },
  Chemistry:   { bg: '#FFFFFF', accent: '#EF4444', text: '#1F2937', badge: '#FEF2F2', badgeText: '#DC2626' },
  Biology:     { bg: '#FFFFFF', accent: '#22C55E', text: '#1F2937', badge: '#F0FDF4', badgeText: '#16A34A' },
  Computer:    { bg: '#FFFFFF', accent: '#8B5CF6', text: '#1F2937', badge: '#F5F3FF', badgeText: '#7C3AED' },
};
const DEFAULT_COLOR = { bg: '#FFFFFF', accent: '#6B7280', text: '#1F2937', badge: '#F3F4F6', badgeText: '#4B5563' };

function getSubjectColor(subject: string) {
  for (const key of Object.keys(SUBJECT_COLORS)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) {
      return SUBJECT_COLORS[key];
    }
  }
  return DEFAULT_COLOR;
}

/** Compute duration label from HH:mm strings */
function getDuration(start: string, end: string): string {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) return '';
  return `${mins} mins`;
}

/** Format HH:mm (24h) to 12h display without leading zero */
function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, '0')}`;
}

// ── Holidays / Occasions per day ──
interface Occasion {
  title: string;
  type: 'holiday' | 'event';
}

function getOccasionsForDay(day: DayOfWeek, weekOffset: number): Occasion[] {
  const today = new Date();
  const currentDayIdx = today.getDay(); // 0=Sun
  const dayIdx = DAY_LABELS.findIndex((d) => d.key === day) + 1; // 1=Mon
  const diff = dayIdx - (currentDayIdx === 0 ? 7 : currentDayIdx);
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff + weekOffset * 7);
  const dateStr = targetDate.toISOString().split('T')[0];

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

/** Check if there's a break/recess gap between two consecutive entries */
function hasBreakBetween(a: TimetableEntry, b: TimetableEntry): { has: boolean; label: string; time: string } {
  const [aeh, aem] = a.end_time.split(':').map(Number);
  const [bsh, bsm] = b.start_time.split(':').map(Number);
  const gapMins = (bsh * 60 + bsm) - (aeh * 60 + aem);
  if (gapMins >= 10) {
    const label = gapMins >= 30 ? 'LUNCH BREAK' : 'RECESS / BREAK';
    return { has: true, label, time: formatTime12(a.end_time) };
  }
  return { has: false, label: '', time: '' };
}

export default function TimetableScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
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
      {/* ── Day Selector Strip ── */}
      <View style={styles.dayStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayStripScroll}>
          {DAY_LABELS.map((d) => {
            const isActive = d.key === selectedDay;
            const date = getDateForDay(d.key, weekOffset);
            const dayNum = date.getDate();
            const dayIsHoliday = getOccasionsForDay(d.key, weekOffset).some((o) => o.type === 'holiday');
            const hasOccasion = getOccasionsForDay(d.key, weekOffset).length > 0;

            return (
              <TouchableOpacity
                key={d.key}
                style={[styles.dayCol, isActive && styles.dayColActive]}
                onPress={() => setSelectedDay(d.key)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dayAbbr,
                  isActive && styles.dayAbbrActive,
                  dayIsHoliday && !isActive && { color: colors.danger },
                ]}>
                  {d.short}
                </Text>
                <View style={[styles.dayNumCircle, isActive && styles.dayNumCircleActive]}>
                  <Text style={[
                    styles.dayNum,
                    isActive && styles.dayNumActive,
                    dayIsHoliday && !isActive && { color: colors.danger },
                  ]}>
                    {dayNum}
                  </Text>
                </View>
                {hasOccasion && !isActive && (
                  <View style={[
                    styles.dayDot,
                    dayIsHoliday ? { backgroundColor: colors.danger } : { backgroundColor: colors.primary },
                  ]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Week nav arrows */}
        <View style={styles.weekNavRow}>
          <TouchableOpacity onPress={() => setWeekOffset(weekOffset - 1)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.weekLabel}>{weekLabel}</Text>
          <TouchableOpacity onPress={() => setWeekOffset(weekOffset + 1)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Section Header ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {isHoliday ? "Holiday" : "Today's Schedule"}
        </Text>
        <Text style={styles.sectionCount}>
          {isHoliday
            ? occasions[0]?.title ?? 'Holiday'
            : `${entries.length} Class${entries.length !== 1 ? 'es' : ''}`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Occasion Banners ── */}
        {occasions.map((occ, i) => (
          <View
            key={i}
            style={[
              styles.occasionBanner,
              occ.type === 'holiday' ? styles.occasionHoliday : styles.occasionEvent,
            ]}
          >
            <View style={[
              styles.occasionIcon,
              { backgroundColor: occ.type === 'holiday' ? '#FEE2E2' : '#DBEAFE' },
            ]}>
              <Ionicons
                name={occ.type === 'holiday' ? 'sunny' : 'calendar'}
                size={22}
                color={occ.type === 'holiday' ? colors.danger : colors.primary}
              />
            </View>
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

        {/* ── Class Cards ── */}
        {!isHoliday && entries.length > 0 && (
          <View style={styles.scheduleList}>
            {entries.map((entry, idx) => {
              const sc = getSubjectColor(entry.subject);
              const duration = getDuration(entry.start_time, entry.end_time);
              const subjectLabel = entry.subject.split(' ')[0].toUpperCase();

              // Check if there's a break before this entry
              const brk = idx > 0 ? hasBreakBetween(entries[idx - 1], entry) : { has: false, label: '', time: '' };

              return (
                <React.Fragment key={entry.id || idx}>
                  {brk.has && (
                    <View style={styles.breakRow}>
                      <Text style={styles.breakTime}>{brk.time}</Text>
                      <View style={styles.breakLine} />
                      <Text style={styles.breakLabel}>{brk.label}</Text>
                      <View style={styles.breakLine} />
                    </View>
                  )}
                  <View style={styles.classRow}>
                    {/* Time label */}
                    <Text style={styles.classTime}>{formatTime12(entry.start_time)}</Text>

                    {/* Card */}
                    <View style={[styles.classCard, { borderLeftColor: sc.accent }]}>
                      {/* Top row: badge + duration */}
                      <View style={styles.cardTopRow}>
                        <View style={[styles.subjectBadge, { backgroundColor: sc.badge }]}>
                          <Text style={[styles.subjectBadgeText, { color: sc.badgeText }]}>
                            {subjectLabel}
                          </Text>
                        </View>
                        <Text style={styles.durationText}>{duration}</Text>
                      </View>

                      {/* Subject name */}
                      <Text style={styles.subjectName}>{entry.subject}</Text>

                      {/* Details row */}
                      <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                          <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
                          <Text style={styles.detailText}>{entry.class_name}</Text>
                        </View>
                        {entry.room ? (
                          <View style={styles.detailItem}>
                            <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
                            <Text style={styles.detailText}>{entry.room}</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}

        {/* ── Empty: No classes (non-holiday) ── */}
        {!isHoliday && entries.length === 0 && occasions.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="cafe-outline" size={44} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No Classes Scheduled</Text>
            <Text style={styles.emptySubtext}>Enjoy your free day!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // ── Day strip ──
  dayStrip: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  dayStripScroll: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  dayCol: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginHorizontal: 2,
  },
  dayColActive: {
    // active column gets highlighted circle on number
  },
  dayAbbr: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  dayAbbrActive: {
    color: colors.primary,
  },
  dayNumCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumCircleActive: {
    backgroundColor: '#F97316',
  },
  dayNum: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dayNumActive: {
    color: colors.white,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 4,
  },
  weekNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xs,
    gap: spacing.md,
  },
  weekLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // ── Section header ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionCount: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // ── Content ──
  content: {
    paddingBottom: 100,
  },

  // ── Occasion banners ──
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
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  occasionEvent: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  occasionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
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

  // ── Schedule list ──
  scheduleList: {
    paddingHorizontal: spacing.lg,
  },

  // ── Break / Recess row ──
  breakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    paddingLeft: 60,
    gap: spacing.sm,
  },
  breakTime: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
  },
  breakLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  breakLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 1,
  },

  // ── Class row ──
  classRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  classTime: {
    width: 52,
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },

  // ── Class card ──
  classCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  durationText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subjectName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  // ── Empty state ──
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  emptySubtext: {
    color: colors.textLight,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
