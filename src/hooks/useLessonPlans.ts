import { useState, useEffect, useCallback } from 'react';
import { getLessonPlans, createLessonPlan, deleteLessonPlan } from '../services/supabaseService';
import type { LessonPlan } from '../types';

export function useLessonPlans(teacherId: string | undefined) {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    const data = await getLessonPlans(teacherId);
    setPlans(data);
    setLoading(false);
  }, [teacherId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addPlan = async (plan: Omit<LessonPlan, 'id' | 'uploaded_at'>) => {
    const result = await createLessonPlan(plan);
    await fetch();
    return result;
  };

  const removePlan = async (id: string) => {
    await deleteLessonPlan(id);
    await fetch();
  };

  return { plans, loading, addPlan, removePlan, refresh: fetch };
}
