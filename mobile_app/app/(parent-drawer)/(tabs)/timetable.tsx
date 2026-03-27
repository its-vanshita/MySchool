import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useUser } from '../../../src/context/UserContext';
import { useTimetable } from '../../../src/hooks/useTimetable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DayOfWeek, TimetableEntry } from '../../../src/types';

// Premium Theme Variables
const BRAND_NAVY = '#153462';
const BG_LIGHT = '#F8F9FB';
const PURE_WHITE = '#FFFFFF';
const SLATE_GREY = '#64748B';
const DARK_TEXT = '#1E293B';

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
const SUBJECT_COLORS: Record<string, { accent: string; badge: string; badgeText: string }> = {
  Mathematics: { accent: '#F97316', badge: '#FFF7ED', badgeText: '#EA580C' },
  Science:     { accent: '#10B981', badge: '#ECFDF5', badgeText: '#059669' },
  English:     { accent: '#7C3AED', badge: '#F5F3FF', badgeText: '#7C3AED' },
  Hindi:       { accent: '#EC4899', badge: '#FDF2F8', badgeText: '#DB2777' },
  History:     { accent: '#F59E0B', badge: '#FFFBEB', badgeText: '#D97706' },
  Geography:   { accent: '#14B8A6', badge: '#F0FDFA', badgeText: '#0D9488' },
  Physics:     { accent: '#3B82F6', badge: '#EFF6FF', badgeText: '#2563EB' },
  Chemistry:   { accent: '#EF4444', badge: '#FEF2F2', badgeText: '#DC2626' },
  Biology:     { accent: '#22C55E', badge: '#F0FDF4', badgeText: '#16A34A' },
  Computer:    { accent: '#8B5CF6', badge: '#F5F3FF', badgeText: '#7C3AED' },
};
const DEFAULT_COLOR = { accent: '#64748B', badge: '#F1F5F9', badgeText: '#475569' };

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
  const insets = useSafeAreaInsets();
  const router = useRouter();
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

  // Week range label
  const weekStart = getDateForDay('monday', weekOffset);
  const weekEnd = getDateForDay('saturday', weekOffset);
  const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekLabel = `${SHORT_MONTHS[weekStart.getMonth()]} ${weekStart.getDate()} - ${SHORT_MONTHS[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BRAND_NAVY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Tabs.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Timetable',
        }} 
      />

      {/* ── Floating Calendar Strip ── */}
      <View style={styles.calendarFloatWrap}>
        <View style={styles.calendarCard}>
           {/* Week Navigator */}
           <View style={styles.weekNav}>
              <TouchableOpacity onPress={() => setWeekOffset(weekOffset - 1)} style={styles.navHit}>
                 <Ionicons name="chevron-back" size={20} color={BRAND_NAVY} />
              </TouchableOpacity>
              <Text style={styles.weekLabelText}>{weekLabel}</Text>
              <TouchableOpacity onPress={() => setWeekOffset(weekOffset + 1)} style={styles.navHit}>
                 <Ionicons name="chevron-forward" size={20} color={BRAND_NAVY} />
              </TouchableOpacity>
           </View>

           {/* Days Row */}
           <View style={styles.daysRow}>
              {DAY_LABELS.map((d) => {
                 const isActive = d.key === selectedDay;
                 const date = getDateForDay(d.key, weekOffset);
                 const dayNum = date.getDate();
                 
                 return (
                    <TouchableOpacity
                       key={d.key}
                       style={[styles.dayItem, isActive && styles.dayItemActive]}
                       onPress={() => setSelectedDay(d.key)}
                       activeOpacity={0.8}
                    >
                       <Text style={[styles.dayShortName, isActive && styles.dayShortNameActive]}>
                          {d.short}
                       </Text>
                       <Text style={[styles.dayNumber, isActive && styles.dayNumberActive]}>
                          {dayNum}
                       </Text>
                    </TouchableOpacity>
                 );
              })}
           </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ── Section Header ── */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Today's Schedule</Text>
           <View style={styles.badgeWrap}>
               <Text style={styles.badgeTextCount}>
                  {isHoliday ? occasions[0]?.title : `${entries.length} Classes`}
               </Text>
           </View>
        </View>

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
              { backgroundColor: occ.type === 'holiday' ? '#FEF2F2' : '#EFF6FF' },
            ]}>
              <Ionicons
                name={occ.type === 'holiday' ? 'sunny' : 'calendar'}
                size={22}
                color={occ.type === 'holiday' ? '#EF4444' : BRAND_NAVY}
              />
            </View>
            <View style={styles.occasionTextWrap}>
              <Text style={[
                styles.occasionTitle,
                { color: occ.type === 'holiday' ? '#EF4444' : BRAND_NAVY },
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

              const brk = idx > 0 ? hasBreakBetween(entries[idx - 1], entry) : { has: false, label: '', time: '' };

              return (
                <React.Fragment key={entry.id || idx}>
                  {brk.has && (
                    <View style={styles.breakRow}>
                      <View style={styles.breakDot} />
                      <View style={styles.breakLineWrap}>
                         <View style={styles.breakLine} />
                      </View>
                      <View style={styles.breakPill}>
                         <Ionicons name="cafe-outline" size={14} color="#94A3B8" />
                         <Text style={styles.breakLabel}>{brk.label}</Text>
                      </View>
                      <View style={styles.breakLineWrap}>
                         <View style={styles.breakLine} />
                      </View>
                    </View>
                  )}
                  <View style={styles.classRow}>
                    <View style={styles.timelineCol}>
                       <Text style={styles.classTimeText}>{formatTime12(entry.start_time)}</Text>
                       <Text style={styles.classDurationSide}>{duration}</Text>
                    </View>

                    <View style={styles.cardContainer}>
                       <View style={[styles.cardAccent, { backgroundColor: sc.accent }]} />
                       <View style={styles.classCard}>
                          <View style={styles.cardHeaderRow}>
                             <View style={[styles.subjectTag, { backgroundColor: sc.badge }]}>
                                <Text style={[styles.subjectTagText, { color: sc.badgeText }]}>{subjectLabel}</Text>
                             </View>
                             <Text style={styles.endTimeText}>ends {formatTime12(entry.end_time)}</Text>
                          </View>
                          
                          <Text style={styles.subjectTextFull}>{entry.subject}</Text>
                          
                          <View style={styles.metaRow}>
                             <View style={styles.metaItem}>
                                <Ionicons name="people-outline" size={16} color={SLATE_GREY} />
                                <Text style={styles.metaText}>{entry.class_name}</Text>
                             </View>
                             {entry.room ? (
                                <View style={styles.metaItem}>
                                   <Ionicons name="business-outline" size={16} color={SLATE_GREY} />
                                   <Text style={styles.metaText}>{entry.room}</Text>
                                </View>
                             ) : null}
                          </View>
                       </View>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}

        {/* ── Empty: No classes ── */}
        {!isHoliday && entries.length === 0 && occasions.length === 0 && (
          <View style={styles.emptyWrap}>
             <Ionicons name="cafe" size={80} color="#DBEAFE" />
             <Text style={styles.emptyTitle}>No Classes Scheduled</Text>
             <Text style={styles.emptySubTitle}>Enjoy your free day!</Text>
          </View>
        )}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     backgroundColor: BG_LIGHT 
  },
  center: {
     flex: 1, 
     alignItems: 'center', 
     justifyContent: 'center' 
  },
  
  // Floating Calendar
  calendarFloatWrap: {
     paddingHorizontal: 20,
     paddingTop: 16,
     paddingBottom: 8,
     zIndex: 10,
  },
  calendarCard: {
     backgroundColor: PURE_WHITE,
     borderRadius: 16,
     paddingTop: 16,
     paddingBottom: 20,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 6 },
     shadowOpacity: 0.04,
     shadowRadius: 10,
     elevation: 4,
  },
  weekNav: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     paddingHorizontal: 20,
     marginBottom: 20,
  },
  navHit: {
     padding: 4,
  },
  weekLabelText: {
     fontSize: 14,
     fontWeight: '700',
     color: BRAND_NAVY,
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  daysRow: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     paddingHorizontal: 12,
  },
  dayItem: {
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 12,
     paddingHorizontal: 8,
     borderRadius: 12,
     width: 46,
  },
  dayItemActive: {
     backgroundColor: BRAND_NAVY,
     shadowColor: BRAND_NAVY,
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.25,
     shadowRadius: 6,
     elevation: 4,
  },
  dayShortName: {
     fontSize: 10,
     fontWeight: '600',
     color: SLATE_GREY,
     marginBottom: 6,
     textTransform: 'uppercase',
  },
  dayShortNameActive: {
     color: '#93C5FD', // soft blue inner text
  },
  dayNumber: {
     fontSize: 16,
     fontWeight: '800',
     color: BRAND_NAVY,
  },
  dayNumberActive: {
     color: PURE_WHITE,
  },

  content: {
     paddingBottom: 40,
     paddingHorizontal: 20,
  },
  
  // Section Header
  sectionHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingTop: 16,
     paddingBottom: 20,
  },
  sectionTitle: {
     fontSize: 16,
     fontWeight: '800',
     color: BRAND_NAVY,
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  badgeWrap: {
     backgroundColor: '#E2E8F0',
     paddingHorizontal: 10,
     paddingVertical: 4,
     borderRadius: 12,
  },
  badgeTextCount: {
     fontSize: 11,
     fontWeight: '700',
     color: SLATE_GREY,
  },

  // List & Cards
  scheduleList: {
     marginTop: 4,
  },
  classRow: {
     flexDirection: 'row',
     marginBottom: 20,
  },
  timelineCol: {
     width: 65,
     paddingTop: 12,
     alignItems: 'flex-start',
  },
  classTimeText: {
     fontSize: 14,
     fontWeight: '800',
     color: BRAND_NAVY,
  },
  classDurationSide: {
     fontSize: 11,
     color: SLATE_GREY,
     fontWeight: '600',
     marginTop: 4,
  },
  cardContainer: {
     flex: 1,
     flexDirection: 'row',
     backgroundColor: PURE_WHITE,
     borderRadius: 16,
     overflow: 'hidden',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.03,
     shadowRadius: 8,
     elevation: 2,
  },
  cardAccent: {
     width: 4,
     height: '100%',
  },
  classCard: {
     flex: 1,
     padding: 16,
  },
  cardHeaderRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 10,
  },
  subjectTag: {
     paddingHorizontal: 8,
     paddingVertical: 4,
     borderRadius: 6,
  },
  subjectTagText: {
     fontSize: 10,
     fontWeight: '800',
     letterSpacing: 0.5,
  },
  endTimeText: {
     fontSize: 11,
     color: '#94A3B8',
     fontWeight: '500',
  },
  subjectTextFull: {
     fontSize: 18,
     fontWeight: '800',
     color: DARK_TEXT,
     marginBottom: 12,
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  metaRow: {
     flexDirection: 'row',
     gap: 16,
  },
  metaItem: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 6,
  },
  metaText: {
     fontSize: 13,
     color: SLATE_GREY,
     fontWeight: '500',
  },

  // Break Row
  breakRow: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 20,
     paddingLeft: 60,
  },
  breakDot: {
     width: 6,
     height: 6,
     borderRadius: 3,
     backgroundColor: '#CBD5E1',
     position: 'absolute',
     left: 20,
  },
  breakLineWrap: {
     flex: 1,
     height: 1,
     justifyContent: 'center',
  },
  breakLine: {
     height: 1,
     backgroundColor: '#E2E8F0',
  },
  breakPill: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 6,
     paddingHorizontal: 12,
     paddingVertical: 6,
     backgroundColor: '#F1F5F9',
     borderRadius: 16,
     marginHorizontal: 8,
  },
  breakLabel: {
     fontSize: 10,
     fontWeight: '800',
     color: '#94A3B8',
     letterSpacing: 0.5,
  },

  // Occasions / Events
  occasionBanner: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: 16,
     borderRadius: 16,
     marginBottom: 20,
  },
  occasionHoliday: {
     backgroundColor: '#FEF2F2',
  },
  occasionEvent: {
     backgroundColor: '#EFF6FF',
  },
  occasionIcon: {
     width: 44,
     height: 44,
     borderRadius: 22,
     alignItems: 'center',
     justifyContent: 'center',
     marginRight: 16,
  },
  occasionTextWrap: {
     flex: 1,
  },
  occasionTitle: {
     fontSize: 16,
     fontWeight: '800',
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  occasionSubtext: {
     fontSize: 13,
     color: SLATE_GREY,
     marginTop: 4,
     fontWeight: '500',
  },

  // Empty State
  emptyWrap: {
     alignItems: 'center',
     paddingTop: 60,
  },
  emptyTitle: {
     fontSize: 20,
     fontWeight: '800',
     color: BRAND_NAVY,
     marginTop: 20,
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  emptySubTitle: {
     fontSize: 15,
     color: SLATE_GREY,
     marginTop: 8,
     fontWeight: '500',
  }
});
