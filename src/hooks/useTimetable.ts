import { useState, useEffect } from 'react';
import { subscribeTimetable, getTimetableForDay } from '../services/supabaseService';
import type { TimetableEntry, ScheduleItem, ScheduleStatus, DayOfWeek } from '../types';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function getDayName(): DayOfWeek {
  const idx = new Date().getDay(); // 0=Sun
  return idx === 0 ? 'monday' : DAYS[idx - 1];
}

function getScheduleStatus(entry: TimetableEntry): ScheduleStatus {
  const now = new Date();
  const [sh, sm] = entry.start_time.split(':').map(Number);
  const [eh, em] = entry.end_time.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const nowMin = now.getHours() * 60 + now.getMinutes();

  if (nowMin < startMin) return 'upcoming';
  if (nowMin >= startMin && nowMin <= endMin) return 'ongoing';
  return 'completed';
}

export function useTimetable(teacherId: string | undefined) {
  const [allEntries, setAllEntries] = useState<TimetableEntry[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teacherId) return;

    const unsub = subscribeTimetable(teacherId, (entries) => {
      setAllEntries(entries);
      setLoading(false);
    });

    return unsub;
  }, [teacherId]);

  useEffect(() => {
    const today = getDayName();
    const todayEntries = allEntries
      .filter((e) => e.day === today)
      .map((e) => ({ ...e, status: getScheduleStatus(e) }));
    setTodaySchedule(todayEntries);
  }, [allEntries]);

  const getEntriesForDay = (day: DayOfWeek): TimetableEntry[] =>
    allEntries.filter((e) => e.day === day);

  return { allEntries, todaySchedule, loading, getEntriesForDay, DAYS };
}
