import { useState, useEffect, useCallback } from 'react';
import type { TimetableEntry, DayOfWeek } from '../types';

// ─── Shared in-memory timetable store (demo mode) ───
// This module-level store is shared across all components in the session.
// Admin changes here are instantly visible in teacher & parent dashboards.

// Teacher timetable entries created/modified by admin
let adminTeacherEntries: TimetableEntry[] = [];

// Student/class timetable entries created/modified by admin
export interface StudentTimetableEntry {
  id: string;
  class_name: string;
  subject: string;
  teacher_name: string;
  room: string;
  start_time: string;
  end_time: string;
  day: DayOfWeek;
  school_id: string;
  is_supplementary?: boolean;
  note?: string;
}

let adminStudentEntries: StudentTimetableEntry[] = [];

// Listeners
let teacherListeners: Array<() => void> = [];
let studentListeners: Array<() => void> = [];

function notifyTeacherListeners() {
  teacherListeners.forEach((fn) => fn());
}

function notifyStudentListeners() {
  studentListeners.forEach((fn) => fn());
}

// ─── Admin functions ───

export function addTeacherTimetableEntry(entry: Omit<TimetableEntry, 'id'>): TimetableEntry {
  const newEntry: TimetableEntry = {
    ...entry,
    id: `admin-tt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
  adminTeacherEntries = [...adminTeacherEntries, newEntry];
  notifyTeacherListeners();
  return newEntry;
}

export function updateTeacherTimetableEntry(id: string, updates: Partial<TimetableEntry>) {
  adminTeacherEntries = adminTeacherEntries.map((e) =>
    e.id === id ? { ...e, ...updates } : e
  );
  notifyTeacherListeners();
}

export function deleteTeacherTimetableEntry(id: string) {
  adminTeacherEntries = adminTeacherEntries.filter((e) => e.id !== id);
  notifyTeacherListeners();
}

export function addStudentTimetableEntry(entry: Omit<StudentTimetableEntry, 'id'>): StudentTimetableEntry {
  const newEntry: StudentTimetableEntry = {
    ...entry,
    id: `admin-st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
  adminStudentEntries = [...adminStudentEntries, newEntry];
  notifyStudentListeners();
  return newEntry;
}

export function updateStudentTimetableEntry(id: string, updates: Partial<StudentTimetableEntry>) {
  adminStudentEntries = adminStudentEntries.map((e) =>
    e.id === id ? { ...e, ...updates } : e
  );
  notifyStudentListeners();
}

export function deleteStudentTimetableEntry(id: string) {
  adminStudentEntries = adminStudentEntries.filter((e) => e.id !== id);
  notifyStudentListeners();
}

// ─── Hooks ───

/** Hook for admin to manage all teacher timetable entries */
export function useAdminTeacherTimetable() {
  const [entries, setEntries] = useState<TimetableEntry[]>(adminTeacherEntries);

  useEffect(() => {
    const update = () => setEntries([...adminTeacherEntries]);
    teacherListeners.push(update);
    update();
    return () => {
      teacherListeners = teacherListeners.filter((fn) => fn !== update);
    };
  }, []);

  return {
    entries,
    addEntry: addTeacherTimetableEntry,
    updateEntry: updateTeacherTimetableEntry,
    deleteEntry: deleteTeacherTimetableEntry,
  };
}

/** Hook for admin to manage all student/class timetable entries */
export function useAdminStudentTimetable() {
  const [entries, setEntries] = useState<StudentTimetableEntry[]>(adminStudentEntries);

  useEffect(() => {
    const update = () => setEntries([...adminStudentEntries]);
    studentListeners.push(update);
    update();
    return () => {
      studentListeners = studentListeners.filter((fn) => fn !== update);
    };
  }, []);

  return {
    entries,
    addEntry: addStudentTimetableEntry,
    updateEntry: updateStudentTimetableEntry,
    deleteEntry: deleteStudentTimetableEntry,
  };
}

/** Hook for teacher dashboard to read admin-created entries merged with existing ones */
export function useAdminTeacherEntries(teacherId: string | undefined) {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    if (!teacherId) return;
    const update = () => {
      const forTeacher = adminTeacherEntries.filter(
        (e) => e.teacher_id === teacherId || e.teacher_id === 'all-teachers'
      );
      setEntries(forTeacher);
    };
    update();
    teacherListeners.push(update);
    return () => {
      teacherListeners = teacherListeners.filter((fn) => fn !== update);
    };
  }, [teacherId]);

  return entries;
}

/** Hook for parent/student dashboard to read admin-created class entries */
export function useAdminStudentEntries(className: string | undefined) {
  const [entries, setEntries] = useState<StudentTimetableEntry[]>([]);

  useEffect(() => {
    if (!className) return;
    const update = () => {
      const forClass = adminStudentEntries.filter(
        (e) => e.class_name === className || e.class_name === 'All Classes'
      );
      setEntries(forClass);
    };
    update();
    studentListeners.push(update);
    return () => {
      studentListeners = studentListeners.filter((fn) => fn !== update);
    };
  }, [className]);

  return entries;
}
