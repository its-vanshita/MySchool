import { useState, useEffect } from 'react';
import type { CalendarEventType, CalendarEvent } from '../types';

export type AdminCalendarTarget = 'teacher' | 'student' | 'both';

export interface AdminCalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string;
  end_date: string;
  description: string;
  target_audience: AdminCalendarTarget;
  time?: string;
  venue?: string;
}

let adminEvents: AdminCalendarEvent[] = [];
let listeners: Array<() => void> = [];

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function addAdminCalendarEvent(event: Omit<AdminCalendarEvent, 'id'>) {
  const newEvent: AdminCalendarEvent = {
    ...event,
    id: `admin-cal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
  adminEvents = [...adminEvents, newEvent];
  notifyListeners();
  return newEvent;
}

export function deleteAdminCalendarEvent(id: string) {
  adminEvents = adminEvents.filter((e) => e.id !== id);
  notifyListeners();
}

export function useAdminCalendarSetup() {
  const [events, setEvents] = useState<AdminCalendarEvent[]>(adminEvents);

  useEffect(() => {
    const update = () => setEvents([...adminEvents]);
    listeners.push(update);
    update();
    return () => {
      listeners = listeners.filter((fn) => fn !== update);
    };
  }, []);

  return {
    events,
    addEvent: addAdminCalendarEvent,
    deleteEvent: deleteAdminCalendarEvent,
  };
}

export function useAdminTeacherCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const update = () => {
      const teacherEvents = adminEvents
        .filter((e) => e.target_audience === 'teacher' || e.target_audience === 'both')
        .map((e) => ({
          id: e.id,
          title: e.title,
          type: e.type,
          date: e.date,
          end_date: e.end_date,
          description: e.description,
          school_id: 'demo-school',
          created_at: new Date().toISOString()
        }));
      setEvents(teacherEvents);
    };
    update();
    listeners.push(update);
    return () => {
      listeners = listeners.filter((fn) => fn !== update);
    };
  }, []);

  return events;
}

export function useAdminStudentCalendarEvents() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const update = () => {
      const studentEvents = adminEvents
        .filter((e) => e.target_audience === 'student' || e.target_audience === 'both')
        .map((e) => ({
          id: e.id,
          title: e.title,
          type: e.type === 'meeting' ? 'event' : e.type,
          date: e.date,
          endDate: e.end_date,
          description: e.description,
          time: e.time,
          venue: e.venue,
        }));
      setEvents(studentEvents);
    };
    update();
    listeners.push(update);
    return () => {
      listeners = listeners.filter((fn) => fn !== update);
    };
  }, []);

  return events;
}
