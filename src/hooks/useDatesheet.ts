import { useState, useEffect } from 'react';
import { getExams, createExam } from '../services/supabaseService';
import type { ExamEntry } from '../types';

export function useDatesheet(schoolId: string | undefined) {
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await getExams(schoolId ?? '');
    setExams(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [schoolId]);

  const addExam = async (exam: Omit<ExamEntry, 'id'>) => {
    const result = await createExam(exam);
    await fetch();
    return result;
  };

  return { exams, loading, addExam, refresh: fetch };
}
