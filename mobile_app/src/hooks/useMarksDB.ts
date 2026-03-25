import { useState, useEffect } from 'react';
import {
  getMarksByStudent,
  getMarksByExam,
  upsertMarks,
  deleteMarks,
  subscribeMarks,
} from '../services/supabaseService';
import type { StudentMark } from '../types';

/** Hook for student marks with realtime updates */
export function useStudentMarks(studentId: string) {
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    const unsubscribe = subscribeMarks(studentId, (items) => {
      setMarks(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [studentId]);

  const save = async (entries: Omit<StudentMark, 'id' | 'created_at'>[]) => {
    await upsertMarks(entries);
  };

  const remove = async (id: string) => {
    await deleteMarks(id);
  };

  return { marks, loading, save, remove };
}

/** Hook for fetching marks by exam */
export function useExamMarks(examId: string) {
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;
    setLoading(true);
    getMarksByExam(examId).then((data) => {
      setMarks(data);
      setLoading(false);
    });
  }, [examId]);

  return { marks, loading };
}
