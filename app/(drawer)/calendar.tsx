import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/context/UserContext';
import { useCalendar } from '../../src/hooks/useCalendar';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { CalendarEvent, CalendarEventType } from '../../src/types';
import { useAdminTeacherCalendarEvents } from '../../src/hooks/useAdminCalendar';

// ─── Event type config ──────────────────────────────────────

const TYPE_CONFIG: Record<CalendarEventType, { color: string; icon: string; bg: string; label: string }> = {
  holiday: { color: '#EF4444', icon: 'sunny', bg: '#FEE2E2', label: 'Holiday' },
  event: { color: '#10B981', icon: 'star', bg: '#D1FAE5', label: 'School Event' },
  exam: { color: '#F59E0B', icon: 'school', bg: '#FEF3C7', label: 'Exam' },
  meeting: { color: '#7C3AED', icon: 'people', bg: '#EDE9FE', label: 'Meeting' },
};

// ─── Demo events for teacher dashboard ──────────────────────

const DEMO_EVENTS: CalendarEvent[] = [
  // March 2026
  { id: '1', title: 'Staff Meeting – Term Review', type: 'meeting', date: '2026-03-02', end_date: '2026-03-02', description: 'Review of mid-term results and action plan discussion.', school_id: 'demo-school', created_at: '' },
  { id: '2', title: 'Holi Holiday', type: 'holiday', date: '2026-03-10', end_date: '2026-03-10', description: 'School closed for Holi festival.', school_id: 'demo-school', created_at: '' },
  { id: '3', title: 'Science Exhibition', type: 'event', date: '2026-03-14', end_date: '2026-03-14', description: 'Annual science exhibition – all classes to present projects.', school_id: 'demo-school', created_at: '' },
  { id: '4', title: 'Class 10 Pre-Board Exams', type: 'exam', date: '2026-03-17', end_date: '2026-03-22', description: 'Pre-board examinations for Class 10 students.', school_id: 'demo-school', created_at: '' },
  { id: '5', title: 'Parent-Teacher Meeting', type: 'meeting', date: '2026-03-25', end_date: '2026-03-25', description: 'Discuss student progress with parents. Attendance mandatory for class teachers.', school_id: 'demo-school', created_at: '' },
  { id: '6', title: 'Annual Day Rehearsal', type: 'event', date: '2026-03-28', end_date: '2026-03-29', description: 'Full rehearsal for annual day function. Teachers to supervise assigned houses.', school_id: 'demo-school', created_at: '' },
  // April 2026
  { id: '7', title: 'Annual Day Function', type: 'event', date: '2026-04-02', end_date: '2026-04-02', description: 'Annual day celebration. Chief guest: District Collector.', school_id: 'demo-school', created_at: '' },
  { id: '8', title: 'Good Friday', type: 'holiday', date: '2026-04-03', end_date: '2026-04-03', description: 'School closed.', school_id: 'demo-school', created_at: '' },
  { id: '9', title: 'Class 9 Unit Test', type: 'exam', date: '2026-04-07', end_date: '2026-04-10', description: 'Unit test for Class 9 – all subjects.', school_id: 'demo-school', created_at: '' },
  { id: '10', title: 'Faculty Workshop – NEP 2020', type: 'meeting', date: '2026-04-12', end_date: '2026-04-12', description: 'Workshop on implementing National Education Policy changes.', school_id: 'demo-school', created_at: '' },
  { id: '11', title: 'Dr. Ambedkar Jayanti', type: 'holiday', date: '2026-04-14', end_date: '2026-04-14', description: 'School closed.', school_id: 'demo-school', created_at: '' },
  { id: '12', title: 'Sports Day', type: 'event', date: '2026-04-18', end_date: '2026-04-18', description: 'Annual sports day. Teachers assigned as judges for respective events.', school_id: 'demo-school', created_at: '' },
  { id: '13', title: 'Department HOD Meeting', type: 'meeting', date: '2026-04-22', end_date: '2026-04-22', description: 'Monthly HOD meeting – syllabus completion review.', school_id: 'demo-school', created_at: '' },
  // May 2026
  { id: '14', title: 'Final Exams Begin', type: 'exam', date: '2026-05-04', end_date: '2026-05-15', description: 'Annual final examinations for Classes 6-9.', school_id: 'demo-school', created_at: '' },
  { id: '15', title: 'Buddha Purnima', type: 'holiday', date: '2026-05-12', end_date: '2026-05-12', description: 'School closed.', school_id: 'demo-school', created_at: '' },
  { id: '16', title: 'Result Compilation Meeting', type: 'meeting', date: '2026-05-18', end_date: '2026-05-18', description: 'Teachers to submit final marks and compile result sheets.', school_id: 'demo-school', created_at: '' },
  { id: '17', title: 'Summer Vacation Begins', type: 'holiday', date: '2026-05-25', end_date: '2026-06-30', description: 'Summer vacation for students.', school_id: 'demo-school', created_at: '' },
];

// ─── Helpers ────────────────────────────────────────────────

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function isDateInRange(dateStr: string, start: string, end: string) {
  return dateStr >= start && dateStr <= end;
}

// ─── Filter chips ───────────────────────────────────────────

type FilterValue = 'all' | CalendarEventType;
const FILTERS: { value: FilterValue; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: 'apps' },
  { value: 'meeting', label: 'Meetings', icon: 'people' },
  { value: 'exam', label: 'Exams', icon: 'school' },
  { value: 'event', label: 'Events', icon: 'star' },
  { value: 'holiday', label: 'Holidays', icon: 'sunny' },
];

// ═══════════════════════════════════════════════════════════════
// CalendarScreen
// ═══════════════════════════════════════════════════════════════

export default function CalendarScreen() {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { profile, role } = useUser();
  const { events: dbEvents } = useCalendar(profile?.school_id);
  const adminEvents = useAdminTeacherCalendarEvents();

  const allEvents = useMemo(() => {
    const defaultEvents = dbEvents.length > 0 ? dbEvents : DEMO_EVENTS;
    return [...defaultEvents, ...adminEvents].sort((a, b) => a.date.localeCompare(b.date));
  }, [dbEvents, adminEvents]);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [filter, setFilter] = useState<FilterValue>('all');

  // ── Events indexed by date ──
  const eventsByDate = useMemo(() => {
    const map: Record<string, { types: Set<CalendarEventType>; events: CalendarEvent[] }> = {};
    const filtered = filter === 'all' ? allEvents : allEvents.filter((e) => e.type === filter);
    filtered.forEach((ev) => {
      const start = ev.date;
      const end = ev.end_date || ev.date;
      // Expand date range
      const s = new Date(start + 'T00:00:00');
      const e = new Date(end + 'T00:00:00');
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split('T')[0];
        if (!map[key]) map[key] = { types: new Set(), events: [] };
        map[key].types.add(ev.type);
        if (!map[key].events.find((x) => x.id === ev.id)) map[key].events.push(ev);
      }
    });
    return map;
  }, [allEvents, filter]);

  // ── Calendar grid ──
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  // ── Events for selected date ──
  const selectedEvents = eventsByDate[selectedDate]?.events ?? [];

  // ── Navigate month ──
  const goMonth = (dir: number) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  // ── Upcoming events (next 7 days from today) ──
  const upcomingEvents = useMemo(() => {
    const start = todayStr;
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 14);
    const end = endDate.toISOString().split('T')[0];
    const filtered = filter === 'all' ? allEvents : allEvents.filter((e) => e.type === filter);
    return filtered
      .filter((e) => e.date >= start && e.date <= end)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allEvents, filter, todayStr]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Filter chips ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {FILTERS.map((f) => {
          const active = filter === f.value;
          const cfg = f.value !== 'all' ? TYPE_CONFIG[f.value as CalendarEventType] : null;
          return (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterChip, active && { backgroundColor: cfg?.color || colors.primary, borderColor: cfg?.color || colors.primary }]}
              onPress={() => setFilter(f.value)}
            >
              <Ionicons name={f.icon as any} size={14} color={active ? '#fff' : colors.textSecondary} />
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Calendar card ── */}
      <View style={styles.calendarCard}>
        {/* Month navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => goMonth(-1)} style={styles.monthArrow}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
          <TouchableOpacity onPress={() => goMonth(1)} style={styles.monthArrow}>
            <Ionicons name="chevron-forward" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekRow}>
          {WEEKDAYS.map((d) => (
            <View key={d} style={styles.weekCell}>
              <Text style={[styles.weekLabel, d === 'Sun' && { color: colors.danger }]}>{d.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Day grid */}
        <View style={styles.dayGrid}>
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <View key={`empty-${idx}`} style={styles.dayCell} />;
            }
            const dateStr = toDateStr(viewYear, viewMonth, day);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const dayEvents = eventsByDate[dateStr];
            const isSunday = new Date(viewYear, viewMonth, day).getDay() === 0;

            return (
              <TouchableOpacity
                key={dateStr}
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                  isToday && !isSelected && styles.dayCellToday,
                ]}
                onPress={() => setSelectedDate(dateStr)}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSunday && styles.dayTextSunday,
                    isToday && styles.dayTextToday,
                    isSelected && styles.dayTextSelected,
                  ]}
                >
                  {day}
                </Text>
                {/* Event dots */}
                {dayEvents && (
                  <View style={styles.dotRow}>
                    {Array.from(dayEvents.types).slice(0, 3).map((type) => (
                      <View
                        key={type}
                        style={[styles.dot, { backgroundColor: TYPE_CONFIG[type].color }]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: cfg.color }]} />
              <Text style={styles.legendLabel}>{cfg.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Selected date events ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedDate === todayStr ? 'Today' : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        {selectedEvents.length === 0 ? (
          <View style={styles.noEvents}>
            <Ionicons name="checkmark-circle-outline" size={32} color={colors.textLight} />
            <Text style={styles.noEventsText}>No events scheduled</Text>
          </View>
        ) : (
          selectedEvents.map((ev) => {
            const cfg = TYPE_CONFIG[ev.type];
            return (
              <View key={ev.id} style={[styles.eventCard, { borderLeftColor: cfg.color }]}>
                <View style={[styles.eventIconBadge, { backgroundColor: cfg.bg }]}>
                  <Ionicons name={cfg.icon as any} size={18} color={cfg.color} />
                </View>
                <View style={styles.eventContent}>
                  <View style={styles.eventHeaderRow}>
                    <Text style={styles.eventTitle}>{ev.title}</Text>
                    <View style={[styles.typePill, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.typePillText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.eventDateText}>
                    {new Date(ev.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    {ev.end_date && ev.end_date !== ev.date
                      ? ` — ${new Date(ev.end_date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                      : ''}
                  </Text>
                  {ev.description ? (
                    <Text style={styles.eventDesc}>{ev.description}</Text>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* ── Upcoming events ── */}
      {upcomingEvents.length > 0 && (
        <View style={[styles.section, { marginBottom: spacing.xxxl }]}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {upcomingEvents.map((ev) => {
            const cfg = TYPE_CONFIG[ev.type];
            return (
              <TouchableOpacity
                key={ev.id}
                style={styles.upcomingRow}
                onPress={() => {
                  const d = new Date(ev.date + 'T00:00:00');
                  setViewYear(d.getFullYear());
                  setViewMonth(d.getMonth());
                  setSelectedDate(ev.date);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.upcomingDateBox}>
                  <Text style={styles.upcomingDay}>
                    {new Date(ev.date + 'T00:00:00').getDate()}
                  </Text>
                  <Text style={styles.upcomingMonth}>
                    {MONTH_NAMES[new Date(ev.date + 'T00:00:00').getMonth()].slice(0, 3).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.upcomingInfo}>
                  <Text style={styles.upcomingTitle} numberOfLines={1}>{ev.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={[styles.dot, { backgroundColor: cfg.color }]} />
                    <Text style={styles.upcomingType}>{cfg.label}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════════

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 100 },

  // Filter
  filterRow: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  filterText: { fontSize: fontSize.xs, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: '#fff' },

  // Calendar card
  calendarCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
  },
  monthArrow: { padding: spacing.sm },
  monthLabel: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
  },
  weekCell: { flex: 1, alignItems: 'center' },
  weekLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 48,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
    borderRadius: 14,
  },
  dayCellToday: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
  },
  dayText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  dayTextSunday: { color: colors.danger },
  dayTextToday: { fontWeight: '800', color: colors.primary },
  dayTextSelected: { color: colors.white, fontWeight: '800' },
  dotRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 3,
    height: 6,
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  // Sections
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Event cards
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  eventIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  eventContent: { flex: 1 },
  eventHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  eventTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  typePill: {
    borderRadius: borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typePillText: { fontSize: 10, fontWeight: '700' },
  eventDateText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  eventDesc: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
    lineHeight: 18,
  },

  // No events
  noEvents: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  noEventsText: {
    color: colors.textLight,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },

  // Upcoming
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  upcomingDateBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  upcomingDay: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 22,
  },
  upcomingMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  upcomingInfo: { flex: 1 },
  upcomingTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  upcomingType: { fontSize: fontSize.xs, color: colors.textSecondary },
});

