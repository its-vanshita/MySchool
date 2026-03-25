import { useState, useEffect } from 'react';
import { subscribeCalendarEvents, createCalendarEvent } from '../services/supabaseService';
import type { CalendarEvent } from '../types';

export function useCalendar(schoolId: string | undefined) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeCalendarEvents((data) => {
      setEvents(data);
      setLoading(false);
    });
    return unsub;
  }, [schoolId]);

  const addEvent = async (event: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    return createCalendarEvent(event);
  };

  return { events, loading, addEvent };
}
