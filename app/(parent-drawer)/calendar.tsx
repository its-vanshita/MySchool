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
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import type { CalendarEvent, CalendarEventType } from '../../src/types';

const TYPE_CONFIG: Record<CalendarEventType, { color: string; icon: string; bg: string; label: string }> = {
  holiday: { color: '#EF4444', icon: 'sunny', bg: '#FEE2E2', label: 'Holiday' },
  event: { color: '#10B981', icon: 'star', bg: '#D1FAE5', label: 'School Event' },
  exam: { color: '#F59E0B', icon: 'school', bg: '#FEF3C7', label: 'Exam' },
  meeting: { color: '#7C3AED', icon: 'people', bg: '#EDE9FE', label: 'Meeting' },
};

// Parent-relevant demo events (holidays, exams, parent events)
const DEMO_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Holi Holiday', type: 'holiday', date: '2026-03-10', end_date: '2026-03-10', description: 'School closed for Holi festival.', school_id: 'demo-school', created_at: '' },
  { id: '2', title: 'Science Exhibition', type: 'event', date: '2026-03-14', end_date: '2026-03-14', description: 'Annual science exhibition – students to present projects.', school_id: 'demo-school', created_at: '' },
  { id: '3', title: 'Class 10 Pre-Board Exams', type: 'exam', date: '2026-03-17', end_date: '2026-03-22', description: 'Pre-board examinations for Class 10.', school_id: 'demo-school', created_at: '' },
  { id: '4', title: 'Parent-Teacher Meeting', type: 'meeting', date: '2026-03-25', end_date: '2026-03-25', description: 'Discuss student progress with teachers.', school_id: 'demo-school', created_at: '' },
  { id: '5', title: 'Annual Day Function', type: 'event', date: '2026-04-02', end_date: '2026-04-02', description: 'Annual day celebration.', school_id: 'demo-school', created_at: '' },
  { id: '6', title: 'Good Friday', type: 'holiday', date: '2026-04-03', end_date: '2026-04-03', description: 'School closed.', school_id: 'demo-school', created_at: '' },
  { id: '7', title: 'Sports Day', type: 'event', date: '2026-04-18', end_date: '2026-04-18', description: 'Annual sports day.', school_id: 'demo-school', created_at: '' },
  { id: '8', title: 'Final Exams Begin', type: 'exam', date: '2026-05-04', end_date: '2026-05-15', description: 'Annual final examinations.', school_id: 'demo-school', created_at: '' },
  { id: '9', title: 'Summer Vacation Begins', type: 'holiday', date: '2026-05-25', end_date: '2026-06-30', description: 'Summer vacation for students.', school_id: 'demo-school', created_at: '' },
];

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

export default function ParentCalendarScreen() {
  const { profile } = useUser();
  const { events: dbEvents } = useCalendar(profile?.school_id);

  const allEvents = useMemo(() => {
    return dbEvents.length > 0 ? dbEvents : DEMO_EVENTS;
  }, [dbEvents]);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const eventsByDate = useMemo(() => {
    const map: Record<string, { types: Set<CalendarEventType>; events: CalendarEvent[] }> = {};
    allEvents.forEach((ev) => {
      const start = ev.date;
      const end = ev.end_date || ev.date;
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
  }, [allEvents]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  const selectedEvents = eventsByDate[selectedDate]?.events ?? [];

  const goMonth = (dir: number) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Month Navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={() => goMonth(-1)} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={() => goMonth(1)} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarCard}>
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((d) => (
            <Text key={d} style={styles.weekdayText}>{d}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <View key={`e-${idx}`} style={styles.dayCell} />;
            }
            const dateStr = toDateStr(viewYear, viewMonth, day);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const entry = eventsByDate[dateStr];
            const eventTypes = entry ? Array.from(entry.types) : [];

            return (
              <TouchableOpacity
                key={dateStr}
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                  isToday && !isSelected && styles.dayCellToday,
                ]}
                onPress={() => setSelectedDate(dateStr)}
              >
                <Text style={[
                  styles.dayText,
                  isSelected && { color: colors.white, fontWeight: '800' },
                  isToday && !isSelected && { color: colors.primary, fontWeight: '800' },
                ]}>
                  {day}
                </Text>
                {eventTypes.length > 0 && (
                  <View style={styles.dotsRow}>
                    {eventTypes.slice(0, 3).map((t) => (
                      <View
                        key={t}
                        style={[
                          styles.eventDot,
                          { backgroundColor: isSelected ? colors.white : TYPE_CONFIG[t].color },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        {Object.entries(TYPE_CONFIG).map(([key, config]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: config.color }]} />
            <Text style={styles.legendText}>{config.label}</Text>
          </View>
        ))}
      </View>

      {/* Events for selected date */}
      <Text style={styles.sectionTitle}>
        Events for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
      </Text>

      {selectedEvents.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={36} color={colors.textLight} />
          <Text style={styles.emptyText}>No events on this day</Text>
        </View>
      ) : (
        selectedEvents.map((ev) => {
          const config = TYPE_CONFIG[ev.type];
          return (
            <View key={ev.id} style={styles.eventCard}>
              <View style={[styles.eventIcon, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon as any} size={20} color={config.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{ev.title}</Text>
                <View style={[styles.typePill, { backgroundColor: config.bg }]}>
                  <Text style={[styles.typePillText, { color: config.color }]}>{config.label}</Text>
                </View>
                {ev.description ? (
                  <Text style={styles.eventDesc} numberOfLines={2}>{ev.description}</Text>
                ) : null}
                {ev.end_date && ev.end_date !== ev.date && (
                  <Text style={styles.eventRange}>
                    {new Date(ev.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    {' – '}
                    {new Date(ev.end_date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Text>
                )}
              </View>
            </View>
          );
        })
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxxl },

  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  navBtn: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  calendarCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  weekdayText: {
    width: 40,
    textAlign: 'center',
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textLight,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  dayCellToday: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
  },
  dayText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },

  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  emptyCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },

  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  eventTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  typePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginBottom: 4,
  },
  typePillText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  eventDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  eventRange: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 4,
  },
});
