import { useState, useEffect, useCallback } from 'react';
import {
  getAttendanceForDate,
  markAttendance as markAttendanceService,
  getStudentsByClass,
} from '../services/supabaseService';
import type { AttendanceRecord, AttendanceStatus, StudentInfo } from '../types';

export function useAttendance(classId: string | undefined) {
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchStudents = useCallback(async () => {
    if (!classId) return;
    const data = await getStudentsByClass(classId);
    setStudents(data);
  }, [classId]);

  const fetchAttendance = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    const data = await getAttendanceForDate(classId, date);
    setRecords(data);
    setLoading(false);
  }, [classId, date]);

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, [fetchStudents, fetchAttendance]);

  const submitAttendance = async (
    entries: { student_id: string; status: AttendanceStatus }[],
    markedBy: string
  ) => {
    if (!classId) return;
    setSaving(true);
    try {
      const records = entries.map((e) => ({
        class_id: classId,
        student_id: e.student_id,
        date,
        status: e.status,
        marked_by: markedBy,
      }));
      await markAttendanceService(records);
      await fetchAttendance();
    } finally {
      setSaving(false);
    }
  };

  return { students, records, date, setDate, loading, saving, submitAttendance, refresh: fetchAttendance };
}
