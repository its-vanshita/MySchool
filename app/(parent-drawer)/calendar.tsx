import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, fontSize } from '../../src/theme/spacing';
import { useAdminStudentCalendarEvents } from '../../src/hooks/useAdminCalendar';

// Student-centric event types only (no meetings)
type StudentEventType = 'exam' | 'holiday' | 'event';

interface StudentEvent {
  id: string;
  title: string;
  type: StudentEventType;
  date: string;
  endDate?: string;
  description: string;
  time?: string;
  venue?: string;
}

const EVENT_TYPE_CONFIG: Record<StudentEventType, { color: string; bg: string; label: string }> = {
  exam: { color: '#1565C0', bg: '#E3F2FD', label: 'Exams' },
  holiday: { color: '#EF4444', bg: '#FEE2E2', label: 'Holidays' },
  event: { color: '#10B981', bg: '#D1FAE5', label: 'School Events' },
};

// Demo student-centric events
const STUDENT_EVENTS: StudentEvent[] = [
  {
    id: '1',
    title: 'Gandhi Jayanti',
    type: 'holiday',
    date: '2026-10-02',
    description: 'Public Holiday - School Closed',
  },
  {
    id: '2',
    title: 'Annual Sports Day',
    type: 'event',
    date: '2026-10-06',
    description: '08:00 AM - 02:00 PM',
    venue: 'Main Ground',
  },
  {
    id: '3',
    title: 'Mid-Term Exams Begin',
    type: 'exam',
    date: '2026-10-13',
    endDate: '2026-10-22',
    description: 'Standard I to XII',
    venue: 'Respective Classes',
  },
  {
    id: '4',
    title: 'Diwali Break Starts',
    type: 'holiday',
    date: '2026-10-23',
    endDate: '2026-10-31',
    description: 'Autumn Vacation until Oct 31st',
  },
  {
    id: '5',
    title: 'Republic Day',
    type: 'holiday',
    date: '2026-01-26',
    description: 'National Holiday - School Closed',
  },
  {
    id: '6',
    title: 'Science Exhibition',
    type: 'event',
    date: '2026-03-14',
    description: '09:00 AM - 01:00 PM',
    venue: 'School Auditorium',
  },
  {
    id: '7',
    title: 'Pre-Board Exams Begin',
    type: 'exam',
    date: '2026-03-17',
    endDate: '2026-03-22',
    description: 'Class 8-B',
    venue: 'Exam Hall',
  },
  {
    id: '8',
    title: 'Holi Holiday',
    type: 'holiday',
    date: '2026-03-10',
    description: 'Festival Holiday - School Closed',
  },
  {
    id: '9',
    title: 'Annual Day Function',
    type: 'event',
    date: '2026-04-02',
    description: '10:00 AM - 04:00 PM',
    venue: 'School Auditorium',
  },
  {
    id: '10',
    title: 'Good Friday',
    type: 'holiday',
    date: '2026-04-03',
    description: 'Public Holiday - School Closed',
  },
  {
    id: '11',
    title: 'Final Exams Begin',
    type: 'exam',
    date: '2026-05-04',
    endDate: '2026-05-15',
    description: 'All Classes',
    venue: 'Exam Halls',
  },
  {
    id: '12',
    title: 'Summer Vacation Begins',
    type: 'holiday',
    date: '2026-05-25',
    endDate: '2026-06-30',
    description: 'Summer Break for all students',
  },
];

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
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

export default function ParentAcademicCalendarScreen() {
  const adminEvents = useAdminStudentCalendarEvents();

  const allEvents = useMemo(() => {
    return [...STUDENT_EVENTS, ...adminEvents].sort((a, b) => a.date.localeCompare(b.date));
  }, [adminEvents]);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  );

  // Build a map of dates to event types for calendar dots
  const eventsByDate = useMemo(() => {
    const map: Record<string, { types: Set<StudentEventType>; events: StudentEvent[] }> = {};
    allEvents.forEach((ev) => {
      const start = ev.date;
      const end = ev.endDate || ev.date;
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

  // Upcoming events from current month onwards
  const upcomingEvents = useMemo(() => {
    const monthStart = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-01`;
    return allEvents
      .filter((ev) => ev.date >= monthStart)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [viewYear, viewMonth, allEvents]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

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
      {/* Calendar Card */}
      <View style={styles.calendarCard}>
        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => goMonth(-1)} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
          <TouchableOpacity onPress={() => goMonth(1)} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Weekday Headers */}
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((d) => (
            <Text key={d} style={styles.weekdayText}>{d}</Text>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <View key={`e-${idx}`} style={styles.dayCell} />;
            }
            const dateStr = toDateStr(viewYear, viewMonth, day);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const entry = eventsByDate[dateStr];
            const hasExam = entry?.types.has('exam');
            const hasHoliday = entry?.types.has('holiday');
            const hasEvent = entry?.types.has('event');

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
                <Text style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  isToday && !isSelected && styles.dayTextToday,
                  hasHoliday && !isSelected && !isToday && styles.dayTextHoliday,
                ]}>
                  {day}
                </Text>
                {/* Event dots */}
                {(hasExam || hasHoliday || hasEvent) && (
                  <View style={styles.dotsRow}>
                    {hasExam && (
                      <View style={[styles.eventDot, {
                        backgroundColor: isSelected ? '#fff' : EVENT_TYPE_CONFIG.exam.color,
                      }]} />
                    )}
                    {hasHoliday && (
                      <View style={[styles.eventDot, {
                        backgroundColor: isSelected ? '#fff' : EVENT_TYPE_CONFIG.holiday.color,
                      }]} />
                    )}
                    {hasEvent && (
                      <View style={[styles.eventDot, {
                        backgroundColor: isSelected ? '#fff' : EVENT_TYPE_CONFIG.event.color,
                      }]} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendCard}>
        <Text style={styles.legendLabel}>LEGEND</Text>
        <View style={styles.legendRow}>
          {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: config.color }]} />
              <Text style={styles.legendText}>{config.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Upcoming Events */}
      <Text style={styles.sectionTitle}>Upcoming Events</Text>

      {upcomingEvents.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={40} color={colors.textLight} />
          <Text style={styles.emptyText}>No upcoming events this month</Text>
        </View>
      ) : (
        upcomingEvents.map((ev) => {
          const evDate = new Date(ev.date + 'T00:00:00');
          const config = EVENT_TYPE_CONFIG[ev.type as StudentEventType];
          const isExam = ev.type === 'exam';

          return (
            <TouchableOpacity key={ev.id} style={styles.eventCard} activeOpacity={0.7}>
              {/* Date Column */}
              <View style={[styles.eventDateCol, isExam && { borderColor: config.color }]}>
                <Text style={[styles.eventDateMonth, { color: config.color }]}>
                  {MONTH_SHORT[evDate.getMonth()]}
                </Text>
                <Text style={styles.eventDateDay}>
                  {String(evDate.getDate()).padStart(2, '0')}
                </Text>
              </View>

              {/* Event Details */}
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{ev.title}</Text>
                <Text style={styles.eventDesc}>
                  {ev.description}
                  {ev.venue ? ` • ${ev.venue}` : ''}
                </Text>
              </View>

              {/* Arrow */}
              <View style={styles.eventArrow}>
                <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
              </View>
            </TouchableOpacity>
          );
        })
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingBottom: 32,
  },

  // Calendar Card
  calendarCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  // Month Navigation
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  // Weekday headers
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.3,
  },

  // Days grid
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  dayCellToday: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '800',
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '800',
  },
  dayTextHoliday: {
    color: '#EF4444',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 2,
    position: 'absolute',
    bottom: 6,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },

  // Legend
  legendCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },

  // Event Card
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  eventDateCol: {
    width: 52,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventDateMonth: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  eventDateDay: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: -1,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  eventDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  eventArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // Empty
  emptyCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 14,
    marginTop: 10,
  },
});
